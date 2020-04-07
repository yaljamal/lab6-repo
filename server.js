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


server.get('/', (request, response) => {
    response.status(200).send('it works ');
})

server.get('/weather', weatherHandler);
server.get('/location', locationHandler);
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

function getLocation(city,key) {
    const url = `https://eu1.locationiq.com/v1/search.php?key=${key}&q=${city}&format=json`;
    console.log('ddddddd', url);
    return superagent.get(url)
        .then(locationData2 => {
                const locationData = new Location(city,locationData2.body);
                return locationData2;
            
        })


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
    console.log('ddddddd', url);
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
    this.description = weather3.weather.description;
    this.valid_date = weather3.valid_date;

}
function hikingHandler(request, response) {
    // console.log('the id is :', id);
    let lat=request.query.lat;
    let lon=request.query.lon;
    getHik(lat , lon)
        .then(hikingData => response.status(200).json(hikingData));

}
let hikinhSummaries = [];
function getHik(lat,lon) {
    let key = process.env.HIKING_API_KEY;
    const url = `https://www.hikingproject.com/data/get-trails?lat=${lat}&lon=${lon}&maxDistance=10&key=${key}`;
    console.log(url);
    return superagent.get(url)
        .then(hikingData => {
            hikingData.body.data.forEach(val => {
                var hikingData = new Hiking(val);
                hikinhSummaries.push(hikingData);
            });
            return hikinhSummaries;
        })
}
function Hiking(hiking) {
    this.name = hiking.trails.name;
    this.location = hiking.trails.location;
    this.stars = hiking.trails.stars;
    this.star_votes = hiking.trails.star_votes;
    this.summary = hiking.trails.summary;
    this.trail_url = hiking.trails.trail_url;
    this.conditions = hiking.trails.conditions;
    this.condition_date = hiking.trails.condition_date;
    this.condition_time = hiking.trails.condition_time;
}

server.listen(PORT, () => {
    console.log(`listining on port ${PORT}`);
})