import React, { useEffect, useRef, useState } from "react";
import { HumanAnimator } from "./HumanAnimator";
import { Draggable } from "./Draggable";

import {
  standCasual,

  walkStride1,
  walkStride2,
  walkStride3,
  walkStride4,
  walkStride5,
  walkStride6,

  runStride1,
  runStride2,
  runStride3,
  runStride4,
  runStride5,
  runStride6,

  // stand jump poses
  standJumpPrime,
  standJumpFly,
  standJumpLand,

  // run jump poses
  jumpPrime,
  jumpFly,
  jumpPeak,
  jumpFall,
  jumpLand,
} from "./poses";

export const Character = ({ darkMode }) => {
  /* ---------------- Pose state ---------------- */
  const [pose, setPose] = useState(standCasual);
  const [duration, setDuration] = useState(140);
  const [facing, setFacing] = useState("left");

  /* ---------------- DOM refs ---------------- */
  const wrapperRef = useRef(null);

  /* ---------------- Kinematics refs ---------------- */
  const xRef = useRef(0);      // px
  const yRef = useRef(0);      // px (0 = ground, negative = up)
  const vyRef = useRef(0);     // px/ms (negative = up)

  /* ---------------- Loop refs ---------------- */
  const lastTsRef = useRef(0);
  const rafRef = useRef(null);
  const animatingRef = useRef(false);

  /* ---------------- Input refs ---------------- */
  const directionRef = useRef(null); // "left" | "right" | null
  const runningRef = useRef(false);

  /* ---------------- Stride refs ---------------- */
  const strideIndexRef = useRef(0);
  const strideTimerRef = useRef(0);

  /* ---------------- Strides ---------------- */
  const walkStrides = [walkStride1, walkStride2, walkStride3, walkStride4, walkStride5, walkStride6];
  const runStrides = [runStride1, runStride2, runStride3, runStride4, runStride5, runStride6];

  /* ---------------- Movement tuning ---------------- */
  const WALK_FRAME = 150;
  const RUN_FRAME = 100;

  const WALK_VELOCITY = 0.20; // px/ms (ground)
  const RUN_VELOCITY = 0.40;  // px/ms (ground)

  // In-air: reduce horizontal control by 50%
  const AIR_CONTROL_MULT = 0.50;

  // Extra in-air boost so walk/run jumps travel farther than ground running/walking
  const WALK_JUMP_BOOST = 0.12; // px/ms (air only)
  const RUN_JUMP_BOOST = 0.22;  // px/ms (air only)

  // Stand jump: allow slight horizontal control (requested)
  const STAND_AIR_CONTROL_MULT = 0.50; // 50% of walk ground speed while in-air
  const STAND_AIR_CONTROL_CAP = 0.10;  // px/ms hard cap, prevents "too much" on fast configs

  const VIEW_W = 10;
  const VIEW_H = 10;

  /* ---------------- Jump physics tuning ---------------- */
  const GRAVITY = 0.002;       // px/ms^2
  const JUMP_VY_TAP = -0.60;   // px/ms
  const JUMP_VY_HOLD = -0.80;  // px/ms
  const RUN_JUMP_VY_MULT = 1.05;

  const TAP_THRESHOLD = 160;   // ms < this = tap
  const PRIME_MS = 100;
  const PRIME_CROUCH_PX = 8;

  const PRELAND_LEAD_MS = 90;

  /* ---------------- Jump state ---------------- */
  // jumpState: "none" | "prime" | "air" | "preland" | "land"
  const jumpStateRef = useRef("none");
  const jumpTimerRef = useRef(0);

  const wHeldRef = useRef(false);
  const jumpHoldStartRef = useRef(0);

  // jumpMode: "stand" | "walk" | "run"
  const jumpModeRef = useRef("stand");
  const jumpStartDirRef = useRef(null); // lock mode based on dir at jump start

  /* ---------------- Helpers ---------------- */
  const setPoseNow = (nextPose, nextDuration) => {
    setPose(nextPose);
    setDuration(nextDuration);
  };

  const applyTransform = (x, y, primeCrouch) => {
    if (!wrapperRef.current) return;
    const displayY = y + (primeCrouch ? PRIME_CROUCH_PX : 0);
    wrapperRef.current.style.transform =
      `translate3d(-50%, -50%, 0) translate(${x}px, ${displayY}px)`;
  };

  const ensureLoop = () => {
    if (animatingRef.current) return;
    animatingRef.current = true;
    lastTsRef.current = 0;
    rafRef.current = requestAnimationFrame(loop);
  };

  const stopLoopIfIdle = () => {
    const hasDir = !!directionRef.current;
    const jumping = jumpStateRef.current !== "none";

    if (!hasDir && !jumping) {
      animatingRef.current = false;
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      strideIndexRef.current = 0;
      strideTimerRef.current = 0;
      setDuration(120);
      setPoseNow(standCasual, 120);
    }
  };

  // Solve: y + vy*t + 0.5*g*t^2 = 0 for t>0
  const timeToGroundMs = (y, vy, g) => {
    if (y >= 0) return 0;
    if (g <= 0) return null;
    const disc = vy * vy - 2 * g * y;
    if (disc < 0) return null;
    const t = (-vy + Math.sqrt(disc)) / g;
    if (!Number.isFinite(t) || t < 0) return null;
    return t;
  };

  /* ---------------- Movement control ---------------- */
  const beginMovement = () => {
    const running = runningRef.current;
    const strides = running ? runStrides : walkStrides;
    const frame = running ? RUN_FRAME : WALK_FRAME;

    strideIndexRef.current = 1;
    strideTimerRef.current = 0;

    if (jumpStateRef.current === "none") {
      setPoseNow(strides[0], frame);
    }

    ensureLoop();
  };

  /* ---------------- Jump pose selection ---------------- */
  const setJumpPoseForState = (state, dtForTiming = 0) => {
    const mode = jumpModeRef.current;

    // Stand jump: keep your stand jump poses
    if (mode === "stand") {
      if (state === "prime") setPoseNow(standJumpPrime, PRIME_MS);
      else if (state === "air") setPoseNow(standJumpFly, 220);
      else if (state === "preland" || state === "land") setPoseNow(standJumpLand, PRIME_MS);
      return;
    }

    // Walk jump animations: jumpFly -> standJumpFly -> standJumpLand
    if (mode === "walk") {
      if (state === "prime") {
        setPoseNow(jumpFly, 140);
        return;
      }
      if (state === "air") {
        jumpTimerRef.current += dtForTiming;
        if (jumpTimerRef.current <= 120) setPoseNow(jumpFly, 120);
        else setPoseNow(standJumpFly, 200);
        return;
      }
      if (state === "preland" || state === "land") {
        setPoseNow(standJumpLand, PRIME_MS);
        return;
      }
    }

    // Run jump animations: jumpPrime, jumpFly, jumpPeak, jumpFall, jumpLand
    if (mode === "run") {
      if (state === "prime") {
        setPoseNow(jumpPrime, PRIME_MS);
        return;
      }
      if (state === "air") {
        const vy = vyRef.current;
        if (vy < -0.20) setPoseNow(jumpFly, 140);
        else if (vy < 0.10) setPoseNow(jumpPeak, 140);
        else setPoseNow(jumpFall, 140);
        return;
      }
      if (state === "preland" || state === "land") {
        setPoseNow(jumpLand, PRIME_MS);
        return;
      }
    }
  };

  /* ---------------- Jump control ---------------- */
  const startJump = () => {
    if (jumpStateRef.current !== "none") return;

    // Lock jump mode based on state at jump start
    const dirAtStart = directionRef.current;
    const isRunning = runningRef.current && !!dirAtStart;

    jumpStartDirRef.current = dirAtStart;
    jumpModeRef.current = dirAtStart ? (isRunning ? "run" : "walk") : "stand";

    jumpStateRef.current = "prime";
    jumpTimerRef.current = 0;

    wHeldRef.current = true;
    jumpHoldStartRef.current = Date.now();

    const vy0 = JUMP_VY_HOLD * (isRunning ? RUN_JUMP_VY_MULT : 1);
    vyRef.current = vy0;
    yRef.current = 0;

    setJumpPoseForState("prime");
    ensureLoop();
  };

  const endJumpHold = () => {
    wHeldRef.current = false;

    if (jumpStateRef.current === "prime") {
      const holdMs = Date.now() - jumpHoldStartRef.current;
      if (holdMs < TAP_THRESHOLD) {
        const isRunning = jumpModeRef.current === "run";
        vyRef.current = JUMP_VY_TAP * (isRunning ? RUN_JUMP_VY_MULT : 1);
      }
    }
  };

  /* ---------------- rAF loop ---------------- */
  const loop = (ts) => {
    if (!lastTsRef.current) lastTsRef.current = ts;
    const rawDt = ts - lastTsRef.current;
    const dt = Math.min(50, rawDt);
    lastTsRef.current = ts;

    const dir = directionRef.current;
    const running = runningRef.current;

    const jumpState = jumpStateRef.current;
    const inAir = jumpState === "air" || jumpState === "preland";
    const primeOrLand = jumpState === "prime" || jumpState === "land";

    /* ---------------- Horizontal movement ---------------- */
    if (dir) {
      const baseGroundVel = running ? RUN_VELOCITY : WALK_VELOCITY;

      if (inAir) {
        const mode = jumpModeRef.current;

        if (mode === "stand") {
          // NEW: slight horizontal control during stand jump
          // Uses a small fraction of walk speed, capped to stay subtle.
          const standAirVel = Math.min(
            WALK_VELOCITY * STAND_AIR_CONTROL_MULT,
            STAND_AIR_CONTROL_CAP
          );
          xRef.current += (dir === "right" ? 1 : -1) * standAirVel * dt;
        } else {
          const airControlVel = baseGroundVel * AIR_CONTROL_MULT;
          const boost = mode === "run" ? RUN_JUMP_BOOST : WALK_JUMP_BOOST;
          const totalAirVel = airControlVel + boost;

          xRef.current += (dir === "right" ? 1 : -1) * totalAirVel * dt;
        }
      } else if (jumpState === "none" || primeOrLand) {
        xRef.current += (dir === "right" ? 1 : -1) * baseGroundVel * dt;
      }
    }

    /* ---------------- Jump state machine ---------------- */
    if (jumpState === "prime") {
      jumpTimerRef.current += dt;
      if (jumpTimerRef.current >= PRIME_MS) {
        jumpStateRef.current = "air";
        jumpTimerRef.current = 0;
        setJumpPoseForState("air", 0);
      }
    } else if (jumpState === "air" || jumpState === "preland") {
      vyRef.current += GRAVITY * dt;
      yRef.current += vyRef.current * dt;

      if (jumpStateRef.current === "air") {
        setJumpPoseForState("air", dt);
      }

      if (jumpStateRef.current === "air" && vyRef.current > 0 && yRef.current < 0) {
        const tImpact = timeToGroundMs(yRef.current, vyRef.current, GRAVITY);
        if (tImpact !== null && tImpact <= PRELAND_LEAD_MS) {
          jumpStateRef.current = "preland";
          setJumpPoseForState("preland");
        }
      }

      if (vyRef.current > 0 && yRef.current >= 0) {
        yRef.current = 0;
        vyRef.current = 0;

        jumpStateRef.current = "land";
        jumpTimerRef.current = 0;

        setJumpPoseForState("land");
      }
    } else if (jumpState === "land") {
      jumpTimerRef.current += dt;
      if (jumpTimerRef.current >= PRIME_MS) {
        jumpStateRef.current = "none";
        jumpTimerRef.current = 0;
        jumpModeRef.current = "stand";
        jumpStartDirRef.current = null;

        if (directionRef.current) {
          beginMovement();
        } else {
          setPoseNow(standCasual, 120);
        }
      }
    } else {
      /* ---------------- Stride animation (only when not jumping) ---------------- */
      if (dir) {
        strideTimerRef.current += dt;

        const frame = running ? RUN_FRAME : WALK_FRAME;
        const strides = running ? runStrides : walkStrides;

        if (strideTimerRef.current >= frame) {
          strideTimerRef.current -= frame;
          const i = strideIndexRef.current % strides.length;
          strideIndexRef.current = i + 1;
          setPoseNow(strides[i], frame);
        }
      } else {
        strideTimerRef.current = 0;
        strideIndexRef.current = 0;
      }
    }

    const primeCrouch =
      jumpStateRef.current === "prime" ||
      jumpStateRef.current === "preland" ||
      jumpStateRef.current === "land";

    applyTransform(xRef.current, yRef.current, primeCrouch);

    if (animatingRef.current && (directionRef.current || jumpStateRef.current !== "none")) {
      rafRef.current = requestAnimationFrame(loop);
    } else {
      stopLoopIfIdle();
    }
  };

  /* ---------------- Keyboard input ---------------- */
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.repeat) return;

      let dir = null;
      if (e.key === "a" || e.key === "A") dir = "left";
      if (e.key === "d" || e.key === "D") dir = "right";

      if (dir) {
        directionRef.current = dir;
        runningRef.current = e.shiftKey;
        setFacing(dir);
        beginMovement();
      }

      if (e.key === "Shift" && directionRef.current) {
        runningRef.current = true;
        beginMovement();
      }

      if (e.key === "w" || e.key === "W") {
        startJump();
      }
    };

    const onKeyUp = (e) => {
      const key = e.key.toLowerCase();

      if (
        (key === "a" && directionRef.current === "left") ||
        (key === "d" && directionRef.current === "right")
      ) {
        directionRef.current = null;
        runningRef.current = false;
        stopLoopIfIdle();
      }

      if (key === "shift") {
        runningRef.current = false;
      }

      if (key === "w") {
        endJumpHold();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  /* ---------------- Init ---------------- */
  useEffect(() => {
    applyTransform(xRef.current, yRef.current, false);
  }, []);

  /* ---------------- Render ---------------- */
  return (
    <div style={{ position: "fixed", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
      {/* <Draggable> */}
        <div
          ref={wrapperRef}
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            willChange: "transform",
            pointerEvents: "auto",
          }}
        >
          <div
            style={{
              width: VIEW_W,
              height: VIEW_H,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transform: `scaleX(${facing === "left" ? 1 : -1})`,
              transformOrigin: "50% 50%",
            }}
          >
            <HumanAnimator
              targetPose={pose}
              duration={duration}
              debug={false}
              humanScale={0.5}
              darkMode={darkMode}
            />
          </div>
        </div>
      {/* </Draggable> */}
    </div>
  );
};
