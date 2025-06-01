import React, { useEffect, useState } from 'react';

function AdminDashboard() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('/api/projects')
      .then(response => response.json())
      .then(data => {
        setProjects(data);
        setLoading(false);
      })
      .catch(error => {
        setError(error);
        setLoading(false);
      });
  }, []);

  const handleDelete = (id) => {
    fetch(`/api/projects/${id}`, {
      method: 'DELETE',
    })
      .then(() => {
        setProjects(projects.filter(project => project.id !== id));
      })
      .catch(error => {
        console.error('Erreur lors de la suppression du projet:', error);
      });
  };

  if (loading) return <p>Chargement des projets...</p>;
  if (error) return <p>Erreur lors du chargement des projets : {error.message}</p>;

  return (
    <div>
      <h1>Tableau de bord administrateur</h1>
      <ul>
        {projects.map(project => (
          <li key={project.id}>
            <h2>{project.title}</h2>
            <button onClick={() => handleDelete(project.id)}>Supprimer</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AdminDashboard; 