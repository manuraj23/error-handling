

const express = require('express');
const fs = require('fs');
let app = express();

// Middleware to parse JSON request body
app.use(express.json());

// Load movies from JSON file
let movies = JSON.parse(fs.readFileSync('data/movies.json', 'utf-8'));

function getMoviesHandler(req, res) {
    res.status(200).json({
        status: 'success',
        count: movies.length,
        data: {
            movies: movies
        }
    });
}

function getMovieByIdHandler(req, res) {
    const id = req.params.id * 1; // Convert string to number
    let movie = movies.find(el => el.id === id);

    if (!movie) {
        return res.status(404).json({
            status: 'fail',
            message: 'Movie with id ' + id + ' not found'
        });
    }

    res.status(200).json({
        status: 'success',
        data: {
            movie: movie
        }
    });
}

function createMovieHandler(req, res) {
    const newId = movies[movies.length - 1]?.id + 1 || 1; // Handle empty array case
    const newMovie = Object.assign({ id: newId }, req.body); // Merge new ID with request body
    movies.push(newMovie);

    fs.writeFile('data/movies.json', JSON.stringify(movies), err => { // Convert movies array to a string
        if (err) {
            return res.status(500).json({
                status: 'fail',
                message: 'Error writing to file'
            });
        }
        res.status(201).json({
            status: 'success',
            data: {
                movies: newMovie
            }
        });
    });
}

function updateMovieHandler(req, res) {
    const id = req.params.id * 1; // Convert id to a number
    const movieToUpdate = movies.find(el => el.id === id);
    const index = movies.findIndex(el => el.id === id);

    if (!movieToUpdate) {
        return res.status(404).json({
            status: 'fail',
            message: 'Movie with id ' + id + ' not found'
        });
    }

    // Update the movie object with new data
    Object.assign(movieToUpdate, req.body);
    movies[index] = movieToUpdate;

    // Save the updated movies array to the file
    fs.writeFile('data/movies.json', JSON.stringify(movies), err => {
        if (err) {
            return res.status(500).json({
                status: 'fail',
                message: 'Error writing to file'
            });
        }
        res.status(200).json({
            status: 'success',
            data: {
                movie: movieToUpdate
            }
        });
    });
}

function deleteMovieHandler(req, res) {
    const id = req.params.id * 1; // Convert id to a number
    const movieToDelete = movies.find(el => el.id === id);
    const index = movies.indexOf(movieToDelete);

    if (!movieToDelete) {
        return res.status(404).json({
            status: 'fail',
            message: 'Movie with id ' + id + ' not found'
        });
    }

    // Remove the movie from the array
    movies.splice(index, 1); // Delete one element at the given index

    // Save the updated movies array to the file
    fs.writeFile('data/movies.json', JSON.stringify(movies), err => {
        if (err) {
            return res.status(500).json({
                status: 'fail',
                message: 'Error writing to file'
            });
        }
        res.status(204).json({
            status: 'success',
            data: null
        });
    });
}

// //Get -api/movies
// app.get('/api/v1/movies', getMoviesHandler);
// //Handling get request with route parameter.
// app.get('/api/v1/movies/:id', getMovieByIdHandler); 
// //Post -api/movies
// //midleware :add data to the request object
// app.use(express.json());
// app.post('/api/v1/movies', createMovieHandler);
// //Using patch to update the data based on id.
// app.patch('/api/v1/movies/:id', updateMovieHandler);
// //Using Delete to delete the data based on id.
// app.delete('/api/v1/movies/:id', deleteMovieHandler);

// Define routes
app.route('/api/v1/movies').get(getMoviesHandler).post(createMovieHandler);
app.route('/api/v1/movies/:id').get(getMovieByIdHandler).patch(updateMovieHandler).delete(deleteMovieHandler);

// Start server
const port = 3000;
app.listen(port, () => {
    console.log(`App running on port ${port}...`);
});
