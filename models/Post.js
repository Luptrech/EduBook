const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Referencia al usuario que publica
  content: { type: String, required: true }, // Texto de la publicación
  image: { type: String, default: null }, // Imagen en la publicación
  video: { type: String, default: null }, // Video (máx. 10 min)
  reactions: { type: Map, of: Number, default: {} }, // Reacciones (ejemplo: { "like": 10, "love": 5 })
  comments: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Usuario que comentó
      text: String,
      createdAt: { type: Date, default: Date.now }
    }
  ],
  sharedFrom: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', default: null }, // Permite reposteo
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Post', PostSchema);
