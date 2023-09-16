import React, { useState } from 'react';
import Modal from 'react-modal';
import '../css/QuoteModal.css';

function QuoteModal({ isOpen, onRequestClose }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleSubmit = async (e) => {
    alert(`${formData.name}, we will get back to you soon`);    
    e.preventDefault();
    onRequestClose();
    try {
      const response = await fetch('http://127.0.0.1:8000/submit-feedback/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        onRequestClose(); // Close the modal after successful submission
      } else {
        alert('Error submitting feedback');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  return (
    <Modal isOpen={isOpen} onRequestClose={onRequestClose}>
      <h2 className='Modalhead'>Chat With Us</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="name" placeholder="Name" value={formData.name} onChange={handleInputChange} />
        <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleInputChange} />
        <textarea name="message" placeholder="Message" value={formData.message} onChange={handleInputChange} />
        <button type="submit">Submit</button>
      </form>
    </Modal>
  );
}

export default QuoteModal;
