const Movie = require('./../Models/movieModel');
const {param} = require('./../Models/movieModel');
const APIFeatures = require('./../Utils/apiFeatures');
// Handlers

// exports.validateBody = (req, res, next) => {
//     if (!req.body.name || !req.body.releaseYear || !req.body.duration) {
//         return res.status(400).json({
//             status: 'fail',
//             message: 'Missing name, year, or length'
//         });
//     }
//     next();
// };

//Alisasing
exports.getHighestRated = (req, res, next) => {
    req.query.limit = '5';
    req.query.sort = '-totalRating';
    next();
};
exports.getMoviesHandler = async (req, res) => {
    try {
        const features = new APIFeatures(Movie.find(), req.query);
        features.filter().sort().limitFields().paginate();
        let movies = await features.query;
        console.log(req.query); // Log the query parameters for debugging

        // M1
        // const movies = await Movie.find(req.query);

        // M2
        // const movies = await Movie.find()
        //     .where('duration').equals(req.query.duration)
        //     .where('totalRating').equals(req.query.totalRating);
        // res.status(200).json({
        //     status: 'success',
        //     length: movies.length,
        //     data: {
        //         movies
        //     }
        // });

        // Advanced Filtering
        // M1
        // const queryObj = { ...req.query }; // Copy req.query to avoid mutation
        // const excludedFields = ['sort', 'limit', 'page', 'fields']; // Fields to exclude from filtering
        // excludedFields.forEach((field) => delete queryObj[field]); // Remove excluded fields from queryObj

        // let queryStr = JSON.stringify(queryObj); // Convert queryObj to a string
        // queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (match) => `$${match}`); // Add MongoDB operators ($)
        // const filteredQueryObj = JSON.parse(queryStr); // Parse back to object
        // let query = Movie.find(filteredQueryObj); // Create initial query

        // find returns a query object, not an array of documents which is why we can chain methods like sort, limit, etc.

        // M2
        // const movies = await Movie.find()
        //     .where('duration').gte(req.query.duration)
        //     .where('totalRating').gte(req.query.totalRating)
        //     .where('price').lte(req.query.price);

        // Sorting
        // if (req.query.sort) {
        //     const sortBy = req.query.sort.split(',').join(' '); // Convert to space-separated format for MongoDB
        //     query = query.sort(sortBy);
        // }
        // else{
        //     query = query.sort('-releaseYear');
        // }

        // Field Limiting
        // if (req.query.fields) {
        //     const fields = req.query.fields.split(',').join(' '); // Convert to space-separated format for MongoDB
        //     query = query.select(fields);
        // }
        // else{
        //     query = query.select('-__v');
        // }

        // Pagination
        // const page = req.query.page * 1 || 1; // Convert to number, default to 1
        // const limit = req.query.limit * 1 || 10; // Convert to number, default to 100
        // const skip = (page - 1) * limit; // Calculate number of documents to skip
        // query = query.skip(skip).limit(limit);

        // if(req.query.page){
        //     const numMovies = await Movie.countDocuments();
        //     if(skip >= numMovies) throw new Error('This page does not exist');
        // }


        // Execute the query
        // const movies = await query;

        // Respond with success
        res.status(200).json({
            status: 'success',
            length: movies.length,
            data: {
                movies
            }
        });

    } catch (err) {
        // Catch and respond with error
        res.status(404).json({
            status: 'fail',
            message: err.message
        });
    }
};


exports.getMovieByIdHandler = async (req, res) => {
    // const movie = await Movie.find({ _id: req.params.id });
    try {
        const movie = await Movie.findById(req.params.id);
        res.status(200).json({
            status: 'success',
            data: {
                movie
            }
        });
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err.message
        });
    }

}

exports.createMovieHandler = async (req, res) => {
    try {
        const movie = await Movie.create(req.body);
        res.status(201).json({
            status: 'success',
            data: {
                movie
            }
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err.message
        });
    }

};

exports.updateMovieHandler = async (req, res) => {
    try {
        const updatedMovie = await Movie.findByIdAndUpdate(
            req.params.id,       // Extract id from req.params
            req.body,            // The updated data
            { new: true, runValidators: true } // Return updated document and validate inputs
        );

        if (!updatedMovie) {
            return res.status(404).json({
                status: 'fail',
                message: 'No movie found with that ID'
            });
        }

        res.status(200).json({
            status: 'success',
            data: {
                movie: updatedMovie
            }
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err.message
        });
    }
};

exports.deleteMovieHandler =async (req, res) => {
    try {
        const movie = await Movie.findByIdAndDelete(req.params.id);
        res.status(204).json({
            status: 'success',
            data: null
        });
    }
    catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err.message
        });
    }
};

//Aggregation pipeline
exports.getMoviesStats = async (req,res) => {
    try {
        const stats = await Movie.aggregate([
            {
                $match: { totalRating: { $gte: 200 } }
            },
            {
                $group: {
                    _id: null,
                    avgRating: { $avg: '$ratings' },
                    avgPrice: { $avg: '$price' },
                    minPrice: { $min: '$price' },
                    maxPrice: { $max: '$price' },
                    priceTotal: { $sum: '$price' },
                    movieCount: { $sum: 1 }
                }
            },
            {
                $sort: { minPrice: 1 }
            },
            {
                $match : {minPrice: {$gte: 60}}
            }
        ]);

        res.status(200).json({
            status: 'success',
            count: stats.length,
            data: {
            stats
            }
        });
    }
    catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err.message
        });
    }
}

exports.getMovieByGenre = async (req, res) => {
    try {
        const genre = req.params.genre;
        const movies = await Movie.aggregate([
            { $unwind: '$genres' },
            {
                $group: {
                    _id: '$genres',
                    movieCount: { $sum: 1 },
                    movies: { $push: '$name' },
                }
            },
            { $addFields: { genre: "$_id" } },
            { $project: { _id: 0 } },
            { $sort: { movieCount: -1 } },
            //{$limit: 6}
            //{$match: {genre: genre}}
        ]);
        res.status(200).json({
            status: 'success',
            length: movies.length,
            data: {
                movies
            }
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err.message
        });
    }
}
