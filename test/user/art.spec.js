const request = require("supertest");
const { Transaction, User } = require("../../models/index");
const server = require("../../api/routes/index");
const {
  connectDB,
  cleanDB,
  userData,
  createUser,
  getUser,
  disconnectDB
} = require("../db");
const mail = require("../../api/helpers/mail");

const { generateToken } = require("../../api/helpers/jwt");

describe("test for Schoolart endpoint", () => {
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

  describe("Get /profile/mark", () => {
    it("Transaction not found", async done => {
      const userInfo = await getUser();
      const token = await generateToken(userInfo);
      const response = await request(server)
        .get("/profile/mark")
        .send({ token });

      expect(response.status).toBe(401);
      done();
    });
  });
});
