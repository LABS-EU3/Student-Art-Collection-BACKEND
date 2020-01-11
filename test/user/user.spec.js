const mongoose = require("mongoose");
const request = require("supertest");
const path = require('path')

const UserModel = require("../../models/user");
const server = require("../../api/routes/index");
const { connectDB, cleanDB, userData, createUser, getUser, disconnectDB } = require("../db");
const mail = require('../../api/helpers/mail'); 
const cloudinary = require('../../api/middleware/cloudinary');
const { generateToken } = require('../../api/helpers/jwt');

describe('test for user endpoint', () =>{
    beforeAll( () =>{
        return connectDB() 
    });

    beforeEach( () =>{
        return createUser()
    })

    afterEach( () => {
        return cleanDB() 
    })
    afterAll( () =>{
         return disconnectDB()
    });

     describe('POST /uploade/:id', () =>{
         it('should upload a user photo', async (done) =>{
             jest.setTimeout(20000);
             jest.spyOn(cloudinary,"uploadImage").mockResolvedValue({ success: true });
             // eslint-disable-next-line no-underscore-dangle
             try {
                 const userInfo = await getUser();
                 const token = await generateToken(userInfo);
                 const user = await request(server).post(`/upload/${userInfo.id}`)
                     .set("authorization", token)
                     .set('Content-Type', 'multipart/form-data')
                     .attach('image', path.join(__dirname, 'assests/image.png'))
                 expect(user.body.profile_picture).toBeDefined();
                 expect(user.status).toBe(200)
             } catch(err) {
                 expect(err).toHaveProperty('status',500)
             } finally{
                 done()
             }
         })
     });

    describe('GET /profile/:id',  () =>{
        it('should return return 401 if user dont match token', async (done)=>{
            try {
                const userInfo = await getUser();
                const token = await generateToken(userInfo);
                const response = await request(server).get('/profile/1234567')
                .set("authorization", token)
                expect(response.body).toBe("you cannot continue with this operation")
                expect(response.status).toBe(401)
            } catch (error) {
                expect(error).toHaveProperty('status',500)
            }finally {
                done()
            }
        })
    });

    it('should return the user', async (done) =>{
        try {
            const userInfo = await getUser();
            const token = await generateToken(userInfo);
            const response = await request(server).get(`/profile/${userInfo.id}`)
                .set("authorization", token)
            expect(response.status).toBe(200)
        } catch (error) {
            expect(error).toHaveProperty('status',500)
        }finally {
            done()
        }
    });

    describe('PATCH /confirm', () => {
        it('should return an error if invalid token', async(done) =>{
            const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWJqZWN0IjoiNWUxMzAxYjY4NDgyMjYwZmYzZDNjYzFlIiwiaWF0IjoxNTc4MzAzOTI2LCJleHAiOjE1Nzg3MzU5MjZ9.n3achHIHlIbL06LzZuRfT4rb-81c_90TMrZJFTpPHXx'
            const response = await request(server).patch('/confirm').send({token});
            expect(response.status).toBe(400);
            expect(response.body).toBe("invalid token for user")
            done()
        });

        it('should succesfully confirm user account', async(done) =>{
            const userInfo = await getUser();
            const token = await generateToken(userInfo);
            const response = await request(server).patch('/confirm').send({token});
            expect(response.status).toBe(200);
            done()
        })
    });

    describe('/POST/resetpassword', () =>{
        it('should return a 400 error if email field is invalid', async (done) =>{
            const response = await request(server).post('/resetpassword').send({email: 'fakeemail'});
            expect(response.status).toBe(400)
            expect(response.body).toBe("Input a valid email")
            done()
        });
        it('should return a 404 if email dont exists', async (done) =>{
            const response = await request(server).post('/resetpassword').send({email: 'fakeemail@t.com'});
            expect(response.status).toBe(404)
            expect(response.body).toBe("User not found")
            done()
        });
        it('should send an email to resend password', async(done) =>{
            const response = await request(server).post('/resetpassword').send({email: userData.email});
            expect(response.status).toBe(200)
            expect(response.body).toBe(`Email sent to ${userData.email}`)
            done()
        })
    });

    describe('/PATCH/newpassword', () => {
        it('should return a 400 if password length is below 8', async (done) =>{
            const response = await request(server).patch('/newpassword').send({password: "email"});
            expect(response.status).toBe(400)
            expect(response.body).toBe("Password must be at least 8 characters")
            done()
        });
        it('should return a 401', async(done) =>{
            const response = await request(server).patch('/newpassword?token=12werertrrrrrr').send({password: "emailingme"});
            expect(response.status).toBe(401)
            expect(response.body).toBe("Invalid token to reset password")
            done()
        })
    })
})