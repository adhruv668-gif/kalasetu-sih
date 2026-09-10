import {
  collection, doc, addDoc, getDocs, getDoc, updateDoc, deleteDoc,
  query, where, orderBy, onSnapshot, setDoc, serverTimestamp,
  type Unsubscribe
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from './firebase';
import type { Artisan, Product } from '../types';

// ─── Artisans ───────────────────────────────────────────────

export const getArtisan = async (id: string): Promise<Artisan | null> => {
  if (!isFirebaseConfigured) return null;
  try {
    const snap = await getDoc(doc(db, 'artisans', id));
    if (!snap.exists()) return null;
    return { id: snap.id, ...snap.data() } as Artisan;
  } catch (e) {
    return null;
  }
};

export const getArtisanByUid = async (uid: string): Promise<Artisan | null> => {
  if (!isFirebaseConfigured) return null;
  try {
    const q = query(collection(db, 'artisans'), where('uid', '==', uid));
    const snap = await getDocs(q);
    if (snap.empty) return null;
    const d = snap.docs[0];
    return { id: d.id, ...d.data() } as Artisan;
  } catch (e) {
    return null;
  }
};

export const getAllArtisans = async (): Promise<Artisan[]> => {
  if (!isFirebaseConfigured) return [];
  try {
    const snap = await getDocs(collection(db, 'artisans'));
    return snap.docs.map(d => ({ id: d.id, ...d.data() }) as Artisan);
  } catch (e) {
    return [];
  }
};

export const createArtisan = async (data: Omit<Artisan, 'id'>): Promise<string> => {
  if (!isFirebaseConfigured) {
    const localId = `artisan_${Date.now()}`;
    return localId;
  }
  const ref = await addDoc(collection(db, 'artisans'), {
    ...data,
    createdAt: serverTimestamp(),
  });
  return ref.id;
};

export const createArtisanWithId = async (id: string, data: Omit<Artisan, 'id'>): Promise<void> => {
  if (!isFirebaseConfigured) return;
  await setDoc(doc(db, 'artisans', id), {
    ...data,
    createdAt: serverTimestamp(),
  });
};

// ─── Products ───────────────────────────────────────────────

export const getAllProducts = async (): Promise<Product[]> => {
  if (!isFirebaseConfigured) return [];
  try {
    const snap = await getDocs(collection(db, 'products'));
    return snap.docs.map(d => ({ id: d.id, ...d.data() }) as Product);
  } catch (e) {
    return [];
  }
};

export const getProductsByArtisan = async (artisanId: string): Promise<Product[]> => {
  if (!isFirebaseConfigured) return [];
  try {
    const q = query(collection(db, 'products'), where('artisanId', '==', artisanId));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() }) as Product);
  } catch (e) {
    return [];
  }
};

export const getProductsByCategory = async (category: string): Promise<Product[]> => {
  if (!isFirebaseConfigured) return [];
  try {
    const q = query(
      collection(db, 'products'),
      where('category', '==', category),
      where('status', '==', 'published')
    );
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() }) as Product);
  } catch (e) {
    return [];
  }
};

export const addProductToFirestore = async (data: Omit<Product, 'id'>): Promise<string> => {
  if (!isFirebaseConfigured) return `p_${Date.now()}`;
  const ref = await addDoc(collection(db, 'products'), {
    ...data,
    createdAt: serverTimestamp(),
  });
  return ref.id;
};

export const updateProductInFirestore = async (id: string, updates: Partial<Product>): Promise<void> => {
  if (!isFirebaseConfigured) return;
  await updateDoc(doc(db, 'products', id), updates);
};

export const deleteProductFromFirestore = async (id: string): Promise<void> => {
  if (!isFirebaseConfigured) return;
  await deleteDoc(doc(db, 'products', id));
};

// ─── Real-time Listeners ────────────────────────────────────

export const subscribeToProducts = (callback: (products: Product[]) => void): Unsubscribe => {
  if (!isFirebaseConfigured) return () => {};
  try {
    const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'));
    return onSnapshot(q, (snap) => {
      const products = snap.docs.map(d => ({ id: d.id, ...d.data() }) as Product);
      callback(products);
    }, (error) => {
      console.warn('Products listener notice:', error.message);
    });
  } catch (e) {
    return () => {};
  }
};

export const subscribeToArtisans = (callback: (artisans: Artisan[]) => void): Unsubscribe => {
  if (!isFirebaseConfigured) return () => {};
  try {
    return onSnapshot(collection(db, 'artisans'), (snap) => {
      const artisans = snap.docs.map(d => ({ id: d.id, ...d.data() }) as Artisan);
      callback(artisans);
    }, (error) => {
      console.warn('Artisans listener notice:', error.message);
    });
  } catch (e) {
    return () => {};
  }
};

// ─── Cart (per-user) ────────────────────────────────────────

export const getCart = async (uid: string): Promise<string[]> => {
  if (!isFirebaseConfigured) return [];
  try {
    const snap = await getDoc(doc(db, 'carts', uid));
    if (!snap.exists()) return [];
    return (snap.data().productIds as string[]) || [];
  } catch (e) {
    return [];
  }
};

export const updateCart = async (uid: string, productIds: string[]): Promise<void> => {
  if (!isFirebaseConfigured) return;
  try {
    await setDoc(doc(db, 'carts', uid), { productIds });
  } catch (e) {}
};

// ─── Orders ─────────────────────────────────────────────────

export const createOrder = async (uid: string, productIds: string[], total: number): Promise<string> => {
  if (!isFirebaseConfigured) return `ord_${Date.now()}`;
  try {
    const ref = await addDoc(collection(db, 'orders'), {
      buyerUid: uid,
      productIds,
      total,
      status: 'confirmed',
      createdAt: serverTimestamp(),
    });
    return ref.id;
  } catch (e) {
    return `ord_${Date.now()}`;
  }
};
