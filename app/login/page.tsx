'use client';

import Login from '@/src/components/Login';
import { useAuth } from '@/src/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function LoginPage() {
  const { isAuthenticated, login, isLoading } = useAuth(); // Utiliser login du contexte, et isLoading
  const router = useRouter();

  useEffect(() => {
    // Ne pas rediriger si isLoading est true, attendre que l'état d'auth soit déterminé
    if (!isLoading && isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, isLoading, router]);

  const handleLoginSuccess = (userData: { email: string }, token: string) => {
    login(userData, token); // Appeler la fonction login du contexte avec le token
    // La redirection est maintenant gérée par Login.jsx après l'appel de cette fonction
    // ou par le useEffect ci-dessus si l'état isAuthenticated change.
  };

  // Si l'authentification est en cours de vérification, ou si déjà authentifié et en cours de redirection
  if (isLoading || isAuthenticated) {
    return <p>Chargement...</p>; // Ou un spinner/skeleton screen
  }

  return (
    <div style={{ fontFamily: 'sans-serif', display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: '#f0f2f5' }}>
      <div style={{ backgroundColor: '#fff', padding: '2rem', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)', width: '100%', maxWidth: '400px' }}>
        <Login onLoginSuccess={handleLoginSuccess} />
      </div>
    </div>
  );
} 