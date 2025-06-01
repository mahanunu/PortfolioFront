import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

function ProjectDetail() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`/api/projects/${id}`)
      .then(response => response.json())
      .then(data => {
        setProject(data);
        setLoading(false);
      })
      .catch(error => {
        setError(error);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <p>Chargement du projet...</p>;
  if (error) return <p>Erreur lors du chargement du projet : {error.message}</p>;

  return (
    <div>
      <h1>{project.title}</h1>
      <p>{project.description}</p>
      <img src={project.imageUrl} alt={project.title} style={{ width: '400px' }} />
      <p>Année : {project.year}</p>
      <p>URL du projet : <a href={project.projectUrl} target="_blank" rel="noopener noreferrer">{project.projectUrl}</a></p>
      <p>Étudiants associés : {project.students.map(student => student.name).join(', ')}</p>
      <p>Technologies utilisées : {project.technologies.map(tech => tech.name).join(', ')}</p>
    </div>
  );
}

export default ProjectDetail; 