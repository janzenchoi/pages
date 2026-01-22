import { Link } from "react-router-dom";
import BurgerDropdown from "./button/BurgerDropdown";
import TextDropdown from "./button/TextDropdown";
import { dropdownItemStyle, dropdownDividerStyle } from "./button/Dropdown";
import ColourThemeToggle from './button/ColourThemeToggle';
import ReactToggle from './button/ReactToggle';
import { useViewport } from "../helper/Viewport";
import { MIN_WIDTH } from "../helper/layout";

/**
 * Fixed header
 * @param {boolean} mobileMode whether to use mobile or desktop view
 * @param {boolean} forceMobile whether to force mobile mode
 * @param {function} setForceMobile function to set mobile mode
 * @returns fixed header object
 */
export const Header = ({ mobileMode, forceMobile, setForceMobile }) => {

  // Define header style
  const headerStyle = {
    minWidth: MIN_WIDTH,
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    height: "var(--header-height)",
    backgroundColor: "var(--colour-1)",
    transition: "all 0.3s",
    boxShadow: "0 0px 6px var(--colour-3)",
    zIndex: 1000,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 1rem",
  };

  // Define logo style
  const logoStyle = {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    fontWeight: 600,
    fontSize: "2rem",
    color: "var(--colour-5)",
    cursor: "pointer",
  };

  // Define tab styles
  const tabMenuStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    height: "30px",
  }
  const tabItemStyle = {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    padding: "0px 16px 0px 16px",
  }
  const tabDividerStyle = {
    height: "100%",
    width: "1px",
    margin: "0px 8px 0px 8px",
    boxShadow: "1px 0px 4px var(--colour-3)",
    backgroundColor: "var(--colour-4)",
    opacity: 0.8,
  }

  // Return header object
  return <div style={headerStyle}>
    <Link to="/" style={{ textDecoration: "none" }}>
      <div style={logoStyle}>JANZEN</div>
    </Link>

    {!mobileMode && 
      <div style={tabMenuStyle}>
        <div style={tabItemStyle}>
          <div style={textStyle}>About</div>
        </div>
        <div style={tabItemStyle}>
          <div style={textStyle}>Experience</div>
        </div>
        <div style={tabItemStyle}>
          <div style={textStyle}>Projects</div>
        </div>
        <div style={tabItemStyle}>
          <div style={textStyle}>Contact</div>
        </div>
        <div style={tabDividerStyle}/>
        <div style={tabItemStyle}>
          <div style={textStyle}>Activities</div>
        </div>
        <div style={tabDividerStyle}/>
        <div style={tabItemStyle}>
          <TextDropdown text={"Settings"} style={textStyle}>
            <DarkModeItem/>
            <MobileModeItem forceMobile={forceMobile} setForceMobile={setForceMobile}/>
          </TextDropdown>
        </div>
      </div>
    }

    {mobileMode && 
      <BurgerDropdown>
        <div style={dropdownItemStyle}>
          <div style={textStyle}>About</div>
        </div>
        <div style={dropdownItemStyle}>
          <div style={textStyle}>Experience</div>
        </div>
        <div style={dropdownItemStyle}>
          <div style={textStyle}>Projects</div>
        </div>
        <div style={dropdownItemStyle}>
          <div style={textStyle}>Contact</div>
        </div>
        <div style={dropdownDividerStyle}/>
        <div style={dropdownItemStyle}>
          <div style={textStyle}>Activities</div>
        </div>
        <div style={dropdownDividerStyle}/>
        <DarkModeItem/>
        <MobileModeItem forceMobile={forceMobile} setForceMobile={setForceMobile}/>
      </BurgerDropdown>
    }
  </div>;
};

/**
 * General text style
 */
const textStyle = {
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  fontWeight: 400,
  fontSize: "1rem",
  color: "var(--colour-5)",
  cursor: "pointer",
}

/**
 * Item containing toggle for dark mode
 * @returns dark mode toggle item
 */
const DarkModeItem = () => {
  return <div style={dropdownItemStyle}>
    <div style={textStyle}>Dark Mode</div>
    <ColourThemeToggle/>
  </div>;
}

/**
 * Item containing toggle for mobile mode
 * @param {boolean} forceMobile whether to force mobile mode
 * @param {function} setForceMobile function for forcing mobile mode 
 * @returns mobile mode toggle item
 */
const MobileModeItem = ({ forceMobile, setForceMobile }) => {
  const { isMobile } = useViewport();
  return <div style={dropdownItemStyle}>
    <div style={textStyle}>Mobile Mode</div>
    <ReactToggle
      input    = {isMobile || forceMobile}
      onChange = {() => {setForceMobile(!forceMobile)}}
      disabled = {Boolean(isMobile)}
    />
  </div>
}
