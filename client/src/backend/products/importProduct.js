// run this if you add or update a product to the productList.js
// update the database after adding products
// run node importProducts to the terminal after changing something here 
// after running refresh db to see changes

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const fs = require('fs');
const Product = require('../models/productSchema')

const app = express();
const port = 3002;

// Connection URI for MongoDB Atlas
const dbURI = 'mongodb+srv://alexisdaniellieee:aEzAshDCA2pQsudY@cluster30.0h4lpvz.mongodb.net/projectDB?retryWrites=true&w=majority&appName=CLuster30';

// Connect to MongoDB Atlas
mongoose.connect(dbURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(async () => {
    console.log('Connected to MongoDB Atlas');

  // Function to insert initial data
  const insertData = async () => {
    try {
      const rawData = fs.readFileSync('productList.js');
      const data = JSON.parse(rawData);

      // delete all existing documents
      await Product.deleteMany({});

      // insert new and updated documents
      await Product.insertMany(data);
      console.log('Initial data inserted successfully');
    } catch (err) {
      console.error('Error inserting initial data:', err);
    }
  };


    // Start the server after successfully connecting to MongoDB
    app.listen(port, () => {
        console.log(`App is listening at http://localhost:${port}`);
        insertData(); // Insert initial data when the server starts
    });
})
.catch((error)=>{
    console.log('Unable to connect to MongoDB:', error);
});

// Parse JSON bodies
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Hello World!');
});

module.exports = app;