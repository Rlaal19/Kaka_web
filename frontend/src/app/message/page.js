'use client';

import { useState, useEffect, useRef } from 'react';
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
    console.log("DDDD");

    if (eventSource) {
      eventSource.close();
    }

    const newEventSource = new EventSource(`/api/consume?topic=${newTopic}`);
    newEventSource.onmessage = function (event) {
      const data = JSON.parse(event.data);
      console.log("Check =>", data.value);
      setMessages((prev) => [...prev, { key: data.key ?? null, value: data.value, partition: data.partition, offset: data.offset }]);
    };

    newEventSource.onerror = function (error) {
      console.error("Error with SSE:", error);
    };

    setEventSource(newEventSource);
  };

  const handleSubscribe = () => {
    window.location.href = `?topic=${encodeURIComponent(topic)}`;
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
          <button className="btn btn-primary" onClick={handleSubscribe}>
            Subscribe
          </button>
        </div>
      </div>

      {messages.length > 0 && (
        <div className="mt-10">
          <div className="chat chat-start mb-4">
            <div className="chat-bubble chat-bubble-primary rounded-4xl">
              Total messages: {messages.length}
            </div>
          </div>

          <div className="flex justify-end mt-10">


            <div className="space-y-4 max-h-[500px] overflow-y-auto w-2/3 pr-2">
              {messages.map((msg, index) => {
                let parsedValue;
                try {
                  parsedValue = JSON.parse(msg.value);
                } catch {
                  parsedValue = msg.value;
                }

                return (
                  <div
                    key={index}
                    className="bg-base-200 p-4 rounded-xl shadow-md text-sm font-mono whitespace-pre-wrap break-words"
                  >
                    <div className="text-xs text-gray-500 mb-2">
                      <strong>Partition:</strong> {msg.partition} | <strong>Offset:</strong> {msg.offset} | <strong>Key:</strong> {msg.key ?? 'null'} 
                    </div>
                    {typeof parsedValue === 'object' ? (
                      <pre>{JSON.stringify(parsedValue, null, 2)}</pre>
                    ) : (
                      parsedValue
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
