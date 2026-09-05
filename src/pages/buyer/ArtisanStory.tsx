import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import { ChevronLeft, Award, MapPin } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

export const ArtisanStory: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { artisans } = useAppContext();
  
  const artisan = artisans.find(a => a.id === id);
  if (!artisan) return <div>Artisan not found</div>;

  const qrUrl = `${window.location.origin}/artisan/${artisan.id}`;

  return (
    <div className="flex flex-col min-h-screen bg-heritage-bg pb-10">
      <div className="relative h-64">
        <img src={artisan.photoUrl} alt={artisan.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
        <button onClick={() => navigate(-1)} className="absolute top-4 left-4 bg-white/20 p-2 rounded-full shadow backdrop-blur text-white">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <div className="absolute bottom-4 left-4 text-white">
          <h1 className="text-3xl font-bold">{artisan.name}</h1>
          <div className="flex items-center gap-2 mt-1 text-sm opacity-90">
            <MapPin className="w-4 h-4" /> {artisan.region}
          </div>
        </div>
      </div>

      <div className="px-5 py-6 flex flex-col gap-6">
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-orange-100 flex items-start gap-4">
          <Award className="w-10 h-10 text-heritage-primary shrink-0 mt-1" />
          <div>
            <h3 className="font-bold text-gray-800 text-lg">Master of {artisan.craft}</h3>
            <p className="text-sm text-gray-600 mt-2 leading-relaxed">{artisan.bio}</p>
          </div>
        </div>

        {/* Certificate Section */}
        <div className="bg-white border-2 border-[#003366] rounded-2xl p-6 shadow-sm flex flex-col items-center text-center relative overflow-hidden">
          <div className="absolute top-0 w-full h-2 flex">
            <div className="flex-1 bg-[#FF9933]"></div>
            <div className="flex-1 bg-white"></div>
            <div className="flex-1 bg-[#138808]"></div>
          </div>
          <h3 className="font-bold text-gray-800 text-xl font-sans mt-2">Authenticity Certificate</h3>
          <p className="text-xs text-[#003366] mt-1 mb-6 uppercase tracking-widest font-bold">Govt. of India Recognized</p>
          
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 inline-block">
            <QRCodeSVG value={qrUrl} size={160} fgColor="#003366" />
          </div>
          
          <p className="text-xs text-gray-500 mt-6 max-w-[250px]">
            Scan this code to verify the artisan's identity and craft heritage details on the official KalaSetu portal.
          </p>
        </div>

        {/* Ministry Badge */}
        <div className="flex flex-col items-center justify-center mt-4 opacity-80 pb-6">
           <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest text-center mt-2">Ministry of Social Justice & Empowerment</p>
           <p className="text-[10px] text-gray-400 font-medium uppercase tracking-widest text-center">Government of India</p>
        </div>
      </div>
    </div>
  );
};
