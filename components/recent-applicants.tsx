import { Card } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import type { Booking } from "@/lib/types"

interface RecentApplicantsProps {
  bookings: Booking[]
}

export function RecentApplicants({ bookings }: RecentApplicantsProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "text-success"
      case "partial":
        return "text-warning"
      case "pending":
        return "text-info"
      default:
        return "text-destructive"
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "completed":
        return "Approved"
      case "partial":
        return "Pending"
      case "pending":
        return "Reviewing"
      default:
        return "Incomplete"
    }
  }

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">Recent Travelers</h3>
            <p className="text-sm text-muted-foreground">Latest registrations requiring review.</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input type="search" placeholder="Search traveler..." className="pl-10 w-64" />
            </div>
            <Button variant="outline" size="icon">
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M3 6h18M7 12h10M10 18h4" strokeWidth={2} strokeLinecap="round" />
              </svg>
            </Button>
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>TRAVELER NAME</TableHead>
              <TableHead>PACKAGE</TableHead>
              <TableHead>DATE</TableHead>
              <TableHead>STATUS</TableHead>
              <TableHead>PAYMENT</TableHead>
              <TableHead className="text-right">ACTION</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bookings.map((booking) => (
              <TableRow key={booking.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={`/.jpg?height=40&width=40&query=${booking.name}`} />
                      <AvatarFallback>
                        {booking.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{booking.name}</div>
                      <div className="text-sm text-muted-foreground">{booking.passport}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{booking.package}</TableCell>
                <TableCell>{booking.bookingDate}</TableCell>
                <TableCell>
                  <span className={`text-sm font-medium ${getStatusColor(booking.status)}`}>
                    ● {getStatusLabel(booking.status)}
                  </span>
                </TableCell>
                <TableCell>₦ {booking.paymentProgress}%</TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button variant="ghost" size="icon">
                      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path
                          d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </Button>
                    <Button variant="ghost" size="icon">
                      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path
                          d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <circle cx={12} cy={12} r={3} strokeWidth={2} />
                      </svg>
                    </Button>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <div className="flex items-center justify-between pt-4">
          <div className="text-sm text-muted-foreground">
            Showing 1-{bookings.length} of {bookings.length} travelers
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled>
              Previous
            </Button>
            <Button className="bg-primary" size="sm" disabled>
              Next
            </Button>
          </div>
        </div>
      </div>
    </Card>
  )
}
