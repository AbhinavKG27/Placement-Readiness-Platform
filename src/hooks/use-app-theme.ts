import { useCallback, useEffect, useState } from "react";

const LS_KEY = "appThemeMode";

type ThemeMode = "dark" | "light";

export function useAppTheme() {
  const [mode, setMode] = useState<ThemeMode>(() => {
    if (typeof window === "undefined") {
      return "dark";
    }

    const saved = window.localStorage.getItem(LS_KEY);
    const initial: ThemeMode = saved === "light" || saved === "dark" ? saved : "dark";
    document.documentElement.setAttribute("data-theme", initial);
    return initial;
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", mode);
    window.localStorage.setItem(LS_KEY, mode);
  }, [mode]);

  const toggle = useCallback(() => {
    setMode((current) => (current === "dark" ? "light" : "dark"));
  }, []);

  return { isDark: mode === "dark", toggle };
}