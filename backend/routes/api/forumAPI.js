const express = require('express');
const mongoose = require('mongoose');
const Forum = require('../../controllers/Forum');
const User = require('../../controllers/User');
const auth = require('../../middleware/auth');
const router = express.Router();

// Get multiple forums with filtering
router.get('/', async (req, res) => {
  try {
    const { filter, search } = req.query;
    let query = {};
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    let forums = await Forum.find(query)
      .populate('contributors', 'username')
      .populate('conversations', 'title description');
      
    // switch (filter) {
    //   case 'recent':
    //     forums.sort('-createdAt');
    //     break;
    //   case 'active':
    //     forums.sort('-conversations');
    //     break;
    //   case 'trending':
    //     // Implement trending algorithm based on recent activity
    //     forums.sort('-activity');
    //     break;
    // }
    
    // const results = await forums.limit(20).exec();
    res.json(forums);
  } catch (error) {
    console.log('Error fetching forums:', error);
    res.status(500).json({ error: 'Error fetching forums' });
  }
});

// Get single forum by ID (existing endpoint)
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

router.post('/', auth, async (req, res) => {
  try {
    const forum = new Forum(req.body);
    // Make creator a moderator and contributor
    forum.moderators.push(req.user._id);
    forum.contributors.push(req.user._id);
    const savedForum = await forum.save();

    // Update user's moderating and participating arrays
    await mongoose.model('User').findByIdAndUpdate(
      req.user._id,
      { 
        $addToSet: { 
          moderating: savedForum._id,
          participating: savedForum._id
        }
      }
    );

    res.json(savedForum);
  }
  catch (error) {
    console.log('Error saving forum:', error);
    res.status(500).json({ error: 'Error saving forum' });
  }
});

// Invite a user to the forum
router.post('/:id/invite', auth, async (req, res) => {
  try {
    const forum = await Forum.findById(req.params.id);
    if (!forum) {
      return res.status(404).json({ error: 'Forum not found' });
    }

    if (!forum.canUserInvite(req.user._id)) {
      return res.status(403).json({ error: 'Only moderators can invite users' });
    }

    const userToInvite = await User.findById(req.body.userId);
    if (!userToInvite) {
      return res.status(404).json({ error: 'User not found' });
    }

    await forum.addContributor(userToInvite._id);
    res.json({ message: 'User invited successfully' });
  } catch (error) {
    console.error('Error inviting user:', error);
    res.status(500).json({ error: 'Error inviting user' });
  }
});

// Remove a user from the forum
router.delete('/:id/contributors/:userId', auth, async (req, res) => {
  try {
    const forum = await Forum.findById(req.params.id);
    if (!forum) {
      return res.status(404).json({ error: 'Forum not found' });
    }

    if (!forum.canUserInvite(req.user._id)) {
      return res.status(403).json({ error: 'Only moderators can remove users' });
    }

    await forum.removeContributor(req.params.userId);
    res.json({ message: 'User removed successfully' });
  } catch (error) {
    console.error('Error removing user:', error);
    res.status(500).json({ error: 'Error removing user' });
  }
});

module.exports = router;