import React from 'react';
import { WorkIcon, CodeBranchIcon, BrainIcon, TrophyIcon, MedalIcon } from './Icons';

type Section = 'Experience' | 'Projects' | 'Skills' | 'Education' | 'Extracurricular';

interface VerticalNavProps {
  sections: Section[];
  activeSection: Section;
  setActiveSection: (section: Section) => void;
}

const iconMap: Record<Section, React.FC<{ className?: string }>> = {
    Experience: WorkIcon,
    Projects: CodeBranchIcon,
    Skills: BrainIcon,
    Education: TrophyIcon,
    Extracurricular: MedalIcon,
};

export const VerticalNav: React.FC<VerticalNavProps> = ({ sections, activeSection, setActiveSection }) => {
  return (
    <div className="list-nav">
      {sections.map((section) => {
        const IconComponent = iconMap[section];
        const isActive = activeSection === section;
        return (
          <button
            key={section}
            className={`list-nav-item ${isActive ? 'active' : ''}`}
            onClick={() => setActiveSection(section)}
          >
            <IconComponent />
            <span>{section}</span>
          </button>
        );
      })}
    </div>
  );
};
