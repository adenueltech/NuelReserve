"use client"

import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { useState } from "react"

interface BookingActionsProps {
  booking: {
    id: string
    status: string
  }
}

export function BookingActions({ booking }: BookingActionsProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleStatusChange = async (newStatus: string) => {
    const confirmMessages = {
      confirmed: "Are you sure you want to confirm this booking?",
      cancelled: "Are you sure you want to cancel this booking?",
      completed: "Are you sure you want to mark this booking as completed?",
    }

    if (!confirm(confirmMessages[newStatus as keyof typeof confirmMessages])) {
      return
    }

    setIsLoading(true)

    try {
      const supabase = createClient()
      const { error } = await supabase.from("bookings").update({ status: newStatus }).eq("id", booking.id)

      if (error) throw error

      router.refresh()
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to update booking")
    } finally {
      setIsLoading(false)
    }
  }

  if (booking.status === "pending") {
    return (
      <div className="flex gap-2">
        <Button onClick={() => handleStatusChange("confirmed")} disabled={isLoading} className="flex-1" size="sm">
          {isLoading ? "Processing..." : "Confirm"}
        </Button>
        <Button
          onClick={() => handleStatusChange("cancelled")}
          disabled={isLoading}
          variant="destructive"
          className="flex-1"
          size="sm"
        >
          {isLoading ? "Processing..." : "Decline"}
        </Button>
      </div>
    )
  }

  if (booking.status === "confirmed") {
    return (
      <div className="flex gap-2">
        <Button onClick={() => handleStatusChange("completed")} disabled={isLoading} className="flex-1" size="sm">
          {isLoading ? "Processing..." : "Mark as Completed"}
        </Button>
        <Button
          onClick={() => handleStatusChange("cancelled")}
          disabled={isLoading}
          variant="outline"
          className="flex-1"
          size="sm"
        >
          {isLoading ? "Processing..." : "Cancel"}
        </Button>
      </div>
    )
  }

  return null
}
