import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default async function ProviderCustomersPage() {
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

  // Get customers with booking history
  const { data: customers } = await supabase
    .from("bookings")
    .select(`
      user:profiles!bookings_user_id_fkey!inner(id, full_name, email, phone, created_at),
      service:services!inner(id, title, category),
      status,
      total_price,
      booking_date,
      created_at
    `)
    .eq("provider_id", user.id)
    .order("created_at", { ascending: false })

  // Group by customer
  const customerMap = customers?.reduce((acc, booking) => {
    const customerId = (booking.user as any).id
    if (!acc[customerId]) {
      acc[customerId] = {
        ...booking.user,
        bookings: [],
        totalSpent: 0,
        lastBooking: null,
        bookingCount: 0
      }
    }

    acc[customerId].bookings.push({
      service: booking.service,
      status: booking.status,
      total_price: booking.total_price,
      booking_date: booking.booking_date,
      created_at: booking.created_at
    })

    acc[customerId].totalSpent += booking.total_price
    acc[customerId].bookingCount += 1

    if (!acc[customerId].lastBooking || new Date(booking.created_at) > new Date(acc[customerId].lastBooking)) {
      acc[customerId].lastBooking = booking.created_at
    }

    return acc
  }, {} as Record<string, any>)

  const customerList = Object.values(customerMap || {}).sort((a: any, b: any) =>
    new Date(b.lastBooking).getTime() - new Date(a.lastBooking).getTime()
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
            <h2 className="text-3xl font-bold tracking-tight">Customer Management</h2>
            <p className="mt-2 text-muted-foreground">Manage your customer relationships and history</p>
          </div>

          {customerList.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">No customers yet. Start by confirming some bookings!</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6">
              {customerList.map((customer: any) => (
                <Card key={customer.id}>
                  <CardHeader>
                    <div className="flex items-center gap-4">
                      <Avatar>
                        <AvatarImage src="" />
                        <AvatarFallback>
                          {customer.full_name?.split(' ').map((n: string) => n[0]).join('') || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <CardTitle className="text-xl">{customer.full_name || 'Anonymous'}</CardTitle>
                        <CardDescription>{customer.email}</CardDescription>
                        <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                          <span>{customer.bookingCount} bookings</span>
                          <span>${customer.totalSpent.toFixed(2)} total spent</span>
                          <span>Last booking: {new Date(customer.lastBooking).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <h4 className="font-semibold">Recent Bookings</h4>
                      <div className="space-y-2">
                        {customer.bookings.slice(0, 3).map((booking: any, index: number) => (
                          <div key={index} className="flex items-center justify-between rounded-lg border p-3">
                            <div>
                              <p className="font-medium">{booking.service.title}</p>
                              <p className="text-sm text-muted-foreground">
                                {new Date(booking.booking_date).toLocaleDateString()} • ${booking.total_price}
                              </p>
                            </div>
                            <Badge
                              variant={
                                booking.status === 'completed' ? 'default' :
                                booking.status === 'confirmed' ? 'secondary' :
                                booking.status === 'pending' ? 'outline' : 'destructive'
                              }
                            >
                              {booking.status}
                            </Badge>
                          </div>
                        ))}
                      </div>
                      {customer.bookings.length > 3 && (
                        <p className="text-sm text-muted-foreground">
                          And {customer.bookings.length - 3} more bookings...
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}