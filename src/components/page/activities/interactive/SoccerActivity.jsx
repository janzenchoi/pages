import { ActivityBullet } from "../../../content/ActivityBullet";
import ballLight from "../../../../assets/stuff/ball_light_icon.png";
import ballDark from "../../../../assets/stuff/ball_dark_icon.png";

/**
 * Soccer activity card
 * @param {boolean} mobileMode whether to use mobile or desktop view
 * @param {boolean} darkMode whether to use dark or light mode
 * @param {*} activityController controller for activities
 * @returns soccer activity card object
 */
export const SoccerActivity = ({ mobileMode, darkMode, activityController }) => {
  
  // Constants
  const title = "Soccer Ball";
  const subtitle = "Throw a ball around while browsing Janzen's qualifications.";
  const mobileDescription = [
    "Swipe and release the soccer ball to throw it"
  ];
  const desktopDescription = [
    "Drag and release the soccer ball to throw it"
  ];

  // Render
  return (
    <ActivityBullet
      mobileMode={mobileMode}
      darkMode={darkMode}
      status={activityController.status}
      setStatus={activityController.setStatus}
      setActivity={activityController.setBallExists}
      title={title}
      subtitle={subtitle}
      description={mobileMode ? mobileDescription : desktopDescription}
      iconLight={ballLight}
      iconDark={ballDark}
    />
  );
}