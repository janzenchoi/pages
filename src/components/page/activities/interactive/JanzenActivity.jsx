import { ActivityBullet } from "../../../content/ActivityBullet";
import lightImage from "../../../../assets/stuff/janzen_light_icon.png";
import darkImage from "../../../../assets/stuff/janzen_dark_icon.png";

/**
 * Janzen activity card
 * @param {boolean} mobileMode whether to use mobile or desktop view
 * @param {boolean} darkMode whether to use dark or light mode
 * @param {*} activityController controller for activities
 * @returns janzen activity card object
 */
export const JanzenActivity = ({ mobileMode, darkMode, activityController }) => {
  
  // Constants
  const title = "Tiny Janzen";
  const subtitle = "Experience controlling Janzen before you hire him.";
  const mobileDescription = [
    "Hold and release Janzen to forcibly relocate him",
    "Move joystick left / right to walk left / right",
    "Move joystick upward to jump",
    "Move joystick downward to crouch",
    "Move joystick outside the dashed ring to sprint",
  ];
  const desktopDescription = [
    "Drag and release Janzen to forcibly relocate him",
    "Press A / D to walk left / right",
    "Press W to jump",
    "Press S to crouch",
    "Press SHIFT to sprint",
    // "Press 1-9 to emote."
  ];

  // Render
  return (
    <ActivityBullet
      mobileMode={mobileMode}
      darkMode={darkMode}
      status={activityController.status}
      setStatus={activityController.setStatus}
      setActivity={activityController.setJanzenExists}
      title={title}
      subtitle={subtitle}
      description={mobileMode ? mobileDescription : desktopDescription}
      iconLight={lightImage}
      iconDark={darkImage}
    />
  );
}