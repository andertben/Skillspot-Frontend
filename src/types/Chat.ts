export interface Message {
  id: string
  threadId: string
  senderId: string
  text: string
  timestamp: string
}

export interface Thread {
  threadId: string
  dienstleistungId: string
  dienstleistungTitle?: string
  anbieterName?: string
  createdAt: string
  updatedAt: string
}

export interface ThreadSummary {
  threadId: string
  dienstleistungTitle?: string
  anbieterName?: string
  lastMessageAt?: string
  lastMessageText?: string
  unreadCount?: number
}

export interface CreateThreadRequest {
  dienstleistungId: string
}

export interface SendMessageRequest {
  text: string
}
