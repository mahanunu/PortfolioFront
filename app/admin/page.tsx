'use client';

import React from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const AdminPage: React.FC = () => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  React.useEffect(() => {
    if (!isLoading && (!isAuthenticated || !user?.roles?.includes('ROLE_ADMIN'))) {
      router.push('/login'); // Rediriger si non admin ou non authentifié
    }
  }, [isLoading, isAuthenticated, user, router]);

  if (isLoading || !isAuthenticated || !user?.roles?.includes('ROLE_ADMIN')) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-orange-500"></div>
        <p className="ml-4 text-gray-700">Chargement ou vérification des droits...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800">Tableau de Bord Administrateur</h1>
        <p className="text-gray-600">Bienvenue sur l'espace d'administration.</p>
      </header>

      <nav className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link href="/admin/manage-projects" legacyBehavior>
          <a className="block p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
            <h2 className="text-2xl font-semibold text-orange-600 mb-2">Gérer les Projets</h2>
            <p className="text-gray-700">Consulter, modifier, ajouter ou supprimer des projets.</p>
          </a>
        </Link>
        {/* Vous pouvez ajouter d'autres liens ici pour d'autres sections admin */}
        {/* Exemple :
        <Link href="/admin/manage-users" legacyBehavior>
          <a className="block p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
            <h2 className="text-2xl font-semibold text-orange-600 mb-2">Gérer les Utilisateurs</h2>
            <p className="text-gray-700">Consulter et gérer les comptes utilisateurs.</p>
          </a>
        </Link>
        */}
      </nav>
    </div>
  );
};

export default AdminPage; 