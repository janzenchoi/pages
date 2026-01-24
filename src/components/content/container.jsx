/**
 * Container for the body
 * @param {boolean} mobileMode whether to use mobile or desktop view
 * @returns container object
 */
export const Container = ({ mobileMode, children }) => {

  // Container style for the body
  const containerStyle = {
    maxWidth: MAX_WIDTH,
    width: "100%",
    backgroundColor: "var(--colour-1)",
    padding: "10px",
    margin: "10px",
    height: "100px",
  }

  // Return body object
  return (
    <div style={containerStyle}>
    </div>
  );
}