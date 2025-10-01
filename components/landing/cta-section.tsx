"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight, Sparkles } from "lucide-react"

export function CTASection() {
  return (
    <section className="relative overflow-hidden py-16 sm:py-20 md:py-28 lg:py-36 floating-shapes">
      <div className="absolute inset-0 bg-animated-gradient opacity-10"></div>
      <div className="absolute inset-0 animate-gradient bg-gradient-to-br from-primary/15 via-accent/15 to-primary/15"></div>
      <div className="container relative mx-auto px-8">
        <div className="animate-slide-in-up mx-auto max-w-4xl text-center">
          <div className="animate-bounce-gentle mb-6 inline-flex items-center gap-3 rounded-full border border-primary/20 bg-primary/5 px-5 py-3 text-base font-medium text-primary sm:mb-8 sm:px-6 sm:py-4 sm:text-lg">
            <Sparkles className="size-5 sm:size-6 animate-rotate-slow" />
            <span>Start Your Journey Today</span>
          </div>
          <h2 className="animate-pulse-glow mb-6 text-balance text-4xl font-bold tracking-tight sm:mb-8 sm:text-5xl md:text-6xl lg:text-7xl">
            Ready to Experience Effortless Booking?
          </h2>
          <p className="mb-10 text-pretty text-lg text-muted-foreground sm:mb-12 sm:text-xl md:text-2xl">
            Join thousands of users and providers who trust NuelReserve. Create your free account in seconds and start
            booking or offering services today.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-6">
            <Button asChild size="lg" className="animate-float group w-full sm:w-auto shadow-xl hover:shadow-2xl">
              <Link href="/get-started">
                Get Started Free
                <ArrowRight className="ml-2 size-5 transition-transform group-hover:translate-x-2" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="animate-bounce-gentle w-full sm:w-auto bg-transparent hover:bg-primary/10">
              <Link href="/get-started">Become a Provider</Link>
            </Button>
          </div>
          <p className="animate-slide-in-up mt-6 text-sm text-muted-foreground sm:mt-8 sm:text-base">
            No credit card required • Free forever • Cancel anytime
          </p>
        </div>
      </div>
    </section>
  )
}
