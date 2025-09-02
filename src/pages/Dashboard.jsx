import { useSelector, useDispatch } from 'react-redux'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  Bot, 
  MessageSquare, 
  Users, 
  Plus,
  ArrowRight,
  Settings,
  Trash2,
  MoreHorizontal,
  Zap,
  Crown,
  TrendingUp,
  Clock,
  Star,
  Activity
} from 'lucide-react'
import { GetBots, DeleteChatBot } from '../store/actions'
import { botsSelector, userSelector } from '../store/selectors'
import { setActiveBot } from '../store/slice'
import { CreateBotModal } from '../components/CreateBotModal'

export function Dashboard() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const user = useSelector(userSelector)
  const bots = useSelector(botsSelector)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [selectedBotMenu, setSelectedBotMenu] = useState(null)

  // Mock data for credits and stats
  const [userCredits] = useState(2450)
  const [monthlyUsage] = useState(1250)

  useEffect(() => {
    dispatch(GetBots())
  }, [dispatch])

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
      case 'team':
        dispatch(setActiveBot(bot))
        navigate('/teams')
        break
      case 'training':
        dispatch(setActiveBot(bot))
        navigate('/training')
        break
      case 'delete':
        handleBotDelete(null, bot._id)
        break
    }
    setSelectedBotMenu(null)
  }

  return (
    <div className="h-full overflow-y-auto custom-scrollbar bg-gray-50">
      {/* Create Bot Modal */}
      {showCreateModal && (
        <CreateBotModal onClose={() => setShowCreateModal(false)} />
      )}

      <div className="space-y-6 pb-24">
        {/* Header with Credits */}
        <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-gray-600">Welcome back, {user?.name || 'User'}</p>
              </div>
              
              {/* Credits Display */}
              <div className="flex items-center gap-4">
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg px-4 py-2 border border-blue-200">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                      <Zap className="w-3 h-3 text-white" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Credits Remaining</p>
                      <p className="text-lg font-bold text-gray-900">{userCredits.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg px-4 py-2 border border-amber-200">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-gradient-to-r from-amber-500 to-orange-600 rounded-full flex items-center justify-center">
                      <Crown className="w-3 h-3 text-white" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Plan</p>
                      <p className="text-sm font-bold text-gray-900">Premium</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="px-6 space-y-6">
          {/* Minimal Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white rounded-xl p-4 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-gray-900">{bots.length}</p>
                  <p className="text-sm text-gray-600">Active Bots</p>
                </div>
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Bot className="w-5 h-5 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-gray-900">1.2k</p>
                  <p className="text-sm text-gray-600">Conversations</p>
                </div>
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <MessageSquare className="w-5 h-5 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-gray-900">{monthlyUsage}</p>
                  <p className="text-sm text-gray-600">This Month</p>
                </div>
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-purple-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={() => setShowCreateModal(true)}
                className="flex items-center gap-3 p-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl"
              >
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                  <Plus className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <p className="font-semibold">New Bot</p>
                  <p className="text-xs text-white/80">Create AI assistant</p>
                </div>
              </button>
              
              <button 
                onClick={() => navigate('/chat')}
                className="flex items-center gap-3 p-4 bg-white border-2 border-gray-200 rounded-xl hover:border-gray-300 hover:bg-gray-50 transition-all"
              >
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                  <MessageSquare className="w-5 h-5 text-gray-600" />
                </div>
                <div className="text-left">
                  <p className="font-semibold text-gray-900">Start Chat</p>
                  <p className="text-xs text-gray-600">Test your bots</p>
                </div>
              </button>
            </div>
          </div>

          {/* Enhanced Bot Cards */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Your AI Assistants</h3>
                <p className="text-sm text-gray-600">{bots.length} active bots</p>
              </div>
              <button
                onClick={() => navigate('/bots')}
                className="text-gray-600 hover:text-gray-900 text-sm font-medium flex items-center gap-1"
              >
                View All
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {bots.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {bots.slice(0, 4).map((bot) => (
                  <div
                    key={bot._id}
                    className="group relative bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-xl p-5 hover:shadow-lg hover:border-gray-300 transition-all duration-300 cursor-pointer"
                    onClick={() => handleBotSelect(bot)}
                  >
                    {/* Bot Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <div className="w-12 h-12 rounded-xl overflow-hidden bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
                            {bot.icon ? (
                              <img
                                src={bot.icon}
                                alt={bot.name}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.target.onerror = null
                                  e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(bot.name)}&background=374151&color=ffffff&size=48`
                                }}
                              />
                            ) : (
                              <Bot className="w-6 h-6 text-white" />
                            )}
                          </div>
                          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full flex items-center justify-center">
                            <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                          </div>
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-gray-900 truncate group-hover:text-gray-700 transition-colors">
                            {bot.name || 'Untitled Assistant'}
                          </h4>
                          <p className="text-xs text-gray-500 flex items-center gap-1">
                            <Activity className="w-3 h-3" />
                            Active now
                          </p>
                        </div>
                      </div>

                      {/* Menu Button */}
                      <div className="relative">
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            setSelectedBotMenu(selectedBotMenu === bot._id ? null : bot._id)
                          }}
                          className="p-2 rounded-lg hover:bg-gray-100 transition-colors opacity-0 group-hover:opacity-100"
                        >
                          <MoreHorizontal className="w-4 h-4 text-gray-500" />
                        </button>

                        {/* Dropdown Menu */}
                        {selectedBotMenu === bot._id && (
                          <div className="absolute top-full right-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 z-20 min-w-[160px]">
                            <div className="py-1">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleMenuAction('customize', bot)
                                }}
                                className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                              >
                                <Settings className="w-4 h-4" />
                                Customize
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleMenuAction('training', bot)
                                }}
                                className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                              >
                                <Bot className="w-4 h-4" />
                                Training
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleMenuAction('team', bot)
                                }}
                                className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                              >
                                <Users className="w-4 h-4" />
                                Team
                              </button>
                              <div className="border-t border-gray-100 my-1"></div>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleMenuAction('delete', bot)
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
                    </div>

                    {/* Bot Description */}
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2 leading-relaxed">
                      {bot.description || 'AI-powered customer support assistant ready to help your customers 24/7 with intelligent responses.'}
                    </p>

                    {/* Bot Stats */}
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="bg-white/60 rounded-lg p-3 border border-gray-100">
                        <div className="flex items-center gap-2">
                          <MessageSquare className="w-4 h-4 text-blue-600" />
                          <div>
                            <p className="text-lg font-bold text-gray-900">1.2k</p>
                            <p className="text-xs text-gray-500">Conversations</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-white/60 rounded-lg p-3 border border-gray-100">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-green-600" />
                          <div>
                            <p className="text-lg font-bold text-gray-900">1.2s</p>
                            <p className="text-xs text-gray-500">Avg Response</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Performance Indicator */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 text-yellow-500 fill-current" />
                          <span className="text-xs font-medium text-gray-700">4.8 rating</span>
                        </div>
                        <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                        <span className="text-xs text-gray-500">98% uptime</span>
                      </div>
                      
                      <div className="flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
                        <TrendingUp className="w-3 h-3" />
                        <span className="font-medium">+15%</span>
                      </div>
                    </div>

                    {/* Hover Actions */}
                    <div className="absolute inset-x-5 bottom-5 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                      <div className="flex gap-2 pt-4 border-t border-gray-200">
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            dispatch(setActiveBot(bot))
                            navigate('/chat')
                          }}
                          className="flex-1 flex items-center justify-center gap-2 py-2 px-3 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
                        >
                          <MessageSquare className="w-4 h-4" />
                          Chat
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleMenuAction('customize', bot)
                          }}
                          className="flex items-center justify-center gap-2 py-2 px-3 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
                        >
                          <Settings className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* Empty State */
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Bot className="w-10 h-10 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Create Your First AI Assistant</h3>
                <p className="text-gray-500 mb-8 max-w-md mx-auto">
                  Get started with CustomerBot by creating your first AI-powered assistant to help your customers 24/7
                </p>
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl"
                >
                  <Plus className="w-5 h-5" />
                  Create Your First Bot
                </button>
              </div>
            )}
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
              <button className="text-gray-600 text-sm font-medium hover:text-gray-900 transition-colors">
                View All
              </button>
            </div>
            
            <div className="space-y-3">
              {[
                {
                  id: 1,
                  action: 'New conversation started',
                  bot: 'Support Assistant',
                  time: '2 min ago',
                  icon: MessageSquare,
                  color: 'text-blue-600 bg-blue-100'
                },
                {
                  id: 2,
                  action: 'Bot training completed',
                  bot: 'Sales Helper',
                  time: '5 min ago',
                  icon: Bot,
                  color: 'text-green-600 bg-green-100'
                },
                {
                  id: 3,
                  action: 'Team member invited',
                  bot: 'Support Assistant',
                  time: '10 min ago',
                  icon: Users,
                  color: 'text-purple-600 bg-purple-100'
                }
              ].map((activity) => (
                <div key={activity.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className={`p-2 rounded-lg ${activity.color}`}>
                    <activity.icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                    <p className="text-xs text-gray-500">{activity.bot} • {activity.time}</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              ))}
            </div>
          </div>

          {/* Usage Overview */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Usage Overview</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Credits Used This Month</span>
                <span className="text-sm font-semibold text-gray-900">{monthlyUsage.toLocaleString()} / 5,000</span>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${(monthlyUsage / 5000) * 100}%` }}
                ></div>
              </div>
              
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>25% used</span>
                <span>{5000 - monthlyUsage} credits remaining</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}