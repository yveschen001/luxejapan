export interface UserProfile {
  id: string
  nickname: string
  avatar: string
  photos: string[]
  age: number
  height: number
  weight: number
  zodiac: string
  mbti: string
  ethnicity: string
  eyeColor: string
  hairColor: string
  occupation: string
  education: string
  location: string
  country: string
  countryFlag: string
  isOnline: boolean
  coins?: number
  allowsVoiceCall?: boolean
  isPremium?: boolean
  isKYC?: boolean
  language?: string[]
  introduction?: string
  socialMedia?: {
    instagram?: boolean
    facebook?: boolean
    twitter?: boolean
  }
  interests?: string[]
  gender?: 'male' | 'female'
  voiceCallEnabled?: 'all' | 'none' | 'matched'
  isMatched?: boolean
  isInCall: boolean
  lastActive: string
  voiceCallSchedule: {
    [key: string]: {
      enabled: boolean
      start: string
      end: string
    }
  }
}

const mockUsers: Record<string, UserProfile> = {
  '1': {
    id: '1',
    nickname: '小明',
    avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=user1',
    photos: [
      'https://picsum.photos/seed/user1/800/600',
      'https://picsum.photos/seed/user1-2/800/600',
      'https://picsum.photos/seed/user1-3/800/600'
    ],
    age: 25,
    height: 175,
    weight: 65,
    zodiac: '天秤座',
    mbti: 'INFJ',
    ethnicity: '漢族',
    eyeColor: '黑色',
    hairColor: '黑色',
    occupation: '軟體工程師',
    education: '大學',
    location: '台北',
    country: '台灣',
    countryFlag: '🇹🇼',
    isOnline: true,
    allowsVoiceCall: true,
    isPremium: true,
    isKYC: true,
    language: ['中文', '英語'],
    introduction: '喜歡旅行、攝影和美食的工程師，希望能找到一個志同道合的人一起分享生活。',
    socialMedia: {
      instagram: true,
      facebook: true,
      twitter: false
    },
    interests: ['旅行', '攝影', '美食', '編程', '電影'],
    gender: 'male',
    voiceCallEnabled: 'all',
    isMatched: true,
    isInCall: false,
    lastActive: '剛剛',
    voiceCallSchedule: {
      monday: { enabled: true, start: '09:00', end: '22:00' },
      tuesday: { enabled: true, start: '09:00', end: '22:00' },
      wednesday: { enabled: true, start: '09:00', end: '22:00' },
      thursday: { enabled: true, start: '09:00', end: '22:00' },
      friday: { enabled: true, start: '09:00', end: '22:00' },
      saturday: { enabled: true, start: '10:00', end: '23:00' },
      sunday: { enabled: true, start: '10:00', end: '23:00' }
    }
  },
  '2': {
    id: '2',
    nickname: '小紅',
    avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=user2',
    photos: [
      'https://picsum.photos/seed/user2/800/600',
      'https://picsum.photos/seed/user2-2/800/600',
      'https://picsum.photos/seed/user2-3/800/600'
    ],
    age: 23,
    height: 165,
    weight: 50,
    zodiac: '射手座',
    mbti: 'ENFP',
    ethnicity: '漢族',
    eyeColor: '棕色',
    hairColor: '棕色',
    occupation: '平面設計師',
    education: '大學',
    location: '台北',
    country: '台灣',
    countryFlag: '🇹🇼',
    isOnline: true,
    allowsVoiceCall: true,
    isPremium: false,
    isKYC: true,
    language: ['中文', '日語'],
    introduction: '熱愛設計和藝術的創意工作者，喜歡探索新事物，希望能遇到有共同興趣的人。',
    socialMedia: {
      instagram: true,
      facebook: false,
      twitter: true
    },
    interests: ['設計', '藝術', '攝影', '旅行', '音樂'],
    gender: 'female',
    voiceCallEnabled: 'all',
    isMatched: false,
    isInCall: false,
    lastActive: '剛剛',
    voiceCallSchedule: {
      monday: { enabled: true, start: '09:00', end: '22:00' },
      tuesday: { enabled: true, start: '09:00', end: '22:00' },
      wednesday: { enabled: true, start: '09:00', end: '22:00' },
      thursday: { enabled: true, start: '09:00', end: '22:00' },
      friday: { enabled: true, start: '09:00', end: '22:00' },
      saturday: { enabled: true, start: '10:00', end: '23:00' },
      sunday: { enabled: true, start: '10:00', end: '23:00' }
    }
  }
}

export function getMockUser(id: string): UserProfile | null {
  return mockUsers[id] || null
}

export function getAllMockUsers(): UserProfile[] {
  return Object.values(mockUsers)
}

export default mockUsers 