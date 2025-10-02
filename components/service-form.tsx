"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import type { Service } from "@/lib/types/database"

const categories = [
  "Consulting",
  "Health & Wellness",
  "Education",
  "Home Services",
  "Beauty & Personal Care",
  "Technology",
  "Legal",
  "Financial",
  "Other",
]

interface ServiceFormProps {
  providerId: string
  service?: Service
}

export function ServiceForm({ providerId, service }: ServiceFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    title: service?.title || "",
    description: service?.description || "",
    category: service?.category || "",
    duration_value: service ? (service.duration_unit === "hours" ? service.duration_minutes / 60 : service.duration_minutes) : 1,
    duration_unit: (service?.duration_unit as "minutes" | "hours") || "hours",
    price: service?.price || 0,
    currency: service?.currency || "USD",
    location: service?.location || "",
    is_active: service?.is_active ?? true,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const supabase = createClient()

      const durationMinutes = formData.duration_unit === "hours" ? formData.duration_value * 60 : formData.duration_value

      if (service) {
        // Update existing service
        const { error: updateError } = await supabase
          .from("services")
          .update({
            title: formData.title,
            description: formData.description,
            category: formData.category,
            duration_minutes: durationMinutes,
            duration_unit: formData.duration_unit,
            price: formData.price,
            currency: formData.currency,
            location: formData.location,
            is_active: formData.is_active,
          })
          .eq("id", service.id)

        if (updateError) throw updateError
      } else {
        // Create new service
        const { error: insertError } = await supabase.from("services").insert({
          provider_id: providerId,
          title: formData.title,
          description: formData.description,
          category: formData.category,
          duration_minutes: durationMinutes,
          duration_unit: formData.duration_unit,
          price: formData.price,
          currency: formData.currency,
          location: formData.location,
          is_active: formData.is_active,
        })

        if (insertError) throw insertError
      }

      router.push("/provider/services")
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save service")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Service Title *</Label>
            <Input
              id="title"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g., 60-Minute Consultation"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe your service..."
              rows={4}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value })}
              >
                <SelectTrigger id="category">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="duration">Duration *</Label>
              <div className="flex gap-2">
                <Input
                  id="duration"
                  type="number"
                  required
                  min="1"
                  step="1"
                  value={formData.duration_value}
                  onChange={(e) => setFormData({ ...formData, duration_value: Number.parseInt(e.target.value) })}
                  className="flex-1"
                />
                <Select
                  value={formData.duration_unit}
                  onValueChange={(value: "minutes" | "hours") => setFormData({ ...formData, duration_unit: value })}
                >
                  <SelectTrigger className="w-24">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="minutes">min</SelectItem>
                    <SelectItem value="hours">hours</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="price">Price *</Label>
              <Input
                id="price"
                type="number"
                required
                min="0"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: Number.parseFloat(e.target.value) })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="currency">Currency *</Label>
              <Select
                value={formData.currency}
                onValueChange={(value) => setFormData({ ...formData, currency: value as "USD" })}
              >
                <SelectTrigger id="currency">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">$ USD</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="e.g., Remote, New York, NY"
              />
            </div>
          </div>

          <div className="flex items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <Label htmlFor="is_active">Active Status</Label>
              <p className="text-sm text-muted-foreground">Make this service visible to users</p>
            </div>
            <Switch
              id="is_active"
              checked={formData.is_active}
              onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
            />
          </div>

          {error && <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">{error}</div>}

          <div className="flex gap-4">
            <Button type="submit" disabled={isLoading} className="flex-1">
              {isLoading ? "Saving..." : service ? "Update Service" : "Create Service"}
            </Button>
            <Button type="button" variant="outline" onClick={() => router.back()} disabled={isLoading}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
