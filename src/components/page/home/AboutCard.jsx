import { ProfileImage } from "../../content/ProfileImage";
import { Card, titleStyle, textStyle } from "../../content/Card";

/**
 * About card
 * @param {boolean} mobileMode whether to use mobile or desktop view
 * @param {boolean} darkMode whether to use dark or light mode
 * @returns about card for mobile mode
 */
export const AboutCard = ({ mobileMode, darkMode }) => {
  
  // Text
  const text1 = "Hello, I'm Janzen Choi.";
  const text2 = "I am a PhD-trained engineer and programmer.";
  const text3 = "I am passionate about solving challenging problems and contributing to projects with real-world impact."

  // Returns the desktop version
  const DesktopObject = () => {
    return <div style={{ display: "flex", flexDirection: "row", gap: "1rem" }}>
      <div style={{ display: "flex", flexDirection: "column", flex: "0 0 50%" }}>
        <ProfileImage darkMode={darkMode}/>
      </div>
      <div style={{ display: "flex", flexDirection: "column", flex: 1, gap: "0.8rem" }}>
        <div style={{ ...titleStyle, textAlign: "start" }}>{text1}</div>
        <div style={{ ...textStyle, textAlign: "start" }}>{text2}</div>
        <div style={{ ...textStyle, textAlign: "start" }}>{text3}</div>
      </div>
    </div>
  };

  // Returns the mobile version
  const MobileObject = () => {
    return <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
      <div style={titleStyle}>{text1}</div>
      <div style={{ height: "200px" }}>
        <ProfileImage darkMode={darkMode}/>
      </div>
      <div style={textStyle}>{text2} {text3}</div>
    </div>
  };

  // Return about card object
  return <Card mobileMode={mobileMode} title="About">
    {!mobileMode && <DesktopObject/>}
    {mobileMode && <MobileObject/>}
  </Card>
};
