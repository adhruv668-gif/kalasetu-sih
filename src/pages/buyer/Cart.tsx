import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useNavigate, Link } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import { ChevronLeft, Trash2, ArrowRight, ShoppingBag } from 'lucide-react';
import type { Product } from '../../types';

export const Cart: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { cart, products, removeFromCart } = useAppContext();

  // Look up full product objects from the user's Firestore cart IDs
  const cartItems = cart
    .map(id => products.find(p => p.id === id))
    .filter(Boolean) as Product[];

  const subtotal = cartItems.reduce((acc, item) => acc + (item.finalPrice || 0), 0);
  const artisanShare = cartItems.reduce((acc, item) => acc + (item.suggestedPrice || 0), 0);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 pb-28">
      {/* Header */}
      <div className="bg-white p-4 sticky top-0 z-10 flex items-center justify-between border-b border-gray-100 shadow-sm">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-1 btn-press">
            <ChevronLeft className="w-6 h-6 text-gray-800" />
          </button>
          <h2 className="text-xl font-bold text-gray-800">{t.buyer.cart.title} ({cartItems.length})</h2>
        </div>
      </div>

      <div className="p-4 flex-1">
        {cartItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500 gap-4 mt-20 text-center">
            <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center text-heritage-primary mb-2 shadow-inner">
              <ShoppingBag className="w-10 h-10" />
            </div>
            <h3 className="font-bold text-xl text-gray-800">{t.buyer.cart.empty}</h3>
            <p className="text-sm text-gray-500 max-w-xs">Discover unique GI-tagged treasures handcrafted by master artisans across India.</p>
            <Link 
              to="/" 
              className="mt-2 bg-heritage-primary text-white font-bold px-6 py-3.5 rounded-xl shadow-md btn-press"
            >
              Explore Crafts
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {/* List of cart items */}
            {cartItems.map((item, index) => (
              <div 
                key={`${item.id}-${index}`} 
                className="bg-white p-4 rounded-2xl shadow-sm border border-orange-100/70 flex gap-4 relative card-hover"
              >
                <img 
                  src={item.photoUrl} 
                  alt={item.title} 
                  className="w-24 h-24 object-cover rounded-xl shrink-0" 
                  onError={(e) => { 
                    e.currentTarget.onerror = null; 
                    e.currentTarget.src = "https://placehold.co/600x600/F0F4F8/003366?text=Image+Unavailable"; 
                  }} 
                />
                <div className="flex-1 flex flex-col justify-between min-w-0">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-heritage-primary bg-orange-50 px-2 py-0.5 rounded-md">
                      {item.category}
                    </span>
                    <h3 className="font-bold text-gray-800 text-sm leading-snug mt-1 line-clamp-2">{item.title}</h3>
                  </div>
                  <div className="flex justify-between items-end mt-2">
                    <div>
                      <p className="font-black text-lg text-heritage-primary">₹{item.finalPrice}</p>
                      <p className="text-[10px] text-green-700 font-bold">₹{item.suggestedPrice} to maker</p>
                    </div>
                    <button 
                      onClick={() => removeFromCart(item.id)}
                      className="text-gray-400 hover:text-red-500 p-2 rounded-lg hover:bg-red-50 transition-colors btn-press"
                      title="Remove from bag"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {/* Order Summary */}
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 mt-2">
              <h3 className="font-bold text-gray-800 mb-4">Order Summary</h3>
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Items ({cartItems.length})</span>
                <span>₹{subtotal}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Shipping</span>
                <span className="text-green-600 font-bold">Free (Subsidized)</span>
              </div>
              <hr className="my-3 border-dashed" />
              <div className="flex justify-between font-bold text-lg text-gray-800">
                <span>{t.buyer.cart.total}</span>
                <span className="text-heritage-primary">₹{subtotal}</span>
              </div>
              
              <div className="bg-green-50 p-3 rounded-xl mt-4 flex items-center justify-center gap-2 border border-green-200">
                <span className="text-xs font-bold text-green-800 text-center">
                  ₹{artisanShare} goes directly to verified rural artisans!
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {cartItems.length > 0 && (
        <div className="fixed bottom-0 w-full max-w-md bg-white p-4 border-t border-gray-100 shadow-[0_-10px_20px_-10px_rgba(0,0,0,0.1)] z-20">
          <Link 
            to="/checkout" 
            className="w-full bg-gray-900 text-white font-bold text-base py-4 rounded-xl shadow-lg flex justify-center items-center gap-2 btn-press"
          >
            {t.buyer.cart.checkout} • ₹{subtotal} <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      )}
    </div>
  );
};
