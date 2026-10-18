import { LanguageCode } from '../types';

/**
 * SOS page strings that were previously hard-coded in English (helpline names and descriptions,
 * contact relationship options, location errors, offline-kit card). Helpline NUMBERS are never
 * translated. Falls back to English. Native-speaker review is recommended.
 */
export interface SosStrings {
  policyLabel: string;
  offlineKitTitle: string;
  precached: string;
  offlineKitDesc: string;
  openOfflineKit: string;
  helplinesIntro: string;
  call: string;
  callName: string; // contains {name}
  deleteContact: string;
  geoUnsupported: string;
  geoDenied: string;
  namePlaceholder: string;
  phonePlaceholder: string;
  relations: { family: string; sibling: string; friend: string; neighbor: string; colleague: string };
  helplines: Record<string, { title: string; desc: string }>;
  defaultContacts: Record<string, { name: string; relationship: string }>;
}

const en: SosStrings = {
  policyLabel: 'Transparent Emergency Policy: ',
  offlineKitTitle: 'Offline Safety & Emergency Kit',
  precached: 'Saved on device',
  offlineKitDesc: '11 emergency helplines, a no-data SMS location sender and 5 safety playbooks are stored on your device for low-connectivity areas.',
  openOfflineKit: 'Open Offline Kit',
  helplinesIntro: 'National government emergency helplines. They are meant to work 24 hours a day; availability can vary by area.',
  call: 'Call',
  callName: 'Call {name}',
  deleteContact: 'Delete contact',
  geoUnsupported: 'Location is not supported by your browser or device.',
  geoDenied: 'Location permission is needed to show your live location. Allow it in your browser settings and try again.',
  namePlaceholder: 'e.g. Brother, Kavitha',
  phonePlaceholder: 'e.g. 9876543210',
  relations: { family: 'Parent / Family', sibling: 'Sibling', friend: 'Close Friend', neighbor: 'Neighbor / Local Contact', colleague: 'Colleague / Mentor' },
  helplines: {
    '112': { title: 'National Emergency Helpline', desc: 'Police, Fire, Ambulance (all in one)' },
    '1091': { title: 'Women in Distress Helpline', desc: 'Dedicated emergency support for women' },
    '181': { title: 'Women Helpline (Domestic Abuse)', desc: 'Legal aid, counselling and rescue coordination' },
    '1930': { title: 'Cyber Financial Fraud Helpline', desc: 'Report online money fraud quickly so funds can be frozen' },
    '1098': { title: 'Childline India', desc: 'Emergency help for children in distress' },
    '108': { title: 'Medical Ambulance Emergency', desc: 'Urgent medical and ambulance response' },
    '14567': { title: 'Senior Citizen Helpline (Elder Line)', desc: 'Information, guidance and emotional support for elders' },
    '14416': { title: 'Tele-MANAS (Mental Health Support)', desc: 'Free confidential mental health counselling' },
  },
  defaultContacts: {
    '1': { name: 'National Emergency', relationship: 'Official emergency centre' },
    '2': { name: 'Women Helpline', relationship: 'Women in distress' },
    '3': { name: 'Cyber Crime Helpline', relationship: 'Financial fraud reporting' },
    '4': { name: 'Mother / Home', relationship: 'Family' },
  },
};

const ta: SosStrings = {
  policyLabel: 'வெளிப்படையான அவசரகால கொள்கை: ',
  offlineKitTitle: 'ஆஃப்லைன் பாதுகாப்பு & அவசரகால கிட்',
  precached: 'சாதனத்தில் சேமிக்கப்பட்டது',
  offlineKitDesc: 'குறைந்த இணைப்புள்ள பகுதிகளுக்காக 11 அவசர உதவி எண்கள், டேட்டா இல்லாமல் SMS மூலம் இருப்பிடம் அனுப்பும் வசதி, 5 பாதுகாப்பு வழிகாட்டிகள் உங்கள் சாதனத்தில் சேமிக்கப்பட்டுள்ளன.',
  openOfflineKit: 'ஆஃப்லைன் கிட்டைத் திற',
  helplinesIntro: 'தேசிய அரசு அவசர உதவி எண்கள். இவை 24 மணி நேரமும் செயல்படும்படி உருவாக்கப்பட்டவை; பகுதிக்கேற்ப சேவை மாறலாம்.',
  call: 'அழை',
  callName: '{name} ஐ அழை',
  deleteContact: 'தொடர்பை நீக்கு',
  geoUnsupported: 'உங்கள் உலாவி அல்லது சாதனம் இருப்பிடத்தை ஆதரிக்கவில்லை.',
  geoDenied: 'நேரடி இருப்பிடத்தைக் காட்ட இருப்பிட அனுமதி தேவை. உலாவி அமைப்புகளில் அனுமதித்து மீண்டும் முயலவும்.',
  namePlaceholder: 'எ.கா. சகோதரர், கவிதா',
  phonePlaceholder: 'எ.கா. 9876543210',
  relations: { family: 'பெற்றோர் / குடும்பம்', sibling: 'சகோதரன் / சகோதரி', friend: 'நெருங்கிய நண்பர்', neighbor: 'அண்டை வீட்டார் / உள்ளூர் தொடர்பு', colleague: 'சக ஊழியர் / வழிகாட்டி' },
  helplines: {
    '112': { title: 'தேசிய அவசர உதவி எண்', desc: 'காவல், தீயணைப்பு, ஆம்புலன்ஸ் (அனைத்தும் ஒரே எண்ணில்)' },
    '1091': { title: 'ஆபத்திலுள்ள பெண்களுக்கான உதவி எண்', desc: 'பெண்களுக்கான அவசர உதவி' },
    '181': { title: 'பெண்கள் உதவி எண் (குடும்ப வன்முறை)', desc: 'சட்ட உதவி, ஆலோசனை, மீட்பு ஒருங்கிணைப்பு' },
    '1930': { title: 'இணைய நிதி மோசடி உதவி எண்', desc: 'ஆன்லைன் பண மோசடியை உடனே புகாரளியுங்கள்; பணத்தை முடக்க உதவும்' },
    '1098': { title: 'சைல்டுலைன் இந்தியா', desc: 'ஆபத்திலுள்ள குழந்தைகளுக்கான அவசர உதவி' },
    '108': { title: 'மருத்துவ ஆம்புலன்ஸ் அவசரம்', desc: 'அவசர மருத்துவ மற்றும் ஆம்புலன்ஸ் சேவை' },
    '14567': { title: 'மூத்த குடிமக்கள் உதவி எண் (எல்டர் லைன்)', desc: 'முதியோருக்கான தகவல், வழிகாட்டுதல், மன ஆதரவு' },
    '14416': { title: 'டெலி-மானஸ் (மனநல ஆதரவு)', desc: 'இலவச ரகசிய மனநல ஆலோசனை' },
  },
  defaultContacts: {
    '1': { name: 'தேசிய அவசர உதவி', relationship: 'அதிகாரப்பூர்வ அவசர மையம்' },
    '2': { name: 'பெண்கள் உதவி எண்', relationship: 'ஆபத்திலுள்ள பெண்கள்' },
    '3': { name: 'சைபர் குற்ற உதவி எண்', relationship: 'நிதி மோசடி புகார்' },
    '4': { name: 'அம்மா / வீடு', relationship: 'குடும்பம்' },
  },
};

const hi: SosStrings = {
  policyLabel: 'पारदर्शी आपातकालीन नीति: ',
  offlineKitTitle: 'ऑफ़लाइन सुरक्षा और आपातकालीन किट',
  precached: 'डिवाइस में सहेजा गया',
  offlineKitDesc: 'कम नेटवर्क वाले क्षेत्रों के लिए 11 आपातकालीन हेल्पलाइन, बिना डेटा के SMS से लोकेशन भेजने की सुविधा और 5 सुरक्षा गाइड आपके डिवाइस में सहेजे गए हैं।',
  openOfflineKit: 'ऑफ़लाइन किट खोलें',
  helplinesIntro: 'राष्ट्रीय सरकारी आपातकालीन हेल्पलाइन। ये 24 घंटे चलने के लिए बनी हैं; क्षेत्र के अनुसार उपलब्धता अलग हो सकती है।',
  call: 'कॉल करें',
  callName: '{name} को कॉल करें',
  deleteContact: 'संपर्क हटाएँ',
  geoUnsupported: 'आपका ब्राउज़र या डिवाइस लोकेशन का समर्थन नहीं करता।',
  geoDenied: 'लाइव लोकेशन दिखाने के लिए लोकेशन की अनुमति चाहिए। ब्राउज़र सेटिंग में अनुमति दें और फिर कोशिश करें।',
  namePlaceholder: 'जैसे भाई, कविता',
  phonePlaceholder: 'जैसे 9876543210',
  relations: { family: 'माता-पिता / परिवार', sibling: 'भाई-बहन', friend: 'करीबी दोस्त', neighbor: 'पड़ोसी / स्थानीय संपर्क', colleague: 'सहकर्मी / मार्गदर्शक' },
  helplines: {
    '112': { title: 'राष्ट्रीय आपातकालीन हेल्पलाइन', desc: 'पुलिस, दमकल, एम्बुलेंस (सब एक ही नंबर पर)' },
    '1091': { title: 'संकट में महिला हेल्पलाइन', desc: 'महिलाओं के लिए आपातकालीन सहायता' },
    '181': { title: 'महिला हेल्पलाइन (घरेलू हिंसा)', desc: 'कानूनी सहायता, परामर्श और बचाव समन्वय' },
    '1930': { title: 'साइबर वित्तीय धोखाधड़ी हेल्पलाइन', desc: 'ऑनलाइन पैसे की ठगी तुरंत बताएँ ताकि रकम रोकी जा सके' },
    '1098': { title: 'चाइल्डलाइन इंडिया', desc: 'संकट में बच्चों के लिए आपातकालीन मदद' },
    '108': { title: 'चिकित्सा एम्बुलेंस आपातकाल', desc: 'तत्काल चिकित्सा और एम्बुलेंस सेवा' },
    '14567': { title: 'वरिष्ठ नागरिक हेल्पलाइन (एल्डर लाइन)', desc: 'बुज़ुर्गों के लिए जानकारी, मार्गदर्शन और भावनात्मक सहारा' },
    '14416': { title: 'टेली-मानस (मानसिक स्वास्थ्य सहायता)', desc: 'निःशुल्क गोपनीय मानसिक स्वास्थ्य परामर्श' },
  },
  defaultContacts: {
    '1': { name: 'राष्ट्रीय आपातकाल', relationship: 'आधिकारिक आपातकालीन केंद्र' },
    '2': { name: 'महिला हेल्पलाइन', relationship: 'संकट में महिलाएँ' },
    '3': { name: 'साइबर अपराध हेल्पलाइन', relationship: 'वित्तीय धोखाधड़ी की शिकायत' },
    '4': { name: 'माँ / घर', relationship: 'परिवार' },
  },
};

const te: SosStrings = {
  policyLabel: 'పారదర్శక అత్యవసర విధానం: ',
  offlineKitTitle: 'ఆఫ్‌లైన్ భద్రత & అత్యవసర కిట్',
  precached: 'పరికరంలో సేవ్ అయింది',
  offlineKitDesc: 'తక్కువ నెట్‌వర్క్ ఉన్న ప్రాంతాల కోసం 11 అత్యవసర హెల్ప్‌లైన్‌లు, డేటా లేకుండా SMS ద్వారా లొకేషన్ పంపే సదుపాయం, 5 భద్రతా గైడ్‌లు మీ పరికరంలో సేవ్ చేయబడ్డాయి.',
  openOfflineKit: 'ఆఫ్‌లైన్ కిట్ తెరవండి',
  helplinesIntro: 'జాతీయ ప్రభుత్వ అత్యవసర హెల్ప్‌లైన్‌లు. ఇవి 24 గంటలూ పనిచేసేలా రూపొందించబడ్డాయి; ప్రాంతాన్ని బట్టి లభ్యత మారవచ్చు.',
  call: 'కాల్',
  callName: '{name}కి కాల్ చేయండి',
  deleteContact: 'కాంటాక్ట్ తొలగించండి',
  geoUnsupported: 'మీ బ్రౌజర్ లేదా పరికరం లొకేషన్‌కు మద్దతు ఇవ్వదు.',
  geoDenied: 'లైవ్ లొకేషన్ చూపడానికి లొకేషన్ అనుమతి అవసరం. బ్రౌజర్ సెట్టింగ్స్‌లో అనుమతించి మళ్లీ ప్రయత్నించండి.',
  namePlaceholder: 'ఉదా. అన్న, కవిత',
  phonePlaceholder: 'ఉదా. 9876543210',
  relations: { family: 'తల్లిదండ్రులు / కుటుంబం', sibling: 'తోబుట్టువు', friend: 'సన్నిహిత స్నేహితుడు', neighbor: 'పొరుగువారు / స్థానిక పరిచయం', colleague: 'సహోద్యోగి / మార్గదర్శి' },
  helplines: {
    '112': { title: 'జాతీయ అత్యవసర హెల్ప్‌లైన్', desc: 'పోలీస్, అగ్నిమాపక, అంబులెన్స్ (అన్నీ ఒకే నంబర్‌లో)' },
    '1091': { title: 'ఆపదలో ఉన్న మహిళల హెల్ప్‌లైన్', desc: 'మహిళలకు అత్యవసర సహాయం' },
    '181': { title: 'మహిళా హెల్ప్‌లైన్ (గృహ హింస)', desc: 'న్యాయ సహాయం, కౌన్సెలింగ్, రక్షణ సమన్వయం' },
    '1930': { title: 'సైబర్ ఆర్థిక మోసం హెల్ప్‌లైన్', desc: 'ఆన్‌లైన్ డబ్బు మోసాన్ని వెంటనే తెలపండి; డబ్బు నిలిపివేయడానికి సహాయపడుతుంది' },
    '1098': { title: 'చైల్డ్‌లైన్ ఇండియా', desc: 'ఆపదలో ఉన్న పిల్లలకు అత్యవసర సహాయం' },
    '108': { title: 'వైద్య అంబులెన్స్ అత్యవసరం', desc: 'అత్యవసర వైద్య మరియు అంబులెన్స్ సేవ' },
    '14567': { title: 'సీనియర్ సిటిజన్ హెల్ప్‌లైన్ (ఎల్డర్ లైన్)', desc: 'వృద్ధులకు సమాచారం, మార్గదర్శనం, భావోద్వేగ మద్దతు' },
    '14416': { title: 'టెలి-మానస్ (మానసిక ఆరోగ్య సహాయం)', desc: 'ఉచిత గోప్యమైన మానసిక ఆరోగ్య కౌన్సెలింగ్' },
  },
  defaultContacts: {
    '1': { name: 'జాతీయ అత్యవసర సేవ', relationship: 'అధికారిక అత్యవసర కేంద్రం' },
    '2': { name: 'మహిళా హెల్ప్‌లైన్', relationship: 'ఆపదలో ఉన్న మహిళలు' },
    '3': { name: 'సైబర్ నేర హెల్ప్‌లైన్', relationship: 'ఆర్థిక మోసం ఫిర్యాదు' },
    '4': { name: 'అమ్మ / ఇల్లు', relationship: 'కుటుంబం' },
  },
};

const mr: SosStrings = {
  policyLabel: 'पारदर्शक आपत्कालीन धोरण: ',
  offlineKitTitle: 'ऑफलाइन सुरक्षा आणि आपत्कालीन किट',
  precached: 'डिव्हाइसवर जतन केले',
  offlineKitDesc: 'कमी नेटवर्क असलेल्या भागांसाठी 11 आपत्कालीन हेल्पलाइन, डेटाशिवाय SMS ने लोकेशन पाठवण्याची सुविधा आणि 5 सुरक्षा मार्गदर्शिका तुमच्या डिव्हाइसवर जतन केल्या आहेत.',
  openOfflineKit: 'ऑफलाइन किट उघडा',
  helplinesIntro: 'राष्ट्रीय सरकारी आपत्कालीन हेल्पलाइन. त्या 24 तास चालण्यासाठी बनवल्या आहेत; भागानुसार उपलब्धता बदलू शकते.',
  call: 'कॉल करा',
  callName: '{name} ला कॉल करा',
  deleteContact: 'संपर्क हटवा',
  geoUnsupported: 'तुमचा ब्राउझर किंवा डिव्हाइस लोकेशनला समर्थन देत नाही.',
  geoDenied: 'लाइव्ह लोकेशन दाखवण्यासाठी लोकेशन परवानगी आवश्यक आहे. ब्राउझर सेटिंग्जमध्ये परवानगी देऊन पुन्हा प्रयत्न करा.',
  namePlaceholder: 'उदा. भाऊ, कविता',
  phonePlaceholder: 'उदा. 9876543210',
  relations: { family: 'आई-वडील / कुटुंब', sibling: 'भावंड', friend: 'जवळचा मित्र', neighbor: 'शेजारी / स्थानिक संपर्क', colleague: 'सहकारी / मार्गदर्शक' },
  helplines: {
    '112': { title: 'राष्ट्रीय आपत्कालीन हेल्पलाइन', desc: 'पोलीस, अग्निशमन, रुग्णवाहिका (सर्व एकाच क्रमांकावर)' },
    '1091': { title: 'संकटातील महिलांसाठी हेल्पलाइन', desc: 'महिलांसाठी आपत्कालीन मदत' },
    '181': { title: 'महिला हेल्पलाइन (कौटुंबिक हिंसा)', desc: 'कायदेशीर मदत, समुपदेशन आणि बचाव समन्वय' },
    '1930': { title: 'सायबर आर्थिक फसवणूक हेल्पलाइन', desc: 'ऑनलाइन पैशांची फसवणूक लगेच कळवा; रक्कम गोठवण्यास मदत होते' },
    '1098': { title: 'चाइल्डलाइन इंडिया', desc: 'संकटातील मुलांसाठी आपत्कालीन मदत' },
    '108': { title: 'वैद्यकीय रुग्णवाहिका आपत्कालीन', desc: 'तातडीची वैद्यकीय आणि रुग्णवाहिका सेवा' },
    '14567': { title: 'ज्येष्ठ नागरिक हेल्पलाइन (एल्डर लाइन)', desc: 'ज्येष्ठांसाठी माहिती, मार्गदर्शन आणि भावनिक आधार' },
    '14416': { title: 'टेली-मानस (मानसिक आरोग्य मदत)', desc: 'मोफत गोपनीय मानसिक आरोग्य समुपदेशन' },
  },
  defaultContacts: {
    '1': { name: 'राष्ट्रीय आपत्कालीन सेवा', relationship: 'अधिकृत आपत्कालीन केंद्र' },
    '2': { name: 'महिला हेल्पलाइन', relationship: 'संकटातील महिला' },
    '3': { name: 'सायबर गुन्हे हेल्पलाइन', relationship: 'आर्थिक फसवणूक तक्रार' },
    '4': { name: 'आई / घर', relationship: 'कुटुंब' },
  },
};

const ml: SosStrings = {
  policyLabel: 'സുതാര്യമായ അടിയന്തര നയം: ',
  offlineKitTitle: 'ഓഫ്‌ലൈൻ സുരക്ഷ & അടിയന്തര കിറ്റ്',
  precached: 'ഉപകരണത്തിൽ സേവ് ചെയ്തു',
  offlineKitDesc: 'നെറ്റ്‌വർക്ക് കുറഞ്ഞ സ്ഥലങ്ങൾക്കായി 11 അടിയന്തര ഹെൽപ്‌ലൈനുകൾ, ഡാറ്റ ഇല്ലാതെ SMS വഴി ലൊക്കേഷൻ അയയ്ക്കാനുള്ള സൗകര്യം, 5 സുരക്ഷാ ഗൈഡുകൾ എന്നിവ നിങ്ങളുടെ ഉപകരണത്തിൽ സേവ് ചെയ്തിട്ടുണ്ട്.',
  openOfflineKit: 'ഓഫ്‌ലൈൻ കിറ്റ് തുറക്കുക',
  helplinesIntro: 'ദേശീയ സർക്കാർ അടിയന്തര ഹെൽപ്‌ലൈനുകൾ. ഇവ 24 മണിക്കൂറും പ്രവർത്തിക്കാനുള്ളവയാണ്; പ്രദേശം അനുസരിച്ച് ലഭ്യത വ്യത്യാസപ്പെടാം.',
  call: 'വിളിക്കുക',
  callName: '{name} നെ വിളിക്കുക',
  deleteContact: 'കോൺടാക്റ്റ് ഇല്ലാതാക്കുക',
  geoUnsupported: 'നിങ്ങളുടെ ബ്രൗസറോ ഉപകരണമോ ലൊക്കേഷൻ പിന്തുണയ്ക്കുന്നില്ല.',
  geoDenied: 'തത്സമയ ലൊക്കേഷൻ കാണിക്കാൻ ലൊക്കേഷൻ അനുമതി വേണം. ബ്രൗസർ ക്രമീകരണത്തിൽ അനുവദിച്ച് വീണ്ടും ശ്രമിക്കുക.',
  namePlaceholder: 'ഉദാ. സഹോദരൻ, കവിത',
  phonePlaceholder: 'ഉദാ. 9876543210',
  relations: { family: 'മാതാപിതാക്കൾ / കുടുംബം', sibling: 'സഹോദരൻ / സഹോദരി', friend: 'അടുത്ത സുഹൃത്ത്', neighbor: 'അയൽക്കാരൻ / പ്രാദേശിക കോൺടാക്റ്റ്', colleague: 'സഹപ്രവർത്തകൻ / മെന്റർ' },
  helplines: {
    '112': { title: 'ദേശീയ അടിയന്തര ഹെൽപ്‌ലൈൻ', desc: 'പോലീസ്, അഗ്നിരക്ഷ, ആംബുലൻസ് (എല്ലാം ഒരേ നമ്പറിൽ)' },
    '1091': { title: 'ആപത്തിലുള്ള സ്ത്രീകൾക്കുള്ള ഹെൽപ്‌ലൈൻ', desc: 'സ്ത്രീകൾക്കുള്ള അടിയന്തര സഹായം' },
    '181': { title: 'വനിതാ ഹെൽപ്‌ലൈൻ (ഗാർഹിക പീഡനം)', desc: 'നിയമസഹായം, കൗൺസിലിംഗ്, രക്ഷാ ഏകോപനം' },
    '1930': { title: 'സൈബർ സാമ്പത്തിക തട്ടിപ്പ് ഹെൽപ്‌ലൈൻ', desc: 'ഓൺലൈൻ പണത്തട്ടിപ്പ് ഉടൻ അറിയിക്കുക; പണം മരവിപ്പിക്കാൻ സഹായിക്കും' },
    '1098': { title: 'ചൈൽഡ്‌ലൈൻ ഇന്ത്യ', desc: 'ആപത്തിലുള്ള കുട്ടികൾക്കുള്ള അടിയന്തര സഹായം' },
    '108': { title: 'മെഡിക്കൽ ആംബുലൻസ് അടിയന്തരം', desc: 'അടിയന്തര വൈദ്യസഹായവും ആംബുലൻസ് സേവനവും' },
    '14567': { title: 'മുതിർന്ന പൗരന്മാരുടെ ഹെൽപ്‌ലൈൻ (എൽഡർ ലൈൻ)', desc: 'മുതിർന്നവർക്ക് വിവരം, മാർഗനിർദേശം, വൈകാരിക പിന്തുണ' },
    '14416': { title: 'ടെലി-മനസ് (മാനസികാരോഗ്യ സഹായം)', desc: 'സൗജന്യ രഹസ്യ മാനസികാരോഗ്യ കൗൺസിലിംഗ്' },
  },
  defaultContacts: {
    '1': { name: 'ദേശീയ അടിയന്തര സേവനം', relationship: 'ഔദ്യോഗിക അടിയന്തര കേന്ദ്രം' },
    '2': { name: 'വനിതാ ഹെൽപ്‌ലൈൻ', relationship: 'ആപത്തിലുള്ള സ്ത്രീകൾ' },
    '3': { name: 'സൈബർ കുറ്റകൃത്യ ഹെൽപ്‌ലൈൻ', relationship: 'സാമ്പത്തിക തട്ടിപ്പ് പരാതി' },
    '4': { name: 'അമ്മ / വീട്', relationship: 'കുടുംബം' },
  },
};

const gu: SosStrings = {
  policyLabel: 'પારદર્શક કટોકટી નીતિ: ',
  offlineKitTitle: 'ઑફલાઇન સુરક્ષા અને કટોકટી કિટ',
  precached: 'ડિવાઇસમાં સાચવેલ',
  offlineKitDesc: 'ઓછા નેટવર્કવાળા વિસ્તારો માટે 11 કટોકટી હેલ્પલાઇન, ડેટા વગર SMS દ્વારા લોકેશન મોકલવાની સુવિધા અને 5 સુરક્ષા માર્ગદર્શિકા તમારા ડિવાઇસમાં સાચવેલ છે.',
  openOfflineKit: 'ઑફલાઇન કિટ ખોલો',
  helplinesIntro: 'રાષ્ટ્રીય સરકારી કટોકટી હેલ્પલાઇન. તે 24 કલાક ચાલે તે રીતે બનાવેલ છે; વિસ્તાર પ્રમાણે ઉપલબ્ધતા અલગ હોઈ શકે.',
  call: 'કૉલ કરો',
  callName: '{name} ને કૉલ કરો',
  deleteContact: 'સંપર્ક કાઢી નાખો',
  geoUnsupported: 'તમારું બ્રાઉઝર અથવા ડિવાઇસ લોકેશનને સપોર્ટ કરતું નથી.',
  geoDenied: 'લાઇવ લોકેશન બતાવવા લોકેશન પરવાનગી જરૂરી છે. બ્રાઉઝર સેટિંગ્સમાં પરવાનગી આપી ફરી પ્રયાસ કરો.',
  namePlaceholder: 'દા.ત. ભાઈ, કવિતા',
  phonePlaceholder: 'દા.ત. 9876543210',
  relations: { family: 'માતા-પિતા / પરિવાર', sibling: 'ભાઈ-બહેન', friend: 'નજીકનો મિત્ર', neighbor: 'પડોશી / સ્થાનિક સંપર્ક', colleague: 'સહકર્મી / માર્ગદર્શક' },
  helplines: {
    '112': { title: 'રાષ્ટ્રીય કટોકટી હેલ્પલાઇન', desc: 'પોલીસ, ફાયર, એમ્બ્યુલન્સ (બધું એક જ નંબર પર)' },
    '1091': { title: 'સંકટમાં મહિલા હેલ્પલાઇન', desc: 'મહિલાઓ માટે કટોકટી સહાય' },
    '181': { title: 'મહિલા હેલ્પલાઇન (ઘરેલુ હિંસા)', desc: 'કાનૂની સહાય, કાઉન્સેલિંગ અને બચાવ સંકલન' },
    '1930': { title: 'સાયબર નાણાકીય છેતરપિંડી હેલ્પલાઇન', desc: 'ઓનલાઇન પૈસાની છેતરપિંડી તરત જણાવો; રકમ ફ્રીઝ કરવામાં મદદ મળે' },
    '1098': { title: 'ચાઇલ્ડલાઇન ઇન્ડિયા', desc: 'સંકટમાં બાળકો માટે કટોકટી મદદ' },
    '108': { title: 'તબીબી એમ્બ્યુલન્સ કટોકટી', desc: 'તાત્કાલિક તબીબી અને એમ્બ્યુલન્સ સેવા' },
    '14567': { title: 'વરિષ્ઠ નાગરિક હેલ્પલાઇન (એલ્ડર લાઇન)', desc: 'વડીલો માટે માહિતી, માર્ગદર્શન અને ભાવનાત્મક સહારો' },
    '14416': { title: 'ટેલી-માનસ (માનસિક સ્વાસ્થ્ય સહાય)', desc: 'મફત ગોપનીય માનસિક સ્વાસ્થ્ય કાઉન્સેલિંગ' },
  },
  defaultContacts: {
    '1': { name: 'રાષ્ટ્રીય કટોકટી સેવા', relationship: 'સત્તાવાર કટોકટી કેન્દ્ર' },
    '2': { name: 'મહિલા હેલ્પલાઇન', relationship: 'સંકટમાં મહિલાઓ' },
    '3': { name: 'સાયબર ક્રાઇમ હેલ્પલાઇન', relationship: 'નાણાકીય છેતરપિંડી ફરિયાદ' },
    '4': { name: 'મમ્મી / ઘર', relationship: 'પરિવાર' },
  },
};

const kn: SosStrings = {
  policyLabel: 'ಪಾರದರ್ಶಕ ತುರ್ತು ನೀತಿ: ',
  offlineKitTitle: 'ಆಫ್‌ಲೈನ್ ಸುರಕ್ಷತೆ ಮತ್ತು ತುರ್ತು ಕಿಟ್',
  precached: 'ಸಾಧನದಲ್ಲಿ ಉಳಿಸಲಾಗಿದೆ',
  offlineKitDesc: 'ಕಡಿಮೆ ನೆಟ್‌ವರ್ಕ್ ಇರುವ ಪ್ರದೇಶಗಳಿಗಾಗಿ 11 ತುರ್ತು ಹೆಲ್ಪ್‌ಲೈನ್‌ಗಳು, ಡೇಟಾ ಇಲ್ಲದೆ SMS ಮೂಲಕ ಸ್ಥಳ ಕಳುಹಿಸುವ ಸೌಲಭ್ಯ ಮತ್ತು 5 ಸುರಕ್ಷತಾ ಮಾರ್ಗದರ್ಶಿಗಳನ್ನು ನಿಮ್ಮ ಸಾಧನದಲ್ಲಿ ಉಳಿಸಲಾಗಿದೆ.',
  openOfflineKit: 'ಆಫ್‌ಲೈನ್ ಕಿಟ್ ತೆರೆಯಿರಿ',
  helplinesIntro: 'ರಾಷ್ಟ್ರೀಯ ಸರ್ಕಾರಿ ತುರ್ತು ಹೆಲ್ಪ್‌ಲೈನ್‌ಗಳು. ಇವು 24 ಗಂಟೆಯೂ ಕಾರ್ಯನಿರ್ವಹಿಸುವಂತೆ ರೂಪಿಸಲಾಗಿದೆ; ಪ್ರದೇಶಕ್ಕೆ ಅನುಗುಣವಾಗಿ ಲಭ್ಯತೆ ಬದಲಾಗಬಹುದು.',
  call: 'ಕರೆ ಮಾಡಿ',
  callName: '{name} ಗೆ ಕರೆ ಮಾಡಿ',
  deleteContact: 'ಸಂಪರ್ಕ ಅಳಿಸಿ',
  geoUnsupported: 'ನಿಮ್ಮ ಬ್ರೌಸರ್ ಅಥವಾ ಸಾಧನ ಸ್ಥಳವನ್ನು ಬೆಂಬಲಿಸುವುದಿಲ್ಲ.',
  geoDenied: 'ಲೈವ್ ಸ್ಥಳ ತೋರಿಸಲು ಸ್ಥಳ ಅನುಮತಿ ಬೇಕು. ಬ್ರೌಸರ್ ಸೆಟ್ಟಿಂಗ್‌ಗಳಲ್ಲಿ ಅನುಮತಿಸಿ ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.',
  namePlaceholder: 'ಉದಾ. ಅಣ್ಣ, ಕವಿತಾ',
  phonePlaceholder: 'ಉದಾ. 9876543210',
  relations: { family: 'ಪೋಷಕರು / ಕುಟುಂಬ', sibling: 'ಒಡಹುಟ್ಟಿದವರು', friend: 'ಆಪ್ತ ಸ್ನೇಹಿತ', neighbor: 'ನೆರೆಹೊರೆಯವರು / ಸ್ಥಳೀಯ ಸಂಪರ್ಕ', colleague: 'ಸಹೋದ್ಯೋಗಿ / ಮಾರ್ಗದರ್ಶಕ' },
  helplines: {
    '112': { title: 'ರಾಷ್ಟ್ರೀಯ ತುರ್ತು ಹೆಲ್ಪ್‌ಲೈನ್', desc: 'ಪೊಲೀಸ್, ಅಗ್ನಿಶಾಮಕ, ಆಂಬ್ಯುಲೆನ್ಸ್ (ಎಲ್ಲವೂ ಒಂದೇ ಸಂಖ್ಯೆಯಲ್ಲಿ)' },
    '1091': { title: 'ಸಂಕಷ್ಟದಲ್ಲಿರುವ ಮಹಿಳೆಯರ ಹೆಲ್ಪ್‌ಲೈನ್', desc: 'ಮಹಿಳೆಯರಿಗೆ ತುರ್ತು ಸಹಾಯ' },
    '181': { title: 'ಮಹಿಳಾ ಹೆಲ್ಪ್‌ಲೈನ್ (ಕೌಟುಂಬಿಕ ಹಿಂಸೆ)', desc: 'ಕಾನೂನು ನೆರವು, ಆಪ್ತಸಮಾಲೋಚನೆ, ರಕ್ಷಣಾ ಸಮನ್ವಯ' },
    '1930': { title: 'ಸೈಬರ್ ಹಣಕಾಸು ವಂಚನೆ ಹೆಲ್ಪ್‌ಲೈನ್', desc: 'ಆನ್‌ಲೈನ್ ಹಣದ ವಂಚನೆಯನ್ನು ತಕ್ಷಣ ತಿಳಿಸಿ; ಹಣ ತಡೆಹಿಡಿಯಲು ಸಹಾಯವಾಗುತ್ತದೆ' },
    '1098': { title: 'ಚೈಲ್ಡ್‌ಲೈನ್ ಇಂಡಿಯಾ', desc: 'ಸಂಕಷ್ಟದಲ್ಲಿರುವ ಮಕ್ಕಳಿಗೆ ತುರ್ತು ಸಹಾಯ' },
    '108': { title: 'ವೈದ್ಯಕೀಯ ಆಂಬ್ಯುಲೆನ್ಸ್ ತುರ್ತು', desc: 'ತುರ್ತು ವೈದ್ಯಕೀಯ ಮತ್ತು ಆಂಬ್ಯುಲೆನ್ಸ್ ಸೇವೆ' },
    '14567': { title: 'ಹಿರಿಯ ನಾಗರಿಕರ ಹೆಲ್ಪ್‌ಲೈನ್ (ಎಲ್ಡರ್ ಲೈನ್)', desc: 'ಹಿರಿಯರಿಗೆ ಮಾಹಿತಿ, ಮಾರ್ಗದರ್ಶನ ಮತ್ತು ಭಾವನಾತ್ಮಕ ಬೆಂಬಲ' },
    '14416': { title: 'ಟೆಲಿ-ಮನಸ್ (ಮಾನಸಿಕ ಆರೋಗ್ಯ ಸಹಾಯ)', desc: 'ಉಚಿತ ಗೌಪ್ಯ ಮಾನಸಿಕ ಆರೋಗ್ಯ ಆಪ್ತಸಮಾಲೋಚನೆ' },
  },
  defaultContacts: {
    '1': { name: 'ರಾಷ್ಟ್ರೀಯ ತುರ್ತು ಸೇವೆ', relationship: 'ಅಧಿಕೃತ ತುರ್ತು ಕೇಂದ್ರ' },
    '2': { name: 'ಮಹಿಳಾ ಹೆಲ್ಪ್‌ಲೈನ್', relationship: 'ಸಂಕಷ್ಟದಲ್ಲಿರುವ ಮಹಿಳೆಯರು' },
    '3': { name: 'ಸೈಬರ್ ಅಪರಾಧ ಹೆಲ್ಪ್‌ಲೈನ್', relationship: 'ಹಣಕಾಸು ವಂಚನೆ ದೂರು' },
    '4': { name: 'ಅಮ್ಮ / ಮನೆ', relationship: 'ಕುಟುಂಬ' },
  },
};

const ALL: Record<LanguageCode, SosStrings> = { en, ta, hi, te, mr, ml, gu, kn };

export function getSosStrings(lang: LanguageCode): SosStrings {
  const s = ALL[lang] || en;
  return { ...en, ...s, relations: { ...en.relations, ...s.relations }, helplines: { ...en.helplines, ...s.helplines }, defaultContacts: { ...en.defaultContacts, ...s.defaultContacts } };
}

/** Relationship values are stored in English; this maps stored values to the display label. */
export function relationLabel(stored: string, ss: SosStrings): string {
  const map: Record<string, string> = {
    'Parent / Family': ss.relations.family,
    'Sibling': ss.relations.sibling,
    'Close Friend': ss.relations.friend,
    'Neighbor / Local Contact': ss.relations.neighbor,
    'Colleague / Mentor': ss.relations.colleague,
  };
  return map[stored] ?? stored;
}
