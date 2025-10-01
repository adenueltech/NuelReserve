import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"

export default async function ProviderDashboardPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Get provider profile
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  if (profile?.user_role !== "provider") {
    redirect("/services")
  }

  // Get provider's services
  const { data: services } = await supabase
    .from("services")
    .select("*")
    .eq("provider_id", user.id)
    .order("created_at", { ascending: false })

  // Get upcoming bookings
  const today = new Date().toISOString().split("T")[0]
  const { data: upcomingBookings } = await supabase
    .from("bookings")
    .select(
      `
      *,
      service:services(id, title),
      user:profiles!bookings_user_id_fkey(id, full_name, email, phone)
    `,
    )
    .eq("provider_id", user.id)
    .gte("booking_date", today)
    .in("status", ["pending", "confirmed"])
    .order("booking_date", { ascending: true })
    .order("start_time", { ascending: true })
    .limit(5)

  // Get statistics
  const { count: totalServices } = await supabase
    .from("services")
    .select("*", { count: "exact", head: true })
    .eq("provider_id", user.id)

  const { count: totalBookings } = await supabase
    .from("bookings")
    .select("*", { count: "exact", head: true })
    .eq("provider_id", user.id)

  const { count: pendingBookings } = await supabase
    .from("bookings")
    .select("*", { count: "exact", head: true })
    .eq("provider_id", user.id)
    .eq("status", "pending")

  // Get revenue data for the last 30 days
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

  const { data: revenueData } = await supabase
    .from("bookings")
    .select("total_price, created_at, status")
    .eq("provider_id", user.id)
    .eq("status", "completed")
    .gte("created_at", thirtyDaysAgo.toISOString())

  // Calculate total revenue
  const totalRevenue = revenueData?.reduce((sum, booking) => sum + booking.total_price, 0) || 0

  // Get monthly revenue data for chart
  const monthlyRevenue = revenueData?.reduce((acc, booking) => {
    const month = new Date(booking.created_at).toLocaleDateString('en-US', { month: 'short' })
    acc[month] = (acc[month] || 0) + booking.total_price
    return acc
  }, {} as Record<string, number>)

  const chartData = Object.entries(monthlyRevenue || {}).map(([month, revenue]) => ({
    month,
    revenue
  }))

  // Get booking status distribution
  const { data: bookingStatuses } = await supabase
    .from("bookings")
    .select("status")
    .eq("provider_id", user.id)

  const statusCounts = bookingStatuses?.reduce((acc, booking) => {
    acc[booking.status] = (acc[booking.status] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const pieData = [
    { name: 'Completed', value: statusCounts?.completed || 0, color: '#10b981' },
    { name: 'Pending', value: statusCounts?.pending || 0, color: '#f59e0b' },
    { name: 'Confirmed', value: statusCounts?.confirmed || 0, color: '#3b82f6' },
    { name: 'Cancelled', value: statusCounts?.cancelled || 0, color: '#ef4444' },
  ].filter(item => item.value > 0)

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/provider/dashboard">
            <h1 className="text-2xl font-bold">NuelReserve Provider</h1>
          </Link>
          <div className="flex items-center gap-4">
            <Button asChild variant="ghost">
              <Link href="/profile">Profile</Link>
            </Button>
            <Button asChild variant="ghost">
              <Link href="/provider/services">My Services</Link>
            </Button>
            <Button asChild variant="ghost">
              <Link href="/provider/customers">Customers</Link>
            </Button>
            <Button asChild variant="ghost">
              <Link href="/provider/bookings">Bookings</Link>
            </Button>
            <form action="/auth/logout" method="post">
              <Button type="submit" variant="outline">
                Logout
              </Button>
            </form>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <div className="container mx-auto px-6 py-8">
          <div className="mb-8">
            <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
            <p className="mt-2 text-muted-foreground">Welcome back, {profile?.full_name || "Provider"}</p>
          </div>

          <div className="mb-8 grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${totalRevenue.toFixed(2)}</div>
                <p className="text-xs text-muted-foreground">Last 30 days</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Services</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalServices || 0}</div>
                <p className="text-xs text-muted-foreground">Active service offerings</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalBookings || 0}</div>
                <p className="text-xs text-muted-foreground">All time bookings</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Bookings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{pendingBookings || 0}</div>
                <p className="text-xs text-muted-foreground">Awaiting confirmation</p>
              </CardContent>
            </Card>
          </div>

          {/* Analytics Charts */}
          <div className="mb-8 grid gap-8 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Revenue Trends</CardTitle>
                <CardDescription>Monthly revenue for the last 30 days</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`$${value}`, 'Revenue']} />
                    <Bar dataKey="revenue" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Booking Status Distribution</CardTitle>
                <CardDescription>Breakdown of booking statuses</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-8 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>My Services</CardTitle>
                    <CardDescription>Manage your service offerings</CardDescription>
                  </div>
                  <Button asChild size="sm">
                    <Link href="/provider/services/new">Add Service</Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {services && services.length > 0 ? (
                  <div className="space-y-4">
                    {services.slice(0, 3).map((service) => (
                      <div key={service.id} className="flex items-center justify-between rounded-lg border p-4">
                        <div>
                          <p className="font-medium">{service.title}</p>
                          <p className="text-sm text-muted-foreground">{service.category}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={service.is_active ? "default" : "secondary"}>
                            {service.is_active ? "Active" : "Inactive"}
                          </Badge>
                          <Button asChild size="sm" variant="outline">
                            <Link href={`/provider/services/${service.id}`}>Edit</Link>
                          </Button>
                        </div>
                      </div>
                    ))}
                    {services.length > 3 && (
                      <Button asChild variant="ghost" className="w-full">
                        <Link href="/provider/services">View All Services</Link>
                      </Button>
                    )}
                  </div>
                ) : (
                  <div className="py-8 text-center">
                    <p className="text-muted-foreground">No services yet</p>
                    <Button asChild className="mt-4">
                      <Link href="/provider/services/new">Create Your First Service</Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Upcoming Bookings</CardTitle>
                    <CardDescription>Recent booking requests</CardDescription>
                  </div>
                  <Button asChild size="sm" variant="outline">
                    <Link href="/provider/bookings">View All</Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {upcomingBookings && upcomingBookings.length > 0 ? (
                  <div className="space-y-4">
                    {upcomingBookings.map((booking) => (
                      <div key={booking.id} className="rounded-lg border p-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-medium">{booking.service?.title}</p>
                            <p className="text-sm text-muted-foreground">with {booking.user?.full_name}</p>
                          </div>
                          <Badge
                            variant={booking.status === "confirmed" ? "default" : "secondary"}
                            className="capitalize"
                          >
                            {booking.status}
                          </Badge>
                        </div>
                        <div className="mt-2 text-sm text-muted-foreground">
                          {new Date(booking.booking_date).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          })}{" "}
                          at {booking.start_time.slice(0, 5)}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-8 text-center text-muted-foreground">No upcoming bookings</div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
