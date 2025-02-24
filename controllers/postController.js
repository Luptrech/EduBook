const Post = require('../models/Post.js');

// Crear publicación (soporta imágenes y videos)
exports.createPost = async (req, res) => {
  try {
    const { content, image, video } = req.body;
    const post = new Post({
      user: req.user._id,
      content,
      image: image || null,
      video: video || null
    });
    await post.save();
    res.status(201).json({ message: 'Post created successfully', post });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Obtener todas las publicaciones
exports.getPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate('user', 'username')
      .populate('comments.user', 'username')
      .sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Agregar comentario a una publicación
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

// Reaccionar a una publicación (likes, emojis, etc.)
exports.reactToPost = async (req, res) => {
  try {
    const { postId } = req.params;
    const { reactionType } = req.body; // Ejemplo: "like", "love", "haha"

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    if (!post.reactions.has(reactionType)) {
      post.reactions.set(reactionType, 1);
    } else {
      post.reactions.set(reactionType, post.reactions.get(reactionType) + 1);
    }

    await post.save();
    res.json({ message: 'Reaction added successfully', post });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Compartir (repost) una publicación
exports.sharePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const postToShare = await Post.findById(postId);
    if (!postToShare) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const newPost = new Post({
      user: req.user._id,
      content: postToShare.content,
      image: postToShare.image,
      video: postToShare.video,
      sharedFrom: postToShare._id
    });

    await newPost.save();
    res.status(201).json({ message: 'Post shared successfully', newPost });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
