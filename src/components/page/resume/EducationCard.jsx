import { Card } from "../../content/Card";
import { IconBullet } from "../../content/IconBullet";
import unswDark from "../../../assets/logo/unsw_dark.png";
import unswLight from "../../../assets/logo/unsw_light.png";
import dissertation from "../../../assets/publications/dissertation.pdf";

/**
 * Education card
 * @param {boolean} mobileMode whether to use mobile or desktop view
 * @param {boolean} darkMode whether to use dark or light mode
 * @returns education card for mobile mode
 */
export const EducationCard = ({ mobileMode, darkMode }) => {

  // Define bullets
  const Bullet3 = () => {
    return <IconBullet
      mobileMode={mobileMode}
      darkMode={darkMode}
      title={"PhD in Mechanical Engineering"}
      subtitle={"University of New South Wales"}
      description={[
        "Focused on applying macine learning and optimisation techniques to develop and calibrate material models for predicting the creep and tensile deformation behaviour of Alloy 617.",
      ]}
      iconLight={unswLight}
      iconDark={unswDark}
      downloadable={dissertation}
      downloadableName={"dissertation"}
      dateStart={"May 2022"}
      dateEnd={"Dec 2025"}
    />
  };
  const Bullet2 = () => {
    return <IconBullet
      mobileMode={mobileMode}
      darkMode={darkMode}
      title={"Bachelor of Mechatronic Engineering (Honours)"}
      subtitle={"University of New South Wales"}
      description={[
        "Graduated with First Class Honours and the University Medal (92 HD)."
      ]}
      iconLight={unswLight}
      iconDark={unswDark}
      dateStart={"Feb 2018"}
      dateEnd={"May 2022"}
    />
  };
  const Bullet1 = () => {
    return <IconBullet
      mobileMode={mobileMode}
      darkMode={darkMode}
      title={"Bachelor of Computer Science"}
      subtitle={"University of New South Wales"}
      description={[
        "Graduated with Distinction (92 HD)."
      ]}
      iconLight={unswLight}
      iconDark={unswDark}
      dateStart={"Feb 2018"}
      dateEnd={"May 2022"}
    />
  };

  // Return about card object
  return (
    <Card mobileMode={mobileMode} title={"Education"}>
      <Bullet3/>
      <Bullet2/>
      <Bullet1/>
    </Card>
  );
};