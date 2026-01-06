import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { CalendarIcon, Clock, HelpCircle } from "lucide-react"

export default function PackageAvailabilityPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
            <a href="/dashboard/packages" className="hover:text-foreground">
              Packages
            </a>
            <span>/</span>
            <a href="#" className="hover:text-foreground">
              Hajj 2024 Premium
            </a>
            <span>/</span>
            <span className="text-primary">Availability</span>
          </div>
          <h1 className="text-2xl font-bold text-foreground">Booking Availability Settings</h1>
          <p className="text-sm text-muted-foreground">
            Configure the registration window for the <strong>Hajj 2024 Premium</strong> package. Manage automated
            open/close dates or manually override availability.
          </p>
        </div>
        <Button variant="outline" className="gap-2 bg-transparent">
          <HelpCircle className="size-4" />
          Help
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-card/50 border-border/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h2 className="text-lg font-semibold">Booking Status</h2>
                    <span className="px-2 py-0.5 rounded-md bg-primary text-primary-foreground text-xs uppercase font-medium">
                      Open
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Bookings are currently accepting new applicants. Toggle to manually close regardless of the
                    schedule.
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-start gap-2 p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                <span className="text-yellow-600">⚠</span>
                <p className="text-sm text-yellow-600">
                  Closing bookings will hide the "Apply Now" button on the public portal immediately.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/50 border-border/50">
            <CardContent className="p-6 space-y-6">
              <div className="flex items-center gap-2 text-primary">
                <div className="flex size-8 items-center justify-center rounded-md bg-primary/10">⏰</div>
                <h2 className="text-lg font-semibold">Automated Schedule</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="opens-on">Opens On</Label>
                  <p className="text-xs text-muted-foreground mb-1.5">WAT (GMT+1)</p>
                  <div className="relative">
                    <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                    <Input type="date" id="opens-on" defaultValue="2024-02-15" className="pl-9" />
                  </div>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                    <Input type="time" defaultValue="09:00" className="pl-9" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="closes-on">Closes On</Label>
                  <p className="text-xs text-muted-foreground mb-1.5">WAT (GMT+1)</p>
                  <div className="relative">
                    <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                    <Input type="date" id="closes-on" defaultValue="2024-05-30" className="pl-9" />
                  </div>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                    <Input type="time" defaultValue="23:59" className="pl-9" />
                  </div>
                </div>
              </div>

              <Card className="bg-muted/50 border-border/50">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">⏱</div>
                    <div>
                      <h3 className="font-semibold mb-1">Booking Window Duration</h3>
                      <p className="text-sm text-muted-foreground">
                        Based on the selected dates, the registration window will remain open for{" "}
                        <strong className="text-foreground">105 days</strong>
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </CardContent>
          </Card>

          <div className="flex gap-3">
            <Button variant="outline">Discard Changes</Button>
            <Button className="gap-2">
              <CalendarIcon className="size-4" />
              Update Availability
            </Button>
          </div>
        </div>

        <div>
          <Card className="bg-card/50 border-border/50 sticky top-6">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center gap-2">
                <Clock className="size-5 text-primary" />
                <h3 className="font-semibold uppercase text-xs text-muted-foreground">Time Zone</h3>
              </div>
              <div>
                <div className="text-lg font-semibold text-foreground">West Africa Time (WAT)</div>
                <div className="text-sm text-muted-foreground">Lagos, Nigeria</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
