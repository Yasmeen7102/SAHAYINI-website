import { LanguageCode, LessonItem, QuizQuestion } from '../types';
import { EXTRA_LESSONS, EXTRA_TOPICS } from './legalLessons';

export interface TopicItem {
  id: string;
  title: string;
  icon: string;
  bgColor: string;
  borderColor: string;
  textColor: string;
  description: string;
}

// ---------------------------------------------------------------------------
// 1. TOPICS DATA LOCALIZED ACROSS 8 LANGUAGES
// ---------------------------------------------------------------------------
export const TOPICS_DATA_BY_LANG: Record<LanguageCode, TopicItem[]> = {
  en: [
    {
      id: 'digital-basics',
      title: 'Digital Basics',
      icon: 'Smartphone',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      textColor: 'text-blue-700',
      description: 'Master touch screens, app stores, Wi-Fi, and simple internet searching.',
    },
    {
      id: 'online-safety',
      title: 'Online Safety',
      icon: 'ShieldCheck',
      bgColor: 'bg-emerald-50',
      borderColor: 'border-emerald-200',
      textColor: 'text-emerald-700',
      description: 'Password hygiene, two-factor authentication, private browsing, and social safety.',
    },
    {
      id: 'upi-payments',
      title: 'UPI & Payments',
      icon: 'CreditCard',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
      textColor: 'text-purple-700',
      description: 'Sending money safely, QR code verification, and understanding UPI PIN.',
    },
    {
      id: 'gov-services',
      title: 'Government Services',
      icon: 'Landmark',
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-200',
      textColor: 'text-amber-700',
      description: 'DigiLocker, UMANG, e-Sevai, Aadhaar self-service, and voter portals.',
    },
    {
      id: 'more-skills',
      title: 'More',
      icon: 'MoreHorizontal',
      bgColor: 'bg-slate-50',
      borderColor: 'border-slate-200',
      textColor: 'text-slate-700',
      description: 'Email drafting, document scanning, accessibility tools, and cyber hygiene.',
    },
  ],
  ta: [
    {
      id: 'digital-basics',
      title: 'டிஜிட்டல் அடிப்படைகள்',
      icon: 'Smartphone',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      textColor: 'text-blue-700',
      description: 'தொடுதிரை, ஆப் ஸ்டோர், வைஃபை மற்றும் இணையத் தேடலைக் கற்றுக் கொள்ளுங்கள்.',
    },
    {
      id: 'online-safety',
      title: 'ஆன்லைன் பாதுகாப்பு',
      icon: 'ShieldCheck',
      bgColor: 'bg-emerald-50',
      borderColor: 'border-emerald-200',
      textColor: 'text-emerald-700',
      description: 'கடவுச்சொல் பாதுகாப்பு, OTP ரகசியம் மற்றும் சமூக வலைதளப் பாதுகாப்பு.',
    },
    {
      id: 'upi-payments',
      title: 'UPI & கட்டணங்கள்',
      icon: 'CreditCard',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
      textColor: 'text-purple-700',
      description: 'பாதுகாப்பாக பணம் அனுப்புதல், QR குறியீடு சரிபார்த்தல் மற்றும் UPI PIN விதி.',
    },
    {
      id: 'gov-services',
      title: 'அரசு சேவைகள்',
      icon: 'Landmark',
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-200',
      textColor: 'text-amber-700',
      description: 'டிஜிலாக்கர், e-சேவை, ஆதார் ஆன்லைன் சேவைகள் மற்றும் தேசிய கல்வி உதவித்தொகை.',
    },
    {
      id: 'more-skills',
      title: 'கூடுதல் திறன்கள்',
      icon: 'MoreHorizontal',
      bgColor: 'bg-slate-50',
      borderColor: 'border-slate-200',
      textColor: 'text-slate-700',
      description: 'மின்னஞ்சல் அனுப்புதல், ஆவணங்களை ஸ்கேன் செய்தல் மற்றும் டிஜிட்டல் சான்றிதழ்கள்.',
    },
  ],
  hi: [
    {
      id: 'digital-basics',
      title: 'डिजिटल बुनियादी बातें',
      icon: 'Smartphone',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      textColor: 'text-blue-700',
      description: 'टच स्क्रीन, ऐप स्टोर, वाई-फाई और सरल इंटरनेट सर्च में महारत हासिल करें।',
    },
    {
      id: 'online-safety',
      title: 'ऑनलाइन सुरक्षा',
      icon: 'ShieldCheck',
      bgColor: 'bg-emerald-50',
      borderColor: 'border-emerald-200',
      textColor: 'text-emerald-700',
      description: 'पासवर्ड सुरक्षा, ओटीपी गोपनीयता और सोशल मीडिया सुरक्षा के नियम।',
    },
    {
      id: 'upi-payments',
      title: 'यूपीआई और डिजिटल भुगतान',
      icon: 'CreditCard',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
      textColor: 'text-purple-700',
      description: 'सुरक्षित पैसे भेजना, क्यूआर कोड सत्यापन और यूपीआई पिन के जरूरी नियम।',
    },
    {
      id: 'gov-services',
      title: 'सरकारी सेवाएं',
      icon: 'Landmark',
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-200',
      textColor: 'text-amber-700',
      description: 'डिजिलॉकर, उमंग, आधार ऑनलाइन पोर्टल और राष्ट्रीय छात्रवृत्ति पोर्टल।',
    },
    {
      id: 'more-skills',
      title: 'अन्य कौशल',
      icon: 'MoreHorizontal',
      bgColor: 'bg-slate-50',
      borderColor: 'border-slate-200',
      textColor: 'text-slate-700',
      description: 'ईमेल लिखना, दस्तावेज स्कैन करना और आवश्यक डिजिटल टूल्स का उपयोग।',
    },
  ],
  te: [
    {
      id: 'digital-basics',
      title: 'డిజిటల్ బేసిక్స్',
      icon: 'Smartphone',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      textColor: 'text-blue-700',
      description: 'టచ్ స్క్రీన్, యాప్ స్టోర్, వై-ఫై మరియు ఇంటర్నెట్ శోధన నేర్చుకోండి.',
    },
    {
      id: 'online-safety',
      title: 'ఆన్‌లైన్ భద్రత',
      icon: 'ShieldCheck',
      bgColor: 'bg-emerald-50',
      borderColor: 'border-emerald-200',
      textColor: 'text-emerald-700',
      description: 'పాస్‌వర్డ్ భద్రత, ఓటీపీ రక్షణ మరియు సోషల్ మీడియా భద్రత.',
    },
    {
      id: 'upi-payments',
      title: 'యూపీఐ & చెల్లింపులు',
      icon: 'CreditCard',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
      textColor: 'text-purple-700',
      description: 'సురక్షితంగా డబ్బు పంపడం, క్యూఆర్ కోడ్ తనిఖీ మరియు యూపీఐ పిన్ నియమాలు.',
    },
    {
      id: 'gov-services',
      title: 'ప్రభుత్వ సేవలు',
      icon: 'Landmark',
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-200',
      textColor: 'text-amber-700',
      description: 'డిజిలాకర్, ఆధార్ ఆన్‌లైన్ సేవలు మరియు నేషనల్ స్కాలర్‌షిప్ పోర్టల్.',
    },
    {
      id: 'more-skills',
      title: 'మరిన్ని నైపుణ్యాలు',
      icon: 'MoreHorizontal',
      bgColor: 'bg-slate-50',
      borderColor: 'border-slate-200',
      textColor: 'text-slate-700',
      description: 'ఈమెయిల్ డ్రాఫ్టింగ్, డాక్యుమెంట్ స్కానింగ్ మరియు డిజిటల్ టూల్స్.',
    },
  ],
  mr: [
    {
      id: 'digital-basics',
      title: 'डिजिटल मूलभूत गोष्टी',
      icon: 'Smartphone',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      textColor: 'text-blue-700',
      description: 'टच स्क्रीन, ॲप स्टोअर, वाय-फाय आणि इंटरनेट सर्च शिकून घ्या.',
    },
    {
      id: 'online-safety',
      title: 'ऑनलाइन सुरक्षा',
      icon: 'ShieldCheck',
      bgColor: 'bg-emerald-50',
      borderColor: 'border-emerald-200',
      textColor: 'text-emerald-700',
      description: 'पासवर्ड सुरक्षा, ओटीपी गोपनीयता आणि सोशल मीडियावरील सुरक्षितता.',
    },
    {
      id: 'upi-payments',
      title: 'युपीआय आणि डिजिटल पेमेंट',
      icon: 'CreditCard',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
      textColor: 'text-purple-700',
      description: 'सुरक्षित पैसे पाठवणे, क्यूआर कोड पडताळणी आणि युपीआय पिनचे नियम.',
    },
    {
      id: 'gov-services',
      title: 'शासकीय सेवा',
      icon: 'Landmark',
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-200',
      textColor: 'text-amber-700',
      description: 'डिजीलॉकर, आपले सरकार, आधार ऑनलाइन सेवा आणि शिष्यवृत्ती पोर्टल.',
    },
    {
      id: 'more-skills',
      title: 'अधिक कौशल्ये',
      icon: 'MoreHorizontal',
      bgColor: 'bg-slate-50',
      borderColor: 'border-slate-200',
      textColor: 'text-slate-700',
      description: 'ईमेल पाठवणे, कागदपत्रे स्कॅन करणे आणि डिजिटल प्रमाणपत्रे.',
    },
  ],
  ml: [
    {
      id: 'digital-basics',
      title: 'ഡിജിറ്റൽ അടിസ്ഥാനങ്ങൾ',
      icon: 'Smartphone',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      textColor: 'text-blue-700',
      description: 'ടച്ച് സ്ക്രീൻ, ആപ്പ് സ്റ്റോർ, വൈ-ഫൈ, ഇന്റർനെറ്റ് ഉപയോഗം മനസ്സിലാക്കൂ.',
    },
    {
      id: 'online-safety',
      title: 'ഓൺലൈൻ സുരക്ഷ',
      icon: 'ShieldCheck',
      bgColor: 'bg-emerald-50',
      borderColor: 'border-emerald-200',
      textColor: 'text-emerald-700',
      description: 'പാസ്‌വേഡ് സുരക്ഷ, ഒടിപി രഹസ്യം, സോഷ്യൽ മീഡിയ സുരക്ഷിതത്വം.',
    },
    {
      id: 'upi-payments',
      title: 'യുപിഐ പേയ്‌മെന്റുകൾ',
      icon: 'CreditCard',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
      textColor: 'text-purple-700',
      description: 'പണം അയക്കൽ, ക്യുആർ കോഡ് പരിശോധന, യുപിഐ പിൻ നിയമങ്ങൾ.',
    },
    {
      id: 'gov-services',
      title: 'സർക്കാർ സേവനങ്ങൾ',
      icon: 'Landmark',
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-200',
      textColor: 'text-amber-700',
      description: 'ഡിജിലോക്കർ, ആധാർ സേവനങ്ങൾ, ദേശീയ സ്കോളർഷിപ്പ് പോർട്ടൽ.',
    },
    {
      id: 'more-skills',
      title: 'കൂടുതൽ കഴിവുകൾ',
      icon: 'MoreHorizontal',
      bgColor: 'bg-slate-50',
      borderColor: 'border-slate-200',
      textColor: 'text-slate-700',
      description: 'ഇമെയിൽ അയക്കൽ, ഡോക്യുമെന്റ് സ്കാനിംഗ്, ഡിജിറ്റൽ സാക്ഷരത.',
    },
  ],
  gu: [
    {
      id: 'digital-basics',
      title: 'ડિજિટલ મૂળભૂત બાબતો',
      icon: 'Smartphone',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      textColor: 'text-blue-700',
      description: 'ટચ સ્ક્રીન, એપ સ્ટોર, વાઇ-ફાઇ અને સરળ ઇન્ટરનેટ શોધ શીખો.',
    },
    {
      id: 'online-safety',
      title: 'ઓનલાઇન સુરક્ષા',
      icon: 'ShieldCheck',
      bgColor: 'bg-emerald-50',
      borderColor: 'border-emerald-200',
      textColor: 'text-emerald-700',
      description: 'પાસવર્ડ સુરક્ષા, ઓટીપી ગોપનીયતા અને સોશિયલ મીડિયા સાવચેતી.',
    },
    {
      id: 'upi-payments',
      title: 'યુપીઆઈ અને ચુકવણીઓ',
      icon: 'CreditCard',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
      textColor: 'text-purple-700',
      description: 'સુરક્ષિત નાણાં ટ્રાન્સફર, ક્યૂઆર કોડ ચકાસણી અને યુપીઆઈ પિન નિયમો.',
    },
    {
      id: 'gov-services',
      title: 'સરકારી સેવાઓ',
      icon: 'Landmark',
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-200',
      textColor: 'text-amber-700',
      description: 'ડિજીલોકર, આધાર ઓનલાઇન પોર્ટલ અને રાષ્ટ્રીય શિષ્યવૃત્તિ પોર્ટલ.',
    },
    {
      id: 'more-skills',
      title: 'વધારાની કુશળતા',
      icon: 'MoreHorizontal',
      bgColor: 'bg-slate-50',
      borderColor: 'border-slate-200',
      textColor: 'text-slate-700',
      description: 'ઇમેઇલ લખવું, દસ્તાવેજ સ્કેનિંગ અને ડિજિટલ સાધનોનો ઉપયોગ.',
    },
  ],
  kn: [
    {
      id: 'digital-basics',
      title: 'ಡಿಜಿಟಲ್ ಮೂಲಭೂತ ಅಂಶಗಳು',
      icon: 'Smartphone',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      textColor: 'text-blue-700',
      description: 'ಟಚ್ ಸ್ಕ್ರೀನ್, ಆಪ್ ಸ್ಟೋರ್, ವೈ-ಫೈ ಮತ್ತು ಇಂಟರ್ನೆಟ್ ಹುಡುಕಾಟ ಕಲಿಯಿರಿ.',
    },
    {
      id: 'online-safety',
      title: 'ಆನ್‌ಲೈನ್ ಸುರಕ್ಷತೆ',
      icon: 'ShieldCheck',
      bgColor: 'bg-emerald-50',
      borderColor: 'border-emerald-200',
      textColor: 'text-emerald-700',
      description: 'ಪಾಸ್‌ವರ್ಡ್ ಭದ್ರತೆ, ಒಟಿಪಿ ರಕ್ಷಣೆ ಮತ್ತು ಸಾಮಾಜಿಕ ಮಾಧ್ಯಮ ಸುರಕ್ಷತೆ.',
    },
    {
      id: 'upi-payments',
      title: 'ಯುಪಿಐ ಮತ್ತು ಪಾವತಿಗಳು',
      icon: 'CreditCard',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
      textColor: 'text-purple-700',
      description: 'ಸುರಕ್ಷಿತ ಹಣ ವರ್ಗಾವಣೆ, ಕ್ಯೂಆರ್ ಕೋಡ್ ಪರಿಶೀಲನೆ ಮತ್ತು ಯುಪಿಐ ಪಿನ್ ನಿಯಮಗಳು.',
    },
    {
      id: 'gov-services',
      title: 'ಸರ್ಕಾರಿ ಸೇವೆಗಳು',
      icon: 'Landmark',
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-200',
      textColor: 'text-amber-700',
      description: 'ಡಿಜಿಲಾಕರ್, ಆಧಾರ್ ಆನ್‌ಲೈನ್ ಸೇವೆಗಳು ಮತ್ತು ರಾಷ್ಟ್ರೀಯ ವಿದ್ಯಾರ್ಥಿವೇತನ ಪೋರ್ಟಲ್.',
    },
    {
      id: 'more-skills',
      title: 'ಹೆಚ್ಚಿನ ಕೌಶಲ್ಯಗಳು',
      icon: 'MoreHorizontal',
      bgColor: 'bg-slate-50',
      borderColor: 'border-slate-200',
      textColor: 'text-slate-700',
      description: 'ಇಮೇಲ್ ಡ್ರಾಫ್ಟಿಂಗ್, ದಾಖಲೆ ಸ್ಕ್ಯಾನಿಂಗ್ ಮತ್ತು ಡಿಜಿಟಲ್ ಪ್ರಮಾಣಪತ್ರಗಳು.',
    },
  ],
};

// ---------------------------------------------------------------------------
// 2. FEATURED LESSONS DATA LOCALIZED ACROSS 8 LANGUAGES (FULL CONTENT & AUDIO)
// ---------------------------------------------------------------------------
export const FEATURED_LESSONS_BY_LANG: Record<LanguageCode, LessonItem[]> = {
  en: [
    {
      id: 'lesson-1',
      topicId: 'digital-basics',
      number: 1,
      title: '1. Smartphone Basics',
      description: 'Learn how to use a smartphone, apps and the internet.',
      readTime: '4 min read',
      audioDuration: '3 min listen',
      content: {
        introduction: 'Smartphones connect you to essential services, family, education, and government benefits. Knowing the core basics gives you confidence and privacy.',
        sections: [
          {
            heading: '1. Navigating Your Home Screen and Apps',
            body: 'Your phone uses a touchscreen. A single tap opens an application. Swiping left, right, up, or down moves between screens. Always download applications exclusively from verified official stores like the Google Play Store or Apple App Store.',
            tips: [
              'Look for verified developer badges on the app store before installing.',
              'Never install apps by clicking random links sent in SMS or WhatsApp ending in .apk.',
            ],
          },
          {
            heading: '2. Managing Wi-Fi and Mobile Data',
            body: 'Swipe down from the top edge of your screen to open Quick Settings. Here you can toggle Wi-Fi and Mobile Data. Turn off Wi-Fi in public spaces like railway stations if not using it to prevent tracking.',
          },
          {
            heading: '3. Protecting Your Screen Lock',
            body: 'Set a 6-digit PIN, strong password, or biometric fingerprint to lock your screen. Never use simple numbers like 1234 or your year of birth.',
            warning: 'Do not write your phone lock code on the back of your phone case or share it with strangers.',
          },
        ],
        summary: [
          'Only install apps from official stores (Play Store / App Store).',
          'Keep a secure screen lock PIN or fingerprint active at all times.',
          'Adjust text size and brightness in Settings for comfortable reading.',
        ],
      },
      audioScript: 'Welcome to Lesson 1: Smartphone Basics. A smartphone is your gateway to essential services, education, and government benefits. First, always install applications from the official Google Play Store or Apple App Store, and never download files ending in dot a-p-k sent in messages. Second, keep your phone protected with a 6-digit screen lock PIN or fingerprint. Never share this PIN with anyone. Lastly, you can easily adjust text size and screen brightness inside your device Settings for comfortable viewing. Small steps build confidence!',
    },
    {
      id: 'lesson-2',
      topicId: 'online-safety',
      number: 2,
      title: '2. Online Safety',
      description: 'Protect your personal information and stay safe online.',
      readTime: '5 min read',
      audioDuration: '4 min listen',
      content: {
        introduction: 'Being online gives you boundless knowledge, but staying safe requires recognizing traps and guarding your identity.',
        sections: [
          {
            heading: '1. The Golden Rule of Passwords & OTP',
            body: 'Your OTP (One-Time Password) is like the key to your bank locker. No legitimate police officer, bank official, or government staff will EVER ask for your OTP or password over a call or chat.',
            warning: 'If anyone calls asking for an OTP to "prevent account cancellation" or "claim prize", hang up immediately!',
          },
          {
            heading: '2. Spotting Phishing and Fake Links',
            body: 'Before clicking any link, inspect the website domain name carefully. Official government portals in India always end with ".gov.in" or ".nic.in". Fraudsters use deceptive lookalikes like "gov-schemes-portal.com" or shortened links.',
            tips: [
              'Check for the padlock icon in the browser address bar.',
              'Do not trust urgent messages claiming your electricity or phone will be disconnected tonight.',
            ],
          },
          {
            heading: '3. App Permissions Checklist',
            body: 'When an app asks for permission, think: Does a calculator app need access to my Camera, Microphone, or Contacts? No. Only grant permissions that make sense for the app function.',
          },
        ],
        summary: [
          'Never share your OTP with anyone under any circumstances.',
          'Official government websites end with .gov.in or .nic.in.',
          'Review and restrict unnecessary app permissions in phone Settings.',
        ],
      },
      audioScript: 'Welcome to Lesson 2: Online Safety. Remember the Golden Rule: Your OTP is your private key. Legitimate bank managers and government officers will NEVER call you asking for an OTP. If someone says your electricity will be cut off or your account blocked unless you share an OTP, it is a fraud attempt. Also remember that authentic Indian government websites always end in dot gov dot in or dot nic dot in. Stay safe and stay alert!',
    },
    {
      id: 'lesson-3',
      topicId: 'upi-payments',
      number: 3,
      title: '3. UPI & Digital Payments',
      description: 'Learn safe and easy digital payments using UPI.',
      readTime: '5 min read',
      audioDuration: '3.5 min listen',
      content: {
        introduction: 'Unified Payments Interface (UPI) has made payments seamless across India. Knowing how it works prevents financial errors and scams.',
        sections: [
          {
            heading: '1. The Number One UPI Rule: PIN is Only to SEND Money',
            body: 'To RECEIVE money into your bank account, you NEVER need to enter your UPI PIN. If someone says "Scan this QR code and enter your PIN to receive your refund or lottery prize", they are attempting to STEAL your money!',
            warning: 'Entering your UPI PIN ALWAYS deducts money from your account.',
          },
          {
            heading: '2. Verifying the Recipient Name',
            body: 'Whenever you scan a QR code at a store or send money to a mobile number, wait for the app to display the recipient registered verified name. Verify that the name matches the merchant or person before confirming.',
          },
          {
            heading: '3. What to Do If You Send Money by Mistake',
            body: 'Immediately inform your bank customer service and call the National Cyber Crime Helpline at 1930 if fraud was involved. You can also raise a transaction dispute inside your UPI app under Help & Support.',
          },
        ],
        summary: [
          'You NEVER need to enter your UPI PIN to receive money.',
          'Always check the recipient legal name displayed on screen before paying.',
          'Keep transaction SMS alerts enabled on your linked phone number.',
        ],
      },
      audioScript: 'Welcome to Lesson 3: UPI and Digital Payments. Here is the single most important rule: You NEVER need to enter your UPI PIN to receive money. When you receive money, it arrives automatically. You only enter your secret PIN when you are SENDING money. If someone tells you to enter your PIN to receive a scholarship, cashback, or prize, it is a scam. Always double check the name on the screen before confirming any transaction.',
    },
    {
      id: 'lesson-4',
      topicId: 'gov-services',
      number: 4,
      title: '4. Government Services',
      description: 'Access government schemes and services online.',
      readTime: '6 min read',
      audioDuration: '4 min listen',
      content: {
        introduction: 'Digital India enables every student and citizen to access official certificates, scholarships, welfare funds, and health cards from home.',
        sections: [
          {
            heading: '1. DigiLocker: Your Authentic Digital Document Wallet',
            body: 'DigiLocker (digilocker.gov.in) is an official Government of India platform that lets you store and fetch legally recognized digital versions of your Aadhaar card, 10th and 12th marksheets, driving license, and caste certificates.',
            tips: [
              'Documents in DigiLocker carry legal validity equal to original physical documents under the IT Act.',
              'Log in safely using your Aadhaar number and OTP.',
            ],
          },
          {
            heading: '2. National Scholarship Portal (NSP)',
            body: 'Visit scholarships.gov.in for Central Sector Schemes, Post-Matric, and Pre-Matric scholarships. Register once using One-Time Registration (OTR), upload verified academic records, and track application status online.',
          },
          {
            heading: '3. State e-Sevai / Citizen Portals',
            body: 'Most state governments (like TN e-Sevai in Tamil Nadu or Aaple Sarkar in Maharashtra) allow you to apply for income certificates, community certificates, and ration card updates online without paying intermediaries.',
          },
        ],
        summary: [
          'DigiLocker stores genuine, legally verified government certificates.',
          'Apply for Central Scholarships at scholarships.gov.in using OTR.',
          'Use official state portals for income and community certificates.',
        ],
      },
      audioScript: 'Welcome to Lesson 4: Government Services Online. Today, students and citizens can access everything from scholarships to digital marksheets from their phone. DigiLocker allows you to carry genuine digital copies of your Aadhaar and board exam mark sheets that have legal validity across India. For college scholarships, visit the official portal at scholarships dot gov dot in. Digital empowerment starts with knowing your rights and portals.',
    },
  ],
  ta: [
    {
      id: 'lesson-1',
      topicId: 'digital-basics',
      number: 1,
      title: '1. ஸ்மார்ட்போன் அடிப்படைகள்',
      description: 'ஸ்மார்ட்போன், செயலிகள் மற்றும் இணையத்தை எவ்வாறு பாதுகாப்பாகப் பயன்படுத்துவது என்று கற்றுக்கொள்ளுங்கள்.',
      readTime: '4 நிமிடம் வாசிக்க',
      audioDuration: '3 நிமிடம் கேட்க',
      content: {
        introduction: 'ஸ்மார்ட்போன்கள் உங்களை அத்தியாவசிய சேவைகள், கல்வி, குடும்பம் மற்றும் அரசு நலத்திட்டங்களுடன் இணைக்கின்றன. இதன் அடிப்படைகளை அறிவது உங்களுக்கு தன்னம்பிக்கையையும் பாதுகாப்பையும் தரும்.',
        sections: [
          {
            heading: '1. முகப்புத் திரை மற்றும் செயலிகளை இயக்குதல்',
            body: 'உங்கள் தொலைபேசி தொடுதிரையைப் பயன்படுத்துகிறது. ஒரு முறை தட்டினால் செயலி திறக்கும். இடது, வலது அல்லது மேலே சுழற்றுவதன் மூலம் திரைகளை மாற்றலாம். கூகிள் பிளே ஸ்டோர் (Google Play Store) அல்லது ஆப்பிள் ஆப் ஸ்டோர் போன்ற அதிகாரப்பூர்வ அங்கீகரிக்கப்பட்ட தளங்களிலிருந்து மட்டுமே செயலிகளைப் பதிவிறக்கவும்.',
            tips: [
              'செயலியை நிறுவும் முன் அதிகாரப்பூர்வ டெவலப்பர் முத்திரையைச் சரிபார்க்கவும்.',
              'வாட்ஸ்அப் அல்லது எஸ்எம்எஸ் மூலம் வரும் .apk கோப்புகளை ஒருபோதும் கிளிக் செய்து நிறுவ வேண்டாம்.',
            ],
          },
          {
            heading: '2. வைஃபை மற்றும் மொபைல் டேட்டா மேலாண்மை',
            body: 'விரைவு அமைப்புகளைத் திறக்க திரையின் மேல் விளிம்பிலிருந்து கீழே இழுக்கவும். இங்கே வைஃபை மற்றும் மொபைல் டேட்டாவை இயக்கலாம் அல்லது அணைக்கலாம். ரயில் நிலையங்கள் போன்ற பொது இடங்களில் பயன்படுத்தாத போது வைஃபை-ஐ அணைத்து வைக்கவும்.',
          },
          {
            heading: '3. திரை பூட்டு (Screen Lock) பாதுகாப்பு',
            body: 'உங்கள் திரையைப் பூட்ட 6 இலக்க பின் (PIN), வலுவான கடவுச்சொல் அல்லது கைரேகையைப் பயன்படுத்தவும். 1234 அல்லது உங்கள் பிறந்த ஆண்டு போன்ற எளிய எண்களை ஒருபோதும் பயன்படுத்த வேண்டாம்.',
            warning: 'உங்கள் போன் பூட்டு ரகசிய எண்ணை போன் கவரில் எழுதி வைக்காதீர்கள்; பிறரிடம் பகிராதீர்கள்.',
          },
        ],
        summary: [
          'அதிகாரப்பூர்வ ஆப் ஸ்டோரில் இருந்து மட்டுமே செயலிகளைப் பதிவிறக்குங்கள்.',
          'எப்போதும் பாதுகாப்பான 6 இலக்க PIN அல்லது கைரேகை பூட்டைப் பயன்படுத்துங்கள்.',
          'வசதியாகப் படிக்க அமைப்புகளில் எழுத்து அளவையும் வெளிச்சத்தையும் மாற்றுங்கள்.',
        ],
      },
      audioScript: 'பாடம் ஒன்றுக்கு நல்வரவு: ஸ்மார்ட்போன் அடிப்படைகள். ஸ்மார்ட்போன் என்பது கல்வி மற்றும் அரசு நலத்திட்டங்களை அணுக உதவும் அருமையான கருவி. முதலாவதாக, கூகிள் பிளே ஸ்டோர் போன்ற அதிகாரப்பூர்வ தளங்களிலிருந்து மட்டுமே செயலிகளை நிறுவ வேண்டும். வாட்ஸ்அப்பில் வரும் டாட் ஏபிகே கோப்புகளை ஒருபோதும் திறக்காதீர்கள். இரண்டாவதாக, ஆறு இலக்க ரகசிய பின் எண்ணைப் பயன்படுத்தி உங்கள் போனைப் பூட்டி வையுங்கள். இந்த பின் எண்ணை யாருடனும் பகிர வேண்டாம். சிறு அடிகள் பெரும் மாற்றங்களை உருவாக்கும்!',
    },
    {
      id: 'lesson-2',
      topicId: 'online-safety',
      number: 2,
      title: '2. ஆன்லைன் பாதுகாப்பு',
      description: 'உங்கள் தனிப்பட்ட தகவல்களைப் பாதுகாத்து ஆன்லைனில் விழிப்புடன் இருங்கள்.',
      readTime: '5 நிமிடம் வாசிக்க',
      audioDuration: '4 நிமிடம் கேட்க',
      content: {
        introduction: 'இணையம் பரந்த அறிவைத் தருகிறது, ஆனால் பாதுகாப்பாக இருக்க பொறிகளையும் போலி இணைப்புகளையும் அடையாளம் காண வேண்டும்.',
        sections: [
          {
            heading: '1. கடவுச்சொல் மற்றும் OTP-ன் தங்க விதி',
            body: 'உங்கள் OTP (ஒருமுறை கடவுச்சொல்) உங்கள் வங்கி பெட்டகத்தின் சாவி போன்றது. எந்தவொரு உண்மையான வங்கி மேலாளரோ, காவல் அதிகாரியோ அல்லது அரசு அதிகாரியோ ஒருபோதும் தொலைபேசியிலோ செய்தியிலோ OTP கேட்க மாட்டார்கள்.',
            warning: '"கணக்கு ரத்தாகாமல் தடுக்க" அல்லது "பரிசு பெற" OTP கேட்டால் உடனே அழைப்பைத் துண்டிக்கவும்!',
          },
          {
            heading: '2. போலி இணைப்புகளை அடையாளம் காணுதல்',
            body: 'எந்தவொரு இணைப்பையும் கிளிக் செய்வதற்கு முன் வலைத்தள முகவரியைக் கவனியுங்கள். இந்தியாவில் உண்மையான அரசு இணையதளங்கள் எப்போதுமே ".gov.in" அல்லது ".nic.in" என்றுதான் முடியும்.',
            tips: [
              'முகவரிப் பட்டியில் உள்ள பூட்டு (padlock) சின்னத்தைச் சரிபார்க்கவும்.',
              '"மின்சாரம் இன்றிரவு துண்டிக்கப்படும்" என்று தனிநபர் எண்ணிலிருந்து வரும் எஸ்எம்எஸ்-ஐ நம்பாதீர்கள்.',
            ],
          },
          {
            heading: '3. செயலி அனுமதிகள் (App Permissions) சரிபார்த்தல்',
            body: 'ஒரு செயலி அனுமதி கேட்கும் போது சிந்தியுங்கள்: ஒரு கால்குலேட்டர் செயலிக்கு உங்கள் கேமரா அல்லது தொடர்புகள் (Contacts) தேவைதானா? தேவையில்லை என்றால் அத்தகைய அனுமதிகளை மறுத்துவிடுங்கள்.',
          },
        ],
        summary: [
          'எந்த சூழ்நிலையிலும் உங்கள் OTP-ஐ யாருடனும் பகிராதீர்கள்.',
          'அரசு இணையதளங்கள் எப்போதுமே .gov.in அல்லது .nic.in என்று முடியும்.',
          'அமைப்புகளில் தேவையில்லாத செயலி அனுமதிகளைத் திரும்பப் பெறுங்கள்.',
        ],
      },
      audioScript: 'பாடம் இரண்டு: ஆன்லைன் பாதுகாப்பு. மிக முக்கியமான பொன்விதியை நினைவில் வையுங்கள்: உங்கள் ஓடிபி உங்கள் தனிப்பட்ட சாவி. உண்மையான வங்கி அதிகாரியோ காவல்துறையோ ஒருபோதும் உங்களிடம் தொலைபேசியில் ஓடிபி கேட்க மாட்டார்கள். மின்சாரம் துண்டிக்கப்படும் என்றோ அல்லது கணக்கு முடக்கப்படும் என்றோ மிரட்டி ஓடிபி கேட்டால் அது மோசடி. அரசு இணையதளங்கள் எப்போதும் டாட் ஜிஓவி டாட் ஐஎன் என்றுதான் முடியும். பாதுகாப்பாகவும் விழிப்புடனும் இருங்கள்!',
    },
    {
      id: 'lesson-3',
      topicId: 'upi-payments',
      number: 3,
      title: '3. UPI & டிஜிட்டல் கட்டணங்கள்',
      description: 'UPI மூலம் பாதுகாப்பாகவும் எளிமையாகவும் கட்டணங்களை செலுத்தக் கற்றுக் கொள்ளுங்கள்.',
      readTime: '5 நிமிடம் வாசிக்க',
      audioDuration: '3.5 நிமிடம் கேட்க',
      content: {
        introduction: 'UPI (கூகிள் பே, போன்பே, பேடிஎம்) பணப் பரிவர்த்தனையை மிக எளிதாக்கியுள்ளது. அதன் விதிகளை அறிவது நிதி இழப்பைத் தடுக்கும்.',
        sections: [
          {
            heading: '1. UPI-ன் முதல் விதி: பணம் அனுப்ப மட்டுமே PIN தேவை!',
            body: 'உங்கள் வங்கிக் கணக்கில் பணத்தைப் பெற நீங்கள் ஒருபோதும் UPI PIN உள்ளிட வேண்டிய அவசியமில்லை! "பணத்தைப் பெற இந்த QR குறியீட்டை ஸ்கேன் செய்து உங்கள் பின்னை உள்ளிடுங்கள்" என்று யாராவது கூறினால், அவர்கள் உங்கள் பணத்தைத் திருட முயற்சிக்கிறார்கள்!',
            warning: 'UPI PIN உள்ளிட்டால் எப்போதுமே உங்கள் கணக்கிலிருந்து பணம் எடுக்கப்படும்.',
          },
          {
            heading: '2. பெறுநர் பெயரைச் சரிபார்த்தல்',
            body: 'கடையில் QR குறியீட்டை ஸ்கேன் செய்யும் போதோ அல்லது மொபைல் எண்ணுக்குப் பணம் அனுப்பும் போதோ, திரையில் தோன்றும் அதிகாரப்பூர்வ பெயரைக் கவனியுங்கள். பெயர் சரியாக இருப்பதை உறுதிசெய்த பிறகே தொகையை அனுப்பவும்.',
          },
          {
            heading: '3. தவறுதலாகப் பணம் அனுப்பினால் என்ன செய்வது?',
            body: 'மோசடி நடந்தால் உடனடியாக 1930 என்ற தேசிய சைபர் கிரைம் உதவி எண்ணை அழைக்கவும். மேலும் உங்கள் வங்கி வாடிக்கையாளர் சேவையிலும் UPI செயலியில் பரிவர்த்தனைப் புகாரையும் பதிவு செய்யவும்.',
          },
        ],
        summary: [
          'பணம் வரவு வைக்க நீங்கள் ஒருபோதும் UPI PIN போடத் தேவையில்லை.',
          'பணம் செலுத்தும் முன் திரையில் உள்ள பெறுநர் பெயரைச் சரிபார்க்கவும்.',
          'உங்கள் வங்கிக் கணக்கில் எஸ்எம்எஸ் எச்சரிக்கைகளை எப்போதும் இயக்கத்தில் வைக்கவும்.',
        ],
      },
      audioScript: 'பாடம் மூன்று: யுபிஐ மற்றும் டிஜிட்டல் கட்டணங்கள். மிக முக்கியமான விதி இதுவே: பணத்தைப் பெறுவதற்கு நீங்கள் ஒருபோதும் யுபிஐ பின்னைப் போடத் தேவையில்லை. பணம் உங்கள் கணக்கிற்கு வரும் போது அது தானாகவே வந்துவிடும். நீங்கள் வேறு ஒருவருக்குப் பணம் அனுப்பும் போது மட்டுமே ரகசிய பின்னை உள்ளிட வேண்டும். உதவித்தொகை அல்லது பரிசு பெற பின்னை உள்ளிடுமாறு யார் கூறினாலும் அது மோசடி. பணத்தை அனுப்பும் முன் திரையில் உள்ள பெயரை எப்போதும் கவனியுங்கள்.',
    },
    {
      id: 'lesson-4',
      topicId: 'gov-services',
      number: 4,
      title: '4. இணையவழி அரசு சேவைகள்',
      description: 'அரசு திட்டங்கள், கல்வி உதவித்தொகை மற்றும் சான்றிதழ்களை வீட்டிலிருந்தே அணுகுங்கள்.',
      readTime: '6 நிமிடம் வாசிக்க',
      audioDuration: '4 நிமிடம் கேட்க',
      content: {
        introduction: 'டிஜிட்டல் இந்தியா மூலம் மாணவர்கள் மற்றும் பொதுமக்கள் தங்கள் சான்றிதழ்கள் மற்றும் கல்வி உதவித்தொகைகளை வீட்டிலிருந்தே பெற முடியும்.',
        sections: [
          {
            heading: '1. டிஜிலாக்கர் (DigiLocker): சட்டப்பூர்வ டிஜிட்டல் ஆவணப் பெட்டகம்',
            body: 'டிஜிலாக்கர் (digilocker.gov.in) என்பது இந்திய அரசின் அதிகாரப்பூர்வ தளம். இதில் உங்கள் ஆதார் அட்டை, 10 மற்றும் 12-ஆம் வகுப்பு மதிப்பெண் சான்றிதழ்கள், ஓட்டுநர் உரிமம் ஆகியவற்றை டிஜிட்டல் வடிவில் சேமிக்கலாம்.',
            tips: [
              'டிஜிலாக்கரில் உள்ள ஆவணங்கள் அசல் ஆவணங்களுக்கு இணையான சட்டப்பூர்வ மதிப்பைக் கொண்டவை.',
              'உங்கள் ஆதார் எண் மற்றும் OTP மூலம் பாதுகாப்பாக உள்நுழையலாம்.',
            ],
          },
          {
            heading: '2. தேசிய கல்வி உதவித்தொகை போர்டல் (NSP)',
            body: 'கல்லூரி மற்றும் பள்ளி மாணவர்களுக்கான மத்திய அரசு உதவித்தொகைகளுக்கு scholarships.gov.in தளத்தைப் பார்வையிடுங்கள். ஒரே முறை பதிவு (OTR) செய்து விண்ணப்பிக்கலாம்.',
          },
          {
            heading: '3. தமிழ்நாடு e-சேவை போர்டல் (TN e-Sevai)',
            body: 'வருமானச் சான்றிதழ், சாதிச் சான்றிதழ், இருப்பிடச் சான்றிதழ் மற்றும் குடும்ப அட்டை சேவைகளை tnesevai.tn.gov.in மூலம் இடைத்தரகர்கள் இன்றி விண்ணப்பிக்கலாம்.',
          },
        ],
        summary: [
          'டிஜிலாக்கர் அசல் சான்றிதழ்களுக்கு இணையான சட்டப்பூர்வ செல்லுபடியாகும் தன்மையைக் கொண்டுள்ளது.',
          'மத்திய கல்வி உதவித்தொகைகளுக்கு scholarships.gov.in தளத்தைப் பயன்படுத்துங்கள்.',
          'சான்றிதழ்களுக்கு அதிகாரப்பூர்வ தமிழ்நாடு இ-சேவை தளத்தைப் பயன்படுத்துங்கள்.',
        ],
      },
      audioScript: 'பாடம் நான்கு: இணையவழி அரசு சேவைகள். இன்று மாணவர்கள் தங்கள் கல்விச் சான்றிதழ்கள் மற்றும் உதவித்தொகைகளை மொபைல் மூலமாகவே பெற முடியும். டிஜிலாக்கர் மூலம் உங்கள் ஆதார் மற்றும் பள்ளி மதிப்பெண் சான்றிதழ்களைப் பாதுகாப்பாக வைத்திருக்கலாம். கல்லூரி உதவித்தொகைகளுக்கு ஸ்காலர்ஷிப்ஸ் டாட் ஜிஓவி டாட் ஐஎன் தளத்தைப் பயன்படுத்துங்கள். இடைத்தரகர்களை நாடாமல் அரசு போர்டல்களைப் பயன்படுத்தக் கற்றுக்கொள்வதே டிஜிட்டல் சுதந்திரம்!',
    },
  ],
  hi: [
    {
      id: 'lesson-1',
      topicId: 'digital-basics',
      number: 1,
      title: '1. स्मार्टफोन की बुनियादी बातें',
      description: 'स्मार्टफोन, ऐप्स और इंटरनेट का सुरक्षित उपयोग सीखें।',
      readTime: '4 मिनट पढ़ें',
      audioDuration: '3 मिनट सुनें',
      content: {
        introduction: 'स्मार्टफोन आपको आवश्यक सेवाओं, शिक्षा, परिवार और सरकारी योजनाओं से जोड़ता है। इसकी बुनियादी समझ आपको आत्मविश्वास देती है।',
        sections: [
          {
            heading: '1. होम स्क्रीन और ऐप्स का उपयोग',
            body: 'आपका फोन टचस्क्रीन पर काम करता है। किसी भी ऐप को केवल आधिकारिक गूगल प्ले स्टोर (Google Play Store) या एप्पल ऐप स्टोर से ही डाउनलोड करें।',
            tips: [
              'ऐप इंस्टॉल करने से पहले डेवलपर का नाम अवश्य जांचें।',
              'व्हाट्सएप या एसएमएस में आए .apk लिंक पर कभी क्लिक न करें।',
            ],
          },
          {
            heading: '2. वाई-फाई और मोबाइल डेटा का प्रबंधन',
            body: 'त्वरित सेटिंग्स के लिए स्क्रीन के ऊपर से नीचे स्वाइप करें। सार्वजनिक स्थानों पर उपयोग न होने पर वाई-फाई बंद रखें।',
          },
          {
            heading: '3. स्क्रीन लॉक सुरक्षा',
            body: 'अपने फोन को 6 अंकों के पिन या फिंगरप्रिंट से सुरक्षित रखें। 1234 या जन्म वर्ष जैसे सरल नंबर कभी न रखें।',
            warning: 'अपने फोन का लॉक कोड कभी किसी अनजान व्यक्ति को न बताएं।',
          },
        ],
        summary: [
          'केवल आधिकारिक ऐप स्टोर से ही ऐप डाउनलोड करें।',
          'हमेशा सुरक्षित 6 अंकों का स्क्रीन लॉक पिन उपयोग करें।',
          'सेटिंग्स में टेक्स्ट का आकार अपनी सुविधा अनुसार बदलें।',
        ],
      },
      audioScript: 'पाठ एक में आपका स्वागत है: स्मार्टफोन की बुनियादी बातें। स्मार्टफोन शिक्षा और सरकारी योजनाओं को पाने का एक सशक्त माध्यम है। पहली बात, हमेशा आधिकारिक गूगल प्ले स्टोर से ही ऐप इंस्टॉल करें और संदेशों में आए डॉट एपीके फाइलों को कभी न खोलें। दूसरी बात, अपने फोन को छह अंकों के सुरक्षित पिन या फिंगरप्रिंट से लॉक रखें। छोटे कदम बड़े बदलाव लाते हैं!',
    },
    {
      id: 'lesson-2',
      topicId: 'online-safety',
      number: 2,
      title: '2. ऑनलाइन सुरक्षा',
      description: 'अपनी निजी जानकारी सुरक्षित रखें और साइबर अपराध से बचें।',
      readTime: '5 मिनट पढ़ें',
      audioDuration: '4 मिनट सुनें',
      content: {
        introduction: 'इंटरनेट उपयोगी है, लेकिन सुरक्षित रहने के लिए धोखाधड़ी और नकली लिंक की पहचान जरूरी है।',
        sections: [
          {
            heading: '1. पासवर्ड और ओटीपी का सुनहरा नियम',
            body: 'आपका ओटीपी (OTP) आपके बैंक लॉकर की चाबी जैसा है। कोई भी असली बैंक अधिकारी या पुलिसकर्मी कभी फोन पर ओटीपी नहीं मांगता।',
            warning: 'खाता बंद होने या लॉटरी के नाम पर ओटीपी मांगने पर तुरंत फोन काट दें!',
          },
          {
            heading: '2. फर्जी लिंक की पहचान',
            body: 'भारत सरकार की सभी आधिकारिक वेबसाइट्स हमेशा ".gov.in" या ".nic.in" पर समाप्त होती हैं।',
            tips: [
              'वेब ब्राउज़र में पैडलॉक (ताले) के चिन्ह की जांच करें।',
              'बिजली कटने के नाम पर आए अनजान एसएमएस से सावधान रहें।',
            ],
          },
          {
            heading: '3. ऐप अनुमतियों की जांच',
            body: 'किसी साधारण ऐप को कैमरा, कॉन्टैक्ट्स या लोकेशन की गैर-जरूरी अनुमति कभी न दें।',
          },
        ],
        summary: [
          'किसी भी परिस्थिति में अपना ओटीपी किसी से साझा न करें।',
          'सरकारी वेबसाइट्स हमेशा .gov.in या .nic.in पर समाप्त होती हैं।',
          'फोन सेटिंग्स में गैर-जरूरी ऐप परमिशन बंद रखें।',
        ],
      },
      audioScript: 'पाठ दो: ऑनलाइन सुरक्षा। याद रखें: आपका ओटीपी आपकी निजी चाबी है। असली बैंक कर्मचारी या पुलिस अधिकारी कभी भी फोन पर ओटीपी नहीं मांगते। यदि कोई बिजली काटने या खाता ब्लॉक करने की धमकी देकर ओटीपी मांगे, तो यह एक फ्रॉड है। सुरक्षित रहें और सतर्क रहें!',
    },
    {
      id: 'lesson-3',
      topicId: 'upi-payments',
      number: 3,
      title: '3. यूपीआई और डिजिटल भुगतान',
      description: 'यूपीआई से सुरक्षित और आसान भुगतान करना सीखें।',
      readTime: '5 मिनट पढ़ें',
      audioDuration: '3.5 मिनट सुनें',
      content: {
        introduction: 'यूपीआई ने पैसों का लेन-देन बहुत आसान कर दिया है। इसके बुनियादी नियम जानने से आप धोखाधड़ी से बच सकते हैं।',
        sections: [
          {
            heading: '1. सबसे बड़ा नियम: पैसे पाने के लिए पिन की जरूरत नहीं होती!',
            body: 'अपने बैंक खाते में पैसे प्राप्त करने के लिए आपको कभी भी यूपीआई पिन डालने की जरूरत नहीं होती। यदि कोई कहे कि पैसे पाने के लिए क्यूआर कोड स्कैन करके पिन डालें, तो वह धोखाधड़ी कर रहा है।',
            warning: 'यूपीआई पिन दर्ज करने से हमेशा आपके खाते से पैसे कटते हैं।',
          },
          {
            heading: '2. पैसे भेजने से पहले नाम जांचें',
            body: 'क्यूआर कोड स्कैन करते समय स्क्रीन पर दिखने वाले असली नाम की पुष्टि जरूर करें।',
          },
          {
            heading: '3. गलत लेन-देन होने पर तुरंत क्या करें?',
            body: 'धोखाधड़ी होने पर तुरंत 1930 राष्ट्रीय साइबर क्राइम हेल्पलाइन पर कॉल करें और बैंक को सूचित करें।',
          },
        ],
        summary: [
          'पैसे प्राप्त करने के लिए कभी यूपीआई पिन न डालें।',
          'पैसे भेजने से पहले स्क्रीन पर दिखने वाले नाम की जांच करें।',
          'बैंक से जुड़े मोबाइल नंबर पर एसएमएस अलर्ट चालू रखें।',
        ],
      },
      audioScript: 'पाठ तीन: यूपीआई और डिजिटल भुगतान। सबसे महत्वपूर्ण नियम यह है कि पैसे प्राप्त करने के लिए कभी भी यूपीआई पिन दर्ज नहीं करना होता। पिन केवल पैसे भेजने के लिए दर्ज किया जाता है। यदि कोई कहे कि छात्रवृत्ति या कैशबैक पाने के लिए पिन डालें, तो वह धोखा है। हमेशा सावधान रहें।',
    },
    {
      id: 'lesson-4',
      topicId: 'gov-services',
      number: 4,
      title: '4. सरकारी डिजिटल सेवाएं',
      description: 'सरकारी योजनाएं, छात्रवृत्ति और प्रमाण पत्र ऑनलाइन प्राप्त करें।',
      readTime: '6 मिनट पढ़ें',
      audioDuration: '4 मिनट सुनें',
      content: {
        introduction: 'डिजिटल इंडिया के माध्यम से छात्र और नागरिक अपने प्रमाण पत्र और छात्रवृत्ति घर बैठे प्राप्त कर सकते हैं।',
        sections: [
          {
            heading: '1. डिजिलॉकर (DigiLocker): आपका कानूनी डिजिटल वॉलेट',
            body: 'डिजिलॉकर (digilocker.gov.in) पर आधार, 10वीं-12वीं की मार्कशीट और ड्राइविंग लाइसेंस कानूनी रूप से मान्य डिजिटल रूप में उपलब्ध रहते हैं।',
            tips: [
              'डिजिलॉकर के दस्तावेज मूल दस्तावेजों के बराबर कानूनी मान्यता रखते हैं।',
              'आधार नंबर और ओटीपी द्वारा सुरक्षित लॉगिन करें।',
            ],
          },
          {
            heading: '2. राष्ट्रीय छात्रवृत्ति पोर्टल (NSP)',
            body: 'कॉलेज और स्कूल छात्रवृत्ति के लिए scholarships.gov.in पर वन-टाइम रजिस्ट्रेशन (OTR) करके आवेदन करें।',
          },
          {
            heading: '3. राज्य नागरिक पोर्टल',
            body: 'आय, जाति और निवास प्रमाण पत्र के लिए अपने राज्य के आधिकारिक ई-सेवा पोर्टल का उपयोग करें।',
          },
        ],
        summary: [
          'डिजिलॉकर के दस्तावेज कानूनी रूप से पूरी तरह मान्य हैं।',
          'केंद्रीय छात्रवृत्ति के लिए scholarships.gov.in का उपयोग करें।',
          'प्रमाण पत्रों के लिए आधिकारिक सरकारी पोर्टल का ही उपयोग करें।',
        ],
      },
      audioScript: 'पाठ चार: सरकारी डिजिटल सेवाएं। आज छात्र अपने फोन से ही छात्रवृत्ति और डिजिटल मार्कशीट प्राप्त कर सकते हैं। डिजिलॉकर में रखे दस्तावेज पूरे देश में कानूनी रूप से मान्य हैं। कॉलेज छात्रवृत्ति के लिए आधिकारिक पोर्टल स्कॉलरशिप्स डॉट जीओवी डॉट इन का उपयोग करें।',
    },
  ],
  te: [
    {
      id: 'lesson-1',
      topicId: 'digital-basics',
      number: 1,
      title: '1. స్మార్ట్‌ఫోన్ బేసిక్స్',
      description: 'స్మార్ట్‌ఫోన్, యాప్‌లు మరియు ఇంటర్నెట్‌ను సురక్షితంగా ఉపయోగించడం నేర్చుకోండి.',
      readTime: '4 నిమిషాల చదువు',
      audioDuration: '3 నిమిషాల వినడం',
      content: {
        introduction: 'స్మార్ట్‌ఫోన్ మిమ్మల్ని విద్య, సంక్షేమ పథకాలు మరియు కుటుంబంతో కలుపుతుంది. దీని ప్రాథమిక అంశాలు తెలుసుకోవడం మీకు నమ్మకాన్ని ఇస్తుంది.',
        sections: [
          {
            heading: '1. హోమ్ స్క్రీన్ మరియు యాప్‌ల ఉపయోగం',
            body: 'మీ ఫోన్ టచ్‌స్క్రీన్‌తో పనిచేస్తుంది. గూగుల్ ప్లే స్టోర్ లేదా యాపిల్ యాప్ స్టోర్ నుండి మాత్రమే యాప్‌లను ఇన్‌స్టాల్ చేసుకోండి. వాట్సాప్ లేదా మెసేజ్‌లలో వచ్చే డాట్ ఏపీకే లింక్‌లను ఎప్పుడూ తెరవవద్దు.',
            tips: ['యాప్ ఇన్‌స్టాల్ చేసే ముందు ధృవీకరించబడిన డెవలపర్‌ను చూడండి.'],
          },
          {
            heading: '2. స్క్రీన్ లాక్ భద్రత',
            body: 'మీ ఫోన్‌ను 6 అంకెల పిన్ లేదా వేలిముద్రతో లాక్ చేయండి. 1234 లేదా మీ పుట్టిన సంవత్సరం వంటి సులభమైన నంబర్లను ఎప్పుడూ ఉపయోగించవద్దు.',
          },
        ],
        summary: ['అధికారిక యాప్ స్టోర్ నుండి మాత్రమే యాప్‌లను డౌన్‌లోడ్ చేయండి.', 'సురక్షితమైన స్క్రీన్ లాక్ పిన్ ఉపయోగించండి.'],
      },
      audioScript: 'మొదటి పాఠానికి స్వాగతం: స్మార్ట్‌ఫోన్ బేసిక్స్. గూగుల్ ప్లే స్టోర్ నుండి మాత్రమే యాప్‌లను ఇన్‌స్టాల్ చేయండి. మీ ఫోన్‌ను సురక్షితమైన 6 అంకెల పిన్‌తో లాక్ చేయండి. చిన్న అడుగులు పెద్ద మార్పులను సృష్టిస్తాయి!',
    },
    {
      id: 'lesson-2',
      topicId: 'online-safety',
      number: 2,
      title: '2. ఆన్‌లైన్ భద్రత',
      description: 'మీ వ్యక్తిగత వివరాలను భద్రపరుచుకోండి మరియు సైబర్ మోసాల బారిన పడకుండా ఉండండి.',
      readTime: '5 నిమిషాల చదువు',
      audioDuration: '4 నిమిషాల వినడం',
      content: {
        introduction: 'ఇంటర్నెట్ ఉపయోగకరంగా ఉన్నప్పటికీ, మోసాలను గుర్తించడం చాలా ముఖ్యం.',
        sections: [
          {
            heading: '1. ఓటీపీ (OTP) భద్రతా నియమం',
            body: 'మీ ఓటీపీ మీ బ్యాంక్ లాకర్ తాళం చెవి లాంటిది. నిజమైన బ్యాంక్ అధికారులు లేదా పోలీసులు ఎప్పుడూ ఫోన్‌లో ఓటీపీ అడగరు.',
            warning: 'ఎవరైనా ఓటీపీ అడిగితే వెంటనే ఫోన్ కట్ చేయండి!',
          },
          {
            heading: '2. ప్రభుత్వ వెబ్‌సైట్ల గుర్తింపు',
            body: 'భారత ప్రభుత్వ అధికారిక వెబ్‌సైట్‌లు ఎల్లప్పుడూ ".gov.in" లేదా ".nic.in" తో ముగుస్తాయి.',
          },
        ],
        summary: ['మీ ఓటీపీని ఎవరితోనూ పంచుకోవద్దు.', 'అధికారిక ప్రభుత్వ వెబ్‌సైట్లు .gov.in తో ముగుస్తాయి.'],
      },
      audioScript: 'పాఠం రెండు: ఆన్‌లైన్ భద్రత. మీ ఓటీపీ మీ వ్యక్తిగత రహస్యం. నిజమైన బ్యాంక్ అధికారులు లేదా పోలీసులు ఫోన్‌లో ఓటీపీ అడగరు. ప్రభుత్వ వెబ్‌సైట్‌లు ఎల్లప్పుడూ డాట్ జీవోవీ డాట్ ఇన్ తో ముగుస్తాయి. జాగ్రత్తగా ఉండండి!',
    },
    {
      id: 'lesson-3',
      topicId: 'upi-payments',
      number: 3,
      title: '3. యూపీఐ & డిజిటల్ చెల్లింపులు',
      description: 'యూపీఐ ద్వారా సురక్షితంగా మరియు సులభంగా చెల్లింపులు చేయడం నేర్చుకోండి.',
      readTime: '5 నిమిషాల చదువు',
      audioDuration: '3.5 నిమిషాల వినడం',
      content: {
        introduction: 'యూపీఐ చెల్లింపులను సులభతరం చేసింది. దీని నియమాలు తెలుసుకోవడం వల్ల మోసాల నుండి రక్షణ పొందవచ్చు.',
        sections: [
          {
            heading: '1. ముఖ్యమైన నియమం: డబ్బులు పొందడానికి పిన్ అవసరం లేదు!',
            body: 'మీ బ్యాంక్ ఖాతాలో డబ్బులు జమ కావడానికి మీరు ఎప్పుడూ యూపీఐ పిన్ నమోదు చేయవలసిన అవసరం లేదు. పిన్ నమోదు చేస్తే మీ ఖాతా నుండి డబ్బులు కట్ అవుతాయి.',
            warning: 'డబ్బులు పొందడానికి పిన్ నమోదు చేయమని ఎవరైనా చెబితే అది మోసం!',
          },
        ],
        summary: ['డబ్బులు పొందడానికి ఎప్పుడూ యూపీఐ పిన్ నమోదు చేయవద్దు.', 'డబ్బు పంపే ముందు స్క్రీన్‌పై ఉన్న పేరును సరిచూసుకోండి.'],
      },
      audioScript: 'పాఠం మూడు: యూపీఐ చెల్లింపులు. అత్యంత ముఖ్యమైన నియమం: మీ ఖాతాలోకి డబ్బులు రావడానికి మీరు ఎప్పుడూ యూపీఐ పిన్ ఎంటర్ చేయవలసిన అవసరం లేదు. పిన్ నమోదు చేస్తే మీ డబ్బులు పోతాయి. జాగ్రత్తగా ఉండండి!',
    },
    {
      id: 'lesson-4',
      topicId: 'gov-services',
      number: 4,
      title: '4. ప్రభుత్వ డిజిటల్ సేవలు',
      description: 'ప్రభుత్వ పథకాలు, స్కాలర్‌షిప్‌లు మరియు సర్టిఫికెట్లను ఆన్‌లైన్‌లో పొందండి.',
      readTime: '6 నిమిషాల చదువు',
      audioDuration: '4 నిమిషాల వినడం',
      content: {
        introduction: 'డిజిలాకర్ మరియు స్కాలర్‌షిప్ పోర్టల్ ద్వారా విద్యార్థులు సర్టిఫికెట్లను సులభంగా పొందవచ్చు.',
        sections: [
          {
            heading: '1. డిజిలాకర్ (DigiLocker)',
            body: 'డిజిలాకర్ (digilocker.gov.in) లో ఆధార్, పదో తరగతి మార్కుల జాబితా మరియు డ్రైవింగ్ లైసెన్స్ చట్టబద్ధంగా చెల్లుబాటు అయ్యే డిజిటల్ రూపంలో ఉంటాయి.',
          },
          {
            heading: '2. నేషనల్ స్కాలర్‌షిప్ పోర్టల్ (NSP)',
            body: 'స్కాలర్‌షిప్‌ల కోసం scholarships.gov.in లో రిజిస్ట్రేషన్ చేసుకోండి.',
          },
        ],
        summary: ['డిజిలాకర్ పత్రాలు చట్టబద్ధంగా చెల్లుతాయి.', 'స్కాలర్‌షిప్‌ల కోసం scholarships.gov.in ఉపయోగించండి.'],
      },
      audioScript: 'పాఠం నాలుగు: ప్రభుత్వ సేవలు. డిజిలాకర్‌లోని పత్రాలు చట్టబద్ధమైనవి. కాలేజీ స్కాలర్‌షిప్‌ల కోసం scholarships.gov.in ను ఉపయోగించండి. డిజిటల్ సాధికారతతో ముందుకు సాగండి!',
    },
  ],
  mr: [
    {
      id: 'lesson-1',
      topicId: 'digital-basics',
      number: 1,
      title: '1. स्मार्टफोनच्या मूलभूत गोष्टी',
      description: 'स्मार्टफोन, ॲप्स आणि इंटरनेटचा सुरक्षित वापर शिका.',
      readTime: '४ मिनिटे वाचन',
      audioDuration: '३ मिनिटे ऐका',
      content: {
        introduction: 'स्मार्टफोन आपल्याला शिक्षण, सरकारी योजना आणि कुटुंबाशी जोडतो. याची प्राथमिक माहिती असणे आवश्यक आहे.',
        sections: [
          {
            heading: '१. ॲप्स डाऊनलोड करण्याचे नियम',
            body: 'फक्त गुगल प्ले स्टोअर किंवा ॲपल ॲप स्टोअरवरूनच ॲप्स इन्स्टॉल करा. अनोळखी एपीके लिंक्सवर कधीही क्लिक करू नका.',
          },
          {
            heading: '२. स्क्रीन लॉक सुरक्षा',
            body: 'फोनसाठी ६ अंकी पिन किंवा फिंगरप्रिंट लॉक वापरा. सोपे पासवर्ड ठेवू नका.',
          },
        ],
        summary: ['फक्त अधिकृत ॲप स्टोअरवरूनच ॲप्स डाऊनलोड करा.', 'स्क्रीन लॉकसाठी सुरक्षित पिन वापरा.'],
      },
      audioScript: 'पहिल्या पाठात आपले स्वागत आहे: स्मार्टफोनच्या मूलभूत गोष्टी. फक्त अधिकृत प्ले स्टोअरवरूनच ॲप्स डाऊनलोड करा आणि फोनला सुरक्षित पिनने लॉक ठेवा. लहान पावले मोठे बदल घडवून आणतात!',
    },
    {
      id: 'lesson-2',
      topicId: 'online-safety',
      number: 2,
      title: '2. ऑनलाइन सुरक्षितता',
      description: 'आपली खाजगी माहिती सुरक्षित ठेवा आणि सायबर फसवणुकीपासून सावध राहा.',
      readTime: '५ मिनिटे वाचन',
      audioDuration: '४ मिनिटे ऐका',
      content: {
        introduction: 'इंटरनेटवर सुरक्षित राहण्यासाठी ओटीपी आणि संशयास्पद लिंक्स ओळखणे महत्त्वाचे आहे.',
        sections: [
          {
            heading: '१. ओटीपीचा सुवर्णनियम',
            body: 'बँक अधिकारी किंवा पोलीस कधीही फोनवर ओटीपी मागत नाहीत. कोणालाही ओटीपी देऊ नका.',
            warning: 'ओटीपी मागणाऱ्या कॉलवर लगेच फोन कट करा!',
          },
          {
            heading: '२. शासकीय संकेतस्थळे',
            body: 'शासकीय संकेतस्थळे नेहमी ".gov.in" ने संपतात.',
          },
        ],
        summary: ['ओटीपी कोणालाही शेअर करू नका.', 'शासकीय संकेतस्थळे नेहमी .gov.in ने संपतात.'],
      },
      audioScript: 'पाठ दुसरा: ऑनलाइन सुरक्षितता. ओटीपी ही तुमची वैयक्तिक चावी आहे. कोणीही मागितल्यास ओटीपी देऊ नका. शासकीय संकेतस्थळे नेहमी डॉट जीओव्ही डॉट इन ने संपतात. सावध राहा!',
    },
    {
      id: 'lesson-3',
      topicId: 'upi-payments',
      number: 3,
      title: '3. युपीआय आणि डिजिटल पेमेंट्स',
      description: 'युपीआय द्वारे सुरक्षित आणि सोपे व्यवहार करायला शिका.',
      readTime: '५ मिनिटे वाचन',
      audioDuration: '३.५ मिनिटे ऐका',
      content: {
        introduction: 'युपीआयचा सर्वात महत्त्वाचा नियम: पैसे मिळवण्यासाठी पिनची गरज नसते!',
        sections: [
          {
            heading: '१. पैसे स्वीकारण्यासाठी पिन टाकू नका!',
            body: 'खात्यात पैसे जमा होण्यासाठी कधीही युपीआय पिन टाकावा लागत नाही. पिन टाकल्यास खात्यातून पैसे कापले जातात.',
          },
        ],
        summary: ['पैसे स्वीकारण्यासाठी कधीही पिन टाकू नका.', 'पैसे पाठवण्यापूर्वी नाव तपासा.'],
      },
      audioScript: 'पाठ तिसरा: युपीआय पेमेंट्स. सर्वात महत्त्वाचा नियम म्हणजे पैसे मिळवण्यासाठी कधीही युपीआय पिन टाकायचा नसतो. पिन टाकल्यास पैसे वजा होतात. काळजी घ्या!',
    },
    {
      id: 'lesson-4',
      topicId: 'gov-services',
      number: 4,
      title: '4. शासकीय डिजिटल सेवा',
      description: 'शासकीय योजना, शिष्यवृत्ती आणि कागदपत्रे घरबसल्या मिळवा.',
      readTime: '६ मिनिटे वाचन',
      audioDuration: '४ मिनिटे ऐका',
      content: {
        introduction: 'डिजीलॉकर आणि शिष्यवृत्ती पोर्टलच्या माध्यमातून घरबसल्या शासकीय सेवांचा लाभ घ्या.',
        sections: [
          {
            heading: '१. डिजीलॉकर (DigiLocker)',
            body: 'डिजीलॉकरमधील कागदपत्रे मूळ कागदपत्रांप्रमाणेच कायदेशीरदृष्ट्या वैध असतात.',
          },
        ],
        summary: ['डिजीलॉकर कागदपत्रे कायदेशीररीत्या वैध आहेत.', 'शिष्यवृत्तीसाठी scholarships.gov.in वापरा.'],
      },
      audioScript: 'पाठ चौथा: शासकीय सेवा. डिजीलॉकरमधील कागदपत्रे कायदेशीररीत्या वैध असतात. शिष्यवृत्तीसाठी scholarships.gov.in चा वापर करा.',
    },
  ],
  ml: [
    {
      id: 'lesson-1',
      topicId: 'digital-basics',
      number: 1,
      title: '1. സ്മാർട്ട്ഫോൺ അടിസ്ഥാനങ്ങൾ',
      description: 'സ്മാർട്ട്ഫോൺ, ആപ്പുകൾ, ഇന്റർനെറ്റ് എന്നിവ സുരക്ഷിതമായി ഉപയോഗിക്കാൻ പഠിക്കുക.',
      readTime: '4 മിനിറ്റ് വായന',
      audioDuration: '3 മിനിറ്റ് കേൾക്കുക',
      content: {
        introduction: 'സ്മാർട്ട്ഫോണുകൾ വിദ്യാഭ്യാസത്തിനും സർക്കാർ ആനുകൂല്യങ്ങൾക്കും ഉപകാരപ്രദമാണ്.',
        sections: [
          {
            heading: '1. ആപ്പുകൾ ഡൗൺലോഡ് ചെയ്യുമ്പോൾ',
            body: 'ഗൂഗിൾ പ്ലേ സ്റ്റോറിൽ നിന്ന് മാത്രം ആപ്പുകൾ ഡൗൺലോഡ് ചെയ്യുക. സന്ദേശങ്ങളിൽ വരുന്ന ലിങ്കുകൾ വഴി ആപ്പുകൾ ഇൻസ്റ്റാൾ ചെയ്യരുത്.',
          },
        ],
        summary: ['ഔദ്യോഗിക ആപ്പ് സ്റ്റോറുകൾ മാത്രം ഉപയോഗിക്കുക.', 'സുരക്ഷിതമായ സ്ക്രീൻ ലോക്ക് ഉപയോഗിക്കുക.'],
      },
      audioScript: 'പാഠം ഒന്നിലേക്ക് സ്വാഗതം: സ്മാർട്ട്ഫോൺ അടിസ്ഥാനങ്ങൾ. പ്ലേ സ്റ്റോറിൽ നിന്ന് മാത്രം ആപ്പുകൾ ഡൗൺലോഡ് ചെയ്യുക. ഫോൺ സുരക്ഷിതമായി സൂക്ഷിക്കുക.',
    },
    {
      id: 'lesson-2',
      topicId: 'online-safety',
      number: 2,
      title: '2. ഓൺലൈൻ സുരക്ഷ',
      description: 'വ്യക്തിഗത വിവരങ്ങൾ സുരക്ഷിതമാക്കി ഓൺലൈൻ തട്ടിപ്പുകളിൽ നിന്ന് രക്ഷപ്പെടുക.',
      readTime: '5 മിനിറ്റ് വായന',
      audioDuration: '4 മിനിറ്റ് കേൾക്കുക',
      content: {
        introduction: 'ഒടിപിയും പാസ്‌വേഡും രഹസ്യമായി സൂക്ഷിക്കുക.',
        sections: [
          {
            heading: '1. ഒടിപി ആർക്കും നൽകരുത്',
            body: 'ബാങ്ക് ഉദ്യോഗസ്ഥരോ പോലീസോ ഒരിക്കലും ഫോണിൽ ഒടിപി ആവശ്യപ്പെടില്ല.',
          },
        ],
        summary: ['ഒടിപി ഒരിക്കലും മറ്റുള്ളവരുമായി പങ്കിടരുത്.', 'ഔദ്യോഗിക വെബ്സൈറ്റുകൾ .gov.in ൽ അവസാനിക്കുന്നു.'],
      },
      audioScript: 'പാഠം രണ്ട്: ഓൺലൈൻ സുരക്ഷ. നിങ്ങളുടെ ഒടിപി ആരുമായും പങ്കിടരുത്. സർക്കാർ വെബ്സൈറ്റുകൾ എപ്പോഴും ഡോട്ട് ജിഒവി ഡോട്ട് ഇൻ ൽ അവസാനിക്കുന്നു.',
    },
    {
      id: 'lesson-3',
      topicId: 'upi-payments',
      number: 3,
      title: '3. യുപിഐ പേയ്‌മെന്റുകൾ',
      description: 'യുപിഐ വഴി സുരക്ഷിതമായി പണമിടപാടുകൾ നടത്താൻ പഠിക്കുക.',
      readTime: '5 മിനിറ്റ് വായന',
      audioDuration: '3.5 മിനിറ്റ് കേൾക്കുക',
      content: {
        introduction: 'പണം ലഭിക്കാൻ യുപിഐ പിൻ ആവശ്യമില്ലെന്ന കാര്യം ഓർക്കുക!',
        sections: [
          {
            heading: '1. പണം ലഭിക്കാൻ പിൻ നൽകരുത്',
            body: 'നിങ്ങളുടെ അക്കൗണ്ടിലേക്ക് പണം വരാൻ ഒരിക്കലും യുപിഐ പിൻ നൽകേണ്ടതില്ല. പിൻ നൽകിയാൽ പണം നഷ്ടപ്പെടും.',
          },
        ],
        summary: ['പണം സ്വീകരിക്കാൻ പിൻ അടിക്കേണ്ടതില്ല.', 'പണം അയക്കുന്നതിന് മുൻപ് പേര് പരിശോധിക്കുക.'],
      },
      audioScript: 'പാഠം മൂന്ന്: യുപിഐ പേയ്‌മെന്റുകൾ. നിങ്ങളുടെ അക്കൗണ്ടിലേക്ക് പണം ലഭിക്കാൻ ഒരിക്കലും പിൻ നൽകരുത്. ജാഗ്രത പാലിക്കുക!',
    },
    {
      id: 'lesson-4',
      topicId: 'gov-services',
      number: 4,
      title: '4. സർക്കാർ ഓൺലൈൻ സേവനങ്ങൾ',
      description: 'സർക്കാർ പദ്ധതികളും സ്കോളർഷിപ്പുകളും വീട്ടിലിരുന്ന് തന്നെ കണ്ടെത്തൂ.',
      readTime: '6 മിനിറ്റ് വായന',
      audioDuration: '4 മിനിറ്റ് കേൾക്കുക',
      content: {
        introduction: 'ഡിജിലോക്കർ വഴി ഒറിജിനൽ സർട്ടിഫിക്കറ്റുകൾ സുരക്ഷിതമായി സൂക്ഷിക്കാം.',
        sections: [
          {
            heading: '1. ഡിജിലോക്കർ',
            body: 'ഡിജിലോക്കറിലെ രേഖകൾക്ക് നിയമപരമായ സാധുതയുണ്ട്.',
          },
        ],
        summary: ['ഡിജിലോക്കർ രേഖകൾ നിയമപരമായി സാധുതയുള്ളതാണ്.', 'സ്കോളർഷിപ്പുകൾക്കായി scholarships.gov.in സന്ദർശിക്കുക.'],
      },
      audioScript: 'പാഠം നാല്: സർക്കാർ സേവനങ്ങൾ. ഡിജിലോക്കർ രേഖകൾ പൂർണ്ണമായും അംഗീകൃതമാണ്. സ്കോളർഷിപ്പുകൾക്കായി scholarships.gov.in ഉപയോഗിക്കുക.',
    },
  ],
  gu: [
    {
      id: 'lesson-1',
      topicId: 'digital-basics',
      number: 1,
      title: '1. સ્માર્ટફોન મૂળભૂત બાબતો',
      description: 'સ્માર્ટફોન, એપ્લિકેશન્સ અને ઇન્ટરનેટનો સુરક્ષિત ઉપયોગ શીખો.',
      readTime: '4 મિનિટ વાંચો',
      audioDuration: '3 મિનિટ સાંભળો',
      content: {
        introduction: 'સ્માર્ટફોન શિક્ષણ અને સરકારી યોજનાઓ મેળવવાનું શ્રેષ્ઠ માધ્યમ છે.',
        sections: [
          {
            heading: '1. એપ ડાઉનલોડ કરવાના નિયમો',
            body: 'હંમેશા સત્તાવાર ગૂગલ પ્લે સ્ટોર પરથી જ એપ્લિકેશન ઇન્સ્ટોલ કરો. શંકાસ્પદ એપીકે ફાઇલો ક્યારેય ડાઉનલોડ ન કરો.',
          },
        ],
        summary: ['માત્ર સત્તાવાર એપ સ્ટોરનો ઉપયોગ કરો.', 'સુરક્ષિત સ્ક્રીન લોક પિન રાખો.'],
      },
      audioScript: 'પાઠ ૧ માં આપનું સ્વાગત છે: સ્માર્ટફોન મૂળભૂત બાબતો. હંમેશા ગૂગલ પ્લે સ્ટોર પરથી જ એપ ઇન્સ્ટોલ કરો અને ફોનને સુરક્ષિત પિનથી લોક રાખો.',
    },
    {
      id: 'lesson-2',
      topicId: 'online-safety',
      number: 2,
      title: '2. ઓનલાઇન સુરક્ષા',
      description: 'તમારી અંગત માહિતી સુરક્ષિત રાખો અને છેતરપિંડીથી બચો.',
      readTime: '5 મિનિટ વાંચો',
      audioDuration: '4 મિનિટ સાંભળો',
      content: {
        introduction: 'ઓટીપી અને પાસવર્ડ હંમેશા ગોપનીય રાખો.',
        sections: [
          {
            heading: '1. ઓટીપી કોઈને આપશો નહીં',
            body: 'સાચા બેંક અધિકારી કે પોલીસ ક્યારેય ફોન પર ઓટીપી માંગતા નથી.',
          },
        ],
        summary: ['કોઈની સાથે ઓટીપી શેર કરશો નહીં.', 'સરકારી વેબસાઇટ્સ .gov.in પર સમાપ્ત થાય છે.'],
      },
      audioScript: 'પાઠ ૨: ઓનલાઇન સુરક્ષા. તમારો ઓટીપી ક્યારેય કોઈને આપશો નહીં. સરકારી વેબસાઇટ્સ હંમેશા ડોટ જીઓવી ડોટ ઇન પર સમાપ્ત થાય છે.',
    },
    {
      id: 'lesson-3',
      topicId: 'upi-payments',
      number: 3,
      title: '3. યુપીઆઈ અને ડિજિટલ પેમેન્ટ્સ',
      description: 'યુપીઆઈ દ્વારા સુરક્ષિત ચુકવણી કરવાનું શીખો.',
      readTime: '5 મિનિટ વાંચો',
      audioDuration: '3.5 મિનિટ સાંભળો',
      content: {
        introduction: 'સૌથી મોટો નિયમ: પૈસા મેળવવા માટે પિનની જરૂર નથી!',
        sections: [
          {
            heading: '1. પૈસા મેળવવા માટે પિન ન નાખો',
            body: 'તમારા ખાતામાં પૈસા જમા થવા માટે ક્યારેય યુપીઆઈ પિન નાખવો પડતો નથી. પિન નાખવાથી ખાતામાંથી પૈસા કપાય છે.',
          },
        ],
        summary: ['પૈસા મેળવવા માટે ક્યારેય પિન ન નાખો.', 'પૈસા મોકલતા પહેલા નામ ચકાસો.'],
      },
      audioScript: 'પાઠ ૩: યુપીઆઈ પેમેન્ટ્સ. પૈસા મેળવવા માટે ક્યારેય યુપીઆઈ પિન નાખવાની જરૂર નથી. સાવચેત રહો!',
    },
    {
      id: 'lesson-4',
      topicId: 'gov-services',
      number: 4,
      title: '4. સરકારી ડિજિટલ સેવાઓ',
      description: 'યોજનાઓ અને પ્રમાણપત્રો ઓનલાઇન મેળવો.',
      readTime: '6 મિનિટ વાંચો',
      audioDuration: '4 મિનિટ સાંભળો',
      content: {
        introduction: 'ડિજીલોકર દ્વારા દસ્તાવેજો સુરક્ષિત રીતે રાખો.',
        sections: [
          {
            heading: '1. ડિજીલોકર',
            body: 'ડિજીલોકરના દસ્તાવેજો કાયદેસર રીતે માન્ય છે.',
          },
        ],
        summary: ['ડિજીલોકરના દસ્તાવેજો કાયદેસર છે.', 'શિષ્યવૃત્તિ માટે scholarships.gov.in નો ઉપયોગ કરો.'],
      },
      audioScript: 'પાઠ ૪: સરકારી સેવાઓ. ડિજીલોકરના દસ્તાવેજો માન્ય છે. શિષ્યવૃત્તિ માટે scholarships.gov.in નો ઉપયોગ કરો.',
    },
  ],
  kn: [
    {
      id: 'lesson-1',
      topicId: 'digital-basics',
      number: 1,
      title: '1. ಸ್ಮಾರ್ಟ್‌ಫೋನ್ ಮೂಲಭೂತ ಅಂಶಗಳು',
      description: 'ಸ್ಮಾರ್ಟ್‌ಫೋನ್, ಆಪ್‌ಗಳು ಮತ್ತು ಇಂಟರ್ನೆಟ್ ಅನ್ನು ಸುರಕ್ಷಿತವಾಗಿ ಬಳಸುವುದು ಹೇಗೆಂದು ತಿಳಿಯಿರಿ.',
      readTime: '4 ನಿಮಿಷ ಓದು',
      audioDuration: '3 ನಿಮಿಷ ಕೇಳಿ',
      content: {
        introduction: 'ಸ್ಮಾರ್ಟ್‌ಫೋನ್ ಶಿಕ್ಷಣ ಮತ್ತು ಸರ್ಕಾರಿ ಯೋಜನೆಗಳನ್ನು ಪಡೆಯಲು ಪ್ರಮುಖ ಸಾಧನವಾಗಿದೆ.',
        sections: [
          {
            heading: '1. ಆಪ್ ಡೌನ್‌ಲೋಡ್ ಮಾಡುವ ನಿಯಮಗಳು',
            body: 'ಕೇವಲ ಅಧಿಕೃತ ಗೂಗಲ್ ಪ್ಲೇ ಸ್ಟೋರ್‌ನಿಂದ ಮಾತ್ರ ಆಪ್‌ಗಳನ್ನು ಡೌನ್‌ಲೋಡ್ ಮಾಡಿ. ಅಜ್ಞಾತ ಎಪಿಕೆ ಫೈಲ್‌ಗಳನ್ನು ತೆರೆಯಬೇಡಿ.',
          },
        ],
        summary: ['ಅಧಿಕೃತ ಆಪ್ ಸ್ಟೋರ್ ಬಳಸಿ.', 'ಸುರಕ್ಷಿತ ಸ್ಕ್ರೀನ್ ಲಾಕ್ ಪಿನ್ ಇರಿಸಿ.'],
      },
      audioScript: 'ಪಾಠ ಒಂದಕ್ಕೆ ಸ್ವಾಗತ: ಸ್ಮಾರ್ಟ್‌ಫೋನ್ ಮೂಲಭೂತ ಅಂಶಗಳು. ಅಧಿಕೃತ ಪ್ಲೇ ಸ್ಟೋರ್‌ನಿಂದ ಮಾತ್ರ ಆಪ್‌ಗಳನ್ನು ಇನ್‌ಸ್ಟಾಲ್ ಮಾಡಿ ಮತ್ತು ಫೋನ್ ಅನ್ನು ಲಾಕ್ ಮಾಡಿಡಿ.',
    },
    {
      id: 'lesson-2',
      topicId: 'online-safety',
      number: 2,
      title: '2. ಆನ್‌ಲೈನ್ ಸುರಕ್ಷತೆ',
      description: 'ನಿಮ್ಮ ವೈಯಕ್ತಿಕ ಮಾಹಿತಿಯನ್ನು ಸುರಕ್ಷಿತವಾಗಿರಿಸಿ ಮತ್ತು ವಂಚನೆಗಳಿಂದ ದೂರವಿರಿ.',
      readTime: '5 ನಿಮಿಷ ಓದು',
      audioDuration: '4 ನಿಮಿಷ ಕೇಳಿ',
      content: {
        introduction: 'ಒಟಿಪಿ ಮತ್ತು ಪಾಸ್‌ವರ್ಡ್ ಅನ್ನು ಗೌಪ್ಯವಾಗಿಡಿ.',
        sections: [
          {
            heading: '1. ಒಟಿಪಿ ಯಾರೊಂದಿಗೂ ಹಂಚಿಕೊಳ್ಳಬೇಡಿ',
            body: 'ಬ್ಯಾಂಕ್ ಅಧಿಕಾರಿಗಳು ಅಥವಾ ಪೊಲೀಸರು ಎಂದಿಗೂ ಫೋನ್‌ನಲ್ಲಿ ಒಟಿಪಿ ಕೇಳುವುದಿಲ್ಲ.',
          },
        ],
        summary: ['ಒಟಿಪಿಯನ್ನು ಯಾರೊಂದಿಗೂ ಹಂಚಿಕೊಳ್ಳಬೇಡಿ.', 'ಸರ್ಕಾರಿ ವೆಬ್‌ಸೈಟ್‌ಗಳು .gov.in ನೊಂದಿಗೆ ಕೊನೆಗೊಳ್ಳುತ್ತವೆ.'],
      },
      audioScript: 'ಪಾಠ ಎರಡು: ಆನ್‌ಲೈನ್ ಸುರಕ್ಷತೆ. ಒಟಿಪಿಯನ್ನು ಯಾರೊಂದಿಗೂ ಹಂಚಿಕೊಳ್ಳಬೇಡಿ. ಸರ್ಕಾರಿ ವೆಬ್‌ಸೈಟ್‌ಗಳು ಡಾಟ್ ಜಿಒವಿ ಡಾಟ್ ಇನ್ ನೊಂದಿಗೆ ಕೊನೆಗೊಳ್ಳುತ್ತವೆ. ಜಾಗರೂಕರಾಗಿರಿ!',
    },
    {
      id: 'lesson-3',
      topicId: 'upi-payments',
      number: 3,
      title: '3. ಯುಪಿಐ ಮತ್ತು ಡಿಜಿಟಲ್ ಪಾವತಿಗಳು',
      description: 'ಯುಪಿಐ ಮೂಲಕ ಸುರಕ್ಷಿತವಾಗಿ ಹಣ ವರ್ಗಾವಣೆ ಮಾಡುವುದನ್ನು ಕಲಿಯಿರಿ.',
      readTime: '5 ನಿಮಿಷ ಓದು',
      audioDuration: '3.5 ನಿಮಿಷ ಕೇಳಿ',
      content: {
        introduction: 'ಪ್ರಮುಖ ನಿಯಮ: ಹಣ ಪಡೆಯಲು ಯುಪಿಐ ಪಿನ್ ಅಗತ್ಯವಿಲ್ಲ!',
        sections: [
          {
            heading: '1. ಹಣ ಪಡೆಯಲು ಪಿನ್ ಹಾಕಬೇಡಿ',
            body: 'ನಿಮ್ಮ ಖಾತೆಗೆ ಹಣ ಬರಲು ಎಂದಿಗೂ ಯುಪಿಐ ಪಿನ್ ಹಾಕಬೇಕಾಗಿಲ್ಲ. ಪಿನ್ ಹಾಕಿದರೆ ಹಣ ಕಡಿತಗೊಳ್ಳುತ್ತದೆ.',
          },
        ],
        summary: ['ಹಣ ಸ್ವೀಕರಿಸಲು ಪಿನ್ ಹಾಕಬೇಡಿ.', 'ಹಣ ಕಳುಹಿಸುವ ಮುನ್ನ ಹೆಸರನ್ನು ಪರಿಶೀಲಿಸಿ.'],
      },
      audioScript: 'ಪಾಠ ಮೂರು: ಯುಪಿಐ ಪಾವತಿಗಳು. ಹಣ ಪಡೆಯಲು ಎಂದಿಗೂ ಯುಪಿಐ ಪಿನ್ ಹಾಕಬೇಕಾಗಿಲ್ಲ. ಜಾಗರೂಕರಾಗಿರಿ!',
    },
    {
      id: 'lesson-4',
      topicId: 'gov-services',
      number: 4,
      title: '4. ಸರ್ಕಾರಿ ಡಿಜಿಟಲ್ ಸೇವೆಗಳು',
      description: 'ಸರ್ಕಾರಿ ಯೋಜನೆಗಳು ಮತ್ತು ವಿದ್ಯಾರ್ಥಿವೇತನವನ್ನು ಆನ್‌ಲೈನ್‌ನಲ್ಲಿ ಪಡೆಯಿರಿ.',
      readTime: '6 ನಿಮಿಷ ಓದು',
      audioDuration: '4 ನಿಮಿಷ ಕೇಳಿ',
      content: {
        introduction: 'ಡಿಜಿಲಾಕರ್ ಮೂಲಕ ಅಧಿಕೃತ ಪ್ರಮಾಣಪತ್ರಗಳನ್ನು ಸುರಕ್ಷಿತವಾಗಿ ಪಡೆಯಿರಿ.',
        sections: [
          {
            heading: '1. ಡಿಜಿಲಾಕರ್ (DigiLocker)',
            body: 'ಡಿಜಿಲಾಕರ್ ದಾಖಲೆಗಳು ಕಾನೂನುಬದ್ಧವಾಗಿ ಮಾನ್ಯವಾಗಿವೆ.',
          },
        ],
        summary: ['ಡಿಜಿಲಾಕರ್ ದಾಖಲೆಗಳು ಕಾನೂನುಬದ್ಧವಾಗಿವೆ.', 'ವಿದ್ಯಾರ್ಥಿವೇತನಕ್ಕಾಗಿ scholarships.gov.in ಬಳಸಿ.'],
      },
      audioScript: 'ಪಾಠ ನಾಲ್ಕು: ಸರ್ಕಾರಿ ಸೇವೆಗಳು. ಡಿಜಿಲಾಕರ್ ದಾಖಲೆಗಳು ಕಾನೂನುಬದ್ಧವಾಗಿವೆ. ವಿದ್ಯಾರ್ಥಿವೇತನಕ್ಕಾಗಿ scholarships.gov.in ಅನ್ನು ಬಳಸಿ.',
    },
  ],
};

// ---------------------------------------------------------------------------
// 3. QUIZZES DATA FULLY LOCALIZED ACROSS 8 LANGUAGES (QUESTIONS & ALL OPTIONS)
// ---------------------------------------------------------------------------
export const QUIZZES_DATA_BY_LANG: Record<LanguageCode, QuizQuestion[]> = {
  en: [
    {
      id: 'q1',
      topicId: 'upi-payments',
      question: 'Do you ever need to enter your UPI PIN to receive money into your bank account?',
      options: [
        'Yes, always to confirm the transaction',
        'Only if the amount is above ₹10,000',
        'No, NEVER! Entering a PIN always deducts money from your account',
        'Yes, if the bank officer calls and asks',
      ],
      correctIndex: 2,
      explanation: 'Correct! You NEVER need to enter your UPI PIN to receive money. Entering your PIN always sends money out of your bank account.',
    },
    {
      id: 'q2',
      topicId: 'online-safety',
      question: 'Which of the following website addresses belongs to an official Government of India portal?',
      options: [
        'www.scholarship-apply-online.com',
        'www.myscheme.gov.in',
        'www.india-gov-benefits.org',
        'www.central-schemes-portal.net',
      ],
      correctIndex: 1,
      explanation: 'Correct! Authentic Indian government websites strictly end with ".gov.in" or ".nic.in". Commercial domains like .com, .net, or .org are not official government portals.',
    },
    {
      id: 'q3',
      topicId: 'online-safety',
      question: 'A caller claims to be a police officer and says you are in "Digital Arrest" over a Skype video call. What should you do?',
      options: [
        'Transfer money to their "verification account" immediately',
        'Stay on the call for 24 hours as instructed',
        'Disconnect immediately and report to 1930 or cybercrime.gov.in — Digital Arrest is a scam!',
        'Share your Aadhaar and bank details to prove innocence',
      ],
      correctIndex: 2,
      explanation: 'Correct! "Digital Arrest" is a dangerous cyber fraud. No court or law enforcement agency arrests people over video calls or demands money transfers.',
    },
    {
      id: 'q4',
      topicId: 'gov-services',
      question: 'Are digital marksheets and driving licenses stored in DigiLocker legally valid like originals?',
      options: [
        'No, they are only for reference',
        'Yes, legally recognized under Rule 9A of the IT Rules',
        'Only if stamped by a local notary',
        'Only valid within your home district',
      ],
      correctIndex: 1,
      explanation: 'Correct! Documents fetched into DigiLocker from original issuers are legally deemed at par with original physical documents across India.',
    },
    {
      id: 'q5',
      topicId: 'digital-basics',
      question: 'What is the safest place to download and install smartphone applications?',
      options: [
        'Links sent by friends in WhatsApp groups',
        'Random websites downloading .apk files',
        'Official stores like Google Play Store or Apple App Store',
        'Pop-up ads promising free gifts',
      ],
      correctIndex: 2,
      explanation: 'Correct! Official stores scan apps for viruses and security issues before publishing.',
    },
  ],
  ta: [
    {
      id: 'q1',
      topicId: 'upi-payments',
      question: 'உங்கள் வங்கிக் கணக்கில் பணத்தைப் பெற நீங்கள் எப்போதாவது UPI PIN-ஐ உள்ளிட வேண்டுமா?',
      options: [
        'ஆம், பரிவர்த்தனையை உறுதிப்படுத்த எப்போதும் தேவை',
        'தொகை ₹10,000-க்கு மேல் இருந்தால் மட்டுமே',
        'இல்லை, ஒருபோதும் தேவையில்லை! PIN-ஐ உள்ளிட்டால் உங்கள் கணக்கிலிருந்து பணம் எடுக்கப்படும்',
        'ஆம், வங்கி அதிகாரி அழைத்து கேட்டால்',
      ],
      correctIndex: 2,
      explanation: 'சரியான பதில்! பணத்தைப் பெற நீங்கள் ஒருபோதும் UPI PIN போடத் தேவையில்லை. PIN உள்ளிடுவது உங்கள் கணக்கிலிருந்து பணத்தை மட்டுமே அனுப்பும்.',
    },
    {
      id: 'q2',
      topicId: 'online-safety',
      question: 'பின்வருவனவற்றில் எது அதிகாரப்பூர்வ இந்திய அரசு இணையதள முகவரி?',
      options: [
        'www.scholarship-apply-online.com',
        'www.myscheme.gov.in',
        'www.india-gov-benefits.org',
        'www.central-schemes-portal.net',
      ],
      correctIndex: 1,
      explanation: 'சரியான பதில்! உண்மையான இந்திய அரசு இணையதளங்கள் எப்போதுமே ".gov.in" அல்லது ".nic.in" என்றுதான் முடியும்.',
    },
    {
      id: 'q3',
      topicId: 'online-safety',
      question: 'ஒருவர் வீடியோ காலில் காவல் அதிகாரி போல் பேசி நீங்கள் "டிஜிட்டல் அரெஸ்ட்" செய்யப்பட்டுள்ளீர்கள் என்றால் என்ன செய்ய வேண்டும்?',
      options: [
        'அவர்கள் கூறிய "சரிபார்ப்புக் கணக்கிற்கு" உடனடியாகப் பணம் அனுப்ப வேண்டும்',
        'அவர்கள் கூறியபடி 24 மணிநேரம் வீடியோ காலிலேயே இருக்க வேண்டும்',
        'உடனடியாக அழைப்பைத் துண்டித்து 1930 அல்லது cybercrime.gov.in-ல் புகாரளிக்க வேண்டும் — இது மோசடி!',
        'உங்கள் ஆதார் மற்றும் வங்கி விவரங்களைப் பகிர வேண்டும்',
      ],
      correctIndex: 2,
      explanation: 'சரியான பதில்! "டிஜிட்டல் அரெஸ்ட்" என்பது அப்பட்டமான சைபர் மோசடி. எந்தவொரு காவல் நிலையமும் வீடியோ கால் மூலம் யாரையும் கைது செய்வதோ பணம் கேட்பதோ இல்லை.',
    },
    {
      id: 'q4',
      topicId: 'gov-services',
      question: 'டிஜிலாக்கரில் (DigiLocker) உள்ள மதிப்பெண் சான்றிதழ்கள் அசலைப் போல சட்டப்பூர்வமாக செல்லுபடியாகுமா?',
      options: [
        'இல்லை, அவை பார்வைக்கு மட்டுமே',
        'ஆம், தகவல் தொழில்நுட்ப விதிகளின்படி அசல் ஆவணங்களுக்கு இணையாகச் செல்லுபடியாகும்',
        'நோட்டரி முத்திரை இருந்தால் மட்டுமே',
        'உங்கள் சொந்த மாவட்டத்தில் மட்டுமே செல்லுபடியாகும்',
      ],
      correctIndex: 1,
      explanation: 'சரியான பதில்! டிஜிலாக்கரில் உள்ள அரசு ஆவணங்கள் அசல் ஆவணங்களைப் போலவே இந்தியா முழுவதும் சட்டப்பூர்வ மதிப்பைக் கொண்டவை.',
    },
    {
      id: 'q5',
      topicId: 'digital-basics',
      question: 'ஸ்மார்ட்போன் செயலிகளைப் பதிவிறக்க பாதுகாப்பான இடம் எது?',
      options: [
        'வாட்ஸ்அப் குழுக்களில் நண்பர்கள் அனுப்பும் இணைப்புகள்',
        'இணையதளங்களில் இருந்து பதிவிறக்கப்படும் .apk கோப்புகள்',
        'கூகிள் பிளே ஸ்டோர் அல்லது ஆப்பிள் ஆப் ஸ்டோர் போன்ற அதிகாரப்பூர்வ தளங்கள்',
        'இலவச பரிசு தரும் பாப்-அப் விளம்பரங்கள்',
      ],
      correctIndex: 2,
      explanation: 'சரியான பதில்! அதிகாரப்பூர்வ ஸ்டோர்கள் செயலிகளை பாதுகாப்பு சோதனைகளுக்குப் பிறகே வெளியிடுகின்றன.',
    },
  ],
  hi: [
    {
      id: 'q1',
      topicId: 'upi-payments',
      question: 'क्या अपने बैंक खाते में पैसे प्राप्त करने के लिए आपको कभी यूपीआई पिन (UPI PIN) दर्ज करने की आवश्यकता होती है?',
      options: [
        'हाँ, लेन-देन की पुष्टि के लिए हमेशा आवश्यक है',
        'केवल तभी जब राशि ₹10,000 से अधिक हो',
        'नहीं, कभी नहीं! पिन दर्ज करने से हमेशा आपके खाते से पैसे कटते हैं',
        'हाँ, यदि बैंक अधिकारी फोन करके कहे',
      ],
      correctIndex: 2,
      explanation: 'बिल्कुल सही! पैसे प्राप्त करने के लिए कभी भी यूपीआई पिन की आवश्यकता नहीं होती। पिन केवल पैसे भेजने के लिए होता है।',
    },
    {
      id: 'q2',
      topicId: 'online-safety',
      question: 'निम्नलिखित में से कौन सा वेब पता भारत सरकार के आधिकारिक पोर्टल का है?',
      options: [
        'www.scholarship-apply-online.com',
        'www.myscheme.gov.in',
        'www.india-gov-benefits.org',
        'www.central-schemes-portal.net',
      ],
      correctIndex: 1,
      explanation: 'सही उत्तर! प्रामाणिक सरकारी वेबसाइटें हमेशा ".gov.in" या ".nic.in" पर समाप्त होती हैं।',
    },
    {
      id: 'q3',
      topicId: 'online-safety',
      question: 'एक कॉलर पुलिस अधिकारी बनकर स्काइप या व्हाट्सएप वीडियो कॉल पर कहता है कि आप "डिजिटल अरेस्ट" हैं। आपको क्या करना चाहिए?',
      options: [
        'तुरंत उनके खाते में पैसे ट्रांसफर कर दें',
        'निर्देशानुसार 24 घंटे कॉल पर बने रहें',
        'तुरंत कॉल काटें और 1930 या cybercrime.gov.in पर रिपोर्ट करें — डिजिटल अरेस्ट एक फ्रॉड है!',
        'अपनी बेगुनाही साबित करने के लिए आधार और बैंक विवरण साझा करें',
      ],
      correctIndex: 2,
      explanation: 'सही उत्तर! "डिजिटल अरेस्ट" एक खतरनाक साइबर फ्रॉड है। कोई भी पुलिस या जांच एजेंसी वीडियो कॉल पर पैसे नहीं मांगती।',
    },
    {
      id: 'q4',
      topicId: 'gov-services',
      question: 'क्या डिजिलॉकर (DigiLocker) में संग्रहीत डिजिटल मार्कशीट और ड्राइविंग लाइसेंस मूल दस्तावेजों की तरह कानूनी रूप से मान्य हैं?',
      options: [
        'नहीं, वे केवल संदर्भ के लिए हैं',
        'हाँ, आईटी नियमों के नियम 9A के तहत कानूनी रूप से पूरी तरह मान्य हैं',
        'केवल तभी जब नोटरी द्वारा सत्यापित हों',
        'केवल आपके गृह जिले में मान्य हैं',
      ],
      correctIndex: 1,
      explanation: 'सही उत्तर! डिजिलॉकर के दस्तावेज पूरे भारत में मूल भौतिक दस्तावेजों के बराबर कानूनी दर्जा रखते हैं।',
    },
    {
      id: 'q5',
      topicId: 'digital-basics',
      question: 'स्मार्टफोन एप्लिकेशन डाउनलोड और इंस्टॉल करने के लिए सबसे सुरक्षित स्थान कौन सा है?',
      options: [
        'व्हाट्सएप ग्रुप में दोस्तों द्वारा भेजे गए लिंक',
        'इंटरनेट से डाउनलोड की गई .apk फाइलें',
        'गूगल प्ले स्टोर या एप्पल ऐप स्टोर जैसे आधिकारिक स्टोर',
        'मुफ्त उपहार का वादा करने वाले पॉप-अप विज्ञापन',
      ],
      correctIndex: 2,
      explanation: 'सही उत्तर! आधिकारिक ऐप स्टोर सुरक्षा जांच के बाद ही ऐप्स प्रकाशित करते हैं।',
    },
  ],
  te: [
    {
      id: 'q1',
      topicId: 'upi-payments',
      question: 'మీ బ్యాంక్ ఖాతాలో డబ్బులు పొందడానికి మీరు ఎప్పుడైనా యూపీఐ పిన్ (UPI PIN) నమోదు చేయాలా?',
      options: [
        'అవును, లావాదేవీని నిర్ధారించడానికి ఎల్లప్పుడూ అవసరం',
        'మొత్తం ₹10,000 కంటే ఎక్కువగా ఉంటే మాత్రమే',
        'కాదు, ఎప్పుడూ అవసరం లేదు! పిన్ నమోదు చేస్తే మీ ఖాతా నుండి డబ్బులు కట్ అవుతాయి',
        'బ్యాంక్ మేనేజర్ ఫోన్ చేసి అడిగితే మాత్రమే',
      ],
      correctIndex: 2,
      explanation: 'సరైన సమాధానం! డబ్బులు పొందడానికి ఎప్పుడూ యూపీఐ పిన్ అవసరం లేదు.',
    },
    {
      id: 'q2',
      topicId: 'online-safety',
      question: 'క్రింది వాటిలో ఏది భారత ప్రభుత్వ అధికారిక వెబ్‌సైట్ చిరునామా?',
      options: [
        'www.scholarship-apply-online.com',
        'www.myscheme.gov.in',
        'www.india-gov-benefits.org',
        'www.central-schemes-portal.net',
      ],
      correctIndex: 1,
      explanation: 'సరైన సమాధానం! ప్రభుత్వ వెబ్‌సైట్‌లు ఎల్లప్పుడూ ".gov.in" లేదా ".nic.in" తో ముగుస్తాయి.',
    },
    {
      id: 'q3',
      topicId: 'online-safety',
      question: 'వీడియో కాల్‌లో పోలీసులుగా నటిస్తూ మీరు "డిజిటల్ అరెస్ట్" లో ఉన్నారని చెబితే మీరు ఏమి చేయాలి?',
      options: [
        'వెంటనే వారి ఖాతాకు డబ్బులు పంపాలి',
        'చెప్పినట్లు 24 గంటలు వీడియో కాల్‌లో ఉండాలి',
        'వెంటనే కాల్ కట్ చేసి 1930 లేదా cybercrime.gov.in లో ఫిర్యాదు చేయాలి — డిజిటల్ అరెస్ట్ ఒక మోసం!',
        'ఆధార్ మరియు బ్యాంక్ వివరాలను పంచుకోవాలి',
      ],
      correctIndex: 2,
      explanation: 'సరైన సమాధానం! డిజిటల్ అరెస్ట్ అనేది సైబర్ నేరం. ఏ పోలీసు సంస్థ వీడియో కాల్ ద్వారా అరెస్ట్ చేయదు.',
    },
    {
      id: 'q4',
      topicId: 'gov-services',
      question: 'డిజిలాకర్‌లోని సర్టిఫికెట్లు అసలైన పత్రాల వలె చట్టబద్ధంగా చెల్లుబాటు అవుతాయా?',
      options: [
        'కాదు, అవి కేవలం రిఫరెన్స్ కోసం మాత్రమే',
        'అవును, ఐటీ నిబంధనల ప్రకారం చట్టబద్ధంగా పూర్తిగా చెల్లుబాటు అవుతాయి',
        'నోటరీ స్టాంప్ ఉంటేనే చెల్లుతాయి',
        'మీ జిల్లాలో మాత్రమే చెల్లుతాయి',
      ],
      correctIndex: 1,
      explanation: 'సరైన సమాధానం! డిజిలాకర్‌లోని పత్రాలు భారతదేశం అంతటా అసలైన పత్రాలతో సమానంగా చెల్లుతాయి.',
    },
    {
      id: 'q5',
      topicId: 'digital-basics',
      question: 'స్మార్ట్‌ఫోన్ యాప్‌లను డౌన్‌లోడ్ చేయడానికి అత్యంత సురక్షితమైన ప్రదేశం ఏది?',
      options: [
        'వాట్సాప్ గ్రూపుల్లో వచ్చే లింకులు',
        'వెబ్‌సైట్ల నుండి వచ్చే .apk ఫైల్స్',
        'గూగుల్ ప్లే స్టోర్ లేదా యాపిల్ యాప్ స్టోర్ వంటి అధికారిక స్టోర్లు',
        'ఉచిత బహుమతులు ఇచ్చే పాప్-అప్ ప్రకటనలు',
      ],
      correctIndex: 2,
      explanation: 'సరైన సమాధానం! అధికారిక స్టోర్లు భద్రతా పరీక్షల తర్వాతే యాప్‌లను ప్రచురిస్తాయి.',
    },
  ],
  mr: [
    {
      id: 'q1',
      topicId: 'upi-payments',
      question: 'आपल्या बँकेत पैसे जमा होण्यासाठी युपीआय पिन (UPI PIN) टाकण्याची गरज असते का?',
      options: [
        'होय, व्यवहाराची पुष्टी करण्यासाठी नेहमी आवश्यक',
        'फक्त रक्कम ₹१०,००० पेक्षा जास्त असल्यास',
        'नाही, कधीही नाही! पिन टाकल्यास खात्यातून पैसे कापले जातात',
        'होय, बँक मॅनेजरने विचारल्यास',
      ],
      correctIndex: 2,
      explanation: 'बरोबर उत्तर! पैसे मिळवण्यासाठी कधीही युपीआय पिन टाकायचा नसतो.',
    },
    {
      id: 'q2',
      topicId: 'online-safety',
      question: 'खालीलपैकी कोणता पत्ता भारत सरकारच्या अधिकृत पोर्टलचा आहे?',
      options: [
        'www.scholarship-apply-online.com',
        'www.myscheme.gov.in',
        'www.india-gov-benefits.org',
        'www.central-schemes-portal.net',
      ],
      correctIndex: 1,
      explanation: 'बरोबर उत्तर! अधिकृत शासकीय संकेतस्थळे नेहमी ".gov.in" ने संपतात.',
    },
    {
      id: 'q3',
      topicId: 'online-safety',
      question: 'व्हिडिओ कॉलवर पोलीस सांगत आहेत की तुम्ही "डिजिटल अरेस्ट" आहात, तर तुम्ही काय कराल?',
      options: [
        'लगेच त्यांच्या खात्यात पैसे पाठवाल',
        'त्यांनी सांगितल्याप्रमाणे २४ तास कॉलवर राहाल',
        'लगेच कॉल कट कराल आणि १९३० किंवा cybercrime.gov.in वर तक्रार कराल — डिजिटल अरेस्ट हा फ्रॉड आहे!',
        'आधार आणि बँक तपशील शेअर कराल',
      ],
      correctIndex: 2,
      explanation: 'बरोबर उत्तर! डिजिटल अरेस्ट हा सायबर गुन्हा आहे. पोलीस व्हिडिओ कॉलवर कधीही अटक किंवा पैशांची मागणी करत नाहीत.',
    },
    {
      id: 'q4',
      topicId: 'gov-services',
      question: 'डिजीलॉकरमधील कागदपत्रे मूळ कागदपत्रांप्रमाणेच कायदेशीररीत्या वैध आहेत का?',
      options: [
        'नाही, ती फक्त पाहण्यासाठी आहेत',
        'होय, माहिती तंत्रज्ञान कायद्यानुसार पूर्णपणे वैध आहेत',
        'फक्त नोटरी शिक्का असल्यास',
        'फक्त तुमच्या जिल्ह्यात वैध आहेत',
      ],
      correctIndex: 1,
      explanation: 'बरोबर उत्तर! डिजीलॉकरमधील कागदपत्रे संपूर्ण भारतात मूळ कागदपत्रांइतकीच कायदेशीररीत्या वैध आहेत.',
    },
    {
      id: 'q5',
      topicId: 'digital-basics',
      question: 'ॲप्स डाऊनलोड करण्यासाठी सर्वात सुरक्षित जागा कोणती?',
      options: [
        'व्हॉट्सॲप ग्रुपमधील लिंक्स',
        'इंटरनेटवरील .apk फाइल्स',
        'गुगल प्ले स्टोअर किंवा ॲपल ॲप स्टोअरसारखे अधिकृत स्टोअर',
        'मोफत बक्षीस देणाऱ्या जाहिराती',
      ],
      correctIndex: 2,
      explanation: 'बरोबर उत्तर! अधिकृत स्टोअर्स सुरक्षेची तपासणी करूनच ॲप्स उपलब्ध करतात.',
    },
  ],
  ml: [
    {
      id: 'q1',
      topicId: 'upi-payments',
      question: 'നിങ്ങളുടെ അക്കൗണ്ടിലേക്ക് പണം ലഭിക്കാൻ യുപിഐ പിൻ (UPI PIN) നൽകേണ്ടതുണ്ടോ?',
      options: [
        'അതെ, ഇടപാട് സ്ഥിരീകരിക്കാൻ എപ്പോഴും വേണം',
        'തുക ₹10,000-ൽ കൂടുതലാണെങ്കിൽ മാത്രം',
        'ഇല്ല, ഒരിക്കലും ആവശ്യമില്ല! പിൻ അടിച്ചാൽ അക്കൗണ്ടിൽ നിന്ന് പണം നഷ്ടപ്പെടും',
        'ബാങ്ക് മാനേജർ വിളിച്ചു ചോദിച്ചാൽ മാത്രം',
      ],
      correctIndex: 2,
      explanation: 'ശരിയായ ഉത്തരം! പണം സ്വീകരിക്കാൻ യുപിഐ പിൻ ഒരിക്കലും നൽകേണ്ടതില്ല.',
    },
    {
      id: 'q2',
      topicId: 'online-safety',
      question: 'ഇതിൽ ഏതാണ് ഔദ്യോഗിക സർക്കാർ വെബ്സൈറ്റ്?',
      options: [
        'www.scholarship-apply-online.com',
        'www.myscheme.gov.in',
        'www.india-gov-benefits.org',
        'www.central-schemes-portal.net',
      ],
      correctIndex: 1,
      explanation: 'ശരിയായ ഉത്തരം! സർക്കാർ വെബ്സൈറ്റുകൾ എപ്പോഴും ".gov.in" അല്ലെങ്കിൽ ".nic.in" ൽ അവസാനിക്കുന്നു.',
    },
    {
      id: 'q3',
      topicId: 'online-safety',
      question: 'വീഡിയോ കോളിൽ പോലീസ് ചമഞ്ഞ് "ഡിജിറ്റൽ അറസ്റ്റ്" ആണെന്ന് പറഞ്ഞാൽ നിങ്ങൾ എന്ത് ചെയ്യും?',
      options: [
        'ഉടൻ പണം അയക്കും',
        '24 മണിക്കൂർ കോളിൽ തുടരും',
        'ഉടൻ കോൾ കട്ട് ചെയ്ത് 1930 ലോ cybercrime.gov.in ലോ പരാതിപ്പെടും — ഇത് തട്ടിപ്പാണ്!',
        'ആധാർ വിവരങ്ങൾ കൈമാറും',
      ],
      correctIndex: 2,
      explanation: 'ശരിയായ ഉത്തരം! ഡിജിറ്റൽ അറസ്റ്റ് എന്നത് ഓൺലൈൻ തട്ടിപ്പാണ്. പോലീസ് ഒരിക്കലും വീഡിയോ കോളിൽ പണം ആവശ്യപ്പെടില്ല.',
    },
    {
      id: 'q4',
      topicId: 'gov-services',
      question: 'ഡിജിലോക്കറിലെ രേഖകൾക്ക് ഒറിജിനൽ രേഖകളുടെ അതേ നിയമസാധുതയുണ്ടോ?',
      options: [
        'ഇല്ല, കാണാൻ വേണ്ടി മാത്രം',
        'അതെ, ഐടി നിയമപ്രകാരം പൂർണ്ണ നിയമസാധുതയുണ്ട്',
        'നോട്ടറി സാക്ഷ്യപ്പെടുത്തിയാൽ മാത്രം',
        'സ്വന്തം ജില്ലയിൽ മാത്രം',
      ],
      correctIndex: 1,
      explanation: 'ശരിയായ ഉത്തരം! ഡിജിലോക്കറിലെ രേഖകൾ ഇന്ത്യയിലുടനീളം ഒറിജിനൽ രേഖകൾക്ക് തുല്യമായി അംഗീകരിക്കപ്പെട്ടിട്ടുള്ളതാണ്.',
    },
    {
      id: 'q5',
      topicId: 'digital-basics',
      question: 'ആപ്പുകൾ ഡൗൺലോഡ് ചെയ്യാൻ ഏറ്റവും സുരക്ഷിതമായ സ്ഥലം ഏതാണ്?',
      options: [
        'വാട്ട്സ്ആപ്പ് ഗ്രൂപ്പ് ലിങ്കുകൾ',
        'വെബ്സൈറ്റുകളിൽ നിന്നുള്ള .apk ഫയലുകൾ',
        'ഗൂഗിൾ പ്ലേ സ്റ്റോർ അല്ലെങ്കിൽ ആപ്പിൾ ആപ്പ് സ്റ്റോർ',
        'സൗജന്യ സമ്മാനം വാഗ്ദാനം ചെയ്യുന്ന പരസ്യങ്ങൾ',
      ],
      correctIndex: 2,
      explanation: 'ശരിയായ ഉത്തരം! ഔദ്യോഗിക ആപ്പ് സ്റ്റോറുകൾ സുരക്ഷ ഉറപ്പുവരുത്തിയ ശേഷമാണ് ആപ്പുകൾ നൽകുന്നത്.',
    },
  ],
  gu: [
    {
      id: 'q1',
      topicId: 'upi-payments',
      question: 'તમારા ખાતામાં પૈસા મેળવવા માટે તમારે ક્યારેય યુપીઆઈ પિન (UPI PIN) નાખવો પડે છે?',
      options: [
        'હા, ટ્રાન્ઝેક્શન કન્ફર્મ કરવા હંમેશા જરૂરી',
        'માત્ર રકમ ₹૧૦,૦૦૦ થી વધુ હોય તો',
        'ના, ક્યારેય નહીં! પિન નાખવાથી ખાતામાંથી પૈસા કપાય છે',
        'હા, જો બેંક અધિકારી ફોન કરીને કહે',
      ],
      correctIndex: 2,
      explanation: 'સાચો જવાબ! પૈસા મેળવવા માટે ક્યારેય યુપીઆઈ પિનની જરૂર હોતી નથી.',
    },
    {
      id: 'q2',
      topicId: 'online-safety',
      question: 'નીચેનામાંથી કયું સરનામું ભારત સરકારના સત્તાવાર પોર્ટલનું છે?',
      options: [
        'www.scholarship-apply-online.com',
        'www.myscheme.gov.in',
        'www.india-gov-benefits.org',
        'www.central-schemes-portal.net',
      ],
      correctIndex: 1,
      explanation: 'સાચો જવાબ! સત્તાવાર સરકારી વેબસાઇટ્સ હંમેશા ".gov.in" અથવા ".nic.in" પર સમાપ્ત થાય છે.',
    },
    {
      id: 'q3',
      topicId: 'online-safety',
      question: 'વીડિયો કોલ પર પોલીસ બનીને કોઈ કહે કે તમે "ડિજિટલ અરેસ્ટ" છો, તો તમે શું કરશો?',
      options: [
        'તરત જ પૈસા મોકલી દેશો',
        '૨૪ કલાક કોલ પર રહેશો',
        'તરત જ કોલ કાપીને ૧૯૩૦ અથવા cybercrime.gov.in પર ફરિયાદ કરશો — ડિજિટલ અરેસ્ટ એક છેતરપિંડી છે!',
        'આધાર કાર્ડ આપી દેશો',
      ],
      correctIndex: 2,
      explanation: 'સાચો જવાબ! ડિજિટલ અરેસ્ટ એ મોટો સાયબર ફ્રોડ છે. પોલીસ ક્યારેય વીડિયો કોલ પર પૈસા માંગતી નથી.',
    },
    {
      id: 'q4',
      topicId: 'gov-services',
      question: 'શું ડિજીલોકરના દસ્તાવેજો મૂળ દસ્તાવેજો જેટલા જ કાયદેસર છે?',
      options: [
        'ના, માત્ર સંદર્ભ માટે છે',
        'હા, આઇટી નિયમો હેઠળ સંપૂર્ણ કાયદેસર માન્ય છે',
        'માત્ર નોટરી કરાવ્યા પછી',
        'માત્ર તમારા જિલ્લામાં માન્ય',
      ],
      correctIndex: 1,
      explanation: 'સાચો જવાબ! ડિજીલોકરના દસ્તાવેજો સમગ્ર ભારતમાં કાયદેસર રીતે માન્ય છે.',
    },
    {
      id: 'q5',
      topicId: 'digital-basics',
      question: 'એપ્લિકેશન ડાઉનલોડ કરવા માટે સૌથી સુરક્ષિત જગ્યા કઈ છે?',
      options: [
        'વોટ્સએપ ગ્રૂપની લિંક્સ',
        'ઇન્ટરનેટ પરથી .apk ફાઇલ્સ',
        'ગૂગલ પ્લે સ્ટોર અથવા એપલ એપ સ્ટોર જેવા સત્તાવાર સ્ટોર',
        'પોપ-અપ જાહેરાતો',
      ],
      correctIndex: 2,
      explanation: 'સાચો જવાબ! સત્તાવાર સ્ટોર્સ સુરક્ષા તપાસ કર્યા પછી જ એપ્લિકેશન્સ પ્રકાશિત કરે છે.',
    },
  ],
  kn: [
    {
      id: 'q1',
      topicId: 'upi-payments',
      question: 'ನಿಮ್ಮ ಖಾತೆಗೆ ಹಣ ಪಡೆಯಲು ನೀವು ಎಂದಾದರೂ ಯುಪಿಐ ಪಿನ್ (UPI PIN) ಹಾಕಬೇಕೆ?',
      options: [
        'ಹೌದು, ವಹಿವಾಟು ದೃಢೀಕರಿಸಲು ಯಾವಾಗಲೂ ಬೇಕು',
        'ಮೊತ್ತ ₹10,000 ಕ್ಕಿಂತ ಹೆಚ್ಚಿದ್ದರೆ ಮಾತ್ರ',
        'ಇಲ್ಲ, ಎಂದಿಗೂ ಬೇಡ! ಪಿನ್ ಹಾಕಿದರೆ ಖಾತೆಯಿಂದ ಹಣ ಕಡಿತವಾಗುತ್ತದೆ',
        'ಬ್ಯಾಂಕ್ ಮ್ಯಾನೇಜರ್ ಕೇಳಿದರೆ ಮಾತ್ರ',
      ],
      correctIndex: 2,
      explanation: 'ಸರಿಯಾದ ಉತ್ತರ! ಹಣ ಪಡೆಯಲು ಎಂದಿಗೂ ಯುಪಿಐ ಪಿನ್ ಹಾಕಬೇಕಾಗಿಲ್ಲ.',
    },
    {
      id: 'q2',
      topicId: 'online-safety',
      question: 'ಇವುಗಳಲ್ಲಿ ಯಾವುದು ಭಾರತ ಸರ್ಕಾರದ ಅಧಿಕೃತ ವೆಬ್‌ಸೈಟ್ ವಿಳಾಸ?',
      options: [
        'www.scholarship-apply-online.com',
        'www.myscheme.gov.in',
        'www.india-gov-benefits.org',
        'www.central-schemes-portal.net',
      ],
      correctIndex: 1,
      explanation: 'ಸರಿಯಾದ ಉತ್ತರ! ಅಧಿಕೃತ ಸರ್ಕಾರಿ ವೆಬ್‌ಸೈಟ್‌ಗಳು ".gov.in" ನೊಂದಿಗೆ ಕೊನೆಗೊಳ್ಳುತ್ತವೆ.',
    },
    {
      id: 'q3',
      topicId: 'online-safety',
      question: 'ವೀಡಿಯೋ ಕಾಲ್‌ನಲ್ಲಿ ಪೊಲೀಸ್ ಸೋಗಿನಲ್ಲಿ ಬಂದು "ಡಿಜಿಟಲ್ ಅರೆಸ್ಟ್" ಎಂದು ಹೇಳಿದರೆ ನೀವು ಏನು ಮಾಡುತ್ತೀರಿ?',
      options: [
        'ತಕ್ಷಣ ಹಣ ಕಳುಹಿಸುತ್ತೀರಿ',
        'ಹೇಳಿದಂತೆ 24 ಗಂಟೆ ಕಾಲ್‌ನಲ್ಲಿ ಇರುತ್ತೀರಿ',
        'ತಕ್ಷಣ ಕಾಲ್ ಕಟ್ ಮಾಡಿ 1930 ಅಥವಾ cybercrime.gov.in ಗೆ ದೂರು ನೀಡುತ್ತೀರಿ — ಡಿಜಿಟಲ್ ಅರೆಸ್ಟ್ ಒಂದು ವಂಚನೆ!',
        'ಆಧಾರ್ ವಿವರಗಳನ್ನು ಹಂಚಿಕೊಳ್ಳುತ್ತೀರಿ',
      ],
      correctIndex: 2,
      explanation: 'ಸರಿಯಾದ ಉತ್ತರ! ಡಿಜಿಟಲ್ ಅರೆಸ್ಟ್ ಎಂಬುದು ಸೈಬರ್ ವಂಚನೆ. ಪೊಲೀಸರು ವೀಡಿಯೋ ಕಾಲ್‌ನಲ್ಲಿ ಹಣ ಕೇಳುವುದಿಲ್ಲ.',
    },
    {
      id: 'q4',
      topicId: 'gov-services',
      question: 'ಡಿಜಿಲಾಕರ್‌ನಲ್ಲಿರುವ ದಾಖಲೆಗಳು ಮೂಲ ದಾಖಲೆಗಳಷ್ಟೇ ಕಾನೂನುಬದ್ಧವಾಗಿ ಮಾನ್ಯವಾಗಿವೆಯೇ?',
      options: [
        'ಇಲ್ಲ, ಕೇವಲ ನೋಡಲು ಮಾತ್ರ',
        'ಹೌದು, ಐಟಿ ಕಾಯ್ದೆಯಡಿ ಸಂಪೂರ್ಣವಾಗಿ ಮಾನ್ಯವಾಗಿವೆ',
        'ನೋಟರಿ ಸೀಲ್ ಇದ್ದರೆ ಮಾತ್ರ',
        'ನಿಮ್ಮ ಜಿಲ್ಲೆಯಲ್ಲಿ ಮಾತ್ರ',
      ],
      correctIndex: 1,
      explanation: 'ಸರಿಯಾದ ಉತ್ತರ! ಡಿಜಿಲಾಕರ್ ದಾಖಲೆಗಳು ಭಾರತದಾದ್ಯಂತ ಕಾನೂನುಬದ್ಧವಾಗಿ ಮಾನ್ಯವಾಗಿವೆ.',
    },
    {
      id: 'q5',
      topicId: 'digital-basics',
      question: 'ಆಪ್‌ಗಳನ್ನು ಡೌನ್‌ಲೋಡ್ ಮಾಡಲು ಸುರಕ್ಷಿತ ಸ್ಥಳ ಯಾವುದು?',
      options: [
        'ವಾಟ್ಸಾಪ್ ಗ್ರೂಪ್ ಲಿಂಕ್‌ಗಳು',
        'ವೆಬ್‌ಸೈಟ್‌ಗಳಿಂದ .apk ಫೈಲ್‌ಗಳು',
        'ಗೂಗಲ್ ಪ್ಲೇ ಸ್ಟೋರ್ ಅಥವಾ ಆಪಲ್ ಆಪ್ ಸ್ಟೋರ್‌ನಂತಹ ಅಧಿಕೃತ ಸ್ಟೋರ್‌ಗಳು',
        'ಉಚಿತ ಉಡುಗೊರೆ ಜಾಹೀರಾತುಗಳು',
      ],
      correctIndex: 2,
      explanation: 'ಸರಿಯಾದ ಉತ್ತರ! ಅಧಿಕೃತ ಸ್ಟೋರ್‌ಗಳು ಭದ್ರತಾ ತಪಾಸಣೆ ನಡೆಸಿದ ನಂತರವೇ ಆಪ್‌ಗಳನ್ನು ಒದಗಿಸುತ್ತವೆ.',
    },
  ],
};

/**
 * Accessor helpers ensuring instantaneous localized access
 */
export function getTopicsForLang(lang: LanguageCode): TopicItem[] {
  const base = TOPICS_DATA_BY_LANG[lang] || TOPICS_DATA_BY_LANG.en;
  // Keep the existing "More" card last; add the new topics before it.
  const more = base.filter((tp) => tp.id === 'more-skills');
  const rest = base.filter((tp) => tp.id !== 'more-skills');
  return [...rest, ...EXTRA_TOPICS, ...more];
}

export function getLessonsForLang(lang: LanguageCode): LessonItem[] {
  const base = FEATURED_LESSONS_BY_LANG[lang] || FEATURED_LESSONS_BY_LANG.en;
  // Women's safety, scholarship, banking and law lessons (English text, shown in every language)
  return [...base, ...EXTRA_LESSONS];
}

export function getQuizzesForLang(lang: LanguageCode): QuizQuestion[] {
  return QUIZZES_DATA_BY_LANG[lang] || QUIZZES_DATA_BY_LANG.en;
}

// Fallback legacy exports for backward compatibility
export const TOPICS_DATA = TOPICS_DATA_BY_LANG.en;
export const FEATURED_LESSONS = FEATURED_LESSONS_BY_LANG.en;
export const QUIZZES_DATA = QUIZZES_DATA_BY_LANG.en;
