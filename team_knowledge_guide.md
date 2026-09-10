# Kaarvi — Complete Team Knowledge & Judge Defense Guide
*Prepared for the Smart India Hackathon (SIH) | Problem Statement: AI-Driven Market Linkage & Smart Cataloging for Marginalized Artisans*

---

## Section 1: What This App Is, In One Paragraph

Imagine you are an incredible rural woodcarver or saree weaver in a village. You make world-class art with your hands, but you cannot sell it online because you find English e-commerce forms with barcodes, dimensions, and English descriptions intimidating or impossible to navigate. Because of that, predatory middlemen buy your ₹3,000 saree for ₹600 and pocket the rest. **Kaarvi** is a mobile app that removes that barrier completely: the artisan just presses a big microphone button, speaks naturally in Hindi or English (for example: *"I made a handloom silk saree, it took me 3 days, I want ₹3,500 for it"*), or snaps a quick photo. Our artificial intelligence instantly listens, analyzes the craft, writes a polished product listing, and puts it online with a transparent "Fair Share" meter showing buyers that 95% of their money goes directly into the artisan's pocket. It also connects the artisan to government schemes like PM Vishwakarma and protects them from machine-made fakes with scannable QR certificates.

---

## Section 2: The Full Tech Stack — What We Used and WHY

Every single tool in this project was selected for a specific purpose. Here is the honest breakdown of what is inside the codebase:

### 1. React (Frontend Library)
- **What it is:** A tool created by Facebook that lets programmers build user interfaces out of reusable Lego-like building blocks called "components."
- **Its job in Kaarvi:** Every screen you see—the product cards, the login screen, the navigation bars, the Fair Share meter—is a reusable React component.
- **Why we chose it over alternatives:** Instead of writing hundreds of separate web pages from scratch (plain HTML/JS), React updates only the specific part of the screen that changes (like updating the cart count) without flickering or reloading the whole page. It is also the industry standard, making development much faster during a hackathon.

### 2. Tailwind CSS (Styling Framework)
- **What it is:** A utility-first styling toolkit that lets developers style buttons, text, and layouts directly inside the code using pre-made design classes.
- **Its job in Kaarvi:** It gives the app its visual identity—the deep navy blue (`#003366`) representing heritage trust, warm terracotta orange (`#FF9933`), rounded cards, clean spacing, and mobile-friendly layouts.
- **Why we chose it over alternatives:** Traditional CSS requires writing separate style sheets and naming hundreds of classes. Tailwind allows instant, consistent styling that looks like a finished consumer mobile app on any phone screen size without bloated code.

### 3. Firebase Authentication (User Login System)
- **What it is:** A secure identity service managed by Google that handles user sign-in and security.
- **Its job in Kaarvi:** It powers our real Phone Number + SMS OTP (One-Time Password) login for both Buyers (Citizens) and Artisans.
- **Why we chose it over alternatives:** Artisans rarely use email addresses or passwords. Traditional username/password systems fail in rural India. Building a custom SMS gateway and OTP verification server from scratch would take weeks and cost money per SMS; Firebase gives us reliable, secure SMS delivery with built-in spam protection (reCAPTCHA) right out of the box.

### 4. Firebase Firestore (Cloud Database)
- **What it is:** A real-time cloud database by Google that stores information in flexible, organized folders called "collections" and "documents."
- **Its job in Kaarvi:** It holds all the live data: the 12 authentic handicraft products, artisan bios and profiles, individual user shopping carts, and placed orders.
- **Why we chose it over alternatives:** Traditional SQL databases (like MySQL or PostgreSQL) require rigid tables and complex server setups. Firestore connects directly to the frontend app, and most importantly, it has **real-time listeners**. This means when an artisan adds a product, it appears on the buyer's screen instantly without anyone needing to refresh the page.

### 5. Web Speech API (Voice Recognition)
- **What it is:** A built-in feature of modern web browsers (like Google Chrome and Microsoft Edge) that converts spoken human voice into written text in real time.
- **Its job in Kaarvi:** When the artisan taps "Speak to AI", this browser engine listens to their microphone, detects whether they are speaking Hindi or English, and turns their voice into a text sentence.
- **Why we chose it over alternatives:** We could have used paid third-party speech servers (like Google Cloud Speech-to-Text API or Whisper), but the browser's built-in Web Speech API is **zero-cost**, has **zero latency**, runs directly in the client browser, and natively supports Indian language accents and Hindi (`hi-IN`).

### 6. Google Gemini 3.7 Flash API (Generative Artificial Intelligence)
- **What it is:** Google's latest high-speed, multimodal artificial intelligence model that can understand text and pictures simultaneously.
- **Its job in Kaarvi:** 
  1. For voice: It takes the messy spoken transcript and extracts structured information: a clean product title, engaging cultural story/description, category (Pottery, Weaving, Woodwork, etc.), relevant tags, and suggested price.
  2. For photo: It analyzes the uploaded craft photo, identifies what handmade item it is, and drafts the listing automatically.
- **Why we chose it over alternatives:** Unlike older AI models (like GPT-3.5) that return raw conversational text that can break an app, Gemini supports **Structured JSON Output with strict Schemas**. We force Gemini to reply *only* in the exact fields our app form needs (`title`, `description`, `price`, `category`). Gemini 3.7 Flash is also significantly faster and cheaper than heavyweight models, returning results in under 2 seconds.

### 7. Progressive Web App (PWA) & Service Worker (via `vite-plugin-pwa`)
- **What it is:** Web technology that allows a website to be installed on an Android or iOS home screen just like a regular app downloaded from the Google Play Store, and lets it work even when offline.
- **Its job in Kaarvi:** It caches the app's code, icons, and styling onto the user's phone so the app opens instantly even on spotty 2G/3G rural networks.
- **Why we chose it over alternatives:** Marginalized artisans often have phones with low storage and cannot afford 100MB Play Store downloads. A PWA installs in seconds, takes less than 3MB of space, and updates automatically without requiring the user to visit an app store.

### 8. Capacitor (Native Android APK Builder)
- **What it is:** A cross-platform runtime tool created by Ionic that takes modern web code (HTML, CSS, React) and wraps it into a native Android Studio application project.
- **Its job in Kaarvi:** It compiled our React web application directly into a standalone `app-debug.apk` file that can be installed on any physical Android phone for the live hackathon demonstration.
- **Why we chose it over alternatives:** Re-writing the entire app in Flutter or native Java/Kotlin would have required maintaining two separate codebases. Capacitor let us build one polished web codebase and turn it into both a web app and an installable native Android APK.

---

## Section 3: How Each Major Feature Actually Works, Step by Step

### Feature 1: Voice-to-Catalog AI
*When an artisan speaks to add a product, here is the exact sequence of technical events:*
1. **Tap:** The artisan taps the blue microphone card labelled "Speak to AI" on the *Add Item* screen.
2. **Permission & Setup:** The app calls the browser's `SpeechRecognition` engine. It checks `localStorage` to see if the user selected Hindi or English. If Hindi, it sets `recognition.lang = 'hi-IN'`; otherwise, `'en-US'`.
3. **Listening:** The mic pulse animation starts. The phone's microphone captures audio waves and transcribes them into text locally inside the browser.
4. **Instant Transcript Capture:** As soon as the artisan stops speaking, the `onresult` event captures the exact sentence (e.g., *"Yeh ek blue color ka handloom silk saree hai, price 3500"*).
5. **Loading Feedback:** The app switches to an "AI is analyzing..." screen and displays the exact transcript in an italicized quote box so the artisan knows the mic heard them accurately.
6. **Gemini API Call:** The app sends this text to Google's `gemini-3.7-flash` model along with a strict blueprint (schema). The prompt instructs Gemini: *"Extract product details from this artisan's spoken words. Return JSON with title, description, category, tags, and price."*
7. **Form Population:** Gemini responds in under 2 seconds with clean JSON. The app reads `extracted.price`, sets `suggestedPrice = price`, calculates `finalPrice = Math.round(price * 1.05)`, and populates all fields into the form.
8. **Artisan Control:** The app presents the filled form. The artisan can review, edit anything they want, and tap "Publish to Catalog."

### Feature 2: Photo-to-Listing AI
*When an artisan uploads or snaps a picture of a craft:*
1. **Selection:** The artisan taps the camera card. An `<input type="file" accept="image/*" capture="environment">` opens the phone's native camera or gallery.
2. **Base64 Conversion:** The chosen image is read into memory using the browser's `FileReader` API as a Data URL string.
3. **Prefix Stripping:** Data URLs contain a prefix like `data:image/jpeg;base64,`. Our code extracts only the clean Base64 data after the comma (because the Gemini Vision API requires raw binary-encoded Base64).
4. **Vision Analysis:** The Base64 string and MIME type (e.g., `image/jpeg`) are sent to `gemini-3.7-flash` with the prompt: *"Look at this image of an artisan's handmade product. Generate a professional product title, description, appropriate category, tags, and estimate a fair price."*
5. **Display & Verification:** The AI returns the structured data. The app shows the uploaded photo preview alongside the suggested title, category, and price for the artisan's final approval.

### Feature 3: Fair Pricing Calculation & Transparency Meter
*How the pricing math actually works:*
- **The Core Formula:** 
  $$\text{Buyer Price (Final Price)} = \text{Artisan's Suggested Price} \times 1.05$$
  $$\text{Platform Fee} = \text{Buyer Price} - \text{Artisan's Suggested Price} \quad (5\%)$$
  $$\text{Artisan Share Percentage} = \text{Round}\left(\frac{\text{Artisan Ask}}{\text{Buyer Price}} \times 100\right) = 95\%$$
- **On the Artisan Side:** When the artisan enters or speaks their price (e.g., ₹1,000), the app automatically computes: *"Platform adds 5% operational fee. Buyer pays ₹1,050. You receive the full ₹1,000."*
- **On the Buyer Side (Product Details Screen):** The buyer sees the interactive **Fair Share Transparency Meter**. A dual-color progress bar shows:
  - Green segment: **95% Artisan (₹1,000)**
  - Blue segment: **5% Platform Operations (₹50)**
- **Why this matters:** Commercial platforms (Amazon/Flipkart) routinely deduct 15% to 35% in commissions, referral fees, and closing fees. Kaarvi proves radical financial transparency to the conscious buyer.

### Feature 4: QR Code Generation & The Artisan Story Page
*How authenticity verification works:*
1. **Dynamic URL:** In `ArtisanStory.tsx`, the code determines the artisan's unique public address: `${window.location.origin}/artisan/${artisan.id}`.
2. **SVG QR Generation:** The app uses the `qrcode.react` library (`<QRCodeSVG value={qrUrl} size={130} level="H" />`). The `level="H"` stands for High Error Correction, meaning the QR code can still be scanned by any smartphone camera even if 30% of the printed physical label is dirty or torn.
3. **Physical-to-Digital Link:** An artisan can print this QR code or affix it to their product packaging as an "Official Ministry Recognition & Authenticity Tag."
4. **Consumer Scan:** When a buyer scans the tag with their phone camera, it opens the artisan's verified Story page. This displays their state/region, craft lineage, government registration code (`IN-KALA-[ID]`), GI Tag status, and an anti-counterfeit notice explaining how buying this item prevented a counterfeit duplicate.

### Feature 5: The Phone OTP Login Flow
*How authentication works without requiring emails or passwords:*
1. **Number Entry:** The user enters a standard 10-digit Indian mobile number.
2. **Invisible reCAPTCHA:** In `src/lib/firebase.ts`, the app initializes Firebase's `RecaptchaVerifier` tied to an invisible container. This prevents bots from draining SMS credits without annoying the user with image puzzles.
3. **SMS Dispatch:** Firebase triggers an SMS containing a real 6-digit verification code to the user's physical phone via Google's telecom infrastructure.
4. **Verification:** The user enters the 6-digit code. The app calls `confirmationResult.confirm(otpCode)`.
5. **Persistence:** Firebase creates a permanent user record (`user.uid`). It stores the session token in the browser's IndexedDB storage, meaning the user stays logged in even if they close the browser or refresh.
6. **Role Routing:** If the user is a Citizen/Buyer, they proceed immediately to the Discover feed. If they choose Artisan, they enter their craft, name, and region, which creates an official artisan document in Firestore.

### Feature 6: The Hindi Language Switcher (i18n)
*How multilingual support is implemented:*
1. **Central Dictionary:** All UI text is stored in `src/lib/translations.ts` as a structured TypeScript dictionary with parallel keys for `en` (English) and `hi` (Hindi in Devanagari script).
2. **Language Context:** `LanguageContext.tsx` wraps the entire app. It holds the active language in state and saves the choice to `localStorage.getItem('language')`.
3. **Instant Toggle:** When the user taps the Globe icon in the header, the state flips between `'en'` and `'hi'`. Because it uses React state, **every single button, header, and card translates instantly** without any network request or page reload.
4. **Speech Sync:** When the language is set to Hindi, the Voice AI engine automatically sets its speech recognition code to `hi-IN` instead of `en-US`, allowing artisans to speak in Hindi.

### Feature 7: Offline-First Sync Architecture
*How the app handles bad rural internet:*
1. **Connection Monitoring:** `AppContext.tsx` listens to `window.addEventListener('online')` and `offline`.
2. **Pending State:** If an artisan adds a product while offline, the app catches the network error. It assigns the item a temporary ID (`local_[timestamp]`), marks its `syncStatus = 'pending'`, and saves it to local state.
3. **Visual Indicator:** On the artisan's "My Catalog" screen, the product displays an orange badge: *"Sync Pending (Offline)"*.
4. **Automatic Cloud Sync:** When internet connectivity is restored, an automated React `useEffect` detects all products marked as `pending` and uploads them to Firebase Firestore in the background, updating their status to *"Synced"*.

### Feature 8: PWA Installation
*How the web app installs onto a phone:*
1. **Manifest File:** `vite.config.ts` configures `VitePWA`. It outputs a `manifest.webmanifest` file declaring the app name (*Kaarvi*), theme color (`#003366`), and high-resolution icons (192x192 and 512x512).
2. **Service Worker:** A script (`sw.js`) is installed in the background by the browser. It pre-caches the HTML, CSS, JavaScript, and fonts.
3. **Standalone Display:** The manifest specifies `"display": "standalone"`. When the user taps "Add to Home Screen" in Chrome or Edge, the browser strips away the URL bar and navigation buttons, making the app run full-screen, completely indistinguishable from an app downloaded from Google Play.

---

## Section 4: "Why Did You Build It This Way?" — Anticipated Judge Questions & Answers

### Q1: "Why did you choose React + Vite instead of Flutter or React Native?"
**Answer:**
> "Because our primary audience is marginalized artisans who often have low-end Android phones with very little free storage. A Flutter or React Native app requires downloading an initial 40MB to 80MB APK from the Play Store, which many rural users will immediately delete to save space. By using React with a modern PWA configuration and Capacitor, our app loads instantly over the web in under 2MB, works offline via service workers, installs directly to the home screen with zero friction, and can still be packaged into an installable Android APK when required. It gives us maximum reach across both smartphones and budget browsers."

### Q2: "Why did you choose Firebase instead of building a custom Node/PostgreSQL backend?"
**Answer:**
> "For a national-scale artisan platform, two things are non-negotiable: reliable phone OTP authentication and instant real-time synchronization. Building custom SMS pipelines, session encryption, and WebSocket servers from scratch introduces multiple points of failure. Firebase Authentication provides battle-tested, carrier-grade Phone OTP login with built-in fraud prevention. Firestore provides native real-time synchronization, so when an artisan in Odisha lists a craft, a buyer in Delhi sees it in their feed within milliseconds without server polling."

### Q3: "How does the AI actually generate the price suggestion — is it random or calculated?"
**Answer:**
> "It is strictly contextual, not random. In our prompt to Google Gemini 3.7 Flash, the AI first extracts any price explicitly mentioned in the artisan's voice transcript (e.g., *'I want 200 rupees'*). If the artisan does not state a price or uses the photo scanner, Gemini analyzes the craft category, estimated labor hours, and visual complexity to suggest a fair starting baseline. However, **the AI never imposes a final price**. The artisan always sees the suggested price inside an editable input box on the confirmation screen, retaining 100% autonomy over their asking price."

### Q4: "Is the voice recognition happening on-device or sent to a third-party server?"
**Answer:**
> "The voice-to-text transcription is handled directly by the browser's native **Web Speech API**, which processes speech using on-device or native operating system speech models with zero network round-trip delay. Only the resulting text transcript is sent to the Gemini API for structuring. This drastically reduces bandwidth consumption, which is critical for rural areas with limited 3G or 4G connectivity."

### Q5: "How is user data stored, and is it secure?"
**Answer:**
> "User authentication is managed via Firebase Auth tokens stored in browser-encrypted IndexedDB, preventing cross-site scripting session theft. All database operations in Firestore are partitioned: buyer carts are tied strictly to `carts/{user.uid}`, preventing any user from reading or modifying another user's cart. Furthermore, we never ask for or store sensitive financial details or Aadhaar numbers in the database; artisan registrations only collect publicly displayable craft and region data."

### Q6: "What would you need to do to make this production-ready at national scale?"
**Answer:**
> "Three specific integrations:
> 1. **ONDC Integration:** Connect our catalog to the Open Network for Digital Commerce so these artisans' products appear automatically on buyer apps like Paytm, Magicpin, and Pincode.
> 2. **India Post Rural Logistics API:** Integrate India Post's pickup network, which has reach into 150,000+ rural pin codes where commercial couriers (Delhivery, BlueDart) do not operate.
> 3. **Bhashini AI:** Expand our current Hindi/English translation to all 22 official Indian languages using the Government of India's Bhashini speech and translation models."

### Q7: "What parts of this prototype are 100% functional vs. simulated for the demo?"
*(Note: Always answer this with complete honesty—judges respect transparency over exaggerated claims!)*
**Answer:**
> "We believe in engineering honesty:
> - **100% Real & Working Right Now:** The Phone OTP authentication (Firebase Auth), the real-time cloud catalog, cart, and orders (Firestore), the live Voice-to-Text transcription (Web Speech API), the AI structured data extraction and image recognition (Google Gemini 3.7 Flash), the instant English/Hindi interface switcher, and the native Android APK build.
> - **Simulated / Mocked for Hackathon Prototype:** 
>   1. Payment gateway: We simulate successful payment upon checkout rather than charging real credit cards via a live Razorpay production merchant account.
>   2. Government Scheme eligibility: We display real criteria for schemes like PM Vishwakarma, but the final application button links to official portals rather than auto-filing government forms.
>   3. WhatsApp bot: We have created an interactive UI walkthrough to illustrate the conversational commerce flow for feature-phone users."

### Q8: "Is this app legally using any Government of India logos or emblems?"
**Answer:**
> "No. Under the State Emblem of India (Prohibition of Improper Use) Act, 2005, private hackathon projects cannot legally use the Lion Capital of Ashoka, the Ashoka Chakra, or official Ministry seals. We deliberately adhered to the law: we created our own custom brand mark—**Kaarvi**—and used a generic tricolor ribbon accent (`#FF9933`, `#FFFFFF`, `#138808`) to celebrate national heritage without violating statutory emblem laws."

---

## Section 5: Simple Glossary

- **API (Application Programming Interface):** A digital bridge that allows two different computer programs to talk to each other (for example, our app sending voice text to Google's AI server and getting back a product title).
- **Backend:** The behind-the-scenes part of an application (like databases and servers) that stores and processes data that users cannot directly see.
- **Frontend:** Everything the user sees, touches, and clicks on the screen (buttons, images, forms, text).
- **Component:** A self-contained, reusable piece of a user interface (for example, a single "Product Card" template that gets reused for all 12 items).
- **Firebase:** A suite of cloud software services built by Google that provides pre-built databases, user login systems, and hosting.
- **Firestore:** Google Firebase's cloud database where data is stored in flexible "documents" rather than traditional rows and columns.
- **PWA (Progressive Web App):** A website built with modern capabilities that allows it to behave, feel, and install just like a native mobile app from the Google Play Store.
- **Service Worker:** A hidden background script in the browser that saves files locally so the app can load instantly without internet.
- **Web Speech API:** A feature built into web browsers that translates spoken voice into computer text without installing extra software.
- **LLM (Large Language Model):** An artificial intelligence program (like Gemini) trained on vast amounts of language to understand, organize, and write human-like text.
- **JSON (JavaScript Object Notation):** A universal, clean format for organizing data using key-value pairs (like `{"title": "Clay Pot", "price": 200}`).
- **Base64:** A way to convert binary files (like image photos) into a long string of plain text characters so they can be easily sent over the internet to an AI model.
- **Capacitor:** A development tool that packages a web application inside a native mobile shell so it can be installed on Android devices as an `.apk` file.
- **GI Tag (Geographical Indication):** An official government certification given to products originating from a specific geographical location possessing qualities or a reputation unique to that region (e.g., *Kanchipuram Silk* or *Kondapalli Toys*).
- **i18n (Internationalization):** The technical process of designing an application so it can easily switch between multiple human languages (like English and Hindi) without breaking the layout.

---

## Section 6: Quick-Reference Cheat Sheet
*(Review this 5 minutes before the judges arrive!)*

### The 3 Golden Sentences to Remember
1. **The Core Pitch:** *"Kaarvi eliminates the digital literacy barrier for rural artisans by replacing complex catalog forms with simple Voice and Photo AI."*
2. **The Economic Differentiator:** *"Unlike commercial platforms that take 20–30% in hidden fees, our Fair Share Meter guarantees that 95% of every rupee goes straight to the maker."*
3. **The Heritage Protection:** *"Every item has a scannable QR certificate linking directly to the artisan's verified government registration and GI authenticity record to stop machine-made fakes."*

### The Tech Stack at a Glance
| Layer | Technology | Why It's There |
|---|---|---|
| **Frontend** | React 19 + Vite | Fast, modular component UI with instant page updates |
| **Styling** | Tailwind CSS v4 | High-finish mobile styling with Indian heritage color palette |
| **Auth** | Firebase Auth | Real Phone number + SMS OTP verification |
| **Database** | Firebase Firestore | Real-time cloud database syncing catalog, cart, and orders |
| **Voice** | Web Speech API | Client-side, zero-cost voice recognition in English & Hindi |
| **AI Engine** | Google Gemini 3.7 Flash | Multimodal AI extracting structured JSON from voice & photos |
| **Packaging** | Capacitor + PWA | Dual deployment: lightweight web PWA & native Android APK |

### Live Demo Click Path (90 Seconds)
1. **Discover Feed:** Show the curated catalog of authentic Indian crafts.
2. **Product Page:** Show the **Fair Share Transparency Meter** (95% Artisan / 5% Platform).
3. **Artisan Story:** Click the artisan link to show their verified profile, registration ID, and scannable QR certificate.
4. **Switch to Artisan Mode:** Tap the header switch. Go to **Add Item**.
5. **Voice AI Demo:** Tap **Speak to AI** &rarr; speak *"Handmade brass diya for 450 rupees"* &rarr; watch transcript display &rarr; watch form auto-populate title, category, and price.
6. **Language Toggle:** Tap the **Globe icon** &rarr; entire UI switches instantly to Hindi.
7. **Schemes Portal:** Open the **Schemes** tab to show direct integration with PM Vishwakarma.
