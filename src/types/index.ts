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
  titleHi?: string;
  description: string;
  descriptionHi?: string;
  category: string;
  tags: string[];
  materialsCost: number;
  laborHours: number;
  suggestedPrice: number;
  finalPrice: number;
  photoUrl: string;
  originalPhotoUrl?: string;
  isStudioEnhanced?: boolean;
  craftLineage?: string;
  seoKeywords?: string[];
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
