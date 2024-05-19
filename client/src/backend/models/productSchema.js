const mongoose = require ('mongoose') 

const productSchema = new mongoose.Schema({
    //Product ID (String) : required field
    productID: {type: String, required: true},

    //Product Name (String) : required field
    productName: {type: String, required: true},

    //Product Description (String) : required field
    productDesc: {type: String, required: true},

    productPrice: {type: Number, required: true},

    //Product Type (int)( 1 = Crop, 2 = Poultry ) : required field
    productType: {type: Number, required: true},

    //Product Quantity (int) : required field
    productQuantity: {type: Number, required: true},

    //image
    productImage: {type: String, default: " ", required: true}

})

const Product = mongoose.model('products', productSchema);

module.exports = Product;