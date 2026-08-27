"use client"

import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { usePromos } from "../../../hooks/usePromos"
import { Button } from "../../common/Button"
import { Plus, Tag } from "lucide-react"

export const PromosScreen = () => {
  const navigate = useNavigate()
  const { promos, loading, fetchPromos, togglePromoStatus } = usePromos()

  useEffect(() => {
    fetchPromos()
  }, [fetchPromos])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-fg">Promo Codes</h1>
          <p className="text-fg/60 mt-1">Manage your discount codes and promotions</p>
        </div>
        <Button onClick={() => navigate("/promos/create")} className="flex items-center gap-2">
          <Plus size={18} />
          Create Promo Code
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : promos.length === 0 ? (
        <div className="bg-card border border-border rounded-2xl p-12 text-center">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Tag size={32} className="text-primary" />
          </div>
          <h3 className="text-lg font-semibold text-fg mb-2">No Promo Codes Yet</h3>
          <p className="text-fg/60 max-w-md mx-auto mb-6">
            Create promotional codes to offer discounts to your pilgrims and boost your bookings.
          </p>
          <Button onClick={() => navigate("/promos/create")}>
            Create Your First Promo
          </Button>
        </div>
      ) : (
        <div className="bg-card border border-border rounded-2xl overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-bg/50 border-b border-border">
                <th className="py-4 px-6 text-sm font-medium text-fg/70">Code</th>
                <th className="py-4 px-6 text-sm font-medium text-fg/70">Discount</th>
                <th className="py-4 px-6 text-sm font-medium text-fg/70">Usage</th>
                <th className="py-4 px-6 text-sm font-medium text-fg/70">Validity</th>
                <th className="py-4 px-6 text-sm font-medium text-fg/70">Status</th>
                <th className="py-4 px-6 text-sm font-medium text-fg/70">Actions</th>
              </tr>
            </thead>
            <tbody>
              {promos.map((promo) => (
                <tr key={promo.id} className="border-b border-border hover:bg-bg/50 transition">
                  <td className="py-4 px-6">
                    <span className="font-semibold px-2 py-1 bg-primary/10 text-primary rounded-lg">
                      {promo.code}
                    </span>
                    {promo.packageId && (
                      <p className="text-xs text-fg/60 mt-1">Package Specific</p>
                    )}
                  </td>
                  <td className="py-4 px-6 font-medium">
                    {promo.type === "PERCENTAGE" ? `${promo.value}%` : `₦${promo.value.toLocaleString()}`}
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-sm">
                      {promo.currentUses} {promo.maxUses ? `/ ${promo.maxUses}` : ""}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-sm">
                    {promo.validUntil ? new Date(promo.validUntil).toLocaleDateString() : "Never expires"}
                  </td>
                  <td className="py-4 px-6">
                    <span
                      className={`px-3 py-1 text-xs font-medium rounded-full ${
                        promo.isActive
                          ? "bg-green-500/10 text-green-500"
                          : "bg-red-500/10 text-red-500"
                      }`}
                    >
                      {promo.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <button
                      onClick={() => togglePromoStatus(promo.id)}
                      className="text-sm text-primary hover:underline font-medium"
                    >
                      {promo.isActive ? "Deactivate" : "Activate"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
