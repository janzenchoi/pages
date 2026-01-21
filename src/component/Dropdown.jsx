import { useState, useRef, useEffect } from "react";
import { menuStyle, triangleStyle } from "../helper/dropdown";

/**
 * Creates a dropdown that disappears after being closed
 * @param {*} children items in the dropdown menu 
 * @returns the burger dropdown object
 */
const Dropdown = ({ children }) => {
  const [open, setOpen] = useState(true);
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

  // Return menu object
  return (
    <div ref={dropdownRef} style={{ position: "relative" }}>
      <div style={{ ...menuStyle, opacity: open ? 1 : 0 }}>
        <div style={triangleStyle}/>
        {children}
      </div>
    </div>
  );
};

export default Dropdown;
