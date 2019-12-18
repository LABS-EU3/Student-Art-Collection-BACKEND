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
  beforeAll(() => connectDB());

  it("create & save user successfully", async () => {
    const validUser = new UserModel(userData);
    const savedUser = await validUser.save();

    // eslint-disable-next-line no-underscore-dangle
    expect(savedUser._id).toBeDefined();
    expect(savedUser.email).toBe(userData.email);
   
  });

  // it('insert user successfully, but the field does not defined in schema should be undefined', async () => {
  //     // eslint-disable-next-line no-underscore-dangle
  //     const userWithInvalidField = new UserModel({ name: 'TekLoon', password: '1234567890', username: 'john', email: 'john@gmail.com', type: 'school'});
  //     const savedUserWithInvalidField = await userWithInvalidField.save();
  //     // eslint-disable-next-line no-underscore-dangle
  //     expect(savedUserWithInvalidField._id).toBeDefined();
  //     expect(savedUserWithInvalidField.nickkname).toBeUndefined();
  // });

  it("create user without required field should failed", async () => {
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
  });
  describe("Users route", () => {
    it("[POST /signup] - should return 400 because body was not provided", async () => {
      const expectedStatusCode = 400;

      const response = await request(server).post("/signup");
      expect(response.status).toEqual(expectedStatusCode);
    });

    // it("[POST /signup] - should return 201 because request was successful", async () => {
    //   const expectedStatusCode = 201;

    //   const response = await request(server)
    //     .post("/signup")
    //     .send({ username: "john", password: 123456 });
    //   expect(response.status).toEqual(expectedStatusCode);
    //   expect(response.body.status).toEqual("success");
    //   expect(response.body.message).toEqual("User created successfully");
    // });
  });

  afterAll(() => {
    return cleanDB();
  });
});
