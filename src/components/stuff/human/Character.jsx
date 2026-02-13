// Character.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { HumanAnimator } from "./HumanAnimator";
import { Joystick } from "./Joystick";

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
  crouchWalk2,

  // emotes
  emoteCry1,
  emoteCry2,
  emoteCry3
} from "./poses";

/**
 * Character:
 * - Root overlay does NOT block the site (pointerEvents:none)
 * - Character itself is draggable (pointerEvents:auto)
 * - Joystick is mounted inside Character (Scene unchanged)
 * - Safe to toggle janzenExists on/off/on (hard reset + hard cleanup)
 * - Auto-jump-repeat: hold W or hold joystick up -> continuous jumping (bunnyhop)
 * - NEW: Ground-only Emote (press "2") loops until any new input interrupts
 *
 * Keyboard:
 * - A/D = move, Shift = sprint, W = jump (hold), S = crouch (queues in air)
 * - 2   = cry emote (ground only, loops until interrupted)
 *
 * Joystick mapping (8-dir):
 * - Left/Right            => walk
 * - Very left/right       => sprint
 * - Top                   => jump only (repeat while held)
 * - Top-left/right        => jump + move (sprint if "very")
 * - Bottom                => crouch only
 * - Bottom-left/right     => crouch-walk
 */
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

  /* =========================================================================
     JOYSTICK THRESHOLDS (EDIT HERE)
  ========================================================================= */
  const JOY_ACTIVE_MAG = 0.18; // below => ignore joystick
  const JOY_SPRINT_MAG = 0.86; // "very" threshold

  /* =========================================================================
     MINIMAL REACT STATE
  ========================================================================= */
  const [pose, setPose] = useState(standCasual);
  const [duration, setDuration] = useState(140);
  const [facing, setFacing] = useState("left");
  const [isDraggingUi, setIsDraggingUi] = useState(false);

  /* ---------------- Joystick position state ---------------- */
  const [joyPos, setJoyPos] = useState(() => {
    if (!mobileMode) return { x: 24, y: 24 };
    const y = Math.max(24, window.innerHeight - 200);
    return { x: 24, y };
  });

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

  /* ---------------- Keyboard raw refs ---------------- */
  const kbDirRef = useRef(null); // "left" | "right" | null
  const kbShiftRef = useRef(false);
  const kbCrouchRef = useRef(false);
  const kbJumpRef = useRef(false);

  /* ---------------- Joystick raw refs ---------------- */
  const joyDir8Ref = useRef("center"); // "e","w","n","s","ne","nw","se","sw","center"
  const joyMagRef = useRef(0);

  /* ---------------- Effective input (used by sim) ---------------- */
  const directionRef = useRef(null); // "left" | "right" | null
  const shiftHeldRef = useRef(false);
  const runningRef = useRef(false);

  const sHeldRef = useRef(false);
  const crouchQueuedRef = useRef(false);
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
  const jumpStateRef = useRef("none"); // "none" | "prime" | "air" | "land"
  const jumpTimerRef = useRef(0);

  const wHeldRef = useRef(false); // actual "in-jump hold" flag used for gravity cut
  const jumpHoldStartRef = useRef(0);
  const jumpModeRef = useRef("stand"); // "stand" | "walk" | "run"

  // desired jump-hold intent (keyboard W held OR joystick held up)
  const wantJumpHoldRef = useRef(false);

  /* ---------------- Emote state ---------------- */
  const emoteActiveRef = useRef(false);
  const emoteAbortRef = useRef({ aborted: false });
  const emoteRafRef = useRef(null);

  /* =========================================================================
     STRIDES
  ========================================================================= */
  const walkStrides = useMemo(
    () => [walkStride1, walkStride2, walkStride3, walkStride4, walkStride5, walkStride6],
    []
  );
  const runStrides = useMemo(
    () => [runStride1, runStride2, runStride3, runStride4, runStride5, runStride6],
    []
  );

  /* =========================================================================
     TRANSFORM
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
     CLAMPS
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

  const isAirOrJumping = () => jumpStateRef.current !== "none" || yAirRef.current < 0;
  const isOnGround = () =>
    !isAirOrJumping() && !crouchingRef.current && !draggingRef.current;

  /* =========================================================================
     HARD RESET / CLEANUP (fixes janzenExists toggle glitch)
  ========================================================================= */
  const hardReset = () => {
    // loop
    animatingRef.current = false;
    lastTsRef.current = 0;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;

    // motion
    xRef.current = 0;
    yAirRef.current = 0;
    vyRef.current = 0;

    // inputs
    directionRef.current = null;
    shiftHeldRef.current = false;
    runningRef.current = false;

    kbDirRef.current = null;
    kbShiftRef.current = false;
    kbCrouchRef.current = false;
    kbJumpRef.current = false;

    joyDir8Ref.current = "center";
    joyMagRef.current = 0;

    // crouch
    sHeldRef.current = false;
    crouchQueuedRef.current = false;
    crouchingRef.current = false;
    crouchMovingRef.current = false;
    crouchPhaseRef.current = 0;
    crouchTimerRef.current = 0;

    // jump
    jumpStateRef.current = "none";
    jumpTimerRef.current = 0;
    wHeldRef.current = false;
    wantJumpHoldRef.current = false;
    jumpHoldStartRef.current = 0;
    jumpModeRef.current = "stand";

    // emote
    emoteActiveRef.current = false;
    emoteAbortRef.current = { aborted: true };
    if (emoteRafRef.current) cancelAnimationFrame(emoteRafRef.current);
    emoteRafRef.current = null;

    // drag
    draggingRef.current = false;
    dragPtrIdRef.current = null;
    dragOffsetRef.current = { dx: 0, dy: 0 };
    dragAbsRef.current = { x: 0, y: 0 };

    // anim timers
    strideIndexRef.current = 0;
    strideTimerRef.current = 0;
    strugglePhaseRef.current = 0;
    struggleTimerRef.current = 0;

    // ui
    setIsDraggingUi(false);
    setPose(standCasual);
    setDuration(120);
    setFacing("left");
  };

  /* =========================================================================
     ACTIONS
  ========================================================================= */
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
    const emoting = emoteActiveRef.current;

    if (!hasDir && !jumping && !dragging && !crouching && !emoting) {
      animatingRef.current = false;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;

      strideIndexRef.current = 0;
      strideTimerRef.current = 0;

      setPose(standCasual);
      setDuration(120);
    }
  };

  const beginMovementPose = () => {
    if (!directionRef.current) return;
    if (crouchingRef.current || draggingRef.current) return;
    if (emoteActiveRef.current) return;

    syncRunState();

    const running = runningRef.current;
    const strides = running ? runStrides : walkStrides;
    const frame = running ? RUN_FRAME : WALK_FRAME;

    strideIndexRef.current = 1;
    strideTimerRef.current = 0;

    if (jumpStateRef.current === "none") setPoseNow(strides[0], frame);
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

    // run
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
    if (emoteActiveRef.current) return;
    if (isAirOrJumping()) return;

    sHeldRef.current = true;
    crouchingRef.current = true;
    runningRef.current = false;

    crouchMovingRef.current = !!directionRef.current;
    crouchPhaseRef.current = 0;
    crouchTimerRef.current = 0;

    if (crouchMovingRef.current) setPoseNow(crouchWalk1, CROUCH_FRAME_MS);
    else setPoseNow(crouch, CROUCH_PRIME_MS);

    ensureLoop();
  };

  const exitCrouch = () => {
    sHeldRef.current = false;
    crouchQueuedRef.current = false;

    crouchingRef.current = false;
    crouchMovingRef.current = false;
    crouchTimerRef.current = 0;
    crouchPhaseRef.current = 0;

    syncRunState();

    if (directionRef.current) {
      beginMovementPose();
      ensureLoop();
    } else {
      setPoseNow(standCasual, 120);
      stopLoopIfIdle();
    }
  };

  const startJump = () => {
    if (crouchingRef.current) return;
    if (draggingRef.current) return;
    if (emoteActiveRef.current) return;
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

  /* =========================================================================
     EMOTE (ground-only; start with 1->2 once, then loop 3<->2)
  ========================================================================= */
  const stopEmote = () => {
    emoteActiveRef.current = false;
    if (emoteAbortRef.current) emoteAbortRef.current.aborted = true;
    if (emoteRafRef.current) cancelAnimationFrame(emoteRafRef.current);
    emoteRafRef.current = null;
  };

  const animatePoseMs = (nextPose, ms, abortObj) => {
    return new Promise((resolve) => {
      if (abortObj.aborted) return resolve(false);

      setPoseNow(nextPose, ms);

      const start = performance.now();
      const tick = () => {
        if (abortObj.aborted) return resolve(false);
        if (performance.now() - start >= ms) return resolve(true);
        emoteRafRef.current = requestAnimationFrame(tick);
      };

      emoteRafRef.current = requestAnimationFrame(tick);
    });
  };

  const startCryEmote = async () => {
    if (!isOnGround()) return;
    if (emoteActiveRef.current) return;

    stopEmote();

    emoteActiveRef.current = true;
    emoteAbortRef.current = { aborted: false };
    const abortObj = emoteAbortRef.current;

    // freeze locomotion state
    directionRef.current = null;
    shiftHeldRef.current = false;
    runningRef.current = false;

    ensureLoop();

    // start sequence ONCE: 1 -> 2
    if (!(await animatePoseMs(emoteCry1, 500, abortObj))) return;
    if (!(await animatePoseMs(emoteCry2, 500, abortObj))) return;

    // then loop forever: 3 -> 2
    while (!abortObj.aborted) {
      if (!(await animatePoseMs(emoteCry3, 300, abortObj))) break;
      if (!(await animatePoseMs(emoteCry2, 300, abortObj))) break;
    }

    if (emoteAbortRef.current === abortObj) {
      emoteActiveRef.current = false;
      emoteRafRef.current = null;

      if (isOnGround() && !directionRef.current) setPoseNow(standCasual, 120);
      stopLoopIfIdle();
    }
  };

  /* =========================================================================
     INPUT MERGE (keyboard overrides joystick when active)
  ========================================================================= */
  const computeJoystickIntent = () => {
    const mag = joyMagRef.current;
    const dir8 = joyDir8Ref.current;

    if (mag < JOY_ACTIVE_MAG || !dir8 || dir8 === "center") {
      return { dir: null, shift: false, jump: false, crouch: false };
    }

    const sprint = mag >= JOY_SPRINT_MAG;

    // Bottom
    if (dir8 === "s") return { dir: null, shift: false, jump: false, crouch: true };
    if (dir8 === "sw") return { dir: "left", shift: false, jump: false, crouch: true };
    if (dir8 === "se") return { dir: "right", shift: false, jump: false, crouch: true };

    // Top
    if (dir8 === "n") return { dir: null, shift: false, jump: true, crouch: false };
    if (dir8 === "nw") return { dir: "left", shift: sprint, jump: true, crouch: false };
    if (dir8 === "ne") return { dir: "right", shift: sprint, jump: true, crouch: false };

    // Horizontal
    if (dir8 === "w") return { dir: "left", shift: sprint, jump: false, crouch: false };
    if (dir8 === "e") return { dir: "right", shift: sprint, jump: false, crouch: false };

    return { dir: null, shift: false, jump: false, crouch: false };
  };

  const applyMergedInputs = () => {
    const joy = computeJoystickIntent();

    // interrupt emote on ANY input intent
    const anyKbIntent =
      kbDirRef.current != null || kbShiftRef.current || kbCrouchRef.current || kbJumpRef.current;

    const anyJoyIntent = joy.dir != null || joy.shift || joy.crouch || joy.jump;

    if (emoteActiveRef.current && (anyKbIntent || anyJoyIntent)) {
      stopEmote();
    }

    // if still emoting, ignore inputs until interrupted
    if (emoteActiveRef.current) {
      directionRef.current = null;
      shiftHeldRef.current = false;
      runningRef.current = false;
      return;
    }

    const dir = kbDirRef.current != null ? kbDirRef.current : joy.dir;
    const shift = kbShiftRef.current || joy.shift;
    const wantCrouch = kbCrouchRef.current || joy.crouch;
    const wantJump = kbJumpRef.current || joy.jump;

    // record "jump is being held" intent, used for auto-repeat on landing
    wantJumpHoldRef.current = wantJump;

    const prevDir = directionRef.current;
    const prevShift = shiftHeldRef.current;

    directionRef.current = dir;
    shiftHeldRef.current = shift;

    if (dir) setFacing(dir);

    // kick stride pose immediately when (dir/shift) changes on ground
    if ((prevDir !== dir || prevShift !== shift) && dir && !isAirOrJumping() && !crouchingRef.current) {
      beginMovementPose();
    }

    // crouch transitions
    if (wantCrouch && !sHeldRef.current) {
      if (isAirOrJumping()) {
        sHeldRef.current = true;
        crouchQueuedRef.current = true;
      } else {
        enterCrouch();
      }
    } else if (!wantCrouch && sHeldRef.current) {
      if (crouchingRef.current) exitCrouch();
      else {
        sHeldRef.current = false;
        crouchQueuedRef.current = false;
      }
    }

    // jump transitions (edge)
    if (wantJump && !wHeldRef.current) startJump();
    if (!wantJump && wHeldRef.current) endJumpHold();

    syncRunState();
  };

  /* =========================================================================
     DRAGGING
  ========================================================================= */
  const beginDrag = (e) => {
    if (!wrapperRef.current) return;
    if (emoteActiveRef.current) stopEmote();

    draggingRef.current = true;
    setIsDraggingUi(true);
    dragPtrIdRef.current = e.pointerId;

    directionRef.current = null;
    shiftHeldRef.current = false;
    runningRef.current = false;

    if (crouchingRef.current) exitCrouch();
    jumpStateRef.current = "none";
    wHeldRef.current = false;
    vyRef.current = 0;
    yAirRef.current = 0;

    const rect = wrapperRef.current.getBoundingClientRect();
    const cx = rect.left + rect.width * 0.5;
    const cy = rect.top + rect.height * 0.5;

    dragOffsetRef.current = { dx: e.clientX - cx, dy: e.clientY - cy };
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

  /* =========================================================================
     MAIN LOOP
  ========================================================================= */
  const loop = (ts) => {
    if (!lastTsRef.current) lastTsRef.current = ts;
    const rawDt = ts - lastTsRef.current;
    const dt = Math.min(50, rawDt);
    lastTsRef.current = ts;

    // drag mode
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

    // emote mode: keep transform stable, keep loop alive, but do not simulate locomotion
    if (emoteActiveRef.current) {
      // still allow merge to detect interrupt and stopEmote()
      applyMergedInputs();

      // lock to ground
      yAirRef.current = 0;
      vyRef.current = 0;

      xRef.current = clampXToWindow(xRef.current);
      applyTransformFromAir(xRef.current, yAirRef.current);

      rafRef.current = requestAnimationFrame(loop);
      return;
    }

    // merge inputs each frame
    applyMergedInputs();

    // crouch sim
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

    // horizontal + air control
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

    // jump state machine
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
        yAirRef.current = 0;
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

        // queued crouch on landing
        if (crouchQueuedRef.current && sHeldRef.current) {
          crouchQueuedRef.current = false;
          enterCrouch();
          rafRef.current = requestAnimationFrame(loop);
          return;
        }

        // auto-repeat jump while jump is held
        if (wantJumpHoldRef.current && !draggingRef.current && !crouchingRef.current) {
          startJump();
          rafRef.current = requestAnimationFrame(loop);
          return;
        }

        if (directionRef.current) beginMovementPose();
        else setPoseNow(standCasual, 120);
      }
    } else {
      // stride animation
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

    // clamps + apply
    xRef.current = clampXToWindow(xRef.current);

    const yCeil2 = clampYAirToCeiling(yAirRef.current);
    if (yCeil2 !== yAirRef.current) {
      yAirRef.current = yCeil2;
      if (vyRef.current < 0) vyRef.current = 0;
    }

    applyTransformFromAir(xRef.current, yAirRef.current);

    if (animatingRef.current && (directionRef.current || jumpStateRef.current !== "none" || yAirRef.current < 0)) {
      rafRef.current = requestAnimationFrame(loop);
    } else {
      stopLoopIfIdle();
    }
  };

  /* =========================================================================
     JOYSTICK INPUT
  ========================================================================= */
  const onJoystickChange = ({ magnitude, dir }) => {
    joyMagRef.current = magnitude;
    joyDir8Ref.current = dir || "center";

    // immediate interrupt if joystick becomes active
    if (emoteActiveRef.current && magnitude >= JOY_ACTIVE_MAG) stopEmote();

    ensureLoop();
  };

  /* =========================================================================
     KEYBOARD INPUT
  ========================================================================= */
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.repeat) return;

      const k = e.key.toLowerCase();

      if (k === "2") {
        startCryEmote();
        ensureLoop();
        return;
      }

      if (k === "a") kbDirRef.current = "left";
      if (k === "d") kbDirRef.current = "right";
      if (k === "shift") kbShiftRef.current = true;
      if (k === "s") kbCrouchRef.current = true;
      if (k === "w") kbJumpRef.current = true;

      ensureLoop();
    };

    const onKeyUp = (e) => {
      const k = e.key.toLowerCase();

      if (k === "a" && kbDirRef.current === "left") kbDirRef.current = null;
      if (k === "d" && kbDirRef.current === "right") kbDirRef.current = null;
      if (k === "shift") kbShiftRef.current = false;
      if (k === "s") kbCrouchRef.current = false;
      if (k === "w") kbJumpRef.current = false;

      ensureLoop();
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, []);

  /* =========================================================================
     INIT + RESIZE + MOUNT/UNMOUNT SAFETY
  ========================================================================= */
  useEffect(() => {
    hardReset();
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

    return () => {
      window.removeEventListener("resize", onResize);

      try {
        if (wrapperRef.current && dragPtrIdRef.current != null) {
          wrapperRef.current.releasePointerCapture(dragPtrIdRef.current);
        }
      } catch (_) {}

      hardReset();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ---------------- Ground recalc when scale changes ---------------- */
  useEffect(() => {
    if (draggingRef.current) return;

    recomputeGroundY();

    xRef.current = clampXToWindow(xRef.current);
    yAirRef.current = clampYAirToCeiling(yAirRef.current);
    applyTransformFromAir(xRef.current, yAirRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mobileMode, HUMAN_SCALE]);

  /* ---------------- Place joystick nicely on mobile ---------------- */
  useEffect(() => {
    if (!mobileMode) return;
    setJoyPos((p) => {
      const isDefault = p.x === 24 && p.y === 24;
      if (!isDefault) return p;
      const y = Math.max(24, window.innerHeight - 200);
      return { x: 24, y };
    });
  }, [mobileMode]);

  /* ---------------- Re-render HumanAnimator on mode/theme changes ---------------- */
  const animatorKey = `${mobileMode ? "m" : "d"}-${darkMode ? "dark" : "light"}-${HUMAN_SCALE}`;

  /* =========================================================================
     RENDER
  ========================================================================= */
  return (
    <div style={{ position: "fixed", inset: 0, overflow: "hidden", pointerEvents: "none", zIndex: 10000 }}>
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

      {mobileMode && (
        <Joystick
          size={140}
          deadZone={12}
          initialPosition={joyPos}
          onChange={onJoystickChange}
          onPositionChange={(p) => setJoyPos(p)}
        />
      )}
    </div>
  );
};
