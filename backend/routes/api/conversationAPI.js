const express = require('express');
const router = express.Router();
const Post = require('../../controllers/Post');

router.get('/:id/posts', async (req, res) => {
  try {
    const posts = await Post.find({ conversation: req.params.id })
      .sort('createdAt')
      .populate('author', 'username');
    
    res.json(posts);
  } catch (error) {
    console.error('Error fetching conversation posts:', error);
    res.status(500).json({ error: 'Error fetching posts' });
  }
});

module.exports = router;