'use client';

import { useState, useEffect } from 'react';

export default function InventoryPage() {
  const [formData, setFormData] = useState({
    product_id: '',
    quantity: '',
    ts: '',
    update_by: '',
  });
  const [status, setStatus] = useState(null);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };
  useEffect(() => {
    if (status !== null) {
      const timer = setTimeout(() => {
        setStatus(null);
      }, 3000); // alert 3 วินาที

      return () => clearTimeout(timer);
    }
  }, [status]);
  const sendMessage = async () => {
    try {
      const res = await fetch('/api/inventory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: 'inventory',
          message: {
            product_id: formData.product_id,
            quantity: parseInt(formData.quantity),
            ts: Math.floor(new Date(formData.ts).getTime()), // ✅ timestamp in seconds
            update_by: formData.update_by,
          },
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setStatus('success');
      } else {
        setStatus('error');
      }
    } catch (err) {
      console.error(err);
      setStatus('error');
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-xl text-base-100 mb-5">Send Inventory Info to Kafka</h1>

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
        <legend className="fieldset-legend text-base-100">Product ID</legend>
        <input
          type="text"
          className="input mb-2 input-primary"
          name="product_id"
          value={formData.product_id}
          onChange={handleChange}
          placeholder="Enter product_id"
        />
      </fieldset>

      <fieldset className="fieldset">
        <legend className="fieldset-legend text-base-100">Quantity</legend>
        <input
          type="number"
          className="input mb-2 input-primary"
          name="quantity"
          value={formData.quantity}
          onChange={handleChange}
          placeholder="Enter quantity"
        />
      </fieldset>

      <fieldset className="fieldset">
        <legend className="fieldset-legend text-base-100">Timestamp</legend>
        <input
          type="datetime-local"
          className="input mb-2 input-primary"
          name="ts"
          value={formData.ts}
          onChange={handleChange}
        />
      </fieldset>

      <fieldset className="fieldset">
        <legend className="fieldset-legend text-base-100">Updated By</legend>
        <input
          type="text"
          className="input mb-2 input-primary"
          name="update_by"
          value={formData.update_by}
          onChange={handleChange}
          placeholder="Enter update_by"
        />
      </fieldset>

      <button onClick={sendMessage} className="btn btn-soft btn-primary">
        Send
      </button>
    </div>
  );
}
