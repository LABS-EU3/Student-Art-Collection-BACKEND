/* eslint-disable no-underscore-dangle */
const mongoose = require('mongoose');
const request = require('supertest');

const ProductModel = require('../../models/product');
const server = require('../../api/routes/index');
const { connectDB, disconnectDB, createUser, cleanDB, userData, getUser } = require('../db');
const { generateToken } = require('../../api/helpers/jwt');

const artData = {
  name: 'art',
  height: '30',
  width: '30',
  quantity: 3,
  artistName: 'John bellion',
  description: "A very beautiful art",
  price: 299
};

describe('art model test', () => {
  beforeAll(done => {
    connectDB();
    return done();
  });

  beforeEach(() => {
    return createUser();
  });

  afterEach(() => {
    return cleanDB()
  })

  describe('', () => {
    it('creates and saves art succesfully', async done => {
      try {
        const savedArt = await ProductModel.create(artData);
        // eslint-disable-next-line no-underscore-dangle
        expect(savedArt._id).toBeDefined();
        console.log(savedArt);
        expect(savedArt.name).toBe(artData.name);
        expect(savedArt.quantity).toBe(artData.quantity);
        expect(savedArt.price).toBe(artData.price);
        expect(savedArt.status).toBe(201)
      } catch (error) {
        expect(error).toBeInstanceOf(mongoose.Error.ValidationError);
      } finally {
        done();
      }
    });
    it('should not allow art to be saved if required fields are missing', async done => {
      const artMissingFields = new ProductModel({ name: 'art' });
      let err;
      try {
        const savedArtMissingFields = await artMissingFields.save();
        err = savedArtMissingFields;
      } catch (error) {
        err = error;
      }
      expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
      expect(err.errors.price).toBeDefined();
      done();
    });
  });

  describe('Product route', () => {
    it('[POST /art/upload/:userId] - should return 401 because token was not provided', async done => {
      const expectedStatusCode = 401;
      const response = await request(server).post('/art/upload/1234');
      expect(response.status).toEqual(expectedStatusCode);
      done();
    });
  });

  describe('Pending ArtCollection', () => {
    it('should return an empty art', async (done) =>{
      const userInfo = await getUser();
      const token = await generateToken(userInfo);
      const response = await request(server).get(`/art/sold/order/pending/${userInfo._id}`)
        .set("authorization", token)
      expect(response.status).toBe(200)
      expect(response.body).toHaveLength(0)
      done()
    })
  })

  afterAll(() => {
    return disconnectDB();
  });
});
