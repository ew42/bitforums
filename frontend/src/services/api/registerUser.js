import config from '../../config';


export const registerUser = async (userInfo) => {
  console.log("Registering User");
  const url = `${config.API_URL}/register`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userInfo)
    });
    const data = await response.json();

    if(!response.ok) {
      if (response.status === 409) {
        throw new Error(`${data.error} (${data.field})`);
      }
      throw new Error(data.error || 'Registration failed');
    }
    return data;
  }
  catch (error) {
    console.error('Error registering user:', error);
    throw error;
  }
};
