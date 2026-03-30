// use node app.js in cli to check if connection works
// after use http://localhost:3000/ on a browser to check that the homepage renders

const dns = require('node:dns');
dns.setServers(['8.8.8.8', '1.1.1.1']); 

const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const session = require('express-session');
const user = require('./model/user');
const app = express();
const exphbs = require('express-handlebars');

require('dotenv').config();

// DATABASE CONNECTION 
mongoose.connect(process.env.URI)
  .then(() => console.log('Connected to MongoDB...'))
  .catch(err => console.error('Could not connect to MongoDB...', err));

// VIEW ENGINE SETUP & HANDLEBARS CONFIGURATION
app.engine('hbs', exphbs.engine({
    extname: 'hbs',
    defaultLayout: false, 

    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true
    },

    helpers: {
        formatDate: function (dateString) {
            if (!dateString) return "";
            const options = { year: 'numeric', month: 'long', day: 'numeric' };
            return new Date(dateString).toLocaleDateString('en-US', options);
        },
        eq: function (a, b) {
            return a === b;
        },
        json: function(context) {
            return JSON.stringify(context);
        }
    }
}));

app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'view')); 

// MIDDLEWARE
app.use(express.static('public'));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'assets')));
app.use(express.static(path.join(__dirname, 'js')));
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: 'secret_key', // encryption
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } // Set to false because localhost
}));

app.use(async (req, res, next) => {
    if (req.session && req.session.userId) {
        try {
            const currentUser = await user.findById(req.session.userId);
            res.locals.user = currentUser; 
        } catch (err) {
            console.error("Error fetching global user:", err);
        }
    }
    next(); 
});

// ROUTE HANDLERS
const indexRoutes = require('./routes/index');
const userRoutes = require('./routes/user');
const vehicleRoutes = require('./routes/vehicle');
const reservationRoutes = require('./routes/reservation');
const customerRoutes = require('./routes/customer');

app.use('/', indexRoutes);
app.use('/', userRoutes);    
app.use('/', vehicleRoutes); 
app.use('/', reservationRoutes); 
app.use('/', customerRoutes);

// SERVER START
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});