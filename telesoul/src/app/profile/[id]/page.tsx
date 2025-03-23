'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ChevronLeft, Camera, Heart, MessageSquare, Phone, AlertTriangle, MoreVertical, Gift, X } from 'lucide-react'
import { GiftOverlay } from '@/components/ui/gift-overlay'
import { ChatOverlay } from '@/components/ui/chat-overlay'
import { Textarea } from '@/components/ui/textarea'
import { getMockUser } from '@/data/mockUsers'
import type { UserProfile } from '@/data/mockUsers'

export default function UserProfilePage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [showGiftOverlay, setShowGiftOverlay] = useState(false)
  const [showChatOverlay, setShowChatOverlay] = useState(false)
  const [coins, setCoins] = useState(100)
  const [mounted, setMounted] = useState(false)
  const [showReportDialog, setShowReportDialog] = useState(false)
  const [showMoreOptions, setShowMoreOptions] = useState(false)
  const [reportReason, setReportReason] = useState('')
  
  const user = getMockUser(params.id)

  useEffect(() => {
    setMounted(true)
    return () => setMounted(false)
  }, [])

  const handleBack = () => {
    if (mounted) {
      router.back()
    }
  }

  const handleChat = () => {
    if (!mounted) return
    if (!user) {
      console.error('User not found')
      return
    }
    router.push(`/chat/${user.id}`)
  }

  const handleGiftSend = (giftType: string, value: number) => {
    if (coins >= value) {
      setCoins(prev => prev - value)
      // TODO: 处理礼物发送逻辑
      setShowGiftOverlay(false)
    } else {
      alert('金幣不足，請先充值！')
    }
  }

  if (!mounted || !user) {
    return null
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* 头部导航 */}
      <div className="flex items-center justify-between px-4 py-2 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleBack}
            className="-ml-2"
          >
            <ChevronLeft className="w-6 h-6" />
          </Button>
          <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100 ml-3">
            個人資料
          </h1>
        </div>
        <div className="relative">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowMoreOptions(!showMoreOptions)}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <MoreVertical className="w-5 h-5" />
          </Button>
          {showMoreOptions && (
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg py-1 z-50">
              <button
                onClick={() => {
                  setShowMoreOptions(false)
                  setShowReportDialog(true)
                }}
                className="w-full px-4 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                舉報用戶
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 照片轮播 */}
      <div className="relative h-64 bg-gray-200 dark:bg-gray-700">
        <img
          src={user.photos[0]}
          alt="Profile"
          className="w-full h-full object-cover"
        />
      </div>

      {/* 基本信息 */}
      <div className="p-4 bg-white dark:bg-gray-800">
        <div className="flex items-center space-x-4">
          <img
            src={user.avatar}
            alt={user.nickname}
            className="w-20 h-20 rounded-full"
          />
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                  {user.nickname}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {user.countryFlag} {user.country} · {user.location}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="secondary"
                  size="icon"
                  onClick={() => setShowGiftOverlay(true)}
                  className="text-pink-500 hover:text-pink-600 dark:text-pink-400 dark:hover:text-pink-300"
                >
                  <Gift className="w-5 h-5" />
                </Button>
                <Button
                  variant="secondary"
                  size="icon"
                  onClick={handleChat}
                  className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  <MessageSquare className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 举报对话框 */}
      {showReportDialog && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50">
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-lg shadow-xl">
                {/* 头部 */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    舉報用戶
                  </h3>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowReportDialog(false)}
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>

                {/* 内容 */}
                <div className="p-4">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        舉報原因
                      </label>
                      <Textarea
                        value={reportReason}
                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setReportReason(e.target.value)}
                        placeholder="請描述舉報原因..."
                        className="min-h-[120px]"
                      />
                    </div>
                  </div>
                </div>

                {/* 底部按钮 */}
                <div className="flex justify-end space-x-3 p-4 border-t border-gray-200 dark:border-gray-700">
                  <Button
                    variant="secondary"
                    className="bg-red-500 hover:bg-red-600 text-white"
                    onClick={() => {
                      // TODO: 处理举报逻辑
                      console.log('举报原因:', reportReason)
                      setShowReportDialog(false)
                      setReportReason('')
                    }}
                    disabled={!reportReason.trim()}
                  >
                    確認舉報
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 詳細資料 */}
      <div className="p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          詳細資料
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <p className="text-sm text-gray-500 dark:text-gray-400">年齡</p>
            <p className="text-sm text-gray-900 dark:text-gray-100">{user.age}歲</p>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-gray-500 dark:text-gray-400">身高</p>
            <p className="text-sm text-gray-900 dark:text-gray-100">{user.height}cm</p>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-gray-500 dark:text-gray-400">體重</p>
            <p className="text-sm text-gray-900 dark:text-gray-100">{user.weight}kg</p>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-gray-500 dark:text-gray-400">星座</p>
            <p className="text-sm text-gray-900 dark:text-gray-100">{user.zodiac}</p>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-gray-500 dark:text-gray-400">MBTI</p>
            <p className="text-sm text-gray-900 dark:text-gray-100">{user.mbti}</p>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-gray-500 dark:text-gray-400">種族</p>
            <p className="text-sm text-gray-900 dark:text-gray-100">{user.ethnicity}</p>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-gray-500 dark:text-gray-400">眼睛顏色</p>
            <p className="text-sm text-gray-900 dark:text-gray-100">{user.eyeColor}</p>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-gray-500 dark:text-gray-400">頭髮顏色</p>
            <p className="text-sm text-gray-900 dark:text-gray-100">{user.hairColor}</p>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-gray-500 dark:text-gray-400">職業</p>
            <p className="text-sm text-gray-900 dark:text-gray-100">{user.occupation}</p>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-gray-500 dark:text-gray-400">教育程度</p>
            <p className="text-sm text-gray-900 dark:text-gray-100">{user.education}</p>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-gray-500 dark:text-gray-400">語言</p>
            <p className="text-sm text-gray-900 dark:text-gray-100">{user.language?.join(', ')}</p>
          </div>
        </div>
      </div>

      {/* 個人介紹 */}
      {user.introduction && (
        <div className="p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            個人介紹
          </h3>
          <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
            {user.introduction}
          </p>
        </div>
      )}

      {/* 興趣標籤 */}
      {user.interests && user.interests.length > 0 && (
        <div className="p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            興趣愛好
          </h3>
          <div className="flex flex-wrap gap-2">
            {user.interests.map((interest, index) => (
              <span
                key={index}
                className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full"
              >
                {interest}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* 社交媒體 */}
      {user.socialMedia && (
        <div className="p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            社交媒體
          </h3>
          <div className="flex space-x-4">
            {user.socialMedia.instagram && (
              <div className="flex items-center space-x-2">
                <span className="text-pink-500">📸</span>
                <span className="text-sm text-gray-700 dark:text-gray-300">Instagram</span>
              </div>
            )}
            {user.socialMedia.facebook && (
              <div className="flex items-center space-x-2">
                <span className="text-blue-500">👥</span>
                <span className="text-sm text-gray-700 dark:text-gray-300">Facebook</span>
              </div>
            )}
            {user.socialMedia.twitter && (
              <div className="flex items-center space-x-2">
                <span className="text-blue-400">🐦</span>
                <span className="text-sm text-gray-700 dark:text-gray-300">Twitter</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 认证信息 */}
      <div className="p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
          {user.isKYC && (
            <span className="flex items-center">
              <span className="text-green-500 mr-1">✓</span>
              身份認證
            </span>
          )}
          {user.isPremium && (
            <span className="flex items-center">
              <span className="text-yellow-500 mr-1">★</span>
              高級會員
            </span>
          )}
        </div>
      </div>

      {/* 禮物和聊天彈窗 */}
      {showGiftOverlay && (
        <GiftOverlay
          isOpen={showGiftOverlay}
          onClose={() => setShowGiftOverlay(false)}
          onSend={handleGiftSend}
          coins={coins}
        />
      )}

      {showChatOverlay && (
        <ChatOverlay
          user={user}
          onBack={() => setShowChatOverlay(false)}
          onGiftSend={handleGiftSend}
          coins={coins}
        />
      )}
    </div>
  )
} 