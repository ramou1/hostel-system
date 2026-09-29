export const APP_COLOR_MODE_KEY = "hostely:appColorMode";

export function saveAppColorMode(mode) {
  if (mode === "light" || mode === "dark") {
    localStorage.setItem(APP_COLOR_MODE_KEY, mode);
  }
}

export function readAppColorMode() {
  const saved = localStorage.getItem(APP_COLOR_MODE_KEY);
  return saved === "dark" ? "dark" : "light";
}
