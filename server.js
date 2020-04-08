'use strict';
// Load Environment Variables from the .env file
require('dotenv').config();
// Application Dependencies
const express = require('express');
const cors = require('cors');
const superagent = require('superagent');
// Application Setup
const server = express();
const PORT = process.env.PORT || 3000;
server.use(cors());
const pg = require('pg');
const client = new pg.Client(process.env.DATABASE_URL);

// link the pages to muduleies
const myWeather = require('./js/weather.js');
const myLocation = require('./js/location.js');
const myMovie = require('./js/movie.js');
const myYelp = require('./js/yelp.js');
const myHik = require('./js/hiking.js');


// localhost3000:/weather?city=amman
server.get('/weather', myWeather);

// http://localhost:3000/location?city=Lynnwood
server.get('/location', myLocation);


// http://localhost:3000/hiking?lattitude=-105.2755&longitude=39.9787
server.get('/hiking', myHik);

//http://localhost:3000/movie?movie=
server.get('/movie', myMovie);

//http://localhost:3000/yelp?movie=
server.get('/yelp', myYelp);


client.connect()
    .then(() => {
        server.listen(PORT, () => {
            console.log(`listining on port ${PORT}`);
        });
    });



