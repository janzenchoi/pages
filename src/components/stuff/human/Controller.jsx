import React, { useState } from "react";
import { HumanAnimator } from "./HumanAnimator";
import { Draggable } from "./Draggable";
import { standStraight, standCasual } from "./poses";
import { walkStride1, walkStride2, walkStride3, walkStride4, walkStride5, walkStride6 } from "./poses";
import { runStride1, runStride2, runStride3, runStride4, runStride5, runStride6 } from "./poses";
import { jumpPrime, jumpFly, jumpPeak, jumpFall, jumpLand } from "./poses";
import { standJumpPrime, standJumpFly, standJumpLand, walkJumpFly } from "./poses";
import { crouch, crouchWalk1, crouchWalk2 } from "./poses";
import { struggle1, struggle2 } from "./poses";
import { emoteCry1, emoteCry2, emoteCry3 } from "./poses";

/**
 * Controls the human to do poses
 * @returns controller object
 */
export const Controller = ({ darkMode }) => {

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
  const animateCasual = async () => {
    await animate(standCasual, 500);
  };

  // Walking animation
  const animateWalk = async (count=1) => {
    const strides = [walkStride1, walkStride2, walkStride3, walkStride4, walkStride5, walkStride6];
    for (let i = 0; i < count; i++) {
      for (const stride of strides) {
        await animate(stride, 100);
      }
    }
  };

  // Running animation
  const animateRun = async (count=1) => {
    const strides = [runStride1, runStride2, runStride3, runStride4, runStride5, runStride6 ];
    for (let i = 0; i < count; i++) {
      for (const stride of strides) {
        await animate(stride, 100);
      }
    }
  };

  // Walking Jumping animation
  const animateWalkJump = async (count=1) => {
    for (let i = 0; i < count; i++) {
      await animate(jumpPrime, 300);
      await animate(walkJumpFly, 300);
      await animate(jumpLand, 300);
    }
  };

  // Running Jumping animation
  const animateRunJump = async (count=1) => {
    for (let i = 0; i < count; i++) {
      await animate(jumpPrime, 300);
      await animate(jumpFly, 300);
      await animate(jumpPeak, 300);
      await animate(jumpFall, 300);
      await animate(jumpLand, 300);
    }
  };

  // Standing Jumping animation
  const animateStandJump = async (count=1) => {
    for (let i = 0; i < count; i++) {
      // await animate(standCasual, 300);
      await animate(standJumpPrime, 300);
      await animate(standJumpFly, 300);
      await animate(standJumpFly, 900);
      await animate(standJumpLand, 300);
      // await animate(standCasual, 300);
    }
  };

  // Struggling animation
  const animateStruggle = async (count=1) => {
    for (let i = 0; i < count; i++) {
      await animate(struggle1, 200);
      await animate(struggle2, 200);
    }
  };

  // Crouching animation
  const animateCrouch = async (count=1) => {
    await animate(crouch, 200);
    // for (let i = 0; i < count; i++) {
    //   await animate(crouchWalk1, 600);
    //   await animate(crouchWalk2, 600);
    // }
  };

  // Cry animation
  const animateEmote = async (count=1) => {
    await animate(emoteCry1, 500);
    await animate(emoteCry2, 500);
    for (let i = 0; i < count; i++) {
      await animate(emoteCry3, 300);
      await animate(emoteCry2, 300);
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
        darkMode={darkMode}
        humanScale={1}
      />

      <div style={{ marginTop: "-300px" }}>
        <button onClick={() => animateStand()}>Stand</button>
        <button onClick={() => animateCasual()}>Casual</button>
        <button onClick={() => animateWalk(2)}>Walk</button>
        <button onClick={() => animateRun(2)}>Run</button>
        <button onClick={() => animateWalkJump(1)}>W.Jump</button>
        <button onClick={() => animateRunJump(1)}>R.Jump</button>
        <button onClick={() => animateStandJump(1)}>S.Jump</button>
        <button onClick={() => animateStruggle(5)}>Struggle</button>
        <button onClick={() => animateCrouch(5)}>Crouch</button>
        <button onClick={() => animateEmote(3)}>Emote</button>
      </div>
    </div>
    </Draggable>
  );
};
