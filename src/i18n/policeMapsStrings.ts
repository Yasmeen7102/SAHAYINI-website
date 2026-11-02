import { LanguageCode } from '../types';

/**
 * Small, neutral messages for the shared "Find Nearby Police Stations" button (SOS, Share Your Location,
 * Complaint & FIR Support). Native-speaker review is recommended for non-English text.
 */
export interface PoliceMapsStrings {
  opening: string;
  noteGeneral: string;
  noteBlocked: string;
  openLink: string;
  notAlert: string;
}

const en: PoliceMapsStrings = {
  opening: 'Opening Google Maps…',
  noteGeneral: 'Your exact location was not available, so a general police-station search was opened. Allow location access, or check the area on the map.',
  noteBlocked: 'Your browser blocked the new tab. Use the link below to open Google Maps.',
  openLink: 'Open police stations in Google Maps',
  notAlert: 'Searching for a station does not alert the police. In an emergency, call 112.',
};

const ta: PoliceMapsStrings = {
  opening: 'Google Maps திறக்கப்படுகிறது…',
  noteGeneral: 'உங்கள் துல்லியமான இருப்பிடம் கிடைக்கவில்லை, எனவே பொதுவான காவல் நிலையத் தேடல் திறக்கப்பட்டது. இருப்பிட அனுமதியை வழங்கவும், அல்லது வரைபடத்தில் பகுதியைச் சரிபார்க்கவும்.',
  noteBlocked: 'உங்கள் உலாவி புதிய தாவலைத் தடுத்துவிட்டது. Google Maps ஐத் திறக்க கீழே உள்ள இணைப்பைப் பயன்படுத்தவும்.',
  openLink: 'Google Maps இல் காவல் நிலையங்களைத் திற',
  notAlert: 'காவல் நிலையத்தைத் தேடுவது காவல்துறைக்கு எச்சரிக்கை அனுப்பாது. அவசரத்தில் 112 ஐ அழைக்கவும்.',
};

const hi: PoliceMapsStrings = {
  opening: 'Google Maps खुल रहा है…',
  noteGeneral: 'आपका सटीक स्थान उपलब्ध नहीं था, इसलिए थानों की सामान्य खोज खोली गई। स्थान की अनुमति दें, या मानचित्र पर इलाका जाँचें।',
  noteBlocked: 'आपके ब्राउज़र ने नया टैब रोक दिया। Google Maps खोलने के लिए नीचे दिया लिंक इस्तेमाल करें।',
  openLink: 'Google Maps में थाने खोलें',
  notAlert: 'थाना खोजने से पुलिस को सूचना नहीं जाती। आपातकाल में 112 पर कॉल करें।',
};

const te: PoliceMapsStrings = {
  opening: 'Google Maps తెరవబడుతోంది…',
  noteGeneral: 'మీ ఖచ్చితమైన స్థానం అందుబాటులో లేదు, కాబట్టి పోలీస్ స్టేషన్ల సాధారణ శోధన తెరవబడింది. స్థాన అనుమతిని ఇవ్వండి, లేదా మ్యాప్‌లో ప్రాంతాన్ని సరిచూసుకోండి.',
  noteBlocked: 'మీ బ్రౌజర్ కొత్త ట్యాబ్‌ను నిరోధించింది. Google Maps తెరవడానికి కింద ఉన్న లింక్‌ను ఉపయోగించండి.',
  openLink: 'Google Mapsలో పోలీస్ స్టేషన్లను తెరవండి',
  notAlert: 'స్టేషన్ కోసం వెతకడం వల్ల పోలీసులకు సమాచారం వెళ్లదు. అత్యవసరంలో 112కు కాల్ చేయండి.',
};

const mr: PoliceMapsStrings = {
  opening: 'Google Maps उघडत आहे…',
  noteGeneral: 'तुमचे अचूक स्थान उपलब्ध नव्हते, म्हणून पोलीस ठाण्यांचा सर्वसाधारण शोध उघडला. स्थानाची परवानगी द्या, किंवा नकाशावर परिसर तपासा.',
  noteBlocked: 'तुमच्या ब्राउझरने नवीन टॅब रोखला. Google Maps उघडण्यासाठी खालील लिंक वापरा.',
  openLink: 'Google Maps मध्ये पोलीस ठाणी उघडा',
  notAlert: 'ठाणे शोधल्याने पोलिसांना सूचना जात नाही. आणीबाणीत 112 वर कॉल करा.',
};

const ml: PoliceMapsStrings = {
  opening: 'Google Maps തുറക്കുന്നു…',
  noteGeneral: 'നിങ്ങളുടെ കൃത്യമായ സ്ഥാനം ലഭ്യമായില്ല, അതിനാൽ പോലീസ് സ്റ്റേഷനുകളുടെ പൊതുവായ തിരയൽ തുറന്നു. ലൊക്കേഷൻ അനുമതി നൽകുക, അല്ലെങ്കിൽ മാപ്പിൽ പ്രദേശം പരിശോധിക്കുക.',
  noteBlocked: 'നിങ്ങളുടെ ബ്രൗസർ പുതിയ ടാബ് തടഞ്ഞു. Google Maps തുറക്കാൻ താഴെയുള്ള ലിങ്ക് ഉപയോഗിക്കുക.',
  openLink: 'Google Maps-ൽ പോലീസ് സ്റ്റേഷനുകൾ തുറക്കുക',
  notAlert: 'സ്റ്റേഷൻ തിരഞ്ഞാൽ പോലീസിന് അറിയിപ്പ് പോകില്ല. അടിയന്തര സാഹചര്യത്തിൽ 112 ലേക്ക് വിളിക്കുക.',
};

const gu: PoliceMapsStrings = {
  opening: 'Google Maps ખુલી રહ્યું છે…',
  noteGeneral: 'તમારું ચોક્કસ સ્થાન ઉપલબ્ધ ન હતું, તેથી પોલીસ સ્ટેશનોની સામાન્ય શોધ ખોલવામાં આવી. સ્થાનની પરવાનગી આપો, અથવા નકશા પર વિસ્તાર તપાસો.',
  noteBlocked: 'તમારા બ્રાઉઝરે નવું ટેબ અટકાવ્યું. Google Maps ખોલવા માટે નીચેની લિંકનો ઉપયોગ કરો.',
  openLink: 'Google Maps માં પોલીસ સ્ટેશન ખોલો',
  notAlert: 'સ્ટેશન શોધવાથી પોલીસને જાણ થતી નથી. કટોકટીમાં 112 પર કૉલ કરો.',
};

const kn: PoliceMapsStrings = {
  opening: 'Google Maps ತೆರೆಯಲಾಗುತ್ತಿದೆ…',
  noteGeneral: 'ನಿಮ್ಮ ನಿಖರ ಸ್ಥಳ ಲಭ್ಯವಿರಲಿಲ್ಲ, ಆದ್ದರಿಂದ ಪೊಲೀಸ್ ಠಾಣೆಗಳ ಸಾಮಾನ್ಯ ಹುಡುಕಾಟ ತೆರೆಯಲಾಗಿದೆ. ಸ್ಥಳ ಅನುಮತಿ ನೀಡಿ, ಅಥವಾ ನಕ್ಷೆಯಲ್ಲಿ ಪ್ರದೇಶ ಪರಿಶೀಲಿಸಿ.',
  noteBlocked: 'ನಿಮ್ಮ ಬ್ರೌಸರ್ ಹೊಸ ಟ್ಯಾಬ್ ತಡೆದಿದೆ. Google Maps ತೆರೆಯಲು ಕೆಳಗಿನ ಲಿಂಕ್ ಬಳಸಿ.',
  openLink: 'Google Maps ನಲ್ಲಿ ಪೊಲೀಸ್ ಠಾಣೆಗಳನ್ನು ತೆರೆಯಿರಿ',
  notAlert: 'ಠಾಣೆಯನ್ನು ಹುಡುಕುವುದರಿಂದ ಪೊಲೀಸರಿಗೆ ಮಾಹಿತಿ ಹೋಗುವುದಿಲ್ಲ. ತುರ್ತು ಸಂದರ್ಭದಲ್ಲಿ 112 ಗೆ ಕರೆ ಮಾಡಿ.',
};

const ALL: Record<LanguageCode, PoliceMapsStrings> = { en, ta, hi, te, mr, ml, gu, kn };

export function getPoliceMapsStrings(lang: LanguageCode): PoliceMapsStrings {
  return ALL[lang] || en;
}

export const POLICE_MAPS_LANGUAGES = Object.keys(ALL) as LanguageCode[];
