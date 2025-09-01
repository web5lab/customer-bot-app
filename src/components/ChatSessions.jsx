import { useState, useEffect } from 'react'
import { 
  MessageSquare, 
  Search, 
  Clock, 
  Trash2, 
  MoreVertical,
  Star,
  Archive,
  Pin,
  User,
  Bot,
  Plus
} from 'lucide-react'

export function ChatSessions({ 
  sessions = [], 
  activeSessionId, 
  onSessionSelect, 
  onSessionDelete,
  onCreateNew
}) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedSessionMenu, setSelectedSessionMenu] = useState(null)

  const filteredSessions = sessions.filter(session => {
    const matchesSearch = session.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         session.lastMessage?.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesSearch
  })

  const formatTimestamp = (date) => {
    const now = new Date()
    const diff = now - date
    const minutes = Math.floor(diff / (1000 * 60))
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))

    if (days > 0) return `${days}d ago`
    if (hours > 0) return `${hours}h ago`
    return `${Math.max(1, minutes)}m ago`
  }

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setSelectedSessionMenu(null)
    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [])

  const handleSessionAction = (action, sessionId) => {
    switch (action) {
      case 'delete':
        onSessionDelete?.(sessionId)
        break
      case 'star':
        console.log('Toggle star for session:', sessionId)
        break
      case 'archive':
        console.log('Archive session:', sessionId)
        break
      case 'pin':
        console.log('Toggle pin for session:', sessionId)
        break
    }
    setSelectedSessionMenu(null)
  }

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-gray-900">Chat Sessions</h2>
          <button
            onClick={onCreateNew}
            className="p-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors touch-target"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Sessions List */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {filteredSessions.length > 0 ? (
          <div className="divide-y divide-gray-100">
            {filteredSessions.map((session) => (
              <div
                key={session.id}
                className={`relative p-4 hover:bg-gray-50 transition-colors cursor-pointer ${
                  activeSessionId === session.id ? 'bg-gray-50 border-r-2 border-gray-900' : ''
                }`}
                onClick={() => onSessionSelect?.(session)}
              >
                <div className="flex items-start gap-3">
                  {/* Session Icon */}
                  <div className="relative">
                    <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                      <MessageSquare className="w-5 h-5 text-gray-600" />
                    </div>
                    
                    {session.isPinned && (
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-500 rounded-full flex items-center justify-center">
                        <Pin className="w-2 h-2 text-white" />
                      </div>
                    )}
                    
                    {session.status === 'active' && (
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                    )}
                  </div>

                  {/* Session Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-medium text-gray-900 truncate">
                        {session.title}
                      </h3>
                      
                      <div className="flex items-center gap-1">
                        {session.isStarred && (
                          <Star className="w-3 h-3 text-yellow-500 fill-current" />
                        )}
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            setSelectedSessionMenu(selectedSessionMenu === session.id ? null : session.id)
                          }}
                          className="p-1 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-all touch-target"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-600 truncate mb-2">
                      {session.lastMessage}
                    </p>
                    
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>{formatTimestamp(session.timestamp)}</span>
                        </div>
                        <span>{session.messageCount} messages</span>
                      </div>
                      
                      <div className={`w-2 h-2 rounded-full ${
                        session.status === 'active' ? 'bg-green-500' : 'bg-gray-300'
                      }`}></div>
                    </div>
                  </div>
                </div>

                {/* Action Menu */}
                {selectedSessionMenu === session.id && (
                  <div className="absolute top-12 right-4 bg-white rounded-lg shadow-lg border border-gray-200 z-10 min-w-[140px]">
                    <div className="py-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleSessionAction('star', session.id)
                        }}
                        className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <Star className="w-4 h-4" />
                        {session.isStarred ? 'Unstar' : 'Star'}
                      </button>
                      
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleSessionAction('pin', session.id)
                        }}
                        className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <Pin className="w-4 h-4" />
                        {session.isPinned ? 'Unpin' : 'Pin'}
                      </button>
                      
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleSessionAction('archive', session.id)
                        }}
                        className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <Archive className="w-4 h-4" />
                        Archive
                      </button>
                      
                      <div className="border-t border-gray-100 my-1"></div>
                      
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleSessionAction('delete', session.id)
                        }}
                        className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center p-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchQuery ? 'No conversations found' : 'No conversations yet'}
              </h3>
              <p className="text-gray-500 text-sm">
                {searchQuery 
                  ? `No conversations found matching "${searchQuery}"`
                  : 'Start your first conversation to see it here'
                }
              </p>
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="mt-3 text-gray-900 font-medium text-sm hover:underline"
                >
                  Clear search
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}