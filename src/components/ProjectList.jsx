import React, { useEffect, useState } from 'react';

function ProjectList() {
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

  if (loading) return <p>Chargement des projets...</p>;
  if (error) return <p>Erreur lors du chargement des projets : {error.message}</p>;

  return (
    <div>
      <h1>Liste des Projets</h1>
      <ul>
        {projects.map(project => (
          <li key={project.id}>
            <h2>{project.title}</h2>
            <p>{project.description}</p>
            <img src={project.imageUrl} alt={project.title} style={{ width: '200px' }} />
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ProjectList; 