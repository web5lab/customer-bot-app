import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { 
  Users, 
  Plus, 
  Mail, 
  Edit3, 
  Eye, 
  Trash2, 
  X,
  UserPlus,
  Search,
  Bot,
  ChevronDown,
  ChevronRight,
  MessageSquare,
  ArrowLeft
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { botsSelector, activeBotSelector } from '../store/selectors'
import { CreateBotModal } from '../components/CreateBotModal'
import { GetBots } from '../store/actions'

export default function Teams() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const bots = useSelector(botsSelector)
  const activeBot = useSelector(activeBotSelector)
  const [showInviteModal, setShowInviteModal] = useState(false)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [selectedBot, setSelectedBot] = useState(null)
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteRole, setInviteRole] = useState('viewer')
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedBots, setExpandedBots] = useState(new Set())

  // Mock team data
  const [botTeams, setBotTeams] = useState({
    '1': [
      {
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
        role: 'admin',
        avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
        joinedAt: '2024-01-15',
        lastActive: '2 hours ago',
        status: 'online'
      },
      {
        id: 2,
        name: 'Sarah Wilson',
        email: 'sarah@example.com',
        role: 'editor',
        avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
        joinedAt: '2024-02-20',
        lastActive: '1 day ago',
        status: 'away'
      }
    ]
  })

  useEffect(() => {
    dispatch(GetBots())
  }, [dispatch])

  const handleInviteMember = () => {
    if (inviteEmail.trim() && selectedBot) {
      const newMember = {
        id: Date.now(),
        name: inviteEmail.split('@')[0],
        email: inviteEmail,
        role: inviteRole,
        avatar: 'https://images.pexels.com/photos/771742/pexels-photo-771742.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
        joinedAt: new Date().toISOString().split('T')[0],
        lastActive: 'Just now',
        status: 'online'
      }
      
      setBotTeams(prev => ({
        ...prev,
        [selectedBot]: [...(prev[selectedBot] || []), newMember]
      }))
      
      setInviteEmail('')
      setInviteRole('viewer')
      setShowInviteModal(false)
      setSelectedBot(null)
    }
  }

  const handleRemoveMember = (botId, memberId) => {
    setBotTeams(prev => ({
      ...prev,
      [botId]: prev[botId]?.filter(member => member.id !== memberId) || []
    }))
  }

  const toggleBotExpansion = (botId) => {
    setExpandedBots(prev => {
      const newSet = new Set(prev)
      if (newSet.has(botId)) {
        newSet.delete(botId)
      } else {
        newSet.add(botId)
      }
      return newSet
    })
  }

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800'
      case 'editor': return 'bg-blue-100 text-blue-800'
      case 'viewer': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'online': return 'bg-green-500'
      case 'away': return 'bg-yellow-500'
      case 'offline': return 'bg-gray-400'
      default: return 'bg-gray-400'
    }
  }

  const getTotalMembers = () => {
    return Object.values(botTeams).reduce((total, members) => total + members.length, 0)
  }

  const getBotMembers = (botId) => {
    const members = botTeams[botId] || []
    return members.filter(member => {
      const matchesSearch = member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           member.email.toLowerCase().includes(searchQuery.toLowerCase())
      return matchesSearch
    })
  }

  const selectedBotData = bots.find(bot => bot._id === selectedBot)

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
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/')}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-gray-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Team Management</h1>
                <p className="text-sm text-gray-600">{getTotalMembers()} total members across {bots.length} bots</p>
              </div>
            </div>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search team members..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Bot Teams List */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-4">
          {bots.map((bot) => {
            const members = getBotMembers(bot._id)
            const isExpanded = expandedBots.has(bot._id)
            const totalBotMembers = botTeams[bot._id]?.length || 0
            
            return (
              <div
                key={bot._id}
                className="bg-white border border-gray-200 rounded-lg overflow-hidden"
              >
                {/* Bot Header */}
                <div className="bg-gray-50 p-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => toggleBotExpansion(bot._id)}
                      className="flex items-center gap-4 flex-1 text-left group"
                    >
                      <div className="relative">
                        <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100">
                          <img
                            src={bot.icon || `https://ui-avatars.com/api/?name=${encodeURIComponent(bot.name)}&background=374151&color=ffffff&size=48`}
                            alt={bot.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full flex items-center justify-center">
                          <Bot className="w-2 h-2 text-white" />
                        </div>
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-gray-900 truncate group-hover:text-gray-700 transition-colors">
                            {bot.name}
                          </h3>
                          <div className="flex items-center gap-1">
                            {isExpanded ? (
                              <ChevronDown className="w-4 h-4 text-gray-400" />
                            ) : (
                              <ChevronRight className="w-4 h-4 text-gray-400" />
                            )}
                          </div>
                        </div>
                        <p className="text-sm text-gray-500 mb-2">
                          {bot.description || 'AI Assistant for customer support'}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-gray-400">
                          <div className="flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            <span>{totalBotMembers} members</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MessageSquare className="w-3 h-3" />
                            <span>Active bot</span>
                          </div>
                        </div>
                      </div>
                    </button>

                    <button
                      onClick={() => {
                        setSelectedBot(bot._id)
                        setShowInviteModal(true)
                      }}
                      className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg font-semibold hover:bg-gray-800 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Invite</span>
                    </button>
                  </div>
                </div>

                {/* Bot Team Members */}
                {isExpanded && (
                  <div className="p-4">
                    {members.length > 0 ? (
                      <div className="space-y-3">
                        {members.map((member) => (
                          <div
                            key={member.id}
                            className="bg-gray-50 rounded-lg p-4 border border-gray-200"
                          >
                            <div className="flex items-center gap-4">
                              {/* Avatar with Status */}
                              <div className="relative">
                                <img
                                  src={member.avatar}
                                  alt={member.name}
                                  className="w-12 h-12 rounded-lg object-cover"
                                />
                                <div className={`absolute -bottom-1 -right-1 w-4 h-4 ${getStatusColor(member.status)} border-2 border-white rounded-full`}></div>
                              </div>

                              {/* Member Info */}
                              <div className="flex-1 min-w-0">
                                <h4 className="font-semibold text-gray-900 truncate">{member.name}</h4>
                                <p className="text-sm text-gray-500 mb-1">{member.email}</p>
                                <div className="flex items-center gap-3 text-xs text-gray-400">
                                  <span>Active {member.lastActive}</span>
                                  <span>Joined {new Date(member.joinedAt).toLocaleDateString()}</span>
                                </div>
                              </div>

                              {/* Role Badge */}
                              <div className={`px-3 py-1.5 rounded-lg text-xs font-medium ${getRoleColor(member.role)}`}>
                                <span className="capitalize">{member.role}</span>
                              </div>
                            </div>

                            {/* Member Actions */}
                            <div className="mt-4 pt-4 border-t border-gray-200">
                              <div className="flex items-center gap-2">
                                <select
                                  value={member.role}
                                  onChange={(e) => {
                                    setBotTeams(prev => ({
                                      ...prev,
                                      [bot._id]: prev[bot._id]?.map(m => 
                                        m.id === member.id ? { ...m, role: e.target.value } : m
                                      ) || []
                                    }))
                                  }}
                                  className="flex-1 px-3 py-2 text-sm rounded-lg border border-gray-200 bg-white focus:ring-2 focus:ring-gray-900"
                                >
                                  <option value="admin">Admin</option>
                                  <option value="editor">Editor</option>
                                  <option value="viewer">Viewer</option>
                                </select>
                                
                                {member.role !== 'admin' && (
                                  <button
                                    onClick={() => handleRemoveMember(bot._id, member.id)}
                                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                          <Users className="w-8 h-8 text-gray-400" />
                        </div>
                        <h4 className="text-lg font-semibold text-gray-900 mb-2">No team members</h4>
                        <p className="text-gray-500 mb-4">
                          This bot doesn't have any team members yet
                        </p>
                        <button
                          onClick={() => {
                            setSelectedBot(bot._id)
                            setShowInviteModal(true)
                          }}
                          className="px-4 py-2 bg-gray-900 text-white rounded-lg font-semibold hover:bg-gray-800 transition-colors"
                        >
                          Invite First Member
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          })}

          {/* Empty State for No Bots */}
          {bots.length === 0 && (
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-6">
                <Bot className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">No bots available</h3>
              <p className="text-gray-500 mb-8">
                Create your first bot to start managing team members
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

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md overflow-hidden">
            {/* Modal Header */}
            <div className="bg-gray-50 p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-gray-100">
                    <UserPlus className="w-6 h-6 text-gray-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Invite Team Member</h3>
                    <p className="text-gray-600">
                      {selectedBotData ? `Add member to ${selectedBotData.name}` : 'Add a new team member'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setShowInviteModal(false)
                    setSelectedBot(null)
                  }}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Bot Selection */}
              {!selectedBot && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Select Bot
                  </label>
                  <select
                    value={selectedBot || ''}
                    onChange={(e) => setSelectedBot(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                  >
                    <option value="">Choose a bot...</option>
                    {bots.map((bot) => (
                      <option key={bot._id} value={bot._id}>
                        {bot.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    placeholder="colleague@company.com"
                    className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Role
                </label>
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                >
                  <option value="viewer">Viewer</option>
                  <option value="editor">Editor</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              {/* Role Description */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2 capitalize">
                  {inviteRole} Permissions
                </h4>
                <p className="text-sm text-gray-600">
                  {inviteRole === 'admin' && 'Full access to bot settings, training, team management, and analytics'}
                  {inviteRole === 'editor' && 'Can modify bot configurations, training data, and view detailed analytics'}
                  {inviteRole === 'viewer' && 'Read-only access to conversations, basic analytics, and bot performance'}
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex gap-3">
              <button
                onClick={() => {
                  setShowInviteModal(false)
                  setSelectedBot(null)
                }}
                className="flex-1 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleInviteMember}
                disabled={!inviteEmail.trim() || !selectedBot}
                className="flex-1 flex items-center justify-center gap-2 bg-gray-900 text-white px-4 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Mail className="w-4 h-4" />
                <span>Send Invite</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}