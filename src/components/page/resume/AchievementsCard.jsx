import { Card } from "../../content/Card";
import { IconBullet } from "../../content/IconBullet";
import unswDark from "../../../assets/logo/unsw_dark.png";
import unswLight from "../../../assets/logo/unsw_light.png";
import bssm from "../../../assets/logo/bssm.png";

/**
 * Achievements card
 * @param {boolean} mobileMode whether to use mobile or desktop view
 * @param {boolean} darkMode whether to use dark or light mode
 * @returns achievements card for mobile mode
 */
export const AchievementsCard = ({ mobileMode, darkMode }) => {

  // Define bullets
  const Bullet5 = () => {
    return <IconBullet
      mobileMode={mobileMode}
      darkMode={darkMode}
      title={"The RS Components Prize for Engineering Excellence"}
      subtitle={"University of New South Wales"}
      description={[
        "For the best performance in the final year of the undergraduate Mechatronic Engineering program."
      ]}
      iconLight={unswLight}
      iconDark={unswDark}
      dateStart={"Dec 2022"}
    />
  };
  const Bullet4 = () => {
    return <IconBullet
      mobileMode={mobileMode}
      darkMode={darkMode}
      title={"University Medal in Mechatronic Engineering"}
      subtitle={"University of New South Wales"}
      description={[
        "The University Medal is the most distinguished academic award to be bestowed on an undergraduate, and is recognition by the University of exceptional achievement."
      ]}
      iconLight={unswLight}
      iconDark={unswDark}
      dateStart={"Jun 2022"}
    />
  };
  const Bullet3 = () => {
    return <IconBullet
      mobileMode={mobileMode}
      darkMode={darkMode}
      title={"Dean's Award (Stage 4)"}
      subtitle={"University of New South Wales"}
      description={[
        "The UNSW Engineering Dean's Awards are designed to recognise the faculty's high-achieving students - those who have a minimum High Distinction average (an overall cumulative myUNSW WAM of 85)."
      ]}
      iconLight={unswLight}
      iconDark={unswDark}
      dateStart={"May 2022"}
    />
  };
  const Bullet2 = () => {
    return <IconBullet
      mobileMode={mobileMode}
      darkMode={darkMode}
      title={"Young Stress Analyst 2021 Finalist"}
      subtitle={"British Society for Strain Measurement"}
      description={[
        "The Young Stress Analyst competition is a prestigious competition run annually by the British Society for Strain Measurement, to recognise excellence in early career research."
      ]}
      iconLight={bssm}
      iconDark={bssm}
      dateStart={"Aug 2021"}
    />
  };
  const Bullet1 = () => {
    return <IconBullet
      mobileMode={mobileMode}
      darkMode={darkMode}
      title={"Dean's Award (Stage 3)"}
      subtitle={"University of New South Wales"}
      description={[
        "The UNSW Engineering Dean's Awards are designed to recognise the faculty's high-achieving students - those who have a minimum High Distinction average (an overall cumulative myUNSW WAM of 85)."
      ]}
      iconLight={unswLight}
      iconDark={unswDark}
      dateStart={"May 2021"}
    />
  };

  // Return about card object
  return (
    <Card mobileMode={mobileMode} title={"Achievements"}>
      <Bullet5/>
      <Bullet4/>
      <Bullet3/>
      <Bullet2/>
      <Bullet1/>
    </Card>
  );
};