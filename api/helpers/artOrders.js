module.exports = {
    async getArtSold(model, req, field, userType) {
        const {status} = req.query;
        let schoolOrders = null;
        if(status === 'all') {
            schoolOrders = await  model.find(field)
            .populate({
              path: 'transactionId',
              populate : {
                path: 'productId'
              }
            }).populate(userType).exec();
        }
            schoolOrders = await model.find({...field, status})
            .populate({
                path: 'transactionId',
                populate : {
                  path: 'productId'
                }
              }).populate(userType).exec();
        return  schoolOrders
    }
}