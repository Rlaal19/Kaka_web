'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

export default function Message() {
  const [topic, setTopic] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [eventSource, setEventSource] = useState(null);

  const searchParams = useSearchParams();

  useEffect(() => {
    const topicFromURL = searchParams.get('topic');
    if (topicFromURL) {
      setTopic(topicFromURL);
      startSSE(topicFromURL);
    }
  }, [searchParams]);

  const startSSE = (newTopic) => {
    if (eventSource) {
      eventSource.close();
    }

    const newEventSource = new EventSource(`/api/consume?topic=${newTopic}`);
    newEventSource.onmessage = function (event) {
      const data = JSON.parse(event.data);

      setMessages((prevMessages) => {
        if (!prevMessages.includes(data.value)) {
          return [...prevMessages, data.value];
        }
        return prevMessages;
      });
    };

    newEventSource.onerror = function (error) {
      console.error("Error with SSE:", error);
    };

    setEventSource(newEventSource);
  };

  const fetchMessages = async (t = topic) => {
    setLoading(true);
    const res = await fetch(`/api/consume?topic=${t}`, {
      method: 'GET',
    });
    if (!res.ok) {
      console.error('Error fetching messages:', res.statusText);
      setLoading(false);
      return;
    }
    const data = await res.json();
    setMessages(data.messages || []);
    setLoading(false);
  };

  return (
    <div className="pt-4 px-4">
      <div className="flex flex-col items-center">
        <h1 className="text-3xl text-base-100 font-bold mb-3">Kafka Consumer</h1>
        <div className="flex items-center gap-3 w-full max-w-xl">
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
          <button className="btn btn-primary" onClick={() => fetchMessages()}>Subscribe</button>
        </div>
      </div>

      {messages.length > 0 && (
        <div className="mt-10">
          <div className="chat chat-start mb-4">
            <div className="chat-bubble chat-bubble-primary rounded-4xl">
              Total messages: {messages.length}
            </div>
          </div>

          {/* ✅ Scrollable message container */}
          <div className="space-y-4 max-h-[500px] overflow-y-auto pl-100 pr-2">
            {messages.map((msg, index) => {
              let parsed;
              try {
                parsed = JSON.parse(msg);
              } catch {
                parsed = msg;
              }

              return (
                <div
                  key={index}
                  className="bg-base-200 p-4 rounded-xl shadow-md text-sm font-mono whitespace-pre-wrap break-words"
                >
                  {typeof parsed === 'object' ? (
                    <pre>{JSON.stringify(parsed, null, 2)}</pre>
                  ) : (
                    parsed
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
