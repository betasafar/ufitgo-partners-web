import { getCurrentUser } from "@/lib/api-proxy"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { CheckCircle2, Circle, Upload, MessageCircle, TrendingUp, Award } from "lucide-react"
import { TierBadge } from "@/components/tier-badge"
import Link from "next/link"

interface UpgradeRequirement {
  id: string
  label: string
  current: number
  target: number
  completed: boolean
  action?: { label: string; href: string }
}

async function getUpgradeProgress(operatorId: number, currentTier: string) {
  // Mock data - replace with actual API call
  const requirements: Record<string, UpgradeRequirement[]> = {
    BRONZE: [
      { id: "trips", label: "Complete successful trips", current: 5, target: 5, completed: true },
      { id: "trust", label: "Maintain trust score", current: 85, target: 80, completed: true },
      {
        id: "license",
        label: "Upload Hajj License",
        current: 0,
        target: 1,
        completed: false,
        action: { label: "Upload Documents", href: "/dashboard/verification" },
      },
      {
        id: "cac",
        label: "Upload CAC Certificate",
        current: 0,
        target: 1,
        completed: false,
        action: { label: "Upload Documents", href: "/dashboard/verification" },
      },
      { id: "bookings", label: "Achieve total bookings", current: 23, target: 50, completed: false },
    ],
    SILVER: [
      { id: "trips", label: "Complete successful trips", current: 15, target: 20, completed: false },
      { id: "trust", label: "Maintain trust score", current: 88, target: 85, completed: true },
      { id: "revenue", label: "Generate total revenue", current: 2500000, target: 5000000, completed: false },
      { id: "rating", label: "Customer satisfaction rating", current: 4.2, target: 4.5, completed: false },
      { id: "tax", label: "Upload Tax Clearance", current: 1, target: 1, completed: true },
    ],
  }

  return requirements[currentTier] || []
}

export default async function UpgradePage() {
  const user = await getCurrentUser()
  if (!user) redirect("/login")

  const currentTier = user.tier || "BRONZE"
  const nextTier = currentTier === "BRONZE" ? "SILVER" : currentTier === "SILVER" ? "GOLD" : null

  if (!nextTier) {
    return (
      <div className="p-6">
        <Card>
          <CardHeader>
            <CardTitle>You're at the highest tier!</CardTitle>
            <CardDescription>Congratulations! You have unlocked all features.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <Award className="w-12 h-12 text-yellow-500" />
              <div>
                <p className="font-semibold">GOLD Tier Member</p>
                <p className="text-sm text-muted-foreground">Keep maintaining excellent performance!</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const requirements = await getUpgradeProgress(user.id, currentTier)
  const completedCount = requirements.filter((r) => r.completed).length
  const totalCount = requirements.length
  const progressPercent = Math.round((completedCount / totalCount) * 100)

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Upgrade Progress</h1>
          <p className="text-muted-foreground">Track your path to the next tier</p>
        </div>
        <TierBadge tier={currentTier} size="lg" showLabel />
      </div>

      {/* Progress Overview */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">Your Path to {nextTier} Tier</CardTitle>
              <CardDescription className="mt-2">
                Complete {totalCount - completedCount} more requirement{totalCount - completedCount !== 1 ? "s" : ""} to
                unlock automatic upgrade
              </CardDescription>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-primary">{progressPercent}%</div>
              <div className="text-sm text-muted-foreground">Complete</div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Progress value={progressPercent} className="h-3 mb-4" />
          <p className="text-sm text-muted-foreground">
            {completedCount} of {totalCount} requirements completed
          </p>
        </CardContent>
      </Card>

      {/* Requirements Checklist */}
      <Card>
        <CardHeader>
          <CardTitle>Requirements Checklist</CardTitle>
          <CardDescription>Complete these requirements to qualify for {nextTier} tier</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {requirements.map((req) => (
            <div
              key={req.id}
              className={`flex items-start gap-4 p-4 rounded-lg border ${
                req.completed
                  ? "bg-green-50 border-green-200 dark:bg-green-950/20 dark:border-green-900"
                  : "bg-muted/20"
              }`}
            >
              <div className="mt-0.5">
                {req.completed ? (
                  <CheckCircle2 className="w-6 h-6 text-green-600" />
                ) : (
                  <Circle className="w-6 h-6 text-muted-foreground" />
                )}
              </div>

              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold">{req.label}</h4>
                  <span className={`text-sm font-medium ${req.completed ? "text-green-600" : "text-muted-foreground"}`}>
                    {req.current}/{req.target}
                  </span>
                </div>

                {!req.completed && <Progress value={(req.current / req.target) * 100} className="h-2 mb-2" />}

                {req.action && !req.completed && (
                  <Link href={req.action.href}>
                    <Button size="sm" variant="outline" className="mt-2 bg-transparent">
                      {req.action.label}
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Benefits Preview */}
      <Card>
        <CardHeader>
          <CardTitle>What You'll Unlock with {nextTier} Tier</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {nextTier === "SILVER" && (
            <>
              <div className="flex gap-3 p-3 rounded-lg bg-muted/30">
                <TrendingUp className="w-5 h-5 text-primary shrink-0" />
                <div>
                  <p className="font-semibold text-sm">Higher Booking Limits</p>
                  <p className="text-xs text-muted-foreground">Up to 50 bookings per month</p>
                </div>
              </div>
              <div className="flex gap-3 p-3 rounded-lg bg-muted/30">
                <Upload className="w-5 h-5 text-primary shrink-0" />
                <div>
                  <p className="font-semibold text-sm">Flexible Package Dates</p>
                  <p className="text-xs text-muted-foreground">Offer variable departure dates</p>
                </div>
              </div>
            </>
          )}
          {nextTier === "GOLD" && (
            <>
              <div className="flex gap-3 p-3 rounded-lg bg-muted/30">
                <Award className="w-5 h-5 text-primary shrink-0" />
                <div>
                  <p className="font-semibold text-sm">Custom Pricing</p>
                  <p className="text-xs text-muted-foreground">Set your own package prices</p>
                </div>
              </div>
              <div className="flex gap-3 p-3 rounded-lg bg-muted/30">
                <TrendingUp className="w-5 h-5 text-primary shrink-0" />
                <div>
                  <p className="font-semibold text-sm">Advanced Analytics</p>
                  <p className="text-xs text-muted-foreground">Predictive insights & benchmarks</p>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Help Section */}
      <Card className="border-primary/20 bg-primary/5">
        <CardHeader>
          <CardTitle className="text-lg">Need Help?</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Have questions about the upgrade process? Our team is here to help.
          </p>
          <Button variant="outline">
            <MessageCircle className="w-4 h-4 mr-2" />
            Contact Support
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
