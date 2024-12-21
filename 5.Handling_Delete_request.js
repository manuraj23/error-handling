const { count } = require('console');
const express=require('express');
const fs = require('fs');
let app=express();
app.use(express.json());
let movies = JSON.parse(fs.readFileSync('data/movies.json','utf-8'));
app.use(express.json());

//Using Delete to delete the data based on id.
app.delete('/api/v1/movies/:id', (req, res) => {
    let id = req.params.id * 1;
    let movieToDelete = movies.find(el => el.id === id);
    const index=movies.indexOf(movieToDelete);
    if (!movieToDelete) {
        return res.status(404).json({
            status: 'fail',
            message: 'Movies with id '+id+' not found'
        });
    }
    movies.splice(index,1); //1 is used to delete only one element. And index is the position of the element to be deleted.
    fs.writeFile('data/movies.json',JSON.stringify(movies),err=>{
        res.status(204).json({
            status:'success',
            data:null
        });
    });
});


const port = 3000;
app.listen(port, () => {
    console.log(`App running on port ${port}...`);
});
