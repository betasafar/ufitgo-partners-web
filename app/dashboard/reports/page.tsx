import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FileText, DollarSign, RotateCcw, Bed, History } from "lucide-react"

const reportTypes = [
  {
    id: "manifest",
    icon: FileText,
    title: "Applicant Manifest",
    description: "Complete list of pilgrims including passport details, visa status, and grouping assignments.",
  },
  {
    id: "financial",
    icon: DollarSign,
    title: "Financial Report",
    description: "Detailed breakdown of payments received, outstanding balances, and agent commissions.",
  },
  {
    id: "refund",
    icon: RotateCcw,
    title: "Refund Logs",
    description: "History of all processed and pending refunds, including rejection reasons.",
  },
  {
    id: "accommodation",
    icon: Bed,
    title: "Accommodation List",
    description: "Rooming lists for Makkah and Madinah hotels sorted by package tiers.",
  },
]

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Export Reports</h1>
          <p className="text-sm text-muted-foreground">
            Generate comprehensive data exports for operational logistics, visa processing, and financial auditing.
          </p>
        </div>
        <Button variant="outline" className="gap-2 bg-transparent">
          <History className="size-4" />
          Recent Exports
        </Button>
      </div>

      <div>
        <div className="flex items-center gap-2 mb-4">
          <div className="flex size-8 items-center justify-center rounded-md bg-primary/10">
            <span className="text-lg">1</span>
          </div>
          <h2 className="text-lg font-semibold">Select Report Type</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reportTypes.map((report) => (
            <button
              key={report.id}
              className="group relative flex items-start gap-4 p-4 text-left rounded-lg border border-border/50 bg-card/50 hover:border-primary/50 hover:bg-card transition-all"
            >
              <div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <report.icon className="size-6" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-foreground mb-1">{report.title}</h3>
                <p className="text-sm text-muted-foreground">{report.description}</p>
              </div>
              <div className="absolute top-4 right-4 size-5 rounded-full border-2 border-primary opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          ))}
        </div>
      </div>

      <Card className="bg-card/50 border-border/50">
        <CardContent className="p-6 space-y-6">
          <div className="flex items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-md bg-primary/10">
              <span className="text-lg">2</span>
            </div>
            <h2 className="text-lg font-semibold">Configure Parameters</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="date-from">Date Range</Label>
              <div className="flex gap-3 items-center">
                <Input type="date" id="date-from" defaultValue="2023-10-01" />
                <span className="text-sm text-muted-foreground">to</span>
                <Input type="date" defaultValue="2023-10-31" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="visa-status">Visa Status</Label>
              <Select defaultValue="all">
                <SelectTrigger id="visa-status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="group">Group/Agent</Label>
              <Select defaultValue="all-groups">
                <SelectTrigger id="group">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-groups">All Groups</SelectItem>
                  <SelectItem value="group-a">Group A - Lagos</SelectItem>
                  <SelectItem value="group-b">Group B - Kano</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Custom Range</Label>
              <Select defaultValue="custom">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="custom">Custom Range</SelectItem>
                  <SelectItem value="this-month">This Month</SelectItem>
                  <SelectItem value="last-month">Last Month</SelectItem>
                  <SelectItem value="this-year">This Year</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-3">
            <Label>Format Columns</Label>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <Checkbox id="passport-photos" defaultChecked />
                <span className="text-sm">Include Passport Photos</span>
              </label>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
            <span className="text-yellow-600">⚠</span>
            <p className="text-sm text-yellow-600">
              This export contains Sensitive PII. Download activity is logged for security auditing.
            </p>
          </div>

          <div className="flex gap-3">
            <Button variant="outline">Discard Changes</Button>
            <Button className="gap-2">
              <FileText className="size-4" />
              Generate Report
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
