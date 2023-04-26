import { Kafka } from "kafkajs";

const publish = async () => {
  const kafka = new Kafka({
    clientId: "my-app",
    brokers: [`${process.env.KAFKA_HOST}:9092`],
  });

  const producer = kafka.producer();
  await producer.connect();
  console.log("connected 🚀");
  await producer.send({
    topic: "job",
    messages: [
      {
        value: "Kafka partition 0 🚀 " + new Date(),
        key: "key1",
        partition: 0,
      },
    ],
  });
  await producer.send({
    topic: "job",
    messages: [
      {
        value: "Kafka partition 1 🚀 " + new Date(),
        key: "key2",
        partition: 1,
      },
    ],
  });
  console.log("send successfully");
  await producer.disconnect();
};

publish();
