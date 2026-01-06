"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Card } from "@/components/ui/card"
import { Check, Monitor, Moon, Sun, Mail, Bell } from "lucide-react"

export default function PreferencesPage() {
  const [theme, setTheme] = useState("dark")
  const [notifications, setNotifications] = useState({
    weeklyReports: false,
    newApplicants: true,
    paymentConfirmations: true,
    visaUpdates: true,
  })

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
        <h1 className="text-3xl font-bold">Theme & Preferences</h1>
        <p className="text-muted-foreground">
          Customize your dashboard appearance and notification settings for optimal management.
        </p>
      </div>

      {/* Interface Theme */}
      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold mb-2">Interface Theme</h2>
          <p className="text-sm text-muted-foreground">Choose a color scheme for your dashboard experience.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Light Mode */}
          <button
            onClick={() => setTheme("light")}
            className={`group relative p-6 rounded-lg border-2 transition-all ${
              theme === "light" ? "border-primary" : "border-[#3a4a3d] hover:border-[#4a5a4d]"
            }`}
          >
            <div className="aspect-video bg-white rounded-md mb-4 overflow-hidden">
              <div className="h-8 bg-gray-100 border-b border-gray-200"></div>
              <div className="p-4 space-y-2">
                <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-100 rounded w-1/2"></div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sun className="h-4 w-4" />
                <span className="font-medium">Light Mode</span>
              </div>
              {theme === "light" && <Check className="h-5 w-5 text-primary" />}
            </div>
          </button>

          {/* Dark Mode */}
          <button
            onClick={() => setTheme("dark")}
            className={`group relative p-6 rounded-lg border-2 transition-all ${
              theme === "dark" ? "border-primary" : "border-[#3a4a3d] hover:border-[#4a5a4d]"
            }`}
          >
            <div className="aspect-video bg-[#1a2a1d] rounded-md mb-4 overflow-hidden border border-[#3a4a3d]">
              <div className="h-8 bg-[#2a3a2d] border-b border-[#3a4a3d]"></div>
              <div className="p-4 space-y-2">
                <div className="h-3 bg-[#3a4a3d] rounded w-3/4"></div>
                <div className="h-3 bg-[#2a3a2d] rounded w-1/2"></div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Moon className="h-4 w-4" />
                <span className="font-medium">Dark Mode</span>
              </div>
              {theme === "dark" && <Check className="h-5 w-5 text-primary" />}
            </div>
          </button>

          {/* System Default */}
          <button
            onClick={() => setTheme("system")}
            className={`group relative p-6 rounded-lg border-2 transition-all ${
              theme === "system" ? "border-primary" : "border-[#3a4a3d] hover:border-[#4a5a4d]"
            }`}
          >
            <div className="aspect-video bg-gradient-to-br from-white to-[#1a2a1d] rounded-md mb-4 overflow-hidden border border-[#3a4a3d]">
              <div className="h-8 bg-gradient-to-r from-gray-100 to-[#2a3a2d] border-b border-[#3a4a3d]"></div>
              <div className="p-4 space-y-2">
                <div className="h-3 bg-[#3a4a3d]/50 rounded w-3/4"></div>
                <div className="h-3 bg-[#2a3a2d]/50 rounded w-1/2"></div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Monitor className="h-4 w-4" />
                <span className="font-medium">System Default</span>
              </div>
              {theme === "system" && <Check className="h-5 w-5 text-primary" />}
            </div>
          </button>
        </div>
      </div>

      {/* Notifications */}
      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold mb-2">Notifications</h2>
          <p className="text-sm text-muted-foreground">Manage your email alerts and system notifications.</p>
        </div>

        <div className="space-y-3">
          <Card className="p-4 bg-[#2a3a2d] border-[#3a4a3d]">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
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
          </Card>

          <Card className="p-4 bg-[#2a3a2d] border-[#3a4a3d]">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
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
          </Card>

          <Card className="p-4 bg-[#2a3a2d] border-[#3a4a3d]">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
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
          </Card>

          <Card className="p-4 bg-[#2a3a2d] border-[#3a4a3d]">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-orange-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
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
          </Card>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end gap-3 pt-4">
        <Button variant="outline" className="bg-transparent">
          Reset Defaults
        </Button>
        <Button>
          <Check className="mr-2 h-4 w-4" />
          Save Changes
        </Button>
      </div>
    </div>
  )
}
