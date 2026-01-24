import { useEffect, useState, useRef, useCallback } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Send, Loader2, ChevronLeft, AlertCircle } from 'lucide-react'
import { getMessages, sendMessage, getThread, markThreadRead } from '@/api/chat'
import type { Message } from '@/types/Chat'
import { useOptionalAuth } from '@/auth/useOptionalAuth'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export default function ChatPage() {
  const { threadId } = useParams<{ threadId: string }>()
  const { t } = useTranslation()
  const navigate = useNavigate()
  const location = useLocation()
  const { user, isAuthenticated, isLoading: isAuthLoading } = useOptionalAuth()
  
  const [messages, setMessages] = useState<Message[]>([])
  const [inputText, setInputText] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isSending, setIsSending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  // Initialize with state from navigation if available
  const [threadInfo, setThreadInfo] = useState<{ providerName?: string; serviceTitle?: string }>(
    location.state || {}
  )
  
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const isAutoScrollingRef = useRef(true)
  const hasMarkedReadRef = useRef<string | null>(null)

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget
    // If user is within 30px of bottom, consider it auto-scroll mode
    const isAtBottom = target.scrollHeight - target.scrollTop <= target.clientHeight + 30
    isAutoScrollingRef.current = isAtBottom
  }

  const scrollToBottom = (force = false) => {
    if ((force || isAutoScrollingRef.current) && scrollContainerRef.current) {
      const container = scrollContainerRef.current
      container.scrollTo({
        top: container.scrollHeight,
        behavior: force ? 'auto' : 'smooth'
      })
    }
  }

  useEffect(() => {
    const fetchHeaderData = async () => {
      if (!threadId) return
      try {
        const thread = await getThread(threadId)
        console.log("getThread response (Header Data)", thread);

        setThreadInfo(prev => ({
          providerName: thread.anbieterName || prev.providerName,
          serviceTitle: thread.dienstleistungTitle || prev.serviceTitle
        }))
      } catch (err) {
        console.error('Failed to fetch thread info:', err)
      }
    }

    if (isAuthenticated) {
      fetchHeaderData()
    }
  }, [threadId, isAuthenticated])

  const fetchMessages = useCallback(async (showLoading = false) => {
    if (!threadId) return
    if (showLoading) setIsLoading(true)
    try {
      const data = await getMessages(threadId)
      // Check if we actually have new messages before updating state to avoid unnecessary scrolls
      setMessages(prev => {
        if (JSON.stringify(prev) === JSON.stringify(data)) return prev
        return data
      })
      setError(null)

      // Mark as read once per thread mount after messages are loaded
      if (threadId && hasMarkedReadRef.current !== threadId) {
        hasMarkedReadRef.current = threadId
        markThreadRead(threadId).then(() => {
          window.dispatchEvent(new CustomEvent('refresh-unread-count'))
        })
      }
    } catch (err: unknown) {
      console.error('Failed to fetch messages:', err)
      
      let status: number | undefined
      if (err && typeof err === 'object' && 'response' in err) {
        const response = (err as { response?: { status?: number } }).response
        status = response?.status
      }

      if (status === 401 || status === 403) {
        setError(t('pages.chat.noAccess') || 'Kein Zugriff oder bitte anmelden')
      } else {
        setError(t('pages.chat.loadError') || 'Fehler beim Laden der Nachrichten')
      }
    } finally {
      if (showLoading) setIsLoading(false)
    }
  }, [threadId, t])

  useEffect(() => {
    if (!isAuthLoading && !isAuthenticated) {
      return
    }
    
    fetchMessages(true)
    
    const interval = setInterval(() => {
      fetchMessages(false)
    }, 3000)

    return () => clearInterval(interval)
  }, [isAuthenticated, isAuthLoading, fetchMessages])

  useEffect(() => {
    if (messages.length > 0) {
       scrollToBottom(false)
    }
  }, [messages])

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!threadId || !inputText.trim() || isSending) return

    const text = inputText.trim()
    setInputText('')
    setIsSending(true)

    try {
      const newMessage = await sendMessage(threadId, text)
      setMessages((prev) => [...prev, newMessage])
      setError(null)
      // Always force scroll to bottom when sending a message so you see what you sent
      setTimeout(() => scrollToBottom(true), 50)
    } catch (err) {
      console.error('Failed to send message:', err)
      setError(t('pages.chat.sendError') || 'Fehler beim Senden der Nachricht')
      // Restore input text on failure so user doesn't lose it
      setInputText(text)
    } finally {
      setIsSending(false)
    }
  }

  if (isAuthLoading || (isLoading && messages.length === 0)) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="text-muted-foreground">{t('pages.chat.loading') || 'Lade Chat...'}</p>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 p-4 text-center">
        <AlertCircle className="w-12 h-12 text-destructive" />
        <h2 className="text-xl font-bold">{t('pages.chat.pleaseLogin') || 'Bitte anmelden'}</h2>
        <p className="text-muted-foreground max-w-md">
          {t('pages.chat.loginRequired') || 'Sie müssen angemeldet sein, um am Chat teilzunehmen.'}
        </p>
        <button 
          onClick={() => navigate('/')}
          className="mt-4 bg-primary text-primary-foreground px-6 py-2 rounded-xl font-bold"
        >
          {t('common.backToHome') || 'Zurück zur Startseite'}
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto flex flex-col h-[calc(100vh-140px)] bg-background border border-border rounded-2xl shadow-sm overflow-hidden my-4">
      {/* Header */}
      <div className="p-4 border-b border-border bg-card flex items-center gap-4">
        <button 
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-secondary rounded-full transition-colors"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <div>
          <h1 className="font-bold text-lg">
            {threadInfo.serviceTitle || t('pages.chat.title') || 'Chat'}
          </h1>
          <p className="text-xs text-muted-foreground">
            {threadInfo.providerName || `Thread ID: ${threadId}`}
          </p>
        </div>
      </div>

      {/* Error Bar */}
      {error && (
        <div className="bg-destructive/10 text-destructive text-sm p-3 flex items-center gap-2 border-b border-destructive/20">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Messages Area */}
      <div 
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 custom-scrollbar"
      >
        {messages.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground italic gap-2">
            <p>{t('pages.chat.noMessages') || 'Schreibe deine Anfrage'}</p>
          </div>
        ) : (
          messages.map((msg) => {
            const isOwn = msg.senderId === user?.sub
            const date = new Date(msg.timestamp)
            const isValidDate = !isNaN(date.getTime())

            return (
              <div 
                key={msg.id} 
                className={cn(
                  "w-full flex",
                  isOwn ? "justify-end" : "justify-start"
                )}
              >
                <div 
                  className={cn(
                    "flex flex-col max-w-[75%]",
                    isOwn ? "items-end" : "items-start"
                  )}
                >
                  <div 
                    className={cn(
                      "px-4 py-2.5 rounded-2xl text-sm shadow-sm",
                      isOwn 
                        ? "bg-primary text-primary-foreground rounded-tr-none" 
                        : "bg-secondary text-secondary-foreground rounded-tl-none"
                    )}
                  >
                    {msg.text}
                  </div>
                  {isValidDate && (
                    <span className="text-[10px] text-muted-foreground mt-1 px-1">
                      {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  )}
                </div>
              </div>
            )
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <form 
        onSubmit={handleSend}
        className="p-4 border-t border-border bg-card flex items-center gap-3"
      >
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={t('pages.chat.placeholder') || 'Nachricht schreiben...'}
          className="flex-1 bg-secondary border-none rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary outline-none transition-all"
          disabled={isSending}
        />
        <button
          type="submit"
          disabled={!inputText.trim() || isSending}
          className="bg-primary text-primary-foreground p-2.5 rounded-xl hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:scale-100 shadow-sm"
        >
          {isSending ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Send className="w-5 h-5" />
          )}
        </button>
      </form>
    </div>
  )
}
