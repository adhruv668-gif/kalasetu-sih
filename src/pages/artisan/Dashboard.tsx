import React from 'react';
import { useAppContext } from '../../context/AppContext';
import { Link } from 'react-router-dom';
import { IndianRupee, Package, TrendingUp } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { artisans, currentArtisanId, products } = useAppContext();
  const artisan = artisans.find(a => a.id === currentArtisanId);
  const myProducts = products.filter(p => p.artisanId === currentArtisanId);

  if (!artisan) return null;

  return (
    <div className="flex flex-col gap-6">
      <Link to="/artisan/profile" className="flex items-center gap-4 bg-white p-4 rounded-2xl shadow-sm border border-orange-100 active:scale-[0.98] transition">
        <img src={artisan.photoUrl} alt={artisan.name} className="w-16 h-16 rounded-full object-cover border-2 border-heritage-secondary" />
        <div className="flex-1">
          <h2 className="text-xl font-bold text-gray-800">Namaste, {artisan.name}</h2>
          <p className="text-sm text-gray-500">{artisan.craft} • {artisan.region}</p>
        </div>
        <div className="bg-gray-50 p-2 rounded-full">
           <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
        </div>
      </Link>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-start mb-2">
            <p className="text-sm font-bold text-gray-500">Total Sales</p>
            <IndianRupee className="w-5 h-5 text-green-500" />
          </div>
          <p className="text-2xl font-black text-gray-800">₹12,450</p>
          <p className="text-xs text-green-600 font-medium mt-1">+15% this month</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-start mb-2">
            <p className="text-sm font-bold text-gray-500">Live Items</p>
            <Package className="w-5 h-5 text-blue-500" />
          </div>
          <p className="text-2xl font-black text-gray-800">{myProducts.filter(p => p.status === 'published').length}</p>
          <Link to="/artisan/products" className="text-xs text-heritage-primary font-medium mt-1 block">View Catalog &rarr;</Link>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex gap-4 items-start shadow-sm">
        <div className="bg-blue-100 p-2 rounded-full mt-1">
          <TrendingUp className="w-6 h-6 text-blue-600" />
        </div>
        <div>
          <h3 className="font-bold text-blue-900">Scheme Eligibility</h3>
          <p className="text-sm text-blue-800 mt-1">Based on your craft category, you might be eligible for Govt. schemes.</p>
          <Link to="/artisan/schemes" className="inline-block text-xs bg-blue-600 text-white px-4 py-2 rounded-full mt-3 font-bold uppercase tracking-wide shadow-sm">
            Learn More
          </Link>
        </div>
      </div>

      <div className="text-center mt-2 pb-4">
        <Link to="/artisan/whatsapp" className="text-sm text-gray-500 font-medium underline underline-offset-4 decoration-gray-300">
          Feature-phone artisans? See WhatsApp Bot Demo
        </Link>
      </div>
    </div>
  );
};
