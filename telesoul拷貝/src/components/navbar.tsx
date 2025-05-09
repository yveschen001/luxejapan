'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, MessageSquare, Users, CheckSquare, User } from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/match', label: '匹配', icon: Home },
  { href: '/chat', label: '聊天', icon: MessageSquare },
  { href: '/square', label: '广场', icon: Users },
  { href: '/tasks', label: '任务', icon: CheckSquare },
  { href: '/profile', label: '我的', icon: User },
]

export function Navbar() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 backdrop-blur-lg bg-opacity-80 dark:bg-opacity-80 z-50">
      <div className="flex justify-around items-center h-16 max-w-md mx-auto px-4">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex flex-col items-center justify-center min-w-[4rem] py-1 relative transition-all duration-200",
                isActive
                  ? "text-blue-600 dark:text-blue-400 after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-6 after:h-0.5 after:bg-blue-600 dark:after:bg-blue-400 after:rounded-full"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
              )}
            >
              <div className={cn(
                "relative transition-transform duration-200",
                isActive ? "scale-110" : "hover:scale-105"
              )}>
                <Icon className="h-6 w-6" />
                {href === '/chat' && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" />
                )}
              </div>
              <span className={cn(
                "mt-1 text-xs font-medium transition-colors duration-200",
                isActive ? "opacity-100" : "opacity-70 group-hover:opacity-100"
              )}>
                {label}
              </span>
            </Link>
          )
        })}
      </div>
      <div className="h-[env(safe-area-inset-bottom)] bg-white dark:bg-gray-900 bg-opacity-80 dark:bg-opacity-80 backdrop-blur-lg" />
    </nav>
  )
} 