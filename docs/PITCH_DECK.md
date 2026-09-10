# SIH Pitch Deck Outline: Kaarvi

## 1. Problem
**The Marginalized Artisan's Dilemma**
- **Digital Literacy Barrier**: Traditional artisans cannot navigate complex e-commerce cataloging forms (SKUs, SEO descriptions, dimensions).
- **The Middleman Tax**: Unfair pricing models where intermediaries take up to 60-80% of the retail price.
- **Lost Heritage & Authenticity**: Counterfeit machine-made goods masquerading as handmade, diluting craft value and GI (Geographical Indication) tags.
- **Fragmented Market Access**: Government schemes exist (e.g., PM Vishwakarma), but awareness and onboarding remain extremely low at the grassroots level.

## 2. Solution Overview
**Kaarvi: The AI-Driven Bridge for Heritage Crafts**
A zero-barrier mobile application that leverages voice and vision AI to instantly digitize rural artisans, connect them directly to conscious buyers, and integrate them with supportive government schemes.

## 3. Core Innovation
**Zero-Friction Cataloging**
- **Voice-to-Catalog**: Artisans speak naturally in their native language (e.g., "I made a blue silk saree for 3500 rupees"). The app transcribes and uses AI to instantly generate a professional title, description, category, and price.
- **Photo-to-Listing**: Artisans snap a photo of their craft. Vision AI analyzes the image to automatically draft the product listing. No typing required.

## 4. Fair Share Transparency
**Building Trust Through Economics**
- Unlike massive marketplaces, every product features a "Fair Share Meter."
- Buyers see exactly where their money goes: e.g., 95% direct to the artisan, 5% platform operational fee.
- Empowers conscious consumerism and ensures artisans dictate their own worth.

## 5. Heritage & Authenticity
**Connecting the Maker to the Market**
- **Artisan Story Pages**: Every item links directly to the creator's profile, detailing their craft, heritage, and state.
- **GI Tag Distinction**: Highlighting registered Geographical Indications (e.g., Kanchipuram Silk, Kinnal Toys) to combat counterfeits and educate buyers.

## 6. Government Integration
**Schemes as a Feature, Not an Afterthought**
- **Citizen/Artisan Login**: Secure OTP-based authentication (fully functional).
- **Scheme Eligibility Engine**: Artisans can discover and apply for relevant government initiatives like PM Vishwakarma and specialized loans directly from their dashboard.

## 7. Accessibility Features
**Designed for the Next Billion Users**
- **Vernacular Support**: Instant English/Hindi toggle (with voice input adapting to Hindi automatically).
- **Offline-First Ready**: Packaged as a lightweight Android APK.
- **WhatsApp Fallback**: A conversational WhatsApp bot interface for feature-phone users who cannot use apps.

## 8. Tech Stack
**What Powers Kaarvi**
- **Frontend**: React.js, Tailwind CSS, Vite.
- **Mobile Wrapper**: Capacitor (compiles to native Android APK).
- **Backend & Auth**: Firebase Authentication (Phone OTP) and Firestore (Real-time NoSQL Database).
- **AI Integration**: Google Gemini 3.7 Flash (Text & Vision APIs) for catalog generation.
- **Native APIs**: Web Speech API for voice-to-text.

## 9. Prototype Transparency: What's Real vs. Simulated
**Honesty in Engineering**
- **Fully Functional (Real)**:
  - Phone OTP Login (Firebase Auth)
  - Real-time Product Catalog, Cart, and Order placement (Firestore)
  - Voice Transcription (Web Speech API) and AI generation (Gemini)
  - Photo Scanning AI (Gemini Vision)
  - English/Hindi UI translation toggle
- **Simulated / Seeded**:
  - The initial catalog of 12 items is seeded in the database (representing diverse Indian crafts).
  - Payments are simulated (no active Razorpay/gateway integration).
  - Scheme Eligibility is a static educational UI.
  - WhatsApp Bot is a UI mockup to demonstrate the feature-phone concept.

## 10. Impact & Scalability
**Post-Hackathon Vision**
- **ONDC Integration**: Connect Kaarvi's inventory directly to the Open Network for Digital Commerce.
- **Language Expansion**: Scale from Hindi/English to all 22 scheduled Indian languages using Bhashini.
- **Logistics Partnerships**: Integrate India Post for rural last-mile pickup and delivery.

---

# Live Demo Script (90 Seconds)

**[0:00 - 0:15] Buyer Experience: Discovery**
*Action: Open app, log in as Citizen, scroll the Discover feed.*
"Welcome to Kaarvi. We're browsing as a buyer. You can see a rich feed of authentic Indian crafts. I'll click on this Kinnal Wooden Toy."

**[0:15 - 0:30] Buyer Experience: Transparency & Heritage**
*Action: Scroll down the Product Details page to show the Fair Share meter, then click "View Artisan Story".*
"Here, the Fair Share Meter guarantees transparency—95% goes directly to the creator. If we click the Artisan Story, we connect with the human behind the craft, combating the flood of machine-made counterfeits."

**[0:30 - 0:45] Artisan Experience: Voice Cataloging**
*Action: Switch to Artisan Mode using the header toggle. Click 'Add Item'. Click 'Speak to AI'.*
"But how did this get here? Let's switch to Artisan Mode. For an artisan with low digital literacy, typing is a barrier. So, we built Voice-to-Catalog." *(Speak into mic: "I made a beautiful red clay pot, it took me 5 hours, I want 200 rupees for it".)*

**[0:45 - 1:00] Artisan Experience: AI Generation**
*Action: Wait for the AI loading screen to finish, revealing the populated form.*
"The app transcribes the speech locally, then Google Gemini AI instantly structures it into a professional listing—extracting the title, categorizing it as Pottery, and setting the price. The artisan just verifies and hits Publish."

**[1:00 - 1:15] Artisan Experience: Accessibility & Schemes**
*Action: Click the Language Toggle (globe icon) to switch to Hindi. Navigate to the 'Schemes' tab.*
"To ensure true accessibility, the entire UI toggles instantly to Hindi, and the voice AI adapts to Hindi input. Finally, we link artisans directly to government support through the built-in PM Vishwakarma scheme portal."

**[1:15 - 1:30] Conclusion**
*Action: Show the WhatsApp Demo screen.*
"And for artisans without smartphones, our WhatsApp bot concept allows them to catalog items via simple voice notes. Kaarvi is the AI-driven bridge for India's marginalized artisans. Thank you."

---

# Q&A Brief: Anticipated Questions & Answers

**Q: How is this different from Amazon Karigar / Flipkart Samarth / GeM?**
**A:** Those platforms are built for digitally savvy sellers; their onboarding requires GSTNs, complex forms, and SKU management, which immediately excludes marginalized artisans. Kaarvi is a *zero-barrier* platform. We use Voice and Vision AI to do the heavy lifting of cataloging, and our 5% platform fee (vs their 15-30%) ensures the artisan actually profits. We also focus heavily on the human story and GI authenticity, not just commoditized goods.

**Q: Is the AI actually working or is this mocked?**
**A:** It is fully functional. We are using the native browser Web Speech API for real-time transcription, and passing that text (or base64 image data from the camera) directly to the Google Gemini API to extract structured JSON (title, description, category, price). You can test it live right now.

**Q: How would you scale this to millions of artisans?**
**A:** Post-hackathon, we would integrate with ONDC (Open Network for Digital Commerce) to instantly broadcast the artisan's catalog across multiple buyer apps (Paytm, Pincode, etc.) rather than relying solely on our own buyer app. For logistics, we would integrate India Post APIs, as they are the only network with true last-mile reach in rural artisan clusters.

**Q: What happens if an artisan has no smartphone at all?**
**A:** We've designed a WhatsApp fallback concept. An artisan can simply send a voice note and a photo to a Kaarvi WhatsApp business number. The same Gemini backend processes the message and creates the listing. This bridges the gap for feature-phone users.

**Q: How do you prevent the AI from setting an unfair price?**
**A:** The AI does not strictly dictate the price; it *suggests* it based on what the artisan spoke (e.g., "I want 500 rupees") or estimates based on visual materials if no price is given. The artisan always sees a final "Verify Details" screen where they have ultimate control to edit the price before it goes live to the database.

**Q: Is this legally using any government emblems/logos?**
**A:** No, we are strictly complying with the State Emblem of India Act. We intentionally avoided using the Ashoka Chakra, actual Ministry logos, or official government seals. We designed a custom 'Kaarvi' brand mark and use generic tricolor accents to evoke national pride without infringing on legally protected IP.
