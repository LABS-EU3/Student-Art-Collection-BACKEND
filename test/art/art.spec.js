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
  disconnectDB
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
    return school && buyerInfo && product && transaction;
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
        .set("authorization", token);

      expect(response.status).toBe(401);
      done();
    });
  });

  describe("Mark Art as collected", () => {
    it("Should return sucess", async done => {
      try {
        const schoolInfo = await getUser();
        const retrieveTransaction = await getTransaction();
        const orders = await createOrders();
        const token = await generateToken(schoolInfo);
        const response = await request(server)
          .get(`/profile/mark/${retrieveTransaction.id}`)
          .set("authorization", token);
        expect(orders.status).toBe("pending");
        expect(retrieveTransaction.totalAmount).toBe(100);
        expect(response.status).toBe(200);
      } catch (error) {
        console.error(error)
        expect(error).toHaveProperty("status", 500);
      } finally {
        done();
      }
    });
  });
  describe("PUT/art/quantity/:id", () => {
    it("should reduce art quantity", async done => {
      try {
        const schoolInfo = await getUser();
        const retrieveProduct = await getProduct();
        const token = await generateToken(schoolInfo);
        const response = await request(server)
          .put(`/art/quantity/${retrieveProduct.id}`)
          .set("authorization", token);

        expect(response.status).toBe(200);
      } catch (error) {
        expect(error).toHaveProperty("status", 404);
      } finally {
        done();
      }
    });
  });

  describe("DELETE/art/product/:id", () => {
    it("should not delete the art if in transaction schema", async done => {
      try {
        const schoolInfo = await getUser();
        const retrieveProduct = await getProduct();
        const token = await generateToken(schoolInfo);
        const response = await request(server)
          .delete(`/art/product/${retrieveProduct.id}`)
          .set("authorization", token);
        expect(response.status).toBe(403);
      } catch (error) {
        expect(error).toHaveProperty("status", 500);
      } finally {
        done();
      }
    });
  });

  describe("PUT/edit/:id", () => {
    it("should not edit art if body is missing", async done => {
      try {
        const schoolInfo = await getUser();
        const retrieveProduct = await getProduct();
        const token = await generateToken(schoolInfo);
        const response = await request(server)
          .put(`/art/edit/${retrieveProduct.id}`)
          .set("authorization", token).send({});
        expect(response.status).toBe(400);
      } catch (error) {
        expect(error).toHaveProperty("status", 500);
      } finally {
        done();
      }
    });
  });
  describe("PUT/edit/:id", () => {
    it("should edit art and return success", async done => {
      try {
        const schoolInfo = await getUser();
        const retrieveProduct = await getProduct();
        const token = await generateToken(schoolInfo);
        const response = await request(server)
          .put(`/art/edit/${retrieveProduct.id}`)
          .set("authorization", token).send({
            name: 'art',
            height: 30,
            width: 30,
            quantity: 3,
            artistName: 'John doe',
            description: 'A very beautiful art',
            price: 500000,
            public_picture_id: '12345',
            picture: '123456'
          });
        expect(response.status).toBe(200);
      } catch (error) {
        expect(error).toHaveProperty("status", 500);
      } finally {
        done();
      }
    });
  });
});
