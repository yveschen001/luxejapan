'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import {
  ChevronLeft,
  Bell,
  Moon,
  Languages,
  HelpCircle,
  ChevronRight,
} from 'lucide-react'
import Link from 'next/link'
import { useTheme } from 'next-themes'

interface SettingGroup {
  title: string
  items: {
    id: string
    icon: React.ReactNode
    label: string
    description?: string
    type: 'link' | 'switch'
    value?: boolean
    href?: string
  }[]
}

export default function SettingsPage() {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()
  const [settings, setSettings] = useState({
    notifications: true,
    matchNotifications: true,
    messageNotifications: true,
  })

  // 等待客户端渲染完成后再显示主题切换,避免水合不匹配
  useEffect(() => {
    setMounted(true)
  }, [])

  const settingGroups: SettingGroup[] = [
    {
      title: '通知设置',
      items: [
        {
          id: 'notifications',
          icon: <Bell className="w-5 h-5 text-blue-600 dark:text-blue-400" />,
          label: '通知提醒',
          description: '开启后可以收到互动消息提醒',
          type: 'switch',
          value: settings.notifications
        },
        {
          id: 'matchNotifications',
          icon: <Bell className="w-5 h-5 text-purple-600 dark:text-purple-400" />,
          label: '配对通知',
          description: '开启后可以收到新的配对提醒',
          type: 'switch',
          value: settings.matchNotifications
        },
        {
          id: 'messageNotifications',
          icon: <Bell className="w-5 h-5 text-green-600 dark:text-green-400" />,
          label: '消息通知',
          description: '开启后可以收到新消息提醒',
          type: 'switch',
          value: settings.messageNotifications
        }
      ]
    },
    {
      title: '显示设置',
      items: [
        {
          id: 'darkMode',
          icon: <Moon className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />,
          label: '深色模式',
          description: '切换深色/浅色主题',
          type: 'switch',
          value: theme === 'dark'
        }
      ]
    },
    {
      title: '其他设置',
      items: [
        {
          id: 'language',
          icon: <Languages className="w-5 h-5 text-green-600 dark:text-green-400" />,
          label: '语言设置',
          description: '切换应用显示语言',
          type: 'link',
          href: '/settings/language'
        },
        {
          id: 'help',
          icon: <HelpCircle className="w-5 h-5 text-blue-600 dark:text-blue-400" />,
          label: '帮助与反馈',
          type: 'link',
          href: '/settings/help'
        }
      ]
    }
  ]

  const handleToggle = (id: string) => {
    if (id === 'darkMode') {
      setTheme(theme === 'dark' ? 'light' : 'dark')
      return
    }
    setSettings(prev => ({
      ...prev,
      [id]: !prev[id as keyof typeof prev]
    }))
  }

  if (!mounted) {
    return null
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-md">
      {/* 顶部导航 */}
      <div className="flex items-center justify-between mb-6">
        <Link href="/profile">
          <Button variant="ghost" size="icon">
            <ChevronLeft className="w-6 h-6" />
          </Button>
        </Link>
        <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">设置</h1>
        <div className="w-10" /> {/* 占位以保持标题居中 */}
      </div>

      {/* 设置列表 */}
      <div className="space-y-6">
        {settingGroups.map(group => (
          <div key={group.title}>
            <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3 px-1">
              {group.title}
            </h2>
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden">
              {group.items.map((item, index) => (
                <div
                  key={item.id}
                  className={`flex items-center justify-between p-4 ${
                    index !== group.items.length - 1 ? 'border-b border-gray-100 dark:border-gray-700' : ''
                  }`}
                >
                  <div className="flex items-center space-x-3 flex-1">
                    <div className="p-2 bg-gray-50 dark:bg-gray-700 rounded-xl">
                      {item.icon}
                    </div>
                    <div className="flex-1">
                      <div className="text-base font-medium text-gray-900 dark:text-gray-100">
                        {item.label}
                      </div>
                      {item.description && (
                        <div className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                          {item.description}
                        </div>
                      )}
                    </div>
                  </div>
                  {item.type === 'switch' ? (
                    <Switch
                      checked={item.value}
                      onCheckedChange={() => handleToggle(item.id)}
                    />
                  ) : (
                    <Link href={item.href || '#'}>
                      <Button variant="ghost" size="icon">
                        <ChevronRight className="w-5 h-5 text-gray-400" />
                      </Button>
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
} 