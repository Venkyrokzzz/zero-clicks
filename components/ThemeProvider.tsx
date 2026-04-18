"use client";

import { createContext, useContext, useEffect, useState } from "react";

type Theme = "dark" | "light";

const ThemeContext = createContext<{
  theme: Theme;
  toggleTheme: () => void;
}>({ theme: "dark", toggleTheme: () => {} });

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("dark");

  // On mount: read stored preference only — default is always dark
  useEffect(() => {
    try {
      const stored = localStorage.getItem("zc-theme") as Theme | null;
      if (stored === "light") {
        setTheme("light"); // only override if user explicitly chose light
      }
      // no system preference fallback — dark is the brand default
    } catch {
      setTheme("dark");
    }
  }, []);

  // Sync data-theme attribute and localStorage whenever theme changes
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    try { localStorage.setItem("zc-theme", theme); } catch {}
  }, [theme]);

  const toggleTheme = () => setTheme((t) => (t === "dark" ? "light" : "dark"));

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
