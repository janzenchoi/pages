import React, { useState } from "react";
import { HumanAnimator } from "./HumanAnimator";
import { Draggable } from "./Draggable";
import { standStraight, standReady } from "./poses";
import { walkStride1, walkStride2, walkStride3, walkStride4, walkStride5, walkStride6 } from "./poses";

/**
 * Controls the human to do poses
 * @returns controller object
 */
export const Controller = () => {

  // Initialise
  const [pose, setPose] = useState(standStraight);
  const [duration, setDuration] = useState(1);

  // Runs the animation
  const animate = async (targetPose, duration) => {
    setDuration(duration);
    setPose(targetPose);
    await new Promise((resolve) => setTimeout(resolve, duration));
  };

  // Animate standing straight
  const animateStand = async () => {
    await animate(standStraight, 400);
  };

  // Priming animation
  const animateReady = async () => {
    await animate(standReady, 100);
  };

  // Walking animation
  const animateWalk = async (walkCount=1) => {
    const strides = [walkStride1, walkStride2, walkStride3, walkStride4, walkStride5, walkStride6];
    for (let i = 0; i < walkCount; i++) {
      for (const stride of strides) {
        await animate(stride, 200);
      }
    }
  };

  return (
    <Draggable>
    <div
      style={{
        position: "absolute",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <HumanAnimator
        targetPose={pose}
        duration={duration}
        debug={true}
        humanScale={1}
      />

      <div style={{ marginTop: "-100px" }}>
        <button onClick={() => animateStand()}>A</button>
        <button onClick={() => animateReady()}>B</button>
        <button onClick={() => animateWalk(5)}>WALK</button>
      </div>
    </div>
    </Draggable>
  );
};
