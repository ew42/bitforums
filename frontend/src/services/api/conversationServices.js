import config from '../../config';

export const fetchConversationPosts = async (conversationId) => {
  console.log(`Fetching posts for conversation: ${conversationId}`);
  const url = `${config.API_URL}/conversation/${conversationId}/posts`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error, status: ${response.status}`);
    }
    const data = await response.json();
    console.log('Fetched posts:', JSON.stringify(data, null, 2));
    return data;
  } catch (error) {
    console.error('Error fetching conversation posts:', error);
    throw error;
  }
};

export const createNewConversation = async (conversationData) => {
  console.log('Creating new conversation with data:', JSON.stringify(conversationData));
  const url = `${config.API_URL}/conversation`;
  const token = localStorage.getItem('authToken');

  if (!token) {
    throw new Error('Please login to create a conversation');
  }

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(conversationData)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Error: status ${response.status}`);
    }

    const data = await response.json();
    return data;
  }
  catch (error) {
    console.error('Error creating conversation:', error);
    throw error;
  }
};