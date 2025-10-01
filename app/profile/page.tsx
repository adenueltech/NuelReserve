"use client"

import type React from "react"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import type { Profile } from "@/lib/types/database"

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const fetchProfile = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        router.push("/auth/login")
        return
      }

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single()

      if (error) {
        setError("Failed to load profile")
      } else {
        setProfile(data)
      }
      setLoading(false)
    }

    fetchProfile()
  }, [router])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!profile) return

    setSaving(true)
    setError(null)
    setSuccess(false)

    const supabase = createClient()
    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: profile.full_name,
        phone: profile.phone,
        bio: profile.bio,
        website: profile.website,
        instagram: profile.instagram,
        twitter: profile.twitter,
        linkedin: profile.linkedin,
      })
      .eq("id", profile.id)

    if (error) {
      setError("Failed to save profile")
    } else {
      setSuccess(true)
    }
    setSaving(false)
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !profile) return

    const supabase = createClient()
    const fileExt = file.name.split('.').pop()
    const fileName = `${profile.id}_${Date.now()}.${fileExt}`
    const filePath = `portfolio/${fileName}`

    const { error: uploadError } = await supabase.storage
      .from('portfolio-images')
      .upload(filePath, file)

    if (uploadError) {
      setError("Failed to upload image")
      return
    }

    const { data: { publicUrl } } = supabase.storage
      .from('portfolio-images')
      .getPublicUrl(filePath)

    const updatedImages = [...(profile.portfolio_images || []), publicUrl]

    const { error: updateError } = await supabase
      .from("profiles")
      .update({ portfolio_images: updatedImages })
      .eq("id", profile.id)

    if (updateError) {
      setError("Failed to save image")
    } else {
      setProfile({ ...profile, portfolio_images: updatedImages })
      setSuccess(true)
    }
  }

  const removeImage = async (index: number) => {
    if (!profile) return

    const updatedImages = profile.portfolio_images?.filter((_, i) => i !== index) || []

    const supabase = createClient()
    const { error } = await supabase
      .from("profiles")
      .update({ portfolio_images: updatedImages })
      .eq("id", profile.id)

    if (error) {
      setError("Failed to remove image")
    } else {
      setProfile({ ...profile, portfolio_images: updatedImages })
      setSuccess(true)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">Loading profile...</div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">Profile not found</div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href={profile.user_role === "provider" ? "/provider/dashboard" : "/services"}>
            <h1 className="text-2xl font-bold">NuelReserve</h1>
          </Link>
          <div className="flex items-center gap-4">
            <Button asChild variant="ghost">
              <Link href={profile.user_role === "provider" ? "/provider/dashboard" : "/services"}>
                Back to Dashboard
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <div className="container mx-auto px-6 py-8">
          <div className="mb-8">
            <h2 className="text-3xl font-bold tracking-tight">My Profile</h2>
            <p className="mt-2 text-muted-foreground">Manage your account information and portfolio</p>
          </div>

          <form onSubmit={handleSave}>
            <div className="grid gap-8 lg:grid-cols-3">
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Basic Information</CardTitle>
                    <CardDescription>Update your personal details</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="full_name">Full Name</Label>
                        <Input
                          id="full_name"
                          value={profile.full_name || ""}
                          onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone</Label>
                        <Input
                          id="phone"
                          value={profile.phone || ""}
                          onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" value={profile.email} disabled />
                      <p className="text-sm text-muted-foreground">Email cannot be changed</p>
                    </div>
                  </CardContent>
                </Card>

                {profile.user_role === "provider" && (
                  <>
                    <Card>
                      <CardHeader>
                        <CardTitle>About Me</CardTitle>
                        <CardDescription>Tell clients about yourself and your services</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="bio">Bio</Label>
                          <Textarea
                            id="bio"
                            placeholder="Tell clients about your experience, specialties, and what makes you unique..."
                            value={profile.bio || ""}
                            onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                            rows={4}
                          />
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Social Links</CardTitle>
                        <CardDescription>Connect your social media and professional profiles</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="website">Website</Label>
                          <Input
                            id="website"
                            placeholder="https://yourwebsite.com"
                            value={profile.website || ""}
                            onChange={(e) => setProfile({ ...profile, website: e.target.value })}
                          />
                        </div>
                        <div className="grid gap-4 sm:grid-cols-2">
                          <div className="space-y-2">
                            <Label htmlFor="instagram">Instagram</Label>
                            <Input
                              id="instagram"
                              placeholder="@yourusername"
                              value={profile.instagram || ""}
                              onChange={(e) => setProfile({ ...profile, instagram: e.target.value })}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="twitter">Twitter</Label>
                            <Input
                              id="twitter"
                              placeholder="@yourusername"
                              value={profile.twitter || ""}
                              onChange={(e) => setProfile({ ...profile, twitter: e.target.value })}
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="linkedin">LinkedIn</Label>
                          <Input
                            id="linkedin"
                            placeholder="https://linkedin.com/in/yourprofile"
                            value={profile.linkedin || ""}
                            onChange={(e) => setProfile({ ...profile, linkedin: e.target.value })}
                          />
                        </div>
                      </CardContent>
                    </Card>
                  </>
                )}

                {error && <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">{error}</div>}
                {success && <div className="rounded-md bg-green-50 p-3 text-sm text-green-800">Profile updated successfully!</div>}

                <Button type="submit" disabled={saving}>
                  {saving ? "Saving..." : "Save Changes"}
                </Button>
              </div>

              {profile.user_role === "provider" && (
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Portfolio Images</CardTitle>
                      <CardDescription>Showcase your work with photos</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="image-upload">Upload Image</Label>
                        <Input
                          id="image-upload"
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                        />
                      </div>

                      {profile.portfolio_images && profile.portfolio_images.length > 0 && (
                        <div className="grid gap-4 sm:grid-cols-2">
                          {profile.portfolio_images.map((image, index) => (
                            <div key={index} className="relative group">
                              <img
                                src={image}
                                alt={`Portfolio ${index + 1}`}
                                className="w-full h-32 object-cover rounded-md"
                              />
                              <Button
                                type="button"
                                variant="destructive"
                                size="sm"
                                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={() => removeImage(index)}
                              >
                                Remove
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}