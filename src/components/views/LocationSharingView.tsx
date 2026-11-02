import React from 'react';
import { MapPin, ShieldCheck } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { CaptureLocationCard } from '../common/CaptureLocationCard';
import { NearbyPoliceCard } from '../common/NearbyPoliceCard';
import { LiveShareCard } from '../sos/LiveShareCard';
import { useLiveLocation } from '../../hooks/useLiveLocation';
import { useSosRecipients } from '../../hooks/useSosRecipients';

const labels: Record<string, { title: string; intro: string; safety: string }> = {
  en: { title: 'Share Your Location', intro: 'Choose when to share your current location with trusted contacts. SAHAYINI prepares a message for you; you must review and send it yourself.', safety: 'Your location is only accessed after you choose to request it.' },
  ta: { title: 'உங்கள் இருப்பிடத்தைப் பகிரவும்', intro: 'நம்பகமான தொடர்புகளுடன் தற்போதைய இருப்பிடத்தைப் பகிர தேர்வு செய்யுங்கள். SAHAYINI செய்தியைத் தயாரிக்கும்; அதை நீங்கள் சரிபார்த்து அனுப்ப வேண்டும்.', safety: 'நீங்கள் அனுமதித்து கோரிய பிறகே இருப்பிடம் பெறப்படும்.' },
  hi: { title: 'अपना स्थान साझा करें', intro: 'विश्वसनीय संपर्कों के साथ अपना वर्तमान स्थान साझा करें। SAHAYINI संदेश तैयार करेगा; समीक्षा करके आपको स्वयं भेजना होगा।', safety: 'आपके अनुरोध और अनुमति के बाद ही स्थान लिया जाएगा।' },
  te: { title: 'మీ స్థానాన్ని పంచుకోండి', intro: 'నమ్మకమైన పరిచయాలతో ప్రస్తుత స్థానాన్ని పంచుకోవడానికి ఎంచుకోండి. SAHAYINI సందేశాన్ని సిద్ధం చేస్తుంది; మీరు పరిశీలించి పంపాలి.', safety: 'మీరు అనుమతించి అభ్యర్థించిన తర్వాతే స్థానం పొందబడుతుంది.' },
  mr: { title: 'तुमचे स्थान शेअर करा', intro: 'विश्वासू संपर्कांसोबत सध्याचे स्थान शेअर करा. SAHAYINI संदेश तयार करेल; तो तपासून तुम्ही स्वतः पाठवावा.', safety: 'तुमच्या विनंतीनंतर आणि परवानगीनंतरच स्थान घेतले जाईल.' },
  ml: { title: 'നിങ്ങളുടെ സ്ഥാനം പങ്കിടുക', intro: 'വിശ്വസനീയ കോൺടാക്റ്റുകളുമായി നിലവിലെ സ്ഥാനം പങ്കിടാം. SAHAYINI സന്ദേശം തയ്യാറാക്കും; പരിശോധിച്ച് നിങ്ങൾ തന്നെ അയയ്ക്കണം.', safety: 'നിങ്ങളുടെ അനുമതിയോടെയും അഭ്യർത്ഥനയ്ക്കുശേഷവും മാത്രമേ സ്ഥാനം ലഭിക്കൂ.' },
  gu: { title: 'તમારું સ્થાન શેર કરો', intro: 'વિશ્વાસપાત્ર સંપર્કો સાથે વર્તમાન સ્થાન શેર કરો. SAHAYINI સંદેશ તૈયાર કરશે; તપાસીને તમારે જાતે મોકલવો પડશે.', safety: 'તમારી વિનંતી અને પરવાનગી પછી જ સ્થાન મેળવવામાં આવશે.' },
  kn: { title: 'ನಿಮ್ಮ ಸ್ಥಳವನ್ನು ಹಂಚಿಕೊಳ್ಳಿ', intro: 'ನಂಬಿಕಸ್ತ ಸಂಪರ್ಕಗಳೊಂದಿಗೆ ಪ್ರಸ್ತುತ ಸ್ಥಳವನ್ನು ಹಂಚಿಕೊಳ್ಳಿ. SAHAYINI ಸಂದೇಶ ಸಿದ್ಧಪಡಿಸುತ್ತದೆ; ಪರಿಶೀಲಿಸಿ ನೀವೇ ಕಳುಹಿಸಬೇಕು.', safety: 'ನಿಮ್ಮ ಅನುಮತಿ ಮತ್ತು ವಿನಂತಿಯ ನಂತರ ಮಾತ್ರ ಸ್ಥಳ ಪಡೆಯಲಾಗುತ್ತದೆ.' },
};
export const LocationSharingView: React.FC = () => {
  const { language } = useApp(); const text = labels[language] || labels.en;
  // Same live-sharing hook and card as the SOS page (start/stop, periodic coordinate updates while the page is open).
  const live = useLiveLocation();
  const recipients = useSosRecipients();
  return <div className="max-w-4xl mx-auto px-4 py-6 space-y-5">
    <header className="rounded-3xl border border-indigo-200 bg-gradient-to-r from-indigo-50 via-white to-emerald-50 p-5 sm:p-7">
      <div className="flex items-center gap-3"><div className="rounded-2xl bg-indigo-100 p-3 text-indigo-700"><MapPin className="h-7 w-7" /></div><h1 className="text-2xl font-extrabold text-[#0A2E65]">{text.title}</h1></div>
      <p className="mt-3 text-sm text-slate-700">{text.intro}</p><p className="mt-2 flex gap-2 text-xs text-slate-600"><ShieldCheck className="h-4 w-4 shrink-0" />{text.safety}</p>
    </header>
    <CaptureLocationCard />
    <LiveShareCard live={live} recipients={recipients} language={language} />
    <NearbyPoliceCard />
  </div>;
};
