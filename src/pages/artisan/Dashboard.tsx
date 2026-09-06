import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useAppContext } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import { IndianRupee, Package, TrendingUp, Lightbulb, Truck, CheckCircle2, ChevronRight } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { t } = useLanguage();
  const { artisans, currentArtisanId, products } = useAppContext();
  const { artisanProfile } = useAuth();
  
  const [orderStage, setOrderStage] = useState(0); // 0=New, 1=Confirmed, 2=Packed, 3=Shipped
  const [pickupRequested, setPickupRequested] = useState(false);

  const artisan = artisanProfile || artisans.find(a => a.id === currentArtisanId);
  const artisanId = artisanProfile?.id || currentArtisanId;
  const myProducts = products.filter(p => p.artisanId === artisanId);

  if (!artisan) return null;

  // Real-world pain point logic
  const getShippingAdvice = (craft: string) => {
    const c = craft.toLowerCase();
    if (c.includes('pottery')) return "Use minimum 2 layers of bubble wrap and a rigid double-wall corrugated box.";
    if (c.includes('weaving') || c.includes('cotton')) return "Use a moisture-proof poly bag inside a tear-resistant shipping flyer.";
    if (c.includes('wood') || c.includes('toy')) return "Wrap individual pieces in paper and fill empty space with paper crinkles to prevent shifting.";
    return "Ensure item is tightly secured in a sturdy box with no room to shift.";
  };

  const getTrends = (craft: string) => {
    const c = craft.toLowerCase();
    if (c.includes('pottery')) return ["Buyers prefer smaller, gift-sized pieces right now.", "High demand for 'microwave-safe' labels."];
    if (c.includes('weaving')) return ["Natural, undyed organic cotton is trending.", "Buyers want care instruction tags attached."];
    if (c.includes('wood')) return ["Educational wooden toys are seeing a 30% spike.", "Non-toxic paint certifications boost sales."];
    return ["Eco-friendly packaging mentions increase sales by 20%.", "Short video clips showing the making process get 3x more views."];
  };

  const getRawMaterial = (craft: string) => {
    const c = craft.toLowerCase();
    if (c.includes('pottery')) return { material: "Quartz Powder & Multani Mitti", details: "Govt Subsidized Rate, 15km away, Next dispatch in 3 days." };
    if (c.includes('weaving') || c.includes('cotton')) return { material: "Bulk Organic Cotton Yarn", details: "Co-op Rate, 40km away, Next dispatch in 5 days." };
    if (c.includes('wood') || c.includes('toy')) return { material: "Seasoned Soft Wood (Poniki/Teak)", details: "Forestry Dept Approved, 25km away, Dispatch next week." };
    if (c.includes('brass') || c.includes('metal')) return { material: "Scrap Brass / Brass Sheets", details: "Recycling Co-op Rate, 10km away, Available tomorrow." };
    return { material: "Crafting Essentials Bundle", details: "Bulk Rate, 20km away, Dispatch in 2 days." };
  };

  const trends = getTrends(artisan.craft);
  const shippingAdvice = getShippingAdvice(artisan.craft);

  return (
    <div className="flex flex-col gap-6">
      <Link to="/artisan/profile" className="flex items-center gap-4 bg-white p-5 rounded-2xl shadow-sm border border-gray-100 btn-press card-hover">
        <img src={artisan.photoUrl} alt={artisan.name} className="w-16 h-16 rounded-full object-cover border-2 border-heritage-secondary/20 shadow-sm" onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = "https://placehold.co/600x600/F0F4F8/003366?text=Image+Unavailable"; }} />
        <div className="flex-1">
          <h2 className="text-xl font-black text-gray-800 tracking-tight">{t.artisan.dash.greeting}, {artisan.name}</h2>
          <p className="text-sm text-gray-500 font-medium mt-0.5">{artisan.craft} • {artisan.region}</p>
        </div>
        <div className="bg-gray-50/80 p-2.5 rounded-full border border-gray-100">
           <ChevronRight className="w-5 h-5 text-gray-400" />
        </div>
      </Link>

      {/* NEW: Order Fulfillment Checklist */}
      <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-gray-800 text-lg">{t.artisan.dash.activeOrder} #8821</h3>
          <span className="text-[10px] font-bold uppercase tracking-wider text-heritage-primary bg-orange-50 px-2 py-1 rounded-md">{t.artisan.dash.actionNeeded}</span>
        </div>
        
        <div className="flex flex-col gap-3">
          <button 
            onClick={() => setOrderStage(1)}
            disabled={orderStage > 0}
            className={`flex items-center gap-3 p-3 rounded-xl border transition-all text-left ${orderStage >= 1 ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200 active:scale-[0.98]'}`}
          >
            <CheckCircle2 className={`w-6 h-6 shrink-0 ${orderStage >= 1 ? 'text-green-500' : 'text-gray-300'}`} />
            <div>
              <p className={`font-bold ${orderStage >= 1 ? 'text-green-800' : 'text-gray-700'}`}>1. {t.artisan.dash.confirm}</p>
              <p className="text-xs text-gray-500 mt-0.5">{t.artisan.dash.confirmDesc}</p>
            </div>
          </button>
          
          <button 
            onClick={() => setOrderStage(2)}
            disabled={orderStage < 1 || orderStage > 1}
            className={`flex items-center gap-3 p-3 rounded-xl border transition-all text-left ${orderStage >= 2 ? 'bg-green-50 border-green-200' : orderStage === 1 ? 'bg-blue-50 border-blue-200 active:scale-[0.98]' : 'bg-gray-50 border-gray-200 opacity-50'}`}
          >
            <CheckCircle2 className={`w-6 h-6 shrink-0 ${orderStage >= 2 ? 'text-green-500' : orderStage === 1 ? 'text-blue-400' : 'text-gray-300'}`} />
            <div>
              <p className={`font-bold ${orderStage >= 2 ? 'text-green-800' : orderStage === 1 ? 'text-blue-900' : 'text-gray-700'}`}>2. {t.artisan.dash.pack}</p>
              <p className="text-xs text-gray-500 mt-0.5">{t.artisan.dash.packDesc}</p>
            </div>
          </button>

          <button 
            onClick={() => setOrderStage(3)}
            disabled={orderStage < 2 || orderStage > 2}
            className={`flex items-center gap-3 p-3 rounded-xl border transition-all text-left ${orderStage >= 3 ? 'bg-green-50 border-green-200' : orderStage === 2 ? 'bg-blue-50 border-blue-200 active:scale-[0.98]' : 'bg-gray-50 border-gray-200 opacity-50'}`}
          >
            <CheckCircle2 className={`w-6 h-6 shrink-0 ${orderStage >= 3 ? 'text-green-500' : orderStage === 2 ? 'text-blue-400' : 'text-gray-300'}`} />
            <div>
              <p className={`font-bold ${orderStage >= 3 ? 'text-green-800' : orderStage === 2 ? 'text-blue-900' : 'text-gray-700'}`}>3. {t.artisan.dash.ship}</p>
              <p className="text-xs text-gray-500 mt-0.5">{t.artisan.dash.shipDesc}</p>
            </div>
          </button>
        </div>
        {orderStage === 3 && (
          <div className="mt-4 p-3 bg-green-100 rounded-xl text-sm font-bold text-green-800 text-center animate-pulse">
            Buyer Notified! Order Complete.
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="card-standard p-5 card-hover">
          <div className="flex justify-between items-start mb-3">
            <p className="text-sm font-bold text-gray-500 uppercase tracking-wide">{t.artisan.dash.sales}</p>
            <div className="bg-green-50 p-1.5 rounded-lg">
              <IndianRupee className="w-5 h-5 text-green-600" />
            </div>
          </div>
          <p className="text-2xl font-black text-gray-800 tracking-tight">₹12,450</p>
          <p className="text-xs text-green-600 font-bold mt-2 bg-green-50 w-max px-2 py-1 rounded-md">+15% this month</p>
        </div>
        <div className="card-standard p-5 card-hover relative">
          <Link to="/artisan/products" className="absolute inset-0 z-10 btn-press"></Link>
          <div className="flex justify-between items-start mb-3">
            <p className="text-sm font-bold text-gray-500 uppercase tracking-wide">{t.artisan.dash.liveItems}</p>
            <div className="bg-blue-50 p-1.5 rounded-lg">
              <Package className="w-5 h-5 text-blue-600" />
            </div>
          </div>
          <p className="text-2xl font-black text-gray-800 tracking-tight">{myProducts.filter(p => p.status === 'published').length}</p>
          <div className="flex items-center gap-1 text-xs text-heritage-primary font-bold mt-2">
            <span>{t.artisan.dash.viewCatalog}</span>
            <ChevronRight className="w-3 h-3" />
          </div>
        </div>
      </div>

      {/* NEW: Logistics Assistance */}
      <div className="card-standard p-5 bg-gradient-to-br from-white to-gray-50">
        <div className="flex items-center gap-3 mb-3">
          <div className="bg-orange-100 p-2 rounded-xl">
            <Truck className="w-5 h-5 text-orange-600" />
          </div>
          <h3 className="font-bold text-gray-800 text-lg">{t.artisan.dash.shippingHelp}</h3>
        </div>
        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">{t.artisan.dash.packingAdvice} {artisan.craft}</p>
        <p className="text-sm text-gray-700 leading-relaxed bg-orange-50/50 p-3 rounded-xl border border-orange-100/50">
          {shippingAdvice}
        </p>
        <button 
          onClick={() => setPickupRequested(true)}
          disabled={pickupRequested}
          className={`w-full mt-4 py-3 rounded-xl font-bold text-sm transition-all shadow-sm ${pickupRequested ? 'bg-green-100 text-green-800 border border-green-200' : 'bg-gray-900 text-white btn-press'}`}
        >
          {pickupRequested ? '✓ IndiaPost Pickup Requested' : t.artisan.dash.requestPickup}
        </button>
      </div>

      {/* NEW: Design & Trend Insights */}
      <div className="card-standard p-5 bg-gradient-to-br from-white to-gray-50">
        <div className="flex items-center gap-3 mb-3">
          <div className="bg-purple-100 p-2 rounded-xl">
            <Lightbulb className="w-5 h-5 text-purple-600" />
          </div>
          <h3 className="font-bold text-gray-800 text-lg">{t.artisan.dash.trending}</h3>
        </div>
        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">{t.artisan.dash.insightsFor} {artisan.craft}</p>
        <ul className="flex flex-col gap-2">
          {trends.map((trend, idx) => (
            <li key={idx} className="text-sm text-gray-700 flex items-start gap-2 bg-purple-50/50 p-3 rounded-xl border border-purple-100/50">
              <span className="text-purple-500 mt-0.5">•</span>
              <span className="leading-relaxed">{trend}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* NEW: Raw Material Exchange */}
      <div className="card-standard p-5 bg-gradient-to-br from-emerald-50 to-white border border-emerald-100">
        <div className="flex items-center gap-3 mb-3">
          <div className="bg-emerald-100 p-2 rounded-xl">
            <Package className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
             <h3 className="font-bold text-gray-800 text-lg leading-tight">{t.artisan.dash.rawMaterial}</h3>
             <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100/50 px-2 py-0.5 rounded-md">{t.artisan.dash.coop}</span>
          </div>
        </div>
        <p className="text-sm font-bold text-gray-800 mt-2">{getRawMaterial(artisan.craft).material}</p>
        <p className="text-xs text-gray-600 mt-1 mb-4 leading-relaxed font-medium">
          {getRawMaterial(artisan.craft).details}
        </p>
        <button 
          onClick={() => alert("Material request submitted to co-op network!")}
          className="w-full py-3 rounded-xl font-bold text-sm bg-emerald-600 text-white btn-press shadow-md shadow-emerald-500/20"
        >
          Join Group Buy
        </button>
      </div>

      <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-5 flex gap-4 items-start shadow-sm card-hover transition-all">
        <div className="bg-blue-100 p-2.5 rounded-xl mt-1 shrink-0">
          <TrendingUp className="w-6 h-6 text-blue-700" />
        </div>
        <div>
          <h3 className="font-bold text-blue-900 text-lg leading-tight">{t.artisan.dash.schemes}</h3>
          <p className="text-sm text-blue-800/80 mt-1.5 leading-relaxed font-medium">{t.artisan.dash.schemesDesc}</p>
          <Link to="/artisan/schemes" className="inline-block text-[11px] bg-blue-600 text-white px-5 py-2.5 rounded-xl mt-4 font-bold uppercase tracking-wider shadow-md shadow-blue-500/20 btn-press">
            Learn More
          </Link>
        </div>
      </div>
      
      {/* Footer Padding for Nav */}
      <div className="pb-4"></div>
    </div>
  );
};



