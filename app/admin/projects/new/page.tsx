'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';
import Link from 'next/link';

// Interface pour les données du formulaire de projet
interface ProjectFormData {
  title: string;
  description: string;
  imageUrl: string;
  projectUrl: string;
  year: string; // Garder en string pour le formulaire, convertir si besoin avant envoi
  isPublished: boolean;
  isViewable: boolean;
}

const NewProjectPage: React.FC = () => {
  const router = useRouter();
  const { user, isAuthenticated, isLoading: authIsLoading } = useAuth();
  const isAdmin = user?.roles?.includes('ROLE_ADMIN');

  const [formData, setFormData] = useState<ProjectFormData>({
    title: '',
    description: '',
    imageUrl: '',
    projectUrl: '',
    year: new Date().getFullYear().toString(), // Année actuelle par défaut
    isPublished: false,
    isViewable: true, // Par défaut visible, comme défini dans l'entité
  });
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);

  useEffect(() => {
    if (!authIsLoading && (!isAuthenticated || !isAdmin)) {
      router.push('/login'); // Ou vers une page d'accès non autorisé si user est auth mais pas admin
    }
  }, [isAuthenticated, isAdmin, authIsLoading, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSubmitting(true);

    const token = localStorage.getItem('jwtToken');
    if (!token) {
      setError("Session expirée ou token manquant. Veuillez vous reconnecter.");
      setSubmitting(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:8000/api/projects', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/ld+json', // API Platform préfère application/ld+json ou application/json
          'Accept': 'application/ld+json',
        },
        body: JSON.stringify({
          ...formData,
          year: formData.year, // Assurez-vous que l'API attend une chaîne pour l'année comme défini dans l'entité
          // Les booléens isPublished et isViewable sont déjà au bon format
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        let errorMessage = errorData.detail || errorData.title || 'Erreur lors de la création du projet.';
        if (errorData.violations) {
          errorMessage += errorData.violations.map((v: any) => `\n- ${v.propertyPath}: ${v.message}`).join('');
        }
        throw new Error(errorMessage);
      }

      const newProject = await response.json();
      alert('Projet créé avec succès!');
      router.push(`/project/${newProject.id}`); // Rediriger vers la page du nouveau projet

    } catch (err: any) {
      console.error("Erreur lors de la création du projet:", err);
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (authIsLoading || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-orange-500"></div>
        <p className="ml-4 text-gray-700">Vérification des droits d'accès...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-orange-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900">
            <span className="block bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
              Créer un Nouveau Projet
            </span>
          </h1>
          <p className="mt-3 text-lg text-gray-600">
            Remplissez les informations ci-dessous pour ajouter un nouveau projet au portfolio.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white shadow-2xl rounded-xl p-8 sm:p-10 space-y-8">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Titre du projet</label>
            <input
              type="text"
              name="title"
              id="title"
              required
              value={formData.title}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              name="description"
              id="description"
              required
              rows={6}
              value={formData.description}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
            />
          </div>

          <div>
            <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 mb-1">URL de l'image</label>
            <input
              type="url"
              name="imageUrl"
              id="imageUrl"
              required
              value={formData.imageUrl}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div>
            <label htmlFor="projectUrl" className="block text-sm font-medium text-gray-700 mb-1">URL du projet (lien externe)</label>
            <input
              type="url"
              name="projectUrl"
              id="projectUrl"
              required
              value={formData.projectUrl}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
              placeholder="https://example.com/mon-projet"
            />
          </div>

          <div>
            <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-1">Année de réalisation</label>
            <input
              type="number" // Peut être text si vous voulez plus de flexibilité, mais number est bien pour une année
              name="year"
              id="year"
              required
              value={formData.year}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
              placeholder="YYYY"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="relative flex items-start bg-gray-50 p-4 rounded-lg border border-gray-200">
              <div className="flex items-center h-5">
                <input
                  id="isPublished"
                  name="isPublished"
                  type="checkbox"
                  checked={formData.isPublished}
                  onChange={handleChange}
                  className="focus:ring-orange-500 h-5 w-5 text-orange-600 border-gray-300 rounded"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="isPublished" className="font-medium text-gray-700">Publier le projet ?</label>
                <p className="text-gray-500">Si coché, le projet sera visible par les administrateurs et potentiellement par tous (selon le réglage 'Visible par tous').</p>
              </div>
            </div>

            <div className="relative flex items-start bg-gray-50 p-4 rounded-lg border border-gray-200">
              <div className="flex items-center h-5">
                <input
                  id="isViewable"
                  name="isViewable"
                  type="checkbox"
                  checked={formData.isViewable}
                  onChange={handleChange}
                  className="focus:ring-orange-500 h-5 w-5 text-orange-600 border-gray-300 rounded"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="isViewable" className="font-medium text-gray-700">Visible par tous les utilisateurs ?</label>
                <p className="text-gray-500">Si coché (et si le projet est 'Publié'), ce projet sera visible par tous les visiteurs. Sinon, uniquement par les admins.</p>
              </div>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-md">
              <div className="flex">
                <div className="flex-shrink-0">
                  {/* Heroicon name: solid/x-circle */} 
                  <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700 whitespace-pre-line">{error}</p>
                </div>
              </div>
            </div>
          )}

          <div className="pt-5">
            <div className="flex justify-end space-x-3">
              <Link 
                href={isAdmin ? "/admin/dashboard" : "/"} // Adapter le lien d'annulation
                className="bg-white py-2.5 px-6 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors"
              >
                Annuler
              </Link>
              <button
                type="submit"
                disabled={submitting}
                className={`inline-flex justify-center py-2.5 px-6 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white 
                  ${submitting ? 'bg-orange-400 cursor-not-allowed' : 'bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500'}
                  transition-colors`}
              >
                {submitting ? 'Création en cours...' : 'Créer le projet'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewProjectPage; 