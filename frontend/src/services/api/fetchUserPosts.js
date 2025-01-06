import config from '../../config';

export const fetchUserPosts = async (userId, options = {}) => {
  const { forum, conversation, search } = options;

  const queryParams = new URLSearchParams();
  if (forum) queryParams.append('forum', forum);
  if (conversation) queryParams.append('conversation', conversation);
  if (search) queryParams.append('search', search);

  const url = `${config.API_URL}/user/${userId}/posts${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error, status: ${response.status}`)
    }
    const data = await response.json();
    return data;
  }
  catch (error) {
    console.log('Error fetchting user posts:', error);
    throw error;
  }
};