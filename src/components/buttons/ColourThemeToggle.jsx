import { useState } from "react";
import { setDarkMode, DEFAULT_MODE } from "../../helper/brightness";
import { setStoredValue, getStoredValue } from "../../helper/storage";

/**
 * Creates a toggle switch that changes the colour theme.
 *
 * @param {string} field field to toggle 
 * @returns {string} toggle switch
 */
function ColourThemeToggle() {
  const [colourTheme, setColourTheme] = useState(() => {
    return getStoredValue("colour-theme") || DEFAULT_MODE;
  });

  // Toggle handler
  const toggleHandler = () => {
    const isDark = colourTheme === "dark";
    const newColour = isDark ? "light" : "dark"
    setDarkMode(!isDark);
    setColourTheme(newColour);
    setStoredValue("colour-theme", newColour);
  };

  // Styles
  const containerStyle = {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    cursor: "pointer",
    marginRight: "8px",
  };
  const sliderStyle = {
    position: "relative",
    display: "inline-block",
    width: "40px",
    height: "20px",
    borderRadius: "20px",
    backgroundColor: "var(--switch-colour)",
    transition: "background-color 0.2s",
  };
  const circleStyle = {
    position: "absolute",
    top: "2px",
    left: colourTheme === "dark" ? "22px" : "2px", // slide circle
    width: "16px",
    height: "16px",
    borderRadius: "50%",
    backgroundColor: "#fff",
    transition: "left 0.2s",
  };

  // Render toggle switch
  return (
    <label style={{ ...containerStyle }}>
      <input
        type="checkbox"
        checked={document.documentElement.getAttribute("colour-theme") === "dark"}
        onChange={toggleHandler}
        style={{ display: "none" }}
      />
      <span style={sliderStyle}>
        <span style={circleStyle} />
      </span>
    </label>
  );
}

export default ColourThemeToggle;
