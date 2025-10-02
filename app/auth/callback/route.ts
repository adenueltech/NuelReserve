import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get("code")
  const next = searchParams.get("next") ?? "/auth/verify-email"

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    // Check if user is authenticated regardless of exchange error
    const { data: { user } } = await supabase.auth.getUser()

    if (!error || user) {
      // If no error or user is authenticated, redirect to success
      const forwardedHost = request.headers.get("x-forwarded-host") // original origin before load balancer
      const isLocalEnv = process.env.NODE_ENV === "development"
      if (isLocalEnv) {
        // We can be sure that there is no load balancer in between, so no need to watch for X-Forwarded-Host
        return NextResponse.redirect(`${origin}${next}`)
      } else if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${next}`)
      } else {
        return NextResponse.redirect(`${origin}${next}`)
      }
    }
  }

  // For local testing, redirect to verify-email even on error
  const isLocalEnv = process.env.NODE_ENV === "development"
  if (isLocalEnv) {
    return NextResponse.redirect(`${origin}/auth/verify-email`)
  }

  // return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/auth/error`)
}