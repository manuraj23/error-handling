



const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config({ path: './config.env' });

const app = require('./10.Creating_Route_Modules');

// Check environment
console.log(app.get('env'));
console.log(process.env);


//for local connection
// mongoose.connect(process.env.LOCAL_CONN_STR, {
//     useNewUrlParser: true
// }).then((conn) => {
//     // console.log(conn);
//     console.log('DB connection successful!')
// }); 

// MongoDB connection
mongoose.connect(process.env.CONN_STR, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('DB connection successful!');
}).catch((err) => {
    console.log('Error connecting to DB:', err.message);
});





// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`App running on port ${port}...`);
});
