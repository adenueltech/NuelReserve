"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight, Sparkles } from "lucide-react"

export function CTASection() {
  return (
    <section className="relative overflow-hidden py-12 sm:py-16 md:py-24 lg:py-32">
      <div className="absolute inset-0 animate-gradient bg-gradient-to-br from-primary/10 via-accent/10 to-primary/10"></div>
      <div className="container relative mx-auto px-4">
        <div className="animate-fadeInUp mx-auto max-w-3xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1.5 text-xs font-medium text-primary sm:mb-6 sm:px-4 sm:py-2 sm:text-sm">
            <Sparkles className="size-3 sm:size-4" />
            <span>Start Your Journey Today</span>
          </div>
          <h2 className="mb-4 text-balance text-3xl font-bold tracking-tight sm:mb-6 sm:text-4xl md:text-5xl lg:text-6xl">
            Ready to Experience Effortless Booking?
          </h2>
          <p className="mb-8 text-pretty text-base text-muted-foreground sm:mb-10 sm:text-lg md:text-xl">
            Join thousands of users and providers who trust NuelReserve. Create your free account in seconds and start
            booking or offering services today.
          </p>
          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
            <Button asChild size="lg" className="group w-full sm:w-auto">
              <Link href="/auth/sign-up">
                Get Started Free
                <ArrowRight className="ml-2 size-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="w-full sm:w-auto bg-transparent">
              <Link href="/auth/sign-up">Become a Provider</Link>
            </Button>
          </div>
          <p className="mt-4 text-xs text-muted-foreground sm:mt-6 sm:text-sm">
            No credit card required • Free forever • Cancel anytime
          </p>
        </div>
      </div>
    </section>
  )
}
