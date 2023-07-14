'use strict';

const mongoose = require('mongoose');

/**
 * @typedef {import('mongoose').Schema<Document>} Schema
 * @typedef {import('mongoose').Model<Document>} Model
 */

/**
 * Represents a user profile.
 * @typedef {Object} Profile
 * @property {string} name - The name of the user.
 * @property {string} description - The description of the user profile.
 * @property {string} mbti - The MBTI (Myers-Briggs Type Indicator) type of the user.
 * @property {string} enneagram - The Enneagram type of the user.
 * @property {string} variant - The Enneagram variant of the user.
 * @property {number} tritype - The Enneagram tritype of the user.
 * @property {string} socionics - The Socionics type of the user.
 * @property {string} sloan - The Sloan type of the user.
 * @property {string} psyche - The psyche type of the user.
 * @property {string} temperaments - The temperament of the user.
 * @property {string} image - The image URL of the user.
 * @property {Array.<mongoose.Schema.Types.ObjectId>} comments - An array of comment references associated with the profile.
 */

/**
 * Mongoose schema for the Profile model.
 * @type {Schema<Profile>}
 */
const profileSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  mbti: { type: String, required: true },
  enneagram: { type: String, required: true },
  variant: { type: String, required: true },
  tritype: { type: Number, required: true },
  socionics: { type: String, required: true },
  sloan: { type: String, required: true },
  psyche: { type: String, required: true },
  temperaments: { type: String, required: true },
  image: { type: String, required: true },
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
});

/**
 * Mongoose model for the Profile collection.
 * @type {Model<Profile>}
 */
const Profile = mongoose.model('Profile', profileSchema);

module.exports = Profile;