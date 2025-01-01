const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  moderating: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Forum'
  }],
  participating: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Forum'
  }],
  posts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post'
  }],

  tokenVersion: {
    type: Number,
    default: 0
  },
  passwordLastChanged: {
    type: Date,
    default: Date.now
  }
});

userSchema.pre('save', async function(next) {
  if (this.isNew || this.isModified('password')) {
    try {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
      this.passwordLastChanged = new Date();
      this.tokenVersion = (this.tokenVersion || 0) + 1;
    }
    catch (error) {
      return next(error)
    }
  }
  next();
});

userSchema.methods.comparePassword = async function(candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  }
  catch (error) {
    throw error;
  }
};

const User = mongoose.model('User', userSchema);

module.exports = User;