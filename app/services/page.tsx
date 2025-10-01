import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { ServiceCard } from "@/components/service-card"
import { ServiceFilters } from "@/components/service-filters"
import { NotificationBell } from "@/components/notification-bell"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default async function ServicesPage({
  searchParams,
}: {
  searchParams: Promise<{
    category?: string;
    search?: string;
    sort?: string;
    minPrice?: string;
    maxPrice?: string;
  }>
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
  const sort = params.sort || "created_at"
  const minPrice = params.minPrice
  const maxPrice = params.maxPrice

  // Build query with ratings
  let query = supabase
    .from("services")
    .select(
      `
      *,
      provider:profiles!services_provider_id_fkey(id, full_name, email),
      reviews!left(rating)
    `,
    )
    .eq("is_active", true)

  if (category) {
    query = query.eq("category", category)
  }

  if (search) {
    query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`)
  }

  if (minPrice) {
    query = query.gte("price", parseFloat(minPrice))
  }

  if (maxPrice) {
    query = query.lte("price", parseFloat(maxPrice))
  }

  // Handle sorting
  let orderBy = "created_at"
  let ascending = false

  switch (sort) {
    case "price_asc":
      orderBy = "price"
      ascending = true
      break
    case "price_desc":
      orderBy = "price"
      ascending = false
      break
    case "rating":
      // For rating sort, we'll sort by services that have reviews first
      // This is a simplified approach - in production you'd want proper rating aggregation
      orderBy = "created_at"
      ascending = false
      break
    default:
      orderBy = "created_at"
      ascending = false
  }

  const { data: services } = await query.order(orderBy, { ascending })

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/services">
            <h1 className="text-lg md:text-2xl font-bold">NuelReserve</h1>
          </Link>
          <div className="flex items-center gap-1 md:gap-4">
            <NotificationBell />
            <Button asChild variant="ghost" size="sm" className="hidden sm:flex text-xs md:text-sm">
              <Link href="/messages">Messages</Link>
            </Button>
            <Button asChild variant="ghost" size="sm" className="text-xs md:text-sm">
              <Link href="/favorites">Favorites</Link>
            </Button>
            <Button asChild variant="ghost" size="sm" className="hidden md:flex text-xs md:text-sm">
              <Link href="/profile">Profile</Link>
            </Button>
            <Button asChild variant="ghost" size="sm" className="text-xs md:text-sm">
              <Link href="/bookings">Bookings</Link>
            </Button>
            <form action="/auth/logout" method="post">
              <Button type="submit" variant="outline" size="sm" className="text-xs md:text-sm">
                Logout
              </Button>
            </form>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <div className="container mx-auto px-4 md:px-6 py-6 md:py-8">
          <div className="mb-6 md:mb-8">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Discover Services</h2>
            <p className="mt-2 text-sm md:text-base text-muted-foreground">Browse and book from our trusted service providers</p>
          </div>

          <ServiceFilters />

          <div className="mt-6 md:mt-8 grid gap-4 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {services && services.length > 0 ? (
              services.map((service) => <ServiceCard key={service.id} service={service} />)
            ) : (
              <div className="col-span-full py-8 md:py-12 text-center">
                <p className="text-muted-foreground">No services found. Try adjusting your filters.</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
