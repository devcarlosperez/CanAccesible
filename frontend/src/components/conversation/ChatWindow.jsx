import { useEffect, useState } from 'react';
import io from 'socket.io-client';
import axios from 'axios';

const ChatWindow = ({ conversation }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [socket, setSocket] = useState(null);

  // Get current user ID (decode JWT or from localStorage)
  const getCurrentUserId = () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.id;
      } catch (error) {
        console.error('Error decoding JWT:', error);
      }
    }
    return null;
  };

  const currentUserId = getCurrentUserId();

  useEffect(() => {
    // Load message history
    const fetchMessages = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/conversationMessages/${conversation.id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setMessages(response.data);
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    fetchMessages();

    // Connect WebSocket
    const newSocket = io(import.meta.env.VITE_API_URL, {
      query: { token: localStorage.getItem('token') }
    });

    newSocket.emit('joinConversation', conversation.id);

    newSocket.on('newMessage', (msg) => {
      setMessages(prev => [...prev, msg]);
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [conversation.id]);

  const sendMessage = () => {
    if (!newMessage.trim() || !socket) return;

    socket.emit('sendMessage', {
      conversationId: conversation.id,
      message: newMessage,
      dateMessage: new Date()
    });

    setNewMessage('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-4 text-center">
        {conversation.type ? `Chat: ${conversation.type}` : 'Chat'}
      </h2>

      <div className="h-96 overflow-y-auto border border-gray-300 rounded p-4 mb-4 bg-gray-50">
        {messages.length === 0 ? (
          <p className="text-gray-500 text-center">No messages yet. Start the conversation!</p>
        ) : (
          messages.map((msg) => {
            const isOwnMessage = msg.senderId === currentUserId;
            return (
              <div key={msg.id} className={`mb-2 p-2 rounded max-w-xs ${isOwnMessage ? 'bg-blue-500 text-white ml-auto' : 'bg-gray-200 text-black mr-auto'}`}>
                <p className="text-sm">{msg.message}</p>
                <small className={`text-xs ${isOwnMessage ? 'text-blue-100' : 'text-gray-500'}`}>
                  {new Date(msg.createdAt).toLocaleString('es-ES', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })}
                </small>
              </div>
            );
          })
        )}
      </div>

      <div className="flex">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type your message..."
          className="flex-1 border border-gray-300 rounded-l px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={sendMessage}
          className="bg-blue-600 text-white px-4 py-2 rounded-r hover:bg-blue-700 transition flex items-center justify-center"
        >
          <i className="fas fa-paper-plane"></i>
        </button>
      </div>
    </div>
  );
};

export default ChatWindow;