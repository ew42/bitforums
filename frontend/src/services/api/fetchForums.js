import config from '../../config';

// Fetch single forum by ID
export const fetchForum = async (forumId) => {
  console.log(`Fetching forum with id: ${forumId}`);
  const url = `${config.API_URL}/forum/${forumId}`;
  console.log("Fetching forum from", url);

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