const mongoose = require ('mongoose') 

const orderTransactionSchema = new mongoose.Schema({

    transactionID: {type: String, required: true, unique: true}, // must be unique for every transaction

    //Product ID (number) : required field
    productID: {type: Number, required: true},

    orderQuantity: {type: String, required: true, min: 0},

    // enum: [] ensures that only valid input is stored
    orderStatus: {type: Number, required: true, enum: [0,1,2]},


    // use the ObjectID of the user for unique reference
    // then use this to filter out specific order for the user since email is not unique
    userID: {type: String, required: true, unique: true},

    email: {type: String, required: true},

    dateOrdered: {type: Date, required: true},

    time: {type: String, required: true}

})

const orderTransaction = mongoose.model('Product', orderTransactionSchema);

module.exports = orderTransaction;