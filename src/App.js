import { useEffect } from "react";
import { ViewportProvider } from "./helper/Viewport";
import { getStoredValue } from "./helper/storage";
import { updateSafeAreaColour, DEFAULT_MODE } from "./helper/brightness";
import { Site } from "./components/Site";

function App() {

  // Persist colour theme on refresh
  useEffect(() => {
    const theme = getStoredValue("colour-theme") ?? DEFAULT_MODE;
    document.documentElement.setAttribute("colour-theme", theme);
    updateSafeAreaColour()
  });

  // Return
  return (
    <ViewportProvider>
      <Site/>
    </ViewportProvider>
  );
}

export default App;
