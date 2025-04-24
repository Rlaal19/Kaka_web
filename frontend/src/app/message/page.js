'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';


export default function Message() {
  const [topic, setTopic] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const searchParams = useSearchParams();

  useEffect(() => {
    const topicFromURL = searchParams.get('topic');
    if (topicFromURL) {
      setTopic(topicFromURL);
      fetchMessages(topicFromURL);
    }
  }, [searchParams]);

  const fetchMessages = async (t = topic) => {
    setLoading(true);
    const res = await fetch('/api/consume', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ topic: t }),
    });
    const data = await res.json();
    setMessages(data.messages || []);
    setLoading(false);
  };

  return (
    <div className="pt-10 px-4">
      <div className="flex flex-col items-center">
        <h1 className="text-3xl text-base-100 font-bold mb-6">Kafka Consumer</h1>
        <div className="flex items-center gap-4 w-full max-w-xl">
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Enter topic name"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="input input-primary w-full pr-12"
            />
            {loading && (
              <span className="loading loading-spinner absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-primary" />
            )}
          </div>
          <button className="btn btn-primary" onClick={() => fetchMessages()}>Fetch</button>
        </div>
      </div>

      {messages.length > 0 && (
        <div className="mt-10 ">
          <div className="chat chat-start">
            <div className="chat-bubble chat-bubble-primary rounded-4xl">
              Messages from topic: {topic}
            </div>
          </div>
          <div className="chat chat-end">
            <div className="chat-bubble chat-bubble-info rounded-4xl">
              <ul className="list-disc list-inside">
                {messages.map((msg, index) => (
                  <li key={index}>{msg}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
