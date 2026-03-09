// use node app.js in cli to check if connection works
// after use http://localhost:3000/ on a browser to check that the homepage renders

const dns = require('node:dns');
dns.setServers(['8.8.8.8', '1.1.1.1']); 

const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const hbs = require('hbs');

const app = express();

// DATABASE CONNECTION 
mongoose.connect('mongodb+srv://PahiramKoAdmin:Group4Apdev@pahiramkotse.g6rovco.mongodb.net/pahiramKotseDB?retryWrites=true&w=majority')
  .then(() => console.log('Connected to MongoDB...'))
  .catch(err => console.error('Could not connect to MongoDB...', err));

// VIEW ENGINE SETUP
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'view')); 

// MIDDLEWARE
app.use(express.static(path.join(__dirname, 'assets')));
app.use(express.static(path.join(__dirname, 'js')));
app.use(express.urlencoded({ extended: true }));

// ROUTE HANDLERS
const indexRoutes = require('./routes/index');
app.use('/', indexRoutes);

// SERVER START
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});