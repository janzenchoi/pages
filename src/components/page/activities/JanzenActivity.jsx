import { ActivityCard } from "../../content/ActivityCard";
import lightImage from "../../../assets/stuff/janzen_light_icon.png";
import darkImage from "../../../assets/stuff/janzen_dark_icon.png";

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
  const subtitle = "Get experience controlling Janzen before you hire him.";
  const mobileDescription = [
    "Controls currently only available for desktop mode.",
  ];
  const desktopDescription = [
    "Drag and release to forcibly relocate.",
    "Press A / D to walk left / right.",
    "Press W / S to jump / crouch.",
    "Press SHIFT to sprint.",
    "Press 1-9 to emote."
  ];

  // Render
  return (
    <ActivityCard
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