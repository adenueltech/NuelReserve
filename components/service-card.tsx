"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Heart } from "lucide-react"
import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import type { Service, Profile } from "@/lib/types/database"

interface ServiceWithProvider extends Service {
  provider: Profile | null
  userHasBooking?: boolean
  isFavorite?: boolean
}

export function ServiceCard({ service, onFavoriteChange }: { service: ServiceWithProvider; onFavoriteChange?: () => void }) {
  const [isFavorited, setIsFavorited] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const supabase = createClient()


  // Check if service is favorited on mount
  useEffect(() => {
    if (service.isFavorite !== undefined) {
      setIsFavorited(service.isFavorite)
    } else {
      checkFavoriteStatus()
    }
  }, [service.id, service.isFavorite])

  const checkFavoriteStatus = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data } = await supabase
        .from("favorites")
        .select("id")
        .eq("user_id", user.id)
        .eq("service_id", service.id)
        .limit(1)

      setIsFavorited(!!data && data.length > 0)
    } catch (error) {
      // Not favorited or error
      setIsFavorited(false)
    }
  }

  const toggleFavorite = async () => {
    if (isLoading) return

    try {
      setIsLoading(true)
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      if (isFavorited) {
        // Remove from favorites
        await supabase
          .from("favorites")
          .delete()
          .eq("user_id", user.id)
          .eq("service_id", service.id)
        setIsFavorited(false)
      } else {
        // Add to favorites
        await supabase
          .from("favorites")
          .insert({
            user_id: user.id,
            service_id: service.id,
          })
        setIsFavorited(true)
      }

      // Call the callback to refresh the parent component
      if (onFavoriteChange) {
        onFavoriteChange()
      }
    } catch (error) {
      console.error("Error toggling favorite:", error)
    } finally {
      setIsLoading(false)
    }
  }


  console.log('service currency:', service.currency, 'duration_unit:', service.duration_unit, 'duration_minutes:', service.duration_minutes)

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <div className="flex items-start justify-between">
          <CardTitle className="text-xl">{service.title}</CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.preventDefault()
                toggleFavorite()
              }}
              disabled={isLoading}
              className="h-8 w-8 p-0"
            >
              <Heart
                className={`h-4 w-4 ${
                  isFavorited ? "fill-red-500 text-red-500" : "text-gray-400"
                }`}
              />
            </Button>
            <Badge variant="secondary">
              {service.currency === 'NGN' ? '₦' : '$'}{service.price}
            </Badge>
          </div>
        </div>
        <CardDescription>by {service.provider?.full_name || service.provider?.email || "Unknown Provider"}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-4">
        <p className="line-clamp-2 text-sm text-muted-foreground">
          {service.description || "No description available."}
        </p>
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline">{service.category}</Badge>
          <Badge variant="outline">
            {service.duration_unit === 'hours'
              ? `${service.duration_minutes / 60} hour${service.duration_minutes / 60 !== 1 ? 's' : ''}`
              : `${service.duration_minutes} min`
            }
          </Badge>
        </div>
        {service.userHasBooking ? (
          <Button disabled className="mt-auto" variant="secondary">
            Already Booked
          </Button>
        ) : (
          <Button asChild className="mt-auto">
            <Link href={`/services/${service.id}`}>View Details</Link>
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
