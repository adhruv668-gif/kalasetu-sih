import React from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { Compass, ShoppingBag, User, ArrowRightLeft, Globe } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

export const BuyerLayout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { language, setLanguage, t } = useLanguage();

  return (
    <div className="min-h-screen bg-heritage-bg pb-20 max-w-md mx-auto shadow-xl relative border-x border-gray-200 font-sans flex flex-col">
      {/* Tricolor Strip */}
      <div className="h-1 w-full flex sticky top-0 z-20">
        <div className="flex-1 bg-[#FF9933]"></div>
        <div className="flex-1 bg-white"></div>
        <div className="flex-1 bg-[#138808]"></div>
      </div>
      
      <header className="glass-header p-4 sticky top-1 z-10 flex flex-col shadow-sm">
        <div className="flex justify-between items-center w-full">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-white rounded-xl flex items-center justify-center shadow-inner">
              <span className="text-heritage-primary font-black text-xl">K</span>
            </div>
            <div>
              <h1 className="font-bold text-xl text-white tracking-tight leading-tight">KalaSetu</h1>
              <p className="text-[9px] text-white/80 uppercase tracking-widest font-medium mt-0.5">Govt. of India</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
              className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 px-3 py-2 rounded-xl text-white text-xs font-bold btn-press border border-white/10"
            >
              <Globe className="w-3 h-3" /> {language === 'en' ? 'EN / हिं' : 'हिं / EN'}
            </button>
            <button 
              onClick={() => navigate(user ? '/artisan' : '/login')}
              className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 px-3 py-2 rounded-xl text-white text-xs font-bold btn-press border border-white/10"
            >
              <ArrowRightLeft className="w-3 h-3" /> {user ? t.nav.artisanMode : 'Artisan Login'}
            </button>
          </div>
        </div>
      </header>
      
      <main className="flex-1 flex flex-col p-0 bg-heritage-bg page-transition">
        <Outlet />
      </main>

      {/* Govt Footer */}
      <footer className="bg-white p-8 pb-28 border-t border-gray-100 mt-auto shadow-sm relative z-0">
        <div className="flex flex-col items-center text-center gap-2">
           <div>
             <p className="text-xs font-bold text-gray-800">Ministry of Social Justice & Empowerment</p>
             <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">Government of India</p>
           </div>
        </div>
      </footer>

      <nav className="fixed bottom-0 w-full max-w-md glass-nav flex justify-around p-2 z-20 pb-safe">
        <Link to="/" className={`flex flex-col items-center p-3 rounded-xl transition-all duration-300 ${location.pathname === '/' ? 'text-heritage-primary bg-heritage-primary/5 scale-105' : 'text-gray-400 hover:text-gray-600'}`}>
          <Compass className="w-6 h-6 mb-1" />
          <span className="text-[10px] font-bold tracking-wide">{t.nav.discover}</span>
        </Link>
        <Link to="/cart" className={`flex flex-col items-center p-3 rounded-xl transition-all duration-300 ${location.pathname === '/cart' ? 'text-heritage-primary bg-heritage-primary/5 scale-105' : 'text-gray-400 hover:text-gray-600'}`}>
          <ShoppingBag className="w-6 h-6 mb-1" />
          <span className="text-[10px] font-bold tracking-wide">{t.nav.cart}</span>
        </Link>
        <Link to="/profile" className={`flex flex-col items-center p-3 rounded-xl transition-all duration-300 ${location.pathname === '/profile' ? 'text-heritage-primary bg-heritage-primary/5 scale-105' : 'text-gray-400 hover:text-gray-600'}`}>
          <User className="w-6 h-6 mb-1" />
          <span className="text-[10px] font-bold tracking-wide">{t.nav.profile}</span>
        </Link>
      </nav>
    </div>
  );
};
