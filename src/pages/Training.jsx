import { useState, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { 
  Brain, 
  FileText, 
  Globe, 
  Type, 
  MessageSquare, 
  Upload, 
  Plus, 
  X, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  Trash2,
  ArrowLeft,
  ChevronDown,
  Check,
  Bot
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { botsSelector, activeBotSelector } from '../store/selectors'
import { setActiveBot } from '../store/slice'
import { scrapPdfData, scrapWebsiteUrl } from '../store/actions'

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
const MAX_SOURCES = 20
const MAX_TEXT_LENGTH = 5000

export function Training() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const bots = useSelector(botsSelector)
  const activeBot = useSelector(activeBotSelector)
  const [activeTab, setActiveTab] = useState('pdf')
  const [showBotSelector, setShowBotSelector] = useState(false)
  const [trainingItems, setTrainingItems] = useState({
    pdf: [],
    websites: [],
    text: []
  })

  const fileInputRef = useRef(null)

  const tabs = [
    { key: 'pdf', label: 'PDF', icon: FileText },
    { key: 'websites', label: 'Websites', icon: Globe },
    { key: 'text', label: 'Text', icon: Type },
    { key: 'qa', label: 'Q&A', icon: MessageSquare }
  ]

  const handleBotChange = (bot) => {
    dispatch(setActiveBot(bot))
    setShowBotSelector(false)
    setTrainingItems({
      pdf: [],
      websites: [],
      text: []
    })
  }

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > MAX_FILE_SIZE) {
      alert('File size must be less than 10MB')
      return
    }

    if (trainingItems.pdf.length >= MAX_SOURCES) {
      alert('Maximum number of sources reached')
      return
    }

    setTrainingItems(prev => ({
      ...prev,
      pdf: [...prev.pdf, { name: file.name, status: 'processing' }]
    }))

    const formData = new FormData()
    formData.append('pdf', file)

    try {
      await dispatch(scrapPdfData({ data: formData }))
      setTrainingItems(prev => ({
        ...prev,
        pdf: prev.pdf.map(item =>
          item.name === file.name ? { ...item, status: 'completed' } : item
        )
      }))
    } catch (error) {
      setTrainingItems(prev => ({
        ...prev,
        pdf: prev.pdf.map(item =>
          item.name === file.name ? { ...item, status: 'failed' } : item
        )
      }))
    }
  }

  const handleWebsiteAdd = async (e) => {
    e.preventDefault()
    const url = new FormData(e.currentTarget).get('url')
    if (!url) return

    if (trainingItems.websites.length >= MAX_SOURCES) {
      alert('Maximum number of sources reached')
      return
    }

    setTrainingItems(prev => ({
      ...prev,
      websites: [...prev.websites, { name: url.toString(), status: 'processing' }]
    }))

    try {
      await dispatch(scrapWebsiteUrl({ url: url.toString() }))
      setTrainingItems(prev => ({
        ...prev,
        websites: prev.websites.map(item =>
          item.name === url.toString() ? { ...item, status: 'completed' } : item
        )
      }))
    } catch (error) {
      setTrainingItems(prev => ({
        ...prev,
        websites: prev.websites.map(item =>
          item.name === url.toString() ? { ...item, status: 'failed' } : item
        )
      }))
    }

    e.currentTarget.reset()
  }

  const handleTextAdd = (e) => {
    e.preventDefault()
    const text = new FormData(e.currentTarget).get('text')
    if (!text) return

    if (trainingItems.text.length >= MAX_SOURCES) {
      alert('Maximum number of sources reached')
      return
    }

    setTrainingItems(prev => ({
      ...prev,
      text: [...prev.text, { 
        name: `Text Document ${prev.text.length + 1}`, 
        content: text.toString(), 
        status: 'completed' 
      }]
    }))

    e.currentTarget.reset()
  }

  const removeItem = (type, index) => {
    setTrainingItems(prev => ({
      ...prev,
      [type]: prev[type].filter((_, i) => i !== index)
    }))
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'processing':
        return <Clock className="w-4 h-4 text-gray-500 animate-spin" />
      case 'failed':
        return <AlertCircle className="w-4 h-4 text-red-500" />
      default:
        return <Clock className="w-4 h-4 text-gray-400" />
    }
  }

  const getTabStats = (key) => {
    return trainingItems[key]?.length || 0
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'pdf':
        return (
          <div className="space-y-4">
            {/* Upload Section */}
            <div className="border border-gray-200 rounded-lg p-4">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full flex flex-col items-center gap-3 p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 transition-colors"
                disabled={trainingItems.pdf.length >= MAX_SOURCES}
              >
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                  <Upload className="w-6 h-6 text-gray-600" />
                </div>
                <div className="text-center">
                  <h3 className="font-semibold text-gray-900 mb-1">Upload PDF</h3>
                  <p className="text-sm text-gray-600">Max 10MB per file</p>
                </div>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>

            {/* Items List */}
            <div className="space-y-2">
              {trainingItems.pdf.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200">
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-gray-600" />
                    <div>
                      <p className="font-medium text-gray-900 text-sm">{item.name}</p>
                      <p className="text-xs text-gray-500">PDF Document</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(item.status)}
                    <button
                      onClick={() => removeItem('pdf', index)}
                      className="p-1 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )

      case 'websites':
        return (
          <div className="space-y-4">
            {/* Add Website Form */}
            <form onSubmit={handleWebsiteAdd} className="border border-gray-200 rounded-lg p-4">
              <div className="space-y-3">
                <div className="flex items-center gap-2 mb-3">
                  <Globe className="w-5 h-5 text-gray-600" />
                  <h3 className="font-semibold text-gray-900">Add Website</h3>
                </div>
                <div className="flex gap-2">
                  <input
                    type="url"
                    name="url"
                    placeholder="https://example.com"
                    className="flex-1 px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                    required
                  />
                  <button
                    type="submit"
                    className="px-4 py-3 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
                    disabled={trainingItems.websites.length >= MAX_SOURCES}
                  >
                    Add
                  </button>
                </div>
              </div>
            </form>

            {/* Items List */}
            <div className="space-y-2">
              {trainingItems.websites.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200">
                  <div className="flex items-center gap-3">
                    <Globe className="w-5 h-5 text-gray-600" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 text-sm truncate">{item.name}</p>
                      <p className="text-xs text-gray-500">Website Content</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(item.status)}
                    <button
                      onClick={() => removeItem('websites', index)}
                      className="p-1 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )

      case 'text':
        return (
          <div className="space-y-4">
            {/* Add Text Form */}
            <form onSubmit={handleTextAdd} className="border border-gray-200 rounded-lg p-4">
              <div className="space-y-3">
                <div className="flex items-center gap-2 mb-3">
                  <Type className="w-5 h-5 text-gray-600" />
                  <h3 className="font-semibold text-gray-900">Add Text Content</h3>
                </div>
                <textarea
                  name="text"
                  placeholder="Enter your training text here..."
                  maxLength={MAX_TEXT_LENGTH}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent resize-none"
                  required
                />
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">
                    Max {MAX_TEXT_LENGTH.toLocaleString()} characters
                  </span>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
                    disabled={trainingItems.text.length >= MAX_SOURCES}
                  >
                    Add Text
                  </button>
                </div>
              </div>
            </form>

            {/* Items List */}
            <div className="space-y-2">
              {trainingItems.text.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200">
                  <div className="flex items-center gap-3">
                    <Type className="w-5 h-5 text-gray-600" />
                    <div>
                      <p className="font-medium text-gray-900 text-sm">{item.name}</p>
                      <p className="text-xs text-gray-500">Custom Text</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(item.status)}
                    <button
                      onClick={() => removeItem('text', index)}
                      className="p-1 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )

      case 'qa':
        return (
          <div className="space-y-4">
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <MessageSquare className="w-5 h-5 text-gray-600" />
                <h3 className="font-semibold text-gray-900">Q&A Training</h3>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                Create question-answer pairs to train your AI assistant
              </p>
              <button className="w-full flex items-center justify-center gap-2 p-3 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors">
                <Plus className="w-4 h-4" />
                Add Q&A Pair
              </button>
            </div>
          </div>
        )

      default:
        return null
    }
  }

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
              
              <div>
                <h1 className="text-xl font-bold text-gray-900">Training</h1>
                <p className="text-sm text-gray-600">Train your AI assistant</p>
              </div>
            </div>
          </div>

          {/* Bot Selector */}
          <div className="relative">
            <button
              onClick={() => setShowBotSelector(!showBotSelector)}
              className="w-full flex items-center gap-3 p-3 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 transition-colors"
            >
              <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center flex-shrink-0">
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
              <div className="flex-1 text-left min-w-0">
                <h2 className="text-sm font-semibold text-gray-900 truncate">
                  {activeBot?.name || 'Select Bot'}
                </h2>
                <p className="text-xs text-gray-500">
                  {activeBot ? 'Training data' : 'Choose bot to train'}
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
                  
                  {bots.length === 0 && (
                    <div className="p-4 text-center">
                      <Bot className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                      <p className="text-sm text-gray-500">No bots available</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 bg-gray-50">
        <div className="flex">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 flex flex-col items-center gap-1 py-3 px-2 transition-all ${
                activeTab === tab.key
                  ? 'text-gray-900 border-b-2 border-gray-900 bg-white'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <tab.icon className="w-5 h-5" />
              <span className="text-xs font-medium">{tab.label}</span>
              <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                activeTab === tab.key 
                  ? 'bg-gray-100 text-gray-700' 
                  : 'bg-gray-200 text-gray-600'
              }`}>
                {getTabStats(tab.key)}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4">
          {activeBot ? (
            renderTabContent()
          ) : (
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Brain className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Select a Bot</h3>
              <p className="text-gray-500 mb-6">
                Choose a bot from the dropdown above to start training
              </p>
              <button
                onClick={() => setShowBotSelector(true)}
                className="px-6 py-3 bg-gray-900 text-white rounded-lg font-semibold hover:bg-gray-800 transition-colors"
              >
                Select Bot
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}