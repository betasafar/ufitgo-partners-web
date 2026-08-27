import { createContext, useContext, useEffect, useState } from "react"

const ThemeContext = createContext()

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(
    () => localStorage.getItem("theme") || "light"
  )

  const [accent, setAccent] = useState(
    () => localStorage.getItem("accent") || "green"
  )

  useEffect(() => {
    const root = document.documentElement

    // THEME
    let resolvedTheme = theme
    if (theme === "system") {
      resolvedTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light"
    }

    root.setAttribute("data-theme", resolvedTheme)
    localStorage.setItem("theme", theme)

    // ACCENT
    root.setAttribute("data-accent", accent)
    localStorage.setItem("accent", accent)
  }, [theme, accent])

  return (
    <ThemeContext.Provider
      value={{ theme, setTheme, accent, setAccent }}
    >
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => useContext(ThemeContext)
