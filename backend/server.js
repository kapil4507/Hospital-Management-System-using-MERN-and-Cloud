const mongoose = require('mongoose');
const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config(); //load vars from .env file for securing the api link
require('dns').setDefaultResultOrder('ipv4first');
//Frontend will try to connect to the backend from these URLs, only specified URLs will be allowed to connect.
//If we deploy the frontend to AWS EC2, we will need to add its URL to this list.
app.use(cors({
    origin: '*' // Allow all origins to prevent blocking during AWS deployment
    //origin: ['http://localhost:5173','http://localhost:3000', 'https://your-aws-frontend-url.com']
}));

app.use(express.json());

const MONGO_URL = process.env.MONGO_URL;

mongoose.connect(MONGO_URL)
    .then(() => console.log("Database connected successflly."))
    .catch((error) => console.error("Connection error.", error));

app.use('/api/patients', require('./routes/patient'));
app.use('/api/doctors', require('./routes/doctor'));
app.use('/api/appointments', require('./routes/appointment'));
app.use('/api/reports', require('./routes/reports'));

app.get('/', (req, res) => {
    res.send("Welcome to Hospital management system.");
});

const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});