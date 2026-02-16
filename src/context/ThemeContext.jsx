import { createContext, useContext, useEffect, useState } from "react"

const ThemeContext = createContext(null)

export function ThemeProvider({ children }) {
    const [theme, setTheme] = useState(
        () => localStorage.getItem("theme") || "system"
    )

    const [accent, setAccent] = useState(
        () => localStorage.getItem("accent") || "gold"
    )

    useEffect(() => {
        const root = document.documentElement

        // Resolve system theme
        let resolvedTheme = theme
        if (theme === "system") {
            resolvedTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
                ? "dark"
                : "light"
        }

        root.setAttribute("data-theme", resolvedTheme)
        root.setAttribute("data-accent", accent)

        localStorage.setItem("theme", theme)
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

export function useTheme() {
    const ctx = useContext(ThemeContext)
    if (!ctx) {
        throw new Error("useTheme must be used inside ThemeProvider")
    }
    return ctx
}
