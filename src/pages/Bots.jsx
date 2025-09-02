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
  BookOpen,
  Zap,
  Crown,
  TrendingUp,
  Clock,
  Star,
  Eye,
  Brain,
  Filter,
  Grid3X3,
  List,
  ChevronDown
} from 'lucide-react'
import { botsSelector, userSelector } from '../store/selectors'
import { setActiveBot } from '../store/slice'
import { CreateBotModal } from '../components/CreateBotModal'
import { GetBots, DeleteChatBot } from '../store/actions'

export function Bots() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const bots = useSelector(botsSelector)
  const user = useSelector(userSelector)
  const [searchQuery, setSearchQuery] = useState('')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [selectedBotMenu, setSelectedBotMenu] = useState(null)
  const [viewMode, setViewMode] = useState('grid')
  const [filterStatus, setFilterStatus] = useState('all')
  const [sortBy, setSortBy] = useState('recent')

  // Mock user credits
  const [userCredits] = useState(2450)

  const handleBotSelect = (bot) => {
    dispatch(setActiveBot(bot))
    navigate('/customize')
  }

  const handleBotDelete = async (e, botId) => {
    e.stopPropagation()
    await DeleteChatBot({ chatBotId: botId })
    dispatch(GetBots())
    setSelectedBotMenu(null)
  }

  const handleMenuAction = (action, bot) => {
    switch (action) {
      case 'customize':
        dispatch(setActiveBot(bot))
        navigate('/customize')
        break
      case 'chat':
        dispatch(setActiveBot(bot))
        navigate('/chat')
        break
      case 'training':
        dispatch(setActiveBot(bot))
        navigate('/training')
        break
      case 'team':
        dispatch(setActiveBot(bot))
        navigate('/teams')
        break
      case 'analytics':
        dispatch(setActiveBot(bot))
        navigate('/analytics')
        break
      case 'delete':
        handleBotDelete(null, bot._id)
        break
    }
    setSelectedBotMenu(null)
  }

  useEffect(() => {
    if (bots.length === 0) {
      dispatch(GetBots())
    }
  }, [dispatch])

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setSelectedBotMenu(null)
    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [])

  const filteredBots = bots.filter(bot => {
    const matchesSearch = bot.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = filterStatus === 'all' || bot.status === filterStatus
    return matchesSearch && matchesFilter
  })

  const sortedBots = [...filteredBots].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name)
      case 'conversations':
        return (b.conversationCount || 0) - (a.conversationCount || 0)
      case 'recent':
      default:
        return new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt)
    }
  })

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Create Bot Modal */}
      {showCreateModal && (
        <CreateBotModal onClose={() => setShowCreateModal(false)} />
      )}

      {/* Enhanced Header with Credits */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="px-6 py-4">
          {/* Top Row - Title and Credits */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">AI Assistants</h1>
                <p className="text-gray-600">{bots.length} active bots</p>
              </div>
            </div>
            
            {/* Credits and Actions */}
            <div className="flex items-center gap-4">
              {/* Credits Display */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl px-4 py-3 border border-blue-200">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <Zap className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 font-medium">Credits Remaining</p>
                    <p className="text-lg font-bold text-gray-900">{userCredits.toLocaleString()}</p>
                  </div>
                </div>
              </div>

              {/* Premium Badge */}
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl px-4 py-3 border border-amber-200">
                <div className="flex items-center gap-2">
                  <Crown className="w-5 h-5 text-amber-600" />
                  <span className="text-sm font-bold text-gray-900">Premium</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => navigate('/docs')}
                  className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-colors border border-gray-300"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Docs</span>
                </button>
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl font-semibold"
                >
                  <Plus className="w-4 h-4" />
                  <span>New Bot</span>
                </button>
              </div>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="flex items-center gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search assistants..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Filters */}
            <div className="flex items-center gap-2">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 text-sm font-medium"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 text-sm font-medium"
              >
                <option value="recent">Recent</option>
                <option value="name">Name</option>
                <option value="conversations">Conversations</option>
              </select>

              {/* View Mode Toggle */}
              <div className="flex items-center bg-white border border-gray-200 rounded-xl p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === 'grid' ? 'bg-gray-100 text-gray-900' : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Grid3X3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === 'list' ? 'bg-gray-100 text-gray-900' : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-6">
          {/* Quick Stats */}
          <div className="grid grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-xl p-4 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-gray-900">{bots.length}</p>
                  <p className="text-sm text-gray-600">Total Bots</p>
                </div>
                <Bot className="w-8 h-8 text-blue-500" />
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-gray-900">2.4k</p>
                  <p className="text-sm text-gray-600">Conversations</p>
                </div>
                <MessageSquare className="w-8 h-8 text-green-500" />
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-gray-900">98%</p>
                  <p className="text-sm text-gray-600">Uptime</p>
                </div>
                <Activity className="w-8 h-8 text-purple-500" />
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-gray-900">1.2s</p>
                  <p className="text-sm text-gray-600">Avg Response</p>
                </div>
                <Clock className="w-8 h-8 text-orange-500" />
              </div>
            </div>
          </div>

          {/* Bots Grid/List */}
          {sortedBots.length > 0 ? (
            <div className={viewMode === 'grid' 
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              : "space-y-4"
            }>
              {sortedBots.map((bot) => (
                <div
                  key={bot._id}
                  className={`group relative bg-white rounded-2xl border border-gray-200 hover:border-gray-300 hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden ${
                    viewMode === 'list' ? 'flex items-center p-4' : 'p-6'
                  }`}
                  onClick={() => handleBotSelect(bot)}
                >
                  {/* Background Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-white to-purple-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  <div className={`relative z-10 ${viewMode === 'list' ? 'flex items-center gap-4 w-full' : ''}`}>
                    {/* Bot Avatar and Info */}
                    <div className={`flex items-start gap-4 ${viewMode === 'list' ? 'flex-1' : 'mb-4'}`}>
                      <div className="relative">
                        <div className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-gray-100 bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg group-hover:shadow-xl transition-all duration-300">
                          <img
                            src={bot.icon}
                            alt={bot.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.onerror = null
                              e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(bot.name)}&background=374151&color=ffffff&size=56`
                            }}
                          />
                        </div>
                        {/* Status Indicator */}
                        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 border-3 border-white rounded-full flex items-center justify-center shadow-sm">
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        </div>
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-bold text-gray-900 truncate group-hover:text-blue-600 transition-colors text-lg">
                            {bot.name || 'Untitled Assistant'}
                          </h3>
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-yellow-500 fill-current" />
                            <span className="text-sm font-medium text-gray-700">4.8</span>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2 leading-relaxed">
                          {bot.description || 'AI-powered assistant ready to help your customers with intelligent, personalized responses 24/7.'}
                        </p>
                        
                        {/* Tags */}
                        <div className="flex items-center gap-2 mb-3">
                          <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-lg text-xs font-medium">
                            Customer Support
                          </span>
                          <span className="px-2 py-1 bg-green-100 text-green-700 rounded-lg text-xs font-medium">
                            Active
                          </span>
                        </div>
                      </div>

                      {/* Menu Button */}
                      <div className="relative">
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            setSelectedBotMenu(selectedBotMenu === bot._id ? null : bot._id)
                          }}
                          className="p-2 rounded-xl hover:bg-gray-100 transition-colors opacity-0 group-hover:opacity-100"
                        >
                          <MoreHorizontal className="w-5 h-5 text-gray-500" />
                        </button>

                        {/* Dropdown Menu */}
                        {selectedBotMenu === bot._id && (
                          <div className="absolute top-full right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-200 z-20 min-w-[180px] overflow-hidden">
                            <div className="py-2">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleMenuAction('chat', bot)
                                }}
                                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                              >
                                <MessageSquare className="w-4 h-4" />
                                Start Chat
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleMenuAction('customize', bot)
                                }}
                                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                              >
                                <Settings className="w-4 h-4" />
                                Customize
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleMenuAction('training', bot)
                                }}
                                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                              >
                                <Brain className="w-4 h-4" />
                                Training
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleMenuAction('team', bot)
                                }}
                                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                              >
                                <Users className="w-4 h-4" />
                                Team
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleMenuAction('analytics', bot)
                                }}
                                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                              >
                                <TrendingUp className="w-4 h-4" />
                                Analytics
                              </button>
                              <div className="border-t border-gray-100 my-1"></div>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleMenuAction('delete', bot)
                                }}
                                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                                Delete Bot
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Stats Section */}
                    {viewMode === 'grid' && (
                      <div className="grid grid-cols-3 gap-3 mb-4">
                        <div className="bg-gray-50 rounded-xl p-3 text-center border border-gray-100">
                          <div className="text-lg font-bold text-gray-900">1.2k</div>
                          <div className="text-xs text-gray-500">Chats</div>
                        </div>
                        <div className="bg-gray-50 rounded-xl p-3 text-center border border-gray-100">
                          <div className="text-lg font-bold text-gray-900">98%</div>
                          <div className="text-xs text-gray-500">Uptime</div>
                        </div>
                        <div className="bg-gray-50 rounded-xl p-3 text-center border border-gray-100">
                          <div className="text-lg font-bold text-gray-900">1.2s</div>
                          <div className="text-xs text-gray-500">Response</div>
                        </div>
                      </div>
                    )}

                    {/* Performance Indicator */}
                    <div className={`flex items-center justify-between ${viewMode === 'list' ? 'ml-auto' : ''}`}>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <Activity className="w-3 h-3" />
                          <span>Active now</span>
                        </div>
                        {viewMode === 'list' && (
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <span>1.2k conversations</span>
                            <span>98% uptime</span>
                            <span>4.8 ⭐</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
                        <TrendingUp className="w-3 h-3" />
                        <span className="font-medium">+15%</span>
                      </div>
                    </div>

                    {/* Action Buttons - Only in Grid View */}
                    {viewMode === 'grid' && (
                      <div className="absolute inset-x-6 bottom-6 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                        <div className="flex gap-2 pt-4 border-t border-gray-200">
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              handleMenuAction('chat', bot)
                            }}
                            className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-gray-900 text-white rounded-xl text-sm font-semibold hover:bg-gray-800 transition-colors shadow-lg"
                          >
                            <MessageSquare className="w-4 h-4" />
                            Chat
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              handleMenuAction('customize', bot)
                            }}
                            className="flex items-center justify-center gap-2 py-3 px-4 bg-gray-100 text-gray-700 rounded-xl text-sm font-semibold hover:bg-gray-200 transition-colors"
                          >
                            <Settings className="w-4 h-4" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              handleMenuAction('analytics', bot)
                            }}
                            className="flex items-center justify-center gap-2 py-3 px-4 bg-gray-100 text-gray-700 rounded-xl text-sm font-semibold hover:bg-gray-200 transition-colors"
                          >
                            <TrendingUp className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Enhanced Empty State */
            <div className="text-center py-20">
              <div className="relative mb-8">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-3xl flex items-center justify-center mx-auto shadow-lg">
                  <Bot className="w-12 h-12 text-blue-600" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-lg">
                  <Plus className="w-4 h-4 text-white" />
                </div>
              </div>
              
              {searchQuery ? (
                <>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">No bots found</h3>
                  <p className="text-gray-500 mb-8 max-w-md mx-auto">
                    No assistants found matching "{searchQuery}". Try adjusting your search or filters.
                  </p>
                  <div className="flex items-center justify-center gap-4">
                    <button
                      onClick={() => setSearchQuery('')}
                      className="px-6 py-3 text-gray-700 hover:text-gray-900 font-semibold hover:bg-gray-100 rounded-xl transition-colors border border-gray-300"
                    >
                      Clear Search
                    </button>
                    <button
                      onClick={() => setShowCreateModal(true)}
                      className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl"
                    >
                      Create New Bot
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <h3 className="text-3xl font-bold text-gray-900 mb-4">Welcome to CustomerBot</h3>
                  <p className="text-gray-500 mb-8 max-w-lg mx-auto text-lg leading-relaxed">
                    Create your first AI assistant to get started with automated customer support that works 24/7
                  </p>
                  <button
                    onClick={() => setShowCreateModal(true)}
                    className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl font-bold hover:from-blue-600 hover:to-purple-700 transition-all shadow-xl hover:shadow-2xl text-lg"
                  >
                    <Plus className="w-6 h-6" />
                    Create Your First Bot
                  </button>
                  
                  {/* Feature Highlights */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 max-w-4xl mx-auto">
                    <div className="text-center p-6">
                      <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <Zap className="w-6 h-6 text-blue-600" />
                      </div>
                      <h4 className="font-semibold text-gray-900 mb-2">Instant Setup</h4>
                      <p className="text-sm text-gray-600">Get your AI assistant running in under 5 minutes</p>
                    </div>
                    
                    <div className="text-center p-6">
                      <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <Brain className="w-6 h-6 text-green-600" />
                      </div>
                      <h4 className="font-semibold text-gray-900 mb-2">Smart Training</h4>
                      <p className="text-sm text-gray-600">Train with PDFs, websites, or custom content</p>
                    </div>
                    
                    <div className="text-center p-6">
                      <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <Users className="w-6 h-6 text-purple-600" />
                      </div>
                      <h4 className="font-semibold text-gray-900 mb-2">Team Collaboration</h4>
                      <p className="text-sm text-gray-600">Invite team members and manage together</p>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}