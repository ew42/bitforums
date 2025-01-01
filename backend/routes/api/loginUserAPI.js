const express = require('express');
const User = require('./../../controllers/User');
const router = express.Router();
const jwt = require('jsonwebtoken');

router.post('/', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(401).json({ message: 'Incorrect username or password' });
    }

    const isValidPassword = await user.comparePassword(password);

    if (!isValidPassword) {
      return res.status(401).json({ message: 'Incorrect username or password' })
    }

    const token = jwt.sign({
      userId: user._id,
      tokenVersion: user.tokenVersion
    }, process.env.JWT_SECRET, { expiresIn: '14d' });

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        username: user.username
      }
    });
  }
  catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;