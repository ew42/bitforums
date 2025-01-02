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

const samplePosts = [
  {
    title: 'Initial Discussion',
    content: 'Starting our conversation about this topic...',
    createdAt: new Date('2024-01-01'),
    score: 15,
    tags: ['start']
  },
  {
    title: 'First Response',
    content: 'Interesting perspective, let me add...',
    createdAt: new Date('2024-01-02'),
    score: 8,
    tags: ['response']
  }
  // ... existing sample posts
];

// Generate 40 additional posts with varied content
const generateMorePosts = (baseDate) => {
  const posts = [];
  const topics = ['analysis', 'question', 'critique', 'support', 'counterpoint', 'example', 'clarification'];
  const contentStarters = [
    'Building on the previous point...',
    'I disagree with this because...',
    'This reminds me of...',
    'To add another perspective...',
    'Consider this example...',
    'What if we looked at it this way...',
    'This connects with...'
  ];

  for (let i = 0; i < 40; i++) {
    const date = new Date(baseDate);
    date.setDate(date.getDate() + Math.floor(i/3)); // 2-3 posts per day
    date.setHours(Math.floor(Math.random() * 24));

    posts.push({
      title: `${topics[i % topics.length]} ${Math.floor(i/topics.length) + 1}`,
      content: `${contentStarters[i % contentStarters.length]} Extended discussion point ${i + 1}`,
      createdAt: date,
      score: Math.floor(Math.random() * 20) + 1, // Random score 1-20
      tags: [topics[i % topics.length]]
    });
  }
  return posts;
};

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

    // Create conversations with many interconnected posts
    for (const forum of createdForums) {
      const conversation = new Conversation({
        title: `Complex Discussion in ${forum.name}`,
        description: `A detailed conversation with many interconnected posts`,
        forum: forum._id,
        tags: ['complex', 'discussion']
      });
      await conversation.save();

      // Generate all posts
      const allPostsData = [...samplePosts, ...generateMorePosts(new Date('2024-01-01'))];
      const createdPosts = [];

      // Create all posts first
      for (const postData of allPostsData) {
        const post = new Post({
          ...postData,
          conversation: conversation._id,
          author: createdUsers[Math.floor(Math.random() * createdUsers.length)]._id
        });
        await post.save();
        createdPosts.push(post);

        // Update user's posts array
        const author = await User.findById(post.author);
        author.posts.push(post._id);
        await author.save();
      }

      // Create complex interconnections
      for (let i = 1; i < createdPosts.length; i++) {
        // Each post connects to 1-3 previous posts
        const numConnections = Math.floor(Math.random() * 3) + 1;
        const possibleParents = createdPosts.slice(0, i); // All previous posts
        const parents = [];

        // Randomly select parents from previous posts
        for (let j = 0; j < numConnections && possibleParents.length > 0; j++) {
          const randomIndex = Math.floor(Math.random() * possibleParents.length);
          parents.push(possibleParents[randomIndex]._id);
          possibleParents.splice(randomIndex, 1); // Remove selected parent from possibilities
        }

        createdPosts[i].parentPosts = parents;
        await createdPosts[i].save();
      }

      // Update conversation with all post IDs
      conversation.posts = createdPosts.map(post => post._id);
      await conversation.save();

      // Update forum
      forum.conversations.push(conversation._id);
      await forum.save();
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