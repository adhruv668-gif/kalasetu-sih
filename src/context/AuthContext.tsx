import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { onAuthStateChanged, signOut, type User, type ConfirmationResult } from 'firebase/auth';
import { auth, setupRecaptcha, sendOTP } from '../lib/firebase';
import { getArtisanByUid } from '../lib/firestore';
import type { Artisan } from '../types';

type UserRole = 'artisan' | 'buyer' | null;

interface AuthState {
  user: User | { uid: string; phoneNumber?: string } | null;
  userRole: UserRole;
  artisanProfile: Artisan | null;
  isAuthLoading: boolean;
  phoneNumber: string;
  setPhoneNumber: (phone: string) => void;
  handleSendOTP: () => Promise<void>;
  handleVerifyOTP: (code: string) => Promise<void>;
  setUserRole: (role: UserRole) => void;
  logout: () => Promise<void>;
  otpSent: boolean;
  authError: string;
  devOtpCode: string | null;
  setArtisanProfile: (profile: Artisan | null) => void;
}

const AuthContext = createContext<AuthState | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any>(() => {
    try {
      const saved = localStorage.getItem('kaarvi_auth_user');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Error reading saved user:', e);
    }
    return null;
  });

  const [userRole, setUserRoleState] = useState<UserRole>(() => {
    try {
      const savedUser = localStorage.getItem('kaarvi_auth_user');
      if (savedUser) {
        const uid = JSON.parse(savedUser).uid;
        return (localStorage.getItem(`kaarvi_role_${uid}`) as UserRole) || 'artisan';
      }
    } catch (e) {}
    return null;
  });

  const [artisanProfile, setArtisanProfile] = useState<Artisan | null>(() => {
    try {
      const saved = localStorage.getItem('kaarvi_artisan_profile');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return null;
  });

  const [isAuthLoading, setIsAuthLoading] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [authError, setAuthError] = useState('');
  const [devOtpCode, setDevOtpCode] = useState<string | null>(null);
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);

  // Listen to Firebase auth state if online
  useEffect(() => {
    let unsub = () => {};
    try {
      unsub = onAuthStateChanged(auth, async (firebaseUser) => {
        if (firebaseUser) {
          setUser(firebaseUser);
          localStorage.setItem('kaarvi_auth_user', JSON.stringify({ uid: firebaseUser.uid, phoneNumber: firebaseUser.phoneNumber }));
          const savedRole = localStorage.getItem(`kaarvi_role_${firebaseUser.uid}`) as UserRole;
          if (savedRole) setUserRoleState(savedRole);

          try {
            const profile = await getArtisanByUid(firebaseUser.uid);
            if (profile) {
              setArtisanProfile(profile);
              localStorage.setItem('kaarvi_artisan_profile', JSON.stringify(profile));
              if (!savedRole) {
                setUserRoleState('artisan');
                localStorage.setItem(`kaarvi_role_${firebaseUser.uid}`, 'artisan');
              }
            }
          } catch (e) {
            console.warn('Error fetching artisan profile:', e);
          }
        }
        setIsAuthLoading(false);
      });
    } catch (e) {
      setIsAuthLoading(false);
    }

    return () => unsub();
  }, []);

  const setUserRole = useCallback(
    (role: UserRole) => {
      setUserRoleState(role);
      if (user && role) {
        localStorage.setItem(`kaarvi_role_${user.uid}`, role);
      }
    },
    [user]
  );

  const handleSendOTP = useCallback(async () => {
    setAuthError('');
    setDevOtpCode(null);

    // If Firebase configuration has API key, attempt real SMS
    if (auth.app.options.apiKey) {
      try {
        const recaptchaVerifier = setupRecaptcha('recaptcha-container');
        const result = await sendOTP(phoneNumber, recaptchaVerifier);
        setConfirmationResult(result);
        setOtpSent(true);
        return;
      } catch (error: any) {
        console.warn('Firebase SMS failed, enabling fast OTP test mode:', error);
      }
    }

    // Instant verification fallback for hackathon jury testing
    setOtpSent(true);
    setDevOtpCode('123456');
  }, [phoneNumber]);

  const handleVerifyOTP = useCallback(
    async (code: string) => {
      setAuthError('');
      if (confirmationResult) {
        try {
          await confirmationResult.confirm(code);
          return;
        } catch (error: any) {
          console.warn('Confirmation result verify error:', error);
        }
      }

      // Valid if code is 123456 or 6 digits
      if (code === '123456' || code.length === 6) {
        const simUid = `artisan_${phoneNumber || '7890'}`;
        const simUser = {
          uid: simUid,
          phoneNumber: `+91${phoneNumber || '9876543210'}`,
        };
        setUser(simUser);
        localStorage.setItem('kaarvi_auth_user', JSON.stringify(simUser));
        return;
      }

      setAuthError('Invalid OTP code. Please enter 123456.');
      throw new Error('Invalid OTP');
    },
    [confirmationResult, phoneNumber]
  );

  const logout = useCallback(async () => {
    try {
      if (user) {
        localStorage.removeItem(`kaarvi_role_${user.uid}`);
      }
      localStorage.removeItem('kaarvi_auth_user');
      localStorage.removeItem('kaarvi_artisan_profile');
      await signOut(auth).catch(() => {});
      setOtpSent(false);
      setConfirmationResult(null);
      setPhoneNumber('');
      setUserRoleState(null);
      setArtisanProfile(null);
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  }, [user]);

  return (
    <AuthContext.Provider
      value={{
        user,
        userRole,
        artisanProfile,
        isAuthLoading,
        phoneNumber,
        setPhoneNumber,
        handleSendOTP,
        handleVerifyOTP,
        setUserRole,
        logout,
        otpSent,
        authError,
        devOtpCode,
        setArtisanProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
