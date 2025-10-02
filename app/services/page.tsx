"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { ServiceCard } from "@/components/service-card"
import { ServiceFilters } from "@/components/service-filters"
import { NotificationBell } from "@/components/notification-bell"
import { LogoutButton } from "@/components/logout-button"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Menu, X } from "lucide-react"

export default function ServicesPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [services, setServices] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)

  const supabase = createClient()

  useEffect(() => {
    loadServices()
  }, [])

  const loadServices = async () => {
    try {
      const { data: { user: userData } } = await supabase.auth.getUser()
      if (!userData) {
        window.location.href = "/auth/login"
        return
      }
      setUser(userData)

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

      const { data: servicesData } = await query.order("created_at", { ascending: false })

      // Check for existing bookings for each service
      const servicesWithBookingStatus = await Promise.all(
        (servicesData || []).map(async (service) => {
          const { data: existingBooking } = await supabase
            .from("bookings")
            .select("id")
            .eq("user_id", userData.id)
            .eq("service_id", service.id)
            .in("status", ["pending", "confirmed", "completed"])
            .limit(1)
            .single()

          return {
            ...service,
            userHasBooking: !!existingBooking
          }
        })
      )

      setServices(servicesWithBookingStatus)
    } catch (error) {
      console.error("Error loading services:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading services...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/services">
            <h1 className="text-lg md:text-2xl font-bold">NuelReserve</h1>
          </Link>
          <div className="flex items-center gap-1 md:gap-4">
            <NotificationBell />
            <Button asChild variant="ghost" size="sm" className="hidden md:flex">
              <Link href="/favorites">Favorites</Link>
            </Button>
            <Button asChild variant="ghost" size="sm" className="hidden md:flex">
              <Link href="/profile">Profile</Link>
            </Button>
            <Button asChild variant="ghost" size="sm" className="hidden md:flex">
              <Link href="/bookings">Bookings</Link>
            </Button>
            <LogoutButton className="text-xs md:text-sm" />
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
                <Link href="/favorites" onClick={() => setMobileMenuOpen(false)}>
                  Favorites
                </Link>
              </Button>
              <Button asChild variant="ghost" className="justify-start">
                <Link href="/profile" onClick={() => setMobileMenuOpen(false)}>
                  Profile
                </Link>
              </Button>
              <Button asChild variant="ghost" className="justify-start">
                <Link href="/bookings" onClick={() => setMobileMenuOpen(false)}>
                  My Bookings
                </Link>
              </Button>
              <div className="mt-4 border-t border-border/40 pt-4">
                <LogoutButton className="w-full" />
              </div>
            </nav>
          </div>
        )}
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
