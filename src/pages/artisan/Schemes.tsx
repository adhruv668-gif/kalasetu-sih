import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, FileText, Landmark, ShieldCheck } from 'lucide-react';

export const Schemes: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="p-2 bg-white rounded-full shadow-sm">
          <ChevronLeft className="w-5 h-5 text-gray-700" />
        </button>
        <h2 className="text-2xl font-bold text-gray-800">{t.artisan.schemes.title}</h2>
      </div>
      
      <p className="text-gray-600 text-sm mb-2">{t.artisan.schemes.desc}</p>

      {/* NEW: Working Capital Support */}
      <div className="bg-gradient-to-br from-[#003366] to-[#00509E] p-6 rounded-2xl shadow-lg border border-blue-900 text-white flex flex-col gap-4 relative overflow-hidden btn-press">
        <div className="absolute top-0 right-0 opacity-10 transform translate-x-4 -translate-y-4">
          <Landmark className="w-32 h-32" />
        </div>
        <div className="relative z-10">
          <span className="text-[10px] font-bold uppercase tracking-widest bg-blue-400/30 px-2 py-1 rounded-md text-blue-100">{t.artisan.schemes.zeroCollateral}</span>
          <h3 className="font-bold text-2xl mt-3 leading-tight tracking-tight">{t.artisan.schemes.workingCap}</h3>
          <p className="text-sm text-blue-100 mt-2 leading-relaxed">
            Don't let material costs stall your production. Access collateral-free advances to buy raw materials and hold stock while waiting for bulk orders to clear.
          </p>
          <div className="flex items-center gap-3 mt-4">
            <span className="text-xl font-black text-[#FF9933]">₹3,00,000</span>
            <span className="text-xs text-blue-200 uppercase tracking-widest">{t.artisan.schemes.maxLimit}</span>
          </div>
          <button className="w-full mt-5 bg-white text-[#003366] font-bold py-3 rounded-xl shadow-md">
            Activate PM Vishwakarma Credit
          </button>
        </div>
      </div>

      <div className="bg-white p-5 rounded-2xl shadow-sm border border-blue-100 flex flex-col gap-3">
        <div className="flex items-start gap-3">
          <div className="bg-blue-100 p-2 rounded-lg text-blue-600">
            <Landmark className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-gray-800 text-lg">{t.artisan.schemes.pmYojana}</h3>
            <p className="text-sm text-gray-500 mt-1">Get an identity card, toolkit incentive up to ₹15,000, and collateral-free credit support up to ₹3 lakh.</p>
          </div>
        </div>
        <button className="w-full mt-2 bg-blue-50 text-blue-700 font-bold py-2 rounded-xl border border-blue-200">
          Apply Now (via Portal)
        </button>
      </div>

      <div className="bg-white p-5 rounded-2xl shadow-sm border border-green-100 flex flex-col gap-3">
        <div className="flex items-start gap-3">
          <div className="bg-green-100 p-2 rounded-lg text-green-600">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-gray-800 text-lg">{t.artisan.schemes.giTag}</h3>
            <p className="text-sm text-gray-500 mt-1">{t.artisan.schemes.giTagDesc}</p>
          </div>
        </div>
        <button className="w-full mt-2 bg-green-50 text-green-700 font-bold py-2 rounded-xl border border-green-200">
          Check Eligibility
        </button>
      </div>

      <div className="bg-white p-5 rounded-2xl shadow-sm border border-orange-100 flex flex-col gap-3">
        <div className="flex items-start gap-3">
          <div className="bg-orange-100 p-2 rounded-lg text-orange-600">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-gray-800 text-lg">{t.artisan.schemes.mudra}</h3>
            <p className="text-sm text-gray-500 mt-1">Micro-credit facility for working capital up to ₹50,000 under Shishu category.</p>
          </div>
        </div>
        <button className="w-full mt-2 bg-orange-50 text-orange-700 font-bold py-2 rounded-xl border border-orange-200">
          Learn More
        </button>
      </div>

    </div>
  );
};



