"use client"

const INACTIVITY_TIMEOUT = 30 * 60 * 1000 // 30 minutes in milliseconds
const WARNING_TIMEOUT = 25 * 60 * 1000 // 25 minutes - show warning 5 minutes before logout

let inactivityTimer: NodeJS.Timeout | null = null
let warningTimer: NodeJS.Timeout | null = null

export const sessionManager = {
  startMonitoring(onWarning: () => void, onTimeout: () => void) {
    this.resetTimers(onWarning, onTimeout)

    // Monitor user activity
    const events = ["mousedown", "keydown", "scroll", "touchstart", "click"]

    const resetActivity = () => {
      this.resetTimers(onWarning, onTimeout)
    }

    events.forEach((event) => {
      document.addEventListener(event, resetActivity, true)
    })

    // Store cleanup function
    return () => {
      events.forEach((event) => {
        document.removeEventListener(event, resetActivity, true)
      })
      this.clearTimers()
    }
  },

  resetTimers(onWarning: () => void, onTimeout: () => void) {
    this.clearTimers()

    // Set warning timer
    warningTimer = setTimeout(() => {
      onWarning()
    }, WARNING_TIMEOUT)

    // Set logout timer
    inactivityTimer = setTimeout(async () => {
      await this.logout()
      onTimeout()
    }, INACTIVITY_TIMEOUT)
  },

  clearTimers() {
    if (inactivityTimer) {
      clearTimeout(inactivityTimer)
      inactivityTimer = null
    }
    if (warningTimer) {
      clearTimeout(warningTimer)
      warningTimer = null
    }
  },

  async logout() {
    try {
      await fetch("/api/auth/logout", { method: "POST" })
    } catch (error) {
      console.error("[v0] Session logout error:", error)
    }
  },
}
