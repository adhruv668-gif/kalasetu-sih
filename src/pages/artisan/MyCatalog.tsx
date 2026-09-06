import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useAppContext } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import { CloudOff, CheckCircle2, Trash2, QrCode } from 'lucide-react';

export const MyCatalog: React.FC = () => {
  const { t } = useLanguage();
  const { products, currentArtisanId, updateProduct } = useAppContext();
  const { artisanProfile } = useAuth();
  
  const artisanId = artisanProfile?.id || currentArtisanId;
  const myProducts = products.filter(p => p.artisanId === artisanId && p.status !== ('archived' as any));

  const handleUnpublish = (id: string) => {
    updateProduct(id, { status: 'draft' as any });
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-2xl font-black text-gray-800 tracking-tight">My Catalog</h2>
        <p className="text-sm text-gray-500 font-medium mt-1">Manage your live and pending products.</p>
      </div>
      
      {myProducts.length === 0 ? (
        <div className="text-center p-8 bg-white rounded-2xl border border-dashed border-gray-200">
          <p className="text-gray-500 font-medium">No products added yet.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-5 mt-1">
          {myProducts.map(product => (
            <div key={product.id} className="card-standard p-4 flex gap-4 relative overflow-hidden group">
              <img src={product.photoUrl} alt={product.title} className="w-24 h-24 object-cover rounded-xl shrink-0 border border-gray-100" onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = "https://placehold.co/600x600/F0F4F8/003366?text=Image+Unavailable"; }} />
              
              <div className="flex-1 flex flex-col justify-between py-1">
                <div className="pr-8">
                  <h3 className="font-bold text-gray-800 line-clamp-1 leading-tight">{product.title}</h3>
                  <p className="text-sm font-black text-heritage-primary mt-1">₹{product.finalPrice}</p>
                </div>
                
                <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider mt-2">
                  {product.syncStatus === 'pending' ? (
                    <span className="text-amber-600 bg-amber-50 px-2 py-1.5 rounded-lg flex items-center gap-1 border border-amber-100">
                      <CloudOff className="w-3 h-3" /> Pending Sync
                    </span>
                  ) : (
                    <span className="text-green-700 bg-green-50 px-2 py-1.5 rounded-lg flex items-center gap-1 border border-green-100">
                      <CheckCircle2 className="w-3 h-3" /> Live on App
                    </span>
                  )}
                  {product.status === 'draft' && (
                     <span className="text-gray-500 bg-gray-100 px-2 py-1.5 rounded-lg ml-1 border border-gray-200">Draft</span>
                  )}
                </div>
              </div>

              <div className="absolute top-4 right-4 flex flex-col gap-2">
                 <Link to={`/artisan/${product.artisanId}`} className="p-2 bg-blue-50 text-blue-600 rounded-lg border border-blue-200 btn-press">
                    <QrCode className="w-4 h-4" />
                 </Link>
                 <button onClick={() => handleUnpublish(product.id)} className="p-2 bg-red-50 text-red-500 rounded-lg border border-red-100 btn-press">
                    <Trash2 className="w-4 h-4" />
                 </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};


