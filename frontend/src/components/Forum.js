import React, { useState, useEffect } from 'react';
import { fetchForum } from "../services/api/forumService";
import ConversationCard from './common/ConversationCard';
import './Forum.css';

const Forum = ({ title="Forum", forumId, createNewTab}) => {
  const [forumData, setForumData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleNewConversation = () => {
    createNewTab(
      'central',
      'Conversation Settings',
      'conversation settings',
      '',
      forumData
    )
  };

  useEffect(() => {
    let isMounted = true;

    async function loadForumData() {
      console.log(forumId);
      if (!forumId) {
        setError("No forum ID provided");
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      try {
        const data = await fetchForum(forumId);
        console.log("data populated");
        setForumData(data);
        setError(null);
      }
      catch (err) {
        setError(err.message);
      }
      finally {
        setIsLoading(false);
      }
    }
    loadForumData(forumId);
    return () => {
      isMounted = false;
    };
  }, [forumId]);

  if (isLoading) {
    return (
      <div>Loading...</div>
    );
  }
  if (error) {
    return (
      <div>Error: {error}</div>
    );
  }
  if (!forumData) {
    return (
      <div>No forum data available</div>
    );
  }

  return (
    <div className="forum-data">
      <h1>{forumData.name}</h1>
      <p>{forumData.description}</p>
      <div className="conversation-header">
        <h2>Conversations:</h2>
        <button className="new-conversation-button" onClick={handleNewConversation}>+</button>
      </div>
      <div className="conversation-list">
        {forumData.conversations.map(conversation => (
          <ConversationCard
            key={conversation._id}
            pane="right"
            title={conversation.title}
            description={conversation.description}
            conversationId={conversation._id}
            createNewTab={createNewTab}
          />
        ))}
      </div>
    </div>
  );
};

export default Forum;