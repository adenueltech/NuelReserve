"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, Calendar, Bell, Shield, CreditCard, BarChart } from "lucide-react"

export function FeaturesSection() {
  const features = [
    {
      icon: Search,
      title: "Smart Search & Discovery",
      description: "Find the perfect service provider with advanced filters, categories, and real-time availability.",
    },
    {
      icon: Calendar,
      title: "Real-Time Booking",
      description: "See available time slots instantly and book appointments in seconds with automatic confirmations.",
    },
    {
      icon: Bell,
      title: "Instant Notifications",
      description: "Stay updated with booking confirmations, reminders, and status changes via email notifications.",
    },
    {
      icon: Shield,
      title: "Secure & Trusted",
      description: "Your data is protected with enterprise-grade security and privacy measures at every step.",
    },
    {
      icon: CreditCard,
      title: "Flexible Payments",
      description: "Multiple payment options with secure processing and transparent pricing for all services.",
    },
    {
      icon: BarChart,
      title: "Provider Analytics",
      description: "Service providers get powerful insights and analytics to grow their business effectively.",
    },
  ]

  return (
    <section id="features" className="scroll-mt-16 border-b border-border/40 py-12 sm:py-16 md:py-24 lg:py-32">
      <div className="container mx-auto px-4">
        <div className="animate-fadeInUp mx-auto mb-12 max-w-3xl text-center sm:mb-16">
          <h2 className="mb-4 text-balance text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            Everything you need to book with confidence
          </h2>
          <p className="text-pretty text-base text-muted-foreground sm:text-lg">
            Powerful features designed to make booking services effortless for users and managing bookings seamless for
            providers.
          </p>
        </div>

        <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <Card
                key={index}
                className="animate-fadeInUp group border-border/50 transition-all hover:border-primary/50 hover:shadow-lg"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardHeader>
                  <div className="mb-4 flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                    <Icon className="size-6" />
                  </div>
                  <CardTitle className="text-lg sm:text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm leading-relaxed sm:text-base">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
