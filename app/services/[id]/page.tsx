import { createClient } from "@/lib/supabase/server"
import { redirect, notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { BookingForm } from "@/components/booking-form"
import { ReviewSection } from "@/components/review-section"
import { Messaging } from "@/components/messaging"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MessageCircle } from "lucide-react"

export default async function ServiceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { id } = await params

  // Get service with provider details
  const { data: service } = await supabase
    .from("services")
    .select(
      `
      *,
      provider:profiles!services_provider_id_fkey(id, full_name, email, phone)
    `,
    )
    .eq("id", id)
    .single()

  if (!service) {
    notFound()
  }

  // Get available time slots for the next 30 days
  const today = new Date().toISOString().split("T")[0]
  const futureDate = new Date()
  futureDate.setDate(futureDate.getDate() + 30)
  const future = futureDate.toISOString().split("T")[0]

  const { data: availability } = await supabase
    .from("availability")
    .select("*")
    .eq("service_id", id)
    .eq("is_booked", false)
    .gte("date", today)
    .lte("date", future)
    .order("date", { ascending: true })
    .order("start_time", { ascending: true })

  // Check if user can review this service (has completed booking)
  const { data: completedBooking } = await supabase
    .from("bookings")
    .select("id")
    .eq("user_id", user.id)
    .eq("service_id", id)
    .eq("status", "completed")
    .limit(1)
    .single()

  const canReview = !!completedBooking

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
              <Tabs defaultValue="details" className="space-y-4 md:space-y-6">
                <TabsList className="grid w-full grid-cols-3 h-auto p-1">
                  <TabsTrigger value="details" className="text-xs md:text-sm text-foreground">Details</TabsTrigger>
                  <TabsTrigger value="reviews" className="text-xs md:text-sm text-foreground">Reviews</TabsTrigger>
                  <TabsTrigger value="message" className="flex items-center gap-1 md:gap-2 text-xs md:text-sm text-foreground">
                    <MessageCircle className="h-3 w-3 md:h-4 md:w-4" />
                    <span className="hidden sm:inline">Message</span>
                    <span className="sm:hidden">Msg</span>
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="details" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                        <div className="flex-1">
                          <CardTitle className="text-2xl md:text-3xl">{service.title}</CardTitle>
                          <CardDescription className="mt-2">
                            Provided by {service.provider?.full_name || "Unknown Provider"}
                          </CardDescription>
                        </div>
                        <Badge variant="secondary" className="text-base md:text-lg self-start">
                          ${service.price}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div>
                        <h3 className="mb-2 font-semibold">Description</h3>
                        <p className="text-muted-foreground">{service.description || "No description provided."}</p>
                      </div>

                      <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                          <h3 className="mb-2 font-semibold">Category</h3>
                          <Badge>{service.category}</Badge>
                        </div>
                        <div>
                          <h3 className="mb-2 font-semibold">Duration</h3>
                          <p className="text-muted-foreground">{service.duration_minutes} minutes</p>
                        </div>
                        {service.location && (
                          <div className="sm:col-span-2">
                            <h3 className="mb-2 font-semibold">Location</h3>
                            <p className="text-muted-foreground">{service.location}</p>
                          </div>
                        )}
                      </div>

                      <div>
                        <h3 className="mb-2 font-semibold">Provider Contact</h3>
                        <p className="text-sm text-muted-foreground">{service.provider?.email}</p>
                        {service.provider?.phone && (
                          <p className="text-sm text-muted-foreground">{service.provider.phone}</p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="reviews">
                  <ReviewSection
                    serviceId={id}
                    userId={user.id}
                    providerId={service.provider_id}
                    canReview={canReview}
                  />
                </TabsContent>

                <TabsContent value="message">
                  <Messaging
                    bookingId="" // Empty for pre-booking messages
                    currentUserId={user.id}
                    otherUser={service.provider}
                  />
                </TabsContent>
              </Tabs>
            </div>

            <div className="order-1 lg:order-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg md:text-xl">Book This Service</CardTitle>
                  <CardDescription>Select an available time slot</CardDescription>
                </CardHeader>
                <CardContent>
                  <BookingForm service={service} availability={availability || []} userId={user.id} />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
