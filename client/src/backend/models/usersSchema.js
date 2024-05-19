const mongoose = require ('mongoose')              // connect to database

const userSchema = new mongoose.Schema({


    // First Name (String) : Required field
    fname: { type: String, required: true },

    // Middle Name (String) : Optional field
    mname: { type: String, required: false },

    // Last Name (String) : Required field
    lname: { type: String, required: true },

    // Email (String) : Required field
    email: { type: String, required: true },

    // Password (String) : Required
    password: { type: String, required: true },

    //User Type (String) : Pre-set (not a field) 
    userType: { type: String, default: "customer"},

    //Shopping Cart (Array) : Pre-set
    shoppingCart: {type: Array, default: []}

    //for admin
    //isAdmin : {type: Boolean, default: false}
})

const User = mongoose.model('users', userSchema)         // basket (basically putting all schema here)

module.exports = User