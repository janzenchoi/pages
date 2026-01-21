  // Dropdown arrow style
  export const triangleStyle = {
    position: "absolute",
    top: "-8px",
    right: "3px",
    width: 0,
    height: 0,
    borderLeft: "9px solid transparent",
    borderRight: "9px solid transparent",
    borderBottom: "9px solid var(--colour-2)",
    filter: "drop-shadow(0 -2px 1px var(--colour-3))",
  };
  
  // Dropdown menu style
  export const menuStyle = {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    position: "fixed",
    padding: "8px 12px 8px 12px",
    top: "calc(var(--header-height) - 4px)",
    right: "16px",
    width: "240px",
    backgroundColor: "var(--colour-2)",
    borderRadius: "4px",
    boxShadow: "0 0 3px var(--colour-4)",
    zIndex: 1000,
    transition: "opacity 0.2s ease",
  };