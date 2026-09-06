import { collection, getDocs, deleteDoc } from 'firebase/firestore';
import { db } from './firebase';
import { createArtisanWithId } from './firestore';
import { addDoc, serverTimestamp } from 'firebase/firestore';

const seedArtisans = [
  {
    id: 'a1',
    name: 'Ramesh Kumhar',
    region: 'Rajasthan',
    craft: 'Blue Pottery',
    bio: 'A 3rd generation potter keeping the traditional Jaipur blue pottery alive.',
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/6/61/Potter_at_work.jpg',
  },
  {
    id: 'a2',
    name: 'Lakshmi Devi',
    region: 'Andhra Pradesh',
    craft: 'Kondapalli Toys',
    bio: 'Crafting vibrant wooden toys using traditional soft poniki wood.',
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/3/3f/Indian_woman.jpg',
  },
  {
    id: 'a3',
    name: 'Sushila Ben',
    region: 'Gujarat',
    craft: 'Kutch Weaving',
    bio: 'Master weaver specializing in traditional Bhujodi textile weaving.',
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/c/c6/Weaver_at_work.jpg',
  },
  {
    id: 'a4',
    name: 'Abdul Rehman',
    region: 'Uttar Pradesh',
    craft: 'Brass Metalcraft',
    bio: 'Mastering the ancient art of Moradabad brass etching and casting.',
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/b/ba/Indian_farmer.jpg',
  },
];

const seedProducts = [
  {
    artisanId: 'a1', title: 'Decorative Blue Vase',
    description: 'Hand-painted ceramic vase with traditional floral motifs.',
    category: 'Pottery', tags: ['blue pottery', 'home decor', 'handmade'],
    materialsCost: 200, laborHours: 6, suggestedPrice: 800, finalPrice: 850,
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/7/7f/Blue_Pottery_Designer_Vase.jpg',
    status: 'published', syncStatus: 'synced',
  },
  {
    artisanId: 'a1', title: 'Jaipur Blue Plate',
    description: 'Ceramic decorative wall plate featuring geometric patterns.',
    category: 'Pottery', tags: ['wall decor', 'ceramic', 'traditional'],
    materialsCost: 150, laborHours: 4, suggestedPrice: 500, finalPrice: 550,
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/d/d3/Blue_pottery_from_Jaipur_4.jpg',
    status: 'published', syncStatus: 'synced',
  },
  {
    artisanId: 'a2', title: 'Kondapalli Dashavatar Set',
    description: 'Hand-carved wooden toy set depicting the ten avatars, painted with natural colors.',
    category: 'Woodwork', tags: ['toys', 'wooden', 'mythology'],
    materialsCost: 300, laborHours: 12, suggestedPrice: 1500, finalPrice: 1650,
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/d/d0/Kondapalli_toys.jpg',
    status: 'published', syncStatus: 'synced',
  },
  {
    artisanId: 'a2', title: 'Dancing Doll (Thanjavur)',
    description: 'Traditional nodding doll carved from light wood.',
    category: 'Woodwork', tags: ['doll', 'heritage', 'decor'],
    materialsCost: 100, laborHours: 5, suggestedPrice: 600, finalPrice: 650,
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/6/63/Thanjavur_Doll.JPG',
    status: 'published', syncStatus: 'synced',
  },
  {
    artisanId: 'a3', title: 'Bhujodi Woolen Shawl',
    description: 'Handwoven woolen shawl with intricate extra-weft motifs.',
    category: 'Weaving', tags: ['shawl', 'textile', 'winter'],
    materialsCost: 600, laborHours: 18, suggestedPrice: 2400, finalPrice: 2600,
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/2/27/Embroidered-pashmina-shawl.jpg',
    status: 'published', syncStatus: 'synced',
  },
  {
    artisanId: 'a3', title: 'Kala Cotton Runner',
    description: 'Organic unbleached Kala cotton table runner with woven borders.',
    category: 'Weaving', tags: ['home decor', 'cotton', 'sustainable'],
    materialsCost: 200, laborHours: 8, suggestedPrice: 900, finalPrice: 1000,
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/3/33/Table-cloth_2008-1.jpg',
    status: 'published', syncStatus: 'synced',
  },
  {
    artisanId: 'a4', title: 'Etched Brass Tray',
    description: 'Solid brass serving tray with fine hand-etched floral arabesques.',
    category: 'Metalcraft', tags: ['brass', 'serving', 'kitchen'],
    materialsCost: 500, laborHours: 10, suggestedPrice: 1800, finalPrice: 1950,
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/7/7a/Brass_tray_stand_Egypt_or_Syria_in_the_name_of_ibn_Qalaun_1330_1340.jpg',
    status: 'published', syncStatus: 'synced',
  },
  {
    artisanId: 'a4', title: 'Brass Elephant Figurine',
    description: 'Cast brass miniature elephant with intricate saddle detailing.',
    category: 'Metalcraft', tags: ['decor', 'brass', 'animal'],
    materialsCost: 150, laborHours: 4, suggestedPrice: 700, finalPrice: 750,
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/4/46/Brass_Elephant_Peacock.jpg',
    status: 'published', syncStatus: 'synced',
  },
];

export const seedFirestore = async (force: boolean = false): Promise<{ artisans: number; products: number }> => {
  // Check if already seeded
  const existingProducts = await getDocs(collection(db, 'products'));
  
  // Force re-seed if we find old placehold.co images or the bad Unsplash random IDs in the database
  const hasOldPlaceholders = !existingProducts.empty && existingProducts.docs.some(d => {
      const url = d.data().photoUrl || '';
      return url.includes('placehold') || url.includes('unsplash');
  });
  
  if (!existingProducts.empty && !force && !hasOldPlaceholders) {
    console.log('Firestore already seeded. Skipping.');
    return { artisans: 0, products: existingProducts.size };
  }

  // If force re-seeding, delete existing products first to avoid duplicates
  if (force || hasOldPlaceholders) {
     for (const docSnap of existingProducts.docs) {
        await deleteDoc(docSnap.ref);
     }
  }

  // Seed artisans
  for (const artisan of seedArtisans) {
    const { id, ...data } = artisan;
    await createArtisanWithId(id, data);
  }

  // Seed products
  const productsRef = collection(db, 'products');
  for (const product of seedProducts) {
    await addDoc(productsRef, {
      ...product,
      createdAt: serverTimestamp(),
    });
  }

  console.log(`Seeded ${seedArtisans.length} artisans and ${seedProducts.length} products.`);
  return { artisans: seedArtisans.length, products: seedProducts.length };
};
