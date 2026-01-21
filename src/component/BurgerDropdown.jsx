import { useState, useRef, useEffect } from "react";
import { menuStyle, triangleStyle } from "../helper/dropdown";

/**
 * Creates a burger dropdown that always exists
 * @param {*} children items in the dropdown menu 
 * @returns the burger dropdown object
 */
const BurgerDropdown = ({ children }) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const clickOutsideHandler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target))
        setOpen(false);
    };
    document.addEventListener("mousedown", clickOutsideHandler);
    return () =>
      document.removeEventListener("mousedown", clickOutsideHandler);
  }, []);

  // Define styles
  const barContainerStyle = {
    position: "relative",
    width: "24px",
    height: "2rem",
    cursor: "pointer",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  };
  const barStyle = {
    position: "relative",
    left: 0,
    width: "100%",
    height: "4px",
    backgroundColor: "var(--colour-5)",
    borderRadius: "2px",
    transition: "transform 0.3s ease, opacity 0.3s ease",
  };

  // Return menu object
  return (
    <div ref={dropdownRef} style={{ position: "relative" }}>
      <div style={barContainerStyle} onClick={() => setOpen((prev) => !prev)}>
        <div style={{ ...barStyle, transform: open ? "translateY(8px) rotate(45deg)" : "none" }}/>
        <div style={{ ...barStyle, opacity: open ? 0 : 1, }}/>
        <div style={{ ...barStyle, transform: open ? "translateY(-8px) rotate(-45deg)" : "none" }}/>
      </div>
      <div style={{ ...menuStyle, opacity: open ? 1 : 0 }}>
        <div style={triangleStyle}/>
        {children}
      </div>
    </div>
  );
};

export default BurgerDropdown;
