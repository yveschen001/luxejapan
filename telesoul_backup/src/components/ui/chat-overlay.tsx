import { useState, useRef, useEffect } from 'react'
import { Button } from './button'
import { Input } from './input'
import { ChevronLeft, Send, Image, Smile, Paperclip, Gift, Coins, Play, Pause, Phone, PhoneOff } from 'lucide-react'
import type { UserProfile } from '@/data/mockUsers'
import { GiftOverlay } from './gift-overlay'
import { useRouter } from 'next/navigation'
import { VoiceCall } from './voice-call'

interface Message {
  id: string
  content: string
  sender: string
  timestamp: string
  type: 'text' | 'image' | 'audio' | 'video' | 'gift'
  gift?: {
    emoji: string
    value: number
  }
}

interface ChatOverlayProps {
  user: UserProfile
  onBack: () => void
  coins: number
  onGiftSend: (giftType: string, value: number) => void
  initialMessages?: Message[]
  voiceCallComponent?: React.ReactNode
}

export function ChatOverlay({ 
  user, 
  onBack, 
  coins, 
  onGiftSend, 
  initialMessages = [],
  voiceCallComponent
}: ChatOverlayProps) {
  const router = useRouter()
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [newMessage, setNewMessage] = useState('')
  const [showGiftOverlay, setShowGiftOverlay] = useState(false)
  const [playingAudio, setPlayingAudio] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const audioRefs = useRef<{ [key: string]: HTMLAudioElement }>({})
  const isFirstRender = useRef(true)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  // 只在初始渲染和新消息添加时滚动到底部
  useEffect(() => {
    if (isFirstRender.current) {
      scrollToBottom()
      isFirstRender.current = false
    } else if (messages.length > 0) {
      const lastMessage = messages[messages.length - 1]
      if (lastMessage && Date.now() - new Date(lastMessage.timestamp).getTime() < 1000) {
        scrollToBottom()
      }
    }
  }, [messages])

  // 只在初始渲染和initialMessages变化时更新消息列表
  useEffect(() => {
    if (JSON.stringify(messages) !== JSON.stringify(initialMessages)) {
      setMessages(initialMessages)
    }
  }, [initialMessages])

  if (!user) return null

  const handleSend = () => {
    if (!newMessage.trim()) return
    
    if (coins < 10) {
      alert('您的金幣不足，無法發送訊息。請先充值！')
      return
    }

    const message: Message = {
      id: `msg_${Date.now()}`,
      content: newMessage,
      sender: user.id,
      timestamp: new Date().toISOString(),
      type: 'text'
    }

    setMessages(prev => [...prev, message])
    setNewMessage('')

    // 模擬回覆
    setTimeout(() => {
      const replies = [
        '好的，我明白了',
        '謝謝你的訊息！',
        '這個想法很不錯呢',
        '我也是這麼想的',
        '讓我想想...'
      ]
      const randomReply = replies[Math.floor(Math.random() * replies.length)]
      
      const reply: Message = {
        id: `msg_${Date.now() + 1}`,
        content: randomReply,
        sender: user.id,
        timestamp: new Date().toISOString(),
        type: 'text'
      }
      setMessages(prev => [...prev, reply])
    }, 1000)
  }

  const handleGiftClick = () => {
    if (coins < 10) {
      alert('金幣不足，請先充值！')
      return
    }
    setShowGiftOverlay(true)
  }

  const handleGiftSelect = (giftType: string, value: number) => {
    if (coins < value) {
      alert('金幣不足，請先充值！')
      return
    }
    
    const message: Message = {
      id: `msg_${Date.now()}`,
      content: giftType,
      sender: user.id,
      timestamp: new Date().toISOString(),
      type: 'gift',
      gift: {
        emoji: giftType,
        value: value
      }
    }
    
    setMessages(prev => [...prev, message])
    onGiftSend(giftType, value)
    setShowGiftOverlay(false)
  }

  const handleAudioPlay = (messageId: string, audioUrl: string) => {
    if (!audioRefs.current[messageId]) {
      audioRefs.current[messageId] = new Audio(audioUrl)
    }

    if (playingAudio === messageId) {
      audioRefs.current[messageId].pause()
      setPlayingAudio(null)
    } else {
      if (playingAudio) {
        audioRefs.current[playingAudio].pause()
      }
      audioRefs.current[messageId].play()
      setPlayingAudio(messageId)
    }
  }

  const handleAvatarClick = (userId: string) => {
    router.push(`/profile/${userId}`)
  }

  const renderMessage = (message: Message) => {
    const isBlurred = coins < 10 && message.sender === user.id

    switch (message.type) {
      case 'image':
        return (
          <img
            src={message.content}
            alt="Shared image"
            className={`max-w-[200px] rounded-lg ${isBlurred ? 'blur-sm' : ''}`}
          />
        )
      case 'audio':
        return (
          <div className={`flex items-center space-x-2 min-w-[120px] ${isBlurred ? 'blur-sm' : ''}`}>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleAudioPlay(message.id, message.content)}
              className="text-gray-500"
              disabled={isBlurred}
            >
              {playingAudio === message.id ? (
                <Pause className="w-6 h-6" />
              ) : (
                <Play className="w-6 h-6" />
              )}
            </Button>
            <div className="h-8 flex-1 bg-gray-200 dark:bg-gray-700 rounded-full" />
          </div>
        )
      case 'video':
        return (
          <video
            src={message.content}
            controls
            className={`max-w-[300px] rounded-lg ${isBlurred ? 'blur-sm' : ''}`}
          />
        )
      case 'gift':
        return (
          <div className="flex items-center space-x-2">
            <span className="text-3xl">{message.gift?.emoji}</span>
            <span>禮物</span>
          </div>
        )
      default:
        return <p className={`text-sm ${isBlurred ? 'blur-sm' : ''}`}>{message.content}</p>
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50">
      <div className="fixed inset-0 z-50">
        <div className="h-full flex flex-col bg-white dark:bg-gray-900">
          {/* 頭部 */}
          <div className="flex items-center justify-between px-4 py-2 bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={onBack}
                className="-ml-2"
              >
                <ChevronLeft className="w-6 h-6" />
              </Button>
              <img
                src={user.avatar}
                alt={user.nickname}
                className="w-8 h-8 rounded-full cursor-pointer"
                onClick={() => handleAvatarClick(user.id)}
              />
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {user.nickname}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {user.isOnline ? '在線' : '離線'}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {voiceCallComponent}
              <div className="flex items-center text-yellow-500">
                <Coins className="w-5 h-5 mr-1" />
                <span className="font-medium">{coins}</span>
              </div>
            </div>
          </div>

          {/* 聊天內容 */}
          <div className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900 p-4 space-y-4">
            {messages.map(message => (
              <div
                key={message.id}
                className={`flex ${message.sender === user.id ? 'justify-start' : 'justify-end'} items-start space-x-2`}
              >
                {message.sender === user.id && (
                  <img
                    src={user.avatar}
                    alt={user.nickname}
                    className="w-8 h-8 rounded-full flex-shrink-0"
                  />
                )}
                <div
                  className={`max-w-[70%] rounded-2xl p-3 ${
                    message.sender === user.id
                      ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100'
                      : 'bg-blue-500 text-white'
                  }`}
                >
                  {renderMessage(message)}
                  <p className="text-xs mt-1 opacity-70">
                    {message.timestamp}
                  </p>
                </div>
                {message.sender !== user.id && (
                  <img
                    src="/avatars/default.png"
                    alt="You"
                    className="w-8 h-8 rounded-full flex-shrink-0"
                  />
                )}
              </div>
            ))}
            {coins < 10 && (
              <div className="text-center py-4">
                <p className="text-red-500 mb-2">金幣不足，無法查看完整訊息</p>
                <Button
                  variant="outline"
                  onClick={() => alert('跳转到充值页面')}
                  className="text-blue-500 border-blue-500"
                >
                  立即充值
                </Button>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* 輸入框 */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => alert('上传图片')}
                className="text-gray-500"
              >
                <Image className="w-5 h-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleGiftClick}
                className="text-gray-500"
              >
                <Gift className="w-5 h-5" />
              </Button>
              <Input
                value={newMessage}
                onChange={e => setNewMessage(e.target.value)}
                onKeyPress={e => e.key === 'Enter' && handleSend()}
                placeholder="輸入訊息..."
                className="flex-1"
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={handleSend}
                className="text-blue-500"
              >
                <Send className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {showGiftOverlay && (
        <GiftOverlay
          isOpen={showGiftOverlay}
          onClose={() => setShowGiftOverlay(false)}
          onSend={handleGiftSelect}
          coins={coins}
        />
      )}
    </div>
  )
} 