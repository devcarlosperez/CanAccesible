import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import ChatWindow from '../../components/conversation/ChatWindow';
import axios from 'axios';

const Conversation = () => {
  const { conversationId } = useParams();
  const [conversation, setConversation] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchConversation = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/conversations/${conversationId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setConversation(response.data);
      } catch (error) {
        console.error('Error fetching conversation:', error);
      } finally {
        setLoading(false);
      }
    };

    if (conversationId) {
      fetchConversation();
    }
  }, [conversationId]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Cargando conversación...</div>;
  }

  if (!conversation) {
    return <div className="min-h-screen flex items-center justify-center">Conversación no encontrada.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto">
        <ChatWindow conversation={conversation} />
      </div>
    </div>
  );
};

export default Conversation;