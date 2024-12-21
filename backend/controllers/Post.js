const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  title: String,
  content: String,
  author: ObjectId,
  createdAt: Date,
  tags: [String]
});

const Post = mongoose.model('Post', postSchema);

export default Post;
