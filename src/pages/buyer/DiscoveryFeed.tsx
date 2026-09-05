import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { Link } from 'react-router-dom';

export const DiscoveryFeed: React.FC = () => {
  const { products, artisans } = useAppContext();
  const [selectedCat, setSelectedCat] = useState('All');
  
  const liveProducts = products
    .filter(p => p.status === 'published')
    .filter(p => selectedCat === 'All' || p.category === selectedCat);

  return (
    <div className="flex flex-col">
      <div className="px-4 pt-4 pb-2">
        <h2 className="text-2xl font-bold text-gray-800">Discover Authenticity</h2>
        <p className="text-sm text-gray-500 mt-1">Directly from India's master artisans.</p>
      </div>

      <div className="flex gap-3 overflow-x-auto px-4 py-3 snap-x [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {['All', 'Pottery', 'Weaving', 'Woodwork', 'Metalcraft'].map(cat => (
          <button 
            key={cat} 
            onClick={() => setSelectedCat(cat)}
            className={`snap-start shrink-0 px-5 py-2 rounded-full border text-sm font-medium shadow-sm transition
              ${selectedCat === cat ? 'bg-heritage-primary text-white border-heritage-primary' : 'bg-white text-gray-700 border-gray-200'}`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-6 px-4 py-4">
        {liveProducts.map(product => {
          const artisan = artisans.find(a => a.id === product.artisanId);
          if (!artisan) return null;

          return (
            <Link key={product.id} to={`/product/${product.id}`} className="bg-white rounded-3xl overflow-hidden shadow-md block border border-gray-100">
              <div className="relative h-64">
                <img src={product.photoUrl} alt={product.title} className="w-full h-full object-cover" />
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-gray-800 shadow-sm flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-green-500"></span>
                  Verified Authenticity
                </div>
              </div>
              <div className="p-5 flex flex-col gap-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-lg text-gray-800">{product.title}</h3>
                    <p className="text-sm text-gray-500">By {artisan.name} • {artisan.region}</p>
                  </div>
                  <p className="font-black text-xl text-heritage-primary">₹{product.finalPrice}</p>
                </div>
                
                <p className="text-sm text-gray-600 line-clamp-2">{product.description}</p>
                
                <div className="bg-blue-50 p-3 rounded-xl flex items-center justify-between border border-blue-100 mt-2">
                  <span className="text-xs font-bold text-blue-900 uppercase tracking-wide">Fair Share Impact</span>
                  <div className="flex gap-1 items-center bg-white px-2 py-1 rounded shadow-sm text-xs font-bold text-green-700 border border-green-200">
                    {Math.round((product.suggestedPrice / product.finalPrice) * 100)}% goes to Artisan
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
        {liveProducts.length === 0 && (
          <p className="text-center text-gray-500 mt-10">No products found in this category.</p>
        )}
      </div>
    </div>
  );
};
