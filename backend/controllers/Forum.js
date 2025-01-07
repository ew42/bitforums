const mongoose = require('mongoose');

const forumSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  isInviteOnly: {
    type: Boolean,
    default: true
  },
  contributors: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  moderators: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  conversations: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Conversation'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

forumSchema.methods.canUserPost = function(userId) {
  return (
    this.moderators.some(id => id.equals(userId)) ||
    this.contributors.some(id => id.equals(userId))
  );
};

forumSchema.methods.canUserInvite = function(userId) {
  return this.moderators.some(id => id.equals(userId));
};

forumSchema.methods.addModerator = async function (userId) {
  try {
    // Add user to moderators and contributors
    this.moderators.push(userId);
    this.contributors.push(userId);
    await this.save();

    // Update user's moderating and participating arrays
    await mongoose.model('User').findByIdAndUpdate(
      userId,
      { 
        $addToSet: { 
          moderating: this._id,
          participating: this._id
        }
      }
    );
  }
  catch (error) {
    throw error;
  }
};

forumSchema.methods.addContributor = async function (userId) {
  try {
    // Add user to contributors
    this.contributors.push(userId);
    await this.save();

    // Update user's participating array
    await mongoose.model('User').findByIdAndUpdate(
      userId,
      { 
        $addToSet: { 
          participating: this._id
        }
      }
    );
  }
  catch (error) {
    throw error;
  }
};

const Forum = mongoose.model('Forum', forumSchema);

module.exports = Forum;