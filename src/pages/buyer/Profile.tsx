import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Fingerprint, Search } from 'lucide-react';

export const BuyerProfile: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 pb-20">
      <div className="bg-white p-4 sticky top-0 z-10 flex items-center justify-between border-b border-gray-100 shadow-sm">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-1">
            <ChevronLeft className="w-6 h-6 text-gray-800" />
          </button>
          <h2 className="text-xl font-bold text-gray-800">Citizen Login</h2>
        </div>
      </div>

      <div className="p-6 flex-1 flex flex-col items-center pt-10">
        <h2 className="text-2xl font-bold text-[#003366] mb-1 mt-4">KalaSetu Portal</h2>
        <p className="text-sm text-gray-500 mb-8 text-center max-w-[280px]">Official Govt. of India portal for verifying and purchasing authentic heritage crafts.</p>

        <div className="bg-white w-full rounded-2xl shadow-sm border border-gray-200 p-6 flex flex-col gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-2">Mobile Number</label>
            <div className="flex gap-2">
              <span className="bg-gray-100 border border-gray-200 rounded-lg p-3 text-gray-600 font-medium">+91</span>
              <input type="tel" placeholder="Enter 10 digit number" className="flex-1 border border-gray-200 rounded-lg p-3 outline-none focus:border-[#003366]" />
            </div>
          </div>
          <button className="w-full bg-[#003366] text-white font-bold py-3 rounded-lg mt-2 shadow-md">
            Generate OTP
          </button>

          <div className="flex items-center gap-4 my-4">
            <hr className="flex-1 border-gray-200" />
            <span className="text-xs text-gray-400 font-medium uppercase">OR LOGIN WITH</span>
            <hr className="flex-1 border-gray-200" />
          </div>

          <button className="w-full bg-white text-gray-700 border border-gray-300 font-bold py-3 rounded-lg flex items-center justify-center gap-2">
            <Search className="w-5 h-5 text-blue-500" /> MeriPehchaan (SSO)
          </button>
          <button className="w-full bg-white text-gray-700 border border-gray-300 font-bold py-3 rounded-lg flex items-center justify-center gap-2">
            <Fingerprint className="w-5 h-5 text-gray-500" /> Aadhaar OTP
          </button>
        </div>
      </div>
    </div>
  );
};
