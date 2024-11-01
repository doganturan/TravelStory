require('dotenv').config();
const path = require('path');
const config = require('./config.json');
const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const authRouter = require('./routes/auth.js');
const travelStoryRouter = require('./routes/travelStory.js');


const app = express();
app.use(express.json());
app.use(cors({ origin: "*" }));

app.use('/', authRouter);
app.use('/', travelStoryRouter);

// Serving uploaded files
app.use('/uploads', express.static(path.join(__dirname, "uploads")));
app.use('/assets', express.static(path.join(__dirname, "assets")));

const PORT = process.env.PORT || 8000;
mongoose.connect(config.connectionString);

app.listen(PORT, () => {
    console.log("Server is running on port:", PORT);
});

module.exports = app; // ?