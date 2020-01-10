/* eslint-disable no-underscore-dangle */
const { merge } = require('lodash')
const models = require ('../../models/');

module.exports = {
    async findUserById(userId) {
        try{
            const user = await models.Users.findOne({
                where: { userId }
            });
            return user;
        }catch (error) {
            return error.message
        }
    },

    async updateCompleteUserDetails(user, req ,next, msg) {
        let updatedUser = null;
        switch(user.type) {
            case('school') : {
              updatedUser = await models.School.findOneAndUpdate({userId: user._id}, req.body, {new:true})
                .populate('user').exec()
                  return merge(user,updatedUser);
            }
            case('buyer') : {
              updatedUser = await models.Buyer.findOneAndUpdate({ userId: user._id }, req.body, {new:true})
                .populate('user').exec()
                return merge(user,updatedUser);
            }
            default : {
              return next(msg);
            }
          } 
    },

    async getCompleteUser(user, next,msg) {
        let userDetails = null;
        try {
            switch(user.type) {
                case('school') : 
                  userDetails = await models.School.findOne({userId:user._id}).populate('user').exec()
                  return merge(user,userDetails);
                case('buyer') : {
                  userDetails = await models.Buyer.findOne({userId:user._id}).populate('user').exec()
                  return  merge(user,userDetails);
                }
                default:
                  return next(msg)
            }   
        } catch (error) {
            return next(error)
        }
    }
};