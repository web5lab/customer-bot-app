# Firebase Notifications Setup Guide

This guide will walk you through setting up Firebase Cloud Messaging (FCM) for push notifications in your CustomerBot Capacitor Android app.

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Firebase Console Setup](#firebase-console-setup)
3. [Download Configuration Files](#download-configuration-files)
4. [Configure Your App](#configure-your-app)
5. [Server Setup](#server-setup)
6. [Testing](#testing)
7. [Troubleshooting](#troubleshooting)

## Prerequisites

- Google account
- Android Studio installed
- Your app already built and running
- Access to your server backend

## Firebase Console Setup

### Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Create a project"** or **"Add project"**
3. Enter project name: `customerbot-mobile` (or your preferred name)
4. Choose whether to enable Google Analytics (recommended)
5. Select or create a Google Analytics account
6. Click **"Create project"**

### Step 2: Add Android App

1. In your Firebase project dashboard, click **"Add app"**
2. Select the **Android** icon
3. Fill in the app details:
   - **Android package name**: `com.customerbot.co` (must match exactly)
   - **App nickname**: `CustomerBot Mobile` (optional)
   - **Debug signing certificate SHA-1**: (optional for now)
4. Click **"Register app"**

### Step 3: Enable Cloud Messaging

1. In Firebase Console, go to **"Project Settings"** (gear icon)
2. Click on the **"Cloud Messaging"** tab
3. Note down these values (you'll need them later):
   - **Server key** (for server-side sending)
   - **Sender ID**

### Step 4: Generate Web Credentials (for web support)

1. In the **"Cloud Messaging"** tab, scroll to **"Web configuration"**
2. Click **"Generate key pair"** under **"Web push certificates"**
3. Copy the **VAPID key** (you'll need this for web notifications)

## Download Configuration Files

### Android Configuration

1. In Firebase Console, go to **"Project Settings"**
2. Scroll down to **"Your apps"** section
3. Find your Android app and click the **"google-services.json"** download button
4. Save the file - you'll place it in your project shortly

### Web Configuration

1. In **"Project Settings"**, click on **"General"** tab
2. Scroll to **"Your apps"** and find **"Web apps"** section
3. If you don't have a web app, click **"Add app"** and select web
4. Copy the Firebase configuration object (looks like this):

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyC...",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456"
};
```

## Configure Your App

### Step 1: Replace Android Configuration

1. Take the `google-services.json` file you downloaded
2. Replace the existing file at: `android/app/google-services.json`
3. Make sure the package name in the file matches `com.customerbot.co`

### Step 2: Update JavaScript Configuration

Replace the Firebase configuration in these files:

#### File: `src/services/notificationService.js`

Find this section and replace with your values:
```javascript
// Firebase configuration - Replace with your config
const firebaseConfig = {
  apiKey: "YOUR_API_KEY_HERE",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
}
```

Also update the VAPID key:
```javascript
const token = await getToken(messaging, {
  vapidKey: 'YOUR_VAPID_KEY_HERE' // Replace with your VAPID key
})
```

#### File: `public/firebase-messaging-sw.js`

Replace the Firebase configuration:
```javascript
firebase.initializeApp({
  apiKey: "YOUR_API_KEY_HERE",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
});
```

### Step 3: Update Environment Variables (Optional)

Create a `.env` file in your project root:
```env
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_VAPID_KEY=your_vapid_key
```

Then update your config files to use environment variables:
```javascript
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
}
```

## Server Setup

### Step 1: Install Firebase Admin SDK

On your server, install the Firebase Admin SDK:

```bash
npm install firebase-admin
```

### Step 2: Download Service Account Key

1. In Firebase Console, go to **"Project Settings"**
2. Click **"Service accounts"** tab
3. Click **"Generate new private key"**
4. Download the JSON file and keep it secure
5. Add it to your server (don't commit to version control)

### Step 3: Initialize Firebase Admin

```javascript
const admin = require('firebase-admin');
const serviceAccount = require('./path/to/serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: 'your-project-id'
});
```

### Step 4: Create Token Registration Endpoint

```javascript
// POST /notifications/register-token
app.post('/notifications/register-token', async (req, res) => {
  try {
    const { token, platform, deviceId } = req.body;
    const userId = req.user.id; // from your auth middleware
    
    // Save token to your database
    await saveDeviceToken({
      userId,
      token,
      platform,
      deviceId,
      createdAt: new Date()
    });
    
    res.json({ success: true });
  } catch (error) {
    console.error('Error saving token:', error);
    res.status(500).json({ error: 'Failed to save token' });
  }
});
```

### Step 5: Create Notification Sending Function

```javascript
async function sendNotification(userTokens, title, body, data = {}) {
  const message = {
    notification: {
      title,
      body
    },
    data,
    tokens: userTokens // array of FCM tokens
  };

  try {
    const response = await admin.messaging().sendMulticast(message);
    console.log('Successfully sent message:', response);
    return response;
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
}
```

### Step 5: Complete Express Server Implementation

Here's a complete Express server setup with all notification endpoints:

```javascript
const express = require('express');
const admin = require('firebase-admin');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const app = express();
app.use(express.json());
app.use(cors());

// Initialize Firebase Admin
const serviceAccount = require('./path/to/serviceAccountKey.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: 'your-project-id'
});

// Mock database - replace with your actual database
const deviceTokens = new Map(); // userId -> [tokens]
const users = new Map(); // userId -> user data

// Auth middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key', (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

// Register device token
app.post('/notifications/register-token', authenticateToken, async (req, res) => {
  try {
    const { token, platform, deviceId } = req.body;
    const userId = req.user.id;

    if (!token) {
      return res.status(400).json({ error: 'Token is required' });
    }

    // Get existing tokens for user
    const userTokens = deviceTokens.get(userId) || [];
    
    // Check if token already exists
    const existingToken = userTokens.find(t => t.token === token);
    
    if (!existingToken) {
      // Add new token
      userTokens.push({
        token,
        platform,
        deviceId,
        createdAt: new Date(),
        lastUsed: new Date()
      });
      deviceTokens.set(userId, userTokens);
    } else {
      // Update existing token
      existingToken.lastUsed = new Date();
    }

    console.log(`Token registered for user ${userId}:`, token.substring(0, 20) + '...');
    res.json({ success: true, message: 'Token registered successfully' });
  } catch (error) {
    console.error('Error registering token:', error);
    res.status(500).json({ error: 'Failed to register token' });
  }
});

// Send notification to specific user
app.post('/notifications/send-to-user', authenticateToken, async (req, res) => {
  try {
    const { userId, title, body, data = {} } = req.body;

    if (!userId || !title || !body) {
      return res.status(400).json({ 
        error: 'userId, title, and body are required' 
      });
    }

    // Get user's device tokens
    const userTokens = deviceTokens.get(userId);
    
    if (!userTokens || userTokens.length === 0) {
      return res.status(404).json({ 
        error: 'No device tokens found for user' 
      });
    }

    // Extract just the token strings
    const tokens = userTokens.map(t => t.token);

    // Send notification
    const result = await sendNotificationToTokens(tokens, title, body, data);
    
    res.json({
      success: true,
      message: `Notification sent to ${tokens.length} device(s)`,
      result: {
        successCount: result.successCount,
        failureCount: result.failureCount
      }
    });
  } catch (error) {
    console.error('Error sending notification:', error);
    res.status(500).json({ error: 'Failed to send notification' });
  }
});

// Send notification to multiple users
app.post('/notifications/send-to-users', authenticateToken, async (req, res) => {
  try {
    const { userIds, title, body, data = {} } = req.body;

    if (!userIds || !Array.isArray(userIds) || !title || !body) {
      return res.status(400).json({ 
        error: 'userIds (array), title, and body are required' 
      });
    }

    let allTokens = [];
    let userCount = 0;

    // Collect tokens from all users
    for (const userId of userIds) {
      const userTokens = deviceTokens.get(userId);
      if (userTokens && userTokens.length > 0) {
        allTokens.push(...userTokens.map(t => t.token));
        userCount++;
      }
    }

    if (allTokens.length === 0) {
      return res.status(404).json({ 
        error: 'No device tokens found for any of the specified users' 
      });
    }

    // Send notification
    const result = await sendNotificationToTokens(allTokens, title, body, data);
    
    res.json({
      success: true,
      message: `Notification sent to ${userCount} user(s) with ${allTokens.length} device(s)`,
      result: {
        successCount: result.successCount,
        failureCount: result.failureCount
      }
    });
  } catch (error) {
    console.error('Error sending notification:', error);
    res.status(500).json({ error: 'Failed to send notification' });
  }
});

// Send broadcast notification to all users
app.post('/notifications/broadcast', authenticateToken, async (req, res) => {
  try {
    const { title, body, data = {} } = req.body;

    if (!title || !body) {
      return res.status(400).json({ 
        error: 'title and body are required' 
      });
    }

    // Collect all tokens from all users
    let allTokens = [];
    let userCount = 0;

    for (const [userId, userTokens] of deviceTokens.entries()) {
      if (userTokens && userTokens.length > 0) {
        allTokens.push(...userTokens.map(t => t.token));
        userCount++;
      }
    }

    if (allTokens.length === 0) {
      return res.status(404).json({ 
        error: 'No device tokens found' 
      });
    }

    // Send notification in batches (FCM limit is 500 tokens per request)
    const batchSize = 500;
    let totalSuccess = 0;
    let totalFailure = 0;

    for (let i = 0; i < allTokens.length; i += batchSize) {
      const batch = allTokens.slice(i, i + batchSize);
      const result = await sendNotificationToTokens(batch, title, body, data);
      totalSuccess += result.successCount;
      totalFailure += result.failureCount;
    }
    
    res.json({
      success: true,
      message: `Broadcast sent to ${userCount} user(s) with ${allTokens.length} device(s)`,
      result: {
        successCount: totalSuccess,
        failureCount: totalFailure
      }
    });
  } catch (error) {
    console.error('Error sending broadcast:', error);
    res.status(500).json({ error: 'Failed to send broadcast' });
  }
});

// Get user's registered devices
app.get('/notifications/devices', authenticateToken, (req, res) => {
  try {
    const userId = req.user.id;
    const userTokens = deviceTokens.get(userId) || [];
    
    const devices = userTokens.map(token => ({
      deviceId: token.deviceId,
      platform: token.platform,
      createdAt: token.createdAt,
      lastUsed: token.lastUsed,
      tokenPreview: token.token.substring(0, 20) + '...'
    }));
    
    res.json({
      success: true,
      devices,
      count: devices.length
    });
  } catch (error) {
    console.error('Error getting devices:', error);
    res.status(500).json({ error: 'Failed to get devices' });
  }
});

// Remove device token
app.delete('/notifications/device/:deviceId', authenticateToken, (req, res) => {
  try {
    const userId = req.user.id;
    const { deviceId } = req.params;
    
    const userTokens = deviceTokens.get(userId) || [];
    const filteredTokens = userTokens.filter(token => token.deviceId !== deviceId);
    
    if (filteredTokens.length < userTokens.length) {
      deviceTokens.set(userId, filteredTokens);
      res.json({ success: true, message: 'Device removed successfully' });
    } else {
      res.status(404).json({ error: 'Device not found' });
    }
  } catch (error) {
    console.error('Error removing device:', error);
    res.status(500).json({ error: 'Failed to remove device' });
  }
});

// Helper function to send notifications
async function sendNotificationToTokens(tokens, title, body, data = {}) {
  // Convert data values to strings (FCM requirement)
  const stringData = {};
  for (const [key, value] of Object.entries(data)) {
    stringData[key] = String(value);
  }

  const message = {
    notification: {
      title,
      body
    },
    data: stringData,
    tokens: tokens
  };

  try {
    const response = await admin.messaging().sendMulticast(message);
    
    // Handle failed tokens
    if (response.failureCount > 0) {
      const failedTokens = [];
      response.responses.forEach((resp, idx) => {
        if (!resp.success) {
          failedTokens.push({
            token: tokens[idx],
            error: resp.error
          });
        }
      });
      
      console.log('Failed tokens:', failedTokens);
      
      // Remove invalid tokens from storage
      await cleanupInvalidTokens(failedTokens);
    }
    
    console.log(`Successfully sent notification: ${response.successCount} success, ${response.failureCount} failure`);
    return response;
  } catch (error) {
    console.error('Error sending notification:', error);
    throw error;
  }
}

// Clean up invalid tokens
async function cleanupInvalidTokens(failedTokens) {
  for (const failed of failedTokens) {
    const errorCode = failed.error?.code;
    
    // Remove tokens that are invalid or unregistered
    if (errorCode === 'messaging/invalid-registration-token' || 
        errorCode === 'messaging/registration-token-not-registered') {
      
      // Find and remove the token from storage
      for (const [userId, userTokens] of deviceTokens.entries()) {
        const filteredTokens = userTokens.filter(t => t.token !== failed.token);
        if (filteredTokens.length < userTokens.length) {
          deviceTokens.set(userId, filteredTokens);
          console.log(`Removed invalid token for user ${userId}`);
          break;
        }
      }
    }
  }
}

// Test endpoint
app.post('/notifications/test', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const userTokens = deviceTokens.get(userId);
    
    if (!userTokens || userTokens.length === 0) {
      return res.status(404).json({ 
        error: 'No device tokens found for your account' 
      });
    }

    const tokens = userTokens.map(t => t.token);
    const result = await sendNotificationToTokens(
      tokens,
      'Test Notification',
      'This is a test notification from your server!',
      { 
        screen: '/chat',
        timestamp: Date.now().toString()
      }
    );
    
    res.json({
      success: true,
      message: 'Test notification sent successfully',
      result: {
        successCount: result.successCount,
        failureCount: result.failureCount
      }
    });
  } catch (error) {
    console.error('Error sending test notification:', error);
    res.status(500).json({ error: 'Failed to send test notification' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Notification server running on port ${PORT}`);
});

module.exports = app;
```

### Step 6: Usage Examples

#### Send notification to specific user:
```bash
curl -X POST http://localhost:3000/notifications/send-to-user \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "userId": "user123",
    "title": "New Message",
    "body": "You have a new message from CustomerBot",
    "data": {
      "screen": "/chat",
      "botId": "bot456"
    }
  }'
```

#### Send notification to multiple users:
```bash
curl -X POST http://localhost:3000/notifications/send-to-users \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "userIds": ["user123", "user456", "user789"],
    "title": "System Update",
    "body": "New features are now available!",
    "data": {
      "screen": "/updates"
    }
  }'
```

#### Send broadcast to all users:
```bash
curl -X POST http://localhost:3000/notifications/broadcast \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "title": "Maintenance Notice",
    "body": "Scheduled maintenance will begin in 1 hour",
    "data": {
      "screen": "/maintenance",
      "priority": "high"
    }
  }'
```

#### Test notification:
```bash
curl -X POST http://localhost:3000/notifications/test \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```
## Testing

### Step 1: Build and Run Your App

```bash
# Build the web app
npm run build

# Sync with Capacitor
npx cap sync android

# Run on Android device/emulator
npx cap run android
```

### Step 2: Test Notification Permission

1. Open the app
2. Go to **Settings**
3. Tap **Notifications**
4. Tap **"Test Notification"** button
5. You should see a toast notification

### Step 3: Test from Firebase Console

1. Go to Firebase Console
2. Navigate to **"Messaging"** in the left sidebar
3. Click **"Create your first campaign"**
4. Choose **"Firebase Notification messages"**
5. Fill in:
   - **Notification title**: "Test Notification"
   - **Notification text**: "This is a test from Firebase Console"
6. Click **"Next"**
7. Select your app
8. Click **"Next"** through the remaining steps
9. Click **"Review"** and then **"Publish"**

### Step 4: Test from Your Server

```javascript
// Example: Send notification to a user
const userTokens = ['user_fcm_token_here'];
await sendNotification(
  userTokens,
  'New Message',
  'You have a new message from CustomerBot',
  { screen: '/chat', botId: 'bot123' }
);
```

## Troubleshooting

### Common Issues

#### 1. **Notifications not received**
- Check if notification permissions are granted
- Verify FCM token is being generated and saved
- Check Firebase Console logs for delivery status
- Ensure `google-services.json` is correct

#### 2. **Build errors**
```bash
# Clean and rebuild
npx cap clean android
npm run build
npx cap sync android
```

#### 3. **Token not generating**
- Check internet connection
- Verify Firebase configuration
- Check browser console for errors
- Ensure VAPID key is correct for web

#### 4. **Notifications work in foreground but not background**
- Check if `FirebaseMessagingService` is properly registered in `AndroidManifest.xml`
- Verify notification channel is created
- Check Android notification settings

### Debug Steps

1. **Check FCM Token Generation**:
   ```javascript
   // Add this to your app for debugging
   console.log('FCM Token:', notificationService.getToken());
   ```

2. **Test Token Validity**:
   Use Firebase Console to send a test message to a specific token

3. **Check Server Logs**:
   Monitor your server logs when sending notifications

4. **Android Logs**:
   ```bash
   npx cap run android --livereload
   # Check Android Studio logcat for errors
   ```

### Support

If you encounter issues:

1. Check the [Firebase Documentation](https://firebase.google.com/docs/cloud-messaging)
2. Review [Capacitor Push Notifications](https://capacitorjs.com/docs/apis/push-notifications)
3. Check Firebase Console for error logs
4. Verify all configuration files have correct values

## Security Notes

- Never commit `google-services.json` or service account keys to version control
- Use environment variables for sensitive configuration
- Implement proper authentication for your notification endpoints
- Validate and sanitize notification data on your server

## Next Steps

After setup is complete:

1. Implement notification categories for different types of messages
2. Add notification actions (reply, dismiss, etc.)
3. Implement notification analytics
4. Set up automated notifications based on user actions
5. Add notification preferences in user settings

---

**Need Help?** If you encounter any issues during setup, please check the troubleshooting section or refer to the official Firebase documentation.