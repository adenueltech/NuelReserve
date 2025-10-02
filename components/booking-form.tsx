"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import type { Service, Availability } from "@/lib/types/database"

interface BookingFormProps {
  service: Service
  availability: Availability[]
  userId: string
}

export function BookingForm({ service, availability, userId }: BookingFormProps) {
  const router = useRouter()
  const [selectedSlot, setSelectedSlot] = useState<string>("")
  const [notes, setNotes] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Group availability by date
  const availabilityByDate = availability.reduce(
    (acc, slot) => {
      if (!acc[slot.date]) {
        acc[slot.date] = []
      }
      acc[slot.date].push(slot)
      return acc
    },
    {} as Record<string, Availability[]>,
  )

  const handleBooking = async () => {
    if (!selectedSlot) {
      setError("Please select a time slot")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          service_id: service.id,
          availability_id: selectedSlot,
          notes: notes || null,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to create booking")
      }

      router.push("/bookings?success=true")
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create booking")
    } finally {
      setIsLoading(false)
    }
  }

  if (availability.length === 0) {
    return (
      <div className="rounded-md bg-muted p-4 text-center text-sm text-muted-foreground">
        No available time slots at the moment. Please check back later.
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="slot">Select Date & Time</Label>
        <Select value={selectedSlot} onValueChange={setSelectedSlot}>
          <SelectTrigger id="slot">
            <SelectValue placeholder="Choose a time slot" />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(availabilityByDate).map(([date, slots]) => (
              <div key={date}>
                <div className="px-2 py-1.5 text-sm font-semibold text-muted-foreground">
                  {new Date(date).toLocaleDateString("en-US", {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                  })}
                </div>
                {slots.map((slot) => (
                  <SelectItem key={slot.id} value={slot.id}>
                    {slot.start_time.slice(0, 5)} - {slot.end_time.slice(0, 5)}
                  </SelectItem>
                ))}
              </div>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Notes (Optional)</Label>
        <Textarea
          id="notes"
          placeholder="Any special requests or information..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
        />
      </div>

      {error && <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">{error}</div>}

      <Button onClick={handleBooking} disabled={isLoading || !selectedSlot} className="w-full">
        {isLoading ? "Booking..." : `Book for ${service.currency === 'NGN' ? '₦' : '$'}${service.price}`}
      </Button>
    </div>
  )
}
