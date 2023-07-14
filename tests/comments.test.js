"use strict";

const chai = require("chai");
const chaiHttp = require("chai-http");
const Comment = require("../models/comment");
const Profile = require("../models/profile");
const Like = require("../models/like");
const app = require("../app");

const expect = chai.expect;

chai.use(chaiHttp);

process.env.NODE_ENV = "test";

describe("Comments API", () => {
  // Seed test data before running the test cases
  before(async function () {
    // Clear existing comments from the database
    await Comment.deleteMany();
    // seed profile
    new Profile({
      name: "John Doe",
      description: "Lorem ipsum dolor sit amet",
      mbti: "INTJ",
      enneagram: "5w6",
      variant: "Social",
      tritype: "531",
      socionics: "ILE",
      sloan: "RLOAI",
      psyche: "Introverted Thinking",
      temperaments: "NT",
      image: "https://soulverse.boo.world/images/1.png",
    });

    // Seed test comments
    const testComments = [
      {
        userId: "4rTY365sver09837yhdn",
        title: "Comment 1",
        mbti: "ISTJ",
        enneagram: "1w2",
        zodiac: "Aries",
        description: "Lorem ipsum dolor sit amet",
        likes: 3,
        createdAt: new Date(),
      },
      {
        userId: "user2",
        title: "Comment 2",
        mbti: "INTP",
        enneagram: "5w6",
        zodiac: "Leo",
        description: "Lorem ipsum dolor sit amet",
        likes: 10,
        createdAt: new Date(),
      },
      {
        userId: "user3",
        title: "Comment 3",
        mbti: "ENFP",
        enneagram: "8w7",
        zodiac: "Gemini",
        description: "Lorem ipsum dolor sit amet",
        likes: 1,
        createdAt: new Date(),
      },
    ];

    await Comment.create(testComments);

    testComments.forEach((comment) => {
      new Like({
        commentId: comment._id,
        userId: "4rTY365sver09837yhdn",
      });
    });
  });

  describe("POST /api/comments/create", () => {
    it("should create a new comment and associate it with a profile", async () => {
      const newProfile = new Profile({
        name: "John Doe",
        description: "Lorem ipsum dolor sit amet",
        mbti: "INTJ",
        enneagram: "5w6",
        variant: "Social",
        tritype: "531",
        socionics: "ILE",
        sloan: "RLOAI",
        psyche: "Introverted Thinking",
        temperaments: "NT",
        image: "https://example.com/image.jpg",
      });

      const savedProfile = await newProfile.save();

      const newComment = {
        userId: "123",
        mbti: "INTJ",
        enneagram: "5w6",
        zodiac: "Aries",
        description: "Lorem ipsum dolor sit amet",
        title: "Sample Comment",
        profileId: savedProfile._id.toString(),
      };

      const res = await chai
        .request(app)
        .post("/api/comments/create")
        .send(newComment);

      expect(res).to.have.status(201);
      expect(res.body).to.be.an("object");
      expect(res.body.userId).to.equal("123");
      expect(res.body.mbti).to.equal("INTJ");
      expect(res.body.enneagram).to.equal("5w6");
      expect(res.body.zodiac).to.equal("Aries");
      expect(res.body.description).to.equal("Lorem ipsum dolor sit amet");
      expect(res.body.title).to.equal("Sample Comment");
      expect(res.body.profileId).to.equal(savedProfile._id.toString());

      const updatedProfile = await Profile.findById(savedProfile._id);

      expect(updatedProfile.comments).to.include(res.body._id);
    });

    it("should return an error when the associated profile is not found", async () => {
      const newComment = {
        userId: "123",
        profileId: "invalid",
        description: "Lorem ipsum dolor sit amet",
        title: "Sample Comment",
      };

      const res = await chai
        .request(app)
        .post("/api/comments/create")
        .send(newComment);
      expect(res).to.have.status(400);
    });

    it("should return an error when required fields are missing", async () => {
      const newComment = {
        // Missing userId, profileId, description, and title fields
      };

      const res = await chai
        .request(app)
        .post("/api/comments/create")
        .send(newComment);
      expect(res).to.have.status(400);
    });
  });

  describe("POST /api/comments/like", () => {
    it("should like a comment and increment the likes count", async () => {
      const newProfile = new Profile({
        name: "John Doe",
        description: "Lorem ipsum dolor sit amet",
        mbti: "INTJ",
        enneagram: "5w6",
        variant: "Social",
        tritype: "531",
        socionics: "ILE",
        sloan: "RLOAI",
        psyche: "Introverted Thinking",
        temperaments: "NT",
        image: "https://soulverse.boo.world/images/1.png",
      });

      const savedProfile = await newProfile.save();

      const profileId = savedProfile._id.toString();

      const comment = new Comment({
        userId: "123",
        mbti: "INTJ",
        enneagram: "5w6",
        zodiac: "Aries",
        description: "Comment 1",
        title: "Title 1",
        profileId: profileId._id,
      });
      const likeData = {
        commentId: comment._id,
        userId: "4rTY365sver09837yhdn",
      };

      const res = await chai
        .request(app)
        .post("/api/comments/like")
        .send(likeData);
      expect(res).to.have.status(200);
      expect(res.body)
        .to.have.property("message")
        .that.equals("Comment liked successfully");
    });

    it("should return an error when the user has already liked the comment", async () => {
      const comment = await Comment.findOne();
      const likeData = {
        commentId: comment._id,
        userId: "4rTY365sver09837yhdn",
      };

      await chai.request(app).post("/api/comments/like").send(likeData);
      const res2 = await chai
        .request(app)
        .post("/api/comments/like")
        .send(likeData);
      expect(res2).to.have.status(400);
      expect(res2.body)
        .to.have.property("error")
        .that.equals("You have already liked this comment");
    });
  });

  describe("POST /api/comments/unlike", () => {
    it("should unlike a comment and decrement the likes count", async () => {
      // Retrieve the first comment from the collection
      const firstComment = await Comment.findOne();

      // Create a new like for the comment
      const newLike = new Like({
        commentId: firstComment._id,
        userId: "4rTY365sver09837yhdn",
      });

      await newLike.save();

      firstComment.likes += 1;
      firstComment.save();

      // Perform the unlike operation
      const unlikeData = {
        commentId: firstComment._id,
        userId: "4rTY365sver09837yhdn",
      };
      const res = await chai
        .request(app)
        .post("/api/comments/unlike")
        .send(unlikeData);

      expect(res).to.have.status(200);
      expect(res.body)
        .to.have.property("message")
        .that.equals("Comment unliked successfully");
      expect(firstComment.likes).to.equal(5);
    });
  });

  describe("GET /api/comments/recent", function () {
    it("should return recent comments with default pagination", async function () {
      const res = await chai.request(app).get("/api/comments/recent");

      expect(res).to.have.status(200);
      expect(res.body).to.be.an("array");
    });

    it("should return recent comments with custom pagination", async function () {
      const res = await chai
        .request(app)
        .get("/api/comments/recent")
        .query({ page: 2, limit: 5 });

      expect(res).to.have.status(200);
      expect(res.body).to.be.an("array");
    });
  });

  describe("GET /api/comments/most-likes", function () {
    it("should return comments sorted by most likes with default pagination", async function () {
      const res = await chai.request(app).get("/api/comments/most-likes");

      expect(res).to.have.status(200);
      expect(res.body).to.be.an("array");
    });

    it("should return comments sorted by most likes with custom pagination", async function () {
      const res = await chai
        .request(app)
        .get("/api/comments/most-likes")
        .query({ page: 3, limit: 10 });

      expect(res).to.have.status(200);
      expect(res.body).to.be.an("array");
    });
  });

  describe("GET /api/comments", () => {
    it("should return comments filtered by MBTI type", async () => {
      const res = await chai
        .request(app)
        .get("/api/comments")
        .query({ q: "mbti" });

      expect(res).to.have.status(200);
      expect(res).to.be.json;
      expect(res.body).to.be.an("array");
      expect(res.body.length).to.equal(4);
    });

    it("should return comments filtered by Enneagram type", async () => {
      const res = await chai
        .request(app)
        .get("/api/comments")
        .query({ q: "enneagram" });

      expect(res).to.have.status(200);
      expect(res).to.be.json;
      expect(res.body).to.be.an("array");
      expect(res.body.length).to.equal(4);
    });

    it("should return comments filtered by Zodiac sign", async () => {
      const res = await chai
        .request(app)
        .get("/api/comments")
        .query({ q: "zodiac" });

      expect(res).to.have.status(200);
      expect(res).to.be.json;
      expect(res.body).to.be.an("array");
      expect(res.body.length).to.equal(4);
    });

    it("should return an error for invalid query type", async () => {
      const res = await chai
        .request(app)
        .get("/api/comments")
        .query({ q: "invalid" });

      expect(res).to.have.status(400);
      expect(res).to.be.json;
      expect(res.body).to.have.property("error", "Invalid query type");
    });
  });
});
