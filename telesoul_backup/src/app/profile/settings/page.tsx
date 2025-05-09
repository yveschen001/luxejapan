'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { ChevronLeft, Bell, Lock, Phone, Globe, Moon, Sun } from 'lucide-react'
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
            設置
          </h1>
        </div>
        <Button onClick={handleSave}>保存</Button>
      </div>

      <div className="container mx-auto p-4 space-y-6">
        {/* 通话设置 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Phone className="w-5 h-5" />
              通話設置
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>允許語音通話</Label>
                <p className="text-sm text-gray-500 dark:text-gray-400">
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
                  <Label>通話時間設置</Label>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    設置您願意接聽通話的時間段
                  </p>
                </div>
                
                {Object.entries(voiceCallSchedule).map(([day, schedule]) => (
                  <div key={day} className="flex items-center gap-4">
                    <div className="w-24">
                      <Label className="capitalize">{day}</Label>
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
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5" />
              通知設置
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>新消息通知</Label>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  接收新消息的推送通知
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>通話請求通知</Label>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  接收通話請求的推送通知
                </p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>

        {/* 隐私设置 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="w-5 h-5" />
              隱私設置
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>在線狀態</Label>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  顯示您的在線狀態
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>最後上線時間</Label>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  顯示您的最後上線時間
                </p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>

        {/* 主题设置 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {isDarkMode ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
              主題設置
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>深色模式</Label>
                <p className="text-sm text-gray-500 dark:text-gray-400">
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
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="w-5 h-5" />
              語言設置
            </CardTitle>
          </CardHeader>
          <CardContent>
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
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 