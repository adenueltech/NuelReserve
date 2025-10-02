"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { redirect, notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { BookingForm } from "@/components/booking-form"

export default function ServiceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [serviceData, setServiceData] = useState<any>(null)
  const [availabilityData, setAvailabilityData] = useState<any[]>([])
  const [id, setId] = useState<string>("")
  const supabase = createClient()

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
    const { data: { user: userData } } = await supabase.auth.getUser()
    if (!userData) {
      redirect("/auth/login")
    }
    setUser(userData)

    const { id: paramId } = await params
    setId(paramId)

    // Get service with provider details
    const { data: service } = await supabase
      .from("services")
      .select(
        `
        *,
        provider:profiles(id, full_name, email, phone)
      `,
      )
      .eq("id", paramId)
      .single()

    if (!service) {
      notFound()
    }
    setServiceData(service)

    // Get available time slots for the next 30 days
    const today = new Date().toISOString().split("T")[0]
    const futureDate = new Date()
    futureDate.setDate(futureDate.getDate() + 30)
    const future = futureDate.toISOString().split("T")[0]

    const { data: availabilityData } = await supabase
      .from("availabilityData")
      .select("*")
      .eq("service_id", paramId)
      .eq("is_booked", false)
      .gte("date", today)
      .lte("date", future)
      .order("date", { ascending: true })
      .order("start_time", { ascending: true })

    setAvailabilityData(availabilityData || [])


    // Check if user already has any booking for this service
    const { data: existingBooking } = await supabase
      .from("bookings")
      .select("id, status")
      .eq("user_id", userData.id)
      .eq("service_id", paramId)
      .in("status", ["pending", "confirmed", "completed"])
      .limit(1)
      .single()

    setServiceData({ ...service, userHasBooking: !!existingBooking, existingBookingStatus: existingBooking?.status })
    setLoading(false)
    } catch (error) {
      console.error("Error loading service:", error)
      notFound()
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading serviceData...</p>
        </div>
      </div>
    )
  }

  if (!user || !serviceData) {
    return null
  }

  const userHasBooking = serviceData.userHasBooking
  const existingBookingStatus = serviceData.existingBookingStatus

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/services">
            <h1 className="text-lg md:text-2xl font-bold">NuelReserve</h1>
          </Link>
          <Button asChild variant="ghost" size="sm" className="text-xs md:text-sm">
            <Link href="/services">Back to Services</Link>
          </Button>
        </div>
      </header>

      <main className="flex-1">
        <div className="container mx-auto px-4 md:px-6 py-6 md:py-8">
          <div className="grid gap-6 md:gap-8 grid-cols-1 lg:grid-cols-3">
            <div className="lg:col-span-2 order-2 lg:order-1">
              <Card>
                <CardHeader>
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                    <div className="flex-1">
                      <CardTitle className="text-2xl md:text-3xl">{serviceData.title}</CardTitle>
                      <CardDescription className="mt-2">
                        Provided by {serviceData.provider?.full_name || "Unknown Provider"}
                      </CardDescription>
                    </div>
                    <Badge variant="secondary" className="text-base md:text-lg self-start">
                      ${serviceData.price}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="mb-2 font-semibold">Description</h3>
                    <p className="text-muted-foreground">{serviceData.description || "No description provided."}</p>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <h3 className="mb-2 font-semibold">Category</h3>
                      <Badge>{serviceData.category}</Badge>
                    </div>
                    <div>
                      <h3 className="mb-2 font-semibold">Duration</h3>
                      <p className="text-muted-foreground">{serviceData.duration_minutes} minutes</p>
                    </div>
                    {serviceData.location && (
                      <div className="sm:col-span-2">
                        <h3 className="mb-2 font-semibold">Location</h3>
                        <p className="text-muted-foreground">{serviceData.location}</p>
                      </div>
                    )}
                  </div>

                  <div>
                    <h3 className="mb-2 font-semibold">Provider Contact</h3>
                    <p className="text-sm text-muted-foreground">{serviceData.provider?.email}</p>
                    {serviceData.provider?.phone && (
                      <p className="text-sm text-muted-foreground">{serviceData.provider.phone}</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="order-1 lg:order-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg md:text-xl">
                    {userHasBooking ? "Booking Status" : "Book This Service"}
                  </CardTitle>
                  <CardDescription>
                    {userHasBooking ? "You have already booked this service" : "Select an available time slot"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {userHasBooking ? (
                    <div className="space-y-4">
                      <div className="rounded-md bg-blue-500/10 p-4 text-center">
                        <p className="text-sm font-medium text-blue-700 dark:text-blue-400">
                          You have already booked this service
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Status: {existingBookingStatus}
                        </p>
                      </div>
                      <Button asChild variant="outline" className="w-full">
                        <Link href="/bookings">View My Bookings</Link>
                      </Button>
                    </div>
                  ) : (
                    <BookingForm service={serviceData} availability={availabilityData || []} userId={user.id} />
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

    </div>
  )
}
