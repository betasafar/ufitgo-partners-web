"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Send, Eye, Calendar } from "lucide-react"
import { apiRequest } from "@/lib/api"

export default function CommunicationHistoryPage() {
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({ totalSent: 0, deliveryRate: 0, failed: 0 })

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const data = await apiRequest("/notifications/history")
        setHistory(data.notifications || [])

        // Calculate stats
        const total = data.notifications?.length || 0
        const delivered = data.notifications?.filter((n: any) => n.status === "DELIVERED").length || 0
        const failed = data.notifications?.filter((n: any) => n.status === "FAILED").length || 0

        setStats({
          totalSent: total,
          deliveryRate: total > 0 ? (delivered / total) * 100 : 0,
          failed,
        })
      } catch (error) {
        console.error("Failed to load history:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchHistory()
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Communication History</h1>
          <p className="text-sm text-muted-foreground">Audit trail of all alerts and notifications sent to pilgrims</p>
        </div>
        <Button className="gap-2" asChild>
          <a href="/dashboard/communications">
            <Send className="size-4" />
            Send New Alert
          </a>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-card/50 border-border/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase text-muted-foreground mb-1">Total Sent</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-foreground">{stats.totalSent}</span>
                </div>
              </div>
              <div className="flex size-12 items-center justify-center rounded-lg bg-muted/50">📧</div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 border-border/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase text-muted-foreground mb-1">Delivery Rate</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-foreground">{stats.deliveryRate.toFixed(1)}%</span>
                </div>
              </div>
              <div className="flex size-12 items-center justify-center rounded-lg bg-muted/50">✓</div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 border-border/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase text-muted-foreground mb-1">Failed Messages</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-foreground">{stats.failed}</span>
                </div>
              </div>
              <div className="flex size-12 items-center justify-center rounded-lg bg-muted/50">⚠</div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-card/50 border-border/50">
        <CardContent className="p-6 space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input placeholder="Search Applicant Name, Passport ID, or Message Content" className="pl-9" />
            </div>
            <Select defaultValue="all">
              <SelectTrigger className="w-full sm:w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Type: All</SelectItem>
                <SelectItem value="email">Email</SelectItem>
                <SelectItem value="sms">SMS</SelectItem>
                <SelectItem value="whatsapp">WhatsApp</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="all-status">
              <SelectTrigger className="w-full sm:w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-status">Status: All</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
                <SelectItem value="read">Read</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="gap-2 bg-transparent">
              <Calendar className="size-4" />
              Last 30 Days
            </Button>
          </div>

          {loading ? (
            <div className="text-center py-12 text-muted-foreground">Loading history...</div>
          ) : history.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">No communication history found</div>
          ) : (
            <div className="border border-border/50 rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="text-xs uppercase">Timestamp</TableHead>
                    <TableHead className="text-xs uppercase">Recipient</TableHead>
                    <TableHead className="text-xs uppercase">Message</TableHead>
                    <TableHead className="text-xs uppercase">Channel</TableHead>
                    <TableHead className="text-xs uppercase">Status</TableHead>
                    <TableHead className="text-xs uppercase">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {history.map((item: any) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <div className="text-sm">{new Date(item.createdAt).toLocaleDateString()}</div>
                        <div className="text-xs text-muted-foreground">
                          {new Date(item.createdAt).toLocaleTimeString()}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm font-medium">{item.recipientName || "N/A"}</div>
                        <div className="text-xs text-muted-foreground">ID: {item.recipientId}</div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm font-medium">{item.title}</div>
                        <div className="text-xs text-muted-foreground truncate max-w-xs">{item.message}</div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1.5">
                          {item.channel === "EMAIL" && "✉"}
                          {item.channel === "SMS" && "💬"}
                          {item.channel === "WHATSAPP" && "📱"}
                          {item.channel === "PUSH" && "🔔"}
                          <span className="text-sm">{item.channel}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {item.status === "DELIVERED" && (
                          <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full bg-green-500/10 text-green-600 text-xs">
                            <span className="size-1.5 rounded-full bg-green-600" />
                            Delivered
                          </span>
                        )}
                        {item.status === "FAILED" && (
                          <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full bg-red-500/10 text-red-600 text-xs">
                            <span className="size-1.5 rounded-full bg-red-600" />
                            Failed
                          </span>
                        )}
                        {item.status === "READ" && (
                          <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full bg-blue-500/10 text-blue-600 text-xs">
                            <span className="size-1.5 rounded-full bg-blue-600" />
                            Read
                          </span>
                        )}
                        {item.status === "PENDING" && (
                          <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full bg-yellow-500/10 text-yellow-600 text-xs">
                            <span className="size-1.5 rounded-full bg-yellow-600" />
                            Pending
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          <Eye className="size-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          <div className="flex items-center justify-between text-sm">
            <div className="text-muted-foreground">
              Showing <span className="font-medium text-foreground">1-{history.length}</span> of{" "}
              <span className="font-medium text-foreground">{history.length}</span> alerts
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
