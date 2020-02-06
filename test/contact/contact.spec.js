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
  describe("POST /CONTACTUS", () => {
    it("Return validation error", async done => {
      const response = await request(server)
        .post("/contact/contactus")
        .send({});

      expect(response.status).toBe(400);

      expect(response.body).toBe("Please ensure all fields are present.");
      done();
    });
  });
  describe("POST /CONTACTUS", () => {
    it("Returns success messsage", async done => {
      try {
        const response = await request(server)
          .post("/contact/contactus")
          .send({
            name: "usertest",
            message: "All good here",
            email: "usetest@gmail.com"
          });

        expect(response.status).toBe(200);

        expect(response.body).toBe("Message sent! ");
      } catch (error) {
        expect(error).toHaveProperty("status", 500);
        expect(error.message).toBe("Error sending mail tryagain");
      } finally {
        done();
      }
    });
  });
});
