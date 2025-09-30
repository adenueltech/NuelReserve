"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { useState } from "react"
import type { Availability } from "@/lib/types/database"

export function AvailabilityList({ availability }: { availability: Availability[] }) {
  const router = useRouter()
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this time slot?")) {
      return
    }

    setDeletingId(id)

    try {
      const supabase = createClient()
      const { error } = await supabase.from("availability").delete().eq("id", id)

      if (error) throw error

      router.refresh()
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete availability")
    } finally {
      setDeletingId(null)
    }
  }

  if (availability.length === 0) {
    return <div className="py-8 text-center text-sm text-muted-foreground">No availability slots yet</div>
  }

  return (
    <div className="space-y-3">
      {availability.map((slot) => (
        <div key={slot.id} className="flex items-center justify-between rounded-lg border p-3">
          <div>
            <p className="text-sm font-medium">
              {new Date(slot.date).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </p>
            <p className="text-sm text-muted-foreground">
              {slot.start_time.slice(0, 5)} - {slot.end_time.slice(0, 5)}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={slot.is_booked ? "secondary" : "default"}>{slot.is_booked ? "Booked" : "Available"}</Badge>
            {!slot.is_booked && (
              <Button size="sm" variant="ghost" onClick={() => handleDelete(slot.id)} disabled={deletingId === slot.id}>
                {deletingId === slot.id ? "..." : "Delete"}
              </Button>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
