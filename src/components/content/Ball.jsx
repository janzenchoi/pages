import { useState, useEffect, useRef } from "react";
import ballImage from "../../assets/stuff/ball.png";

// Constants
const BALL_SIZE = 100;
const GRAVITY = 0.45;
const FRICTION = 0.75;
const AIR_FRICTION = 0.996;
const GROUND_FRICTION = 0.95;
const FRAME_MS = 16.6667;

const RELEASE_DAMPING = 0.25; // reduce speed on release
const ROTATION_FACTOR = 50; // rotation multiplier for horizontal movement

export const Ball = () => {
  const initialX = window.innerWidth / 2 - BALL_SIZE / 2;
  const initialY = window.innerHeight / 2 - BALL_SIZE / 2;
  const [position, setPosition] = useState({ x: initialX, y: initialY });
  const [rotation, setRotation] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const ballRef = useRef({ x: initialX, y: initialY, vx: 0, vy: 0 });
  const animationRef = useRef(null);

  const lastPointerRef = useRef({
    x: initialX,
    y: initialY,
    t: performance.now(),
    vx: 0,
    vy: 0,
  });

  const pointerTypeRef = useRef(null);

  const getEventCoords = (e) => {
    if (e.touches && e.touches.length > 0) {
      return { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
    return { x: e.clientX, y: e.clientY };
  };

  const handleDown = (e) => {
    const { x, y } = getEventCoords(e);
    pointerTypeRef.current = e.touches && e.touches.length > 0 ? "touch" : "mouse";
    setIsDragging(true);
    setOffset({ x: x - ballRef.current.x, y: y - ballRef.current.y });
    ballRef.current.vx = 0;
    ballRef.current.vy = 0;
    lastPointerRef.current = { x, y, t: performance.now(), vx: 0, vy: 0 };
    e.preventDefault();
  };

  const handleMove = (e) => {
    if (!isDragging) return;
    if (pointerTypeRef.current === "mouse") {
      if ("buttons" in e && e.buttons === 0) return;
    }
    const { x, y } = getEventCoords(e);
    const newX = x - offset.x;
    const newY = y - offset.y;

    const now = performance.now();
    const dt = now - lastPointerRef.current.t || 1;
    const dx = x - lastPointerRef.current.x;
    const dy = y - lastPointerRef.current.y;

    const instantVx = (dx / dt) * FRAME_MS;
    const instantVy = (dy / dt) * FRAME_MS;
    const smoothedVx = lastPointerRef.current.vx * 0.3 + instantVx * 0.7;
    const smoothedVy = lastPointerRef.current.vy * 0.3 + instantVy * 0.7;

    lastPointerRef.current = { x, y, t: now, vx: smoothedVx, vy: smoothedVy };

    ballRef.current.x = newX;
    ballRef.current.y = newY;
    setPosition({ x: newX, y: newY });

    e.preventDefault();
  };

  const handleUp = () => {
    ballRef.current.vx = (lastPointerRef.current.vx || 0) * RELEASE_DAMPING;
    ballRef.current.vy = (lastPointerRef.current.vy || 0) * RELEASE_DAMPING;
    setIsDragging(false);
    pointerTypeRef.current = null;
  };

  useEffect(() => {
    const animate = () => {
      if (!isDragging) {
        ballRef.current.vy += GRAVITY;
        let newY = ballRef.current.y + ballRef.current.vy;
        let newX = ballRef.current.x + ballRef.current.vx;

        // Floor collision
        const floor = window.innerHeight - BALL_SIZE;
        if (newY > floor) {
          newY = floor;
          ballRef.current.vy = -ballRef.current.vy * FRICTION;
          if (Math.abs(ballRef.current.vy) < 0.5) ballRef.current.vy = 0;
          ballRef.current.vx *= GROUND_FRICTION;
        } 
        // Roof collision
        if (newY < 0) {
          newY = 0;
          ballRef.current.vy = -ballRef.current.vy * FRICTION;
        } else {
          ballRef.current.vx *= AIR_FRICTION;
        }

        // Wall collisions
        const rightLimit = window.innerWidth - BALL_SIZE;
        if (newX < 0) {
          newX = 0;
          ballRef.current.vx = -ballRef.current.vx * FRICTION;
        } else if (newX > rightLimit) {
          newX = rightLimit;
          ballRef.current.vx = -ballRef.current.vx * FRICTION;
        }

        if (Math.abs(ballRef.current.vx) < 0.01) ballRef.current.vx = 0;

        ballRef.current.x = newX;
        ballRef.current.y = newY;
        setPosition({ x: newX, y: newY });

        // Rotate ball based on horizontal velocity
        setRotation(prev => prev + ballRef.current.vx * ROTATION_FACTOR * 0.01);
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();
    return () => cancelAnimationFrame(animationRef.current);
  }, [isDragging]);

  useEffect(() => {
    const handleDocumentMouseMove = (e) => {
      if (!isDragging || pointerTypeRef.current !== "mouse") return;
      handleMove(e);
    };
    const handleDocumentMouseUp = () => {
      if (!isDragging || pointerTypeRef.current !== "mouse") return;
      handleUp();
    };

    document.addEventListener("mousemove", handleDocumentMouseMove);
    document.addEventListener("mouseup", handleDocumentMouseUp);
    return () => {
      document.removeEventListener("mousemove", handleDocumentMouseMove);
      document.removeEventListener("mouseup", handleDocumentMouseUp);
    };
  }, [isDragging]);

  const ballStyle = {
    position: "fixed",
    left: position.x,
    top: position.y,
    width: `${BALL_SIZE}px`,
    height: `${BALL_SIZE}px`,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    cursor: isDragging ? "grabbing" : "grab",
    zIndex: 1000,
    touchAction: "none",
    transform: `rotate(${rotation}deg)`, // apply rotation
  };

  return (
    <img
      onMouseDown={handleDown}
      onTouchStart={handleDown}
      onTouchMove={handleMove}
      onTouchEnd={handleUp}
      onTouchCancel={handleUp}
      onDragStart={(e) => e.preventDefault()}
      style={ballStyle}
      src={ballImage}
      alt="bouncy ball"
    />
  );
};
