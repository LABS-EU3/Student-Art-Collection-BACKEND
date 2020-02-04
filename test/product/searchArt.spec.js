const request = require('supertest');
const server = require('../../api/routes/index');
const {
  connectDB,
  disconnectDB,
  cleanDB,
  createProduct,
  getProduct,
  getUser,
  createUser
} = require('../db');

describe('search art unit testing', () => {
  beforeAll(() => {
    return connectDB();
  });

  beforeEach(async () => {
    const school = await createUser();
    const product = await createProduct();
    return school && product;
  });

  afterEach(() => {
    return cleanDB();
  });

  afterAll(() => {
    return disconnectDB();
  });

  describe('', () => {
    xit('returns the product in the database when we call the searchArt endpoint', async done => {
      const art = await getProduct();
      const school = await getUser();
      const response = await request(server).get(
        '/art/search?searchQuery=&filter=name&sortBy=name'
      );
      const fetchedArt = response.body.art[0];
      expect(response.status).toBe(200);
      expect(fetchedArt.name).toBe(art.name);
      // eslint-disable-next-line no-underscore-dangle
      // expect(fetchedArt.userId).toMatch(school._id.toString());
      done();
    });
  });
});
