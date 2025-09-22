"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs'
import { Button } from '@/components/ui/button'
import { MapPin } from 'lucide-react'

export function SiteHeader() {
  const pathname = usePathname()

  if (pathname === '/') {
    return null
  }

  return (
    <header className="border-b bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/70">
      <div className="container mx-auto flex items-center justify-between px-4 py-4">
        <Link href="/" className="flex items-center gap-2 text-lg font-semibold text-gray-900">
          <MapPin className="h-5 w-5 text-blue-600" />
          <span>Delish</span>
        </Link>
        <div className="flex items-center gap-3">
          <SignedOut>
            <SignInButton mode="modal">
              <Button variant="ghost" size="sm">
                Sign in
              </Button>
            </SignInButton>
            <SignUpButton mode="modal">
              <Button size="sm">Create account</Button>
            </SignUpButton>
          </SignedOut>
          <SignedIn>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
        </div>
      </div>
    </header>
  )
}

