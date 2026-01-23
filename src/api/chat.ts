import api from './client'
import type { Message, Thread } from '@/types/Chat'

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
