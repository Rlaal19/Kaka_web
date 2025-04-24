import { Kafka } from 'kafkajs';

const kafka = new Kafka({
  clientId: 'nextjs-client',
  brokers: ['138.2.71.167:9092'],
});

const admin = kafka.admin();

export async function GET() {
  try {
    await admin.connect();
    const topics = await admin.listTopics();
    await admin.disconnect();

    return new Response(JSON.stringify({ topics }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to fetch topics' }), { status: 500 });
  }
}
