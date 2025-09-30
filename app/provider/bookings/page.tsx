import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import { BookingActions } from "@/components/booking-actions"

export default async function ProviderBookingsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  if (profile?.user_role !== "provider") {
    redirect("/services")
  }

  // Get all bookings with service and user details
  const { data: allBookings } = await supabase
    .from("bookings")
    .select(
      `
      *,
      service:services(id, title, category, duration_minutes),
      user:profiles!bookings_user_id_fkey(id, full_name, email, phone)
    `,
    )
    .eq("provider_id", user.id)
    .order("booking_date", { ascending: false })
    .order("start_time", { ascending: false })

  const pendingBookings = allBookings?.filter((b) => b.status === "pending") || []
  const confirmedBookings = allBookings?.filter((b) => b.status === "confirmed") || []
  const completedBookings = allBookings?.filter((b) => b.status === "completed") || []
  const cancelledBookings = allBookings?.filter((b) => b.status === "cancelled") || []

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-500/10 text-green-700 dark:text-green-400"
      case "pending":
        return "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400"
      case "cancelled":
        return "bg-red-500/10 text-red-700 dark:text-red-400"
      case "completed":
        return "bg-blue-500/10 text-blue-700 dark:text-blue-400"
      default:
        return ""
    }
  }

  const BookingCard = ({ booking }: { booking: (typeof allBookings)[0] }) => (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg">{booking.service?.title || "Unknown Service"}</CardTitle>
            <CardDescription>Client: {booking.user?.full_name || "Unknown User"}</CardDescription>
          </div>
          <Badge className={getStatusColor(booking.status)}>{booking.status}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <p className="text-sm font-medium">Date</p>
            <p className="text-sm text-muted-foreground">
              {new Date(booking.booking_date).toLocaleDateString("en-US", {
                weekday: "short",
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium">Time</p>
            <p className="text-sm text-muted-foreground">
              {booking.start_time.slice(0, 5)} - {booking.end_time.slice(0, 5)}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium">Price</p>
            <p className="text-sm text-muted-foreground">${booking.total_price}</p>
          </div>
          <div>
            <p className="text-sm font-medium">Duration</p>
            <p className="text-sm text-muted-foreground">{booking.service?.duration_minutes || 0} min</p>
          </div>
        </div>

        <div>
          <p className="text-sm font-medium">Client Contact</p>
          <p className="text-sm text-muted-foreground">{booking.user?.email}</p>
          {booking.user?.phone && <p className="text-sm text-muted-foreground">{booking.user.phone}</p>}
        </div>

        {booking.notes && (
          <div>
            <p className="text-sm font-medium">Client Notes</p>
            <p className="text-sm text-muted-foreground">{booking.notes}</p>
          </div>
        )}

        <BookingActions booking={booking} />
      </CardContent>
    </Card>
  )

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/provider/dashboard">
            <h1 className="text-2xl font-bold">NuelReserve Provider</h1>
          </Link>
          <div className="flex items-center gap-4">
            <Button asChild variant="ghost">
              <Link href="/provider/dashboard">Dashboard</Link>
            </Button>
            <Button asChild variant="ghost">
              <Link href="/provider/services">My Services</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h2 className="text-3xl font-bold tracking-tight">Bookings</h2>
            <p className="mt-2 text-muted-foreground">Manage your service bookings</p>
          </div>

          <Tabs defaultValue="pending" className="space-y-6">
            <TabsList>
              <TabsTrigger value="pending">
                Pending {pendingBookings.length > 0 && `(${pendingBookings.length})`}
              </TabsTrigger>
              <TabsTrigger value="confirmed">
                Confirmed {confirmedBookings.length > 0 && `(${confirmedBookings.length})`}
              </TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
              <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
            </TabsList>

            <TabsContent value="pending" className="space-y-4">
              {pendingBookings.length > 0 ? (
                pendingBookings.map((booking) => <BookingCard key={booking.id} booking={booking} />)
              ) : (
                <Card>
                  <CardContent className="py-12 text-center text-muted-foreground">
                    No pending bookings at the moment
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="confirmed" className="space-y-4">
              {confirmedBookings.length > 0 ? (
                confirmedBookings.map((booking) => <BookingCard key={booking.id} booking={booking} />)
              ) : (
                <Card>
                  <CardContent className="py-12 text-center text-muted-foreground">
                    No confirmed bookings at the moment
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="completed" className="space-y-4">
              {completedBookings.length > 0 ? (
                completedBookings.map((booking) => <BookingCard key={booking.id} booking={booking} />)
              ) : (
                <Card>
                  <CardContent className="py-12 text-center text-muted-foreground">
                    No completed bookings yet
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="cancelled" className="space-y-4">
              {cancelledBookings.length > 0 ? (
                cancelledBookings.map((booking) => <BookingCard key={booking.id} booking={booking} />)
              ) : (
                <Card>
                  <CardContent className="py-12 text-center text-muted-foreground">No cancelled bookings</CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}
