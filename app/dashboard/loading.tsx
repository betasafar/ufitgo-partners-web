export default function DashboardLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-20 bg-muted/20 rounded-lg" />
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="h-32 bg-muted/20 rounded-lg" />
        <div className="h-32 bg-muted/20 rounded-lg" />
        <div className="h-32 bg-muted/20 rounded-lg" />
        <div className="h-32 bg-muted/20 rounded-lg" />
      </div>
      <div className="h-96 bg-muted/20 rounded-lg" />
    </div>
  )
}
