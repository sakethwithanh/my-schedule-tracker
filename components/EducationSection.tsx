
import React from 'react';
import type { Education } from '../types';

interface EducationSectionProps {
  education: Education;
}

export const EducationSection: React.FC<EducationSectionProps> = ({ education }) => {
  return (
    <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700">
      <div>
        <h3 className="text-xl font-bold text-green-400 [text-shadow:0_0_8px_rgba(74,222,128,0.5)]">{education.institution}</h3>
        <p className="text-slate-400 font-medium">{education.degree}</p>
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-500 mt-2">
          <span>{education.duration}</span>
          <span>CGPA: {education.cgpa}</span>
        </div>
      </div>
    </div>
  );
};
