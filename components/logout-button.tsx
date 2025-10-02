"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"

export function LogoutButton({ className }: { className?: string }) {
  const [showConfirm, setShowConfirm] = useState(false)

  const handleLogout = () => {
    const form = document.createElement('form')
    form.method = 'POST'
    form.action = '/auth/logout'
    document.body.appendChild(form)
    form.submit()
  }

  return (
    <>
      <Button
        type="button"
        variant="outline"
        onClick={() => setShowConfirm(true)}
        className={className}
      >
        Logout
      </Button>

      {showConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-card rounded-lg shadow-lg max-w-md w-full">
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-2">Confirm Logout</h3>
              <p className="text-muted-foreground mb-6">
                Are you sure you want to logout? You will need to sign in again to access your account.
              </p>
              <div className="flex gap-3 justify-end">
                <Button variant="outline" onClick={() => setShowConfirm(false)}>
                  Cancel
                </Button>
                <Button onClick={handleLogout}>
                  Logout
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}