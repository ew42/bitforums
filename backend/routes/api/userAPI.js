const mongoose = require('mongoose');
const User = require('../../controllers/User');
const express = require('express')
const Post = require('../../controllers/Post');

const router = express.Router();

// Get user posts with optional filtering
router.get('/:userId/posts', async (req, res) => {
  try {
    const { forum, conversation, search } = req.query;
    let query = { author: req.params.userId };
    
    if (forum) query.forum = forum;
    if (conversation) query.conversation = conversation;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } }
      ];
    }
    
    const posts = await Post.find(query)
      .populate('author', 'username')
      .populate('conversation', 'title')
      .sort('-createdAt');
    
    res.json(posts);
  } catch (error) {
    console.error('Error fetching user posts:', error);
    res.status(500).json({ error: 'Error fetching user posts' });
  }
});

module.exports = router;