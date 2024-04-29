const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
require("dotenv").config();
const Consumer = require('./worker/Consumer')

connectDB()

const app = express();
const consumer = new Consumer();
consumer.consumeMessage() 

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.text());
app.use(cors());

app.listen(process.env.PORT, () => {
    console.log(`App is running on port ${process.env.PORT}`);
});