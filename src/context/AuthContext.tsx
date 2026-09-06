import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { onAuthStateChanged, signOut, type User, type ConfirmationResult } from 'firebase/auth';
import { auth, setupRecaptcha, sendOTP } from '../lib/firebase';
import { getArtisanByUid } from '../lib/firestore';
import type { Artisan } from '../types';

type UserRole = 'artisan' | 'buyer' | null;

interface AuthState {
  user: User | null;
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
  setArtisanProfile: (profile: Artisan | null) => void;
}

const AuthContext = createContext<AuthState | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userRole, setUserRoleState] = useState<UserRole>(null);
  const [artisanProfile, setArtisanProfile] = useState<Artisan | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [authError, setAuthError] = useState('');
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);

  // Listen to auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        // Restore role from localStorage
        const savedRole = localStorage.getItem(`kalasetu_role_${firebaseUser.uid}`) as UserRole;
        if (savedRole) {
          setUserRoleState(savedRole);
        }
        // Check if user has an artisan profile
        try {
          const profile = await getArtisanByUid(firebaseUser.uid);
          if (profile) {
            setArtisanProfile(profile);
            if (!savedRole) {
              setUserRoleState('artisan');
              localStorage.setItem(`kalasetu_role_${firebaseUser.uid}`, 'artisan');
            }
          } else if (!savedRole) {
            // New user, no role yet — will be set by LoginPage
          }
        } catch (e) {
          console.error('Error loading artisan profile:', e);
        }
      } else {
        setUserRoleState(null);
        setArtisanProfile(null);
      }
      setIsAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const setUserRole = useCallback((role: UserRole) => {
    setUserRoleState(role);
    if (user && role) {
      localStorage.setItem(`kalasetu_role_${user.uid}`, role);
    }
  }, [user]);

  const handleSendOTP = useCallback(async () => {
    setAuthError('');
    try {
      const recaptchaVerifier = setupRecaptcha('recaptcha-container');
      const result = await sendOTP(phoneNumber, recaptchaVerifier);
      setConfirmationResult(result);
      setOtpSent(true);
    } catch (error: any) {
      console.error('OTP send error:', error);
      setAuthError(error.message || 'Failed to send OTP. Please try again.');
    }
  }, [phoneNumber]);

  const handleVerifyOTP = useCallback(async (code: string) => {
    setAuthError('');
    if (!confirmationResult) {
      setAuthError('Please send OTP first.');
      return;
    }
    try {
      await confirmationResult.confirm(code);
      // onAuthStateChanged will handle the rest
    } catch (error: any) {
      console.error('OTP verify error:', error);
      setAuthError('Invalid OTP. Please try again.');
    }
  }, [confirmationResult]);

  const logout = useCallback(async () => {
    try {
      if (user) {
        localStorage.removeItem(`kalasetu_role_${user.uid}`);
      }
      await signOut(auth);
      setOtpSent(false);
      setConfirmationResult(null);
      setPhoneNumber('');
      setUserRoleState(null);
      setArtisanProfile(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  }, [user]);

  return (
    <AuthContext.Provider value={{
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
      setArtisanProfile,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
