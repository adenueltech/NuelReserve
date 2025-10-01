import { createClient } from "@/lib/supabase/server"
import { notifyBookingRequest } from "@/lib/notifications"
import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { service_id, availability_id, notes } = body

    if (!service_id || !availability_id) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Get service and availability details
    const { data: service } = await supabase
      .from("services")
      .select("*, provider:profiles(id, full_name)")
      .eq("id", service_id)
      .single()

    const { data: availability } = await supabase
      .from("availability")
      .select("*")
      .eq("id", availability_id)
      .single()

    if (!service || !availability) {
      return NextResponse.json({ error: "Service or availability not found" }, { status: 404 })
    }

    // Create booking
    const { data: booking, error: bookingError } = await supabase
      .from("bookings")
      .insert({
        user_id: user.id,
        service_id,
        provider_id: service.provider_id,
        availability_id,
        booking_date: availability.date,
        start_time: availability.start_time,
        end_time: availability.end_time,
        total_price: service.price,
        notes: notes || null,
        status: "pending",
      })
      .select()
      .single()

    if (bookingError) {
      return NextResponse.json({ error: bookingError.message }, { status: 500 })
    }

    // Create notification for provider
    await notifyBookingRequest(
      service.provider_id,
      user.user_metadata?.full_name || "A user",
      service.title
    )

    return NextResponse.json({ success: true, booking })
  } catch (error) {
    console.error("Booking creation error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}