import { useState, useEffect } from "react";
import { Card, titleStyle, subtitleStyle, textStyle } from "./Card";

/**
 * Activity card for the body
 * @param {boolean} mobileMode whether to use mobile or desktop view
 * @param {boolean} darkMode whether to use dark or light mode
 * @param {boolean} status defines the status of the activity
 * @param {function} setStatus sets the activity status
 * @param {function} setActivity function to start/stop the activity
 * @param {string} iconLight bullet icon in light mode
 * @param {string} iconDark bullet icon in dark mode
 * @param {string} title card title (must be unique)
 * @param {string} subtitle bullet subtitle
 * @param {string[]} description bullet subtext
 * @returns activity card object
 */
export const ActivityCard = ({
  mobileMode, darkMode, status, setStatus, setActivity,
  title, subtitle, description=[], iconLight, iconDark
}) => {

  // Monitor activity status
  const isActive = status === title;
  useEffect(() => {if (!isActive) setActivity(false)}, [isActive, setActivity]);

  // Auxiliary
  const icon = darkMode ? iconDark : iconLight;
  const statusText = isActive ? "Stop" : "Start";

  // Starts and stops the activity
  const handleActivity = () => {
    if (isActive) {
      setActivity(false);
      setStatus("none");
    } else {
      setActivity(true);
      setStatus(title);
    };
  };

  // Container styles
  const outerContainer = {
    padding: mobileMode ? "0.3rem" : "0.4rem",
    width: "calc(100% - 1rem)",
    display: "flex",
    flexDirection: "row",
    gap: mobileMode ? "0.8rem" : "1rem",
  };
  const imageContainer = {
    border: "1px solid var(--colour-4)",
    height: mobileMode ? "6rem" : "8rem",
    width: mobileMode ? "6rem" : "8rem",
    borderRadius: "8px",
    backgroundColor: "var(--colour-3)",
  };
  const textContainer = {
    display: "flex",
    marginTop: mobileMode ? "-0.2rem" : 0,
    flexDirection: "column",
    minWidth: 0,
    flex: 1,
  };
  const buttonContainer = {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-end",
  };
  const buttonStyle = {
    ...titleStyle,
    border: "1px solid var(--colour-4)",
    borderRadius: "4px",
    backgroundColor: "var(--colour-2)",
    cursor: "pointer",
    padding: "0.2rem",
    width: "3rem",
    alignItems: "center",
  };

  // For additional description
  const AdditionalDescription = () => {
    const symbolStyle = {
      ...titleStyle,
      fontSize: mobileMode ? "0.6rem" : "1rem",
      paddingTop: mobileMode ? "0.3rem" : "0rem",
    };
    const bulletStyle = {
      paddingLeft: "0.2rem",
      paddingRight: "0.2rem",
      width: "calc(100% - 1rem)",
      display: "flex",
      flexDirection: "row",
      alignItems: "flex-start",
      gap: mobileMode ? "0.8rem" : "1rem",
    };
    const descriptionStyle = {
      ...textStyle,
      // marginTop: "0.4rem",
      textAlign: mobileMode ? "start" : "justify",
      display: "block"
    };
    return (
      <div>
        {description.map((text, idx) => {
          return (
            <div style={bulletStyle} key={idx}>
              <div style={symbolStyle}>{"●"}</div>
              <div style={descriptionStyle}>{text}</div>
            </div>
          );
        })}
      </div>
    );
  };

  // Mobile card
  const MobileCard = () => {
    return (
      <div style={outerContainer}>
        <img style={imageContainer} src={icon} alt="Icon for mobile mode"/>
        <div style={textContainer}>
          <div style={{ ...subtitleStyle, textAlign: "start", paddingBottom: "0.4rem" }}>{subtitle}</div>
          <AdditionalDescription/>
        </div>
        <div style={buttonContainer}>
          <div style={buttonStyle} onClick={() => {handleActivity()}}>{statusText}</div>
        </div>
      </div>
    );
  };

  // Desktop card
  const DesktopCard = () => {
    return (
      <div style={outerContainer}>
        <img style={imageContainer} src={icon} alt="Icon for mobile mode"/>
        <div style={textContainer}>
          <div style={{ ...subtitleStyle, textAlign: "start", paddingBottom: "0.4rem" }}>{subtitle}</div>
          <AdditionalDescription/>
        </div>
        <div style={buttonContainer}>
          <div style={buttonStyle} onClick={() => {handleActivity()}}>{statusText}</div>
        </div>
      </div>
    );
  };

  // Return activity card
  return (
    <Card mobileMode={mobileMode} title={title}>
      {mobileMode ? <MobileCard/> : <DesktopCard/>}
    </Card>
  );
}
