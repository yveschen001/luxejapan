export interface ChatMessage {
  id: string
  senderId: string
  receiverId: string
  content: string
  timestamp: Date
  isRead: boolean
}

export const mockChatMessages: ChatMessage[] = [
  {
    id: '1',
    senderId: 'user1',
    receiverId: 'user2',
    content: '你好啊！很高兴认识你 👋',
    timestamp: new Date('2024-03-23T10:00:00'),
    isRead: true
  },
  {
    id: '2',
    senderId: 'user2',
    receiverId: 'user1',
    content: '你好！我也很高兴认识你 😊',
    timestamp: new Date('2024-03-23T10:01:00'),
    isRead: true
  },
  {
    id: '3',
    senderId: 'user1',
    receiverId: 'user2',
    content: '你平时喜欢做什么？',
    timestamp: new Date('2024-03-23T10:02:00'),
    isRead: true
  },
  {
    id: '4',
    senderId: 'user2',
    receiverId: 'user1',
    content: '我喜欢看书、听音乐，偶尔也会去爬山。你呢？',
    timestamp: new Date('2024-03-23T10:03:00'),
    isRead: false
  }
] 