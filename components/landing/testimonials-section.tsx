"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Star } from "lucide-react"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"

export function TestimonialsSection() {
  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Fitness Enthusiast",
      avatar: "/professional-woman-smiling.png",
      rating: 5,
      text: "NuelReserve made finding and booking a personal trainer so easy! The real-time availability feature is a game-changer. I can see open slots and book instantly without back-and-forth emails.",
    },
    {
      name: "Michael Chen",
      role: "Small Business Owner",
      avatar: "/professional-man-glasses.png",
      rating: 5,
      text: "As a service provider, this platform has transformed my business. The booking management system is intuitive, and I love how I can track all my appointments and analytics in one place.",
    },
    {
      name: "Emily Rodriguez",
      role: "Busy Professional",
      avatar: "/professional-woman-dark-hair.png",
      rating: 5,
      text: "I've used NuelReserve to book everything from haircuts to home repairs. The interface is clean, the providers are verified, and I always get confirmation instantly. Highly recommend!",
    },
    {
      name: "David Thompson",
      role: "Yoga Instructor",
      avatar: "/professional-man-smiling.png",
      rating: 5,
      text: "Setting up my services was incredibly straightforward. My clients love how easy it is to book sessions, and I appreciate the automated reminders that reduce no-shows significantly.",
    },
    {
      name: "Lisa Park",
      role: "Marketing Manager",
      avatar: "/professional-asian-woman.png",
      rating: 5,
      text: "The search and filter options are excellent. I found exactly the type of consultant I needed within minutes. The booking process was seamless from start to finish.",
    },
    {
      name: "James Wilson",
      role: "Photography Studio Owner",
      avatar: "/professional-photographer.png",
      rating: 5,
      text: "NuelReserve has helped me reach more clients and manage my schedule efficiently. The platform is reliable, and the support team is always helpful when I have questions.",
    },
  ]

  return (
    <section
      id="testimonials"
      className="scroll-mt-16 border-b border-border/40 bg-muted/30 py-12 sm:py-16 md:py-24 lg:py-32"
    >
      <div className="container mx-auto px-4">
        <div className="animate-fadeInUp mx-auto mb-12 max-w-3xl text-center sm:mb-16">
          <h2 className="mb-4 text-balance text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            Loved by Users & Providers
          </h2>
          <p className="text-pretty text-base text-muted-foreground sm:text-lg">
            Join thousands of satisfied users and service providers who trust NuelReserve for their booking needs.
          </p>
        </div>

        <div className="animate-fadeInUp mx-auto max-w-6xl px-8 sm:px-12">
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-2 sm:-ml-4">
              {testimonials.map((testimonial, index) => (
                <CarouselItem key={index} className="pl-2 sm:pl-4 md:basis-1/2 lg:basis-1/3">
                  <Card className="h-full border-border/50">
                    <CardContent className="flex h-full flex-col gap-4 p-4 sm:p-6">
                      <div className="flex gap-1">
                        {Array.from({ length: testimonial.rating }).map((_, i) => (
                          <Star key={i} className="size-3 fill-yellow-400 text-yellow-400 sm:size-4" />
                        ))}
                      </div>
                      <p className="flex-1 text-sm leading-relaxed text-muted-foreground">{testimonial.text}</p>
                      <div className="flex items-center gap-3">
                        <Avatar className="size-10 sm:size-12">
                          <AvatarImage src={testimonial.avatar || "/placeholder.svg"} alt={testimonial.name} />
                          <AvatarFallback>
                            {testimonial.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="text-sm font-semibold sm:text-base">{testimonial.name}</div>
                          <div className="text-xs text-muted-foreground sm:text-sm">{testimonial.role}</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="-left-4 sm:-left-6" />
            <CarouselNext className="-right-4 sm:-right-6" />
          </Carousel>
        </div>
      </div>
    </section>
  )
}
