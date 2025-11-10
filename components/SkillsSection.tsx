import React from 'react';
import type { SkillCategory } from '../types';

interface SkillsSectionProps {
  skillCategories: SkillCategory[];
}

export const SkillsSection: React.FC<SkillsSectionProps> = ({ skillCategories }) => {
  return (
    <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700 space-y-6">
      {skillCategories.map((category, index) => (
        <div key={index}>
          <h3 className="text-lg font-bold text-green-400 [text-shadow:0_0_8px_rgba(74,222,128,0.5)] mb-3">{category.name}</h3>
          <div className="flex flex-wrap gap-2">
            {category.skills.map((skill, i) => (
              <span key={i} className="bg-slate-700 text-slate-300 text-sm font-medium px-3 py-1 rounded-full">
                {skill}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};