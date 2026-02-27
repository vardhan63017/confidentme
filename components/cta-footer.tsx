"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Twitter, Linkedin, Github, Mail } from "lucide-react"

export function CTAFooter() {
  return (
    <footer className="bg-secondary">
      {/* CTA Section */}
      <div className="py-16 lg:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-secondary-foreground mb-6 text-balance">
            Ready to face your next interview with <span className="text-primary">confidence?</span>
          </h2>
          <p className="text-lg text-secondary-foreground/70 mb-10 max-w-2xl mx-auto">
            Join thousands of job seekers who have improved their interview skills and landed their dream jobs with
            ConfidentMe.
          </p>
          <Link href="/signup">
            <Button
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all hover:scale-105 text-lg px-10 py-7 animate-pulse-glow"
            >
              Start Practicing for Free
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
          <p className="text-sm text-secondary-foreground/50 mt-6">
            No credit card required • Free forever plan available
          </p>
        </div>
      </div>

      {/* Footer links */}
      <div className="border-t border-secondary-foreground/10 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 lg:gap-12">
            <div className="md:col-span-1">
              <div className="mb-4">
                <div className="flex items-center gap-2">
                  <div className="relative w-8 h-8">
                    <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                      <circle cx="14" cy="12" r="5" fill="#F9FBFF" />
                      <path
                        d="M6 28C6 22.4772 10.4772 18 16 18H12C17.5228 18 22 22.4772 22 28V32H6V28Z"
                        fill="#F9FBFF"
                      />
                      <rect x="22" y="8" width="14" height="12" rx="2" fill="#1ABC9C" />
                      <circle cx="26" cy="14" r="2" fill="#0B1633" />
                      <circle cx="32" cy="14" r="2" fill="#0B1633" />
                      <rect x="25" y="22" width="8" height="8" rx="1" fill="#1ABC9C" />
                      <circle cx="32" cy="32" r="7" fill="#7D5CFF" />
                      <path
                        d="M29 32L31 34L35 30"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <span className="text-lg font-bold text-secondary-foreground">
                    Confident<span className="text-primary">Me</span>
                  </span>
                </div>
              </div>
              <p className="text-secondary-foreground/60 text-sm mb-4">
                AI-powered interview practice platform helping you build confidence and land your dream job.
              </p>
              <div className="flex gap-4">
                <a href="#" className="text-secondary-foreground/50 hover:text-primary transition-colors">
                  <Twitter className="w-5 h-5" />
                </a>
                <a href="#" className="text-secondary-foreground/50 hover:text-primary transition-colors">
                  <Linkedin className="w-5 h-5" />
                </a>
                <a href="#" className="text-secondary-foreground/50 hover:text-primary transition-colors">
                  <Github className="w-5 h-5" />
                </a>
                <a href="#" className="text-secondary-foreground/50 hover:text-primary transition-colors">
                  <Mail className="w-5 h-5" />
                </a>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-secondary-foreground mb-4">Product</h4>
              <ul className="space-y-3">
                <li>
                  <a
                    href="/#features"
                    className="text-secondary-foreground/60 hover:text-primary transition-colors text-sm"
                  >
                    Features
                  </a>
                </li>
                <li>
                  <a
                    href="/#pricing"
                    className="text-secondary-foreground/60 hover:text-primary transition-colors text-sm"
                  >
                    Pricing
                  </a>
                </li>
                <li>
                  <Link
                    href="/history"
                    className="text-secondary-foreground/60 hover:text-primary transition-colors text-sm"
                  >
                    History
                  </Link>
                </li>
                <li>
                  <Link
                    href="/interview"
                    className="text-secondary-foreground/60 hover:text-primary transition-colors text-sm"
                  >
                    Start Interview
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-secondary-foreground mb-4">Resources</h4>
              <ul className="space-y-3">
                <li>
                  <a href="#" className="text-secondary-foreground/60 hover:text-primary transition-colors text-sm">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="text-secondary-foreground/60 hover:text-primary transition-colors text-sm">
                    Interview Tips
                  </a>
                </li>
                <li>
                  <a href="#" className="text-secondary-foreground/60 hover:text-primary transition-colors text-sm">
                    Career Guides
                  </a>
                </li>
                <li>
                  <a href="#" className="text-secondary-foreground/60 hover:text-primary transition-colors text-sm">
                    Help Center
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-secondary-foreground mb-4">Account</h4>
              <ul className="space-y-3">
                <li>
                  <Link
                    href="/login"
                    className="text-secondary-foreground/60 hover:text-primary transition-colors text-sm"
                  >
                    Log In
                  </Link>
                </li>
                <li>
                  <Link
                    href="/signup"
                    className="text-secondary-foreground/60 hover:text-primary transition-colors text-sm"
                  >
                    Sign Up
                  </Link>
                </li>
                <li>
                  <a href="#" className="text-secondary-foreground/60 hover:text-primary transition-colors text-sm">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="text-secondary-foreground/60 hover:text-primary transition-colors text-sm">
                    Terms of Service
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-secondary-foreground/10 mt-12 pt-8 text-center">
            <p className="text-secondary-foreground/50 text-sm">© 2025 ConfidentMe. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
