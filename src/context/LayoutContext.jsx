import { createContext, useContext, useState } from "react"

const LayoutContext = createContext()

export const LayoutProvider = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false) // mobile
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false) // desktop
  const [isLoading, setIsLoading] = useState(false)

  return (
    <LayoutContext.Provider
      value={{
        sidebarOpen,
        setSidebarOpen,
        sidebarCollapsed,
        setSidebarCollapsed,
        isLoading,
        setIsLoading,
      }}
    >
      {children}
    </LayoutContext.Provider>
  )
}

export const useLayout = () => useContext(LayoutContext)
