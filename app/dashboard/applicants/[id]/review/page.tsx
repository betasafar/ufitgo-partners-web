import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { X, Check, CalendarIcon, Plane, FileText, Receipt, Clock } from "lucide-react"

export default function ReviewBookingPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <a href="/dashboard" className="hover:text-foreground">
          Dashboard
        </a>
        <span>/</span>
        <a href="/dashboard/applicants" className="hover:text-foreground">
          Applicants
        </a>
        <span>/</span>
        <span className="text-primary">Review Booking Request</span>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Review Booking Request</h1>
          <p className="text-sm text-muted-foreground">
            Booking Ref: <strong>#BKG-2024-889</strong> • Date: Oct 24, 2024
          </p>
        </div>
        <Badge className="bg-yellow-500/10 text-yellow-600 border-yellow-500/20">Pending Review</Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-card/50 border-border/50">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="relative">
                  <Avatar className="size-20">
                    <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=Ibrahim" />
                    <AvatarFallback>IM</AvatarFallback>
                  </Avatar>
                  <div className="absolute -bottom-1 -right-1 size-6 rounded-full bg-green-500 border-2 border-background flex items-center justify-center">
                    <Check className="size-3 text-white" />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h2 className="text-xl font-bold text-foreground">Ibrahim Musa</h2>
                      <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mt-1">
                        <span className="flex items-center gap-1.5">
                          <FileText className="size-4" />
                          Passport: A12345678
                        </span>
                        <span className="flex items-center gap-1.5">🇳🇬 Nationality: Nigerian</span>
                        <span className="flex items-center gap-1.5">♂ Gender: Male</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">Identity Check</span>
                      <Badge className="bg-green-500/10 text-green-600 border-green-500/20">Pass</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-card/50 border-border/50">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center gap-2">
                  <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">📦</div>
                  <h3 className="font-semibold">Package Details</h3>
                </div>

                <div>
                  <div className="text-sm text-muted-foreground mb-1">Selected Package</div>
                  <div className="text-lg font-bold text-foreground">Gold Umrah Package 2024</div>
                  <div className="text-xs text-muted-foreground mt-1">Includes: 5-Star Hotel, Visa, Transport</div>
                </div>

                <div className="pt-3 border-t border-border/50 space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <CalendarIcon className="size-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Travel Date</span>
                    <span className="ml-auto font-medium">15 Nov 2024</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="size-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Duration</span>
                    <span className="ml-auto font-medium">14 Days</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Plane className="size-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Departure From</span>
                    <span className="ml-auto font-medium">Lagos (LOS)</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card/50 border-border/50">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center gap-2">
                  <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">📄</div>
                  <h3 className="font-semibold">Documentation</h3>
                </div>

                <div className="space-y-3">
                  <button className="w-full flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors text-left">
                    <div className="flex items-center gap-3">
                      <div className="flex size-10 items-center justify-center rounded-md bg-red-500/10">📕</div>
                      <div>
                        <div className="text-sm font-medium">International Passport</div>
                        <div className="text-xs text-muted-foreground">Valid until 2029</div>
                      </div>
                    </div>
                    <Button size="sm" variant="outline">
                      VIEW
                    </Button>
                  </button>

                  <button className="w-full flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors text-left">
                    <div className="flex items-center gap-3">
                      <div className="flex size-10 items-center justify-center rounded-md bg-yellow-500/10">💉</div>
                      <div>
                        <div className="text-sm font-medium">Vaccination Card</div>
                        <div className="text-xs text-muted-foreground">Yellow Fever / COVID-19</div>
                      </div>
                    </div>
                    <Button size="sm" variant="outline">
                      VIEW
                    </Button>
                  </button>

                  <button className="w-full flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors text-left">
                    <div className="flex items-center gap-3">
                      <div className="flex size-10 items-center justify-center rounded-md bg-blue-500/10">✈</div>
                      <div>
                        <div className="text-sm font-medium">Visa Status</div>
                        <div className="text-xs text-yellow-600 flex items-center gap-1">
                          <span className="size-1.5 rounded-full bg-yellow-600" />
                          Processing
                        </div>
                      </div>
                    </div>
                    <Button size="sm" variant="outline">
                      CHECK
                    </Button>
                  </button>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-card/50 border-border/50">
            <CardContent className="p-6 space-y-4">
              <h3 className="font-semibold uppercase text-xs text-muted-foreground">Note to Applicant (Optional)</h3>
              <Textarea
                placeholder="Enter reason for rejection or additional instructions..."
                className="min-h-[100px]"
              />
            </CardContent>
          </Card>

          <div className="flex items-center gap-3">
            <Button variant="outline" className="gap-2 flex-1 bg-transparent">
              <X className="size-4" />
              Reject Booking
            </Button>
            <Button className="gap-2 flex-1">
              <Check className="size-4" />
              Accept Booking
            </Button>
          </div>

          <p className="text-xs text-muted-foreground flex items-start gap-2">
            <span>ℹ</span>
            <span>Accepting will trigger an automated email and SMS to the applicant.</span>
          </p>
        </div>

        <div className="space-y-6">
          <Card className="bg-card/50 border-border/50">
            <CardContent className="p-6 space-y-4">
              <h3 className="font-semibold uppercase text-xs text-muted-foreground">Payment Summary</h3>

              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Total Package Cost</span>
                  <span className="font-semibold">₦3,500,000</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Amount Paid</span>
                  <span className="font-semibold text-green-600">₦1,500,000</span>
                </div>
                <div className="h-px bg-border" />
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Outstanding Balance</span>
                  <span className="text-lg font-bold text-red-600">₦2,000,000</span>
                </div>
              </div>

              <div className="pt-4 border-t border-border/50">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-primary/10">
                  <Receipt className="size-5 text-primary shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold">Payment Receipt #9921</div>
                    <div className="text-xs text-muted-foreground">Uploaded Oct 23, 2024 via Bank Transfer</div>
                  </div>
                </div>
                <Button variant="link" size="sm" className="w-full mt-2 text-primary">
                  Verify Receipt
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
