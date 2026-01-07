"use client"

import { useRouter } from "next/navigation"
import { useLoading } from "@/contexts/loading-context"
import { useCallback } from "react"

export function useLoadingNavigation() {
  const router = useRouter()
  const { startLoading } = useLoading()

  const navigateWithLoading = useCallback(
    (path: string) => {
      startLoading()
      router.push(path)
    },
    [router, startLoading],
  )

  return { navigateWithLoading }
}
