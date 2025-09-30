import { createClient } from "@/lib/supabase/server"
import { redirect, notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { AvailabilityForm } from "@/components/availability-form"
import { AvailabilityList } from "@/components/availability-list"

export default async function ServiceAvailabilityPage({ params }: { params: Promise<{ id: string }> }) {
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

  const { id } = await params

  const { data: service } = await supabase.from("services").select("*").eq("id", id).eq("provider_id", user.id).single()

  if (!service) {
    notFound()
  }

  // Get availability for this service
  const { data: availability } = await supabase
    .from("availability")
    .select("*")
    .eq("service_id", id)
    .order("date", { ascending: true })
    .order("start_time", { ascending: true })

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/provider/dashboard">
            <h1 className="text-2xl font-bold">NuelReserve Provider</h1>
          </Link>
          <Button asChild variant="ghost">
            <Link href="/provider/services">Back to Services</Link>
          </Button>
        </div>
      </header>

      <main className="flex-1">
        <div className="container mx-auto max-w-4xl px-4 py-8">
          <div className="mb-8">
            <h2 className="text-3xl font-bold tracking-tight">Manage Availability</h2>
            <p className="mt-2 text-muted-foreground">Set available time slots for {service.title}</p>
          </div>

          <div className="grid gap-8 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Add Time Slots</CardTitle>
                <CardDescription>Create new availability for your service</CardDescription>
              </CardHeader>
              <CardContent>
                <AvailabilityForm serviceId={service.id} providerId={user.id} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Current Availability</CardTitle>
                <CardDescription>View and manage your time slots</CardDescription>
              </CardHeader>
              <CardContent>
                <AvailabilityList availability={availability || []} />
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
