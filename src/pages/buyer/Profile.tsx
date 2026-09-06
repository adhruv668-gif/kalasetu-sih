import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, LogOut, Phone, ShieldCheck, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const BuyerProfile: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 pb-20">
      <div className="bg-white p-4 sticky top-0 z-10 flex items-center justify-between border-b border-gray-100 shadow-sm">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-1">
            <ChevronLeft className="w-6 h-6 text-gray-800" />
          </button>
          <h2 className="text-xl font-bold text-gray-800">My Profile</h2>
        </div>
      </div>

      <div className="p-6 flex-1 flex flex-col items-center pt-8">
        {/* User Avatar */}
        <div className="w-20 h-20 bg-heritage-primary rounded-full flex items-center justify-center shadow-lg mb-4">
          <User className="w-10 h-10 text-white" />
        </div>

        <h2 className="text-xl font-bold text-gray-800 mb-1">Citizen User</h2>
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Phone className="w-4 h-4" />
          <span>{user?.phoneNumber || 'Not available'}</span>
        </div>

        {/* Verification Badge */}
        <div className="bg-green-50 text-green-800 p-4 rounded-xl flex items-center gap-3 w-full mb-6 border border-green-200">
          <ShieldCheck className="w-6 h-6 text-green-600" />
          <div>
            <p className="font-bold text-sm">Phone Verified</p>
            <p className="text-xs text-green-600">Your identity has been verified via OTP</p>
          </div>
        </div>

        {/* Info Cards */}
        <div className="w-full flex flex-col gap-3">
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Login Method</p>
            <p className="text-sm font-medium text-gray-800">Mobile OTP Authentication</p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Role</p>
            <p className="text-sm font-medium text-gray-800">Citizen / Buyer</p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm opacity-50">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Aadhaar Link</p>
            <p className="text-sm font-medium text-gray-400">Coming Soon</p>
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="flex items-center justify-center gap-2 text-red-500 font-bold py-3 mt-8 w-full"
        >
          <LogOut className="w-5 h-5" /> Sign Out
        </button>
      </div>
    </div>
  );
};


