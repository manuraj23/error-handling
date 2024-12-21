const mongoose = require('mongoose');
const dotenv = require('dotenv');
const fs=require('fs');
dotenv.config({ path: './config.env' });
const Movie = require('./../Models/movieModel');
//Connet to mongoDB
mongoose.connect(process.env.CONN_STR, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('DB connection successful!');
}).catch((err) => {
    console.log('Error connecting to DB:', err.message);
});

const movies=JSON.parse(fs.readFileSync('./data/movies.json','utf-8'));

//Delete existing data from collection
const deleteData=async()=>{
    try{
        await Movie.deleteMany();
        console.log('Data deleted successfully');
    }catch(err){
        console.log('Error deleting data:',err.message);
    }
    process.exit();
}

//Import data into collection
const importData=async()=>{
    try{
        await Movie.create(movies);
        console.log('Data imported successfully');
    }catch(err){
        console.log('Error importing data:',err.message);
    }
    process.exit();
}

//Delete and import data
if(process.argv[2]==='--delete'){
    deleteData();
}
if(process.argv[2]==='--import'){
    importData();
}
// deleteData();
// importData();