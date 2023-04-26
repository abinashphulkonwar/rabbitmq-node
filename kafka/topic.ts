import { Kafka } from "kafkajs";

const createTopic = async () => {
  const kafka = new Kafka({
    clientId: "my-app",
    brokers: [`${process.env.KAFKA_HOST}:9092`],
  });

  const admin = kafka.admin();
  await admin.connect();

  await admin.createTopics({
    topics: [
      {
        topic: "job",
        numPartitions: 2,
      },
    ],
  });
  console.log("Topic created successfully");
  await admin.disconnect();
};

createTopic();
