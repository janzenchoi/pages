import { useState, useEffect } from "react";
import { ProfileImage } from "../content/ProfileImage";
// import { Container } from "../content/Container";

/**
 * Home page
 * @param {boolean} mobileMode whether to use mobile or desktop view
 * @param {boolean} colourTheme the theme to colour the site
 * @returns home object
 */
export const Home = ({mobileMode, colourTheme}) => {

  // Monitor colour theme
  const [darkMode, setDarkMode] = useState(colourTheme === "dark");
  useEffect(() => {
    setDarkMode(colourTheme === "dark");
  }, [colourTheme]);

  // Return home object
  return (
    <div>
      <ProfileImage toggle={darkMode}/>
      {/* <Container toggle={darkMode}/> */}
    </div>
  );
}