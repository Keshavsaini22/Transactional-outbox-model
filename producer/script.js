const OutboxModel = require('./model/OutboxModel')
require("dotenv").config();
const connectDB = require('./config/db');
const Producer = require('./wokers/Producer')

connectDB();
const produce = new Producer()

async function produceMessage() {
    try {
        const res = await OutboxModel.find({ status: 'PENDING' })
        res.map(async (item) => {
            produce.publishMessage(item.routingKey, item.body, item.type)
            const output = await OutboxModel.findByIdAndUpdate(item._id, { status: 'SUCCESS' }, { new: true })
            console.log('output: ', output);
        })
    } catch (e) {
        console.log('e: ', e.message);

    }
}

produceMessage()