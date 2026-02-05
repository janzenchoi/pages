import { Routes, Route } from "react-router-dom";
import { Home } from "./page/home/Home";
import { Resume } from "./page/resume/Resume";
import { Activities } from "./page/activities/Activities";
import { HEADER_HEIGHT, FOOTER_HEIGHT, MAX_WIDTH } from "../helper/constant";

/**
 * The body of the page
 * @param {boolean} mobileMode whether to use mobile or desktop view
 * @param {boolean} colourTheme the theme to colour the site
 * @param {*} activityController controller for activities
 */
export const Body = ({ mobileMode, colourTheme, activityController }) => {

  // Container styles
  const outerStyle = {
    marginTop: HEADER_HEIGHT,
    minHeight: `calc(100vh - ${FOOTER_HEIGHT} - ${HEADER_HEIGHT})`,
    width: "100%",
    display: "flex",
    justifyContent: "center",
    boxSizing: "border-box",
    backgroundColor: "var(--colour-1)",
    boxShadow: "0 0px 2px var(--colour-5)",
    transition: "background-color 0.3s ease",
  };
  const innerStyle = {
    maxWidth: MAX_WIDTH,
    width: "100%",
    boxSizing: "border-box",
  };

  // Return body object
  return (
    <div style={outerStyle}>
      <div style={innerStyle}>
        <Routes>
          <Route path="/" element={<Home mobileMode={mobileMode} colourTheme={colourTheme}/>}/>
          <Route path="/home" element={<Home mobileMode={mobileMode} colourTheme={colourTheme}/>}/>
          <Route path="/resume" element={<Resume mobileMode={mobileMode} colourTheme={colourTheme}/>}/>
          <Route path="/activities" element={<Activities mobileMode={mobileMode} colourTheme={colourTheme} activityController={activityController}/>}/>
        </Routes>
      </div>
    </div>
  );
};
