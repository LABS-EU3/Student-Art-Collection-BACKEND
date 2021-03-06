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
const mail = require("../../api/helpers/mail");
const cloudinary = require("../../api/middleware/cloudinary");
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

  describe("POST /uploade/:id", () => {
    it("should upload a user photo", async done => {
      jest.setTimeout(40000);
      jest
        .spyOn(cloudinary, "uploadImage")
        .mockResolvedValue({ success: true });
      // eslint-disable-next-line no-underscore-dangle
      try {
        const userInfo = await getUser();
        const token = await generateToken(userInfo);
        const user = await request(server)
          .post(`/upload/${userInfo.id}`)
          .set("authorization", token)
          .set("Content-Type", "multipart/form-data")
          .attach("image", path.join(__dirname, "assests/image.png"));
        expect(user.body.profile_picture).toBeDefined();
        expect(user.status).toBe(200);
      } catch (err) {
        console.log(err);
        expect(err).toHaveProperty("status", 500);
      } finally {
        done();
      }
    });
  });

  describe("GET /profile/:id", () => {
    it("should return return 401 if user dont match token", async done => {
      try {
        const userInfo = await getUser();
        const token = await generateToken(userInfo);
        const response = await request(server)
          .get("/profile/1234567")
          .set("authorization", token);
        expect(response.body).toBe("you cannot continue with this operation");
        expect(response.status).toBe(401);
      } catch (error) {
        expect(error).toHaveProperty("status", 500);
      } finally {
        done();
      }
    });
  });
});
