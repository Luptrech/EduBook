const express = require('express');
const router = express.Router();
const { uploadImage } = require('../config/multerConfig');
const Post = require('../models/Post');  // Modelo Post

// Ruta para crear una nueva publicación con imagen
router.post('/create-post', uploadImage.single('image'), async (req, res) => {
  try {
    const { content } = req.body;
    const image = req.file ? req.file.path : null;

    const newPost = new Post({
      user: req.user?._id || 'Usuario desconocido',  // Evitar error si req.user no existe
      content,
      image,
      createdAt: new Date()
    });

    await newPost.save();

    res.status(200).json({ message: 'Publicación creada con éxito', post: newPost });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al crear la publicación' });
  }
});

// Ruta para obtener todas las publicaciones
router.get('/wall', async (req, res) => {
  try {
    const posts = await Post.find();
    res.status(200).json({ posts });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener las publicaciones' });
  }
});

module.exports = router;
