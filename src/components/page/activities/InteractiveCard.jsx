import { Card } from "../../content/Card";
import { JanzenActivity } from "./interactive/JanzenActivity";
import { SoccerActivity } from "./interactive/SoccerActivity";

/**
 * Interactive card
 * @param {boolean} mobileMode whether to use mobile or desktop view
 * @param {boolean} darkMode whether to use dark or light mode
 * @param {*} activityController controller for activities
 * @returns interactive card
 */
export const InteractiveCard = ({ mobileMode, darkMode, activityController }) => {

  const Bullet1 = () => <JanzenActivity mobileMode={mobileMode} darkMode={darkMode} activityController={activityController}/>;
  const Bullet2 = () => <SoccerActivity mobileMode={mobileMode} darkMode={darkMode} activityController={activityController}/>;

  // Return about card object
  return <Card mobileMode={mobileMode} title="Interactive">
    <Bullet1/>
    <Bullet2/>
  </Card>
};
