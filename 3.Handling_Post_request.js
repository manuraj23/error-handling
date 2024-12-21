const { count } = require('console');
const express=require('express');
const fs = require('fs');
let app=express();

let movies = JSON.parse(fs.readFileSync('data/movies.json','utf-8'));

//Post -api/movies

//midleware :add data to the request object
app.use(express.json());


app.post('/api/v1/movies',(req,res)=>{
    const newId=movies[movies.length-1].id+1;
    const newMovies=Object.assign({id:newId},req.body);
    movies.push(newMovies);
    fs.writeFile('data/movies.json',JSON.stringify(movies),err=>{ //stringify is used to convert the object into string
        res.status(201).json({
            status:'success',
            data:{
                movies:newMovies
            }
        });
    });
    // console.log(req.body);
    // res.send('Data added successfully');
}); 

const port = 3000;
app.listen(port, () => {
    console.log(`App running on port ${port}...`);
});