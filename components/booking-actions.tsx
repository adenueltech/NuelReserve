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
    console.log("Attempting to change booking status to:", newStatus, "for booking ID:", booking.id)
    setIsLoading(true)

    try {
      const supabase = createClient()

      // First check if user is authenticated
      const { data: { user }, error: authError } = await supabase.auth.getUser()
      if (authError || !user) {
        console.error("Authentication error:", authError)
        throw new Error("User not authenticated")
      }

      console.log("User authenticated:", user.id)

      const { data, error } = await supabase.from("bookings").update({ status: newStatus }).eq("id", booking.id)

      if (error) {
        console.error("Supabase error:", error)
        throw error
      }

      console.log("Booking updated successfully:", data)
      router.refresh()
    } catch (err) {
      console.error("Failed to update booking:", err)
      // You could add a toast notification here instead of alert
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
