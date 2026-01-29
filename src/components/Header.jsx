import { Link, useNavigate } from "react-router-dom";
import BurgerDropdown from "./dropdown/BurgerDropdown";
import { TextDropdown } from "./dropdown/TextDropdown";
import { dropdownItemStyle, dropdownDividerStyle } from "./dropdown/Dropdown";
import ColourThemeToggle from './toggle/ColourThemeToggle';
import ReactToggle from './toggle/ReactToggle';
import { useViewport } from "../helper/Viewport";
import { HEADER_HEIGHT, MAX_WIDTH } from "../helper/constant";
import { setStoredValue } from "../helper/storage";

/**
 * Fixed header
 * @param {boolean} mobileMode whether to use mobile or desktop view
 * @param {boolean} forceMobile whether to force mobile mode
 * @param {function} setForceMobile function to set mobile mode
 * @param {boolean} colourTheme the theme to colour the site
 * @param {function} setColourTheme function to set colour theme
 * @param {boolean} ballExists the theme to colour the site
 * @param {function} setBallExists function to set colour theme
 * @returns fixed header object
 */
export const Header = ({
  mobileMode, forceMobile, setForceMobile, colourTheme, setColourTheme, ballExists, setBallExists
}) => {
  const navigate = useNavigate();

  // Define header style
  const outerHeaderStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    height: HEADER_HEIGHT,
    backgroundColor: "var(--colour-0)",
    transition: "all 0.3s ease",
    boxShadow: "0 0px 2px var(--colour-5)",
    zIndex: 100,
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
  }
  const headerStyle = {
    maxWidth: MAX_WIDTH,
    width: "100%",
    boxSizing: "border-box",
    display: "flex",
    alignItems: "center",
    marginLeft: "1rem",
    marginRight: "1rem",
  };

  // Define logo style
  const logoStyle = {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    fontWeight: 700,
    fontSize: "2rem",
    color: "var(--colour-7)",
    cursor: "pointer",
  };

  // Style for right-side menu
  const rightMenuStyle = {
    display: "flex",
    alignItems: "center",
    position: "relative",
    marginLeft: "auto",
  };
  
  // Define tab styles
  const tabMenuStyle = {
    position: "absolute",
    right: 0,
    display: "flex",
    alignItems: "center",
    height: "30px",
    opacity: mobileMode ? 0 : 1,
    pointerEvents: mobileMode ? "none" : "auto",
    transition: "opacity 0.5s",
  };
  const tabDividerStyle = {
    height: "100%",
    width: "1px",
    margin: "0px 8px 0px 8px",
    boxShadow: "1px 0px 4px var(--colour-4)",
    backgroundColor: "var(--colour-5)",
    transition: "background-color 0.3s ease",
    opacity: 0.8,
  };

  // Burger menu transition
  const burgerTransitionStyle = {
    transition: "opacity 0.5s",
    opacity: mobileMode ? 1 : 0,
    pointerEvents: mobileMode ? "auto" : "none",
  };

  // Dropdown items
  const DropdownItems = () => {
    return (
      <div style={{ marginLeft: "-0.3rem" }}>
        <DropdownItem>
          <DarkModeItem colourTheme={colourTheme} setColourTheme={setColourTheme}/>
        </DropdownItem>
        <DropdownItem>
          <MobileModeItem forceMobile={forceMobile} setForceMobile={setForceMobile}/>
        </DropdownItem>
        <DropdownItem>
          <div style={dropdownItemStyle}>
            <div style={textStyle}>Bouncing Ball</div>
            <ReactToggle input={ballExists} onChange={setBallExists}/>
          </div>
        </DropdownItem>
      </div>
    );
  };

  // Desktop mode object
  const DesktopObject = () => {
    return (
      <div style={tabMenuStyle}>
        <TabItem>
          <div style={textStyle} onClick={() => navigate("/home")}>Home</div>
        </TabItem>
        <TabItem>
          <div style={textStyle} onClick={() => navigate("/resume")}>Resumé</div>
        </TabItem>
        <TabItem>
          <div style={textStyle} onClick={() => navigate("/activities")}>Activities</div>
        </TabItem>
        <div style={tabDividerStyle}/>
        <TabItem>
          <TextDropdown text={"Settings"} style={textStyle} closeOnChange={mobileMode}>
            <DropdownItems/>
          </TextDropdown>
        </TabItem>
      </div>
    );
  };

  // Mobile mode object
  const MobileObject = () => {
    return (
      <BurgerDropdown style={burgerTransitionStyle} closeOnChange={mobileMode}>
        <DropdownItem>
          <div style={textStyle} onClick={() => navigate("/home")}>Home</div>
        </DropdownItem>
        <DropdownItem>
          <div style={textStyle} onClick={() => navigate("/resume")}>Resumé</div>
        </DropdownItem>
        <DropdownItem>
          <div style={textStyle} onClick={() => navigate("/activities")}>Activities</div>
        </DropdownItem>
        <div style={dropdownDividerStyle}/>
        <DropdownItems/>
      </BurgerDropdown>
    );
  };

  // Return header object
  return (
    <div style={outerHeaderStyle}>
      <div style={headerStyle}>
        <Link to="/" style={{ textDecoration: "none" }}>
          <div style={logoStyle}>JANZEN</div>
        </Link>
        <div style={rightMenuStyle}>
          <DesktopObject/>
          <MobileObject/>
        </div>
      </div>
    </div>
  );
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
  color: "var(--colour-7)",
  cursor: "pointer"
}

/**
 * Tab item object
 * @param {*} children children objects
 * @returns tab item object
 */
const TabItem = ({ children }) => {
  const tabItemStyle = {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    padding: "0.1rem 0.8rem 0.3rem 0.8rem",
    cursor: "pointer",
  };
  return (
    <div style={tabItemStyle}>
      {children}
    </div>
  );
};

/**
 * Dropdown item object
 * @param {*} children children objects
 * @returns dropdown item object
 */
const DropdownItem = ({ children }) => {
  return (
    <div style={dropdownItemStyle}>
      {children}
    </div>
  );
};

/**
 * Item containing toggle for dark mode
 * @param {boolean} colourTheme the theme to colour the site
 * @param {function} setColourTheme function to set colour theme
 * @returns dark mode toggle item
 */
const DarkModeItem = ({ colourTheme, setColourTheme }) => {
  return (
    <div style={dropdownItemStyle}>
      <div style={textStyle}>Dark Mode</div>
      <ColourThemeToggle colourTheme={colourTheme} setColourTheme={setColourTheme}/>
    </div>
  );
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
  return (
    <div style={dropdownItemStyle}>
      <div style={textStyle}>Mobile Mode</div>
      <ReactToggle
        input    = {isMobile || forceMobile}
        onChange = {onChange}
        disabled = {Boolean(isMobile)}
      />
    </div>
  );
}
