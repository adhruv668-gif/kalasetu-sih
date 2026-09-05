import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ChevronLeft, CheckCircle2 } from 'lucide-react';

export const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const [placed, setPlaced] = useState(false);

  if (placed) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-heritage-bg p-6 text-center">
        <div className="bg-white p-8 rounded-full shadow-lg mb-6">
          <CheckCircle2 className="w-20 h-20 text-green-500" />
        </div>
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Order Confirmed!</h2>
        <p className="text-gray-600 mb-8 max-w-[250px]">Thank you for supporting authentic Indian heritage crafts.</p>
        <Link to="/" className="w-full bg-heritage-primary text-white font-bold text-lg py-4 rounded-xl shadow-lg">
          Continue Exploring
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 pb-20">
      <div className="bg-white p-4 sticky top-0 z-10 flex items-center gap-3 border-b border-gray-100 shadow-sm">
        <button onClick={() => navigate(-1)} className="p-1">
          <ChevronLeft className="w-6 h-6 text-gray-800" />
        </button>
        <h2 className="text-xl font-bold text-gray-800">Checkout</h2>
      </div>

      <div className="p-4 flex flex-col gap-4">
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-800 mb-3">Delivery Address</h3>
          <p className="text-sm text-gray-600 font-medium">Anand Kumar</p>
          <p className="text-sm text-gray-500">123 Heritage Lane, Indiranagar</p>
          <p className="text-sm text-gray-500">Bengaluru, Karnataka 560038</p>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-800 mb-3">Payment Method</h3>
          <div className="flex items-center gap-3 p-3 border border-orange-200 rounded-xl bg-orange-50">
             <div className="w-4 h-4 rounded-full bg-heritage-primary flex items-center justify-center">
               <div className="w-2 h-2 rounded-full bg-white"></div>
             </div>
             <span className="font-medium text-sm text-orange-900">UPI / Google Pay</span>
          </div>
          <div className="flex items-center gap-3 p-3 border border-gray-100 rounded-xl mt-2 opacity-50">
             <div className="w-4 h-4 rounded-full border border-gray-300"></div>
             <span className="font-medium text-sm text-gray-600">Credit / Debit Card</span>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 w-full max-w-md bg-white p-4 border-t border-gray-100 shadow-[0_-10px_20px_-10px_rgba(0,0,0,0.1)] z-20">
        <button 
          onClick={() => setPlaced(true)}
          className="w-full bg-green-600 text-white font-bold text-lg py-4 rounded-xl shadow-lg flex justify-center items-center gap-2"
        >
          Pay Securely
        </button>
      </div>
    </div>
  );
};
