import { useState, useEffect } from "react";
import { InteractiveCard } from "./InteractiveCard";
import { ImmersiveCard } from "./ImmersiveCard";
import { Puppet } from "../../stuff/human/Puppet";
import { Controller } from "../../stuff/human/Controller";
import { Joystick } from "../../stuff/human/Joystick";

/**
 * Activities page
 * @param {boolean} mobileMode whether to use mobile or desktop view
 * @param {boolean} colourTheme the theme to colour the site
 * @param {*} activityController controller for activities
 * @returns activities page
 */
export const Activities = ({ mobileMode, colourTheme, activityController }) => {
  
  // Monitor colour theme
  const [darkMode, setDarkMode] = useState(colourTheme === "dark");
  useEffect(() => {
    setDarkMode(colourTheme === "dark");
  }, [colourTheme]);

  // Render
  return (
    <div>
      <InteractiveCard mobileMode={mobileMode} darkMode={darkMode} activityController={activityController}/>
      <ImmersiveCard mobileMode={mobileMode} darkMode={darkMode} activityController={activityController}/>
      {/* <Puppet darkMode={colourTheme === "dark"}/>
      <Controller darkMode={colourTheme === "dark"}/> */}
      {/* <Joystick/> */}
    </div>
  );
}