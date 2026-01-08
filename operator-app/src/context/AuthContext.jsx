"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { authService } from "../api/services/auth.service.js"

const AuthContext = createContext(null)

const TOKEN_KEY = "auth_token"
const OPERATOR_KEY = "operator"

export const AuthProvider = ({ children }) => {
  const [operator, setOperator] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = localStorage.getItem(TOKEN_KEY)
        const storedOperator = localStorage.getItem(OPERATOR_KEY)

        if (token && storedOperator) {
          const operatorData = JSON.parse(storedOperator)
          setOperator(operatorData)
        }
      } catch (error) {
        console.error("Error restoring auth:", error)
        localStorage.removeItem(TOKEN_KEY)
        localStorage.removeItem(OPERATOR_KEY)
      } finally {
        setLoading(false)
      }
    }

    initializeAuth()
  }, [])

  const login = async (email, password) => {
    try {
      const response = await authService.login(email, password)

      if (response.access_token) {
        localStorage.setItem(TOKEN_KEY, response.access_token)
      }
      if (response.operator) {
        localStorage.setItem(OPERATOR_KEY, JSON.stringify(response.operator))
        setOperator(response.operator)
      }

      return response
    } catch (error) {
      console.error("Login error:", error)
      throw error
    }
  }

  const logout = async () => {
    try {
      await authService.logout()
    } catch (error) {
      console.error("Logout error:", error)
    } finally {
      localStorage.removeItem(TOKEN_KEY)
      localStorage.removeItem(OPERATOR_KEY)
      setOperator(null)
    }
  }

  const updateOperator = (updatedData) => {
    const updated = { ...operator, ...updatedData }
    setOperator(updated)
    localStorage.setItem(OPERATOR_KEY, JSON.stringify(updated))
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
