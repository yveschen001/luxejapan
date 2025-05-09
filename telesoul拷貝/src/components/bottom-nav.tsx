'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Dice1, Layout, MessageCircle, User, Gift } from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/match', icon: Dice1, label: '配對' },
  { href: '/square', icon: Layout, label: '廣場' },
  { href: '/chat', icon: MessageCircle, label: '聊天' },
  { href: '/tasks', icon: Gift, label: '任務' },
  { href: '/profile', icon: User, label: '我的' },
]

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex h-16 items-center justify-around border-t bg-background">
      {navItems.map(({ href, icon: Icon, label }) => {
        const isActive = pathname === href || (href === '/chat' && pathname?.startsWith('/chat/'))
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              'flex flex-col items-center gap-1',
              isActive ? 'text-primary' : 'text-muted-foreground'
            )}
          >
            <Icon className="h-6 w-6" />
            <span className="text-xs">{label}</span>
          </Link>
        )
      })}
    </nav>
  )
} 