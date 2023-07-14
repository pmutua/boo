"use strict";

const express = require("express");
const router = express.Router();
const Profile = require("../models/profile");

const mongoose = require("mongoose");

/**
 * GET route for fetching a profile by ID.
 * @param {import("express").Request} req - The request object.
 * @param {import("express").Response} res - The response object.
 * @param {import("express").NextFunction} next - The next function.
 */
router.get("/profile/:id", async (req, res, next) => {
  try {
    const profileId = req.params.id;

    const validId = mongoose.Types.ObjectId.isValid(profileId);
    if (!validId) {
      return res.status(400).json({ error: "Invalid profile ID" });
    }

    const profile = await Profile.findById(profileId);

    if (!profile) {
      return res.status(404).json({ error: "Profile not found" });
    }

    res.render("profile_template", {
      profile: profile,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch profile" });
  }
});

/**
 * POST route for creating a new profile.
 * @param {import("express").Request} req - The request object.
 * @param {import("express").Response} res - The response object.
 */
router.post("/create_profile", async (req, res) => {
  try {
    const newProfile = new Profile({
      name: req.body.name,
      description: req.body.description,
      mbti: req.body.mbti,
      enneagram: req.body.enneagram,
      variant: req.body.variant,
      tritype: req.body.tritype,
      socionics: req.body.socionics,
      sloan: req.body.sloan,
      psyche: req.body.psyche,
      temperaments: req.body.temperaments,
      image: req.body.image,
    });

    const savedProfile = await newProfile.save();

    res.status(201).json(savedProfile);
  } catch (error) {
    res.status(400).json({ error: "Failed to create profile" });
  }
});

module.exports = router;