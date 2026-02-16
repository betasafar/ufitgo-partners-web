import { apiClient } from "../client.js"
import { ENDPOINTS } from "../endpoints.js"

export const verificationService = {
  getStatus: async (operatorId) => {
    return await apiClient.get(`${ENDPOINTS.VERIFICATION.STATUS}?operatorId=${operatorId}`)
  },

  getDocuments: async () => {
    return await apiClient.get(ENDPOINTS.DOCUMENTS.LIST)
  },

  uploadDocument: async (formData) => {
    return await apiClient.post(ENDPOINTS.DOCUMENTS.UPLOAD, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
  },

  getDocument: async (id) => {
    return await apiClient.get(ENDPOINTS.DOCUMENTS.GET(id))
  },
}
