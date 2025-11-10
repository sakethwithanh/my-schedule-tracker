// Fix: Add React import to resolve 'React' namespace error.
import React from 'react';

export interface Education {
  institution: string;
  degree: string;
  duration: string;
  cgpa: string;
}

export interface Experience {
  role: string;
  company: string;
  duration: string;
  points: string[];
}

export interface Project {
  name: string;
  tech: string;
  duration: string;
  points: string[];
}

export interface SkillCategory {
  name: string;
  skills: string[];
}

export interface Extracurricular {
    activity: string;
}

export interface Contact {
  type: 'phone' | 'email' | 'linkedin' | 'github';
  value: string;
  href: string;
  Icon: React.FC<{ className?: string }>;
}