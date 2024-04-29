const mongoose = require('mongoose')

const OutboxSchema = new mongoose.Schema({
    type: {
        type: String,
        required: true,
    },
    routingKey: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ['PENDING', 'SUCCESS', 'REJECTED']
    },
    // properties: {
    //     type: Object
    // },
    body: {
        type: Object
    }
}, { timestamps: true })
module.exports = mongoose.model("outbox", OutboxSchema)