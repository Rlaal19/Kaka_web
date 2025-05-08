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
      async start(controller) {
        await consumer.run({
          // ✅ ปิด autoCommit เพื่อควบคุมเอง
          autoCommit: false,
          eachMessage: async ({ topic, partition, message }) => {
            const value = message.value.toString();
            const offset = message.offset;
            const key = message.key ? message.key.toString() : null;

            console.log("✅ Received:", { partition, offset, key, value });

            // ✅ ส่ง message ไปยัง client
            controller.enqueue(`data: ${JSON.stringify({ key, value })}\n\n`);

            // ✅ ทำ manual commit เฉพาะเมื่อส่ง client เสร็จ
            await consumer.commitOffsets([
              {
                topic,
                partition,
                offset: (parseInt(offset) + 1).toString(), // +1
              },
            ]);
          },
        });
      },
      cancel() {
        consumer.disconnect();
      },
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
