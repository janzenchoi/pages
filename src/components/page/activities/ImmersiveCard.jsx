import { Card, textStyle } from "../../content/Card";

/**
 * Immersive card
 * @param {boolean} mobileMode whether to use mobile or desktop view
 * @param {boolean} darkMode whether to use dark or light mode
 * @param {*} activityController controller for activities
 * @returns immersive card
 */
export const ImmersiveCard = ({ mobileMode, darkMode, activityController }) => {

  // Return about card object
  return <Card mobileMode={mobileMode} title="Immersive">
    <div style={{ ...textStyle, marginBottom: "0.8em" }}>
      Come back again to play clones of some popular games
    </div>
  </Card>
};
