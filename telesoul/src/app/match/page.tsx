/**
 * @locked
 * @version 1.0.0
 * @lastModified 2024-03-xx
 * @description 此文件已锁定，请勿修改。任何修改请先与团队确认。
 * 此文件包含随机配对的核心逻辑，已经过优化和测试。
 */

'use client'

import { Button } from '@/components/ui/button'
import { useState, useEffect, useCallback } from 'react'
import { GiftOverlay } from '@/components/ui/gift-overlay'
import { Card } from '@/components/ui/card'
import { useTheme } from 'next-themes'
import { motion, AnimatePresence } from 'framer-motion'
import { Dice1, Dice2, Dice3, Dice4, Dice5, Dice6, Clock, User, Gift, MessageSquare, Headphones, Coins, Search, Filter, X, ChevronRight, ChevronDown } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Heart, Phone, AlertTriangle, MoreVertical, Camera } from 'lucide-react'
import { Dialog } from '@/components/ui/dialog'

interface UserProfile {
  id: string
  nickname: string
  age: number
  zodiac: string
  mbti: string
  tags: string[]
  avatar: string
  voiceCallSupport: 'enabled' | 'disabled' | 'locked'
  height?: number
  weight?: number
  language?: string[]
  country: string
  countryFlag: string
  isOnline: boolean
  allowsVoiceCall: boolean
  isPremium: boolean
  isKYC: boolean
  interests: string[]
}

interface FilterOptions {
  countries: string[]
  languages: string[]
  ageRange: [number, number]
  heightRange: [number, number]
  weightRange: [number, number]
  zodiac: string[]
  mbti: string[]
  ethnicity: string[]
  socialMedia: {
    instagram: boolean
    facebook: boolean
    twitter: boolean
  }
}

const mockUsers: UserProfile[] = [
  {
    id: '1',
    nickname: '小明',
    age: 25,
    zodiac: '天秤座',
    mbti: 'INFJ',
    tags: ['读书', '旅行', '音乐', '电影'],
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
    voiceCallSupport: 'enabled',
    height: 180,
    weight: 70,
    language: ['中文', '英语'],
    country: '中国',
    countryFlag: '🇨🇳',
    isOnline: true,
    allowsVoiceCall: true,
    isPremium: true,
    isKYC: true,
    interests: ['旅行', '摄影', '美食']
  },
  {
    id: '2',
    nickname: '小红',
    age: 23,
    zodiac: '双子座',
    mbti: 'ENFP',
    tags: ['绘画', '摄影', '美食', '旅行'],
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lucy',
    voiceCallSupport: 'disabled',
    language: ['中文', '日语'],
    country: '日本',
    countryFlag: '🇯🇵',
    height: 165,
    weight: 48,
    isOnline: false,
    allowsVoiceCall: true,
    isPremium: true,
    isKYC: true,
    interests: ['音乐', '电影', '美食']
  }
]

const defaultFilters: FilterOptions = {
  countries: [],
  languages: [],
  ageRange: [18, 80],
  heightRange: [140, 240],
  weightRange: [30, 300],
  zodiac: [],
  mbti: [],
  ethnicity: [],
  socialMedia: {
    instagram: false,
    facebook: false,
    twitter: false
  }
}

export default function MatchPage() {
  const { theme, resolvedTheme } = useTheme()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [isRolling, setIsRolling] = useState(false)
  const [currentDice, setCurrentDice] = useState(6)
  const [countdown, setCountdown] = useState(0)
  const [isMatching, setIsMatching] = useState(false)
  const [coins, setCoins] = useState<number>(100)
  const [showGiftOverlay, setShowGiftOverlay] = useState<boolean>(false)
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [showFilterDialog, setShowFilterDialog] = useState(false)
  const [showCountries, setShowCountries] = useState(false)
  const [showLanguages, setShowLanguages] = useState(false)
  const [showEthnicity, setShowEthnicity] = useState(false)
  const [showZodiac, setShowZodiac] = useState(false)
  const [showMbti, setShowMbti] = useState(false)
  const [filters, setFilters] = useState<FilterOptions>(defaultFilters)

  // 確保組件在客戶端掛載後再渲染
  useEffect(() => {
    setMounted(true)
    // 從 localStorage 讀取保存的過濾器設置
    const savedFilters = localStorage.getItem('matchFilters')
    if (savedFilters) {
      try {
        const parsedFilters = JSON.parse(savedFilters)
        setFilters(parsedFilters)
      } catch (error) {
        console.error('Error parsing saved filters:', error)
      }
    }
  }, [])

  // 骰子动画效果
  const rollDice = () => {
    if (countdown > 0) return
    
    setIsRolling(true)
    setIsMatching(true)
    
    // 模拟骰子滚动效果
    let rolls = 0
    const rollInterval = setInterval(() => {
      const randomDice = Math.floor(Math.random() * 6) + 1
      setCurrentDice(randomDice)
      rolls++
      
      if (rolls >= 10) {
        clearInterval(rollInterval)
        // 最后展示一个随机点数，然后停留一会儿再变成6点
        const finalRandomDice = Math.floor(Math.random() * 5) + 1 // 1-5的随机数
        setCurrentDice(finalRandomDice)
        
        setTimeout(() => {
          setCurrentDice(6) // 最后停在6点
          setIsRolling(false)
          // 开始倒计时
          setCountdown(60)
        }, 1000) // 停留1秒后变成6点
      }
    }, 100)
  }

  // 倒计时效果
  useEffect(() => {
    if (countdown > 0) {
      const timer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(timer)
            setIsMatching(false)
            return 0
          }
          return prev - 1
        })
      }, 1000)
      
      return () => clearInterval(timer)
    }
  }, [countdown])

  // 處理送禮物
  const handleGiftSend = useCallback((giftType: string, value: number) => {
    if (coins < value) {
      alert('金幣不足，請先充值！')
      return
    }
    setCoins(prev => prev - value)
    setShowGiftOverlay(false)
    setSelectedUser(null)
  }, [coins])

  // 處理點擊送禮物按鈕
  const handleGiftClick = useCallback((user: UserProfile) => {
    setSelectedUser(user)
    setShowGiftOverlay(true)
  }, [])

  // 處理打招呼
  const handleSayHi = useCallback((userId: string) => {
    if (mounted) {
      router.push(`/chat/${userId}`)
    }
  }, [router, mounted])

  // 處理點擊用戶
  const handleUserClick = useCallback((userId: string) => {
    if (mounted) {
      router.push(`/profile/${userId}`)
    }
  }, [router, mounted])

  // 處理過濾器變更
  const handleFilterChange = useCallback((key: keyof FilterOptions, value: any) => {
    setFilters(prev => {
      const newFilters = { ...prev, [key]: value }
      localStorage.setItem('matchFilters', JSON.stringify(newFilters))
      return newFilters
    })
  }, [])

  // 處理重置過濾器
  const handleResetFilters = useCallback(() => {
    setFilters(defaultFilters)
    localStorage.removeItem('matchFilters')
  }, [])

  // 如果還未掛載，返回 null
  if (!mounted) {
    return null
  }

  const getDiceComponent = () => {
    switch (currentDice) {
      case 1: return <Dice1 className={`w-32 h-32 ${mounted ? (resolvedTheme === 'dark' ? 'text-white' : 'text-gray-900') : 'text-gray-900'} transition-colors duration-200`} />
      case 2: return <Dice2 className={`w-32 h-32 ${mounted ? (resolvedTheme === 'dark' ? 'text-white' : 'text-gray-900') : 'text-gray-900'} transition-colors duration-200`} />
      case 3: return <Dice3 className={`w-32 h-32 ${mounted ? (resolvedTheme === 'dark' ? 'text-white' : 'text-gray-900') : 'text-gray-900'} transition-colors duration-200`} />
      case 4: return <Dice4 className={`w-32 h-32 ${mounted ? (resolvedTheme === 'dark' ? 'text-white' : 'text-gray-900') : 'text-gray-900'} transition-colors duration-200`} />
      case 5: return <Dice5 className={`w-32 h-32 ${mounted ? (resolvedTheme === 'dark' ? 'text-white' : 'text-gray-900') : 'text-gray-900'} transition-colors duration-200`} />
      case 6: return <Dice6 className={`w-32 h-32 ${mounted ? (resolvedTheme === 'dark' ? 'text-white' : 'text-gray-900') : 'text-gray-900'} transition-colors duration-200`} />
      default: return <Dice6 className={`w-32 h-32 ${mounted ? (resolvedTheme === 'dark' ? 'text-white' : 'text-gray-900') : 'text-gray-900'} transition-colors duration-200`} />
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto space-y-6">
          {/* 骰子卡片 */}
          <Card className="p-6">
            <div className="flex flex-col items-center space-y-6">
              <div className="flex items-center justify-between w-full">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  隨機配對
                </h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowFilterDialog(true)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <Filter className="w-5 h-5" />
                </Button>
              </div>

              <motion.div
                animate={isRolling ? {
                  rotate: [0, 360],
                  scale: [1, 1.2, 1]
                } : {}}
                transition={{
                  duration: 0.5,
                  repeat: isRolling ? Infinity : 0,
                  ease: "easeInOut"
                }}
                className="relative cursor-pointer"
                onClick={rollDice}
              >
                {getDiceComponent()}
              </motion.div>

              {/* 匹配結果提示 */}
              {(filters.countries.length > 0 || 
                filters.languages.length > 0 || 
                filters.zodiac.length > 0 || 
                filters.mbti.length > 0 ||
                filters.ethnicity.length > 0 ||
                Object.values(filters.socialMedia).some(Boolean)) && (
                <div className="w-full p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                  <p className="text-sm text-blue-600 dark:text-blue-400 flex flex-wrap gap-2">
                    已設置優先匹配條件：
                    {filters.countries.length > 0 && (
                      <span className="bg-blue-100 dark:bg-blue-800 px-2 py-1 rounded">
                        國家({filters.countries.length})
                      </span>
                    )}
                    {filters.languages.length > 0 && (
                      <span className="bg-green-100 dark:bg-green-800 px-2 py-1 rounded">
                        語言({filters.languages.length})
                      </span>
                    )}
                    {filters.ethnicity.length > 0 && (
                      <span className="bg-purple-100 dark:bg-purple-800 px-2 py-1 rounded">
                        種族({filters.ethnicity.length})
                      </span>
                    )}
                    {filters.zodiac.length > 0 && (
                      <span className="bg-pink-100 dark:bg-pink-800 px-2 py-1 rounded">
                        星座({filters.zodiac.length})
                      </span>
                    )}
                    {filters.mbti.length > 0 && (
                      <span className="bg-orange-100 dark:bg-orange-800 px-2 py-1 rounded">
                        MBTI({filters.mbti.length})
                      </span>
                    )}
                    {Object.values(filters.socialMedia).some(Boolean) && (
                      <span className="bg-indigo-100 dark:bg-indigo-800 px-2 py-1 rounded">
                        社交媒體認證
                      </span>
                    )}
                  </p>
                </div>
              )}

              <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {isMatching ? '正在匹配中...' : '開始隨機匹配'}
                </h2>
                {countdown > 0 && (
                  <div className="flex items-center justify-center space-x-2 text-gray-600 dark:text-gray-400">
                    <Clock className="w-4 h-4" />
                    <span>下次匹配還需等待 {countdown} 秒</span>
                  </div>
                )}
              </div>

              <div className="w-full space-y-4">
                <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4" />
                    <span>今日已匹配</span>
                  </div>
                  <span>3/5 次</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: '60%' }} />
                </div>
              </div>
            </div>
          </Card>

          {/* 金币余额 */}
          <div className="text-center text-gray-600 dark:text-gray-400 mb-4">
            <div className="flex items-center justify-center space-x-2">
              <Coins className="w-5 h-5 text-yellow-500" />
              <span>金币余额：</span>
              <span className="text-blue-600 dark:text-blue-400 font-medium">{coins}</span>
            </div>
          </div>

          {/* 用户列表 */}
          <div className="flex-1 overflow-y-auto">
            {mockUsers.map((user) => (
              <div
                key={user.id}
                className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700"
              >
                {/* 用户信息 */}
                <div className="p-4 flex items-center">
                  <div
                    className="cursor-pointer"
                    onClick={() => handleUserClick(user.id)}
                  >
                    <img
                      src={user.avatar}
                      alt={user.nickname}
                      className="w-12 h-12 rounded-full"
                    />
                  </div>
                  <div className="ml-3 flex-1">
                    <div
                      className="cursor-pointer"
                      onClick={() => handleUserClick(user.id)}
                    >
                      <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-1">
                        {user.nickname}
                      </h3>
                      <div className="text-sm font-normal text-gray-500 dark:text-gray-400 flex flex-wrap gap-2">
                        <span>{user.age}岁</span>
                        <span>{user.zodiac}</span>
                        <span>{user.height}cm</span>
                        <span>{user.mbti}</span>
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {user.interests.join(' · ')}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="secondary"
                      size="icon"
                      onClick={() => handleGiftClick(user)}
                      className="text-pink-500 hover:text-pink-600 dark:text-pink-400 dark:hover:text-pink-300"
                    >
                      <Gift className="w-5 h-5" />
                    </Button>
                    <Button
                      variant="secondary"
                      size="icon"
                      onClick={() => handleSayHi(user.id)}
                      className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                      <MessageSquare className="w-5 h-5" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* 匹配结果 */}
          {selectedUser && (
            <Card className="p-6">
              <div className="flex flex-col items-center space-y-6">
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center space-x-3">
                    <img
                      src={selectedUser.avatar}
                      alt={selectedUser.nickname}
                      className="w-16 h-16 rounded-full"
                    />
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                        {selectedUser.nickname}
                      </h2>
                      <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                        <span>{selectedUser.countryFlag}</span>
                        <span>{selectedUser.country}</span>
                        <span>·</span>
                        <span>{selectedUser.language?.join(', ')}</span>
                        <span>·</span>
                        <span>{selectedUser.mbti}</span>
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => router.push(`/profile/${selectedUser.id}`)}
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </Button>
                </div>

                {/* 过滤条件提示 */}
                {(filters.countries.length > 0 || 
                  filters.languages.length > 0 || 
                  filters.zodiac.length > 0 || 
                  filters.mbti.length > 0 ||
                  filters.ethnicity.length > 0 ||
                  Object.values(filters.socialMedia).some(Boolean)) && (
                  <div className="w-full p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                    <p className="text-sm text-blue-600 dark:text-blue-400 flex flex-wrap gap-2">
                      本次匹配使用條件：
                      {filters.countries.length > 0 && (
                        <span className="bg-blue-100 dark:bg-blue-800 px-2 py-1 rounded">
                          國家({filters.countries.length})
                        </span>
                      )}
                      {filters.languages.length > 0 && (
                        <span className="bg-green-100 dark:bg-green-800 px-2 py-1 rounded">
                          語言({filters.languages.length})
                        </span>
                      )}
                      {filters.ethnicity.length > 0 && (
                        <span className="bg-purple-100 dark:bg-purple-800 px-2 py-1 rounded">
                          種族({filters.ethnicity.length})
                        </span>
                      )}
                      {filters.zodiac.length > 0 && (
                        <span className="bg-pink-100 dark:bg-pink-800 px-2 py-1 rounded">
                          星座({filters.zodiac.length})
                        </span>
                      )}
                      {filters.mbti.length > 0 && (
                        <span className="bg-orange-100 dark:bg-orange-800 px-2 py-1 rounded">
                          MBTI({filters.mbti.length})
                        </span>
                      )}
                      {Object.values(filters.socialMedia).some(Boolean) && (
                        <span className="bg-indigo-100 dark:bg-indigo-800 px-2 py-1 rounded">
                          社交媒體認證
                        </span>
                      )}
                    </p>
                  </div>
                )}

                <div className="text-center space-y-2">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {selectedUser.nickname}
                  </h2>
                  <div className="flex items-center justify-center space-x-2 text-gray-600 dark:text-gray-400">
                    <span>{selectedUser.age}岁</span>
                    <span>·</span>
                    <span>{selectedUser.zodiac}</span>
                    <span>·</span>
                    <span>{selectedUser.height}cm</span>
                  </div>
                </div>

                <div className="w-full space-y-4">
                  <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex items-center space-x-2">
                      <User className="w-4 h-4" />
                      <span>今日已匹配</span>
                    </div>
                    <span>3/5 次</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: '60%' }} />
                  </div>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>

      {/* 过滤弹窗 */}
      {showFilterDialog && (
        <div className="fixed inset-0 z-[9999] bg-black bg-opacity-50">
          <div className="fixed inset-0 z-[9999] overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-0">
              <div className="w-full h-full bg-white dark:bg-gray-900">
                {/* 头部 */}
                <div className="sticky top-0 z-10 flex items-center justify-between p-4 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">配對過濾</h2>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowFilterDialog(false)}
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>

                {/* 内容区域 */}
                <div className="h-[calc(100vh-8rem)] overflow-y-auto">
                  <div className="max-w-2xl mx-auto p-4 space-y-4">
                    {/* 年龄范围 */}
                    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">年齡範圍</h3>
                      <div className="flex items-center space-x-4">
                        <Input
                          type="number"
                          value={filters.ageRange[0]}
                          onChange={(e) => handleFilterChange('ageRange', [parseInt(e.target.value), filters.ageRange[1]])}
                          className="w-24"
                          min="18"
                          max="80"
                        />
                        <span className="text-gray-500">至</span>
                        <Input
                          type="number"
                          value={filters.ageRange[1]}
                          onChange={(e) => handleFilterChange('ageRange', [filters.ageRange[0], parseInt(e.target.value)])}
                          className="w-24"
                          min="18"
                          max="80"
                        />
                      </div>
                    </div>

                    {/* 身高范围 */}
                    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">身高範圍 (cm)</h3>
                      <div className="flex items-center space-x-4">
                        <Input
                          type="number"
                          value={filters.heightRange[0]}
                          onChange={(e) => handleFilterChange('heightRange', [parseInt(e.target.value), filters.heightRange[1]])}
                          className="w-24"
                          min="140"
                          max="240"
                        />
                        <span className="text-gray-500">至</span>
                        <Input
                          type="number"
                          value={filters.heightRange[1]}
                          onChange={(e) => handleFilterChange('heightRange', [filters.heightRange[0], parseInt(e.target.value)])}
                          className="w-24"
                          min="140"
                          max="240"
                        />
                      </div>
                    </div>

                    {/* 体重范围 */}
                    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">體重範圍 (kg)</h3>
                      <div className="flex items-center space-x-4">
                        <Input
                          type="number"
                          value={filters.weightRange[0]}
                          onChange={(e) => handleFilterChange('weightRange', [parseInt(e.target.value), filters.weightRange[1]])}
                          className="w-24"
                          min="30"
                          max="300"
                        />
                        <span className="text-gray-500">至</span>
                        <Input
                          type="number"
                          value={filters.weightRange[1]}
                          onChange={(e) => handleFilterChange('weightRange', [filters.weightRange[0], parseInt(e.target.value)])}
                          className="w-24"
                          min="30"
                          max="300"
                        />
                      </div>
                    </div>

                    {/* 国家选择 */}
                    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                      <button
                        onClick={() => setShowCountries(!showCountries)}
                        className="flex items-center justify-between w-full text-left"
                      >
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                          國家 {filters.countries.length > 0 && `(已選${filters.countries.length}/5)`}
                        </h3>
                        <ChevronDown className={`w-5 h-5 transform transition-transform ${showCountries ? 'rotate-180' : ''}`} />
                      </button>
                      {showCountries && (
                        <div className="mt-4 grid grid-cols-2 gap-2">
                          {['中国', '中国香港', '中国澳门', '中国台湾', '日本', '韩国', '蒙古',
                            '新加坡', '马来西亚', '泰国', '越南', '印度尼西亚', '菲律宾', '缅甸', '柬埔寨', '老挝', '文莱',
                            '印度', '巴基斯坦', '孟加拉国', '斯里兰卡', '尼泊尔', '不丹', '马尔代夫',
                            '哈萨克斯坦', '乌兹别克斯坦', '吉尔吉斯斯坦', '塔吉克斯坦', '土库曼斯坦',
                            '土耳其', '伊朗', '伊拉克', '沙特阿拉伯', '阿联酋', '以色列', '黎巴嫩', '约旦', '叙利亚', '也门', '阿曼', '卡塔尔', '巴林', '科威特',
                            '英国', '法国', '德国', '意大利', '西班牙', '葡萄牙', '荷兰', '比利时', '瑞士', '奥地利', '瑞典', '挪威', '丹麦', '芬兰', 
                            '爱尔兰', '冰岛', '希腊', '波兰', '捷克', '斯洛伐克', '匈牙利', '罗马尼亚', '保加利亚', '克罗地亚', '塞尔维亚', '乌克兰',
                            '美国', '加拿大', '墨西哥',
                            '巴西', '阿根廷', '智利', '哥伦比亚', '秘鲁', '委内瑞拉', '乌拉圭', '巴拉圭', '玻利维亚', '厄瓜多尔',
                            '澳大利亚', '新西兰',
                            '埃及', '南非', '摩洛哥', '肯尼亚', '尼日利亚', '埃塞俄比亚', '加纳', '坦桑尼亚'].map(country => (
                            <label key={country} className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={filters.countries.includes(country)}
                                disabled={!filters.countries.includes(country) && filters.countries.length >= 5}
                                onChange={(e) => {
                                  const newCountries = e.target.checked
                                    ? [...filters.countries, country]
                                    : filters.countries.filter(c => c !== country)
                                  handleFilterChange('countries', newCountries)
                                }}
                                className="rounded text-blue-500 disabled:opacity-50"
                              />
                              <span className="text-gray-700 dark:text-gray-300">{country}</span>
                            </label>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* 语言选择 */}
                    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                      <button
                        onClick={() => setShowLanguages(!showLanguages)}
                        className="flex items-center justify-between w-full text-left"
                      >
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                          語言 {filters.languages.length > 0 && `(已選${filters.languages.length}/5)`}
                        </h3>
                        <ChevronDown className={`w-5 h-5 transform transition-transform ${showLanguages ? 'rotate-180' : ''}`} />
                      </button>
                      {showLanguages && (
                        <div className="mt-4 grid grid-cols-2 gap-2">
                          {['中文（简体）', '中文（繁体）', '日语', '韩语', '蒙古语',
                            '越南语', '泰语', '印尼语', '马来语', '菲律宾语（他加禄语）', '缅甸语', '柬埔寨语（高棉语）', '老挝语',
                            '印地语', '孟加拉语', '泰米尔语', '乌尔都语', '泰卢固语', '马拉雅拉姆语', '卡纳达语', '旁遮普语', '尼泊尔语',
                            '英语', '法语', '德语', '西班牙语', '葡萄牙语', '意大利语', '俄语', '波兰语', '荷兰语', '瑞典语', '捷克语', '希腊语',
                            '丹麦语', '挪威语', '芬兰语', '匈牙利语', '罗马尼亚语', '保加利亚语', '塞尔维亚语', '克罗地亚语', '斯洛伐克语',
                            '乌克兰语', '波斯语', '印地语',
                            '阿拉伯语', '希伯来语',
                            '土耳其语', '斯瓦希里语', '豪萨语', '阿姆哈拉语'].map(language => (
                              <label key={language} className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={filters.languages.includes(language)}
                                  disabled={!filters.languages.includes(language) && filters.languages.length >= 5}
                                  onChange={(e) => {
                                    const newLanguages = e.target.checked
                                      ? [...filters.languages, language]
                                      : filters.languages.filter(l => l !== language)
                                    handleFilterChange('languages', newLanguages)
                                  }}
                                  className="rounded text-green-500 disabled:opacity-50"
                                />
                                <span className="text-gray-700 dark:text-gray-300">{language}</span>
                              </label>
                            ))}
                        </div>
                      )}
                    </div>

                    {/* 种族选择 */}
                    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                      <button
                        onClick={() => setShowEthnicity(!showEthnicity)}
                        className="flex items-center justify-between w-full text-left"
                      >
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                          種族 {filters.ethnicity.length > 0 && `(已選${filters.ethnicity.length}/3)`}
                        </h3>
                        <ChevronDown className={`w-5 h-5 transform transition-transform ${showEthnicity ? 'rotate-180' : ''}`} />
                      </button>
                      {showEthnicity && (
                        <div className="mt-4 grid grid-cols-2 gap-2">
                          {['亚洲人', '欧洲人', '非洲人', '拉丁美洲人', '中东人', '混血', '其他'].map(ethnicity => (
                            <label key={ethnicity} className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={filters.ethnicity.includes(ethnicity)}
                                disabled={!filters.ethnicity.includes(ethnicity) && filters.ethnicity.length >= 3}
                                onChange={(e) => {
                                  const newEthnicity = e.target.checked
                                    ? [...filters.ethnicity, ethnicity]
                                    : filters.ethnicity.filter(e => e !== ethnicity)
                                  handleFilterChange('ethnicity', newEthnicity)
                                }}
                                className="rounded text-purple-500"
                              />
                              <span className="text-gray-700 dark:text-gray-300">{ethnicity}</span>
                            </label>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* 星座选择 */}
                    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                      <button
                        onClick={() => setShowZodiac(!showZodiac)}
                        className="flex items-center justify-between w-full text-left"
                      >
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                          星座 {filters.zodiac.length > 0 && `(已選${filters.zodiac.length}/3)`}
                        </h3>
                        <ChevronDown className={`w-5 h-5 transform transition-transform ${showZodiac ? 'rotate-180' : ''}`} />
                      </button>
                      {showZodiac && (
                        <div className="mt-4 grid grid-cols-3 gap-2">
                          {['白羊座', '金牛座', '双子座', '巨蟹座', '狮子座', '处女座', '天秤座', '天蝎座', '射手座', '摩羯座', '水瓶座', '双鱼座'].map(zodiac => (
                            <button
                              key={zodiac}
                              onClick={() => {
                                const newZodiac = filters.zodiac.includes(zodiac)
                                  ? filters.zodiac.filter(z => z !== zodiac)
                                  : filters.zodiac.length < 3 
                                    ? [...filters.zodiac, zodiac]
                                    : filters.zodiac
                                handleFilterChange('zodiac', newZodiac)
                              }}
                              className={`px-3 py-2 rounded-lg text-sm ${
                                filters.zodiac.includes(zodiac)
                                  ? 'bg-purple-500 text-white'
                                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                              }`}
                            >
                              {zodiac}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* MBTI选择 */}
                    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                      <button
                        onClick={() => setShowMbti(!showMbti)}
                        className="flex items-center justify-between w-full text-left"
                      >
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                          MBTI {filters.mbti.length > 0 && `(已選${filters.mbti.length}/3)`}
                        </h3>
                        <ChevronDown className={`w-5 h-5 transform transition-transform ${showMbti ? 'rotate-180' : ''}`} />
                      </button>
                      {showMbti && (
                        <div className="mt-4 grid grid-cols-3 gap-2">
                          {['INTJ', 'INTP', 'ENTJ', 'ENTP', 'INFJ', 'INFP', 'ENFJ', 'ENFP', 'ISTJ', 'ISFJ', 'ESTJ', 'ESFJ', 'ISTP', 'ISFP', 'ESTP', 'ESFP'].map(mbti => (
                            <button
                              key={mbti}
                              onClick={() => {
                                const newMbti = filters.mbti.includes(mbti)
                                  ? filters.mbti.filter(m => m !== mbti)
                                  : filters.mbti.length < 3
                                    ? [...filters.mbti, mbti]
                                    : filters.mbti
                                handleFilterChange('mbti', newMbti)
                              }}
                              className={`px-2 py-1 rounded-lg text-sm ${
                                filters.mbti.includes(mbti)
                                  ? 'bg-orange-500 text-white'
                                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                              }`}
                            >
                              {mbti}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* 社交媒体认证 */}
                    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">社交媒體認證</h3>
                      <div className="flex flex-wrap gap-4">
                        <label className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={filters.socialMedia.instagram}
                            onChange={(e) => handleFilterChange('socialMedia', {
                              ...filters.socialMedia,
                              instagram: e.target.checked
                            })}
                            className="rounded text-pink-500"
                          />
                          <span className="text-gray-700 dark:text-gray-300">Instagram</span>
                        </label>
                        <label className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={filters.socialMedia.facebook}
                            onChange={(e) => handleFilterChange('socialMedia', {
                              ...filters.socialMedia,
                              facebook: e.target.checked
                            })}
                            className="rounded text-blue-500"
                          />
                          <span className="text-gray-700 dark:text-gray-300">Facebook</span>
                        </label>
                        <label className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={filters.socialMedia.twitter}
                            onChange={(e) => handleFilterChange('socialMedia', {
                              ...filters.socialMedia,
                              twitter: e.target.checked
                            })}
                            className="rounded text-sky-500"
                          />
                          <span className="text-gray-700 dark:text-gray-300">X.com</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 底部按钮 */}
                <div className="sticky bottom-0 z-10 p-4 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex justify-between space-x-4 max-w-2xl mx-auto">
                    <Button
                      variant="secondary"
                      onClick={handleResetFilters}
                    >
                      重置
                    </Button>
                    <Button
                      variant="primary"
                      onClick={() => {
                        localStorage.setItem('matchFilters', JSON.stringify(filters))
                        setShowFilterDialog(false)
                      }}
                    >
                      保存並關閉
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 礼物弹窗 */}
      {showGiftOverlay && selectedUser && (
        <GiftOverlay
          isOpen={showGiftOverlay}
          onClose={() => {
            setShowGiftOverlay(false)
            setSelectedUser(null)
          }}
          onSend={handleGiftSend}
          coins={coins}
        />
      )}
    </div>
  )
} 