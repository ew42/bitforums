const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true,
    contentType: {
      type: String,
      enum: ['markdown', 'text'],
      default: 'markdown'
    }
  },
  conversation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Conversation'
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  parentPosts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post'
  }],
  createdAt: { 
    type: Date,
    default: Date.now 
  },
  score: {
    type: Number,
    default: 0
  },
  tags: [String],
  upvotedBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
});

postSchema.statics.createPost = async function(postData) {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const post = new this(postData);;
    await post.save({ session });

    await mongoose.model('Conversation').findByIdAndUpdate(
      postData.conversation,
      { $push: { posts: post._id } },
      { session }
    );

    await mongoose.model('User').findByIdAndUpdate(
      postData.author,
      { $push: {posts: post._id } },
      { session }
    );

    await session.commitTransaction();
    return post;
  }
  catch (error) {
    await session.abortTransaction();
    throw error;
  }
  finally {
    session.endSession();
  }
};

postSchema.methods.upvote = async function() {
  this.score += 1;
  return this.save();
};

postSchema.methods.removePost = async function() {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    mongoose.model('User').findByIdAndUpdate(
      this.author,
      { $pull: { posts: this._id }},
      { session }
    );
    mongoose.model('Conversation').findByIdAndUpdate(
      this.conversation,
      { $pull: { posts: this._id }},
      { session }
    );

    await this.deleteOne({ session });

    session.commitTransaction();
  }
  catch (error) {
    await abortTransaction();
    throw error;
  }
  finally {
    session.endSession();
  }
};

postSchema.methods.toggleUpvote = async function(userId) {
  const hasUpvoted = this.upvotedBy.includes(userId);
  
  if (hasUpvoted) {
    // Remove upvote
    this.upvotedBy = this.upvotedBy.filter(id => !id.equals(userId));
    this.score -= 1;
  } else {
    // Add upvote
    this.upvotedBy.push(userId);
    this.score += 1;
  }
  
  return this.save();
};

const Post = mongoose.model('Post', postSchema);

module.exports = Post;