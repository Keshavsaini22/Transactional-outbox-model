const amqp = require('amqplib')
const config = require('../config/rabbit')

class Producer {
    channel;

    async createChannel() {
        const connection = await amqp.connect(config.rabbitMQ.url);
        this.channel = await connection.createChannel();
    }

    async publishMessage(routingKey, message, signature) {
        if (!this.channel) {
            await this.createChannel()
        }
        const exchangeName = config.rabbitMQ.exchangeName;
        await this.channel.assertExchange(exchangeName, "direct");
        const properties = { type: signature };
        const logDetails = {
            key: routingKey,
            message: message,
            dateTime: new Date(),
        }
        await this.channel.publish(
            exchangeName,
            routingKey,
            Buffer.from(JSON.stringify(logDetails)),
            properties
        );

        console.log(`the message ${message} is sent to exchange ${exchangeName} and routing key is ${routingKey}`);
    }

}
module.exports = Producer;