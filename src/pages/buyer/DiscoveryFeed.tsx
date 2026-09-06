import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useAppContext } from '../../context/AppContext';
import { Link } from 'react-router-dom';

export const DiscoveryFeed: React.FC = () => {
  const { t } = useLanguage();
  const { products, artisans } = useAppContext();
  const [selectedCat, setSelectedCat] = useState('All');
  
  const liveProducts = products
    .filter(p => p.status === 'published')
    .filter(p => selectedCat === 'All' || p.category.toLowerCase().includes(selectedCat.toLowerCase()) || p.category === selectedCat);

  return (
    <div className="flex flex-col">
      <div className="px-5 pt-6 pb-2">
        <h2 className="text-2xl font-black text-gray-800 tracking-tight">Discover Authenticity</h2>
        <p className="text-sm text-gray-500 mt-1 font-medium">Directly from India's master artisans.</p>
      </div>

      <div className="flex gap-3 overflow-x-auto px-5 py-4 snap-x [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {['All', 'Pottery', 'Weaving', 'Woodwork', 'Metalcraft'].map(cat => (
          <button 
            key={cat} 
            onClick={() => setSelectedCat(cat)}
            className={`snap-start shrink-0 px-6 py-2.5 rounded-xl border text-sm font-bold shadow-sm transition-all duration-300 btn-press
              ${selectedCat === cat ? 'bg-heritage-primary text-white border-heritage-primary shadow-md' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'}`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-6 px-5 py-4">
        {liveProducts.map(product => {
          const artisan = artisans.find(a => a.id === product.artisanId);
          if (!artisan) return null;

          return (
            <Link key={product.id} to={`/product/${product.id}`} className="card-standard card-hover block overflow-hidden">
              <div className="relative h-64">
                <img src={product.photoUrl} alt={product.title} className="w-full h-full object-cover" onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = "https://placehold.co/600x600/F0F4F8/003366?text=Image+Unavailable"; }} />
                <div className="absolute top-4 left-4 bg-white/85 backdrop-blur-md px-3 py-1.5 rounded-xl text-xs font-bold text-gray-800 shadow-sm border border-white/50 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                  Verified Authenticity
                </div>
              </div>
              <div className="p-6 flex flex-col gap-4">
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <h3 className="font-bold text-lg text-gray-800 leading-tight">{product.title}</h3>
                    <p className="text-sm text-gray-500 mt-1">By {artisan.name} • {artisan.region}</p>
                  </div>
                  <p className="font-black text-xl text-heritage-primary shrink-0">₹{product.finalPrice}</p>
                </div>
                
                <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">{product.description}</p>
                
                <div className="bg-blue-50/80 p-4 rounded-xl flex items-center justify-between border border-blue-100/50 mt-2">
                  <span className="text-[10px] font-bold text-blue-900 uppercase tracking-widest">Fair Share Impact</span>
                  <div className="flex gap-1 items-center bg-white px-2.5 py-1.5 rounded-lg shadow-sm text-xs font-bold text-green-700 border border-green-100">
                    {Math.round((product.suggestedPrice / product.finalPrice) * 100)}% goes to Artisan
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
        {liveProducts.length === 0 && (
          <div className="text-center p-8 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
            <p className="text-gray-500 font-medium">No products found in this category.</p>
          </div>
        )}
      </div>
    </div>
  );
};



