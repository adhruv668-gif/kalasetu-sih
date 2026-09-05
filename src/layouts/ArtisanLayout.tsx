import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Store, PlusCircle, Package, Wifi, WifiOff } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

export const ArtisanLayout: React.FC = () => {
  const { isOnline, products, toggleDemoOffline } = useAppContext();
  const location = useLocation();
  const pendingCount = products.filter(p => p.syncStatus === 'pending').length;

  return (
    <div className="min-h-screen bg-heritage-bg pb-20 max-w-md mx-auto shadow-xl relative border-x border-gray-200">
      {/* Tricolor Strip */}
      <div className="h-1.5 w-full flex">
        <div className="flex-1 bg-[#FF9933]"></div>
        <div className="flex-1 bg-white"></div>
        <div className="flex-1 bg-[#138808]"></div>
      </div>

      <header className="bg-heritage-primary text-white p-4 sticky top-0 z-10 flex flex-col shadow-md">
        <div className="flex justify-between items-center w-full">
          <div>
            <h1 className="font-bold text-xl tracking-wide">Artisan Portal</h1>
            <p className="text-[10px] text-white/80 uppercase tracking-widest font-medium">Govt. of India</p>
          </div>
          <div className="flex items-center gap-2">
            {pendingCount > 0 && (
              <span className="text-[10px] bg-amber-500 px-2 py-1 rounded-full font-bold uppercase tracking-wider">
                {pendingCount} Pending
              </span>
            )}
            <button onClick={toggleDemoOffline} className="p-1.5 rounded-full hover:bg-white/10 transition bg-black/20">
              {isOnline ? (
                <Wifi className="w-4 h-4 text-green-300" />
              ) : (
                <WifiOff className="w-4 h-4 text-red-300" />
              )}
            </button>
            <Link to="/" className="text-[10px] uppercase font-bold bg-white/10 px-2 py-1.5 rounded flex items-center gap-1 border border-white/20">
              View Site
            </Link>
          </div>
        </div>
      </header>
      
      <main className="p-4">
        <Outlet />
      </main>

      <nav className="fixed bottom-0 w-full max-w-md bg-white border-t border-heritage-secondary flex justify-around p-3 z-10 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
        <Link to="/artisan" className={`flex flex-col items-center p-2 ${location.pathname === '/artisan' ? 'text-heritage-primary' : 'text-gray-500'}`}>
          <Store className="w-6 h-6 mb-1" />
          <span className="text-xs font-medium">Dashboard</span>
        </Link>
        <Link to="/artisan/add" className={`flex flex-col items-center p-2 ${location.pathname.includes('/add') ? 'text-heritage-primary' : 'text-gray-500'}`}>
          <PlusCircle className="w-6 h-6 mb-1" />
          <span className="text-xs font-medium">Add Item</span>
        </Link>
        <Link to="/artisan/products" className={`flex flex-col items-center p-2 ${location.pathname.includes('/products') ? 'text-heritage-primary' : 'text-gray-500'}`}>
          <Package className="w-6 h-6 mb-1" />
          <span className="text-xs font-medium">My Catalog</span>
        </Link>
      </nav>
    </div>
  );
};
