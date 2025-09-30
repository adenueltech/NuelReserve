import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { ServiceForm } from "@/components/service-form"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default async function NewServicePage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  if (profile?.user_role !== "provider") {
    redirect("/services")
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/provider/dashboard">
            <h1 className="text-2xl font-bold">NuelReserve Provider</h1>
          </Link>
          <Button asChild variant="ghost">
            <Link href="/provider/services">Back to Services</Link>
          </Button>
        </div>
      </header>

      <main className="flex-1">
        <div className="container mx-auto max-w-2xl px-4 py-8">
          <div className="mb-8">
            <h2 className="text-3xl font-bold tracking-tight">Create New Service</h2>
            <p className="mt-2 text-muted-foreground">Add a new service offering for your clients</p>
          </div>

          <ServiceForm providerId={user.id} />
        </div>
      </main>
    </div>
  )
}
