"use client"

import { useRouter } from "next/navigation"
import { useLoading } from "@/contexts/loading-context"
import { useCallback, useEffect } from "react"

export function useLoadingNavigation() {
  const router = useRouter()
  const { startLoading, stopLoading } = useLoading()

  useEffect(() => {
    let timeoutId: NodeJS.Timeout

    const handleRouteChange = () => {
      timeoutId = setTimeout(() => {
        stopLoading()
      }, 800)
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId)
    }
  }, [stopLoading])

  const navigateWithLoading = useCallback(
    (path: string) => {
      startLoading()
      router.push(path)
      setTimeout(() => {
        stopLoading()
      }, 1000)
    },
    [router, startLoading, stopLoading],
  )

  return { navigateWithLoading }
}
