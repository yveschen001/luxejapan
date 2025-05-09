'use client'

import { Phone, Video, X, Maximize2 } from 'lucide-react'
import { useCallState } from '@/hooks/useCallState'
import { formatDuration } from '@/lib/utils'

export function MiniCallWindow() {
  const { status, callType, duration, isMinimized } = useCallState()
  const { toggleMinimize, endCall } = useCallState((state) => state.actions)

  if (!isMinimized || status !== 'in_call') return null

  return (
    <div className="fixed bottom-4 right-4 bg-white shadow-lg rounded-lg p-3 flex items-center gap-3">
      {callType === 'voice' ? (
        <Phone className="w-5 h-5 text-blue-500" />
      ) : (
        <Video className="w-5 h-5 text-blue-500" />
      )}
      <span className="text-sm font-medium">
        通话中 {formatDuration(duration)}
      </span>
      <button
        onClick={toggleMinimize}
        className="p-1 hover:bg-gray-100 rounded-full"
      >
        <Maximize2 className="w-4 h-4 text-gray-500" />
      </button>
      <button
        onClick={endCall}
        className="p-1 hover:bg-gray-100 rounded-full"
      >
        <X className="w-4 h-4 text-red-500" />
      </button>
    </div>
  )
} 