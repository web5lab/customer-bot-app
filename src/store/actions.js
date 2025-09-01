import { createAsyncThunk } from '@reduxjs/toolkit'
import axiosInstance from '../services/axiosInstance'
import toast from 'react-hot-toast'

export const GetUserData = createAsyncThunk(
  'global/getUserData',
  async (token) => {
    try {
      const response = await axiosInstance.get('/auth/user-data', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      return response.data
    } catch (err) {
      throw err
    }
  }
)

export const GetBots = createAsyncThunk(
  'global/getBots',
  async () => {
    try {
      const token = localStorage.getItem('authToken')
      const response = await axiosInstance.get('/bot/get-bot', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      return response.data
    } catch (err) {
      throw err
    }
  }
)

export const createBot = createAsyncThunk(
  'global/createBot',
  async ({ data }) => {
    try {
      const token = localStorage.getItem('authToken')
      const response = await axiosInstance.post('/bot/create-bot', data, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      toast.success('Bot Created Successfully')
      return response.data
    } catch (err) {
      toast.error('Bot Creation Failed')
      throw err
    }
  }
)

export const createBotApi = async ({ data }) => {
  try {
    const token = localStorage.getItem('authToken')
    const response = await axiosInstance.post('/bot/create-bot', data, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    toast.success('Bot Created Successfully')
    return response.data
  } catch (err) {
    toast.error('Bot Creation Failed')
    throw err
  }
}

export const DeleteChatBot = async ({ chatBotId }) => {
  try {
    const token = localStorage.getItem('authToken')
    const response = await axiosInstance.delete(`/bot/delete-bot/${chatBotId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    return response.data
  } catch (err) {
    throw err
  }
}

export const updateChatBot = async ({ data, botId }) => {
  try {
    const token = localStorage.getItem('authToken')
    const response = await axiosInstance.post(`/bot/update-bot/${botId}`, data, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    console.log("api data", response)
    return response.data
  } catch (err) {
    throw err
  }
}
export const getChatSession = createAsyncThunk(
  'global/getChatSession',
  async ({ sessionId }) => {
    try {
      const token = localStorage.getItem('authToken')
      const response = await axiosInstance.get(`/chat/get-chat-session/${sessionId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      console.log("api data", response)
      return response.data
    } catch (err) {
      throw err
    }
  }
)

export const geminiChatApi = async ({ data }) => {
  try {
    const token = localStorage.getItem('authToken')
    const response = await axiosInstance.post('/chat/process-chat', data, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    return response.data
  } catch (err) {
    throw err
  }
}

export const getBotConfig = async ({ botId }) => {
  try {
    const response = await axiosInstance.get(`/bot/bot-config/${botId}`)
    return response.data.bot
  } catch (err) {
    throw err
  }
}

export const scrapPdfData = createAsyncThunk(
  'global/addPdfData',
  async ({ data }) => {
    try {
      const token = localStorage.getItem('authToken')
      const response = await axiosInstance.post('/scrap-data/process-pdf', data, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      console.log("api data", response)
      return response.data
    } catch (err) {
      throw err
    }
  }
)

export const scrapWebsiteUrl = createAsyncThunk(
  'global/scrapWebsiteUrl',
  async ({ url }) => {
    const token = localStorage.getItem('authToken')
    try {
      const response = await axiosInstance.get(`/scrap-data/process-url?url=${url}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      console.log("api data", response)
      return response.data
    } catch (err) {
      throw err
    }
  }
)

export const getChatSessions = createAsyncThunk(
  'global/getChatSessions',
  async ({ botId }) => {
    try {
      const token = localStorage.getItem('authToken')
      const response = await axiosInstance.get(`/chat/get-chat-sessions/${botId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      return response.data
    } catch (err) {
      throw err
    }
  }
)