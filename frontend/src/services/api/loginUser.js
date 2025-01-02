import config from '../../config';

export const loginUser = async (username, password) => {
  try {
    const response = await fetch(`${config.API_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });
    if (!response.ok) {
      throw new Error('Login failed');
    }
    const data = await response.json();
    localStorage.setItem('authToken', data.token);
    return data;
  }
  catch (error) {
    console.error('Login failed', error);
    throw error;
  }
};
