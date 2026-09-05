import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, FileText, Landmark, ShieldCheck } from 'lucide-react';

export const Schemes: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="p-2 bg-white rounded-full shadow-sm">
          <ChevronLeft className="w-5 h-5 text-gray-700" />
        </button>
        <h2 className="text-2xl font-bold text-gray-800">Govt. Schemes</h2>
      </div>
      
      <p className="text-gray-600 text-sm mb-2">Based on your craft category, you are eligible for the following support programs:</p>

      <div className="bg-white p-5 rounded-2xl shadow-sm border border-blue-100 flex flex-col gap-3">
        <div className="flex items-start gap-3">
          <div className="bg-blue-100 p-2 rounded-lg text-blue-600">
            <Landmark className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-gray-800 text-lg">PM Vishwakarma Yojana</h3>
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
            <h3 className="font-bold text-gray-800 text-lg">Geographical Indication (GI) Tag</h3>
            <p className="text-sm text-gray-500 mt-1">Register your heritage craft to protect its authenticity and increase market value globally.</p>
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
            <h3 className="font-bold text-gray-800 text-lg">PMMY (Mudra Loan)</h3>
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
