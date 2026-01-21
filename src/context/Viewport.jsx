import { createContext, useContext, useEffect, useState } from "react";
import { MOBILE_WIDTH } from "../helper/layout";

const ViewportContext = createContext(null);

/**
 * Determines whether the website should be displayed in mobile mode.
 * @param {*} children the components of the website 
 * @returns the context
 */
export const ViewportProvider = ({ children }) => {
  const [isMobile, setIsMobile] = useState(
    window.innerWidth <= parseFloat(MOBILE_WIDTH)
  );

  // Check window width
  useEffect(() => {
    const resizeHandler = () => {
      setIsMobile(window.innerWidth <= parseFloat(MOBILE_WIDTH));
    };
    window.addEventListener("resize", resizeHandler);
    return () => window.removeEventListener("resize", resizeHandler);
  }, []);

  // Returns context
  return (
    <ViewportContext.Provider value={{ isMobile }}>
      {children}
    </ViewportContext.Provider>
  );
};

/**
 * Checks whether the website should be displayed in mobile mode
 * @returns if website is to be displayed in mobile mode
 */
export const useViewport = () => {
  const context = useContext(ViewportContext);
  if (!context) {
    throw new Error("useViewport must be used within ViewportProvider");
  }
  return context;
};