import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import type { Service, Profile } from "@/lib/types/database"

interface ServiceWithProvider extends Service {
  provider: Profile | null
}

export function ServiceCard({ service }: { service: ServiceWithProvider }) {
  return (
    <Card className="flex flex-col">
      <CardHeader>
        <div className="flex items-start justify-between">
          <CardTitle className="text-xl">{service.title}</CardTitle>
          <Badge variant="secondary">${service.price}</Badge>
        </div>
        <CardDescription>by {service.provider?.full_name || "Unknown Provider"}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-4">
        <p className="line-clamp-2 text-sm text-muted-foreground">
          {service.description || "No description available."}
        </p>
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline">{service.category}</Badge>
          <Badge variant="outline">{service.duration_minutes} min</Badge>
        </div>
        <Button asChild className="mt-auto">
          <Link href={`/services/${service.id}`}>View Details</Link>
        </Button>
      </CardContent>
    </Card>
  )
}
