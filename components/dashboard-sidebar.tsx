"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Package,
  Users,
  CreditCard,
  Settings,
  HelpCircle,
  LogOut,
  MessageSquare,
  ChevronDown,
  TrendingUp,
  FileText,
  History,
  DollarSign,
  UserCheck,
  Clock,
} from "lucide-react"
import type { Operator } from "@/lib/types"
import { useState } from "react"

interface DashboardSidebarProps {
  operator: Operator
}

const navigation = [
  {
    name: "Dashboard",
    icon: LayoutDashboard,
    subItems: [
      { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
      { name: "Financial", href: "/dashboard/financial", icon: DollarSign },
      { name: "Reports", href: "/dashboard/reports", icon: FileText },
    ],
  },
  {
    name: "Packages",
    icon: Package,
    subItems: [
      { name: "All Packages", href: "/dashboard/packages", icon: Package },
      { name: "Performance", href: "/dashboard/packages/performance", icon: TrendingUp },
    ],
  },
  {
    name: "Applicants",
    icon: Users,
    subItems: [
      { name: "All Travelers", href: "/dashboard/applicants", icon: Users },
      { name: "Pending Review", href: "/dashboard/applicants?status=pending", icon: Clock },
      { name: "Verified", href: "/dashboard/applicants?status=verified", icon: UserCheck },
    ],
  },
  { name: "Payments", href: "/dashboard/payments", icon: CreditCard },
  {
    name: "Communications",
    icon: MessageSquare,
    subItems: [
      { name: "Compose", href: "/dashboard/communications", icon: MessageSquare },
      { name: "History", href: "/dashboard/communications/history", icon: History },
    ],
  },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
]

export function DashboardSidebar({ operator }: DashboardSidebarProps) {
  const pathname = usePathname()
  const [loggingOut, setLoggingOut] = useState(false)
  const [expandedItems, setExpandedItems] = useState<string[]>(["Dashboard"])

  const handleLogout = async () => {
    setLoggingOut(true)
    try {
      await fetch("/api/auth/logout", { method: "POST" })
      window.location.href = "/login"
    } catch (error) {
      console.error("Logout failed:", error)
      setLoggingOut(false)
    }
  }

  const toggleExpanded = (itemName: string) => {
    setExpandedItems((prev) =>
      prev.includes(itemName) ? prev.filter((name) => name !== itemName) : [...prev, itemName],
    )
  }

  const isParentActive = (item: (typeof navigation)[0]) => {
    if (item.subItems) {
      return item.subItems.some((sub) => pathname === sub.href)
    }
    return pathname === item.href
  }

  return (
    <aside className="w-64 bg-sidebar border-r border-sidebar-border flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-xl">✈️</span>
          </div>
          <div>
            <div className="font-bold text-sidebar-foreground">{operator.companyName}</div>
            <div className="text-xs text-muted-foreground">
              {operator.verified ? (
                <span className="text-success">✓ Verified</span>
              ) : (
                <span className="text-warning">Pending Approval</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navigation.map((item) => {
          const hasSubItems = "subItems" in item && item.subItems
          const isExpanded = expandedItems.includes(item.name)
          const isActive = isParentActive(item)

          if (hasSubItems) {
            return (
              <div key={item.name} className="space-y-1">
                <button
                  onClick={() => toggleExpanded(item.name)}
                  className={cn(
                    "w-full flex items-center justify-between gap-3 px-4 py-3 rounded-lg transition-colors",
                    isActive ? "bg-primary/10 text-primary" : "text-sidebar-foreground hover:bg-sidebar-accent",
                  )}
                >
                  <div className="flex items-center gap-3">
                    <item.icon className="h-5 w-5" />
                    <span className="font-medium">{item.name}</span>
                  </div>
                  <ChevronDown className={cn("h-4 w-4 transition-transform", isExpanded && "transform rotate-180")} />
                </button>

                {isExpanded && (
                  <div className="ml-4 space-y-1 border-l-2 border-sidebar-border pl-4">
                    {item.subItems.map((subItem) => {
                      const isSubActive = pathname === subItem.href
                      return (
                        <Link
                          key={subItem.href}
                          href={subItem.href}
                          className={cn(
                            "flex items-center gap-3 px-4 py-2 rounded-lg transition-colors text-sm",
                            isSubActive
                              ? "bg-primary text-primary-foreground"
                              : "text-sidebar-foreground hover:bg-sidebar-accent",
                          )}
                        >
                          <subItem.icon className="h-4 w-4" />
                          <span>{subItem.name}</span>
                        </Link>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          }

          return (
            <Link
              key={item.name}
              href={item.href!}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                pathname === item.href
                  ? "bg-primary text-primary-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent",
              )}
            >
              <item.icon className="h-5 w-5" />
              <span className="font-medium">{item.name}</span>
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-sidebar-border space-y-1">
        <Link
          href="#"
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-sidebar-foreground hover:bg-sidebar-accent transition-colors"
        >
          <HelpCircle className="h-5 w-5" />
          <span>Help Center</span>
        </Link>
        <button
          onClick={handleLogout}
          disabled={loggingOut}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sidebar-foreground hover:bg-sidebar-accent transition-colors disabled:opacity-50"
        >
          <LogOut className="h-5 w-5" />
          <span>{loggingOut ? "Signing out..." : "Sign Out"}</span>
        </button>
      </div>
    </aside>
  )
}
