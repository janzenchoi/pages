import { useState } from "react";
import { titleStyle, subtitleStyle, textStyle, verticalDividerStyle } from "./Card";

/**
 * Project bullet point
 * @param {boolean} mobileMode whether to use mobile or desktop view
 * @param {boolean} darkMode whether to use dark or light mode
 * @param {string} title bullet title
 * @param {string} subtitle bullet subtitle
 * @param {string[]} description bullet subtext
 * @param {*} link link to publication
 * @param {*} downloadable file to download
 * @param {string} date date
 * @returns project bullet object
 */
export const PublicationBullet = ({ mobileMode, darkMode, title, subtitle, description=[], link=null, downloadable=null, date="" }) => {
  const [open, setOpen] = useState(false);
  const [hover, setHover] = useState(false);

  // Auxiliary
  const dateText = mobileMode ? `(${date})` : date;

  // Container styles
  const outerContainer = {
    padding: "0.4rem",
    marginBottom: open ? "0.4rem" : "0",
    width: "calc(100% - 1rem)",
    display: "flex",
    flexDirection: "row",
    backgroundColor: hover ? "var(--colour-1)" : "transparent",
    cursor: "pointer",
    gap: "1rem",
  };
  const textContainer = {
    display: "flex",
    flexDirection: "column",
    minWidth: 0,
    flex: 1,
  };
  const dateContainer = {
    ...textStyle,
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
  };
  const arrowStyle = {
    marginRight: "0.4rem",
    marginBottom: "0.4rem",
    width: "5px",
    height: "5px",
    display: "inline-block",
    borderLeft: "2px solid currentColor",
    borderBottom: "2px solid currentColor",
    transformOrigin: "50% 70%",
    transition: "transform 0.3s ease",
    transform: open ? "scaleX(-1) rotate(135deg)" : "rotate(-45deg)",
    position: "absolute",
    color: "var(--colour-6)",
    bottom: 0,
    right: 0
  };

  // For hyperlinks
  const Hyperlink = () => {
    const fullLink = `https://${link}`;
    const hyperlinkStyle = {
      display: "flex",
      flexDirection: mobileMode ? "column" : "row",
      position: "relative",
      overflowWrap: "anywhere",
    };
    return (
      <div style={hyperlinkStyle}>
        {link !== "" && <a href={fullLink} target="_blank" rel="noopener noreferrer">
          <div style={{ ...textStyle, textDecoration: "underline" }}>{link}</div>
        </a>}
        {!mobileMode && <div style={{ width: "0.4rem" }}/>}
        {downloadable !== null && <a href={downloadable} download={"publication"}>
          <div style={{ ...textStyle, textDecoration: "underline" }}>(download)</div>
        </a>}
      </div>
    );
  };

  // For additional description
  const AdditionalDescription = () => {
    const descriptionStyle = {
      ...textStyle,
      marginTop: "0.4rem",
      textAlign: mobileMode ? "start" : "justify",
    };
    return (
      <div style={{ display: "flex", flexDirection: "row", justifyContent: "flex-start" }}>
        <div style={verticalDividerStyle}/>
        <div>
          {description.map((text, idx) => (
            <div key={idx}>
              <div style={descriptionStyle}>{text}</div>
            </div>
          ))}
          <div style={{ marginTop: "0.4rem" }}/>
          <Hyperlink/>
        </div>
      </div>
    );
  };

  // Mobile bullet object
  const MobileBullet = () => {
    return (
      <div
        style={outerContainer}
        onClick={() => setOpen(!open)}
      >
        <div style={textContainer}>
          <div style={{ ...titleStyle, fontSize: "1rem", textAlign: "start" }}>{title}</div>
          <div style={{ ...subtitleStyle, textAlign: "start" }}>{subtitle}</div>
          <div style={dateContainer}>{dateText}</div>
          {open && <AdditionalDescription/>}
        </div>
        <div style={{ position: "relative", width: "0.8rem" }}>
          <div style={arrowStyle}/>
        </div>
      </div>
    );
  };

  // Desktop bullet object
  const DesktopBullet = () => {
    return (
      <div
        style={outerContainer}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        onClick={() => setOpen(!open)}
      >
        <div style={textContainer}>
          <div style={{ ...titleStyle, textAlign: "start" }}>{title}</div>
          <div style={{ ...subtitleStyle, textAlign: "start" }}>{subtitle}</div>
          {open && <AdditionalDescription/>}
        </div>
        <div style={{ position: "relative" }}>
          <div style={dateContainer}>{dateText}</div>
          <div style={arrowStyle}/>
        </div>
      </div>
    );
  };

  // Return bullet object
  return (mobileMode ? <MobileBullet/> : <DesktopBullet/>);
}
