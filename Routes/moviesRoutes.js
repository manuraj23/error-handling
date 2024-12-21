const express = require('express');
const movieController = require('../Controller/moviesController'); // Adjust path if necessary

const router = express.Router();

router.route('/getHighestRated')
    .get(movieController.getHighestRated, movieController.getMoviesHandler);

router.route('/movieStats')
    .get(movieController.getMoviesStats); 

router.route('/getMovieByGenre/:genre')
.get(movieController.getMovieByGenre);


router.route('/')
    .get(movieController.getMoviesHandler)
    .post(movieController.createMovieHandler);

router.route('/:id')
    .get(movieController.getMovieByIdHandler)
    .patch(movieController.updateMovieHandler)
    .delete(movieController.deleteMovieHandler);

module.exports = router;
