import { useEffect, useState, useRef } from 'react';
import io from 'socket.io-client';
import axios from 'axios';
import { toast } from "react-toastify";
import { useTranslation } from 'react-i18next';

const ChatWindow = ({ conversation }) => {
  const { t } = useTranslation();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [socket, setSocket] = useState(null);
  const [activeMenuId, setActiveMenuId] = useState(null);
  const [editingMessageId, setEditingMessageId] = useState(null);
  const [editedText, setEditedText] = useState('');
  const [lastErrorToastId, setLastErrorToastId] = useState(null);
  const menuRef = useRef(null);
  const messagesEndRef = useRef(null);
  const socketRef = useRef(null);

  // Get current user ID and Role (decode JWT or from localStorage)
  const getCurrentUser = () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return { id: payload.id, role: payload.role };
      } catch (error) {
        console.error('Error decoding JWT:', error);
      }
    }
    return { id: null, role: null };
  };

  const { id: currentUserId, role: currentUserRole } = getCurrentUser();

  const showErrorToast = (message) => {
    if (lastErrorToastId) {
      const isActive = toast.isActive(lastErrorToastId);
      if (isActive) return;
    }

    const isMobile = window.innerWidth < 768;
    const position = isMobile ? "bottom-center" : "bottom-right";

    const toastId = toast.error(message, {
      autoClose: 5000,
      position: position,
      hideProgressBar: false,
      closeButton: true,
      style: isMobile ? { fontSize: "14px", padding: "16px" } : {},
    });
    setLastErrorToastId(toastId);
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      showErrorToast(t('chat_login_required'));
      return;
    }

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
        if (error.response && error.response.status === 401) {
          showErrorToast(t('chat_login_required'));
        } else {
          console.error('Error fetching messages:', error);
        }
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

    newSocket.on('messageEdited', (data) => {
      setMessages(prev => prev.map(msg => msg.id === data.messageId ? { ...msg, message: data.message } : msg));
    });

    newSocket.on('messageDeleted', (messageId) => {
      setMessages(prev => prev.filter(msg => msg.id !== messageId));
    });

    socketRef.current = newSocket;
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [conversation.id]);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const sendMessage = () => {
    if (!newMessage.trim() || !socketRef.current) return;

    socketRef.current.emit('sendMessage', {
      conversationId: conversation.id,
      message: newMessage,
      dateMessage: new Date()
    });

    setNewMessage('');
  };

  const deleteMessage = async (messageId) => {
    if (!window.confirm(t('confirm_delete_message'))) return;

    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/conversationMessages/${conversation.id}/${messageId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      // Optimistic update or wait for socket?
      // If we wait for socket, it might feel slow.
      // But if we update optimistically and socket also comes in, React handles it fine usually.
      // Let's keep optimistic update for responsiveness, but remove the manual socket emit.
      setMessages(prev => prev.filter(msg => msg.id !== messageId));
      setActiveMenuId(null);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        showErrorToast('Debes iniciar sesión para realizar esta acción.');
      } else {
        console.error('Error deleting message:', error);
      }
    }
  };

  const startEditing = (msg) => {
    setEditingMessageId(msg.id);
    setEditedText(msg.message);
    setActiveMenuId(null);
  };

  const cancelEditing = () => {
    setEditingMessageId(null);
    setEditedText('');
  };

  const saveEdit = async (messageId) => {
    try {
      await axios.put(`${import.meta.env.VITE_API_URL}/api/conversationMessages/${conversation.id}/${messageId}`, 
        { message: editedText },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      setMessages(prev => prev.map(msg => msg.id === messageId ? { ...msg, message: editedText } : msg));
      setEditingMessageId(null);
      setEditedText('');
    } catch (error) {
      if (error.response && error.response.status === 401) {
        showErrorToast(t('chat_login_required'));
      } else {
        console.error('Error updating message:', error);
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  const toggleMenu = (e, msgId) => {
    e.stopPropagation();
    setActiveMenuId(activeMenuId === msgId ? null : msgId);
  };

  return (
    <div className="bg-white md:rounded-lg md:shadow-md p-4 md:p-6">
      <h2 className="text-2xl font-bold mb-4 text-center">
        {conversation.type ? t('chat_title', { type: conversation.type.charAt(0).toUpperCase() + conversation.type.slice(1) }) : 'Chat'}
      </h2>

      <div className="md:h-96 h-[calc(100vh-200px)] overflow-y-auto border border-gray-300 rounded p-4 mb-4 bg-gray-50">
        {messages.length === 0 ? (
          <p className="text-gray-500 text-center">{t('chat_no_messages')}</p>
        ) : (
          messages.map((msg) => {
            const isSenderAdmin = msg.sender?.role?.role === 'admin';
            const isOwnMessage = msg.senderId === currentUserId;
            const isEditing = editingMessageId === msg.id;
            
            // Logic: If I am admin, all admin messages go right. If I am user, only my messages go right.
            const showOnRight = currentUserRole === 'admin' ? isSenderAdmin : isOwnMessage;

            const sender = msg.sender;
            const avatarSrc = sender?.nameFile;
            const initial = sender?.firstName?.[0]?.toUpperCase() || "U";

            return (
              <div key={msg.id} className={`mb-4 flex items-start gap-3 ${showOnRight ? 'justify-end' : 'justify-start'}`}>
                {!showOnRight && (
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm bg-blue-600 shrink-0">
                    {avatarSrc ? (
                      <img
                        src={avatarSrc}
                        alt={`${sender.firstName} ${sender.lastName}`}
                        className="w-full h-full object-cover rounded-full"
                      />
                    ) : (
                      <span>{initial}</span>
                    )}
                  </div>
                )}

                <div className={`p-2 rounded max-w-[70%] relative group ${showOnRight ? 'bg-blue-600 text-white' : 'bg-gray-200 text-black'}`}>
                  
                  {isEditing ? (
                    <div className="flex flex-col">
                      <input 
                        type="text" 
                        value={editedText} 
                        onChange={(e) => setEditedText(e.target.value)}
                        className="text-black p-1 rounded mb-1 bg-white"
                      />
                      <div className="flex justify-end gap-2">
                        <button onClick={cancelEditing} className="text-xs underline">{t('cancel')}</button>
                        <button onClick={() => saveEdit(msg.id)} className="text-xs underline">{t('save')}</button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <p className="text-sm pr-6">{msg.message}</p>
                      <small className={`text-xs ${showOnRight ? 'text-blue-100' : 'text-gray-500'}`}>
                        {new Date(msg.createdAt).toLocaleString('es-ES', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })}
                      </small>
                      
                      {isOwnMessage && (
                        <>
                          <button 
                            onClick={(e) => toggleMenu(e, msg.id)}
                            className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity focus:opacity-100"
                          >
                            <i className="fas fa-chevron-down text-xs"></i>
                          </button>
                          
                          {activeMenuId === msg.id && (
                            <div ref={menuRef} className="absolute top-5 right-0 bg-white text-black shadow-lg rounded z-10 w-32 py-1">
                              <button 
                                onClick={() => startEditing(msg)}
                                className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                              >
                                {t('edit')}
                              </button>
                              <button 
                                onClick={() => deleteMessage(msg.id)}
                                className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 text-red-600"
                              >
                                {t('delete')}
                              </button>
                            </div>
                          )}
                        </>
                      )}
                    </>
                  )}
                </div>

                {showOnRight && (
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm bg-blue-600 shrink-0">
                    {avatarSrc ? (
                      <img
                        src={avatarSrc}
                        alt={`${sender.firstName} ${sender.lastName}`}
                        className="w-full h-full object-cover rounded-full"
                      />
                    ) : (
                      <span>{initial}</span>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="flex">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={t('chat_placeholder')}
          className="flex-1 min-w-0 border border-gray-300 rounded-l px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={sendMessage}
          className="bg-blue-600 text-white px-4 py-2 rounded-r hover:bg-blue-700 transition flex items-center justify-center shrink-0"
        >
          <i className="fas fa-paper-plane"></i>
        </button>
      </div>
    </div>
  );
};

export default ChatWindow;