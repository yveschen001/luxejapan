import { create } from 'zustand'

export type CallStatus = 'idle' | 'calling' | 'in_call' | 'busy' | 'unavailable'
export type CallType = 'voice' | 'video'

interface CallState {
  status: 'idle' | 'calling' | 'in_call' | 'ended'
  isMinimized: boolean
  callType: 'voice' | 'video' | null
  duration: number
  actions: {
    startCall: (type: 'voice' | 'video') => void
    endCall: () => void
    toggleMinimize: () => void
    updateDuration: () => void
  }
}

export const useCallState = create<CallState>((set) => ({
  status: 'idle',
  isMinimized: false,
  callType: null,
  duration: 0,
  actions: {
    startCall: (type) =>
      set({ status: 'in_call', callType: type, duration: 0 }),
    endCall: () =>
      set({ status: 'ended', callType: null, duration: 0, isMinimized: false }),
    toggleMinimize: () =>
      set((state) => ({ isMinimized: !state.isMinimized })),
    updateDuration: () =>
      set((state) => ({ duration: state.duration + 1 })),
  },
})) 