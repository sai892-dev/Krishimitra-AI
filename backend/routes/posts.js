const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const auth = require('../middleware/auth');

const prisma = new PrismaClient();

// @route   GET api/posts
// @desc    Get all posts
// @access  Public
router.get('/', async (req, res) => {
  try {
    const posts = await prisma.post.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        author: { select: { name: true } },
        _count: { select: { comments: true } }
      }
    });
    res.json(posts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/posts/:id
// @desc    Get post by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const post = await prisma.post.findUnique({
      where: { id: parseInt(req.params.id) },
      include: {
        author: { select: { name: true, id: true } },
        comments: {
          include: { author: { select: { name: true } } },
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    if (!post) {
      return res.status(404).json({ msg: 'Post not found' });
    }

    res.json(post);
  } catch (err) {
    console.error(err.message);
    if (err.code === 'P2001') {
      return res.status(404).json({ msg: 'Post not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   POST api/posts
// @desc    Create a post
// @access  Private
router.post('/', auth, async (req, res) => {
  const { title, content } = req.body;

  try {
    const newPost = await prisma.post.create({
      data: {
        title,
        content,
        authorId: req.user.id
      }
    });

    res.json(newPost);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/posts/:id
// @desc    Edit a post
// @access  Private
router.put('/:id', auth, async (req, res) => {
  const { title, content } = req.body;

  try {
    let post = await prisma.post.findUnique({ where: { id: parseInt(req.params.id) } });

    if (!post) {
      return res.status(404).json({ msg: 'Post not found' });
    }

    // Check user
    if (post.authorId !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    post = await prisma.post.update({
      where: { id: parseInt(req.params.id) },
      data: { title, content }
    });

    res.json(post);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/posts/:id
// @desc    Delete a post
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const post = await prisma.post.findUnique({ where: { id: parseInt(req.params.id) } });

    if (!post) {
      return res.status(404).json({ msg: 'Post not found' });
    }

    // Check user
    if (post.authorId !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    await prisma.post.delete({ where: { id: parseInt(req.params.id) } });

    res.json({ msg: 'Post removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/posts/:id/comments
// @desc    Add a comment to a post
// @access  Private
router.post('/:id/comments', auth, async (req, res) => {
  const { content } = req.body;

  try {
    const post = await prisma.post.findUnique({ where: { id: parseInt(req.params.id) } });

    if (!post) {
      return res.status(404).json({ msg: 'Post not found' });
    }

    const newComment = await prisma.comment.create({
      data: {
        content,
        postId: parseInt(req.params.id),
        authorId: req.user.id
      }
    });

    const commentWithAuthor = await prisma.comment.findUnique({
      where: { id: newComment.id },
      include: { author: { select: { name: true } } }
    });

    res.json(commentWithAuthor);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
