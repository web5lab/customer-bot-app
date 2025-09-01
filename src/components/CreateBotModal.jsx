import { useState, useRef } from 'react'
import { useDispatch } from 'react-redux'
import {
  X,
  Upload,
  Bot,
  Sparkles,
  Save,
  FileText,
  Copy,
  Check,
  Globe,
  User,
  Code,
  Loader2,
  Database,
  Plus,
  ArrowRight,
  ChevronRight
} from 'lucide-react'
import { GetBots } from '../store/actions'

export function CreateBotModal({ onClose }) {
  const dispatch = useDispatch()
  const [currentStep, setCurrentStep] = useState(1)
  const [botName, setBotName] = useState('')
  const [websiteUrl, setWebsiteUrl] = useState('')
  const [botIcon, setBotIcon] = useState(null)
  const [faqMethod, setFaqMethod] = useState('skip')
  const [faqFile, setFaqFile] = useState(null)
  const [faqText, setFaqText] = useState('')
  const [isCreating, setIsCreating] = useState(false)
  const [isCreated, setIsCreated] = useState(false)
  const [copiedCode, setCopiedCode] = useState('')
  const [selectedIntegration, setSelectedIntegration] = useState('react')

  const fileInputRef = useRef(null)
  const faqFileInputRef = useRef(null)

  const handleIconUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      setBotIcon(file)
    }
  }

  const handleFaqFileUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      setFaqFile(file)
    }
  }

  const handleCreate = async (e) => {
    e.preventDefault()
    setIsCreating(true)

    try {
      if (!botName) {
        alert("Bot name is required")
        setIsCreating(false)
        return
      }

      // Simulate bot creation
      setTimeout(() => {
        dispatch(GetBots())
        setIsCreating(false)
        setIsCreated(true)
        setCurrentStep(4)
      }, 2000)

    } catch (error) {
      setIsCreating(false)
      console.error("Error creating bot:", error)
    }
  }

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 4))
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1))

  const copyToClipboard = (code, type) => {
    navigator.clipboard.writeText(code)
    setCopiedCode(type)
    setTimeout(() => setCopiedCode(''), 2000)
  }

  const getIntegrationCode = () => {
    const botId = 'bot_' + Math.random().toString(36).substr(2, 9)

    const codes = {
      react: `<script
  src="https://cdn.customerbot.ai/widget.js"
  data-bot-id="${botId}"
  data-theme="modern"
></script>`,
      html: `<script src="https://cdn.customerbot.ai/widget.js" data-bot-id="${botId}"></script>`,
      wordpress: `[customerbot bot-id="${botId}" theme="modern"]`
    }

    return codes[selectedIntegration]
  }

  const getTotalSteps = () => faqMethod === 'skip' ? 3 : 4

  // Loading Screen
  if (isCreating) {
    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-3xl w-full max-w-sm shadow-2xl border border-gray-100 overflow-hidden">
          <div className="p-8 text-center">
            <div className="relative mb-6">
              <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
                <Bot className="w-10 h-10 text-white" />
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
            </div>

            <div className="mb-6">
              <Loader2 className="w-8 h-8 mx-auto text-blue-500 animate-spin mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">Creating Your Assistant</h3>
              <p className="text-gray-600">Setting up your AI-powered helper...</p>
            </div>

            <div className="space-y-3 text-sm text-gray-500">
              <div className="flex items-center justify-center gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                <span>Processing configuration</span>
              </div>
              <div className="flex items-center justify-center gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
                <span>Training AI model</span>
              </div>
              <div className="flex items-center justify-center gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
                <span>Finalizing setup</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl border border-gray-100 max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-white overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-400/20"></div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12"></div>

          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-2xl bg-white/20 backdrop-blur-sm">
                <Bot className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Create AI Assistant</h2>
                <p className="text-white/80">Step {currentStep} of {getTotalSteps()}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/20 hover:bg-white/30 transition-colors backdrop-blur-sm"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Enhanced Progress Bar */}
          <div className="mt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-white/80">Progress</span>
              <span className="text-sm text-white/80">{Math.round((currentStep / getTotalSteps()) * 100)}%</span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-2 backdrop-blur-sm">
              <div
                className="bg-white rounded-full h-2 transition-all duration-500 shadow-sm"
                style={{ width: `${(currentStep / getTotalSteps()) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Step 1: Basic Information */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center mb-4">
                  <User className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Basic Information</h3>
                <p className="text-gray-600">Let's start with the basics</p>
              </div>

              {/* Bot Icon Upload */}
              <div className="text-center">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Bot Avatar (Optional)
                </label>
                <div
                  className="w-24 h-24 mx-auto rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center cursor-pointer hover:scale-105 transition-all duration-300 shadow-lg relative overflow-hidden"
                  onClick={() => fileInputRef.current?.click()}
                >
                  {botIcon ? (
                    <img
                      src={URL.createObjectURL(botIcon)}
                      alt="Bot Icon"
                      className="w-full h-full rounded-2xl object-cover"
                    />
                  ) : (
                    <div className="text-center">
                      <Upload className="w-8 h-8 text-white mx-auto mb-1" />
                      <span className="text-xs text-white/80">Upload</span>
                    </div>
                  )}
                </div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleIconUpload}
                  accept="image/*"
                  className="hidden"
                />
              </div>

              {/* Bot Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Assistant Name *
                </label>
                <input
                  type="text"
                  value={botName}
                  onChange={(e) => setBotName(e.target.value)}
                  placeholder="e.g., Support Assistant"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-gray-50 focus:bg-white"
                  required
                />
              </div>

              {/* Website URL */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Website URL (Optional)
                </label>
                <div className="relative">
                  <Globe className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="url"
                    value={websiteUrl}
                    onChange={(e) => setWebsiteUrl(e.target.value)}
                    placeholder="https://example.com"
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-gray-50 focus:bg-white"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-2">We'll scan your website to train the AI</p>
              </div>
            </div>
          )}

          {/* Step 2: Training Data */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-green-100 to-emerald-100 flex items-center justify-center mb-4">
                  <Database className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Training Data</h3>
                <p className="text-gray-600">How would you like to train your AI?</p>
              </div>

              {/* Training Options */}
              <div className="space-y-3">
                {[
                  { 
                    value: 'skip', 
                    title: 'Skip for now', 
                    description: 'Start with basic AI knowledge',
                    icon: ChevronRight,
                    gradient: 'from-gray-100 to-gray-200'
                  },
                  { 
                    value: 'upload', 
                    title: 'Upload PDF', 
                    description: 'Train with your documents',
                    icon: FileText,
                    gradient: 'from-blue-100 to-blue-200'
                  },
                  { 
                    value: 'text', 
                    title: 'Add custom text', 
                    description: 'Enter training content manually',
                    icon: Database,
                    gradient: 'from-purple-100 to-purple-200'
                  }
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setFaqMethod(option.value)}
                    className={`w-full p-4 rounded-2xl border-2 transition-all duration-300 ${
                      faqMethod === option.value
                        ? 'border-blue-500 bg-blue-50 shadow-lg scale-105'
                        : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-xl bg-gradient-to-br ${option.gradient}`}>
                        <option.icon className="w-5 h-5 text-gray-700" />
                      </div>
                      <div className="flex-1 text-left">
                        <h4 className="font-semibold text-gray-900">{option.title}</h4>
                        <p className="text-sm text-gray-600">{option.description}</p>
                      </div>
                      <div className={`w-5 h-5 rounded-full border-2 transition-all ${
                        faqMethod === option.value
                          ? 'border-blue-500 bg-blue-500'
                          : 'border-gray-300'
                      }`}>
                        {faqMethod === option.value && (
                          <Check className="w-3 h-3 text-white m-0.5" />
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              {/* Training Content */}
              {faqMethod === 'upload' && (
                <div
                  className="border-2 border-dashed border-blue-300 rounded-2xl p-6 text-center cursor-pointer hover:border-blue-400 transition-all bg-blue-50/50"
                  onClick={() => faqFileInputRef.current?.click()}
                >
                  {faqFile ? (
                    <div className="flex items-center justify-center gap-3">
                      <div className="p-2 rounded-xl bg-blue-100">
                        <FileText className="w-5 h-5 text-blue-600" />
                      </div>
                      <span className="font-medium text-gray-900">{faqFile.name}</span>
                    </div>
                  ) : (
                    <div>
                      <div className="w-12 h-12 mx-auto rounded-xl bg-blue-100 flex items-center justify-center mb-3">
                        <Upload className="w-6 h-6 text-blue-600" />
                      </div>
                      <p className="font-medium text-gray-900 mb-1">Upload PDF Document</p>
                      <p className="text-sm text-gray-600">Drag & drop or click to browse</p>
                    </div>
                  )}
                  <input
                    type="file"
                    ref={faqFileInputRef}
                    onChange={handleFaqFileUpload}
                    accept=".pdf"
                    className="hidden"
                  />
                </div>
              )}

              {faqMethod === 'text' && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Training Content
                  </label>
                  <textarea
                    value={faqText}
                    onChange={(e) => setFaqText(e.target.value)}
                    placeholder="Enter your training content here..."
                    rows="6"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none bg-gray-50 focus:bg-white transition-all"
                  />
                  <p className="text-xs text-gray-500 mt-2">Add FAQs, product info, or any relevant content</p>
                </div>
              )}
            </div>
          )}

          {/* Step 3: Review & Create */}
          {currentStep === 3 && !isCreated && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-green-100 to-emerald-100 flex items-center justify-center mb-4">
                  <Check className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Review & Create</h3>
                <p className="text-gray-600">Everything looks good!</p>
              </div>

              <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl p-6 border border-gray-200">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg">
                    {botIcon ? (
                      <img
                        src={URL.createObjectURL(botIcon)}
                        alt="Bot Icon"
                        className="w-full h-full rounded-2xl object-cover"
                      />
                    ) : (
                      <Bot className="w-8 h-8 text-white" />
                    )}
                  </div>

                  <div className="flex-1 space-y-3">
                    <h4 className="text-lg font-bold text-gray-900">{botName || 'Unnamed Assistant'}</h4>
                    
                    {websiteUrl && (
                      <div className="flex items-center gap-2 text-sm text-gray-600 bg-white/60 rounded-lg px-3 py-2">
                        <Globe className="w-4 h-4" />
                        <span className="truncate">{websiteUrl}</span>
                      </div>
                    )}
                    
                    <div className="flex items-center gap-2 text-sm text-gray-600 bg-white/60 rounded-lg px-3 py-2">
                      <Database className="w-4 h-4" />
                      <span>
                        Training: {faqMethod === 'skip' ? 'Basic AI knowledge' :
                          faqMethod === 'upload' ? `PDF: ${faqFile?.name || 'Document'}` :
                            'Custom content'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 rounded-2xl p-4 border border-blue-200">
                <h4 className="font-semibold text-blue-900 mb-2">What happens next?</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Your AI assistant will be created instantly</li>
                  <li>• You can customize appearance and behavior</li>
                  <li>• Get integration code for your website</li>
                  <li>• Start helping customers right away</li>
                </ul>
              </div>
            </div>
          )}

          {/* Step 4: Integration Code */}
          {(currentStep === 4 || (currentStep === 3 && isCreated)) && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center mb-4">
                  <Code className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Integration Ready!</h3>
                <p className="text-gray-600">Copy the code to add to your website</p>
              </div>

              {/* Platform Selection */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Choose your platform
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { key: 'react', label: 'React', icon: '⚛️' },
                    { key: 'html', label: 'HTML', icon: '🌐' },
                    { key: 'wordpress', label: 'WordPress', icon: '📝' }
                  ].map((platform) => (
                    <button
                      key={platform.key}
                      onClick={() => setSelectedIntegration(platform.key)}
                      className={`p-3 rounded-xl border-2 transition-all ${
                        selectedIntegration === platform.key
                          ? 'border-blue-500 bg-blue-50 shadow-md'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="text-2xl mb-1">{platform.icon}</div>
                      <div className="text-xs font-medium text-gray-900">{platform.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Code Display */}
              <div className="relative">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Integration Code
                </label>
                <div className="relative bg-gray-900 rounded-2xl overflow-hidden">
                  <pre className="text-green-400 p-4 text-sm overflow-x-auto">
                    <code>{getIntegrationCode()}</code>
                  </pre>
                  <button
                    onClick={() => copyToClipboard(getIntegrationCode(), selectedIntegration)}
                    className="absolute top-3 right-3 p-2 bg-gray-700 hover:bg-gray-600 rounded-xl transition-colors"
                  >
                    {copiedCode === selectedIntegration ? (
                      <Check className="w-4 h-4 text-green-400" />
                    ) : (
                      <Copy className="w-4 h-4 text-gray-300" />
                    )}
                  </button>
                </div>
              </div>

              {/* Instructions */}
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-2xl border border-green-200">
                <h4 className="font-semibold text-green-900 mb-2 flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  Next Steps
                </h4>
                <p className="text-sm text-green-800">
                  {selectedIntegration === 'react' && 'Add this script tag to your React app\'s index.html file'}
                  {selectedIntegration === 'html' && 'Paste this code before the closing </body> tag'}
                  {selectedIntegration === 'wordpress' && 'Add this shortcode to any page or widget'}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between p-6 border-t border-gray-100 bg-gray-50">
          <button
            type="button"
            onClick={currentStep === 1 ? onClose : prevStep}
            className="flex items-center gap-2 px-6 py-3 text-gray-700 hover:text-gray-900 rounded-xl border border-gray-300 hover:bg-white transition-all font-medium"
            disabled={isCreated && (currentStep === 3 || currentStep === 4)}
          >
            {currentStep === 1 ? 'Cancel' : 'Back'}
          </button>

          {(currentStep < 3 || (currentStep === 2 && faqMethod === 'skip')) ? (
            <button
              type="button"
              onClick={() => {
                if (currentStep === 2 && faqMethod === 'skip') {
                  setCurrentStep(3)
                } else {
                  nextStep()
                }
              }}
              disabled={currentStep === 1 && !botName.trim()}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span>Continue</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : currentStep === 3 && !isCreated ? (
            <button
              onClick={handleCreate}
              disabled={!botName.trim()}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="w-4 h-4" />
              <span>Create Assistant</span>
            </button>
          ) : (
            <button
              onClick={onClose}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <span>Done</span>
              <Check className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}