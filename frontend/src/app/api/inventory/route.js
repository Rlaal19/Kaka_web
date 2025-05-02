import { Kafka } from 'kafkajs';

const kafka = new Kafka({
  clientId: 'nextjs-producer',
  brokers: ['138.2.71.167:9092'],
});

const producer = kafka.producer();

export async function POST(req) {
  try {
    const { topic, message } = await req.json();
    await producer.connect();
    await producer.send({
      topic,
      messages: [
        {
          key: message.product_id,
          value: JSON.stringify(message),
        },
      ],
    });
    await producer.disconnect();

    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('Kafka produce error:', err);
    return new Response(JSON.stringify({ success: false, error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
