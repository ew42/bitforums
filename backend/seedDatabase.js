const mongoose = require('mongoose');
const User = require('./controllers/User');
const Post = require('./controllers/Post');
const Forum = require('./controllers/Forum');
const Conversation = require('./controllers/Conversation');
require('dotenv').config();

const mongoURI = process.env.MONGO_URI;

const sampleUsers = [
  {
    username: 'john_doe',
    email: 'john@example.com',
    password: 'password123'
  },
  {
    username: 'jane_smith',
    email: 'jane@example.com',
    password: 'password456'
  },
  {
    username: 'tech_expert',
    email: 'tech@example.com',
    password: 'password789'
  }
];

const sampleForums = [
  {
    name: 'Technology Discussion',
    description: 'A place to discuss the latest in technology'
  },
  {
    name: 'Philosophy Corner',
    description: 'Deep discussions about philosophical topics'
  }
];

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Forum.deleteMany({});
    await Conversation.deleteMany({});
    await Post.deleteMany({});
    console.log('Cleared existing data');

    // Create users
    const createdUsers = await Promise.all(
      sampleUsers.map(user => User.create(user))
    );
    console.log('Created users:', createdUsers.map(u => u.username));

    // Create forums
    const createdForums = [];
    for (const forumData of sampleForums) {
      // Create new forum
      const forum = new Forum({
        name: forumData.name,
        description: forumData.description,
        contributors: [createdUsers[0]._id, createdUsers[1]._id],
        moderators: [createdUsers[2]._id]
      });
      await forum.save();

      // Update user documents one at a time
      createdUsers[0].participating.push(forum._id);
      await createdUsers[0].save();

      createdUsers[1].participating.push(forum._id);
      await createdUsers[1].save();

      createdUsers[2].moderating.push(forum._id);
      await createdUsers[2].save();

      createdForums.push(forum);
    }
    console.log('Created forums:', createdForums.map(f => f.name));

    // Create conversations for each forum
    for (const forum of createdForums) {
      // Create conversation
      const conversation = new Conversation({
        title: `Welcome to ${forum.name}`,
        description: `Introduction thread for ${forum.name}`,
        forum: forum._id,
        tags: ['welcome', 'introduction']
      });
      await conversation.save();

      // Create initial post
      const post = new Post({
        title: 'Welcome Message',
        content: `Welcome to our new conversation in ${forum.name}!`,
        conversation: conversation._id,
        author: createdUsers[0]._id,
        tags: ['welcome']
      });
      await post.save();

      // Update relationships
      conversation.posts = [post._id];
      await conversation.save();

      forum.conversations.push(conversation._id);
      await forum.save();

      createdUsers[0].posts.push(post._id);
      await createdUsers[0].save();
    }

    console.log('Database seeded successfully');

  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
}

seedDatabase(); 