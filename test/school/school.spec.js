/* eslint-disable no-underscore-dangle */
const request = require("supertest");
const { Transaction, User } = require("../../models/index");
const server = require("../../api/routes/index");
const {
  connectDB,
  cleanDB,
  getBuyer,
  createUser,
  createProduct,
  getUser,
  getProduct,
  createTransaction,
  getTransaction,
  createOrders,
  disconnectDB,
  createUser2,
  getUser2
} = require("../db");

const { generateToken } = require("../../api/helpers/jwt");

describe("test for Schoolart endpoint", () => {
  beforeAll(() => {
    return connectDB();
  });

  beforeEach(async () => {
    const school = await createUser();
    const buyerInfo = await getBuyer();
    const product = await createProduct();
    const transaction = await createTransaction();
    const buyer = await createUser2();
    return school && buyerInfo && product && transaction && buyer;
  });

  afterEach(() => {
    return cleanDB();
  });
  afterAll(() => {
    return disconnectDB();
  });

  describe("Get /schools", () => {
    it("Return all schools", async done => {
      const userInfo = await getUser();
      const buyerInfo = await getBuyer();
      const token = await generateToken(buyerInfo);
      const response = await request(server)
        .get("/schools")
        .set("authorization", token);

      expect(response.status).toBe(200);
      done();
    });
  });
  describe("Get /schools", () => {
    it("Should return invalid token", async done => {
      const buyer = "1233444444444";
      const token = await generateToken(buyer);
      const response = await request(server)
        .get("/schools")
        .set("authorization", token);

      expect(response.status).toBe(401);
      expect(response.body).toBe("invalid user token");
      done();
    });
  });

  describe("Get /schools/location", () => {
    it("Return all schools", async done => {
      const userInfo = await getUser2();
      const token = await generateToken(userInfo);
      const response = await request(server)
        .get(`/schools/location`)
        .set("authorization", token);
      

      expect(response.status).toBe(200);
      done();
    });
  });
});
