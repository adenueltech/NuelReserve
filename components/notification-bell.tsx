"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Bell } from "lucide-react"
import { realtimeService } from "@/lib/supabase/realtime"
import type { Notification } from "@/lib/types/database"

export function NotificationBell() {
  const [unreadCount, setUnreadCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const setupNotifications = async () => {
      await fetchUnreadCount()

      // Subscribe to real-time notifications
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const unsubscribe = realtimeService.subscribeToNotifications(user.id, (notification) => {
          // Refresh count when new notification arrives
          fetchUnreadCount()
        })

        return unsubscribe
      }
    }

    setupNotifications()
  }, [])

  const fetchUnreadCount = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { count } = await supabase
        .from("notifications")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id)
        .eq("read", false)

      setUnreadCount(count || 0)
    } catch (error) {
      console.error("Error fetching unread notifications:", error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <Button variant="ghost" size="sm" disabled>
        <Bell className="h-4 w-4" />
      </Button>
    )
  }

  return (
    <Button asChild variant="ghost" size="sm" className="relative">
      <Link href="/notifications">
        <Bell className="h-4 w-4" />
        {unreadCount > 0 && (
          <Badge
            variant="destructive"
            className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
          >
            {unreadCount > 99 ? "99+" : unreadCount}
          </Badge>
        )}
      </Link>
    </Button>
  )
}