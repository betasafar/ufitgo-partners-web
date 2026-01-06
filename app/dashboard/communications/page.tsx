import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Bold, Italic, Underline, List, Link, ImageIcon, History, Send, Save, Eye, Plus } from "lucide-react"

export default function CommunicationsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Communications Center</h1>
          <p className="text-sm text-muted-foreground">
            Compose and send important updates to your travelers across all packages. All messages are logged for
            compliance.
          </p>
        </div>
        <Button variant="outline" className="gap-2 bg-transparent">
          <History className="size-4" />
          View History
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-card/50 border-border/50">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center gap-2 text-primary">
                <div className="flex size-8 items-center justify-center rounded-md bg-primary/10">
                  <span className="text-sm font-bold">📡</span>
                </div>
                <h2 className="text-lg font-semibold">Broadcast Configuration</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="target-package" className="text-xs uppercase text-muted-foreground">
                    Target Package
                  </Label>
                  <Select defaultValue="all">
                    <SelectTrigger id="target-package" className="mt-1.5 w-full">
                      <SelectValue placeholder="Select a recipient group..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Active Packages</SelectItem>
                      <SelectItem value="premium-religious">Premium Religious Pilgrimage 2024</SelectItem>
                      <SelectItem value="europe-tour">Europe Grand Tour Package</SelectItem>
                      <SelectItem value="holy-land">Holy Land Experience 2024</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="mt-1.5 text-xs text-yellow-600 flex items-start gap-1.5">
                    <span>⚠</span>
                    <span>This will filter recipients based on their active booking status.</span>
                  </p>
                </div>

                <div>
                  <Label htmlFor="subject" className="text-xs uppercase text-muted-foreground">
                    Subject Line
                  </Label>
                  <Input id="subject" placeholder="e.g., Important Update Regarding Flight HA-402" className="mt-1.5" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/50 border-border/50">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Bold className="size-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Italic className="size-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Underline className="size-4" />
                  </Button>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <List className="size-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Link className="size-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <ImageIcon className="size-4" />
                  </Button>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 text-xs">
                <span className="text-muted-foreground">VARIABLES:</span>
                <code className="px-2 py-1 bg-muted rounded text-foreground">{"{First_Name}"}</code>
                <code className="px-2 py-1 bg-muted rounded text-foreground">{"{Passport_Number}"}</code>
              </div>

              <Textarea placeholder="Type your message here..." className="min-h-[240px] resize-none" />

              <div className="flex gap-3">
                <Button variant="outline" className="gap-2 bg-transparent">
                  <Save className="size-4" />
                  Save as Draft
                </Button>
                <Button variant="outline" className="gap-2 bg-transparent">
                  <Eye className="size-4" />
                  Preview
                </Button>
                <Button className="gap-2 ml-auto">
                  <Send className="size-4" />
                  Send Broadcast
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="bg-card/50 border-border/50">
            <CardContent className="p-6 space-y-4">
              <h3 className="text-sm font-semibold uppercase text-muted-foreground">Recipient Summary</h3>
              <div>
                <div className="text-4xl font-bold text-primary">142</div>
                <div className="text-sm text-muted-foreground">Travelers</div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Package</span>
                  <span className="text-foreground">Premium Religious Pilgrimage 2024</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status</span>
                  <span className="text-green-600 flex items-center gap-1">
                    <span className="size-1.5 rounded-full bg-green-600" />
                    Active & Paid
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Channel</span>
                  <span className="text-foreground">Email & SMS</span>
                </div>
              </div>
              <Button variant="outline" size="sm" className="w-full bg-transparent">
                View Recipient List
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-card/50 border-border/50">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold">Quick Templates</h3>
                <Button variant="ghost" size="sm" className="text-primary h-auto p-0">
                  Manage
                </Button>
              </div>
              <div className="space-y-2">
                {[
                  { title: "Payment Reminder", desc: "Reminder: Your second installment i..." },
                  { title: "Flight Itinerary Update", desc: "Updates have been made to flight N..." },
                  { title: "Visa Confirmation", desc: "Great news! Your Hajj visa has been..." },
                ].map((template) => (
                  <button
                    key={template.title}
                    className="w-full text-left p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-foreground">{template.title}</div>
                        <div className="text-xs text-muted-foreground truncate">{template.desc}</div>
                      </div>
                      <Plus className="size-4 text-muted-foreground shrink-0 mt-0.5" />
                    </div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/50 border-border/50">
            <CardContent className="p-6">
              <h3 className="text-sm font-semibold mb-3">Recent History</h3>
              <p className="text-xs text-muted-foreground">No recent broadcasts</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
