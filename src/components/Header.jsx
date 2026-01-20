import { Link } from "react-router-dom";
import Dropdown from './Dropdown';

/**
 * Creates a fixed header
 * @returns header object
 */
export const Header = () => {

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
    fontWeight: 600,
    fontSize: "2rem",
    color: "var(--colour-5)",
    cursor: "pointer",
  };

  // Return header object
  return <div style={{ ...headerStyle }}>
    <Link to="/" style={{ textDecoration: "none" }}>
      <div style={{ ...logoStyle }}>JANZEN</div>
    </Link>
    <Dropdown/>
  </div>;
};