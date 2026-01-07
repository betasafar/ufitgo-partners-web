"use client"

import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { NotificationsPanel } from "@/components/notifications-panel"
import type { Operator } from "@/lib/types"

interface DashboardHeaderProps {
  operator: Operator
}

export function DashboardHeader({ operator }: DashboardHeaderProps) {
  const initials = operator.companyName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)

  return (
    <header className="h-16 border-b border-border bg-card px-6 flex items-center justify-between">
      <div className="flex-1 max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input type="search" placeholder="Search..." className="pl-10 bg-background" />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <NotificationsPanel />

        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src={operator.logo || "/placeholder.svg"} alt={operator.companyName} />
            <AvatarFallback className="bg-primary text-primary-foreground">{initials}</AvatarFallback>
          </Avatar>
          <div className="text-sm">
            <div className="font-medium">Admin</div>
            <div className="text-muted-foreground">{operator.email}</div>
          </div>
        </div>
      </div>
    </header>
  )
}
