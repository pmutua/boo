'use strict';

const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  mbti: { type: String, required: false },
  enneagram: { type: String, required: false },
  zodiac: { type: String, required: false },
  likes: { type: Number, required: false }, 
  title: { type: String, required: true },
  description: { type: String, required: true },
  profileId: { type: mongoose.Schema.Types.ObjectId, ref: 'Profile' },
  createdAt: { type: Date, default: Date.now }
});

commentSchema.index({ createdAt: -1 });
commentSchema.index({ likes: -1 });

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;
