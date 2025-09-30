"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useRouter, useSearchParams } from "next/navigation"
import { useState, useTransition } from "react"
import { Button } from "@/components/ui/button"

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

export function ServiceFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  const [search, setSearch] = useState(searchParams.get("search") || "")
  const [category, setCategory] = useState(searchParams.get("category") || "all")

  const handleFilter = () => {
    const params = new URLSearchParams()
    if (search) params.set("search", search)
    if (category && category !== "all") params.set("category", category)

    startTransition(() => {
      router.push(`/services?${params.toString()}`)
    })
  }

  const handleReset = () => {
    setSearch("")
    setCategory("all")
    startTransition(() => {
      router.push("/services")
    })
  }

  return (
    <div className="rounded-lg border border-border bg-card p-6">
      <div className="grid gap-4 md:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="search">Search</Label>
          <Input
            id="search"
            placeholder="Search services..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleFilter()}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger id="category">
              <SelectValue placeholder="All categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All categories</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-end gap-2">
          <Button onClick={handleFilter} disabled={isPending} className="flex-1">
            Apply Filters
          </Button>
          <Button onClick={handleReset} variant="outline" disabled={isPending}>
            Reset
          </Button>
        </div>
      </div>
    </div>
  )
}
