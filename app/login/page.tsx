"use client"

import type React from "react"
import { useState, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Logo } from "@/components/logo"
import { useAuth } from "@/lib/auth-context"
import { Eye, EyeOff, Loader2, ArrowRight, ArrowLeft, Mail, CheckCircle2 } from "lucide-react"

function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [needsConfirmation, setNeedsConfirmation] = useState(false)
  const [isResending, setIsResending] = useState(false)
  const [resendSuccess, setResendSuccess] = useState(false)
  const { login } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get("redirect") || "/history"

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setNeedsConfirmation(false)
    setIsLoading(true)

    const result = await login(email, password)

    if (result.success) {
      router.push(redirectTo)
    } else {
      if (result.needsConfirmation) {
        setNeedsConfirmation(true)
      }
      setError(result.error || "Invalid email or password.")
    }
    setIsLoading(false)
  }

  const handleResendConfirmation = async () => {
    setIsResending(true)
    setResendSuccess(false)

    // Use Supabase to resend confirmation email
    const { createClient } = await import("@/lib/supabase/client")
    const supabase = createClient()

    const { error } = await supabase.auth.resend({
      type: "signup",
      email: email,
      options: {
        emailRedirectTo: process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || `${window.location.origin}/history`,
      },
    })

    if (!error) {
      setResendSuccess(true)
    }
    setIsResending(false)
  }

  // Show confirmation needed UI
  if (needsConfirmation) {
    return (
      <Card className="w-full max-w-md relative z-10 bg-card/95 backdrop-blur-sm border-border/50 shadow-2xl">
        <CardHeader className="text-center pb-2">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-amber-500/20 rounded-full flex items-center justify-center">
              <Mail className="w-8 h-8 text-amber-500" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-foreground">Check Your Email</CardTitle>
          <CardDescription className="text-muted-foreground">
            We sent a confirmation link to <span className="font-medium text-foreground">{email}</span>
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-sm">
            <p className="mb-2 font-medium">Email confirmation required</p>
            <p>Please click the link in your email to verify your account before signing in.</p>
          </div>

          {resendSuccess && (
            <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20 text-green-600 dark:text-green-400 text-sm flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              Confirmation email resent successfully!
            </div>
          )}

          <Button
            onClick={handleResendConfirmation}
            disabled={isResending}
            variant="outline"
            className="w-full bg-transparent"
          >
            {isResending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Mail className="w-4 h-4 mr-2" />
                Resend Confirmation Email
              </>
            )}
          </Button>

          <Button
            onClick={() => {
              setNeedsConfirmation(false)
              setError("")
            }}
            variant="ghost"
            className="w-full"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Login
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-md relative z-10 bg-card/95 backdrop-blur-sm border-border/50 shadow-2xl">
      <CardHeader className="text-center pb-2">
        <div className="flex justify-center mb-4">
          <Logo />
        </div>
        <CardTitle className="text-2xl font-bold text-foreground">Welcome Back</CardTitle>
        <CardDescription className="text-muted-foreground">Sign in to continue your interview practice</CardDescription>
      </CardHeader>

      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {error && !needsConfirmation && (
            <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email" className="text-foreground">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-background border-border focus:border-primary focus:ring-primary"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-foreground">
              Password
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-background border-border focus:border-primary focus:ring-primary pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="rounded border-border text-primary focus:ring-primary" />
              <span className="text-muted-foreground">Remember me</span>
            </label>
            <a href="#" className="text-primary hover:text-primary/80 transition-colors">
              Forgot password?
            </a>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col gap-4">
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Signing in...
              </>
            ) : (
              <>
                Sign In
                <ArrowRight className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link href="/signup" className="text-primary hover:text-primary/80 font-medium transition-colors">
              Sign up for free
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  )
}

export default function LoginPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary via-secondary to-secondary/95 flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
      </div>

      <Button
        variant="ghost"
        onClick={() => router.push("/")}
        className="absolute top-4 left-4 text-white/80 hover:text-white hover:bg-white/10 z-20"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Home
      </Button>

      <Suspense fallback={<div className="w-full max-w-md h-96 animate-pulse bg-card/50 rounded-lg" />}>
        <LoginForm />
      </Suspense>
    </div>
  )
}
