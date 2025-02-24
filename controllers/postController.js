// backend/controllers/postController.js
const Post = require('../models/Post.js');

exports.createPost = async (req, res) => {
  try {
    const { content } = req.body;
    const post = new Post({
      user: req.user._id,
      content
    });
    await post.save();
    res.status(201).json({ message: 'Post created successfully', post });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate('user', 'username')
      .sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.addComment = async (req, res) => {
  try {
    const { text } = req.body;
    const postId  = req.params.postId;
    const post    = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    post.comments.push({ user: req.user._id, text });
    await post.save();
    res.json({ message: 'Comment added successfully', post });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
