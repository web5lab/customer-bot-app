import { useState, useRef, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate, useLocation } from 'react-router-dom'
import { 
  Send, 
  Bot, 
  User, 
  Loader2, 
  ArrowLeft,
  MessageCircle,
  Plus,
  X,
  Search,
  Trash2,
  Check,
  ChevronDown
} from 'lucide-react'
import { activeBotSelector, messagesSelector, inputSelector, isTypingSelector } from '../store/selectors'
import { botsSelector } from '../store/selectors'
import { addMessage, setInput, setIsTyping, setSessionId, setActiveBot } from '../store/slice'
import { geminiChatApi, getChatSessions } from '../store/actions'

export function Chat() {
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useDispatch()
  const activeBot = useSelector(activeBotSelector)
  const bots = useSelector(botsSelector)
  const input = useSelector(inputSelector)
  const isTyping = useSelector(isTypingSelector)
  const [chatSessions, setChatSessions] = useState([])
  const [activeSessionId, setActiveSessionId] = useState(null)
  const [showSessionsList, setShowSessionsList] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [sessionMessages, setSessionMessages] = useState({})
  const [showBotSelector, setShowBotSelector] = useState(false)
  const messagesEndRef = useRef(null)

  const activeSession = chatSessions.find(session => session._id === activeSessionId)
  const messages = sessionMessages[activeSessionId] || []

  const filteredSessions = chatSessions.filter(session =>
    (session.title || session.name || 'Untitled Chat').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (session.lastMessage || '').toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Load chat sessions when component mounts or activeBot changes
  useEffect(() => {
    if (activeBot?._id) {
      loadChatSessions()
    }
  }, [activeBot])

  const loadChatSessions = async () => {
    try {
      const response = await dispatch(getChatSessions({ botId: activeBot._id }))
      if (response.payload) {
        setChatSessions(response.payload)
      }
    } catch (error) {
      console.error('Error loading chat sessions:', error)
    }
  }

  const loadSessionMessages = async (sessionId) => {
    try {
      const token = localStorage.getItem('authToken')
      const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/chat/get-chat-session/${sessionId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      const sessionData = await response.json()
      
      if (sessionData.messages) {
        setSessionMessages(prev => ({
          ...prev,
          [sessionId]: sessionData.messages
        }))
      }
    } catch (error) {
      console.error('Error loading session messages:', error)
    }
  }

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  const createNewSession = async () => {
    if (!activeBot) return

    try {
      const welcomeMessage = activeBot.welcomeMessage || 'Hello! How can I help you today?'
      
      const newSessionData = {
        _id: `temp_${Date.now()}`,
        title: `New Chat ${chatSessions.length + 1}`,
        name: `New Chat ${chatSessions.length + 1}`,
        lastMessage: welcomeMessage,
        timestamp: new Date(),
        messageCount: 1,
        status: 'active',
        unread: 0,
        messages: [
          {
            _id: `msg_${Date.now()}`,
            role: 'bot',
            content: welcomeMessage,
            timestamp: new Date()
          }
        ]
      }

      setChatSessions(prev => [newSessionData, ...prev])
      setSessionMessages(prev => ({
        ...prev,
        [newSessionData._id]: newSessionData.messages
      }))
      setActiveSessionId(newSessionData._id)
      setShowSessionsList(false)
    } catch (error) {
      console.error('Error creating new session:', error)
    }
  }

  const openSession = (sessionId) => {
    setActiveSessionId(sessionId)
    setShowSessionsList(false)
    navigate(`/chat?session=${sessionId}`, { replace: true })
    
    if (!sessionMessages[sessionId]) {
      loadSessionMessages(sessionId)
    }
    
    setChatSessions(prev => prev.map(session => 
      session._id === sessionId ? { ...session, unread: 0 } : session
    ))
  }

  const closeSession = () => {
    setActiveSessionId(null)
    setShowSessionsList(true)
    navigate('/chat', { replace: true })
  }

  const deleteSession = async (sessionId) => {
    try {
      const token = localStorage.getItem('authToken')
      await fetch(`${import.meta.env.VITE_SERVER_URL}/chat/delete-session/${sessionId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      
      setChatSessions(prev => prev.filter(session => session._id !== sessionId))
      setSessionMessages(prev => {
        const newMessages = { ...prev }
        delete newMessages[sessionId]
        return newMessages
      })
      
      if (activeSessionId === sessionId) {
        closeSession()
      }
    } catch (error) {
      console.error('Error deleting session:', error)
    }
  }

  const formatTimestamp = (date) => {
    const now = new Date()
    const timestamp = new Date(date)
    const diff = now - timestamp
    const minutes = Math.floor(diff / (1000 * 60))
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))

    if (days > 0) return `${days}d`
    if (hours > 0) return `${hours}h`
    return `${Math.max(1, minutes)}m`
  }

  const formatMessageTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  const handleBotChange = (bot) => {
    dispatch(setActiveBot(bot))
    setShowBotSelector(false)
    setActiveSessionId(null)
    setShowSessionsList(true)
    setSessionMessages({})
    setChatSessions([])
    navigate('/chat', { replace: true })
    setTimeout(() => {
      if (bot._id) {
        loadChatSessions()
      }
    }, 100)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!input.trim() || isTyping || !activeBot) return

    dispatch(setIsTyping(true))
    
    const userMessage = {
      _id: `msg_${Date.now()}`,
      role: 'user',
      content: input,
      timestamp: new Date()
    }

    setSessionMessages(prev => ({
      ...prev,
      [activeSessionId]: [...(prev[activeSessionId] || []), userMessage]
    }))

    setChatSessions(prev => prev.map(session => 
      session._id === activeSessionId 
        ? {
            ...session,
            lastMessage: input,
            messageCount: (session.messageCount || 0) + 1,
            timestamp: new Date()
          }
        : session
    ))
    
    const messageToSend = input
    dispatch(setInput(''))

    try {
      const chatData = await geminiChatApi({
        data: { 
          message: messageToSend, 
          botId: activeBot._id,
          sessionId: activeSessionId.startsWith('temp_') ? null : activeSessionId
        }
      })
      
      if (activeSessionId.startsWith('temp_') && chatData.sessionId) {
        const newSessionId = chatData.sessionId
        
        setChatSessions(prev => prev.map(session => 
          session._id === activeSessionId 
            ? { ...session, _id: newSessionId }
            : session
        ))
        
        setSessionMessages(prev => {
          const messages = prev[activeSessionId] || []
          const newMessages = { ...prev }
          delete newMessages[activeSessionId]
          newMessages[newSessionId] = messages
          return newMessages
        })
        
        setActiveSessionId(newSessionId)
        dispatch(setSessionId(newSessionId))
      }
      
      const botResponse = {
        _id: `msg_${Date.now() + 1}`,
        role: 'bot',
        content: chatData.aiResponse,
        timestamp: new Date()
      }
      
      const finalSessionId = chatData.sessionId || activeSessionId
      
      setSessionMessages(prev => ({
        ...prev,
        [finalSessionId]: [...(prev[finalSessionId] || []), botResponse]
      }))

      setChatSessions(prev => prev.map(session => 
        session._id === finalSessionId 
          ? {
              ...session,
              lastMessage: botResponse.content,
              messageCount: (session.messageCount || 0) + 1,
              timestamp: new Date()
            }
          : session
      ))
      
      dispatch(setIsTyping(false))
    } catch (error) {
      const errorResponse = {
        _id: `msg_${Date.now() + 1}`,
        role: 'bot',
        content: "Sorry, I encountered an error. Please try again.",
        timestamp: new Date(),
        isError: true
      }
      
      setSessionMessages(prev => ({
        ...prev,
        [activeSessionId]: [...(prev[activeSessionId] || []), errorResponse]
      }))

      dispatch(setIsTyping(false))
    }
  }

  // Sessions List View
  if (showSessionsList || !activeSession) {
    return (
      <div className="h-full flex flex-col bg-white">
        {/* Header */}
        <div className="border-b border-gray-200">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => navigate('/')}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <ArrowLeft className="w-5 h-5 text-gray-600" />
                </button>
                
                {/* Bot Selector */}
                <div className="relative">
                  <button
                    onClick={() => setShowBotSelector(!showBotSelector)}
                    className="flex items-center gap-3 p-3 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 transition-colors min-w-[200px]"
                  >
                    <div className="w-8 h-8 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center flex-shrink-0">
                      {activeBot?.icon ? (
                        <img
                          src={activeBot.icon}
                          alt={activeBot.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Bot className="w-4 h-4 text-gray-600" />
                      )}
                    </div>
                    <div className="flex-1 text-left min-w-0">
                      <h2 className="text-sm font-semibold text-gray-900 truncate">
                        {activeBot?.name || 'Select Bot'}
                      </h2>
                      <p className="text-xs text-gray-500">
                        {chatSessions.length} conversations
                      </p>
                    </div>
                    <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${showBotSelector ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Dropdown Menu */}
                  {showBotSelector && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 z-50 max-h-64 overflow-y-auto">
                      <div className="p-2">
                        {bots.map((bot) => (
                          <button
                            key={bot._id}
                            onClick={() => handleBotChange(bot)}
                            className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${
                              activeBot?._id === bot._id
                                ? 'bg-gray-100 text-gray-900'
                                : 'hover:bg-gray-50 text-gray-700'
                            }`}
                          >
                            <div className="w-8 h-8 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center flex-shrink-0">
                              {bot.icon ? (
                                <img
                                  src={bot.icon}
                                  alt={bot.name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <Bot className="w-4 h-4 text-gray-600" />
                              )}
                            </div>
                            <div className="flex-1 text-left min-w-0">
                              <h3 className="text-sm font-semibold truncate">{bot.name}</h3>
                              <p className="text-xs text-gray-500 truncate">
                                {bot.description || 'AI Assistant'}
                              </p>
                            </div>
                            {activeBot?._id === bot._id && (
                              <Check className="w-4 h-4 text-gray-600" />
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <button
                onClick={createNewSession}
                className="p-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Sessions List */}
        <div className="flex-1 overflow-y-auto">
          <div className="divide-y divide-gray-100">
            {filteredSessions.map((session) => (
              <button
                key={session._id}
                onClick={() => openSession(session._id)}
                className="w-full p-4 hover:bg-gray-50 transition-colors text-left group"
              >
                <div className="flex items-center gap-4">
                  {/* Avatar */}
                  <div className="relative">
                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
                      {activeBot?.icon ? (
                        <img
                          src={activeBot.icon}
                          alt={session.title || session.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Bot className="w-6 h-6 text-gray-600" />
                      )}
                    </div>
                    {session.status === 'active' && (
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                    )}
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-semibold text-gray-900 truncate group-hover:text-gray-700 transition-colors">
                        {session.title || session.name || `Chat ${session._id.slice(-6)}`}
                      </h3>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500">
                          {formatTimestamp(session.timestamp || session.updatedAt)}
                        </span>
                        {session.unread > 0 && (
                          <div className="w-5 h-5 bg-gray-900 rounded-full flex items-center justify-center">
                            <span className="text-white text-xs font-bold">{session.unread}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-500 truncate mb-1">
                      {session.lastMessage || 'No messages yet'}
                    </p>
                    
                    <div className="flex items-center gap-3 text-xs text-gray-400">
                      <div className="flex items-center gap-1">
                        <MessageCircle className="w-3 h-3" />
                        <span>{session.messageCount || 0} messages</span>
                      </div>
                      <div className={`w-2 h-2 rounded-full ${
                        session.status === 'active' ? 'bg-green-500' : 'bg-gray-300'
                      }`}></div>
                    </div>
                  </div>

                  {/* Actions */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      deleteSession(session._id)
                    }}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </button>
            ))}
          </div>

          {/* Empty State */}
          {filteredSessions.length === 0 && (
            <div className="flex items-center justify-center h-full">
              <div className="text-center p-8">
                <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-6">
                  <MessageCircle className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {searchQuery ? 'No conversations found' : 'No conversations yet'}
                </h3>
                <p className="text-gray-500 mb-6">
                  {searchQuery 
                    ? `No conversations found matching "${searchQuery}"`
                    : `Start your first conversation with ${activeBot?.name || 'your AI assistant'}`
                  }
                </p>
                {!searchQuery && (
                  <button
                    onClick={createNewSession}
                    className="px-6 py-3 bg-gray-900 text-white rounded-lg font-semibold hover:bg-gray-800 transition-colors"
                  >
                    Start New Chat
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  // Individual Chat View
  return (
    <div className="h-full flex flex-col bg-white">
      {/* Chat Header */}
      <div className="border-b border-gray-200">
        <div className="px-4 py-3">
          <div className="flex items-center gap-3">
            <button
              onClick={closeSession}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            
            <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
              {activeBot?.icon ? (
                <img
                  src={activeBot.icon}
                  alt={activeBot.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <Bot className="w-5 h-5 text-gray-600" />
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              <h2 className="font-semibold text-gray-900 truncate">
                {activeBot?.name || 'AI Assistant'}
              </h2>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                {isTyping ? (
                  <>
                    <div className="flex space-x-1">
                      <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                      <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    </div>
                    <span>typing...</span>
                  </>
                ) : (
                  <>
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>online</span>
                  </>
                )}
              </div>
            </div>

            <button
              onClick={() => deleteSession(activeSessionId)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Trash2 className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto bg-gray-50">
        <div className="p-4 space-y-4">
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center p-8">
                <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Bot className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Start a conversation
                </h3>
                <p className="text-gray-500">
                  Send a message to begin chatting with {activeBot?.name || 'your AI assistant'}
                </p>
              </div>
            </div>
          ) : (
            messages.map((message, index) => (
              <div key={message._id || index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`flex items-end gap-2 max-w-[80%]`}>
                  {message.role === 'bot' && (
                    <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                      {activeBot?.icon ? (
                        <img
                          src={activeBot.icon}
                          alt="Bot"
                          className="w-6 h-6 rounded-md object-cover"
                        />
                      ) : (
                        <Bot className="w-4 h-4 text-gray-600" />
                      )}
                    </div>
                  )}

                  <div className={`flex flex-col ${message.role === 'user' ? 'items-end' : 'items-start'}`}>
                    <div
                      className={`rounded-lg px-4 py-3 max-w-xs transition-all ${
                        message.role === 'user'
                          ? 'bg-gray-900 text-white'
                          : message.isError
                            ? 'bg-red-50 text-red-800 border border-red-200'
                            : 'bg-white text-gray-900 border border-gray-200'
                      }`}
                    >
                      <p className="text-sm leading-relaxed">{message.content}</p>
                    </div>
                    
                    <div className="mt-1 px-1">
                      <span className="text-xs text-gray-400">
                        {formatMessageTime(message.timestamp)}
                        {message.role === 'user' && (
                          <span className="text-gray-500 ml-1">✓</span>
                        )}
                      </span>
                    </div>
                  </div>

                  {message.role === 'user' && (
                    <div className="w-8 h-8 rounded-lg bg-gray-600 flex items-center justify-center flex-shrink-0">
                      <User className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>
              </div>
            ))
          )}

          {isTyping && (
            <div className="flex justify-start">
              <div className="flex items-end gap-2 max-w-[80%]">
                <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
                  {activeBot?.icon ? (
                    <img
                      src={activeBot.icon}
                      alt="Bot"
                      className="w-6 h-6 rounded-md object-cover"
                    />
                  ) : (
                    <Bot className="w-4 h-4 text-gray-600" />
                  )}
                </div>
                <div className="bg-white rounded-lg px-4 py-3 border border-gray-200">
                  <div className="flex items-center gap-2">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"></div>
                      <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{animationDelay: '0.1s'}}></div>
                      <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    </div>
                    <span className="text-xs text-gray-500 italic">AI is thinking...</span>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="bg-white border-t border-gray-200 p-4">
        <form onSubmit={handleSubmit} className="flex items-center gap-3">
          <div className="flex-1 relative">
            <input
              type="text"
              value={input}
              onChange={(e) => dispatch(setInput(e.target.value))}
              placeholder="Type a message..."
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all text-gray-900 placeholder-gray-500"
              disabled={isTyping}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  handleSubmit(e)
                }
              }}
            />
          </div>
          
          <button
            type="submit"
            disabled={!input.trim() || isTyping}
            className={`p-3 rounded-lg transition-all ${
              input.trim() && !isTyping
                ? 'bg-gray-900 hover:bg-gray-800 text-white'
                : 'bg-gray-200 text-gray-400'
            }`}
          >
            {isTyping ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </form>
      </div>
    </div>
  )
}