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

const pg=require('pg');
const client = new pg.Client(process.env.DATABASE_URL); 
server.get('/', (request, response) => {
    response.status(200).send('it works ');
})
// localhost3000:/weather?city=
server.get('/weather', weatherHandler);
// localhost3000:/location?city=
server.get('/location', locationHandler);
// localhost3000:/addlocation?city=
server.get('/addlocation', addLocation);
// http://localhost:3000/hiking?lattitude=-105.2755&longitude=39.9787
server.get('/hiking', hikingHandler);



// http://localhost:3000/location?city=Lynnwood
function locationHandler(request, response) {
    const city = request.query.city;
    // const city = request.query.search_query;
    console.log('the city of location is:', city);
    let key = process.env.LOCATION_API_KEY;
    getLocation(city,key)
        .then(locationData2 => response.status(200).json(locationData2.body));
}
function addLocation(request,response){
    let search_query=request.query.search;
    let formatted_query=request.query.format;
    let lat=request.query.lat;
    let lon=request.query.lon;
    let saveValues=[search_query,formatted_query,lat,lon];
    let sql = `INSERT INTO newLocation (search_query,formatted_query,lattitude,longitude)VALUES($1,$2,$3,$4)`;
    client.query(sql,saveValues)
    .then(result=>{
        response.status(200).json(result.rows);

    })
}
function getLocation(city,key) {
    let sql_query = 'select * newLocation where search_query = amman ';
    if(sql_query === null){
        const url = `https://eu1.locationiq.com/v1/search.php?key=${key}&q=${city}&format=json`;
        console.log('the location URL', url);
        return superagent.get(url)
            .then(locationData2 => {
                    const locationData = new Location(city,locationData2.body);
                    return locationData2;
                
            });
    }
    else{
        addLocation();
    }
}
function Location(city, geoData) {
    this.search_query = city;
    this.formatted_query = geoData[0].display_name;
    this.lattitude = geoData[0].lat;
    this.longitude = geoData[0].lon;
}

//http://localhost:3000/weather?city=amman
// server.get('/weather', (request, response) => {

//     let weatherArry = [];
//     const weatherData = require('./data/weather.json');
//     const city = request.query.city_name;
//     weatherData.data.forEach((val, ind) => {
//         const weatherData2 = new Weather(city, val);
//         weatherArry.push(weatherData2);

//     });
//     response.send(weatherArry);
// });
function weatherHandler(request, response) {
    const city = request.query.city;
    console.log('the city is :', city);
    getWeather(city)
        .then(weatherData => response.status(200).json(weatherData));
}
const weatherSummaries = [];
function getWeather(city) {
    let key = process.env.WEATHER_API_KEY;
    const url = `https://api.weatherbit.io/v2.0/forecast/daily?city=${city}&key=${key}`;
    console.log('the weather URL', url);
    return superagent.get(url)
        .then(weatherData => {
            weatherData.body.data.forEach(val => {
                var weatherData = new Weather(val);
                weatherSummaries.push(weatherData);
            });
            return weatherSummaries;
        })
}
function Weather(weather3) {
    this.description = weather3.weather.forecast;
    this.valid_date = weather3.valid_date;

}
function hikingHandler(request, response) {
    // console.log('the id is :', id);
    let lat=request.query.lattitude;
    let lon=request.query.longitude;
    let key = process.env.HIKING_API_KEY;
    getHik(key,lat,lon)
        .then(hikingData => response.status(200).json(hikingData));

}
function getHik(key,lat,lon) {
    let url = `https://www.hikingproject.com/data/get-trails?lat=${lat}&lon=${lon}&maxDistance=100&sort=Distance&key=${key}`;
    console.log(url);
    return superagent.get(url)
        .then(hikingData => {
          let alltrials=  hikingData.body.trails.map(val => {
                return new Hiking(val);
            });
            return alltrials;
        })
}
function Hiking(hiking) {
    this.name = hiking.name;
    this.location = hiking.location;
    this.length = hiking.length;
    this.stars = hiking.stars;
    this.star_votes = hiking.star_votes;
    this.summary = hiking.summary;
    this.trail_url = hiking.trail_url;
    this.conditionDetails = hiking.conditionDetails;
    this.condition_date = hiking.condition_date;
    this.condition_time = hiking.condition_time;
}

client.connect()
.then(()=>{
    server.listen(PORT, () => {
        console.log(`listining on port ${PORT}`);
    });
});