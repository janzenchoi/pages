import { Card } from "../../content/Card";
import { Puppet } from "../../stuff/human/Puppet";
import { Controller } from "../../stuff/human/Controller";
import { Character } from "../../stuff/human/Character";

/**
 * Activities page
 * @param {boolean} mobileMode whether to use mobile or desktop view
 * @param {boolean} colourTheme the theme to colour the site
 * @returns activities page
 */
export const Activities = ({ mobileMode, colourTheme }) => {
  return (
    <div>
      <Card mobileMode={mobileMode} title={"NOTHING"}/>
      {/* <Puppet darkMode={colourTheme === "dark"}/> */}
      {/* <Controller/> */}
      <Character darkMode={colourTheme === "dark"}/>
    </div>
  );
}