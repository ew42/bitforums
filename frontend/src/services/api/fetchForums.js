const API_BASE_URL = 'http://localhost:80/api';

const fetchForums = async () => {
  const response = await fetch(`${API_BASE_URL}/forums`);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return await response.json();
};