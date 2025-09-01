import { PushNotifications } from '@capacitor/push-notifications'
import { Capacitor } from '@capacitor/core'
import { Device } from '@capacitor/device'
import { initializeApp } from 'firebase/app'
import { getMessaging, getToken, onMessage } from 'firebase/messaging'

// Firebase configuration - Replace with your config
const firebaseConfig = {
  apiKey: "AIzaSyAuT8Sq8C3eBATne5HyaBc07NKyqWcHUNE",
  authDomain: "yu-gi-no.firebaseapp.com",
  projectId: "yu-gi-no",
  storageBucket: "yu-gi-no.firebasestorage.app",
  messagingSenderId: "433766135979",
  appId: "1:433766135979:android:de5dc3c61ee6273b2c1fee"
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const messaging = getMessaging(app)

class NotificationService {
  constructor() {
    this.isInitialized = false
    this.token = null
  }

  async initialize() {
    if (this.isInitialized) return

    try {
      // Request permission for notifications
      const permStatus = await PushNotifications.requestPermissions()
      
      if (permStatus.receive === 'granted') {
        // Register for push notifications
        await PushNotifications.register()
        
        // Add listeners
        this.addListeners()
        
        // Get FCM token for web
        if (Capacitor.getPlatform() === 'web') {
          await this.getWebToken()
        }
        
        this.isInitialized = true
        console.log('Notification service initialized successfully')
      } else {
        console.warn('Push notification permission denied')
      }
    } catch (error) {
      console.error('Error initializing notifications:', error)
    }
  }

  async getWebToken() {
    try {
      const token = await getToken(messaging, {
        vapidKey: 'BJK1V6M3TGW2Cc16n7gSA4EB1Nuq7xlROvAdvuaEETl33IIr8Git8YmVB5pUEGUEZtY7ulki4vJQszigKOe_2Bo'
      })
      
      if (token) {
        console.log('FCM Web Token:', token)
        this.token = token
        await this.sendTokenToServer(token)
      }
    } catch (error) {
      console.error('Error getting web token:', error)
    }
  }

  addListeners() {
    // Registration success
    PushNotifications.addListener('registration', (token) => {
      console.log('Push registration success, token: ' + token.value)
      this.token = token.value
      this.sendTokenToServer(token.value)
    })

    // Registration error
    PushNotifications.addListener('registrationError', (error) => {
      console.error('Error on registration: ' + JSON.stringify(error))
    })

    // Notification received (app in foreground)
    PushNotifications.addListener('pushNotificationReceived', (notification) => {
      console.log('Push notification received: ', notification)
      this.handleForegroundNotification(notification)
    })

    // Notification tapped (app opened from notification)
    PushNotifications.addListener('pushNotificationActionPerformed', (notification) => {
      console.log('Push notification action performed', notification.actionId, notification.inputValue)
      this.handleNotificationTap(notification)
    })

    // Web foreground message listener
    if (Capacitor.getPlatform() === 'web') {
      onMessage(messaging, (payload) => {
        console.log('Message received in foreground: ', payload)
        this.handleForegroundNotification(payload)
      })
    }
  }

  async sendTokenToServer(token) {
    try {
      const authToken = localStorage.getItem('authToken')
      if (!authToken) return

      const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/notifications/register-token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({
          token,
          platform: Capacitor.getPlatform(),
          deviceId: await this.getDeviceId()
        })
      })

      if (response.ok) {
        console.log('Token sent to server successfully')
      } else {
        console.error('Failed to send token to server')
      }
    } catch (error) {
      console.error('Error sending token to server:', error)
    }
  }

  async getDeviceId() {
    try {
      const info = await Device.getId()
      return info.identifier
    } catch (error) {
      return 'web-' + Math.random().toString(36).substr(2, 9)
    }
  }

  handleForegroundNotification(notification) {
    // Show in-app notification or update UI
    const event = new CustomEvent('foregroundNotification', {
      detail: notification
    })
    window.dispatchEvent(event)
  }

  handleNotificationTap(notification) {
    // Handle notification tap - navigate to specific screen
    const event = new CustomEvent('notificationTap', {
      detail: notification
    })
    window.dispatchEvent(event)
  }

  async getDeliveredNotifications() {
    try {
      const notifications = await PushNotifications.getDeliveredNotifications()
      return notifications.notifications
    } catch (error) {
      console.error('Error getting delivered notifications:', error)
      return []
    }
  }

  async removeDeliveredNotifications(notifications) {
    try {
      await PushNotifications.removeDeliveredNotifications({ notifications })
    } catch (error) {
      console.error('Error removing notifications:', error)
    }
  }

  async removeAllDeliveredNotifications() {
    try {
      await PushNotifications.removeAllDeliveredNotifications()
    } catch (error) {
      console.error('Error removing all notifications:', error)
    }
  }

  getToken() {
    return this.token
  }
}

export const notificationService = new NotificationService()