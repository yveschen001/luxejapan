'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { 
  Gift, Diamond, Edit2, AlertCircle, ChevronRight, MessageCircle, 
  Settings, Facebook, Instagram, Twitter, Bell, Globe, Wallet,
  Camera, X, Check, Share2, ChevronDown
} from 'lucide-react'
import { toast } from 'sonner'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface UserProfile {
  avatar: string
  nickname: string
  city: string
  bio: string
  mbti: string
  mbtiDescription: string
  zodiac: string
  chineseZodiac: string
  gender: 'male' | 'female'
  height: number
  weight: number
  race: string
  eyeColor: string
  interests: string[]
  relationshipGoal: string
  isKycVerified: boolean
  hasLinkedWallet: boolean
  socialMedia: {
    facebook?: string
    instagram?: string
    twitter?: string
  }
  posts: {
    id: string
    content: string
    image: string
    likes: number
    comments: number
  }[]
}

interface Transaction {
  id: string
  type: 'recharge' | 'spend' | 'withdraw'
  amount: number
  description: string
  date: string
  status?: 'pending' | 'completed' | 'failed'
}

export default function ProfilePage() {
  const [user, setUser] = useState<UserProfile>({
    avatar: 'https://picsum.photos/200',
    nickname: '小月',
    city: '台北',
    bio: '喜歡旅行和美食的攝影愛好者',
    mbti: 'INFJ',
    mbtiDescription: '理想主义者 - 富有同情心、创造力和理想主义的性格类型',
    zodiac: '天蝎座',
    chineseZodiac: '兔',
    gender: 'female',
    height: 165,
    weight: 50,
    race: '亚洲',
    eyeColor: '黑色',
    interests: ['旅行', '美食', '电影', '音乐', '摄影', '阅读'],
    relationshipGoal: '长期',
    isKycVerified: false,
    hasLinkedWallet: false,
    socialMedia: {},
    posts: [
      {
        id: '1',
        content: '今天的夕阳真美 🌅',
        image: 'https://picsum.photos/400/300?random=1',
        likes: 23,
        comments: 5
      },
      {
        id: '2',
        content: '和朋友共进晚餐 🍜',
        image: 'https://picsum.photos/400/300?random=2',
        likes: 18,
        comments: 3
      }
    ]
  })

  const [balance] = useState({
    coins: 280,
    diamonds: user.gender === 'female' ? 1200 : 0
  })

  const [transactions] = useState<Transaction[]>([
    {
      id: '1',
      type: 'recharge',
      amount: 100,
      description: '充值金币',
      date: '2024-03-23 14:30'
    },
    {
      id: '2',
      type: 'spend',
      amount: 30,
      description: '重新测试 MBTI',
      date: '2024-03-22 15:20'
    },
    {
      id: '3',
      type: 'withdraw',
      amount: 500,
      description: '钻石提现',
      date: '2024-03-21 10:15',
      status: 'pending'
    }
  ])

  const [showEditDialog, setShowEditDialog] = useState(false)
  const [showWalletDialog, setShowWalletDialog] = useState(false)
  const [showSettingsDialog, setShowSettingsDialog] = useState(false)
  const [showAvatarUpload, setShowAvatarUpload] = useState(false)
  const [allowSocialLink, setAllowSocialLink] = useState(false)
  const [notifications, setNotifications] = useState({
    messages: true,
    gifts: true,
    matches: true,
    system: true
  })

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // 這裡應該有實際的上傳邏輯
      toast.success('頭像更新成功')
      setShowAvatarUpload(false)
    }
  }

  const handleSocialMediaLink = (platform: keyof UserProfile['socialMedia']) => {
    // 這裡應該有實際的社群媒體連結邏輯
    toast.success(`${platform} 連結成功`)
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-md">
      {/* 个人信息 */}
      <div className="bg-gradient-to-br from-white to-blue-50 rounded-2xl p-6 shadow-lg">
        <div className="flex items-start space-x-5">
          <div className="relative">
            <div className="w-[90px] h-[90px] relative rounded-full overflow-hidden shadow-md cursor-pointer"
                 onClick={() => setShowAvatarUpload(true)}>
              <Image
                src={user.avatar}
                alt={user.nickname}
                fill
                className="object-cover"
                priority
                sizes="90px"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = 'https://picsum.photos/200';
                }}
              />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                <Camera className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
          <div className="flex-1">
            <div className="text-2xl font-semibold mb-1 text-gray-800">{user.nickname}</div>
            <div className="text-sm text-gray-500 mb-2">{user.city}</div>
            <div className="text-sm text-gray-600 line-clamp-2">{user.bio}</div>
            <Button
              variant="ghost"
              size="sm"
              className="mt-2 text-blue-600 hover:text-blue-700"
              onClick={() => setShowEditDialog(true)}
            >
              <Edit2 className="w-4 h-4 mr-1" />
              編輯資料
            </Button>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="text-gray-500 hover:text-gray-700"
            onClick={() => setShowSettingsDialog(true)}
          >
            <Settings className="w-5 h-5" />
          </Button>
        </div>
        
        {/* MBTI结果 */}
        <div className="mt-6 bg-white/80 backdrop-blur-sm rounded-xl p-5 border border-blue-100">
          <div className="flex items-center justify-between mb-3">
            <div className="text-xl font-semibold text-blue-600">{user.mbti}</div>
            <Button variant="ghost" size="sm" className="text-blue-600 hover:bg-blue-50">
              重新测试
            </Button>
          </div>
          <p className="text-sm leading-relaxed text-gray-600">{user.mbtiDescription}</p>
        </div>
      </div>

      {/* 钱包信息 */}
      <div className="mt-5 grid grid-cols-2 gap-4">
        <div 
          className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-5 shadow-lg cursor-pointer"
          onClick={() => setShowWalletDialog(true)}
        >
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-white/20 rounded-xl">
              <Gift className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="text-sm font-medium text-white/80">金币余额</div>
              <div className="text-2xl font-bold text-white">{balance.coins}</div>
            </div>
          </div>
        </div>
        {user.gender === 'female' && (
          <div 
            className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-5 shadow-lg cursor-pointer"
            onClick={() => setShowWalletDialog(true)}
          >
            <div className="flex items-center space-x-3">
              <div className="p-2.5 bg-white/20 rounded-xl">
                <Diamond className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-sm font-medium text-white/80">钻石余额</div>
                <div className="text-2xl font-bold text-white">{balance.diamonds}</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 社交媒體綁定 */}
      <div className="mt-5 bg-gradient-to-r from-pink-500 to-purple-600 rounded-2xl p-5 text-white shadow-lg">
        <div className="flex items-start space-x-4">
          <div className="p-2.5 bg-white/20 rounded-xl">
            <Share2 className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-semibold mb-2">綁定社交媒體增加你的可信度</h3>
            <div className="flex space-x-3 mb-4">
              <Button
                variant="outline"
                size="sm"
                className="bg-white/10 hover:bg-white/20 border-white/20"
                onClick={() => handleSocialMediaLink('facebook')}
              >
                <Facebook className="w-4 h-4 mr-2" />
                Facebook
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="bg-white/10 hover:bg-white/20 border-white/20"
                onClick={() => handleSocialMediaLink('instagram')}
              >
                <Instagram className="w-4 h-4 mr-2" />
                Instagram
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="bg-white/10 hover:bg-white/20 border-white/20"
                onClick={() => handleSocialMediaLink('twitter')}
              >
                <Twitter className="w-4 h-4 mr-2" />
                X.com
              </Button>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="allowSocialLink"
                checked={allowSocialLink}
                onCheckedChange={(checked) => setAllowSocialLink(checked as boolean)}
                className="border-white/20"
              />
              <Label htmlFor="allowSocialLink" className="text-sm text-white/90">
                允許其他人連結我的社交媒體
              </Label>
            </div>
          </div>
        </div>
      </div>

      {/* 我的广场 */}
      <div className="mt-5 bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-800">我的广场</h2>
          <Link href="/square/my" className="text-sm font-medium text-blue-600 flex items-center hover:text-blue-700">
            更多内容 <ChevronRight className="w-4 h-4 ml-1" />
          </Link>
        </div>
        <div className="divide-y divide-gray-100">
          {user.posts.slice(0, 5).map(post => (
            <div key={post.id} className="p-5">
              <div className="text-base text-gray-700 mb-3 leading-relaxed">{post.content}</div>
              {post.image && (
                <div className="relative w-full h-[240px] mb-3 rounded-xl overflow-hidden">
                  <Image
                    src={post.image}
                    alt={post.content}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = 'https://picsum.photos/400/300?random=fallback';
                    }}
                  />
                </div>
              )}
              <div className="flex items-center text-sm text-gray-500">
                <span className="flex items-center mr-4">
                  <span className="text-red-500 mr-1">❤️</span>
                  <span>{post.likes}</span>
                </span>
                <span className="flex items-center">
                  <span className="text-blue-500 mr-1">💬</span>
                  <span>{post.comments}</span>
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 其他功能按钮 */}
      <div className="mt-5 space-y-3">
        <Button
          variant="outline"
          className="w-full justify-between h-14 text-base font-medium rounded-xl border-gray-200 hover:bg-gray-50"
          onClick={() => setShowWalletDialog(true)}
        >
          <div className="flex items-center">
            <Wallet className="w-5 h-5 mr-3 text-gray-500" />
            <span>我的錢包</span>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-400" />
        </Button>
      </div>

      {/* 編輯資料對話框 */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>編輯個人資料</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="nickname">暱稱</Label>
              <Input
                id="nickname"
                value={user.nickname}
                onChange={(e) => setUser({ ...user, nickname: e.target.value })}
                placeholder="請輸入暱稱"
                maxLength={20}
              />
            </div>
            <div>
              <Label htmlFor="city">城市</Label>
              <Input
                id="city"
                value={user.city}
                onChange={(e) => setUser({ ...user, city: e.target.value })}
                placeholder="請輸入你的城市"
              />
            </div>
            <div>
              <Label htmlFor="bio">自我介紹</Label>
              <Input
                id="bio"
                value={user.bio}
                onChange={(e) => setUser({ ...user, bio: e.target.value })}
                placeholder="請輸入自我介紹（最多140字）"
                maxLength={140}
              />
            </div>
            <div>
              <Label>身高</Label>
              <div className="relative">
                <select
                  value={user.height}
                  onChange={(e) => setUser({ ...user, height: Number(e.target.value) })}
                  className="w-full p-2 border rounded-lg appearance-none pr-10"
                >
                  {Array.from({ length: 60 }, (_, i) => 140 + i * 5).map(height => (
                    <option key={height} value={height}>{height} cm</option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 absolute right-3 top-3 text-gray-400" />
              </div>
            </div>
            <div>
              <Label>體重</Label>
              <div className="relative">
                <select
                  value={user.weight}
                  onChange={(e) => setUser({ ...user, weight: Number(e.target.value) })}
                  className="w-full p-2 border rounded-lg appearance-none pr-10"
                >
                  {Array.from({ length: 15 }, (_, i) => 40 + i * 5).map(weight => (
                    <option key={weight} value={weight}>{weight} kg</option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 absolute right-3 top-3 text-gray-400" />
              </div>
            </div>
            <div>
              <Label>種族</Label>
              <div className="relative">
                <select
                  value={user.race}
                  onChange={(e) => setUser({ ...user, race: e.target.value })}
                  className="w-full p-2 border rounded-lg appearance-none pr-10"
                >
                  {['亚洲', '欧美', '非洲', '拉丁', '其他'].map(race => (
                    <option key={race} value={race}>{race}</option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 absolute right-3 top-3 text-gray-400" />
              </div>
            </div>
            <div>
              <Label>眼睛顏色</Label>
              <div className="relative">
                <select
                  value={user.eyeColor}
                  onChange={(e) => setUser({ ...user, eyeColor: e.target.value })}
                  className="w-full p-2 border rounded-lg appearance-none pr-10"
                >
                  {['黑色', '棕色', '蓝色', '绿色', '其他'].map(color => (
                    <option key={color} value={color}>{color}</option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 absolute right-3 top-3 text-gray-400" />
              </div>
            </div>
            <div>
              <Label>興趣愛好</Label>
              <div className="grid grid-cols-3 gap-2 mt-2">
                {['旅行', '美食', '电影', '音乐', '摄影', '阅读', '运动', '游戏',
                  '艺术', '设计', '科技', '投资', '烹饪', '宠物', '瑜伽', '冥想'].map(interest => (
                  <Button
                    key={interest}
                    variant={user.interests.includes(interest) ? 'primary' : 'outline'}
                    size="sm"
                    className="text-sm"
                    onClick={() => {
                      if (user.interests.includes(interest)) {
                        setUser({ ...user, interests: user.interests.filter(i => i !== interest) })
                      } else if (user.interests.length < 10) {
                        setUser({ ...user, interests: [...user.interests, interest] })
                      }
                    }}
                  >
                    {interest}
                  </Button>
                ))}
              </div>
            </div>
            <Button className="w-full" onClick={() => setShowEditDialog(false)}>
              保存
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* 錢包對話框 */}
      <Dialog open={showWalletDialog} onOpenChange={setShowWalletDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>我的錢包</DialogTitle>
          </DialogHeader>
          <Tabs defaultValue="coins">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="coins">金幣</TabsTrigger>
              <TabsTrigger value="diamonds">鑽石</TabsTrigger>
            </TabsList>
            <TabsContent value="coins">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <div className="text-sm text-gray-500">金幣餘額</div>
                    <div className="text-2xl font-bold">{balance.coins}</div>
                  </div>
                  <Button>充值</Button>
                </div>
                <div className="space-y-2">
                  <h3 className="font-medium">交易記錄</h3>
                  {transactions
                    .filter(t => t.type !== 'withdraw')
                    .map(transaction => (
                      <div key={transaction.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <div className="font-medium">{transaction.description}</div>
                          <div className="text-sm text-gray-500">{transaction.date}</div>
                        </div>
                        <div className={`font-medium ${transaction.type === 'recharge' ? 'text-green-600' : 'text-red-600'}`}>
                          {transaction.type === 'recharge' ? '+' : '-'}{transaction.amount}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </TabsContent>
            <TabsContent value="diamonds">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <div className="text-sm text-gray-500">鑽石餘額</div>
                    <div className="text-2xl font-bold">{balance.diamonds}</div>
                  </div>
                  <Button>提現</Button>
                </div>
                <div className="space-y-2">
                  <h3 className="font-medium">提現記錄</h3>
                  {transactions
                    .filter(t => t.type === 'withdraw')
                    .map(transaction => (
                      <div key={transaction.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <div className="font-medium">{transaction.description}</div>
                          <div className="text-sm text-gray-500">{transaction.date}</div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="font-medium text-red-600">-{transaction.amount}</span>
                          <span className={`text-sm ${
                            transaction.status === 'completed' ? 'text-green-600' :
                            transaction.status === 'pending' ? 'text-yellow-600' :
                            'text-red-600'
                          }`}>
                            {transaction.status === 'completed' ? '已完成' :
                             transaction.status === 'pending' ? '處理中' :
                             '失敗'}
                          </span>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      {/* 設定對話框 */}
      <Dialog open={showSettingsDialog} onOpenChange={setShowSettingsDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>設定</DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            <div>
              <h3 className="font-medium mb-3">通知設定</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="messages">訊息通知</Label>
                  <Checkbox
                    id="messages"
                    checked={notifications.messages}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, messages: checked as boolean })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="gifts">禮物通知</Label>
                  <Checkbox
                    id="gifts"
                    checked={notifications.gifts}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, gifts: checked as boolean })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="matches">配對通知</Label>
                  <Checkbox
                    id="matches"
                    checked={notifications.matches}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, matches: checked as boolean })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="system">系統通知</Label>
                  <Checkbox
                    id="system"
                    checked={notifications.system}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, system: checked as boolean })}
                  />
                </div>
              </div>
            </div>
            <div>
              <h3 className="font-medium mb-3">語言設定</h3>
              <div className="flex space-x-2">
                <Button variant="outline" className="flex-1">繁體中文</Button>
                <Button variant="outline" className="flex-1">English</Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* 頭像上傳對話框 */}
      <Dialog open={showAvatarUpload} onOpenChange={setShowAvatarUpload}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>更換頭像</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-lg">
              <Camera className="w-12 h-12 text-gray-400 mb-4" />
              <p className="text-sm text-gray-500">點擊或拖曳圖片至此處</p>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarUpload}
              />
            </div>
            <Button className="w-full">上傳</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
} 