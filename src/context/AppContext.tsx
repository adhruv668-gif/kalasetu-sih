import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Artisan, Product } from '../types';

interface AppState {
  artisans: Artisan[];
  products: Product[];
  currentArtisanId: string;
  isOnline: boolean;
  toggleDemoOffline: () => void;
  addProduct: (product: Omit<Product, 'id' | 'syncStatus'>) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
}

const mockArtisans: Artisan[] = [
  {
    id: 'a1',
    name: 'Ramesh Kumhar',
    region: 'Rajasthan',
    craft: 'Blue Pottery',
    bio: 'A 3rd generation potter keeping the traditional Jaipur blue pottery alive.',
    photoUrl: 'https://placehold.co/400x400/e2e8f0/475569?text=Ramesh+Kumhar',
  },
  {
    id: 'a2',
    name: 'Lakshmi Devi',
    region: 'Andhra Pradesh',
    craft: 'Kondapalli Toys',
    bio: 'Crafting vibrant wooden toys using traditional soft poniki wood.',
    photoUrl: 'https://images.unsplash.com/photo-1544168190-79c17527004f?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'a3',
    name: 'Sushila Ben',
    region: 'Gujarat',
    craft: 'Kutch Weaving',
    bio: 'Master weaver specializing in traditional Bhujodi textile weaving.',
    photoUrl: 'https://placehold.co/400x400/e2e8f0/475569?text=Sushila+Ben',
  },
  {
    id: 'a4',
    name: 'Abdul Rehman',
    region: 'Uttar Pradesh',
    craft: 'Brass Metalcraft',
    bio: 'Mastering the ancient art of Moradabad brass etching and casting.',
    photoUrl: 'https://images.unsplash.com/photo-1506084868230-bb9d95c24759?auto=format&fit=crop&w=400&q=80',
  }
];

const mockProducts: Product[] = [
  {
    id: 'p1', artisanId: 'a1', title: 'Decorative Blue Vase',
    description: 'Hand-painted ceramic vase with traditional floral motifs.',
    category: 'Pottery', tags: ['blue pottery', 'home decor', 'handmade'],
    materialsCost: 200, laborHours: 6, suggestedPrice: 800, finalPrice: 850,
    photoUrl: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&w=400&q=80',
    status: 'published', syncStatus: 'synced'
  },
  {
    id: 'p2', artisanId: 'a1', title: 'Jaipur Blue Plate',
    description: 'Ceramic decorative wall plate featuring geometric patterns.',
    category: 'Pottery', tags: ['wall decor', 'ceramic', 'traditional'],
    materialsCost: 150, laborHours: 4, suggestedPrice: 500, finalPrice: 550,
    photoUrl: 'https://images.unsplash.com/photo-1601362840469-51e4d8d58785?auto=format&fit=crop&w=400&q=80',
    status: 'published', syncStatus: 'synced'
  },
  {
    id: 'p3', artisanId: 'a2', title: 'Kondapalli Dashavatar Set',
    description: 'Hand-carved wooden toy set depicting the ten avatars, painted with natural colors.',
    category: 'Woodwork', tags: ['toys', 'wooden', 'mythology'],
    materialsCost: 300, laborHours: 12, suggestedPrice: 1500, finalPrice: 1650,
    photoUrl: 'https://placehold.co/400x400/e2e8f0/475569?text=Dashavatar+Toys',
    status: 'published', syncStatus: 'synced'
  },
  {
    id: 'p4', artisanId: 'a2', title: 'Dancing Doll (Thanjavur)',
    description: 'Traditional nodding doll carved from light wood.',
    category: 'Woodwork', tags: ['doll', 'heritage', 'decor'],
    materialsCost: 100, laborHours: 5, suggestedPrice: 600, finalPrice: 650,
    photoUrl: 'https://placehold.co/400x400/e2e8f0/475569?text=Dancing+Doll',
    status: 'published', syncStatus: 'synced'
  },
  {
    id: 'p5', artisanId: 'a3', title: 'Bhujodi Woolen Shawl',
    description: 'Handwoven woolen shawl with intricate extra-weft motifs.',
    category: 'Weaving', tags: ['shawl', 'textile', 'winter'],
    materialsCost: 600, laborHours: 18, suggestedPrice: 2400, finalPrice: 2600,
    photoUrl: 'https://placehold.co/400x400/e2e8f0/475569?text=Bhujodi+Shawl',
    status: 'published', syncStatus: 'synced'
  },
  {
    id: 'p6', artisanId: 'a3', title: 'Kala Cotton Runner',
    description: 'Organic unbleached Kala cotton table runner with woven borders.',
    category: 'Weaving', tags: ['home decor', 'cotton', 'sustainable'],
    materialsCost: 200, laborHours: 8, suggestedPrice: 900, finalPrice: 1000,
    photoUrl: 'https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&w=400&q=80',
    status: 'published', syncStatus: 'synced'
  },
  {
    id: 'p7', artisanId: 'a4', title: 'Etched Brass Tray',
    description: 'Solid brass serving tray with fine hand-etched floral arabesques.',
    category: 'Metalcraft', tags: ['brass', 'serving', 'kitchen'],
    materialsCost: 500, laborHours: 10, suggestedPrice: 1800, finalPrice: 1950,
    photoUrl: 'https://placehold.co/400x400/e2e8f0/475569?text=Brass+Tray',
    status: 'published', syncStatus: 'synced'
  },
  {
    id: 'p8', artisanId: 'a4', title: 'Brass Elephant Figurine',
    description: 'Cast brass miniature elephant with intricate saddle detailing.',
    category: 'Metalcraft', tags: ['decor', 'brass', 'animal'],
    materialsCost: 150, laborHours: 4, suggestedPrice: 700, finalPrice: 750,
    photoUrl: 'https://placehold.co/400x400/e2e8f0/475569?text=Brass+Elephant',
    status: 'published', syncStatus: 'synced'
  }
];

const AppContext = createContext<AppState | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [artisans] = useState<Artisan[]>(mockArtisans);
  
  // Initialize from localStorage or mock
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('kalasetu_products');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return mockProducts;
      }
    }
    return mockProducts;
  });

  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [isDemoOffline, setIsDemoOffline] = useState(false);
  const effectiveIsOnline = isOnline && !isDemoOffline;
  
  // Default to the first artisan for Artisan mode
  const currentArtisanId = 'a1';

  // Save to localStorage whenever products change
  useEffect(() => {
    localStorage.setItem('kalasetu_products', JSON.stringify(products));
  }, [products]);

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
        console.log('Syncing pending products...');
        const timer = setTimeout(() => {
          setProducts(prev => 
            prev.map(p => p.syncStatus === 'pending' ? { ...p, syncStatus: 'synced' } : p)
          );
        }, 1500); // Simulate network delay
        return () => clearTimeout(timer);
      }
    }
  }, [effectiveIsOnline, products]);

  const addProduct = (productData: Omit<Product, 'id' | 'syncStatus'>) => {
    const newProduct: Product = {
      ...productData,
      id: `p${Date.now()}`,
      syncStatus: effectiveIsOnline ? 'synced' : 'pending' // instantly synced if online, else pending
    };
    setProducts(prev => [newProduct, ...prev]);
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts(prev => prev.map(p => 
      p.id === id ? { ...p, ...updates, syncStatus: effectiveIsOnline ? 'synced' : 'pending' } : p
    ));
  };

  const toggleDemoOffline = () => setIsDemoOffline(prev => !prev);

  return (
    <AppContext.Provider value={{ artisans, products, currentArtisanId, isOnline: effectiveIsOnline, toggleDemoOffline, addProduct, updateProduct }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppContext must be used within AppProvider');
  return context;
};
