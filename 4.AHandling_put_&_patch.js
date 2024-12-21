const { count } = require('console');
const express=require('express');
const fs = require('fs');
let app=express();
app.use(express.json());
let movies = JSON.parse(fs.readFileSync('data/movies.json','utf-8'));

//Using patch to update the data based on id.
app.patch('/api/v1/movies/:id', (req, res) => {
    let id = req.params.id * 1;
    let movieToUpdate = movies.find(el => el.id === id);
    let index = movies.findIndex(movieToUpdate);
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

const port = 3000;
app.listen(port, () => {
    console.log(`App running on port ${port}...`);
});
