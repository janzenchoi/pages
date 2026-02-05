import { useState, useEffect } from "react";
import { SoccerActivity } from "./SoccerActivity";
import { JanzenActivity } from "./JanzenActivity";
import { Puppet } from "../../stuff/human/Puppet";
import { Controller } from "../../stuff/human/Controller";

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

  // Define cards
  const sharedProps = {
    mobileMode,
    darkMode,
    activityController,
  };
  const Card1 = () => <JanzenActivity {...sharedProps}/>;
  const Card2 = () => <SoccerActivity {...sharedProps}/>;

  // Render
  return (
    <div>
      <Card1/>
      <Card2/>
      {/* <Puppet darkMode={colourTheme === "dark"}/>
      <Controller darkMode={colourTheme === "dark"}/> */}
    </div>
  );
}