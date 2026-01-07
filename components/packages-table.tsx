"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { Package } from "@/lib/types"
import { Search, Eye, Pencil } from "lucide-react"
import Image from "next/image"
import { Progress } from "@/components/ui/progress"
import Link from "next/link"

interface PackagesTableProps {
  packages: Package[]
}

export function PackagesTable({ packages }: PackagesTableProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "text-success"
      case "paused":
        return "text-warning"
      case "closed":
        return "text-muted-foreground"
      default:
        return ""
    }
  }

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input type="search" placeholder="Search packages by name or ID..." className="pl-10" />
          </div>
          <select className="bg-background border border-input rounded-md px-4 py-2">
            <option>Status: All</option>
            <option>Active</option>
            <option>Paused</option>
            <option>Closed</option>
          </select>
          <select className="bg-background border border-input rounded-md px-4 py-2">
            <option>Season: 2024</option>
            <option>2023</option>
            <option>2025</option>
          </select>
          <select className="bg-background border border-input rounded-md px-4 py-2">
            <option>Type: Hajj & Umrah</option>
            <option>Hajj</option>
            <option>Umrah</option>
          </select>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>PACKAGE NAME</TableHead>
              <TableHead>SEASON</TableHead>
              <TableHead>PRICE (NGN)</TableHead>
              <TableHead>CAPACITY</TableHead>
              <TableHead>STATUS</TableHead>
              <TableHead className="text-right">ACTIONS</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {packages.map((pkg) => {
              const filledPercentage = (pkg.booked / pkg.capacity) * 100
              return (
                <TableRow key={pkg.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Image
                        src={pkg.images[0] || "/placeholder.svg?height=48&width=48&query=kaaba"}
                        alt={pkg.title}
                        width={48}
                        height={48}
                        className="rounded-lg object-cover"
                      />
                      <div>
                        <div className="font-medium">{pkg.title}</div>
                        <div className="text-sm text-muted-foreground">ID: #{String(pkg.id).slice(0, 12)}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{pkg.season}</TableCell>
                  <TableCell>
                    <div className="font-medium">₦ {pkg.price.toLocaleString()}</div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="text-sm">
                        <span className="font-medium">{pkg.booked} Booked</span>
                        <span className="text-muted-foreground"> / {pkg.capacity} Total</span>
                      </div>
                      <Progress value={filledPercentage} className="h-1.5" />
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className={`text-sm font-medium ${getStatusColor(pkg.status)}`}>
                      ● {pkg.status.charAt(0).toUpperCase() + pkg.status.slice(1)}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link href={`/dashboard/packages/${pkg.id}/edit`}>
                        <Button variant="ghost" size="icon">
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Link href={`/dashboard/packages/${pkg.id}`}>
                        <Button variant="ghost" size="icon">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>

        <div className="flex items-center justify-between pt-4">
          <div className="text-sm text-muted-foreground">Showing 1-4 of {packages.length} packages</div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              Previous
            </Button>
            <Button className="bg-primary" size="sm">
              Next
            </Button>
          </div>
        </div>
      </div>
    </Card>
  )
}
