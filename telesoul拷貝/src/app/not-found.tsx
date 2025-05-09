'use client'

import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

export default function NotFound() {
  const router = useRouter()

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
        404 - 页面未找到
      </h2>
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        抱歉，您访问的页面不存在。
      </p>
      <Button
        onClick={() => router.push('/')}
        variant="outline"
      >
        返回首页
      </Button>
    </div>
  )
} 