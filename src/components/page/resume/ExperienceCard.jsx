import { Card } from "../../content/Card";
import { IconBullet } from "../../content/IconBullet";
import anlDark from "../../../assets/logo/anl_dark.png";
import anlLight from "../../../assets/logo/anl_light.png";
import anstoDark from "../../../assets/logo/ansto_dark.png";
import anstoLight from "../../../assets/logo/ansto_light.png";
import ms from "../../../assets/logo/ms.png";
import puDark from "../../../assets/logo/pu_dark.png";
import puLight from "../../../assets/logo/pu_light.png";
import seDark from "../../../assets/logo/se_dark.png";
import seLight from "../../../assets/logo/se_light.png";
import unswDark from "../../../assets/logo/unsw_dark.png";
import unswLight from "../../../assets/logo/unsw_light.png";

/**
 * Experience card
 * @param {boolean} mobileMode whether to use mobile or desktop view
 * @param {boolean} darkMode whether to use dark or light mode
 * @returns experience card for mobile mode
 */
export const ExperienceCard = ({ mobileMode, darkMode }) => {

  // Define bullets
  const Bullet7 = () => {
    return <IconBullet
      mobileMode={mobileMode}
      darkMode={darkMode}
      title={"Student Researcher"}
      subtitle={"Australian Nuclear Science and Technology Organisation"}
      description={[
        "Hybrid (Sydney, Australia)",
        "Developed and calibrated materials models for predicting the creep and tensile deformation behaviour of Alloy 617. The research was conducted as part of my Honours project and PhD candidature."
      ]}
      iconLight={anstoLight}
      iconDark={anstoDark}
      dateStart={"Dec 2020"}
      dateEnd={"Dec 2025"}
    />
  };
  const Bullet6 = () => {
    return <IconBullet
      mobileMode={mobileMode}
      darkMode={darkMode}
      title={"Technical Research Aide"}
      subtitle={"Argonne National Laboratory"}
      description={[
        "On-Site (Chicago, America)",
        "Assisted with DOE-sponsored projects on modelling the deformation behaviour of Alloy 617 and 709."
      ]}
      iconLight={anlLight}
      iconDark={anlDark}
      dateStart={"Aug 2024"}
      dateEnd={"Oct 2024"}
    />
  };
  const Bullet5 = () => {
    return <IconBullet
      mobileMode={mobileMode}
      darkMode={darkMode}
      title={"DevOps Engineer"}
      subtitle={"Mission Systems"}
      description={[
        "On-Site (Sydney, Australia)",
        "Maintained and upgraded Linux-based systems, with a primary focus on Ubuntu environments. Helped maintain Jenkins pipelines and supported Blender-based workflows within production environments."
      ]}
      iconLight={ms}
      iconDark={ms}
      dateStart={"Nov 2022"}
      dateEnd={"Nov 2023"}
    />
  };
  const Bullet4 = () => {
    return <IconBullet
      mobileMode={mobileMode}
      darkMode={darkMode}
      title={"Technical Research Aide"}
      subtitle={"Argonne National Laboratory"}
      description={[
        "On-Site (Chicago, America)",
        "Assisted with the development and calibration of physics-based models to predict the deformation behaviour of 316H steel."
      ]}
      iconLight={anlLight}
      iconDark={anlDark}
      dateStart={"Jun 2023"}
      dateEnd={"Sep 2023"}
    />
  };
  const Bullet3 = () => {
    return <IconBullet
      mobileMode={mobileMode}
      darkMode={darkMode}
      title={"Course Demonstrator"}
      subtitle={"University of New South Wales"}
      description={[
        "Hybrid (Sydney, Australia)",
        "Taught undergraduate students in DESN1000 (Introduction to Engineering Design and Innovation), MATH2089 (Numerical Methods and Statistics), and MTRN4010 (Advanced Autonomous Systems)."
      ]}
      iconLight={unswLight}
      iconDark={unswDark}
      dateStart={"Jan 2020"}
      dateEnd={"Nov 2022"}
    />
  };
  const Bullet2 = () => {
    return <IconBullet
      mobileMode={mobileMode}
      darkMode={darkMode}
      title={"Private Tutor"}
      subtitle={"Self-employed"}
      description={[
        "On-Site (Sydney, Australia)",
        "Taught secondary students in Maths, Physics, and Engineering in preparation for the highschool certificate (HSC)."
      ]}
      iconLight={seLight}
      iconDark={seDark}
      dateStart={"Aug 2018"}
      dateEnd={"May 2022"}
    />
  };
  const Bullet1 = () => {
    return <IconBullet
      mobileMode={mobileMode}
      darkMode={darkMode}
      title={"Primary School Tutor"}
      subtitle={"Pre-Uni College"}
      description={[
        "On-Site (Sydney, Australia)",
        "Taught primary students in English, Maths, and General Ability in preparation for the opportunity class (OC) and selective tests."
      ]}
      iconLight={puLight}
      iconDark={puDark}
      dateStart={"Jun 2018"}
      dateEnd={"Dec 2018"}
    />
  };

  // Return about card object
  return (
    <Card mobileMode={mobileMode} title={"Experience"}>
      <Bullet7/>
      <Bullet6/>
      <Bullet5/>
      <Bullet4/>
      <Bullet3/>
      <Bullet2/>
      <Bullet1/>
    </Card>
  );
};
