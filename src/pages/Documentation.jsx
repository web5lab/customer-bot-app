import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  ArrowLeft, 
  FileText, 
  Bot, 
  MessageSquare, 
  Settings, 
  Users, 
  Brain, 
  Code, 
  Shield, 
  Search, 
  ChevronRight, 
  ChevronDown,
  Play,
  Copy,
  Check,
  BookOpen,
  Lightbulb,
  Target,
  Rocket
} from 'lucide-react'

const documentationSections = [
  {
    id: 'getting-started',
    title: 'Getting Started',
    icon: Rocket,
    items: [
      {
        id: 'quick-start',
        title: 'Quick Start Guide',
        content: `
# Quick Start Guide

Welcome to CustomerBot! Get your AI assistant up and running in minutes.

## Step 1: Create Your First Bot
1. Tap the "Create New Assistant" card on the main screen
2. Enter a name for your bot (e.g., "Support Assistant")
3. Optionally add your website URL for automatic content scanning
4. Choose to skip training data or add PDFs/text content
5. Tap "Create" to build your AI assistant

## Step 2: Customize Your Bot
1. Tap on your newly created bot
2. Choose from pre-made color schemes or create custom colors
3. Upload custom avatars for bot and user
4. Set the bot's personality with a system prompt
5. Add quick questions for common inquiries
6. Save your changes

## Step 3: Test Your Bot
1. Switch to the "Preview" tab
2. Start a conversation to test responses
3. Adjust settings based on performance
4. Your bot is ready to help customers!

## Next Steps
- Add more training data in the Training section
- Invite team members to collaborate
- Monitor conversations and analytics
        `
      },
      {
        id: 'first-bot',
        title: 'Creating Your First Bot',
        content: `
# Creating Your First Bot

## Bot Creation Process

### Basic Information
- **Bot Name**: Choose a clear, descriptive name
- **Website URL**: Optional but recommended for content scanning
- **Bot Icon**: Upload a custom avatar or use default

### Training Data Options
1. **Skip**: Start with basic AI knowledge
2. **Upload PDF**: Add documents for specialized knowledge
3. **Enter Text**: Add custom training content

### Best Practices
- Use clear, descriptive names
- Add relevant training data for your industry
- Test thoroughly before deploying
- Start simple and iterate
        `
      }
    ]
  },
  {
    id: 'customization',
    title: 'Customization',
    icon: Settings,
    items: [
      {
        id: 'appearance',
        title: 'Appearance & Themes',
        content: `
# Appearance & Themes

## Color Schemes
Choose from pre-designed color palettes or create custom colors.

## Custom Colors
- **Primary Color**: Main accent color
- **Secondary Color**: Supporting color
- **Background Color**: Chat background

## Theme Modes
- **Light Mode**: Clean, bright interface
- **Dark Mode**: Easy on the eyes

## Typography
Choose from 4 font sizes for optimal readability.
        `
      },
      {
        id: 'chat-settings',
        title: 'Chat Configuration',
        content: `
# Chat Configuration

## Bot Persona
Define your bot's personality and behavior with system prompts.

## Welcome Messages
Set the first message users see when opening chat.

## Quick Questions
Add up to 5 pre-written questions for common inquiries.

## Message Settings
Configure font sizes, colors, and chat behavior.
        `
      }
    ]
  },
  {
    id: 'training',
    title: 'Training & AI',
    icon: Brain,
    items: [
      {
        id: 'training-data',
        title: 'Training Data Types',
        content: `
# Training Data Types

## PDF Documents
Upload PDF files to train your bot:
- Supported: PDF files up to 10MB
- Best for: Manuals, guides, documentation
- Limit: 20 sources per bot

## Website Content
Scrape content from web pages:
- Input: Valid website URLs
- Best for: Product pages, FAQ sections
- Automatic content extraction

## Custom Text
Add specific knowledge directly:
- Format: Plain text content
- Limit: 5,000 characters per entry
- Best for: Policies, procedures, FAQs

## Q&A Pairs
Create specific question-answer combinations for common scenarios.
        `
      },
      {
        id: 'ai-behavior',
        title: 'AI Behavior & Prompts',
        content: `
# AI Behavior & Prompts

## System Prompts
The system prompt defines your bot's personality and behavior.

### Example System Prompts

**Customer Support:**
\`\`\`
You are a helpful customer support assistant. Always be polite and professional. 
If you don't know something, admit it and offer to connect with a human agent.
\`\`\`

**Sales Assistant:**
\`\`\`
You are a friendly sales assistant. Help customers find products and guide them 
through the purchase process. Be enthusiastic but not pushy.
\`\`\`

## Best Practices
- Be specific about desired behavior
- Include examples of good responses
- Set clear boundaries
- Test with various scenarios
        `
      }
    ]
  },
  {
    id: 'integrations',
    title: 'Integrations & API',
    icon: Code,
    items: [
      {
        id: 'website-integration',
        title: 'Website Integration',
        content: `
# Website Integration

## HTML/JavaScript
Add to any website:
\`\`\`html
<script src="https://cdn.customerbot.ai/widget.js" 
        data-bot-id="YOUR_BOT_ID">
</script>
\`\`\`

## React Integration
\`\`\`jsx
import { CustomerBotWidget } from '@customerbot/react'

<CustomerBotWidget botId="YOUR_BOT_ID" />
\`\`\`

## WordPress
Use the shortcode:
\`\`\`
[customerbot bot-id="YOUR_BOT_ID"]
\`\`\`

## Configuration Options
- Theme customization
- Position settings
- Behavior configuration
        `
      },
      {
        id: 'api-docs',
        title: 'API Documentation',
        content: `
# API Documentation

## Authentication
All API requests require authentication:
\`\`\`javascript
headers: {
  'Authorization': 'Bearer YOUR_API_KEY',
  'Content-Type': 'application/json'
}
\`\`\`

## Endpoints

### Bots
\`\`\`
GET /api/bots - List bots
POST /api/bots - Create bot
PUT /api/bots/{id} - Update bot
DELETE /api/bots/{id} - Delete bot
\`\`\`

### Chat
\`\`\`
POST /api/chat/message - Send message
GET /api/chat/sessions - List sessions
\`\`\`

## Rate Limits
- Free: 100 requests/hour
- Pro: 1,000 requests/hour
- Enterprise: Custom limits
        `
      }
    ]
  },
  {
    id: 'troubleshooting',
    title: 'Troubleshooting',
    icon: Lightbulb,
    items: [
      {
        id: 'common-issues',
        title: 'Common Issues',
        content: `
# Common Issues & Solutions

## Bot Not Responding
- Check training data quality
- Verify system prompt clarity
- Ensure API limits aren't exceeded
- Test network connectivity

## Poor Response Quality
- Add more relevant training data
- Improve system prompt specificity
- Create Q&A pairs for common questions
- Regular content updates

## Integration Problems
- Verify correct bot ID
- Check script loading
- Resolve conflicts with other scripts
- Ensure proper permissions

## Getting Help
- Documentation and guides
- Live chat support
- Email support
- Community forum
        `
      }
    ]
  }
];

export function Documentation() {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedSections, setExpandedSections] = useState(new Set(['getting-started']))
  const [selectedItem, setSelectedItem] = useState(null)
  const [copiedCode, setCopiedCode] = useState('')

  const toggleSection = (sectionId) => {
    setExpandedSections(prev => {
      const newSet = new Set(prev)
      if (newSet.has(sectionId)) {
        newSet.delete(sectionId)
      } else {
        newSet.add(sectionId)
      }
      return newSet
    })
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
    setCopiedCode(text)
    setTimeout(() => setCopiedCode(''), 2000)
  }

  const filteredSections = documentationSections.filter(section =>
    section.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    section.items.some(item => 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.content.toLowerCase().includes(searchQuery.toLowerCase())
    )
  )

  const renderContent = (content) => {
    const lines = content.trim().split('\n')
    const elements = []
    let currentCodeBlock = []
    let inCodeBlock = false

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]

      if (line.startsWith('```')) {
        if (inCodeBlock) {
          elements.push(
            <div key={i} className="relative bg-gray-900 rounded-lg p-4 my-4 overflow-x-auto">
              <button
                onClick={() => copyToClipboard(currentCodeBlock.join('\n'))}
                className="absolute top-3 right-3 p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
              >
                {copiedCode === currentCodeBlock.join('\n') ? (
                  <Check className="w-4 h-4 text-green-400" />
                ) : (
                  <Copy className="w-4 h-4 text-gray-300" />
                )}
              </button>
              <pre className="text-green-400 text-sm">
                <code>{currentCodeBlock.join('\n')}</code>
              </pre>
            </div>
          )
          currentCodeBlock = []
          inCodeBlock = false
        } else {
          inCodeBlock = true
        }
        continue
      }

      if (inCodeBlock) {
        currentCodeBlock.push(line)
        continue
      }

      if (line.startsWith('# ')) {
        elements.push(
          <h1 key={i} className="text-2xl font-bold text-gray-900 mb-4 mt-6">
            {line.substring(2)}
          </h1>
        )
      } else if (line.startsWith('## ')) {
        elements.push(
          <h2 key={i} className="text-xl font-semibold text-gray-900 mb-3 mt-5">
            {line.substring(3)}
          </h2>
        )
      } else if (line.startsWith('### ')) {
        elements.push(
          <h3 key={i} className="text-lg font-medium text-gray-900 mb-2 mt-4">
            {line.substring(4)}
          </h3>
        )
      } else if (line.startsWith('- ')) {
        elements.push(
          <li key={i} className="text-gray-700 mb-1 ml-4">
            • {line.substring(2)}
          </li>
        )
      } else if (/^\d+\. /.test(line)) {
        elements.push(
          <li key={i} className="text-gray-700 mb-1 ml-4">
            {line}
          </li>
        )
      } else if (line.trim() === '') {
        elements.push(<div key={i} className="h-2" />)
      } else {
        elements.push(
          <p key={i} className="text-gray-700 mb-3 leading-relaxed">
            {line}
          </p>
        )
      }
    }

    return elements
  }

  if (selectedItem) {
    return (
      <div className="h-full flex flex-col bg-white">
        <div className="border-b border-gray-200">
          <div className="px-4 py-3">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSelectedItem(null)}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div>
                <h1 className="text-lg font-semibold text-gray-900">{selectedItem.title}</h1>
                <p className="text-sm text-gray-600">Documentation</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="p-4">
            <div className="prose prose-sm max-w-none">
              {renderContent(selectedItem.content)}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col bg-white">
      <div className="border-b border-gray-200">
        <div className="px-4 py-3">
          <div className="flex items-center gap-3 mb-4">
            <button
              onClick={() => navigate('/')}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-gray-600" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Documentation</h1>
                <p className="text-sm text-gray-600">Complete guide to CustomerBot</p>
              </div>
            </div>
          </div>

          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search documentation..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-4">
          {/* Welcome Section */}
          <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center border border-gray-200">
                <BookOpen className="w-6 h-6 text-gray-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Welcome to CustomerBot</h2>
                <p className="text-gray-600">Your complete guide to AI-powered customer support</p>
              </div>
            </div>
            <p className="text-gray-600 leading-relaxed">
              This documentation covers everything you need to know about creating, customizing, and managing your AI assistants.
            </p>
          </div>

          {/* Quick Links */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setSelectedItem(documentationSections[0].items[0])}
              className="p-4 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <Play className="w-4 h-4 text-green-600" />
                </div>
                <span className="font-semibold text-gray-900 text-sm">Quick Start</span>
              </div>
              <p className="text-xs text-gray-600 text-left">Get started in minutes</p>
            </button>

            <button
              onClick={() => setSelectedItem(documentationSections[3].items[0])}
              className="p-4 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Code className="w-4 h-4 text-blue-600" />
                </div>
                <span className="font-semibold text-gray-900 text-sm">API Guide</span>
              </div>
              <p className="text-xs text-gray-600 text-left">Integration examples</p>
            </button>
          </div>

          {/* Documentation Sections */}
          {filteredSections.map((section) => (
            <div key={section.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <button
                onClick={() => toggleSection(section.id)}
                className="w-full p-4 text-left hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                      <section.icon className="w-5 h-5 text-gray-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">{section.title}</h3>
                      <p className="text-sm text-gray-600">{section.items.length} articles</p>
                    </div>
                  </div>
                  {expandedSections.has(section.id) ? (
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  ) : (
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  )}
                </div>
              </button>

              {expandedSections.has(section.id) && (
                <div className="border-t border-gray-100">
                  {section.items.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setSelectedItem(item)}
                      className="w-full p-4 text-left hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-b-0"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-1">{item.title}</h4>
                          <p className="text-sm text-gray-600 line-clamp-2">
                            {item.content.split('\n').find(line => line.trim() && !line.startsWith('#'))?.substring(0, 100)}...
                          </p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-gray-400" />
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}

          {/* No Results */}
          {filteredSections.length === 0 && searchQuery && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No results found</h3>
              <p className="text-gray-600 mb-4">
                No documentation found matching "{searchQuery}"
              </p>
              <button
                onClick={() => setSearchQuery('')}
                className="text-gray-900 font-medium hover:underline"
              >
                Clear search
              </button>
            </div>
          )}

          {/* Help Section */}
          <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center border border-gray-200">
                <MessageSquare className="w-5 h-5 text-gray-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Need More Help?</h3>
                <p className="text-gray-600 text-sm">We're here to support you</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button className="flex items-center justify-center gap-2 p-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <MessageSquare className="w-4 h-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-900">Live Chat</span>
              </button>
              <button className="flex items-center justify-center gap-2 p-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <Users className="w-4 h-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-900">Support</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}