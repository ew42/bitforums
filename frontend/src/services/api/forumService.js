import config from '../../config';

// Fetch single forum by ID
export const fetchForum = async (forumId) => {
  console.log(`Fetching forum with id: ${forumId}`);
  const url = `${config.API_URL}/forum/${forumId}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error, status: ${response.status}`)
    }

    const data = await response.json();
    console.log('Fetched data:', JSON.stringify(data, null, 2));
    return data;
  }
  catch (error) {
    console.error('Error fetching forum:', error);
    throw error;
  }
};

// Fetch multiple forums with optional filtering
export const fetchForums = async (options = {}) => {
  const { filter, search } = options;
  const queryParams = new URLSearchParams();
  
  if (filter) queryParams.append('filter', filter);
  if (search) queryParams.append('search', search);
  
  const url = `${config.API_URL}/forum?${queryParams.toString()}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error, status: ${response.status}`)
    }
    const data = await response.json();
    return data;
  }
  catch (error) {
    console.error('Error fetching forums:', error);
    throw error;
  }
};

export const createNewForum = async (forumData) => {
  console.log('Creating new forum with data:', JSON.stringify(forumData));
  const url = `${config.API_URL}/forum`;
  const token = localStorage.getItem('authToken');

  if (!token) {
    throw new Error('Please login to create a forum');
  }

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(forumData)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Error: status ${response.status}`);
    }

    const data = await response.json();
    return data;
  }
  catch (error) {
    console.error('Error creating forum:', error);
    throw error;
  }
};