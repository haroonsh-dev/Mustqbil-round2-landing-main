import { useEffect, useState } from "react";

export type Theme = "light" | "dark";

// Module-level subscribers list to sync all hook instances instantly
let globalTheme: Theme = "dark";
const listeners = new Set<(theme: Theme) => void>();

if (typeof window !== "undefined") {
  const stored = localStorage.getItem("theme") as Theme | null;
  if (stored === "light" || stored === "dark") {
    globalTheme = stored;
  } else {
    globalTheme = "dark";
  }
  
  // Apply initial theme on startup
  const root = window.document.documentElement;
  if (globalTheme === "dark") {
    root.classList.add("dark");
  } else {
    root.classList.remove("dark");
  }
}

export function useTheme() {
  const [theme, setThemeState] = useState<Theme>(globalTheme);

  useEffect(() => {
    const listener = (newTheme: Theme) => {
      setThemeState(newTheme);
    };
    listeners.add(listener);
    // Sync state to the current global value on mount
    setThemeState(globalTheme);
    return () => {
      listeners.delete(listener);
    };
  }, []);

  const setTheme = (newTheme: Theme) => {
    globalTheme = newTheme;
    localStorage.setItem("theme", newTheme);
    
    const root = window.document.documentElement;
    if (newTheme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }

    listeners.forEach((l) => l(newTheme));
  };

  const toggleTheme = () => {
    setTheme(globalTheme === "light" ? "dark" : "light");
  };

  return { theme, toggleTheme, setTheme };
}
