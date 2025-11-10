
import React from 'react';

type IconProps = {
  className?: string;
};

export const PhoneIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
);

export const MailIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  </svg>
);

export const LinkedinIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

export const GithubIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
  </svg>
);

export const ChevronRightIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
    </svg>
);

export const WorkIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2048 2048" className={className} fill="currentColor">
        <path d="M2048 384v1280H0V384h640V256q0-27 10-50t27-40t41-28t50-10h512q27 0 50 10t40 27t28 41t10 50v128h640zm-1280 0h512V256H768v128zM128 512v185l640 319V896h512v120l640-319V512H128zm768 512v128h256v-128H896zm1024 512V839l-640 321v120H768v-120L128 839v697h1792z"/>
    </svg>
);

export const CodeBranchIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5">
        <path d="M7 4.5a3 3 0 0 0-2.567 4.554a3.001 3.001 0 0 0 0 5.893M7 4.5a2.5 2.5 0 0 1 5 0v15a2.5 2.5 0 0 1-5 0a3 3 0 0 1-2.567-4.553M7 4.5c0 .818.393 1.544 1 2m-3.567 8.447A3 3 0 0 1 6 13.67m11 5.83a3 3 0 0 0 2.567-4.553a3.001 3.001 0 0 0 0-5.893M17 19.5a2.5 2.5 0 0 1-5 0v-15a2.5 2.5 0 0 1 5 0a3 3 0 0 1 2.567 4.554M17 19.5c0-.818-.393-1.544-1-2m3.567-8.446A3 3 0 0 1 18 10.329"/>
    </svg>
);

export const BrainIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.5 12.5a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0zm0 0v.01M4.5 15.5a2 2 0 100-4 2 2 0 000 4zm15-2a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0zm0 0v.01M14.5 15.5a2 2 0 100-4 2 2 0 000 4zm-5-8a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0zm0 0v.01M4.5 7.5a2 2 0 100-4 2 2 0 000 4zm15-2a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0zm0 0v.01M14.5 7.5a2 2 0 100-4 2 2 0 000 4zM12 21.5V17m0-10V2.5" />
    </svg>
);

export const TrophyIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" className={className} fill="currentColor">
        <path d="M26 30h-2v-3a5.006 5.006 0 0 0-5-5h-6a5.006 5.006 0 0 0-5 5v3H6v-3a7.008 7.008 0 0 1 7-7h6a7.008 7.008 0 0 1 7 7zM5 6a1 1 0 0 0-1 1v9h2V7a1 1 0 0 0-1-1z"/>
        <path d="M4 2v2h5v7a7 7 0 0 0 14 0V4h5V2Zm7 2h10v3H11Zm5 12a5 5 0 0 1-5-5V9h10v2a5 5 0 0 1-5 5Z"/>
    </svg>
);

export const MedalIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" className={className} fill="currentColor">
        <path d="m32.001 27.927l-3.246 9.989H18.251l8.498 6.174l-3.248 9.988l8.5-6.172l8.498 6.172l-3.248-9.988l8.498-6.174H35.245l-3.244-9.989m2.838 15.12l1.752 5.396l-4.59-3.336l-4.594 3.336l1.756-5.396l-4.592-3.336h5.676l1.754-5.396l1.754 5.396h5.674l-4.59 3.336"/>
        <path d="M44.657 26.519v-8.698c0-.364-.199-.67-.481-.86L54 2H35.165l-3.164 4.746L28.837 2H10l9.823 14.96a1.04 1.04 0 0 0-.48.861v8.698C14.862 30.187 12 35.758 12 42c0 11.045 8.955 20 20 20h.001c.681 0 1.354-.035 2.017-.102C44.115 60.887 52 52.365 52 42c0-6.242-2.862-11.813-7.343-15.481M40.826 3h6.328l-8.825 13.239l-3.164-4.746L40.826 3m.667 17.985l.973-1.458c.052.125.082.261.082.404v4.219a.994.994 0 0 1-.297.7C39.251 23.052 35.752 22 32 22a19.87 19.87 0 0 0-10.251 2.851a.996.996 0 0 1-.297-.701v-4.219c0-.143.03-.28.082-.404l.973 1.459h18.986zM16.846 3h6.328l11.324 16.985H28.17L16.846 3M32 59c-9.388 0-17-7.611-17-17s7.612-17 17-17s17 7.611 17 17s-7.612 17-17 17"/>
    </svg>
);