const config = {
  API_URL: process.env.NODE_ENV === 'production'
  ? 'https://bitforums.org/api'
  : 'http://localhost:3001/api'
};

export default config;