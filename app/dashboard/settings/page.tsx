"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Building2, Mail, Phone, MapPin, Upload, Shield, Bell, HelpCircle, Eye, EyeOff, Check } from "lucide-react"
import { ENDPOINTS } from "@/lib/api-endpoints"

export default function SettingsPage() {
  const [theme, setTheme] = useState("dark")
  const [showPassword, setShowPassword] = useState(false)
  const [notifications, setNotifications] = useState({
    weeklyReports: false,
    newApplicants: true,
    paymentConfirmations: true,
    visaUpdates: true,
  })
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [bankAccount, setBankAccount] = useState<any>(null)

  useEffect(() => {
    fetchProfile()
    fetchBankAccount()
  }, [])

  const fetchProfile = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL || ""
      const response = await fetch(`${apiUrl}${ENDPOINTS.PROFILE.GET}`, {
        credentials: "include",
      })
      if (response.ok) {
        const data = await response.json()
        setProfile(data)
      }
    } catch (error) {
      console.error("Failed to fetch profile:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchBankAccount = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL || ""
      const response = await fetch(`${apiUrl}${ENDPOINTS.BANK_ACCOUNT.GET}`, {
        credentials: "include",
      })
      if (response.ok) {
        const data = await response.json()
        setBankAccount(data.data)
      }
    } catch (error) {
      console.error("Failed to fetch bank account:", error)
    }
  }

  const handleSaveProfile = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL || ""
      const response = await fetch(`${apiUrl}${ENDPOINTS.PROFILE.UPDATE}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(profile),
      })

      if (response.ok) {
        alert("Profile updated successfully")
      }
    } catch (error) {
      console.error("Failed to update profile:", error)
    }
  }

  const handleLogoUpload = async (file: File) => {
    const formData = new FormData()
    formData.append("logo", file)

    try {
      const apiUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL || ""
      const response = await fetch(`${apiUrl}${ENDPOINTS.PROFILE.UPLOAD_LOGO}`, {
        method: "POST",
        credentials: "include",
        body: formData,
      })

      if (response.ok) {
        await fetchProfile()
        alert("Logo uploaded successfully")
      }
    } catch (error) {
      console.error("Failed to upload logo:", error)
    }
  }

  if (loading) {
    return <div className="p-6">Loading profile...</div>
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="space-y-1">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
          <span>Home</span>
          <span>/</span>
          <span>Settings</span>
          <span>/</span>
          <span className="text-foreground">Preferences</span>
        </div>
        <h1 className="text-3xl font-bold">Account Settings</h1>
        <p className="text-muted-foreground">
          Manage your agency profile, security preferences, and support options for your NAHCON dashboard.
        </p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="bg-[#3a4a3d]">
          <TabsTrigger value="profile">Profile Details</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="support">Support</TabsTrigger>
        </TabsList>

        {/* Profile Details */}
        <TabsContent value="profile" className="space-y-6">
          <Card className="p-6 bg-[#2a3a2d] border-[#3a4a3d]">
            <div className="flex items-center gap-3 mb-6">
              <Building2 className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold">Agency Information</h2>
            </div>

            <div className="space-y-6">
              {/* Logo Upload */}
              <div className="space-y-3">
                <Label>Agency Logo</Label>
                <div className="flex items-center gap-4">
                  <div className="w-24 h-24 bg-[#3a4a3d] rounded-lg flex items-center justify-center border-2 border-primary/50">
                    {profile?.logo ? (
                      <img
                        src={profile.logo || "/placeholder.svg"}
                        alt="Logo"
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <span className="text-2xl">🕌</span>
                    )}
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">
                      Upload a high-res logo (PNG/JPG) for official documents.
                    </p>
                    <p className="text-xs text-muted-foreground">Max file size: 2MB</p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-[#3a4a3d]"
                      onClick={() => document.getElementById("logo-upload")?.click()}
                    >
                      <Upload className="mr-2 h-4 w-4" />
                      Upload New Logo
                    </Button>
                    <input
                      id="logo-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => e.target.files?.[0] && handleLogoUpload(e.target.files[0])}
                    />
                  </div>
                </div>
              </div>

              {/* Agency Name */}
              <div className="space-y-2">
                <Label htmlFor="agencyName">Agency Name</Label>
                <Input
                  id="agencyName"
                  value={profile?.agencyName || ""}
                  onChange={(e) => setProfile({ ...profile, agencyName: e.target.value })}
                  className="bg-[#1a2a1d] border-[#3a4a3d]"
                />
              </div>

              {/* License and TIN */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="license">NAHCON License Number</Label>
                  <div className="relative">
                    <Input
                      id="license"
                      defaultValue="NAHCON-2024-8821"
                      className="bg-[#1a2a1d] border-[#3a4a3d] pr-20"
                      disabled
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs bg-green-500/20 text-green-500 px-2 py-1 rounded flex items-center gap-1">
                      <Check className="h-3 w-3" />
                      Verified
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tin">Tax Identification Number (TIN)</Label>
                  <Input id="tin" defaultValue="22910038-0001" className="bg-[#1a2a1d] border-[#3a4a3d]" />
                </div>
              </div>

              {/* Email and Phone */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Official Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      defaultValue="operations@alharāmaintours.ng"
                      className="bg-[#1a2a1d] border-[#3a4a3d] pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Primary Phone Number</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="phone"
                      type="tel"
                      defaultValue="+234 803 123 4567"
                      className="bg-[#1a2a1d] border-[#3a4a3d] pl-10"
                    />
                  </div>
                </div>
              </div>

              {/* Address */}
              <div className="space-y-2">
                <Label htmlFor="address">Head Office Address</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Textarea
                    id="address"
                    defaultValue="No. 45, Ahmadu Bello Way, Central Business District, Abuja, FCT, Nigeria"
                    className="bg-[#1a2a1d] border-[#3a4a3d] pl-10 min-h-[100px]"
                  />
                </div>
              </div>
            </div>
          </Card>

          {/* Bank Account Section */}
          <Card className="p-6 bg-[#2a3a2d] border-[#3a4a3d]">
            <div className="flex items-center gap-3 mb-6">
              <Building2 className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold">Bank Account Details</h2>
            </div>

            {bankAccount ? (
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Bank Name</Label>
                    <Input value={bankAccount.bankName} disabled className="bg-[#1a2a1d] border-[#3a4a3d]" />
                  </div>
                  <div className="space-y-2">
                    <Label>Account Name</Label>
                    <Input value={bankAccount.accountName} disabled className="bg-[#1a2a1d] border-[#3a4a3d]" />
                  </div>
                  <div className="space-y-2">
                    <Label>Account Number</Label>
                    <Input value={bankAccount.accountNumber} disabled className="bg-[#1a2a1d] border-[#3a4a3d]" />
                  </div>
                  <div className="space-y-2">
                    <Label>Status</Label>
                    <Badge className="bg-green-500/10 text-green-500">Verified</Badge>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No bank account configured</p>
            )}
          </Card>

          {/* Save Button */}
          <div className="flex justify-end gap-3">
            <Button variant="outline" className="bg-transparent">
              Discard Changes
            </Button>
            <Button onClick={handleSaveProfile}>
              <Check className="mr-2 h-4 w-4" />
              Save Changes
            </Button>
          </div>
        </TabsContent>

        {/* Security */}
        <TabsContent value="security" className="space-y-6">
          <Card className="p-6 bg-[#2a3a2d] border-[#3a4a3d]">
            <div className="flex items-center gap-3 mb-6">
              <Shield className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold">Security Settings</h2>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <div className="relative">
                  <Input
                    id="currentPassword"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter current password"
                    className="bg-[#1a2a1d] border-[#3a4a3d] pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input
                  id="newPassword"
                  type="password"
                  placeholder="Enter new password"
                  className="bg-[#1a2a1d] border-[#3a4a3d]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmNewPassword">Confirm New Password</Label>
                <Input
                  id="confirmNewPassword"
                  type="password"
                  placeholder="Re-enter new password"
                  className="bg-[#1a2a1d] border-[#3a4a3d]"
                />
              </div>

              <Button className="w-full md:w-auto">Update Password</Button>
            </div>
          </Card>

          <Card className="p-6 bg-[#2a3a2d] border-[#3a4a3d]">
            <div className="space-y-4">
              <h3 className="font-semibold">Two-Factor Authentication</h3>
              <p className="text-sm text-muted-foreground">
                Add an extra layer of security to your account with 2FA via SMS or authenticator app.
              </p>
              <Button variant="outline" className="bg-transparent">
                Enable 2FA
              </Button>
            </div>
          </Card>
        </TabsContent>

        {/* Notifications */}
        <TabsContent value="notifications" className="space-y-6">
          <Card className="p-6 bg-[#2a3a2d] border-[#3a4a3d]">
            <div className="flex items-center gap-3 mb-6">
              <Bell className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold">Notifications</h2>
            </div>

            <p className="text-sm text-muted-foreground mb-6">Manage your email alerts and system notifications.</p>

            <div className="space-y-4">
              <div className="flex items-start justify-between p-4 bg-[#1a2a1d] rounded-lg border border-[#3a4a3d]">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                    <Mail className="h-5 w-5 text-blue-500" />
                  </div>
                  <div>
                    <div className="font-semibold">Weekly Summary Reports</div>
                    <div className="text-sm text-muted-foreground">
                      Receive a digest of application stats every Monday.
                    </div>
                  </div>
                </div>
                <Switch
                  checked={notifications.weeklyReports}
                  onCheckedChange={(checked) => setNotifications({ ...notifications, weeklyReports: checked })}
                />
              </div>

              <div className="flex items-start justify-between p-4 bg-[#1a2a1d] rounded-lg border border-[#3a4a3d]">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                    <Bell className="h-5 w-5 text-green-500" />
                  </div>
                  <div>
                    <div className="font-semibold">New Applicant Registration</div>
                    <div className="text-sm text-muted-foreground">
                      Get notified immediately when a new pilgrim registers.
                    </div>
                  </div>
                </div>
                <Switch
                  checked={notifications.newApplicants}
                  onCheckedChange={(checked) => setNotifications({ ...notifications, newApplicants: checked })}
                />
              </div>

              <div className="flex items-start justify-between p-4 bg-[#1a2a1d] rounded-lg border border-[#3a4a3d]">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                    <Mail className="h-5 w-5 text-purple-500" />
                  </div>
                  <div>
                    <div className="font-semibold">Payment Confirmations</div>
                    <div className="text-sm text-muted-foreground">Alerts for successful transaction completions.</div>
                  </div>
                </div>
                <Switch
                  checked={notifications.paymentConfirmations}
                  onCheckedChange={(checked) => setNotifications({ ...notifications, paymentConfirmations: checked })}
                />
              </div>

              <div className="flex items-start justify-between p-4 bg-[#1a2a1d] rounded-lg border border-[#3a4a3d]">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-orange-500/20 rounded-lg flex items-center justify-center">
                    <Bell className="h-5 w-5 text-orange-500" />
                  </div>
                  <div>
                    <div className="font-semibold">Visa Status Updates</div>
                    <div className="text-sm text-muted-foreground">
                      Notifications when visa statuses change (Approved/Rejected).
                    </div>
                  </div>
                </div>
                <Switch
                  checked={notifications.visaUpdates}
                  onCheckedChange={(checked) => setNotifications({ ...notifications, visaUpdates: checked })}
                />
              </div>
            </div>
          </Card>

          <div className="flex justify-end gap-3">
            <Button variant="outline" className="bg-transparent">
              Reset Defaults
            </Button>
            <Button>
              <Check className="mr-2 h-4 w-4" />
              Save Changes
            </Button>
          </div>
        </TabsContent>

        {/* Support */}
        <TabsContent value="support" className="space-y-6">
          <Card className="p-6 bg-[#2a3a2d] border-[#3a4a3d]">
            <div className="flex items-center gap-3 mb-6">
              <HelpCircle className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold">Support & Help</h2>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-[#1a2a1d] rounded-lg border border-[#3a4a3d]">
                <h3 className="font-semibold mb-2">Documentation</h3>
                <p className="text-sm text-muted-foreground mb-3">Access guides and tutorials for the platform.</p>
                <Button variant="outline" className="bg-transparent" size="sm">
                  View Docs
                </Button>
              </div>

              <div className="p-4 bg-[#1a2a1d] rounded-lg border border-[#3a4a3d]">
                <h3 className="font-semibold mb-2">Contact Support</h3>
                <p className="text-sm text-muted-foreground mb-3">Get help from our 24/7 support team.</p>
                <Button variant="outline" className="bg-transparent" size="sm">
                  Open Ticket
                </Button>
              </div>

              <div className="p-4 bg-[#1a2a1d] rounded-lg border border-[#3a4a3d]">
                <h3 className="font-semibold mb-2">System Status</h3>
                <p className="text-sm text-muted-foreground mb-3">Check the current status of all services.</p>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-green-500">All Systems Operational</span>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
