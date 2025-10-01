"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Star, StarHalf, Heart } from "lucide-react"
import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import type { Service, Profile } from "@/lib/types/database"

interface ServiceWithProvider extends Service {
  provider: Profile | null
  reviews?: { rating: number }[]
}

export function ServiceCard({ service }: { service: ServiceWithProvider }) {
  const [isFavorited, setIsFavorited] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const supabase = createClient()

  // Calculate average rating
  const averageRating = service.reviews && service.reviews.length > 0
    ? service.reviews.reduce((sum, review) => sum + review.rating, 0) / service.reviews.length
    : null

  const reviewCount = service.reviews?.length || 0

  // Check if service is favorited on mount
  useEffect(() => {
    checkFavoriteStatus()
  }, [service.id])

  const checkFavoriteStatus = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data } = await supabase
        .from("favorites")
        .select("id")
        .eq("user_id", user.id)
        .eq("service_id", service.id)
        .single()

      setIsFavorited(!!data)
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
    } catch (error) {
      console.error("Error toggling favorite:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const renderStars = (rating: number) => {
    const stars = []
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 !== 0

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />)
    }

    if (hasHalfStar) {
      stars.push(<StarHalf key="half" className="h-4 w-4 fill-yellow-400 text-yellow-400" />)
    }

    const emptyStars = 5 - Math.ceil(rating)
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="h-4 w-4 text-gray-300" />)
    }

    return stars
  }

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
            <Badge variant="secondary">${service.price}</Badge>
          </div>
        </div>
        <CardDescription>by {service.provider?.full_name || "Unknown Provider"}</CardDescription>
        {averageRating && (
          <div className="flex items-center gap-1 mt-1">
            <div className="flex">{renderStars(averageRating)}</div>
            <span className="text-sm font-medium">{averageRating.toFixed(1)}</span>
            <span className="text-xs text-muted-foreground">({reviewCount})</span>
          </div>
        )}
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-4">
        <p className="line-clamp-2 text-sm text-muted-foreground">
          {service.description || "No description available."}
        </p>
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline">{service.category}</Badge>
          <Badge variant="outline">{service.duration_minutes} min</Badge>
        </div>
        <Button asChild className="mt-auto">
          <Link href={`/services/${service.id}`}>View Details</Link>
        </Button>
      </CardContent>
    </Card>
  )
}
