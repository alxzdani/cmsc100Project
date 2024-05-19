const express = require ('express')                 // set up server
const mongoose = require ('mongoose')              // connect to database
const cors = require ('cors')                      // help minimize error
const bodyParser = require('body-parser')          // pars data to jason
const bcrypt = require('bcrypt')                   // hash password
const jwt = require('jsonwebtoken')                // session token
const multer = require('multer')
const User = require('./models/usersSchema')
const Product = require('./models/productSchema')
const { jwtDecode } = require('jwt-decode')
const ObjectId = require('mongodb').ObjectId;

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

