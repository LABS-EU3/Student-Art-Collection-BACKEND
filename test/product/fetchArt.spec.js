const request = require('supertest');
const ProductModel = require('../../models/product');
const server = require('../../api/routes/index');
const {
  connectDB,
  disconnectDB,
  cleanDB,
} = require('../db');

const createProduct = async () => {
  const user = {id: "5e24d82e4976111d3c9835c8"};
  const artData1 = {
    name: 'art1',
    height: 30,
    width: 30,
    quantity: 3,
    artistName: 'John bellion',
    description: 'A very beautiful art',
    price: 299,
    userId: user.id,
    public_picture_id: '12345',
    picture: '123456'
  };
  const artData2 = {
    name: 'art2',
    height: 30,
    width: 30,
    quantity: 3,
    artistName: 'John bellion',
    description: 'A very beautiful art',
    price: 499,
    userId: "5e24d82e4976111d3c9835c9",
    public_picture_id: '12345',
    picture: '123456'
  };
  const artData3 = {
    name: 'art3',
    height: 30,
    width: 30,
    quantity: 3,
    artistName: 'John bellion',
    description: 'A very beautiful art',
    price: 599,
    userId: "5e24d82e4976111d3c9835c0",
    public_picture_id: '12345',
    picture: '123456'
  };
  try {
    const product = await  Promise.all([ProductModel.create(artData1), ProductModel.create(artData2), ProductModel.create(artData3)]);
    return product;
    
  } catch (error) {
    console.error(error, 'error')
    return error
  }
};

describe('search art unit', () => {
  beforeAll(() => {
    return connectDB();
  });

  beforeEach( () => {
    return createProduct();
  });

  afterEach(() => {
    return cleanDB();
  });

  afterAll(() => {
    return disconnectDB();
  });
  describe('', () => {
    it('returns sorted results when passing sort desc and filter by name params', async done => {
      const response = await request(server).get(
        '/art/search?sortBy=name&sortType=desc'
      );
      expect(response.body.art[0].name).toBe('art3');
      expect(response.body.art[2].name).toBe('art1');
      done();
    });
    it('returns sorted results when passing sort asc and filter by name params', async done => {
      const response = await request(server).get(
        '/art/search?sortBy=name&sortType=asc'
      );
      expect(response.body.art[0].name).toBe('art1');
      expect(response.body.art[2].name).toBe('art3');
      done();
    });
    it('returns results sorted by id when no sortby or filter params are passed', async done => {
      const response = await request(server).get('/art/search');
      expect(response.body.art[0].name).toBe('art3');
      done();
    });
    it('returns 404 when an invalid sortby value is passed', async done => {
      const response = await request(server).get('/art/search?sortBy=lala');
      expect(response.status).toBe(404);
      done();
    });
  });
});
