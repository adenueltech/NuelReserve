import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ServiceCard } from "@/components/service-card"

export default async function FavoritesPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Get user's favorites with service details
  const { data: favorites } = await supabase
    .from("favorites")
    .select(`
      service:services(
        *,
        provider:profiles!services_provider_id_fkey(id, full_name, email),
        reviews!left(rating)
      )
    `)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  const services = favorites?.map(fav => fav.service).filter(Boolean) || []

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
            <h2 className="text-3xl font-bold tracking-tight">My Favorites</h2>
            <p className="mt-2 text-muted-foreground">Services you've saved for later</p>
          </div>

          {services.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">You haven't favorited any services yet.</p>
              <Button asChild>
                <Link href="/services">Browse Services</Link>
              </Button>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {services.map((service) => (
                <ServiceCard key={service.id} service={service} />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}