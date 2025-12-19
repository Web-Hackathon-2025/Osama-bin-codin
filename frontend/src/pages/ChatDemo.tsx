import ChatBox from '../components/ChatBox';

export default function ChatDemo() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          🎯 ChatBox Component Demo
        </h1>
        <p className="text-gray-600 mb-8">
          The chat widget appears in the bottom-right corner. Click it to start chatting!
        </p>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-3 text-gray-800">
              ✨ Features
            </h2>
            <ul className="space-y-2 text-gray-600">
              <li>✅ Real-time WebSocket messaging</li>
              <li>✅ Typing indicators</li>
              <li>✅ Unread message counter</li>
              <li>✅ Minimize/maximize</li>
              <li>✅ Auto-scroll to latest message</li>
              <li>✅ Connection status indicator</li>
              <li>✅ Customizable themes (light/dark)</li>
              <li>✅ Flexible positioning</li>
            </ul>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-3 text-gray-800">
              🚀 Usage Example
            </h2>
            <pre className="bg-gray-800 text-green-400 p-4 rounded text-sm overflow-x-auto">
{`import ChatBox from './components/ChatBox';

// Default (bottom-right, light)
<ChatBox />

// Dark theme, bottom-left
<ChatBox 
  theme="dark"
  position="bottom-left"
/>

// Custom size
<ChatBox 
  height="600px"
  width="450px"
/>

// Different server
<ChatBox 
  serverUrl="http://localhost:3000"
/>`}
            </pre>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-3 text-gray-800">
            🧪 How to Test
          </h2>
          <ol className="space-y-2 text-gray-600 list-decimal list-inside">
            <li>Open this page in <strong>two different browsers</strong> (or incognito mode)</li>
            <li>Click the <strong>chat bubble</strong> in the bottom-right corner</li>
            <li>Type a message in one browser and send it</li>
            <li>Watch it appear <strong>instantly</strong> in the other browser! 🎉</li>
          </ol>
        </div>
      </div>

      {/* ChatBox Component - This is what users will add to their pages */}
      <ChatBox 
        serverUrl="http://localhost:8080"
        position="bottom-right"
        theme="light"
        autoConnect={true}
      />
    </div>
  );
}
