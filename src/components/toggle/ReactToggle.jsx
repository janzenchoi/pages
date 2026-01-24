import { useState, useEffect } from "react";

/**
 * Creates a toggle switch that reacts to an input
 *
 * @param {boolean} input the input to react to
 * @param {function} onChange called with next value
 * @param {boolean} disabled whether to disable the toggle
 * @returns {string} toggle switch
 */
function ReactToggle({ input, onChange, disabled=false }) {
  const [localInput, setLocalInput] = useState(input);

  // Sync with parent input
  useEffect(() => {
    setLocalInput(input);
  }, [input]);

  // Handles toggle
  const toggleHandler = () => {
    if (!disabled) {
      setLocalInput(!localInput);
      onChange(!localInput);
    }
  };

  // Define styles
  const containerStyle = {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    cursor: disabled ? "not-allowed" : "pointer",
    marginRight: "8px",
  };
  const sliderStyle = {
    position: "relative",
    display: "inline-block",
    width: "40px",
    height: "20px",
    borderRadius: "20px",
    backgroundColor: localInput ? "rgb(45, 193, 136)" : "rgb(127, 154, 195)",
    opacity: disabled ? 0.5 : 1,
    transition: "background-color 0.2s",
  };
  const circleStyle = {
    position: "absolute",
    top: "2px",
    left: localInput ? "22px" : "2px",
    width: "16px",
    height: "16px",
    borderRadius: "50%",
    backgroundColor: "#fff",
    transition: "left 0.2s",
  };

  // Return reactive toggle
  return (
    <label style={containerStyle}>
      <input
        type="checkbox"
        checked={localInput}
        onChange={toggleHandler}
        style={{ display: "none" }}
      />
      <span style={sliderStyle}>
        <span style={circleStyle} />
      </span>
    </label>
  );
}

export default ReactToggle;
