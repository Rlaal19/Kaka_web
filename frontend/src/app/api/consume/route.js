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

    // เริ่มการส่งข้อมูลแบบ SSE
    const stream = new ReadableStream({
      start(controller) {
        consumer.run({
          eachMessage: async ({ message }) => {
            const value = message.value.toString();
            console.log("✅ Received:", value);

            // ส่งข้อมูลไปยัง client แบบ SSE
            controller.enqueue(`data: ${JSON.stringify({ value })}\n\n`);
          },
        });
      },
      cancel() {
        consumer.disconnect();
      }
    });

    // สร้าง response แบบ SSE
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
