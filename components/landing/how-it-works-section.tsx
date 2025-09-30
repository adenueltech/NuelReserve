"use client"

import { UserCircle, Search, Calendar, CheckCircle } from "lucide-react"

export function HowItWorksSection() {
  const userSteps = [
    {
      icon: UserCircle,
      title: "Create Your Account",
      description: "Sign up in seconds and set up your profile to get started with booking services.",
    },
    {
      icon: Search,
      title: "Browse Services",
      description: "Explore hundreds of services, filter by category, and find the perfect provider for your needs.",
    },
    {
      icon: Calendar,
      title: "Book Instantly",
      description: "Check real-time availability, select your preferred time slot, and confirm your booking.",
    },
    {
      icon: CheckCircle,
      title: "Get Confirmed",
      description: "Receive instant confirmation and reminders. Manage or cancel bookings anytime from your dashboard.",
    },
  ]

  const providerSteps = [
    {
      icon: UserCircle,
      title: "Register as Provider",
      description: "Create your provider account and set up your professional profile in minutes.",
    },
    {
      icon: Search,
      title: "List Your Services",
      description: "Add your services with descriptions, pricing, duration, and categories to attract clients.",
    },
    {
      icon: Calendar,
      title: "Set Availability",
      description: "Define your available time slots and let the system handle booking management automatically.",
    },
    {
      icon: CheckCircle,
      title: "Manage Bookings",
      description:
        "Accept, confirm, or complete bookings from your dashboard. Track your business growth with analytics.",
    },
  ]

  return (
    <section
      id="how-it-works"
      className="scroll-mt-16 border-b border-border/40 bg-muted/30 py-12 sm:py-16 md:py-24 lg:py-32"
    >
      <div className="container mx-auto px-4">
        <div className="animate-fadeInUp mx-auto mb-12 max-w-3xl text-center sm:mb-16">
          <h2 className="mb-4 text-balance text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            How NuelReserve Works
          </h2>
          <p className="text-pretty text-base text-muted-foreground sm:text-lg">
            Simple, fast, and efficient. Whether you're booking a service or offering one, we've made it effortless.
          </p>
        </div>

        <div className="space-y-12 sm:space-y-16 lg:space-y-20">
          {/* For Users */}
          <div>
            <h3 className="animate-fadeInUp mb-8 text-center text-2xl font-bold sm:mb-10 sm:text-3xl">For Users</h3>
            <div className="grid gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-4">
              {userSteps.map((step, index) => {
                const Icon = step.icon
                return (
                  <div
                    key={index}
                    className="animate-fadeInUp group relative flex flex-col items-center text-center"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="relative mb-4 sm:mb-6">
                      <div className="flex size-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg transition-transform group-hover:scale-110 sm:size-16">
                        <Icon className="size-7 sm:size-8" />
                      </div>
                      <div className="absolute -right-2 -top-2 flex size-7 items-center justify-center rounded-full bg-accent text-xs font-bold text-accent-foreground sm:size-8 sm:text-sm">
                        {index + 1}
                      </div>
                    </div>
                    <h4 className="mb-2 text-base font-semibold sm:text-lg">{step.title}</h4>
                    <p className="text-sm leading-relaxed text-muted-foreground">{step.description}</p>
                    {index < userSteps.length - 1 && (
                      <div className="absolute -right-4 top-8 hidden h-0.5 w-8 bg-border lg:block"></div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* For Providers */}
          <div>
            <h3 className="animate-fadeInUp mb-8 text-center text-2xl font-bold sm:mb-10 sm:text-3xl">For Providers</h3>
            <div className="grid gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-4">
              {providerSteps.map((step, index) => {
                const Icon = step.icon
                return (
                  <div
                    key={index}
                    className="animate-fadeInUp group relative flex flex-col items-center text-center"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="relative mb-4 sm:mb-6">
                      <div className="flex size-14 items-center justify-center rounded-2xl bg-accent text-accent-foreground shadow-lg transition-transform group-hover:scale-110 sm:size-16">
                        <Icon className="size-7 sm:size-8" />
                      </div>
                      <div className="absolute -right-2 -top-2 flex size-7 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground sm:size-8 sm:text-sm">
                        {index + 1}
                      </div>
                    </div>
                    <h4 className="mb-2 text-base font-semibold sm:text-lg">{step.title}</h4>
                    <p className="text-sm leading-relaxed text-muted-foreground">{step.description}</p>
                    {index < providerSteps.length - 1 && (
                      <div className="absolute -right-4 top-8 hidden h-0.5 w-8 bg-border lg:block"></div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
