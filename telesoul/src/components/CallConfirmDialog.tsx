'use client'

import React from 'react'
import { UserProfile } from '@/data/mockUsers'
import Image from 'next/image'

interface CallConfirmDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  callType: 'voice' | 'video'
  user: UserProfile
  pricePerMinute: number
}

const CallConfirmDialog: React.FC<CallConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  callType,
  user,
  pricePerMinute
}) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl p-6 max-w-sm w-full mx-4 shadow-xl">
        <div className="flex flex-col items-center">
          <Image
            src={user.avatar}
            alt={user.name}
            width={80}
            height={80}
            className="rounded-full mb-4"
          />
          <h3 className="text-xl font-semibold mb-2">
            {callType === 'voice' ? '语音通话' : '视频通话'}
          </h3>
          <p className="text-gray-600 mb-2">{user.name}</p>
          <div className="bg-gray-50 rounded-lg p-4 w-full mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-600">通话费用</span>
              <span className="text-yellow-500 font-semibold">{pricePerMinute} 金币/分钟</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">你的余额</span>
              <span className="text-gray-900 font-semibold">{user.coins} 金币</span>
            </div>
          </div>
          <div className="flex gap-3 w-full">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              取消
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              开始通话
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CallConfirmDialog 