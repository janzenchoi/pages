import { useState, useRef, useEffect } from "react";
import ColourThemeToggle from '../components/buttons/ColourThemeToggle';

const Dropdown = () => {
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
  const iconStyle = {
    position: "relative",
    width: "24px",
    height: "16px",
    cursor: "pointer",
  };
  const barStyle = {
    position: "absolute",
    left: 0,
    width: "100%",
    height: "4px",
    backgroundColor: "var(--colour-5)",
    borderRadius: "2px",
    transition: "transform 0.3s ease, opacity 0.3s ease",
  };
  const triangleStyle = {
    position: "absolute",
    top: "-9px",
    right: "2px",
    width: 0,
    height: 0,
    borderLeft: "10px solid transparent",
    borderRight: "10px solid transparent",
    borderBottom: "10px solid var(--colour-2)",
    filter: "drop-shadow(0 -2px 1px var(--colour-3))",
  };
  const menuStyle = {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    position: "fixed",
    padding: "4px 12px 4px 12px",
    top: "calc(var(--header-height) - 4px)",
    right: "16px",
    width: "240px",
    backgroundColor: "var(--colour-2)",
    borderRadius: "4px",
    boxShadow: "0 0 3px var(--colour-4)",
    zIndex: 1000,
    opacity: open ? 1 : 0,
    transition: "opacity 0.2s ease",
  };
  const itemStyle = {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    padding: "4px 4px 4px 4px",
    width: "100%",
    height: "40px",
    cursor: "pointer",
  };
  const textStyle = {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    width: "100%",
    height: "100%",
    fontWeight: 400,
    fontSize: "1rem",
    color: "var(--colour-5)",
  }
  const dividerStyle = {
    width: "100%",
    height: "1px",
    boxShadow: "0 2px 6px var(--colour-4)",
    backgroundColor: "var(--colour-4)",
    opacity: 0.8,
  };

  // Return menu object
  return (
    <div ref={dropdownRef} style={{ position: "relative" }}>
      <div style={iconStyle} onClick={() => setOpen((prev) => !prev)}>
        <div style={{ ...barStyle, top: 0,  transform: open ? "translateY(8px) rotate(45deg)" : "none" }}/>
        <div style={{ ...barStyle, top: 8, opacity: open ? 0 : 1, }}/>
        <div style={{ ...barStyle, top: 16, transform: open ? "translateY(-8px) rotate(-45deg)" : "none" }}/>
      </div>
      <div style={menuStyle}>
        <div style={triangleStyle}/>
        <div style={{ ...itemStyle }}>
          <div style={{ ...textStyle }}>Option</div>
        </div>
        <div style={{ ...dividerStyle }}/>
        <div style={{ ...itemStyle }}>
          <div style={{ ...textStyle }}>Option</div>
        </div>
        <div style={{ ...dividerStyle }}/>
        <div style={{ ...itemStyle }}>
          <div style={{ ...textStyle }}>Dark Mode</div>
          <ColourThemeToggle/>
        </div>
      </div>
    </div>
  );
};

export default Dropdown;
