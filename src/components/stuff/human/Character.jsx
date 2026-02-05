import React, { useEffect, useMemo, useRef, useState } from "react";
import { HumanAnimator } from "./HumanAnimator";

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

  // walk / run jump poses
  walkJumpFly,
  jumpPrime,
  jumpFly,
  jumpPeak,
  jumpFall,
  jumpLand,

  // grab struggle poses
  struggle1,
  struggle2,

  // crouch poses
  crouch,
  crouchWalk1,
  crouchWalk2
} from "./poses";

export const Character = ({ mobileMode, darkMode }) => {
  /* =========================================================================
     MANUAL GROUND CONFIG (EDIT HERE)
  ========================================================================= */
  const HUMAN_SCALE = mobileMode ? 0.6 : 1.0;

  // EDIT HERE
  const BASE_GROUND_PX_FROM_BOTTOM = 155; // px @ scale=1
  const groundPxFromBottom = BASE_GROUND_PX_FROM_BOTTOM * HUMAN_SCALE;

  /* =========================================================================
     SPEED / JUMP CONFIG (EDIT HERE)
  ========================================================================= */
  const WALK_FRAME = 150;
  const RUN_FRAME = 100;
  const CROUCH_FRAME_MS = 400;
  const CROUCH_PRIME_MS = 200;
  const PRIME_MS = 100;
  const TAP_THRESHOLD = 200;

  const BASE_WALK_VELOCITY = 0.40;
  const BASE_RUN_VELOCITY = 0.80;
  const BASE_CROUCH_VELOCITY = 0.10;

  const WALK_VELOCITY = BASE_WALK_VELOCITY * HUMAN_SCALE;
  const RUN_VELOCITY = BASE_RUN_VELOCITY * HUMAN_SCALE;
  const CROUCH_VELOCITY = BASE_CROUCH_VELOCITY * HUMAN_SCALE;

  const AIR_CONTROL_MULT = 0.50;
  const BASE_WALK_JUMP_BOOST = 0.24;
  const BASE_RUN_JUMP_BOOST = 0.44;

  const WALK_JUMP_BOOST = BASE_WALK_JUMP_BOOST * HUMAN_SCALE;
  const RUN_JUMP_BOOST = BASE_RUN_JUMP_BOOST * HUMAN_SCALE;

  const STAND_AIR_CONTROL_MULT = 0.50;
  const BASE_STAND_AIR_CONTROL_CAP = 0.10;
  const STAND_AIR_CONTROL_CAP = BASE_STAND_AIR_CONTROL_CAP * HUMAN_SCALE;

  const BASE_GRAVITY_UP = 0.0016;
  const BASE_GRAVITY_CUT = 0.0040;
  const BASE_GRAVITY_DOWN = 0.0052;

  const GRAVITY_UP = BASE_GRAVITY_UP * HUMAN_SCALE;
  const GRAVITY_CUT = BASE_GRAVITY_CUT * HUMAN_SCALE;
  const GRAVITY_DOWN = BASE_GRAVITY_DOWN * HUMAN_SCALE;

  const BASE_JUMP_VY_TAP = -0.70;
  const BASE_JUMP_VY_HOLD = -0.90;
  const RUN_JUMP_VY_MULT = 1.05;

  const JUMP_VY_TAP = BASE_JUMP_VY_TAP * HUMAN_SCALE;
  const JUMP_VY_HOLD = BASE_JUMP_VY_HOLD * HUMAN_SCALE;

  /* ---------------- Minimal React state ---------------- */
  const [pose, setPose] = useState(standCasual);
  const [duration, setDuration] = useState(140);
  const [facing, setFacing] = useState("left");
  const [isDraggingUi, setIsDraggingUi] = useState(false);

  /* ---------------- DOM refs ---------------- */
  const wrapperRef = useRef(null);

  /* ---------------- World coords ---------------- */
  const xRef = useRef(0);
  const yAirRef = useRef(0);
  const vyRef = useRef(0);

  /* ---------------- Ground caching ---------------- */
  const groundYRef = useRef(0);

  const recomputeGroundY = () => {
    groundYRef.current = window.innerHeight - groundPxFromBottom;
  };

  /* ---------------- Loop refs ---------------- */
  const lastTsRef = useRef(0);
  const rafRef = useRef(null);
  const animatingRef = useRef(false);

  /* ---------------- Input refs ---------------- */
  const directionRef = useRef(null);
  const runningRef = useRef(false);
  const shiftHeldRef = useRef(false);

  const sHeldRef = useRef(false);
  const crouchQueuedRef = useRef(false); // NEW: queue crouch while airborne
  const crouchingRef = useRef(false);
  const crouchMovingRef = useRef(false);
  const crouchPhaseRef = useRef(0);
  const crouchTimerRef = useRef(0);

  /* ---------------- Drag refs ---------------- */
  const draggingRef = useRef(false);
  const dragPtrIdRef = useRef(null);
  const dragOffsetRef = useRef({ dx: 0, dy: 0 });
  const dragAbsRef = useRef({ x: 0, y: 0 });

  /* ---------------- Struggle loop ---------------- */
  const strugglePhaseRef = useRef(0);
  const struggleTimerRef = useRef(0);
  const STRUGGLE_FRAME_MS = 200;

  /* ---------------- Stride refs ---------------- */
  const strideIndexRef = useRef(0);
  const strideTimerRef = useRef(0);

  /* ---------------- Jump state ---------------- */
  const jumpStateRef = useRef("none");
  const jumpTimerRef = useRef(0);

  const wHeldRef = useRef(false);
  const jumpHoldStartRef = useRef(0);

  const jumpModeRef = useRef("stand");

  /* ---------------- Strides ---------------- */
  const walkStrides = useMemo(
    () => [walkStride1, walkStride2, walkStride3, walkStride4, walkStride5, walkStride6],
    []
  );
  const runStrides = useMemo(
    () => [runStride1, runStride2, runStride3, runStride4, runStride5, runStride6],
    []
  );

  /* =========================================================================
     TRANSFORM: MANUAL GROUND (uses cached groundYRef)
  ========================================================================= */
  const applyTransformFromAir = (x, yAir) => {
    if (!wrapperRef.current) return;
    const vw = window.innerWidth;
    const tx = vw * 0.5 + x;
    const ty = groundYRef.current + yAir;
    wrapperRef.current.style.transform =
      `translate3d(-50%, 0, 0) translate3d(${tx}px, ${ty}px, 0)`;
  };

  const applyTransformFromAbs = (tx, ty) => {
    if (!wrapperRef.current) return;
    wrapperRef.current.style.transform =
      `translate3d(-50%, 0, 0) translate3d(${tx}px, ${ty}px, 0)`;
  };

  /* =========================================================================
     CLAMPS (simple)
  ========================================================================= */
  const SCREEN_PAD_X = 40 * HUMAN_SCALE;

  const clampXToWindow = (x) => {
    const vw = window.innerWidth;
    const minX = -vw * 0.5 + SCREEN_PAD_X;
    const maxX = vw * 0.5 - SCREEN_PAD_X;
    return Math.max(minX, Math.min(maxX, x));
  };

  const clampYAirToCeiling = (yAir) => {
    const vh = window.innerHeight;
    const minYAir = -vh + 50 * HUMAN_SCALE;
    return Math.max(minYAir, yAir);
  };

  const clampAbs = (tx, ty) => {
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    const minTx = SCREEN_PAD_X;
    const maxTx = vw - SCREEN_PAD_X;

    const minTy = 0;
    const maxTy = vh;

    return {
      tx: Math.max(minTx, Math.min(maxTx, tx)),
      ty: Math.max(minTy, Math.min(maxTy, ty))
    };
  };

  const setPoseNow = (nextPose, nextDuration) => {
    setPose(nextPose);
    setDuration(nextDuration);
  };

  const cancelJumpNow = () => {
    jumpStateRef.current = "none";
    jumpTimerRef.current = 0;
    jumpModeRef.current = "stand";
    wHeldRef.current = false;
    vyRef.current = 0;
    yAirRef.current = 0;
  };

  const isAirOrJumping = () => jumpStateRef.current !== "none" || yAirRef.current < 0;

  const syncRunState = () => {
    const canRun = !!directionRef.current && !crouchingRef.current && !draggingRef.current;
    runningRef.current = !!(shiftHeldRef.current && canRun);
  };

  const ensureLoop = () => {
    if (animatingRef.current) return;
    animatingRef.current = true;
    lastTsRef.current = 0;
    rafRef.current = requestAnimationFrame(loop);
  };

  const stopLoopIfIdle = () => {
    const hasDir = !!directionRef.current;
    const jumping = jumpStateRef.current !== "none" || yAirRef.current < 0;
    const dragging = draggingRef.current;
    const crouching = crouchingRef.current;

    if (!hasDir && !jumping && !dragging && !crouching) {
      animatingRef.current = false;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;

      strideIndexRef.current = 0;
      strideTimerRef.current = 0;

      setPose(standCasual);
      setDuration(120);
    }
  };

  const beginMovement = () => {
    if (crouchingRef.current || draggingRef.current) return;

    syncRunState();

    const running = runningRef.current;
    const strides = running ? runStrides : walkStrides;
    const frame = running ? RUN_FRAME : WALK_FRAME;

    strideIndexRef.current = 1;
    strideTimerRef.current = 0;

    if (jumpStateRef.current === "none") setPoseNow(strides[0], frame);
    ensureLoop();
  };

  const setJumpPoseForState = (state) => {
    const mode = jumpModeRef.current;

    if (mode === "stand") {
      if (state === "prime") setPoseNow(standJumpPrime, PRIME_MS);
      else if (state === "air") setPoseNow(standJumpFly, 200);
      else setPoseNow(standJumpLand, PRIME_MS);
      return;
    }

    if (mode === "walk") {
      if (state === "prime") setPoseNow(jumpPrime, 140);
      else if (state === "air") setPoseNow(walkJumpFly, 180);
      else setPoseNow(standJumpLand, PRIME_MS);
      return;
    }

    if (state === "prime") {
      setPoseNow(jumpPrime, PRIME_MS);
      return;
    }

    if (state === "air") {
      const vy = vyRef.current;
      if (vy < -0.20 * HUMAN_SCALE) setPoseNow(jumpFly, 140);
      else if (vy < 0.10 * HUMAN_SCALE) setPoseNow(jumpPeak, 140);
      else setPoseNow(jumpFall, 140);
      return;
    }

    setPoseNow(jumpLand, PRIME_MS);
  };

  const enterCrouch = () => {
    if (draggingRef.current) return;
    if (isAirOrJumping()) return;

    sHeldRef.current = true;
    crouchingRef.current = true;

    runningRef.current = false;
    cancelJumpNow();

    crouchMovingRef.current = !!directionRef.current;
    crouchPhaseRef.current = 0;
    crouchTimerRef.current = 0;

    if (crouchMovingRef.current) setPoseNow(crouchWalk1, CROUCH_FRAME_MS);
    else setPoseNow(crouch, CROUCH_PRIME_MS);

    ensureLoop();
  };

  const exitCrouch = () => {
    sHeldRef.current = false;
    crouchQueuedRef.current = false; // NEW: clear any queued crouch when exiting
    crouchingRef.current = false;
    crouchMovingRef.current = false;
    crouchTimerRef.current = 0;
    crouchPhaseRef.current = 0;

    syncRunState();

    if (directionRef.current) beginMovement();
    else {
      setPoseNow(standCasual, 120);
      stopLoopIfIdle();
    }
  };

  const updateCrouchModeFromDir = () => {
    if (!crouchingRef.current) return;

    const shouldMove = !!directionRef.current;
    if (shouldMove === crouchMovingRef.current) return;

    crouchMovingRef.current = shouldMove;
    crouchTimerRef.current = 0;
    crouchPhaseRef.current = 0;

    if (crouchMovingRef.current) setPoseNow(crouchWalk1, CROUCH_FRAME_MS);
    else setPoseNow(crouch, 200);

    ensureLoop();
  };

  const startJump = () => {
    if (crouchingRef.current) return;
    if (draggingRef.current) return;
    if (jumpStateRef.current !== "none") return;

    const dirAtStart = directionRef.current;
    syncRunState();
    const isRunning = runningRef.current && !!dirAtStart;

    jumpModeRef.current = dirAtStart ? (isRunning ? "run" : "walk") : "stand";
    jumpStateRef.current = "prime";
    jumpTimerRef.current = 0;

    wHeldRef.current = true;
    jumpHoldStartRef.current = performance.now();

    vyRef.current = JUMP_VY_HOLD * (isRunning ? RUN_JUMP_VY_MULT : 1);
    yAirRef.current = 0;

    setJumpPoseForState("prime");
    ensureLoop();
  };

  const endJumpHold = () => {
    wHeldRef.current = false;

    if (jumpStateRef.current === "prime") {
      const holdMs = performance.now() - jumpHoldStartRef.current;
      if (holdMs < TAP_THRESHOLD) {
        const isRunning = jumpModeRef.current === "run";
        vyRef.current = JUMP_VY_TAP * (isRunning ? RUN_JUMP_VY_MULT : 1);
      }
    }
  };

  const beginDrag = (e) => {
    if (!wrapperRef.current) return;

    draggingRef.current = true;
    setIsDraggingUi(true);
    dragPtrIdRef.current = e.pointerId;

    directionRef.current = null;
    runningRef.current = false;
    if (crouchingRef.current) exitCrouch();
    cancelJumpNow();

    const rect = wrapperRef.current.getBoundingClientRect();
    const cx = rect.left + rect.width * 0.5;
    const cy = rect.top + rect.height * 0.5;

    dragOffsetRef.current = {
      dx: e.clientX - cx,
      dy: e.clientY - cy
    };

    dragAbsRef.current = { x: cx, y: cy };

    strugglePhaseRef.current = 0;
    struggleTimerRef.current = 0;
    setPoseNow(struggle1, STRUGGLE_FRAME_MS);

    wrapperRef.current.setPointerCapture(e.pointerId);
    ensureLoop();
  };

  const updateDrag = (e) => {
    if (!draggingRef.current) return;
    if (dragPtrIdRef.current !== e.pointerId) return;

    const desiredCx = e.clientX - dragOffsetRef.current.dx;
    const desiredCy = e.clientY - dragOffsetRef.current.dy;

    const clamped = clampAbs(desiredCx, desiredCy);
    dragAbsRef.current.x = clamped.tx;
    dragAbsRef.current.y = clamped.ty;
  };

  const endDrag = (e) => {
    if (!draggingRef.current) return;
    if (dragPtrIdRef.current !== e.pointerId) return;

    draggingRef.current = false;
    setIsDraggingUi(false);
    dragPtrIdRef.current = null;

    const vw = window.innerWidth;

    const cx = dragAbsRef.current.x;
    const cy = dragAbsRef.current.y;

    xRef.current = clampXToWindow(cx - vw * 0.5);

    yAirRef.current = cy - groundYRef.current;
    if (yAirRef.current > 0) yAirRef.current = 0;

    if (yAirRef.current < 0) {
      jumpModeRef.current = "stand";
      jumpStateRef.current = "air";
      wHeldRef.current = false;
      vyRef.current = 0;
      setPoseNow(standJumpFly, 160);
      ensureLoop();
      return;
    }

    yAirRef.current = 0;
    vyRef.current = 0;
    jumpStateRef.current = "none";
    setPoseNow(standCasual, 120);
    stopLoopIfIdle();
  };

  const loop = (ts) => {
    if (!lastTsRef.current) lastTsRef.current = ts;
    const rawDt = ts - lastTsRef.current;
    const dt = Math.min(50, rawDt);
    lastTsRef.current = ts;

    syncRunState();

    if (draggingRef.current) {
      struggleTimerRef.current += dt;
      if (struggleTimerRef.current >= STRUGGLE_FRAME_MS) {
        struggleTimerRef.current -= STRUGGLE_FRAME_MS;
        strugglePhaseRef.current = 1 - strugglePhaseRef.current;
        setPoseNow(strugglePhaseRef.current === 0 ? struggle1 : struggle2, STRUGGLE_FRAME_MS);
      }

      applyTransformFromAbs(dragAbsRef.current.x, dragAbsRef.current.y);

      rafRef.current = requestAnimationFrame(loop);
      return;
    }

    if (crouchingRef.current) {
      runningRef.current = false;
      jumpStateRef.current = "none";
      vyRef.current = 0;

      const dir = directionRef.current;
      const shouldMove = !!dir;

      if (shouldMove !== crouchMovingRef.current) {
        crouchMovingRef.current = shouldMove;
        crouchTimerRef.current = 0;
        crouchPhaseRef.current = 0;
        if (crouchMovingRef.current) setPoseNow(crouchWalk1, CROUCH_FRAME_MS);
        else setPoseNow(crouch, 200);
      }

      if (crouchMovingRef.current && dir) {
        xRef.current += (dir === "right" ? 1 : -1) * CROUCH_VELOCITY * dt;
      }

      if (crouchMovingRef.current) {
        crouchTimerRef.current += dt;
        if (crouchTimerRef.current >= CROUCH_FRAME_MS) {
          crouchTimerRef.current -= CROUCH_FRAME_MS;
          crouchPhaseRef.current = 1 - crouchPhaseRef.current;
          setPoseNow(crouchPhaseRef.current === 0 ? crouchWalk1 : crouchWalk2, CROUCH_FRAME_MS);
        }
      }

      yAirRef.current = 0;
      xRef.current = clampXToWindow(xRef.current);
      applyTransformFromAir(xRef.current, yAirRef.current);

      rafRef.current = requestAnimationFrame(loop);
      return;
    }

    const dir = directionRef.current;
    const running = runningRef.current;

    const jumpState = jumpStateRef.current;
    const inAir = jumpState === "air";
    const primeOrLand = jumpState === "prime" || jumpState === "land";

    if (dir) {
      const baseGroundVel = running ? RUN_VELOCITY : WALK_VELOCITY;

      if (inAir) {
        const mode = jumpModeRef.current;

        if (mode === "stand") {
          const standAirVel = Math.min(
            WALK_VELOCITY * STAND_AIR_CONTROL_MULT,
            STAND_AIR_CONTROL_CAP
          );
          xRef.current += (dir === "right" ? 1 : -1) * standAirVel * dt;
        } else {
          const airControlVel = baseGroundVel * AIR_CONTROL_MULT;
          const boost = mode === "run" ? RUN_JUMP_BOOST : WALK_JUMP_BOOST;
          xRef.current += (dir === "right" ? 1 : -1) * (airControlVel + boost) * dt;
        }
      } else if (jumpState === "none" || primeOrLand) {
        xRef.current += (dir === "right" ? 1 : -1) * baseGroundVel * dt;
      }
    }

    if (jumpState === "prime") {
      jumpTimerRef.current += dt;
      if (jumpTimerRef.current >= PRIME_MS) {
        jumpStateRef.current = "air";
        jumpTimerRef.current = 0;
        setJumpPoseForState("air");
      }
    } else if (jumpState === "air") {
      const rising = vyRef.current < 0;
      const g = rising ? (wHeldRef.current ? GRAVITY_UP : GRAVITY_CUT) : GRAVITY_DOWN;

      vyRef.current += g * dt;
      yAirRef.current += vyRef.current * dt;

      const yCeil = clampYAirToCeiling(yAirRef.current);
      if (yCeil !== yAirRef.current) {
        yAirRef.current = yCeil;
        if (vyRef.current < 0) vyRef.current = 0;
      }

      setJumpPoseForState("air");

      if (vyRef.current > 0 && yAirRef.current >= 0) {
        // LANDING
        yAirRef.current = 0;
        vyRef.current = 0;
        jumpStateRef.current = "land";
        jumpTimerRef.current = 0;
        setJumpPoseForState("land");
      }
    } else if (jumpState === "land") {
      jumpTimerRef.current += dt;
      if (jumpTimerRef.current >= PRIME_MS) {
        // FINISH LANDING
        jumpStateRef.current = "none";
        jumpTimerRef.current = 0;
        jumpModeRef.current = "stand";

        syncRunState();

        // NEW: if S was pressed mid-air and still held, crouch immediately on landing
        if (crouchQueuedRef.current && sHeldRef.current && !draggingRef.current) {
          crouchQueuedRef.current = false;
          enterCrouch();
          rafRef.current = requestAnimationFrame(loop);
          return;
        }

        if (directionRef.current) beginMovement();
        else setPoseNow(standCasual, 120);
      }
    } else {
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

    xRef.current = clampXToWindow(xRef.current);

    const yCeil2 = clampYAirToCeiling(yAirRef.current);
    if (yCeil2 !== yAirRef.current) {
      yAirRef.current = yCeil2;
      if (vyRef.current < 0) vyRef.current = 0;
    }

    applyTransformFromAir(xRef.current, yAirRef.current);

    if (
      animatingRef.current &&
      (directionRef.current || jumpStateRef.current !== "none" || yAirRef.current < 0)
    ) {
      rafRef.current = requestAnimationFrame(loop);
    } else {
      stopLoopIfIdle();
    }
  };

  /* ---------------- Keyboard input ---------------- */
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.repeat) return;
      if (draggingRef.current) return;

      const k = e.key.toLowerCase();

      if (k === "s") {
        // NEW: queue crouch if pressed mid-air; crouch instantly if grounded
        if (isAirOrJumping()) {
          sHeldRef.current = true;
          crouchQueuedRef.current = true;
          ensureLoop();
          return;
        }

        if (!sHeldRef.current) enterCrouch();
        return;
      }

      let dir = null;
      if (k === "a") dir = "left";
      if (k === "d") dir = "right";

      if (dir) {
        directionRef.current = dir;
        setFacing(dir);

        if (crouchingRef.current) {
          runningRef.current = false;
          updateCrouchModeFromDir();
          ensureLoop();
          return;
        }

        syncRunState();
        beginMovement();
        return;
      }

      if (k === "shift") {
        shiftHeldRef.current = true;
        syncRunState();

        if (!crouchingRef.current && !isAirOrJumping() && directionRef.current) beginMovement();
        return;
      }

      if (k === "w") {
        if (crouchingRef.current) return;
        startJump();
      }
    };

    const onKeyUp = (e) => {
      const k = e.key.toLowerCase();

      if (k === "s") {
        // NEW: releasing S cancels queued crouch (and exits if already crouching)
        sHeldRef.current = false;
        crouchQueuedRef.current = false;
        if (crouchingRef.current) exitCrouch();
        return;
      }

      if (
        (k === "a" && directionRef.current === "left") ||
        (k === "d" && directionRef.current === "right")
      ) {
        directionRef.current = null;

        if (crouchingRef.current) {
          updateCrouchModeFromDir();
          ensureLoop();
          return;
        }

        syncRunState();
        stopLoopIfIdle();
        return;
      }

      if (k === "shift") {
        shiftHeldRef.current = false;
        syncRunState();

        if (!crouchingRef.current && !isAirOrJumping() && directionRef.current) beginMovement();
        return;
      }

      if (k === "w") endJumpHold();
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ---------------- Init + resize ---------------- */
  useEffect(() => {
    xRef.current = 0;
    yAirRef.current = 0;

    recomputeGroundY();
    applyTransformFromAir(xRef.current, yAirRef.current);

    const onResize = () => {
      if (draggingRef.current) return;

      recomputeGroundY();

      xRef.current = clampXToWindow(xRef.current);
      yAirRef.current = clampYAirToCeiling(yAirRef.current);
      applyTransformFromAir(xRef.current, yAirRef.current);
    };

    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ---------------- Recalc ground ONCE when mobileMode/scale changes ---------------- */
  useEffect(() => {
    if (draggingRef.current) return;

    recomputeGroundY();

    xRef.current = clampXToWindow(xRef.current);
    yAirRef.current = clampYAirToCeiling(yAirRef.current);
    applyTransformFromAir(xRef.current, yAirRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mobileMode, HUMAN_SCALE]);

  /* ---------------- Re-render HumanAnimator on mode/theme changes ---------------- */
  const animatorKey = `${mobileMode ? "m" : "d"}-${darkMode ? "dark" : "light"}-${HUMAN_SCALE}`;

  /* ---------------- Render ---------------- */
  return (
    <div style={{ position: "fixed", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
      <div
        ref={wrapperRef}
        onPointerDown={(e) => {
          if (e.button != null && e.button !== 0) return;
          e.preventDefault();
          beginDrag(e);
        }}
        onPointerMove={(e) => {
          if (!draggingRef.current) return;
          e.preventDefault();
          updateDrag(e);
        }}
        onPointerUp={(e) => {
          e.preventDefault();
          endDrag(e);
        }}
        onPointerCancel={(e) => {
          e.preventDefault();
          endDrag(e);
        }}
        style={{
          position: "absolute",
          top: 0,
          willChange: "transform",
          pointerEvents: "auto",
          touchAction: "none",
          userSelect: "none",
          cursor: isDraggingUi ? "grabbing" : "grab"
        }}
      >
        <div
          style={{
            width: 10,
            height: 10,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transform: `scaleX(${facing === "left" ? 1 : -1})`,
            transformOrigin: "50% 50%"
          }}
        >
          <HumanAnimator
            key={animatorKey}
            targetPose={pose}
            duration={duration}
            debug={false}
            humanScale={HUMAN_SCALE}
            darkMode={darkMode}
          />
        </div>
      </div>
    </div>
  );
};
