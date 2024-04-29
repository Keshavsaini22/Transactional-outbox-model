const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
require("dotenv").config();
const UserModel = require('./model/UserModel')
const OutboxModel = require('./model/OutboxModel')

const Producer = require('./wokers/Producer')

connectDB() 

const produce = new Producer()

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.text());
app.use(cors());

app.post('/add', async (req, res) => {
    const { name, email } = req.body
    console.log('name: ', name, email);
    const output = await UserModel.create({ name, email })
    // produce.publishMessage("MyMessage",output,"signature")
    const message = await OutboxModel.create({ type: "signature", status: 'PENDING', body: output, routingKey: "MyMessage" })
    console.log('message: ', message);
    res.json(output)
})

app.listen(process.env.PORT, () => {
    console.log(`App is running on port ${process.env.PORT}`);
}); 