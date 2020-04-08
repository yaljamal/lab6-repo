'use strict';
// Load Environment Variables from the .env file
require('dotenv').config();
// Application Dependencies
const express = require('express');
const cors = require('cors');
const superagent = require('superagent');

function getMovie(movie) {
    let sql = 'SELECT * FROM movie WHERE title=$1;';
    let saveValue = [movie];
    console.log('the movie is:', movie);
    return client.query(sql, saveValue)
        .then(result => {
            if (result.length > 0) {
                return result.rows[0];
            }
            else {
                let key = process.env.MOVIES_API_KEY;
                const url = `https://api.themoviedb.org/3/search/movie?api_key=${key}&query=${movie}`;
                console.log('the movie URL', url);
                return superagent.get(url)
                    .then(movieData2 => {
                        const movieData = new Movie(movieData2.body);
                        let title = movieData.title;
                        let overview = movieData.overview;
                        let average_votes = movieData.average_votes;
                        let total_votes = movieData.total_votes;
                        let image_url = movieData.image_url;
                        let popularity = movieData.popularity;
                        let released_on = movieData.released_on;
                        let saveValue = [title, overview, average_votes, total_votes, image_url, popularity, released_on];
                        let sql = 'INSERT INTO movie (title,overview,average_votes,total_votes,image_url,popularity,released_on) VALUES ($1,$2,$3,$4,$5,$6,$7);';
                        return client.query(sql, saveValue)
                            .then(result => {
                                result.rows[0];
                            })
                        // return movieData2;

                    });
            }
            // response.status(200).json(result.rows);
        });
}
function Movie(movie) {
    this.title = movie.title;
    this.overview = movie.overview;
    this.average_votes = movie.average_votes;
    this.total_votes = movie.total_votes;
    this.image_url = movie.image_url;
    this.popularity = movie.popularity;
    this.released_on = movie.released_on;
}
function movieHandler(request, response) {
    const movie = request.query.movie;
    myMovie(movie)
        .then(movieData => response.status(200).json(movieData));
}

module.exports= MovieRoot;