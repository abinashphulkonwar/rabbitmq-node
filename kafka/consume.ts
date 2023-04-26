import { Kafka } from "kafkajs";

const handler = async () => {
  const kafka = new Kafka({
    clientId: "my-app",
    brokers: [`${process.env.KAFKA_HOST}:9092`],
  });

  const consumer = kafka.consumer({
    groupId: "test",
  });
  await consumer.connect();
  console.log("connected 🚀");
  consumer.subscribe({
    topic: "job",
    fromBeginning: true,
  });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      console.log({
        topic: topic,
        partition,
        offset: message.offset,
        value: message?.value?.toString(),
      });
      await consumer.commitOffsets([
        {
          topic: topic,
          partition,
          offset: message.offset,
        },
      ]);
    },
  });

  console.log("consumering successfully");
};

handler();
