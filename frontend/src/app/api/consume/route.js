import { Kafka } from 'kafkajs';

export async function GET(req) {
  const url = new URL(req.url);
  const topic = url.searchParams.get('topic');

  if (!topic) {
    return new Response('Topic is required', { status: 400 });
  }

  const kafka = new Kafka({
    clientId: 'nextjs-consumer',
    brokers: ['138.2.71.167:9092'],
  });

  const consumer = kafka.consumer({ groupId: 'nextjs-group-' + Math.random() });

  try {
    await consumer.connect();
    await consumer.subscribe({ topic, fromBeginning: true });

    const stream = new ReadableStream({
      start(controller) {
        consumer.run({
          eachMessage: async ({ topic, partition, message }) => {
            const value = message.value.toString();
            const offset = message.offset;

            console.log("✅ Received:", { partition, offset, value });

            // ส่ง value + partition + offset ไปยัง client
            controller.enqueue(`data: ${JSON.stringify({ value, partition, offset })}\n\n`);
          },
        });
      },
      cancel() {
        consumer.disconnect();
      }
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'Transfer-Encoding': 'chunked',
      },
    });
  } catch (err) {
    console.error("❌ Consumer Error:", err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
