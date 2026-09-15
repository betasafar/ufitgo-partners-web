"use client"

import { useState } from "react"
import { DashboardLayout } from "../../components/layout/DashboardLayout"
import { Input } from "../../components/common/Input"
import { Button } from "../../components/common/Button"
import { useAuth } from "../../context/AuthContext"
import { useTheme } from "../../context/ThemeContext"
import { settingsService } from "../../api/services/settings.service"

const TABS = [
  { id: "profile", label: "Profile" },
  { id: "security", label: "Security" },
  { id: "appearance", label: "Appearance" },
]

const THEMES = [
  { id: "light", label: "Light Mode" },
  { id: "dark", label: "Dark Mode" },
  { id: "system", label: "System Default" },
]

const ACCENTS = [
  { id: "green", label: "Green", swatch: "bg-emerald-500" },
  { id: "gold", label: "Gold", swatch: "bg-amber-500" },
  { id: "blue", label: "Blue", swatch: "bg-blue-500" },
  { id: "red", label: "Red", swatch: "bg-red-500" },
]

export default function SettingsScreen() {
  const { operator, updateOperator } = useAuth()
  const { theme, setTheme, accent, setAccent } = useTheme()
  const [activeTab, setActiveTab] = useState("profile")

  return (
    <DashboardLayout title="Settings">
      <div className="max-w-3xl">
        <p className="text-fg/60 mb-6">Manage your business profile, account security, and appearance preferences.</p>

        {/* Tab Bar */}
        <div className="flex gap-1 mb-6 border-b border-border">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-3 text-sm font-medium transition-all border-b-2 -mb-px ${
                activeTab === tab.id
                  ? "text-primary border-primary"
                  : "text-fg/50 border-transparent hover:text-fg hover:border-fg/10"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === "profile" && <ProfileTab operator={operator} updateOperator={updateOperator} />}
        {activeTab === "security" && <SecurityTab operatorId={operator?.id} />}
        {activeTab === "appearance" && (
          <AppearanceTab theme={theme} setTheme={setTheme} accent={accent} setAccent={setAccent} />
        )}
      </div>
    </DashboardLayout>
  )
}

const ProfileTab = ({ operator, updateOperator }) => {
  const [formData, setFormData] = useState({
    companyName: operator?.companyName || "",
    email: operator?.email || "",
    phone: operator?.phone || "",
  })
  const [saving, setSaving] = useState(false)
  const [status, setStatus] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus(null)
    setSaving(true)
    try {
      const updated = await settingsService.updateProfile(operator?.id, formData)
      updateOperator(updated)
      setStatus({ type: "success", message: "Profile updated successfully." })
    } catch (err) {
      setStatus({ type: "error", message: err.response?.data?.message || err.message || "Failed to update profile." })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="bg-card border border-border rounded-2xl p-6">
      <h2 className="text-lg font-semibold text-fg mb-1">Business Profile</h2>
      <p className="text-sm text-fg/60 mb-6">This information may be shown to pilgrims and administrators.</p>

      {status && (
        <div
          className={`mb-4 p-3 rounded-xl text-sm ${
            status.type === "success" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-red-50 text-red-700 border border-red-200"
          }`}
        >
          {status.message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-1">
        <Input
          label="Company Name"
          value={formData.companyName}
          onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
          required
        />
        <Input
          label="Business Email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
        />
        <Input
          label="Phone Number"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          placeholder="e.g +2348012345678"
        />

        <div className="pt-3">
          <Button type="submit" disabled={saving}>
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </div>
  )
}

const SecurityTab = ({ operatorId }) => {
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  })
  const [saving, setSaving] = useState(false)
  const [status, setStatus] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus(null)

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setStatus({ type: "error", message: "New passwords do not match." })
      return
    }
    if (passwordData.newPassword.length < 8) {
      setStatus({ type: "error", message: "New password must be at least 8 characters." })
      return
    }

    setSaving(true)
    try {
      await settingsService.changePassword(operatorId, {
        oldPassword: passwordData.oldPassword,
        newPassword: passwordData.newPassword,
      })
      setStatus({ type: "success", message: "Password changed successfully." })
      setPasswordData({ oldPassword: "", newPassword: "", confirmPassword: "" })
    } catch (err) {
      setStatus({ type: "error", message: err.response?.data?.message || err.message || "Failed to change password." })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="bg-card border border-border rounded-2xl p-6">
      <h2 className="text-lg font-semibold text-fg mb-1">Change Password</h2>
      <p className="text-sm text-fg/60 mb-6">Use a strong password you don't use elsewhere.</p>

      {status && (
        <div
          className={`mb-4 p-3 rounded-xl text-sm ${
            status.type === "success" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-red-50 text-red-700 border border-red-200"
          }`}
        >
          {status.message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-1">
        <Input
          label="Current Password"
          type="password"
          value={passwordData.oldPassword}
          onChange={(e) => setPasswordData({ ...passwordData, oldPassword: e.target.value })}
          required
        />
        <Input
          label="New Password"
          type="password"
          value={passwordData.newPassword}
          onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
          placeholder="Minimum 8 characters"
          required
        />
        <Input
          label="Confirm New Password"
          type="password"
          value={passwordData.confirmPassword}
          onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
          required
        />

        <div className="pt-3">
          <Button type="submit" disabled={saving}>
            {saving ? "Changing..." : "Change Password"}
          </Button>
        </div>
      </form>
    </div>
  )
}

const AppearanceTab = ({ theme, setTheme, accent, setAccent }) => {
  return (
    <div className="space-y-6">
      <div className="bg-card border border-border rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-fg mb-1">Interface Theme</h2>
        <p className="text-sm text-fg/60 mb-5">Choose how the operator portal looks on this device.</p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {THEMES.map((t) => (
            <button
              key={t.id}
              onClick={() => setTheme(t.id)}
              className={`border rounded-xl p-4 text-left transition ${
                theme === t.id ? "border-primary ring-2 ring-primary/30" : "border-border hover:border-primary/40"
              }`}
            >
              <div
                className={`h-20 rounded-lg mb-3 ${
                  t.id === "light" ? "bg-white border border-border" : t.id === "system" ? "bg-gradient-to-br from-white to-gray-800" : "bg-gray-900"
                }`}
              />
              <p className="font-medium text-sm text-fg">{t.label}</p>
            </button>
          ))}
        </div>
      </div>

      <div className="bg-card border border-border rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-fg mb-1">Accent Color</h2>
        <p className="text-sm text-fg/60 mb-5">Used for buttons, links, and highlighted elements.</p>

        <div className="flex flex-wrap gap-3">
          {ACCENTS.map((a) => (
            <button
              key={a.id}
              onClick={() => setAccent(a.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition border ${
                accent === a.id ? "border-primary bg-primary/5 text-fg" : "border-border text-fg/70 hover:border-primary/40"
              }`}
            >
              <span className={`w-3 h-3 rounded-full ${a.swatch}`} />
              {a.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
