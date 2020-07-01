require('./config/config');

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

// routes 
app.use(require('./routes/index'));


const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
    autoIndex: false, // Don't build indexes
    poolSize: 10, // Maintain up to 10 socket connections
    serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
    socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
    family: 4 // Use IPv4, skip trying IPv6
};

//mongoose.connect('mongodb://localhost:27017/cafe', options).then(
mongoose.connect(process.env.URLDB, options).then(
    () => { /** ready to use. The `mongoose.connect()` promise resolves to mongoose instance. */
        console.log("Base de datos ONLINE");
    },
    err => { throw err; }
);
/* mongoose.connect('mongodb://localhost:27017/cafe', (err, res) => {

    if (err) throw err;

    console.log("Base de datos ONLINE");

}); */

app.listen(process.env.PORT, () => {
    console.log(`Escuchando peticiones en el puerto`, process.env.PORT);
});