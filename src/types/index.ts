export interface Artisan {
  id: string;
  name: string;
  region: string;
  craft: string;
  bio: string;
  photoUrl: string;
  uid?: string;
  phone?: string;
}

export interface Product {
  id: string;
  artisanId: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  materialsCost: number;
  laborHours: number;
  suggestedPrice: number;
  finalPrice: number;
  photoUrl: string;
  status: 'draft' | 'published';
  syncStatus: 'synced' | 'pending';
  createdAt?: any;
}

export interface PricingBreakdown {
  materials: number;
  labor: number;
  platformFee: number;
  artisanTakeHome: number;
  total: number;
}
