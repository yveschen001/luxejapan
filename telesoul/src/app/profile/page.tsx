'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { 
  Gift, Diamond, Edit2, AlertCircle, ChevronRight, MessageCircle, 
  Settings, Facebook, Instagram, Twitter, Bell, Globe, Wallet,
  Camera, X, Check, Share2, ChevronDown, ChevronLeft, Save,
  User, Heart, Cake, Ruler, Scale, Users2, Languages, MapPin, Copy
} from 'lucide-react'
import { toast } from 'sonner'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'

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
  birthday: string
  height: number
  weight: number
  race: string
  language: string
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
  name: string
  location: string
  voiceCallSchedule: {
    [key: string]: { enabled: boolean; start: string; end: string }
  }
  walletAddress?: string
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
  const router = useRouter()
  const [user, setUser] = useState<UserProfile>({
    avatar: '/avatar.jpg',
    nickname: '张三',
    city: '台北',
    bio: '热爱生活，享受当下',
    mbti: 'INFJ',
    mbtiDescription: '理想主义者 - 富有同情心、创造力和理想主义的性格类型',
    zodiac: '天蝎座',
    chineseZodiac: '兔',
    gender: 'male',
    birthday: '1990-01-01',
    height: 175,
    weight: 70,
    race: '亚洲',
    language: '中文',
    eyeColor: '黑色',
    interests: ['旅行', '摄影', '美食', '音乐'],
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
    ],
    name: '张三',
    location: '台北',
    voiceCallSchedule: {
      monday: { enabled: true, start: '09:00', end: '22:00' },
      tuesday: { enabled: true, start: '09:00', end: '22:00' },
      wednesday: { enabled: true, start: '09:00', end: '22:00' },
      thursday: { enabled: true, start: '09:00', end: '22:00' },
      friday: { enabled: true, start: '09:00', end: '22:00' },
      saturday: { enabled: true, start: '10:00', end: '23:00' },
      sunday: { enabled: true, start: '10:00', end: '23:00' }
    },
    walletAddress: 'EQD...xK9'
  })

  const [balance] = useState({
    coins: 280,
    diamonds: 1200
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
  const [showScheduleDialog, setShowScheduleDialog] = useState(false)
  const [showWalletBindDialog, setShowWalletBindDialog] = useState(false)
  const [allowSocialLink, setAllowSocialLink] = useState(false)
  const [notifications, setNotifications] = useState({
    messages: true,
    gifts: true,
    matches: true,
    system: true
  })

  const [copied, setCopied] = useState(false)

  const handleBack = () => {
    router.back()
  }

  const handleSave = () => {
    setShowEditDialog(false)
    toast.success('個人資料已更新')
  }

  const handleCancel = () => {
    setShowEditDialog(false)
  }

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setUser(prev => ({
          ...prev,
          avatar: reader.result as string
        }))
        toast.success('頭像已更新')
      }
      reader.readAsDataURL(file)
    }
    setShowAvatarUpload(false)
  }

  const handleSocialLinkChange = (checked: boolean) => {
    setAllowSocialLink(checked)
    toast.success(checked ? '已允許其他人連結您的社交媒體' : '已取消允許其他人連結您的社交媒體')
  }

  const handleScheduleSave = () => {
    setShowScheduleDialog(false)
    toast.success('通話時間已更新')
  }

  const handleCopyAddress = () => {
    if (user.walletAddress) {
      navigator.clipboard.writeText(user.walletAddress)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
      toast.success('錢包地址已複製')
    }
  }

  const handleSocialMediaLink = (platform: keyof UserProfile['socialMedia']) => {
    toast.success(`${platform} 連結成功`)
  }

  // 添加兴趣选项
  const interestOptions = [
    '旅行', '攝影', '美食', '音樂', '電影', '閱讀', '運動', '健身', '瑜伽', '舞蹈',
    '繪畫', '書法', '手工藝', '園藝', '寵物', '咖啡', '茶藝', '紅酒', '時尚', '購物',
    '遊戲', '動漫', '科技', '投資', '烹飪', '露營', '登山', '游泳', '滑雪', '潛水'
  ]

  // 修改兴趣爱好的编辑功能
  const handleInterestToggle = (interest: string) => {
    setUser(prev => {
      const currentInterests = prev.interests
      if (currentInterests.includes(interest)) {
        return {
          ...prev,
          interests: currentInterests.filter(i => i !== interest)
        }
      } else if (currentInterests.length < 5) {
        return {
          ...prev,
          interests: [...currentInterests, interest]
        }
      } else {
        toast.error('最多只能選擇5個興趣愛好')
        return prev
      }
    })
  }

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      {/* 头部导航 */}
      <div className="sticky top-0 z-50 flex items-center justify-between px-4 py-3 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleBack}
            className="-ml-2"
          >
            <ChevronLeft className="w-6 h-6" />
          </Button>
          <h1 className="text-2xl font-bold ml-3">
            個人資料
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push('/profile/settings')}
          >
            <Settings className="w-5 h-5" />
          </Button>
          {showEditDialog ? (
            <>
              <Button variant="outline" onClick={handleCancel} className="gap-2">
                <X className="w-4 h-4" />
                取消
              </Button>
              <Button onClick={handleSave} className="gap-2">
                <Save className="w-4 h-4" />
                保存
              </Button>
            </>
          ) : (
            <Button onClick={() => setShowEditDialog(true)} className="gap-2">
              <Edit2 className="w-4 h-4" />
              編輯
            </Button>
          )}
        </div>
      </div>

      <div className="container mx-auto p-4 space-y-8 max-w-2xl">
        {/* 头像和基本信息 */}
        <Card className="border-none shadow-none bg-transparent">
          <CardContent className="px-0">
            <div className="flex flex-col items-center">
              <div className="relative cursor-pointer mb-6" onClick={() => setShowAvatarUpload(true)}>
                <Avatar className="w-32 h-32">
                  <AvatarImage src={user.avatar} alt={user.nickname} />
                  <AvatarFallback className="bg-primary/10">
                    {user.nickname.substring(0, 2)}
                  </AvatarFallback>
                </Avatar>
                {showEditDialog && (
                  <div className="absolute bottom-0 right-0 p-2 rounded-full bg-background">
                    <Camera className="w-5 h-5" />
                  </div>
                )}
              </div>
              <div className="text-center mb-8">
                <div className="flex items-center justify-center gap-2 mb-3">
                  {showEditDialog ? (
                    <Input
                      value={user.nickname}
                      onChange={(e) => setUser(prev => ({ ...prev, nickname: e.target.value }))}
                      className="text-center text-2xl font-bold w-48"
                    />
                  ) : (
                    <h2 className="text-3xl font-bold">{user.name}</h2>
                  )}
                  {user.gender === 'male' ? (
                    <User className="w-6 h-6 text-blue-500" />
                  ) : (
                    <Heart className="w-6 h-6 text-pink-500" />
                  )}
                </div>
                {showEditDialog ? (
                  <Input
                    value={user.bio}
                    onChange={(e) => setUser(prev => ({ ...prev, bio: e.target.value }))}
                    placeholder="請輸入自我介紹"
                    className="text-center"
                  />
                ) : (
                  <p className="text-lg text-muted-foreground">{user.bio}</p>
                )}
              </div>
              
              {/* 钱包信息 */}
              {!showEditDialog && (
                <div className="flex justify-center mb-8">
                  <Button
                    variant="outline"
                    size="lg"
                    className="h-12 px-6 gap-3 rounded-full hover:bg-primary/5"
                    onClick={() => setShowWalletDialog(true)}
                  >
                    <Wallet className="w-5 h-5 text-primary" />
                    <span className="font-medium">{balance.coins} 金幣</span>
                  </Button>
                </div>
              )}

              {/* 基本信息卡片网格 */}
              {showEditDialog ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 w-full">
                  <div className="space-y-2">
                    <Label>生日</Label>
                    <Input
                      type="date"
                      value={user.birthday}
                      onChange={(e) => setUser(prev => ({ ...prev, birthday: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>身高 (cm)</Label>
                    <Input
                      type="number"
                      value={user.height}
                      onChange={(e) => setUser(prev => ({ ...prev, height: parseInt(e.target.value) }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>體重 (kg)</Label>
                    <Input
                      type="number"
                      value={user.weight}
                      onChange={(e) => setUser(prev => ({ ...prev, weight: parseInt(e.target.value) }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>種族</Label>
                    <Input
                      value={user.race}
                      onChange={(e) => setUser(prev => ({ ...prev, race: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>語言</Label>
                    <Input
                      value={user.language}
                      onChange={(e) => setUser(prev => ({ ...prev, language: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>所在城市</Label>
                    <Input
                      value={user.city}
                      onChange={(e) => setUser(prev => ({ ...prev, city: e.target.value }))}
                    />
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 w-full">
                  <div className="flex items-center gap-3 p-4 rounded-xl bg-card border border-border">
                    <Cake className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <div className="text-sm text-muted-foreground">生日</div>
                      <div className="text-base font-medium">{user.birthday}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-4 rounded-xl bg-card border border-border">
                    <Ruler className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <div className="text-sm text-muted-foreground">身高</div>
                      <div className="text-base font-medium">{user.height} cm</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-4 rounded-xl bg-card border border-border">
                    <Scale className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <div className="text-sm text-muted-foreground">體重</div>
                      <div className="text-base font-medium">{user.weight} kg</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-4 rounded-xl bg-card border border-border">
                    <Users2 className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <div className="text-sm text-muted-foreground">種族</div>
                      <div className="text-base font-medium">{user.race}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-4 rounded-xl bg-card border border-border">
                    <Languages className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <div className="text-sm text-muted-foreground">語言</div>
                      <div className="text-base font-medium">{user.language}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-4 rounded-xl bg-card border border-border">
                    <MapPin className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <div className="text-sm text-muted-foreground">城市</div>
                      <div className="text-base font-medium">{user.city}</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* MBTI 性格测试 */}
        <Card className="border-none shadow-none bg-transparent">
          <CardHeader className="px-0">
            <CardTitle className="text-2xl font-bold">MBTI 性格測試</CardTitle>
          </CardHeader>
          <CardContent className="px-0">
            <div className="space-y-4">
              <div className="p-4 bg-card border border-border rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-base font-medium">{user.mbti}</div>
                  {showEditDialog && (
                    <Button variant="outline" onClick={() => {
                      toast.success('已發送重新測試請求')
                    }}>
                      重新測試
                    </Button>
                  )}
                </div>
                <div className="text-sm text-muted-foreground">{user.mbtiDescription}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 兴趣爱好 */}
        <Card className="border-none shadow-none bg-transparent">
          <CardHeader className="px-0">
            <CardTitle className="text-2xl font-bold">興趣愛好</CardTitle>
          </CardHeader>
          <CardContent className="px-0">
            {showEditDialog ? (
              <div className="space-y-4">
                <div className="text-sm text-muted-foreground">
                  已選擇 {user.interests.length}/5 個興趣愛好
                </div>
                <div className="flex flex-wrap gap-2">
                  {interestOptions.map((interest) => (
                    <Badge
                      key={interest}
                      variant={user.interests.includes(interest) ? "default" : "outline"}
                      className="cursor-pointer text-sm px-3 py-1"
                      onClick={() => handleInterestToggle(interest)}
                    >
                      {interest}
                    </Badge>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {user.interests.map((interest, index) => (
                  <Badge key={index} variant="secondary" className="text-sm px-3 py-1">
                    {interest}
                  </Badge>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {!showEditDialog && (
          <>
            {/* 社交媒體綁定 */}
            <Card className="border-none shadow-none bg-transparent">
              <CardHeader className="px-0">
                <CardTitle className="text-2xl font-bold">社交媒體</CardTitle>
              </CardHeader>
              <CardContent className="px-0">
                <div className="flex items-center justify-between p-4 bg-card border border-border rounded-xl">
                  <div className="flex items-center gap-4">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-12 w-12 rounded-xl hover:bg-primary/10"
                      onClick={() => handleSocialMediaLink('facebook')}
                    >
                      <Facebook className="w-5 h-5" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-12 w-12 rounded-xl hover:bg-primary/10"
                      onClick={() => handleSocialMediaLink('instagram')}
                    >
                      <Instagram className="w-5 h-5" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-12 w-12 rounded-xl hover:bg-primary/10"
                      onClick={() => handleSocialMediaLink('twitter')}
                    >
                      <Twitter className="w-5 h-5" />
                    </Button>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="allowSocialLink"
                      checked={allowSocialLink}
                      onCheckedChange={handleSocialLinkChange}
                      className="border-primary data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
                    />
                    <Label htmlFor="allowSocialLink" className="text-sm text-muted-foreground">
                      允許其他人連結我的社交媒體
                    </Label>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 我的广场 */}
            <div className="bg-card border border-border rounded-2xl shadow-lg overflow-hidden">
              <div className="px-6 py-4 border-b border-border">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold">我的广场</h2>
                  <Link href="/square/my" className="text-sm font-medium text-primary flex items-center hover:text-primary/80">
                    更多内容 <ChevronRight className="w-4 h-4 ml-1" />
                  </Link>
                </div>
                <Tabs defaultValue="my" className="w-full">
                  <TabsList className="w-full">
                    <TabsTrigger value="my" className="flex-1">我的广场</TabsTrigger>
                    <TabsTrigger value="liked" className="flex-1">喜欢的广场</TabsTrigger>
                  </TabsList>
                  <TabsContent value="my">
                    <div className="divide-y divide-border">
                      {user.posts.slice(0, 5).map(post => (
                        <div key={post.id} className="p-6">
                          <div className="text-base text-foreground mb-3 leading-relaxed">{post.content}</div>
                          {post.image && (
                            <div className="relative w-full h-[240px] mb-3 rounded-xl overflow-hidden">
                              <Image
                                src={post.image}
                                alt={post.content}
                                fill
                                className="object-cover"
                                sizes="(max-width: 768px) 100vw, 50vw"
                              />
                            </div>
                          )}
                          <div className="flex items-center text-sm text-muted-foreground">
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
                  </TabsContent>
                  <TabsContent value="liked">
                    <div className="divide-y divide-border">
                      {user.posts.slice(0, 5).map(post => (
                        <div key={post.id} className="p-6">
                          <div className="flex items-center gap-3 mb-3">
                            <Avatar className="w-8 h-8">
                              <AvatarImage src={user.avatar} alt={user.nickname} />
                              <AvatarFallback>{user.nickname.substring(0, 2)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="text-sm font-medium">{user.nickname}</div>
                              <div className="text-xs text-muted-foreground">2小時前</div>
                            </div>
                          </div>
                          <div className="text-base text-foreground mb-3 leading-relaxed">{post.content}</div>
                          {post.image && (
                            <div className="relative w-full h-[240px] mb-3 rounded-xl overflow-hidden">
                              <Image
                                src={post.image}
                                alt={post.content}
                                fill
                                className="object-cover"
                                sizes="(max-width: 768px) 100vw, 50vw"
                              />
                            </div>
                          )}
                          <div className="flex items-center text-sm text-muted-foreground">
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
                  </TabsContent>
                </Tabs>
              </div>
            </div>

            {/* 其他功能按钮 */}
            <div className="space-y-3">
              <Button
                variant="outline"
                className="w-full justify-between h-14 text-base font-medium rounded-xl border-border hover:bg-muted"
                onClick={() => setShowWalletDialog(true)}
              >
                <div className="flex items-center">
                  <Wallet className="w-5 h-5 mr-3 text-muted-foreground" />
                  <span>我的錢包</span>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </Button>
            </div>
          </>
        )}

        {/* 添加任务卡片 */}
        <Card className="border-none shadow-none bg-transparent">
          <CardHeader className="px-0">
            <CardTitle className="text-2xl font-bold">每日任務</CardTitle>
          </CardHeader>
          <CardContent className="px-0">
            <div className="space-y-4">
              {/* 任务项 */}
              <div className="flex items-center p-4 bg-card border border-border rounded-xl">
                <div className="flex-1 mr-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-base font-medium">完善個人資料</div>
                    <Button
                      variant="primary"
                      size="sm"
                      className="h-8 px-3 rounded-full"
                    >
                      去完成
                    </Button>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-primary" style={{ width: '60%' }} />
                    </div>
                    <span className="text-sm text-muted-foreground">3/5</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center p-4 bg-card border border-border rounded-xl">
                <div className="flex-1 mr-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-base font-medium">完成 MBTI 測試</div>
                    <Button
                      variant="primary"
                      size="sm"
                      className="h-8 px-3 rounded-full"
                    >
                      去完成
                    </Button>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-primary" style={{ width: '0%' }} />
                    </div>
                    <span className="text-sm text-muted-foreground">0/1</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center p-4 bg-card border border-border rounded-xl">
                <div className="flex-1 mr-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-base font-medium">發布動態</div>
                    <Button
                      variant="primary"
                      size="sm"
                      className="h-8 px-3 rounded-full"
                    >
                      去完成
                    </Button>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-primary" style={{ width: '33%' }} />
                    </div>
                    <span className="text-sm text-muted-foreground">1/3</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center p-4 bg-card border border-border rounded-xl">
                <div className="flex-1 mr-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-base font-medium">綁定社交媒體</div>
                    <Button
                      variant="primary"
                      size="sm"
                      className="h-8 px-3 rounded-full"
                    >
                      去完成
                    </Button>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-primary" style={{ width: '0%' }} />
                    </div>
                    <span className="text-sm text-muted-foreground">0/2</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 头像上传对话框 */}
      <Dialog open={showAvatarUpload} onOpenChange={setShowAvatarUpload}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>更換頭像</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center gap-4">
            <div className="relative w-32 h-32 rounded-full overflow-hidden mb-4">
              <Image
                src={user.avatar}
                alt="當前頭像"
                fill
                className="object-cover"
              />
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={handleAvatarUpload}
              className="hidden"
              id="avatar-upload"
            />
            <label
              htmlFor="avatar-upload"
              className="cursor-pointer flex items-center justify-center w-full h-32 border-2 border-dashed rounded-lg hover:border-primary"
            >
              <div className="flex flex-col items-center gap-2">
                <Camera className="w-8 h-8 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">點擊上傳新圖片</span>
              </div>
            </label>
          </div>
        </DialogContent>
      </Dialog>

      {/* 钱包对话框 */}
      <Dialog open={showWalletDialog} onOpenChange={setShowWalletDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">我的錢包</DialogTitle>
          </DialogHeader>
          <Tabs defaultValue="coins">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="coins">金幣</TabsTrigger>
              <TabsTrigger value="diamonds">鑽石</TabsTrigger>
            </TabsList>
            <TabsContent value="coins">
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-muted rounded-xl">
                  <div>
                    <div className="text-sm text-muted-foreground">金幣餘額</div>
                    <div className="text-2xl font-bold">{balance.coins}</div>
                  </div>
                  <Button>充值</Button>
                </div>
                <div className="space-y-3">
                  <h3 className="text-xl font-bold">交易記錄</h3>
                  {transactions
                    .filter(t => t.type !== 'withdraw')
                    .slice(0, 5)
                    .map(transaction => (
                      <div key={transaction.id} className="flex items-center justify-between p-4 bg-muted rounded-xl">
                        <div>
                          <div className="text-base font-medium">{transaction.description}</div>
                          <div className="text-sm text-muted-foreground">{transaction.date}</div>
                        </div>
                        <div className={`text-base font-medium ${transaction.type === 'recharge' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                          {transaction.type === 'recharge' ? '+' : '-'}{transaction.amount}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </TabsContent>
            <TabsContent value="diamonds">
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-muted rounded-xl">
                  <div>
                    <div className="text-sm text-muted-foreground">鑽石餘額</div>
                    <div className="text-2xl font-bold">{balance.diamonds}</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div 
                      className="flex items-center gap-2 px-3 py-2 rounded-lg bg-card hover:bg-muted cursor-pointer transition-colors"
                      onClick={() => setShowWalletBindDialog(true)}
                    >
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <svg 
                          viewBox="0 0 24 24" 
                          className="w-5 h-5 text-primary"
                          fill="currentColor"
                        >
                          <path d="M12 2L2 7L12 12L22 7L12 2Z" />
                          <path d="M2 17L12 22L22 17" />
                          <path d="M2 12L12 17L22 12" />
                        </svg>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">TON 錢包</div>
                        <div className="text-xs text-muted-foreground">
                          {user.walletAddress ? user.walletAddress : '未綁定'}
                        </div>
                      </div>
                    </div>
                    <Button>提現</Button>
                  </div>
                </div>
                <div className="space-y-3">
                  <h3 className="text-xl font-bold">提現記錄</h3>
                  {transactions
                    .filter(t => t.type === 'withdraw')
                    .slice(0, 5)
                    .map(transaction => (
                      <div key={transaction.id} className="flex items-center justify-between p-4 bg-muted rounded-xl">
                        <div>
                          <div className="text-base font-medium">{transaction.description}</div>
                          <div className="text-sm text-muted-foreground">{transaction.date}</div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-base font-medium text-red-600 dark:text-red-400">-{transaction.amount}</span>
                          <span className={`text-sm ${
                            transaction.status === 'completed' ? 'text-green-600 dark:text-green-400' :
                            transaction.status === 'pending' ? 'text-yellow-600 dark:text-yellow-400' :
                            'text-red-600 dark:text-red-400'
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

      {/* 添加钱包绑定对话框 */}
      <Dialog open={showWalletBindDialog} onOpenChange={setShowWalletBindDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">綁定 TON 錢包</DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            <div className="p-4 bg-muted rounded-xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <svg 
                    viewBox="0 0 24 24" 
                    className="w-5 h-5 text-primary"
                    fill="currentColor"
                  >
                    <path d="M12 2L2 7L12 12L22 7L12 2Z" />
                    <path d="M2 17L12 22L22 17" />
                    <path d="M2 12L12 17L22 12" />
                  </svg>
                </div>
                <div>
                  <div className="text-base font-medium">TON 錢包</div>
                  <div className="text-sm text-muted-foreground">綁定後可進行鑽石提現</div>
                </div>
              </div>
              <div className="space-y-2">
                <Label>錢包地址</Label>
                <div className="flex items-center gap-2">
                  <Input
                    value={user.walletAddress}
                    onChange={(e) => setUser(prev => ({ ...prev, walletAddress: e.target.value }))}
                    placeholder="請輸入 TON 錢包地址"
                    className="font-mono"
                  />
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={handleCopyAddress}
                    className="relative"
                  >
                    {copied ? (
                      <Check className="w-4 h-4 text-green-500" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowWalletBindDialog(false)}>
                取消
              </Button>
              <Button onClick={() => {
                setShowWalletBindDialog(false)
                toast.success('錢包綁定成功')
              }}>
                確認綁定
              </Button>
            </div>
          </div>
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

      {/* 通话时间设置对话框 */}
      <Dialog open={showScheduleDialog} onOpenChange={setShowScheduleDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>設置通話時間</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {Object.entries(user.voiceCallSchedule).map(([day, schedule]) => (
              <div key={day} className="flex items-center gap-4 p-4 rounded-lg bg-card">
                <div className="w-24">
                  <Label className="capitalize text-base">{day}</Label>
                </div>
                <Switch
                  checked={schedule.enabled}
                  onCheckedChange={(checked) => {
                    setUser(prev => ({
                      ...prev,
                      voiceCallSchedule: {
                        ...prev.voiceCallSchedule,
                        [day]: { ...prev.voiceCallSchedule[day], enabled: checked }
                      }
                    }))
                  }}
                />
                {schedule.enabled && (
                  <div className="flex items-center gap-2">
                    <Input
                      type="time"
                      value={schedule.start}
                      onChange={(e) => {
                        setUser(prev => ({
                          ...prev,
                          voiceCallSchedule: {
                            ...prev.voiceCallSchedule,
                            [day]: { ...prev.voiceCallSchedule[day], start: e.target.value }
                          }
                        }))
                      }}
                      className="w-32"
                    />
                    <span>至</span>
                    <Input
                      type="time"
                      value={schedule.end}
                      onChange={(e) => {
                        setUser(prev => ({
                          ...prev,
                          voiceCallSchedule: {
                            ...prev.voiceCallSchedule,
                            [day]: { ...prev.voiceCallSchedule[day], end: e.target.value }
                          }
                        }))
                      }}
                      className="w-32"
                    />
                  </div>
                )}
              </div>
            ))}
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowScheduleDialog(false)}>
                取消
              </Button>
              <Button onClick={handleScheduleSave}>
                保存
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
} 