import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  const supabase = await createClient()

  const { error } = await supabase.auth.signOut()
  if (error) {
    console.error("Logout error:", error)
  }

  // Get the origin from the request URL
  const { origin } = new URL(request.url)

  // Redirect to login page with 303 to change POST to GET
  return NextResponse.redirect(new URL("/auth/login", origin), { status: 303 })
}
