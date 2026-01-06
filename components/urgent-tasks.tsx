import { Card } from "@/components/ui/card"
import { AlertTriangle, CreditCard, UserPlus, Clock } from "lucide-react"
import { apiRequest } from "@/lib/api"

interface UrgentTask {
  type: "pending_bookings" | "incomplete_payments" | "upcoming_departures"
  count: number
  details: string
  priority: "high" | "medium" | "low"
}

async function getUrgentTasks() {
  try {
    const data: { tasks: UrgentTask[] } = await apiRequest("/operator/bookings/urgent-tasks")
    return data.tasks
  } catch (error) {
    console.error("[v0] Failed to load urgent tasks:", error)
    return []
  }
}

export async function UrgentTasks() {
  const tasks = await getUrgentTasks()

  const getTaskDisplay = (task: UrgentTask) => {
    switch (task.type) {
      case "pending_bookings":
        return { icon: UserPlus, color: "text-info", title: "Pending Bookings" }
      case "incomplete_payments":
        return { icon: CreditCard, color: "text-warning", title: "Incomplete Payments" }
      case "upcoming_departures":
        return { icon: Clock, color: "text-destructive", title: "Upcoming Departures" }
      default:
        return { icon: AlertTriangle, color: "text-muted-foreground", title: "Task" }
    }
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Urgent Tasks</h3>
        {tasks.length > 0 && (
          <span className="text-xs bg-destructive text-destructive-foreground px-2 py-1 rounded-full">
            {tasks.length} New
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
          tasks.map((task, index) => {
            const display = getTaskDisplay(task)
            return (
              <div key={index} className="flex gap-3">
                <div className={`mt-1 ${display.color}`}>
                  <display.icon className="h-5 w-5" />
                </div>
                <div className="flex-1 space-y-1">
                  <div className="font-medium">{display.title}</div>
                  <p className="text-sm text-muted-foreground">{task.details}</p>
                  <div className="text-xs text-muted-foreground">{task.count} items</div>
                </div>
              </div>
            )
          })
        )}
      </div>

      <button className="mt-4 w-full text-center text-sm text-primary hover:underline">View All Tasks</button>
    </Card>
  )
}
