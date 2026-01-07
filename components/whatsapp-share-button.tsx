"use client"

import { Button } from "@/components/ui/button"
import { MessageCircle } from "lucide-react"

interface WhatsAppShareButtonProps {
  message: string
  phoneNumber?: string
  size?: "sm" | "md" | "lg"
  variant?: "default" | "outline" | "ghost"
}

export function WhatsAppShareButton({
  message,
  phoneNumber,
  size = "md",
  variant = "default",
}: WhatsAppShareButtonProps) {
  const handleShare = () => {
    const encodedMessage = encodeURIComponent(message)
    const url = phoneNumber
      ? `https://wa.me/${phoneNumber}?text=${encodedMessage}`
      : `https://wa.me/?text=${encodedMessage}`
    window.open(url, "_blank")
  }

  return (
    <Button
      onClick={handleShare}
      size={size}
      variant={variant}
      className="gap-2 bg-[#25D366] hover:bg-[#20BA5A] text-white"
    >
      <MessageCircle className="h-4 w-4" />
      Share on WhatsApp
    </Button>
  )
}
