import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useNavigate } from 'react-router-dom';
import { Camera, Mic, Upload, CheckCircle2, Loader2, IndianRupee } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { extractProductDetails, extractProductDetailsFromImage } from '../../lib/gemini';
import type { Product } from '../../types';

export const AddProduct: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { addProduct, currentArtisanId } = useAppContext();
  const { artisanProfile } = useAuth();
  
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showForm, setShowForm] = useState(false);
  
  const artisanId = artisanProfile?.id || currentArtisanId;

  const [formData, setFormData] = useState<Partial<Product>>({
    title: '',
    description: '',
    category: '',
    finalPrice: 0,
    suggestedPrice: 0,
    photoUrl: 'https://placehold.co/600x400/eeeeee/999999?text=Product+Photo',
  });

  const handleVoiceInput = () => {
    // Check if browser supports speech recognition
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Voice input is not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    // NEW: Set language based on selected language
    recognition.lang = localStorage.getItem('language') === 'hi' ? 'hi-IN' : 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    setIsRecording(true);

    recognition.start();

    recognition.onresult = async (event: any) => {
      const transcript = event.results[0][0].transcript;
      setIsRecording(false);
      setIsProcessing(true);
      
      try {
        const extracted = await extractProductDetails(transcript);
        setFormData(prev => ({
           ...prev,
           ...extracted,
           suggestedPrice: extracted.price,
           finalPrice: extracted.price ? Math.round(extracted.price * 1.05) : 0
        }));
        setShowForm(true);
      } catch (error) {
        console.error("AI Extraction failed", error);
      } finally {
        setIsProcessing(false);
      }
    };

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error", event.error);
      setIsRecording(false);
      // Fallback to mock if mic fails (e.g., permissions)
      fallbackMockVoice();
    };

    recognition.onend = () => {
      setIsRecording(false);
    };
  };

  const fallbackMockVoice = () => {
    setIsProcessing(true);
    setTimeout(async () => {
      try {
        const mockTranscript = "Yeh ek blue color ka handloom silk saree hai, bohot soft material. Iska price ₹3500 hai.";
        const extracted = await extractProductDetails(mockTranscript);
        setFormData(prev => ({
           ...prev,
           ...extracted,
           suggestedPrice: extracted.price,
           finalPrice: extracted.price ? Math.round(extracted.price * 1.05) : 0
        }));
        setShowForm(true);
      } finally {
        setIsProcessing(false);
      }
    }, 1500);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64Data = reader.result as string;
        
        try {
          const mimeType = file.type || "image/jpeg";
          const extracted = await extractProductDetailsFromImage(base64Data, mimeType);
          setFormData(prev => ({
             ...prev,
             ...extracted,
             suggestedPrice: extracted.price || 0,
             finalPrice: extracted.price ? Math.round(extracted.price * 1.05) : 0,
             photoUrl: base64Data // Use local preview
          }));
          setShowForm(true);
        } catch (error) {
          console.error("Vision AI failed", error);
        } finally {
           setIsProcessing(false);
        }
      };
      reader.readAsDataURL(file);
    } catch (error) {
       console.error("File processing failed", error);
       setIsProcessing(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newProduct: Product = {
      id: `p_${Date.now()}`,
      artisanId: artisanId,
      title: formData.title || 'Untitled',
      description: formData.description || '',
      category: formData.category || 'other',
      tags: formData.tags || [],
      materialsCost: formData.materialsCost || 0,
      laborHours: formData.laborHours || 0,
      suggestedPrice: formData.suggestedPrice || 0,
      finalPrice: formData.finalPrice || formData.suggestedPrice || 0,
      photoUrl: formData.photoUrl || '',
      status: 'published',
      syncStatus: 'pending' // Starts pending for offline-first
    };

    addProduct(newProduct);
    navigate('/artisan/products');
  };

  if (isProcessing) {
     return (
        <div className="flex flex-col items-center justify-center h-[70vh] gap-4">
           <Loader2 className="w-12 h-12 text-heritage-primary animate-spin" />
           <h3 className="text-xl font-bold text-gray-800 text-center">AI is analyzing...</h3>
           <p className="text-gray-500 text-center text-sm px-8">Extracting product details, category, and suggested price automatically.</p>
        </div>
     );
  }

  if (showForm) {
    return (
      <div className="flex flex-col gap-4">
        <h2 className="text-2xl font-bold text-gray-800">Verify Details</h2>
        <div className="bg-green-50 text-green-700 p-3 rounded-lg text-sm flex gap-2 items-start border border-green-200">
           <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
           <p>AI successfully extracted details. Please verify before publishing.</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <img src={formData.photoUrl} alt="Preview" className="w-full h-48 object-cover rounded-xl border border-gray-200" onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = "https://placehold.co/600x600/F0F4F8/003366?text=Image+Unavailable"; }} />
          
          <div className="flex flex-col gap-1">
             <label className="text-xs font-bold text-gray-500 uppercase">Product Name</label>
             <input 
               type="text" 
               value={formData.title} 
               onChange={e => setFormData({...formData, title: e.target.value})}
               className="p-3 border border-gray-300 rounded-xl font-medium"
               required
             />
          </div>

          <div className="flex flex-col gap-1">
             <label className="text-xs font-bold text-gray-500 uppercase">Category</label>
             <select 
               value={formData.category}
               onChange={e => setFormData({...formData, category: e.target.value})}
               className="p-3 border border-gray-300 rounded-xl font-medium bg-white"
             >
                <option value="pottery">Pottery & Ceramics</option>
                <option value="woodwork">Woodwork & Carving</option>
                <option value="weaving">Textiles & Weaving</option>
                <option value="metalcraft">Metalcraft</option>
                <option value="other">Other</option>
             </select>
          </div>

          <div className="flex flex-col gap-1">
             <label className="text-xs font-bold text-gray-500 uppercase">Your Price (₹)</label>
             <div className="relative">
               <IndianRupee className="w-5 h-5 absolute left-3 top-3.5 text-gray-400" />
               <input 
                 type="number" 
                 value={formData.suggestedPrice} 
                 onChange={e => {
                    const price = Number(e.target.value);
                    setFormData({...formData, suggestedPrice: price, finalPrice: Math.round(price * 1.05)})
                 }}
                 className="p-3 pl-10 border border-gray-300 rounded-xl font-bold w-full"
                 required
               />
             </div>
             <p className="text-[10px] text-gray-500">Platform adds 5% operational fee. Buyer pays ₹{formData.finalPrice}</p>
          </div>

          <div className="flex flex-col gap-1">
             <label className="text-xs font-bold text-gray-500 uppercase">Story / Description</label>
             <textarea 
               value={formData.description} 
               onChange={e => setFormData({...formData, description: e.target.value})}
               className="p-3 border border-gray-300 rounded-xl font-medium min-h-[100px]"
               required
             />
          </div>

          <button type="submit" className="bg-heritage-primary text-white font-bold text-lg py-4 rounded-xl mt-4 active:scale-95 transition shadow-lg shadow-blue-900/20">
             Publish to Catalog
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-2xl font-bold text-gray-800">Add New Item</h2>
      <p className="text-gray-500">How would you like to add this product?</p>

      <button 
        onClick={handleVoiceInput}
        className={`flex flex-col items-center justify-center gap-4 bg-white p-8 rounded-2xl shadow-sm border ${isRecording ? 'border-red-400 bg-red-50' : 'border-gray-200'}`}
      >
        <div className={`p-6 rounded-full ${isRecording ? 'bg-red-100 animate-pulse' : 'bg-blue-50'}`}>
          <Mic className={`w-12 h-12 ${isRecording ? 'text-red-500' : 'text-blue-600'}`} />
        </div>
        <div className="text-center">
           <h3 className="text-lg font-bold text-gray-800">{isRecording ? 'Listening...' : 'Speak to AI'}</h3>
           <p className="text-sm text-gray-500 mt-1">"I made a red clay pot for ₹200"</p>
        </div>
      </button>

      <div className="relative">
         <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200"></div></div>
         <div className="relative flex justify-center"><span className="bg-heritage-bg px-4 text-sm text-gray-400 font-bold uppercase">OR</span></div>
      </div>

      <label className="flex flex-col items-center justify-center gap-4 bg-white p-8 rounded-2xl shadow-sm border border-gray-200 cursor-pointer hover:bg-gray-50 transition">
        <div className="p-6 rounded-full bg-orange-50">
          <Camera className="w-12 h-12 text-heritage-secondary" />
        </div>
        <div className="text-center">
           <h3 className="text-lg font-bold text-gray-800">Scan Product</h3>
           <p className="text-sm text-gray-500 mt-1">Take a photo, AI will write the details</p>
        </div>
        <input type="file" accept="image/*" capture="environment" className="hidden" onChange={handleImageUpload} />
      </label>
      
      <button onClick={() => setShowForm(true)} className="flex items-center justify-center gap-2 text-heritage-primary font-bold py-3 mt-4">
         <Upload className="w-4 h-4" /> Enter Manually Instead
      </button>
    </div>
  );
};



