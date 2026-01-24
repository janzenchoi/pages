import { useState } from "react";
import profileDayImage from "../../assets/profile_day.jpg";
import profileNightImage from "../../assets/profile_night.jpg";

/**
 * Bistate image
 * @param {boolean} toggle variable that toggles the image
 * @returns bistate image object
 */
export const ProfileImage = ({toggle}) => {
  const [expanded, setExpanded] = useState(false);

  // Style of images
  const imageContainerStyle = {
    position: "relative",
    height: expanded ? "200px": "100px",
    width: expanded ? "200px": "100px",
    border: "1px solid var(--colour-3)",
    cursor: "pointer",
  };
  const imageStyle = {
    position: "absolute",
    transition: "opacity 0.5s",
    height: "100%",
    width: "100%",
  }

  // Return image object
  return (
    <div style={imageContainerStyle} onClick={() => setExpanded(prev => !prev)}>
      <img src={profileNightImage} style={{ ...imageStyle, opacity: toggle ? 1 : 0}}/>
      <img src={profileDayImage} style={{ ...imageStyle, opacity: toggle ? 0 : 1}}/>
    </div>
  );
}