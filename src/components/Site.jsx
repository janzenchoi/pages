import { useState, useEffect } from "react";
import { HashRouter } from "react-router-dom";
import { Header } from "./Header";
import { useViewport } from "../helper/Viewport";
import { DEFAULT_MODE } from "../helper/brightness";
import { getStoredValue } from "../helper/storage";
import { Body } from "./Body";

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

  // Define style for site
  const siteStyle = {
    backgroundColor: "var(--colour-0)",
    transition: "background-color 0.3s",
    minWidth: "400px",
  };

  // Returns the site
  return <div style={siteStyle}>
    <HashRouter>
      <Header mobileMode={mobileMode} forceMobile={forceMobile} setForceMobile={setForceMobile} colourTheme={colourTheme} setColourTheme={setColourTheme}/>
      <Body mobileMode={mobileMode} colourTheme={colourTheme}/>
    </HashRouter>
  </div>
}