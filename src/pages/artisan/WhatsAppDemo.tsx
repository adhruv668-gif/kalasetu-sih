import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Phone, Video, MoreVertical, Mic, Camera, Paperclip } from 'lucide-react';

export const WhatsAppDemo: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] -mx-4 -my-4 bg-[#EFEAE2] font-sans">
      {/* WhatsApp Header */}
      <div className="bg-[#075E54] text-white flex items-center justify-between p-3 shadow-md z-10">
        <div className="flex items-center gap-2">
          <button onClick={() => navigate(-1)}>
            <ChevronLeft className="w-6 h-6" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center p-1">
              <span className="text-[#075E54] font-bold text-xl">K</span>
            </div>
            <div>
              <h2 className="font-bold text-lg leading-tight">Kaarvi Bot</h2>
              <p className="text-xs text-white/80">Official Govt. Account</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Video className="w-5 h-5" />
          <Phone className="w-5 h-5" />
          <MoreVertical className="w-5 h-5" />
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 bg-[url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')] bg-repeat opacity-90">
        <div className="flex justify-center">
          <span className="bg-[#E1F3FB] text-gray-600 text-xs py-1 px-3 rounded-lg shadow-sm">Today</span>
        </div>

        <div className="flex gap-2">
          <div className="bg-white p-3 rounded-tr-xl rounded-b-xl shadow-sm max-w-[85%] relative">
            <p className="text-[15px] text-gray-800">Namaste Ramesh ji! 🙏 Welcome to Kaarvi.</p>
            <p className="text-[15px] text-gray-800 mt-2">To list a new product, please send a photo of the item, or send a voice note describing it.</p>
            <span className="text-[10px] text-gray-400 absolute bottom-1 right-2">10:42 AM</span>
          </div>
        </div>

        <div className="flex gap-2 justify-end">
          <div className="bg-[#DCF8C6] p-2 rounded-tl-xl rounded-b-xl shadow-sm max-w-[85%] relative">
            <img src="https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&w=300&q=80" alt="Product" className="rounded-lg mb-4 w-48 object-cover" onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = "https://placehold.co/600x600/F0F4F8/003366?text=Image+Unavailable"; }} />
            <span className="text-[10px] text-gray-500 absolute bottom-1 right-2 flex items-center gap-1">
              10:45 AM <span className="text-blue-500">✓✓</span>
            </span>
          </div>
        </div>

        <div className="flex gap-2 justify-end">
          <div className="bg-[#DCF8C6] p-3 rounded-tl-xl rounded-b-xl shadow-sm max-w-[85%] relative min-w-[150px]">
             <div className="flex items-center gap-2 mb-3">
               <Mic className="w-5 h-5 text-gray-500" />
               <div className="flex-1 h-1 bg-gray-300 rounded-full overflow-hidden">
                 <div className="w-1/3 h-full bg-blue-500"></div>
               </div>
               <span className="text-xs text-gray-500">0:12</span>
             </div>
             <p className="text-xs text-gray-600 italic">"I made this blue ceramic vase, took 5 hours. Material cost 150 rs."</p>
            <span className="text-[10px] text-gray-500 absolute bottom-1 right-2 flex items-center gap-1">
              10:46 AM <span className="text-blue-500">✓✓</span>
            </span>
          </div>
        </div>

        <div className="flex gap-2">
          <div className="bg-white p-3 rounded-tr-xl rounded-b-xl shadow-sm max-w-[85%] relative">
            <p className="text-[15px] text-gray-800 font-bold mb-1">Draft Ready!</p>
            <p className="text-[15px] text-gray-800">Title: Blue Ceramic Floral Vase</p>
            <p className="text-[15px] text-gray-800">Category: Pottery</p>
            <p className="text-[15px] text-gray-800 font-bold text-green-700 mt-2">Suggested Price: ₹650</p>
            <p className="text-[15px] text-gray-800 mt-2">Reply with "1" to Publish, or "2" to change price.</p>
            <span className="text-[10px] text-gray-400 absolute bottom-1 right-2">10:47 AM</span>
          </div>
        </div>
        
        <div className="flex gap-2 justify-end">
          <div className="bg-[#DCF8C6] p-2 px-4 rounded-tl-xl rounded-b-xl shadow-sm relative pb-4">
            <p className="text-[15px] text-gray-800">1</p>
            <span className="text-[10px] text-gray-500 absolute bottom-1 right-2 flex items-center gap-1">
              10:48 AM <span className="text-gray-400">✓</span>
            </span>
          </div>
        </div>
      </div>

      {/* Input Area */}
      <div className="bg-[#F0F0F0] p-2 flex items-center gap-2 shadow-[0_-2px_5px_rgba(0,0,0,0.05)]">
        <div className="bg-white rounded-full flex-1 flex items-center px-3 py-2 gap-3 shadow-sm">
          <div className="text-gray-500">😀</div>
          <input type="text" placeholder="Message" className="flex-1 outline-none text-[15px] bg-transparent" disabled />
          <Paperclip className="w-5 h-5 text-gray-500 -rotate-45" />
          <Camera className="w-5 h-5 text-gray-500" />
        </div>
        <div className="bg-[#00897B] text-white w-10 h-10 rounded-full flex items-center justify-center shadow-sm shrink-0">
          <Mic className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
};


