import profileDayImage from "../../assets/profile_day.jpg";
import profileNightImage from "../../assets/profile_night.jpg";

/**
 * Bistate image
 * @param {boolean} toggle variable that toggles the image
 * @returns bistate image object
 */
export const ProfileImage = ({toggle}) => {

  // Style of images
  const imageContainerStyle = {
    position: "relative",
    height: "150px",
    width: "150px",
    border: "4px solid var(--colour-2)",
  };
  const imageStyle = {
    position: "absolute",
    transition: "opacity 0.5s",
    height: "100%",
    width: "100%",
  }

  // Return image object
  return (
    <div style={imageContainerStyle}>
      <img src={profileNightImage} style={{ ...imageStyle, opacity: toggle ? 1 : 0}}/>
      <img src={profileDayImage} style={{ ...imageStyle, opacity: toggle ? 0 : 1}}/>
    </div>
  );
}