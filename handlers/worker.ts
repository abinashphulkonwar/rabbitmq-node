import amqp from "amqplib";

const worker = async () => {
  const client = await amqp.connect(`amqp://${process.env.AMQP}`);

  const channel = await client.createChannel();

  const queue = "job";

  await channel.assertQueue(queue, {
    durable: true,
  });

  channel.consume(
    queue,
    async (msg) => {
      await new Promise((resolve) => setTimeout(resolve, 200));

      console.log("worker 1 [x] Received %s", msg?.content.toString(), queue);
      channel.ack(msg as amqp.Message);
    },
    {
      noAck: false,
    }
  );
};
