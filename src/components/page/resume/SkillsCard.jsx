import { Card } from "../../content/Card";
import { TextBullet } from "../../content/TextBullet";

/**
 * Skills card
 * @param {boolean} mobileMode whether to use mobile or desktop view
 * @param {boolean} darkMode whether to use dark or light mode
 * @returns skills card for mobile mode
 */
export const SkillsCard = ({ mobileMode, darkMode }) => {

  // Define bullets
  const Bullet4 = () => {
    return <TextBullet
      mobileMode={mobileMode}
      darkMode={darkMode}
      title={"Academic research"}
      subtitle={"(machine learning, optimisation, computational modelling)"}
    />
  };
  const Bullet3 = () => {
    return <TextBullet
      mobileMode={mobileMode}
      darkMode={darkMode}
      title={"Programming skills"}
      subtitle={"(Bash, C, C++, Java, JavaScript, MATLAB, Python, SQL)"}
    />
  };
  const Bullet2 = () => {
    return <TextBullet
      mobileMode={mobileMode}
      darkMode={darkMode}
      title={"Software proficiency"}
      subtitle={"(CAD, FEM, MS Suite)"}
    />
  };
  const Bullet1 = () => {
    return <TextBullet
      mobileMode={mobileMode}
      darkMode={darkMode}
      title={"Multilingual"}
      subtitle={"(Cantonese, English, German, Hokkien, Indonesian, Mandarin)"}
    />
  };

  // Return about card object
  return (
    <Card mobileMode={mobileMode} title={"Skills"}>
      <Bullet4/>
      <Bullet3/>
      <Bullet2/>
      <Bullet1/>
    </Card>
  );
};