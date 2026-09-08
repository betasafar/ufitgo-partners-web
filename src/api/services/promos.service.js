import { apiClient } from "../client.js"

export const promosService = {
  getPromos: async () => {
    const { data } = await apiClient.get("/operator/promos")
    return data
  },
  createPromo: async (promoData) => {
    const { data } = await apiClient.post("/operator/promos", promoData)
    return data
  },
  togglePromoStatus: async (id) => {
    const { data } = await apiClient.patch(`/operator/promos/${id}/toggle`)
    return data
  },
}
