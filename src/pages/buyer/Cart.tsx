import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import { ChevronLeft, Trash2, ArrowRight } from 'lucide-react';

export const Cart: React.FC = () => {
  const navigate = useNavigate();
  const { products } = useAppContext();
  
  // Just grab the first published product as a mock cart item for the demo
  const cartItem = products.find(p => p.status === 'published');

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 pb-20">
      <div className="bg-white p-4 sticky top-0 z-10 flex items-center justify-between border-b border-gray-100 shadow-sm">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-1">
            <ChevronLeft className="w-6 h-6 text-gray-800" />
          </button>
          <h2 className="text-xl font-bold text-gray-800">Your Bag</h2>
        </div>
      </div>

      <div className="p-4 flex-1">
        {!cartItem ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500 gap-4 mt-20">
            <p>Your bag is empty.</p>
            <Link to="/" className="text-heritage-primary font-bold">Continue Exploring</Link>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-orange-100 flex gap-4 relative">
              <img src={cartItem.photoUrl} alt={cartItem.title} className="w-24 h-24 object-cover rounded-xl" />
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-gray-800 leading-tight">{cartItem.title}</h3>
                  <p className="text-xs text-gray-500 mt-1">Qty: 1</p>
                </div>
                <div className="flex justify-between items-end">
                  <p className="font-black text-lg text-heritage-primary">₹{cartItem.finalPrice}</p>
                  <button className="text-gray-400 p-1">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 mt-4">
              <h3 className="font-bold text-gray-800 mb-4">Order Summary</h3>
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Subtotal</span>
                <span>₹{cartItem.finalPrice}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Shipping</span>
                <span className="text-green-600">Free</span>
              </div>
              <hr className="my-3 border-dashed" />
              <div className="flex justify-between font-bold text-lg text-gray-800">
                <span>Total</span>
                <span>₹{cartItem.finalPrice}</span>
              </div>
              
              <div className="bg-green-50 p-3 rounded-xl mt-4 flex items-center justify-center gap-2">
                 <span className="text-xs font-bold text-green-800">₹{cartItem.suggestedPrice} goes directly to the Artisan!</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {cartItem && (
        <div className="fixed bottom-0 w-full max-w-md bg-white p-4 border-t border-gray-100 shadow-[0_-10px_20px_-10px_rgba(0,0,0,0.1)] z-20">
          <Link to="/checkout" className="w-full bg-gray-900 text-white font-bold text-lg py-4 rounded-xl shadow-lg flex justify-center items-center gap-2">
            Proceed to Checkout <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      )}
    </div>
  );
};
