import { apiClient } from "../client"
import { ENDPOINTS } from "../endpoints"

export const verificationService = {
  getStatus: async () => {
    const response = await apiClient.get(ENDPOINTS.VERIFICATION.STATUS)
    return response.data
  },

  getDocuments: async () => {
    const response = await apiClient.get(ENDPOINTS.DOCUMENTS.LIST)
    return response.data
  },

  uploadDocument: async (formData) => {
    const response = await apiClient.post(ENDPOINTS.DOCUMENTS.UPLOAD, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    return response.data
  },

  getDocument: async (id) => {
    const response = await apiClient.get(ENDPOINTS.DOCUMENTS.GET(id))
    return response.data
  },
}
