const { count } = require('console');
const express = require('express');
const fs = require('fs');
let app = express();


let movies = JSON.parse(fs.readFileSync('data/movies.json', 'utf-8'));

//Get -api/movies
app.get('/api/v1/movies', (req, res) => {
    res.status(200).json({
        status: 'success',
        count: movies.length,
        data: {
            movies: movies
        }
    });
});

//Handling get request with route parameter.
app.get('/api/v1/movies/:id/', (req, res) => { //:id is a route parameter and they are stored in form of string.
    const id = req.params.id * 1; //converting string to number
    let movie = movies.find(el => el.id === id);
    if (!movie) {
        return res.status(404).json({
            status: 'fail',
            message: 'Movies with id ' + id + ' not found'
        });
    }
    res.status(200).json({
        status: 'success',
        data: {
            movie: movie
        }
    });
});

//Post -api/movies

//midleware :add data to the request object
app.use(express.json()); //This is a middleware that is used to parse the incoming request with JSON payloads.


app.post('/api/v1/movies', (req, res) => {
    const newId = movies[movies.length - 1].id + 1;
    const newMovies = Object.assign({ id: newId }, req.body);
    movies.push(newMovies);
    fs.writeFile('data/movies.json', JSON.stringify(movies), err => { //stringify is used to convert the object into string
        res.status(201).json({
            status: 'success',
            data: {
                movies: newMovies
            }
        });
    });
});

//Using patch to update the data based on id.
app.patch('/api/v1/movies/:id', (req, res) => {
    let id = req.params.id * 1;
    let movieToUpdate = movies.find(el => el.id === id);
    let index = movies.findIndex(el => el.id === id);
    if (!movieToUpdate) {
        return res.status(404).json({
            status: 'fail',
            message: 'Movies with id ' + id + ' not found'
        });
    }
    Object.assign(movieToUpdate, req.body);
    movies[index] = movieToUpdate;
    fs.writeFile('data/movies.json', JSON.stringify(movies), err => {
        res.status(200).json({
            status: 'success',
            data: {
                movie: movieToUpdate
            }
        });
    });
});

//Using Delete to delete the data based on id.
app.delete('/api/v1/movies/:id', (req, res) => {
    let id = req.params.id * 1;
    let movieToDelete = movies.find(el => el.id === id);
    const index = movies.indexOf(movieToDelete);
    if (!movieToDelete) {
        return res.status(404).json({
            status: 'fail',
            message: 'Movies with id ' + id + ' not found'
        });
    }
    movies.splice(index, 1); //1 is used to delete only one element. And index is the position of the element to be deleted.
    fs.writeFile('data/movies.json', JSON.stringify(movies), err => {
        res.status(204).json({
            status: 'success',
            data: null
        });
    });
});

const port = 3000;
app.listen(port, () => {
    console.log(`App running on port ${port}...`);
});