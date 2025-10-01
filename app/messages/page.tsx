import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Messaging } from "@/components/messaging"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MessageCircle, Users, Briefcase } from "lucide-react"

export default async function MessagesPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Get user profile to determine role
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  // Get all conversations (messages grouped by booking)
  const { data: messages } = await supabase
    .from("messages")
    .select(`
      *,
      booking:bookings(
        id,
        service:services(title),
        user:profiles!bookings_user_id_fkey(id, full_name),
        provider:profiles!bookings_provider_id_fkey(id, full_name)
      )
    `)
    .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
    .order("created_at", { ascending: false })

  // Group messages by booking/conversation
  const conversations = messages?.reduce((acc, message) => {
    const bookingId = message.booking_id || `pre-${message.booking?.user?.id || message.booking?.provider?.id}`

    if (!acc[bookingId]) {
      acc[bookingId] = {
        bookingId: message.booking_id,
        booking: message.booking,
        lastMessage: message,
        unreadCount: 0,
        otherUser: message.sender_id === user.id ? message.booking?.provider : message.booking?.user
      }
    }

    // Count unread messages
    if (message.receiver_id === user.id && !message.read) {
      acc[bookingId].unreadCount++
    }

    return acc
  }, {} as Record<string, any>)

  const conversationList = Object.values(conversations || []).sort((a: any, b: any) =>
    new Date(b.lastMessage.created_at).getTime() - new Date(a.lastMessage.created_at).getTime()
  )

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href={profile?.user_role === 'provider' ? "/provider/dashboard" : "/services"}>
            <h1 className="text-2xl font-bold">NuelReserve</h1>
          </Link>
          <div className="flex items-center gap-4">
            <Button asChild variant="ghost">
              <Link href={profile?.user_role === 'provider' ? "/provider/dashboard" : "/services"}>
                {profile?.user_role === 'provider' ? 'Dashboard' : 'Services'}
              </Link>
            </Button>
            <Button asChild variant="ghost">
              <Link href="/profile">Profile</Link>
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
              <MessageCircle className="h-8 w-8" />
              <h2 className="text-3xl font-bold tracking-tight">Messages</h2>
            </div>
            <p className="mt-2 text-muted-foreground">Communicate with service providers and customers</p>
          </div>

          {conversationList.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground mb-4">No messages yet</p>
                <p className="text-sm text-muted-foreground">
                  {profile?.user_role === 'provider'
                    ? 'Messages from customers will appear here after they book your services.'
                    : 'Start a conversation by messaging a service provider or booking a service.'
                  }
                </p>
                <Button asChild className="mt-4">
                  <Link href="/services">Browse Services</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6 lg:grid-cols-3">
              {/* Conversations List */}
              <div className="lg:col-span-1">
                <Card>
                  <CardHeader>
                    <CardTitle>Conversations</CardTitle>
                    <CardDescription>Your message threads</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {conversationList.map((conversation: any) => (
                      <div
                        key={conversation.bookingId || conversation.otherUser?.id}
                        className="flex items-center gap-3 rounded-lg border p-3 hover:bg-muted/50 cursor-pointer"
                      >
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">
                            {conversation.otherUser?.full_name || 'Unknown User'}
                          </p>
                          <p className="text-sm text-muted-foreground truncate">
                            {conversation.booking?.service?.title || 'Pre-booking chat'}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(conversation.lastMessage.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        {conversation.unreadCount > 0 && (
                          <Badge variant="destructive" className="text-xs">
                            {conversation.unreadCount}
                          </Badge>
                        )}
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>

              {/* Message Interface */}
              <div className="lg:col-span-2">
                <Card>
                  <CardContent className="p-6">
                    <div className="text-center text-muted-foreground">
                      <MessageCircle className="h-12 w-12 mx-auto mb-4" />
                      <p>Select a conversation to start messaging</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}