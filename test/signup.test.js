const mongoose = require("mongoose");
const request = require("supertest");
const UserModel = require("../models/user");
const server = require("../api/routes/index");



const userData = {
  name: "Oloruntobi",
  email: "Male@gmail.com",
  password: "123456789",
  type: "school"
};
const { connectDB, cleanDB } = require("./db");

describe("User Model Test", () => {
  beforeAll((done) => {
    connectDB()
    done()
  });
describe('', () => {

  it("create & save user successfully", async (done) => {
    try {
      const savedUser = await UserModel.create(userData)
      // eslint-disable-next-line no-underscore-dangle
      expect(savedUser._id).toBeDefined();
      expect(savedUser.email).toBe(userData.email);
    } catch (error) {
      expect(error).toBe(error)
    }finally{
      done()
    }
  });

  it("create user without required field should failed", async (done) => {
    const userWithoutRequiredField = new UserModel({ name: "TekLoon" });
    let err;
    try {
      const savedUserWithoutRequiredField = await userWithoutRequiredField.save();
      err = savedUserWithoutRequiredField;
    } catch (error) {
      err = error;
    }
    expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
    expect(err.errors.email).toBeDefined();
    done()
  });
})
  describe("Users route", () => {
    it("[POST /signup] - should return 400 because body was not provided", async (done) => {
      const expectedStatusCode = 400;

      const response = await request(server).post("/signup");
      expect(response.status).toEqual(expectedStatusCode);
      done()
    });

    it("[POST /signup] - should return 400 because name was not provided", async (done) => {
      const expectedStatusCode = 400;
      try {
        const response = await request(server).post("/signup")
          .send({  password: 12345678, type:'school',email:"test@gmail.com" });;
        expect(response.status).toEqual(expectedStatusCode);
        expect(response.body).toBe({ name: [ 'The name field is required.' ] })
      } catch (error) {
        expect(error).toBe(error)
      }finally{
          done()
      }
      
    });
    it("[POST /signup] - should return 201 because request was successful", async (done) => {
      const expectedStatusCode = 201;
      try {
        const response = await request(server)
          .post("/signup")
          .send({ name: "john", password: 12345678, type:'school',email:"test@gmail.com" });
          expect(response.status).toEqual(expectedStatusCode);
          expect(response.body.status).toEqual("success");
          expect(response.body.message).toEqual("User created successfully");
      } catch (error) {
        expect(error).toBe(error)
      } finally {
        done()
      }
    });
  });

  afterAll(() => {
    return cleanDB();
  });
});
