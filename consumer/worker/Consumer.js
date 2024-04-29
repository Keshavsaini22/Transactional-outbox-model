const amqp = require('amqplib')
const config = require('../config/rabbit')

class Consumer {
    async consumeMessage() {
        const connection = await amqp.connect(config.rabbitMQ.url)
        const channel = await connection.createChannel();

        await channel.assertExchange("producerExchange", "direct");
        const q = await channel.assertQueue("UserQueue");
        await channel.bindQueue(q.queue, "producerExchange", "MyMessage");

        channel.consume(q.queue, async (msg) => {
            try {
                const data = JSON.parse(msg?.content?.toString());
                console.log("DATATAATATATA", data.message);
                channel.ack(msg);
            } catch (error) {
                console.log(error.message);
                channel.nack(msg, false, false);
            }
        });
    }

}
module.exports = Consumer;