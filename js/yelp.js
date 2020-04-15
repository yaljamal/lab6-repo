
'use strict';
// Load Environment Variables from the .env file
require('dotenv').config();
// Application Dependencies
const express = require('express');
const cors = require('cors');
const superagent = require('superagent');


function getyelp(yelp) {
    let sql = 'SELECT * FROM yelp WHERE name=$1;';
    let saveValue = [yelp];
    console.log('the movie is:', yelp);
    return client.query(sql, saveValue)
        .then(result => {
            if (result.length > 0) {
                return result.rows[0];
            }
            else {
                let key = process.env.YELP_API_KEY;
                const url = `https://api.themoviedb.org/3/search/movie?api_key=${key}&query=${movie}`;
                console.log('the yelp URL', url);
                return superagent.get(url)
                    .then(yelpData2 => {
                        const yelpData = new Yelp(yelpData2.body);
                        let name = yelpData.name;
                        let image_url = yelpData.image_url;
                        let price = yelpData.price;
                        let rating = yelpData.rating;
                        let url2 = yelpData.url;
                        let saveValue = [name, image_url, price, rating, url2];
                        let sql = 'INSERT INTO yelp (name,image_url,price,rating,url) VALUES ($1,$2,$3,$4,$5);';
                        return client.query(sql, saveValue)
                            .then(result => {
                              return  result.rows[0];
                            })

                    });
            }
        });
}
function Yelp(yelp) {
    this.name = yelp.name;
    this.image_url = yelp.image_url;
    this.price = yelp.price;
    this.rating = yelp.rating;
    this.url = yelp.url;
}

function yelpHandler() {
    const yelp = request.query.yelp;
    myYelp(yelp)
        .then(yelpData => response.status(200).json(yelpData));
}
module.exports = yelpRoot;