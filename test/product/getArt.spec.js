const request = require("supertest");
const UserModel = require("../../models/user");
const server = require("../../api/routes/index");
const { connectDB, cleanDB, userData, createUser, disconnectDB } = require("../db");
const mail = require('../../api/helpers/mail'); 

describe("# Art", () => {
    beforeAll( () =>{
        return connectDB();
    });

    beforeEach( () =>{
        return createUser()
    })

    afterEach(() =>{
        return cleanDB()
    })

    afterAll(() =>{
        return disconnectDB()
    });

    describe("/login", () => {

        it('should return a 200 if user exists', async (done) =>{
            jest.spyOn(mail,"sendEmailConfirmAccount").mockResolvedValue({ success: true });
            try {
                const user = await request(server).post('/login')
                    .send(userData)
                expect(user.status).toBe(200);
                expect(user.body).toHaveProperty("message", 'please check your email address to confirm account')
                done()
            } catch (error) {
                expect(error).toHaveProperty('status',500)
            }finally{
                done()
            }
        })
    })
})