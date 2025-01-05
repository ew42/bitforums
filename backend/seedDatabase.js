const mongoose = require('mongoose');
const User = require('./controllers/User');
const Post = require('./controllers/Post');
const Forum = require('./controllers/Forum');
const Conversation = require('./controllers/Conversation');
require('dotenv').config();

const mongoURI = process.env.MONGODB_URI;

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
    content: `# Introduction
    
This is our first discussion point about this topic. Let me outline a few key areas:

## Key Points
- First major consideration
- Second important aspect
- Third critical element

## Supporting Evidence
1. Research shows that...
2. Studies indicate...
3. Historical precedent suggests...

> Important quote or reference that supports this position

For more information, see [this reference](https://example.com)`,
    createdAt: new Date('2024-01-01'),
    score: 15,
    tags: ['start']
  },
  {
    title: 'First Response',
    content: `## Analysis of Previous Points

I find the previous argument interesting, particularly regarding the second point. Here's why:

### Supporting Arguments
* Point A demonstrates...
* Point B illustrates...

\`\`\`
Example code or formatted text
that needs to be preserved
\`\`\`

#### Counter Considerations
1. However, we should consider...
2. Another perspective suggests...

---
**Note:** This is a critical distinction we need to make.`,
    createdAt: new Date('2024-01-02'),
    score: 8,
    tags: ['response']
  }
];

// Generate 40 additional posts with varied content
const generateMorePosts = (baseDate) => {
  const posts = [];
  const topics = ['analysis', 'question', 'critique', 'support', 'counterpoint', 'example', 'clarification'];
  const contentStarters = [
    `## Building on the Previous Point
    
In considering the previous argument, we should examine:

1. The underlying assumptions
2. The practical implications
3. The potential consequences

### Key Insights
`,
    `## Respectful Disagreement
    
While the previous points are well-made, I see some potential issues:

* First concern
* Second consideration
* Alternative perspective

> Important counterpoint to consider
`,
    `## Related Example
    
This reminds me of a similar situation:

### Case Study
1. Background
2. Similarities
3. Lessons Learned

\`\`\`
Supporting data or evidence
goes here
\`\`\`
`,
    `## Additional Perspective
    
To add another dimension to this discussion:

### Consider These Points
- First new angle
- Second consideration
- Third perspective

---
**Important:** Key takeaway here
`,
    `## Practical Example
    
Consider this real-world application:

1. Scenario
2. Implementation
3. Results

### Lessons Learned
`,
    `## Alternative Approach
    
What if we looked at it this way:

### New Framework
* Point One
* Point Two
* Point Three

> Key insight to consider
`,
    `## Making Connections
    
This connects with several important concepts:

1. First connection
2. Second relationship
3. Third parallel

### Implications
`
  ];

  for (let i = 0; i < 40; i++) {
    const date = new Date(baseDate);
    date.setDate(date.getDate() + Math.floor(i/3));
    date.setHours(Math.floor(Math.random() * 24));

    posts.push({
      title: `${topics[i % topics.length]} ${Math.floor(i/topics.length) + 1}`,
      content: `${contentStarters[i % contentStarters.length]} ${generateRandomMarkdownContent(i + 1)}`,
      createdAt: date,
      score: Math.floor(Math.random() * 20) + 1,
      tags: [topics[i % topics.length]]
    });
  }
  return posts;
};

// Add this helper function
const generateRandomMarkdownContent = (seed) => {
  const sections = [
    `Here are the key points to consider:
- Point ${seed}.1
- Point ${seed}.2
- Point ${seed}.3

### Supporting Evidence
1. Evidence A
2. Evidence B
3. Evidence C`,
    
    `This leads us to consider:
\`\`\`
Technical detail ${seed}
Another detail
Final detail
\`\`\`

**Important conclusion:** ${seed} key takeaways.`
  ];

  return sections[seed % sections.length];
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