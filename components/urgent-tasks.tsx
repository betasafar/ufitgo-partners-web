import { Card } from "@/components/ui/card"
import { AlertTriangle, CreditCard, UserPlus, Clock } from "lucide-react"
import { apiRequest } from "@/lib/api"
import Link from "next/link"

interface UrgentTask {
  id: string
  title: string
  description: string
  count: number
  priority: "high" | "medium" | "low"
  action?: string
}

async function getUrgentTasks() {
  try {
    const data: { tasks: UrgentTask[]; totalUrgent: number } = await apiRequest("/operator/bookings/urgent-tasks")
    return { tasks: data.tasks || [], totalUrgent: data.totalUrgent || 0 }
  } catch (error) {
    console.error("[v0] Failed to load urgent tasks:", error)
    return { tasks: [], totalUrgent: 0 }
  }
}

export async function UrgentTasks() {
  const { tasks, totalUrgent } = await getUrgentTasks()

  const getTaskIcon = (taskId: string) => {
    switch (taskId) {
      case "incomplete-payments":
        return CreditCard
      case "pending-approvals":
        return UserPlus
      case "visa-expiring":
        return AlertTriangle
      case "upcoming-departures":
        return Clock
      default:
        return AlertTriangle
    }
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold">Urgent Tasks</h3>
        {totalUrgent > 0 && (
          <span className="text-xs bg-destructive text-destructive-foreground px-3 py-1 rounded-full font-medium">
            {totalUrgent} New
          </span>
        )}
      </div>

      <div className="space-y-4">
        {tasks.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <AlertTriangle className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No urgent tasks at the moment</p>
          </div>
        ) : (
          tasks.map((task) => {
            const Icon = getTaskIcon(task.id)
            return (
              <div key={task.id} className="flex gap-4 items-start">
                <div className="mt-0.5 text-warning">
                  <Icon className="h-5 w-5" />
                </div>
                <div className="flex-1 space-y-1">
                  <div className="font-medium text-sm">{task.title}</div>
                  <p className="text-xs text-muted-foreground">
                    {task.count} {task.count === 1 ? "item" : "items"}
                  </p>
                </div>
              </div>
            )
          })
        )}
      </div>

      <Link
        href="/dashboard/tasks"
        className="mt-6 block w-full text-center text-sm text-[#F5A623] hover:underline font-medium"
      >
        View All Tasks
      </Link>
    </Card>
  )
}
