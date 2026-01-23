import { Link } from "react-router-dom";
import BurgerDropdown from "./button/BurgerDropdown";
import TextDropdown from "./button/TextDropdown";
import { dropdownItemStyle, dropdownDividerStyle } from "./button/Dropdown";
import ColourThemeToggle from './button/ColourThemeToggle';
import ReactToggle from './button/ReactToggle';
import { useViewport } from "../helper/Viewport";
import { MIN_WIDTH } from "../helper/layout";
import { setStoredValue } from "../helper/storage";

/**
 * Fixed header
 * @param {boolean} mobileMode whether to use mobile or desktop view
 * @param {boolean} forceMobile whether to force mobile mode
 * @param {function} setForceMobile function to set mobile mode
 * @param {boolean} colourTheme the theme to colour the site
 * @param {function} setColourTheme function to set colour theme
 * @returns fixed header object
 */
export const Header = ({ mobileMode, forceMobile, setForceMobile, colourTheme, setColourTheme }) => {

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

  // Style for right-side menu
  const rightMenuStyle = {
    display: "flex",
    alignItems: "center",
    position: "absolute",
    right: "-1rem",
  };
  
  // Define tab styles
  const tabMenuStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    height: "30px",
    opacity: mobileMode ? 0 : 1,
    pointerEvents: mobileMode ? "none" : "auto",
    transition: "opacity 0.5s",
  };
  const tabItemStyle = {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    padding: "0px 16px 0px 16px",
  };
  const tabDividerStyle = {
    height: "100%",
    width: "1px",
    margin: "0px 8px 0px 8px",
    boxShadow: "1px 0px 4px var(--colour-3)",
    backgroundColor: "var(--colour-4)",
    opacity: 0.8,
  };

  // Burger menu transition
  const burgerTransitionStyle = {
    transition: "opacity 0.5s",
    opacity: mobileMode ? 1 : 0,
    pointerEvents: mobileMode ? "auto" : "none",
    right: "2rem",
  };

  // Return header object
  return <div style={headerStyle}>

    {/* Logo */}
    <Link to="/" style={{ textDecoration: "none" }}>
      <div style={logoStyle}>JANZEN</div>
    </Link>

    {/* Right-side menu */}
    <div style={rightMenuStyle}>

      {/* Desktop Mode Options */}
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
          <TextDropdown text={"Activities"} style={textStyle} closeOnChange={mobileMode}>
            <DarkModeItem colourTheme={colourTheme} setColourTheme={setColourTheme}/>
            <MobileModeItem forceMobile={forceMobile} setForceMobile={setForceMobile}/>
          </TextDropdown>
        </div>
        <div style={tabDividerStyle}/>
        <div style={tabItemStyle}>
          <TextDropdown text={"Settings"} style={textStyle} closeOnChange={mobileMode}>
            <DarkModeItem colourTheme={colourTheme} setColourTheme={setColourTheme}/>
            <MobileModeItem forceMobile={forceMobile} setForceMobile={setForceMobile}/>
          </TextDropdown>
        </div>
      </div>

      {/* Mobile Mode Options */}
      <BurgerDropdown style={burgerTransitionStyle} closeOnChange={mobileMode}>
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
        <DarkModeItem colourTheme={colourTheme} setColourTheme={setColourTheme}/>
        <MobileModeItem forceMobile={forceMobile} setForceMobile={setForceMobile}/>
      </BurgerDropdown>
    </div>
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
 * @param {boolean} colourTheme the theme to colour the site
 * @param {function} setColourTheme function to set colour theme
 * @returns dark mode toggle item
 */
const DarkModeItem = ({ colourTheme, setColourTheme }) => {
  return <div style={dropdownItemStyle}>
    <div style={textStyle}>Dark Mode</div>
    <ColourThemeToggle colourTheme={colourTheme} setColourTheme={setColourTheme}/>
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

  // Define change function
  const onChange = () => {
    setStoredValue("force-mobile", !forceMobile);
    setForceMobile(!forceMobile);
  };

  // Return mobile mode item
  return <div style={dropdownItemStyle}>
    <div style={textStyle}>Mobile Mode</div>
    <ReactToggle
      input    = {isMobile || forceMobile}
      onChange = {onChange}
      disabled = {Boolean(isMobile)}
    />
  </div>
}
