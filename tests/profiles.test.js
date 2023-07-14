"use strict";

const chai = require("chai");
const chaiHttp = require("chai-http");
const Profile = require("../models/profile");
const app = require("../app");

const expect = chai.expect;

chai.use(chaiHttp);

process.env.NODE_ENV = "test";

const validProfile = {
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
  image: "https://placebeard.it/640x360",
};

const invalidProfile = {
  // Missing required fields
};

describe("Profile API", () => {
  beforeEach(async () => {
    // Clear the database before each test
    await Profile.deleteMany({});
  });

  describe("GET /profile/:id", () => {
    it("should render the profile_template with the profile data", async () => {
      const newProfile = new Profile(validProfile);
      const savedProfile = await newProfile.save();
      const profileId = savedProfile._id.toString();

      const res = await chai.request(app).get(`/profile/${profileId}`);

      expect(res).to.have.status(200);
      expect(res).to.be.html;
    });

    it("should return an error when an invalid ID is provided", async () => {
      const invalidId = "invalid";

      const res = await chai.request(app).get(`/profile/${invalidId}`);

      expect(res).to.have.status(400);
      expect(res.text).to.equal('{"error":"Invalid profile ID"}');
    });

    it("should return an error when a valid ID is not found", async () => {
      const nonExistentId = "64b079c721cc37495bbf699e"; // Replace with a non-existent profile ID

      const res = await chai.request(app).get(`/profile/${nonExistentId}`);

      expect(res).to.have.status(404);
      expect(res.text).to.equal('{"error":"Profile not found"}');
    });

    describe("POST /create_profile", () => {
      it("should create a new profile and return it", async () => {
        const res = await chai
          .request(app)
          .post("/create_profile")
          .send(validProfile);

        expect(res).to.have.status(201);
        expect(res.body).to.be.an("object");
        expect(res.body.name).to.equal("John Doe");
        expect(res.body.description).to.equal("Lorem ipsum dolor sit amet");
        expect(res.body.mbti).to.equal("INTJ");
        expect(res.body.enneagram).to.equal("5w6");
        expect(res.body.variant).to.equal("Social");
        expect(res.body.tritype).to.equal(531);
        expect(res.body.socionics).to.equal("ILE");
        expect(res.body.sloan).to.equal("RLOAI");
        expect(res.body.psyche).to.equal("Introverted Thinking");
        expect(res.body.temperaments).to.equal("NT");
        expect(res.body.image).to.equal("https://placebeard.it/640x360");
      });
    });

    it("should return an error when required fields are missing", async () => {
      const res = await chai
        .request(app)
        .post("/create_profile")
        .send(invalidProfile);

      expect(res).to.have.status(400);
      expect(res.body)
        .to.have.property("error")
        .that.equals("Failed to create profile");
    });
  });
});
