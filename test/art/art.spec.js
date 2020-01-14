const request = require("supertest");
const { Transaction, User } = require("../../models/index");
const server = require("../../api/routes/index");
const {
  connectDB,
  cleanDB,
  userData,
  getBuyer,
  createBuyer,
  createUser,
  createProduct,
  getUser,
  createTransaction,
  getTransaction,
  createOrders,
  getOrders,
  disconnectDB
} = require("../db");
const mail = require("../../api/helpers/mail");

const { generateToken } = require("../../api/helpers/jwt");

describe("test for Schoolart endpoint", () => {
  beforeAll(() => {
    return connectDB();
  });

  beforeEach(() => {
    const a = createBuyer()
    const b = createUser()
    return a && b;
  });

  afterEach(() => {
    return cleanDB();
  });
  afterAll(() => {
    return disconnectDB();
  });

  // describe("Get /profile/mark", () => {
  //   it("Transaction not found", async done => {
  //     const userInfo = await getUser();
  //     const token = await generateToken(userInfo);
  //     const response = await request(server)
  //       .get("/profile/mark")
  //       .send({ token });

  //     expect(response.status).toBe(401);
  //     done();
  //   });
  // });


describe('Mark Art as collected', () => {
  it("Should return sucess", async done => {
    const schoolInfo = await getUser();
    const buyerInfo = await getBuyer();
    const product = await createProduct();
    const transaction = await createTransaction();
    const retrieveTransaction = await getTransaction()
    const orders = await createOrders()
    const token = await generateToken(schoolInfo);
      const response = await request(server)
        // eslint-disable-next-line no-underscore-dangle
        .get(`/profile/mark/${retrieveTransaction._id}`)
        .send({ token });
    expect(orders.status).toBe('pending');
    expect(retrieveTransaction.totalAmount).toBe(100);
    expect(response.status).toBe(200)
   
    done()

    
  })
})

});
