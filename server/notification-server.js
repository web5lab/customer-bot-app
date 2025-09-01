const express = require('express');
const admin = require('firebase-admin');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const app = express();
app.use(express.json());
app.use(cors());

// Initialize Firebase Admin
const serviceAccount = require('./serviceAccountKey.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: 'yu-gi-no'
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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Notification server running on port ${PORT}`);
});

module.exports = app;