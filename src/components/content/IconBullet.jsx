import { useState } from "react";
import { titleStyle, subtitleStyle, textStyle, verticalDividerStyle } from "./Card";

/**
 * Icon bullet point
 * @param {boolean} mobileMode whether to use mobile or desktop view
 * @param {boolean} darkMode whether to use dark or light mode
 * @param {string} iconLight bullet icon in light mode
 * @param {string} iconDark bullet icon in dark mode
 * @param {string} title bullet title
 * @param {string} subtitle bullet subtitle
 * @param {string[]} description bullet subtext
 * @param {string[]} downloadable downloadable file
 * @param {string[]} downloadableName downloadable file name
 * @param {string} dateStart starting date
 * @param {string} dateEnd ending date
 * @returns icon bullet object
 */
export const IconBullet = ({
  mobileMode, darkMode, iconLight, iconDark, title, subtitle,
  description=[], downloadable=null, downloadableName="file", dateStart="", dateEnd=""
}) => {
  const [open, setOpen] = useState(false);
  const [hover, setHover] = useState(false);

  // Auxiliary
  const dateText = Boolean(dateStart) || Boolean(dateEnd)
  ? mobileMode
    ? `(${[dateStart, dateEnd].filter(Boolean).join(" - ")})`
    : `${[dateStart, dateEnd].filter(Boolean).join(" - ")}`
  : "";
  const icon = darkMode ? iconDark : iconLight;

  // Container styles
  const outerContainer = {
    padding: mobileMode ? "0.3rem" : "0.4rem",
    marginBottom: open ? "0.4rem" : "0",
    width: "calc(100% - 1rem)",
    display: "flex",
    flexDirection: "row",
    backgroundColor: hover ? "var(--colour-1)" : "transparent",
    cursor: "pointer",
    gap: mobileMode ? "0.8rem" : "1rem",
  };
  const imageContainer = {
    height: mobileMode ? "3rem" : "4.5rem",
    width: mobileMode ? "3rem" : "4.5rem",
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

  // For additional description
  const AdditionalDescription = () => {
    const descriptionStyle = {
      ...textStyle,
      marginTop: "0.4rem",
      textAlign: mobileMode ? "start" : "justify",
      display: "block"
    };
    const downloadStyle = {
      fontWeight: 400,
      fontSize: "1rem",
      color: "var(--colour-5)",
      textDecoration: "underline",
      whiteSpace: "nowrap"
    };
    return (
      <div style={{ display: "flex", flexDirection: "row", justifyContent: "flex-start" }}>
        <div style={verticalDividerStyle} />
        <div>{description.map((text, idx) => {
          return (
            <div key={idx}>
              <div style={descriptionStyle}>{text}
                {idx === description.length - 1 && downloadable !== null && (<>{" "}
                  <a href={downloadable} download={downloadableName}>
                    <span style={downloadStyle}>({downloadableName})</span>
                  </a></>)}
              </div>
            </div>
          );
        })}</div>
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
        <img style={imageContainer} src={icon}/>
        <div style={textContainer}>
          <div style={{ ...titleStyle, textAlign: "start" }}>{title}</div>
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
        <img style={imageContainer} src={icon}/>
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
