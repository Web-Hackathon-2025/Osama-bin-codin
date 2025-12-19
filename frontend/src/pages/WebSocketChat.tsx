import { useState, useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { Send } from 'lucide-react';

interface Message {
  id: string;
  content: string;
  sender: string;
  timestamp: Date;
  isOwn: boolean;
}

export default function WebSocketChat() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [connected, setConnected] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [userId, setUserId] = useState('');
  const [typing, setTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Connect to WebSocket server
    const newSocket = io('http://localhost:8080', {
      transports: ['websocket', 'polling'],
      reconnection: true,
    });

    newSocket.on('connect', () => {
      console.log('✅ Connected to chat server');
      setConnected(true);
      setUserId(newSocket.id || '');
    });

    newSocket.on('disconnect', () => {
      console.log('❌ Disconnected from chat server');
      setConnected(false);
    });

    // Listen for incoming messages
    newSocket.on('message:receive', (data: any) => {
      console.log('📨 Message received:', data);
      setMessages((prev) => [
        ...prev,
        {
          id: data._id || Date.now().toString(),
          content: data.content,
          sender: data.sender?.name || 'User',
          timestamp: new Date(data.createdAt || Date.now()),
          isOwn: false,
        },
      ]);
    });

    // Listen for typing indicators
    newSocket.on('typing:start', (data: any) => {
      console.log('✍️ User typing:', data.userId);
      setTyping(true);
      setTimeout(() => setTyping(false), 3000);
    });

    newSocket.on('typing:stop', () => {
      setTyping(false);
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  useEffect(() => {
    // Scroll to bottom when new messages arrive
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = () => {
    if (!socket || !inputMessage.trim()) return;

    const messageData = {
      receiverId: 'broadcast', // Send to all connected users
      content: inputMessage,
      type: 'text',
    };

    console.log('📤 Sending message:', messageData);

    // Emit message to server
    socket.emit('message:send', messageData);

    // Add to local messages
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        content: inputMessage,
        sender: 'You',
        timestamp: new Date(),
        isOwn: true,
      },
    ]);

    setInputMessage('');
    socket.emit('typing:stop');
  };

  const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputMessage(e.target.value);
    if (socket && e.target.value) {
      socket.emit('typing:start');
    } else if (socket) {
      socket.emit('typing:stop');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-t-lg shadow-md p-4 border-b">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-800">💬 Live Chat</h1>
            <div className="flex items-center gap-2">
              <div
                className={`w-3 h-3 rounded-full ${
                  connected ? 'bg-green-500' : 'bg-red-500'
                }`}
              />
              <span className="text-sm text-gray-600">
                {connected ? 'Connected' : 'Disconnected'}
              </span>
            </div>
          </div>
          {connected && (
            <p className="text-xs text-gray-500 mt-1">Your ID: {userId}</p>
          )}
        </div>

        {/* Messages Area */}
        <div className="bg-white shadow-md h-[500px] overflow-y-auto p-4 space-y-4">
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-full text-gray-400">
              <p>No messages yet. Start chatting!</p>
            </div>
          ) : (
            messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.isOwn ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs px-4 py-2 rounded-lg ${
                    msg.isOwn
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 text-gray-800'
                  }`}
                >
                  <p className="text-xs font-semibold mb-1">{msg.sender}</p>
                  <p className="break-words">{msg.content}</p>
                  <p className="text-xs mt-1 opacity-70">
                    {msg.timestamp.toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))
          )}
          {typing && (
            <div className="flex justify-start">
              <div className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg">
                <p className="text-sm italic">Someone is typing...</p>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="bg-white rounded-b-lg shadow-md p-4 border-t">
          <div className="flex gap-2">
            <input
              type="text"
              value={inputMessage}
              onChange={handleTyping}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              disabled={!connected}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
            />
            <button
              onClick={sendMessage}
              disabled={!connected || !inputMessage.trim()}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-2 transition-colors"
            >
              <Send size={20} />
              Send
            </button>
          </div>
          {!connected && (
            <p className="text-xs text-red-500 mt-2">
              ⚠️ Not connected to server. Check if backend is running on port 8080.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
