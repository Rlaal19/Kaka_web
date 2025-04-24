import { Kafka } from 'kafkajs';

const kafka = new Kafka({
  clientId: 'nextjs-producer',
  brokers: ['138.2.71.167:9092'],
});

const producer = kafka.producer();

export async function POST(req) {
  try {
    const body = await req.json();
    const { message,topic } = body;

    if (!message) {
      return new Response(JSON.stringify({ error: 'Message is required' }), {
        status: 400,
      });
    }

    await producer.connect();
    await producer.send({
      topic: topic,
      messages: [{ value: message }],
    });
    await producer.disconnect();

    return new Response(JSON.stringify({ success: true, message }), {
      status: 200,
    });
  } catch (err) {
    console.error('Kafka error:', err);
    return new Response(JSON.stringify({ error: 'Kafka error' }), {
      status: 500,
    });
  }
}
