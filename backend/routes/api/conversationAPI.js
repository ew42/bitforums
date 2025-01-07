const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const mongoose = require('mongoose');
const Post = require('../../controllers/Post');
const Conversation = require('../../controllers/Conversation');
const Forum = require('../../controllers/Forum');

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

router.post('/', auth, async (req, res) => {
  try {
    const forum = await Forum.findById(req.body.forumId);
    if (!forum) {
      return res.status(404).json({ error: 'Forum not found' });
    }

    if (!forum.canUserPost(req.user._id)) {
      return res.status(403).json({ 
        error: 'Only moderators and contributors can create conversations in this forum' 
      });
    }

    const conversationData = {
      title: req.body.title,
      description: req.body.description || '',
      forum: req.body.forumId,
      posts: [],
    };

    console.log('Creating conversation with data:', conversationData);

    const newConversation = new Conversation(conversationData);
    const savedConversation = await newConversation.save();

    await mongoose.model('Forum').findByIdAndUpdate(
      req.body.forumId,
      {$push: { conversations: savedConversation._id}}
    )

    // Send back the created conversation
    res.status(201).json(newConversation);
  }
  catch (error) {
    console.error('Error creating conversation:', error);
    res.status(500).json({ 
      message: "Error creating conversation", 
      error: error.message 
    });
  }
});

module.exports = router;