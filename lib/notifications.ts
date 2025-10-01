import { createClient } from "./supabase/server"
import type { NotificationType } from "./types/database"

export async function createNotification(
  userId: string,
  type: NotificationType,
  title: string,
  message: string,
  relatedId?: string
) {
  const supabase = await createClient()

  const { error } = await supabase
    .from("notifications")
    .insert({
      user_id: userId,
      type,
      title,
      message,
      related_id: relatedId,
    })

  if (error) {
    console.error("Error creating notification:", error)
  }
}

export async function notifyBookingRequest(providerId: string, userName: string, serviceTitle: string) {
  await createNotification(
    providerId,
    "booking_request",
    "New Booking Request",
    `${userName} has requested to book your service: ${serviceTitle}`,
    providerId // Using providerId as related_id for now
  )
}

export async function notifyBookingConfirmed(userId: string, serviceTitle: string) {
  await createNotification(
    userId,
    "booking_confirmed",
    "Booking Confirmed",
    `Your booking for ${serviceTitle} has been confirmed!`,
    userId
  )
}

export async function notifyBookingCancelled(userId: string, serviceTitle: string) {
  await createNotification(
    userId,
    "booking_cancelled",
    "Booking Cancelled",
    `Your booking for ${serviceTitle} has been cancelled.`,
    userId
  )
}

export async function notifyBookingCompleted(userId: string, serviceTitle: string) {
  await createNotification(
    userId,
    "booking_completed",
    "Booking Completed",
    `Your booking for ${serviceTitle} has been completed. Don't forget to leave a review!`,
    userId
  )
}

export async function notifyReviewReceived(providerId: string, userName: string, serviceTitle: string) {
  await createNotification(
    providerId,
    "review_received",
    "New Review",
    `${userName} left a review for your service: ${serviceTitle}`,
    providerId
  )
}

export async function notifyPaymentReceived(providerId: string, amount: number, serviceTitle: string) {
  await createNotification(
    providerId,
    "payment_received",
    "Payment Received",
    `You received payment of $${amount} for ${serviceTitle}`,
    providerId
  )
}