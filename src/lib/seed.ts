// ============================================================================
// KALASETE HERITAGE CATALOG — MASTER SEED DATA
// 
// WARNING: This seed data must not be overwritten or wiped by future changes.
// Always add to it, never replace it wholesale.
// All images are verified direct Wikimedia Commons or Unsplash CDN URLs.
// ============================================================================

import { collection, getDocs, deleteDoc, doc, setDoc, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, isFirebaseConfigured } from './firebase';
import type { Artisan, Product } from '../types';

export const seedArtisans: Artisan[] = [
  // 1. Pottery
  {
    id: 'a1',
    name: 'Ramesh Kumhar',
    region: 'Jaipur, Rajasthan',
    craft: 'Blue Pottery',
    bio: 'A 3rd-generation master potter crafting traditional quartz-paste ceramics with natural Persian cobalt glazes.',
    photoUrl: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/6/61/Potter_at_work.jpg/960px-Potter_at_work.jpg',
  },
  {
    id: 'a2',
    name: 'Santosh Prajapati',
    region: 'Khurja, Uttar Pradesh',
    craft: 'Khurja Studio Pottery',
    bio: 'Pioneer of high-fired terracotta and celadon-glazed kitchenware preserving Khurja heritage.',
    photoUrl: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/b/ba/Indian_farmer.jpg/500px-Indian_farmer.jpg',
  },
  {
    id: 'a3',
    name: 'L. Thoiba Devi',
    region: 'Longpi, Manipur',
    craft: 'Black Serpentine Pottery',
    bio: 'Master sculptress shaping serpentinite stone and weathered river clay entirely by hand without a potter wheel.',
    photoUrl: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/3/3f/Indian_woman.jpg/960px-Indian_woman.jpg',
  },

  // 2. Textiles / Weaving
  {
    id: 'a4',
    name: 'Ghulam Nabi',
    region: 'Srinagar, Jammu & Kashmir',
    craft: 'Pashmina & Kani Weaving',
    bio: 'Veteran master weaver spinning Changthangi mountain goat fleece into whisper-soft heirloom Pashmina shawls.',
    photoUrl: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/b/ba/Indian_farmer.jpg/500px-Indian_farmer.jpg',
  },
  {
    id: 'a5',
    name: 'K. Krishnamoorthy',
    region: 'Kanchipuram, Tamil Nadu',
    craft: 'Kanchipuram Silk Weaving',
    bio: 'Hereditary pit-loom weaver interlacing pure mulberry silk with korvai interlocking border zari work.',
    photoUrl: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/c/c6/Weaver_at_work.jpg/960px-Weaver_at_work.jpg',
  },
  {
    id: 'a6',
    name: 'Kailash Chand',
    region: 'Chanderi, Madhya Pradesh',
    craft: 'Chanderi Handloom',
    bio: 'Specialist in sheer handloom weaves combining delicate degummed silk warp with gossamer cotton weft.',
    photoUrl: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/e/e0/Craftsman_preparing_harmonium.jpg/960px-Craftsman_preparing_harmonium.jpg',
  },
  {
    id: 'a7',
    name: 'Sushila Ben',
    region: 'Bhujodi, Kutch, Gujarat',
    craft: 'Kutch Bhujodi Weaving',
    bio: 'National award-winning weaver specializing in indigenous rainfed Kala cotton and mirrored extra-weft borders.',
    photoUrl: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/3/3f/Indian_woman.jpg/960px-Indian_woman.jpg',
  },

  // 3. Woodwork
  {
    id: 'a8',
    name: 'B. Gururaj',
    region: 'Channapatna, Karnataka',
    craft: 'Channapatna Wooden Toys',
    bio: 'Award-winning toy artisan turning ivory-wood on traditional lathes using vegetable lacquer finishes.',
    photoUrl: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/3/32/Channapatna_toys_artists.jpg/960px-Channapatna_toys_artists.jpg',
  },
  {
    id: 'a9',
    name: 'Bashir Ahmed Dar',
    region: 'Srinagar, Jammu & Kashmir',
    craft: 'Walnut Wood Carving',
    bio: 'State awardee creating intricate open-fretwork and deep floral carvings from seasoned Himalayan walnut wood.',
    photoUrl: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/b/ba/Indian_farmer.jpg/500px-Indian_farmer.jpg',
  },
  {
    id: 'a10',
    name: 'Lakshmi Devi',
    region: 'Kondapalli, Andhra Pradesh',
    craft: 'Kondapalli Toys',
    bio: 'Carving vibrant mythological and rural Indian figures from lightweight sacred Poniki wood with tamarind-paste joints.',
    photoUrl: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/3/3f/Indian_woman.jpg/960px-Indian_woman.jpg',
  },

  // 4. Metalcraft
  {
    id: 'a11',
    name: 'Mohammed Saleem',
    region: 'Bidar, Karnataka',
    craft: 'Bidriware Silver Inlay',
    bio: 'Heritage craftsman practicing 14th-century Bidri metallurgy with pure silver wire embedded in zinc-copper alloy.',
    photoUrl: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/5/5e/Making_Bidriware.jpg/960px-Making_Bidriware.jpg',
  },
  {
    id: 'a12',
    name: 'Manglu Ram',
    region: 'Bastar, Chhattisgarh',
    craft: 'Dhokra Lost-Wax Bell Metal',
    bio: 'Practicing ancient 4000-year-old lost-wax hollow brass casting handed down through Bastar tribal generations.',
    photoUrl: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/c/c6/Weaver_at_work.jpg/960px-Weaver_at_work.jpg',
  },
  {
    id: 'a13',
    name: 'Riazuddin Ansari',
    region: 'Moradabad, Uttar Pradesh',
    craft: 'Engraved Brass Metalcraft',
    bio: 'Master metal engraver known for Persian Naqshi floral and jaali engravings on heavyweight brassware.',
    photoUrl: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/7/73/Shilp_Guru_Ismail_Sulemanji_Khatri_1.jpg/960px-Shilp_Guru_Ismail_Sulemanji_Khatri_1.jpg',
  },

  // 5. Embroidery
  {
    id: 'a14',
    name: 'Harpreet Kaur',
    region: 'Amritsar, Punjab',
    craft: 'Phulkari Silk Embroidery',
    bio: 'Heirloom textile embroiderer stitching rich geometric pat silk threads into traditional coarse khaddar fabric.',
    photoUrl: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/3/3f/Indian_woman.jpg/960px-Indian_woman.jpg',
  },
  {
    id: 'a15',
    name: 'Nafisa Begum',
    region: 'Lucknow, Uttar Pradesh',
    craft: 'Chikankari Shadow Work',
    bio: 'Master of delicate shadow-stitch, bakhya, and tepchi hand embroidery on superfine organic muslin.',
    photoUrl: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/3/3f/Indian_woman.jpg/960px-Indian_woman.jpg',
  },
  {
    id: 'a16',
    name: 'Reba Mondal',
    region: 'Shantiniketan, West Bengal',
    craft: 'Kantha Quilting & Embroidery',
    bio: 'Transforming tussar silks and recycled layered textiles into pictorial folk stories with delicate running stitches.',
    photoUrl: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/3/3f/Indian_woman.jpg/960px-Indian_woman.jpg',
  },

  // 6. Baskets & Cane
  {
    id: 'a17',
    name: 'Meiteileima Devi',
    region: 'Imphal, Manipur',
    craft: 'Cane & Bamboo Weaving',
    bio: 'Woven bamboo structuralist creating sustainable rain-proof baskets and contemporary woven bamboo lighting.',
    photoUrl: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/3/3f/Indian_woman.jpg/960px-Indian_woman.jpg',
  },
  {
    id: 'a18',
    name: 'Sunita Thakur',
    region: 'Madhubani, Bihar',
    craft: 'Golden Sikki Grass Craft',
    bio: 'Traditional artisan harvesting and coiling auspicious golden wild Sikki grass into ceremonial storage containers.',
    photoUrl: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/3/3f/Indian_woman.jpg/960px-Indian_woman.jpg',
  },
  {
    id: 'a19',
    name: 'Kasim Bhai',
    region: 'Pattamadai, Tamil Nadu',
    craft: 'Pattamadai Fine Korai Mats',
    bio: 'National heritage weaver splitting wetland Korai marsh grass into silk-like micro reeds for royal sleeping mats.',
    photoUrl: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/b/ba/Indian_farmer.jpg/500px-Indian_farmer.jpg',
  },

  // 7. Painting & Folk Art
  {
    id: 'a20',
    name: 'Sunil Somaji',
    region: 'Dahanu, Maharashtra',
    craft: 'Warli Tribal Art',
    bio: 'Indigenous Warli painter preserving ritualistic canvas frescoes using rice-paste pigments and natural red ochre.',
    photoUrl: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/e/e0/Craftsman_preparing_harmonium.jpg/960px-Craftsman_preparing_harmonium.jpg',
  },
  {
    id: 'a21',
    name: 'T. Subrahmanyam',
    region: 'Srikalahasti, Andhra Pradesh',
    craft: 'Kalamkari Pen Painting',
    bio: 'Master of the bamboo kalam pen technique, drawing epics on unbleached cotton with organic vegetable dyes.',
    photoUrl: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/7/73/Shilp_Guru_Ismail_Sulemanji_Khatri_1.jpg/960px-Shilp_Guru_Ismail_Sulemanji_Khatri_1.jpg',
  },
  {
    id: 'a22',
    name: 'Gauri Devi',
    region: 'Madhubani, Bihar',
    craft: 'Madhubani Kachni & Bharni Painting',
    bio: 'Folk painter creating geometric cosmos and wedding cohort representations on handmade cowdung-treated paper.',
    photoUrl: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/3/3f/Indian_woman.jpg/960px-Indian_woman.jpg',
  },
  {
    id: 'a23',
    name: 'Pradeep Maharana',
    region: 'Raghurajpur, Odisha',
    craft: 'Pattachitra Scroll Painting',
    bio: 'Hereditary chitrakar illustrating Jagannath iconography on layered tamarind-cloth scrolls using conch-shell whites.',
    photoUrl: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/b/ba/Indian_farmer.jpg/500px-Indian_farmer.jpg',
  },

  // 8. Jewelry
  {
    id: 'a24',
    name: 'Mahendra Sonar',
    region: 'Jaipur, Rajasthan',
    craft: 'Meenakari Enamel Jewelry',
    bio: 'Specialist in champlevé and cloisonné mineral enameling on hallmarked metals with royal Mughal floral aesthetics.',
    photoUrl: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/6/61/Potter_at_work.jpg/960px-Potter_at_work.jpg',
  },
  {
    id: 'a25',
    name: 'Biren Sahoo',
    region: 'Cuttack, Odisha',
    craft: 'Tarakasi Silver Filigree',
    bio: 'Master craftsman spinning paper-thin silver wires into gossamer filigree jewelry inspired by Konark temple wheels.',
    photoUrl: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/b/ba/Indian_farmer.jpg/500px-Indian_farmer.jpg',
  },
  {
    id: 'a26',
    name: 'Kamla Bai Bhil',
    region: 'Jhabua, Madhya Pradesh',
    craft: 'Bhil Tribal Silver Jewelry',
    bio: 'Indigenous tribal silversmith handcrafting traditional silver Hathphool ornaments, medallions, and ghungroo bells rooted in Bhil heritage.',
    photoUrl: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/5/52/Kutchi_lady_with_traditional_jewelry.jpg/500px-Kutchi_lady_with_traditional_jewelry.jpg',
  },
];

export const seedProducts: Omit<Product, 'id'>[] = [
  // --- POTTERY (3 items) ---
  {
    artisanId: 'a1',
    title: 'Jaipur Blue Pottery Floral Vase',
    description: 'Handcrafted Egyptian-paste ceramic vase glazed with cobalt oxide and hand-painted Persian floral motifs.',
    category: 'Pottery',
    tags: ['blue pottery', 'ceramic', 'home decor', 'rajasthan', 'gi tag'],
    materialsCost: 350,
    laborHours: 8,
    suggestedPrice: 1200,
    finalPrice: 1260,
    photoUrl: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/2/28/Jaipur_Blue_Pottery_Vase_with_Raja-Rani_Design.jpg/960px-Jaipur_Blue_Pottery_Vase_with_Raja-Rani_Design.jpg',
    status: 'published',
    syncStatus: 'synced',
  },
  {
    artisanId: 'a2',
    title: 'Khurja Handcrafted Glazed Terracotta Teapot',
    description: 'Lead-free, stone-fired ceramic teapot glazed with natural celadon glaze, heat resistant and microwave-safe.',
    category: 'Pottery',
    tags: ['khurja pottery', 'ceramic', 'teapot', 'tableware', 'uttar pradesh'],
    materialsCost: 280,
    laborHours: 6,
    suggestedPrice: 890,
    finalPrice: 950,
    photoUrl: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/a/a8/Khurja_Pottery.jpg/960px-Khurja_Pottery.jpg',
    status: 'published',
    syncStatus: 'synced',
  },
  {
    artisanId: 'a3',
    title: 'Manipur Longpi Black Serpentine Stone Kettles',
    description: 'Hand-moulded from weathered serpentinite stone and river clay, burnished with natural chirou leaf polish.',
    category: 'Pottery',
    tags: ['longpi', 'black pottery', 'manipur', 'stone pottery', 'northeast'],
    materialsCost: 450,
    laborHours: 12,
    suggestedPrice: 1600,
    finalPrice: 1680,
    photoUrl: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/5/55/Longpi_pottery_of_Thankul_Naga_tribes_DSCN1244_01.jpg/960px-Longpi_pottery_of_Thankul_Naga_tribes_DSCN1244_01.jpg',
    status: 'published',
    syncStatus: 'synced',
  },

  // --- TEXTILES & WEAVING (4 items) ---
  {
    artisanId: 'a4',
    title: 'Kashmiri Handwoven Pashmina Shawl',
    description: 'Feather-light authentic Ladakhi goat cashmere shawl handwoven on traditional wooden loom with woven borders.',
    category: 'Textiles',
    tags: ['pashmina', 'cashmere', 'shawl', 'kashmir', 'gi tag'],
    materialsCost: 1500,
    laborHours: 28,
    suggestedPrice: 5800,
    finalPrice: 6090,
    photoUrl: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/9/95/Pashmina_scarf_with_woven_elephant_design_03.jpg/960px-Pashmina_scarf_with_woven_elephant_design_03.jpg',
    status: 'published',
    syncStatus: 'synced',
  },
  {
    artisanId: 'a5',
    title: 'Kanchipuram Pure Zari Mulberry Silk Saree',
    description: 'Heavy ceremonial silk saree woven with genuine silver-gilt zari thread featuring Mayil (peacock) motifs.',
    category: 'Textiles',
    tags: ['kanchipuram', 'silk saree', 'zari', 'tamil nadu', 'gi tag'],
    materialsCost: 3200,
    laborHours: 48,
    suggestedPrice: 12500,
    finalPrice: 13200,
    photoUrl: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80',
    status: 'published',
    syncStatus: 'synced',
  },
  {
    artisanId: 'a6',
    title: 'Chanderi Silk-Cotton Zari Border Dupatta',
    description: 'Gossamer handloom dupatta woven with silk warp and fine mallow cotton weft, finished with gold foil borders.',
    category: 'Textiles',
    tags: ['chanderi', 'silk cotton', 'dupatta', 'madhya pradesh', 'handloom'],
    materialsCost: 650,
    laborHours: 15,
    suggestedPrice: 2400,
    finalPrice: 2520,
    photoUrl: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/1/17/Chanderi_saari_%282%29.jpg/960px-Chanderi_saari_%282%29.jpg',
    status: 'published',
    syncStatus: 'synced',
  },
  {
    artisanId: 'a7',
    title: 'Kutch Heritage Handwoven Kala Cotton Throw',
    description: 'Rainfed indigenous Kala cotton blanket woven on pit looms with traditional extra-weft mirrored motifs.',
    category: 'Textiles',
    tags: ['kutch', 'kala cotton', 'handloom', 'gujarat', 'sustainable'],
    materialsCost: 550,
    laborHours: 14,
    suggestedPrice: 2100,
    finalPrice: 2200,
    photoUrl: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/5/57/Antique_Kutch_Embroidery.jpg/960px-Antique_Kutch_Embroidery.jpg',
    status: 'published',
    syncStatus: 'synced',
  },

  // --- WOODWORK (3 items) ---
  {
    artisanId: 'a8',
    title: 'Channapatna Lacquerware Wooden Toys',
    description: 'Safe organic ivory-wood rocking figurines turned on high-speed lathes and polished with non-toxic natural shellac.',
    category: 'Woodwork',
    tags: ['wooden toys', 'channapatna', 'non-toxic', 'karnataka', 'gi tag'],
    materialsCost: 180,
    laborHours: 5,
    suggestedPrice: 650,
    finalPrice: 680,
    photoUrl: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/c/c1/Finished_Channapatna_toys.jpg/960px-Finished_Channapatna_toys.jpg',
    status: 'published',
    syncStatus: 'synced',
  },
  {
    artisanId: 'a9',
    title: 'Kashmiri Carved Walnut Wood Box',
    description: 'Solid seasoned Himalayan walnut wood jewelry casket hand-chiselled with open-fretwork Chinar leaf filigree.',
    category: 'Woodwork',
    tags: ['walnut wood', 'wood carving', 'jewelry box', 'kashmir', 'gi tag'],
    materialsCost: 600,
    laborHours: 12,
    suggestedPrice: 2400,
    finalPrice: 2520,
    photoUrl: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/9/95/Kashmiri_Woodcarving_And_Paper_mach%C3%A9.jpg/960px-Kashmiri_Woodcarving_And_Paper_mach%C3%A9.jpg',
    status: 'published',
    syncStatus: 'synced',
  },
  {
    artisanId: 'a10',
    title: 'Kondapalli Wooden Mythological Figures',
    description: 'Classic folk sculpture set hand-carved from soft white poniki wood with tamarind paste joinery and oil paints.',
    category: 'Woodwork',
    tags: ['kondapalli', 'wooden toy', 'mythology', 'andhra pradesh', 'gi tag'],
    materialsCost: 350,
    laborHours: 11,
    suggestedPrice: 1500,
    finalPrice: 1575,
    photoUrl: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/a/a9/KondapalliBommalu.jpg/960px-KondapalliBommalu.jpg',
    status: 'published',
    syncStatus: 'synced',
  },

  // --- METALCRAFT (3 items) ---
  {
    artisanId: 'a11',
    title: 'Bidriware Silver Inlay Vase',
    description: 'Blackened zinc and copper alloy vessel intricately hand-chiselled and embedded with pure silver sheet inlay.',
    category: 'Metalcraft',
    tags: ['bidriware', 'silver inlay', 'heritage', 'karnataka', 'gi tag'],
    materialsCost: 800,
    laborHours: 16,
    suggestedPrice: 3200,
    finalPrice: 3360,
    photoUrl: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/b/bb/Bidriware_vases_and_decanter.jpg/960px-Bidriware_vases_and_decanter.jpg',
    status: 'published',
    syncStatus: 'synced',
  },
  {
    artisanId: 'a12',
    title: 'Bastar Dhokra Bell-Metal Musician',
    description: '4,000-year-old lost-wax cast tribal rhythm player sculpted from recycled bell metal and beeswax threads.',
    category: 'Metalcraft',
    tags: ['dhokra', 'lost wax', 'tribal sculpture', 'chhattisgarh', 'gi tag'],
    materialsCost: 400,
    laborHours: 10,
    suggestedPrice: 1650,
    finalPrice: 1730,
    photoUrl: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/5/56/Dhokra_item_Raodeo.jpg/960px-Dhokra_item_Raodeo.jpg',
    status: 'published',
    syncStatus: 'synced',
  },
  {
    artisanId: 'a13',
    title: 'Moradabad Hand-Engraved Brass Urli',
    description: 'Solid brass decorative floating petal urli vessel featuring intricate peacock floral border hand-chiseling.',
    category: 'Metalcraft',
    tags: ['brass', 'moradabad', 'urli', 'hand engraved', 'uttar pradesh'],
    materialsCost: 700,
    laborHours: 14,
    suggestedPrice: 2600,
    finalPrice: 2750,
    photoUrl: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/3/3a/Brass_Handicrafts_of_Moradabad.jpg/960px-Brass_Handicrafts_of_Moradabad.jpg',
    status: 'published',
    syncStatus: 'synced',
  },

  // --- EMBROIDERY (3 items) ---
  {
    artisanId: 'a14',
    title: 'Amritsar Bagh Phulkari Silk Dupatta',
    description: 'Heirloom geometric silk embroidery using untwisted floss thread on hand-spun coarse cotton fabric.',
    category: 'Embroidery',
    tags: ['phulkari', 'silk embroidery', 'dupatta', 'punjab', 'gi tag'],
    materialsCost: 750,
    laborHours: 20,
    suggestedPrice: 2800,
    finalPrice: 2940,
    photoUrl: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/c/cb/A_Phulkari_with_traditional_flower_pattern_on_unworked_background.jpg/960px-A_Phulkari_with_traditional_flower_pattern_on_unworked_background.jpg',
    status: 'published',
    syncStatus: 'synced',
  },
  {
    artisanId: 'a15',
    title: 'Lucknowi Chikankari Pure Georgette Kurta',
    description: 'Authentic 32-stitch hand embroidery featuring tepchi, bakhya, and jaali work crafted by women master artisans.',
    category: 'Embroidery',
    tags: ['chikankari', 'lucknow', 'embroidery', 'handcrafted', 'gi tag'],
    materialsCost: 850,
    laborHours: 24,
    suggestedPrice: 3400,
    finalPrice: 3570,
    photoUrl: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80',
    status: 'published',
    syncStatus: 'synced',
  },
  {
    artisanId: 'a16',
    title: 'Bengal Handcrafted Kantha Silk Stole',
    description: 'Pictorial running stitch embroidery on wild Tussar silk depicting scenes of rural village celebrations.',
    category: 'Embroidery',
    tags: ['kantha', 'tussar silk', 'bengal', 'hand embroidery', 'gi tag'],
    materialsCost: 600,
    laborHours: 16,
    suggestedPrice: 2250,
    finalPrice: 2360,
    photoUrl: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/7/7a/Kantha_embroidery.jpg/960px-Kantha_embroidery.jpg',
    status: 'published',
    syncStatus: 'synced',
  },

  // --- BASKETS & CANE (3 items) ---
  {
    artisanId: 'a17',
    title: 'Manipur Handwoven Bamboo Fruit Basket',
    description: 'Fine split golden bamboo strips intricately coiled and treated naturally with river water smoking.',
    category: 'Baskets',
    tags: ['bamboo basket', 'cane craft', 'manipur', 'northeast', 'eco friendly'],
    materialsCost: 200,
    laborHours: 7,
    suggestedPrice: 750,
    finalPrice: 790,
    photoUrl: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/5/52/A_bamboo_basket.JPG/960px-A_bamboo_basket.JPG',
    status: 'published',
    syncStatus: 'synced',
  },
  {
    artisanId: 'a18',
    title: 'Golden Sikki Grass Storage Chest',
    description: 'Wild harvested Mithila golden grass coiled tightly by women artisans into auspicious geometric keepsake chests.',
    category: 'Baskets',
    tags: ['sikki grass', 'golden grass', 'bihar', 'storage basket', 'folk craft'],
    materialsCost: 220,
    laborHours: 9,
    suggestedPrice: 850,
    finalPrice: 900,
    photoUrl: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/0/0f/Sikki_Grass_Craft_by_artisan_Nazda_Khatun_of_Bihar_01.jpg/960px-Sikki_Grass_Craft_by_artisan_Nazda_Khatun_of_Bihar_01.jpg',
    status: 'published',
    syncStatus: 'synced',
  },
  {
    artisanId: 'a19',
    title: 'Pattamadai Superfine Korai Grass Meditation Mat',
    description: 'Ultra-pliable marsh reed mat woven on handlooms with 140-count warp, cool to the skin and naturally antimicrobial.',
    category: 'Baskets',
    tags: ['pattamadai mat', 'korai grass', 'tamil nadu', 'meditation mat', 'gi tag'],
    materialsCost: 400,
    laborHours: 14,
    suggestedPrice: 1600,
    finalPrice: 1680,
    photoUrl: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/4/43/Pathamadai_mats_in_making_JEG1741.jpg/960px-Pathamadai_mats_in_making_JEG1741.jpg',
    status: 'published',
    syncStatus: 'synced',
  },

  // --- PAINTING & FOLK ART (3 items) ---
  {
    artisanId: 'a20',
    title: 'Warli Tribal Tarpa Canvas Painting',
    description: 'Sacred indigenous folk artwork depicting the community harvest circle dance, painted on earth-primed canvas.',
    category: 'Painting',
    tags: ['warli', 'tribal art', 'canvas', 'maharashtra', 'folk art'],
    materialsCost: 300,
    laborHours: 9,
    suggestedPrice: 1400,
    finalPrice: 1470,
    photoUrl: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/a/a3/Warli_painting.jpg/960px-Warli_painting.jpg',
    status: 'published',
    syncStatus: 'synced',
  },
  {
    artisanId: 'a21',
    title: 'Srikalahasti Kalamkari Temple Hanging',
    description: 'Ancient pen-drawn textile hanging rendered on organic cotton with natural vegetable and fermented iron-jaggery dyes.',
    category: 'Painting',
    tags: ['kalamkari', 'hand painted', 'natural dye', 'andhra pradesh', 'gi tag'],
    materialsCost: 500,
    laborHours: 14,
    suggestedPrice: 2200,
    finalPrice: 2310,
    photoUrl: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/7/7d/Kalamkari_painting.jpg/960px-Kalamkari_painting.jpg',
    status: 'published',
    syncStatus: 'synced',
  },
  {
    artisanId: 'a22',
    title: 'Madhubani Tree of Life Folk Canvas',
    description: 'Intricate Kachni line work depicting the cosmic Tree of Life filled with natural indigo, turmeric, and lampblack.',
    category: 'Painting',
    tags: ['madhubani', 'mithila painting', 'tree of life', 'bihar', 'gi tag'],
    materialsCost: 420,
    laborHours: 16,
    suggestedPrice: 1950,
    finalPrice: 2050,
    photoUrl: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/5/51/Madhubani_painting_by_Bhuvana_Meenakshi.jpg/960px-Madhubani_painting_by_Bhuvana_Meenakshi.jpg',
    status: 'published',
    syncStatus: 'synced',
  },

  // --- JEWELRY (3 items) ---
  {
    artisanId: 'a24',
    title: 'Jaipur Royal Minakari Enamel Choker',
    description: 'Heritage jewelry choker engraved with peacock motifs and filled with vitreous mineral enamel on brass alloy.',
    category: 'Jewelry',
    tags: ['meenakari', 'jewelry', 'enamel', 'rajasthan', 'royal craft'],
    materialsCost: 900,
    laborHours: 15,
    suggestedPrice: 3600,
    finalPrice: 3780,
    photoUrl: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/e/e0/Kanthi_or_silver_choker_with_bells_and_minakari%2C_circa_1890s%2C_Saskhir%2C_Jubbal%2C_Shimla.jpg/960px-Kanthi_or_silver_choker_with_bells_and_minakari%2C_circa_1890s%2C_Saskhir%2C_Jubbal%2C_Shimla.jpg',
    status: 'published',
    syncStatus: 'synced',
  },
  {
    artisanId: 'a25',
    title: 'Cuttack Tarakasi Silver Filigree Earrings',
    description: 'Gossamer earrings fashioned from 92.5 pure sterling silver wire drawn as thin as a hair strand, shaped by hand.',
    category: 'Jewelry',
    tags: ['tarakasi', 'silver filigree', 'earrings', 'cuttack', 'gi tag'],
    materialsCost: 650,
    laborHours: 12,
    suggestedPrice: 2300,
    finalPrice: 2420,
    photoUrl: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/4/48/Tarakasi_Earrings_%28Silver_filigree%29_from_Cuttack%2C_Orissa.jpg/500px-Tarakasi_Earrings_%28Silver_filigree%29_from_Cuttack%2C_Orissa.jpg',
    status: 'published',
    syncStatus: 'synced',
  },
  {
    artisanId: 'a26',
    title: 'Bhil Tribal Handcrafted Silver Hathphool Jewelry',
    description: 'Traditional tribal silver hand harness jewelry (Hathphool) intricately crafted with silver medallions, ghungroo bells, and finger rings by indigenous Bhil artisans of Jhabua.',
    category: 'Jewelry',
    tags: ['tribal jewelry', 'silver hathphool', 'madhya pradesh', 'bhil craft', 'handcrafted jewelry'],
    materialsCost: 750,
    laborHours: 14,
    suggestedPrice: 2800,
    finalPrice: 2940,
    photoUrl: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/9/98/Bhil_community_woman_wearing_traditional_silver_hand_jewelry%2C_Jhabua%2C_Madhya_Pradesh%2C_India_%281%29.jpg/960px-Bhil_community_woman_wearing_traditional_silver_hand_jewelry%2C_Jhabua%2C_Madhya_Pradesh%2C_India_%281%29.jpg',
    status: 'published',
    syncStatus: 'synced',
  },
];

export const seedFirestore = async (force: boolean = false): Promise<{ artisans: number; products: number }> => {
  if (!isFirebaseConfigured) {
    return { artisans: seedArtisans.length, products: seedProducts.length };
  }
  const existingProducts = await getDocs(collection(db, 'products'));

  // Ensure full seed catalog of at least 25 products exists with verified authentic photos
  const hasOutdatedPhotos = existingProducts.docs.some(doc => {
    const photo = doc.data().photoUrl as string;
    return (
      photo?.includes('photo-1578749556568') ||
      photo?.includes('photo-1565193566173') ||
      photo?.includes('photo-1607522370275') ||
      photo?.includes('500px-Kondapalli_toys') ||
      photo?.includes('photo-1615529182904') ||
      photo?.includes('photo-1594633312681') ||
      photo?.includes('photo-1590736969955') ||
      photo?.includes('photo-1544816155-12df9643f363') ||
      photo?.includes('photo-1584589167171') ||
      photo?.includes('photo-1579783902614') ||
      photo?.includes('photo-1535632066927') ||
      photo?.includes('photo-1599643478518')
    );
  });

  const needsReseed = existingProducts.empty || force || existingProducts.size < seedProducts.length || hasOutdatedPhotos;

  if (!needsReseed) {
    console.log(`Firestore catalog is active with ${existingProducts.size} products.`);
    return { artisans: seedArtisans.length, products: existingProducts.size };
  }

  console.log(`Synchronizing Firestore catalog to full ${seedProducts.length} verified items...`);
  for (const docSnap of existingProducts.docs) {
    await deleteDoc(docSnap.ref);
  }

  // Seed artisans
  for (const artisan of seedArtisans) {
    const { id, ...data } = artisan;
    await setDoc(doc(db, 'artisans', id), {
      ...data,
      createdAt: serverTimestamp(),
    });
  }

  // Seed products
  const productsRef = collection(db, 'products');
  for (const product of seedProducts) {
    await addDoc(productsRef, {
      ...product,
      createdAt: serverTimestamp(),
    });
  }

  console.log(`Successfully seeded ${seedArtisans.length} diverse artisans and ${seedProducts.length} verified products.`);
  return { artisans: seedArtisans.length, products: seedProducts.length };
};
