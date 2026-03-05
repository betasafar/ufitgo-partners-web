import { useState, useEffect } from "react"
import { DashboardLayout } from "../../components/layout/DashboardLayout"
import { Spinner } from "../../components/common/Spinner"

const PTARequestsScreen = () => {
  const [activeTab, setActiveTab] = useState("bulk") // "bulk" or "individual"
  const [loading, setLoading] = useState(false)
  
  return (
    <DashboardLayout title="PTA Requests">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-fg mb-2">Travel Funds Assistance (PTA/BTA)</h1>
        <p className="text-fg/60">Manage pilgrim travel allowance requests and track status with partner banks.</p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border mb-6">
        <button
          onClick={() => setActiveTab("bulk")}
          className={`px-6 py-3 font-medium transition-colors relative ${
            activeTab === "bulk" ? "text-primary" : "text-fg/60 hover:text-fg"
          }`}
        >
          Bulk Requests
          {activeTab === "bulk" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />}
        </button>
        <button
          onClick={() => setActiveTab("individual")}
          className={`px-6 py-3 font-medium transition-colors relative ${
            activeTab === "individual" ? "text-primary" : "text-fg/60 hover:text-fg"
          }`}
        >
          Individual Requests
          {activeTab === "individual" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />}
        </button>
      </div>

      {activeTab === "bulk" ? <BulkRequestsTab /> : <IndividualRequestsTab />}
    </DashboardLayout>
  )
}

const BulkRequestsTab = () => {
  const [step, setStep] = useState(1) // 1: Select Package, 2: Select Pilgrims, 3: Edit & Submit
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Bulk Submission Workflow</h2>
        <div className="flex gap-2 text-sm">
          <span className={`px-2 py-1 rounded ${step === 1 ? "bg-primary text-white" : "bg-bg text-fg/40"}`}>1. Package</span>
          <span className={`px-2 py-1 rounded ${step === 2 ? "bg-primary text-white" : "bg-bg text-fg/40"}`}>2. Pilgrims</span>
          <span className={`px-2 py-1 rounded ${step === 3 ? "bg-primary text-white" : "bg-bg text-fg/40"}`}>3. Submit</span>
        </div>
      </div>

      {step === 1 && (
        <div className="card p-8 text-center border-dashed border-2 flex flex-col items-center">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-2xl mb-4">📦</div>
          <h3 className="font-bold mb-2">Select a Travel Package</h3>
          <p className="text-fg/60 mb-6 max-w-sm">We'll load the list of pilgrims registered for the selected package to begin bulk PTA processing.</p>
          <button onClick={() => setStep(2)} className="btn-primary px-8">Browse Packages</button>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-sm text-fg/60">Showing pilgrims for: <span className="font-bold text-fg">Umrah Premium March 2024</span></p>
            <button onClick={() => setStep(3)} className="btn-primary">Next: Confirm Details</button>
          </div>
          <div className="card overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-bg/50 border-b border-border">
                <tr>
                  <th className="px-6 py-4 font-medium"><input type="checkbox" className="rounded border-border" /></th>
                  <th className="px-6 py-4 font-medium">Pilgrim Name</th>
                  <th className="px-6 py-4 font-medium">Passport No.</th>
                  <th className="px-6 py-4 font-medium">Visa Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {[1, 2, 3].map(i => (
                  <tr key={i} className="hover:bg-bg/10">
                    <td className="px-6 py-4"><input type="checkbox" defaultChecked className="rounded border-border" /></td>
                    <td className="px-6 py-4 font-medium">Musa Ibrahim</td>
                    <td className="px-6 py-4 text-fg/60 font-mono">A00234567</td>
                    <td className="px-6 py-4"><span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded text-xs">Group Pending</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="card p-6">
          <h3 className="font-bold mb-4">Final Review & Submit Batch</h3>
          <div className="p-4 bg-bg rounded-lg mb-6 flex items-start gap-4">
            <span className="text-2xl">⚠️</span>
            <p className="text-sm text-fg/70">Ensure all passport numbers and expiry dates match exactly. Ufitgo routes these structured files to partner banks for immediate processing.</p>
          </div>
          <div className="flex gap-4">
            <button onClick={() => setStep(2)} className="btn-outline px-6">Back</button>
            <button onClick={() => alert("Batch Submitted!")} className="btn-primary flex-1">Submit Batch (3 Pilgrims)</button>
          </div>
        </div>
      )}
    </div>
  )
}

const IndividualRequestsTab = () => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Self-Service Trackng</h2>
        <div className="flex gap-2">
          <input type="text" placeholder="Search by name or passport..." className="bg-bg border border-border rounded-lg px-4 py-2 text-sm" />
        </div>
      </div>
      
      <div className="card overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-bg/50 border-b border-border">
            <tr>
              <th className="px-6 py-4 font-medium">Pilgrim</th>
              <th className="px-6 py-4 font-medium">Allowance</th>
              <th className="px-6 py-4 font-medium">Status</th>
              <th className="px-6 py-4 font-medium">Bank Ref</th>
              <th className="px-6 py-4 font-medium">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            <tr>
              <td className="px-6 py-4">
                <div className="font-medium">Aisha Bello</div>
                <div className="text-xs text-fg/40">Z44556677 • Saudi Arabia</div>
              </td>
              <td className="px-6 py-4 text-sm">PTA ($2,500)</td>
              <td className="px-6 py-4">
                <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs">Approved</span>
              </td>
              <td className="px-6 py-4 font-mono text-sm">UF-BNK-9903</td>
              <td className="px-6 py-4">
                <button className="text-primary text-sm font-medium hover:underline">Manage</button>
              </td>
            </tr>
            <tr>
              <td className="px-6 py-4">
                <div className="font-medium">Hamzat Lawal</div>
                <div className="text-xs text-fg/40">P88990011 • Saudi Arabia</div>
              </td>
              <td className="px-6 py-4 text-sm">BTA ($5,000)</td>
              <td className="px-6 py-4">
                <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded text-xs">Processing</span>
              </td>
              <td className="px-6 py-4 font-mono text-sm">-</td>
              <td className="px-6 py-4">
                <button className="text-primary text-sm font-medium hover:underline">Update Status</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default PTARequestsScreen
