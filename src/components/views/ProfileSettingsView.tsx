import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { LANGUAGES } from '../../i18n/translations';
import { LanguageCode, ThemeMode, TextScale } from '../../types';
import {
  User,
  Settings,
  Globe,
  Sun,
  Moon,
  Eye,
  Type,
  Bookmark,
  Database,
  Trash2,
  ShieldCheck,
  Check,
  MapPin,
  Phone,
  Briefcase,
  LogOut,
  Sparkles,
} from 'lucide-react';
import { Logo } from '../common/Logo';


const PROFILE_UI: Record<string, Record<string,string>> = {
 en:{subtitle:'Manage your personal preferences, saved bookmarks, language, and accessibility display.',language:'Platform Language',languageDesc:'Choose from 8 Indian languages supported across SAHAYINI.',appearance:'Appearance & Accessibility Settings',theme:'Display Theme',light:'Light Mode',dark:'Dark Mode',contrast:'High Contrast',font:'Font Size (Accessibility)',normal:'Default (A)',large:'Large (A+)',xlarge:'Extra Large (A++)',saved:'Saved Data & Offline Cache',schemes:'Saved Government Schemes',bookmarked:'schemes bookmarked',view:'View →',lessons:'Completed Lessons',modules:'modules completed',learn:'Learn →',reset:'Reset Demo Data',cleared:'Data Cleared!',guest:'Guest User',signIn:'Sign In',create:'Create Account'},
 ta:{subtitle:'உங்கள் விருப்பங்கள், சேமித்தவை, மொழி மற்றும் அணுகல்தன்மை அமைப்புகளை நிர்வகிக்கவும்.',language:'தள மொழி',languageDesc:'SAHAYINI ஆதரிக்கும் 8 இந்திய மொழிகளில் தேர்வு செய்யவும்.',appearance:'தோற்றம் மற்றும் அணுகல்தன்மை அமைப்புகள்',theme:'காட்சி தீம்',light:'ஒளி பயன்முறை',dark:'இருள் பயன்முறை',contrast:'உயர் மாறுபாடு',font:'எழுத்துரு அளவு',normal:'இயல்பு (A)',large:'பெரியது (A+)',xlarge:'மிகப் பெரியது (A++)',saved:'சேமித்த தரவு மற்றும் ஆஃப்லைன் கேச்',schemes:'சேமித்த அரசு திட்டங்கள்',bookmarked:'திட்டங்கள் சேமிக்கப்பட்டன',view:'பார் →',lessons:'முடித்த பாடங்கள்',modules:'பாடங்கள் முடிக்கப்பட்டன',learn:'கற்க →',reset:'சோதனைத் தரவை மீட்டமை',cleared:'தரவு அழிக்கப்பட்டது!',guest:'விருந்தினர்',signIn:'உள்நுழை',create:'கணக்கை உருவாக்கு'},
 hi:{subtitle:'अपनी प्राथमिकताएँ, सहेजे गए आइटम, भाषा और सुगम्यता सेटिंग प्रबंधित करें।',language:'प्लेटफ़ॉर्म भाषा',languageDesc:'SAHAYINI में उपलब्ध 8 भारतीय भाषाओं में से चुनें।',appearance:'रूप और सुगम्यता सेटिंग',theme:'डिस्प्ले थीम',light:'लाइट मोड',dark:'डार्क मोड',contrast:'हाई कॉन्ट्रास्ट',font:'फ़ॉन्ट आकार',normal:'डिफ़ॉल्ट (A)',large:'बड़ा (A+)',xlarge:'बहुत बड़ा (A++)',saved:'सहेजा डेटा और ऑफ़लाइन कैश',schemes:'सहेजी सरकारी योजनाएँ',bookmarked:'योजनाएँ सहेजी गईं',view:'देखें →',lessons:'पूरे किए गए पाठ',modules:'मॉड्यूल पूरे हुए',learn:'सीखें →',reset:'डेमो डेटा रीसेट करें',cleared:'डेटा साफ़ हुआ!',guest:'अतिथि उपयोगकर्ता',signIn:'साइन इन',create:'खाता बनाएँ'},
 te:{subtitle:'మీ ప్రాధాన్యతలు, సేవ్ చేసినవి, భాష మరియు యాక్సెసిబిలిటీ సెట్టింగ్‌లను నిర్వహించండి.',language:'ప్లాట్‌ఫారమ్ భాష',languageDesc:'SAHAYINI మద్దతిచ్చే 8 భారతీయ భాషల్లో ఎంచుకోండి.',appearance:'రూపం మరియు యాక్సెసిబిలిటీ సెట్టింగ్‌లు',theme:'డిస్‌ప్లే థీమ్',light:'లైట్ మోడ్',dark:'డార్క్ మోడ్',contrast:'హై కాంట్రాస్ట్',font:'ఫాంట్ పరిమాణం',normal:'డిఫాల్ట్ (A)',large:'పెద్దది (A+)',xlarge:'చాలా పెద్దది (A++)',saved:'సేవ్ చేసిన డేటా మరియు ఆఫ్‌లైన్ క్యాష్',schemes:'సేవ్ చేసిన ప్రభుత్వ పథకాలు',bookmarked:'పథకాలు బుక్‌మార్క్ చేశాయి',view:'చూడండి →',lessons:'పూర్తయిన పాఠాలు',modules:'మాడ్యూల్స్ పూర్తయ్యాయి',learn:'నేర్చుకోండి →',reset:'డెమో డేటాను రీసెట్ చేయండి',cleared:'డేటా తొలగించబడింది!',guest:'అతిథి వినియోగదారు',signIn:'సైన్ ఇన్',create:'ఖాతా సృష్టించండి'},
 mr:{subtitle:'तुमची प्राधान्ये, जतन केलेले आयटम, भाषा आणि प्रवेशयोग्यता सेटिंग्ज व्यवस्थापित करा.',language:'प्लॅटफॉर्म भाषा',languageDesc:'SAHAYINI मधील 8 भारतीय भाषांपैकी निवडा.',appearance:'दिसणे आणि प्रवेशयोग्यता सेटिंग्ज',theme:'डिस्प्ले थीम',light:'लाइट मोड',dark:'डार्क मोड',contrast:'हाय कॉन्ट्रास्ट',font:'फॉन्ट आकार',normal:'डीफॉल्ट (A)',large:'मोठा (A+)',xlarge:'अतिमोठा (A++)',saved:'जतन केलेला डेटा आणि ऑफलाइन कॅशे',schemes:'जतन केलेल्या सरकारी योजना',bookmarked:'योजना जतन केल्या',view:'पहा →',lessons:'पूर्ण केलेले धडे',modules:'मॉड्यूल पूर्ण',learn:'शिका →',reset:'डेमो डेटा रीसेट करा',cleared:'डेटा साफ केला!',guest:'अतिथी वापरकर्ता',signIn:'साइन इन',create:'खाते तयार करा'},
 ml:{subtitle:'നിങ്ങളുടെ മുൻഗണനകൾ, സേവ് ചെയ്തവ, ഭാഷ, പ്രവേശനക്ഷമത ക്രമീകരണങ്ങൾ നിയന്ത്രിക്കുക.',language:'പ്ലാറ്റ്ഫോം ഭാഷ',languageDesc:'SAHAYINI പിന്തുണയ്ക്കുന്ന 8 ഇന്ത്യൻ ഭാഷകളിൽ നിന്ന് തിരഞ്ഞെടുക്കുക.',appearance:'രൂപവും പ്രവേശനക്ഷമത ക്രമീകരണങ്ങളും',theme:'ഡിസ്‌പ്ലേ തീം',light:'ലൈറ്റ് മോഡ്',dark:'ഡാർക്ക് മോഡ്',contrast:'ഹൈ കോൺട്രാസ്റ്റ്',font:'ഫോണ്ട് വലുപ്പം',normal:'ഡിഫോൾട്ട് (A)',large:'വലുത് (A+)',xlarge:'വളരെ വലുത് (A++)',saved:'സേവ് ചെയ്ത ഡാറ്റയും ഓഫ്‌ലൈൻ കാഷെയും',schemes:'സേവ് ചെയ്ത സർക്കാർ പദ്ധതികൾ',bookmarked:'പദ്ധതികൾ ബുക്ക്‌മാർക്ക് ചെയ്തു',view:'കാണുക →',lessons:'പൂർത്തിയാക്കിയ പാഠങ്ങൾ',modules:'മൊഡ്യൂളുകൾ പൂർത്തിയായി',learn:'പഠിക്കുക →',reset:'ഡെമോ ഡാറ്റ റീസെറ്റ് ചെയ്യുക',cleared:'ഡാറ്റ മായിച്ചു!',guest:'അതിഥി ഉപയോക്താവ്',signIn:'സൈൻ ഇൻ',create:'അക്കൗണ്ട് സൃഷ്ടിക്കുക'},
 gu:{subtitle:'તમારી પસંદગીઓ, સેવ કરેલી વસ્તુઓ, ભાષા અને સુલભતા સેટિંગ્સ સંચાલિત કરો.',language:'પ્લેટફોર્મ ભાષા',languageDesc:'SAHAYINI દ્વારા સમર્થિત 8 ભારતીય ભાષામાંથી પસંદ કરો.',appearance:'દેખાવ અને સુલભતા સેટિંગ્સ',theme:'ડિસ્પ્લે થીમ',light:'લાઇટ મોડ',dark:'ડાર્ક મોડ',contrast:'હાઇ કોન્ટ્રાસ્ટ',font:'ફૉન્ટ કદ',normal:'ડિફૉલ્ટ (A)',large:'મોટું (A+)',xlarge:'ખૂબ મોટું (A++)',saved:'સેવ કરેલો ડેટા અને ઑફલાઇન કૅશ',schemes:'સેવ કરેલી સરકારી યોજનાઓ',bookmarked:'યોજનાઓ બુકમાર્ક કરી',view:'જુઓ →',lessons:'પૂર્ણ કરેલા પાઠ',modules:'મોડ્યુલ પૂર્ણ',learn:'શીખો →',reset:'ડેમો ડેટા રીસેટ કરો',cleared:'ડેટા સાફ થયો!',guest:'અતિથિ વપરાશકર્તા',signIn:'સાઇન ઇન',create:'ખાતું બનાવો'},
 kn:{subtitle:'ನಿಮ್ಮ ಆದ್ಯತೆಗಳು, ಉಳಿಸಿದವು, ಭಾಷೆ ಮತ್ತು ಪ್ರವೇಶಸೌಲಭ್ಯ ಸೆಟ್ಟಿಂಗ್‌ಗಳನ್ನು ನಿರ್ವಹಿಸಿ.',language:'ಪ್ಲಾಟ್‌ಫಾರ್ಮ್ ಭಾಷೆ',languageDesc:'SAHAYINI ಬೆಂಬಲಿಸುವ 8 ಭಾರತೀಯ ಭಾಷೆಗಳಲ್ಲಿ ಆಯ್ಕೆಮಾಡಿ.',appearance:'ಗೋಚರತೆ ಮತ್ತು ಪ್ರವೇಶಸೌಲಭ್ಯ ಸೆಟ್ಟಿಂಗ್‌ಗಳು',theme:'ಪ್ರದರ್ಶನ ಥೀಮ್',light:'ಲೈಟ್ ಮೋಡ್',dark:'ಡಾರ್ಕ್ ಮೋಡ್',contrast:'ಹೈ ಕಾಂಟ್ರಾಸ್ಟ್',font:'ಅಕ್ಷರದ ಗಾತ್ರ',normal:'ಡೀಫಾಲ್ಟ್ (A)',large:'ದೊಡ್ಡದು (A+)',xlarge:'ಅತಿ ದೊಡ್ಡದು (A++)',saved:'ಉಳಿಸಿದ ಡೇಟಾ ಮತ್ತು ಆಫ್‌ಲೈನ್ ಕ್ಯಾಶ್',schemes:'ಉಳಿಸಿದ ಸರ್ಕಾರಿ ಯೋಜನೆಗಳು',bookmarked:'ಯೋಜನೆಗಳನ್ನು ಬುಕ್‌ಮಾರ್ಕ್ ಮಾಡಲಾಗಿದೆ',view:'ನೋಡಿ →',lessons:'ಪೂರ್ಣಗೊಳಿಸಿದ ಪಾಠಗಳು',modules:'ಮಾಡ್ಯೂಲ್‌ಗಳು ಪೂರ್ಣ',learn:'ಕಲಿಯಿರಿ →',reset:'ಡೆಮೋ ಡೇಟಾ ಮರುಹೊಂದಿಸಿ',cleared:'ಡೇಟಾ ತೆರವುಗೊಳಿಸಲಾಗಿದೆ!',guest:'ಅತಿಥಿ ಬಳಕೆದಾರ',signIn:'ಸೈನ್ ಇನ್',create:'ಖಾತೆ ರಚಿಸಿ'}
};

export const ProfileSettingsView: React.FC = () => {
  const {
    user,
    logoutUser,
    language,
    setLanguage,
    theme,
    setTheme,
    textScale,
    setTextScale,
    savedSchemeIds,
    completedLessonIds,
    setActiveTab,
    resetAllData,
    t,
  } = useApp();

  const [cacheCleared, setCacheCleared] = useState(false);
  const ui = PROFILE_UI[language] || PROFILE_UI.en;

  const handleClearCache = () => {
    if (confirm('Are you sure you want to reset demo data and clear local cache?')) {
      resetAllData();
      setCacheCleared(true);
      setTimeout(() => setCacheCleared(false), 3000);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0A2E65] tracking-tight">
            {t.nav.profile} & {t.nav.settings}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Manage your personal preferences, saved bookmarks, language, and accessibility display.
          </p>
        </div>
        <Logo size="md" showText={false} className="shrink-0" />
      </div>

      {/* User Profile Card */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-2xs">
        {user ? (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-[#0A2E65] text-white flex items-center justify-center font-black text-2xl uppercase shadow-sm">
                {user.name.charAt(0)}
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">{user.name}</h2>
                <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <Briefcase className="w-3.5 h-3.5" />
                    <span className="capitalize">{user.role}</span>
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{user.state}</span>
                  </span>
                </div>
                <p className="text-xs text-slate-600 font-mono mt-1">
                  {user.emailOrPhone}
                </p>
              </div>
            </div>

            <button
              onClick={logoutUser}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 rounded-full border border-red-200 transition-colors self-start sm:self-center cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>{t.nav.logout}</span>
            </button>
          </div>
        ) : (
          <div className="text-center py-6 space-y-3">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center mx-auto">
              <User className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">{ui.guest}</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              You are exploring SAHAYINI in guest mode. Sign in to sync your saved schemes and progress across sessions.
            </p>
            <div className="pt-2 flex justify-center gap-2">
              <button
                onClick={() => setActiveTab('login')}
                className="px-5 py-2 bg-[#0A2E65] text-white font-bold text-xs rounded-full shadow-xs"
              >
                Sign In
              </button>
              <button
                onClick={() => setActiveTab('signup')}
                className="px-5 py-2 bg-slate-100 text-slate-700 font-bold text-xs rounded-full hover:bg-slate-200"
              >
                Create Account
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Language Preferences */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-2xs space-y-3">
        <div className="flex items-center gap-2.5">
          <Globe className="w-5 h-5 text-[#0A2E65]" />
          <h2 className="text-base font-bold text-slate-900">
            Platform Language / மொழி தேர்வு
          </h2>
        </div>
        <p className="text-xs text-slate-500">
          Choose from 8 Indian languages supported natively across SAHAYINI.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2">
          {LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              onClick={() => setLanguage(lang.code as LanguageCode)}
              className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                language === lang.code
                  ? 'bg-blue-50/80 border-[#0A2E65] text-[#0A2E65] font-bold shadow-2xs'
                  : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <span className="text-sm block">{lang.nativeName}</span>
              <span className="text-[11px] text-slate-400 font-normal">({lang.name})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Appearance & Accessibility */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-2xs space-y-4">
        <div className="flex items-center gap-2.5">
          <Settings className="w-5 h-5 text-[#0A2E65]" />
          <h2 className="text-base font-bold text-slate-900">
            Appearance & Accessibility Settings
          </h2>
        </div>

        {/* Theme mode */}
        <div>
          <span className="text-xs font-bold text-slate-700 block mb-2">{ui.theme}</span>
          <div className="grid grid-cols-3 gap-2.5">
            <button
              onClick={() => setTheme('light')}
              className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                theme === 'light'
                  ? 'bg-amber-50 border-amber-300 text-amber-950 font-bold'
                  : 'bg-slate-50 border-slate-200 text-slate-600'
              }`}
            >
              <Sun className="w-4 h-4 mx-auto mb-1 text-amber-500" />
              <span className="text-xs">{ui.light}</span>
            </button>

            <button
              onClick={() => setTheme('dark')}
              className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                theme === 'dark'
                  ? 'bg-indigo-900 border-indigo-700 text-white font-bold'
                  : 'bg-slate-50 border-slate-200 text-slate-600'
              }`}
            >
              <Moon className="w-4 h-4 mx-auto mb-1 text-indigo-400" />
              <span className="text-xs">{ui.dark}</span>
            </button>

            <button
              onClick={() => setTheme('contrast')}
              className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                theme === 'contrast'
                  ? 'bg-black border-yellow-400 text-yellow-300 font-bold'
                  : 'bg-slate-50 border-slate-200 text-slate-600'
              }`}
            >
              <Eye className="w-4 h-4 mx-auto mb-1 text-emerald-600" />
              <span className="text-xs">{ui.contrast}</span>
            </button>
          </div>
        </div>

        {/* Text Scaling */}
        <div>
          <span className="text-xs font-bold text-slate-700 block mb-2">{ui.font}</span>
          <div className="grid grid-cols-3 gap-2.5">
            <button
              onClick={() => setTextScale('normal')}
              className={`p-2.5 rounded-xl border text-xs font-medium cursor-pointer ${
                textScale === 'normal'
                  ? 'bg-blue-50 border-[#0A2E65] text-[#0A2E65] font-bold'
                  : 'bg-slate-50 border-slate-200 text-slate-600'
              }`}
            >
              Default (A)
            </button>

            <button
              onClick={() => setTextScale('large')}
              className={`p-2.5 rounded-xl border text-sm font-medium cursor-pointer ${
                textScale === 'large'
                  ? 'bg-blue-50 border-[#0A2E65] text-[#0A2E65] font-bold'
                  : 'bg-slate-50 border-slate-200 text-slate-600'
              }`}
            >
              Large (A+)
            </button>

            <button
              onClick={() => setTextScale('xlarge')}
              className={`p-2.5 rounded-xl border text-base font-medium cursor-pointer ${
                textScale === 'xlarge'
                  ? 'bg-blue-50 border-[#0A2E65] text-[#0A2E65] font-bold'
                  : 'bg-slate-50 border-slate-200 text-slate-600'
              }`}
            >
              Extra Large (A++)
            </button>
          </div>
        </div>
      </div>

      {/* Saved Bookmarks & Data */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-2xs space-y-4">
        <h2 className="text-base font-bold text-slate-900">
          Saved Data & Offline Cache
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
            <div>
              <span className="font-bold text-slate-800">{ui.schemes}</span>
              <p className="text-slate-500 mt-0.5">{savedSchemeIds.length} schemes bookmarked</p>
            </div>
            <button
              onClick={() => setActiveTab('schemes')}
              className="text-[#0A2E65] font-bold hover:underline"
            >
              View →
            </button>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
            <div>
              <span className="font-bold text-slate-800">{ui.lessons}</span>
              <p className="text-slate-500 mt-0.5">{completedLessonIds.length} modules completed</p>
            </div>
            <button
              onClick={() => setActiveTab('learn')}
              className="text-orange-600 font-bold hover:underline"
            >
              Learn →
            </button>
          </div>
        </div>

        {/* Clear Cache Button */}
        <div className="pt-2 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            Local browser storage holds cached lessons and contacts for offline use.
          </span>
          <button
            onClick={handleClearCache}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-red-50 text-slate-700 hover:text-red-700 text-xs font-bold rounded-full transition-colors cursor-pointer shrink-0"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>{cacheCleared ? ui.cleared : ui.reset}</span>
          </button>
        </div>
      </div>

      {/* Privacy Pledge */}
      <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200/80 text-xs text-emerald-950 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-bold">SAHAYINI Privacy & Data Integrity Pledge</p>
          <p className="text-emerald-800 leading-relaxed">
            Your emergency contacts, GPS location logs, and bookmarked schemes are never sold or transmitted to commercial third parties. All emergency calls and geolocation sharing are strictly user-initiated.
          </p>
        </div>
      </div>
    </div>
  );
};
