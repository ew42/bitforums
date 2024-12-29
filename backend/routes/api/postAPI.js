const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Post = require('../../controllers/Post.js');


router.get('/:id', async (req, res) => {
    const postId = req.params.id;
    Post.findById(postId)
        .then((post) => {
            if (!post) {
                console.log('Post not found');
                return res.status(404).json({ error: 'Post not found' });
            }
            res.json(post);
        })
        .catch((error) => {
            console.log('Error finding post:', error);
            res.status(500).json({ error: 'Error fetching post' });
        });
});

router.post('/api/post/*', (req, res) => {
    const postId = req.params[0];
    const post = new Post(req.body);
    post.save()
        .then((savedPost) => {
            res.json(savedPost);
        })
        .catch((error) => {
            res.status(500).json({ error: 'Error saving post' });
        });
});

module.exports = router;