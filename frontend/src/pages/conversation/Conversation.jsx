import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import ChatWindow from '../../components/conversation/ChatWindow';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

const Conversation = () => {
  const { t } = useTranslation();
  const { conversationId } = useParams();
  const navigate = useNavigate();
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
    return <div className="min-h-screen flex items-center justify-center">{t('chat_loading')}</div>;
  }

  if (!conversation) {
    return <div className="min-h-screen flex items-center justify-center">{t('chat_not_found')}</div>;
  }

  const handleBack = () => {
    navigate('/contact');
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 md:py-8">
      <div className="w-full mx-auto md:max-w-4xl md:mx-auto px-4">
        <div className="text-center mb-4">
          <button 
            onClick={handleBack} 
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition cursor-pointer"
          >
            ← {t('back')}
          </button>
        </div>
        <ChatWindow conversation={conversation} />
      </div>
    </div>
  );
};

export default Conversation;