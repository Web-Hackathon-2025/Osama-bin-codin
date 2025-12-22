import { useState, useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { Send, MessageCircle, X, Minimize2 } from 'lucide-react';

interface ChatBoxProps {
  serverUrl?: string;
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  theme?: 'light' | 'dark';
  autoConnect?: boolean;
  showHeader?: boolean;
  height?: string;
  width?: string;
}

interface Message {
  id: string;
  content: string;
  sender: string;
  timestamp: Date;
  isOwn: boolean;
}

export default function ChatBox({
  serverUrl = 'http://localhost:8080',
  position = 'bottom-right',
  theme = 'light',
  autoConnect = true,
  showHeader = true,
  height = '500px',
  width = '400px',
}: ChatBoxProps) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [connected, setConnected] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [typing, setTyping] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const positionClasses = {
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
  };

  useEffect(() => {
    if (autoConnect || isOpen) {
      connectSocket();
    }
    return () => {
      socket?.disconnect();
    };
  }, [isOpen, autoConnect]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    if (isOpen) {
      setUnreadCount(0);
    }
  }, [messages, isOpen]);

  const connectSocket = () => {
    if (socket?.connected) return;

    // Get auth token from localStorage
    const token = localStorage.getItem('token');
    
    const newSocket = io(serverUrl, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      auth: token ? { token } : undefined,
    });

    newSocket.on('connect', () => {
      console.log('✅ ChatBox connected');
      setConnected(true);
    });

    newSocket.on('disconnect', () => {
      console.log('❌ ChatBox disconnected');
      setConnected(false);
    });

    newSocket.on('message:receive', (data: any) => {
      const newMessage: Message = {
        id: data._id || Date.now().toString(),
        content: data.content,
        sender: data.sender?.name || 'User',
        timestamp: new Date(data.createdAt || Date.now()),
        isOwn: false,
      };
      setMessages((prev) => [...prev, newMessage]);
      if (!isOpen) {
        setUnreadCount((prev) => prev + 1);
      }
    });

    newSocket.on('typing:start', () => {
      setTyping(true);
      setTimeout(() => setTyping(false), 3000);
    });

    newSocket.on('typing:stop', () => {
      setTyping(false);
    });

    setSocket(newSocket);
  };

  const sendMessage = () => {
    if (!socket || !inputMessage.trim()) return;

    socket.emit('message:send', {
      receiverId: 'broadcast',
      content: inputMessage,
      type: 'text',
    });

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
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setUnreadCount(0);
      setIsMinimized(false);
    }
  };

  const isDark = theme === 'dark';
  const bgColor = isDark ? 'bg-gray-800' : 'bg-white';
  const borderColor = isDark ? 'border-gray-700' : 'border-gray-200';

  if (!isOpen) {
    return (
      <div className={`fixed ${positionClasses[position]} z-50`}>
        <button
          onClick={toggleChat}
          className="bg-blue-500 hover:bg-blue-600 text-white rounded-full p-4 shadow-lg transition-all transform hover:scale-110 relative"
        >
          <MessageCircle size={24} />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>
      </div>
    );
  }

  return (
    <div
      className={`fixed ${positionClasses[position]} z-50 shadow-2xl rounded-lg overflow-hidden ${bgColor} border ${borderColor}`}
      style={{ width, height: isMinimized ? 'auto' : height }}
    >
      {/* Header */}
      {showHeader && (
        <div className={`${isDark ? 'bg-gray-900' : 'bg-blue-500'} text-white p-4 flex items-center justify-between`}>
          <div className="flex items-center gap-2">
            <MessageCircle size={20} />
            <div>
              <h3 className="font-semibold">Live Chat</h3>
              <div className="flex items-center gap-1 text-xs">
                <div
                  className={`w-2 h-2 rounded-full ${
                    connected ? 'bg-green-400' : 'bg-red-400'
                  }`}
                />
                <span>{connected ? 'Online' : 'Offline'}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="hover:bg-white/20 p-1 rounded transition-colors"
            >
              <Minimize2 size={18} />
            </button>
            <button
              onClick={toggleChat}
              className="hover:bg-white/20 p-1 rounded transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        </div>
      )}

      {!isMinimized && (
        <>
          {/* Messages Area */}
          <div
            className="overflow-y-auto p-4 space-y-3"
            style={{ height: showHeader ? 'calc(100% - 130px)' : 'calc(100% - 70px)' }}
          >
            {messages.length === 0 ? (
              <div className="flex items-center justify-center h-full text-gray-400">
                <p className="text-sm">No messages yet. Start chatting!</p>
              </div>
            ) : (
              messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.isOwn ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[75%] px-3 py-2 rounded-lg ${
                      msg.isOwn
                        ? 'bg-blue-500 text-white'
                        : isDark
                        ? 'bg-gray-700 text-white'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {!msg.isOwn && (
                      <p className="text-xs font-semibold mb-1 opacity-70">
                        {msg.sender}
                      </p>
                    )}
                    <p className="text-sm break-words">{msg.content}</p>
                    <p className="text-xs mt-1 opacity-60">
                      {msg.timestamp.toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                </div>
              ))
            )}
            {typing && (
              <div className="flex justify-start">
                <div
                  className={`px-3 py-2 rounded-lg ${
                    isDark ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  <p className="text-xs italic">Someone is typing...</p>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className={`p-3 border-t ${borderColor}`}>
            {!connected && (
              <p className="text-xs text-red-500 mb-2 text-center">
                ⚠️ Disconnected
              </p>
            )}
            <div className="flex gap-2">
              <input
                type="text"
                value={inputMessage}
                onChange={handleTyping}
                onKeyPress={handleKeyPress}
                placeholder="Type a message..."
                disabled={!connected}
                className={`flex-1 px-3 py-2 text-sm rounded-lg border ${
                  isDark
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                    : 'bg-white border-gray-300 text-gray-800'
                } focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed`}
              />
              <button
                onClick={sendMessage}
                disabled={!connected || !inputMessage.trim()}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
