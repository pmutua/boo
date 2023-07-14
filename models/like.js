'use strict';

const mongoose = require('mongoose');

const likeSchema = new mongoose.Schema({
    commentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Comment', required: true },
    userId: { type: String, required: true }
  });
  
  const Like = mongoose.model('Like', likeSchema);
  
  module.exports = Like;