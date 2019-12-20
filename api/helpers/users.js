const models = require ('../../models/user');

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
    }
};