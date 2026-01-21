import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import BurgerDropdown from "./BurgerDropdown";
import { useViewport } from "../context/Viewport";
import ColourThemeToggle from './button/ColourThemeToggle';
import ReactToggle from './button/ReactToggle';

/**
 * Creates a fixed header
 * @returns header object
 */
export const Header = () => {
  const { isMobile } = useViewport();
  const [ mobileMode, setMobileMode ] = useState(isMobile);

  // // Change mode on viewport change
  useEffect(() => {
    setMobileMode(isMobile);
  }, [isMobile]);

  // Define header style
  const headerStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    height: "var(--header-height)",
    backgroundColor: "var(--colour-1)",
    transition: "all 0.3s",
    boxShadow: "0 0px 6px var(--colour-3)",
    zIndex: 2000,
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

  // Define burger menu styles
  const burgerItemStyle = {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    padding: "0px 4px 0px 4px",
    width: "100%",
    height: "30px",
  };
  const burgerDividerStyle = {
    width: "100%",
    height: "1px",
    margin: "8px 0px 8px 0px",
    boxShadow: "0 1px 4px var(--colour-3)",
    backgroundColor: "var(--colour-4)",
    opacity: 0.8,
  };

  // Other styles
  const textStyle = {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    fontWeight: 400,
    fontSize: "1rem",
    color: "var(--colour-5)",
    cursor: "pointer",
  }

  // Return header object
  return <div style={headerStyle}>
    <Link to="/" style={{ textDecoration: "none" }}>
      <div style={logoStyle}>JANZEN</div>
    </Link>
    <ReactToggle input={Boolean(isMobile)} onChange={(next) => setMobileMode(next)} disabled={Boolean(isMobile)}/>

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
          <div style={textStyle}>Settings</div>
        </div>
      </div>
    }

    {mobileMode && 
      <BurgerDropdown>
        <div style={burgerItemStyle}>
          <div style={textStyle}>About</div>
        </div>
        <div style={burgerItemStyle}>
          <div style={textStyle}>Experience</div>
        </div>
        <div style={burgerItemStyle}>
          <div style={textStyle}>Projects</div>
        </div>
        <div style={burgerItemStyle}>
          <div style={textStyle}>Contact</div>
        </div>
        <div style={burgerDividerStyle}/>
        <div style={burgerItemStyle}>
          <div style={textStyle}>Activities</div>
        </div>
        <div style={burgerDividerStyle}/>
        <div style={burgerItemStyle}>
          <div style={textStyle}>Dark Mode</div>
          <ColourThemeToggle/>
        </div>
        <div style={burgerItemStyle}>
          <div style={textStyle}>Mobile version</div>
          <ReactToggle input={Boolean(isMobile)} onChange={(next) => setMobileMode(next)} disabled={Boolean(isMobile)}/>
        </div>
      </BurgerDropdown>
    }
  </div>;
};