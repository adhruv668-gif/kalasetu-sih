import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useNavigate, Link } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { ChevronLeft, CheckCircle2, ShieldCheck, Loader2 } from 'lucide-react';
import type { Product } from '../../types';

export const Checkout: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { cart, products, placeOrder } = useAppContext();
  
  const [placed, setPlaced] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [isPlacing, setIsPlacing] = useState(false);

  const cartItems = cart
    .map(id => products.find(p => p.id === id))
    .filter(Boolean) as Product[];

  const total = cartItems.reduce((acc, item) => acc + (item.finalPrice || 0), 0);

  const handlePay = async () => {
    if (cartItems.length === 0) return;
    setIsPlacing(true);
    try {
      const newId = await placeOrder(total);
      setOrderId(newId);
      setPlaced(true);
    } catch (e) {
      console.error('Order creation failed:', e);
      alert('Order could not be saved to Firestore. Please try again.');
    } finally {
      setIsPlacing(false);
    }
  };

  if (placed) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-heritage-bg p-6 text-center">
        <div className="bg-white p-6 rounded-full shadow-xl mb-6 border-4 border-green-100">
          <CheckCircle2 className="w-16 h-16 text-green-500 animate-bounce" />
        </div>
        <span className="text-[11px] font-bold uppercase tracking-widest text-green-700 bg-green-100 px-3 py-1 rounded-full mb-3">
          Saved to Firestore
        </span>
        <h2 className="text-3xl font-black text-gray-800 mb-2">Order Confirmed!</h2>
        <p className="text-xs font-mono text-gray-500 mb-2 bg-gray-100 px-3 py-1.5 rounded-lg border border-gray-200">
          Order Ref: #{orderId.slice(0, 10).toUpperCase()}
        </p>
        <p className="text-sm text-gray-600 mb-6 max-w-xs leading-relaxed">
          {t.buyer.checkout.successDesc}
        </p>

        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm w-full max-w-xs mb-6 text-left">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Order Details</p>
          <div className="flex justify-between text-sm text-gray-700 mb-1">
            <span>Items Purchased:</span>
            <span className="font-bold">{cartItems.length}</span>
          </div>
          <div className="flex justify-between text-sm text-gray-700 mb-1">
            <span>Total Paid:</span>
            <span className="font-bold text-heritage-primary">₹{total}</span>
          </div>
          <div className="flex justify-between text-sm text-gray-700">
            <span>Account:</span>
            <span className="font-mono text-xs text-gray-500">{user?.phoneNumber || 'Verified Citizen'}</span>
          </div>
        </div>

        <Link 
          to="/" 
          className="w-full max-w-xs bg-heritage-primary text-white font-bold text-base py-4 rounded-xl shadow-lg btn-press text-center"
        >
          {t.buyer.checkout.continue}
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 pb-28">
      <div className="bg-white p-4 sticky top-0 z-10 flex items-center gap-3 border-b border-gray-100 shadow-sm">
        <button onClick={() => navigate(-1)} className="p-1 btn-press">
          <ChevronLeft className="w-6 h-6 text-gray-800" />
        </button>
        <h2 className="text-xl font-bold text-gray-800">{t.buyer.checkout.title}</h2>
      </div>

      <div className="p-4 flex flex-col gap-4">
        {/* Delivery Address */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-gray-800 text-sm">{t.buyer.checkout.address}</h3>
            <span className="text-[10px] bg-green-50 text-green-700 px-2 py-0.5 rounded-md font-bold">Default</span>
          </div>
          <p className="text-sm text-gray-800 font-bold">Anand Kumar</p>
          <p className="text-xs text-gray-500 mt-0.5">123 Heritage Lane, Indiranagar</p>
          <p className="text-xs text-gray-500">Bengaluru, Karnataka 560038</p>
          <p className="text-xs text-gray-400 mt-1 font-mono">{user?.phoneNumber || '+91 9876543210'}</p>
        </div>

        {/* Selected Items */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-800 text-sm mb-3">Items in Order ({cartItems.length})</h3>
          <div className="flex flex-col gap-3">
            {cartItems.map((item, idx) => (
              <div key={idx} className="flex justify-between items-center text-xs">
                <span className="text-gray-700 font-medium line-clamp-1 flex-1 pr-2">{item.title}</span>
                <span className="font-bold text-gray-900 shrink-0">₹{item.finalPrice}</span>
              </div>
            ))}
          </div>
          <hr className="my-3 border-dashed" />
          <div className="flex justify-between font-bold text-sm text-gray-900">
            <span>Total Payable</span>
            <span className="text-heritage-primary font-black text-base">₹{total}</span>
          </div>
        </div>

        {/* Payment Method */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-800 text-sm mb-3">{t.buyer.checkout.payment}</h3>
          <div className="flex items-center gap-3 p-3.5 border border-orange-200 rounded-xl bg-orange-50/70">
            <div className="w-4 h-4 rounded-full bg-heritage-primary flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
            </div>
            <div>
              <span className="font-bold text-xs text-orange-950 block">{t.buyer.checkout.upi}</span>
              <span className="text-[10px] text-orange-700 font-medium">Direct Settlement to Artisan Bank Account</span>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3.5 border border-gray-100 rounded-xl mt-2 opacity-50">
            <div className="w-4 h-4 rounded-full border border-gray-300"></div>
            <span className="font-medium text-xs text-gray-600">Credit / Debit Card (Domestic)</span>
          </div>
        </div>

        {/* Trust badge */}
        <div className="flex items-center gap-3 bg-blue-50/70 p-4 rounded-xl border border-blue-100 text-xs text-blue-900">
          <ShieldCheck className="w-5 h-5 text-blue-700 shrink-0" />
          <span>Secured by National Payments Corporation of India (NPCI) & Ministry verified gateway.</span>
        </div>
      </div>

      <div className="fixed bottom-0 w-full max-w-md bg-white p-4 border-t border-gray-100 shadow-[0_-10px_20px_-10px_rgba(0,0,0,0.1)] z-20">
        <button 
          onClick={handlePay}
          disabled={isPlacing || cartItems.length === 0}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-bold text-base py-4 rounded-xl shadow-lg flex justify-center items-center gap-2 btn-press disabled:opacity-50"
        >
          {isPlacing ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Saving Order to Firestore...</span>
            </>
          ) : (
            <span>Pay Securely • ₹{total}</span>
          )}
        </button>
      </div>
    </div>
  );
};
