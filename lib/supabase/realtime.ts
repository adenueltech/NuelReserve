import { createClient } from "./client"
import type { RealtimeChannel, RealtimePostgresChangesPayload } from "@supabase/supabase-js"
import type { Notification, Message, Booking } from "@/lib/types/database"

export class RealtimeService {
  private supabase = createClient()
  private channels: Map<string, RealtimeChannel> = new Map()

  // Subscribe to user notifications
  subscribeToNotifications(userId: string, callback: (notification: Notification) => void): () => void {
    const channelName = `notifications:${userId}`
    const channel = this.supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${userId}`,
        },
        (payload: RealtimePostgresChangesPayload<Notification>) => {
          if (payload.new) {
            callback(payload.new as Notification)
          }
        }
      )
      .subscribe()

    this.channels.set(channelName, channel)

    return () => {
      channel.unsubscribe()
      this.channels.delete(channelName)
    }
  }

  // Subscribe to messages for a user
  subscribeToMessages(userId: string, callback: (message: Message) => void): () => void {
    const channelName = `messages:${userId}`
    const channel = this.supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `receiver_id=eq.${userId}`,
        },
        (payload: RealtimePostgresChangesPayload<Message>) => {
          if (payload.new) {
            callback(payload.new as Message)
          }
        }
      )
      .subscribe()

    this.channels.set(channelName, channel)

    return () => {
      channel.unsubscribe()
      this.channels.delete(channelName)
    }
  }

  // Subscribe to booking updates for providers
  subscribeToBookingUpdates(providerId: string, callback: (booking: Booking) => void): () => void {
    const channelName = `bookings:${providerId}`
    const channel = this.supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'bookings',
          filter: `provider_id=eq.${providerId}`,
        },
        (payload: RealtimePostgresChangesPayload<Booking>) => {
          if (payload.new) {
            callback(payload.new as Booking)
          }
        }
      )
      .subscribe()

    this.channels.set(channelName, channel)

    return () => {
      channel.unsubscribe()
      this.channels.delete(channelName)
    }
  }

  // Subscribe to booking updates for users
  subscribeToUserBookings(userId: string, callback: (booking: Booking) => void): () => void {
    const channelName = `user-bookings:${userId}`
    const channel = this.supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'bookings',
          filter: `user_id=eq.${userId}`,
        },
        (payload: RealtimePostgresChangesPayload<Booking>) => {
          if (payload.new) {
            callback(payload.new as Booking)
          }
        }
      )
      .subscribe()

    this.channels.set(channelName, channel)

    return () => {
      channel.unsubscribe()
      this.channels.delete(channelName)
    }
  }

  // Clean up all subscriptions
  cleanup(): void {
    for (const channel of this.channels.values()) {
      channel.unsubscribe()
    }
    this.channels.clear()
  }
}

// Singleton instance
export const realtimeService = new RealtimeService()