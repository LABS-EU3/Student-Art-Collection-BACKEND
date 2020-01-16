const mongoose = require("mongoose");
const request = require("supertest");
const path = require("path");

const UserModel = require("../../models/user");
const server = require("../../api/routes/index");
const {
  connectDB,
  cleanDB,
  userData,
  createUser,
  getUser,
  disconnectDB
} = require("../db");
const { generateToken } = require("../../api/helpers/jwt");

describe("test for user endpoint", () => {
  beforeAll(() => {
    return connectDB();
  });

  beforeEach(() => {
    return createUser();
  });

  afterEach(() => {
    return cleanDB();
  });
  afterAll(() => {
    return disconnectDB();
  });

  describe("GET /selling/:id", () => {
    it("should receive images", async done => {
      try {
        const userInfo = await getUser();
        const token = await generateToken(userInfo);
        const user = await request(server)
          .get(`/selling/${userInfo.id}`)
          .set("authorization", token)
        expect(user.status).toBe(200);
      } catch (err) {
        expect(err).toHaveProperty("status", 500);
      } finally {
        done();
      }
    });
  });
});
