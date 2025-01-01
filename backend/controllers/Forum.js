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

forumSchema.methods.addModerator = async function (userId) {
  const session = mongoose.startSession();
  session.startTransaction();
  try {
    this.moderators.push(userId);
    this.contributors.push(userId);
    this.save();

    mongoose.model('User').findByIdAndUpdate(
      userId,
      { $addToSet: { 
        moderating: this._id,
        participating: this._id
      }},
      { session }
    );
    session.commitTransaction();
  }
  catch (error) {
    session.abortTransaction();
    throw error;
  }
  finally {
    session.endSession();
  }
};

forumSchema.methods.addContributor = async function (userId) {
  const session = mongoose.startSession();
  session.startTransaction();
  try {
    this.contributors.push(userId);
    this.save();

    mongoose.model('User').findByIdAndUpdate(
      userId,
      { $addToSet: { 
        participating: this._id
      }},
      { session }
    );
  }
  catch (error) {
    session.abortTransaction();
    throw error;
  }
  finally {
    session.endSession();
  }
};

const Forum = mongoose.model('Forum', forumSchema);

module.exports = Forum;