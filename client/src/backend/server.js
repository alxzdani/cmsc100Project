const express = require ('express')                 // set up server
const mongoose = require ('mongoose')              // connect to database
const cors = require ('cors')                      // help minimize error
const bodyParser = require('body-parser')          // pars data to jason
const bcrypt = require('bcrypt')                   // hash password
const jwt = require('jsonwebtoken')                // session token
const User = require('./models/usersSchema')
const Product = require('./models/productSchema')

const SECRET_KEY = 'secretkey'

//connect to express app
const app = express()

//connect to mongoDB
const dbURI = 'mongodb+srv://alexisdaniellieee:aEzAshDCA2pQsudY@cluster30.0h4lpvz.mongodb.net/usersDB?retryWrites=true&w=majority&appName=CLuster30'
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
app.use(cors())

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
app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body
        const user = await User.findOne({ email })

        if (!user) {
            return res.status(401).json({ error: 'Invalid Credentials' })
        }

        const isPasswordValid = await bcrypt.compare(password, user.password)

        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid Credentials' })
        }

        //token that follows the user around
        const token = jwt.sign({ userId: user._id }, SECRET_KEY, { expiresIn: '1hr' })

        // Check usertype and redirect accordingly
        let redirectTo = '/shop'
        if (user.userType === 'admin') {
            redirectTo = '/admin-dashboard'
        }
        
        res.json({ message: 'Login successful', redirectTo, token })
    } catch (error) {
        res.status(500).json({ error: 'Error logging in' })
    }
});


app.get('/shop', async (req, res) => {
    try{
        const products = await Product.find()
        res.status(201).json(products)         // render users in json format
    }

    catch(error){
        res.status(500).json({ error: 'Unable to get products' })
    }
})