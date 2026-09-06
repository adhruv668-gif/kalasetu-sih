import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Store, PlusCircle, Package, Wifi, WifiOff, Globe } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

export const ArtisanLayout: React.FC = () => {
  const { isOnline, products, toggleDemoOffline } = useAppContext();
  const { artisanProfile } = useAuth();
  const location = useLocation();
  const { language, setLanguage, t } = useLanguage();
  const pendingCount = products.filter(p => p.syncStatus === 'pending').length;

  return (
    <div className="min-h-screen bg-heritage-bg pb-20 max-w-md mx-auto shadow-xl relative border-x border-gray-200">
      {/* Tricolor Strip */}
      <div className="h-1 w-full flex sticky top-0 z-20">
        <div className="flex-1 bg-[#FF9933]"></div>
        <div className="flex-1 bg-white"></div>
        <div className="flex-1 bg-[#138808]"></div>
      </div>

      <header className="glass-header text-white p-4 sticky top-1 z-10 flex flex-col shadow-sm">
        <div className="flex justify-between items-center w-full">
          <div>
            <h1 className="font-bold text-xl tracking-wide">Artisan Portal</h1>
            <p className="text-[9px] text-white/80 uppercase tracking-widest font-medium mt-0.5">
              {artisanProfile ? artisanProfile.name : 'Govt. of India'}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
              className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 px-3 py-2 rounded-xl text-white text-xs font-bold btn-press border border-white/10"
            >
              <Globe className="w-3 h-3" /> {language === 'en' ? 'EN / हिं' : 'हिं / EN'}
            </button>
            <Link to="/" className="text-[10px] uppercase font-bold bg-white text-heritage-primary px-3 py-2 rounded-xl flex items-center gap-1 shadow-sm btn-press">
              {t.nav.buyerMode}
            </Link>
          </div>
        </div>
      </header>
      
      <main className="p-5 page-transition">
        <Outlet />
      </main>

      <nav className="fixed bottom-0 w-full max-w-md glass-nav flex justify-around p-2 z-20 pb-safe">
        <Link to="/artisan" className={`flex flex-col items-center p-3 rounded-xl transition-all duration-300 ${location.pathname === '/artisan' ? 'text-heritage-primary bg-heritage-primary/5 scale-105' : 'text-gray-400 hover:text-gray-600'}`}>
          <Store className="w-6 h-6 mb-1" />
          <span className="text-[10px] font-bold tracking-wide">{t.nav.dashboard}</span>
        </Link>
        <Link to="/artisan/add" className={`flex flex-col items-center p-3 rounded-xl transition-all duration-300 ${location.pathname.includes('/add') ? 'text-heritage-primary bg-heritage-primary/5 scale-105' : 'text-gray-400 hover:text-gray-600'}`}>
          <PlusCircle className="w-6 h-6 mb-1" />
          <span className="text-[10px] font-bold tracking-wide">{t.nav.add}</span>
        </Link>
        <Link to="/artisan/products" className={`flex flex-col items-center p-3 rounded-xl transition-all duration-300 ${location.pathname.includes('/products') ? 'text-heritage-primary bg-heritage-primary/5 scale-105' : 'text-gray-400 hover:text-gray-600'}`}>
          <Package className="w-6 h-6 mb-1" />
          <span className="text-[10px] font-bold tracking-wide">{t.nav.catalog}</span>
        </Link>
      </nav>
    </div>
  );
};
