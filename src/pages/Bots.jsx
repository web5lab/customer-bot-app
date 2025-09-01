import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { 
  Plus, 
  Search, 
  Bot, 
  MessageSquare,
  ArrowRight,
  MoreHorizontal,
  Settings,
  Trash2,
  Users,
  Activity,
  BookOpen
} from 'lucide-react'
import { botsSelector } from '../store/selectors'
import { setActiveBot } from '../store/slice'
import { CreateBotModal } from '../components/CreateBotModal'
import { GetBots, DeleteChatBot } from '../store/actions'

export function Bots() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const bots = useSelector(botsSelector)
  const [searchQuery, setSearchQuery] = useState('')
  const [showCreateModal, setShowCreateModal] = useState(false)

  const handleBotSelect = (bot) => {
    dispatch(setActiveBot(bot))
    navigate('/customize')
  }

  const handleBotDelete = async (e, botId) => {
    e.stopPropagation()
    await DeleteChatBot({ chatBotId: botId })
    dispatch(GetBots())
  }

  useEffect(() => {
    if (bots.length === 0) {
      dispatch(GetBots())
    }
  }, [dispatch])

  const filteredBots = bots.filter(bot =>
    bot.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Create Bot Modal */}
      {showCreateModal && (
        <CreateBotModal onClose={() => setShowCreateModal(false)} />
      )}

      {/* Header */}
      <div className="border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">AI Assistants</h1>
              <p className="text-gray-600">{bots.length} bots available</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/docs')}
                className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors border border-gray-300"
              >
                <BookOpen className="w-4 h-4" />
                <span>Documentation</span>
              </button>
              <button
                onClick={() => setShowCreateModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>New Bot</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="border-b border-gray-200 bg-gray-50">
        <div className="px-6 py-4">
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: 'Total Bots', value: bots.length, icon: MessageSquare },
              { label: 'Total Conversations', value: '2.4k', icon: Users },
            ].map((stat, index) => (
              <div key={index} className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    <p className="text-sm text-gray-600">{stat.label}</p>
                  </div>
                  <stat.icon className="w-8 h-8 text-gray-400" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>


      {/* Bots List */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-6">
        {filteredBots.length > 0 && ( <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
           
            {/* Bot Cards */}
            {filteredBots.map((bot) => (
              <div
                key={bot._id}
                className="group border border-gray-200 rounded-lg hover:shadow-sm transition-all cursor-pointer overflow-hidden bg-white"
                onClick={() => handleBotSelect(bot)}
              >
                <div className="p-6">
                  {/* Bot Info */}
                  <div className="flex items-start gap-3 mb-4">
                    <div className="relative">
                      <div className="w-12 h-12 rounded-lg overflow-hidden border border-gray-200 bg-gray-100">
                        <img
                          src={bot.icon}
                          alt={bot.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.onerror = null
                            e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(bot.name)}&background=374151&color=ffffff&size=48`
                          }}
                        />
                      </div>
                      {bot.status === 'active' && (
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 truncate group-hover:text-gray-700 transition-colors">
                        {bot.name || 'Untitled Assistant'}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                        {bot.description || 'No description provided.'}
                      </p>
                    </div>
                    
                    {/* Menu Button */}
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={(e) => e.stopPropagation()}
                        className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <MoreHorizontal className="w-4 h-4 text-gray-500" />
                      </button>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="bg-gray-50 rounded-lg p-3 mb-4">
                    <div className="text-center">
                      <div className="text-lg font-semibold text-gray-900">1.2k</div>
                      <div className="text-xs text-gray-500">Conversations</div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        dispatch(setActiveBot(bot))
                        navigate('/teams')
                      }}
                      className="flex-1 flex items-center justify-center gap-2 py-2 px-3 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-sm font-medium text-gray-700"
                    >
                      <Users className="w-4 h-4" />
                      Team
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleBotDelete(e, bot._id)
                      }}
                      className="flex items-center justify-center gap-2 py-2 px-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>)}
         

          {/* Empty State */}
          {filteredBots.length === 0 && searchQuery && (
            <div className="text-center py-12">
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Search className="w-6 h-6 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No bots found</h3>
              <p className="text-gray-500 mb-4">No bots found matching "{searchQuery}"</p>
              <button
                onClick={() => setSearchQuery('')}
                className="text-gray-900 hover:underline font-medium"
              >
                Clear search
              </button>
            </div>
          )}

          {/* No Bots State */}
          {bots.length === 0 && !searchQuery && (
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-6">
                <Bot className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Welcome to CustomerBot</h3>
              <p className="text-gray-500 mb-8 px-8">
                Create your first AI assistant to get started with automated customer support
              </p>
              <button
                onClick={() => setShowCreateModal(true)}
                className="px-8 py-3 bg-gray-900 text-white rounded-lg font-semibold hover:bg-gray-800 transition-colors"
              >
                Create Your First Bot
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}