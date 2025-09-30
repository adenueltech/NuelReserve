import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight, CheckCircle, Star, Users, Zap } from "lucide-react"

export default function GetStartedPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      <div className="container mx-auto px-6 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8">
            ← Back to Home
          </Link>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Get Started with NuelReserve
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Choose your path and start your journey in the world of effortless service booking
          </p>
        </div>

        {/* Options */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Customer */}
          <div className="bg-card border border-border rounded-2xl p-8 hover:shadow-xl transition-shadow">
            <div className="text-center mb-6">
              <Users className="size-16 text-primary mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">I'm a Customer</h2>
              <p className="text-muted-foreground">Find and book services from trusted providers</p>
            </div>

            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-3">
                <CheckCircle className="size-5 text-green-500" />
                <span>Browse thousands of services</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="size-5 text-green-500" />
                <span>Real-time availability</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="size-5 text-green-500" />
                <span>Instant booking confirmation</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="size-5 text-green-500" />
                <span>Secure payments</span>
              </div>
            </div>

            <Button asChild className="w-full" size="lg">
              <Link href="/auth/sign-up?role=customer">
                Sign Up as Customer
                <ArrowRight className="ml-2 size-4" />
              </Link>
            </Button>
          </div>

          {/* Provider */}
          <div className="bg-card border border-border rounded-2xl p-8 hover:shadow-xl transition-shadow">
            <div className="text-center mb-6">
              <Star className="size-16 text-accent mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">I'm a Service Provider</h2>
              <p className="text-muted-foreground">Offer your services and grow your business</p>
            </div>

            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-3">
                <CheckCircle className="size-5 text-green-500" />
                <span>Create your service profile</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="size-5 text-green-500" />
                <span>Manage availability</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="size-5 text-green-500" />
                <span>Receive booking notifications</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="size-5 text-green-500" />
                <span>Track earnings</span>
              </div>
            </div>

            <Button asChild className="w-full" size="lg" variant="outline">
              <Link href="/auth/sign-up?role=provider">
                Sign Up as Provider
                <ArrowRight className="ml-2 size-4" />
              </Link>
            </Button>
          </div>
        </div>

        {/* Features */}
        <div className="mt-20 text-center">
          <h3 className="text-2xl font-bold mb-8">Why Choose NuelReserve?</h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <Zap className="size-12 text-primary mx-auto mb-4" />
              <h4 className="font-semibold mb-2">Lightning Fast</h4>
              <p className="text-muted-foreground">Book services in seconds with our optimized platform</p>
            </div>
            <div className="text-center">
              <CheckCircle className="size-12 text-green-500 mx-auto mb-4" />
              <h4 className="font-semibold mb-2">Secure & Trusted</h4>
              <p className="text-muted-foreground">Your data and transactions are always protected</p>
            </div>
            <div className="text-center">
              <Users className="size-12 text-accent mx-auto mb-4" />
              <h4 className="font-semibold mb-2">Community Driven</h4>
              <p className="text-muted-foreground">Join thousands of satisfied users and providers</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}