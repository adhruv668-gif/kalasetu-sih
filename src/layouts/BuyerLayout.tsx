import React from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { Compass, ShoppingBag, User, ArrowRightLeft } from 'lucide-react';

export const BuyerLayout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-heritage-bg pb-20 max-w-md mx-auto shadow-xl relative border-x border-gray-200 font-sans flex flex-col">
      {/* Tricolor Strip */}
      <div className="h-1.5 w-full flex">
        <div className="flex-1 bg-[#FF9933]"></div>
        <div className="flex-1 bg-white"></div>
        <div className="flex-1 bg-[#138808]"></div>
      </div>
      
      <header className="bg-heritage-primary p-4 sticky top-0 z-10 flex flex-col shadow-md">
        <div className="flex justify-between items-center w-full">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-inner">
              <span className="text-heritage-primary font-black text-lg">K</span>
            </div>
            <div>
              <h1 className="font-bold text-xl text-white tracking-tight leading-tight">KalaSetu</h1>
              <p className="text-[10px] text-white/80 uppercase tracking-widest font-medium">Govt. of India</p>
            </div>
          </div>
          <button 
            onClick={() => navigate('/artisan')}
            className="flex items-center gap-1 bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-full text-white text-xs font-bold transition"
          >
            <ArrowRightLeft className="w-3 h-3" /> Artisan Login
          </button>
        </div>
      </header>
      
      <main className="flex-1 flex flex-col p-0 bg-white">
        <Outlet />
      </main>

      {/* Govt Footer */}
      <footer className="bg-gray-100 p-6 pb-24 border-t border-gray-200 mt-auto">
        <div className="flex flex-col items-center text-center gap-2">
           <div>
             <p className="text-xs font-bold text-gray-700">Ministry of Social Justice & Empowerment</p>
             <p className="text-xs text-gray-500">Government of India</p>
           </div>
           <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 mt-2">
              <span className="text-[10px] text-gray-500 underline">About</span>
              <span className="text-[10px] text-gray-500 underline">Grievance Redressal</span>
              <span className="text-[10px] text-gray-500 underline">Terms of Use</span>
              <span className="text-[10px] text-gray-500 underline">Contact</span>
           </div>
        </div>
      </footer>

      <nav className="fixed bottom-0 w-full max-w-md bg-white flex justify-around p-3 z-10 shadow-[0_-4px_15px_-3px_rgba(0,0,0,0.1)]">
        <Link to="/" className={`flex flex-col items-center p-2 ${location.pathname === '/' ? 'text-heritage-primary' : 'text-gray-400'}`}>
          <Compass className="w-6 h-6 mb-1" />
          <span className="text-xs font-medium">Discover</span>
        </Link>
        <Link to="/cart" className={`flex flex-col items-center p-2 ${location.pathname === '/cart' ? 'text-heritage-primary' : 'text-gray-400'}`}>
          <ShoppingBag className="w-6 h-6 mb-1" />
          <span className="text-xs font-medium">Bag</span>
        </Link>
        <Link to="/profile" className={`flex flex-col items-center p-2 ${location.pathname === '/profile' ? 'text-heritage-primary' : 'text-gray-400'}`}>
          <User className="w-6 h-6 mb-1" />
          <span className="text-xs font-medium">Profile</span>
        </Link>
      </nav>
    </div>
  );
};
