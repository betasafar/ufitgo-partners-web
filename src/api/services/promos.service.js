import { apiClient } from "../client.js"

// apiClient's response interceptor already unwraps axios's response.data,
// and these operator promo endpoints return bare arrays/objects (no {success,data} wrapper).
export const promosService = {
  getPromos: async () => {
    return await apiClient.get("/operator/promos")
  },
  createPromo: async (promoData) => {
    return await apiClient.post("/operator/promos", promoData)
  },
  togglePromoStatus: async (id) => {
    return await apiClient.patch(`/operator/promos/${id}/toggle`)
  },
}
