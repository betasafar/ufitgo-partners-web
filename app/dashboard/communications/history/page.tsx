import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Send, Eye, Calendar } from "lucide-react"

const mockHistory = [
  {
    timestamp: "Dec 12, 2023",
    time: "10:45 AM",
    applicant: "Ibrahim Musa",
    passport: "A12345678",
    subject: "Visa Approval Confirmed",
    channel: "Email",
    status: "delivered",
  },
  {
    timestamp: "Dec 12, 2023",
    time: "09:30 AM",
    applicant: "Amina Bello",
    passport: "B98765432",
    subject: "Payment Reminder: 2nd Installment",
    channel: "SMS",
    status: "failed",
  },
  {
    timestamp: "Dec 11, 2023",
    time: "04:15 PM",
    applicant: "Yusuf Abdullahi",
    passport: "C45678912",
    subject: "Pre-departure Orientation Schedule",
    channel: "WhatsApp",
    status: "read",
  },
  {
    timestamp: "Dec 11, 2023",
    time: "02:00 PM",
    applicant: "Fatima Umar",
    passport: "D78901234",
    subject: "Flight Itinerary Update",
    channel: "Email",
    status: "sending",
  },
  {
    timestamp: "Dec 10, 2023",
    time: "08:45 AM",
    applicant: "Sani Mohammed",
    passport: "E34567890",
    subject: "Vaccination Requirement Alert",
    channel: "Push",
    status: "delivered",
  },
]

export default function CommunicationHistoryPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Communication History</h1>
          <p className="text-sm text-muted-foreground">Audit trail of all alerts and notifications sent to pilgrims</p>
        </div>
        <Button className="gap-2">
          <Send className="size-4" />
          Send New Alert
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-card/50 border-border/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase text-muted-foreground mb-1">Total Sent Today</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-foreground">145</span>
                  <span className="text-sm text-green-600">+12%</span>
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
                  <span className="text-3xl font-bold text-foreground">94.5%</span>
                  <span className="text-sm text-green-600">+2.1%</span>
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
                  <span className="text-3xl font-bold text-foreground">8</span>
                  <span className="text-sm text-red-600">-0.5%</span>
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

          <div className="border border-border/50 rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="text-xs uppercase">Timestamp</TableHead>
                  <TableHead className="text-xs uppercase">Applicant</TableHead>
                  <TableHead className="text-xs uppercase">Message Subject</TableHead>
                  <TableHead className="text-xs uppercase">Channel</TableHead>
                  <TableHead className="text-xs uppercase">Status</TableHead>
                  <TableHead className="text-xs uppercase">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockHistory.map((item, idx) => (
                  <TableRow key={idx}>
                    <TableCell>
                      <div className="text-sm">{item.timestamp}</div>
                      <div className="text-xs text-muted-foreground">{item.time}</div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm font-medium">{item.applicant}</div>
                      <div className="text-xs text-muted-foreground">Pass: {item.passport}</div>
                    </TableCell>
                    <TableCell className="text-sm">{item.subject}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5">
                        {item.channel === "Email" && "✉"}
                        {item.channel === "SMS" && "💬"}
                        {item.channel === "WhatsApp" && "📱"}
                        {item.channel === "Push" && "🔔"}
                        <span className="text-sm">{item.channel}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {item.status === "delivered" && (
                        <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full bg-green-500/10 text-green-600 text-xs">
                          <span className="size-1.5 rounded-full bg-green-600" />
                          Delivered
                        </span>
                      )}
                      {item.status === "failed" && (
                        <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full bg-red-500/10 text-red-600 text-xs">
                          <span className="size-1.5 rounded-full bg-red-600" />
                          Failed
                        </span>
                      )}
                      {item.status === "read" && (
                        <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full bg-blue-500/10 text-blue-600 text-xs">
                          <span className="size-1.5 rounded-full bg-blue-600" />
                          Read
                        </span>
                      )}
                      {item.status === "sending" && (
                        <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full bg-yellow-500/10 text-yellow-600 text-xs">
                          <span className="size-1.5 rounded-full bg-yellow-600" />
                          Sending...
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

          <div className="flex items-center justify-between text-sm">
            <div className="text-muted-foreground">
              Showing <span className="font-medium text-foreground">1-5</span> of{" "}
              <span className="font-medium text-foreground">1,248</span> alerts
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" disabled>
                Previous
              </Button>
              <Button variant="outline" size="sm" className="bg-primary text-primary-foreground">
                1
              </Button>
              <Button variant="outline" size="sm">
                2
              </Button>
              <Button variant="outline" size="sm">
                3
              </Button>
              <Button variant="outline" size="sm">
                ...
              </Button>
              <Button variant="outline" size="sm">
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
