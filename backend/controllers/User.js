const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  username: {
    type: String;
    required: true;
    unique: true;
    trim: true;
  },
  email: {
    type: String;
    required: true;
    unique: true;
    trim: true;
    lowercase: true;
  },
  password: {
    type: String;
    required: true;
  },
  createdAt: {
    type: Date;
    default: Date.now;
  },
  posts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post'
  }]
});

userSchema.pre('save', async function(next) {
  if (this.isNew || this.isModified('password') {
    try {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
    }
    catch (error) {
      return next(error)
    }
  })
  next();
});

const User = mongoose.model('User', userSchema);

export default User;
