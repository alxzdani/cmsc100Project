const mongoose = require ('mongoose') 

const productSchema = new mongoose.Schema({
    //Product ID (String) : required field
    productId: {type: String, required: true},

    //Product Name (String) : required field
    productName: {type: String, required: true},

    //Product Description (String) : required field
    productDesc: {type: String, required: true},

    //Product Type (int)( 1 = Crop, 2 = Poultry ) : required field
    productType: {type: String, required: true},

    //Product Quantity (int) : required field
    productQuantity: {type: String, required: true},

})

const Product = mongoose.model('Product', productSchema);

module.exports = Product;