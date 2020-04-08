
DROP TABLE IF EXISTS locations;

CREATE TABLE newLocations
(
  id SERIAL PRIMARY KEY,
  search_query VARCHAR(255),
  formatted_query VARCHAR(255),
  latitude NUMERIC(10, 7),
  longitude NUMERIC(10, 7)
);

CREATE TABLE movie
(
  id SERIAL PRIMARY KEY,
  title VARCHAR(255),
  overview VARCHAR(255),
  average_votes NUMERIC(10,7),
  total_votes NUMERIC(10,7),
  image_url VARCHAR(255),
  popularity NUMERIC(10,7),
  released_on VARCHAR(255)
);

CREATE TABLE yelp
(
  id SERIAL PRIMARY KEY,
  name  VARCHAR(255),
  image_url VARCHAR(255),
  price NUMERIC(10,7),
  rating NUMERIC(10,7),
  url VARCHAR(255),
 
);

