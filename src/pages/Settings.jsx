import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { 
  User, 
  Bell, 
  Shield, 
  Palette, 
  LogOut,
  ChevronRight,
  Moon,
  Sun,
  Globe,
  Save,
  ArrowLeft
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { userSelector } from '../store/selectors'
import { setLogout } from '../store/slice'

const settingsGroups = [
  {
    title: 'Account',
    items: [
      { id: 'profile', label: 'Profile', icon: User },
      { id: 'notifications', label: 'Notifications', icon: Bell },
      { id: 'security', label: 'Security', icon: Shield }
    ]
  },
  {
    title: 'Preferences',
    items: [
      { id: 'appearance', label: 'Appearance', icon: Palette },
      { id: 'language', label: 'Language', icon: Globe }
    ]
  }
]

export function Settings() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const user = useSelector(userSelector)
  const [activeSection, setActiveSection] = useState(null)
  const [profile, setProfile] = useState({
    name: user?.name || '',
    email: user?.email || '',
    avatar: user?.profilePicture || ''
  })
  const [notifications, setNotifications] = useState({
    push: true,
    email: false,
    marketing: false
  })
  const [appearance, setAppearance] = useState({
    theme: 'light',
    fontSize: 'medium'
  })

  const handleLogout = () => {
    dispatch(setLogout())
  }

  const renderSectionContent = () => {
    switch (activeSection) {
      case 'profile':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-20 h-20 rounded-lg bg-gray-100 flex items-center justify-center mx-auto mb-4 overflow-hidden">
                {profile.avatar ? (
                  <img src={profile.avatar} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-8 h-8 text-gray-600" />
                )}
              </div>
              <button className="text-gray-900 text-sm font-medium hover:underline">Change Photo</button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                />
              </div>
            </div>

            <button className="w-full py-3 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors">
              Save Changes
            </button>
          </div>
        )

      case 'notifications':
        return (
          <div className="space-y-4">
            {Object.entries(notifications).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900 capitalize">
                    {key === 'push' ? 'Push Notifications' : 
                     key === 'email' ? 'Email Notifications' : 
                     'Marketing Updates'}
                  </p>
                  <p className="text-sm text-gray-600">
                    {key === 'push' ? 'Receive notifications on your device' :
                     key === 'email' ? 'Get updates via email' :
                     'Product updates and offers'}
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={value}
                    onChange={(e) => setNotifications(prev => ({ ...prev, [key]: e.target.checked }))}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gray-900"></div>
                </label>
              </div>
            ))}
          </div>
        )

      case 'appearance':
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Theme</label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { value: 'light', label: 'Light', icon: Sun },
                  { value: 'dark', label: 'Dark', icon: Moon }
                ].map((theme) => (
                  <button
                    key={theme.value}
                    onClick={() => setAppearance(prev => ({ ...prev, theme: theme.value }))}
                    className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all ${
                      appearance.theme === theme.value
                        ? 'border-gray-900 bg-gray-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <theme.icon className="w-6 h-6 text-gray-600" />
                    <span className="text-sm font-medium">{theme.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Font Size</label>
              <div className="grid grid-cols-3 gap-2">
                {['small', 'medium', 'large'].map((size) => (
                  <button
                    key={size}
                    onClick={() => setAppearance(prev => ({ ...prev, fontSize: size }))}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      appearance.fontSize === size
                        ? 'border-gray-900 bg-gray-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <span className={`font-medium ${
                      size === 'small' ? 'text-sm' : 
                      size === 'large' ? 'text-lg' : 'text-base'
                    }`}>
                      Aa
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  if (activeSection) {
    return (
      <div className="h-full flex flex-col bg-white">
        {/* Section Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveSection(null)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <h1 className="text-xl font-bold text-gray-900 capitalize">{activeSection}</h1>
          </div>
        </div>

        {/* Section Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {renderSectionContent()}
        </div>
      </div>
    )
  }

  return (
    <div className="h-full overflow-y-auto bg-white">
      <div className="p-4 space-y-6">
        {/* Profile Header */}
        <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden">
              {user?.profilePicture ? (
                <img src={user.profilePicture} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <User className="w-8 h-8 text-gray-600" />
              )}
            </div>
            
            <div className="flex-1">
              <h2 className="text-xl font-bold text-gray-900">{user?.name || 'User'}</h2>
              <p className="text-gray-600">{user?.email || 'user@example.com'}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-sm text-gray-500">Premium Member</span>
              </div>
            </div>
          </div>
        </div>

        {/* Settings Groups */}
        {settingsGroups.map((group, groupIndex) => (
          <div key={groupIndex} className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="p-4 border-b border-gray-200 bg-gray-50">
              <h3 className="font-semibold text-gray-900">{group.title}</h3>
            </div>
            
            <div className="divide-y divide-gray-100">
              {group.items.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className="w-full flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="p-2 rounded-lg bg-gray-100">
                    <item.icon className="w-5 h-5 text-gray-600" />
                  </div>
                  
                  <div className="flex-1 text-left">
                    <p className="font-medium text-gray-900">{item.label}</p>
                  </div>
                  
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </button>
              ))}
            </div>
          </div>
        ))}

        {/* Logout */}
        <div className="bg-white border border-gray-200 rounded-lg">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-4 p-4 hover:bg-red-50 transition-colors"
          >
            <div className="p-2 rounded-lg bg-red-100">
              <LogOut className="w-5 h-5 text-red-600" />
            </div>
            <span className="font-medium text-red-600">Sign Out</span>
          </button>
        </div>

        {/* App Info */}
        <div className="text-center py-4">
          <p className="text-sm text-gray-500">CustomerBot Mobile v1.0.0</p>
          <p className="text-xs text-gray-400 mt-1">© 2024 CustomerBot Technologies</p>
        </div>
      </div>
    </div>
  )
}