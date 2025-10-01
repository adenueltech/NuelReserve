"use client"

import { createClient } from "@/lib/supabase/client"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"

export default function AuthCallbackPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const handleAuthCallback = async () => {
      const code = searchParams.get("code")
      const next = searchParams.get("next") || "/auth/verify-email"

      if (code) {
        try {
          const supabase = createClient()
          const { error } = await supabase.auth.exchangeCodeForSession(code)

          if (error) {
            console.error("Auth callback error:", error)
            setError(error.message)
            return
          }

          // Successfully authenticated, redirect to the next page
          router.push(next)
        } catch (err) {
          console.error("Unexpected error:", err)
          setError("An unexpected error occurred")
        }
      } else {
        setError("No authorization code provided")
      }
    }

    handleAuthCallback()
  }, [searchParams, router])

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Authentication Error</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => router.push("/auth/login")}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Go to Login
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Verifying your email...</p>
      </div>
    </div>
  )
}