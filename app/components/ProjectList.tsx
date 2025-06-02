import React, { useEffect, useState } from 'react';
import Link from 'next/link';

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
}

interface ApiResponse {
  'hydra:member'?: Project[];
  member?: Project[];
}

const ProjectList: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('jwtToken');

    if (!token) {
      setError(new Error('Token d\'authentification non trouvé. Veuillez vous reconnecter.'));
      setLoading(false);
      return;
    }

    fetch('http://localhost:8000/api/projects', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/ld+json',
      }
    })
      .then(async (response: Response) => {
        if (response.status === 401) {
          throw new Error('Non autorisé. Veuillez vérifier votre token ou vous reconnecter.');
        }
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json() as Promise<ApiResponse>;
      })
      .then((data: ApiResponse) => {
        setProjects(data['hydra:member'] || data.member || []);
        setLoading(false);
      })
      .catch((error: Error) => {
        console.error("Erreur lors de la récupération des projets:", error);
        setError(error);
        setLoading(false);
      });
  }, []);

  if (loading) return <p className="text-center text-gray-500">Chargement des projets...</p>;
  if (error) return <p className="text-center text-red-500">Erreur lors du chargement des projets : {error.message}</p>;
  if (!projects || projects.length === 0) return <p className="text-center text-gray-500">Aucun projet à afficher pour le moment.</p>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-8">Liste des Projets</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project: Project) => (
          <div key={project.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="relative">
              <img 
                src={project.imageUrl || 'https://via.placeholder.com/400x200?text=Image+Projet'} 
                alt={project.title} 
                className="w-full h-48 object-cover"
              />
              {project.isPublished && (
                <span className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs">
                  Publié
                </span>
              )}
            </div>
            <div className="p-4">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">{project.title}</h2>
              <p className="text-gray-600 text-sm mb-3 line-clamp-2">{project.description}</p>
              
              <div className="flex flex-col space-y-2 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span className="font-medium">Année:</span>
                  <span>{project.year}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Créé le:</span>
                  <span>{new Date(project.createdAt).toLocaleDateString('fr-FR')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Mis à jour le:</span>
                  <span>{new Date(project.updatedAt).toLocaleDateString('fr-FR')}</span>
                </div>
              </div>

              <div className="mt-4 flex justify-between items-center">
                <a 
                  href={project.projectUrl} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  Voir le projet
                </a>
                <Link 
                  href={`/project/${project.id}`} 
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm transition duration-300"
                >
                  Détails
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectList; 