'use client'

import { usePathname } from 'next/navigation'
import { BottomNav } from '../bottom-nav'

export function ClientNav() {
  const pathname = usePathname()
  const isChatPage = pathname?.startsWith('/chat/')
  
  if (isChatPage) {
    return null
  }
  
  return <BottomNav />
} 