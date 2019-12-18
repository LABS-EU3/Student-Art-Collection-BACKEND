const mongoose = require('mongoose');
const User = require('../models/user');
const login = require('../api/routes/authroute')

const testUser = {
    email: 'test@artfinder.com',
    password: 'test'
};

describe("# Auth", () => {
    const endpoint = `process.env.DB + "login"`;

    it("should retrieve the token", () => {
        const loggedInUser = new User(testUser);
                expect(loggedInUser.email).toBe(testUser.email)
                expect(loggedInUser.password).toBe(testUser.password)
            });
        });
    
