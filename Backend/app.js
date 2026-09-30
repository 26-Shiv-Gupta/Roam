const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const app = express();
const userRoutes = require('./routes/app.routes');
const captainRoutes = require('./routes/captain.routes');
const mapsRoutes = require('./routes/maps.routes');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const connectToDB = require('./db/db');
connectToDB();

app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.get('/', (req, res) => {
    res.send("Server is running...");
})
app.use('/users', userRoutes);
app.use('/captains', captainRoutes);
app.use('/maps', mapsRoutes)

module.exports = app;