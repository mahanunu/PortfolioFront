'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

// Interface pour un projet (vous pouvez l'étendre ou la réutiliser si elle existe ailleurs)
interface Project {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  isPublished?: boolean;
  projectUrl: string;
  year: string;
  isViewable?: boolean;
  // Ajoutez d'autres champs si nécessaire, comme les étudiants, technologies, etc.
}

interface ApiResponse {
  'hydra:member'?: Project[];
  member?: Project[]; // Au cas où le format de réponse varie
}

const ManageProjectsPage: React.FC = () => {
  const { user, isAuthenticated, isLoading: authIsLoading } = useAuth();
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loadingProjects, setLoadingProjects] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authIsLoading && (!isAuthenticated || !user?.roles?.includes('ROLE_ADMIN'))) {
      router.push('/login');
    }
  }, [authIsLoading, isAuthenticated, user, router]);

  useEffect(() => {
    if (isAuthenticated && user?.roles?.includes('ROLE_ADMIN')) {
      const token = localStorage.getItem('jwtToken');
      if (!token) {
        setError('Token d\'authentification non trouvé.');
        setLoadingProjects(false);
        return;
      }

      setLoadingProjects(true);
      fetch('http://localhost:8000/api/projects', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/ld+json',
        },
      })
      .then(async (response) => {
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ detail: `Erreur HTTP ! statut: ${response.status}` }));
          throw new Error(errorData.detail || `Erreur HTTP ! statut: ${response.status}`);
        }
        return response.json() as Promise<ApiResponse>;
      })
      .then((data) => {
        setProjects(data['hydra:member'] || data.member || []);
        setLoadingProjects(false);
      })
      .catch((err) => {
        console.error("Erreur lors de la récupération des projets:", err);
        setError(err.message);
        setLoadingProjects(false);
      });
    }
  }, [isAuthenticated, user]);

  const toggleProjectViewable = async (projectId: number, currentIsViewable: boolean | undefined) => {
    if (typeof currentIsViewable === 'undefined') return;

    const token = localStorage.getItem('jwtToken');
    if (!token) {
      alert('Session expirée ou token manquant. Veuillez vous reconnecter.');
      return;
    }

    try {
      const response = await fetch(`http://localhost:8000/api/projects/${projectId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/merge-patch+json',
          'Accept': 'application/ld+json',
        },
        body: JSON.stringify({ isViewable: !currentIsViewable }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: 'Erreur lors de la mise à jour' }));
        throw new Error(errorData.detail || errorData.title || 'Erreur lors de la mise à jour de la visibilité.');
      }
      // Mettre à jour l'état local des projets pour refléter le changement
      setProjects(prevProjects => 
        prevProjects.map(p => 
          p.id === projectId ? { ...p, isViewable: !currentIsViewable } : p
        )
      );
    } catch (err: any) {
      console.error('Erreur lors du changement de visibilité:', err);
      alert(`Erreur : ${err.message}`);
    }
  };
  
  const deleteProject = async (projectId: number) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce projet ? Cette action est irréversible.")) {
      return;
    }

    const token = localStorage.getItem('jwtToken');
    if (!token) {
      alert('Session expirée ou token manquant. Veuillez vous reconnecter.');
      return;
    }

    try {
      const response = await fetch(`http://localhost:8000/api/projects/${projectId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.status === 204) { // No Content, suppression réussie
        setProjects(prevProjects => prevProjects.filter(p => p.id !== projectId));
        alert('Projet supprimé avec succès.');
      } else if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: 'Erreur lors de la suppression' }));
        throw new Error(errorData.detail || errorData.title || 'Erreur lors de la suppression du projet.');
      } else {
        // Si la réponse est ok mais pas 204, c'est un peu étrange pour un DELETE, mais on met à jour quand même
        setProjects(prevProjects => prevProjects.filter(p => p.id !== projectId));
         alert('Projet supprimé (status inconnu mais OK).');
      }
    } catch (err: any) {
      console.error('Erreur lors de la suppression du projet:', err);
      alert(`Erreur : ${err.message}`);
    }
  };


  if (authIsLoading || !isAuthenticated || !user?.roles?.includes('ROLE_ADMIN')) {
    // Le useEffect gère déjà la redirection, mais on affiche un chargement en attendant
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-orange-500"></div>
        <p className="ml-4 text-gray-700">Chargement ou vérification des droits...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8 flex justify-between items-center">
        <div>
            <h1 className="text-4xl font-bold text-gray-800">Gérer les Projets</h1>
            <p className="text-gray-600">Liste de tous les projets. Modifiez leur visibilité ou supprimez-les.</p>
        </div>
        <Link href="/admin/projects/new" legacyBehavior>
          <a className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded transition duration-300 ease-in-out shadow-md hover:shadow-lg">
            Nouveau Projet
          </a>
        </Link>
      </header>

      {loadingProjects && (
        <div className="text-center py-10">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-orange-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Chargement des projets...</p>
        </div>
      )}

      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6" role="alert">
          <p className="font-bold">Erreur</p>
          <p>{error}</p>
        </div>
      )}

      {!loadingProjects && !error && projects.length === 0 && (
        <p className="text-center text-gray-500 py-10">Aucun projet à gérer pour le moment.</p>
      )}

      {!loadingProjects && !error && projects.length > 0 && (
        <div className="overflow-x-auto bg-white shadow-md rounded-lg">
          <table className="min-w-full table-auto">
            <thead className="bg-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Titre</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Année</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Publié</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Visible (Public)</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {projects.map((project) => (
                <tr key={project.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Link href={`/project/${project.id}`} legacyBehavior>
                      <a className="text-sm font-medium text-orange-600 hover:text-orange-800">{project.title}</a>
                    </Link>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{project.year}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${project.isPublished ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {project.isPublished ? 'Oui' : 'Non'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button 
                      onClick={() => toggleProjectViewable(project.id, project.isViewable)}
                      className={`px-3 py-1 text-xs font-semibold rounded-full transition-colors duration-300 
                        ${project.isViewable ? 'bg-blue-500 hover:bg-blue-600 text-white' : 'bg-gray-300 hover:bg-gray-400 text-gray-800'}`}>
                      {project.isViewable ? 'Oui' : 'Non'} (Changer)
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <Link href={`/admin/projects/edit/${project.id}`} legacyBehavior> 
                      <a className="text-indigo-600 hover:text-indigo-900 mr-3">Éditer</a>
                    </Link>
                    <button onClick={() => deleteProject(project.id)} className="text-red-600 hover:text-red-900">
                      Supprimer
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ManageProjectsPage; 