'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';
import Link from 'next/link';

// Interface pour un projet (similaire à celle de ProjectList, mais peut être étendue si nécessaire)
interface Project {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  isPublished?: boolean;
  projectUrl: string;
  createdAt: string;
  updatedAt: string;
  year: string;
  isViewable?: boolean;
  // Potentiellement d'autres champs: students, technologies si vous les récupérez
}

const ProjectDetailPage: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const { isAuthenticated, user, isLoading: authIsLoading } = useAuth();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isUpdatingViewable, setIsUpdatingViewable] = useState<boolean>(false);

  const projectId = params.id as string; // L'ID vient des paramètres de la route
  const isAdmin = user?.roles?.includes('ROLE_ADMIN');

  useEffect(() => {
    if (!authIsLoading && !isAuthenticated) {
      router.push('/login');
      return;
    }

    if (isAuthenticated && projectId) {
      const token = localStorage.getItem('jwtToken');
      if (!token) {
        setError('Token d\'authentification non trouvé. Veuillez vous reconnecter.');
        setLoading(false);
        return;
      }

      setLoading(true);
      fetch(`http://localhost:8000/api/projects/${projectId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/ld+json', // ou 'application/json' si vous préférez
        },
      })
        .then(async (response) => {
          if (response.status === 401) {
            throw new Error('Non autorisé. Veuillez vérifier votre token ou vous reconnecter.');
          }
          if (response.status === 404) {
            throw new Error('Projet non trouvé.');
          }
          if (!response.ok) {
            throw new Error(`Erreur HTTP ! statut: ${response.status}`);
          }
          return response.json() as Promise<Project>; // Attend un seul objet Project
        })
        .then((data) => {
          setProject(data);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Erreur lors de la récupération du projet:", err);
          setError(err.message);
          setLoading(false);
        });
    }
  }, [projectId, isAuthenticated, authIsLoading, router]);

  const toggleViewableStatus = async () => {
    if (!project || !isAdmin || project.isViewable === undefined) return;

    const token = localStorage.getItem('jwtToken');
    if (!token) {
      alert('Session expirée ou token manquant. Veuillez vous reconnecter.');
      return;
    }

    setIsUpdatingViewable(true);

    try {
      const response = await fetch(`http://localhost:8000/api/projects/${project.id}`,
        {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/merge-patch+json',
            'Accept': 'application/ld+json',
          },
          body: JSON.stringify({ isViewable: !project.isViewable }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || errorData.title || `Erreur lors de la mise à jour de la visibilité.`);
      }

      const updatedProjectData = await response.json();
      setProject(updatedProjectData);
    } catch (err: any) {
      console.error(`Erreur lors du changement de visibilité:`, err);
      alert(`Erreur : ${err.message}`);
    } finally {
      setIsUpdatingViewable(false);
    }
  };

  if (authIsLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-orange-500"></div>
        <p className="ml-4 text-gray-700">Chargement du projet...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-red-50 p-4">
        <div className="bg-white p-8 rounded-lg shadow-xl text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Erreur</h2>
          <p className="text-red-700 mb-6">{error}</p>
          <Link 
            href="/projects"
            className="px-6 py-2 text-sm font-semibold rounded-md text-white bg-orange-500 hover:bg-orange-600 transition-colors"
          >
            Retour à la liste des projets
          </Link>
        </div>
      </div>
    );
  }

  if (!project) {
    // Cas où le projet n'est pas trouvé mais pas d'erreur explicite (devrait être couvert par le catch 404)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Projet non trouvé.</p>
        <Link href="/projects">Retour à la liste</Link>
      </div>
    );
  }

  // Affichage des détails du projet
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-orange-50 py-8 px-4 sm:px-6 lg:px-8">
      <nav className="max-w-5xl mx-auto mb-8">
        <Link 
          href="/projects"
          className="inline-flex items-center text-orange-600 hover:text-orange-700 group"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 transition-transform group-hover:-translate-x-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H15a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Retour à tous les projets
        </Link>
      </nav>

      <article className="max-w-5xl mx-auto bg-white shadow-2xl rounded-2xl overflow-hidden">
        {project.imageUrl && (
          <div className="w-full h-72 sm:h-96 lg:h-[500px] relative overflow-hidden">
            <img 
              src={project.imageUrl}
              alt={`Image pour ${project.title}`}
              className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
            />
          </div>
        )}
        <div className="p-6 sm:p-10 lg:p-12">
          <div className="mb-6">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-gray-900 mb-3">
              <span className="block bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
                {project.title}
              </span>
            </h1>
            <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <span className="text-gray-500 text-lg">
                    Année : {project.year}
                    </span>
                    {/* Affichage passif de isPublished si besoin, mais plus de bouton de bascule */} 
                    {!isAdmin && project?.isPublished === false && (
                        <span className="text-sm font-semibold py-1 px-2 bg-red-100 text-red-700 rounded-full">Privé (Non Publié)</span>
                    )}
                     {isAdmin && project?.isPublished === false && (
                        <span className="text-sm font-semibold py-1 px-2 bg-yellow-200 text-yellow-800 rounded-full">Admin: Non Publié</span>
                    )}
                    {isAdmin && project?.isPublished === true && (
                        <span className="text-sm font-semibold py-1 px-2 bg-green-200 text-green-800 rounded-full">Admin: Publié</span>
                    )}
                </div>
                {/* Bouton pour isViewable */} 
                {isAdmin && (
                    <div className="flex items-center justify-between pt-2">
                        <span className="text-gray-500 text-lg">
                            Visibilité publique :
                        </span>
                        <button
                            onClick={toggleViewableStatus}
                            disabled={isUpdatingViewable}
                            className={`px-4 py-2 text-xs font-semibold rounded-full transition-colors duration-200 
                                ${project?.isViewable ? 'bg-red-100 text-red-700 hover:bg-red-200' : 'bg-green-100 text-green-700 hover:bg-green-200'}
                                ${isUpdatingViewable ? 'opacity-50 cursor-not-allowed' : ''}
                            `}
                        >
                            {isUpdatingViewable 
                                ? 'Mise à jour...'
                                : project?.isViewable ? 'Rendre Non Visible Publiquement' : 'Rendre Visible Publiquement'}
                        </button>
                    </div>
                )}
                 {/* Affichage pour les non-admins si le contenu est réservé */} 
                 {!isAdmin && project?.isPublished && project?.isViewable === false && (
                    <span className="text-sm font-semibold py-1 px-2 bg-yellow-100 text-yellow-700 rounded-full">Contenu réservé</span>
                 )}
            </div>
          </div>

          <div className="prose prose-lg max-w-none text-gray-700 mb-8" dangerouslySetInnerHTML={{ __html: project.description.replace(/\n/g, '<br />') }} />
          
          {project.projectUrl && (
            <a 
              href={project.projectUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-8 py-3 text-lg font-semibold rounded-xl text-white bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 mb-8"
            >
              Visiter le projet
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </a>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-gray-600 border-t pt-8 mt-8">
            <div>
              <strong className="block text-gray-800">Date de création:</strong>
              <span>{new Date(project.createdAt).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </div>
            <div>
              <strong className="block text-gray-800">Dernière mise à jour:</strong>
              <span>{new Date(project.updatedAt).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </div>
          </div>

          {/* TODO: Afficher les étudiants et technologies associés si ces données sont disponibles */}
          {/* Exemple:
          {project.students && project.students.length > 0 && (
            <div className="mt-8">
              <h3 className="text-2xl font-semibold text-gray-800 mb-4">Étudiants associés:</h3>
              <ul className="list-disc list-inside">
                {project.students.map(student => <li key={student.id}>{student.name}</li>)}
              </ul>
            </div>
          )}
          */}
        </div>
      </article>
    </div>
  );
};

export default ProjectDetailPage; 