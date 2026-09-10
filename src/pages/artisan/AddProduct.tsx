import React, { useState, useRef } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useNavigate } from 'react-router-dom';
import {
  Camera,
  Mic,
  Upload,
  CheckCircle2,
  Loader2,
  IndianRupee,
  Sparkles,
  Volume2,
  Globe,
  Sliders,
  AlertCircle,
  ArrowLeft,
  Eye,
} from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { extractProductDetails, extractProductDetailsFromImage } from '../../lib/gemini';
import { enhanceCraftPhoto, type EnhancementResult } from '../../lib/studioEnhancer';
import { calculateDynamicPrice, type PricingAnalysis } from '../../lib/pricingEngine';
import type { Product } from '../../types';

export const AddProduct: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { addProduct, currentArtisanId } = useAppContext();
  const { artisanProfile } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Flow & State
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStatus, setProcessingStatus] = useState('AI is analyzing...');
  const [showForm, setShowForm] = useState(false);
  const [transcript, setTranscript] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<'hi-IN' | 'en-IN' | 'te-IN' | 'ta-IN' | 'bn-IN'>('hi-IN');
  const [activeLangTab, setActiveLangTab] = useState<'en' | 'hi'>('en');

  // Studio Image Enhancer States
  const [enhancementData, setEnhancementData] = useState<EnhancementResult | null>(null);
  const [showOriginalPhoto, setShowOriginalPhoto] = useState(false);

  const artisanId = artisanProfile?.id || currentArtisanId || 'a1';

  // Form Data
  const [formData, setFormData] = useState<{
    title: string;
    titleHi: string;
    description: string;
    descriptionHi: string;
    category: string;
    tags: string[];
    materialsCost: number;
    laborHours: number;
    artisanAskingPrice: number;
    photoUrl: string;
    originalPhotoUrl: string;
    craftLineage: string;
  }>({
    title: '',
    titleHi: '',
    description: '',
    descriptionHi: '',
    category: 'pottery',
    tags: ['handcrafted', 'heritage', 'artisan'],
    materialsCost: 80,
    laborHours: 3,
    artisanAskingPrice: 350,
    photoUrl: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=800&q=80',
    originalPhotoUrl: '',
    craftLineage: 'Traditional Craft Cluster',
  });

  // Dynamic Pricing Analysis
  const pricing: PricingAnalysis = calculateDynamicPrice(
    formData.materialsCost,
    formData.laborHours,
    formData.category,
    formData.artisanAskingPrice
  );

  // 1. Voice Input Handler (Speech Recognition)
  const handleVoiceInput = () => {
    setErrorMsg(null);
    setTranscript('');

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setErrorMsg(
        'Speech recognition is not supported in this browser. Please type details or click a quick sample below.'
      );
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = selectedLanguage;
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      setIsRecording(true);

      recognition.onstart = () => {
        setIsRecording(true);
      };

      recognition.onresult = async (event: any) => {
        const spokenText = event.results[0][0].transcript;
        setTranscript(spokenText);
        setIsRecording(false);
        await processAITranscript(spokenText);
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsRecording(false);
        if (event.error === 'not-allowed') {
          setErrorMsg(
            'Microphone access denied. You can select a quick voice simulation below or enter details manually.'
          );
        } else {
          setErrorMsg(`Voice input error (${event.error}). Please try again or enter manually.`);
        }
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognition.start();
    } catch (e: any) {
      setIsRecording(false);
      setErrorMsg('Failed to initiate microphone. Please try manual entry.');
    }
  };

  // Process text via Gemini
  const processAITranscript = async (text: string) => {
    setIsProcessing(true);
    setProcessingStatus('Extracting specifications & bilingual descriptions with Gemini 3.7 Flash...');
    try {
      const extracted = await extractProductDetails(text);
      setFormData((prev) => ({
        ...prev,
        title: extracted.title || prev.title,
        titleHi: extracted.titleHi || prev.titleHi,
        description: extracted.description || prev.description,
        descriptionHi: extracted.descriptionHi || prev.descriptionHi,
        category: extracted.category || prev.category,
        tags: extracted.tags && extracted.tags.length > 0 ? extracted.tags : prev.tags,
        materialsCost: extracted.materialsCost || prev.materialsCost,
        laborHours: extracted.laborHours || prev.laborHours,
        artisanAskingPrice: extracted.price || prev.artisanAskingPrice,
        craftLineage: extracted.craftLineage || prev.craftLineage,
      }));
      setShowForm(true);
    } catch (err: any) {
      console.error('AI transcript processing failed:', err);
      setErrorMsg('AI processing error. You can review and complete the details manually below.');
      setShowForm(true);
    } finally {
      setIsProcessing(false);
    }
  };

  // 2. Photo Upload & Studio Enhancer Handler
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMsg(null);
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    setProcessingStatus('AI Studio is isolating background & correcting lighting...');

    try {
      // Step A: Client-Side Canvas Studio Background Removal & Lighting Enhancement
      const enhanced = await enhanceCraftPhoto(file);
      setEnhancementData(enhanced);

      setFormData((prev) => ({
        ...prev,
        photoUrl: enhanced.enhancedDataUrl,
        originalPhotoUrl: enhanced.originalDataUrl,
      }));

      // Step B: Gemini Vision Bilingual Catalog Extraction
      setProcessingStatus('Gemini Vision AI is analyzing craft details from photo...');
      const base64Clean = enhanced.enhancedDataUrl.split(',')[1];
      const extracted = await extractProductDetailsFromImage(base64Clean, 'image/jpeg');

      setFormData((prev) => ({
        ...prev,
        title: extracted.title || prev.title || 'Handcrafted Artisan Craft',
        titleHi: extracted.titleHi || prev.titleHi || 'पारंपरिक हस्तशिल्प',
        description: extracted.description || prev.description,
        descriptionHi: extracted.descriptionHi || prev.descriptionHi,
        category: extracted.category || prev.category,
        tags: extracted.tags && extracted.tags.length > 0 ? extracted.tags : prev.tags,
        materialsCost: extracted.materialsCost || prev.materialsCost,
        laborHours: extracted.laborHours || prev.laborHours,
        artisanAskingPrice: extracted.price || prev.artisanAskingPrice,
        craftLineage: extracted.craftLineage || prev.craftLineage,
      }));

      setShowForm(true);
    } catch (err: any) {
      console.error('Vision AI or Studio Enhancer failed:', err);
      setErrorMsg('Image loaded. Please verify or fill in the details below.');
      setShowForm(true);
    } finally {
      setIsProcessing(false);
    }
  };

  // Quick voice simulation presets (For instant testing without mic)
  const runVoiceSimulation = async (samplePhrase: string) => {
    setTranscript(samplePhrase);
    await processAITranscript(samplePhrase);
  };

  // 3. Final Publish Handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newProduct: Product = {
      id: `p_${Date.now()}`,
      artisanId: artisanId,
      title: formData.title || 'Untitled Heritage Craft',
      titleHi: formData.titleHi,
      description: formData.description || 'Authentic handcrafted piece by master artisan.',
      descriptionHi: formData.descriptionHi,
      category: formData.category,
      tags: formData.tags,
      materialsCost: Number(formData.materialsCost) || 0,
      laborHours: Number(formData.laborHours) || 1,
      suggestedPrice: pricing.suggestedArtisanPrice,
      finalPrice: pricing.finalConsumerPrice,
      photoUrl: formData.photoUrl,
      originalPhotoUrl: formData.originalPhotoUrl,
      isStudioEnhanced: !!enhancementData,
      craftLineage: formData.craftLineage,
      status: 'published',
      syncStatus: 'synced',
      createdAt: new Date().toISOString(),
    };

    addProduct(newProduct);
    navigate('/artisan/products');
  };

  // Loading Screen
  if (isProcessing) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] gap-5 px-4 text-center">
        <div className="relative">
          <div className="w-20 h-20 rounded-full border-4 border-[#003366]/20 border-t-[#003366] animate-spin flex items-center justify-center"></div>
          <Sparkles className="w-8 h-8 text-amber-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-800">{processingStatus}</h3>
          <p className="text-sm text-gray-500 mt-1">SIH26090 Multimodal Smart Cataloging Pipeline</p>
        </div>
        {transcript && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 max-w-sm text-sm text-blue-900 font-medium italic">
            "{transcript}"
          </div>
        )}
      </div>
    );
  }

  // Verification & Edit Form (Bilingual + Dynamic Pricing + Studio Photos)
  if (showForm) {
    return (
      <div className="flex flex-col gap-6 pb-12">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setShowForm(false)}
            className="flex items-center gap-1.5 text-sm text-gray-600 font-semibold hover:text-gray-900"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Scanner
          </button>
          <span className="bg-green-100 text-green-800 text-xs px-2.5 py-1 rounded-full font-bold flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> AI Verified
          </span>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* Studio Enhanced Image Section with Before/After Toggle */}
          <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm flex flex-col gap-3">
            <div className="relative rounded-xl overflow-hidden bg-slate-100 border border-slate-200 aspect-square max-h-72 flex items-center justify-center">
              <img
                src={showOriginalPhoto && formData.originalPhotoUrl ? formData.originalPhotoUrl : formData.photoUrl}
                alt="Product Preview"
                className="w-full h-full object-contain"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src =
                    'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=800&q=80';
                }}
              />
              <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-md text-white text-[11px] px-3 py-1 rounded-full font-medium flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                {showOriginalPhoto ? 'Raw Workshop Photo' : '✨ Studio Background Isolated'}
              </div>

              {formData.originalPhotoUrl && (
                <button
                  type="button"
                  onClick={() => setShowOriginalPhoto(!showOriginalPhoto)}
                  className="absolute bottom-3 right-3 bg-white/90 hover:bg-white text-slate-800 text-xs px-3 py-1.5 rounded-lg font-bold shadow-md flex items-center gap-1.5 transition"
                >
                  <Eye className="w-3.5 h-3.5" />
                  {showOriginalPhoto ? 'Show Studio Enhanced' : 'Compare Raw Photo'}
                </button>
              )}
            </div>

            <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
              <span>Lighting: Auto-Optimized (+22%)</span>
              <span>Aspect: 1:1 E-Commerce Standard</span>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-[#003366] font-bold hover:underline"
              >
                Change Photo
              </button>
            </div>
          </div>

          {/* Bilingual Title & Story Tabs */}
          <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                <Globe className="w-4 h-4 text-[#003366]" /> Multilingual Description (द्विभाषी)
              </span>
              <div className="flex bg-gray-100 p-1 rounded-lg">
                <button
                  type="button"
                  onClick={() => setActiveLangTab('en')}
                  className={`px-3 py-1 text-xs font-bold rounded-md transition ${
                    activeLangTab === 'en' ? 'bg-white text-[#003366] shadow-sm' : 'text-gray-500'
                  }`}
                >
                  English
                </button>
                <button
                  type="button"
                  onClick={() => setActiveLangTab('hi')}
                  className={`px-3 py-1 text-xs font-bold rounded-md transition ${
                    activeLangTab === 'hi' ? 'bg-white text-[#003366] shadow-sm' : 'text-gray-500'
                  }`}
                >
                  हिंदी (Hindi)
                </button>
              </div>
            </div>

            {activeLangTab === 'en' ? (
              <div className="flex flex-col gap-3">
                <div>
                  <label className="text-xs font-bold text-gray-600 uppercase mb-1 block">
                    Product Title (English)
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full p-3 border border-gray-200 rounded-xl font-medium focus:border-[#003366] outline-none"
                    placeholder="e.g. Handcrafted Terracotta Water Pot"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-600 uppercase mb-1 block">
                    SEO Craft Story (English)
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={4}
                    className="w-full p-3 border border-gray-200 rounded-xl text-sm font-normal focus:border-[#003366] outline-none"
                    placeholder="Describe craft heritage, materials, care instructions..."
                    required
                  />
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                <div>
                  <label className="text-xs font-bold text-gray-600 uppercase mb-1 block">
                    उत्पाद का नाम (हिंदी शीर्षक)
                  </label>
                  <input
                    type="text"
                    value={formData.titleHi || ''}
                    onChange={(e) => setFormData({ ...formData, titleHi: e.target.value })}
                    className="w-full p-3 border border-gray-200 rounded-xl font-medium focus:border-[#003366] outline-none"
                    placeholder="उदा. पारंपरिक लाल मिट्टी का घड़ा"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-600 uppercase mb-1 block">
                    कारीगरी की कहानी (हिंदी विवरण)
                  </label>
                  <textarea
                    value={formData.descriptionHi || ''}
                    onChange={(e) => setFormData({ ...formData, descriptionHi: e.target.value })}
                    rows={4}
                    className="w-full p-3 border border-gray-200 rounded-xl text-sm font-normal focus:border-[#003366] outline-none"
                    placeholder="शिल्प की विशेषताएं, पारंपरिक तकनीक..."
                  />
                </div>
              </div>
            )}
          </div>

          {/* Craft Category & Lineage */}
          <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm flex flex-col gap-3">
            <label className="text-xs font-bold text-gray-600 uppercase tracking-wider">
              Craft Category & Heritage Lineage
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'pottery', label: '🏺 Pottery' },
                { id: 'woodwork', label: '🪵 Woodwork' },
                { id: 'weaving', label: '🧵 Handloom' },
                { id: 'metalcraft', label: '🪘 Metalcraft' },
                { id: 'painting', label: '🎨 Folk Art' },
                { id: 'other', label: '✨ Other' },
              ].map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setFormData({ ...formData, category: c.id })}
                  className={`py-2 px-3 text-xs font-bold rounded-xl border transition ${
                    formData.category === c.id
                      ? 'border-[#003366] bg-[#003366]/5 text-[#003366]'
                      : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>

            <div className="mt-2">
              <label className="text-xs font-medium text-gray-500 block mb-1">Craft Cluster Lineage / GI Tag</label>
              <input
                type="text"
                value={formData.craftLineage}
                onChange={(e) => setFormData({ ...formData, craftLineage: e.target.value })}
                className="w-full p-2.5 text-sm border border-gray-200 rounded-xl"
                placeholder="e.g. Kondapalli Toys, Bastar Dhokra, Blue Pottery"
              />
            </div>
          </div>

          {/* Dynamic Pricing Engine Assistant */}
          <div className="bg-gradient-to-br from-purple-50 via-white to-blue-50 rounded-2xl p-5 border border-purple-200 shadow-sm flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sliders className="w-5 h-5 text-purple-700" />
                <h4 className="font-bold text-gray-900 text-sm">Dynamic Pricing Assistant</h4>
              </div>
              <span className="bg-purple-100 text-purple-800 text-[11px] font-bold px-2 py-0.5 rounded-full">
                Fair Share Algorithm
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-bold text-gray-600 uppercase block mb-1">Raw Materials (₹)</label>
                <div className="relative">
                  <IndianRupee className="w-4 h-4 text-gray-400 absolute left-2.5 top-3" />
                  <input
                    type="number"
                    min="0"
                    value={formData.materialsCost}
                    onChange={(e) => setFormData({ ...formData, materialsCost: Number(e.target.value) })}
                    className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-xl font-bold text-sm bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-gray-600 uppercase block mb-1">Crafting Hours</label>
                <input
                  type="number"
                  min="0.5"
                  step="0.5"
                  value={formData.laborHours}
                  onChange={(e) => setFormData({ ...formData, laborHours: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl font-bold text-sm bg-white"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold text-gray-600 uppercase block mb-1">
                Your Desired Asking Price (₹)
              </label>
              <div className="relative">
                <IndianRupee className="w-4 h-4 text-gray-400 absolute left-2.5 top-3" />
                <input
                  type="number"
                  min="50"
                  value={formData.artisanAskingPrice}
                  onChange={(e) => setFormData({ ...formData, artisanAskingPrice: Number(e.target.value) })}
                  className="w-full pl-8 pr-3 py-2 border border-purple-300 rounded-xl font-black text-lg text-purple-900 bg-white"
                />
              </div>
            </div>

            {/* Fair-Share Breakdown Meter */}
            <div className="bg-white/80 backdrop-blur rounded-xl p-3 border border-purple-100 flex flex-col gap-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-600 font-medium">Artisan Direct Payout (95%):</span>
                <span className="font-bold text-green-700">₹{pricing.suggestedArtisanPrice}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-600 font-medium">Platform Fee (5% ops):</span>
                <span className="font-semibold text-gray-500">₹{pricing.platformFee}</span>
              </div>
              <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden flex">
                <div style={{ width: '95%' }} className="bg-purple-600 h-full"></div>
                <div style={{ width: '5%' }} className="bg-amber-400 h-full"></div>
              </div>
              <div className="flex justify-between items-center pt-1 border-t border-gray-100">
                <span className="text-xs font-bold text-gray-800">Final Buyer Price:</span>
                <span className="text-base font-black text-[#003366]">₹{pricing.finalConsumerPrice}</span>
              </div>
              <p className="text-[10px] text-gray-500 italic mt-1">{pricing.rationale}</p>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-[#003366] hover:bg-[#002244] text-white font-bold text-lg py-4 rounded-xl shadow-lg shadow-blue-900/20 active:scale-[0.98] transition flex items-center justify-center gap-2"
          >
            <CheckCircle2 className="w-5 h-5" /> Publish to National Catalog
          </button>
        </form>
      </div>
    );
  }

  // Initial Selector Screen (Voice AI, Camera AI, or First-Class Manual Entry)
  return (
    <div className="flex flex-col gap-6 pb-8">
      <div>
        <h2 className="text-2xl font-black text-gray-900">Add New Heritage Item</h2>
        <p className="text-sm text-gray-500 mt-0.5">
          Speak in your regional language or scan with AI camera.
        </p>
      </div>

      {errorMsg && (
        <div className="bg-amber-50 text-amber-900 p-4 rounded-xl text-sm flex items-start gap-3 border border-amber-200 shadow-sm">
          <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-bold">Notice</p>
            <p className="mt-0.5 text-xs text-amber-800">{errorMsg}</p>
          </div>
        </div>
      )}

      {/* Voice Dialect Selector */}
      <div className="flex items-center justify-between bg-white px-4 py-2.5 rounded-xl border border-gray-200">
        <span className="text-xs font-bold text-gray-600 flex items-center gap-1.5">
          <Volume2 className="w-4 h-4 text-[#003366]" /> Voice Dialect:
        </span>
        <select
          value={selectedLanguage}
          onChange={(e: any) => setSelectedLanguage(e.target.value)}
          className="text-xs font-bold text-[#003366] bg-transparent outline-none cursor-pointer"
        >
          <option value="hi-IN">हिन्दी (Hindi)</option>
          <option value="en-IN">English (India)</option>
          <option value="te-IN">తెలుగు (Telugu)</option>
          <option value="ta-IN">தமிழ் (Tamil)</option>
          <option value="bn-IN">বাংলা (Bengali)</option>
        </select>
      </div>

      {/* Primary Voice (AI) Button */}
      <button
        type="button"
        onClick={handleVoiceInput}
        className={`flex flex-col items-center justify-center gap-4 bg-white p-7 rounded-2xl shadow-sm border-2 transition active:scale-[0.98] ${
          isRecording
            ? 'border-red-500 bg-red-50/50 shadow-red-500/20'
            : 'border-gray-200 hover:border-[#003366]'
        }`}
      >
        <div
          className={`p-6 rounded-full transition ${
            isRecording ? 'bg-red-500 text-white animate-pulse' : 'bg-blue-50 text-[#003366]'
          }`}
        >
          <Mic className="w-12 h-12" />
        </div>
        <div className="text-center">
          <h3 className="text-lg font-black text-gray-800">
            {isRecording ? 'Listening... Speak Now' : 'Use Voice (AI)'}
          </h3>
          <p className="text-xs text-gray-500 mt-1">
            Tap and speak in your language: "Maine lal mitti ka ghada banaya hai, ₹350"
          </p>
        </div>
      </button>

      {/* Or quick one-tap test phrases */}
      <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
        <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
          ⚡ Quick Voice Simulation (1-Tap Test):
        </p>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() =>
              runVoiceSimulation('Maine lal mitti ka ghada banaya hai, kimat teen sau pachas rupaye hai.')
            }
            className="text-xs bg-white border border-slate-300 hover:border-[#003366] text-slate-800 font-medium px-3 py-1.5 rounded-lg transition"
          >
            "लाल मिट्टी का घड़ा ₹350"
          </button>
          <button
            type="button"
            onClick={() =>
              runVoiceSimulation('Pure silk handloom saree with traditional border, price is four thousand rupees.')
            }
            className="text-xs bg-white border border-slate-300 hover:border-[#003366] text-slate-800 font-medium px-3 py-1.5 rounded-lg transition"
          >
            "Pure Silk Saree ₹4000"
          </button>
          <button
            type="button"
            onClick={() =>
              runVoiceSimulation('Handcarved wooden toy horse, natural vegetable lacquer, price two hundred fifty.')
            }
            className="text-xs bg-white border border-slate-300 hover:border-[#003366] text-slate-800 font-medium px-3 py-1.5 rounded-lg transition"
          >
            "Wooden Toy ₹250"
          </button>
        </div>
      </div>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200"></div>
        </div>
        <div className="relative flex justify-center">
          <span className="bg-heritage-bg px-4 text-xs text-gray-400 font-bold uppercase">OR</span>
        </div>
      </div>

      {/* Photo Scan (AI) & Studio Enhancer Button */}
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        className="flex flex-col items-center justify-center gap-4 bg-white p-7 rounded-2xl shadow-sm border-2 border-gray-200 hover:border-amber-500 transition active:scale-[0.98]"
      >
        <div className="p-6 rounded-full bg-amber-50 text-amber-600">
          <Camera className="w-12 h-12" />
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center gap-1.5">
            <h3 className="text-lg font-black text-gray-800">Take Photo (AI Studio)</h3>
            <span className="bg-amber-100 text-amber-800 text-[10px] font-black px-2 py-0.5 rounded-full">
              AUTO-STUDIO
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Isolates background, corrects workshop lighting, formats to e-commerce standard
          </p>
        </div>
      </button>

      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={handleImageUpload}
      />

      {/* First-Class Manual Entry Option */}
      <div className="text-center pt-2">
        <button
          type="button"
          onClick={() => setShowForm(true)}
          className="inline-flex items-center gap-2 text-sm font-bold text-[#003366] hover:underline p-3 bg-white rounded-xl border border-gray-200 shadow-sm w-full justify-center"
        >
          <Upload className="w-4 h-4 text-[#003366]" /> Or Enter Product Details Manually
        </button>
      </div>
    </div>
  );
};
