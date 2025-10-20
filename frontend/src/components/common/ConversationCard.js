import React from 'react';
import './ConversationCard.css';

const ConversationCard = ({pane, title, description, conversationId, createNewTab}) => {
  const handleClick = () => {
    createNewTab(
      "right",  // Always create in right pane
      title,
      "graph view",
      conversationId,
      { conversationId: conversationId }  // Pass metadata with conversation ID
    );
  };

  return (
    <div className="conversation-card" onClick={handleClick}>
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
};

export default ConversationCard;