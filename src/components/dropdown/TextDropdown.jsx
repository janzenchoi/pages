import { useState, useRef } from "react";
import { Dropdown } from "./Dropdown";

/**
 * Dropdown menu triggered by text
 * @param {String} text items of the dropdown
 * @param {*} style style for the text
 * @param {*} closeOnChange variable to monitor to close if changed
 * @param {*} children items of the dropdown
 * @returns text-triggered dropdown menu
 */
const TextDropdown = ({ text, style, closeOnChange, children }) => {
  const [open, setOpen] = useState(false);
  const textRef = useRef(null);

  // Define styles
  const textStyle = {
    display: "flex",
    alignItems: "center",
    cursor: "pointer",
    userSelect: "none",
  };
  const arrowStyle = {
    marginLeft: "10px",
    marginRight: "-2px",
    marginTop: "4px",
    width: 0,
    height: 0,
    borderLeft: "5px solid transparent",
    borderRight: "5px solid transparent",
    borderTop: "4px solid currentColor",
    transformOrigin: "50% 40%",
    transform: open ? "scaleY(-1)" : "scaleY(1)",
    transition: "transform 300ms cubic-bezier(0.4, 0, 0.2, 1)",
    willChange: "transform",
  };
  const dropdownStyle = {
    position: "absolute",
    right: "-10px",
  };

  // Return text dropdown object
  return (
    <div style={{ ...style, position: "relative", display: "inline-block" }}>
      <div ref={textRef} onClick={() => setOpen(!open)} style={textStyle}>
        <span>{text}</span>
        <span style={arrowStyle}></span>
      </div>
      <div style={dropdownStyle}>
        <Dropdown open={open} onClose={() => setOpen(false)} closeOnChange={closeOnChange} ignoreRefs={[textRef]}>
          {children}
        </Dropdown>
      </div>
    </div>
  );
};

export default TextDropdown;
