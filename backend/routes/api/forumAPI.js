const express = require('express');
const mongoose = require('mongoose');
const Forum = require('../../controllers/Forum');
const router = express.Router();

router.get('/:id', async (req, res) => {
  try {
    const forumId = req.params.id;
    console.log('Finding forum with id:', forumId);
    const forum = await Forum.findById(forumId)
      .populate('contributors', 'username')
      .populate('conversations', 'title description');
    

    if (!forum) {
      console.log("Forum not found");
      return res.status(404).json({ error: 'Forum not found' });
    }
    res.json(forum);
  }
  catch (error) {
    console.log('Error finding forum:', error);
    res.status(500).json({ error: 'Error fetching forum' });
  }
});

router.post('/', async (req, res) => {
  try {
    const forum = new Forum(req.body);
    const savedPost = await post.save();
    res.json(savedPost);
  }
  catch (error) {
    console.log('Error saving forum:', error);
    res.status(500).json({ error: 'Error saving forum' });
  }
});

module.exports = router;