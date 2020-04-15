'use strict';
// Load Environment Variables from the .env file
require('dotenv').config();
// Application Dependencies
const express = require('express');
const cors = require('cors');
const superagent = require('superagent');
const server = express();

function getLocation(city) {
    let sql = 'SELECT * FROM newLocations WHERE search_query=$1;';
    let saveValue = [city];
    console.log('the city of location is:', city);
    return client.query(sql, saveValue)
        .then(result => {
            if (result.rows.length) {
                return result.rows[0];
            }
            else {
                let key = process.env.LOCATION_API_KEY;
                const url = `https://eu1.locationiq.com/v1/search.php?key=${key}&q=${city}&format=json`;
                console.log('the location URL', url);
                return superagent.get(url)
                    .then(locationData2 => {
                        const locationData = new Location(city, locationData2.body);
                        let formatQuery = locationData.formatted_query;
                        let lat = locationData.lattitude;
                        let lon = locationData.longitude;
                        let sql = 'INSERT INTO newLocations (search_query,formatted_query,latitude,longitude) VALUES ($1,$2,$3,$4);';
                        let saveValue = [city, formatQuery, lat, lon];
                        return client.query(sql, saveValue)
                            .then(result => {
                               return result.rows[0];
                            })
                        // return locationData2;
                    });
            }
            // response.status(200).json(result.rows);
        });
}
function Location(city, geoData) {
    this.search_query = city;
    this.formatted_query = geoData[0].display_name;
    this.lattitude = geoData[0].lat;
    this.longitude = geoData[0].lon;
}

function locationHandler(request, response) {
    const city = request.query.city;
    myLocation(city)
        .then(locationData2 => response.status(200).json(locationData2));
}
module.exports= LocationRoot;