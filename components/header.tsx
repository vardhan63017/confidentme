"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Logo } from "@/components/logo"
import { useAuth } from "@/lib/auth-context"
import { Menu, X, History, LogOut, User } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { user, logout } = useAuth()

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-soft-white/80 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          <Link href="/">
            <Logo />
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <a href="/#features" className="text-foreground/70 hover:text-primary transition-colors font-medium">
              Features
            </a>
            {user && (
              <Link
                href="/history"
                className="text-foreground/70 hover:text-primary transition-colors font-medium flex items-center gap-1"
              >
                <History className="w-4 h-4" />
                History
              </Link>
            )}
            <a href="/#testimonials" className="text-foreground/70 hover:text-primary transition-colors font-medium">
              Testimonials
            </a>
            <a href="/#pricing" className="text-foreground/70 hover:text-primary transition-colors font-medium">
              Pricing
            </a>
          </nav>

          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2 hover:bg-primary/10">
                    <div className="w-8 h-8 bg-gradient-to-br from-primary to-purple rounded-full flex items-center justify-center text-white text-sm font-bold">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-sm font-medium">{user.name}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="flex items-center cursor-pointer">
                      <User className="w-4 h-4 mr-2" />
                      View Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/history" className="flex items-center cursor-pointer">
                      <History className="w-4 h-4 mr-2" />
                      My History
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout} className="text-red-600 cursor-pointer">
                    <LogOut className="w-4 h-4 mr-2" />
                    Log Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" className="text-foreground hover:text-primary">
                    Log In
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all hover:scale-105">
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>

          <button className="md:hidden p-2" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-soft-white border-t border-border">
          <nav className="flex flex-col p-4 gap-4">
            <a href="/#features" className="text-foreground/70 hover:text-primary transition-colors font-medium py-2">
              Features
            </a>
            {user && (
              <Link
                href="/history"
                className="text-foreground/70 hover:text-primary transition-colors font-medium py-2 flex items-center gap-2"
              >
                <History className="w-4 h-4" />
                History
              </Link>
            )}
            <a
              href="/#testimonials"
              className="text-foreground/70 hover:text-primary transition-colors font-medium py-2"
            >
              Testimonials
            </a>
            <a href="/#pricing" className="text-foreground/70 hover:text-primary transition-colors font-medium py-2">
              Pricing
            </a>
            <div className="flex flex-col gap-2 pt-4 border-t border-border">
              {user ? (
                <>
                  <Link href="/profile" className="flex items-center gap-2 py-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-primary to-purple rounded-full flex items-center justify-center text-white text-sm font-bold">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="font-medium">{user.name}</span>
                  </Link>
                  <Link href="/profile">
                    <Button variant="ghost" className="w-full justify-start">
                      <User className="w-4 h-4 mr-2" />
                      View Profile
                    </Button>
                  </Link>
                  <Button variant="ghost" className="w-full justify-start text-red-600" onClick={logout}>
                    <LogOut className="w-4 h-4 mr-2" />
                    Log Out
                  </Button>
                </>
              ) : (
                <>
                  <Link href="/login">
                    <Button variant="ghost" className="w-full justify-center">
                      Log In
                    </Button>
                  </Link>
                  <Link href="/signup">
                    <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                      Get Started
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
