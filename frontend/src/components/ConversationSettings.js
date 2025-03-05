import React, { useState } from 'react';
import { createNewConversation } from '../services/api/conversationServices';
import './ConversationSettings.css';

const ConversationSettings = ({ forum, createNewTab }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    setIsLoading(true);
    setError('');
    try {
      const conversation = await createNewConversation({
        title,
        description,
        forumId: forum._id
      });
      createNewTab(
        "central",
        conversation.title,
        "conversation",
        conversation._id
      );
    } catch (error) {
      // Handle specific error messages from the backend
      if (error.message.includes('Only moderators and contributors')) {
        setError('You need to be a moderator or contributor to create conversations in this forum');
      } else {
        setError(error.message || 'Failed to create conversation');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='conversation-settings'>
      <h2>Create New Conversation</h2>
      {error && <div className="error-message">{error}</div>}
      <input 
        type='text'
        value={title}
        placeholder='Conversation Title'
        onChange={(e) => setTitle(e.target.value)}
        disabled={isLoading}
      />
      <input 
        type='text'
        value={description}
        placeholder='Description'
        onChange={(e) => setDescription(e.target.value)}
        disabled={isLoading}
      />
      <button 
        onClick={handleSave}
        disabled={isLoading}
      >
        {isLoading ? 'Creating...' : 'Create Conversation'}
      </button>
    </div>
  );
};

export default ConversationSettings;