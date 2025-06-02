'use client';

import ProjectList from '@/app/components/ProjectList';
import { useAuth } from '@/app/context/AuthContext';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import Link from 'next/link'; // Ajouté pour le lien de retour

const AllProjectsPage: React.FC = () => {
  const { isAuthenticated, user, isLoading } = useAuth(); // Ajout de user
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 border-t-orange-500 mx-auto"></div>
          <p className="text-gray-600 font-medium">Chargement des informations utilisateur...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-orange-50">
      {/* Navigation simulée ou réutilisée - Pour l'instant, simple */}
      <nav className="bg-white/80 backdrop-blur-lg shadow-md sticky top-0 z-50 border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <Link href="/" className="text-3xl font-bold tracking-tight bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent hover:from-orange-600 hover:to-orange-700 transition-all duration-300">
                IIM Portfolio
            </Link>
            <div className="flex items-center space-x-4">
              {user?.firstName && (
                <span className="text-gray-700 font-semibold hidden sm:block">
                  Bienvenue, {user.firstName}
                </span>
              )}
              <Link 
                href="/"
                className="px-5 py-2.5 text-sm font-semibold rounded-xl text-white bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
              >
                Accueil
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <header className="pt-12 pb-8 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-extrabold tracking-tight text-gray-900">
            <span className="block bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
              Tous nos projets
            </span>
          </h1>
          <p className="mt-6 text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Explorez la collection complète des travaux innovants et créatifs réalisés par les étudiants de l'IIM Digital School.
          </p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Le composant ProjectList gère son propre état de chargement/erreur/affichage */}
        <ProjectList />
      </main>

      <footer className="bg-gray-800 text-white mt-16 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p>&copy; {new Date().getFullYear()} IIM Digital School. Tous droits réservés.</p>
          <p className="text-sm text-gray-400 mt-2">
            Portfolio des Projets Étudiants
          </p>
        </div>
      </footer>
    </div>
  );
};

export default AllProjectsPage; 