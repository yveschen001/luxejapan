'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { ChevronLeft, Bell, Lock, Phone, Globe, Moon, Sun, Save } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export default function SettingsPage() {
  const router = useRouter()
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [allowsVoiceCall, setAllowsVoiceCall] = useState(true)
  const [voiceCallSchedule, setVoiceCallSchedule] = useState({
    monday: { enabled: true, start: '09:00', end: '22:00' },
    tuesday: { enabled: true, start: '09:00', end: '22:00' },
    wednesday: { enabled: true, start: '09:00', end: '22:00' },
    thursday: { enabled: true, start: '09:00', end: '22:00' },
    friday: { enabled: true, start: '09:00', end: '22:00' },
    saturday: { enabled: true, start: '10:00', end: '23:00' },
    sunday: { enabled: true, start: '10:00', end: '23:00' }
  })

  const handleBack = () => {
    router.back()
  }

  const handleSave = () => {
    // TODO: 保存设置到后端
    console.log('保存设置:', {
      allowsVoiceCall,
      voiceCallSchedule
    })
    router.back()
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* 头部导航 */}
      <div className="sticky top-0 z-50 flex items-center justify-between px-4 py-3 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleBack}
            className="-ml-2"
          >
            <ChevronLeft className="w-6 h-6" />
          </Button>
          <h1 className="text-lg font-semibold ml-3">
            設置
          </h1>
        </div>
        <Button onClick={handleSave} className="gap-2">
          <Save className="w-4 h-4" />
          保存
        </Button>
      </div>

      <div className="container mx-auto p-4 space-y-6 max-w-2xl">
        {/* 通话设置 */}
        <Card className="border-none shadow-none bg-transparent">
          <CardHeader className="px-0">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Phone className="w-5 h-5" />
              通話設置
            </CardTitle>
          </CardHeader>
          <CardContent className="px-0 space-y-6">
            <div className="flex items-center justify-between p-4 rounded-lg bg-card">
              <div className="space-y-0.5">
                <Label className="text-base">允許語音通話</Label>
                <p className="text-sm text-muted-foreground">
                  開啟後其他用戶可以與您進行語音通話
                </p>
              </div>
              <Switch
                checked={allowsVoiceCall}
                onCheckedChange={setAllowsVoiceCall}
              />
            </div>

            {allowsVoiceCall && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-base">通話時間設置</Label>
                  <p className="text-sm text-muted-foreground">
                    設置您願意接聽通話的時間段
                  </p>
                </div>
                
                {Object.entries(voiceCallSchedule).map(([day, schedule]) => (
                  <div key={day} className="flex items-center gap-4 p-4 rounded-lg bg-card">
                    <div className="w-24">
                      <Label className="capitalize text-base">{day}</Label>
                    </div>
                    <Switch
                      checked={schedule.enabled}
                      onCheckedChange={(checked) => {
                        setVoiceCallSchedule(prev => ({
                          ...prev,
                          [day]: { ...prev[day], enabled: checked }
                        }))
                      }}
                    />
                    {schedule.enabled && (
                      <div className="flex items-center gap-2">
                        <Input
                          type="time"
                          value={schedule.start}
                          onChange={(e) => {
                            setVoiceCallSchedule(prev => ({
                              ...prev,
                              [day]: { ...prev[day], start: e.target.value }
                            }))
                          }}
                          className="w-32"
                        />
                        <span>至</span>
                        <Input
                          type="time"
                          value={schedule.end}
                          onChange={(e) => {
                            setVoiceCallSchedule(prev => ({
                              ...prev,
                              [day]: { ...prev[day], end: e.target.value }
                            }))
                          }}
                          className="w-32"
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* 通知设置 */}
        <Card className="border-none shadow-none bg-transparent">
          <CardHeader className="px-0">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Bell className="w-5 h-5" />
              通知設置
            </CardTitle>
          </CardHeader>
          <CardContent className="px-0 space-y-4">
            <div className="flex items-center justify-between p-4 rounded-lg bg-card">
              <div className="space-y-0.5">
                <Label className="text-base">新消息通知</Label>
                <p className="text-sm text-muted-foreground">
                  接收新消息的推送通知
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between p-4 rounded-lg bg-card">
              <div className="space-y-0.5">
                <Label className="text-base">通話請求通知</Label>
                <p className="text-sm text-muted-foreground">
                  接收通話請求的推送通知
                </p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>

        {/* 隐私设置 */}
        <Card className="border-none shadow-none bg-transparent">
          <CardHeader className="px-0">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Lock className="w-5 h-5" />
              隱私設置
            </CardTitle>
          </CardHeader>
          <CardContent className="px-0 space-y-4">
            <div className="flex items-center justify-between p-4 rounded-lg bg-card">
              <div className="space-y-0.5">
                <Label className="text-base">在線狀態</Label>
                <p className="text-sm text-muted-foreground">
                  顯示您的在線狀態
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between p-4 rounded-lg bg-card">
              <div className="space-y-0.5">
                <Label className="text-base">最後上線時間</Label>
                <p className="text-sm text-muted-foreground">
                  顯示您的最後上線時間
                </p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>

        {/* 主题设置 */}
        <Card className="border-none shadow-none bg-transparent">
          <CardHeader className="px-0">
            <CardTitle className="flex items-center gap-2 text-lg">
              {isDarkMode ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
              主題設置
            </CardTitle>
          </CardHeader>
          <CardContent className="px-0">
            <div className="flex items-center justify-between p-4 rounded-lg bg-card">
              <div className="space-y-0.5">
                <Label className="text-base">深色模式</Label>
                <p className="text-sm text-muted-foreground">
                  切換深色/淺色主題
                </p>
              </div>
              <Switch
                checked={isDarkMode}
                onCheckedChange={setIsDarkMode}
              />
            </div>
          </CardContent>
        </Card>

        {/* 语言设置 */}
        <Card className="border-none shadow-none bg-transparent">
          <CardHeader className="px-0">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Globe className="w-5 h-5" />
              語言設置
            </CardTitle>
          </CardHeader>
          <CardContent className="px-0">
            <div className="p-4 rounded-lg bg-card">
              <Select defaultValue="zh-TW">
                <SelectTrigger>
                  <SelectValue placeholder="選擇語言" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="zh-TW">繁體中文</SelectItem>
                  <SelectItem value="en-US">English</SelectItem>
                  <SelectItem value="ja-JP">日本語</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 