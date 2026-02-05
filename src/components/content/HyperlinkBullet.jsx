import { titleStyle, textStyle } from "./Card";

/**
 * Hyperlink bullet point
 * @param {boolean} mobileMode whether to use mobile or desktop view
 * @param {boolean} darkMode whether to use dark or light mode
 * @param {string} iconLight bullet icon in light mode
 * @param {string} iconDark bullet icon in dark mode
 * @param {string} title bullet title
 * @param {string} text bullet text
 * @param {string} hyperlink bullet subtitle
 * @returns hyperlink bullet object
 */
export const HyperlinkBullet = ({ mobileMode, darkMode, iconLight, iconDark, title, text="", hyperlink="" }) => {
  
  // Auxiliary
  const icon = darkMode ? iconDark : iconLight;
  const fullHyperlink = `https://${hyperlink}`;

  // Container styles
  const outerContainer = {
    padding: mobileMode ? "0.3rem" : "0.4rem",
    width: "calc(100% - 1rem)",
    display: "flex",
    flexDirection: "row",
    gap: mobileMode ? "0.8rem" : "1rem",
  };
  const imageContainer = {
    height: mobileMode ? "2.5rem" : "3rem",
    width: mobileMode ? "2.5rem" : "3rem",
    borderRadius: "8px",
    backgroundColor: "var(--colour-3)",
    border: "1px solid var(--colour-4)",
  };
  const textContainer = {
    display: "flex",
    marginTop: mobileMode ? "-0.2rem" : 0,
    flexDirection: "column",
    minWidth: 0,
    flex: 1,
  };
  const hyperlinkStyle = {
    ...textStyle,
    textDecoration: "underline",
    display: "inline-block",
    width: "fit-content",
  };

  // Return hyperlink object
  return (
    <div style={outerContainer}>
      <img style={imageContainer} src={icon} alt={"Hyperlink Icon"}/>
      <div style={textContainer}>
        <div style={{ ...titleStyle, textAlign: "start" }}>{title}</div>
        {hyperlink !== "" && <a href={fullHyperlink} target="_blank" rel="noopener noreferrer" style={hyperlinkStyle}>
          {hyperlink}
        </a>}
        {text !== "" && <div style={textStyle}>{text}</div>}
      </div>
    </div>
  );
}
