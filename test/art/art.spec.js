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
  
    const school = await createUser()
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
         .set("authorization", token)

       expect(response.status).toBe(401);
       done();
     });
   });


describe('Mark Art as collected', () => {
  it("Should return sucess", async done => {
    try {
      const schoolInfo = await getUser();
      const retrieveTransaction = await getTransaction();
      const orders = await createOrders();
      const token = await generateToken(schoolInfo);
        const response = await request(server)
          .get(`/profile/mark/${retrieveTransaction.id}`)
          .set("authorization", token)
      expect(orders.status).toBe('pending');
      expect(retrieveTransaction.totalAmount).toBe(100);
      expect(response.status).toBe(200)
    }catch(error) {
      expect(error).toHaveProperty('status',500)
    }finally {
      done()
  }
    })
})

});