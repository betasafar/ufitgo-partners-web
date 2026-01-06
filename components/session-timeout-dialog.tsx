"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { sessionManager } from "@/lib/session-manager"

export function SessionTimeoutDialog() {
  const router = useRouter()
  const [showWarning, setShowWarning] = useState(false)
  const [countdown, setCountdown] = useState(5)

  useEffect(() => {
    const cleanup = sessionManager.startMonitoring(
      () => {
        // Show warning dialog
        setShowWarning(true)
        setCountdown(5)
      },
      () => {
        // Timeout reached - redirect to login
        router.push("/login?session=expired")
      },
    )

    return cleanup
  }, [router])

  useEffect(() => {
    if (!showWarning) return

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [showWarning])

  const handleStayLoggedIn = () => {
    setShowWarning(false)
    setCountdown(5)
    // Reset will happen automatically through activity detection
  }

  return (
    <Dialog open={showWarning} onOpenChange={setShowWarning}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Session Timeout Warning</DialogTitle>
          <DialogDescription>
            You've been inactive for a while. For your security, you'll be automatically logged out in {countdown}{" "}
            minute{countdown !== 1 ? "s" : ""}.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => router.push("/login")}>
            Log Out Now
          </Button>
          <Button onClick={handleStayLoggedIn}>Stay Logged In</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
