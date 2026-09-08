

import { useState } from "react"
import { useAuth } from "../../context/AuthContext"
import { settingsService } from "../../api/services/settings.service"
import { Button } from "../../components/common/Button"
import { Card } from "../../components/common/Card"
import { Input } from "../../components/common/Input"
import { DashboardLayout } from "../../components/layout/DashboardLayout"

export const SettingsScreen = () => {
  const { operator: user, updateOperator: updateUser } = useAuth()
  const [activeTab, setActiveTab] = useState("profile")

  const [profileData, setProfileData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    phone: user?.phone || "",
    companyName: user?.companyName || "",
    stock_status: user?.stock_status || "In Stock",
  })

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  const [saving, setSaving] = useState(false)

  const handleProfileUpdate = async (e) => {
    e.preventDefault()
    try {
      setSaving(true)
      const result = await settingsService.updateProfile(profileData)
      updateUser(result)
      alert("Profile updated successfully!")
    } catch (err) {
      alert("Failed to update profile: " + err.message)
    } finally {
      setSaving(false)
    }
  }

  const handlePasswordChange = async (e) => {
    e.preventDefault()

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("New passwords do not match")
      return
    }

    try {
      setSaving(true)
      await settingsService.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      })
      alert("Password changed successfully!")
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      })
    } catch (err) {
      alert("Failed to change password: " + err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <DashboardLayout title={"Settings"}>
      <div className=" space-y-6">
        <div>
          {/* <h1 className="text-3xl font-bold text-gray-900">Settings</h1> */}
          <p className="text-gray-600 mt-0">Manage your account settings and preferences</p>
        </div>

        <div className="flex gap-4 border-b border-gray-200">
          <button
            onClick={() => setActiveTab("profile")}
            className={`px-4 py-2 font-medium transition-colors ${activeTab === "profile" ? "border-b-2 border-primary text-primary" : "text-gray-600 hover:text-gray-900"
              }`}
          >
            Profile
          </button>
          <button
            onClick={() => setActiveTab("security")}
            className={`px-4 py-2 font-medium transition-colors ${activeTab === "security" ? "border-b-2 border-primary text-primary" : "text-gray-600 hover:text-gray-900"
              }`}
          >
            Security
          </button>
        </div>

        {activeTab === "profile" && (
          <Card>
            <h2 className="text-xl font-semibold mb-6">Profile Information</h2>
            <form onSubmit={handleProfileUpdate} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="First Name"
                  value={profileData.firstName}
                  onChange={(e) => setProfileData({ ...profileData, firstName: e.target.value })}
                  required
                />
                <Input
                  label="Last Name"
                  value={profileData.lastName}
                  onChange={(e) => setProfileData({ ...profileData, lastName: e.target.value })}
                  required
                />
              </div>

              <Input
                label="Email"
                type="email"
                value={profileData.email}
                onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                required
              />

              <Input
                label="Phone Number"
                value={profileData.phone}
                onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                required
              />

              <Input
                label="Company Name"
                value={profileData.companyName}
                onChange={(e) => setProfileData({ ...profileData, companyName: e.target.value })}
                required
              />

              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700">Stock Status (FX Directory)</label>
                <select
                  value={profileData.stock_status}
                  onChange={(e) => setProfileData({ ...profileData, stock_status: e.target.value })}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                >
                  <option value="In Stock">In Stock</option>
                  <option value="Low Riyal Stock">Low Riyal Stock</option>
                  <option value="Low Dollar Stock">Low Dollar Stock</option>
                  <option value="Out of Stock">Out of Stock</option>
                </select>
              </div>

              <Button type="submit" disabled={saving}>
                {saving ? "Saving..." : "Save Changes"}
              </Button>
            </form>
          </Card>
        )}

        {activeTab === "security" && (
          <Card>
            <h2 className="text-xl font-semibold mb-6">Change Password</h2>
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <Input
                label="Current Password"
                type="password"
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                required
              />

              <Input
                label="New Password"
                type="password"
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                required
              />

              <Input
                label="Confirm New Password"
                type="password"
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                required
              />

              <Button type="submit" disabled={saving}>
                {saving ? "Changing..." : "Change Password"}
              </Button>
            </form>
          </Card>
        )}
      </div>
    </DashboardLayout>
  )
}

export default SettingsScreen
