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
    <section className="relative overflow-hidden border-b border-border/40 bg-gradient-to-b from-background to-muted/20 floating-shapes">
      <div className="absolute inset-0 bg-animated-gradient opacity-5"></div>
      <div className="container mx-auto px-6 py-16 sm:py-20 md:py-28 lg:py-36">
        <div className="flex flex-col items-center gap-10 sm:gap-12 lg:flex-row lg:gap-16">
          {/* Left: Text Content */}
          <div className="animate-slide-in-left flex-1 space-y-8 text-center lg:space-y-10 lg:text-left">
            <div className="animate-bounce-gentle inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-sm font-medium text-primary sm:px-5 sm:text-base">
              <span className="relative flex size-3">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex size-3 rounded-full bg-primary"></span>
              </span>
              Now Live - Book Services Instantly
            </div>

            <h1 className="animate-slide-in-up text-balance text-4xl font-bold leading-tight tracking-tight sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl">
              Book Services with{" "}
              <span className="animate-pulse-glow bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent bg-300%">Confidence</span>
            </h1>

            <p className="animate-slide-in-up text-pretty text-lg leading-relaxed text-muted-foreground sm:text-xl md:text-2xl">
              Connect with trusted service providers instantly. Browse services, check real-time availability, and book
              appointments in seconds. Your time is valuable—we make booking effortless.
            </p>

            <div className="animate-slide-in-up flex flex-col gap-4 sm:flex-row sm:gap-6 lg:justify-start">
              <Button asChild size="lg" className="animate-bounce-gentle group w-full sm:w-auto shadow-lg hover:shadow-xl">
                <Link href="/get-started">
                  Get Started Free
                  <ArrowRight className="ml-2 size-5 transition-transform group-hover:translate-x-2" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="animate-float w-full sm:w-auto bg-transparent hover:bg-primary/10">
                <Link href="/get-started">Become a Provider</Link>
              </Button>
            </div>

            <div className="animate-slide-in-up flex flex-wrap items-center justify-center gap-6 pt-4 sm:gap-8 lg:justify-start">
              <div className="animate-float flex items-center gap-3 text-sm text-muted-foreground sm:text-base">
                <Shield className="size-5 text-primary sm:size-6 animate-pulse-glow" />
                <span>Secure & Trusted</span>
              </div>
              <div className="animate-float flex items-center gap-3 text-sm text-muted-foreground sm:text-base" style={{ animationDelay: '0.5s' }}>
                <Clock className="size-5 text-primary sm:size-6 animate-pulse-glow" />
                <span>Real-time Availability</span>
              </div>
              <div className="animate-float flex items-center gap-3 text-sm text-muted-foreground sm:text-base" style={{ animationDelay: '1s' }}>
                <Calendar className="size-5 text-primary sm:size-6 animate-pulse-glow" />
                <span>Instant Booking</span>
              </div>
            </div>
          </div>

          {/* Right: Image Carousel */}
          <div className="animate-slide-in-right relative w-full flex-1 lg:w-auto">
            <div className="absolute -inset-6 animate-gradient rounded-3xl bg-gradient-to-r from-primary/30 via-accent/30 to-primary/30 opacity-80 blur-3xl animate-pulse-glow"></div>
            <Carousel
              plugins={[plugin.current]}
              className="relative w-full"
              onMouseEnter={plugin.current.stop}
              onMouseLeave={plugin.current.reset}
            >
              <CarouselContent>
                <CarouselItem>
                  <div className="animate-float relative aspect-[4/3] overflow-hidden rounded-3xl border border-border bg-card shadow-2xl hover:shadow-3xl transition-shadow duration-500">
                    <img
                      src="/modern-booking-app-dashboard-with-calendar-and-app.jpg"
                      alt="Booking Dashboard"
                      className="size-full object-cover transition-transform duration-700 hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                </CarouselItem>
                <CarouselItem>
                  <div className="animate-float relative aspect-[4/3] overflow-hidden rounded-3xl border border-border bg-card shadow-2xl hover:shadow-3xl transition-shadow duration-500" style={{ animationDelay: '1s' }}>
                    <img
                      src="/service-provider-managing-appointments-on-tablet.jpg"
                      alt="Provider Dashboard"
                      className="size-full object-cover transition-transform duration-700 hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                </CarouselItem>
                <CarouselItem>
                  <div className="animate-float relative aspect-[4/3] overflow-hidden rounded-3xl border border-border bg-card shadow-2xl hover:shadow-3xl transition-shadow duration-500" style={{ animationDelay: '2s' }}>
                    <img
                      src="/happy-customer-booking-service-on-mobile-phone.jpg"
                      alt="Mobile Booking"
                      className="size-full object-cover transition-transform duration-700 hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                </CarouselItem>
              </CarouselContent>
              <CarouselPrevious className="left-3 sm:left-5 animate-bounce-gentle" />
              <CarouselNext className="right-3 sm:right-5 animate-bounce-gentle" />
            </Carousel>
          </div>
        </div>
      </div>
    </section>
  )
}
