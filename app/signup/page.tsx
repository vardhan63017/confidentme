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
import { Eye, EyeOff, Loader2, ArrowRight, Check, ArrowLeft, Mail, CheckCircle2 } from "lucide-react"

function SignupForm() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [showConfirmation, setShowConfirmation] = useState(false)
  const { signup } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get("redirect") || "/history"

  const passwordRequirements = [
    { label: "At least 6 characters", met: password.length >= 6 },
    { label: "Contains a number", met: /\d/.test(password) },
    { label: "Passwords match", met: password === confirmPassword && password.length > 0 },
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters")
      return
    }

    setIsLoading(true)
    const result = await signup(name, email, password)

    if (result.success) {
      if (result.needsConfirmation) {
        // Show confirmation message
        setShowConfirmation(true)
      } else {
        // Auto-login successful, redirect
        router.push(redirectTo)
      }
    } else {
      setError(result.error || "Failed to create account. Please try again.")
    }
    setIsLoading(false)
  }

  // Show email confirmation screen
  if (showConfirmation) {
    return (
      <Card className="w-full max-w-md relative z-10 bg-card/95 backdrop-blur-sm border-border/50 shadow-2xl">
        <CardHeader className="text-center pb-2">
          <div className="flex justify-center mb-4">
            <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10 text-green-500" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-foreground">Account Created!</CardTitle>
          <CardDescription className="text-muted-foreground">Please verify your email to continue</CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="p-4 rounded-lg bg-primary/10 border border-primary/20 text-center">
            <Mail className="w-8 h-8 text-primary mx-auto mb-2" />
            <p className="text-sm text-muted-foreground mb-1">We've sent a confirmation link to:</p>
            <p className="font-medium text-foreground">{email}</p>
          </div>

          <div className="space-y-2 text-sm text-muted-foreground">
            <p className="flex items-start gap-2">
              <span className="text-primary mt-0.5">1.</span>
              Check your email inbox (and spam folder)
            </p>
            <p className="flex items-start gap-2">
              <span className="text-primary mt-0.5">2.</span>
              Click the confirmation link in the email
            </p>
            <p className="flex items-start gap-2">
              <span className="text-primary mt-0.5">3.</span>
              Come back here and sign in to start practicing
            </p>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col gap-3">
          <Link href="/login" className="w-full">
            <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
              Go to Login
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
          <Button variant="ghost" onClick={() => setShowConfirmation(false)} className="w-full">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Sign Up
          </Button>
        </CardFooter>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-md relative z-10 bg-card/95 backdrop-blur-sm border-border/50 shadow-2xl">
      <CardHeader className="text-center pb-2">
        <div className="flex justify-center mb-4">
          <Logo />
        </div>
        <CardTitle className="text-2xl font-bold text-foreground">Create Your Account</CardTitle>
        <CardDescription className="text-muted-foreground">
          Start practicing interviews and build your confidence
        </CardDescription>
      </CardHeader>

      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {error && (
            <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="name" className="text-foreground">
              Full Name
            </Label>
            <Input
              id="name"
              type="text"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="bg-background border-border focus:border-primary focus:ring-primary"
            />
          </div>

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
                placeholder="Create a password"
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

          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-foreground">
              Confirm Password
            </Label>
            <Input
              id="confirmPassword"
              type={showPassword ? "text" : "password"}
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="bg-background border-border focus:border-primary focus:ring-primary"
            />
          </div>

          <div className="space-y-2">
            {passwordRequirements.map((req, index) => (
              <div key={index} className="flex items-center gap-2 text-sm">
                <div
                  className={`w-4 h-4 rounded-full flex items-center justify-center ${
                    req.met ? "bg-primary text-primary-foreground" : "bg-muted"
                  }`}
                >
                  {req.met && <Check className="w-3 h-3" />}
                </div>
                <span className={req.met ? "text-foreground" : "text-muted-foreground"}>{req.label}</span>
              </div>
            ))}
          </div>
        </CardContent>

        <CardFooter className="flex flex-col gap-4">
          <Button
            type="submit"
            disabled={isLoading || !passwordRequirements.every((r) => r.met)}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Creating account...
              </>
            ) : (
              <>
                Create Account
                <ArrowRight className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>

          <p className="text-center text-xs text-muted-foreground">
            By signing up, you agree to our{" "}
            <a href="#" className="text-primary hover:underline">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="text-primary hover:underline">
              Privacy Policy
            </a>
          </p>

          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="text-primary hover:text-primary/80 font-medium transition-colors">
              Sign in
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  )
}

export default function SignupPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary via-secondary to-secondary/95 flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      </div>

      <Button
        variant="ghost"
        onClick={() => router.push("/")}
        className="absolute top-4 left-4 text-white/80 hover:text-white hover:bg-white/10 z-20"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Home
      </Button>

      <Suspense fallback={<div className="w-full max-w-md h-[600px] animate-pulse bg-card/50 rounded-lg" />}>
        <SignupForm />
      </Suspense>
    </div>
  )
}
