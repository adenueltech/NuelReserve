import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { ServiceCard } from "@/components/service-card"
import { ServiceFilters } from "@/components/service-filters"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default async function ServicesPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; search?: string }>
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const params = await searchParams
  const category = params.category
  const search = params.search

  // Build query
  let query = supabase
    .from("services")
    .select(
      `
      *,
      provider:profiles!services_provider_id_fkey(id, full_name, email)
    `,
    )
    .eq("is_active", true)

  if (category) {
    query = query.eq("category", category)
  }

  if (search) {
    query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`)
  }

  const { data: services } = await query.order("created_at", { ascending: false })

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/services">
            <h1 className="text-2xl font-bold">NuelReserve</h1>
          </Link>
          <div className="flex items-center gap-4">
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
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h2 className="text-3xl font-bold tracking-tight">Discover Services</h2>
            <p className="mt-2 text-muted-foreground">Browse and book from our trusted service providers</p>
          </div>

          <ServiceFilters />

          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services && services.length > 0 ? (
              services.map((service) => <ServiceCard key={service.id} service={service} />)
            ) : (
              <div className="col-span-full py-12 text-center">
                <p className="text-muted-foreground">No services found. Try adjusting your filters.</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
