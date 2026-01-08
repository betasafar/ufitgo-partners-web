import apiClient from "../client"
import { ENDPOINTS } from "../endpoints"

export const packagesService = {
  getAll: async () => {
    return await apiClient.get(ENDPOINTS.PACKAGES.LIST)
  },

  create: async (data) => {
    return await apiClient.post(ENDPOINTS.PACKAGES.CREATE, data)
  },

  update: async (id, data) => {
    return await apiClient.put(ENDPOINTS.PACKAGES.UPDATE(id), data)
  },

  delete: async (id) => {
    return await apiClient.delete(ENDPOINTS.PACKAGES.DELETE(id))
  },

  getById: async (id) => {
    return await apiClient.get(ENDPOINTS.PACKAGES.GET(id))
  },
}
