import { useState } from "react";
import { Card } from "../../content/Card";
import { PublicationBullet } from "../../content/PublicationBullet";
import { Expander } from "../../content/Expander";
import paper5 from "../../../assets/publications/paper_5.pdf";
import paper4 from "../../../assets/publications/paper_4.pdf";
import paper3 from "../../../assets/publications/paper_3.pdf";
import paper2 from "../../../assets/publications/paper_2.pdf";
import paper1 from "../../../assets/publications/paper_1.pdf";

/**
 * Publications card
 * @param {boolean} mobileMode whether to use mobile or desktop view
 * @param {boolean} darkMode whether to use dark or light mode
 * @returns publications card for mobile mode
 */
export const PublicationsCard = ({ mobileMode, darkMode }) => {
  const [open, setOpen] = useState(false);

  // Define bullets
  const Bullet5 = () => {
    return <PublicationBullet
      mobileMode={mobileMode}
      darkMode={darkMode}
      title={"Multi-Objective Surrogate-Assisted Calibration of CPFEM Models Using Macroscopic Response and In Situ EBSD Measurements of Grain Reorientation Trajectories"}
      subtitle={"Acta Materialia"}
      description={[
        "J. Choi, O. Muránsky, M.C. Messner, T. Wei, T. Hu, J.J. Kruzic, M.D. McMurtrey",
        "This study presents a multi-objective surrogate-assisted calibration workflow for crystal plasticity finite element method (CPFEM) models that combines a genetic algorithm with a deep neural network surrogate to efficiently identify model parameters. The workflow is applied to three CPFEM formulations using in situ EBSD data from Alloy 617 under tensile loading. The results show accurate stress-strain and texture predictions, physically consistent parameters, and good transferability to higher-fidelity microstructural models."
      ]}
      link={"https://doi.org/10.1016/j.actamat.2025.121809"}
      downloadable={paper5}
      date={"Feb 2026"}
    />
  };
  const Bullet4 = () => {
    return <PublicationBullet
      mobileMode={mobileMode}
      darkMode={darkMode}
      title={"Multi-objective Calibration of Elastic-Viscoplastic Models to Capture the Elevated-Temperature Creep and Tensile Behaviour of Alloy 617"}
      subtitle={"International Journal of Pressure Vessels and Piping"}
      description={[
        "J. Choi, O. Muránsky, M.C. Messner, J.J. Kruzic, M.D. McMurtrey",
        "This study presents a multi-objective three-stage calibration workflow for elastic-viscoplastic (EVP) models that uses a genetic algorithm. The workflow is applied to two EVP formulations using high-temperature creep and tensile data of Alloy 617 to failure. The results show accurate creep predictions and reasonable tensile predictions when using a work-based damage formulation at the cost of increased calibration complexity."
      ]}
      link={"https://doi.org/10.1016/j.ijpvp.2025.105566"}
      downloadable={paper4}
      date={"Dec 2025"}
    />
  };
  const Bullet3 = () => {
    return <PublicationBullet
      mobileMode={mobileMode}
      darkMode={darkMode}
      title={"A mechanistic model for creep and thermal aging in Alloy 709"}
      subtitle={"U.S. Department of Energy Office of Scientific and Technical Information"}
      description={[
        "T. Hu, J. Choi, M.C. Messner",
        "The report develops a physics-based crystal plasticity model to predict creep and thermal aging in Alloy 709, an advanced austenitic alloy for future reactors with limited test data. By incorporating key deformation and failure mechanisms and using surrogate modeling with stochastic calibration, the approach enables more accurate long-term creep life predictions than traditional empirical methods."
      ]}
      link={"https://doi.org/10.2172/1999400"}
      downloadable={paper3}
      date={"Sep 2023"}
    />
  };
  const Bullet2 = () => {
    return <PublicationBullet
      mobileMode={mobileMode}
      darkMode={darkMode}
      title={"On the prediction of creep behaviour of alloy 617 using Kachanov-Rabotnov model coupled with multi-objective genetic algorithm optimisation"}
      subtitle={"International Journal of Pressure Vessels and Piping"}
      description={[
        "J. Choi, L.B. Neto, R.N. Wright, J.J. Kruzic, O. Muránsky",
        "This study combines the Kachanov-Rabotnov (K-R) creep model with a multi-objective genetic algorithm to predict the elevated-temperature creep behaviour of Alloy 617 under various stresses. While the calibrated model accurately captures creep behaviour where oxidation effects are negligible, its predictions remain reliable only within the inherent limitations of the K-R formulation at higher temperatures."
      ]}
      link={"https://doi.org/10.1016/j.ijpvp.2022.104721"}
      downloadable={paper2}
      date={"Oct 2022"}
    />
  };
  const Bullet1 = () => {
    return <PublicationBullet
      mobileMode={mobileMode}
      darkMode={darkMode}
      title={"Multi-objective genetic algorithm for material parameter optimisation to predict high-temperature creep behaviour"}
      subtitle={"British Society for Strain Measurement"}
      description={[
        "J. Choi, L.B. Neto, R.N. Wright, J.J. Kruzic, O. Muránsky",
        "The study presents a multi-objective calibration approach to predict long-term creep behaviour of Alloy 617 from short-term data by optimising a Kachanov-Rabotnov (K-R) model. The method performs well at 800°C but loses accuracy at 900-1000°C due to oxidation effects not captured by the K-R model."
      ]}
      link={""}
      downloadable={paper1}
      date={"Sep 2021"}
    />
  };

  // Return about card object
  return (
    <Card title={"Publications"}>
      <div>
        <Bullet5/>
        <Bullet4/>
        <Bullet3/>
      </div>
      {open && <div>
        <Bullet2/>
        <Bullet1/>
      </div>}
      <Expander mobileMode={mobileMode} open={open} setOpen={setOpen}/>
    </Card>
  );
};