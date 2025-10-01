 "use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Star, StarHalf } from "lucide-react"
import type { Review, ReviewWithUser } from "@/lib/types/database"

interface ReviewSectionProps {
  serviceId: string
  userId: string
  providerId: string
  canReview: boolean // User has completed a booking for this service
}

export function ReviewSection({ serviceId, userId, providerId, canReview }: ReviewSectionProps) {
  const [reviews, setReviews] = useState<ReviewWithUser[]>([])
  const [averageRating, setAverageRating] = useState<number | null>(null)
  const [reviewCount, setReviewCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const supabase = createClient()

  // Fetch reviews on mount
  useEffect(() => {
    fetchReviews()
  }, [])

  const fetchReviews = async () => {
    try {
      console.log("Fetching reviews for service:", serviceId)
      const { data, error } = await supabase
        .from("reviews")
        .select(`
          *,
          user:profiles(id, full_name)
        `)
        .eq("service_id", serviceId)
        .order("created_at", { ascending: false })

      if (error) {
        console.error("Error fetching reviews:", error)
        setIsLoading(false)
        return
      }

      console.log("Reviews data:", data)
      const reviewsWithUsers = data as ReviewWithUser[]
      setReviews(reviewsWithUsers)

      if (reviewsWithUsers.length > 0) {
        const avg = reviewsWithUsers.reduce((sum, review) => sum + review.rating, 0) / reviewsWithUsers.length
        setAverageRating(avg)
        setReviewCount(reviewsWithUsers.length)
      }

      setIsLoading(false)
    } catch (err) {
      console.error("Unexpected error in fetchReviews:", err)
      setIsLoading(false)
    }
  }

  const submitReview = async () => {
    if (!comment.trim()) return

    setIsSubmitting(true)
    const { error } = await supabase
      .from("reviews")
      .insert({
        user_id: userId,
        service_id: serviceId,
        provider_id: providerId,
        rating,
        comment: comment.trim(),
      })

    if (error) {
      console.error("Error submitting review:", error)
    } else {
      setShowReviewForm(false)
      setComment("")
      setRating(5)
      fetchReviews() // Refresh reviews
    }
    setIsSubmitting(false)
  }

  const renderStars = (rating: number, size: "sm" | "md" = "sm") => {
    const stars = []
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 !== 0

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={i} className={`fill-yellow-400 text-yellow-400 ${size === "md" ? "h-5 w-5" : "h-4 w-4"}`} />)
    }

    if (hasHalfStar) {
      stars.push(<StarHalf key="half" className={`fill-yellow-400 text-yellow-400 ${size === "md" ? "h-5 w-5" : "h-4 w-4"}`} />)
    }

    const emptyStars = 5 - Math.ceil(rating)
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} className={`${size === "md" ? "h-5 w-5" : "h-4 w-4"} text-gray-300`} />)
    }

    return stars
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-8">
          <div className="text-center text-muted-foreground">Loading reviews...</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Rating Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Reviews & Ratings
            {averageRating && (
              <div className="flex items-center gap-1">
                {renderStars(averageRating)}
                <span className="text-lg font-semibold">{averageRating.toFixed(1)}</span>
                <span className="text-sm text-muted-foreground">({reviewCount} reviews)</span>
              </div>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {canReview && !showReviewForm && (
            <Button onClick={() => setShowReviewForm(true)} className="mb-4">
              Write a Review
            </Button>
          )}

          {showReviewForm && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Write Your Review</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Rating</label>
                  <div className="flex gap-1 mt-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => setRating(star)}
                        className="focus:outline-none"
                      >
                        <Star
                          className={`h-6 w-6 ${
                            star <= rating
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium">Comment</label>
                  <Textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Share your experience..."
                    className="mt-1"
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={submitReview} disabled={isSubmitting}>
                    {isSubmitting ? "Submitting..." : "Submit Review"}
                  </Button>
                  <Button variant="outline" onClick={() => setShowReviewForm(false)}>
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>

      {/* Individual Reviews */}
      <div className="space-y-4">
        {reviews.length === 0 ? (
          <Card>
            <CardContent className="py-8">
              <div className="text-center text-muted-foreground">
                No reviews yet. Be the first to review this service!
              </div>
            </CardContent>
          </Card>
        ) : (
          reviews.map((review) => (
            <Card key={review.id}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex">{renderStars(review.rating)}</div>
                    <span className="font-medium">{review.user?.full_name || "Anonymous"}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {new Date(review.created_at).toLocaleDateString()}
                  </span>
                </div>
                {review.comment && (
                  <p className="mt-2 text-muted-foreground">{review.comment}</p>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}