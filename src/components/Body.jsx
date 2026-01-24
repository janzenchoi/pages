import { Routes, Route } from "react-router-dom";
import { Home } from "./pages/Home";
import { Template } from "./pages/Template";

/**
 * The body of the page
 * @param {boolean} mobileMode whether to use mobile or desktop view
 * @param {boolean} colourTheme the theme to colour the site
 * @returns body object
 */
export const Body = ({mobileMode, colourTheme}) => {

  // Main style for the body
  const mainStyle = {
    paddingTop: "var(--header-height)",
    minHeight: "2000px",
    // minHeight: "calc(100vh - var(--header-height))",
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
  }

  // Return body object
  return (
    <div style={mainStyle}>
      <Routes>
        <Route path="/" element={<Home mobileMode={mobileMode} colourTheme={colourTheme}/>}/>
        <Route path="/template" element={<Template/>}/>
      </Routes>
    </div>
  );
}