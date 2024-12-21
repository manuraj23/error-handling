const mongoose = require('mongoose');
const fs = require('fs');
// Movie schema
const movieSchema1 = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Movie name is required'],
        maxlength: [100, 'Movie name must be less than 40 characters'],
        minlength: [3, 'Movie name must be more than 5 characters'],
        unique: true,
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Description is required'],
        trim: true
    },
    duration: {
        type: Number,
        required: [true, 'Duration is required']
    },
    rating: {
        type: Number,
        // min: [1, 'Rating must be above 1.0'],
        // max: [10, 'Rating must be below 10.0']
        validate:function(val){
            return val >= 1 && val <=10;
    },
    message:'Rating must be between 1 and 10'
    },
    totalRating: {
        type: Number
    },
    releaseYear: {
        type: Number,
        required: [true, 'Release year is required']
    },
    releaseDate: {
        type: Date,
        required: [true, 'Release date is required']
    },
    createdAt: {
        type: Date,
        default: Date.now(),
        select: false
    },
    genre: {
        enum: ['Action', 'Adventure', 'Comedy', 'Drama', 'Fantasy', 'Horror', 'Mystery', 'Thriller','Sci-Fi','Romance','Animation'],message:'Genre must be one of the following: Action, Adventure, Comedy, Drama, Fantasy, Horror, Mystery, Thriller, Sci-Fi, Romance, Animation',
        type: [String],
        required: [true, 'Genre is required']
    },
    directors: {
        type: [String],
        required: [true, 'Director is required']
    },
    coverImage: {
        type: String,
        required: [true, 'Cover image is required']
    },
    actors: {
        type: [String],
        required: [true, 'Actor is required']
    },
    price: {
        type: Number,
        required: [true, 'Price is required']
    },
    createdBy: {
        type: String
    }
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});
movieSchema1.virtual('durationInHours').get(function () {
    return this.duration / 60;
});


//Documnet Middleware 
// Pre save hook
movieSchema1.pre('save', function (next) {
    this.createdBy = 'Admin';
    console.log(this);
    next();
});

// Post save hook
movieSchema1.post('save', function (doc, next) {
    const content = `Movie ${doc.name} created successfully at ${doc.createdAt}\n`;
    fs.writeFileSync('./Log/log.txt', content, { flag: 'a' }, (err) => {
        if (err) {
            console.log('Error occurred while writing to file:', err.message);
        }
    });
    console.log(doc);
    next();
});

// Query Middleware
// Pre find hook
movieSchema1.pre(/^find/, function (next) {
    this.find({ releaseYear: { $gte: 2014 } });
    this.start = Date.now();
    next();
});

// Post find hook
movieSchema1.post(/^find/, function (docs, next) {
    fs.writeFileSync('./Log/log.txt', `Query took ${Date.now() - this.start} milliseconds\n`, { flag: 'a' }, (err) => {
        if (err) {
            console.log('Error occurred while writing to file:', err.message);
        }
    });
    console.log(docs);
    next();
});

// Aggregation Middleware
// Pre aggregate hook
movieSchema1.pre('aggregate', function (next) {
    this.pipeline().unshift({ $match: { releaseYear: { $gte: 2014 } } });
    console.log(this.pipeline());
    next();
});



// Movie model
const Movie = mongoose.model('Movie', movieSchema1);

module.exports = Movie;

// // Create test movie
// const testMovies = new Movie({
//     name: 'Avengers',
//     description: 'First Avenger movie by Marvel',
//     duration: 170,
//     rating: 9.1
// });

// testMovies.save()
//     .then((doc) => {
//         console.log('Movie saved successfully:', doc);
//     })
//     .catch((err) => {
//         console.log('Error occurred while saving movie:', err.message);
//     });