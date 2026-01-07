"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FileText, DollarSign, RotateCcw, Bed, History, Download } from "lucide-react"

const reportTypes = [
  {
    id: "manifest",
    icon: FileText,
    title: "Applicant Manifest",
    description: "Complete list of pilgrims including passport details, visa status, and grouping assignments.",
    endpoint: "applicant-manifest",
  },
  {
    id: "financial",
    icon: DollarSign,
    title: "Financial Report",
    description: "Detailed breakdown of payments received, outstanding balances, and agent commissions.",
    endpoint: "financial",
  },
  {
    id: "refund",
    icon: RotateCcw,
    title: "Refund Logs",
    description: "History of all processed and pending refunds, including rejection reasons.",
    endpoint: "refunds",
  },
  {
    id: "accommodation",
    icon: Bed,
    title: "Accommodation List",
    description: "Rooming lists for Makkah and Madinah hotels sorted by package tiers.",
    endpoint: "accommodation",
  },
]

export default function ReportsPage() {
  const [selectedReport, setSelectedReport] = useState<string>("manifest")
  const [loading, setLoading] = useState(false)
  const [params, setParams] = useState({
    startDate: "2023-10-01",
    endDate: "2023-10-31",
    visaStatus: "all",
    group: "all-groups",
    format: "csv",
    includePhotos: true,
  })

  const handleExportReport = async () => {
    setLoading(true)
    try {
      const queryParams = new URLSearchParams({
        type: selectedReport,
        format: params.format,
        startDate: params.startDate,
        endDate: params.endDate,
        visaStatus: params.visaStatus,
        group: params.group,
        includePhotos: params.includePhotos.toString(),
      })

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL || ""}/operator/reports/export?${queryParams}`,
        {
          credentials: "include",
        },
      )

      if (!response.ok) throw new Error("Export failed")

      const data = await response.json()

      // Trigger download
      const blob = new Blob([params.format === "csv" ? data.content : JSON.stringify(data)], {
        type: params.format === "csv" ? "text/csv" : "application/pdf",
      })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `${selectedReport}-report-${new Date().toISOString().split("T")[0]}.${params.format}`
      a.click()
    } catch (error) {
      console.error("Export error:", error)
    } finally {
      setLoading(false)
    }
  }

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
              onClick={() => setSelectedReport(report.id)}
              className={`group relative flex items-start gap-4 p-4 text-left rounded-lg border transition-all ${
                selectedReport === report.id
                  ? "border-primary/50 bg-card"
                  : "border-border/50 bg-card/50 hover:border-primary/50 hover:bg-card"
              }`}
            >
              <div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <report.icon className="size-6" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-foreground mb-1">{report.title}</h3>
                <p className="text-sm text-muted-foreground">{report.description}</p>
              </div>
              {selectedReport === report.id && (
                <div className="absolute top-4 right-4 size-5 rounded-full border-2 border-primary bg-primary flex items-center justify-center">
                  <span className="text-primary-foreground text-xs">✓</span>
                </div>
              )}
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
                <Input
                  type="date"
                  id="date-from"
                  value={params.startDate}
                  onChange={(e) => setParams({ ...params, startDate: e.target.value })}
                />
                <span className="text-sm text-muted-foreground">to</span>
                <Input
                  type="date"
                  value={params.endDate}
                  onChange={(e) => setParams({ ...params, endDate: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="visa-status">Visa Status</Label>
              <Select value={params.visaStatus} onValueChange={(v) => setParams({ ...params, visaStatus: v })}>
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
              <Select value={params.group} onValueChange={(v) => setParams({ ...params, group: v })}>
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
              <Label>Export Format</Label>
              <Select value={params.format} onValueChange={(v) => setParams({ ...params, format: v })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="csv">CSV</SelectItem>
                  <SelectItem value="pdf">PDF</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-3">
            <Label>Format Columns</Label>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <Checkbox
                  id="passport-photos"
                  checked={params.includePhotos}
                  onCheckedChange={(checked) => setParams({ ...params, includePhotos: checked === true })}
                />
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
            <Button
              variant="outline"
              onClick={() =>
                setParams({
                  startDate: "2023-10-01",
                  endDate: "2023-10-31",
                  visaStatus: "all",
                  group: "all-groups",
                  format: "csv",
                  includePhotos: true,
                })
              }
            >
              Discard Changes
            </Button>
            <Button className="gap-2" onClick={handleExportReport} disabled={loading}>
              <Download className="size-4" />
              {loading ? "Generating..." : "Generate Report"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
