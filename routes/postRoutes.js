const express = require('express');
const router = express.Router();
const { uploadImage } = require('../config/multerConfig');
const Post = require('../models/Post');  // Modelo Post
const authenticate = require('../middleware/authenticate');  // Middleware de autenticación

// Ruta para crear una nueva publicación con imagen
router.post('/create-post', authenticate, uploadImage.single('image'), async (req, res) => {
  try {
    const { content } = req.body;
    const image = req.file ? req.file.path : null;

    const newPost = new Post({
      user: req.user._id,  // Asegúrate de que req.user esté definido
      content,
      image,
      createdAt: new Date()
    });

    await newPost.save();

    res.status(201).json({ message: 'Publicación creada con éxito', post: newPost });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al crear la publicación' });
  }
});

// Ruta para obtener todas las publicaciones
router.get('/wall', async (req, res) => {
  try {
    const posts = await Post.find().populate('user', 'username').sort({ createdAt: -1 });
    res.status(200).json({ posts });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener las publicaciones' });
  }
});

module.exports = router;
