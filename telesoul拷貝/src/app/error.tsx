'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
        出错了
      </h2>
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        抱歉，页面加载时发生错误。
      </p>
      <Button
        onClick={reset}
        variant="primary"
      >
        重试
      </Button>
    </div>
  )
} 