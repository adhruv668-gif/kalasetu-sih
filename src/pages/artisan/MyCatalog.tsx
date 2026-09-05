import React from 'react';
import { useAppContext } from '../../context/AppContext';
import { Link } from 'react-router-dom';
import { CloudOff, CheckCircle2, Edit2, Trash2, QrCode } from 'lucide-react';

export const MyCatalog: React.FC = () => {
  const { products, currentArtisanId, updateProduct } = useAppContext();
  const myProducts = products.filter(p => p.artisanId === currentArtisanId && p.status !== 'archived' as any); // using archived to soft delete

  const handleUnpublish = (id: string) => {
    updateProduct(id, { status: 'draft' as any }); // Or 'archived' if we want to remove it
  };

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-2xl font-bold text-gray-800">My Catalog</h2>
      
      {myProducts.length === 0 ? (
        <p className="text-gray-500">No products added yet.</p>
      ) : (
        <div className="flex flex-col gap-4 mt-2">
          {myProducts.map(product => (
            <div key={product.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex gap-4 relative overflow-hidden group">
              <img src={product.photoUrl} alt={product.title} className="w-20 h-20 object-cover rounded-lg shrink-0" />
              
              <div className="flex-1 flex flex-col justify-between py-1">
                <div className="pr-6">
                  <h3 className="font-bold text-gray-800 line-clamp-1">{product.title}</h3>
                  <p className="text-sm font-black text-heritage-primary">₹{product.finalPrice}</p>
                </div>
                
                <div className="flex items-center gap-1 text-xs font-medium">
                  {product.syncStatus === 'pending' ? (
                    <span className="text-amber-500 bg-amber-50 px-2 py-1 rounded-full flex items-center gap-1">
                      <CloudOff className="w-3 h-3" /> Waiting for internet
                    </span>
                  ) : (
                    <span className="text-green-600 bg-green-50 px-2 py-1 rounded-full flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Live
                    </span>
                  )}
                  {product.status === 'draft' && (
                     <span className="text-gray-500 bg-gray-100 px-2 py-1 rounded-full ml-1">Draft</span>
                  )}
                </div>
              </div>

              <div className="absolute top-2 right-2 flex flex-col gap-2">
                 <Link to={`/artisan/${product.artisanId}`} className="p-1.5 bg-blue-50 text-blue-600 rounded-lg border border-blue-200">
                    <QrCode className="w-4 h-4" />
                 </Link>
                 <button onClick={() => window.location.href = '#'} className="hidden p-1.5 bg-gray-50 text-gray-600 rounded-lg border border-gray-200">
                    <Edit2 className="w-4 h-4" />
                 </button>
                 <button onClick={() => handleUnpublish(product.id)} className="p-1.5 bg-red-50 text-red-500 rounded-lg border border-red-100">
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
