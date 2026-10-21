import React from 'react';
import { BookOpen } from 'lucide-react';

export const LoadingSpinner: React.FC<{ message?: string }> = ({ message = 'Loading Lexora...' }) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#F8FAFC] text-[#172033] p-4">
      <div className="relative flex items-center justify-center">
        <div className="w-16 h-16 rounded-2xl bg-indigo-600/10 flex items-center justify-center animate-pulse">
          <BookOpen className="w-8 h-8 text-indigo-600 animate-bounce" />
        </div>
        <div className="absolute inset-0 border-2 border-indigo-600/20 border-t-indigo-600 rounded-2xl animate-spin" />
      </div>
      <p className="mt-4 text-sm font-medium text-slate-500 tracking-wide">{message}</p>
    </div>
  );
};
