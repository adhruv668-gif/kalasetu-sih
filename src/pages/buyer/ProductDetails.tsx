import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import { ChevronLeft, ShieldCheck, ChevronRight } from 'lucide-react';

export const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { products, artisans } = useAppContext();
  
  const product = products.find(p => p.id === id);
  if (!product) return <div>Product not found</div>;
  
  const artisan = artisans.find(a => a.id === product.artisanId);
  if (!artisan) return null;

  // Fair share logic (Single source of truth)
  const artisanTake = product.suggestedPrice;
  const platformFee = product.finalPrice - product.suggestedPrice;
  const artisanPct = Math.round((artisanTake / product.finalPrice) * 100);
  const feePct = 100 - artisanPct;

  return (
    <div className="flex flex-col pb-6 bg-white min-h-screen">
      <div className="relative h-80">
        <img src={product.photoUrl} alt={product.title} className="w-full h-full object-cover" />
        <button onClick={() => navigate(-1)} className="absolute top-4 left-4 bg-white/80 p-2 rounded-full shadow backdrop-blur">
          <ChevronLeft className="w-6 h-6" />
        </button>
      </div>

      <div className="px-5 py-6 flex flex-col gap-6 -mt-6 bg-white rounded-t-3xl relative z-10 shadow-lg border-t border-gray-100">
        <div>
          <div className="flex justify-between items-start">
            <h1 className="text-2xl font-bold text-gray-900 leading-tight">{product.title}</h1>
            <p className="text-3xl font-black text-heritage-primary">₹{product.finalPrice}</p>
          </div>
          <p className="text-sm text-gray-500 mt-2">{product.description}</p>
        </div>

        <Link to={`/artisan/${artisan.id}`} className="bg-orange-50 border border-orange-100 p-4 rounded-2xl flex items-center gap-4 active:scale-[0.98] transition">
          <img src={artisan.photoUrl} alt={artisan.name} className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm" />
          <div className="flex-1">
            <p className="text-xs font-bold text-orange-800 uppercase tracking-wide">Crafted By</p>
            <h3 className="font-bold text-gray-800 text-lg">{artisan.name}</h3>
            <p className="text-xs text-gray-500">{artisan.region}</p>
          </div>
          <div className="bg-white p-2 rounded-full shadow-sm">
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </div>
        </Link>

        {/* Fair Share Transparency Meter */}
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm mt-2">
          <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
            Fair Share Transparency
          </h3>
          <div className="h-4 w-full bg-blue-100 rounded-full overflow-hidden flex">
            <div className="h-full bg-green-500" style={{ width: `${artisanPct}%` }}></div>
            <div className="h-full bg-blue-500 flex-1"></div>
          </div>
          <div className="flex justify-between mt-2 text-xs font-bold">
            <span className="text-green-700">{artisanPct}% Artisan (₹{artisanTake})</span>
            <span className="text-blue-700">{feePct}% Platform Fee (₹{platformFee})</span>
          </div>
          <p className="text-[10px] text-gray-500 mt-2 leading-tight">By eliminating middlemen, KalaSetu ensures the artisan receives their full asked price directly.</p>
        </div>

        <div className="flex items-start gap-3 bg-[#E8F1F8] p-4 rounded-xl border border-blue-200">
          <ShieldCheck className="w-6 h-6 text-[#003366] shrink-0" />
          <div className="flex-1">
            <h4 className="font-bold text-sm text-[#003366]">Authentic Heritage Craft</h4>
            <p className="text-xs text-gray-700 mt-1">This product comes with a verifiable authenticity certificate linked directly to the artisan.</p>
            <Link to={`/artisan/${artisan.id}`} className="mt-2 text-xs font-bold text-blue-700 uppercase tracking-wide flex items-center gap-1 border border-blue-300 w-max px-3 py-1 rounded bg-white">
              View Certificate
            </Link>
          </div>
        </div>
        
        {/* Ministry Badge */}
        <div className="flex flex-col items-center justify-center mt-2 opacity-80">
           <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest text-center mt-2">Verified by Ministry of Social Justice & Empowerment</p>
        </div>

        <Link to="/cart" className="w-full bg-gray-900 text-white font-bold text-lg py-4 rounded-2xl shadow-xl mt-4 flex justify-center">
          Add to Bag
        </Link>
      </div>
    </div>
  );
};


