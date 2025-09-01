const axios = require('axios');

// Test configuration
const SERVER_URL = 'http://localhost:3000';
const JWT_TOKEN = 'your-test-jwt-token'; // Replace with actual token

// Test functions
async function testRegisterToken() {
  console.log('\n🔧 Testing token registration...');
  
  try {
    const response = await axios.post(`${SERVER_URL}/notifications/register-token`, {
      token: 'test-fcm-token-' + Date.now(),
      platform: 'android',
      deviceId: 'test-device-123'
    }, {
      headers: {
        'Authorization': `Bearer ${JWT_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ Token registration successful:', response.data);
  } catch (error) {
    console.error('❌ Token registration failed:', error.response?.data || error.message);
  }
}

async function testSendToUser() {
  console.log('\n📱 Testing send to specific user...');
  
  try {
    const response = await axios.post(`${SERVER_URL}/notifications/send-to-user`, {
      userId: 'test-user-123',
      title: 'Test Notification',
      body: 'This is a test notification to a specific user',
      data: {
        screen: '/chat',
        botId: 'bot123'
      }
    }, {
      headers: {
        'Authorization': `Bearer ${JWT_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ Send to user successful:', response.data);
  } catch (error) {
    console.error('❌ Send to user failed:', error.response?.data || error.message);
  }
}

async function testSendToMultipleUsers() {
  console.log('\n👥 Testing send to multiple users...');
  
  try {
    const response = await axios.post(`${SERVER_URL}/notifications/send-to-users`, {
      userIds: ['test-user-123', 'test-user-456', 'test-user-789'],
      title: 'Group Notification',
      body: 'This notification is sent to multiple users',
      data: {
        screen: '/updates',
        type: 'group'
      }
    }, {
      headers: {
        'Authorization': `Bearer ${JWT_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ Send to multiple users successful:', response.data);
  } catch (error) {
    console.error('❌ Send to multiple users failed:', error.response?.data || error.message);
  }
}

async function testBroadcast() {
  console.log('\n📢 Testing broadcast notification...');
  
  try {
    const response = await axios.post(`${SERVER_URL}/notifications/broadcast`, {
      title: 'Broadcast Alert',
      body: 'This is a broadcast message to all users',
      data: {
        screen: '/announcements',
        priority: 'high'
      }
    }, {
      headers: {
        'Authorization': `Bearer ${JWT_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ Broadcast successful:', response.data);
  } catch (error) {
    console.error('❌ Broadcast failed:', error.response?.data || error.message);
  }
}

async function testGetDevices() {
  console.log('\n📱 Testing get user devices...');
  
  try {
    const response = await axios.get(`${SERVER_URL}/notifications/devices`, {
      headers: {
        'Authorization': `Bearer ${JWT_TOKEN}`
      }
    });
    
    console.log('✅ Get devices successful:', response.data);
  } catch (error) {
    console.error('❌ Get devices failed:', error.response?.data || error.message);
  }
}

async function testNotification() {
  console.log('\n🧪 Testing test notification endpoint...');
  
  try {
    const response = await axios.post(`${SERVER_URL}/notifications/test`, {}, {
      headers: {
        'Authorization': `Bearer ${JWT_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ Test notification successful:', response.data);
  } catch (error) {
    console.error('❌ Test notification failed:', error.response?.data || error.message);
  }
}

// Run all tests
async function runAllTests() {
  console.log('🚀 Starting notification server tests...');
  console.log(`Server URL: ${SERVER_URL}`);
  console.log(`JWT Token: ${JWT_TOKEN.substring(0, 20)}...`);
  
  await testRegisterToken();
  await testSendToUser();
  await testSendToMultipleUsers();
  await testBroadcast();
  await testGetDevices();
  await testNotification();
  
  console.log('\n✨ All tests completed!');
}

// Check if server is running
async function checkServer() {
  try {
    await axios.get(`${SERVER_URL}/health`);
    return true;
  } catch (error) {
    console.error('❌ Server is not running. Please start the server first:');
    console.log('   npm run dev');
    return false;
  }
}

// Main execution
if (require.main === module) {
  if (!JWT_TOKEN || JWT_TOKEN === 'your-test-jwt-token') {
    console.error('❌ Please set a valid JWT_TOKEN in the test file');
    process.exit(1);
  }
  
  runAllTests().catch(console.error);
}

module.exports = {
  testRegisterToken,
  testSendToUser,
  testSendToMultipleUsers,
  testBroadcast,
  testGetDevices,
  testNotification
};