const express = require ('express')                 // set up server
const mongoose = require ('mongoose')              // connect to database
const cors = require ('cors')                      // help minimize error
const bodyParser = require('body-parser')          // pars data to jason
const bcrypt = require('bcrypt')                   // hash password
const jwt = require('jsonwebtoken')                // session token
const multer = require('multer')
const User = require('./models/usersSchema')
const Product = require('./models/productSchema')
const OrderTransaction = require('./models/orderTransaction').OrderTransaction
const ObjectId = require('mongodb').ObjectId;
const jwtDecode = require('jwt-decode')
const SECRET_KEY = 'secretkey'

//connect to express app
const app = express()

//connect to mongoDB
const dbURI = 'mongodb+srv://alexisdaniellieee:aEzAshDCA2pQsudY@cluster30.0h4lpvz.mongodb.net/projectDB?retryWrites=true&w=majority&appName=CLuster30'
mongoose.connect(dbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(()=> {
    app.listen(3001,  () => {
        console.log('Server is connected to 3001 and connected to MongoDB')
    })
})
.catch((error)=>{
    console.log('Unable to connect to Server and/or MongoDB')
})

//middleware
app.use(bodyParser.json())
app.use(cors());



//route post and get request

//REGISTER
//post request for putting the data of the user to db
app.post('/signup', async (req, res) => {
    try{
        const { fname, mname, lname, email, password } = req.body
        const hashedPassword = await bcrypt.hash(password, 10)
        
        // creating new user
        const newUser = new User({ fname, mname, lname, email, password: hashedPassword })
        await newUser.save()
        
        res.status(201).json({ message: 'User created successfully' })
    }
    
    catch(error){
        res.status(500).json({ error: 'Error signing up' })
    }
});

//get request for getting the info of the user

app.get('/signup', async (req, res) => {
    try{
        const users = await User.find()
        res.status(201).json(users)         // render users in json format
    }
    
    catch(error){
        res.status(500).json({ error: 'Unable to get users' })
    }
})


//LOG IN
// LOG IN post request
app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({ error: 'Invalid Credentials' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid Credentials' });
        }

        // token that follows the user around
        const token = jwt.sign({ userId: user._id, role: user.userType }, SECRET_KEY, { expiresIn: '1hr' });

        // Check usertype and redirect accordingly
        let redirectTo = '/shop';

        if (user.userType === 'admin') {
            redirectTo = '/admin-dashboard';
        }

        res.json({ message: 'Login successful', redirectTo, token, userType: user.userType });
    } catch (error) {
        res.status(500).json({ error: 'Error logging in' });
    }
});



app.get('/shop', async (req, res) => {
    try{
        //fetch users and products
        const users = await User.find() 
        const products = await Product.find()


        res.status(201).json({products:products, users:users})         // render users in json format
    }

    catch(error){
        res.status(500).json({ error: 'Unable to get products' })
    }
})

app.post('/shop', async (req, res) => {
    try{
        const { userId, shoppingCart } = req.body
        

        // update the user's shopping cart in the database
        await User.updateOne({_id: new ObjectId(userId)}, {$set: {shoppingCart:shoppingCart}})
        
        res.status(201).json({message: 'Shopping cart updated!'})
    }
    catch(error){
        res.status(500).json({ error: 'Unable to add to cart.' })
    }
})

app.get('/cart', async (req, res) => {
    const token = req.query['token'] //fetches token from req query
    try{
        const user = await User.findOne({_id: new ObjectId(jwtDecode.jwtDecode(token).userId)}) //finds user in user collection from database
        const products = await Product.find(); //fetches all products from database
        res.status(201).json({user:user, products: products}); //sends back user and product
    }
    catch(error){
        res.status(500).json({error: 'Error loading customer information'});
    }

})

app.post('/cart', async (req, res) => {
    try{
        const {method, product, transactionID, products, userID, email, address, dateOrdered, time} = req.body 
        //method 0 is remove from cart, method 1 is checkout
        if(method === 0){ //remove from cart
            const user = await User.findOne({_id: new ObjectId(userID)})

            for(let i =0; i<user.shoppingCart.length; i++){
                if(product.productID === user.shoppingCart[i].productID){
                    user.shoppingCart.splice(i, 1)
                }
            }

            await User.updateOne({_id:new ObjectId(userID)}, {$set:{shoppingCart: user.shoppingCart}}) 
        }
        else{ //checkout

            //drops all indexes in ordertransactions database to remove all implicit properties like unique properties (aside from _id)
            //for (foreign) attributes/keys like userID from User 
            //NOTE: transactionID is not affected since it is created programatically and is inherently unique
            OrderTransaction.collection.dropIndexes(); 

            const newOrderTransaction = new OrderTransaction({ //create new ordertransction object 
                transactionID: transactionID,
                products: products, //products are inside an array, the customer can checkout multiple products in a single transaction 
                userID: new mongoose.Types.ObjectId(userID),
                email: email,
                address: address,
                dateOrdered: dateOrdered,
                time: time
            });
            await newOrderTransaction.save(); //save to database
            await User.updateOne({_id: new ObjectId(userID)}, {$set: {shoppingCart:[]}}) //clears items from user's shopping cart
            res.status(201).json({ message: 'Products checked out successfully!' })
        }

    }
    catch(error){
        res.status(500).json({error: 'Sorry, a problem was encountered while checking out.'});
    }
})

app.get('/manage-orders', async (req, res) => {
    const token = req.query['token']
    const id = jwtDecode.jwtDecode(token).userId; 
    try{
        const user = await User.findOne({_id: new ObjectId(id)}) //fetches user
        const products = await Product.find(); //fetches all products from database
        const transactions = await OrderTransaction.find({userID: new ObjectId(id)}) //fetches all transactions made by the user from database
        res.status(201).json({user:user, products: products, transactions:transactions}); //sends back user, products, and transactions
    }
    catch(error){
        res.status(500).json({error: 'Sorry, a problem was encountered while fetching customer data.'});
    }

})

app.post('/manage-orders', async (req, res) => {
    const {orderProduct, transactionID} = req.body
    try{

        const transaction = await OrderTransaction.findOne({transactionID: transactionID}) //finds specific transaction where product was checked out
        for(let i =0; i<transaction.products.length; i++){ //finds the specific product from array of products in transaction
            if(transaction.products[i].productID === orderProduct.productID){
                transaction.products[i].orderStatus = 2 //once found, update the orderstatus from pending (0) to canceled (2)
                break
            }
        }//update the whole transaction record but now containing the product with updated orderstatus
        await OrderTransaction.updateOne({transactionID:transactionID}, {$set:{products:transaction.products}}) 
    }
    catch(error){

    }
})

app.put('/cart', async (req, res) => {
    try{

    }
    catch(error){
        res.status(500).json({error: 'Sorry, a problem was encountered while removing item'});
    }
})

//get all users for user management
// make sure that only admin can do it

app.get('/user-management', async (req, res) => {
    try{
        const users = await User.find({ userType: 'customer' });     // get all customer
        const userCount = await User.countDocuments({ userType: 'customer' }); // get the total of customers

        res.status(200).json({ users, total: userCount }); // on console: display users and total usercount
    } catch (error){
        res.status(500).json({ error: 'Unable to fetch users' }); // fetching failed
    }
})

// admin order fulfillment management
//fetch all orders
app.get('/order-fulfillment', async (req, res) => {
    try {
        const orders = await OrderTransaction.find();
        res.status(200).json({ orders });
    } catch (error) {
        res.status(500).json({ error: 'Unable to fetch order transactions' });
    }
});

  
app.put('/order-fulfillment/:transactionID/:productID', async (req, res) => {
    
    //extract transactonID, productID from the request url in updateOrderStatus
    const { transactionID, productID } = req.params;

    //extarct the new status that we want to update
    const { currentStatus } = req.body;
  
    try {

        //find transaction ID that matches what is on the param
        const order = await OrderTransaction.findOne({ transactionID });

        if (!order) { // if order not found
            return res.status(404).json({ error: 'Order not found' });
        }
        
        //finding the product within the order
        //call back to check if the productID of the current productID (prod.productID)
        const productIndex = order.products.findIndex(prod => prod.productID === productID);
        
        if (productIndex === -1) {//no such product found
            return res.status(404).json({ error: 'Product not found in order' });
        }
  
       // Get the original status and order quantity
       const originalStatus = order.products[productIndex].orderStatus;
       const orderQuantity = order.products[productIndex].orderQuantity;

       // update the order status
       order.products[productIndex].orderStatus = currentStatus;
       await order.save();

       // check if currentStatus is 1 meaning completed
       // and if original status is not 1 - to prevent error because we only want to update products that needs to be change
       if (currentStatus === 1 && originalStatus !== 1) {
           const product = await Product.findOne({ productID });

           if (!product) {
               return res.status(404).json({ error: 'Product not found in products collection' });
           }

           product.productQuantity -= orderQuantity;        //decrement quantity based on order quantity
           product.productSold += orderQuantity;        // add to sold

           await product.save();
       }

        res.status(200).json({ message: 'Order status updated successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Unable to update order status' });
    }
});

  