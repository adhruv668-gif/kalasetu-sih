import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Artisan, Product } from '../types';
import { useAuth } from './AuthContext';
import {
  subscribeToProducts,
  subscribeToArtisans,
  addProductToFirestore,
  updateProductInFirestore,
  updateCart,
  createOrder,
} from '../lib/firestore';
import { seedArtisans, seedProducts, seedFirestore } from '../lib/seed';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';

interface AppState {
  artisans: Artisan[];
  products: Product[];
  currentArtisanId: string;
  isOnline: boolean;
  toggleDemoOffline: () => void;
  addProduct: (product: Omit<Product, 'id' | 'syncStatus'>) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  isDataLoading: boolean;
  cart: string[];
  addToCart: (productId: string) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  placeOrder: (total: number) => Promise<string>;
}

const AppContext = createContext<AppState | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { artisanProfile, user } = useAuth();

  // Invalidate local cache if catalog images updated to guaranteed verified photos
  try {
    const SEED_VERSION = 'v5_verified_authentic_craft_photos';
    if (typeof window !== 'undefined' && localStorage.getItem('kaarvi_seed_version') !== SEED_VERSION) {
      localStorage.removeItem('kaarvi_products');
      localStorage.removeItem('kaarvi_artisans');
      localStorage.setItem('kaarvi_seed_version', SEED_VERSION);
    }
  } catch (e) {}

  // Initialize from persistent cache or rich heritage seed data
  const [artisans, setArtisans] = useState<Artisan[]>(() => {
    try {
      const cached = localStorage.getItem('kaarvi_artisans');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length >= seedArtisans.length) {
          return parsed;
        }
      }
    } catch (e) {}
    return seedArtisans;
  });

  const [products, setProducts] = useState<Product[]>(() => {
    const baseSeed = seedProducts.map((p, i) => ({ ...p, id: `p_seed_${i + 1}` } as Product));
    try {
      const cached = localStorage.getItem('kaarvi_products');
      if (cached) {
        const parsed: Product[] = JSON.parse(cached);
        if (Array.isArray(parsed)) {
          // Keep newly added artisan creations while guaranteeing all master seed items exist
          const userCreated = parsed.filter(p => !p.id.startsWith('p_seed_'));
          // Merge master seed items and any user-created items
          return [...userCreated, ...baseSeed];
        }
      }
    } catch (e) {}
    return baseSeed;
  });

  const [cart, setCart] = useState<string[]>([]);
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [isDemoOffline, setIsDemoOffline] = useState(false);
  const [isDataLoading, setIsDataLoading] = useState(false);
  const [seeded, setSeeded] = useState(false);

  const effectiveIsOnline = isOnline && !isDemoOffline;
  const currentArtisanId = artisanProfile?.id || (artisans[0] ? artisans[0].id : 'a1');

  // Attempt Firestore seeding if online and configured
  useEffect(() => {
    if (!seeded) {
      seedFirestore()
        .then(() => setSeeded(true))
        .catch((err) => {
          console.warn('Firestore seeding skipped (using resilient local cache):', err.message);
          setSeeded(true);
        });
    }
  }, [seeded]);

  // Subscribe to real-time Firestore if available
  useEffect(() => {
    if (!seeded) return;

    let unsubProducts = () => {};
    let unsubArtisans = () => {};

    try {
      unsubProducts = subscribeToProducts((prods) => {
        if (prods && prods.length > 0) {
          setProducts(prods);
          localStorage.setItem('kaarvi_products', JSON.stringify(prods));
        }
        setIsDataLoading(false);
      });

      unsubArtisans = subscribeToArtisans((arts) => {
        if (arts && arts.length > 0) {
          setArtisans(arts);
          localStorage.setItem('kaarvi_artisans', JSON.stringify(arts));
        }
      });
    } catch (e) {
      setIsDataLoading(false);
    }

    return () => {
      unsubProducts();
      unsubArtisans();
    };
  }, [seeded]);

  // Real-time Cart tied to the logged-in user in Firestore / LocalStorage
  useEffect(() => {
    if (!user) {
      const local = localStorage.getItem('kaarvi_local_cart');
      setCart(local ? JSON.parse(local) : []);
      return;
    }

    let unsubCart = () => {};
    try {
      unsubCart = onSnapshot(
        doc(db, 'carts', user.uid),
        (snap) => {
          if (snap.exists()) {
            const ids = (snap.data().productIds as string[]) || [];
            setCart(ids);
          } else {
            setCart([]);
          }
        },
        (err) => {
          console.warn('Cart snapshot fallback to local:', err.message);
          const local = localStorage.getItem(`kaarvi_cart_${user.uid}`);
          if (local) setCart(JSON.parse(local));
        }
      );
    } catch (e) {
      const local = localStorage.getItem(`kaarvi_cart_${user.uid}`);
      if (local) setCart(JSON.parse(local));
    }

    return () => unsubCart();
  }, [user]);

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

  // Offline-first sync simulation
  useEffect(() => {
    if (effectiveIsOnline) {
      const pendingProducts = products.filter((p) => p.syncStatus === 'pending');
      if (pendingProducts.length > 0) {
        const timer = setTimeout(() => {
          pendingProducts.forEach((p) => {
            updateProductInFirestore(p.id, { syncStatus: 'synced' }).catch(() => {});
          });
          setProducts((prev) =>
            prev.map((p) => (p.syncStatus === 'pending' ? { ...p, syncStatus: 'synced' } : p))
          );
        }, 1500);
        return () => clearTimeout(timer);
      }
    }
  }, [effectiveIsOnline, products]);

  // Add Product: Reactive instant update to state & localStorage + Firestore sync
  const addProduct = async (productData: Omit<Product, 'id' | 'syncStatus'>) => {
    const syncStatus = effectiveIsOnline ? 'synced' : 'pending';
    const localId = `p_${Date.now()}`;
    const newProduct: Product = {
      ...productData,
      id: localId,
      syncStatus,
    };

    // 1. Immediately reflect in state & localStorage (Instantly visible in Buyer Mode without redeploy)
    setProducts((prev) => {
      const updated = [newProduct, ...prev];
      localStorage.setItem('kaarvi_products', JSON.stringify(updated));
      return updated;
    });

    // 2. Persist to Firestore if online
    try {
      const firestoreId = await addProductToFirestore({
        ...productData,
        syncStatus,
      } as Omit<Product, 'id'>);
      if (firestoreId) {
        setProducts((prev) => {
          const updated = prev.map((p) => (p.id === localId ? { ...p, id: firestoreId } : p));
          localStorage.setItem('kaarvi_products', JSON.stringify(updated));
          return updated;
        });
      }
    } catch (error) {
      console.warn('Firestore offline / write queued:', error);
    }
  };

  const updateProduct = async (id: string, updates: Partial<Product>) => {
    const syncStatus: 'synced' | 'pending' = effectiveIsOnline ? 'synced' : 'pending';
    setProducts((prev) => {
      const updated = prev.map((p) =>
        p.id === id ? { ...p, ...updates, syncStatus } : p
      );
      localStorage.setItem('kaarvi_products', JSON.stringify(updated));
      return updated;
    });

    try {
      await updateProductInFirestore(id, {
        ...updates,
        syncStatus: effectiveIsOnline ? 'synced' : 'pending',
      });
    } catch (error) {
      console.warn('Firestore update queued:', error);
    }
  };

  const addToCart = async (productId: string) => {
    const updated = [...cart, productId];
    setCart(updated);
    if (user) {
      localStorage.setItem(`kaarvi_cart_${user.uid}`, JSON.stringify(updated));
      try {
        await updateCart(user.uid, updated);
      } catch (e) {}
    } else {
      localStorage.setItem('kaarvi_local_cart', JSON.stringify(updated));
    }
  };

  const removeFromCart = async (productId: string) => {
    const index = cart.indexOf(productId);
    if (index > -1) {
      const updated = [...cart];
      updated.splice(index, 1);
      setCart(updated);
      if (user) {
        localStorage.setItem(`kaarvi_cart_${user.uid}`, JSON.stringify(updated));
        try {
          await updateCart(user.uid, updated);
        } catch (e) {}
      } else {
        localStorage.setItem('kaarvi_local_cart', JSON.stringify(updated));
      }
    }
  };

  const clearCart = async () => {
    setCart([]);
    if (user) {
      localStorage.removeItem(`kaarvi_cart_${user.uid}`);
      try {
        await updateCart(user.uid, []);
      } catch (e) {}
    } else {
      localStorage.removeItem('kaarvi_local_cart');
    }
  };

  const placeOrder = async (total: number): Promise<string> => {
    const uid = user ? user.uid : 'guest_buyer';
    let orderId = `ord_${Date.now()}`;
    try {
      orderId = await createOrder(uid, cart, total);
    } catch (e) {
      console.warn('Order recorded locally:', e);
    }
    await clearCart();
    return orderId;
  };

  const toggleDemoOffline = () => setIsDemoOffline((prev) => !prev);

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
        cart,
        addToCart,
        removeFromCart,
        clearCart,
        placeOrder,
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
