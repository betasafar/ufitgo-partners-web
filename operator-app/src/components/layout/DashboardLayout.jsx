import { Sidebar } from "./Sidebar"
import { Header } from "./Header"

export const DashboardLayout = ({ children, title }) => {
  return (
    <div className="flex min-h-screen bg-bg text-fg">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <Header title={title} />

        <main className="flex-1 p-8 bg-bg">
          {children}
        </main>
      </div>
    </div>
  )
}
