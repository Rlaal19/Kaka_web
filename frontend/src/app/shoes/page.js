'use client';

import { useState, useEffect } from 'react';

export default function ShoesPage() {
  const [formData, setFormData] = useState({
    id: '',
    brand: '',
    name: '',
    sale_price: '',
    rating: '',
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
      const res = await fetch('/api/shoes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: 'shoes',
          message: {
            id: formData.id,
            brand: formData.brand,
            name: formData.name,
            sale_price: parseInt(formData.sale_price),
            rating: parseFloat(formData.rating),
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
      <h1 className="text-xl text-base-100 mb-5">Send Shoe Info to Kafka</h1>

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

      {['id', 'brand', 'name', 'sale_price', 'rating'].map((field) => (
        <fieldset className="fieldset" key={field}>
          <legend className="fieldset-legend text-base-100">
            Input {field.replace('_', ' ').toUpperCase()}
          </legend>
          <input
            type="text"
            className="input mb-2 input-primary"
            name={field}
            value={formData[field]}
            onChange={handleChange}
            placeholder={`Enter ${field}`}
          />
        </fieldset>
      ))}

      <button onClick={sendMessage} className="btn btn-soft btn-primary">
        Send
      </button>
    </div>
  );
}
