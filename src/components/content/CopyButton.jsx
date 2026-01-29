import { useState } from "react";
import copyDark from "../../assets/icon/copy_dark.png";
import copyLight from "../../assets/icon/copy_light.png";
import tickDark from "../../assets/icon/tick_dark.png";
import tickLight from "../../assets/icon/tick_light.png";

/**
 * Copy button
 * @param {boolean} mobileMode whether to use mobile or desktop view
 * @param {boolean} darkMode whether to use dark or light mode
 * @param {String} textToCopy text that will be added to the clipboard
 * @returns 
 */
export const CopyButton = ({ mobileMode, darkMode, textToCopy }) => {

  // Initialise
  const [copied, setCopied] = useState(false);
  const copyImage = darkMode ? copyDark : copyLight;
  const tickImage = darkMode ? tickDark : tickLight;

  // Copy handler function
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 1000);
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  // Button style
  const outerContainer = {
    height: mobileMode ? "0.5rem" : "1rem",
    width: mobileMode ? "0.5rem" : "1rem",
    padding: "0.25rem",
    borderRadius: "4px",
    boxShadow: "0 0px 2px var(--colour-4)",
    cursor: "pointer",
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
  };
  const innerContainer = {
    height: mobileMode ? "0.5rem" : "1rem",
    width: mobileMode ? "0.5rem" : "1rem",
    position: "relative",
  };
  const imageStyle = {
    height: "100%",
    width: "100%",
    transition: "opacity 0.5s",
    position: "absolute",
  };

  // Button icon
  const CopyIcon = () => {
    return <img style={{ ...imageStyle, opacity: copied ? 0 : 1 }} src={copyImage}/>
  };
  const TickIcon = () => {
    return <img style={{ ...imageStyle, opacity: copied ? 1 : 0}} src={tickImage}/>
  };

  // Return copy button
  return (
    <div style={outerContainer} onClick={handleCopy}>
      <div style={innerContainer}>
        <CopyIcon/>
        <TickIcon/>
      </div>
    </div>
  );
};
