import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { AlertCircle } from "lucide-react"

export function VerificationBanner() {
  return (
    <Card className="p-6 bg-gradient-to-r from-card to-muted border-warning/20">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 space-y-4">
          <div className="flex items-center gap-3">
            <AlertCircle className="h-6 w-6 text-warning" />
            <div>
              <h3 className="font-semibold text-lg">Complete Your Verification Profile</h3>
              <p className="text-sm text-muted-foreground">
                Your account currently has <span className="text-warning font-medium">Limited Access</span>. To unlock
                full functionality including package publishing and direct payments, please complete the required
                documentation.
              </p>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Profile completion</span>
              <span className="font-medium text-warning">60% Complete</span>
            </div>
            <Progress value={60} className="h-2" />
          </div>
        </div>
        <Button className="bg-primary hover:bg-primary/90">Resume Setup</Button>
      </div>
    </Card>
  )
}
