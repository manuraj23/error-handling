const express = require('express');
const app = express();
const movieRouter = require('./Routes/moviesRoutes.js'); // Correctly point to the router file

app.use(express.json()); // Middleware for parsing JSON requests

// Movie routes
app.use('/api/v1/movies', movieRouter);
module.exports = app;