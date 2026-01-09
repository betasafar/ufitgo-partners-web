import { apiClient } from "../client.js"
import { ENDPOINTS } from "../endpoints"

export const packagesService = {
  // ========================
  // PACKAGES CRUD
  // ========================
  getAll: async () => {
    const res = await apiClient.get(ENDPOINTS.PACKAGES.LIST)
    return res.data
  },

  getById: async (id) => {
    const res = await apiClient.get(ENDPOINTS.PACKAGES.GET(id))
    return res.data
  },

  create: async (data) => {
    const res = await apiClient.post(ENDPOINTS.PACKAGES.CREATE, data)
    return res.data
  },

  update: async (id, data) => {
    const res = await apiClient.put(ENDPOINTS.PACKAGES.UPDATE(id), data)
    return res.data
  },

  delete: async (id) => {
    const res = await apiClient.delete(ENDPOINTS.PACKAGES.DELETE(id))
    return res.data
  },

  // ========================
  // METADATA (ENUMS)
  // ========================
  getPackageTypes: async () => {
    const res = await apiClient.get(ENDPOINTS.PACKAGES.TYPES)
    return res.data
  },

  getServiceLevels: async () => {
    const res = await apiClient.get(ENDPOINTS.PACKAGES.SERVICE_LEVELS)
    return res.data
  },
}
