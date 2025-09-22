'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/helpers'
import { 
  LayoutDashboard, 
  MapPin, 
  DollarSign, 
  Settings, 
  BarChart3,
  Plus
} from 'lucide-react'
import { Button } from '@/components/ui/button'

const navigation = [
  { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Lists', href: '/dashboard/lists', icon: MapPin },
  { name: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
  { name: 'Earnings', href: '/dashboard/earnings', icon: DollarSign },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-64 lg:flex-col">
      <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white px-6 pb-4 shadow-sm">
        <div className="flex h-16 shrink-0 items-center">
          <MapPin className="h-8 w-8 text-blue-600" />
          <span className="ml-2 text-xl font-bold text-gray-900">Delish</span>
        </div>
        <nav className="flex flex-1 flex-col">
          <ul role="list" className="flex flex-1 flex-col gap-y-7">
            <li>
              <ul role="list" className="-mx-2 space-y-1">
                {navigation.map((item) => {
                  const isActive = pathname === item.href
                  return (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className={cn(
                          isActive
                            ? 'bg-blue-50 text-blue-700'
                            : 'text-gray-700 hover:text-blue-700 hover:bg-gray-50',
                          'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold'
                        )}
                      >
                        <item.icon
                          className={cn(
                            isActive ? 'text-blue-700' : 'text-gray-400 group-hover:text-blue-700',
                            'h-6 w-6 shrink-0'
                          )}
                          aria-hidden="true"
                        />
                        {item.name}
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </li>
            <li className="mt-auto">
              <Button asChild className="w-full">
                <Link href="/dashboard/lists/new">
                  <Plus className="h-4 w-4 mr-2" />
                  New List
                </Link>
              </Button>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  )
}

