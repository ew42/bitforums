const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  title: String,
  content: String,
  author: mongoose.Schema.Types.ObjectId,
  createdAt: { 
    type: Date,
    default: Date.now 
  },
  tags: [String]
});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;