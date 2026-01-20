import { useEffect, useState } from "react";
import { getStoredValue, toggleStoredValue } from "../../helper/storage";

/**
 * Creates a toggle switch that toggles data in local storage.
 * Doesn't work with duplicate toggle switches.
 *
 * @param {string} field field to toggle 
 * @returns {string} toggle switch
 */
function LocalToggle({ field }) {
  const [toggleValue, setToggleValue] = useState(() => getStoredValue(field) === "true");

  // Update upon change of local storage
  useEffect(() => {
    const storageListenerHandler = (e) => {
      if (e.key === field)
        setToggleValue(e.newValue === "true");
    };
    window.addEventListener("storage", storageListenerHandler);
    return () => window.removeEventListener("storage", storageListenerHandler);
  }, [field]);

  // Toggle handler
  const toggleHandler = () => {
    const newValue = toggleStoredValue(field);
    setToggleValue(newValue);
  };

  // Styles
  const sliderStyle = {
    position: "relative",
    display: "inline-block",
    width: "50px",
    height: "24px",
    borderRadius: "24px",
    backgroundColor: toggleValue ? "#2dc188ff": "#a0a0baff",
    transition: "background-color 0.2s",
  };
  const circleStyle = {
    position: "absolute",
    top: "2px",
    left: toggleValue ? "28px" : "3px", // slide circle
    width: "20px",
    height: "20px",
    borderRadius: "50%",
    backgroundColor: "#fff",
    transition: "left 0.2s",
  };

  // Render toggle switch
  return (
    <div>
      <input
        type="checkbox"
        checked={toggleValue}
        onChange={toggleHandler}
        style={{ display: "none" }}
      />
      <span style={sliderStyle}>
        <span style={circleStyle} />
      </span>
    </div>
  );
}

export default LocalToggle;
