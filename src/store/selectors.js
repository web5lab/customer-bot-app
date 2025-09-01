import { createSelector } from '@reduxjs/toolkit'

const globalSelector = (state) => state.global

export const logedInSelector = createSelector(
  [globalSelector],
  (global) => global.logedIn
)

export const userSelector = createSelector(
  [globalSelector],
  (global) => global.profile
)

export const botsSelector = createSelector(
  [globalSelector],
  (global) => global.bots
)

export const activeBotSelector = createSelector(
  [globalSelector],
  (global) => global.activeBot
)

export const uiConfigSelector = createSelector(
  [globalSelector],
  (global) => global.uiConfig
)

export const messagesSelector = createSelector(
  [globalSelector],
  (global) => global.uiConfig.messages
)

export const inputSelector = createSelector(
  [globalSelector],
  (global) => global.uiConfig.input
)

export const isTypingSelector = createSelector(
  [globalSelector],
  (global) => global.uiConfig.isTyping
)

export const chatSessionsSelector = createSelector(
  [globalSelector],
  (global) => global.chatSessions
)

export const activeSessionSelector = createSelector(
  [globalSelector],
  (global) => global.activeSession
)