const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: String,
  forum: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Forum',
    required: true
  },
  posts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post'
  }],
  tags: [String],
  createdAt: {
    type: Date,
    default: Date.now
  }
});


const Conversation = mongoose.model('Conversation', conversationSchema);

module.exports = Conversation;