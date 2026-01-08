"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { authService } from "../api/services/auth.service"

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [operator, setOperator] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in on mount
    const storedOperator = authService.getStoredOperator()
    if (storedOperator) {
      setOperator(storedOperator)
    }
    setLoading(false)
  }, [])

  const login = async (email, password) => {
    const response = await authService.login(email, password)
    setOperator(response.operator)
    return response
  }

  const logout = async () => {
    await authService.logout()
    setOperator(null)
  }

  const updateOperator = (updatedData) => {
    const updated = { ...operator, ...updatedData }
    setOperator(updated)
    localStorage.setItem("operator", JSON.stringify(updated))
  }

  return (
    <AuthContext.Provider value={{ operator, loading, login, logout, updateOperator }}>{children}</AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider")
  }
  return context
}
