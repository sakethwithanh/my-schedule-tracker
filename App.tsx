import React, { useState } from 'react';
import type { Education, Experience, Project, SkillCategory, Extracurricular, Contact } from './types';
import { EducationSection } from './components/EducationSection';
import { ExperienceSection } from './components/ExperienceSection';
import { ProjectsSection } from './components/ProjectsSection';
import { SkillsSection } from './components/SkillsSection';
import { ExtracurricularSection } from './components/ExtracurricularSection';
import { GithubIcon, LinkedinIcon, MailIcon, PhoneIcon } from './components/Icons';
import { MatrixBackground } from './components/MatrixBackground';
import { ProfileCard } from './components/ProfileCard';
import { VerticalNav } from './components/VerticalNav';

const resumeData: {
  name: string;
  title: string;
  contacts: Contact[];
  education: Education;
  experiences: Experience[];
  projects: Project[];
  skills: SkillCategory[];
  extracurriculars: Extracurricular[];
} = {
  name: 'Saketh Ragirolla',
  title: 'Generative AI Engineer',
  contacts: [
    { type: 'phone', value: '8106371972', href: 'tel:8106371972', Icon: PhoneIcon },
    { type: 'email', value: 'ragirollasaketh@gmail.com', href: 'mailto:ragirollasaketh@gmail.com', Icon: MailIcon },
    { type: 'linkedin', value: 'linkedin.com/in/saketh-ragirolla', href: 'https://www.linkedin.com/in/saketh-ragirolla/', Icon: LinkedinIcon },
    { type: 'github', value: 'github.com/sakethwithanh', href: 'https://github.com/sakethwithanh', Icon: GithubIcon },
  ],
  education: {
    institution: 'Indraprastha Institute of Information Technology Delhi (IIITD)',
    degree: 'B.Tech - Computer Science and Engineering',
    duration: '2021 - 2025',
    cgpa: '7.11'
  },
  experiences: [
    {
      role: 'Tech Analyst / Generative AI Engineer',
      company: 'Benori KPO',
      duration: 'June 2024 - Present',
      points: [
        'Architected, built, and deployed an end-to-end Generative AI application on Microsoft Azure that analyzes PPTX files for visual, design, and grammatical errors, saving internal research teams 1-2 days of manual review time per project.',
        'Developed an AI-powered voice agent using VAPI, Vonage, and Gemini that automated 5,000+ client research calls in 3 days, eliminating a workload equivalent to 10 analysts working for a month and cutting operational costs by 20x.',
        'Produced an index-free LongRAG framework to overcome LLM token limits and traditional retrieval inefficiencies (cosine similarity, BM25), enabling high-relevance insight generation from multi-million-token documents.',
        'Engineered a scalable data automation framework (using Apify, Zyte, Selenium) that became the standard for all market research projects, reducing manual data processing by over 80%.',
        'Orchestrated the integration of LLM workflows with analytics teams, which accelerated research and curtailed manual analysis by 30 hours weekly, enhancing client deliverable speed by 60%.'
      ]
    },
    {
      role: 'Student Researcher',
      company: 'Complex Systems Lab',
      duration: 'June 2024 - May 2025',
      points: [
        'Fine-tuned a DistilGPT-2 model for novel recipe generation, achieving an 85% ROUGE score to significantly outperform the previous GPT-2 baseline.',
        'Created recipe-focused chatbot using RAG, which reduced factual hallucinations by 90% compared to a non-RAG baseline, ensuring higher user trust and reliability.',
        'Authored novel evaluation metrics (e.g., ingredient validity, instructional coherence) to identify key model weaknesses, resulting in a 15-point increase in ROUGE score and an 80% reduction in logically inconsistent recipe generations.'
      ]
    }
  ],
  projects: [
     {
      name: 'Medical RAG based Chatbot',
      tech: 'Keras-OCR, Flask, Gemini AI API, CSS, HTML, JavaScript',
      duration: 'Jan 2024 - Jul 2024',
      points: [
        'Implemented a RAG application using Gemini generative AI API which can read prescription images and use conversations to retrieve details about a medicine from a database.',
        'Devised an intuitive web interface that eliminates manual data entry by allowing users to upload prescription images directly, streamlining the process of retrieving medicine information.',
        'Attained output with a Confidence Score of 80%.'
      ]
    },
    {
      name: "Beijing's Pollution Prediction",
      tech: 'Python, Tensorflow, Numpy, Pandas',
      duration: 'Nov 2023 - Dec 2023',
      points: [
        'Processed and analyzed Beijing Pollution dataset, deriving actionable insights from over 5 million data points.',
        'Leveraged SARIMA and ARIMA models to predict air pollution, achieving 92% accuracy, and improved average precision by 15% for multi-day pollution forecasts.'
      ]
    },
    {
      name: 'Smoke Signals: Predict Smokers by Vital Signs',
      tech: 'Python, Tensorflow, Numpy, Pandas',
      duration: 'Nov 2024 - Dec 2024',
      points: [
        'Conducted comprehensive exploratory data analysis (EDA) on patient vital signs, identifying key patterns and features to inform a predictive ML model for smoking status.',
        'Optimized multiple models, including Naive Bayes, Decision Trees, SVM, and MLP, with Random Forest achieving 83% accuracy after hyperparameter tuning via Grid Search.'
      ]
    },
     {
      name: 'Online Retail Store',
      tech: 'MySQL, Python',
      duration: 'Jun 2022 - Jul 2022',
      points: [
        'Engineered a command-line online retail store with MySQL backend, enabling users to perform secure purchases, track orders, and manage accounts efficiently.',
        'Designed database schema using ER diagrams, ensuring data integrity and efficient query performance for over 250 simulated orders.',
        'Implemented OLAP queries and transactional workflows, supporting accurate, real-time order tracking.'
      ]
    }
  ],
  skills: [
    { name: 'Languages', skills: ['Java', 'Python', 'C/C++', 'SQL', 'HTML'] },
    { name: 'Technologies/Frameworks', skills: ['Azure', 'Supabase', 'Vapi', 'Django', 'Flask', 'Arduino', 'LIBGDX', 'PyTorch', 'Hugging Face', 'Lang-Chain', 'Auto Gen'] },
    { name: 'Developer Tools', skills: ['Git', 'VS Code', 'IntelliJ'] },
    { name: 'Libraries', skills: ['Pandas', 'NumPy', 'Matplotlib'] }
  ],
  extracurriculars: [
      { activity: 'Achieved a rating of 1300+ on Codeforces' },
      { activity: 'Volunteered at Enveave(NGO), recognized for environmental and community efforts.' },
      { activity: 'Volunteer at Bachpan Bachao(NGO) - Taught Kids Math and Science' },
      { activity: 'Event Organizer for "Odyssey 23", the Annual Cultural Fest of IIITD' }
  ]
};

type Section = 'Experience' | 'Projects' | 'Skills' | 'Education' | 'Extracurricular';

const App: React.FC = () => {
  const [activeSection, setActiveSection] = useState<Section>('Experience');

  const sections: Section[] = ['Experience', 'Projects', 'Skills', 'Education', 'Extracurricular'];

  const renderSection = () => {
    switch (activeSection) {
      case 'Experience':
        return <ExperienceSection experiences={resumeData.experiences} />;
      case 'Projects':
        return <ProjectsSection projects={resumeData.projects} />;
      case 'Skills':
        return <SkillsSection skillCategories={resumeData.skills} />;
      case 'Education':
        return <EducationSection education={resumeData.education} />;
      case 'Extracurricular':
        return <ExtracurricularSection activities={resumeData.extracurriculars} />;
      default:
        return <ExperienceSection experiences={resumeData.experiences} />;
    }
  };

  return (
    <>
      <MatrixBackground />
      <div className="relative min-h-screen text-slate-300 flex items-start justify-center p-2 sm:p-4 md:p-8">
        <div className="max-w-7xl w-full mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <aside className="lg:col-span-1 lg:sticky top-8 flex flex-col items-center gap-8">
            <ProfileCard 
              name={resumeData.name}
              title={resumeData.title}
              contacts={resumeData.contacts.filter(c => ['linkedin', 'github', 'email'].includes(c.type))}
            />
            <VerticalNav
              sections={sections}
              activeSection={activeSection}
              setActiveSection={setActiveSection}
            />
          </aside>

          <main className="lg:col-span-2 bg-black/70 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-slate-700">
            <section key={activeSection} className="animate-fade-in">
              {renderSection()}
            </section>
          </main>

        </div>
      </div>
    </>
  );
};

const style = document.createElement('style');
style.innerHTML = `
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .animate-fade-in {
    animation: fadeIn 0.5s ease-in-out;
  }
`;
document.head.appendChild(style);


export default App;