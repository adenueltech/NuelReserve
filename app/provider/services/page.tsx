import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

export default async function ProviderServicesPage() {
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

  const { data: services } = await supabase
    .from("services")
    .select("*")
    .eq("provider_id", user.id)
    .order("created_at", { ascending: false })

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
              <Link href="/provider/bookings">Bookings</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">My Services</h2>
              <p className="mt-2 text-muted-foreground">Manage your service offerings</p>
            </div>
            <Button asChild>
              <Link href="/provider/services/new">Add New Service</Link>
            </Button>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {services && services.length > 0 ? (
              services.map((service) => (
                <Card key={service.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-xl">{service.title}</CardTitle>
                      <Badge variant={service.is_active ? "default" : "secondary"}>
                        {service.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                    <CardDescription>{service.category}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="line-clamp-2 text-sm text-muted-foreground">
                      {service.description || "No description"}
                    </p>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">{service.duration_minutes} min</span>
                      <span className="font-semibold">${service.price}</span>
                    </div>
                    <div className="flex gap-2">
                      <Button asChild className="flex-1" size="sm">
                        <Link href={`/provider/services/${service.id}`}>Edit</Link>
                      </Button>
                      <Button asChild variant="outline" className="flex-1 bg-transparent" size="sm">
                        <Link href={`/provider/services/${service.id}/availability`}>Availability</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card className="col-span-full">
                <CardContent className="py-12 text-center">
                  <p className="text-muted-foreground">You haven&apos;t created any services yet.</p>
                  <Button asChild className="mt-4">
                    <Link href="/provider/services/new">Create Your First Service</Link>
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
