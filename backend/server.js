require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const groceryRoutes = require('./routes/groceries');
const userRoutes = require('./routes/user');
const receiptRoutes = require('./routes/receipt');


// Creating an express app
const app = express();

// Middleware
app.use(express.json());

app.use((request, response, next) => {
   console.log(request.method, "request to", request.path);
   next();
});

// Routes
app.use('/api/groceries', groceryRoutes);
app.use('/api/user', userRoutes);
app.use('/api/receipt', receiptRoutes);


// Connect to DB
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        // Listen for requests
        app.listen(process.env.PORT, () => {
            console.log('Connected to db, listening on port', process.env.PORT);
        });
    })
    .catch((error) => {
        console.log(error);
    });


