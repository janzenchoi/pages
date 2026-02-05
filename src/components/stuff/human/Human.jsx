import { Stick } from "./Stick";

// Images
import foreFootImage from "../../../assets/stuff/human/fore_foot.png";
import foreHandImage from "../../../assets/stuff/human/fore_hand.png";
import foreLowerArmImage from "../../../assets/stuff/human/fore_lower_arm.png";
import foreLowerLegImage from "../../../assets/stuff/human/fore_lower_leg.png";
import foreUpperArmImage from "../../../assets/stuff/human/fore_upper_arm.png";
import foreUpperLegImage from "../../../assets/stuff/human/fore_upper_leg.png";
import headImage from "../../../assets/stuff/human/head.png";
import hindFootImage from "../../../assets/stuff/human/hind_foot.png";
import hindHandImage from "../../../assets/stuff/human/hind_hand.png";
import hindLowerArmImage from "../../../assets/stuff/human/hind_lower_arm.png";
import hindLowerLegImage from "../../../assets/stuff/human/hind_lower_leg.png";
import hindUpperArmImage from "../../../assets/stuff/human/hind_upper_arm.png";
import hindUpperLegImage from "../../../assets/stuff/human/hind_upper_leg.png";
import hipImage from "../../../assets/stuff/human/hip.png";
import torsoImage from "../../../assets/stuff/human/torso.png";

/**
 * A hierarchical human puppet composed of stick-based body parts.
 * All joints are rotated relative to their parent joint.
 *
 * @param {number} humanRotation rotation of the entire human (degrees)
 * @param {number} headRotation rotation of the head (degrees)
 * @param {number} foreUpperArmRotation rotation of the front upper arm / shoulder (degrees)
 * @param {number} foreLowerArmRotation rotation of the front lower arm / elbow (degrees)
 * @param {number} foreHandRotation rotation of the front hand / wrist (degrees)
 * @param {number} hindUpperArmRotation rotation of the rear upper arm / shoulder (degrees)
 * @param {number} hindLowerArmRotation rotation of the rear lower arm / elbow (degrees)
 * @param {number} hindHandRotation rotation of the rear hand / wrist (degrees)
 * @param {number} hipRotation rotation of the pelvis / hip joint (degrees)
 * @param {number} foreUpperLegRotation rotation of the front upper leg / thigh (degrees)
 * @param {number} foreLowerLegRotation rotation of the front lower leg / knee (degrees)
 * @param {number} foreFootRotation rotation of the front foot / ankle (degrees)
 * @param {number} hindUpperLegRotation rotation of the rear upper leg / thigh (degrees)
 * @param {number} hindLowerLegRotation rotation of the rear lower leg / knee (degrees)
 * @param {number} hindFootRotation rotation of the rear foot / ankle (degrees)
 * @param {number} offsetX local x offset (model space)
 * @param {number} offsetY local y offset (model space)
 * @param {boolean} debug enable debug output / visual aids
 * @param {number} humanScale factor to scale everything
 * @param {boolean} darkMode make all body parts 30% darker if true
 * @returns human object
 */
export const Human = ({
  humanRotation = 0,          // [0, 360]
  headRotation = 0,           // [-40, 30]

  foreUpperArmRotation = 180, // [0, 360]
  foreLowerArmRotation = 0,   // [0, 150]
  foreHandRotation = 180,     // [0, 360]

  hindUpperArmRotation = 180, // [0, 360]
  hindLowerArmRotation = 0,   // [0, 150]
  hindHandRotation = 180,     // [0, 360]

  hipRotation = 200,          // [190, 220]

  foreUpperLegRotation = -20, // [-60, 70]
  foreLowerLegRotation = 0,   // [0, -150]
  foreFootRotation = 70,      // [30, 90]

  hindUpperLegRotation = -20, // [-60, 70]
  hindLowerLegRotation = 0,   // [0, -150]
  hindFootRotation = 70,      // [30, 90]

  // Local model-space offset
  offsetX = 0,
  offsetY = 0,
  borderX0 = -180,
  borderX1 = 180,
  borderY0 = -180,
  borderY1 = 180,

  debug = false,
  humanScale = 1,
  darkMode = false,
}) => {

  // Helper for consistent image styles including dark mode
  const imgStyle = (height) => ({
    height: height * humanScale,
    filter: darkMode ? "brightness(70%)" : "none",
    draggable: false,
  });

  // Container
  const Container = ({ children }) => {
    const borderStyle = {
      position: "absolute",
      border: debug ? "2px dashed red" : "none",
      width: `${(borderX1-borderX0)*humanScale}px`,
      height: `${(borderY1-borderY0)*humanScale}px`,
      overflow: "hidden"
    };
    const containerStyle = {
      position: "absolute",
      transform: `translate(${(offsetX-borderX0)*humanScale}px, ${(offsetY-borderY0+25)*humanScale}px)`,
      transformOrigin: "top left",
    };
    return (
      <div style={borderStyle}>
        <div style={containerStyle}>
          {children}
        </div>
      </div>
    );
  };

  // Define head
  const Head = () => (
    <Stick
      length={45 * humanScale}
      rotation={headRotation}
      image={<img src={headImage} style={imgStyle(63)} alt="Janzen's head" />}
      imageOffset={{ x: 3 * humanScale, y: -40 * humanScale, r: 90 }}
      debug={debug}
    />
  );

  // Define torso
  const Torso = () => (
    <Stick
      length={90 * humanScale}
      rotation={0}
      image={<img src={torsoImage} style={imgStyle(100)} alt="Janzen's torso" />}
      imageOffset={{ x: 25 * humanScale, y: -55 * humanScale, r: 90 }}
      childAxes={[90 * humanScale, 80 * humanScale]}
      debug={debug}
    />
  );

  // Define fore upper arm
  const ForeUpperArm = ({ children }) => (
    <Stick
      length={45 * humanScale}
      rotation={foreUpperArmRotation}
      image={<img src={foreUpperArmImage} style={imgStyle(60)} alt="Janzen's fore upper arm" />}
      imageOffset={{ x: 12 * humanScale, y: -30 * humanScale, r: -90 }}
      debug={debug}
    >
      {children}
    </Stick>
  );

  // Define fore lower arm
  const ForeLowerArm = ({ children }) => (
    <Stick
      length={45 * humanScale}
      rotation={foreLowerArmRotation}
      image={<img src={foreLowerArmImage} style={imgStyle(55)} alt="Janzen's fore lower arm" />}
      imageOffset={{ x: 12 * humanScale, y: -28 * humanScale, r: -95 }}
      debug={debug}
    >
      {children}
    </Stick>
  );

  // Define fore hand
  const ForeHand = () => (
    <Stick
      length={20 * humanScale}
      rotation={foreHandRotation}
      image={<img src={foreHandImage} style={imgStyle(32)} alt="Janzen's fore hand" />}
      imageOffset={{ x: 5 * humanScale, y: -20 * humanScale, r: -90 }}
      debug={debug}
    />
  );

  // Define hind upper arm
  const HindUpperArm = ({ children }) => (
    <Stick
      length={45 * humanScale}
      rotation={hindUpperArmRotation}
      image={<img src={hindUpperArmImage} style={imgStyle(58)} alt="Janzen's hind upper arm" />}
      imageOffset={{ x: 12 * humanScale, y: -28 * humanScale, r: -90 }}
      debug={debug}
    >
      {children}
    </Stick>
  );

  // Define hind lower arm
  const HindLowerArm = ({ children }) => (
    <Stick
      length={45 * humanScale}
      rotation={hindLowerArmRotation}
      image={<img src={hindLowerArmImage} style={imgStyle(55)} alt="Janzen's hind lower arm" />}
      imageOffset={{ x: 12 * humanScale, y: -28 * humanScale, r: -95 }}
      debug={debug}
    >
      {children}
    </Stick>
  );

  // Define hind hand
  const HindHand = () => (
    <Stick
      length={20 * humanScale}
      rotation={hindHandRotation}
      image={<img src={hindHandImage} style={imgStyle(35)} alt="Janzen's hind hand" />}
      imageOffset={{ x: 7 * humanScale, y: -17 * humanScale, r: -90 }}
      debug={debug}
    />
  );

  // Define hip
  const Hip = ({ children }) => (
    <Stick
      length={15 * humanScale}
      rotation={hipRotation}
      image={<img src={hipImage} style={imgStyle(50)} alt="Janzen's hip" />}
      imageOffset={{ x: -20 * humanScale, y: -20 * humanScale, r: -90 }}
      debug={debug}
    >
      {children}
    </Stick>
  );

  // Define legs and feet remain unchanged
  const ForeUpperLeg = ({ children }) => (
    <Stick
      length={61 * humanScale}
      rotation={foreUpperLegRotation}
      image={<img src={foreUpperLegImage} style={imgStyle(83)} alt="Janzen's fore upper leg" />}
      imageOffset={{ x: 10 * humanScale, y: -42 * humanScale, r: -90 }}
      debug={debug}
    >
      {children}
    </Stick>
  );

  const ForeLowerLeg = ({ children }) => (
    <Stick
      length={65 * humanScale}
      rotation={foreLowerLegRotation}
      image={<img src={foreLowerLegImage} style={imgStyle(75)} alt="Janzen's fore lower leg" />}
      imageOffset={{ x: 15 * humanScale, y: -42 * humanScale, r: -90 }}
      debug={debug}
    >
      {children}
    </Stick>
  );

  const ForeFoot = () => (
    <Stick
      length={20 * humanScale}
      rotation={foreFootRotation}
      image={<img src={foreFootImage} style={imgStyle(23)} alt="Janzen's fore foot" />}
      imageOffset={{ x: -20 * humanScale, y: -15 * humanScale, r: 200 }}
      debug={debug}
    />
  );

  const HindUpperLeg = ({ children }) => (
    <Stick
      length={61 * humanScale}
      rotation={hindUpperLegRotation}
      image={<img src={hindUpperLegImage} style={imgStyle(83)} alt="Janzen's hind upper leg" />}
      imageOffset={{ x: 10 * humanScale, y: -42 * humanScale, r: -90 }}
      debug={debug}
    >
      {children}
    </Stick>
  );

  const HindLowerLeg = ({ children }) => (
    <Stick
      length={65 * humanScale}
      rotation={hindLowerLegRotation}
      image={<img src={hindLowerLegImage} style={imgStyle(75)} alt="Janzen's hind lower leg" />}
      imageOffset={{ x: 15 * humanScale, y: -42 * humanScale, r: -90 }}
      debug={debug}
    >
      {children}
    </Stick>
  );

  const HindFoot = () => (
    <Stick
      length={20 * humanScale}
      rotation={hindFootRotation}
      image={<img src={hindFootImage} style={imgStyle(23)} alt="Janzen's hind foot" />}
      imageOffset={{ x: -20 * humanScale, y: -15 * humanScale, r: 200 }}
      debug={debug}
    />
  );

  // Render object (local offset applied BEFORE rotation)
  return (
    <Container>
      <Stick
        length={10 * humanScale}
        rotation={-90 + humanRotation}
        childAxes={[82 * humanScale, 90 * humanScale, 0 * humanScale, 0 * humanScale, 82 * humanScale, ]}
        debug={debug}
      >
        <HindUpperArm>
          <HindLowerArm>
            <HindHand />
          </HindLowerArm>
        </HindUpperArm>

        <Head />

        <Hip>
          <HindUpperLeg>
            <HindLowerLeg>
              <HindFoot />
            </HindLowerLeg>
          </HindUpperLeg>
          <ForeUpperLeg>
            <ForeLowerLeg>
              <ForeFoot />
            </ForeLowerLeg>
          </ForeUpperLeg>
        </Hip>

        <Torso />

        <ForeUpperArm>
          <ForeLowerArm>
            <ForeHand />
          </ForeLowerArm>
        </ForeUpperArm>
      </Stick>
    </Container>
  );
};
