// Application server




// Run this script to launch the server.
// The server should run on localhost port 8000.
// This is where you should start writing server-side code for this application.


/*
  This is our back-end server, which employs some middleware
  to make sure data is received in the proper format (i.e. JSON)
  and hooks up all of our pieces.
*/

// THESE ARE NODE APIs WE WISH TO USE
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// SETUP OUR OWN ROUTERS AS MIDDLEWARE
const accountRouter = require('./routes/account_router');
const allRouter = require('./routes/qat_router');

// CREATE OUR SERVER
const app = express();
app.use(express.json());
app.use(cors());

// INITIALIZE OUR DATABASE OBJECT
const mongoUri = 'mongodb://127.0.0.1:27017/fake_so';
mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => console.log('Connected to MongoDB'));

// SETUP OUR OWN ROUTERS AS MIDDLEWARE
app.use('/routes', accountRouter);
app.use('/routes', allRouter);

// PUT THE SERVER IN LISTENING MODE
const server = app.listen(8000, () => console.log('Server started on https://localhost:8000'));

process.on('SIGINT', () => {
  db.close(() => {
    console.log('Server closed. Database instance disconnected');
    process.exit(0);
  });
});

module.exports = server;