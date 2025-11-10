
import React from 'react';
import type { Extracurricular } from '../types';
import { ChevronRightIcon } from './Icons';

interface ExtracurricularSectionProps {
    activities: Extracurricular[];
}

export const ExtracurricularSection: React.FC<ExtracurricularSectionProps> = ({ activities }) => {
    return (
        <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700">
            <h2 className="text-xl font-bold text-green-400 [text-shadow:0_0_8px_rgba(74,222,128,0.5)] mb-4">Extracurricular Activities</h2>
            <ul className="space-y-3">
                {activities.map((item, index) => (
                    <li key={index} className="flex gap-3 text-slate-300">
                        <ChevronRightIcon className="w-5 h-5 mt-1 text-green-500 flex-shrink-0" />
                        <span>{item.activity}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
};
