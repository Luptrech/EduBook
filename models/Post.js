const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
  user: { type: String, required: true },
  content: { type: String, required: true },
  image: { type: String, default: null },
  comments: [
    {
      user: String,
      text: String,
      createdAt: { type: Date, default: Date.now }
    }
  ],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Post', PostSchema);
