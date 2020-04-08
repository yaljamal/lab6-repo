
'use strict';
// Load Environment Variables from the .env file
require('dotenv').config();
// Application Dependencies
const express = require('express');
const cors = require('cors');
const superagent = require('superagent');

function getHik(key, lat, lon) {
    let url = `https://www.hikingproject.com/data/get-trails?lat=${lat}&lon=${lon}&maxDistance=100&sort=Distance&key=${key}`;
    console.log(url);
    return superagent.get(url)
        .then(hikingData => {
            let alltrials = hikingData.body.trails.map(val => {
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

function hikingHandler(request, response) {
    // console.log('the id is :', id);
    let lat = request.query.lattitude;
    let lon = request.query.longitude;
    let key = process.env.HIKING_API_KEY;
    myHik(key, lat, lon)
        .then(hikingData => response.status(200).json(hikingData));

}
module.exports= hikingRoot;