const request = require("supertest");

const server = require("../../api/routes/index");
const passwordResetMail  = require("../../api/helpers/ResetPassword");
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

  describe("POST email", () => {
    it("Return email is invalid", async done => {
      const userInfo = await getUser();

      const response = await request(server)
        .post("/resetpassword")
        .send({});

      expect(response.status).toBe(400);
      expect(response.body).toBe("Input a valid email");
      done();
    });
  });

  describe("POST email", () => {
    it("Return email not found", async done => {
      const userInfo = await getUser();

      const response = await request(server)
        .post("/resetpassword")
        .send({
          email: "abg@gmail.com"
        });

      expect(response.status).toBe(404);
      expect(response.body).toBe("User not found");
      done();
    });
  });

  it("[POST /signup] - should return 201 because request was successful", async done => {
    const expectedStatusCode = 200;
    jest
      .spyOn(passwordResetMail, "passwordResetMail")
      .mockResolvedValue({ success: true });
    try {
      const response = await request(server)
        .post("/resetpassword")
        .send({
          email: "user1000@gmail.com"
        });
      expect(response.status).toEqual(expectedStatusCode);
      expect(response.body).toBe("Email sent to user1000@gmail.com");
    } catch (error) {
      expect(error).toHaveProperty("status", 500);
    } finally {
      done();
    }
  });

  describe("POST reset password", () => {
    it("Return password is invalid", async done => {
      const response = await request(server)
        .patch("/newpassword")
        .send({
          password: "12"
        });

      expect(response.status).toBe(400);
      expect(response.body).toBe("Password must be at least 8 characters");
      done();
    });
  });
});
