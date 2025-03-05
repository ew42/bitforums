import React, { useState } from 'react';
import { registerUser } from '../services/api/registerUser';
import './Register.css';

const Register = () => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isRegistered, setIsRegistered] = useState(false);

  const handleRegister = async () => {
    try {
      await registerUser({ email, username, password });
      setErrorMessage('');
      setIsRegistered(true);
    }
    catch (error) {
      console.error('Registration failed', error);
      setErrorMessage(error.message);
    }
  };

  return (
    <div className="register">
      {!isRegistered ? (
        <div className="register-form">
        <h1>Register</h1>
        <input type="text" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        {errorMessage && <p className="registration-error-message">{errorMessage}</p>}
        <button onClick={handleRegister}>Register</button>
        </div>
      ) : (
        <div className="registered-div">
          <h1>Registration Successful</h1>
          <p>Welcome, {username}!</p>
        </div>
      )}
    </div>
  );
};

export default Register;