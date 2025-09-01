# CustomerBot Notification Server

A complete Express.js server for handling Firebase Cloud Messaging (FCM) push notifications for the CustomerBot mobile app.

## Features

- 🔐 **JWT Authentication** - Secure API endpoints
- 📱 **Device Token Management** - Register and manage user devices
- 👤 **User-Specific Notifications** - Send notifications to specific users
- 👥 **Multi-User Notifications** - Send to multiple users at once
- 📢 **Broadcast Notifications** - Send to all registered users
- 🧹 **Token Cleanup** - Automatically remove invalid tokens
- 🧪 **Testing Endpoints** - Built-in test functionality
- 📊 **Device Management** - View and remove registered devices

## Quick Start

### 1. Install Dependencies

```bash
cd server
npm install
```

### 2. Configure Firebase

1. Download your Firebase service account key from Firebase Console
2. Save it as `serviceAccountKey.json` in the server directory
3. Update the Firebase configuration in `notification-server.js`

### 3. Set Environment Variables

```bash
cp .env.example .env
# Edit .env with your configuration
```

### 4. Start the Server

```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

## API Endpoints

### Authentication
All endpoints require JWT authentication via `Authorization: Bearer <token>` header.

### Device Management

#### Register Device Token
```http
POST /notifications/register-token
Content-Type: application/json
Authorization: Bearer <jwt-token>

{
  "token": "fcm-device-token",
  "platform": "android",
  "deviceId": "unique-device-id"
}
```

#### Get User's Devices
```http
GET /notifications/devices
Authorization: Bearer <jwt-token>
```

#### Remove Device
```http
DELETE /notifications/device/:deviceId
Authorization: Bearer <jwt-token>
```

### Sending Notifications

#### Send to Specific User
```http
POST /notifications/send-to-user
Content-Type: application/json
Authorization: Bearer <jwt-token>

{
  "userId": "user123",
  "title": "Notification Title",
  "body": "Notification message",
  "data": {
    "screen": "/chat",
    "botId": "bot456"
  }
}
```

#### Send to Multiple Users
```http
POST /notifications/send-to-users
Content-Type: application/json
Authorization: Bearer <jwt-token>

{
  "userIds": ["user123", "user456"],
  "title": "Group Notification",
  "body": "Message for multiple users",
  "data": {
    "screen": "/updates"
  }
}
```

#### Broadcast to All Users
```http
POST /notifications/broadcast
Content-Type: application/json
Authorization: Bearer <jwt-token>

{
  "title": "System Announcement",
  "body": "Important message for all users",
  "data": {
    "screen": "/announcements",
    "priority": "high"
  }
}
```

#### Test Notification
```http
POST /notifications/test
Authorization: Bearer <jwt-token>
```

## Testing

### Run Test Suite
```bash
# Update JWT_TOKEN in test-notifications.js first
npm test
```

### Manual Testing with cURL

```bash
# Register a token
curl -X POST http://localhost:3000/notifications/register-token \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "token": "test-token-123",
    "platform": "android",
    "deviceId": "device-123"
  }'

# Send notification to user
curl -X POST http://localhost:3000/notifications/send-to-user \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "userId": "user123",
    "title": "Test Notification",
    "body": "This is a test message",
    "data": {
      "screen": "/chat"
    }
  }'
```

## Database Integration

The current implementation uses in-memory storage (Map objects). For production, replace with your database:

### Example with MongoDB
```javascript
const mongoose = require('mongoose');

const DeviceTokenSchema = new mongoose.Schema({
  userId: String,
  token: String,
  platform: String,
  deviceId: String,
  createdAt: { type: Date, default: Date.now },
  lastUsed: { type: Date, default: Date.now }
});

const DeviceToken = mongoose.model('DeviceToken', DeviceTokenSchema);
```

### Example with PostgreSQL
```javascript
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

// Create table
await pool.query(`
  CREATE TABLE IF NOT EXISTS device_tokens (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    token TEXT NOT NULL,
    platform VARCHAR(50),
    device_id VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_used TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )
`);
```

## Error Handling

The server automatically handles:
- Invalid FCM tokens (removes them from storage)
- Unregistered tokens (cleans up automatically)
- Rate limiting (batches large broadcasts)
- Authentication errors
- Validation errors

## Security Features

- JWT token validation
- Input validation and sanitization
- CORS configuration
- Error message sanitization
- Token cleanup for security

## Monitoring & Logging

Add monitoring with tools like:
- **Winston** for logging
- **Prometheus** for metrics
- **Sentry** for error tracking

```javascript
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});
```

## Deployment

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

### Environment Variables for Production
```bash
NODE_ENV=production
PORT=3000
JWT_SECRET=your-super-secure-secret
FIREBASE_PROJECT_ID=your-project-id
DATABASE_URL=your-database-url
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Add tests for new functionality
4. Ensure all tests pass
5. Submit a pull request

## License

MIT License - see LICENSE file for details