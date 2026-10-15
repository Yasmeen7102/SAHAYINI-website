import { LanguageCode } from '../types';

/**
 * Additional UI strings for features added in the readability / chatbot /
 * scam-protection update. Kept separate from translations.ts so the large
 * existing translation file is untouched. English is the fallback.
 * NOTE: non-English strings should be reviewed by a native speaker.
 */
export interface ExtraStrings {
  // Chat
  chatLiveBadge: string;
  chatOfflineBadge: string;
  chatFallbackBadge: string;
  chatOfflineNoAnswer: string;
  chatServerDownNote: string;
  chatAiErrorNote: string;
  chatServerDownNoAnswer: string;
  chatOfflineBanner: string;
  chatErrBadge: string;
  chatErrNotConfigured: string;
  chatErrBusy: string;
  chatErrNetwork: string;
  chatErrModel: string;
  chatErrRateLimit: string;
  chatRetry: string;
  // Scam
  scamListen: string;
  scamReplay: string;
  scamStopAudio: string;
  scamMeaning: string;
  scamSigns: string;
  scamActions: string;
  scamRiskWord: { LOW: string; MEDIUM: string; HIGH: string; CRITICAL: string };
  scamUncertainty: string;
  scamNoSigns: string;
  scamLocalNote: string;
  scamAiBadge: string;
  scamLocalBadge: string;
  scamAudioIntro: string;
  // Learn
  learnComingSoon: string;
  learnShowingTopic: string;
}

const en: ExtraStrings = {
  chatLiveBadge: 'Live AI response',
  chatOfflineBadge: 'Offline answer (saved on this device)',
  chatFallbackBadge: 'Built-in answer (live AI was not reached)',
  chatOfflineNoAnswer:
    "I couldn't find a saved answer for this question on your device. This question needs an internet connection so I can ask the live AI service. Please reconnect and ask again. In an emergency, dial 112 at any time.",
  chatServerDownNote:
    "SAHAYINI's AI service could not be reached just now (the server may be busy or unavailable), so this answer comes from information saved on your device.",
  chatAiErrorNote:
    'The live AI service had a problem just now, so this is a built-in answer rather than a live AI reply.',
  chatServerDownNoAnswer:
    "SAHAYINI's AI service could not be reached just now, and there is no saved answer on this device for this question. Please try again in a moment. In an emergency, dial 112.",
  chatOfflineBanner:
    'You are offline. Answers come only from information saved on this device. Questions it does not cover need an internet connection.',
  chatErrBadge: 'AI answer unavailable',
  chatErrNotConfigured:
    'SAHAYINI\'s AI is not set up correctly on the server (the API key is missing or was not accepted). The site owner needs to check the server settings. Your question has NOT been answered by AI. In an emergency, dial 112.',
  chatErrBusy:
    'SAHAYINI\'s AI service is busy or unavailable right now. Please try again in a moment. In an emergency, dial 112.',
  chatErrNetwork:
    'Could not reach the SAHAYINI server. Please check your internet connection and try again. In an emergency, dial 112.',
  chatErrModel:
    'SAHAYINI\'s AI model is not available for this server\'s API key right now. The site owner needs to update the model setting. Your question has NOT been answered by AI. In an emergency, dial 112.',
  chatErrRateLimit:
    'SAHAYINI\'s AI has reached its usage limit for the moment. Please wait a minute and tap Retry. In an emergency, dial 112.',
  chatRetry: 'Retry',
  scamListen: 'Listen to analysis',
  scamReplay: 'Replay',
  scamStopAudio: 'Stop audio',
  scamMeaning: 'What this means',
  scamSigns: 'Suspicious signs',
  scamActions: 'What you should do',
  scamRiskWord: { LOW: 'low', MEDIUM: 'medium', HIGH: 'high', CRITICAL: 'critical' },
  scamUncertainty:
    'This is an automated assessment and can be wrong. It cannot prove that a message is safe or fraudulent. When in doubt, do not act on it. Verify with the official organisation using a number or website you find yourself, or call 1930.',
  scamNoSigns:
    'No known scam patterns were found, but that does not prove the message is safe.',
  scamLocalNote:
    'Online analysis was not available, so only basic checks on this device were used. These checks look for common scam patterns and are less thorough.',
  scamAiBadge: 'AI-assisted analysis',
  scamLocalBadge: 'On-device checks only',
  scamAudioIntro: 'Scam check result.',
  learnComingSoon: 'More lessons for this topic are coming soon. Showing all available lessons.',
  learnShowingTopic: 'Lessons for',
};

const ta: ExtraStrings = {
  chatLiveBadge: 'நேரடி AI பதில்',
  chatOfflineBadge: 'ஆஃப்லைன் பதில் (சாதனத்தில் சேமித்த தகவல்)',
  chatFallbackBadge: 'உள்ளமைந்த பதில் (நேரடி AI சேவையை அடைய முடியவில்லை)',
  chatOfflineNoAnswer:
    'இந்தக் கேள்விக்கு உங்கள் சாதனத்தில் சேமிக்கப்பட்ட பதில் இல்லை. நேரடி AI சேவையைப் பயன்படுத்த இணைய இணைப்பு தேவை. இணைப்பு கிடைத்ததும் மீண்டும் கேளுங்கள். அவசரத்தில் எப்போதும் 112 ஐ அழைக்கவும்.',
  chatServerDownNote:
    'SAHAYINI AI சேவையை இப்போது அடைய முடியவில்லை (சேவையகம் பிஸியாக இருக்கலாம்). எனவே இந்தப் பதில் உங்கள் சாதனத்தில் சேமித்த தகவலிலிருந்து வழங்கப்படுகிறது.',
  chatAiErrorNote:
    'நேரடி AI சேவையில் இப்போது சிக்கல் ஏற்பட்டது. எனவே இது நேரடி AI பதில் அல்ல, உள்ளமைந்த பதில்.',
  chatServerDownNoAnswer:
    'SAHAYINI AI சேவையை இப்போது அடைய முடியவில்லை; இந்தக் கேள்விக்கு சாதனத்தில் சேமித்த பதிலும் இல்லை. சிறிது நேரம் கழித்து மீண்டும் முயற்சிக்கவும். அவசரத்தில் 112 ஐ அழைக்கவும்.',
  chatOfflineBanner:
    'நீங்கள் ஆஃப்லைனில் உள்ளீர்கள். இந்தச் சாதனத்தில் சேமித்த தகவலிலிருந்து மட்டுமே பதில் கிடைக்கும். மற்ற கேள்விகளுக்கு இணைய இணைப்பு தேவை.',
  chatErrBadge: 'AI பதில் கிடைக்கவில்லை',
  chatErrNotConfigured:
    'SAHAYINI-யின் AI சேவை சர்வரில் சரியாக அமைக்கப்படவில்லை (API விசை இல்லை அல்லது ஏற்கப்படவில்லை). இணையதள உரிமையாளர் சர்வர் அமைப்புகளைச் சரிபார்க்க வேண்டும். உங்கள் கேள்விக்கு AI பதில் அளிக்கவில்லை. அவசரநிலையில் 112-ஐ அழைக்கவும்.',
  chatErrBusy:
    'SAHAYINI-யின் AI சேவை இப்போது பிஸியாக உள்ளது அல்லது கிடைக்கவில்லை. சிறிது நேரம் கழித்து மீண்டும் முயலவும். அவசரநிலையில் 112-ஐ அழைக்கவும்.',
  chatErrNetwork:
    'SAHAYINI சர்வரை அடைய முடியவில்லை. உங்கள் இணைய இணைப்பைச் சரிபார்த்து மீண்டும் முயலவும். அவசரநிலையில் 112-ஐ அழைக்கவும்.',
  chatErrModel:
    'SAHAYINI-யின் AI மாதிரி (model) இந்த சர்வரின் API விசைக்கு இப்போது கிடைக்கவில்லை. இணையதள உரிமையாளர் மாடல் அமைப்பைப் புதுப்பிக்க வேண்டும். உங்கள் கேள்விக்கு AI பதில் அளிக்கவில்லை. அவசரநிலையில் 112-ஐ அழைக்கவும்.',
  chatErrRateLimit:
    'SAHAYINI-யின் AI தற்காலிகமாக பயன்பாட்டு வரம்பை எட்டியுள்ளது. ஒரு நிமிடம் காத்திருந்து \'மீண்டும் முயல்க\' என்பதை அழுத்தவும். அவசரநிலையில் 112-ஐ அழைக்கவும்.',
  chatRetry: 'மீண்டும் முயல்க',
  scamListen: 'பகுப்பாய்வைக் கேளுங்கள்',
  scamReplay: 'மீண்டும் கேளுங்கள்',
  scamStopAudio: 'ஒலியை நிறுத்து',
  scamMeaning: 'இதன் பொருள்',
  scamSigns: 'சந்தேகத்திற்குரிய அறிகுறிகள்',
  scamActions: 'நீங்கள் செய்ய வேண்டியவை',
  scamRiskWord: { LOW: 'குறைவு', MEDIUM: 'நடுத்தரம்', HIGH: 'அதிகம்', CRITICAL: 'மிக அதிகம்' },
  scamUncertainty:
    'இது தானியங்கி மதிப்பீடு; தவறாக இருக்கலாம். ஒரு செய்தி பாதுகாப்பானது அல்லது மோசடி என்பதை இது உறுதிப்படுத்த முடியாது. சந்தேகம் இருந்தால் செயல்பட வேண்டாம். நீங்களே கண்டறிந்த அதிகாரப்பூர்வ எண் அல்லது இணையதளம் மூலம் சரிபார்க்கவும், அல்லது 1930 ஐ அழைக்கவும்.',
  scamNoSigns:
    'அறியப்பட்ட மோசடி அம்சங்கள் எதுவும் கண்டறியப்படவில்லை, ஆனால் இது செய்தி பாதுகாப்பானது என்பதற்கான உறுதி அல்ல.',
  scamLocalNote:
    'ஆன்லைன் பகுப்பாய்வு கிடைக்கவில்லை; இந்தச் சாதனத்தில் அடிப்படைச் சோதனைகள் மட்டுமே பயன்படுத்தப்பட்டன. இவை குறைவான ஆழமுடையவை.',
  scamAiBadge: 'AI உதவியுடன் பகுப்பாய்வு',
  scamLocalBadge: 'சாதனச் சோதனைகள் மட்டும்',
  scamAudioIntro: 'மோசடி சோதனை முடிவு.',
  learnComingSoon: 'இந்தத் தலைப்புக்கான கூடுதல் பாடங்கள் விரைவில் வரும். கிடைக்கும் அனைத்து பாடங்களும் காட்டப்படுகின்றன.',
  learnShowingTopic: 'பாடங்கள்:',
};

const hi: ExtraStrings = {
  chatLiveBadge: 'लाइव AI उत्तर',
  chatOfflineBadge: 'ऑफ़लाइन उत्तर (इस डिवाइस में सहेजी जानकारी)',
  chatFallbackBadge: 'इन-बिल्ट उत्तर (लाइव AI तक नहीं पहुँच सके)',
  chatOfflineNoAnswer:
    'आपके डिवाइस में इस प्रश्न का सहेजा हुआ उत्तर नहीं मिला। लाइव AI सेवा से पूछने के लिए इंटरनेट कनेक्शन चाहिए। कृपया दोबारा कनेक्ट होकर पूछें। आपात स्थिति में कभी भी 112 डायल करें।',
  chatServerDownNote:
    'SAHAYINI की AI सेवा अभी उपलब्ध नहीं हो सकी (सर्वर व्यस्त या बंद हो सकता है), इसलिए यह उत्तर आपके डिवाइस में सहेजी जानकारी से दिया गया है।',
  chatAiErrorNote:
    'लाइव AI सेवा में अभी समस्या आई, इसलिए यह लाइव AI उत्तर नहीं बल्कि इन-बिल्ट उत्तर है।',
  chatServerDownNoAnswer:
    'SAHAYINI की AI सेवा अभी उपलब्ध नहीं हो सकी और इस प्रश्न का सहेजा हुआ उत्तर भी डिवाइस में नहीं है। कृपया थोड़ी देर बाद फिर कोशिश करें। आपात स्थिति में 112 डायल करें।',
  chatOfflineBanner:
    'आप ऑफ़लाइन हैं। उत्तर केवल इस डिवाइस में सहेजी जानकारी से मिलेंगे। बाकी प्रश्नों के लिए इंटरनेट चाहिए।',
  chatErrBadge: 'AI उत्तर उपलब्ध नहीं',
  chatErrNotConfigured:
    'SAHAYINI की AI सेवा सर्वर पर ठीक से सेट नहीं है (API की गायब है या स्वीकार नहीं की गई)। साइट के मालिक को सर्वर सेटिंग जाँचनी होगी। आपके प्रश्न का उत्तर AI ने नहीं दिया है। आपात स्थिति में 112 पर कॉल करें।',
  chatErrBusy:
    'SAHAYINI की AI सेवा अभी व्यस्त है या उपलब्ध नहीं है। कृपया थोड़ी देर बाद फिर कोशिश करें। आपात स्थिति में 112 पर कॉल करें।',
  chatErrNetwork:
    'SAHAYINI सर्वर तक नहीं पहुँच सके। कृपया अपना इंटरनेट कनेक्शन जाँचें और फिर कोशिश करें। आपात स्थिति में 112 पर कॉल करें।',
  chatErrModel:
    'SAHAYINI का AI मॉडल इस सर्वर की API की के लिए अभी उपलब्ध नहीं है। साइट के मालिक को मॉडल सेटिंग अपडेट करनी होगी। आपके प्रश्न का उत्तर AI ने नहीं दिया है। आपात स्थिति में 112 पर कॉल करें।',
  chatErrRateLimit:
    'SAHAYINI के AI की उपयोग सीमा अभी पूरी हो गई है। कृपया एक मिनट रुककर \'फिर कोशिश करें\' दबाएँ। आपात स्थिति में 112 पर कॉल करें।',
  chatRetry: 'फिर कोशिश करें',
  scamListen: 'विश्लेषण सुनें',
  scamReplay: 'दोबारा सुनें',
  scamStopAudio: 'ऑडियो रोकें',
  scamMeaning: 'इसका मतलब',
  scamSigns: 'संदिग्ध संकेत',
  scamActions: 'आपको क्या करना चाहिए',
  scamRiskWord: { LOW: 'कम', MEDIUM: 'मध्यम', HIGH: 'उच्च', CRITICAL: 'गंभीर' },
  scamUncertainty:
    'यह स्वचालित आकलन है और गलत हो सकता है। यह साबित नहीं कर सकता कि संदेश सुरक्षित है या धोखाधड़ी। संदेह हो तो कार्रवाई न करें। खुद खोजे गए आधिकारिक नंबर या वेबसाइट से पुष्टि करें, या 1930 पर कॉल करें।',
  scamNoSigns:
    'कोई जाना-पहचाना घोटाला पैटर्न नहीं मिला, लेकिन इससे यह साबित नहीं होता कि संदेश सुरक्षित है।',
  scamLocalNote:
    'ऑनलाइन विश्लेषण उपलब्ध नहीं था, इसलिए केवल इस डिवाइस की बुनियादी जाँच की गई। ये जाँच कम विस्तृत हैं।',
  scamAiBadge: 'AI-सहायता प्राप्त विश्लेषण',
  scamLocalBadge: 'केवल डिवाइस पर जाँच',
  scamAudioIntro: 'घोटाला जाँच का परिणाम।',
  learnComingSoon: 'इस विषय के और पाठ जल्द आएंगे। सभी उपलब्ध पाठ दिखाए जा रहे हैं।',
  learnShowingTopic: 'पाठ:',
};

const te: ExtraStrings = {
  chatLiveBadge: 'లైవ్ AI సమాధానం',
  chatOfflineBadge: 'ఆఫ్‌లైన్ సమాధానం (ఈ పరికరంలో సేవ్ చేసిన సమాచారం)',
  chatFallbackBadge: 'అంతర్నిర్మిత సమాధానం (లైవ్ AI అందలేదు)',
  chatOfflineNoAnswer:
    'ఈ ప్రశ్నకు మీ పరికరంలో సేవ్ చేసిన సమాధానం లేదు. లైవ్ AI సేవను అడగడానికి ఇంటర్నెట్ కనెక్షన్ కావాలి. మళ్లీ కనెక్ట్ అయి అడగండి. అత్యవసర పరిస్థితిలో ఎప్పుడైనా 112 కి కాల్ చేయండి.',
  chatServerDownNote:
    'SAHAYINI AI సేవ ఇప్పుడు అందుబాటులో లేదు (సర్వర్ బిజీగా ఉండవచ్చు), కాబట్టి ఈ సమాధానం మీ పరికరంలో సేవ్ చేసిన సమాచారం నుండి ఇవ్వబడింది.',
  chatAiErrorNote:
    'లైవ్ AI సేవలో ఇప్పుడు సమస్య వచ్చింది, కాబట్టి ఇది లైవ్ AI సమాధానం కాదు, అంతర్నిర్మిత సమాధానం.',
  chatServerDownNoAnswer:
    'SAHAYINI AI సేవ ఇప్పుడు అందలేదు, ఈ ప్రశ్నకు పరికరంలో సేవ్ చేసిన సమాధానం కూడా లేదు. కొద్దిసేపటి తర్వాత మళ్లీ ప్రయత్నించండి. అత్యవసరంలో 112 కి కాల్ చేయండి.',
  chatOfflineBanner:
    'మీరు ఆఫ్‌లైన్‌లో ఉన్నారు. ఈ పరికరంలో సేవ్ చేసిన సమాచారం నుండి మాత్రమే సమాధానాలు వస్తాయి. ఇతర ప్రశ్నలకు ఇంటర్నెట్ కావాలి.',
  chatErrBadge: 'AI సమాధానం అందుబాటులో లేదు',
  chatErrNotConfigured:
    'SAHAYINI AI సేవ సర్వర్‌లో సరిగ్గా సెటప్ కాలేదు (API కీ లేదు లేదా అంగీకరించబడలేదు). సైట్ యజమాని సర్వర్ సెట్టింగ్‌లను తనిఖీ చేయాలి. మీ ప్రశ్నకు AI సమాధానం ఇవ్వలేదు. అత్యవసర పరిస్థితిలో 112కి కాల్ చేయండి.',
  chatErrBusy:
    'SAHAYINI AI సేవ ప్రస్తుతం బిజీగా ఉంది లేదా అందుబాటులో లేదు. దయచేసి కొద్దిసేపటి తర్వాత మళ్లీ ప్రయత్నించండి. అత్యవసర పరిస్థితిలో 112కి కాల్ చేయండి.',
  chatErrNetwork:
    'SAHAYINI సర్వర్‌ను చేరుకోలేకపోయాం. దయచేసి మీ ఇంటర్నెట్ కనెక్షన్ తనిఖీ చేసి మళ్లీ ప్రయత్నించండి. అత్యవసర పరిస్థితిలో 112కి కాల్ చేయండి.',
  chatErrModel:
    'SAHAYINI AI మోడల్ ఈ సర్వర్ API కీకి ప్రస్తుతం అందుబాటులో లేదు. సైట్ యజమాని మోడల్ సెట్టింగ్‌ను అప్‌డేట్ చేయాలి. మీ ప్రశ్నకు AI సమాధానం ఇవ్వలేదు. అత్యవసర పరిస్థితిలో 112కి కాల్ చేయండి.',
  chatErrRateLimit:
    'SAHAYINI AI తాత్కాలికంగా వినియోగ పరిమితిని చేరుకుంది. దయచేసి ఒక నిమిషం ఆగి \'మళ్లీ ప్రయత్నించండి\' నొక్కండి. అత్యవసర పరిస్థితిలో 112కి కాల్ చేయండి.',
  chatRetry: 'మళ్లీ ప్రయత్నించండి',
  scamListen: 'విశ్లేషణ వినండి',
  scamReplay: 'మళ్లీ వినండి',
  scamStopAudio: 'ఆడియో ఆపండి',
  scamMeaning: 'దీని అర్థం',
  scamSigns: 'అనుమానాస్పద సంకేతాలు',
  scamActions: 'మీరు ఏమి చేయాలి',
  scamRiskWord: { LOW: 'తక్కువ', MEDIUM: 'మధ్యస్థం', HIGH: 'ఎక్కువ', CRITICAL: 'తీవ్రం' },
  scamUncertainty:
    'ఇది ఆటోమేటెడ్ అంచనా మరియు తప్పు కావచ్చు. సందేశం సురక్షితమా లేదా మోసమా అని ఇది నిరూపించలేదు. సందేహం ఉంటే చర్య తీసుకోకండి. మీరే కనుగొన్న అధికారిక నంబర్ లేదా వెబ్‌సైట్ ద్వారా నిర్ధారించుకోండి, లేదా 1930 కి కాల్ చేయండి.',
  scamNoSigns:
    'తెలిసిన మోసపు నమూనాలు ఏవీ కనిపించలేదు, కానీ సందేశం సురక్షితమని దీని అర్థం కాదు.',
  scamLocalNote:
    'ఆన్‌లైన్ విశ్లేషణ అందుబాటులో లేదు, కాబట్టి ఈ పరికరంలోని ప్రాథమిక తనిఖీలు మాత్రమే ఉపయోగించబడ్డాయి. ఇవి తక్కువ లోతైనవి.',
  scamAiBadge: 'AI సహాయంతో విశ్లేషణ',
  scamLocalBadge: 'పరికరంలో తనిఖీలు మాత్రమే',
  scamAudioIntro: 'మోసం తనిఖీ ఫలితం.',
  learnComingSoon: 'ఈ అంశానికి మరిన్ని పాఠాలు త్వరలో వస్తాయి. అందుబాటులో ఉన్న అన్ని పాఠాలు చూపబడుతున్నాయి.',
  learnShowingTopic: 'పాఠాలు:',
};

const mr: ExtraStrings = {
  chatLiveBadge: 'लाइव्ह AI उत्तर',
  chatOfflineBadge: 'ऑफलाइन उत्तर (या डिव्हाइसवर जतन केलेली माहिती)',
  chatFallbackBadge: 'अंतर्गत उत्तर (लाइव्ह AI पर्यंत पोहोचता आले नाही)',
  chatOfflineNoAnswer:
    'तुमच्या डिव्हाइसवर या प्रश्नाचे जतन केलेले उत्तर सापडले नाही. लाइव्ह AI सेवेला विचारण्यासाठी इंटरनेट कनेक्शन हवे. कृपया पुन्हा कनेक्ट होऊन विचारा. आणीबाणीत कधीही 112 डायल करा.',
  chatServerDownNote:
    'SAHAYINI ची AI सेवा आत्ता उपलब्ध झाली नाही (सर्व्हर व्यस्त असू शकतो), म्हणून हे उत्तर तुमच्या डिव्हाइसवर जतन केलेल्या माहितीवरून दिले आहे.',
  chatAiErrorNote:
    'लाइव्ह AI सेवेत आत्ता अडचण आली, म्हणून हे लाइव्ह AI उत्तर नसून अंतर्गत उत्तर आहे.',
  chatServerDownNoAnswer:
    'SAHAYINI ची AI सेवा आत्ता उपलब्ध झाली नाही आणि या प्रश्नाचे जतन केलेले उत्तरही डिव्हाइसवर नाही. कृपया थोड्या वेळाने पुन्हा प्रयत्न करा. आणीबाणीत 112 डायल करा.',
  chatOfflineBanner:
    'तुम्ही ऑफलाइन आहात. उत्तरे फक्त या डिव्हाइसवर जतन केलेल्या माहितीवरून मिळतील. इतर प्रश्नांसाठी इंटरनेट हवे.',
  chatErrBadge: 'AI उत्तर उपलब्ध नाही',
  chatErrNotConfigured:
    'SAHAYINI ची AI सेवा सर्व्हरवर योग्यरित्या सेट केलेली नाही (API की नाही किंवा स्वीकारली गेली नाही). साइट मालकाने सर्व्हर सेटिंग्ज तपासाव्यात. तुमच्या प्रश्नाला AI ने उत्तर दिलेले नाही. आणीबाणीत 112 वर कॉल करा.',
  chatErrBusy:
    'SAHAYINI ची AI सेवा सध्या व्यस्त आहे किंवा उपलब्ध नाही. कृपया थोड्या वेळाने पुन्हा प्रयत्न करा. आणीबाणीत 112 वर कॉल करा.',
  chatErrNetwork:
    'SAHAYINI सर्व्हरशी संपर्क होऊ शकला नाही. कृपया तुमचे इंटरनेट कनेक्शन तपासा आणि पुन्हा प्रयत्न करा. आणीबाणीत 112 वर कॉल करा.',
  chatErrModel:
    'SAHAYINI चे AI मॉडेल या सर्व्हरच्या API कीसाठी सध्या उपलब्ध नाही. साइट मालकाने मॉडेल सेटिंग अपडेट करावी. तुमच्या प्रश्नाला AI ने उत्तर दिलेले नाही. आणीबाणीत 112 वर कॉल करा.',
  chatErrRateLimit:
    'SAHAYINI च्या AI ची वापर मर्यादा सध्या संपली आहे. कृपया एक मिनिट थांबा आणि \'पुन्हा प्रयत्न करा\' दाबा. आणीबाणीत 112 वर कॉल करा.',
  chatRetry: 'पुन्हा प्रयत्न करा',
  scamListen: 'विश्लेषण ऐका',
  scamReplay: 'पुन्हा ऐका',
  scamStopAudio: 'ऑडिओ थांबवा',
  scamMeaning: 'याचा अर्थ',
  scamSigns: 'संशयास्पद चिन्हे',
  scamActions: 'तुम्ही काय करावे',
  scamRiskWord: { LOW: 'कमी', MEDIUM: 'मध्यम', HIGH: 'जास्त', CRITICAL: 'गंभीर' },
  scamUncertainty:
    'हे स्वयंचलित मूल्यमापन आहे आणि चुकीचे असू शकते. संदेश सुरक्षित आहे की फसवा हे ते सिद्ध करू शकत नाही. शंका असल्यास कृती करू नका. स्वतः शोधलेल्या अधिकृत क्रमांकाने किंवा वेबसाइटने खात्री करा, किंवा 1930 वर कॉल करा.',
  scamNoSigns:
    'ओळखीचे कोणतेही फसवणूक नमुने आढळले नाहीत, पण त्यामुळे संदेश सुरक्षित आहे असे सिद्ध होत नाही.',
  scamLocalNote:
    'ऑनलाइन विश्लेषण उपलब्ध नव्हते, म्हणून फक्त या डिव्हाइसवरील मूलभूत तपासण्या वापरल्या. त्या कमी सखोल आहेत.',
  scamAiBadge: 'AI-साहाय्यित विश्लेषण',
  scamLocalBadge: 'फक्त डिव्हाइसवरील तपासण्या',
  scamAudioIntro: 'फसवणूक तपासणीचा निकाल.',
  learnComingSoon: 'या विषयाचे आणखी धडे लवकरच येतील. सर्व उपलब्ध धडे दाखवले आहेत.',
  learnShowingTopic: 'धडे:',
};

const ml: ExtraStrings = {
  chatLiveBadge: 'തത്സമയ AI മറുപടി',
  chatOfflineBadge: 'ഓഫ്‌ലൈൻ മറുപടി (ഈ ഉപകരണത്തിൽ സേവ് ചെയ്ത വിവരം)',
  chatFallbackBadge: 'ബിൽറ്റ്-ഇൻ മറുപടി (തത്സമയ AI ലഭ്യമായില്ല)',
  chatOfflineNoAnswer:
    'ഈ ചോദ്യത്തിന് നിങ്ങളുടെ ഉപകരണത്തിൽ സേവ് ചെയ്ത മറുപടി കണ്ടില്ല. തത്സമയ AI സേവനത്തോട് ചോദിക്കാൻ ഇന്റർനെറ്റ് കണക്ഷൻ വേണം. വീണ്ടും കണക്റ്റ് ചെയ്ത് ചോദിക്കുക. അടിയന്തര ഘട്ടത്തിൽ എപ്പോഴും 112 വിളിക്കുക.',
  chatServerDownNote:
    'SAHAYINI AI സേവനം ഇപ്പോൾ ലഭ്യമായില്ല (സെർവർ തിരക്കിലായിരിക്കാം), അതിനാൽ ഈ മറുപടി നിങ്ങളുടെ ഉപകരണത്തിൽ സേവ് ചെയ്ത വിവരത്തിൽ നിന്നാണ്.',
  chatAiErrorNote:
    'തത്സമയ AI സേവനത്തിൽ ഇപ്പോൾ പ്രശ്നമുണ്ടായി, അതിനാൽ ഇത് തത്സമയ AI മറുപടിയല്ല, ബിൽറ്റ്-ഇൻ മറുപടിയാണ്.',
  chatServerDownNoAnswer:
    'SAHAYINI AI സേവനം ഇപ്പോൾ ലഭ്യമായില്ല, ഈ ചോദ്യത്തിന് ഉപകരണത്തിൽ സേവ് ചെയ്ത മറുപടിയും ഇല്ല. അൽപ്പസമയം കഴിഞ്ഞ് വീണ്ടും ശ്രമിക്കുക. അടിയന്തര ഘട്ടത്തിൽ 112 വിളിക്കുക.',
  chatOfflineBanner:
    'നിങ്ങൾ ഓഫ്‌ലൈനിലാണ്. ഈ ഉപകരണത്തിൽ സേവ് ചെയ്ത വിവരത്തിൽ നിന്ന് മാത്രമേ മറുപടി ലഭിക്കൂ. മറ്റ് ചോദ്യങ്ങൾക്ക് ഇന്റർനെറ്റ് വേണം.',
  chatErrBadge: 'AI മറുപടി ലഭ്യമല്ല',
  chatErrNotConfigured:
    'SAHAYINI-യുടെ AI സേവനം സെർവറിൽ ശരിയായി സജ്ജീകരിച്ചിട്ടില്ല (API കീ ഇല്ല അല്ലെങ്കിൽ സ്വീകരിച്ചില്ല). സൈറ്റ് ഉടമ സെർവർ ക്രമീകരണങ്ങൾ പരിശോധിക്കണം. നിങ്ങളുടെ ചോദ്യത്തിന് AI മറുപടി നൽകിയിട്ടില്ല. അടിയന്തര സാഹചര്യത്തിൽ 112 വിളിക്കുക.',
  chatErrBusy:
    'SAHAYINI-യുടെ AI സേവനം ഇപ്പോൾ തിരക്കിലാണ് അല്ലെങ്കിൽ ലഭ്യമല്ല. ദയവായി അൽപ്പസമയത്തിന് ശേഷം വീണ്ടും ശ്രമിക്കുക. അടിയന്തര സാഹചര്യത്തിൽ 112 വിളിക്കുക.',
  chatErrNetwork:
    'SAHAYINI സെർവറിൽ എത്തിച്ചേരാനായില്ല. നിങ്ങളുടെ ഇന്റർനെറ്റ് കണക്ഷൻ പരിശോധിച്ച് വീണ്ടും ശ്രമിക്കുക. അടിയന്തര സാഹചര്യത്തിൽ 112 വിളിക്കുക.',
  chatErrModel:
    'SAHAYINI-യുടെ AI മോഡൽ ഈ സെർവറിന്റെ API കീയ്ക്ക് ഇപ്പോൾ ലഭ്യമല്ല. സൈറ്റ് ഉടമ മോഡൽ ക്രമീകരണം പുതുക്കണം. നിങ്ങളുടെ ചോദ്യത്തിന് AI മറുപടി നൽകിയിട്ടില്ല. അടിയന്തര സാഹചര്യത്തിൽ 112 വിളിക്കുക.',
  chatErrRateLimit:
    'SAHAYINI-യുടെ AI താൽക്കാലികമായി ഉപയോഗ പരിധിയിൽ എത്തിയിരിക്കുന്നു. ഒരു മിനിറ്റ് കാത്തിരുന്ന് \'വീണ്ടും ശ്രമിക്കുക\' അമർത്തുക. അടിയന്തര സാഹചര്യത്തിൽ 112 വിളിക്കുക.',
  chatRetry: 'വീണ്ടും ശ്രമിക്കുക',
  scamListen: 'വിശകലനം കേൾക്കുക',
  scamReplay: 'വീണ്ടും കേൾക്കുക',
  scamStopAudio: 'ഓഡിയോ നിർത്തുക',
  scamMeaning: 'ഇതിന്റെ അർത്ഥം',
  scamSigns: 'സംശയാസ്പദമായ സൂചനകൾ',
  scamActions: 'നിങ്ങൾ എന്തു ചെയ്യണം',
  scamRiskWord: { LOW: 'കുറഞ്ഞ', MEDIUM: 'ഇടത്തരം', HIGH: 'ഉയർന്ന', CRITICAL: 'അതീവ ഗുരുതര' },
  scamUncertainty:
    'ഇത് യാന്ത്രിക വിലയിരുത്തലാണ്, തെറ്റാകാം. സന്ദേശം സുരക്ഷിതമാണോ തട്ടിപ്പാണോ എന്ന് ഇതിന് തെളിയിക്കാനാവില്ല. സംശയമുണ്ടെങ്കിൽ നടപടിയെടുക്കരുത്. നിങ്ങൾ സ്വയം കണ്ടെത്തിയ ഔദ്യോഗിക നമ്പറോ വെബ്സൈറ്റോ വഴി ഉറപ്പാക്കുക, അല്ലെങ്കിൽ 1930 വിളിക്കുക.',
  scamNoSigns:
    'അറിയപ്പെടുന്ന തട്ടിപ്പ് രീതികളൊന്നും കണ്ടെത്തിയില്ല, എന്നാൽ അതിനർത്ഥം സന്ദേശം സുരക്ഷിതമാണെന്നല്ല.',
  scamLocalNote:
    'ഓൺലൈൻ വിശകലനം ലഭ്യമായില്ല, അതിനാൽ ഈ ഉപകരണത്തിലെ അടിസ്ഥാന പരിശോധനകൾ മാത്രം ഉപയോഗിച്ചു. ഇവ കുറച്ച് ആഴം കുറഞ്ഞവയാണ്.',
  scamAiBadge: 'AI സഹായത്തോടെയുള്ള വിശകലനം',
  scamLocalBadge: 'ഉപകരണത്തിലെ പരിശോധന മാത്രം',
  scamAudioIntro: 'തട്ടിപ്പ് പരിശോധനാ ഫലം.',
  learnComingSoon: 'ഈ വിഷയത്തിന്റെ കൂടുതൽ പാഠങ്ങൾ ഉടൻ വരും. ലഭ്യമായ എല്ലാ പാഠങ്ങളും കാണിക്കുന്നു.',
  learnShowingTopic: 'പാഠങ്ങൾ:',
};

const gu: ExtraStrings = {
  chatLiveBadge: 'લાઇવ AI જવાબ',
  chatOfflineBadge: 'ઑફલાઇન જવાબ (આ ડિવાઇસ પર સાચવેલી માહિતી)',
  chatFallbackBadge: 'બિલ્ટ-ઇન જવાબ (લાઇવ AI સુધી પહોંચી શકાયું નથી)',
  chatOfflineNoAnswer:
    'આ પ્રશ્નનો સાચવેલો જવાબ તમારા ડિવાઇસ પર મળ્યો નથી. લાઇવ AI સેવાને પૂછવા માટે ઇન્ટરનેટ કનેક્શન જોઈએ. કૃપા કરીને ફરી કનેક્ટ થઈને પૂછો. કટોકટીમાં ગમે ત્યારે 112 ડાયલ કરો.',
  chatServerDownNote:
    'SAHAYINI ની AI સેવા હમણાં મળી શકી નથી (સર્વર વ્યસ્ત હોઈ શકે), તેથી આ જવાબ તમારા ડિવાઇસ પર સાચવેલી માહિતીમાંથી આપ્યો છે.',
  chatAiErrorNote:
    'લાઇવ AI સેવામાં હમણાં સમસ્યા આવી, તેથી આ લાઇવ AI જવાબ નથી પણ બિલ્ટ-ઇન જવાબ છે.',
  chatServerDownNoAnswer:
    'SAHAYINI ની AI સેવા હમણાં મળી શકી નથી અને આ પ્રશ્નનો સાચવેલો જવાબ પણ ડિવાઇસ પર નથી. કૃપા કરીને થોડીવાર પછી ફરી પ્રયાસ કરો. કટોકટીમાં 112 ડાયલ કરો.',
  chatOfflineBanner:
    'તમે ઑફલાઇન છો. જવાબો ફક્ત આ ડિવાઇસ પર સાચવેલી માહિતીમાંથી મળશે. બીજા પ્રશ્નો માટે ઇન્ટરનેટ જોઈએ.',
  chatErrBadge: 'AI જવાબ ઉપલબ્ધ નથી',
  chatErrNotConfigured:
    'SAHAYINI ની AI સેવા સર્વર પર યોગ્ય રીતે સેટ થયેલ નથી (API કી નથી અથવા સ્વીકારાઈ નથી). સાઇટના માલિકે સર્વર સેટિંગ્સ તપાસવા પડશે. તમારા પ્રશ્નનો જવાબ AI એ આપ્યો નથી. કટોકટીમાં 112 પર કૉલ કરો.',
  chatErrBusy:
    'SAHAYINI ની AI સેવા હાલમાં વ્યસ્ત છે અથવા ઉપલબ્ધ નથી. કૃપા કરીને થોડી વાર પછી ફરી પ્રયાસ કરો. કટોકટીમાં 112 પર કૉલ કરો.',
  chatErrNetwork:
    'SAHAYINI સર્વર સુધી પહોંચી શકાયું નથી. કૃપા કરીને તમારું ઇન્ટરનેટ કનેક્શન તપાસો અને ફરી પ્રયાસ કરો. કટોકટીમાં 112 પર કૉલ કરો.',
  chatErrModel:
    'SAHAYINI નું AI મોડેલ આ સર્વરની API કી માટે હાલમાં ઉપલબ્ધ નથી. સાઇટના માલિકે મોડેલ સેટિંગ અપડેટ કરવી પડશે. તમારા પ્રશ્નનો જવાબ AI એ આપ્યો નથી. કટોકટીમાં 112 પર કૉલ કરો.',
  chatErrRateLimit:
    'SAHAYINI ના AI ની ઉપયોગ મર્યાદા હાલ પૂરી થઈ ગઈ છે. કૃપા કરીને એક મિનિટ રાહ જુઓ અને \'ફરી પ્રયાસ કરો\' દબાવો. કટોકટીમાં 112 પર કૉલ કરો.',
  chatRetry: 'ફરી પ્રયાસ કરો',
  scamListen: 'વિશ્લેષણ સાંભળો',
  scamReplay: 'ફરી સાંભળો',
  scamStopAudio: 'ઑડિયો બંધ કરો',
  scamMeaning: 'તેનો અર્થ',
  scamSigns: 'શંકાસ્પદ સંકેતો',
  scamActions: 'તમારે શું કરવું જોઈએ',
  scamRiskWord: { LOW: 'ઓછું', MEDIUM: 'મધ્યમ', HIGH: 'ઊંચું', CRITICAL: 'ગંભીર' },
  scamUncertainty:
    'આ સ્વચાલિત મૂલ્યાંકન છે અને ખોટું હોઈ શકે. સંદેશ સુરક્ષિત છે કે છેતરપિંડી તે સાબિત કરી શકતું નથી. શંકા હોય તો કાર્યવાહી ન કરો. જાતે શોધેલા અધિકૃત નંબર કે વેબસાઇટથી ખાતરી કરો, અથવા 1930 પર કૉલ કરો.',
  scamNoSigns:
    'કોઈ જાણીતી છેતરપિંડીની પેટર્ન મળી નથી, પરંતુ તેનો અર્થ એ નથી કે સંદેશ સુરક્ષિત છે.',
  scamLocalNote:
    'ઑનલાઇન વિશ્લેષણ ઉપલબ્ધ ન હતું, તેથી ફક્ત આ ડિવાઇસ પરની મૂળભૂત તપાસ વપરાઈ. તે ઓછી ઊંડી છે.',
  scamAiBadge: 'AI-સહાયિત વિશ્લેષણ',
  scamLocalBadge: 'ફક્ત ડિવાઇસ પરની તપાસ',
  scamAudioIntro: 'છેતરપિંડી તપાસનું પરિણામ.',
  learnComingSoon: 'આ વિષયના વધુ પાઠ ટૂંક સમયમાં આવશે. ઉપલબ્ધ બધા પાઠ બતાવ્યા છે.',
  learnShowingTopic: 'પાઠ:',
};

const kn: ExtraStrings = {
  chatLiveBadge: 'ಲೈವ್ AI ಉತ್ತರ',
  chatOfflineBadge: 'ಆಫ್‌ಲೈನ್ ಉತ್ತರ (ಈ ಸಾಧನದಲ್ಲಿ ಉಳಿಸಿದ ಮಾಹಿತಿ)',
  chatFallbackBadge: 'ಅಂತರ್ನಿರ್ಮಿತ ಉತ್ತರ (ಲೈವ್ AI ತಲುಪಲಿಲ್ಲ)',
  chatOfflineNoAnswer:
    'ಈ ಪ್ರಶ್ನೆಗೆ ನಿಮ್ಮ ಸಾಧನದಲ್ಲಿ ಉಳಿಸಿದ ಉತ್ತರ ಸಿಗಲಿಲ್ಲ. ಲೈವ್ AI ಸೇವೆಯನ್ನು ಕೇಳಲು ಇಂಟರ್ನೆಟ್ ಸಂಪರ್ಕ ಬೇಕು. ಮತ್ತೆ ಸಂಪರ್ಕಿಸಿ ಕೇಳಿ. ತುರ್ತು ಸಂದರ್ಭದಲ್ಲಿ ಯಾವಾಗಲೂ 112 ಗೆ ಕರೆ ಮಾಡಿ.',
  chatServerDownNote:
    'SAHAYINI AI ಸೇವೆ ಈಗ ಲಭ್ಯವಾಗಲಿಲ್ಲ (ಸರ್ವರ್ ಬ್ಯುಸಿ ಆಗಿರಬಹುದು), ಆದ್ದರಿಂದ ಈ ಉತ್ತರ ನಿಮ್ಮ ಸಾಧನದಲ್ಲಿ ಉಳಿಸಿದ ಮಾಹಿತಿಯಿಂದ ಬಂದಿದೆ.',
  chatAiErrorNote:
    'ಲೈವ್ AI ಸೇವೆಯಲ್ಲಿ ಈಗ ಸಮಸ್ಯೆ ಆಯಿತು, ಆದ್ದರಿಂದ ಇದು ಲೈವ್ AI ಉತ್ತರವಲ್ಲ, ಅಂತರ್ನಿರ್ಮಿತ ಉತ್ತರ.',
  chatServerDownNoAnswer:
    'SAHAYINI AI ಸೇವೆ ಈಗ ಲಭ್ಯವಾಗಲಿಲ್ಲ, ಈ ಪ್ರಶ್ನೆಗೆ ಸಾಧನದಲ್ಲಿ ಉಳಿಸಿದ ಉತ್ತರವೂ ಇಲ್ಲ. ಸ್ವಲ್ಪ ಸಮಯದ ನಂತರ ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ. ತುರ್ತು ಸಂದರ್ಭದಲ್ಲಿ 112 ಗೆ ಕರೆ ಮಾಡಿ.',
  chatOfflineBanner:
    'ನೀವು ಆಫ್‌ಲೈನ್‌ನಲ್ಲಿದ್ದೀರಿ. ಈ ಸಾಧನದಲ್ಲಿ ಉಳಿಸಿದ ಮಾಹಿತಿಯಿಂದ ಮಾತ್ರ ಉತ್ತರ ಸಿಗುತ್ತದೆ. ಇತರ ಪ್ರಶ್ನೆಗಳಿಗೆ ಇಂಟರ್ನೆಟ್ ಬೇಕು.',
  chatErrBadge: 'AI ಉತ್ತರ ಲಭ್ಯವಿಲ್ಲ',
  chatErrNotConfigured:
    'SAHAYINI ಯ AI ಸೇವೆ ಸರ್ವರ್‌ನಲ್ಲಿ ಸರಿಯಾಗಿ ಸೆಟ್ ಆಗಿಲ್ಲ (API ಕೀ ಇಲ್ಲ ಅಥವಾ ಸ್ವೀಕರಿಸಲಾಗಿಲ್ಲ). ಸೈಟ್ ಮಾಲೀಕರು ಸರ್ವರ್ ಸೆಟ್ಟಿಂಗ್‌ಗಳನ್ನು ಪರಿಶೀಲಿಸಬೇಕು. ನಿಮ್ಮ ಪ್ರಶ್ನೆಗೆ AI ಉತ್ತರ ನೀಡಿಲ್ಲ. ತುರ್ತು ಸಂದರ್ಭದಲ್ಲಿ 112 ಕ್ಕೆ ಕರೆ ಮಾಡಿ.',
  chatErrBusy:
    'SAHAYINI ಯ AI ಸೇವೆ ಈಗ ಬ್ಯುಸಿಯಾಗಿದೆ ಅಥವಾ ಲಭ್ಯವಿಲ್ಲ. ದಯವಿಟ್ಟು ಸ್ವಲ್ಪ ಸಮಯದ ನಂತರ ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ. ತುರ್ತು ಸಂದರ್ಭದಲ್ಲಿ 112 ಕ್ಕೆ ಕರೆ ಮಾಡಿ.',
  chatErrNetwork:
    'SAHAYINI ಸರ್ವರ್ ತಲುಪಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ. ದಯವಿಟ್ಟು ನಿಮ್ಮ ಇಂಟರ್ನೆಟ್ ಸಂಪರ್ಕ ಪರಿಶೀಲಿಸಿ ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ. ತುರ್ತು ಸಂದರ್ಭದಲ್ಲಿ 112 ಕ್ಕೆ ಕರೆ ಮಾಡಿ.',
  chatErrModel:
    'SAHAYINI ಯ AI ಮಾದರಿ ಈ ಸರ್ವರ್‌ನ API ಕೀಗೆ ಈಗ ಲಭ್ಯವಿಲ್ಲ. ಸೈಟ್ ಮಾಲೀಕರು ಮಾದರಿ ಸೆಟ್ಟಿಂಗ್ ನವೀಕರಿಸಬೇಕು. ನಿಮ್ಮ ಪ್ರಶ್ನೆಗೆ AI ಉತ್ತರ ನೀಡಿಲ್ಲ. ತುರ್ತು ಸಂದರ್ಭದಲ್ಲಿ 112 ಕ್ಕೆ ಕರೆ ಮಾಡಿ.',
  chatErrRateLimit:
    'SAHAYINI ಯ AI ತಾತ್ಕಾಲಿಕವಾಗಿ ಬಳಕೆ ಮಿತಿ ತಲುಪಿದೆ. ದಯವಿಟ್ಟು ಒಂದು ನಿಮಿಷ ಕಾದು \'ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ\' ಒತ್ತಿ. ತುರ್ತು ಸಂದರ್ಭದಲ್ಲಿ 112 ಕ್ಕೆ ಕರೆ ಮಾಡಿ.',
  chatRetry: 'ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ',
  scamListen: 'ವಿಶ್ಲೇಷಣೆ ಕೇಳಿ',
  scamReplay: 'ಮತ್ತೆ ಕೇಳಿ',
  scamStopAudio: 'ಆಡಿಯೋ ನಿಲ್ಲಿಸಿ',
  scamMeaning: 'ಇದರ ಅರ್ಥ',
  scamSigns: 'ಅನುಮಾನಾಸ್ಪದ ಸೂಚನೆಗಳು',
  scamActions: 'ನೀವು ಏನು ಮಾಡಬೇಕು',
  scamRiskWord: { LOW: 'ಕಡಿಮೆ', MEDIUM: 'ಮಧ್ಯಮ', HIGH: 'ಹೆಚ್ಚು', CRITICAL: 'ತೀವ್ರ' },
  scamUncertainty:
    'ಇದು ಸ್ವಯಂಚಾಲಿತ ಮೌಲ್ಯಮಾಪನ ಮತ್ತು ತಪ್ಪಾಗಿರಬಹುದು. ಸಂದೇಶ ಸುರಕ್ಷಿತವೇ ಅಥವಾ ವಂಚನೆಯೇ ಎಂದು ಇದು ಸಾಬೀತುಪಡಿಸಲಾಗದು. ಸಂದೇಹವಿದ್ದರೆ ಕ್ರಮ ಕೈಗೊಳ್ಳಬೇಡಿ. ನೀವೇ ಹುಡುಕಿದ ಅಧಿಕೃತ ಸಂಖ್ಯೆ ಅಥವಾ ವೆಬ್‌ಸೈಟ್ ಮೂಲಕ ಖಚಿತಪಡಿಸಿಕೊಳ್ಳಿ, ಅಥವಾ 1930 ಗೆ ಕರೆ ಮಾಡಿ.',
  scamNoSigns:
    'ಯಾವುದೇ ತಿಳಿದ ವಂಚನೆ ಮಾದರಿಗಳು ಕಂಡುಬಂದಿಲ್ಲ, ಆದರೆ ಅದರ ಅರ್ಥ ಸಂದೇಶ ಸುರಕ್ಷಿತ ಎಂದಲ್ಲ.',
  scamLocalNote:
    'ಆನ್‌ಲೈನ್ ವಿಶ್ಲೇಷಣೆ ಲಭ್ಯವಿರಲಿಲ್ಲ, ಆದ್ದರಿಂದ ಈ ಸಾಧನದ ಮೂಲ ಪರಿಶೀಲನೆಗಳನ್ನು ಮಾತ್ರ ಬಳಸಲಾಗಿದೆ. ಇವು ಕಡಿಮೆ ಆಳವಾದವು.',
  scamAiBadge: 'AI ಸಹಾಯದ ವಿಶ್ಲೇಷಣೆ',
  scamLocalBadge: 'ಸಾಧನದ ಪರಿಶೀಲನೆ ಮಾತ್ರ',
  scamAudioIntro: 'ವಂಚನೆ ಪರಿಶೀಲನೆಯ ಫಲಿತಾಂಶ.',
  learnComingSoon: 'ಈ ವಿಷಯದ ಇನ್ನಷ್ಟು ಪಾಠಗಳು ಶೀಘ್ರದಲ್ಲೇ ಬರಲಿವೆ. ಲಭ್ಯವಿರುವ ಎಲ್ಲಾ ಪಾಠಗಳನ್ನು ತೋರಿಸಲಾಗಿದೆ.',
  learnShowingTopic: 'ಪಾಠಗಳು:',
};

const EXTRA_STRINGS: Record<LanguageCode, ExtraStrings> = { en, ta, hi, te, mr, ml, gu, kn };

export function getExtraStrings(lang: LanguageCode): ExtraStrings {
  return EXTRA_STRINGS[lang] || en;
}
