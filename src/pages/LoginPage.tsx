import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Fingerprint, Search, Phone, ShieldCheck, ArrowRight, Loader2 } from 'lucide-react';
import { createArtisan } from '../lib/firestore';
import type { Artisan } from '../types';

type LoginStep = 'phone' | 'otp' | 'role-select' | 'artisan-register';

export const LoginPage: React.FC = () => {
  const { t } = useLanguage();
  const {
    phoneNumber, setPhoneNumber, handleSendOTP, handleVerifyOTP,
    authError, devOtpCode, user, userRole, setUserRole, setArtisanProfile
  } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState<LoginStep>('phone');
  const [otpCode, setOtpCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Artisan registration form
  const [artisanForm, setArtisanForm] = useState({
    name: '', craft: '', region: '', bio: '',
  });

  const onSendOTP = async () => {
    if (phoneNumber.length !== 10) return;
    setIsLoading(true);
    try {
      await handleSendOTP();
      setStep('otp');
    } finally {
      setIsLoading(false);
    }
  };

  const onVerifyOTP = async () => {
    if (otpCode.length !== 6) return;
    setIsLoading(true);
    try {
      await handleVerifyOTP(otpCode);
      // After verification, check if user needs role selection
      setStep('role-select');
    } finally {
      setIsLoading(false);
    }
  };

  const onSelectRole = (role: 'buyer' | 'artisan') => {
    if (role === 'buyer') {
      setUserRole('buyer');
      navigate('/');
    } else {
      setStep('artisan-register');
    }
  };

  const onRegisterArtisan = async () => {
    if (!artisanForm.name || !artisanForm.craft || !artisanForm.region || !user) return;
    setIsLoading(true);
    try {
      const artisanId = await createArtisan({
        name: artisanForm.name,
        craft: artisanForm.craft,
        region: artisanForm.region,
        bio: artisanForm.bio || `Traditional ${artisanForm.craft} artisan from ${artisanForm.region}.`,
        photoUrl: `https://placehold.co/400x400/e2e8f0/475569?text=${encodeURIComponent(artisanForm.name)}`,
        uid: user.uid,
        phone: user.phoneNumber || '',
      });
      const profile: Artisan = {
        id: artisanId,
        ...artisanForm,
        bio: artisanForm.bio || `Traditional ${artisanForm.craft} artisan from ${artisanForm.region}.`,
        photoUrl: `https://placehold.co/400x400/e2e8f0/475569?text=${encodeURIComponent(artisanForm.name)}`,
      };
      setArtisanProfile(profile);
      setUserRole('artisan');
      navigate('/artisan');
    } finally {
      setIsLoading(false);
    }
  };

  // If already logged in with a role, redirect
  React.useEffect(() => {
    if (user && userRole === 'buyer') navigate('/');
    else if (user && userRole === 'artisan') navigate('/artisan');
  }, [user, userRole, navigate]);

  return (
    <div className="min-h-screen bg-heritage-bg flex flex-col max-w-md mx-auto shadow-xl border-x border-gray-200">
      {/* Tricolor Strip */}
      <div className="h-1.5 w-full flex">
        <div className="flex-1 bg-[#FF9933]"></div>
        <div className="flex-1 bg-white"></div>
        <div className="flex-1 bg-[#138808]"></div>
      </div>

      {/* Header */}
      <header className="bg-heritage-primary p-6 text-center">
        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg mx-auto mb-3">
          <span className="text-heritage-primary font-black text-3xl">K</span>
        </div>
        <h1 className="font-bold text-2xl text-white tracking-tight">Kaarvi</h1>
        <p className="text-[10px] text-white/80 uppercase tracking-[0.25em] font-medium mt-1">Ministry of Social Justice & Empowerment</p>
        <p className="text-[10px] text-white/60 uppercase tracking-widest">Government of India</p>
      </header>

      <main className="flex-1 p-6 flex flex-col">
        {/* ─── Step: Phone Number ─── */}
        {step === 'phone' && (
          <div className="flex-1 flex flex-col">
            <h2 className="text-xl font-bold text-gray-800 mb-1">Welcome to Kaarvi</h2>
            <p className="text-sm text-gray-500 mb-6">Sign in with your mobile number to access the portal.</p>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 flex flex-col gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-2">Mobile Number</label>
                <div className="flex gap-2">
                  <span className="bg-gray-100 border border-gray-200 rounded-lg p-3 text-gray-600 font-medium">+91</span>
                  <input
                    type="tel"
                    placeholder="Enter 10 digit number"
                    value={phoneNumber}
                    onChange={e => setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    className="flex-1 border border-gray-200 rounded-lg p-3 outline-none focus:border-[#003366] text-lg tracking-wider"
                  />
                </div>
              </div>

              {authError && (
                <p className="text-sm text-red-600 bg-red-50 p-2 rounded-lg border border-red-200">{authError}</p>
              )}

              <button
                onClick={onSendOTP}
                disabled={phoneNumber.length !== 10 || isLoading}
                className="w-full bg-[#003366] text-white font-bold py-3.5 rounded-lg mt-2 shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Phone className="w-5 h-5" />}
                Generate OTP
              </button>

              <div className="flex items-center gap-4 my-3">
                <hr className="flex-1 border-gray-200" />
                <span className="text-xs text-gray-400 font-medium uppercase">OR LOGIN WITH</span>
                <hr className="flex-1 border-gray-200" />
              </div>

              <button disabled className="w-full bg-gray-50 text-gray-400 border border-gray-200 font-bold py-3 rounded-lg flex items-center justify-center gap-2 cursor-not-allowed relative">
                <Search className="w-5 h-5" /> MeriPehchaan (SSO)
                <span className="absolute right-3 text-[10px] bg-gray-200 px-2 py-0.5 rounded-full uppercase font-bold tracking-wider">Coming Soon</span>
              </button>
              <button disabled className="w-full bg-gray-50 text-gray-400 border border-gray-200 font-bold py-3 rounded-lg flex items-center justify-center gap-2 cursor-not-allowed relative">
                <Fingerprint className="w-5 h-5" /> Aadhaar OTP
                <span className="absolute right-3 text-[10px] bg-gray-200 px-2 py-0.5 rounded-full uppercase font-bold tracking-wider">Coming Soon</span>
              </button>
            </div>
          </div>
        )}

        {/* ─── Step: OTP Verification ─── */}
        {step === 'otp' && (
          <div className="flex-1 flex flex-col">
            <h2 className="text-xl font-bold text-gray-800 mb-1">Verify OTP</h2>
            <p className="text-sm text-gray-500 mb-6">Enter the 6-digit code sent to +91 {phoneNumber}</p>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 flex flex-col gap-4">
              {devOtpCode && (
                <div className="bg-blue-50 border border-blue-200 text-blue-900 p-3 rounded-xl text-xs flex justify-between items-center">
                  <span>🔑 Test OTP Code: <b>{devOtpCode}</b></span>
                  <button
                    type="button"
                    onClick={() => setOtpCode(devOtpCode)}
                    className="bg-[#003366] text-white px-3 py-1 rounded-lg text-xs font-bold hover:bg-[#002244] transition"
                  >
                    Auto-Fill
                  </button>
                </div>
              )}

              <input
                type="text"
                inputMode="numeric"
                placeholder="Enter 6-digit OTP"
                value={otpCode}
                onChange={e => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                className="w-full border-2 border-gray-200 rounded-xl p-4 text-center text-2xl tracking-[0.5em] font-bold outline-none focus:border-[#003366]"
              />

              {authError && (
                <p className="text-sm text-red-600 bg-red-50 p-2 rounded-lg border border-red-200">{authError}</p>
              )}

              <button
                onClick={onVerifyOTP}
                disabled={otpCode.length !== 6 || isLoading}
                className="w-full bg-[#003366] text-white font-bold py-3.5 rounded-lg shadow-md disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <ShieldCheck className="w-5 h-5" />}
                Verify & Continue
              </button>

              <button onClick={() => { setStep('phone'); setOtpCode(''); }} className="text-sm text-gray-500 underline mt-2 text-center">
                Change number
              </button>
            </div>
          </div>
        )}

        {/* ─── Step: Role Selection ─── */}
        {step === 'role-select' && (
          <div className="flex-1 flex flex-col">
            <div className="bg-green-50 text-green-800 p-3 rounded-lg flex items-center gap-2 text-sm font-medium border border-green-200 mb-6">
              <ShieldCheck className="w-5 h-5 text-green-600" />
              Phone verified successfully!
            </div>

            <h2 className="text-xl font-bold text-gray-800 mb-1">How will you use Kaarvi?</h2>
            <p className="text-sm text-gray-500 mb-6">You can switch modes later from within the app.</p>

            <div className="flex flex-col gap-4">
              <button
                onClick={() => onSelectRole('buyer')}
                className="flex items-center gap-4 p-5 bg-white border-2 border-gray-200 rounded-2xl shadow-sm hover:border-[#003366] transition active:scale-[0.98]"
              >
                <div className="bg-blue-50 p-3 rounded-full">
                  <Search className="w-7 h-7 text-[#003366]" />
                </div>
                <div className="flex-1 text-left">
                  <h3 className="text-lg font-bold text-gray-800">I am a Citizen / Buyer</h3>
                  <p className="text-sm text-gray-500">Browse and purchase authentic heritage crafts</p>
                </div>
                <ArrowRight className="w-5 h-5 text-gray-400" />
              </button>

              <button
                onClick={() => onSelectRole('artisan')}
                className="flex items-center gap-4 p-5 bg-white border-2 border-gray-200 rounded-2xl shadow-sm hover:border-heritage-accent transition active:scale-[0.98]"
              >
                <div className="bg-orange-50 p-3 rounded-full">
                  <ShieldCheck className="w-7 h-7 text-heritage-accent" />
                </div>
                <div className="flex-1 text-left">
                  <h3 className="text-lg font-bold text-gray-800">I am an Artisan</h3>
                  <p className="text-sm text-gray-500">Catalog and sell your handmade crafts</p>
                </div>
                <ArrowRight className="w-5 h-5 text-gray-400" />
              </button>
            </div>
          </div>
        )}

        {/* ─── Step: Artisan Registration ─── */}
        {step === 'artisan-register' && (
          <div className="flex-1 flex flex-col">
            <h2 className="text-xl font-bold text-gray-800 mb-1">Register as Artisan</h2>
            <p className="text-sm text-gray-500 mb-6">Tell us about yourself and your craft.</p>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 flex flex-col gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-2">Full Name</label>
                <input
                  type="text"
                  placeholder="e.g. Ramesh Kumhar"
                  value={artisanForm.name}
                  onChange={e => setArtisanForm({ ...artisanForm, name: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg p-3 outline-none focus:border-[#003366]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-2">Craft Category</label>
                <select
                  value={artisanForm.craft}
                  onChange={e => setArtisanForm({ ...artisanForm, craft: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg p-3 outline-none focus:border-[#003366] bg-white"
                >
                  <option value="">Select your craft</option>
                  <option value="Blue Pottery">Blue Pottery</option>
                  <option value="Kondapalli Toys">Kondapalli Toys</option>
                  <option value="Kutch Weaving">Kutch Weaving</option>
                  <option value="Brass Metalcraft">Brass Metalcraft</option>
                  <option value="Block Printing">Block Printing</option>
                  <option value="Woodcarving">Woodcarving</option>
                  <option value="Stone Carving">Stone Carving</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-2">Region / State</label>
                <input
                  type="text"
                  placeholder="e.g. Rajasthan"
                  value={artisanForm.region}
                  onChange={e => setArtisanForm({ ...artisanForm, region: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg p-3 outline-none focus:border-[#003366]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-2">Short Bio (Optional)</label>
                <textarea
                  placeholder="Tell us about your heritage and craft tradition..."
                  value={artisanForm.bio}
                  onChange={e => setArtisanForm({ ...artisanForm, bio: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg p-3 outline-none focus:border-[#003366] min-h-[80px]"
                />
              </div>

              {authError && (
                <p className="text-sm text-red-600 bg-red-50 p-2 rounded-lg border border-red-200">{authError}</p>
              )}

              <button
                onClick={onRegisterArtisan}
                disabled={!artisanForm.name || !artisanForm.craft || !artisanForm.region || isLoading}
                className="w-full bg-heritage-accent text-white font-bold py-3.5 rounded-lg shadow-md disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <ShieldCheck className="w-5 h-5" />}
                Register & Continue
              </button>

              <button onClick={() => setStep('role-select')} className="text-sm text-gray-500 underline mt-1 text-center">
                Back
              </button>
            </div>
          </div>
        )}
      </main>

      {/* reCAPTCHA container (invisible) */}
      <div id="recaptcha-container"></div>

      {/* Footer */}
      <footer className="p-4 text-center border-t border-gray-200 bg-white">
        <p className="text-[10px] text-gray-500 font-medium uppercase tracking-wider">
          Ministry of Social Justice & Empowerment • Government of India
        </p>
      </footer>
    </div>
  );
};



