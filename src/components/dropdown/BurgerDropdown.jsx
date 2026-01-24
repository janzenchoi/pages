import { useState, useRef } from "react";
import { Dropdown } from "./Dropdown";

/**
 * Dropdown menu triggered by burger
 * @param {*} style additional style to apply to the burger
 * @param {*} closeOnChange variable to monitor to close if changed
 * @param {*} children items of the dropdown
 * @returns burger dropdown menu object
 */
const BurgerDropdown = ({ style, closeOnChange, children }) => {
  const [open, setOpen] = useState(false);
  const burgerRef = useRef(null)

  // Define styles
  const barContainerStyle = {
    position: "relative",
    marginTop: "4px",
    width: "26px",
    height: "22px",
    cursor: "pointer",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  };
  const barStyle = {
    width: "100%",
    height: "4px",
    backgroundColor: "var(--colour-5)",
    borderRadius: "2px",
    transition: "transform 0.3s ease, opacity 0.3s ease",
  };

  // Return burger menu
  return (
    <div style={{ ...style, position: "relative", display: "inline-block" }}>
      <div style={barContainerStyle} onClick={() => {setOpen(!open)}} ref={burgerRef}>
        <div style={{ ...barStyle, transform: open ? "translateY(9px) rotate(45deg)" : "none" }} />
        <div style={{ ...barStyle, opacity: open ? 0 : 1 }} />
        <div style={{ ...barStyle, transform: open ? "translateY(-9px) rotate(-45deg)" : "none" }} />
      </div>
      <Dropdown open={open} onClose={() => setOpen(false)} closeOnChange={closeOnChange} ignoreRefs={[burgerRef]}>
        {children}
      </Dropdown>
    </div>
  );
};

export default BurgerDropdown;
