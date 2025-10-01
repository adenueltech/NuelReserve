import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Bell, CheckCheck } from "lucide-react"

export default async function NotificationsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Get user's notifications
  const { data: notifications } = await supabase
    .from("notifications")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  // Mark all as read (this would typically be done via API)
  if (notifications && notifications.length > 0) {
    await supabase
      .from("notifications")
      .update({ read: true })
      .eq("user_id", user.id)
      .eq("read", false)
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "booking_request":
        return "📅"
      case "booking_confirmed":
        return "✅"
      case "booking_cancelled":
        return "❌"
      case "booking_completed":
        return "🎉"
      case "review_received":
        return "⭐"
      case "payment_received":
        return "💰"
      case "reminder":
        return "⏰"
      default:
        return "🔔"
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/services">
            <h1 className="text-2xl font-bold">NuelReserve</h1>
          </Link>
          <div className="flex items-center gap-4">
            <Button asChild variant="ghost">
              <Link href="/services">Browse Services</Link>
            </Button>
            <Button asChild variant="ghost">
              <Link href="/profile">Profile</Link>
            </Button>
            <Button asChild variant="ghost">
              <Link href="/bookings">My Bookings</Link>
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
            <div className="flex items-center gap-2">
              <Bell className="h-8 w-8" />
              <h2 className="text-3xl font-bold tracking-tight">Notifications</h2>
            </div>
            <p className="mt-2 text-muted-foreground">Stay updated with your bookings and activities</p>
          </div>

          {notifications && notifications.length > 0 ? (
            <div className="space-y-4">
              {notifications.map((notification) => (
                <Card key={notification.id} className={notification.read ? "opacity-75" : ""}>
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <div className="text-2xl">{getNotificationIcon(notification.type)}</div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold">{notification.title}</h3>
                            <p className="text-sm text-muted-foreground mt-1">
                              {notification.message}
                            </p>
                          </div>
                          {!notification.read && (
                            <Badge variant="default" className="ml-2">
                              New
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">
                          {new Date(notification.created_at).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <CheckCheck className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">You're all caught up! No new notifications.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}