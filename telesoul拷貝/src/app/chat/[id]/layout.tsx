'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ChevronLeft } from 'lucide-react'

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()

  return (
    <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-900">
      {/* 头部导航 */}
      <div className="flex items-center justify-between px-4 py-2 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.push('/chat')}
          className="-ml-2"
        >
          <ChevronLeft className="w-6 h-6" />
        </Button>
      </div>
      
      {/* 主要内容 */}
      <div className="flex-1 overflow-hidden">
        {children}
      </div>
    </div>
  )
} 