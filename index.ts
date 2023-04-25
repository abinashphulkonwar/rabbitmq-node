import amqp from "amqplib/callback_api";
import { randomUUID } from "crypto";

console.log(process.env.AMQP);

amqp.connect(`amqp://${process.env.AMQP}`, (err, connection) => {
  if (err) {
    throw err;
  }
  console.log("Connected to RabbitMQ");
  connection.createChannel(function (error1, channel) {
    if (error1) {
      throw error1;
    }
    const queue = "job";
    const msg = "data 🚀";

    channel.assertQueue(queue, {
      durable: true,
    });
    const addMessages = async () => {
      for (let i = 0; i <= 10; i++) {
        await new Promise((resolve) => setTimeout(resolve, 400));

        const message = msg + " " + i + " " + randomUUID() + " " + new Date();
        channel.sendToQueue(queue, Buffer.from(message));
        console.log(" [x] Sent %s", message);
      }
    };
    addMessages();
    channel.consume(
      queue,
      async function (msg) {
        await new Promise((resolve) => setTimeout(resolve, 200));

        console.log("worker 1 [x] Received %s", msg?.content.toString(), queue);
      },
      {
        noAck: true,
      }
    );
    channel.consume(
      queue,
      async function (msg) {
        await new Promise((resolve) => setTimeout(resolve, 200));

        console.log("worker 2 [x] Received %s", msg?.content.toString(), queue);
      },
      {
        noAck: true,
      }
    );
  });
});
