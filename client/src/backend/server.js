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
    try {
        // Fetch users and products
        const users = await User.find();
        const products = await Product.find();

        // Extract sorting parameters from the request query
        const { sortKey, sortOrder } = req.query;

        // Sort products based on the provided key and order
        if (sortKey && sortOrder) {
            products.sort((a, b) => {

                //if it is currently ascending, make it descending
                if (sortOrder === 'ascending') {
                    return a[sortKey] < b[sortKey] ? -1 : a[sortKey] > b[sortKey] ? 1 : 0;
                } 
                
                //if it is currently descending, make it ascending
                else {
                    return a[sortKey] > b[sortKey] ? -1 : a[sortKey] < b[sortKey] ? 1 : 0;
                }
            });
        }

        // Return the sorted products and users
        res.status(201).json({ products: products, users: users });
    } catch (error) {
        res.status(500).json({ error: 'Unable to get products' });
    }
});

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
        const user = await User.findOne({_id: new ObjectId(userID)})
        //method 0 is remove from cart, method 1 is checkout
        if(method === 0){ //remove from cart
            

            for(let i =0; i<user.shoppingCart.length; i++){
                if(product.productID === user.shoppingCart[i].productID){
                    user.shoppingCart.splice(i, 1)
                }
            }

            await User.updateOne({_id:new ObjectId(userID)}, {$set:{shoppingCart: user.shoppingCart}}) 
            res.status(201).json({ message: 'Product removed successfully!' })
        }
        else if(method ===1){ //checkout

            //drops all indexes in ordertransactions database to remove all implicit properties like unique properties (aside from _id)
            //for (foreign) attributes/keys like userID from User 
            //NOTE: transactionID is not affected since it is created programatically and is inherently unique
            OrderTransaction.collection.dropIndexes(); 

            const inventory = await Product.find();
            var finalCart = []
            var checkedOut = [] //stores product names of items that were sucessfully checked out
            var insuffStock = [] //stores products names of items that does not have enough stock to be checked out by customer


            for(let i =0; i<products.length; i++){ //for cart loop
                for(let j=0; j<inventory.length; j++){ //for inventory loop
                    if(products[i].productID === inventory[j].productID){
                        if(products[i].orderQuantity > inventory[j].productQuantity){
                            insuffStock.push(inventory[j].productName)
                            
                            break
                        }
                        else{
                            finalCart.push(products[i])
                            checkedOut.push(inventory[j].productName)
                            user.shoppingCart.splice(i, 1)
                            break
                        }
                    }
                }
            }
            console.log(finalCart)
            const newOrderTransaction = new OrderTransaction({ //create new ordertransction object 
                transactionID: transactionID,
                products: finalCart, //products are inside an array, the customer can checkout multiple products in a single transaction 
                userID: new mongoose.Types.ObjectId(userID),
                email: email,
                address: address,
                dateOrdered: dateOrdered,
                time: time
            });
            await newOrderTransaction.save(); //save to database
            console.log("DONE1")
            await User.updateOne({_id: new ObjectId(userID)}, {$set: {shoppingCart:user.shoppingCart}}) //clears items from user's shopping cart
            console.log("DONE2")
            res.status(201).json({ checkedout: checkedOut, insuffstock: insuffStock});
            
        }
        else if(method === 3){ //decrease item on cart
            const user = await User.findOne({_id: new ObjectId(userID)})

            for(let i =0; i<user.shoppingCart.length; i++){
                if(product.productID === user.shoppingCart[i].productID){
                    user.shoppingCart[i].orderQuantity--
                }
            }

            await User.updateOne({_id:new ObjectId(userID)}, {$set:{shoppingCart: user.shoppingCart}}) 
        }
        else if(method === 4){ //increase item on cart
            const user = await User.findOne({_id: new ObjectId(userID)})

            for(let i =0; i<user.shoppingCart.length; i++){
                if(product.productID === user.shoppingCart[i].productID){
                    user.shoppingCart[i].orderQuantity++
                }
            }

            await User.updateOne({_id:new ObjectId(userID)}, {$set:{shoppingCart: user.shoppingCart}}) 
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

app.post('/manage-orders/cancel', async (req, res) => {
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
        res.status(201).json({message:"Order successfully canceled!"});
    }
    catch(error){
        res.status(500).json({error: 'Sorry, a problem was encountered while fetching customer data.'});
    }
})

app.get('/profile', async (req, res) => {
    const token = req.query['token'] //fetches token from req query
    try{
        const user = await User.findOne({_id: new ObjectId(jwtDecode.jwtDecode(token).userId)}) //finds user in user collection from database
        res.status(201).json({user:user}); //sends back user
    }
    catch(error){
        res.status(500).json({error: 'Error loading customer information'});
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



// minus (7 days, 1 month, 1 year) sa current date para dynamically makuha yung week, moth, year based on the current date
// ex: endDate: May 25, 2024
// startDate: May 25, 2024 - 7 days = May 18, 2024


app.get('/sales-report', async (req, res) => {
    try {
        const { period } = req.query; // get period parameter

        let startDate;
        const endDate = new Date();

        switch (period) {
            case 'weekly':
                startDate = new Date();
                startDate.setDate(startDate.getDate() - 7); // start date 7 days ago
                break;
            case 'monthly':
                startDate = new Date();
                startDate.setMonth(startDate.getMonth() - 1); // 1 month ago
                break;
            case 'annually':
                startDate = new Date();
                startDate.setFullYear(startDate.getFullYear() - 1); // year ago
                break;
            default:
                return res.status(400).json({ error: 'Invalid period' });
        }

        // find orders within the specified period
        //eturn documents where the dateOrdered field falls within the range specified by startDate and endDate, inclusive
        //https://www.mongodb.com/docs/manual/reference/operator/aggregation/lte/?_ga=2.50509613.563976201.1717137121-2111162040.1715173572
        const orders = await OrderTransaction.find({
            dateOrdered: { $gte: startDate, $lte: endDate }
            //$gte >= $lte <=
        });

        const productSales = {}; // will hold object of sold products
        let totalSales = 0; // handler for total sales

        // iterate through orders and their products
        for (const order of orders) {
            for (const product of order.products) {
                if (product.orderStatus === 1) { // only include completed orders
                    // get product details
                    const productDetails = await Product.findOne({ productID: product.productID });
                    if (productDetails) { // if product detailes exist
                        if (!productSales[product.productID]) { // if the product id is not yet on the product sales
                            productSales[product.productID] = { // add it
                                productID: productDetails.productID,
                                productName: productDetails.productName,
                                productPrice: productDetails.productPrice,
                                totalQuantitySold: 0,
                                totalIncome: 0
                            };
                        }

                        //else product id already in the productSales object then update
                        productSales[product.productID].totalQuantitySold += product.orderQuantity;
                        const productIncome = product.orderQuantity * productDetails.productPrice;
                        productSales[product.productID].totalIncome += productIncome;
                        totalSales += productIncome;
                    }
                }
            }
        }
        

        //object where all infor such as product sales and total sales is stored
        const salesData = {
            products: Object.values(productSales),
            totalSales
        };

        res.status(200).json(salesData);
    } catch (error) {
        console.error(error); //debug
        res.status(500).json({ error: 'Unable to generate sales report' });
    }
});
  


//fetch orders
app.get('/orders', async (req, res) => {
    try {
        const { period } = req.query; // period as parameter string

        let startDate;
        const endDate = new Date(); // end date is current date

        switch (period) {
            case 'weekly':
                startDate = new Date();
                startDate.setDate(startDate.getDate() - 7);
                break;
            case 'monthly':
                startDate = new Date();
                startDate.setMonth(startDate.getMonth() - 1);
                break;
            case 'annually':
                startDate = new Date();
                startDate.setFullYear(startDate.getFullYear() - 1);
                break;
            default:
                return res.status(400).json({ error: 'Invalid period' });
        }

        // find orders within the specified period and with status '1'
        const orders = await OrderTransaction.find({
            dateOrdered: { $gte: startDate, $lte: endDate }
        });


        //send data of order for it to display
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ error: 'Unable to fetch orders' });
    }
});


  


  