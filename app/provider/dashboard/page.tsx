"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { AnalyticsCharts } from "@/components/analytics-charts"
import { Menu, X } from "lucide-react"

export default function ProviderDashboardPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [data, setData] = useState({
    profile: null as any,
    services: [] as any[],
    upcomingBookings: [] as any[],
    totalServices: 0,
    totalBookings: 0,
    pendingBookings: 0,
    totalRevenue: 0,
    chartData: [] as any[],
    pieData: [] as any[],
  })
  const [loading, setLoading] = useState(true)

  const supabase = createClient()

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      // Check authentication
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        window.location.href = "/auth/login"
        return
      }

      // Get provider profile
      const { data: profileData } = await supabase.from("profiles").select("*").eq("id", user.id).single()
      if (profileData?.user_role !== "provider") {
        window.location.href = "/services"
        return
      }

      // Get provider's services
      const { data: servicesData } = await supabase
        .from("services")
        .select("*")
        .eq("provider_id", user.id)
        .order("created_at", { ascending: false })

      // Get upcoming bookings
      const today = new Date().toISOString().split("T")[0]
      const { data: bookingsData } = await supabase
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
      const { count: servicesCount } = await supabase
        .from("services")
        .select("*", { count: "exact", head: true })
        .eq("provider_id", user.id)

      const { count: bookingsCount } = await supabase
        .from("bookings")
        .select("*", { count: "exact", head: true })
        .eq("provider_id", user.id)

      const { count: pendingCount } = await supabase
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

      const revenue = revenueData?.reduce((sum, booking) => sum + booking.total_price, 0) || 0

      // Calculate monthly revenue data for chart
      const monthlyRevenue = revenueData?.reduce((acc, booking) => {
        const month = new Date(booking.created_at).toLocaleDateString('en-US', { month: 'short' })
        acc[month] = (acc[month] || 0) + booking.total_price
        return acc
      }, {} as Record<string, number>)

      const chartDataArray = Object.entries(monthlyRevenue || {}).map(([month, revenue]) => ({
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

      const pieDataArray = [
        { name: 'Completed', value: statusCounts?.completed || 0, color: '#10b981' },
        { name: 'Pending', value: statusCounts?.pending || 0, color: '#f59e0b' },
        { name: 'Confirmed', value: statusCounts?.confirmed || 0, color: '#3b82f6' },
        { name: 'Cancelled', value: statusCounts?.cancelled || 0, color: '#ef4444' },
      ].filter(item => item.value > 0)

      setData({
        profile: profileData,
        services: servicesData || [],
        upcomingBookings: bookingsData || [],
        totalServices: servicesCount || 0,
        totalBookings: bookingsCount || 0,
        pendingBookings: pendingCount || 0,
        totalRevenue: revenue,
        chartData: chartDataArray,
        pieData: pieDataArray,
      })

    } catch (error) {
      console.error("Error loading dashboard data:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (!data.profile) {
    return null
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/provider/dashboard">
            <h1 className="text-lg md:text-2xl font-bold">NuelReserve Provider</h1>
          </Link>
          <div className="flex items-center gap-2 md:gap-4">
            <Button asChild variant="ghost" size="sm" className="hidden sm:flex">
              <Link href="/profile">Profile</Link>
            </Button>
            <Button asChild variant="ghost" size="sm" className="text-xs md:text-sm">
              <Link href="/provider/services">Services</Link>
            </Button>
            <Button asChild variant="ghost" size="sm" className="text-xs md:text-sm">
              <Link href="/messages">Messages</Link>
            </Button>
            <Button asChild variant="ghost" size="sm" className="hidden md:flex">
              <Link href="/provider/customers">Customers</Link>
            </Button>
            <Button asChild variant="ghost" size="sm" className="text-xs md:text-sm">
              <Link href="/provider/bookings">Bookings</Link>
            </Button>
            <form action="/auth/logout" method="post">
              <Button type="submit" variant="outline" size="sm" className="text-xs md:text-sm">
                Logout
              </Button>
            </form>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex items-center justify-center rounded-lg p-2 transition-colors hover:bg-muted md:hidden"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="size-6" /> : <Menu className="size-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="border-t border-border/40 bg-card/95 backdrop-blur-lg md:hidden">
            <nav className="container mx-auto flex flex-col gap-1 px-4 py-4">
              <Button asChild variant="ghost" className="justify-start">
                <Link href="/profile" onClick={() => setMobileMenuOpen(false)}>
                  Profile
                </Link>
              </Button>
              <Button asChild variant="ghost" className="justify-start">
                <Link href="/provider/services" onClick={() => setMobileMenuOpen(false)}>
                  My Services
                </Link>
              </Button>
              <Button asChild variant="ghost" className="justify-start">
                <Link href="/messages" onClick={() => setMobileMenuOpen(false)}>
                  Messages
                </Link>
              </Button>
              <Button asChild variant="ghost" className="justify-start">
                <Link href="/provider/customers" onClick={() => setMobileMenuOpen(false)}>
                  Customers
                </Link>
              </Button>
              <Button asChild variant="ghost" className="justify-start">
                <Link href="/provider/bookings" onClick={() => setMobileMenuOpen(false)}>
                  Bookings
                </Link>
              </Button>
              <div className="mt-4 border-t border-border/40 pt-4">
                <form action="/auth/logout" method="post">
                  <Button type="submit" variant="outline" className="w-full">
                    Logout
                  </Button>
                </form>
              </div>
            </nav>
          </div>
        )}
      </header>

      <main className="flex-1">
        <div className="container mx-auto px-6 py-8">
          <div className="mb-8">
            <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
            <p className="mt-2 text-muted-foreground">Welcome back, {data.profile?.full_name || "Provider"}</p>
          </div>

          <div className="mb-8 grid gap-4 grid-cols-2 md:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xl md:text-2xl font-bold">${data.totalRevenue.toFixed(2)}</div>
                <p className="text-xs text-muted-foreground">Last 30 days</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Services</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xl md:text-2xl font-bold">{data.totalServices || 0}</div>
                <p className="text-xs text-muted-foreground">Active service offerings</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xl md:text-2xl font-bold">{data.totalBookings || 0}</div>
                <p className="text-xs text-muted-foreground">All time bookings</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Bookings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xl md:text-2xl font-bold">{data.pendingBookings || 0}</div>
                <p className="text-xs text-muted-foreground">Awaiting confirmation</p>
              </CardContent>
            </Card>
          </div>

          {/* Analytics Charts */}
          <AnalyticsCharts chartData={data.chartData} pieData={data.pieData} />

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
                {data.services && data.services.length > 0 ? (
                  <div className="space-y-4">
                    {data.services.slice(0, 3).map((service) => (
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
                    {data.services.length > 3 && (
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
                {data.upcomingBookings && data.upcomingBookings.length > 0 ? (
                  <div className="space-y-4">
                    {data.upcomingBookings.map((booking) => (
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
