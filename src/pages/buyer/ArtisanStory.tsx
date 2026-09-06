import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import { ChevronLeft, Award, MapPin, ShieldAlert } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

export const ArtisanStory: React.FC = () => {
  const { t } = useLanguage();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { artisans } = useAppContext();
  
  const artisan = artisans.find(a => a.id === id);
  if (!artisan) return <div className="p-8 text-center text-gray-500">Artisan not found</div>;

  const qrUrl = `${window.location.origin}/artisan/${artisan.id}`;

  const isGITagged = 
    artisan.craft.toLowerCase().includes('pottery') || 
    artisan.craft.toLowerCase().includes('wood') || 
    artisan.craft.toLowerCase().includes('toy') ||
    artisan.craft.toLowerCase().includes('weaving') ||
    artisan.craft.toLowerCase().includes('brass');

  return (
    <div className="flex flex-col min-h-screen bg-heritage-bg pb-10">
      <div className="relative h-72">
        <img src={artisan.photoUrl} alt={artisan.name} className="w-full h-full object-cover" onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = "https://placehold.co/600x600/F0F4F8/003366?text=Image+Unavailable"; }} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
        <button onClick={() => navigate(-1)} className="absolute top-4 left-4 bg-white/20 p-2.5 rounded-full shadow-sm backdrop-blur-md text-white btn-press border border-white/20">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div className="absolute bottom-6 left-6 text-white">
          <h1 className="text-3xl font-black tracking-tight">{artisan.name}</h1>
          <div className="flex items-center gap-2 mt-2 text-sm font-medium opacity-90">
            <MapPin className="w-4 h-4" /> {artisan.region}
          </div>
        </div>
      </div>

      <div className="px-6 py-8 flex flex-col gap-6 -mt-8 bg-heritage-bg rounded-t-3xl relative z-10">
        
        {/* Master Details */}
        <div className="card-standard p-5 flex items-start gap-4 border-l-4 border-l-heritage-primary">
          <Award className="w-10 h-10 text-heritage-primary shrink-0 mt-1" />
          <div>
            <h3 className="font-bold text-gray-800 text-lg">{t.buyer.story.masterOf} {artisan.craft}</h3>
            <p className="text-sm text-gray-600 mt-2 leading-relaxed font-medium">{artisan.bio}</p>
          </div>
        </div>

        {/* NEW: Heritage at Risk */}
        <div className="card-standard p-5 bg-gradient-to-br from-orange-50 to-white border border-orange-200">
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-orange-600 text-white text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-md animate-pulse">
              Heritage at Risk
            </span>
          </div>
          <p className="text-sm text-gray-800 font-bold mb-1">{t.buyer.story.heritageRiskStat}</p>
          <p className="text-xs text-gray-600 leading-relaxed font-medium mb-3">
            Your purchase directly supports {artisan.name}'s ability to take on apprentices and pass this ancestral knowledge to the next generation.
          </p>
          <div className="bg-orange-100/50 p-3 rounded-xl border border-orange-200/50">
            <p className="text-xs text-orange-800 font-bold flex items-center gap-2">
              ✓ {artisan.name} {t.buyer.story.acceptingApprentices}
            </p>
          </div>
        </div>

        {/* NEW: Anti-Fake Stats */}
        <div className="card-standard p-5 bg-gradient-to-br from-red-50 to-white border border-red-100 flex items-center gap-4">
          <div className="bg-red-100 text-red-600 p-3 rounded-xl shrink-0">
             <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
             <h4 className="font-bold text-red-900 text-sm">{t.buyer.story.antiFake}</h4>
             <p className="text-xs text-red-800/80 mt-1 font-medium leading-relaxed">
               {t.buyer.story.antiFakeStats} {artisan.name}.
             </p>
          </div>
        </div>

        {/* Certificate Section */}
        <div className="card-standard border-2 border-[#003366] p-6 shadow-sm flex flex-col items-center text-center relative overflow-hidden">
          <div className="absolute top-0 w-full h-2 flex">
            <div className="flex-1 bg-[#FF9933]"></div>
            <div className="flex-1 bg-white"></div>
            <div className="flex-1 bg-[#138808]"></div>
          </div>
          
          <h3 className="font-black text-gray-900 text-xl font-sans mt-3">{t.buyer.story.authCert}</h3>
          <p className="text-[10px] text-[#003366] mt-1.5 mb-6 uppercase tracking-widest font-bold">{t.buyer.story.govtRecog}</p>
          
          <div className="bg-gray-50 p-3 rounded-2xl mb-5 shadow-inner border border-gray-100 inline-block">
            <QRCodeSVG value={qrUrl} size={130} level="H" includeMargin={false} />
          </div>
          
          <p className="text-sm text-gray-600 mb-4 leading-relaxed font-medium">
            Scan to verify {artisan.name}'s official Ministry registration and view their full verified catalog.
          </p>

          <div className="w-full border-t border-gray-100 pt-4 flex flex-col gap-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-gray-500 font-bold uppercase tracking-wider">{t.buyer.story.regId}</span>
              <span className="font-mono font-bold text-gray-800">IN-KALA-{artisan.id.toUpperCase()}</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-gray-500 font-bold uppercase tracking-wider">{t.buyer.story.status}</span>
              <span className="font-bold text-green-600 bg-green-50 px-2 py-1 rounded-md">{t.buyer.story.statusActive}</span>
            </div>
            {isGITagged && (
              <div className="flex justify-between items-center text-xs mt-1 border-t border-dashed border-gray-200 pt-3">
                 <span className="text-gray-500 font-bold uppercase tracking-wider">{t.buyer.story.ipProtection}</span>
                 <span className="font-bold text-[#997A00] bg-[#FFF8E7] px-2 py-1 rounded-md flex items-center gap-1">
                   <Award className="w-3 h-3" /> GI Tag Eligible
                 </span>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};



