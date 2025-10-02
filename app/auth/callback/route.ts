import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get("code")
  const next = searchParams.get("next") ?? "/auth/verify-email"

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    // Always redirect to verify-email for email confirmation
    // The user can login afterwards if authentication worked
    return NextResponse.redirect(`${origin}${next}`)
  }

  // No code provided, redirect to error
  return NextResponse.redirect(`${origin}/auth/error`)
}