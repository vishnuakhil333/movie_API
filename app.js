const express = require("express");
const path = require("path");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");

const app = express();
app.use(express.json());

let db = null;

const dbPath = path.join(__dirname, "moviesData.db");

const initialiseDB = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3001, () => {
      console.log("Server running at localhost:3001/");
    });
  } catch (error) {
    console.log(`Error occured at ${error.message}`);
  }
};

initialiseDB();

//Get all movies API
app.get("/movies/", async (request, response) => {
  const getAllMoviesQuery = `
SELECT movie_name as movieName
FROM movie;`;
  const movies = await db.all(getAllMoviesQuery);
  console.log(movies);
  response.send(movies);
});

//Add movie API
app.post("/movies/", async (request, response) => {
  const movieDetails = request.body;
  // console.log(movieDetails);
  const { directorId, movieName, leadActor } = movieDetails;
  // console.log(directorId, movieName, leadActor);
  const addMovieQuery = `
INSERT INTO 
movie (director_id,movie_name,lead_actor)
VALUES (
${directorId},
'${movieName}',
'${leadActor}');`;
  const dbResponse = await db.run(addMovieQuery);
  console.log("DB Response");
  console.log(dbResponse.lastID);
  response.send("Movie Successfully Added");
});

//Get movie by id API
app.get("/movies/:movieId", async (request, response) => {
  const { movieId } = request.params;
  console.log(movieId);
  const getMovieByIdQuery = `
SELECT movie_id as movieId, director_id as directorId, movie_name as movieName, lead_actor as leadActor
FROM movie
WHERE movie_id = ${movieId};`;
  console.log(getMovieByIdQuery);
  const movie = await db.get(getMovieByIdQuery);
  console.log(movie);
  response.send(movie);
});

//PUT(update) movie by Id API
app.put("/movies/:movieId", async (request, response) => {
  const { movieId } = request.params;
  console.log(movieId);

  const movieDetails = request.body;
  console.log(movieDetails);

  const { directorId, movieName, leadActor } = movieDetails;

  const updateMovieByIdQuery = `
UPDATE MOVIE
SET 
director_id = ${directorId},
movie_name = '${movieName}',
lead_actor = '${leadActor}'
WHERE movie_id = ${movieId};`;

  const dbResponse = await db.run(updateMovieByIdQuery);
  console.log(dbResponse);
  response.send("Movie Details Updated");
});

//Delete movie by id API
app.delete("/movies/:movieId/", async (request, response) => {
  const { movieId } = request.params;
  console.log(movieId);
  const deleteMovieByIdQuery = `
DELETE FROM movie
WHERE movie_id = ${movieId};`;
  const dbResponse = await db.run(deleteMovieByIdQuery);
  console.log(dbResponse);
  response.send("Movie Removed");
});

// Get all directors API
app.get("/directors/", async (request, response) => {
  const getAllDirectorsQuery = `
SELECT director_id as directorId, director_name as directorName
FROM director;`;
  const directors = await db.all(getAllDirectorsQuery);
  console.log(directors.length);
  response.send(directors);
});

//Get all movie names from a specific director
app.get("/directors/:directorId/movies/", async (request, response) => {
  const { directorId } = request.params;
  console.log(directorId);
  const getAllMoviesOfDirectorQuery = `
SELECT movie_name as movieName
FROM movie WHERE director_id = ${directorId};`;
  console.log(getAllMoviesOfDirectorQuery);

  const movies = await db.all(getAllMoviesOfDirectorQuery);
  console.log(movies);
  response.send(movies);
});

module.exports = express;
