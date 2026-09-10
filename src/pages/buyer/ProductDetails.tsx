import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import { ChevronLeft, ShieldCheck, ChevronRight, AlertTriangle, Award, ShoppingBag, CheckCircle2 } from 'lucide-react';

export const ProductDetails: React.FC = () => {
  const { t } = useLanguage();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { products, artisans, addToCart } = useAppContext();
  const [showCounterfeitModal, setShowCounterfeitModal] = useState(false);
  const [reportSubmitted, setReportSubmitted] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  
  const product = products.find(p => p.id === id);
  if (!product) return <div className="p-8 text-center text-gray-500">{t.buyer.details.notFound}</div>;
  
  const artisan = artisans.find(a => a.id === product.artisanId);
  if (!artisan) return null;

  const artisanTake = product.suggestedPrice;
  const platformFee = product.finalPrice - product.suggestedPrice;
  const artisanPct = Math.round((artisanTake / product.finalPrice) * 100);
  const feePct = 100 - artisanPct;

  // GI Tag Logic (Mocked logic based on known seeded crafts)
  const isGITagged = 
    product.title.toLowerCase().includes('blue') || 
    product.title.toLowerCase().includes('kondapalli') || 
    product.title.toLowerCase().includes('thanjavur') ||
    product.title.toLowerCase().includes('bhujodi') ||
    product.title.toLowerCase().includes('brass');

  return (
    <div className="flex flex-col pb-6 bg-heritage-bg min-h-screen">
      <div className="relative h-[45vh]">
        <img src={product.photoUrl} alt={product.title} className="w-full h-full object-cover" onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = "https://placehold.co/600x600/F0F4F8/003366?text=Image+Unavailable"; }} />
        <button onClick={() => navigate(-1)} className="absolute top-4 left-4 bg-white/80 p-2.5 rounded-full shadow-sm backdrop-blur-md btn-press border border-white">
          <ChevronLeft className="w-5 h-5 text-gray-800" />
        </button>
      </div>

      <div className="px-6 py-8 flex flex-col gap-6 -mt-8 bg-white rounded-t-3xl relative z-10 shadow-lg border-t border-gray-100">
        <div>
          <div className="flex justify-between items-start gap-4">
            <div>
              <h1 className="text-2xl font-black text-gray-900 leading-tight tracking-tight">{product.title}</h1>
              {product.titleHi && (
                <p className="text-sm font-semibold text-amber-900/80 mt-0.5">{product.titleHi}</p>
              )}
            </div>
            <p className="text-3xl font-black text-heritage-primary shrink-0">₹{product.finalPrice}</p>
          </div>

          {product.isStudioEnhanced && (
            <div className="inline-flex items-center gap-1.5 bg-amber-50 border border-amber-200 text-amber-900 text-xs px-2.5 py-1 rounded-full font-bold mt-2">
              <span>✨ Studio Background Isolated</span>
            </div>
          )}

          <p className="text-sm text-gray-600 mt-3 leading-relaxed">{product.description}</p>
          {product.descriptionHi && (
            <div className="mt-3 p-3 bg-amber-50/50 rounded-xl border border-amber-100/60 text-xs text-gray-700 leading-relaxed">
              <span className="font-bold text-amber-900 block mb-0.5">पारंपरिक शिल्प विवरण:</span>
              {product.descriptionHi}
            </div>
          )}
        </div>

        <Link to={`/artisan/${artisan.id}`} className="bg-orange-50/50 border border-orange-100 p-4 rounded-2xl flex items-center gap-4 btn-press card-hover">
          <img src={artisan.photoUrl} alt={artisan.name} className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-sm" onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = "https://placehold.co/600x600/F0F4F8/003366?text=Image+Unavailable"; }} />
          <div className="flex-1">
            <p className="text-[10px] font-bold text-orange-800 uppercase tracking-widest">{t.buyer.details.craftedBy}</p>
            <h3 className="font-bold text-gray-900 text-lg">{artisan.name}</h3>
            <p className="text-xs text-gray-600 font-medium">{artisan.region}</p>
          </div>
          <div className="bg-white p-2.5 rounded-xl shadow-sm border border-gray-100">
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </div>
        </Link>

        {/* Fair Share Transparency Meter */}
        <div className="card-standard p-5 mt-2">
          <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
            Fair Share Transparency
          </h3>
          <div className="h-4 w-full bg-blue-100/50 rounded-full overflow-hidden flex shadow-inner">
            <div className="h-full bg-green-500 transition-all duration-1000 ease-out" style={{ width: `${artisanPct}%` }}></div>
            <div className="h-full bg-blue-500 flex-1 transition-all duration-1000 ease-out"></div>
          </div>
          <div className="flex justify-between mt-3 text-xs font-bold">
            <span className="text-green-700 bg-green-50 px-2 py-1 rounded-md">{artisanPct}% Artisan (₹{artisanTake})</span>
            <span className="text-blue-700 bg-blue-50 px-2 py-1 rounded-md">{feePct}% Platform (₹{platformFee})</span>
          </div>
          <p className="text-[11px] text-gray-500 mt-3 leading-relaxed font-medium">{t.buyer.details.fairShareText}</p>
        </div>

        {/* NEW: IP & GI Tag Authentication */}
        <div className="flex flex-col gap-3">
          {isGITagged && (
            <div className="flex items-start gap-3 bg-[#FFF8E7] p-5 rounded-2xl border border-[#FFE4A0]">
              <Award className="w-6 h-6 text-[#D4AF37] shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-sm text-[#997A00]">{t.buyer.details.giTag}</h4>
                <p className="text-[11px] text-[#806600] mt-1 leading-relaxed font-medium">{t.buyer.details.giTagDesc}</p>
              </div>
            </div>
          )}

          <div className="flex items-start gap-3 bg-[#E8F1F8]/80 p-5 rounded-2xl border border-blue-200">
            <ShieldCheck className="w-6 h-6 text-[#003366] shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-sm text-[#003366]">{t.buyer.details.govtVerified}</h4>
              <p className="text-[11px] text-[#00509E] mt-1 leading-relaxed font-medium">{t.buyer.details.govtVerifiedDesc}</p>
            </div>
          </div>
        </div>

        {/* NEW: Anti-Fake Reporting */}
        <button 
          onClick={() => setShowCounterfeitModal(true)}
          className="flex items-center justify-center gap-2 mt-2 text-xs font-bold text-gray-500 hover:text-red-600 transition-colors bg-gray-50 py-3 rounded-xl border border-gray-100 btn-press"
        >
          <AlertTriangle className="w-4 h-4" />
          Report Suspected Counterfeit
        </button>

        <div className="flex gap-3 mt-2">
          <button 
            onClick={async () => {
              await addToCart(product.id);
              setIsAdded(true);
              setTimeout(() => setIsAdded(false), 2500);
            }}
            className="flex-1 bg-gray-900 text-white font-bold text-base py-4 rounded-2xl shadow-[0_8px_20px_-8px_rgba(0,0,0,0.5)] btn-press flex items-center justify-center gap-2 transition-all"
          >
            {isAdded ? (
              <>
                <CheckCircle2 className="w-5 h-5 text-green-400" />
                <span>Added to Bag!</span>
              </>
            ) : (
              <span>{t.buyer.details.addToBag}</span>
            )}
          </button>
          <Link 
            to="/cart" 
            className="px-5 bg-heritage-primary text-white font-bold text-sm py-4 rounded-2xl shadow-md btn-press flex items-center justify-center gap-1.5"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Bag</span>
          </Link>
        </div>
      </div>

      {/* NEW: Counterfeit Modal */}
      {showCounterfeitModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl relative">
            {!reportSubmitted ? (
              <>
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-red-100 p-2.5 rounded-full text-red-600">
                    <AlertTriangle className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-lg text-gray-900 leading-tight">{t.buyer.fakeModal.title}</h3>
                </div>
                <p className="text-sm text-gray-600 mb-5 leading-relaxed">
                  Protect authentic artisans. If you saw a factory-made fake of this exact design elsewhere, flag it for Ministry review.
                </p>
                <div className="space-y-4">
                  <input type="text" placeholder={t.buyer.fakeModal.url} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-red-400" />
                  <textarea placeholder={t.buyer.fakeModal.details} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-red-400 h-24 resize-none"></textarea>
                  <div className="flex gap-3 mt-2">
                    <button onClick={() => setShowCounterfeitModal(false)} className="flex-1 py-3 font-bold text-gray-500 bg-gray-100 rounded-xl btn-press">{t.common.cancel}</button>
                    <button onClick={() => setReportSubmitted(true)} className="flex-1 py-3 font-bold text-white bg-red-600 rounded-xl btn-press shadow-md shadow-red-500/20">{t.buyer.fakeModal.submit}</button>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-6">
                <ShieldCheck className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h3 className="font-bold text-xl text-gray-900 mb-2">{t.buyer.fakeModal.success}</h3>
                <p className="text-sm text-gray-600 mb-6 leading-relaxed">
                  {t.buyer.fakeModal.successDesc}
                </p>
                <button onClick={() => { setShowCounterfeitModal(false); setReportSubmitted(false); }} className="w-full py-3 font-bold text-white bg-gray-900 rounded-xl btn-press">
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};





