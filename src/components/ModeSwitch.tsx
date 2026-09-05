import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { RefreshCcw } from 'lucide-react';

export const ModeSwitch: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isArtisan = location.pathname.startsWith('/artisan');

  return (
    <div className="fixed top-4 right-4 z-50 md:right-auto md:left-4">
      <button 
        onClick={() => navigate(isArtisan ? '/' : '/artisan')}
        className="bg-gray-800 text-white rounded-full px-4 py-2 flex items-center gap-2 shadow-lg hover:bg-gray-700 transition"
      >
        <RefreshCcw className="w-4 h-4" />
        <span className="text-sm font-medium">
          Switch to {isArtisan ? 'Buyer' : 'Artisan'} Mode
        </span>
      </button>
    </div>
  );
};
