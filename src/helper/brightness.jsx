// Default colour theme
export const DEFAULT_MODE = "dark";

/**
 * Alternates between dark and light mode
 * @param {boolean} enabled whether to turn on dark mode 
 */
export function setDarkMode(enabled) {
  const colour_theme = enabled ? "dark" : "light";
  document.documentElement.setAttribute("colour-theme", colour_theme);
  updateSafeAreaColour();
}

export function updateSafeAreaColour() {
  const colour1 = getComputedStyle(document.documentElement).getPropertyValue("--colour-0").trim();
  const themeMeta = document.getElementById("theme-color-meta");
  if (themeMeta)
    themeMeta.setAttribute("content", colour1);
}
