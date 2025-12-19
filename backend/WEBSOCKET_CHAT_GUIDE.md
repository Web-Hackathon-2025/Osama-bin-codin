# WebSocket Chat Implementation

## Overview
Real-time chat system using Socket.IO for bidirectional communication between users.

## Features
- ✅ Real-time messaging
- ✅ Online/offline status
- ✅ Typing indicators
- ✅ Message read receipts
- ✅ Message history with pagination
- ✅ Unread message count
- ✅ Message search
- ✅ Conversation management
- ✅ JWT authentication for WebSocket connections

## Architecture

### Models

#### Message Model
```javascript
{
  conversationId: String,
  sender: ObjectId (ref: User),
  receiver: ObjectId (ref: User),
  content: String,
  type: 'text' | 'image' | 'file',
  fileUrl: String,
  read: Boolean,
  readAt: Date,
  timestamps: true
}
```

#### Conversation Model
```javascript
{
  participants: [ObjectId (ref: User)],
  lastMessage: ObjectId (ref: Message),
  lastMessageAt: Date,
  unreadCount: Map<userId, number>,
  timestamps: true
}
```

## WebSocket Events

### Client → Server

#### 1. Connect
```javascript
const socket = io('http://localhost:5000', {
  auth: {
    token: 'your-jwt-token'
  }
});
```

#### 2. Send Message
```javascript
socket.emit('message:send', {
  receiverId: 'user-id',
  content: 'Hello!',
  type: 'text', // 'text' | 'image' | 'file'
  fileUrl: 'optional-file-url'
}, (response) => {
  if (response.success) {
    console.log('Message sent:', response.message);
  }
});
```

#### 3. Mark as Read
```javascript
socket.emit('message:read', {
  messageIds: ['msg-id-1', 'msg-id-2'],
  conversationId: 'conversation-id'
}, (response) => {
  if (response.success) {
    console.log('Messages marked as read');
  }
});
```

#### 4. Typing Indicators
```javascript
// Start typing
socket.emit('typing:start', {
  receiverId: 'user-id'
});

// Stop typing
socket.emit('typing:stop', {
  receiverId: 'user-id'
});
```

#### 5. Get Online Users
```javascript
socket.emit('users:getOnline', (response) => {
  console.log('Online users:', response.onlineUsers);
});
```

### Server → Client

#### 1. Receive Message
```javascript
socket.on('message:receive', (data) => {
  console.log('New message:', data.message);
  console.log('Conversation ID:', data.conversationId);
});
```

#### 2. Message Read Notification
```javascript
socket.on('message:read', (data) => {
  console.log('Messages read:', data.messageIds);
  console.log('Read by:', data.readBy);
});
```

#### 3. User Online
```javascript
socket.on('user:online', (data) => {
  console.log('User came online:', data.userId);
});
```

#### 4. User Offline
```javascript
socket.on('user:offline', (data) => {
  console.log('User went offline:', data.userId);
});
```

#### 5. Typing Indicators
```javascript
socket.on('typing:start', (data) => {
  console.log(`${data.userName} is typing...`);
});

socket.on('typing:stop', (data) => {
  console.log('User stopped typing');
});
```

## REST API Endpoints

All endpoints require `Authorization: Bearer <token>` header.

### 1. Get Conversations
```
GET /api/chat/conversations

Response:
{
  "success": true,
  "data": [
    {
      "_id": "conversation-id",
      "participants": [
        {
          "_id": "user-id",
          "name": "John Doe",
          "email": "john@example.com",
          "avatar": "url"
        }
      ],
      "lastMessage": {
        "content": "Hello",
        "createdAt": "2025-12-19T10:00:00.000Z"
      },
      "unreadCount": { "user-id": 5 }
    }
  ]
}
```

### 2. Get Messages
```
GET /api/chat/messages/:otherUserId?page=1&limit=50

Response:
{
  "success": true,
  "data": {
    "messages": [
      {
        "_id": "message-id",
        "sender": { "name": "John", "avatar": "url" },
        "receiver": { "name": "Jane", "avatar": "url" },
        "content": "Hello!",
        "type": "text",
        "read": false,
        "createdAt": "2025-12-19T10:00:00.000Z"
      }
    ],
    "pagination": {
      "total": 100,
      "page": 1,
      "pages": 2
    }
  }
}
```

### 3. Get Unread Count
```
GET /api/chat/unread-count

Response:
{
  "success": true,
  "data": {
    "unreadCount": 15
  }
}
```

### 4. Search Messages
```
GET /api/chat/search?query=hello&conversationId=optional

Response:
{
  "success": true,
  "data": [
    {
      "_id": "message-id",
      "content": "Hello world",
      "sender": { "name": "John" },
      "createdAt": "2025-12-19T10:00:00.000Z"
    }
  ]
}
```

### 5. Delete Message
```
DELETE /api/chat/messages/:messageId

Response:
{
  "success": true,
  "message": "Message deleted successfully"
}
```

## Frontend Integration Example

### React with Socket.IO Client

```bash
npm install socket.io-client
```

```typescript
import { io, Socket } from 'socket.io-client';
import { useEffect, useState } from 'react';

const useChat = (token: string) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);

  useEffect(() => {
    // Connect to WebSocket
    const newSocket = io('http://localhost:5000', {
      auth: { token }
    });

    // Connection events
    newSocket.on('connect', () => {
      console.log('Connected to chat server');
    });

    // Receive messages
    newSocket.on('message:receive', (data) => {
      setMessages(prev => [...prev, data.message]);
    });

    // User status updates
    newSocket.on('user:online', (data) => {
      setOnlineUsers(prev => [...prev, data.userId]);
    });

    newSocket.on('user:offline', (data) => {
      setOnlineUsers(prev => prev.filter(id => id !== data.userId));
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, [token]);

  const sendMessage = (receiverId: string, content: string) => {
    if (!socket) return;

    socket.emit('message:send', {
      receiverId,
      content,
      type: 'text'
    }, (response) => {
      if (response.success) {
        setMessages(prev => [...prev, response.message]);
      }
    });
  };

  const markAsRead = (messageIds: string[], conversationId: string) => {
    if (!socket) return;

    socket.emit('message:read', {
      messageIds,
      conversationId
    });
  };

  return {
    socket,
    messages,
    onlineUsers,
    sendMessage,
    markAsRead
  };
};

export default useChat;
```

## Testing with Postman/WebSocket Client

### 1. Test REST API
```bash
# Get conversations
curl -X GET http://localhost:5000/api/chat/conversations \
  -H "Authorization: Bearer YOUR_TOKEN"

# Get messages with user
curl -X GET http://localhost:5000/api/chat/messages/USER_ID \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 2. Test WebSocket

Use a WebSocket testing tool like:
- Socket.IO Client Tool: https://amritb.github.io/socketio-client-tool/
- Postman (supports WebSocket)

**Connection URL:** `http://localhost:5000`

**Auth:**
```json
{
  "token": "your-jwt-token"
}
```

**Send message:**
```json
{
  "event": "message:send",
  "data": {
    "receiverId": "user-id",
    "content": "Hello!",
    "type": "text"
  }
}
```

## Security Features

1. **JWT Authentication**: All socket connections require valid JWT token
2. **User Validation**: Socket middleware verifies user exists in database
3. **Message Ownership**: Users can only delete their own messages
4. **Conversation Validation**: Only participants can access conversation

## Performance Optimizations

1. **Indexed Queries**: Database indexes on conversationId, sender, receiver
2. **Pagination**: Messages are paginated (default 50 per page)
3. **Active User Map**: In-memory storage of online users for fast lookups
4. **Selective Emit**: Messages only sent to online recipients

## Error Handling

All socket events use callbacks for error handling:

```javascript
socket.emit('message:send', data, (response) => {
  if (response.success) {
    // Handle success
  } else {
    // Handle error
    console.error(response.error);
  }
});
```

## Next Steps

1. **File Uploads**: Integrate with Cloudinary for image/file messages
2. **Group Chat**: Extend to support multiple participants
3. **Message Reactions**: Add emoji reactions to messages
4. **Voice/Video**: Integrate WebRTC for calls
5. **Push Notifications**: Add FCM/APNS for offline users
6. **Message Encryption**: Add end-to-end encryption

## Troubleshooting

**Connection Issues:**
- Verify JWT token is valid
- Check CORS settings match frontend URL
- Ensure server is running on correct port

**Messages Not Sending:**
- Check receiverId is valid
- Verify both users exist in database
- Check server logs for errors

**Read Receipts Not Working:**
- Ensure messageIds array is correct
- Verify receiver is authenticated
- Check socket connection is active
