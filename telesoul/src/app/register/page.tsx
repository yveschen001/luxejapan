'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ChevronRight, ChevronLeft } from 'lucide-react'

interface RegistrationData {
  gender: 'male' | 'female' | null
  birthday: string
  height: number
  weight: number
  ethnicity: string
  eyeColor: string
  relationshipGoals: string[]
  interests: string[]
  voiceCallPreference: 'enabled' | 'disabled' | 'locked'
}

const relationshipGoalOptions = [
  '认真恋爱',
  '结婚',
  '交友',
  '暂时不确定'
]

const interestOptions = [
  '读书',
  '旅行',
  '音乐',
  '电影',
  '美食',
  '运动',
  '摄影',
  '艺术',
  '游戏',
  '科技',
  '投资',
  '宠物',
  '烹饪',
  '手工',
  '园艺'
]

const ethnicityOptions = [
  '汉族',
  '满族',
  '蒙古族',
  '回族',
  '藏族',
  '维吾尔族',
  '其他'
]

const eyeColorOptions = [
  '黑色',
  '棕色',
  '蓝色',
  '绿色',
  '其他'
]

export default function RegisterPage() {
  const [step, setStep] = useState(1)
  const [data, setData] = useState<RegistrationData>({
    gender: null,
    birthday: '',
    height: 170,
    weight: 60,
    ethnicity: '',
    eyeColor: '',
    relationshipGoals: [],
    interests: [],
    voiceCallPreference: 'disabled'
  })

  const updateData = (field: keyof RegistrationData, value: any) => {
    setData({ ...data, [field]: value })
  }

  const calculateZodiac = (birthday: string) => {
    const date = new Date(birthday)
    const month = date.getMonth() + 1
    const day = date.getDate()
    
    if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return '白羊座'
    if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return '金牛座'
    if ((month === 5 && day >= 21) || (month === 6 && day <= 21)) return '双子座'
    if ((month === 6 && day >= 22) || (month === 7 && day <= 22)) return '巨蟹座'
    if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return '狮子座'
    if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return '处女座'
    if ((month === 9 && day >= 23) || (month === 10 && day <= 23)) return '天秤座'
    if ((month === 10 && day >= 24) || (month === 11 && day <= 22)) return '天蝎座'
    if ((month === 11 && day >= 23) || (month === 12 && day <= 21)) return '射手座'
    if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return '摩羯座'
    if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return '水瓶座'
    return '双鱼座'
  }

  const calculateChineseZodiac = (birthday: string) => {
    const year = new Date(birthday).getFullYear()
    const animals = ['鼠', '牛', '虎', '兔', '龙', '蛇', '马', '羊', '猴', '鸡', '狗', '猪']
    return animals[(year - 4) % 12]
  }

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-bold">选择性别</h2>
            <div className="grid grid-cols-2 gap-4">
              <Button
                variant={data.gender === 'male' ? 'default' : 'outline'}
                onClick={() => updateData('gender', 'male')}
                className="h-32"
              >
                👨 男生
              </Button>
              <Button
                variant={data.gender === 'female' ? 'default' : 'outline'}
                onClick={() => updateData('gender', 'female')}
                className="h-32"
              >
                👩 女生
              </Button>
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-bold">生日</h2>
            <Input
              type="date"
              value={data.birthday}
              onChange={(e) => updateData('birthday', e.target.value)}
            />
            {data.birthday && (
              <div className="text-gray-600">
                <p>星座：{calculateZodiac(data.birthday)}</p>
                <p>生肖：{calculateChineseZodiac(data.birthday)}</p>
              </div>
            )}
          </div>
        )

      case 3:
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-bold">身高体重</h2>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                身高 (cm)
              </label>
              <Input
                type="number"
                value={data.height}
                onChange={(e) => updateData('height', parseInt(e.target.value))}
                min={140}
                max={220}
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                体重 (kg)
              </label>
              <Input
                type="number"
                value={data.weight}
                onChange={(e) => updateData('weight', parseInt(e.target.value))}
                min={30}
                max={150}
              />
            </div>
          </div>
        )

      case 4:
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-bold">基本信息</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  民族
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {ethnicityOptions.map((option) => (
                    <Button
                      key={option}
                      variant={data.ethnicity === option ? 'default' : 'outline'}
                      onClick={() => updateData('ethnicity', option)}
                      className="text-sm"
                    >
                      {option}
                    </Button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  眼睛颜色
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {eyeColorOptions.map((option) => (
                    <Button
                      key={option}
                      variant={data.eyeColor === option ? 'default' : 'outline'}
                      onClick={() => updateData('eyeColor', option)}
                      className="text-sm"
                    >
                      {option}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )

      case 5:
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-bold">恋爱目标</h2>
            <div className="grid grid-cols-2 gap-2">
              {relationshipGoalOptions.map((option) => (
                <Button
                  key={option}
                  variant={data.relationshipGoals.includes(option) ? 'default' : 'outline'}
                  onClick={() => {
                    const goals = data.relationshipGoals.includes(option)
                      ? data.relationshipGoals.filter((g) => g !== option)
                      : [...data.relationshipGoals, option]
                    updateData('relationshipGoals', goals)
                  }}
                  className="text-sm"
                >
                  {option}
                </Button>
              ))}
            </div>
          </div>
        )

      case 6:
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-bold">兴趣爱好</h2>
            <p className="text-sm text-gray-600">最多选择10个</p>
            <div className="grid grid-cols-3 gap-2">
              {interestOptions.map((option) => (
                <Button
                  key={option}
                  variant={data.interests.includes(option) ? 'default' : 'outline'}
                  onClick={() => {
                    const interests = data.interests.includes(option)
                      ? data.interests.filter((i) => i !== option)
                      : data.interests.length < 10
                      ? [...data.interests, option]
                      : data.interests
                    updateData('interests', interests)
                  }}
                  disabled={!data.interests.includes(option) && data.interests.length >= 10}
                  className="text-sm"
                >
                  {option}
                </Button>
              ))}
            </div>
          </div>
        )

      case 7:
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-bold">语音通话设置</h2>
            <div className="grid grid-cols-1 gap-4">
              <Button
                variant={data.voiceCallPreference === 'enabled' ? 'default' : 'outline'}
                onClick={() => updateData('voiceCallPreference', 'enabled')}
                className="h-20"
              >
                ✅ 允许语音通话
              </Button>
              <Button
                variant={data.voiceCallPreference === 'disabled' ? 'default' : 'outline'}
                onClick={() => updateData('voiceCallPreference', 'disabled')}
                className="h-20"
              >
                ❌ 不允许语音通话
              </Button>
              <Button
                variant={data.voiceCallPreference === 'locked' ? 'default' : 'outline'}
                onClick={() => updateData('voiceCallPreference', 'locked')}
                className="h-20"
              >
                🔒 仅限好友语音通话
              </Button>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  const isStepValid = () => {
    switch (step) {
      case 1:
        return data.gender !== null
      case 2:
        return data.birthday !== ''
      case 3:
        return data.height >= 140 && data.height <= 220 && data.weight >= 30 && data.weight <= 150
      case 4:
        return data.ethnicity !== '' && data.eyeColor !== ''
      case 5:
        return data.relationshipGoals.length > 0
      case 6:
        return data.interests.length > 0
      case 7:
        return data.voiceCallPreference !== null
      default:
        return false
    }
  }

  const handleSubmit = () => {
    // 这里可以添加提交注册信息的逻辑
    console.log('Registration data:', data)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-md mx-auto">
        {/* 进度条 */}
        <div className="mb-8">
          <div className="h-2 bg-gray-200 rounded-full">
            <div
              className="h-2 bg-blue-500 rounded-full transition-all"
              style={{ width: `${(step / 7) * 100}%` }}
            />
          </div>
          <div className="text-center mt-2 text-sm text-gray-600">
            步骤 {step}/7
          </div>
        </div>

        {/* 步骤内容 */}
        {renderStep()}

        {/* 导航按钮 */}
        <div className="flex justify-between mt-8">
          {step > 1 && (
            <Button
              variant="outline"
              onClick={() => setStep(step - 1)}
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              上一步
            </Button>
          )}
          {step < 7 ? (
            <Button
              className="ml-auto"
              onClick={() => setStep(step + 1)}
              disabled={!isStepValid()}
            >
              下一步
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button
              className="ml-auto"
              onClick={handleSubmit}
              disabled={!isStepValid()}
            >
              完成注册
            </Button>
          )}
        </div>
      </div>
    </div>
  )
} 