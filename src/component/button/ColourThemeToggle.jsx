import { setDarkMode } from "../../helper/brightness";
import { setStoredValue } from "../../helper/storage";

/**
 * Creates a toggle switch that changes the colour theme.
 * @param {boolean} colourTheme the theme to colour the site
 * @param {function} setColourTheme function to set colour theme
 * @returns colour theme toggle object
 */
function ColourThemeToggle({colourTheme, setColourTheme}) {

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
