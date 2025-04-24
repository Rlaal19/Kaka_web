import { Kafka } from 'kafkajs';

export async function POST(req) {
  const body = await req.json();
  const { topic } = body;

  const kafka = new Kafka({
    clientId: 'nextjs-consumer',
    brokers: ['138.2.71.167:9092'],
  });

  const consumer = kafka.consumer({ groupId: 'nextjs-group-' + Math.random() });

  const messages = [];

  try {
    await consumer.connect();
    await consumer.subscribe({ topic, fromBeginning: true });

    // ให้ consumer รัน และรอรับ message
    await consumer.run({
      eachMessage: async ({ message }) => {
        const value = message.value.toString();
        messages.push(value);
        console.log("✅ Received:", value);
      },
    });

    // รอ 3 วิ ให้ message มา
    await new Promise((resolve) => setTimeout(resolve, 3000));

    await consumer.disconnect();

    return new Response(JSON.stringify({ messages }), { status: 200 });
  } catch (err) {
    console.error("❌ Consumer Error:", err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
