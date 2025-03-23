'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ChevronRight, ChevronLeft } from 'lucide-react'

interface Question {
  id: number
  question: string
  options: {
    text: string
    type: 'E' | 'I' | 'S' | 'N' | 'T' | 'F' | 'J' | 'P'
  }[]
}

const questions: Question[] = [
  {
    id: 1,
    question: '在社交场合中，你通常会：',
    options: [
      { text: '主动与他人交谈，享受社交', type: 'E' },
      { text: '等待他人来搭话，更喜欢独处', type: 'I' }
    ]
  },
  {
    id: 2,
    question: '当面对新信息时，你倾向于：',
    options: [
      { text: '关注具体的事实和细节', type: 'S' },
      { text: '寻找潜在的模式和可能性', type: 'N' }
    ]
  },
  {
    id: 3,
    question: '做决定时，你更看重：',
    options: [
      { text: '逻辑分析和客观事实', type: 'T' },
      { text: '个人价值观和他人感受', type: 'F' }
    ]
  },
  {
    id: 4,
    question: '你更喜欢：',
    options: [
      { text: '按计划行事，提前安排', type: 'J' },
      { text: '保持灵活，随机应变', type: 'P' }
    ]
  },
  {
    id: 5,
    question: '在团队中，你通常：',
    options: [
      { text: '积极参与讨论和互动', type: 'E' },
      { text: '倾听他人想法，谨慎发言', type: 'I' }
    ]
  },
  {
    id: 6,
    question: '解决问题时，你倾向于：',
    options: [
      { text: '使用已有的经验和知识', type: 'S' },
      { text: '探索新的解决方案', type: 'N' }
    ]
  },
  {
    id: 7,
    question: '面对冲突时，你更可能：',
    options: [
      { text: '寻求公平和正义', type: 'T' },
      { text: '维护和谐关系', type: 'F' }
    ]
  },
  {
    id: 8,
    question: '你的工作环境通常是：',
    options: [
      { text: '整洁有序，有明确规则', type: 'J' },
      { text: '灵活自由，可以随时调整', type: 'P' }
    ]
  }
]

const mbtiDescriptions: Record<string, { title: string; description: string }> = {
  'INTJ': {
    title: '建筑师',
    description: '富有想象力和战略性的思考者，一切都要经过深思熟虑。'
  },
  'INTP': {
    title: '逻辑学家',
    description: '富有创新精神的发明家，对知识有着永不满足的渴望。'
  },
  'ENTJ': {
    title: '指挥官',
    description: '大胆且富有想象力的领导者，总是能找到实现目标的方法。'
  },
  'ENTP': {
    title: '辩论家',
    description: '聪明好奇的思想家，不会放过任何智力挑战。'
  },
  'INFJ': {
    title: '提倡者',
    description: '安静而神秘，同时鼓舞人心且不知疲倦的理想主义者。'
  },
  'INFP': {
    title: '调停者',
    description: '诗意善良的理想主义者，总是愿意看到好的一面。'
  },
  'ENFJ': {
    title: '主人公',
    description: '富有魅力和同情心的领导者，能够吸引他人的注意力。'
  },
  'ENFP': {
    title: '探索者',
    description: '热情、创造性和社交能力强的自由精神。'
  },
  'ISTJ': {
    title: '检查者',
    description: '实际且注重事实的个人，可靠性无可比拟。'
  },
  'ISFJ': {
    title: '守护者',
    description: '非常专注、温暖的守护者，总是准备保护所爱之人。'
  },
  'ESTJ': {
    title: '总经理',
    description: '出色的管理者，不可阻挡地让事情发生。'
  },
  'ESFJ': {
    title: '执政官',
    description: '非常尽责、善良的社交者，总是渴望帮助他人。'
  },
  'ISTP': {
    title: '鉴赏家',
    description: '大胆而实际的实验者，擅长使用各种工具。'
  },
  'ISFP': {
    title: '探险家',
    description: '灵活和富有魅力的艺术家，随时准备探索和体验新事物。'
  },
  'ESTP': {
    title: '企业家',
    description: '聪明、精力充沛、善于观察，真正享受生活在边缘。'
  },
  'ESFP': {
    title: '表演者',
    description: '自发的、精力充沛的表演者，热爱生活并享受当下。'
  }
}

export default function MBTIPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<string, number>>({
    E: 0,
    I: 0,
    S: 0,
    N: 0,
    T: 0,
    F: 0,
    J: 0,
    P: 0
  })
  const [showResult, setShowResult] = useState(false)

  const handleAnswer = (type: string) => {
    setAnswers(prev => ({
      ...prev,
      [type]: prev[type] + 1
    }))
  }

  const calculateMBTI = () => {
    const type = [
      answers.E > answers.I ? 'E' : 'I',
      answers.S > answers.N ? 'S' : 'N',
      answers.T > answers.F ? 'T' : 'F',
      answers.J > answers.P ? 'J' : 'P'
    ].join('')
    return type
  }

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1)
    } else {
      setShowResult(true)
    }
  }

  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1)
    }
  }

  if (showResult) {
    const mbtiType = calculateMBTI()
    const result = mbtiDescriptions[mbtiType]

    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h1 className="text-2xl font-bold text-center mb-4">你的 MBTI 类型是</h1>
            <div className="text-4xl font-bold text-center text-blue-600 mb-6">
              {mbtiType}
            </div>
            <div className="text-center mb-6">
              <h2 className="text-xl font-semibold mb-2">{result.title}</h2>
              <p className="text-gray-600">{result.description}</p>
            </div>
            <Button
              className="w-full"
              onClick={() => {
                setCurrentQuestion(0)
                setAnswers({
                  E: 0,
                  I: 0,
                  S: 0,
                  N: 0,
                  T: 0,
                  F: 0,
                  J: 0,
                  P: 0
                })
                setShowResult(false)
              }}
            >
              重新测试
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-md mx-auto">
        {/* 进度条 */}
        <div className="mb-8">
          <div className="h-2 bg-gray-200 rounded-full">
            <div
              className="h-2 bg-blue-500 rounded-full transition-all"
              style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
            />
          </div>
          <div className="text-center mt-2 text-sm text-gray-600">
            问题 {currentQuestion + 1}/{questions.length}
          </div>
        </div>

        {/* 问题内容 */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold mb-6">
            {questions[currentQuestion].question}
          </h2>
          <div className="space-y-4">
            {questions[currentQuestion].options.map((option, index) => (
              <Button
                key={index}
                variant="outline"
                className="w-full h-auto py-4 text-left"
                onClick={() => {
                  handleAnswer(option.type)
                  handleNext()
                }}
              >
                {option.text}
              </Button>
            ))}
          </div>
        </div>

        {/* 导航按钮 */}
        <div className="flex justify-between mt-8">
          {currentQuestion > 0 && (
            <Button
              variant="outline"
              onClick={handleBack}
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              上一题
            </Button>
          )}
        </div>
      </div>
    </div>
  )
} 