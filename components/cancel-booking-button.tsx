"use client"

import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { useState } from "react"

export function CancelBookingButton({ bookingId }: { bookingId: string }) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleCancel = async () => {
    if (!confirm("Are you sure you want to cancel this booking?")) {
      return
    }

    setIsLoading(true)

    try {
      const supabase = createClient()
      const { error } = await supabase.from("bookings").update({ status: "cancelled" }).eq("id", bookingId)

      if (error) throw error

      router.refresh()
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to cancel booking")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button onClick={handleCancel} disabled={isLoading} variant="destructive" size="sm">
      {isLoading ? "Cancelling..." : "Cancel Booking"}
    </Button>
  )
}
