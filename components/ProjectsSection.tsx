
import React from 'react';
import type { Project } from '../types';
import { ChevronRightIcon } from './Icons';

interface ProjectsSectionProps {
  projects: Project[];
}

export const ProjectsSection: React.FC<ProjectsSectionProps> = ({ projects }) => {
  return (
    <div className="project-cards-container">
      {projects.map((project, index) => (
        <div key={index} className="glass-card">
          <header className="glass-card-header">
            <h3 className="project-title">{project.name}</h3>
            <p className="project-duration">{project.duration}</p>
            <p className="project-tech">{project.tech}</p>
          </header>
          <div className="glass-card-content">
            <ul>
              {project.points.map((point, i) => (
                <li key={i}>
                  <ChevronRightIcon className="icon" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </div>
  );
};
