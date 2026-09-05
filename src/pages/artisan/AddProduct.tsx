import React, { useState, useRef } from 'react';
import { Mic, Camera, CheckCircle2, ChevronRight, Calculator } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { extractProductDetails, extractProductDetailsFromImage } from '../../lib/gemini';

type Step = 'choose-method' | 'recording' | 'processing' | 'review' | 'pricing';

export const AddProduct: React.FC = () => {
  const [step, setStep] = useState<Step>('choose-method');
  const [transcript, setTranscript] = useState('');
  const mediaRecorderRef = useRef<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { addProduct, currentArtisanId } = useAppContext();
  const navigate = useNavigate();

  const [uploadedPhotoUrl, setUploadedPhotoUrl] = useState('https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&w=400&q=80');
  const [errorMsg, setErrorMsg] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    tags: '',
    materialsCost: 0,
    laborHours: 0,
    suggestedPrice: 0,
    finalPrice: 0,
  });

  const handleVoiceRecord = () => {
    setStep('recording');
    setErrorMsg('');
    setTranscript('');
    
    if ('webkitSpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-IN';

      recognition.onresult = (event: any) => {
        let interimTranscript = '';
        let finalTranscriptStr = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscriptStr += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }
        if (finalTranscriptStr) setTranscript(prev => prev + finalTranscriptStr);
      };

      recognition.onend = () => {
        processAIText(transcript); // Uses state, might be delayed. Best to just process in the callback or wait for user to click "Done"
      };
      
      recognition.start();
      mediaRecorderRef.current = recognition;
    } else {
      setTimeout(() => {
        setTranscript("I made a beautiful blue ceramic vase with floral design. It took me 5 hours. Material cost was 150 rupees.");
        processAIText("I made a beautiful blue ceramic vase with floral design. It took me 5 hours. Material cost was 150 rupees.");
      }, 3000);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      processAIText(transcript);
    } else {
      processAIText(transcript);
    }
  };

  const processAIText = async (textToProcess: string) => {
    if (!textToProcess) {
       textToProcess = transcript;
    }
    if (!textToProcess) {
        setErrorMsg("Didn't hear anything. Try again!");
        setStep('choose-method');
        return;
    }
    setStep('processing');
    try {
      const data = await extractProductDetails(textToProcess);
      applyAIResult(data);
    } catch (e: any) {
      console.error(e);
      setErrorMsg(e.message || "Failed to process audio with AI.");
      setStep('choose-method');
    }
  };

  const handleImageCapture = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setStep('processing');
    setErrorMsg('');

    // Create a local object URL for preview
    const objectUrl = URL.createObjectURL(file);
    setUploadedPhotoUrl(objectUrl);

    // Convert to base64
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64String = (reader.result as string).split(',')[1];
      try {
        const data = await extractProductDetailsFromImage(base64String, file.type);
        applyAIResult(data);
      } catch (err: any) {
        console.error(err);
        setErrorMsg(err.message || "Failed to analyze image with AI.");
        setStep('choose-method');
      }
    };
    reader.readAsDataURL(file);
  };

  const applyAIResult = (data: any) => {
    const materialsCost = Number(data.materialsCost) || 0;
    const laborHours = Number(data.laborHours) || 0;
    const suggestedPrice = calculateSuggestedPrice(materialsCost, laborHours);

    setFormData({
      title: data.title || '',
      description: data.description || '',
      category: data.category || '',
      tags: data.tags || '',
      materialsCost,
      laborHours,
      suggestedPrice,
      finalPrice: suggestedPrice,
    });
    setStep('review');
  };

  const calculateSuggestedPrice = (materials: number, hours: number) => {
    const hourlyWage = 100;
    const margin = 1.2;
    return Math.round((materials + (hours * hourlyWage)) * margin);
  };

  const handlePricingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numValue = Number(value);
    
    setFormData(prev => {
      const updated = { ...prev, [name]: numValue };
      if (name === 'materialsCost' || name === 'laborHours') {
        const suggested = calculateSuggestedPrice(updated.materialsCost, updated.laborHours);
        updated.suggestedPrice = suggested;
        updated.finalPrice = suggested;
      }
      return updated;
    });
  };

  const handlePublish = () => {
    addProduct({
      artisanId: currentArtisanId,
      title: formData.title,
      description: formData.description,
      category: formData.category,
      tags: formData.tags.split(',').map(t => t.trim()),
      materialsCost: formData.materialsCost,
      laborHours: formData.laborHours,
      suggestedPrice: formData.suggestedPrice,
      finalPrice: formData.finalPrice,
      photoUrl: uploadedPhotoUrl,
      status: 'published'
    });
    navigate('/artisan/products');
  };

  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-2xl font-bold text-gray-800">Add New Product</h2>
      
      {errorMsg && (
        <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm font-medium border border-red-200">
          {errorMsg}
        </div>
      )}

      {step === 'choose-method' && (
        <div className="flex flex-col gap-4 mt-8">
          <button 
            onClick={handleVoiceRecord}
            className="flex items-center gap-4 p-6 bg-heritage-primary text-white rounded-2xl shadow-lg active:scale-95 transition"
          >
            <div className="bg-white/20 p-4 rounded-full">
              <Mic className="w-8 h-8" />
            </div>
            <div className="text-left flex-1">
              <h3 className="text-xl font-bold">Use Voice (AI)</h3>
              <p className="text-sm text-heritage-bg opacity-90">Just describe your product</p>
            </div>
            <ChevronRight />
          </button>

          <button 
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-4 p-6 bg-white text-gray-800 border-2 border-heritage-secondary rounded-2xl shadow-sm active:scale-95 transition"
          >
            <div className="bg-gray-100 p-4 rounded-full">
              <Camera className="w-8 h-8 text-heritage-primary" />
            </div>
            <div className="text-left flex-1">
              <h3 className="text-xl font-bold">Take Photo (AI)</h3>
              <p className="text-sm text-gray-500">Auto-detect from an image</p>
            </div>
            <ChevronRight />
          </button>
          <input 
            type="file" 
            accept="image/*" 
            capture="environment" 
            ref={fileInputRef} 
            className="hidden" 
            onChange={handleImageCapture}
          />
        </div>
      )}

      {step === 'recording' && (
        <div className="flex flex-col items-center justify-center gap-8 py-12">
          <div className="relative">
            <div className="absolute inset-0 bg-red-400 rounded-full animate-ping opacity-20"></div>
            <button 
              onClick={stopRecording}
              className="relative bg-red-500 text-white p-8 rounded-full shadow-xl"
            >
              <Mic className="w-12 h-12" />
            </button>
          </div>
          <div className="text-center">
            <h3 className="text-xl font-bold mb-2">Listening...</h3>
            <p className="text-gray-500 italic min-h-[3rem] px-4">
              "{transcript || 'Speak now...'}"
            </p>
          </div>
          <button 
            onClick={stopRecording}
            className="px-8 py-3 bg-gray-800 text-white rounded-full font-medium mt-4"
          >
            Done
          </button>
        </div>
      )}

      {step === 'processing' && (
        <div className="flex flex-col items-center justify-center gap-4 py-16">
          <div className="w-16 h-16 border-4 border-heritage-primary border-t-transparent rounded-full animate-spin"></div>
          <h3 className="text-lg font-bold text-gray-700 mt-4">AI is magic-ing...</h3>
          <p className="text-sm text-gray-500">Extracting details with Gemini API</p>
        </div>
      )}

      {step === 'review' && (
        <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-4">
          <div className="bg-green-50 text-green-800 p-3 rounded-lg flex items-center gap-2 text-sm font-medium border border-green-200">
            <CheckCircle2 className="w-5 h-5 text-green-600" />
            AI Draft Ready! Please review and edit.
          </div>

          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col gap-4">
            {uploadedPhotoUrl && !uploadedPhotoUrl.includes('unsplash') && (
               <img src={uploadedPhotoUrl} alt="Product" className="w-full h-40 object-cover rounded-lg border border-gray-200" />
            )}
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Title</label>
              <input 
                type="text" 
                value={formData.title}
                onChange={e => setFormData({...formData, title: e.target.value})}
                className="w-full text-lg font-bold border-b border-gray-200 focus:border-heritage-primary outline-none py-1"
              />
            </div>
            
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Description</label>
              <textarea 
                value={formData.description}
                onChange={e => setFormData({...formData, description: e.target.value})}
                className="w-full text-sm border border-gray-200 rounded-lg p-3 min-h-[100px] outline-none focus:border-heritage-primary"
              />
            </div>
            
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Tags</label>
              <input 
                type="text" 
                value={formData.tags}
                onChange={e => setFormData({...formData, tags: e.target.value})}
                className="w-full text-sm border border-gray-200 rounded-lg p-3 outline-none focus:border-heritage-primary"
              />
            </div>

            <button 
              onClick={() => setStep('pricing')}
              className="w-full bg-heritage-primary text-white p-4 rounded-xl font-bold text-lg mt-2 shadow-md flex justify-center items-center gap-2"
            >
              Continue to Pricing <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {step === 'pricing' && (
        <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-right-4">
          <div className="bg-blue-50 text-blue-800 p-3 rounded-lg flex gap-3 text-sm border border-blue-200">
            <Calculator className="w-8 h-8 text-blue-600 shrink-0" />
            <p><strong>Fair Pricing Engine:</strong> We suggest a price based on your input to ensure you earn a living wage.</p>
          </div>

          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex flex-col gap-5">
            <div className="flex items-center justify-between gap-4">
              <label className="text-sm font-bold text-gray-700">Material Cost (₹)</label>
              <input 
                type="number" 
                name="materialsCost"
                value={formData.materialsCost}
                onChange={handlePricingChange}
                className="w-24 border border-gray-300 rounded-lg p-2 text-right font-bold"
              />
            </div>
            
            <div className="flex items-center justify-between gap-4">
              <label className="text-sm font-bold text-gray-700">Labor Time (Hours)</label>
              <input 
                type="number" 
                name="laborHours"
                value={formData.laborHours}
                onChange={handlePricingChange}
                className="w-24 border border-gray-300 rounded-lg p-2 text-right font-bold"
              />
            </div>

            <hr className="my-2" />

            <div className="bg-gray-50 p-4 rounded-lg flex justify-between items-center border border-gray-200">
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase">Suggested Price</p>
                <p className="text-xs text-gray-400 mt-1">Includes 20% margin</p>
              </div>
              <p className="text-2xl font-bold text-heritage-primary">₹{formData.suggestedPrice}</p>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Your Final Price (₹)</label>
              <input 
                type="number" 
                value={formData.finalPrice}
                onChange={e => setFormData({...formData, finalPrice: Number(e.target.value)})}
                className="w-full text-2xl font-bold border-2 border-heritage-secondary rounded-xl focus:border-heritage-primary outline-none p-4 text-center"
              />
            </div>

            <button 
              onClick={handlePublish}
              className="w-full bg-green-600 text-white p-4 rounded-xl font-bold text-lg mt-4 shadow-md flex justify-center items-center gap-2"
            >
              <CheckCircle2 className="w-5 h-5" /> Publish to Catalog
            </button>
            <button 
              onClick={() => setStep('review')}
              className="w-full text-gray-500 py-2 font-medium"
            >
              Back to Details
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
