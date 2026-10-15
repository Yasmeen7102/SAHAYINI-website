import { LanguageCode } from '../types';

/**
 * Strings for the Complaint & FIR Support feature. Kept in their own file (like extraStrings.ts)
 * so the large existing translation file is untouched. Any key missing from a language falls back
 * to English. NOTE: non-English strings should be reviewed by a native speaker.
 * The generated complaint DRAFT itself is always written in English (see utils/complaintDraft.ts).
 */
export interface ComplaintStrings {
  sidebarLabel: string;
  cardTitle: string;
  cardDesc: string;
  cardButton: string;
  pageTitle: string;
  pageSubtitle: string;
  notYetSubmitted: string;
  disclaimerTitle: string;
  disclaimerBody: string;
  groupWomen: string;
  groupCyber: string;
  groupOther: string;
  chooseType: string;
  types: Record<string, string>;
  formTitle: string;
  incidentDate: string;
  incidentTime: string;
  location: string;
  locationHint: string;
  description: string;
  descriptionHint: string;
  optionalDetails: string;
  yourName: string;
  yourPhone: string;
  yourAddress: string;
  suspectDetails: string;
  witnesses: string;
  evidence: string;
  amountLost: string;
  transactionRef: string;
  generateDraft: string;
  requiredMissing: string;
  draftTitle: string;
  draftEditHint: string;
  preview: string;
  closePreview: string;
  copy: string;
  copied: string;
  print: string;
  save: string;
  saved: string;
  findPolice: string;
  findPoliceDesc: string;
  locating: string;
  searching: string;
  manualTitle: string;
  manualPlaceholder: string;
  manualSearch: string;
  officialTitle: string;
  portalLabel: string;
  helpline1930: string;
  emergency112: string;
  sosLinkTitle: string;
  sosLinkDesc: string;
  sosLinkButton: string;
}

const en: ComplaintStrings = {
  sidebarLabel: 'Complaint & FIR Support',
  cardTitle: 'Complaint & FIR Support',
  cardDesc: 'Prepare a complaint, find nearby police stations, and access official reporting services.',
  cardButton: 'Open Complaint Support →',
  pageTitle: 'Complaint & FIR Support',
  pageSubtitle: 'Prepare a complaint draft, find nearby police stations, and use official reporting services.',
  notYetSubmitted: 'Not Yet Submitted',
  disclaimerTitle: 'SAHAYINI does not file complaints or register FIRs',
  disclaimerBody:
    'Anything you prepare here is only a draft on your device. It has NOT been sent to the police or any portal. A complaint is submitted, and an FIR is registered, only when the police or an official portal confirms it to you (for example with an acknowledgement or FIR number). This is general help, not legal advice.',
  groupWomen: "Women's Safety",
  groupCyber: 'Cybercrime & Scams',
  groupOther: 'Other Complaints',
  chooseType: 'Choose the type of incident',
  types: {
    harassment: 'Harassment',
    stalking: 'Stalking',
    domestic_violence: 'Domestic violence',
    sexual_assault: 'Sexual assault',
    threats: 'Threats',
    dowry: 'Dowry-related harassment',
    upi_fraud: 'UPI fraud',
    bank_fraud: 'Bank fraud',
    shopping_scam: 'Online shopping scam',
    phishing: 'Phishing',
    fake_account: 'Fake account',
    cyberstalking: 'Cyberstalking',
    blackmail: 'Online blackmail',
    missing_person: 'Missing person',
    theft: 'Theft',
    physical_assault: 'Physical assault',
    property_damage: 'Property damage',
    other: 'Other incident',
  },
  formTitle: 'Complaint details',
  incidentDate: 'Date of incident',
  incidentTime: 'Approximate time (optional)',
  location: 'Place of incident',
  locationHint: 'Area, street, landmark, city / website or app name for online incidents',
  description: 'What happened',
  descriptionHint: 'Describe the incident in your own words: what, who, how, in order.',
  optionalDetails: 'Optional details',
  yourName: 'Your name',
  yourPhone: 'Your phone number',
  yourAddress: 'Your address',
  suspectDetails: 'Details of the person(s) involved, if known',
  witnesses: 'Witnesses, if any',
  evidence: 'Evidence you have (screenshots, messages, receipts, photos)',
  amountLost: 'Amount lost (₹), if any',
  transactionRef: 'Transaction / reference number(s), if any',
  generateDraft: 'Generate Complaint Draft',
  requiredMissing: 'Please choose an incident type and fill in the date, place and description.',
  draftTitle: 'Your complaint draft',
  draftEditHint: 'You can edit this text before you copy, print or save it.',
  preview: 'Preview',
  closePreview: 'Close preview',
  copy: 'Copy',
  copied: 'Copied',
  print: 'Print',
  save: 'Save',
  saved: 'Saved to this device and downloaded as a text file. It has not been submitted anywhere.',
  findPolice: 'Find Nearby Police Stations',
  findPoliceDesc: 'Uses your browser location (only if you allow it) and Google Maps. Nothing is sent to any police station.',
  locating: 'Getting your location…',
  searching: 'Searching…',
  manualTitle: 'Enter your location manually',
  manualPlaceholder: 'Area, locality, city or PIN code',
  manualSearch: 'Search in Google Maps',
  officialTitle: 'Official reporting services',
  portalLabel: 'National Cyber Crime Reporting Portal',
  helpline1930: 'Financial cyber fraud helpline: 1930',
  emergency112: 'Emergency: 112',
  sosLinkTitle: 'Need to report an incident?',
  sosLinkDesc: 'Prepare a complaint draft, find nearby police stations and open official reporting services.',
  sosLinkButton: 'Complaint & FIR Support →',
};

const ta: Partial<ComplaintStrings> = {
  sidebarLabel: 'புகார் & FIR உதவி',
  cardTitle: 'புகார் & FIR உதவி',
  cardDesc: 'புகாரைத் தயாரிக்கவும், அருகிலுள்ள காவல் நிலையங்களைக் கண்டறியவும், அதிகாரப்பூர்வ புகார் சேவைகளை அணுகவும்.',
  cardButton: 'புகார் உதவியைத் திறக்கவும் →',
  pageTitle: 'புகார் & FIR உதவி',
  pageSubtitle: 'புகார் வரைவைத் தயாரிக்கவும், அருகிலுள்ள காவல் நிலையங்களைக் கண்டறியவும்.',
  notYetSubmitted: 'இன்னும் சமர்ப்பிக்கப்படவில்லை',
  disclaimerTitle: 'SAHAYINI புகார்களைப் பதிவு செய்யாது, FIR பதிவு செய்யாது',
  disclaimerBody: 'இங்கே நீங்கள் தயாரிப்பது உங்கள் சாதனத்தில் உள்ள வரைவு மட்டுமே. அது காவல்துறைக்கோ எந்த இணையதளத்திற்கோ அனுப்பப்படவில்லை. காவல்துறை அல்லது அதிகாரப்பூர்வ இணையதளம் உறுதிப்படுத்தினால் மட்டுமே புகார் சமர்ப்பிக்கப்பட்டதாக / FIR பதிவானதாகக் கருதலாம்.',
  groupWomen: 'பெண்கள் பாதுகாப்பு',
  groupCyber: 'சைபர் குற்றம் & மோசடிகள்',
  groupOther: 'பிற புகார்கள்',
  chooseType: 'சம்பவ வகையைத் தேர்ந்தெடுக்கவும்',
  types: {
    harassment: 'துன்புறுத்தல்', stalking: 'பின்தொடர்ந்து தொல்லை', domestic_violence: 'குடும்ப வன்முறை',
    sexual_assault: 'பாலியல் தாக்குதல்', threats: 'மிரட்டல்கள்', dowry: 'வரதட்சணை துன்புறுத்தல்',
    upi_fraud: 'UPI மோசடி', bank_fraud: 'வங்கி மோசடி', shopping_scam: 'ஆன்லைன் ஷாப்பிங் மோசடி',
    phishing: 'ஃபிஷிங்', fake_account: 'போலி கணக்கு', cyberstalking: 'இணையவழி பின்தொடர்தல்',
    blackmail: 'ஆன்லைன் மிரட்டிப் பணம் பறித்தல்', missing_person: 'காணாமல் போனவர்', theft: 'திருட்டு',
    physical_assault: 'உடல் ரீதியான தாக்குதல்', property_damage: 'சொத்து சேதம்', other: 'பிற சம்பவம்',
  },
  formTitle: 'புகார் விவரங்கள்',
  incidentDate: 'சம்பவ தேதி',
  location: 'சம்பவ இடம்',
  description: 'என்ன நடந்தது',
  optionalDetails: 'விருப்ப விவரங்கள்',
  yourName: 'உங்கள் பெயர்',
  yourPhone: 'உங்கள் தொலைபேசி எண்',
  generateDraft: 'புகார் வரைவை உருவாக்கு',
  draftTitle: 'உங்கள் புகார் வரைவு',
  preview: 'முன்னோட்டம்',
  copy: 'நகலெடு',
  copied: 'நகலெடுக்கப்பட்டது',
  print: 'அச்சிடு',
  save: 'சேமி',
  findPolice: 'அருகிலுள்ள காவல் நிலையங்களைக் கண்டறி',
  locating: 'உங்கள் இருப்பிடத்தைப் பெறுகிறது…',
  manualTitle: 'இருப்பிடத்தை கைமுறையாக உள்ளிடவும்',
  manualSearch: 'Google Maps-இல் தேடு',
  officialTitle: 'அதிகாரப்பூர்வ புகார் சேவைகள்',
  helpline1930: 'நிதி சைபர் மோசடி உதவி எண்: 1930',
  emergency112: 'அவசரம்: 112',
  sosLinkTitle: 'ஒரு சம்பவத்தைப் புகாரளிக்க வேண்டுமா?',
  sosLinkButton: 'புகார் & FIR உதவி →',
};

const hi: Partial<ComplaintStrings> = {
  sidebarLabel: 'शिकायत और FIR सहायता',
  cardTitle: 'शिकायत और FIR सहायता',
  cardDesc: 'शिकायत तैयार करें, नज़दीकी पुलिस स्टेशन खोजें और आधिकारिक रिपोर्टिंग सेवाओं तक पहुँचें।',
  cardButton: 'शिकायत सहायता खोलें →',
  pageTitle: 'शिकायत और FIR सहायता',
  pageSubtitle: 'शिकायत का मसौदा तैयार करें, नज़दीकी पुलिस स्टेशन खोजें और आधिकारिक रिपोर्टिंग सेवाओं का उपयोग करें।',
  notYetSubmitted: 'अभी जमा नहीं किया गया',
  disclaimerTitle: 'SAHAYINI शिकायत दर्ज या FIR पंजीकृत नहीं करता',
  disclaimerBody: 'यहाँ जो आप तैयार करते हैं वह केवल आपके डिवाइस पर रखा मसौदा है। यह पुलिस या किसी पोर्टल को नहीं भेजा गया है। शिकायत तभी जमा मानें और FIR तभी दर्ज मानें जब पुलिस या आधिकारिक पोर्टल आपको इसकी पुष्टि दे।',
  groupWomen: 'महिला सुरक्षा',
  groupCyber: 'साइबर अपराध और धोखाधड़ी',
  groupOther: 'अन्य शिकायतें',
  chooseType: 'घटना का प्रकार चुनें',
  types: {
    harassment: 'उत्पीड़न', stalking: 'पीछा करना', domestic_violence: 'घरेलू हिंसा',
    sexual_assault: 'यौन हमला', threats: 'धमकियाँ', dowry: 'दहेज उत्पीड़न',
    upi_fraud: 'UPI धोखाधड़ी', bank_fraud: 'बैंक धोखाधड़ी', shopping_scam: 'ऑनलाइन शॉपिंग ठगी',
    phishing: 'फ़िशिंग', fake_account: 'फ़र्ज़ी अकाउंट', cyberstalking: 'साइबर स्टॉकिंग',
    blackmail: 'ऑनलाइन ब्लैकमेल', missing_person: 'लापता व्यक्ति', theft: 'चोरी',
    physical_assault: 'शारीरिक हमला', property_damage: 'संपत्ति को नुकसान', other: 'अन्य घटना',
  },
  formTitle: 'शिकायत का विवरण',
  incidentDate: 'घटना की तारीख',
  location: 'घटना का स्थान',
  description: 'क्या हुआ',
  optionalDetails: 'वैकल्पिक विवरण',
  yourName: 'आपका नाम',
  yourPhone: 'आपका फ़ोन नंबर',
  generateDraft: 'शिकायत मसौदा बनाएँ',
  draftTitle: 'आपका शिकायत मसौदा',
  preview: 'पूर्वावलोकन',
  copy: 'कॉपी करें',
  copied: 'कॉपी हो गया',
  print: 'प्रिंट करें',
  save: 'सहेजें',
  findPolice: 'नज़दीकी पुलिस स्टेशन खोजें',
  locating: 'आपका स्थान प्राप्त हो रहा है…',
  manualTitle: 'स्थान मैन्युअल रूप से दर्ज करें',
  manualSearch: 'Google Maps में खोजें',
  officialTitle: 'आधिकारिक रिपोर्टिंग सेवाएँ',
  helpline1930: 'वित्तीय साइबर धोखाधड़ी हेल्पलाइन: 1930',
  emergency112: 'आपातकाल: 112',
  sosLinkTitle: 'किसी घटना की रिपोर्ट करनी है?',
  sosLinkButton: 'शिकायत और FIR सहायता →',
};

const te: Partial<ComplaintStrings> = {
  sidebarLabel: 'ఫిర్యాదు & FIR సహాయం',
  cardTitle: 'ఫిర్యాదు & FIR సహాయం',
  cardDesc: 'ఫిర్యాదును సిద్ధం చేయండి, సమీపంలోని పోలీస్ స్టేషన్లను కనుగొనండి, అధికారిక రిపోర్టింగ్ సేవలను పొందండి.',
  cardButton: 'ఫిర్యాదు సహాయం తెరవండి →',
  pageTitle: 'ఫిర్యాదు & FIR సహాయం',
  pageSubtitle: 'ఫిర్యాదు ముసాయిదా సిద్ధం చేయండి, సమీప పోలీస్ స్టేషన్లను కనుగొనండి.',
  notYetSubmitted: 'ఇంకా సమర్పించబడలేదు',
  disclaimerTitle: 'SAHAYINI ఫిర్యాదులు దాఖలు చేయదు, FIR నమోదు చేయదు',
  disclaimerBody: 'ఇక్కడ మీరు సిద్ధం చేసేది మీ పరికరంలోని ముసాయిదా మాత్రమే. ఇది పోలీసులకు లేదా ఏ పోర్టల్‌కు పంపబడలేదు. పోలీసులు లేదా అధికారిక పోర్టల్ నిర్ధారించినప్పుడు మాత్రమే ఫిర్యాదు సమర్పించబడినట్లు / FIR నమోదైనట్లు భావించండి.',
  groupWomen: 'మహిళల భద్రత',
  groupCyber: 'సైబర్ నేరాలు & మోసాలు',
  groupOther: 'ఇతర ఫిర్యాదులు',
  chooseType: 'సంఘటన రకాన్ని ఎంచుకోండి',
  types: {
    harassment: 'వేధింపులు', stalking: 'వెంబడించడం', domestic_violence: 'గృహ హింస',
    sexual_assault: 'లైంగిక దాడి', threats: 'బెదిరింపులు', dowry: 'వరకట్న వేధింపులు',
    upi_fraud: 'UPI మోసం', bank_fraud: 'బ్యాంక్ మోసం', shopping_scam: 'ఆన్‌లైన్ షాపింగ్ మోసం',
    phishing: 'ఫిషింగ్', fake_account: 'నకిలీ ఖాతా', cyberstalking: 'సైబర్ స్టాకింగ్',
    blackmail: 'ఆన్‌లైన్ బ్లాక్‌మెయిల్', missing_person: 'తప్పిపోయిన వ్యక్తి', theft: 'దొంగతనం',
    physical_assault: 'శారీరక దాడి', property_damage: 'ఆస్తి నష్టం', other: 'ఇతర సంఘటన',
  },
  formTitle: 'ఫిర్యాదు వివరాలు',
  incidentDate: 'సంఘటన తేదీ',
  location: 'సంఘటన జరిగిన ప్రదేశం',
  description: 'ఏమి జరిగింది',
  optionalDetails: 'ఐచ్ఛిక వివరాలు',
  yourName: 'మీ పేరు',
  yourPhone: 'మీ ఫోన్ నంబర్',
  generateDraft: 'ఫిర్యాదు ముసాయిదా రూపొందించండి',
  draftTitle: 'మీ ఫిర్యాదు ముసాయిదా',
  preview: 'ప్రివ్యూ',
  copy: 'కాపీ',
  copied: 'కాపీ అయింది',
  print: 'ప్రింట్',
  save: 'సేవ్',
  findPolice: 'సమీప పోలీస్ స్టేషన్లను కనుగొనండి',
  locating: 'మీ స్థానాన్ని పొందుతోంది…',
  manualTitle: 'స్థానాన్ని మాన్యువల్‌గా నమోదు చేయండి',
  manualSearch: 'Google Mapsలో వెతకండి',
  officialTitle: 'అధికారిక రిపోర్టింగ్ సేవలు',
  helpline1930: 'ఆర్థిక సైబర్ మోసం హెల్ప్‌లైన్: 1930',
  emergency112: 'అత్యవసరం: 112',
  sosLinkTitle: 'ఒక సంఘటనను నివేదించాలా?',
  sosLinkButton: 'ఫిర్యాదు & FIR సహాయం →',
};

const mr: Partial<ComplaintStrings> = {
  sidebarLabel: 'तक्रार आणि FIR सहाय्य',
  cardTitle: 'तक्रार आणि FIR सहाय्य',
  cardDesc: 'तक्रार तयार करा, जवळची पोलीस ठाणी शोधा आणि अधिकृत तक्रार सेवांचा वापर करा.',
  cardButton: 'तक्रार सहाय्य उघडा →',
  pageTitle: 'तक्रार आणि FIR सहाय्य',
  pageSubtitle: 'तक्रारीचा मसुदा तयार करा, जवळची पोलीस ठाणी शोधा.',
  notYetSubmitted: 'अजून सादर केलेले नाही',
  disclaimerTitle: 'SAHAYINI तक्रार दाखल किंवा FIR नोंद करत नाही',
  disclaimerBody: 'येथे तुम्ही तयार केलेला मसुदा फक्त तुमच्या डिव्हाइसवर आहे. तो पोलिसांना किंवा कोणत्याही पोर्टलला पाठवलेला नाही. पोलीस किंवा अधिकृत पोर्टलने खात्री दिल्यावरच तक्रार सादर झाली / FIR नोंदवला गेला असे समजा.',
  groupWomen: 'महिला सुरक्षा',
  groupCyber: 'सायबर गुन्हे आणि फसवणूक',
  groupOther: 'इतर तक्रारी',
  chooseType: 'घटनेचा प्रकार निवडा',
  types: {
    harassment: 'छळ', stalking: 'पाठलाग', domestic_violence: 'घरगुती हिंसाचार',
    sexual_assault: 'लैंगिक अत्याचार', threats: 'धमक्या', dowry: 'हुंड्यासाठी छळ',
    upi_fraud: 'UPI फसवणूक', bank_fraud: 'बँक फसवणूक', shopping_scam: 'ऑनलाइन खरेदी फसवणूक',
    phishing: 'फिशिंग', fake_account: 'बनावट खाते', cyberstalking: 'सायबर स्टॉकिंग',
    blackmail: 'ऑनलाइन ब्लॅकमेल', missing_person: 'हरवलेली व्यक्ती', theft: 'चोरी',
    physical_assault: 'शारीरिक हल्ला', property_damage: 'मालमत्तेचे नुकसान', other: 'इतर घटना',
  },
  formTitle: 'तक्रारीचा तपशील',
  incidentDate: 'घटनेची तारीख',
  location: 'घटनेचे ठिकाण',
  description: 'काय घडले',
  optionalDetails: 'पर्यायी तपशील',
  yourName: 'तुमचे नाव',
  yourPhone: 'तुमचा फोन नंबर',
  generateDraft: 'तक्रार मसुदा तयार करा',
  draftTitle: 'तुमचा तक्रार मसुदा',
  preview: 'पूर्वावलोकन',
  copy: 'कॉपी करा',
  copied: 'कॉपी झाले',
  print: 'प्रिंट करा',
  save: 'जतन करा',
  findPolice: 'जवळची पोलीस ठाणी शोधा',
  locating: 'तुमचे स्थान मिळवत आहे…',
  manualTitle: 'स्थान स्वतः प्रविष्ट करा',
  manualSearch: 'Google Maps मध्ये शोधा',
  officialTitle: 'अधिकृत तक्रार सेवा',
  helpline1930: 'आर्थिक सायबर फसवणूक हेल्पलाइन: 1930',
  emergency112: 'आणीबाणी: 112',
  sosLinkTitle: 'एखाद्या घटनेची तक्रार करायची आहे?',
  sosLinkButton: 'तक्रार आणि FIR सहाय्य →',
};

const ml: Partial<ComplaintStrings> = {
  sidebarLabel: 'പരാതി & FIR സഹായം',
  cardTitle: 'പരാതി & FIR സഹായം',
  cardDesc: 'പരാതി തയ്യാറാക്കുക, അടുത്തുള്ള പോലീസ് സ്റ്റേഷനുകൾ കണ്ടെത്തുക, ഔദ്യോഗിക റിപ്പോർട്ടിംഗ് സേവനങ്ങൾ ഉപയോഗിക്കുക.',
  cardButton: 'പരാതി സഹായം തുറക്കുക →',
  pageTitle: 'പരാതി & FIR സഹായം',
  pageSubtitle: 'പരാതിയുടെ ഡ്രാഫ്റ്റ് തയ്യാറാക്കുക, അടുത്തുള്ള പോലീസ് സ്റ്റേഷനുകൾ കണ്ടെത്തുക.',
  notYetSubmitted: 'ഇതുവരെ സമർപ്പിച്ചിട്ടില്ല',
  disclaimerTitle: 'SAHAYINI പരാതി നൽകുകയോ FIR രജിസ്റ്റർ ചെയ്യുകയോ ചെയ്യില്ല',
  disclaimerBody: 'ഇവിടെ തയ്യാറാക്കുന്നത് നിങ്ങളുടെ ഉപകരണത്തിലെ ഡ്രാഫ്റ്റ് മാത്രമാണ്. ഇത് പോലീസിനോ ഏതെങ്കിലും പോർട്ടലിനോ അയച്ചിട്ടില്ല. പോലീസോ ഔദ്യോഗിക പോർട്ടലോ സ്ഥിരീകരിക്കുമ്പോൾ മാത്രമേ പരാതി സമർപ്പിച്ചതായി / FIR രജിസ്റ്റർ ചെയ്തതായി കണക്കാക്കാവൂ.',
  groupWomen: 'സ്ത്രീ സുരക്ഷ',
  groupCyber: 'സൈബർ കുറ്റകൃത്യവും തട്ടിപ്പും',
  groupOther: 'മറ്റ് പരാതികൾ',
  chooseType: 'സംഭവത്തിന്റെ തരം തിരഞ്ഞെടുക്കുക',
  types: {
    harassment: 'ഉപദ്രവം', stalking: 'പിന്തുടർന്ന് ശല്യം', domestic_violence: 'ഗാർഹിക പീഡനം',
    sexual_assault: 'ലൈംഗികാതിക്രമം', threats: 'ഭീഷണികൾ', dowry: 'സ്ത്രീധന പീഡനം',
    upi_fraud: 'UPI തട്ടിപ്പ്', bank_fraud: 'ബാങ്ക് തട്ടിപ്പ്', shopping_scam: 'ഓൺലൈൻ ഷോപ്പിംഗ് തട്ടിപ്പ്',
    phishing: 'ഫിഷിംഗ്', fake_account: 'വ്യാജ അക്കൗണ്ട്', cyberstalking: 'സൈബർ സ്റ്റോക്കിംഗ്',
    blackmail: 'ഓൺലൈൻ ബ്ലാക്ക്‌മെയിൽ', missing_person: 'കാണാതായ വ്യക്തി', theft: 'മോഷണം',
    physical_assault: 'ശാരീരിക ആക്രമണം', property_damage: 'സ്വത്ത് നാശം', other: 'മറ്റ് സംഭവം',
  },
  formTitle: 'പരാതി വിവരങ്ങൾ',
  incidentDate: 'സംഭവ തീയതി',
  location: 'സംഭവ സ്ഥലം',
  description: 'എന്താണ് സംഭവിച്ചത്',
  optionalDetails: 'ഐച്ഛിക വിവരങ്ങൾ',
  yourName: 'നിങ്ങളുടെ പേര്',
  yourPhone: 'നിങ്ങളുടെ ഫോൺ നമ്പർ',
  generateDraft: 'പരാതി ഡ്രാഫ്റ്റ് തയ്യാറാക്കുക',
  draftTitle: 'നിങ്ങളുടെ പരാതി ഡ്രാഫ്റ്റ്',
  preview: 'പ്രിവ്യൂ',
  copy: 'പകർത്തുക',
  copied: 'പകർത്തി',
  print: 'പ്രിന്റ്',
  save: 'സേവ്',
  findPolice: 'അടുത്തുള്ള പോലീസ് സ്റ്റേഷനുകൾ കണ്ടെത്തുക',
  locating: 'നിങ്ങളുടെ ലൊക്കേഷൻ എടുക്കുന്നു…',
  manualTitle: 'ലൊക്കേഷൻ സ്വയം നൽകുക',
  manualSearch: 'Google Maps-ൽ തിരയുക',
  officialTitle: 'ഔദ്യോഗിക റിപ്പോർട്ടിംഗ് സേവനങ്ങൾ',
  helpline1930: 'സാമ്പത്തിക സൈബർ തട്ടിപ്പ് ഹെൽപ്പ്‌ലൈൻ: 1930',
  emergency112: 'അടിയന്തരം: 112',
  sosLinkTitle: 'ഒരു സംഭവം റിപ്പോർട്ട് ചെയ്യണോ?',
  sosLinkButton: 'പരാതി & FIR സഹായം →',
};

const gu: Partial<ComplaintStrings> = {
  sidebarLabel: 'ફરિયાદ અને FIR સહાય',
  cardTitle: 'ફરિયાદ અને FIR સહાય',
  cardDesc: 'ફરિયાદ તૈયાર કરો, નજીકના પોલીસ સ્ટેશન શોધો અને સત્તાવાર રિપોર્ટિંગ સેવાઓનો ઉપયોગ કરો.',
  cardButton: 'ફરિયાદ સહાય ખોલો →',
  pageTitle: 'ફરિયાદ અને FIR સહાય',
  pageSubtitle: 'ફરિયાદનો મુસદ્દો તૈયાર કરો, નજીકના પોલીસ સ્ટેશન શોધો.',
  notYetSubmitted: 'હજી સબમિટ કર્યું નથી',
  disclaimerTitle: 'SAHAYINI ફરિયાદ દાખલ કે FIR નોંધતું નથી',
  disclaimerBody: 'અહીં તમે જે તૈયાર કરો છો તે ફક્ત તમારા ડિવાઇસ પરનો મુસદ્દો છે. તે પોલીસ કે કોઈ પોર્ટલને મોકલાયો નથી. પોલીસ અથવા સત્તાવાર પોર્ટલ પુષ્ટિ આપે ત્યારે જ ફરિયાદ સબમિટ થઈ / FIR નોંધાઈ તેમ માનવું.',
  groupWomen: 'મહિલા સુરક્ષા',
  groupCyber: 'સાયબર ક્રાઇમ અને છેતરપિંડી',
  groupOther: 'અન્ય ફરિયાદો',
  chooseType: 'ઘટનાનો પ્રકાર પસંદ કરો',
  types: {
    harassment: 'સતામણી', stalking: 'પીછો કરવો', domestic_violence: 'ઘરેલું હિંસા',
    sexual_assault: 'જાતીય હુમલો', threats: 'ધમકીઓ', dowry: 'દહેજ સતામણી',
    upi_fraud: 'UPI છેતરપિંડી', bank_fraud: 'બેંક છેતરપિંડી', shopping_scam: 'ઓનલાઇન શોપિંગ છેતરપિંડી',
    phishing: 'ફિશિંગ', fake_account: 'નકલી એકાઉન્ટ', cyberstalking: 'સાયબર સ્ટોકિંગ',
    blackmail: 'ઓનલાઇન બ્લેકમેલ', missing_person: 'ગુમ વ્યક્તિ', theft: 'ચોરી',
    physical_assault: 'શારીરિક હુમલો', property_damage: 'મિલકતને નુકસાન', other: 'અન્ય ઘટના',
  },
  formTitle: 'ફરિયાદની વિગતો',
  incidentDate: 'ઘટનાની તારીખ',
  location: 'ઘટનાનું સ્થળ',
  description: 'શું બન્યું',
  optionalDetails: 'વૈકલ્પિક વિગતો',
  yourName: 'તમારું નામ',
  yourPhone: 'તમારો ફોન નંબર',
  generateDraft: 'ફરિયાદ મુસદ્દો બનાવો',
  draftTitle: 'તમારો ફરિયાદ મુસદ્દો',
  preview: 'પૂર્વાવલોકન',
  copy: 'કૉપિ કરો',
  copied: 'કૉપિ થયું',
  print: 'પ્રિન્ટ કરો',
  save: 'સાચવો',
  findPolice: 'નજીકના પોલીસ સ્ટેશન શોધો',
  locating: 'તમારું સ્થાન મેળવી રહ્યા છીએ…',
  manualTitle: 'સ્થાન જાતે દાખલ કરો',
  manualSearch: 'Google Maps માં શોધો',
  officialTitle: 'સત્તાવાર રિપોર્ટિંગ સેવાઓ',
  helpline1930: 'નાણાકીય સાયબર છેતરપિંડી હેલ્પલાઇન: 1930',
  emergency112: 'કટોકટી: 112',
  sosLinkTitle: 'કોઈ ઘટનાની ફરિયાદ કરવી છે?',
  sosLinkButton: 'ફરિયાદ અને FIR સહાય →',
};

const kn: Partial<ComplaintStrings> = {
  sidebarLabel: 'ದೂರು & FIR ಸಹಾಯ',
  cardTitle: 'ದೂರು & FIR ಸಹಾಯ',
  cardDesc: 'ದೂರನ್ನು ಸಿದ್ಧಪಡಿಸಿ, ಹತ್ತಿರದ ಪೊಲೀಸ್ ಠಾಣೆಗಳನ್ನು ಹುಡುಕಿ ಮತ್ತು ಅಧಿಕೃತ ವರದಿ ಸೇವೆಗಳನ್ನು ಬಳಸಿ.',
  cardButton: 'ದೂರು ಸಹಾಯ ತೆರೆಯಿರಿ →',
  pageTitle: 'ದೂರು & FIR ಸಹಾಯ',
  pageSubtitle: 'ದೂರಿನ ಕರಡು ಸಿದ್ಧಪಡಿಸಿ, ಹತ್ತಿರದ ಪೊಲೀಸ್ ಠಾಣೆಗಳನ್ನು ಹುಡುಕಿ.',
  notYetSubmitted: 'ಇನ್ನೂ ಸಲ್ಲಿಸಿಲ್ಲ',
  disclaimerTitle: 'SAHAYINI ದೂರು ದಾಖಲಿಸುವುದಿಲ್ಲ, FIR ನೋಂದಾಯಿಸುವುದಿಲ್ಲ',
  disclaimerBody: 'ಇಲ್ಲಿ ನೀವು ಸಿದ್ಧಪಡಿಸುವುದು ನಿಮ್ಮ ಸಾಧನದಲ್ಲಿರುವ ಕರಡು ಮಾತ್ರ. ಇದನ್ನು ಪೊಲೀಸರಿಗೆ ಅಥವಾ ಯಾವುದೇ ಪೋರ್ಟಲ್‌ಗೆ ಕಳುಹಿಸಿಲ್ಲ. ಪೊಲೀಸರು ಅಥವಾ ಅಧಿಕೃತ ಪೋರ್ಟಲ್ ದೃಢೀಕರಿಸಿದಾಗ ಮಾತ್ರ ದೂರು ಸಲ್ಲಿಕೆಯಾಗಿದೆ / FIR ದಾಖಲಾಗಿದೆ ಎಂದು ಪರಿಗಣಿಸಿ.',
  groupWomen: 'ಮಹಿಳಾ ಸುರಕ್ಷತೆ',
  groupCyber: 'ಸೈಬರ್ ಅಪರಾಧ & ವಂಚನೆ',
  groupOther: 'ಇತರ ದೂರುಗಳು',
  chooseType: 'ಘಟನೆಯ ಪ್ರಕಾರ ಆಯ್ಕೆಮಾಡಿ',
  types: {
    harassment: 'ಕಿರುಕುಳ', stalking: 'ಹಿಂಬಾಲಿಸುವುದು', domestic_violence: 'ಕೌಟುಂಬಿಕ ಹಿಂಸೆ',
    sexual_assault: 'ಲೈಂಗಿಕ ದೌರ್ಜನ್ಯ', threats: 'ಬೆದರಿಕೆಗಳು', dowry: 'ವರದಕ್ಷಿಣೆ ಕಿರುಕುಳ',
    upi_fraud: 'UPI ವಂಚನೆ', bank_fraud: 'ಬ್ಯಾಂಕ್ ವಂಚನೆ', shopping_scam: 'ಆನ್‌ಲೈನ್ ಶಾಪಿಂಗ್ ವಂಚನೆ',
    phishing: 'ಫಿಶಿಂಗ್', fake_account: 'ನಕಲಿ ಖಾತೆ', cyberstalking: 'ಸೈಬರ್ ಸ್ಟಾಕಿಂಗ್',
    blackmail: 'ಆನ್‌ಲೈನ್ ಬ್ಲ್ಯಾಕ್‌ಮೇಲ್', missing_person: 'ಕಾಣೆಯಾದ ವ್ಯಕ್ತಿ', theft: 'ಕಳ್ಳತನ',
    physical_assault: 'ದೈಹಿಕ ಹಲ್ಲೆ', property_damage: 'ಆಸ್ತಿ ಹಾನಿ', other: 'ಇತರ ಘಟನೆ',
  },
  formTitle: 'ದೂರಿನ ವಿವರಗಳು',
  incidentDate: 'ಘಟನೆಯ ದಿನಾಂಕ',
  location: 'ಘಟನೆ ನಡೆದ ಸ್ಥಳ',
  description: 'ಏನು ನಡೆಯಿತು',
  optionalDetails: 'ಐಚ್ಛಿಕ ವಿವರಗಳು',
  yourName: 'ನಿಮ್ಮ ಹೆಸರು',
  yourPhone: 'ನಿಮ್ಮ ಫೋನ್ ಸಂಖ್ಯೆ',
  generateDraft: 'ದೂರಿನ ಕರಡು ರಚಿಸಿ',
  draftTitle: 'ನಿಮ್ಮ ದೂರಿನ ಕರಡು',
  preview: 'ಪೂರ್ವವೀಕ್ಷಣೆ',
  copy: 'ನಕಲಿಸಿ',
  copied: 'ನಕಲಿಸಲಾಗಿದೆ',
  print: 'ಮುದ್ರಿಸಿ',
  save: 'ಉಳಿಸಿ',
  findPolice: 'ಹತ್ತಿರದ ಪೊಲೀಸ್ ಠಾಣೆಗಳನ್ನು ಹುಡುಕಿ',
  locating: 'ನಿಮ್ಮ ಸ್ಥಳವನ್ನು ಪಡೆಯಲಾಗುತ್ತಿದೆ…',
  manualTitle: 'ಸ್ಥಳವನ್ನು ಕೈಯಾರೆ ನಮೂದಿಸಿ',
  manualSearch: 'Google Maps ನಲ್ಲಿ ಹುಡುಕಿ',
  officialTitle: 'ಅಧಿಕೃತ ವರದಿ ಸೇವೆಗಳು',
  helpline1930: 'ಹಣಕಾಸು ಸೈಬರ್ ವಂಚನೆ ಸಹಾಯವಾಣಿ: 1930',
  emergency112: 'ತುರ್ತು: 112',
  sosLinkTitle: 'ಒಂದು ಘಟನೆಯನ್ನು ವರದಿ ಮಾಡಬೇಕೇ?',
  sosLinkButton: 'ದೂರು & FIR ಸಹಾಯ →',
};

const OVERRIDES: Record<LanguageCode, Partial<ComplaintStrings>> = { en, ta, hi, te, mr, ml, gu, kn };

/** Returns the strings for a language; anything not translated falls back to English. */
export function getComplaintStrings(lang: LanguageCode): ComplaintStrings {
  const o = OVERRIDES[lang] || {};
  return { ...en, ...o, types: { ...en.types, ...(o.types || {}) } };
}
