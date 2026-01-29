import { useState, useEffect, useRef } from "react";
import ballImage from "../../assets/stuff/ball.png";

// Constants
const BALL_SIZE = 50;
const GRAVITY = 0.5;
const FRICTION = 0.7;

/**
 * Ball object
 * @returns bouncing ball object
 */
export const Ball = () => {

  // Initialise in center of screen
  const initialX = window.innerWidth / 2 - BALL_SIZE / 2;
  const initialY = window.innerHeight / 2 - BALL_SIZE / 2;
  const [position, setPosition] = useState({ x: initialX, y: initialY });
  const [isDragging, setIsDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const ballRef = useRef({ x: initialX, y: initialY, vy: 0 });
  const animationRef = useRef(null);

  // Helper to unify mouse and touch coordinates
  const getEventCoords = (e) => {
    if (e.touches && e.touches.length > 0) {
      return { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
    return { x: e.clientX, y: e.clientY };
  };

  // Mouse / touch handlers
  const handleDown = (e) => {
    const { x, y } = getEventCoords(e);
    setIsDragging(true);
    setOffset({ x: x - ballRef.current.x, y: y - ballRef.current.y });
    ballRef.current.vy = 0;
    e.preventDefault(); // prevent scrolling on touch
  };

  const handleMove = (e) => {
    if (!isDragging) return;
    const { x, y } = getEventCoords(e);
    const newX = x - offset.x;
    const newY = y - offset.y;
    ballRef.current.x = newX;
    ballRef.current.y = newY;
    setPosition({ x: newX, y: newY });
    e.preventDefault(); // prevent scrolling on touch
  };

  const handleUp = () => setIsDragging(false);

  // Gravity animation
  useEffect(() => {
    const animate = () => {
      if (!isDragging) {
        ballRef.current.vy += GRAVITY;
        let newY = ballRef.current.y + ballRef.current.vy;
        const floor = window.innerHeight - BALL_SIZE;
        if (newY > floor) {
          newY = floor;
          ballRef.current.vy = -ballRef.current.vy * FRICTION;
        }
        ballRef.current.y = newY;
        setPosition({ x: ballRef.current.x, y: newY });
      }
      animationRef.current = requestAnimationFrame(animate);
    };
    animate();
    return () => cancelAnimationFrame(animationRef.current);
  }, [isDragging]);

  // Ball styles (position fixed, no container needed)
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
    touchAction: "none", // prevents touch scroll
  };

  // Return the ball object
  return (
    <div
      onMouseMove={handleMove}
      onMouseUp={handleUp}
      onMouseLeave={handleUp}
      onTouchMove={handleMove}
      onTouchEnd={handleUp}
      onTouchCancel={handleUp}
    >
      <img
        onMouseDown={handleDown}
        onTouchStart={handleDown}
        onDragStart={(e) => e.preventDefault()}
        style={ballStyle}
        src={ballImage}
      />
    </div>
  );
};
