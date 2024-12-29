const express = require('express');
const User = require('./../../controllers/User');
const router = express.Router();

router.post('/registerUserAPI', async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const newUser = await User.create({
      username,
      email,
      password
    });
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      user: newUser
    })
  }
  catch (error) {
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      const errorMessage = field === 'username' ? 'Username already in use' : "Email associated with an existing account";
      return res.status(409).json({
        success: false,
        message: 'Registration failed',
        error: errorMessage,
        field: field
      });
    }
    else {
      res.status(400).json({
        success: false,
        message: 'Registration failed',
        error: error.message
      })
    }
  }
});

module.exports = router;