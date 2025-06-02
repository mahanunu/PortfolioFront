import React, { useState } from 'react';

function ContactForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Envoyer les données du formulaire à l'API
    fetch('/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, message }),
    })
      .then(response => response.json())
      .then(data => {
        setSuccess(true);
        setName('');
        setEmail('');
        setMessage('');
      })
      .catch(error => {
        setSuccess(false);
      });
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Contactez-nous</h2>
      <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Votre nom" required />
      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Votre email" required />
      <textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Votre message" required />
      <button type="submit">Envoyer</button>
      {success === true && <p>Message envoyé avec succès !</p>}
      {success === false && <p>Erreur lors de l'envoi du message.</p>}
    </form>
  );
}

export default ContactForm; 