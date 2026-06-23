import { useSelector, useDispatch } from 'react-redux'
import { useEffect } from 'react'
import { 
  Bot, 
  MessageSquare, 
  TrendingUp, 
  Users, 
  Plus,
  ArrowRight,
  Activity,
  Clock,
  Target,
  Brain
} from 'lucide-react'
import { getBots } from '../store/actions'
import { botsSelector, userSelector } from '../store/selectors'

const stats = [
  {
    label: 'Total Bots',
    value: '12',
    icon: Bot,
    change: '+2 this week'
  },
  {
    label: 'Conversations',
    value: '1.2k',
    icon: MessageSquare,
    change: '+15% this month'
  },
  {
    label: 'Active Users',
    value: '847',
    icon: Users,
    change: '+8% this week'
  },
  {
    label: 'Response Time',
    value: '1.2s',
    icon: Clock,
    change: '-25% faster'
  }
]

const recentActivity = [
  {
    id: 1,
    action: 'New bot created',
    time: '2 min ago',
    icon: Bot
  },
  {
    id: 2,
    action: 'Training completed',
    time: '5 min ago',
    icon: Brain
  },
  {
    id: 3,
    action: 'Chat session started',
    time: '10 min ago',
    icon: MessageSquare
  }
]

export function Dashboard() {
  const dispatch = useDispatch()
  const user = useSelector(userSelector)
  const bots = useSelector(botsSelector)

  useEffect(() => {
    dispatch(getBots())
  }, [dispatch])

  return (
    <div className="h-full overflow-y-auto custom-scrollbar bg-gray-50">
      <div className="p-6 space-y-6 pb-24">
        {/* Welcome Section */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center">
              <Bot className="w-6 h-6 text-gray-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Welcome back!</h2>
              <p className="text-gray-600">{user?.name || 'User'}</p>
            </div>
          </div>
          
          <p className="text-gray-600 mb-4">
            Your AI assistants are ready to help customers 24/7
          </p>
          
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>All systems operational</span>
            </div>
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4" />
              <span>Premium Active</span>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-lg p-4 border border-gray-200"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 rounded-lg bg-gray-100">
                  <stat.icon className="w-5 h-5 text-gray-600" />
                </div>
              </div>
              
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-1">{stat.value}</h3>
                <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                <p className="text-xs text-green-600 font-medium">{stat.change}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          
          <div className="grid grid-cols-2 gap-3">
            <button className="flex flex-col items-center gap-2 p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors haptic-medium">
              <div className="w-10 h-10 bg-gray-900 rounded-lg flex items-center justify-center">
                <Plus className="w-5 h-5 text-white" />
              </div>
              <span className="text-sm font-medium text-gray-700">New Bot</span>
            </button>
            
            <button className="flex flex-col items-center gap-2 p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors haptic-medium">
              <div className="w-10 h-10 bg-gray-900 rounded-lg flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-white" />
              </div>
              <span className="text-sm font-medium text-gray-700">Start Chat</span>
            </button>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
            <button className="text-gray-600 text-sm font-medium hover:text-gray-900">View All</button>
          </div>
          
          <div className="space-y-3">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="p-2 rounded-lg bg-gray-100">
                  <activity.icon className="w-4 h-4 text-gray-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-400" />
              </div>
            ))}
          </div>
        </div>

        {/* System Status */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">System Status</h3>
          
          <div className="space-y-3">
            {[
              { label: 'API Status', status: 'Operational', icon: Target },
              { label: 'Training Pipeline', status: 'Active', icon: Activity },
              { label: 'Chat Service', status: 'Online', icon: MessageSquare }
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-gray-100">
                    <item.icon className="w-4 h-4 text-gray-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">{item.label}</span>
                </div>
                <span className="text-xs font-medium text-green-600 bg-green-100 px-2 py-1 rounded-full">
                  {item.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}