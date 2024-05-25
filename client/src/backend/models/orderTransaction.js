const mongoose = require('mongoose');


//schema for orders of the customer
const orderProductSchema = new mongoose.Schema({

    //ARRAY BECAUSE pwedeng maraming order ang customer
    productID: { type: String, required: true },

    // enum: [] ensures that only valid input is stored
    // 0 - pending
    // 1 - completed
    // 2 - cancelled
    orderStatus: { type: Number, required: true, enum: [0, 1, 2] }, // Individual order status for each product
    orderQuantity: { type: Number, required: true },

});


const orderTransactionSchema = new mongoose.Schema({
    //you can use https://www.npmjs.com/package/uuid for generating unique transaction ID
    transactionID: { type: String, required: true, unique: true },

    modeOfTransaction: { type: String, default: "COD"},


    products: [orderProductSchema], // Array of products with their order status

    
    // use the ObjectID of the user for unique reference
    // then use this to filter out specific order for the user since email is not unique
    userID: { type: String, required: true, unique:false },

    email: { type: String, required: true },

    address: { type: String, required: true },

    dateOrdered: { type: Date, required: true },

    time: { type: String, required: true }
});

const OrderProduct = mongoose.model('OrderProduct', orderProductSchema);
const OrderTransaction = mongoose.model('OrderTransaction', orderTransactionSchema);

module.exports = {OrderTransaction, OrderProduct};
