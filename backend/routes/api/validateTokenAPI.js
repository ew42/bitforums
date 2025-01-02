const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');

router.get('/', auth, async (req, res) => {
  try {
    res.json({ 
      valid: true, 
      user: {
        id: req.user._id,
        username: req.user.username
      }
    });
  } catch (error) {
    res.status(401).json({ valid: false });
  }
});

module.exports = router;