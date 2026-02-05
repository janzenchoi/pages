import { ActivityCard } from "../../content/ActivityCard";
import soccerImage from "../../../assets/stuff/ball_icon.png";

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
  const subtitle = "Throw a soccer ball around while looking at Janzen's qualifications.";
  const mobileDescription = [
    "Swipe and release the soccer ball to throw it."
  ];
  const desktopDescription = [
    "Drag and release the soccer ball to throw it."
  ];

  // Render
  return (
    <ActivityCard
      mobileMode={mobileMode}
      darkMode={darkMode}
      status={activityController.status}
      setStatus={activityController.setStatus}
      setActivity={activityController.setBallExists}
      title={title}
      subtitle={subtitle}
      description={mobileMode ? mobileDescription : desktopDescription}
      iconLight={soccerImage}
      iconDark={soccerImage}
    />
  );
}