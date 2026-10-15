import { SCHEMES_DATA, SCHEMES_LOCALIZATION, LocalizedSchemeDetails, getLocalizedScheme } from '../data/schemesData';
import { LanguageCode, SchemeItem, EmergencyContact } from '../types';
import { translations } from '../i18n/translations';
import { getDefaultOfflineAnswer } from './offlineChatAnswers';

export interface EmergencyHelpline {
  id: string;
  number: string;
  title: string;
  category: 'national' | 'women' | 'cyber' | 'child' | 'medical' | 'senior' | 'mental_health';
  description: string;
  tollFree: boolean;
  priority: number;
  availableHours: string;
  smsAvailable?: boolean;
}

export interface OfflineSafetyPlaybook {
  id: string;
  title: string;
  category: 'threat' | 'domestic' | 'cyber' | 'digital_arrest' | 'offline_sos';
  summary: string;
  goldenRule: string;
  immediateSteps: string[];
  offlineActions: string[];
  importantHelplines: string[];
}

export interface CachedSchemeRecord {
  id: string;
  title: string;
  nativeTitles?: Record<LanguageCode, string>;
  category: string;
  summary: string;
  benefits: string;
  eligibility: string[];
  documentsRequired: string[];
  applicationProcess: string[];
  sourceName: string;
  officialUrl: string;
  deadline?: string;
  stateName?: string;
  localized?: Partial<Record<LanguageCode, LocalizedSchemeDetails>>;
  cachedAt: string;
}

export interface OfflineCacheMetadata {
  isReady: boolean;
  lastUpdated: string;
  schemesCount: number;
  helplinesCount: number;
  playbooksCount: number;
  cacheSizeBytes: number;
  offlineReady: boolean;
  version: string;
}

export const EMERGENCY_HELPLINES: EmergencyHelpline[] = [
  {
    id: 'hl-112',
    number: '112',
    title: 'National Emergency Response Support System (ERSS)',
    category: 'national',
    description: 'Single emergency pan-India number for Police, Fire, Ambulance, and Disaster management.',
    tollFree: true,
    priority: 1,
    availableHours: '24x7 All Days',
    smsAvailable: true,
  },
  {
    id: 'hl-1091',
    number: '1091',
    title: 'Women Helpline (Women in Distress)',
    category: 'women',
    description: 'Immediate police protection, mobile patrol dispatch, and emergency rescue for women.',
    tollFree: true,
    priority: 2,
    availableHours: '24x7 All Days',
  },
  {
    id: 'hl-181',
    number: '181',
    title: 'Women Helpline (Domestic Abuse & One-Stop Crisis)',
    category: 'women',
    description: 'Legal aid, psycho-social counseling, emergency shelter accommodation, and medical aid.',
    tollFree: true,
    priority: 3,
    availableHours: '24x7 All Days',
  },
  {
    id: 'hl-1930',
    number: '1930',
    title: 'Citizen Financial Cyber Fraud Reporting Helpline',
    category: 'cyber',
    description: 'Instant reporting to freeze bank accounts during the golden hour after online scam theft.',
    tollFree: true,
    priority: 4,
    availableHours: '24x7 All Days',
  },
  {
    id: 'hl-1098',
    number: '1098',
    title: 'Childline India (Ministry of WCD)',
    category: 'child',
    description: 'Nationwide emergency outreach service for children in need of care and protection.',
    tollFree: true,
    priority: 5,
    availableHours: '24x7 All Days',
  },
  {
    id: 'hl-108',
    number: '108',
    title: 'Emergency Medical & Trauma Ambulance Service',
    category: 'medical',
    description: 'Free emergency ambulance with trained paramedics for accidents and medical crises.',
    tollFree: true,
    priority: 6,
    availableHours: '24x7 All Days',
  },
  {
    id: 'hl-102',
    number: '102',
    title: 'Janani Shishu Suraksha Karyakram (Maternity Ambulance)',
    category: 'medical',
    description: 'Free dedicated transport for pregnant women and sick neonates to public hospitals.',
    tollFree: true,
    priority: 7,
    availableHours: '24x7 All Days',
  },
  {
    id: 'hl-14567',
    number: '14567',
    title: 'Elder Line (National Helpline for Senior Citizens)',
    category: 'senior',
    description: 'Free information, guidance, emotional support, and elder abuse rescue intervention.',
    tollFree: true,
    priority: 8,
    availableHours: '8:00 AM - 8:00 PM',
  },
  {
    id: 'hl-14416',
    number: '14416',
    title: 'Tele-MANAS (National Mental Health Helpline)',
    category: 'mental_health',
    description: 'Toll-free 24x7 multilingual tele-mental health counseling and distress guidance.',
    tollFree: true,
    priority: 9,
    availableHours: '24x7 All Days',
  },
  {
    id: 'hl-100',
    number: '100',
    title: 'Police Control Room (PCR)',
    category: 'national',
    description: 'Local police control room dispatch for urgent law and order emergencies.',
    tollFree: true,
    priority: 10,
    availableHours: '24x7 All Days',
  },
  {
    id: 'hl-1076',
    number: '1076',
    title: 'Chief Minister Public Helpline',
    category: 'national',
    description: 'Grievance redressal and government citizen support escalation.',
    tollFree: true,
    priority: 11,
    availableHours: '24x7 All Days',
  },
];

export const OFFLINE_SAFETY_PLAYBOOKS: OfflineSafetyPlaybook[] = [
  {
    id: 'pb-threat',
    title: 'Immediate Threat / Stalking / Eve-Teasing Emergency Protocol',
    category: 'threat',
    summary: 'Clear step-by-step physical security checklist when feeling threatened or followed in public or secluded places.',
    goldenRule: 'Move immediately towards populated, brightly-lit commercial areas. Never head into isolated streets or dark shortcuts.',
    immediateSteps: [
      'Enter the nearest open shop, bank ATM booth, pharmacy, petrol bunk, or metro station immediately.',
      'Loudly announce your situation to surrounding staff or shopkeepers: "I need help, someone is following me."',
      'Call 112 or 1091 directly. You do not need internet data or smartphone apps for dialer calls.',
      'Trigger an offline emergency SMS with your live GPS location to your trusted emergency contacts.',
    ],
    offlineActions: [
      'Keep your phone charged and enable location toggles even when offline; GPS chips receive satellite signals without cellular internet.',
      'If trapped in a vehicle or auto-rickshaw, note the registration plate and scream out the window at traffic signals.',
      'Pre-program 112 as a speed-dial key on feature phones and smartphones.',
    ],
    importantHelplines: ['112', '1091', '100'],
  },
  {
    id: 'pb-domestic',
    title: 'Domestic Violence & Urgent Shelter Protocol',
    category: 'domestic',
    summary: 'Confidential emergency exit protocol for women facing physical or emotional domestic violence.',
    goldenRule: 'Your physical safety comes first. Do not attempt to negotiate while physical violence is active or escalating.',
    immediateSteps: [
      'Call 181 (Women in Distress) or 112. Both numbers are free and do not reflect on itemized prepaid receipts.',
      'Move towards an exit or room with access to outside doors; avoid bathrooms or kitchens where objects can cause harm.',
      'Contact the nearest One Stop Centre (OSC / Sakhi) located at district government hospitals for free confidential shelter.',
      'Have an emergency "Go-Bag" ready or know where critical documents (Aadhaar, bank passbook, certificates) are kept.',
    ],
    offlineActions: [
      'Memorize at least two trusted phone numbers of nearby neighbors or relatives.',
      'Local Protection Officers (under PWDVA Act) can be reached through the local Taluk/Panchayat office without fees.',
      'Free legal aid is guaranteed by DLSA (District Legal Services Authority) in every district court.',
    ],
    importantHelplines: ['181', '1091', '112'],
  },
  {
    id: 'pb-cyber',
    title: 'Cyber Financial Fraud "Golden Hour" Protocol',
    category: 'cyber',
    summary: 'Immediate action steps to freeze funds and block unauthorized debit transactions within 2 hours.',
    goldenRule: 'Dial 1930 immediately! The first 2 hours are the "Golden Hour" when banks can intercept stolen money before cash-out.',
    immediateSteps: [
      'Dial 1930 (Citizen Financial Cyber Fraud Reporting) immediately to trigger the Indian Cybercrime Coordination Centre (I4C) alert.',
      'Note down: Bank Account Number, Transaction UTR / Reference ID, Debit Amount, and Beneficiary UPI ID / Account Number.',
      'Call your bank’s toll-free customer care or SMS your bank’s emergency block code to freeze your ATM card and net banking.',
      'File an official report on cybercrime.gov.in as soon as you have stable connectivity.',
    ],
    offlineActions: [
      'Take instant screenshots or note down SMS transaction notifications before they get lost.',
      'Do NOT delete SMS messages, call logs, or WhatsApp chat threads with the scammer; they serve as legal evidence.',
      'Never send "reverse money" or pay fees to anyone claiming they can recover your money from the dark web.',
    ],
    importantHelplines: ['1930', '112'],
  },
  {
    id: 'pb-digital-arrest',
    title: 'Digital Arrest & Skype Fake Police Extortion Defense',
    category: 'digital_arrest',
    summary: 'How to protect yourself against fraudsters impersonating CBI, ED, Police, or Customs over video calls.',
    goldenRule: 'There is NO SUCH THING AS "DIGITAL ARREST" in Indian Law. Law enforcement NEVER interrogates citizens on Skype or WhatsApp.',
    immediateSteps: [
      'Disconnect the video or phone call immediately. You will NOT be arrested for hanging up on a scammer.',
      'Do not transfer money to any "RBI verification account" or "clearing escrow account". Government agencies never have such accounts.',
      'Report the caller’s phone number immediately to Chakshu portal (sancharsaathi.gov.in) and dial 1930.',
      'Inform your family members or visit your nearest local police station in person to verify.',
    ],
    offlineActions: [
      'Remember: Real police issue written summons under Section 41A of CrPC/BNSS. They never demand money for bail via UPI.',
      'Police officers in uniform showing fake ID cards on webcam is a standard syndicated scam tactic.',
      'Block the phone number and report it on WhatsApp/Truecaller.',
    ],
    importantHelplines: ['1930', '112', '100'],
  },
  {
    id: 'pb-offline-sos',
    title: 'Low-Connectivity SOS Protocol & Offline USSD Banking',
    category: 'offline_sos',
    summary: 'Emergency survival mechanisms when internet data (4G/5G) is completely unavailable or zero bars.',
    goldenRule: 'Cellular voice calls and standard SMS work over 2G networks even when internet data cannot load web pages.',
    immediateSteps: [
      'Dial 112 directly. 112 works even when your SIM has no balance or is connected to any available cell tower.',
      'Send emergency SMS to saved contacts with coordinates. Standard SMS does not require internet data.',
      'For emergency banking without internet, dial *99# (NUUP USSD code) on any phone to check balance or transfer funds.',
      'Use the cached SAHAYINI Scheme and Safety database directly from your device storage.',
    ],
    offlineActions: [
      'Enable GPS Location before sending SMS; mobile GPS satellites operate independently of cell towers.',
      'Save emergency contacts in local phone SIM memory, not only on cloud accounts.',
      'Keep your offline safety kit synced once every 30 days while connected to Wi-Fi.',
    ],
    importantHelplines: ['112', '1091', '1930'],
  },
];

const STORAGE_KEYS = {
  SAFETY_CACHE: 'sahayini_offline_safety_cache_v2',
  SCHEMES_CACHE: 'sahayini_offline_schemes_cache_v2',
  METADATA: 'sahayini_offline_metadata_v2',
  SAVED_SCHEMES: 'sahayini_saved_schemes',
  CONTACTS: 'sahayini_contacts',
};

const safeStorage = {
  getItem: (key: string): string | null => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        return window.localStorage.getItem(key);
      }
      if (typeof globalThis !== 'undefined' && globalThis.localStorage) {
        return globalThis.localStorage.getItem(key);
      }
    } catch {
      // ignore
    }
    return null;
  },
  setItem: (key: string, val: string): void => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(key, val);
        return;
      }
      if (typeof globalThis !== 'undefined' && globalThis.localStorage) {
        globalThis.localStorage.setItem(key, val);
        return;
      }
    } catch {
      // ignore
    }
  },
  removeItem: (key: string): void => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.removeItem(key);
        return;
      }
      if (typeof globalThis !== 'undefined' && globalThis.localStorage) {
        globalThis.localStorage.removeItem(key);
        return;
      }
    } catch {
      // ignore
    }
  },
};

class OfflineStorageManager {
  private metadata: OfflineCacheMetadata | null = null;

  constructor() {
    this.ensureInitialized();
  }

  /**
   * Ensures offline cache is populated on app initialization
   */
  public ensureInitialized(): void {
    try {
      const existingMeta = this.getMetadata();
      if (!existingMeta || !existingMeta.isReady) {
        this.precacheAllCriticalData();
      }
    } catch (err) {
      console.warn('Failed to initialize offline cache:', err);
    }
  }

  /**
   * Caches all schemes, safety helplines, playbooks, and localized content into local storage
   */
  public precacheAllCriticalData(force = false): OfflineCacheMetadata {
    const cachedSchemes: CachedSchemeRecord[] = SCHEMES_DATA.map((scheme) => {
      // Attach localization data for all 8 languages if available
      const locData: Partial<Record<LanguageCode, LocalizedSchemeDetails>> = {};
      const languages: LanguageCode[] = ['en', 'ta', 'hi', 'te', 'mr', 'ml', 'gu', 'kn'];
      languages.forEach((lang) => {
        locData[lang] = getLocalizedScheme(scheme, lang);
      });

      return {
        id: scheme.id,
        title: scheme.title,
        nativeTitles: scheme.nativeTitle,
        category: scheme.category,
        summary: scheme.summary,
        benefits: scheme.benefits,
        eligibility: scheme.eligibility,
        documentsRequired: scheme.documentsRequired,
        applicationProcess: scheme.applicationProcess,
        sourceName: scheme.sourceName,
        officialUrl: scheme.officialUrl,
        deadline: scheme.deadline,
        stateName: scheme.stateName,
        localized: locData,
        cachedAt: new Date().toISOString(),
      };
    });

    const safetyPayload = {
      helplines: EMERGENCY_HELPLINES,
      playbooks: OFFLINE_SAFETY_PLAYBOOKS,
      cachedAt: new Date().toISOString(),
    };

    const serializedSchemes = JSON.stringify(cachedSchemes);
    const serializedSafety = JSON.stringify(safetyPayload);

    try {
      safeStorage.setItem(STORAGE_KEYS.SCHEMES_CACHE, serializedSchemes);
      safeStorage.setItem(STORAGE_KEYS.SAFETY_CACHE, serializedSafety);
    } catch (storageError) {
      console.warn('localStorage quota reached or unavailable:', storageError);
    }

    const approxSize =
      (serializedSchemes.length + serializedSafety.length) * 2; // UTF-16 approx bytes

    const meta: OfflineCacheMetadata = {
      isReady: true,
      lastUpdated: new Date().toISOString(),
      schemesCount: cachedSchemes.length,
      helplinesCount: EMERGENCY_HELPLINES.length,
      playbooksCount: OFFLINE_SAFETY_PLAYBOOKS.length,
      cacheSizeBytes: approxSize,
      offlineReady: true,
      version: '2.0.0',
    };

    try {
      safeStorage.setItem(STORAGE_KEYS.METADATA, JSON.stringify(meta));
    } catch {
      // ignore
    }

    this.metadata = meta;
    return meta;
  }

  /**
   * Retrieves cache metadata
   */
  public getMetadata(): OfflineCacheMetadata | null {
    if (this.metadata) return this.metadata;
    try {
      const raw = safeStorage.getItem(STORAGE_KEYS.METADATA);
      if (raw) {
        this.metadata = JSON.parse(raw);
        return this.metadata;
      }
    } catch {
      return null;
    }
    return null;
  }

  /**
   * Retrieves all cached safety helplines
   */
  public getCachedHelplines(): EmergencyHelpline[] {
    try {
      const raw = safeStorage.getItem(STORAGE_KEYS.SAFETY_CACHE);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed.helplines && Array.isArray(parsed.helplines)) {
          return parsed.helplines;
        }
      }
    } catch {
      // Fallback to static
    }
    return EMERGENCY_HELPLINES;
  }

  /**
   * Retrieves all cached safety playbooks
   */
  public getCachedPlaybooks(): OfflineSafetyPlaybook[] {
    try {
      const raw = safeStorage.getItem(STORAGE_KEYS.SAFETY_CACHE);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed.playbooks && Array.isArray(parsed.playbooks)) {
          return parsed.playbooks;
        }
      }
    } catch {
      // Fallback to static
    }
    return OFFLINE_SAFETY_PLAYBOOKS;
  }

  /** Builds scheme records straight from the bundled static data (no storage needed). */
  private buildStaticSchemeRecords(): CachedSchemeRecord[] {
    return SCHEMES_DATA.map((s) => ({
        id: s.id,
        title: s.title,
        nativeTitles: s.nativeTitle,
        category: s.category,
        summary: s.summary,
        benefits: s.benefits,
        eligibility: s.eligibility,
        documentsRequired: s.documentsRequired,
        applicationProcess: s.applicationProcess,
        sourceName: s.sourceName,
        officialUrl: s.officialUrl,
        cachedAt: new Date().toISOString(),
      }));
  }

  /**
   * Retrieves cached government schemes with optional search and filter
   */
  public getCachedSchemes(options?: {
    query?: string;
    category?: string;
    language?: LanguageCode;
  }): CachedSchemeRecord[] {
    let list: CachedSchemeRecord[] = [];
    try {
      const raw = safeStorage.getItem(STORAGE_KEYS.SCHEMES_CACHE);
      if (raw) {
        list = JSON.parse(raw);
      }
    } catch {
      // Fallback by generating from static
      list = this.buildStaticSchemeRecords();
    }

    if (!list || list.length === 0) {
      this.precacheAllCriticalData();
      // Re-read the cache ONCE. (Previously this called getCachedSchemes() again, which recursed
      // forever whenever browser storage was unavailable, e.g. private mode / blocked / full storage.)
      try {
        const rawAfter = safeStorage.getItem(STORAGE_KEYS.SCHEMES_CACHE);
        list = rawAfter ? JSON.parse(rawAfter) : [];
      } catch {
        list = [];
      }
      if (!list || list.length === 0) {
        list = this.buildStaticSchemeRecords();
      }
    }

    if (!options) return list;

    const { query, category, language } = options;

    return list.filter((scheme) => {
      // Category filter
      if (category && category !== 'all' && scheme.category !== category) {
        return false;
      }

      // Query filter
      if (query && query.trim()) {
        const q = query.toLowerCase().trim();
        const localized = language && scheme.localized ? scheme.localized[language] : null;
        const titleMatch =
          scheme.title.toLowerCase().includes(q) ||
          (localized && localized.title.toLowerCase().includes(q)) ||
          (scheme.nativeTitles &&
            Object.values(scheme.nativeTitles).some((val) => val.toLowerCase().includes(q)));
        const summaryMatch =
          scheme.summary.toLowerCase().includes(q) ||
          (localized && localized.summary.toLowerCase().includes(q));
        const benefitsMatch =
          scheme.benefits.toLowerCase().includes(q) ||
          (localized && localized.benefits.toLowerCase().includes(q));
        const eligibilityMatch = scheme.eligibility.some((item) =>
          item.toLowerCase().includes(q)
        );
        const docsMatch = scheme.documentsRequired.some((item) =>
          item.toLowerCase().includes(q)
        );

        if (!titleMatch && !summaryMatch && !benefitsMatch && !eligibilityMatch && !docsMatch) {
          return false;
        }
      }

      return true;
    });
  }

  /**
   * Generates formatted SMS text for low-connectivity emergencies
   */
  public generateEmergencySms(
    coords: { lat: number; lng: number } | null,
    customMessage?: string
  ): { text: string; smsUri: string } {
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    let locationStr = 'Location: GPS Unavailable (Check Cellular Tower)';
    if (coords) {
      locationStr = `GPS Location: https://maps.google.com/?q=${coords.lat.toFixed(6)},${coords.lng.toFixed(6)} (Lat: ${coords.lat.toFixed(5)}, Lng: ${coords.lng.toFixed(5)})`;
    }

    const note = customMessage || 'I need immediate help! Please call me or dispatch emergency assistance.';
    const text = `🚨 EMERGENCY ALERT [SAHAYINI @ ${timestamp}]\n${note}\n${locationStr}\nHelpline: 112`;
    const encodedText = encodeURIComponent(text);
    const smsUri = `sms:?body=${encodedText}`;

    return { text, smsUri };
  }

  /**
   * Generates intelligent client-side responses from cached storage when offline
   */
  /**
   * Same on-device answer as before, plus a flag telling the caller whether a
   * topic-specific saved answer was found (matched = true) or only the generic
   * "what can I ask offline" text exists (matched = false).
   */
  public getOfflineChatResult(
    query: string,
    language: LanguageCode
  ): { text: string; matched: boolean } {
    const matched = this.matchOfflineChatTopic(query, language);
    if (matched !== null) return { text: matched, matched: true };
    return { text: this.getGenericOfflineChatText(), matched: false };
  }

  public getOfflineChatResponse(query: string, language: LanguageCode): string {
    return this.getOfflineChatResult(query, language).text;
  }

  private matchOfflineChatTopic(query: string, language: LanguageCode): string | null {
    const q = query.toLowerCase().trim();

    // Match the 20 starter questions exactly in the currently selected language.
    // Suggestions and saved answers share a stable index and this lookup is local.
    const normalizeQuestion = (value: string) => value
      .normalize('NFKC')
      .toLocaleLowerCase()
      .replace(/[’‘]/g, "'")
      .replace(/[?？!！.。]/g, '')
      .replace(/\s+/g, ' ')
      .trim();
    const normalizedQuery = normalizeQuestion(query);
    const suggestions = translations[language]?.ask?.suggestions || translations.en.ask.suggestions;
    const localizedIndex = suggestions.findIndex((suggestion) => normalizeQuestion(suggestion) === normalizedQuery);
    const englishIndex = translations.en.ask.suggestions.findIndex((suggestion) => normalizeQuestion(suggestion) === normalizedQuery);
    const starterIndex = localizedIndex >= 0 ? localizedIndex : englishIndex;
    if (starterIndex >= 0) {
      const savedAnswer = getDefaultOfflineAnswer(starterIndex, language);
      if (savedAnswer) return `💾 **[Offline saved answer]**\n\n${savedAnswer}`;
    }

    // 1. Scholarships & Government Schemes query
    if (
      q.includes('scholarship') ||
      q.includes('scheme') ||
      q.includes('yojana') ||
      q.includes('படிப்பக') ||
      q.includes('படிப்பு') ||
      q.includes('திட்டம்') ||
      q.includes('छात्रवृत्ति') ||
      q.includes('योजना') ||
      q.includes('స్కాలర్') ||
      q.includes('పథకం') ||
      q.includes('ಶಿಷ್ಯ') ||
      q.includes('ಯೋಜನೆ')
    ) {
      const cached = this.getCachedSchemes({ language }).slice(0, 3);
      if (cached.length > 0) {
        const list = cached
          .map((s, idx) => {
            const loc = s.localized ? s.localized[language] : null;
            const title = loc?.title || s.title;
            const benefits = loc?.benefits || s.benefits;
            return `${idx + 1}. **${title}**\n   - Benefits: ${benefits}\n   - Portal: ${s.officialUrl}`;
          })
          .join('\n\n');
        return `💾 **[Offline Cached Response] Verified Government Schemes:**\n\n${list}\n\n*Note: All details loaded directly from your device's offline cache. You can view full document requirements in the Schemes tab.*`;
      }
    }

    // 2. Emergency / SOS / Police query
    if (
      q.includes('sos') ||
      q.includes('emergency') ||
      q.includes('police') ||
      q.includes('help') ||
      q.includes('112') ||
      q.includes('ஆபத்து') ||
      q.includes('அவசர') ||
      q.includes('कांटेक्ट') ||
      q.includes('आपात')
    ) {
      const helplines = this.getCachedHelplines().slice(0, 5);
      const list = helplines.map((h) => `• **${h.number}** — ${h.title} (${h.availableHours})`).join('\n');
      return `🚨 **[Offline Cached Response] Immediate Emergency Helplines:**\n\n${list}\n\n*Zero Internet Required: You can dial any of these numbers directly through your phone dialer without 4G/5G mobile data.*`;
    }

    // 3. Scam / Fraud / Digital Arrest query
    if (
      q.includes('scam') ||
      q.includes('fraud') ||
      q.includes('digital arrest') ||
      q.includes('cyber') ||
      q.includes('மோசடி') ||
      q.includes('धोखा') ||
      q.includes('మోసం')
    ) {
      const playbooks = this.getCachedPlaybooks();
      const cyber = playbooks.find((p) => p.category === 'cyber') || playbooks[0];
      return `🛡️ **[Offline Cached Response] Cyber Defense Protocol:**\n\n**Golden Rule:** ${cyber.goldenRule}\n\n**Immediate Steps:**\n${cyber.immediateSteps.map((s, i) => `${i + 1}. ${s}`).join('\n')}\n\n*Helpline:* Dial **1930** immediately to report cyber financial theft within the golden hour.`;
    }

    // 4. UPI / Banking / Payment query
    if (q.includes('upi') || q.includes('payment') || q.includes('pin') || q.includes('money') || q.includes('பணம்')) {
      return `💳 **[Offline Cached Response] Safe Digital Payments & Offline Banking:**\n\n1. **Golden Rule:** Never enter your UPI PIN to RECEIVE money. UPI PIN is strictly used to debit funds.\n2. **Offline Banking Without Internet:** Dial **\*99\#** (NUUP USSD code) on any mobile phone to check bank balance or transfer funds over basic 2G network.\n3. **Financial Fraud Hotline:** Dial **1930** immediately if unauthorized transactions occur.`;
    }

    return null;
  }

  private getGenericOfflineChatText(): string {
    // General fallback (no topic-specific saved answer)
    return `📶 **[Offline Cached Response] SAHAYINI Knowledge Base:**\n\nYour device is currently operating in offline mode. All 15 government schemes, 11 emergency helplines, and 5 safety playbooks are precached locally on your device.\n\nTry asking about:\n• "Government scholarships & schemes"\n• "Emergency helpline numbers (112, 1091)"\n• "How to report cyber fraud (1930)"\n• "Offline banking via *99#"`;
  }

  /**
   * Clears and refreshes offline cache
   */
  public refreshCache(): OfflineCacheMetadata {
    try {
      safeStorage.removeItem(STORAGE_KEYS.SCHEMES_CACHE);
      safeStorage.removeItem(STORAGE_KEYS.SAFETY_CACHE);
      safeStorage.removeItem(STORAGE_KEYS.METADATA);
    } catch {
      // ignore
    }
    return this.precacheAllCriticalData(true);
  }
}

export const offlineStorage = new OfflineStorageManager();
