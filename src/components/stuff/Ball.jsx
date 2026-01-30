import { useEffect, useRef, useState } from "react";
import ballImage from "../../assets/stuff/ball.png";
// import { BasketBall } from "./BasketBall";

/* =======================
   Physics constants
======================= */

const BALL_SIZE = 100;
const GRAVITY = 0.5;
const RESTITUTION = 0.75;      // bounce energy
const AIR_FRICTION = 0.995;
const GROUND_FRICTION = 0.92;
const RELEASE_DAMPING = 0.25;

const FRAME_MS = 16.6667;
const ROTATION_FACTOR = 0.5;

/* =======================
   Component
======================= */

export const Ball = () => {
  /* ---------- Initial position ---------- */
  const initial = {
    x: window.innerWidth / 2 - BALL_SIZE / 2,
    y: window.innerHeight / 2 - BALL_SIZE / 2,
  };

  /* ---------- Render state ---------- */
  const [position, setPosition] = useState(initial);
  const [rotation, setRotation] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  /* ---------- Physics state (refs) ---------- */
  const ball = useRef({
    x: initial.x,
    y: initial.y,
    vx: 0,
    vy: 0,
  });

  const offset = useRef({ x: 0, y: 0 });
  const pointer = useRef({
    x: 0,
    y: 0,
    vx: 0,
    vy: 0,
    t: 0,
  });

  const pointerType = useRef(null);
  const raf = useRef(null);

  /* =======================
     Helpers
======================= */

  const getCoords = (e) => {
    if (e.touches?.length) {
      return { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
    return { x: e.clientX, y: e.clientY };
  };

  /* =======================
     Pointer handlers
======================= */

  const handleDown = (e) => {
    const { x, y } = getCoords(e);
    pointerType.current = e.touches ? "touch" : "mouse";

    offset.current = {
      x: x - ball.current.x,
      y: y - ball.current.y,
    };

    ball.current.vx = 0;
    ball.current.vy = 0;

    pointer.current = {
      x,
      y,
      vx: 0,
      vy: 0,
      t: performance.now(),
    };

    setIsDragging(true);
    e.preventDefault();
  };

  const handleMove = (e) => {
    if (!isDragging) return;
    if (pointerType.current === "mouse" && e.buttons === 0) return;

    const { x, y } = getCoords(e);
    const now = performance.now();

    const dx = x - pointer.current.x;
    const dy = y - pointer.current.y;
    const dt = Math.max(now - pointer.current.t, 1);

    const vx = (dx / dt) * FRAME_MS;
    const vy = (dy / dt) * FRAME_MS;

    pointer.current = {
      x,
      y,
      vx: pointer.current.vx * 0.3 + vx * 0.7,
      vy: pointer.current.vy * 0.3 + vy * 0.7,
      t: now,
    };

    ball.current.x = x - offset.current.x;
    ball.current.y = y - offset.current.y;

    setPosition({ x: ball.current.x, y: ball.current.y });
    e.preventDefault();
  };

  const handleUp = () => {
    ball.current.vx = pointer.current.vx * RELEASE_DAMPING;
    ball.current.vy = pointer.current.vy * RELEASE_DAMPING;

    setIsDragging(false);
    pointerType.current = null;
  };

  /* =======================
     Physics loop
======================= */

  useEffect(() => {
    const animate = () => {
      const b = ball.current;

      if (!isDragging) {
        const floor = window.innerHeight - BALL_SIZE;
        const right = window.innerWidth - BALL_SIZE;

        /* --- Gravity --- */
        if (b.y < floor || b.vy < 0) {
          b.vy += GRAVITY;
        }

        /* --- Integrate --- */
        b.x += b.vx;
        b.y += b.vy;

        /* --- Floor / ceiling --- */
        if (b.y >= floor) {
          b.y = floor;
          b.vy *= -RESTITUTION;
          b.vx *= GROUND_FRICTION;

          if (Math.abs(b.vy) < 0.5) b.vy = 0;
        } else if (b.y <= 0) {
          b.y = 0;
          b.vy *= -RESTITUTION;
        } else {
          b.vx *= AIR_FRICTION;
        }

        /* --- Walls --- */
        if (b.x <= 0) {
          b.x = 0;
          b.vx *= -RESTITUTION;
        } else if (b.x >= right) {
          b.x = right;
          b.vx *= -RESTITUTION;
        }

        if (Math.abs(b.vx) < 0.01) b.vx = 0;

        setPosition({ x: b.x, y: b.y });
        setRotation((r) => r + b.vx * ROTATION_FACTOR);
      }

      raf.current = requestAnimationFrame(animate);
    };

    animate();
    return () => cancelAnimationFrame(raf.current);
  }, [isDragging]);

  /* =======================
     Mouse capture
======================= */

  useEffect(() => {
    const move = (e) =>
      isDragging && pointerType.current === "mouse" && handleMove(e);
    const up = () =>
      isDragging && pointerType.current === "mouse" && handleUp();

    document.addEventListener("mousemove", move);
    document.addEventListener("mouseup", up);

    return () => {
      document.removeEventListener("mousemove", move);
      document.removeEventListener("mouseup", up);
    };
  }, [isDragging]);

  /* =======================
     Render
======================= */

  const style = {
    position: "fixed",
    left: position.x,
    top: position.y,
    width: BALL_SIZE,
    height: BALL_SIZE,
    cursor: isDragging ? "grabbing" : "grab",
    touchAction: "none",
    zIndex: 1000,
    transform: `rotate(${rotation}deg)`,
  };

  return (
    <img
      src={ballImage}
      alt="ball"
      style={style}
      draggable={false}
      onMouseDown={handleDown}
      onTouchStart={handleDown}
      onTouchMove={handleMove}
      onTouchEnd={handleUp}
      onTouchCancel={handleUp}
    />
    // <div
    //   style={style}
    //   draggable={false}
    //   onMouseDown={handleDown}
    //   onTouchStart={handleDown}
    //   onTouchMove={handleMove}
    //   onTouchEnd={handleUp}
    //   onTouchCancel={handleUp}
    // >
    //   <BasketBall size={BALL_SIZE} />
    // </div>
  );
};
