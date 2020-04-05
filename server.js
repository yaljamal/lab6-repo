'use strict';
const express=require('express');

const cors=require('cors');

require('dotenv').config();
const PORT = process.env.PORT || 3000;

const server = express();

server.use(cors());


server.listen(PORT,()=>{
    console.log(`listining on port ${PORT}`);
})
server.get('/',(request,response)=>{
    response.status(200).send('it works ');
})


// http://localhost:3000/location?city=Lynnwood
server.get('/location',(request,response)=>{
const geoData=require('./data/geo.json');
const city=request.query.city;
const locationData=new Location(city,geoData)
response.send(locationData);
console.log(geoData);
});

function Location(city,geoData){
    this.search_query =city;
    this.formatted_query=geoData[0].display_name;
    this.lattitude=geoData[0].lat;
    this.longitude=geoData[0].lon;
}

// http://localhost:3000/weather?city=amman

server.get('/weather',(request,response)=>{
    let weatherArry=[];
    const weatherData=require('./data/weather.json');
    const city=request.query.city_name;
    weatherData.data.forEach( (val ,ind )=>{
        const weatherData2=new Weather(city,val);
        weatherArry.push(weatherData2);

    });
    response.send(weatherArry);
    });

function Weather(city,weather3){
        this.search_query =city;
        this.description=weather3.weather.description;
        this.valid_date=weather3.valid_date;

    }