import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function VerifyEmailPage() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center px-4 py-6 md:px-8 lg:px-16">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight">NuelReserve</h1>
          <p className="mt-2 text-muted-foreground">Email verified successfully</p>
        </div>
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">You have been authenticated!</CardTitle>
            <CardDescription>Your email has been verified</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Thank you for verifying your email address. Your account is now active and you can log in to start using our services.
            </p>
            <Button asChild className="w-full">
              <Link href="/auth/login">Login Now</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}