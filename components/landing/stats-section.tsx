"use client"

import { Users, Calendar, Star, TrendingUp } from "lucide-react"

export function StatsSection() {
  const stats = [
    {
      icon: Users,
      value: "10,000+",
      label: "Active Users",
      description: "Trust NuelReserve",
    },
    {
      icon: Calendar,
      value: "50,000+",
      label: "Bookings Made",
      description: "Every month",
    },
    {
      icon: Star,
      value: "4.9/5",
      label: "Average Rating",
      description: "From our users",
    },
    {
      icon: TrendingUp,
      value: "98%",
      label: "Success Rate",
      description: "Completed bookings",
    },
  ]

  return (
    <section className="animate-fadeInUp border-b border-border/40 bg-muted/30 py-12 sm:py-16">
      <div className="container mx-auto px-4">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <div
                key={index}
                className="group flex flex-col items-center gap-3 text-center transition-transform hover:scale-105"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground sm:size-14">
                  <Icon className="size-6 sm:size-7" />
                </div>
                <div className="space-y-1">
                  <div className="text-3xl font-bold sm:text-4xl">{stat.value}</div>
                  <div className="text-sm font-semibold text-foreground">{stat.label}</div>
                  <div className="text-xs text-muted-foreground">{stat.description}</div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
