"use client"

import { DashboardLayout } from "../../components/layout/DashboardLayout"
import { useTheme } from "../../context/ThemeContext"

const themes = [
  { id: "light", label: "Light Mode" },
  { id: "dark", label: "Dark Mode" },
  { id: "system", label: "System Default" },
]

const accents = [
  { id: "gold", label: "Gold" },
  { id: "blue", label: "Blue" },
  { id: "red", label: "Red" },
]

export default function SettingsPreferencesScreen() {
  const { theme, setTheme, accent, setAccent } = useTheme()

  return (
    <DashboardLayout title="Theme & Preferences">
      <div className="max-w-5xl space-y-10 text-fg">

        {/* Interface Theme */}
        <section>
          <h2 className="text-lg font-semibold mb-4">Interface Theme</h2>
          <div className="grid grid-cols-3 gap-6">
            {themes.map((t) => (
              <button
                key={t.id}
                onClick={() => setTheme(t.id)}
                className={`border rounded-xl p-4 text-left transition bg-card
        ${theme === t.id
                    ? "border-primary ring-2 ring-primary/40"
                    : "border-border hover:border-primary/40"
                  }`}
              >
                {/* Dynamic preview background based on theme label */}
                <div
                  className={`h-24 rounded-md mb-3 ${t.label === "Light Mode"
                    ? "bg-white/60"
                    : t.label === "System Default"
                      ? "bg-info"
                      : "bg-black" // This covers Dark Mode or any other theme
                    }`}
                />
                <p className="font-medium">{t.label}</p>
              </button>
            ))}
          </div>
        </section>

        {/* Accent Color */}
        <section>
          <h2 className="text-lg font-semibold mb-4">Accent Color</h2>
          <div className="flex gap-4">
            {accents.map((a) => (
              <button
                key={a.id}
                onClick={() => setAccent(a.id)}
                className={`px-5 py-3 rounded-lg font-medium transition
                  ${accent === a.id
                    ? "bg-primary text-primary-contrast"
                    : "bg-card border border-border hover:border-primary"
                  }`}
              >
                {a.label}
              </button>
            ))}
          </div>
        </section>


      </div>
    </DashboardLayout>
  )
}
