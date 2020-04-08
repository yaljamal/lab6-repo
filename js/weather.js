'use strict';
// Load Environment Variables from the .env file
require('dotenv').config();
// Application Dependencies
const express = require('express');
const cors = require('cors');
const superagent = require('superagent');

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

function weatherHandler(request, response) {
    const city = request.query.city;
    console.log('the city is :', city);
    myWeather(city)
        .then(weatherData => response.status(200).json(weatherData));
}

module.exports= WeatherRoot;