import React from 'react';

const Test = () => {
  return (
    <div style={{ 
      padding: '20px', 
      fontFamily: 'Arial', 
      fontSize: '18px',
      backgroundColor: '#f0f0f0',
      minHeight: '100vh'
    }}>
      <h1>✅ Site Fonctionnel - Test Page</h1>
      <p>Date/Heure: {new Date().toLocaleString('fr-FR')}</p>
      <p>Si vous voyez ce message, le site fonctionne correctement.</p>
      <a href="/" style={{ color: 'blue', textDecoration: 'underline' }}>
        Retour à l'accueil
      </a>
    </div>
  );
};

export default Test;
