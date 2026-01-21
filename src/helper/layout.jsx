// Width to define the width breakpoint of the mobile version
export const MOBILE_WIDTH = "800px";

// Outer container that depends on header / footer size
export const outerContainerStyle = {
  paddingTop: "var(--header-height)",
  minHeight: "200vh",
  width: "100%"
};

// Container for centering elements horizontally
export const rowContainerStyle = {    
  display: "flex",
  flexDirection: "row",
  justifyContent: "center",
};

// Container for centering elements vertically
export const columnContainerStyle = {
  display: "flex",
  flexDirection: "column",
  justifyContent: "center"
};

// Style for a grid cell
export const cellStyle = {
  height: "25px",
  width: "25px",
  border: "1px solid lightgrey",
  cursor: "pointer",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  textAlign: "center"
};
