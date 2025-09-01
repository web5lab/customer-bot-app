import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { 
  ArrowLeft, 
  Sliders, 
  Eye, 
  Save,
  Palette,
  User,
  Type,
  MessageSquare,
  Upload,
  X,
  Sun,
  Moon,
  Bot,
  Send,
  Loader2,
  Plus
} from 'lucide-react'
import { activeBotSelector, uiConfigSelector } from '../store/selectors'
import { setUiConfig } from '../store/slice'
import { updateChatBot, geminiChatApi } from '../store/actions'
import toast from 'react-hot-toast'

// Constants
const COLOR_PALETTES = [
  { primary: '#374151', secondary: '#1f2937', bg: '#f9fafb', theme: 'light', name: 'Gray' },
  { primary: '#1f2937', secondary: '#111827', bg: '#f3f4f6', theme: 'light', name: 'Dark Gray' },
  { primary: '#3b82f6', secondary: '#1e40af', bg: '#eff6ff', theme: 'light', name: 'Blue' },
  { primary: '#059669', secondary: '#047857', bg: '#ecfdf5', theme: 'light', name: 'Green' },
  { primary: '#dc2626', secondary: '#b91c1c', bg: '#fef2f2', theme: 'light', name: 'Red' },
  { primary: '#7c3aed', secondary: '#5b21b6', bg: '#f5f3ff', theme: 'light', name: 'Purple' }
]

const FONT_SIZES = [
  { label: 'Small', value: '14px' },
  { label: 'Medium', value: '16px' },
  { label: 'Large', value: '18px' }
]

export function Customize() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const activeBot = useSelector(activeBotSelector)
  const uiConfig = useSelector(uiConfigSelector)
  const [activeTab, setActiveTab] = useState('customize')
  const [saving, setSaving] = useState(false)
  const [botIcon, setBotIcon] = useState(null)
  const [userIcon, setUserIcon] = useState(null)
  const [isTyping, setIsTyping] = useState(false)

  const {
    customPrimaryColor = '#374151',
    customSecondaryColor = '#1f2937',
    customBgColor = '#f9fafb',
    themeMode = 'light',
    botAvatar = '',
    userAvatar = '',
    selectedFontSize = '16px',
    botName = '',
    customQuestions = [],
    systemPrompt = '',
    welcomeMessage = '',
    messages = [],
    input = ''
  } = uiConfig

  const handleBotAvatarUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = () => dispatch(setUiConfig({ botAvatar: reader.result }))
      reader.readAsDataURL(file)
      setBotIcon(file)
    }
  }

  const handleUserAvatarUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = () => dispatch(setUiConfig({ userAvatar: reader.result }))
      reader.readAsDataURL(file)
      setUserIcon(file)
    }
  }

  const handleSaveChanges = async () => {
    setSaving(true)
    try {
      const formData = new FormData()
      formData.append('name', botName)
      if (botIcon) formData.append('icon', botIcon)
      if (userIcon) formData.append('userIcon', userIcon)
      formData.append('botAvatar', botAvatar)
      formData.append('userAvatar', userAvatar)
      formData.append('customPrimaryColor', customPrimaryColor)
      formData.append('customSecondaryColor', customSecondaryColor)
      formData.append('customBgColor', customBgColor)
      formData.append('themeMode', themeMode)
      formData.append('selectedFontSize', selectedFontSize)
      formData.append('customQuestions', JSON.stringify(customQuestions))
      formData.append('systemPrompt', systemPrompt)
      formData.append('welcomeMessage', welcomeMessage || '')

      await updateChatBot({
        data: formData, 
        botId: activeBot._id
      })

      toast.success("Changes saved successfully!")
      setSaving(false)
    } catch (error) {
      console.error("Error saving changes:", error)
      toast.error("Failed to save changes")
      setSaving(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!input.trim() || isTyping) return

    setIsTyping(true)
    const userMessage = { role: 'user', content: input }
    dispatch(setUiConfig({ 
      messages: [...messages, userMessage],
      input: ''
    }))

    try {
      const chatData = await geminiChatApi({
        data: { message: input, botId: activeBot?._id }
      })

      dispatch(setUiConfig({
        messages: [...messages, userMessage, {
          role: 'bot',
          content: chatData.aiResponse
        }]
      }))
    } catch (error) {
      dispatch(setUiConfig({
        messages: [...messages, userMessage, {
          role: 'bot',
          content: "Sorry, I encountered an error processing your request.",
          isError: true
        }]
      }))
    } finally {
      setIsTyping(false)
    }
  }

  if (!activeBot) {
    return (
      <div className="h-full flex items-center justify-center bg-white">
        <div className="text-center p-8">
          <Bot className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">No Bot Selected</h2>
          <p className="text-gray-500 mb-6">Please select a bot to customize</p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-gray-900 text-white rounded-lg font-semibold hover:bg-gray-800 transition-colors"
          >
            Select Bot
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="border-b border-gray-200">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/')}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Customize</h1>
                <p className="text-sm text-gray-600">Design your bot</p>
              </div>
            </div>
            
            <button
              onClick={handleSaveChanges}
              disabled={saving}
              className="px-4 py-2 bg-gray-900 text-white rounded-lg font-semibold hover:bg-gray-800 transition-colors disabled:opacity-50"
            >
              {saving ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Saving...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Save className="w-4 h-4" />
                  <span>Save</span>
                </div>
              )}
            </button>
          </div>

          {/* Bot Info */}
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
              {activeBot.icon ? (
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
              <h2 className="font-semibold text-gray-900 truncate">{activeBot.name}</h2>
              <p className="text-sm text-gray-500">AI Assistant</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 bg-gray-50">
        <div className="flex">
          <button
            onClick={() => setActiveTab('customize')}
            className={`flex-1 flex items-center justify-center gap-2 py-4 px-4 transition-all ${
              activeTab === 'customize'
                ? 'text-gray-900 border-b-2 border-gray-900 bg-white'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Sliders className="w-5 h-5" />
            <span className="font-medium">Customize</span>
          </button>
          <button
            onClick={() => setActiveTab('preview')}
            className={`flex-1 flex items-center justify-center gap-2 py-4 px-4 transition-all ${
              activeTab === 'preview'
                ? 'text-gray-900 border-b-2 border-gray-900 bg-white'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Eye className="w-5 h-5" />
            <span className="font-medium">Preview</span>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === 'customize' ? (
          <div className="p-4 space-y-6">
            {/* Bot Settings */}
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Bot Settings</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Bot Name</label>
                  <input
                    type="text"
                    value={botName}
                    onChange={(e) => dispatch(setUiConfig({ botName: e.target.value }))}
                    className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                    placeholder="Enter bot name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">System Prompt</label>
                  <textarea
                    value={systemPrompt}
                    onChange={(e) => dispatch(setUiConfig({ systemPrompt: e.target.value }))}
                    className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent min-h-[100px] resize-y"
                    placeholder="Define the bot's personality and behavior..."
                  />
                </div>
              </div>
            </div>

            {/* Appearance */}
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Appearance</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Color Scheme</label>
                  <div className="grid grid-cols-2 gap-3">
                    {COLOR_PALETTES.map((palette, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          dispatch(setUiConfig({
                            themeMode: palette.theme,
                            customPrimaryColor: palette.primary,
                            customSecondaryColor: palette.secondary,
                            customBgColor: palette.bg
                          }))
                        }}
                        className={`p-3 rounded-lg border-2 transition-all ${
                          customPrimaryColor === palette.primary
                            ? 'border-gray-900'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <div
                            className="w-6 h-6 rounded-full"
                            style={{ backgroundColor: palette.primary }}
                          />
                          <div
                            className="w-4 h-4 rounded-full"
                            style={{ backgroundColor: palette.secondary }}
                          />
                        </div>
                        <p className="text-sm font-medium text-gray-900">{palette.name}</p>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Theme</label>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { mode: 'light', icon: <Sun className="w-4 h-4" />, label: 'Light' },
                      { mode: 'dark', icon: <Moon className="w-4 h-4" />, label: 'Dark' }
                    ].map(({ mode, icon, label }) => (
                      <button
                        key={mode}
                        onClick={() => dispatch(setUiConfig({ themeMode: mode }))}
                        className={`flex items-center justify-center gap-2 p-3 rounded-lg border transition-all ${
                          themeMode === mode
                            ? 'border-gray-900 bg-gray-50'
                            : 'border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        {icon}
                        <span className="font-medium">{label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Font Size</label>
                  <div className="grid grid-cols-3 gap-3">
                    {FONT_SIZES.map((size) => (
                      <button
                        key={size.value}
                        onClick={() => dispatch(setUiConfig({ selectedFontSize: size.value }))}
                        className={`p-3 rounded-lg border transition-all ${
                          selectedFontSize === size.value
                            ? 'border-gray-900 bg-gray-50'
                            : 'border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        <div className="text-center">
                          <div className="font-semibold mb-1" style={{ fontSize: size.value }}>Aa</div>
                          <div className="text-xs">{size.label}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Avatars */}
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Avatars</h3>
              
              <div className="space-y-4">
                {[
                  { title: 'Bot Avatar', current: botAvatar, handler: handleBotAvatarUpload },
                  { title: 'User Avatar', current: userAvatar, handler: handleUserAvatarUpload }
                ].map((avatar) => (
                  <div key={avatar.title}>
                    <label className="block text-sm font-medium text-gray-700 mb-3">{avatar.title}</label>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
                        {avatar.current ? (
                          <img src={avatar.current} alt={avatar.title} className="w-full h-full object-cover" />
                        ) : (
                          <User className="w-6 h-6 text-gray-600" />
                        )}
                      </div>
                      <label className="flex-1 flex items-center justify-center gap-2 p-3 border-2 border-dashed border-gray-300 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                        <Upload className="w-4 h-4 text-gray-400" />
                        <span className="text-sm font-medium text-gray-600">Upload</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={avatar.handler}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Chat Settings */}
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Chat Settings</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Welcome Message</label>
                  <textarea
                    value={welcomeMessage}
                    onChange={(e) => dispatch(setUiConfig({ welcomeMessage: e.target.value }))}
                    className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent min-h-[80px] resize-y"
                    placeholder="Enter the first message the bot sends..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Quick Questions</label>
                  <div className="space-y-2">
                    {customQuestions?.map((question, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <input
                          type="text"
                          value={question}
                          onChange={(e) => {
                            const newQuestions = [...(customQuestions || [])]
                            newQuestions[index] = e.target.value
                            dispatch(setUiConfig({ customQuestions: newQuestions }))
                          }}
                          className="flex-1 p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                          placeholder="Enter a quick question"
                        />
                        <button
                          onClick={() => {
                            const newQuestions = (customQuestions || []).filter((_, i) => i !== index)
                            dispatch(setUiConfig({ customQuestions: newQuestions }))
                          }}
                          className="p-3 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={() => {
                        if ((customQuestions || []).length < 5) {
                          dispatch(setUiConfig({
                            customQuestions: [...(customQuestions || []), '']
                          }))
                        }
                      }}
                      className="w-full p-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-gray-400 hover:text-gray-900 transition-all flex items-center justify-center gap-2"
                      disabled={(customQuestions || []).length >= 5}
                    >
                      <Plus className="w-4 h-4" />
                      Add Quick Question ({(customQuestions || []).length}/5)
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Preview Tab */
          <div className="p-4">
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden max-w-sm mx-auto">
              {/* Chat Header */}
              <div
                className="p-4 text-white"
                style={{
                  backgroundColor: customPrimaryColor
                }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
                    {botAvatar ? (
                      <img src={botAvatar} alt="Bot" className="w-8 h-8 rounded-lg object-cover" />
                    ) : (
                      <Bot className="w-5 h-5 text-white" />
                    )}
                  </div>
                  <div>
                    <h2 className="text-white font-semibold">{botName || 'AI Assistant'}</h2>
                    <div className="flex items-center gap-2 text-white/80 text-sm">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      <span>online</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Messages Area */}
              <div className="h-80 overflow-y-auto p-4 space-y-4" style={{ backgroundColor: customBgColor }}>
                {messages.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center">
                    <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center mb-3">
                      <Bot className="w-6 h-6 text-gray-600" />
                    </div>
                    <h3 className="font-semibold mb-2 text-gray-900">
                      {botName || 'AI Assistant'}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {welcomeMessage || 'Hello! How can I help you today?'}
                    </p>
                  </div>
                ) : (
                  messages.map((message, index) => (
                    <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`flex items-start gap-2 max-w-[85%]`}>
                        {message.role === 'bot' && (
                          <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
                            {botAvatar ? (
                              <img src={botAvatar} alt="Bot" className="w-6 h-6 rounded-lg object-cover" />
                            ) : (
                              <Bot className="w-4 h-4 text-gray-600" />
                            )}
                          </div>
                        )}

                        <div
                          className={`rounded-lg px-4 py-3 ${
                            message.role === 'user'
                              ? 'bg-gray-900 text-white'
                              : 'bg-white text-gray-900 border border-gray-200'
                          }`}
                          style={{ fontSize: selectedFontSize }}
                        >
                          <p className="leading-relaxed">{message.content}</p>
                        </div>

                        {message.role === 'user' && (
                          <div className="w-8 h-8 rounded-lg bg-gray-600 flex items-center justify-center">
                            {userAvatar ? (
                              <img src={userAvatar} alt="User" className="w-6 h-6 rounded-lg object-cover" />
                            ) : (
                              <User className="w-4 h-4 text-white" />
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                )}

                {isTyping && (
                  <div className="flex justify-start">
                    <div className="flex items-start gap-2">
                      <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
                        {botAvatar ? (
                          <img src={botAvatar} alt="Bot" className="w-6 h-6 rounded-lg object-cover" />
                        ) : (
                          <Bot className="w-4 h-4 text-gray-600" />
                        )}
                      </div>
                      <div className="bg-white rounded-lg px-4 py-3 border border-gray-200">
                        <div className="flex items-center gap-2">
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"></div>
                            <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{animationDelay: '150ms'}}></div>
                            <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{animationDelay: '300ms'}}></div>
                          </div>
                          <span className="text-sm italic text-gray-500">AI is thinking...</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Input Area */}
              <div className="p-4 border-t border-gray-200">
                {customQuestions.length > 0 && (
                  <div className="mb-3 flex flex-wrap gap-2">
                    {customQuestions.map((question, index) => (
                      <button
                        key={index}
                        onClick={() => dispatch(setUiConfig({ input: question }))}
                        className="px-3 py-1.5 rounded-full text-xs font-medium border border-gray-300 text-gray-700 hover:bg-gray-50 transition-all"
                      >
                        {question}
                      </button>
                    ))}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="flex items-end gap-3">
                  <div className="flex-1 relative">
                    <textarea
                      value={input}
                      onChange={e => dispatch(setUiConfig({ input: e.target.value }))}
                      placeholder="Ask me anything..."
                      rows={1}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent resize-none"
                      style={{ minHeight: '48px', maxHeight: '100px' }}
                      disabled={isTyping}
                    />
                  </div>
                  <button
                    type="submit"
                    className={`p-3 rounded-lg transition-all ${
                      input.trim() && !isTyping
                        ? 'bg-gray-900 hover:bg-gray-800 text-white'
                        : 'bg-gray-200 text-gray-400'
                    }`}
                    disabled={isTyping || !input.trim()}
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
          </div>
        )}
      </div>
    </div>
  )
}