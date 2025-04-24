'use client';

import { useState } from 'react';

export default function ProducerMessagePage() {
  const [topic, setTopic] = useState('');
  const [message, setMessage] = useState('');
  const [response, setResponse] = useState(null);
  const [status, setStatus] = useState(null);

  const sendMessage = async () => {
    try {
      const res = await fetch('/api/produce', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, topic }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setStatus('success');
      } else {
        setStatus('error');
      }

      setResponse(data);
    } catch (err) {
      console.error(err);
      setStatus('error');
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1 className="text-base-100 mb-5">Send Message to Kafka</h1>

      {status === 'success' && (
        <div role="alert" className="alert alert-success alert-soft mb-4">
          <span>Your message has been sent successfully!</span>
        </div>
      )}

      {status === 'error' && (
        <div role="alert" className="alert alert-error alert-soft mb-4">
          <span>Error! Message could not be sent.</span>
        </div>
      )}

      <fieldset className="fieldset">
        <legend className="fieldset-legend text-base-100">Input Your Topic</legend>
        <input
          type="text"
          className="input mb-2 input-primary"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="Enter Topic"
        />
      </fieldset>

      <fieldset className="fieldset">
        <legend className="fieldset-legend text-base-100">Input Your Message</legend>
        <input
          type="text"
          className="input mb-2 input-primary"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Enter message"
        />
      </fieldset>

      <button onClick={sendMessage} className="btn btn-soft btn-primary">
        Send
      </button>
    </div>
  );
}
