'use client';

// import { useEffect } from 'react';
// import { useRouter } from 'next/navigation';
import Image from "next/image";
import styles from "./page.module.css";
import { useAuth } from "@/src/context/AuthContext"; // Pour accéder à l'état d'authentification
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();
  const { isAuthenticated, user, isLoading, logout } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading || !isAuthenticated) {
    return <p>Chargement ou redirection...</p>; 
  }

  return (
    <main className={styles.main}>
      <div className={styles.description}>
        <p>
          <code className={styles.code}>
            {user?.firstName ? `Bonjour ${user.firstName} !` : 'Bienvenue sur votre Portfolio !'}
            <br />
            {user?.email ? `Connecté en tant que: ${user.email}` : 'Vous êtes connecté.'}
            {user?.roles && <><br />Rôles: {user.roles.join(', ')}</>}
          </code>
        </p>
        <div>
          <button 
            onClick={() => {
              logout();
              router.push('/login'); // Optionnel: rediriger vers login après déconnexion
            }}
            style={{ padding: '10px 20px', marginTop: '20px', cursor: 'pointer' }}
          >
            Se déconnecter
          </button>
        </div>
        <div style={{ marginTop: '50px' }}>
          <a
            href="https://vercel.com?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            By{" "}
            <Image
              src="/vercel.svg"
              alt="Vercel Logo"
              className={styles.vercelLogo}
              width={100}
              height={24}
              priority
            />
          </a>
        </div>
      </div>

      {/* ... Reste du contenu de la page d'accueil ... */}
      
    </main>
  );
}
