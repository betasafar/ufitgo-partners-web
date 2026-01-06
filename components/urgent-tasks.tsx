import { Card } from "@/components/ui/card"
import { AlertTriangle, CreditCard, UserPlus } from "lucide-react"

const tasks = [
  {
    icon: AlertTriangle,
    title: "Visa Expiry Alert",
    description: '5 travelers in the "Premium Hajj" group have visas expiring in less than 72 hours...',
    time: "2 hours ago",
    color: "text-warning",
  },
  {
    icon: CreditCard,
    title: "New Bulk Payment",
    description: 'Received ₦12.5M transfer from "Group A". Verification needed.',
    time: "4 hours ago",
    color: "text-info",
  },
  {
    icon: UserPlus,
    title: "New Registration",
    description: "Fatima Zahra registered for Umrah Deluxe Package.",
    time: "Yesterday",
    color: "text-success",
  },
]

export function UrgentTasks() {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Urgent Tasks</h3>
        <span className="text-xs bg-destructive text-destructive-foreground px-2 py-1 rounded-full">3 New</span>
      </div>

      <div className="space-y-4">
        {tasks.map((task, index) => (
          <div key={index} className="flex gap-3">
            <div className={`mt-1 ${task.color}`}>
              <task.icon className="h-5 w-5" />
            </div>
            <div className="flex-1 space-y-1">
              <div className="font-medium">{task.title}</div>
              <p className="text-sm text-muted-foreground line-clamp-2">{task.description}</p>
              <div className="text-xs text-muted-foreground">{task.time}</div>
            </div>
          </div>
        ))}
      </div>

      <button className="mt-4 w-full text-center text-sm text-primary hover:underline">View All Notifications</button>
    </Card>
  )
}
