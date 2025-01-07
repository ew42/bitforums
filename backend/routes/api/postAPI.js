const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Post = require('../../controllers/Post.js');
const auth = require('../../middleware/auth.js');
const Forum = require('../../controllers/Forum.js');


router.get('/:id', async (req, res) => {
        try {
            const postId = req.params.id;
            console.log("Finding post with id:", postId);
            const post = await Post.findById(postId)
                .populate({
                    path: 'author',
                    select: 'username'
                });
            if (!post) {
                console.log('Post not found');
                return res.status(404).json({ error: 'Post not found' });
            }
            res.json(post);
        }
        catch (error) {
            console.log('Error finding post:', error);
            res.status(500).json({ error: 'Error fetching post' });
        };
});

router.post('/', auth, async (req, res) => {
  try {
    const conversation = await mongoose.model('Conversation').findById(req.body.conversation);
    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }

    const forum = await Forum.findById(conversation.forum);
    if (!forum) {
      return res.status(404).json({ error: 'Forum not found' });
    }

    if (!forum.canUserPost(req.user._id)) {
      return res.status(403).json({ 
        error: 'Only moderators and contributors can post in this forum' 
      });
    }

    const postData = {
      title: req.body.title,
      content: req.body.content,
      conversation: req.body.conversation,
      parentPosts: req.body.parentPosts || [],
      author: req.user._id // comes from auth middleware
    };

    console.log("Creating post with data:", postData);

    // Create post directly without transactions
    const post = new Post(postData);
    const savedPost = await post.save();

    // Update related documents
    if (postData.conversation) {
      await mongoose.model('Conversation').findByIdAndUpdate(
        postData.conversation,
        { $push: { posts: savedPost._id } }
      );
    }

    await mongoose.model('User').findByIdAndUpdate(
      req.user._id,
      { $push: { posts: savedPost._id } }
    );

    res.json(savedPost);
  } catch (error) {
    console.error('Error saving post:', error);
    res.status(500).json({ error: 'Error saving post' });
  }
});

module.exports = router;