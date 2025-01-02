const API_BASE_URL = 'http://localhost:80/api';

export const fetchConversationPosts = async (conversationId) => {
  console.log(`Fetching posts for conversation: ${conversationId}`);
  const url = `${API_BASE_URL}/conversation/${conversationId}/posts`;

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
