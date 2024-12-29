const mongoose = require('mongoose');
const Post = require('./controllers/Post');
require('dotenv').config();

const mongoURI = process.env.MONGO_URI;

const samplePosts = [
  {
    title: "First Test Post",
    content: "This is the content of our first test post.",
    author: new mongoose.Types.ObjectId(), // Creates a random ObjectId
    tags: ["test", "first"]
  },
  {
    title: "Second Test Post",
    content: "This is another test post with different content.",
    author: new mongoose.Types.ObjectId(),
    tags: ["test", "second"]
  },
  {
    title: "Discussion on AI",
    content: "A lengthy discussion about artificial intelligence and its implications.",
    author: new mongoose.Types.ObjectId(),
    tags: ["AI", "technology", "discussion"]
  }
];

async function seedDatabase() {
  try {
    await mongoose.connect(mongoURI);
    console.log('Connected to MongoDB');

    // Clear existing posts
    await Post.deleteMany({});
    console.log('Cleared existing posts');

    // Insert new posts
    const result = await Post.insertMany(samplePosts);
    console.log('Database seeded with sample posts:', result);

  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
}

seedDatabase(); 