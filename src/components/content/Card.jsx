/**
 * Card for the body
 * @param {boolean} mobileMode whether to use mobile or desktop view
 * @param {string} title card title
 * @param {*} children card items
 * @returns card object
 */
export const Card = ({ mobileMode, title, children }) => {

  // Container style for the card
  const containerStyle = {
    padding: "0.6rem 1rem 1rem 1rem",
    backgroundColor: "var(--colour-0)",
    transition: "background-color 0.3s ease",
    marginTop: "0.4rem",
    marginBottom: "0.4rem",
    boxShadow: "0 0px 3px var(--colour-4)",
    borderRadius: mobileMode ? "0px" : "8px",
    overflow: "hidden",
  };

  // Style for title
  const headerStyle = {
    width: "100%",
    fontWeight: 600,
    fontSize: "1.2rem",
    color: "var(--colour-7)",
    paddingBottom: "0.6rem",
  };

  // Return body object
  return (
    <div style={containerStyle}>
      <div style={headerStyle}>{title}</div>
      <div style={horizontalDividerStyle}/>
      {children}
    </div>
  );
}

/**
 * Horizontal divider style
 */
export const horizontalDividerStyle = {
  width: "100%",
  height: "1px",
  margin: "0 0 0.4rem 0",
  backgroundColor: "var(--colour-4)",
  transition: "background-color 0.3s ease",
  opacity: 0.8,
}

/**
 * Title style
 */
export const titleStyle = {
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  textAlign: "justify",
  fontWeight: 500,
  fontSize: "1.05rem",
  color: "var(--colour-6)",
};

/**
 * Subtitle style
 */
export const subtitleStyle = {
  ...titleStyle,
  fontWeight: 400,
  fontSize: "1rem",
};

/**
 * Text style
 */
export const textStyle = {
  ...titleStyle,
  fontWeight: 400,
  fontSize: "1rem",
  color: "var(--colour-5)",
};
