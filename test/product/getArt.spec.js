/* eslint-disable no-underscore-dangle */
const mongoose = require('mongoose');
const request = require('supertest');

const ProductModel = require('../../models/product');
const server = require('../../api/routes/index');
const { connectDB, disconnectDB, createUser, cleanDB, userData, getUser } = require('../db');
const { generateToken } = require('../../api/helpers/jwt');

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

  xdescribe('Product route', () => {
    it('[GET /art/selling/:userId] - should return 401 because token was not provided', async done => {
      const expectedStatusCode = 401;
      const response = await request(server).get('/art/selling/1234');
      expect(response.status).toEqual(expectedStatusCode);
      done();
    });
  });

  describe('Pending ArtCollection', () => {
    it('should return an empty art', async (done) =>{
      const userInfo = await getUser();
      const token = await generateToken(userInfo);
      const response = await request(server).get(`/art/selling/${userInfo._id}?status=pending`)
        .set("authorization", token)
      expect(response.status).toBe(200)
      expect(response.body).toBe('No products for sale')
      done()
    })
  })

  afterAll(() => {
    return disconnectDB();
  });
});
