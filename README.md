# Car Rental Website

**PROJECT IN DEVELOPMENT**

**PahiramKotse** is a web application that allows customers to easily rent a car online, and company administrators to manage reservations more conveniently.

## Project Information

**Course:** GDAPDEV: Web Application Development  
**Academic Year:** 2025-2026, Term 2  
**Institution:** De La Salle University  
**Current Status:** Backend in progress

## Team Members

- **CHING, Ashton Jude**
- **GUARIN, Raine Louise**
- **GUTIERREZ, Michael Luis**
- **VILLAMOR, Allysa Luise**
  
## Project Overview
**PahiramKotse** is a web application designed for easy car rentals. Keeping track of large amounts of data such as car information and user information can be quite tasking. This application aims to address this issue for customers through the easy-to-understand user interface, where information they need is easily accessible and navigable. Administrators can also easily manipulate data through its features.

## Planned Features
- User Account (Registration, Log-in, Log-out, Delete)
- User Profile (Edit)
- Vehicle Profile (View, Edit)
- Customer Actions (Reservation, View, Search, Edit)
- Admin Actions (Reservation, View, Search, Edit, Cancellation)
- License verification

## Technology Stack
**Frontend**: HTML, CSS, Javascript
**Backend**: Handlebars
**Database**: MongoDB
**Architecture**: Model View Controller design
**Deployment**: Local deployment via Node.js

## Current Status
The backend is currently being implemented and being tested via server deployments.

### Getting Started

## Prerequisite Downloads
- Node.js
- MongoDB

## Setup Instructions
1. Clone the repository
   ``git clone "https://github.com/raineguarin/GDAPDEV-MCO"
   cd GDAPDEV-MCO``
2. Set up the database
   - Via MongoDB Compass IDE:
       1. Create a new connection
       2. Paste this URI: ``mongodb+srv://PahiramKoAdmin:Group4Apdev@pahiramkotse.g6rovco.mongodb.net/pahiramKotseDB?retryWrites=true&w=majority``
       3. Press **Save and Connect**
    
   - Via MongoDB Atlas:
3. Install Handlebars via Node.js in the terminal (make sure it is in the repository)
   ``npm install express express-handlebars``
4. Start the server using the following command
   ``node app,js``

## Current Repository Structure
``
GDAPDEV-MCO/

│   .gitignore

│   app.js

│   LICENSE

│   package-lock.json

│   package.json
│   README.md
│
├───assets                               # CSS stylesheets
│   │   cars.css
│   │   contact-us.css
│   │   friends.css
│   │   global.css
│   │   homepage.css
│   │   manage-reservations.css
│   │   manage-users.css
│   │   manage-vehicles.css
│   │   profile.css
│   │   register.css
│   │   reservations.css
│   │   search.css
│   │
│   └───images                           # Images used
│           ford.avif
│           logo.png
│           profilepicture.png
│           sedan.png
│           suv.png
│
├───js                                   # JavaScript logic handling
│       cars.js
│       friends.js
│       manage-reservations.js
│       manage-users.js
│       profile.js
│       register.js
│       reserve-cars.js
│
├───model                                # Objects
│       reservation.js
│       user.js
│       vehicle.js
│
├───node_modules                         # Modules for Node (inimized document for length)
├───pages but put HBS in view folder     # Initial HTML pages
│       admin-homepage.html
│       admin-profile.html
│       cars.html
│       contact-us.html
│       friends.html
│       homepage.html
│       login.html
│       manage-reservations.html
│       manage-users.html
│       manage-vehicles.html
│       profile.html
│       register.html
│       reservations.html
│       reserve-car.html
│       search.html
│
├───routes                                # Routers
│       customer.js
│       index.js
│       reservation.js
│       user.js
│       vehicle.js
│
└───view                                 # Handlebars pages
        admin-homepage.hbs
        homepage.hbs
        manage-users.hbs
        register.hbs
``



