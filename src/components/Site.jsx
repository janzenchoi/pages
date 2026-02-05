import { useState, useEffect } from "react";
import { HashRouter } from "react-router-dom";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { useViewport } from "../helper/Viewport";
import { DEFAULT_MODE, HEADER_HEIGHT } from "../helper/constant";
import { getStoredValue } from "../helper/storage";
import { Body } from "./Body";
import { Ball } from "./stuff/Ball";
import { Character } from "./stuff/human/Character";

import fg_dark from "../assets/janzen/fg_dark.png";
import fg_light from "../assets/janzen/fg_light.png";


/**
 * Site
 * @returns site object
 */
export const Site = () => {
  
  // Deals with dark / light mode
  const [colourTheme, setColourTheme] = useState(() => {
    return getStoredValue("colour-theme") || DEFAULT_MODE;
  });

  // Deals with mobile / desktop state
  const { isMobile } = useViewport();
  const [ forceMobile, setForceMobile ] = useState(getStoredValue("force-mobile") === "true");
  const [ mobileMode, setMobileMode ] = useState(isMobile || forceMobile);
  useEffect(() => {
    setMobileMode(isMobile || forceMobile);
  }, [isMobile, forceMobile]);

  // Activities
  const [status, setStatus] = useState("none");
  const [ ballExists, setBallExists ] = useState(false);
  const [ janzenExists, setJanzenExists ] = useState(false);
  const activityController = {
    status,
    setStatus,
    setBallExists,
    setJanzenExists
  };

  // Define style for site
  const siteStyle = {
    backgroundColor: "var(--colour-0)",
    transition: "all 0.3s ease",
  };
  
  // FG object
  const FgObject = () => {
    const janzenFgStyle = {
      top: `calc(${HEADER_HEIGHT} - 42px)`,
      height: "40px",
      width: "auto",
      display: "block",
      position: "absolute",
      left: "calc(50% - 5rem)",
      zIndex: 10,
    };
    const fg_image = colourTheme === "dark" ? fg_dark : fg_light;
    return <img style={janzenFgStyle} src={fg_image} alt={"Janzen as a French girl"}/>;
  };

  // Returns the site
  return <div style={siteStyle}>
    <HashRouter>
      <FgObject/>
      <Header
        mobileMode={mobileMode}
        forceMobile={forceMobile}
        setForceMobile={setForceMobile}
        colourTheme={colourTheme}
        setColourTheme={setColourTheme}
        />
      <div>
        <Body
          mobileMode={mobileMode}
          colourTheme={colourTheme}
          activityController={activityController}
        />
      </div>
      <Footer/>
      {ballExists && <Ball/>}
      {janzenExists && <Character mobileMode={mobileMode} darkMode={colourTheme === "dark"}/>}
    </HashRouter>
  </div>
}