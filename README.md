# SAHAYINI — Safety • Support • Digital Access

An inclusive, bilingual/multilingual digital support platform for students and citizens across India, focused on emergency safety, digital empowerment, authentic government schemes, and cyber scam awareness.

---

## 🌟 Key Features

1. **Welcome Screen:**
   - Official SAHAYINI circular emblem and wordmark.
   - Slogan: *"Small steps create big changes."*
   - Sub-slogan: *"Together we build a safer, smarter and more inclusive India."*
   - Native 8-language switcher:
     - **Tamil (தமிழ்)**
     - **English (English)**
     - **Hindi (हिन्दी)**
     - **Telugu (తెలుగు)**
     - **Marathi (मराठी)**
     - **Malayalam (മലയാളം)**
     - **Gujarati (ગુજરાતી)**
     - **Kannada (ಕನ್ನಡ)**
   - Instant Theme & Accessibility selector (Light, Dark, High-Contrast).

2. **Authentication:**
   - Login & Sign-up screens with real client-side validation.
   - Role selection (Student, Woman, General Public, Senior Citizen).
   - State & District selection.
   - Quick one-click Demo Student & Demo Citizen sign-in.
   - Private local session persistence with encrypted storage.

3. **Dashboard:**
   - Personalized regional greeting (`Vanakkam`, `Namaste`, `Namaskaram`, etc.).
   - Emergency SOS Card with instant `Call 112` button.
   - Government Schemes Card with saved counter.
   - Ask SAHAYINI AI Card (Text & Voice).
   - Learn Card (Digital Skills & Quizzes).
   - Scam Protection Card (Message/Link Risk Checker).
   - Real-time GPS Location sharing generator for WhatsApp & SMS.

4. **Emergency SOS & Safety Hub:**
   - Single-tap National Emergency `112` call trigger.
   - 24x7 verified official emergency helplines:
     - Women in Distress (`1091` / `181`)
     - Cyber Crime Financial Fraud (`1930`)
     - Childline (`1098`)
     - Ambulance (`108`)
     - Senior Citizens (`14567`)
     - Tele-MANAS (`14416`)
   - Trusted Contacts manager (add, call, SMS, remove).
   - Live GPS Geolocation with device permission and WhatsApp/SMS alert formatting.
   - Step-by-step guidance on Zero FIR, All Women Police Stations (AWPS), and the Cyber Fraud Golden Hour.
   - **Honest policy:** Clearly clarifies that SAHAYINI never claims to contact police automatically.

5. **Government Schemes & Scholarships:**
   - Authentic, verified schemes database:
     - PM-USHA (Pradhan Mantri Uchchatar Shiksha Abhiyan)
     - Tamil Nadu Post Matric Scholarship Scheme
     - Beti Bachao Beti Padhao (BBBP)
     - National Scholarship Portal (NSP) Central Sector Scheme
     - Pudhumai Penn Scheme (Moovalur Ramamirtham Ammaiyar Higher Education Assurance Scheme)
     - PM Vishwakarma Yojana
     - Ayushman Bharat (PM-JAY)
     - PM-KISAN Samman Nidhi
     - Sukanya Samriddhi Yojana (SSY)
   - Real-time search by name, category, or keyword.
   - Multi-category filter pills (Central Govt, Tamil Nadu Govt, Education, Scholarships, Women, Employment, Health, Agriculture, Housing, Financial Assistance).
   - Comprehensive detail modal with document checklists, eligibility, and direct official `.gov.in` portal links.
   - Bookmark / Save scheme for offline access.

6. **Offline Resilience & PWA Service Worker (Low-Connectivity Strategy):**
   - **Service Worker Precaching (`vite-plugin-pwa` + Workbox):** Application shell, scripts, styles, Google Fonts, and static assets are precached for 100% offline access.
   - **Precached Safety Information & Emergency Helplines:** Complete database of 11 pan-India emergency helplines (`112`, `1091`, `1930`, `181`, `1098`, `108`, `14567`, `14416`) with one-tap cellular dialer that works without internet data.
   - **Precached Government Schemes:** Complete catalog of all welfare schemes, documents checklists, eligibility criteria, and offline application procedures precached on device with instant offline search.
   - **No-Data SMS GPS Dispatcher:** Generates pre-formatted emergency SMS alerts with GPS coordinates that can be dispatched through cellular towers without mobile internet pack.
   - **5 Offline Emergency Safety Playbooks:** Step-by-step offline checklists for physical threats/stalking, domestic violence safe escape, cyber fraud "Golden Hour" 1930 bank freeze, Skype digital arrest extortion defense, and offline USSD banking (`*99#`).
   - **In-App PWA Install UI:** Native browser install prompt for Android/Chromium/Desktop and guided home-screen install instructions for iOS Safari.
   - **Offline Safety Kit Modal & Status Banner:** Global offline indicator banner with cache sync health manager and storage footprint metrics.

7. **Ask SAHAYINI (AI Chat & Voice Assistant):**
   - Interactive chat interface matching reference design.
   - Real backend integration with Gemini `gemini-2.5-flash` via `@google/genai` on Express server.
   - Resilient domain knowledge engine fallback for offline environments.
   - Native Web Speech API microphone speech recognition with real-time editable transcript before sending.
   - Text-to-Speech `[Listen]` audio narration on responses in 8 Indian languages.
   - Dedicated Voice Assistant side panel with pulsing rings, state indicators (Listening, Processing, Speaking), and voice controls (Start, Stop, Cancel).

7. **Learn (Digital Literacy & Online Safety):**
   - Matches reference design:
     - Top orange banner with student illustration wearing headphones.
     - [Lessons] [Quizzes] [Progress] tabs.
     - 5 topic cards: Digital Basics, Online Safety, UPI & Payments, Government Services, More.
     - 4 featured lesson cards with `[Listen]` and `[Read]` buttons.
     - Orange `Prefer to listen? Start Voice Learning` card.
     - Interactive reader view with speech synthesis read-along.
     - Functional quizzes with immediate explanations and scoring.
     - Progress dashboard tracking completed lessons and achievement badges.

8. **Scam Protection & Cyber Defense:**
   - Message and URL Risk Checker (analyzes phishing, fake lottery, electricity cut-off threats, fake APK downloads).
   - Common Scam encyclopedia (Digital Arrest, QR Code reverse fraud, Telegram job tasks, predatory loan apps).
   - Direct reporting links to National Cyber Crime Helpline (`1930`), `cybercrime.gov.in`, and DoT Chakshu portal (`sancharsaathi.gov.in`).

9. **Profile, Settings & Accessibility:**
   - User profile details.
   - 8-language switcher.
   - Theme toggle (Light, Dark, High-Contrast).
   - Font size scaler (Default A, Large A+, Extra Large A++).
   - Offline storage indicator & demo data reset.

---

## 🛠️ Tech Stack

- **Frontend:** React 19, TypeScript, Tailwind CSS v4, Lucide React icons.
- **Backend / API:** Express.js, `@google/genai` TypeScript SDK (`gemini-2.5-flash`).
- **Speech & Audio:** Web Speech API (`SpeechRecognition` & `SpeechSynthesis`).
- **Storage:** HTML5 LocalStorage for offline cached lessons, schemes, contacts, and quizzes.

---

## 🚀 Running the Project

### Prerequisites
- Node.js (v18+)
- npm or bun

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Create or verify `.env`:
```env
# Optional: Set your Gemini API key for live AI generation.
# If omitted, SAHAYINI uses its built-in rule-based knowledge engine.
GEMINI_API_KEY="your-gemini-api-key-here"

PORT=3000
```

### 3. Start Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Run Core Unit Tests
```bash
npx tsx src/utils/core.test.ts
```

### 5. Build for Production
```bash
npm run build
npm start
```

---

## 🔒 Security & Privacy Notice

- **No API Keys in Client Bundles:** Gemini API calls are strictly processed server-side in `server.ts`.
- **Private Data Storage:** All user profile information, emergency contacts, and saved schemes remain private to the user's browser localStorage.
- **Emergency Dispatch:** SAHAYINI initiates telephone calls via direct device dialers (`tel:112`) and provides GPS links via user-initiated SMS/WhatsApp; it does not claim to dispatch police automatically.
