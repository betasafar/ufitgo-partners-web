// src/api/services/auth.service.ts
import { apiClient } from "../client.js"
import { ENDPOINTS } from "../endpoints.js"

export const authService = {
  login: async (email: string, password: string) => {
    const response = await apiClient.post(ENDPOINTS.AUTH.LOGIN, { email, password })
    return response
  },

  logout: async () => {
    try {
      await apiClient.post(ENDPOINTS.AUTH.LOGOUT)
    } catch (error) {
      console.error("Logout error:", error)
    }
  },

  getProfile: async () => {
    return await apiClient.get(ENDPOINTS.AUTH.PROFILE)
  },

  isAuthenticated: () => {
    return !!localStorage.getItem("auth_token")
  },

  getStoredOperator: () => {
    const operator = localStorage.getItem("operator")
    return operator ? JSON.parse(operator) : null
  },
}

export type OnboardingFormData = {
  // Step 1 - Partner Type
  partnerType: "tour-operator" | "transport" | "sim-seller" | "tour-guide" | ""
  // Step 2 - Company Info
  country: string
  companyName: string
  tradingName: string
  rcNumber: string
  yearEstablished: string
  officeAddress: string
  // Step 2 - Tour Operator
  nahconLicense: string
  capacity: string
  // Step 2 - Transport
  transportReg: string
  fleetSize: string
  // Step 2 - SIM Seller
  telecomPermit: string
  supportedNetworks: string
  // Step 2 - Tour Guide
  guideLanguages: string
  guideExperience: string
  guideExpertise: string[]
  // Step 3 - Director / Contact
  directorTitle: string
  directorName: string
  directorPhone: string
  directorWhatsApp: string
  directorNin: string
  description: string
  // Step 4 - Auth Credentials
  email: string
  phone: string
  password: string
  confirmPassword: string
}

export const initialOnboardingData: OnboardingFormData = {
  partnerType: "",
  country: "Nigeria",
  companyName: "",
  tradingName: "",
  rcNumber: "",
  yearEstablished: "",
  officeAddress: "",
  nahconLicense: "",
  capacity: "",
  transportReg: "",
  fleetSize: "",
  telecomPermit: "",
  supportedNetworks: "",
  guideLanguages: "",
  guideExperience: "",
  guideExpertise: [],
  directorTitle: "Mr",
  directorName: "",
  directorPhone: "",
  directorWhatsApp: "",
  directorNin: "",
  description: "",
  email: "",
  phone: "",
  password: "",
  confirmPassword: "",
}

export const onboardingService = {
  register: async (
    data: OnboardingFormData,
    options?: {
      source?: "web" | "whatsapp"
      waPhone?: string
    }
  ) => {
    try {
      const params = new URLSearchParams()
      if (options?.source) params.set("source", options.source)
      if (options?.waPhone) params.set("wa_phone", options.waPhone)

      const currentYear = new Date().getFullYear()
      const foundedYear = data.yearEstablished ? Number(data.yearEstablished) : undefined
      const yearsOfExp = foundedYear ? Math.max(0, currentYear - foundedYear) : undefined

      const payload: Record<string, any> = {
        partnerType: data.partnerType,
        country: data.country,
        companyName: data.companyName,
        email: data.email,
        phone: data.phone,
        password: data.password,
      }

      if (data.tradingName) payload.tradingName = data.tradingName
      if (data.rcNumber) payload.cacNumber = data.rcNumber
      if (foundedYear) payload.foundedAt = foundedYear
      if (yearsOfExp !== undefined) payload.yearsOfExperience = yearsOfExp
      if (data.officeAddress) payload.officeAddress = data.officeAddress

      // Type-specific fields
      if (data.nahconLicense) payload.nahconLicense = data.nahconLicense
      if (data.capacity) payload.capacity = data.capacity
      if (data.transportReg) payload.transportReg = data.transportReg
      if (data.fleetSize) payload.fleetSize = data.fleetSize
      if (data.telecomPermit) payload.telecomPermit = data.telecomPermit
      if (data.supportedNetworks) payload.supportedNetworks = data.supportedNetworks

      // Tour guide fields
      if (data.guideLanguages) payload.guideLanguages = data.guideLanguages
      if (data.guideExperience) payload.guideExperience = data.guideExperience
      if (data.guideExpertise.length > 0) payload.guideExpertise = data.guideExpertise

      // Director / contact info
      if (data.directorTitle) payload.directorTitle = data.directorTitle
      if (data.directorName) payload.directorName = data.directorName
      if (data.directorPhone) payload.directorPhone = data.directorPhone
      if (data.directorWhatsApp) payload.directorWhatsApp = data.directorWhatsApp
      if (data.directorNin) payload.directorNin = data.directorNin
      if (data.description) payload.description = data.description

      const response = await apiClient.post(
        ENDPOINTS.AUTH.REGISTER,
        payload,
        { params }
      )

      if (response.data.access_token) {
        localStorage.setItem("auth_token", response.data.access_token)
      }
      if (response.data.operator) {
        localStorage.setItem("operator", JSON.stringify(response.data.operator))
      }

      return response.data
    } catch (error: any) {
      throw error.response?.data?.message || "Registration failed. Please try again."
    }
  },

  uploadDocument: async (documentType: string, file: File) => {
    const formData = new FormData()
    formData.append("documentType", documentType)
    formData.append("file", file)
    return await apiClient.post(ENDPOINTS.DOCUMENTS.UPLOAD, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })
  },
}
