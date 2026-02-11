
import React from 'react';

export const DashboardHeader: React.FC = () => {
  return (
    <header className="bg-white border-b border-slate-200 px-8 py-4 flex items-center justify-between sticky top-0 z-50">
      <div className="flex items-center gap-3">
        <div className="bg-emerald-500 p-2 rounded-lg">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h1 className="text-xl font-bold text-slate-800">SheetFlow <span className="text-emerald-500 font-medium text-sm ml-2 px-2 py-0.5 bg-emerald-50 rounded-full border border-emerald-100">CRM</span></h1>
      </div>
      <div className="flex items-center gap-4">
        <span className="text-sm text-slate-500 font-medium">Synced with Google Sheets</span>
        <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
        <button className="text-sm bg-slate-900 text-white px-4 py-2 rounded-lg font-medium hover:bg-slate-800 transition-colors">
          Export Sheet
        </button>
      </div>
    </header>
  );
};
