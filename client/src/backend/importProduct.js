const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const fs = require('fs');
const Product = require('./models/productSchema')

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

    // Function to watch for changes and update the database
    const watchAndUpdate = () => {
      const changeStream = Product.watch();
      changeStream.on('change', async (change) => {
        if (change.operationType === 'insert') {
          console.log('New document inserted:', change.fullDocument);
          try {
            await Product.create(change.fullDocument);
            console.log('New document inserted successfully');
          } catch (err) {
            console.error('Error inserting new document:', err);
          }
        } else if (change.operationType === 'update') {
          console.log('Document updated:', change.fullDocument);
          const updatedProduct = change.fullDocument;
          try {
            await Product.findByIdAndUpdate(updatedProduct._id, updatedProduct);
            console.log('Document updated successfully');
          } catch (err) {
            console.error('Error updating document:', err);
          }
        }
      });
    };

    // Function to insert initial data
    const insertInitialData = async () => {
      try {
        const count = await Product.countDocuments();
        if (count === 0) {
          const rawData = fs.readFileSync('productList.js');
          const data = JSON.parse(rawData);
          await Product.insertMany(data);
          console.log('Initial data inserted successfully');
        } else {
          console.log('Initial data already inserted');
        }
      } catch (err) {
        console.error('Error inserting initial data:', err);
      }
    };

    // Start the server after successfully connecting to MongoDB
    app.listen(port, () => {
        console.log(`App is listening at http://localhost:${port}`);
        watchAndUpdate(); // Watch for changes in the database
        insertInitialData(); // Insert initial data when the server starts
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
