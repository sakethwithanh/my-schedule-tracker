
import React from 'react';
import type { Experience } from '../types';
import { ChevronRightIcon } from './Icons';

interface ExperienceSectionProps {
  experiences: Experience[];
}

export const ExperienceSection: React.FC<ExperienceSectionProps> = ({ experiences }) => {
  return (
    <div className="space-y-8">
      {experiences.map((exp, index) => (
        <div key={index} className="bg-slate-800/50 p-6 rounded-lg border border-slate-700 hover:border-green-500 transition-all duration-300 hover:[box-shadow:0_0_15px_0_rgba(34,197,94,0.3)]">
          <header className="flex flex-col sm:flex-row justify-between sm:items-start mb-4">
            <div>
              <h3 className="text-xl font-bold text-green-400 [text-shadow:0_0_8px_rgba(74,222,128,0.5)]">{exp.role}</h3>
              <p className="text-slate-400 font-medium">{exp.company}</p>
            </div>
            <p className="text-sm text-slate-500 mt-2 sm:mt-0 sm:ml-4 flex-shrink-0">{exp.duration}</p>
          </header>
          <ul className="space-y-3 text-slate-300">
            {exp.points.map((point, i) => (
              <li key={i} className="flex gap-3">
                <ChevronRightIcon className="w-5 h-5 mt-1 text-green-500 flex-shrink-0" />
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};