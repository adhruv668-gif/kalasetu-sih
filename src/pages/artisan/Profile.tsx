import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import { ChevronLeft, UserPlus, Shield, UserCog, LogOut } from 'lucide-react';

export const ArtisanProfile: React.FC = () => {
  const { artisans, currentArtisanId } = useAppContext();
  const navigate = useNavigate();
  const artisan = artisans.find(a => a.id === currentArtisanId);
  const [delegates] = useState([{ name: 'Suresh Kumar', relation: 'Son', role: 'Digital Facilitator' }]);

  if (!artisan) return null;

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="p-2 bg-white rounded-full shadow-sm border border-gray-100">
          <ChevronLeft className="w-5 h-5 text-gray-700" />
        </button>
        <h2 className="text-2xl font-bold text-gray-800">My Profile</h2>
      </div>

      <div className="bg-white p-5 rounded-2xl shadow-sm border border-orange-100 flex flex-col items-center text-center">
        <img src={artisan.photoUrl} alt={artisan.name} className="w-24 h-24 rounded-full object-cover border-4 border-heritage-bg mb-3" />
        <h3 className="text-xl font-bold text-gray-800">{artisan.name}</h3>
        <p className="text-sm text-gray-500">{artisan.region} • {artisan.craft}</p>
        <button className="text-xs bg-gray-100 px-4 py-2 rounded-full mt-4 font-medium text-gray-700">
          Edit Details
        </button>
      </div>

      <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-2 mb-4">
          <Shield className="w-5 h-5 text-heritage-primary" />
          <h3 className="font-bold text-gray-800">Delegated Access</h3>
        </div>
        <p className="text-sm text-gray-500 mb-4">
          Allow family members or NGO facilitators to manage listings on your behalf. <strong className="text-gray-700">You will always be credited as the Maker.</strong>
        </p>

        <div className="flex flex-col gap-3">
          {delegates.map((d, i) => (
            <div key={i} className="flex justify-between items-center bg-gray-50 p-3 rounded-xl border border-gray-200">
              <div className="flex items-center gap-3">
                <div className="bg-gray-200 p-2 rounded-full">
                  <UserCog className="w-5 h-5 text-gray-600" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-gray-800">{d.name}</h4>
                  <p className="text-xs text-gray-500">{d.relation} • {d.role}</p>
                </div>
              </div>
              <button className="text-xs text-red-500 font-bold px-2">Revoke</button>
            </div>
          ))}

          <button className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-600 font-bold text-sm hover:bg-gray-50 transition">
            <UserPlus className="w-4 h-4" /> Add Facilitator
          </button>
        </div>
      </div>

      <button className="flex items-center justify-center gap-2 text-red-500 font-bold py-3">
        <LogOut className="w-5 h-5" /> Sign Out
      </button>
    </div>
  );
};
