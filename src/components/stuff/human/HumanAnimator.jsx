import React, { useEffect, useRef, useState } from "react";
import { Human } from "./Human";

export const HumanAnimator = ({
  targetPose,
  duration = 500,
  debug = false,
  humanScale = 1,
  darkMode = false,
}) => {
  const [currentPose, setCurrentPose] = useState(() => ({
    offsetX: targetPose.offsetX ?? 0,
    offsetY: targetPose.offsetY ?? 0,

    foreHandRotation: 180,
    hindHandRotation: 180,

    ...targetPose,
  }));

  const animationRef = useRef(null);
  const startTimeRef = useRef(null);
  const startPoseRef = useRef({ ...currentPose });
  const targetRef = useRef({ ...currentPose });

  /* ------------------------------------------------------------------ */
  /* Helpers                                                             */
  /* ------------------------------------------------------------------ */

  const shortestAngleDelta = (from, to) =>
    ((to - from + 540) % 360) - 180;

  const isAngleKey = (key) =>
    ![
      "offsetX",
      "offsetY",
      "borderX0",
      "borderX1",
      "borderY0",
      "borderY1",
    ].includes(key);

  /* ------------------------------------------------------------------ */
  /* Animation loop                                                      */
  /* ------------------------------------------------------------------ */

  const animate = (timestamp) => {
    if (!startTimeRef.current) startTimeRef.current = timestamp;

    const elapsed = timestamp - startTimeRef.current;
    const t = Math.min(elapsed / duration, 1);

    const nextPose = {};

    for (const key in targetRef.current) {
      const start = startPoseRef.current[key] ?? 0;
      const end = targetRef.current[key] ?? 0;

      if (isAngleKey(key)) {
        const delta = shortestAngleDelta(start, end);
        nextPose[key] = (start + delta * t + 360) % 360;
      } else {
        nextPose[key] = start + (end - start) * t;
      }
    }

    setCurrentPose(nextPose);

    if (t < 1) {
      animationRef.current = requestAnimationFrame(animate);
    } else {
      startTimeRef.current = null;
      startPoseRef.current = { ...nextPose };
    }
  };

  /* ------------------------------------------------------------------ */
  /* React to pose changes                                               */
  /* ------------------------------------------------------------------ */

  useEffect(() => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }

    startPoseRef.current = { ...currentPose };
    targetRef.current = { ...currentPose, ...targetPose };
    startTimeRef.current = null;

    animationRef.current = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationRef.current);
  }, [targetPose, duration]);

  /* ------------------------------------------------------------------ */
  /* Render                                                              */
  /* ------------------------------------------------------------------ */

  return (
    <Human
      {...currentPose}

      debug={debug}
      humanScale={humanScale}
      darkMode={darkMode}
    />
  );
};
