import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Artisan, Product } from '../types';
import { useAuth } from './AuthContext';
import {
  subscribeToProducts,
  subscribeToArtisans,
  addProductToFirestore,
  updateProductInFirestore,
} from '../lib/firestore';
import { seedFirestore } from '../lib/seed';

interface AppState {
  artisans: Artisan[];
  products: Product[];
  currentArtisanId: string;
  isOnline: boolean;
  toggleDemoOffline: () => void;
  addProduct: (product: Omit<Product, 'id' | 'syncStatus'>) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  isDataLoading: boolean;
}

const AppContext = createContext<AppState | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { artisanProfile } = useAuth();
  
  const [artisans, setArtisans] = useState<Artisan[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [isDemoOffline, setIsDemoOffline] = useState(false);
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [seeded, setSeeded] = useState(false);

  const effectiveIsOnline = isOnline && !isDemoOffline;

  // Current artisan ID comes from auth
  const currentArtisanId = artisanProfile?.id || '';

  // Seed Firestore on first load
  useEffect(() => {
    if (!seeded) {
      seedFirestore().then(() => setSeeded(true)).catch(console.error);
    }
  }, [seeded]);

  // Subscribe to real-time Firestore data
  useEffect(() => {
    if (!seeded) return;

    setIsDataLoading(true);

    const unsubProducts = subscribeToProducts((prods) => {
      setProducts(prods);
      setIsDataLoading(false);
    });

    const unsubArtisans = subscribeToArtisans((arts) => {
      setArtisans(arts);
    });

    return () => {
      unsubProducts();
      unsubArtisans();
    };
  }, [seeded]);

  // Online/offline detection
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Simulate offline-first sync
  useEffect(() => {
    if (effectiveIsOnline) {
      const pendingProducts = products.filter(p => p.syncStatus === 'pending');
      if (pendingProducts.length > 0) {
        const timer = setTimeout(() => {
          pendingProducts.forEach(p => {
            updateProductInFirestore(p.id, { syncStatus: 'synced' }).catch(console.error);
          });
        }, 1500);
        return () => clearTimeout(timer);
      }
    }
  }, [effectiveIsOnline, products]);

  const addProduct = async (productData: Omit<Product, 'id' | 'syncStatus'>) => {
    const syncStatus = effectiveIsOnline ? 'synced' : 'pending';
    try {
      await addProductToFirestore({
        ...productData,
        syncStatus,
      } as Omit<Product, 'id'>);
      // Firestore listener will auto-update local state
    } catch (error) {
      console.error('Error adding product:', error);
      // Fallback: add to local state
      const newProduct: Product = {
        ...productData,
        id: `local_${Date.now()}`,
        syncStatus: 'pending',
      };
      setProducts(prev => [newProduct, ...prev]);
    }
  };

  const updateProduct = async (id: string, updates: Partial<Product>) => {
    try {
      await updateProductInFirestore(id, {
        ...updates,
        syncStatus: effectiveIsOnline ? 'synced' : 'pending',
      });
      // Firestore listener will auto-update local state
    } catch (error) {
      console.error('Error updating product:', error);
      // Fallback: update local state
      setProducts(prev =>
        prev.map(p =>
          p.id === id ? { ...p, ...updates, syncStatus: effectiveIsOnline ? 'synced' : 'pending' } : p
        )
      );
    }
  };

  const toggleDemoOffline = () => setIsDemoOffline(prev => !prev);

  return (
    <AppContext.Provider
      value={{
        artisans,
        products,
        currentArtisanId,
        isOnline: effectiveIsOnline,
        toggleDemoOffline,
        addProduct,
        updateProduct,
        isDataLoading,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppContext must be used within AppProvider');
  return context;
};
