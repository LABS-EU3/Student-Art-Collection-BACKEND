const request = require('supertest');
const UserModel = require('../../models/user');
const ProductModel = require('../../models/product');
const server = require('../../api/routes/index');
const {
  connectDB,
  disconnectDB,
  cleanDB,
  createUser,
  getUser
} = require('../db');

const createProduct = async () => {
  const artData1 = {
    name: 'art1',
    height: 30,
    width: 30,
    quantity: 3,
    artistName: 'John bellion',
    description: 'A very beautiful art',
    price: 299,
    userId: await (await getUser()).id,
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
    userId: await (await getUser()).id,
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
    userId: await (await getUser()).id,
    public_picture_id: '12345',
    picture: '123456'
  };
  const newArt3 = await ProductModel.create(artData3);
  const newArt1 = await ProductModel.create(artData1);
  const newArt2 = await ProductModel.create(artData2);
  return newArt3 && newArt1 && newArt2;
};

describe('search art unit', () => {
  beforeAll(() => {
    return connectDB();
  });

  beforeEach(async () => {
    const user = await createUser();
    const product = await createProduct();
    return user && product;
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
      expect(response.body.art[0].name).toBe('art2');
      expect(response.body.art[2].name).toBe('art3');
      done();
    });
    it('returns 404 when an invalid sortby value is passed', async done => {
      const response = await request(server).get('/art/search?sortBy=lala');
      expect(response.status).toBe(404);
      done();
    });
  });
});