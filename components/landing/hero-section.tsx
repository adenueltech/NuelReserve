"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight, Calendar, Clock, Shield } from "lucide-react"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import Autoplay from "embla-carousel-autoplay"

export function HeroSection() {
  const plugin = Autoplay({ delay: 4000, stopOnInteraction: true })

  return (
    <section className="relative overflow-hidden border-b border-border/40 bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500">
      {/* Dark overlay for text readability */}
      <div className="absolute inset-0 bg-black/40 pointer-events-none"></div>

      {/* Abstract background shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-float"></div>
        <div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-float"
          style={{ animationDelay: "2s" }}
        />
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-float"
          style={{ animationDelay: "4s" }}
        />
      </div>

      <div className="relative container mx-auto px-6 py-12 sm:py-16 md:py-20 lg:py-24">
        <div className="flex flex-col items-center gap-10 sm:gap-12 lg:flex-row lg:items-center lg:justify-between lg:gap-16">
          {/* Left: Text Content */}
          <div className="flex-1 max-w-2xl text-center lg:text-left">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 backdrop-blur-sm px-4 py-2 text-sm font-medium text-white sm:px-5 sm:text-base">
              <span className="relative flex items-center">
                <span className="absolute inline-flex w-2 h-2 animate-ping rounded-full bg-white opacity-60"></span>
                <span className="relative inline-flex w-2 h-2 rounded-full bg-white"></span>
              </span>
              Now Live - Book Services Instantly
            </div>

            <h1 className="mt-6 text-4xl leading-snug tracking-tight text-white sm:text-5xl md:text-6xl lg:text-6xl xl:text-7xl font-medium">
              <span className="bg-gradient-to-r from-yellow-300 via-pink-300 to-purple-300 bg-clip-text text-transparent animate-pulse-glow">
                Book Services with Confidence
              </span>
            </h1>

            <p className="mt-4 text-lg leading-relaxed text-white/90 sm:text-xl md:text-2xl">
              Connect with trusted service providers instantly. Browse services, check real-time availability, and
              book appointments in seconds. Your time is valuable—we make booking effortless.
            </p>

            <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:gap-6 lg:justify-start">
              <Button asChild size="lg" className="group w-full sm:w-auto shadow-lg hover:shadow-xl">
                <Link href="/get-started">
                  Get Started Free
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-2" />
                </Link>
              </Button>

              <Button asChild size="lg" variant="outline" className="w-full sm:w-auto bg-transparent hover:bg-primary/10">
                <Link href="/get-started">Become a Provider</Link>
              </Button>
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-center gap-6 pt-4 sm:gap-8 lg:justify-start">
              <div className="flex items-center gap-3 text-sm text-white/90 sm:text-base">
                <Shield className="h-5 w-5 text-yellow-300 animate-pulse-glow" />
                <span>Secure & Trusted</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-white/90 sm:text-base">
                <Clock className="h-5 w-5 text-pink-300 animate-pulse-glow" />
                <span>Real-time Availability</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-white/90 sm:text-base">
                <Calendar className="h-5 w-5 text-purple-300 animate-pulse-glow" />
                <span>Instant Booking</span>
              </div>
            </div>
          </div>

          {/* Right: Image Carousel (fixed width so it stays to the right) */}
          <div className="w-full lg:w-[520px] flex-shrink-0">
            {/* subtle framed background for carousel */}
            <div className="relative">
              <div className="absolute -inset-6 rounded-3xl bg-white/8 backdrop-blur-md border border-white/10 shadow-2xl" />
              <Carousel
                opts={{ loop: true }}
                plugins={[plugin]}
                className="relative w-full z-10"
                onMouseEnter={plugin.stop}
                onMouseLeave={plugin.reset}
              >
                <CarouselContent>
                  <CarouselItem>
                    <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-border bg-card shadow-2xl hover:shadow-3xl transition-shadow duration-500">
                      <img
                        src="/modern-booking-app-dashboard-with-calendar-and-app.jpg"
                        alt="Booking Dashboard"
                        className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
                    </div>
                  </CarouselItem>

                  <CarouselItem>
                    <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-border bg-card shadow-2xl hover:shadow-3xl transition-shadow duration-500">
                      <img
                        src="/service-provider-managing-appointments-on-tablet.jpg"
                        alt="Provider Dashboard"
                        className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
                    </div>
                  </CarouselItem>

                  <CarouselItem>
                    <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-border bg-card shadow-2xl hover:shadow-3xl transition-shadow duration-500">
                      <img
                        src="/happy-customer-booking-service-on-mobile-phone.jpg"
                        alt="Mobile Booking"
                        className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
                    </div>
                  </CarouselItem>
                </CarouselContent>

                <CarouselPrevious className="left-3 sm:left-5 animate-bounce-gentle border-white/30 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white" />
                <CarouselNext className="right-3 sm:right-5 animate-bounce-gentle border-white/30 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white" />
              </Carousel>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
