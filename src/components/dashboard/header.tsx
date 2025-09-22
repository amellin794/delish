'use client'

import { UserButton } from '@clerk/nextjs'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import Link from 'next/link'

export function Header() {
  return (
    <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
      <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
        <div className="flex flex-1"></div>
        <div className="flex items-center gap-x-4 lg:gap-x-6">
          <Button asChild size="sm">
            <Link href="/dashboard/lists/new">
              <Plus className="h-4 w-4 mr-2" />
              New List
            </Link>
          </Button>
          <UserButton 
            appearance={{
              elements: {
                avatarBox: 'h-8 w-8'
              }
            }}
          />
        </div>
      </div>
    </div>
  )
}

