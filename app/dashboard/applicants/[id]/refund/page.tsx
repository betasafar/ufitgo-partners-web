import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { RotateCcw, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function IssueRefundPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/dashboard" className="hover:text-foreground">
          Home
        </Link>
        <span>/</span>
        <Link href="/dashboard/payments" className="hover:text-foreground">
          Payments
        </Link>
        <span>/</span>
        <span className="text-primary">Issue Refund</span>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Issue Refund</h1>
          <p className="text-sm text-muted-foreground">
            Process a full or partial refund for applicant <strong className="text-primary">#HAJJ-24-001</strong>
          </p>
        </div>
        <Link href="/dashboard/applicants/APP-001">
          <Button variant="outline" className="gap-2 bg-transparent">
            <ArrowLeft className="size-4" />
            Back to Applicant Profile
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-card/50 border-border/50">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <Avatar className="size-16">
                  <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=Fatima" />
                  <AvatarFallback>FY</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-foreground mb-1">Fatima Yusuf</h2>
                  <div className="text-sm text-muted-foreground">Hajj Premium 2024 Package</div>
                  <div className="flex items-center gap-4 mt-2 text-sm">
                    <div className="flex items-center gap-1.5">
                      <span className="text-muted-foreground">Passport No.</span>
                      <span className="font-medium">A12345678</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-muted-foreground">Payment Status</span>
                      <span className="text-green-600 font-medium">Completed</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-muted-foreground">Visa Status</span>
                      <span className="text-red-600 font-medium">Rejected</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/50 border-border/50">
            <CardContent className="p-6 space-y-6">
              <div className="flex items-center gap-2 text-primary">
                <div className="flex size-8 items-center justify-center rounded-md bg-primary/10">💰</div>
                <h2 className="text-lg font-semibold">Refund Details</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="refund-type" className="mb-1.5">
                    Refund Type
                  </Label>
                  <div className="grid grid-cols-2 gap-3">
                    <button className="flex flex-col items-center gap-2 p-4 rounded-lg border-2 border-primary bg-primary/5 hover:bg-primary/10 transition-colors">
                      <div className="text-2xl">💯</div>
                      <div className="text-sm font-semibold">Full Refund</div>
                      <div className="text-xs text-muted-foreground">Refund entire balance</div>
                    </button>
                    <button className="flex flex-col items-center gap-2 p-4 rounded-lg border border-border bg-muted/30 hover:bg-muted/50 transition-colors">
                      <div className="text-2xl">📊</div>
                      <div className="text-sm font-semibold">Partial Refund</div>
                      <div className="text-xs text-muted-foreground">Refund specific amount</div>
                    </button>
                  </div>
                </div>

                <div>
                  <Label htmlFor="refund-amount" className="mb-1.5">
                    Refund Amount (₦)
                  </Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">₦</span>
                    <Input
                      id="refund-amount"
                      type="text"
                      defaultValue="4,500,000"
                      className="pl-7 text-lg font-semibold"
                      readOnly
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-xs h-auto py-1 px-2"
                    >
                      NGN
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1.5">Max refundable: ₦4,500,000</p>
                </div>

                <div>
                  <Label htmlFor="reason" className="mb-1.5">
                    Reason for Refund
                  </Label>
                  <Select defaultValue="visa-denied">
                    <SelectTrigger id="reason">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="visa-denied">Visa Denied</SelectItem>
                      <SelectItem value="medical">Medical Emergency</SelectItem>
                      <SelectItem value="cancellation">Package Cancellation</SelectItem>
                      <SelectItem value="duplicate">Duplicate Payment</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="notes" className="mb-1.5">
                    Internal Notes <span className="text-muted-foreground">(Optional)</span>
                  </Label>
                  <Textarea
                    id="notes"
                    placeholder="Add any additional details about this transaction..."
                    className="min-h-[100px]"
                  />
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                <span className="text-yellow-600">ℹ</span>
                <div className="text-sm text-yellow-600">
                  <strong>Refunds are processed within 24-48 hours.</strong> Please verify the customer's bank details
                  before confirming.
                </div>
              </div>

              <div className="flex gap-3">
                <Button variant="outline" className="flex-1 bg-transparent">
                  Cancel
                </Button>
                <Button className="flex-1 gap-2">
                  <RotateCcw className="size-4" />
                  Review Refund
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="bg-card/50 border-border/50">
            <CardContent className="p-6 space-y-4">
              <h3 className="text-sm font-semibold uppercase text-muted-foreground">Financial Snapshot</h3>

              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Total Paid</span>
                  <span className="font-semibold text-foreground">₦4,500,000</span>
                </div>
                <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-green-500" style={{ width: "100%" }} />
                </div>
              </div>

              <div className="pt-3 border-t border-border/50 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Previous Refunds</span>
                  <span className="font-semibold">₦0.00</span>
                </div>
              </div>

              <div className="pt-3 border-t border-border/50">
                <div className="flex justify-between mb-2">
                  <span className="text-muted-foreground text-sm">Refundable Balance</span>
                  <span className="text-xl font-bold text-primary">₦4,500,000</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/50 border-border/50">
            <CardContent className="p-6 space-y-4">
              <h3 className="text-sm font-semibold uppercase text-muted-foreground">Refund Eligibility</h3>

              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  <div className="size-5 rounded-full bg-green-500/10 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-green-600 text-xs">✓</span>
                  </div>
                  <div>
                    <div className="text-sm font-medium">75% Refundable</div>
                    <div className="text-xs text-muted-foreground">Valid until 1st Ramadan (Mar 10, 2024)</div>
                  </div>
                </div>
              </div>

              <p className="text-xs text-muted-foreground pt-3 border-t border-border/50">
                Cancellations made after the deadline will forfeit the refundable amount per terms & conditions.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
