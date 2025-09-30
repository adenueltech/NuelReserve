"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Scissors, Wrench, Briefcase, Heart, Home, GraduationCap, Camera, Utensils } from "lucide-react"

export function CategoriesSection() {
  const categories = [
    { icon: Scissors, name: "Beauty & Wellness", count: "1,200+ services", color: "text-pink-500" },
    { icon: Wrench, name: "Home Services", count: "850+ services", color: "text-orange-500" },
    { icon: Briefcase, name: "Professional Services", count: "2,100+ services", color: "text-blue-500" },
    { icon: Heart, name: "Health & Fitness", count: "950+ services", color: "text-red-500" },
    { icon: Home, name: "Real Estate", count: "600+ services", color: "text-green-500" },
    { icon: GraduationCap, name: "Education & Tutoring", count: "1,400+ services", color: "text-purple-500" },
    { icon: Camera, name: "Events & Photography", count: "750+ services", color: "text-cyan-500" },
    { icon: Utensils, name: "Food & Catering", count: "500+ services", color: "text-yellow-500" },
  ]

  return (
    <section id="categories" className="scroll-mt-16 border-b border-border/40 py-20 md:py-32">
      <div className="container mx-auto px-4">
        <div className="animate-fadeInUp mx-auto mb-16 max-w-3xl text-center">
          <h2 className="mb-4 text-balance text-4xl font-bold tracking-tight md:text-5xl">
            Explore Service Categories
          </h2>
          <p className="text-pretty text-lg text-muted-foreground">
            From beauty and wellness to professional services, find exactly what you need across diverse categories.
          </p>
        </div>

        <div className="mb-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((category, index) => {
            const Icon = category.icon
            return (
              <Card
                key={index}
                className="animate-fadeInUp group cursor-pointer border-border/50 transition-all hover:border-primary/50 hover:shadow-lg"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <CardContent className="flex flex-col items-center gap-4 p-6 text-center">
                  <div
                    className={`flex size-14 items-center justify-center rounded-2xl bg-muted transition-colors group-hover:bg-primary/10 ${category.color}`}
                  >
                    <Icon className="size-7" />
                  </div>
                  <div>
                    <h3 className="mb-1 font-semibold">{category.name}</h3>
                    <p className="text-sm text-muted-foreground">{category.count}</p>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <div className="animate-fadeInUp text-center">
          <Button asChild size="lg">
            <Link href="/auth/sign-up">Browse All Services</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
