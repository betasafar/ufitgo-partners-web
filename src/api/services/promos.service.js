import { api } from "../client.js"

export const promosService = {
  getPromos: async () => {
    const { data } = await api.get("/operator/promos")
    return data
  },
  createPromo: async (promoData) => {
    const { data } = await api.post("/operator/promos", promoData)
    return data
  },
  togglePromoStatus: async (id) => {
    const { data } = await api.patch(`/operator/promos/${id}/toggle`)
    return data
  },
}
