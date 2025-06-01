'use client';

import Login from '@/src/components/Login'; // Assurez-vous que le chemin est correct
import { useAuth } from '@/src/context/AuthContext';
import { useRouter } from 'next/navigation'; // Utilisation de next/navigation
import { useEffect } from 'react';

export default function LoginPage() {
  const { isAuthenticated, login, setIsAuthenticated, setUser } = useAuth();
  const router = useRouter();

  // Si l'utilisateur est déjà authentifié, rediriger vers la page d'accueil
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, router]);

  // Le composant Login attend setIsAuthenticated et setUser directement
  // La fonction login du contexte peut être utilisée pour encapsuler la logique si nécessaire après l'appel API
  // Pour l'instant, nous passons directement setIsAuthenticated et setUser comme attendu par Login.jsx
  // et nous utiliserons la fonction login du contexte pour la sémantique et la mise à jour de l'utilisateur.

  const handleLoginSuccess = (userData: { email: string }) => {
    login(userData); // Met à jour l'état global via le contexte
    // La redirection est maintenant gérée par Login.jsx ou par l'effet ci-dessus
  };

  return (
    <div style={{ fontFamily: 'sans-serif', display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: '#f0f2f5' }}>
      <div style={{ backgroundColor: '#fff', padding: '2rem', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)', width: '100%', maxWidth: '400px' }}>
        {/* Le composant Login prend setIsAuthenticated et setUser comme props */}
        {/* Nous devons adapter cela pour qu'il utilise handleLoginSuccess ou modifier Login.jsx */}
        <Login setIsAuthenticated={setIsAuthenticated} setUser={setUser} />
      </div>
    </div>
  );
} 