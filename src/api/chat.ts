import api from './client'
import type { Message, Thread, ThreadSummary } from '@/types/Chat'

export async function createThread(dienstleistungId: string): Promise<Thread> {
  try {
    const response = await api.post<Thread>('/chat/threads', { dienstleistungId })
    console.log("createThread response", response.data);
    return response.data
  } catch (error) {
    console.error('[CHAT API] createThread failed:', error)
    throw error
  }
}

export async function getMyThreads(): Promise<ThreadSummary[]> {
  try {
    const response = await api.get<ThreadSummary[]>('/chat/threads')
    return response.data
  } catch (error) {
    console.error('[CHAT API] getMyThreads failed:', error)
    throw error
  }
}

export async function getUnreadCount(): Promise<number> {
  try {
    const response = await api.get<{ unreadCount: number }>('/chat/unread-count')
    return response.data.unreadCount
  } catch (error) {
    console.error('[CHAT API] getUnreadCount failed:', error)
    return 0
  }
}

export async function markThreadRead(threadId: string): Promise<void> {
  try {
    await api.post(`/chat/threads/${threadId}/read`)
  } catch (error) {
    console.error('[CHAT API] markThreadRead failed:', error)
  }
}

export async function getThread(threadId: string): Promise<Thread> {
  try {
    const response = await api.get<Thread>(`/chat/threads/${threadId}`)
    return response.data
  } catch (error) {
    console.error('[CHAT API] getThread failed:', error)
    throw error
  }
}

export async function getMessages(threadId: string): Promise<Message[]> {
  try {
    const response = await api.get<Message[]>(`/chat/threads/${threadId}/messages`)
    return response.data
  } catch (error) {
    console.error('[CHAT API] getMessages failed:', error)
    throw error
  }
}

export async function sendMessage(threadId: string, text: string): Promise<Message> {
  try {
    const response = await api.post<Message>(`/chat/threads/${threadId}/messages`, { text })
    return response.data
  } catch (error) {
    console.error('[CHAT API] sendMessage failed:', error)
    throw error
  }
}
