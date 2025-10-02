"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Zap } from "lucide-react"
import Image from "next/image"

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Optimized Hero Image */}
      <Image
        src="/hero.png"
        alt="Professional service booking platform - NuelReserve"
        fill
        className="object-cover object-center"
        priority
        quality={85}
        sizes="100vw"
        placeholder="blur"
        blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R+IRjWjBqO6O2mhP//Z"
        loading="eager"
      />

      {/* Dark overlay for text readability */}
      <div className="absolute inset-0 bg-black/40"></div>

      <div className="relative z-10 container mx-auto px-6 py-12">
        <div className="max-w-5xl mx-auto text-center md:text-left">
          {/* Small Label / Tagline */}
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 px-4 py-2 text-sm font-light text-white mb-4 mx-auto md:mx-0">
            <Zap className="h-4 w-4" style={{ color: "hsl(180, 84%, 37%)" }} />
            The Future of Service Booking
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-semibold text-white mb-3 leading-tight tracking-wide">
            NuelReserve
          </h1>

          {/* Subheading */}
          <p className="text-2xl md:text-4xl lg:text-5xl font-semibold text-white mb-6 leading-snug">
            Professional Service Booking Platform
          </p>

          {/* Glassmorphism Description Box */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 md:p-8 shadow-lg mb-8 max-w-2xl mx-auto md:mx-0">
            <p className="text-lg md:text-xl text-white/90 leading-relaxed font-light">
              Connect with trusted providers, book in real-time, and grow your business with confidence.
            </p>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <Button
              asChild
              size="lg"
              className="text-white px-6 py-3 text-base font-light shadow-lg hover:shadow-xl transition-all duration-300"
              style={{
                backgroundColor: "hsl(180, 84%, 37%)",
                borderColor: "hsl(180, 84%, 37%)",
              }}
            >
              <Link href="/get-started">Get Started</Link>
            </Button>

            <Button
              asChild
              size="lg"
              variant="outline"
              className="bg-transparent hover:bg-white/5 text-white border border-white/30 px-6 py-3 text-base font-light backdrop-blur-sm transition-all duration-300"
              style={{ borderColor: "hsl(180, 84%, 37%)" }}
            >
              <Link href="#features">Learn More</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
