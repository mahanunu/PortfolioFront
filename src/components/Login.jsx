'use client'; // Nécessaire pour les hooks de Next.js et React

import { useState } from 'react';
import { useRouter } from 'next/navigation'; // Remplacer react-router-dom

// Props: onLoginSuccess est fournie par LoginPage
function Login({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // L'URL pour json_login est /api/auth (ou l'URL complète vers votre backend)
      // La réécriture de Next.js /api/* -> http://localhost:8000/api/* devrait fonctionner
      const response = await fetch('/api/auth', { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', // Changer pour application/json
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          email: email, // correspond à username_path
          password: password, // correspond à password_path
        }),
      });

      const data = await response.json();

      if (response.ok) {
        if (data.token) {
          // Appeler le callback fourni par LoginPage
          onLoginSuccess({ email: email }, data.token);
          router.push('/');
        } else {
          setError('Token non reçu après la connexion.');
        }
      } else {
        if (data.message) {
          setError(data.message); // Le message d'erreur de LexikJWTAuthenticationBundle
        } else if (data.error) {
            setError(data.error.message || 'Erreur d\'authentification inconnue.');
        } else {
          setError('La connexion a échoué. Code: ' + response.status);
        }
      }
    } catch (err) {
      setError('Une erreur réseau est survenue. Veuillez réessayer.');
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h2 style={{ textAlign: 'center', color: '#333', marginBottom: '1.5rem' }}>Connexion</h2>
      {error && <p style={{ color: 'red', marginBottom: '1rem', textAlign: 'center' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="email" style={{ display: 'block', marginBottom: '0.5rem', color: '#555', fontWeight: 'bold' }}>Email :</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: '100%', padding: '0.75rem', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box' }}
          />
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="password" style={{ display: 'block', marginBottom: '0.5rem', color: '#555', fontWeight: 'bold' }}>Mot de passe :</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: '100%', padding: '0.75rem', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box' }}
          />
        </div>
        <button 
          type="submit" 
          disabled={isLoading}
          style={{
            width: '100%',
            padding: '0.75rem',
            backgroundColor: isLoading ? '#ccc' : '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            fontSize: '1rem',
            fontWeight: 'bold'
        }}
        >
          {isLoading ? 'Connexion en cours...' : 'Se connecter'}
        </button>
      </form>
    </div>
  );
}

export default Login; 