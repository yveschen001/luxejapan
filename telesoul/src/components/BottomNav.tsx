'use client'

import { usePathname, useRouter } from 'next/navigation'
import { Home, User, MessageCircle, Heart } from 'lucide-react'

export default function BottomNav() {
  const router = useRouter()
  const pathname = usePathname()

  const navItems = [
    {
      label: '配对',
      icon: Heart,
      href: '/match'
    },
    {
      label: '广场',
      icon: Home,
      href: '/square'
    },
    {
      label: '消息',
      icon: MessageCircle,
      href: '/chat'
    },
    {
      label: '我的',
      icon: User,
      href: '/profile'
    }
  ]

  return (
    <div className="fixed bottom-0 left-0 right-0 h-16 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
      <div className="grid h-full grid-cols-4 mx-2">
        {navItems.map((item) => (
          <button
            key={item.href}
            className={`flex flex-col items-center justify-center ${
              pathname.startsWith(item.href)
                ? 'text-blue-500'
                : 'text-gray-500 hover:text-gray-900 dark:hover:text-gray-100'
            }`}
            onClick={() => router.push(item.href)}
          >
            <item.icon className="w-6 h-6" />
            <span className="text-xs mt-1">{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
} 