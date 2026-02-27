"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ArrowLeft, User, Mail, Calendar, Shield, Database, Trash2, Edit2, Check, X } from "lucide-react"
import { Input } from "@/components/ui/input"

export default function ProfilePage() {
  const { user, isLoading, logout } = useAuth()
  const router = useRouter()
  const [allUsers, setAllUsers] = useState<any[]>([])
  const [isEditing, setIsEditing] = useState(false)
  const [editName, setEditName] = useState("")
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login?redirect=/profile")
    }
  }, [user, isLoading, router])

  useEffect(() => {
    // Load all registered users from localStorage
    if (typeof window !== "undefined") {
      const usersDb = localStorage.getItem("confidentme_users_db")
      if (usersDb) {
        const users = JSON.parse(usersDb)
        // Remove password hashes for display
        const safeUsers = users.map((u: any) => ({
          email: u.email,
          name: u.name,
          createdAt: u.createdAt,
        }))
        setAllUsers(safeUsers)
      }
    }
  }, [])

  useEffect(() => {
    if (user) {
      setEditName(user.name)
    }
  }, [user])

  const handleUpdateName = () => {
    if (!editName.trim() || !user) return

    // Update in users database
    const usersDb = localStorage.getItem("confidentme_users_db")
    if (usersDb) {
      const users = JSON.parse(usersDb)
      const updatedUsers = users.map((u: any) => (u.email === user.email ? { ...u, name: editName.trim() } : u))
      localStorage.setItem("confidentme_users_db", JSON.stringify(updatedUsers))
    }

    // Update current session
    const updatedUser = { ...user, name: editName.trim() }
    localStorage.setItem("confidentme_user", JSON.stringify(updatedUser))

    // Reload page to reflect changes
    window.location.reload()
  }

  const handleDeleteAccount = () => {
    if (!user) return

    // Remove from users database
    const usersDb = localStorage.getItem("confidentme_users_db")
    if (usersDb) {
      const users = JSON.parse(usersDb)
      const updatedUsers = users.filter((u: any) => u.email !== user.email)
      localStorage.setItem("confidentme_users_db", JSON.stringify(updatedUsers))
    }

    // Remove user's session history
    localStorage.removeItem(`confidentme_sessions_${user.email}`)

    // Logout and redirect
    logout()
    router.push("/")
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-soft-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!user) return null

  const createdDate = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Unknown"

  return (
    <div className="min-h-screen bg-soft-white">
      <Header />

      <main className="pt-24 pb-16 px-4">
        <div className="max-w-4xl mx-auto">
          <Button variant="ghost" onClick={() => router.back()} className="mb-6 text-foreground/70 hover:text-primary">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>

          <h1 className="text-3xl font-bold text-navy mb-2">Your Profile</h1>
          <p className="text-foreground/60 mb-8">View and manage your account information</p>

          <div className="grid gap-6 md:grid-cols-2">
            {/* User Information Card */}
            <Card className="border-border/50 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5 text-primary" />
                  Account Information
                </CardTitle>
                <CardDescription>Your personal details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-center mb-6">
                  <div className="w-24 h-24 bg-gradient-to-br from-primary to-purple rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <User className="w-4 h-4 text-primary" />
                      <div>
                        <p className="text-xs text-foreground/60">Full Name</p>
                        {isEditing ? (
                          <Input value={editName} onChange={(e) => setEditName(e.target.value)} className="h-8 mt-1" />
                        ) : (
                          <p className="font-medium">{user.name}</p>
                        )}
                      </div>
                    </div>
                    {isEditing ? (
                      <div className="flex gap-1">
                        <Button size="sm" variant="ghost" onClick={handleUpdateName}>
                          <Check className="w-4 h-4 text-green-500" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            setIsEditing(false)
                            setEditName(user.name)
                          }}
                        >
                          <X className="w-4 h-4 text-red-500" />
                        </Button>
                      </div>
                    ) : (
                      <Button size="sm" variant="ghost" onClick={() => setIsEditing(true)}>
                        <Edit2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                    <Mail className="w-4 h-4 text-primary" />
                    <div>
                      <p className="text-xs text-foreground/60">Email Address</p>
                      <p className="font-medium">{user.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                    <Calendar className="w-4 h-4 text-primary" />
                    <div>
                      <p className="text-xs text-foreground/60">Member Since</p>
                      <p className="font-medium">{createdDate}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Storage Info Card */}
            <Card className="border-border/50 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="w-5 h-5 text-primary" />
                  Data Storage
                </CardTitle>
                <CardDescription>How your data is stored</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                  <div className="flex items-start gap-3">
                    <Shield className="w-5 h-5 text-blue-500 mt-0.5" />
                    <div>
                      <p className="font-medium text-blue-900">Local Storage</p>
                      <p className="text-sm text-blue-700 mt-1">
                        Your data is stored locally in your browser. It persists across sessions but is only accessible
                        on this device.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium">Storage Keys:</p>
                  <div className="space-y-2 text-sm">
                    <div className="p-2 bg-muted/50 rounded font-mono text-xs">
                      confidentme_user <span className="text-foreground/50">(current session)</span>
                    </div>
                    <div className="p-2 bg-muted/50 rounded font-mono text-xs">
                      confidentme_users_db <span className="text-foreground/50">(all users)</span>
                    </div>
                    <div className="p-2 bg-muted/50 rounded font-mono text-xs">
                      confidentme_sessions_{"{email}"} <span className="text-foreground/50">(your history)</span>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-foreground/50">
                  To view raw data: Open DevTools (F12) → Application → Local Storage
                </p>
              </CardContent>
            </Card>

            {/* Registered Users Card (for demo) */}
            <Card className="border-border/50 shadow-lg md:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5 text-primary" />
                  Registered Users
                </CardTitle>
                <CardDescription>All accounts on this device (demo view)</CardDescription>
              </CardHeader>
              <CardContent>
                {allUsers.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="text-left py-3 px-4 font-medium">Name</th>
                          <th className="text-left py-3 px-4 font-medium">Email</th>
                          <th className="text-left py-3 px-4 font-medium">Registered</th>
                          <th className="text-left py-3 px-4 font-medium">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {allUsers.map((u, index) => (
                          <tr key={index} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                            <td className="py-3 px-4">{u.name}</td>
                            <td className="py-3 px-4 font-mono text-xs">{u.email}</td>
                            <td className="py-3 px-4 text-foreground/60">
                              {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "N/A"}
                            </td>
                            <td className="py-3 px-4">
                              {u.email === user.email ? (
                                <span className="inline-flex items-center px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                                  Current User
                                </span>
                              ) : (
                                <span className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                                  Registered
                                </span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-foreground/60 text-center py-4">No users registered yet.</p>
                )}
              </CardContent>
            </Card>

            {/* Danger Zone */}
            <Card className="border-red-200 shadow-lg md:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-600">
                  <Trash2 className="w-5 h-5" />
                  Danger Zone
                </CardTitle>
                <CardDescription>Irreversible actions</CardDescription>
              </CardHeader>
              <CardContent>
                {showDeleteConfirm ? (
                  <div className="p-4 bg-red-50 rounded-lg border border-red-100">
                    <p className="text-red-800 mb-4">
                      Are you sure you want to delete your account? This will remove all your data including interview
                      history. This action cannot be undone.
                    </p>
                    <div className="flex gap-3">
                      <Button variant="destructive" onClick={handleDeleteAccount}>
                        Yes, Delete My Account
                      </Button>
                      <Button variant="outline" onClick={() => setShowDeleteConfirm(false)}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Button
                    variant="outline"
                    className="text-red-600 border-red-200 hover:bg-red-50 bg-transparent"
                    onClick={() => setShowDeleteConfirm(true)}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete Account
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
