import { createSlice } from '@reduxjs/toolkit'
import { GetUserData, GetBots, createBot, getChatSessions, getChatSession, scrapPdfData, scrapWebsiteUrl } from './actions'

const initialState = {
  user: null,
  logedIn: false,
  bots: [],
  activeBot: null,
  chatSessions: [],
  activeChatSession: null,
  messages: [],
  uiConfig: {
    messages: [],
    input: '',
    isTyping: false,
    sessionId: null
  },
  loading: false,
  error: null
}

const globalSlice = createSlice({
  name: 'global',
  initialState,
  reducers: {
    setActiveBot: (state, action) => {
      state.activeBot = action.payload
      state.uiConfig.sessionId = null
      state.uiConfig.messages = []
    },
    setActiveChatSession: (state, action) => {
      state.activeChatSession = action.payload
    },
    setInput: (state, action) => {
      state.uiConfig.input = action.payload
    },
    setIsTyping: (state, action) => {
      state.uiConfig.isTyping = action.payload
    },
    setSessionId: (state, action) => {
      state.uiConfig.sessionId = action.payload
    },
    setUiConfig: (state, action) => {
      state.uiConfig = { ...state.uiConfig, ...action.payload }
    },
    setLogout: (state) => {
      state.user = null
      state.logedIn = false
      state.activeBot = null
      state.activeChatSession = null
      state.messages = []
      state.uiConfig = {
        messages: [],
        input: '',
        isTyping: false,
        sessionId: null
      }
    },
    resetMessages: (state) => {
      state.uiConfig.messages = []
    },
    addMessage: (state, action) => {
      state.messages.push(action.payload)
      state.uiConfig.messages.push(action.payload)
    },
    clearMessages: (state) => {
      state.messages = []
      state.uiConfig.messages = []
    },
    clearError: (state) => {
      state.error = null
    }
  },
  extraReducers: (builder) => {
    builder
      // GetUserData
      .addCase(GetUserData.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(GetUserData.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload.user
        state.logedIn = true
      })
      .addCase(GetUserData.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })
      // GetBots
      .addCase(GetBots.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(GetBots.fulfilled, (state, action) => {
        state.loading = false
        state.bots = action.payload.bots || []
      })
      .addCase(GetBots.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })
      // createBot
      .addCase(createBot.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(createBot.fulfilled, (state, action) => {
        state.loading = false
        state.bots.push(action.payload.bot)
      })
      .addCase(createBot.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })
      // getChatSessions
      .addCase(getChatSessions.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(getChatSessions.fulfilled, (state, action) => {
        state.loading = false
        state.chatSessions = action.payload.sessions || []
      })
      .addCase(getChatSessions.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })
      // getChatSession
      .addCase(getChatSession.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(getChatSession.fulfilled, (state, action) => {
        state.loading = false
        state.activeChatSession = action.payload.session
        state.messages = action.payload.session?.messages || []
        state.uiConfig.messages = action.payload.session?.messages || []
        state.uiConfig.sessionId = action.payload.session?.id || null
      })
      .addCase(getChatSession.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })
      // scrapPdfData
      .addCase(scrapPdfData.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(scrapPdfData.fulfilled, (state, action) => {
        state.loading = false
      })
      .addCase(scrapPdfData.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })
      // scrapWebsiteUrl
      .addCase(scrapWebsiteUrl.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(scrapWebsiteUrl.fulfilled, (state, action) => {
        state.loading = false
      })
      .addCase(scrapWebsiteUrl.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })
  }
})

export const { 
  setActiveBot, 
  setActiveChatSession, 
  setInput, 
  setIsTyping, 
  setSessionId, 
  setUiConfig, 
  setLogout, 
  resetMessages, 
  addMessage, 
  clearMessages, 
  clearError 
} = globalSlice.actions
export default globalSlice.reducer