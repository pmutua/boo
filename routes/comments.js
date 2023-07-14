/**
 * @module commentsRouter
 * @description Handles routes related to comments.
 */

const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

const Profile = require("../models/profile");
const Comment = require("../models/comment");
const Like = require("../models/like");

const mbtiTypes = require("../constants/mbtiTypes");
const zodiacSigns = require("../constants/zodiacSigns");
const enneagramTypes = require("../constants/enneagramTypes");

/**
 * GET /comments
 * Retrieve comments based on the specified query type.
 *
 * @name GET /comments
 * @route {GET} /comments
 * @query {string} q - The type of query ("mbti", "enneagram", or "zodiac").
 * @response {Comment[]} - Array of comments matching the query.
 * @response {Error} 400 - Invalid query type.
 * @response {Error} 500 - Failed to fetch comments.
 */
router.get("/", async (req, res) => {
  try {
    const queryType = req.query.q;

    let comments;

    if (queryType === "mbti") {
      comments = await Comment.find({ mbti: { $in: mbtiTypes } });
      res.status(200).json(comments);
    } else if (queryType === "enneagram") {
      comments = await Comment.find({ enneagram: { $in: enneagramTypes } });
      res.status(200).json(comments);
    } else if (queryType === "zodiac") {
      comments = await Comment.find({ zodiac: { $in: zodiacSigns } });
      res.status(200).json(comments);
    } else {
      return res.status(400).json({ error: "Invalid query type" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch comments" });
  }
});

/**
 * GET /comments/recent
 * Retrieve recent comments with pagination.
 *
 * @name GET /comments/recent
 * @route {GET} /comments/recent
 * @query {number} [page=1] - The page number for pagination.
 * @query {number} [limit=10] - The number of comments per page.
 * @response {Comment[]} - Array of recent comments.
 * @response {Error} 500 - Failed to fetch comments.
 */
router.get("/recent", async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const skipCount = (page - 1) * limit;

    const comments = await Comment.find()
      .sort({ createdAt: -1 })
      .skip(skipCount)
      .limit(limit);

    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch comments" });
  }
});

/**
 * GET /comments/most-likes
 * Retrieve comments with the most number of likes.
 *
 * @name GET /comments/most-likes
 * @route {GET} /comments/most-likes
 * @query {number} [page=1] - The page number for pagination.
 * @query {number} [limit=10] - The number of comments per page.
 * @response {Comment[]} - Array of comments with the most number of likes.
 * @response {Error} 500 - Failed to fetch comments.
 */
router.get("/most-likes", async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const skipCount = (page - 1) * limit;

    const comments = await Comment.find()
      .sort({ likes: -1 })
      .skip(skipCount)
      .limit(limit);

    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch comments" });
  }
});

/**
 * POST /comments/create
 * Create a new comment.
 *
 * @name POST /comments/create
 * @route {POST} /comments/create
 * @body {string} userId - The ID of the user creating the comment.
 * @body {string} [mbti] - The MBTI type associated with the comment.
 * @body {string} [enneagram] - The Enneagram type associated with the comment.
 * @body {string} [zodiac] - The Zodiac sign associated with the comment.
 * @body {string} description - The description of the comment.
 * @body {string} title - The title of the comment.
 * @body {string} profileId - The ID of the associated profile.
 * @response {Comment} - The created comment.
 * @response {Error} 400 - Profile not found or failed to create comment.
 */
router.post("/create", async (req, res) => {
  try {
    const profileId = req.body.profileId;

    const profile = await Profile.findById(profileId);

    if (!profile) {
      return res.status(400).json({ error: "Profile not found" });
    }

    const newComment = new Comment({
      userId: req.body.userId,
      mbti: req.body.mbti || "",
      enneagram: req.body.enneagram || "",
      zodiac: req.body.zodiac || "",
      description: req.body.description,
      title: req.body.title,
      profileId: profileId,
    });

    const savedComment = await newComment.save();

    profile.comments.push(savedComment._id);
    await profile.save();

    res.status(201).json(savedComment);
  } catch (error) {
    res.status(400).json({ error: "Failed to create comment" });
  }
});

/**
 * GET /comments/detail/:id
 * Retrieve a comment by ID.
 *
 * @name GET /comments/detail/:id
 * @route {GET} /comments/detail/:id
 * @param {string} id - The ID of the comment.
 * @response {Comment} - The retrieved comment.
 * @response {Error} 404 - Comment not found.
 * @response {Error} 500 - Failed to fetch comment.
 */
router.get("/detail/:id", async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({ error: "Comment not found" });
    }

    res.json(comment);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch comment" });
  }
});

/**
 * POST /comments/like
 * Like a comment.
 *
 * @name POST /comments/like
 * @route {POST} /comments/like
 * @body {string} commentId - The ID of the comment to like.
 * @body {string} userId - The ID of the user liking the comment.
 * @response {Message} - Success message.
 * @response {Error} 400 - User has already liked the comment.
 * @response {Error} 500 - Failed to like the comment.
 */
router.post("/like", async (req, res) => {
  try {
    const { commentId, userId } = req.body;

    const existingLike = await Like.findOne({ commentId, userId });
    if (existingLike) {
      return res
        .status(400)
        .json({ error: "You have already liked this comment" });
    }

    const newLike = new Like({ commentId, userId });

    await Comment.findByIdAndUpdate(commentId, { $inc: { likes: 1 } });

    await newLike.save();

    res.status(200).json({ message: "Comment liked successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to like the comment" });
  }
});

/**
 * POST /comments/unlike
 * Unlike a comment.
 *
 * @name POST /comments/unlike
 * @route {POST} /comments/unlike
 * @body {string} commentId - The ID of the comment to unlike.
 * @body {string} userId - The ID of the user unliking the comment.
 * @response {Message} - Success message.
 * @response {Error} 500 - Failed to unlike the comment.
 */
router.post("/unlike", async (req, res) => {
  try {
    const { commentId, userId } = req.body;

    // Validate the commentId
    if (!mongoose.Types.ObjectId.isValid(commentId)) {
      return res.status(400).json({ error: "Invalid comment ID" });
    }

    await Like.findOneAndDelete({ commentId, userId });

    await Comment.findByIdAndUpdate(commentId, { $inc: { likes: -1 } });

    res.status(200).json({ message: "Comment unliked successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to unlike the comment", errorMessage: error });
  }
});

module.exports = router;