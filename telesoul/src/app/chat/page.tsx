'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ChevronLeft } from 'lucide-react'
import { getMockUser } from '@/data/mockUsers'
import { ChatOverlay } from '@/components/ui/chat-overlay'

interface ChatMessage {
  id: string
  content: string
  sender: 'user' | 'other'
  timestamp: string
  type: 'text' | 'image' | 'audio' | 'video' | 'gift'
  gift?: { emoji: string; value: number }
}

// 模拟聊天记录
const mockChats: Record<string, ChatMessage[]> = {
  '1': [
    {
      id: 'user1_msg1',
      content: '定時了上午月亮雲朵，那裡的風景真的太美了！',
      sender: 'other',
      timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
      type: 'text'
    },
    {
      id: 'user1_msg2',
      content: '/photos/user1/photo1.jpg',
      sender: 'other',
      timestamp: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
      type: 'image'
    },
    {
      id: 'user1_msg3',
      content: '真漂亮！',
      sender: 'user',
      timestamp: new Date(Date.now() - 1000 * 60 * 24).toISOString(),
      type: 'text'
    },
    {
      id: 'user1_msg4',
      content: '送給你一朵玫瑰 🌹',
      sender: 'user',
      timestamp: new Date(Date.now() - 1000 * 60 * 20).toISOString(),
      type: 'gift',
      gift: { emoji: '🌹', value: 50 }
    },
    {
      id: 'user1_msg5',
      content: '/audio/user1/voice1.mp3',
      sender: 'other',
      timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
      type: 'audio'
    }
  ],
  '2': [
    {
      id: 'user2_msg1',
      content: '嗨！我剛剛在練習唱歌',
      sender: 'other',
      timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
      type: 'text'
    },
    {
      id: 'user2_msg2',
      content: '/audio/user2/song1.mp3',
      sender: 'other',
      timestamp: new Date(Date.now() - 1000 * 60 * 44).toISOString(),
      type: 'audio'
    },
    {
      id: 'user2_msg3',
      content: '唱得真好聽！',
      sender: 'user',
      timestamp: new Date(Date.now() - 1000 * 60 * 40).toISOString(),
      type: 'text'
    },
    {
      id: 'user2_msg4',
      content: '謝謝誇獎 ☺️',
      sender: 'other',
      timestamp: new Date(Date.now() - 1000 * 60 * 35).toISOString(),
      type: 'text'
    },
    {
      id: 'user2_msg5',
      content: '/video/user2/dance1.mp4',
      sender: 'other',
      timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
      type: 'video'
    },
    {
      id: 'user2_msg6',
      content: '這是我最近學的舞蹈',
      sender: 'other',
      timestamp: new Date(Date.now() - 1000 * 60 * 29).toISOString(),
      type: 'text'
    }
  ]
}

export default function ChatPage() {
  const router = useRouter()
  const [coins, setCoins] = useState(100)
  const [selectedUser, setSelectedUser] = useState<string | null>(null)

  const handleBack = () => {
    router.back()
  }

  const handleAvatarClick = (e: React.MouseEvent, userId: string) => {
    e.stopPropagation() // 阻止事件冒泡
    router.push(`/profile/${userId}`)
  }

  const handleGiftSend = (gift: { emoji: string; value: number }) => {
    if (coins >= gift.value) {
      setCoins(prev => prev - gift.value)
      // 添加新的礼物消息
      if (selectedUser) {
        const newMessage: ChatMessage = {
          id: `${selectedUser}_msg_${Date.now()}`,
          content: `送給你一個禮物 ${gift.emoji}`,
          sender: 'user',
          timestamp: new Date().toISOString(),
          type: 'gift',
          gift
        }
        mockChats[selectedUser] = [...(mockChats[selectedUser] || []), newMessage]
      }
    } else {
      alert('金幣不足，請先充值！')
    }
  }

  const users = ['1', '2'].map(id => getMockUser(id))

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* 头部 */}
      <div className="flex items-center px-4 py-2 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleBack}
          className="-ml-2"
        >
          <ChevronLeft className="w-6 h-6" />
        </Button>
        <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100 ml-3">
          聊天
        </h1>
      </div>

      {/* 聊天列表 */}
      <div className="flex-1 overflow-y-auto">
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {users.map((user) => user && (
            <div
              key={user.id}
              className="flex items-center space-x-4 p-4 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
              onClick={() => router.push(`/chat/${user.id}`)}
            >
              <div className="relative">
                <img
                  src={user.avatar}
                  alt={user.nickname}
                  className="w-12 h-12 rounded-full cursor-pointer"
                  onClick={(e) => handleAvatarClick(e, user.id)}
                />
                {user.isOnline && (
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></span>
                )}
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {user.nickname}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {mockChats[user.id]?.slice(-1)[0]?.content || ''}
                </p>
              </div>
              <div className="text-xs text-gray-500">
                {mockChats[user.id]?.slice(-1)[0]?.timestamp.split('T')[1].slice(0, 5)}
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedUser && getMockUser(selectedUser) && (
        <ChatOverlay
          onBack={() => setSelectedUser(null)}
          user={getMockUser(selectedUser)!}
          coins={coins}
          onGiftSend={(giftType: string, value: number) => {
            handleGiftSend({ emoji: giftType, value });
          }}
          initialMessages={mockChats[selectedUser]}
        />
      )}
    </div>
  )
} 