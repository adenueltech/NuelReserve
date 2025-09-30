"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight, Calendar, Clock, Shield } from "lucide-react"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import Autoplay from "embla-carousel-autoplay"
import { useRef } from "react"

export function HeroSection() {
  const plugin = useRef(Autoplay({ delay: 4000, stopOnInteraction: true }))

  return (
    <section className="relative overflow-hidden border-b border-border/40 bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4 py-12 sm:py-16 md:py-24 lg:py-32">
        <div className="flex flex-col items-center gap-8 sm:gap-10 lg:flex-row lg:gap-12">
          {/* Left: Text Content */}
          <div className="animate-fadeInLeft flex-1 space-y-6 text-center lg:space-y-8 lg:text-left">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1.5 text-xs font-medium text-primary sm:px-4 sm:text-sm">
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex size-2 rounded-full bg-primary"></span>
              </span>
              Now Live - Book Services Instantly
            </div>

            <h1 className="text-balance text-3xl font-bold leading-tight tracking-tight sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl">
              Book Services with{" "}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Confidence</span>
            </h1>

            <p className="text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg md:text-xl">
              Connect with trusted service providers instantly. Browse services, check real-time availability, and book
              appointments in seconds. Your time is valuable—we make booking effortless.
            </p>

            <div className="flex flex-col gap-3 sm:flex-row sm:gap-4 lg:justify-start">
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

            <div className="flex flex-wrap items-center justify-center gap-4 pt-2 sm:gap-6 lg:justify-start">
              <div className="flex items-center gap-2 text-xs text-muted-foreground sm:text-sm">
                <Shield className="size-4 text-primary sm:size-5" />
                <span>Secure & Trusted</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground sm:text-sm">
                <Clock className="size-4 text-primary sm:size-5" />
                <span>Real-time Availability</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground sm:text-sm">
                <Calendar className="size-4 text-primary sm:size-5" />
                <span>Instant Booking</span>
              </div>
            </div>
          </div>

          {/* Right: Image Carousel */}
          <div className="animate-fadeInRight relative w-full flex-1 lg:w-auto">
            <div className="absolute -inset-4 animate-gradient rounded-3xl bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 opacity-75 blur-2xl"></div>
            <Carousel
              plugins={[plugin.current]}
              className="relative w-full"
              onMouseEnter={plugin.current.stop}
              onMouseLeave={plugin.current.reset}
            >
              <CarouselContent>
                <CarouselItem>
                  <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-border bg-card shadow-2xl">
                    <img
                      src="/modern-booking-app-dashboard-with-calendar-and-app.jpg"
                      alt="Booking Dashboard"
                      className="size-full object-cover"
                    />
                  </div>
                </CarouselItem>
                <CarouselItem>
                  <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-border bg-card shadow-2xl">
                    <img
                      src="/service-provider-managing-appointments-on-tablet.jpg"
                      alt="Provider Dashboard"
                      className="size-full object-cover"
                    />
                  </div>
                </CarouselItem>
                <CarouselItem>
                  <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-border bg-card shadow-2xl">
                    <img
                      src="/happy-customer-booking-service-on-mobile-phone.jpg"
                      alt="Mobile Booking"
                      className="size-full object-cover"
                    />
                  </div>
                </CarouselItem>
              </CarouselContent>
              <CarouselPrevious className="left-2 sm:left-4" />
              <CarouselNext className="right-2 sm:right-4" />
            </Carousel>
          </div>
        </div>
      </div>
    </section>
  )
}
