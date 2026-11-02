// Exam catalogue (moved unchanged from GovernmentExamsView so it can be shared).
// Application status is NOT hard-coded: see examStatusRecords below.
export type Exam = {id:string; name:string; authority:string; category:string; state:string; education:string; age:string; pattern:string; syllabus:string; url:string; note:string};
export const exams: Exam[] = [
{id:'upsc-cse',name:'UPSC Civil Services (IAS/IPS)',authority:'Union Public Service Commission',category:'Civil Services',state:'All India',education:"Bachelor's degree (as per notification)",age:'Notification-specific; check date and category relaxations',pattern:'Prelims, Mains and Personality Test',syllabus:'Polity, history, geography, economy, environment, science, current affairs, ethics and essay',url:'https://upsc.gov.in/',note:'Exact age limits, cut-off date and conditions vary by notification.'},
{id:'ssc-cgl',name:'SSC CGL',authority:'Staff Selection Commission',category:'Staff Selection',state:'All India',education:'Graduation for most posts; post-specific exceptions apply',age:'Post-specific; check official notice',pattern:'Computer-based examination stages as notified',syllabus:'Quantitative aptitude, reasoning, English and general awareness',url:'https://ssc.gov.in/',note:'Requirements differ by post.'},
{id:'ssc-chsl',name:'SSC CHSL',authority:'Staff Selection Commission',category:'Staff Selection',state:'All India',education:'Usually 12th pass; verify post requirements',age:'Check current notification and relaxations',pattern:'Computer-based tests and skill/typing test where applicable',syllabus:'English, general intelligence, quantitative aptitude and general awareness',url:'https://ssc.gov.in/',note:'Confirm eligibility in the current official notice.'},
{id:'ssc-mts',name:'SSC MTS / Havaldar',authority:'Staff Selection Commission',category:'Staff Selection',state:'All India',education:'Usually matriculation; verify notice',age:'Post-specific age bands and relaxations apply',pattern:'Computer-based examination; additional requirements may apply to Havaldar',syllabus:'Numerical ability, reasoning, general awareness and English',url:'https://ssc.gov.in/',note:'Do not rely on an old notification.'},
{id:'ibps',name:'IBPS bank recruitment exams',authority:'Institute of Banking Personnel Selection',category:'Banking',state:'All India',education:'Usually graduation for PO/Clerk; role-specific',age:'Role- and notification-specific',pattern:'Preliminary/main examinations; interview for some roles',syllabus:'Reasoning, quantitative aptitude, English, banking/general awareness',url:'https://www.ibps.in/',note:'Recruitment and criteria vary by participating bank and post.'},
{id:'sbi',name:'SBI PO / Junior Associate',authority:'State Bank of India',category:'Banking',state:'All India',education:'Role-specific; graduation commonly required',age:'Check current role notification',pattern:'Role-specific online tests and further stages',syllabus:'Reasoning, aptitude, English and general/financial awareness',url:'https://sbi.co.in/web/careers',note:'Use the SBI Careers notice for exact requirements.'},
{id:'rrb',name:'Railway Recruitment Board (RRB)',authority:'Railway Recruitment Boards',category:'Railways',state:'All India',education:'Varies by post: 10th, ITI, 12th or degree',age:'Varies by CEN/notification and post',pattern:'CBT and other stages as notified',syllabus:'Post-specific mathematics, reasoning, general awareness and technical topics',url:'https://www.rrbcdg.gov.in/',note:'Always identify the exact CEN and RRB notice.'},
{id:'nda',name:'NDA / NA',authority:'UPSC',category:'Defence',state:'All India',education:'12th or appearing; subject requirements depend on service',age:'Strict notification-specific date-of-birth window',pattern:'Written examination and SSB; medical standards apply',syllabus:'Mathematics and General Ability Test',url:'https://upsc.gov.in/',note:'Date-of-birth window and physical/medical rules are essential.'},
{id:'cds',name:'Combined Defence Services (CDS)',authority:'UPSC',category:'Defence',state:'All India',education:'Degree requirements vary by academy',age:'Academy-specific date-of-birth window',pattern:'Written examination and SSB; medical standards apply',syllabus:'English, general knowledge and mathematics depending on academy',url:'https://upsc.gov.in/',note:'Check academy-specific education and age rules.'},
{id:'afcat',name:'AFCAT',authority:'Indian Air Force',category:'Defence',state:'All India',education:'Branch-specific degree and marks requirements',age:'Branch-specific; verify current notification',pattern:'Online test and further selection stages',syllabus:'General awareness, verbal ability, numerical ability, reasoning and military aptitude',url:'https://afcat.cdac.in/',note:'Branch, education, medical and age rules differ.'},
{id:'ctet',name:'CTET',authority:'Central Board of Secondary Education',category:'Teaching',state:'All India',education:'Teacher-training qualifications as specified in CTET notice',age:'Check current bulletin and applicable rules',pattern:'Paper I and/or Paper II',syllabus:'Child development, pedagogy, language, mathematics/EVS or subject areas',url:'https://ctet.nic.in/',note:'CTET eligibility is tied to notified teacher-qualification rules.'},
{id:'tnpsc-group1',name:'TNPSC Group I',authority:'Tamil Nadu Public Service Commission',category:'Tamil Nadu',state:'Tamil Nadu',education:'Degree and any post-specific requirements in notification',age:'Post/category-specific; notification is final',pattern:'Preliminary, Main and interview as notified',syllabus:'General studies, aptitude and post-specific syllabus',url:'https://www.tnpsc.gov.in/',note:'Check the current notification for community, age and language requirements.'},
{id:'tnpsc-group2',name:'TNPSC Group II / IIA',authority:'Tamil Nadu Public Service Commission',category:'Tamil Nadu',state:'Tamil Nadu',education:'Degree or post-specific qualification',age:'Post/category-specific; notification is final',pattern:'Common preliminary and main stages as notified for the recruitment',syllabus:'General studies, aptitude, language and role-specific topics',url:'https://www.tnpsc.gov.in/',note:'Group II and IIA post criteria can differ.'},
{id:'tnpsc-group4',name:'TNPSC Group IV',authority:'Tamil Nadu Public Service Commission',category:'Tamil Nadu',state:'Tamil Nadu',education:'Often SSLC for listed posts; post-specific requirements apply',age:'Post/community-specific; check notice',pattern:'Written examination and applicable selection process',syllabus:'General studies, aptitude and Tamil eligibility/language components as notified',url:'https://www.tnpsc.gov.in/',note:'Use the latest Group IV notification.'},
{id:'tntet',name:'Tamil Nadu Teacher Eligibility Test (TNTET)',authority:'Teachers Recruitment Board, Tamil Nadu',category:'Teaching',state:'Tamil Nadu',education:'Teacher education qualifications specified by TRB notice',age:'Check the current notification',pattern:'Paper I and Paper II as applicable',syllabus:'Child development, pedagogy, language, mathematics/EVS or subject areas',url:'https://trb.tn.gov.in/',note:'Confirm qualifications and current exam rules with TRB.'}
 ];

// Display exam titles in the currently selected app language. Official acronyms
// (UPSC, SSC, IBPS, etc.) remain unchanged so users can find the same exam on
// official recruitment portals.
export const examNames: Record<string, Record<string, string>> = {
  'upsc-cse': { en: 'UPSC Civil Services (IAS/IPS)', ta: 'UPSC குடிமைப் பணிகள் தேர்வு (IAS/IPS)', hi: 'UPSC सिविल सेवा परीक्षा (IAS/IPS)', te: 'UPSC సివిల్ సర్వీసెస్ (IAS/IPS)', mr: 'UPSC नागरी सेवा परीक्षा (IAS/IPS)', ml: 'UPSC സിവിൽ സർവീസസ് പരീക്ഷ (IAS/IPS)', gu: 'UPSC સિવિલ સર્વિસિસ પરીક્ષા (IAS/IPS)', kn: 'UPSC ನಾಗರಿಕ ಸೇವಾ ಪರೀಕ್ಷೆ (IAS/IPS)' },
  'ssc-cgl': { en: 'SSC CGL', ta: 'SSC ஒருங்கிணைந்த பட்டதாரி நிலைத் தேர்வு (CGL)', hi: 'SSC संयुक्त स्नातक स्तरीय परीक्षा (CGL)', te: 'SSC కంబైన్డ్ గ్రాడ్యుయేట్ లెవల్ (CGL)', mr: 'SSC संयुक्त पदवी स्तर परीक्षा (CGL)', ml: 'SSC കമ്പൈൻഡ് ഗ്രാജുവേറ്റ് ലെവൽ (CGL)', gu: 'SSC સંયુક્ત સ્નાતક સ્તરની પરીક્ષા (CGL)', kn: 'SSC ಸಂಯುಕ್ತ ಪದವಿ ಮಟ್ಟದ ಪರೀಕ್ಷೆ (CGL)' },
  'ssc-chsl': { en: 'SSC CHSL', ta: 'SSC உயர்நிலைப் பள்ளி நிலைத் தேர்வு (CHSL)', hi: 'SSC संयुक्त उच्च माध्यमिक स्तर परीक्षा (CHSL)', te: 'SSC కంబైన్డ్ హయ్యర్ సెకండరీ లెవల్ (CHSL)', mr: 'SSC संयुक्त उच्च माध्यमिक स्तर परीक्षा (CHSL)', ml: 'SSC കമ്പൈൻഡ് ഹയർ സെക്കൻഡറി ലെവൽ (CHSL)', gu: 'SSC સંયુક્ત ઉચ્ચ માધ્યમિક સ્તરની પરીક્ષા (CHSL)', kn: 'SSC ಸಂಯುಕ್ತ ಉನ್ನತ ಮಾಧ್ಯಮಿಕ ಮಟ್ಟದ ಪರೀಕ್ಷೆ (CHSL)' },
  'ssc-mts': { en: 'SSC MTS / Havaldar', ta: 'SSC பல்பணி பணியாளர் / ஹவில்தார்', hi: 'SSC मल्टी-टास्किंग स्टाफ / हवलदार', te: 'SSC మల్టీ-టాస్కింగ్ స్టాఫ్ / హవల్దార్', mr: 'SSC मल्टी-टास्किंग स्टाफ / हवालदार', ml: 'SSC മൾട്ടി-ടാസ്കിംഗ് സ്റ്റാഫ് / ഹവിൽദാർ', gu: 'SSC મલ્ટી-ટાસ્કિંગ સ્ટાફ / હવાલદાર', kn: 'SSC ಮಲ್ಟಿ-ಟಾಸ್ಕಿಂಗ್ ಸಿಬ್ಬಂದಿ / ಹವಾಲ್ದಾರ್' },
  ibps: { en: 'IBPS bank recruitment exams', ta: 'IBPS வங்கி பணியாளர் தேர்வுகள்', hi: 'IBPS बैंक भर्ती परीक्षाएँ', te: 'IBPS బ్యాంక్ నియామక పరీక్షలు', mr: 'IBPS बँक भरती परीक्षा', ml: 'IBPS ബാങ്ക് നിയമന പരീക്ഷകൾ', gu: 'IBPS બેંક ભરતી પરીક્ષાઓ', kn: 'IBPS ಬ್ಯಾಂಕ್ ನೇಮಕಾತಿ ಪರೀಕ್ಷೆಗಳು' },
  sbi: { en: 'SBI PO / Junior Associate', ta: 'SBI ப்ரொபேஷனரி ஆபீசர் / ஜூனியர் அசோசியேட்', hi: 'SBI प्रोबेशनरी ऑफिसर / जूनियर एसोसिएट', te: 'SBI ప్రొబేషనరీ ఆఫీసర్ / జూనియర్ అసోసియేట్', mr: 'SBI प्रोबेशनरी ऑफिसर / ज्युनिअर असोसिएट', ml: 'SBI പ്രൊബേഷണറി ഓഫീസർ / ജൂനിയർ അസോസിയേറ്റ്', gu: 'SBI પ્રોબેશનરી ઓફિસર / જુનિયર એસોસિયેટ', kn: 'SBI ಪ್ರೊಬೇಷನರಿ ಅಧಿಕಾರಿ / ಜೂನಿಯರ್ ಅಸೋಸಿಯೇಟ್' },
  rrb: { en: 'Railway Recruitment Board (RRB)', ta: 'ரயில்வே பணியாளர் தேர்வு வாரியம் (RRB)', hi: 'रेलवे भर्ती बोर्ड (RRB)', te: 'రైల్వే రిక్రూట్‌మెంట్ బోర్డ్ (RRB)', mr: 'रेल्वे भरती मंडळ (RRB)', ml: 'റെയിൽവേ റിക്രൂട്ട്മെന്റ് ബോർഡ് (RRB)', gu: 'રેલવે ભરતી બોર્ડ (RRB)', kn: 'ರೈಲ್ವೆ ನೇಮಕಾತಿ ಮಂಡಳಿ (RRB)' },
  nda: { en: 'NDA / NA', ta: 'தேசிய பாதுகாப்பு அகாடமி / கடற்படை அகாடமி (NDA/NA)', hi: 'राष्ट्रीय रक्षा अकादमी / नौसेना अकादमी (NDA/NA)', te: 'నేషనల్ డిఫెన్స్ అకాడమీ / నేవల్ అకాడమీ (NDA/NA)', mr: 'राष्ट्रीय संरक्षण अकादमी / नौदल अकादमी (NDA/NA)', ml: 'നാഷണൽ ഡിഫൻസ് അക്കാദമി / നേവൽ അക്കാദമി (NDA/NA)', gu: 'નેશનલ ડિફેન્સ એકેડમી / નેવલ એકેડમી (NDA/NA)', kn: 'ರಾಷ್ಟ್ರೀಯ ರಕ್ಷಣಾ ಅಕಾಡೆಮಿ / ನೌಕಾ ಅಕಾಡೆಮಿ (NDA/NA)' },
  cds: { en: 'Combined Defence Services (CDS)', ta: 'ஒருங்கிணைந்த பாதுகாப்புப் பணிகள் தேர்வு (CDS)', hi: 'संयुक्त रक्षा सेवा परीक्षा (CDS)', te: 'కంబైన్డ్ డిఫెన్స్ సర్వీసెస్ (CDS)', mr: 'संयुक्त संरक्षण सेवा परीक्षा (CDS)', ml: 'കംബൈൻഡ് ഡിഫൻസ് സർവീസസ് (CDS)', gu: 'સંયુક્ત સંરક્ષણ સેવાઓ પરીક્ષા (CDS)', kn: 'ಸಂಯುಕ್ತ ರಕ್ಷಣಾ ಸೇವೆಗಳ ಪರೀಕ್ಷೆ (CDS)' },
  afcat: { en: 'AFCAT', ta: 'இந்திய விமானப்படை பொதுச் சேர்க்கைத் தேர்வு (AFCAT)', hi: 'वायु सेना सामान्य प्रवेश परीक्षा (AFCAT)', te: 'ఎయిర్ ఫోర్స్ కామన్ అడ్మిషన్ టెస్ట్ (AFCAT)', mr: 'वायुसेना सामान्य प्रवेश परीक्षा (AFCAT)', ml: 'എയർ ഫോഴ്സ് കോമൺ അഡ്മിഷൻ ടെസ്റ്റ് (AFCAT)', gu: 'એર ફોર્સ કોમન એડમિશન ટેસ્ટ (AFCAT)', kn: 'ವಾಯುಪಡೆ ಸಾಮಾನ್ಯ ಪ್ರವೇಶ ಪರೀಕ್ಷೆ (AFCAT)' },
  ctet: { en: 'CTET', ta: 'மத்திய ஆசிரியர் தகுதித் தேர்வு (CTET)', hi: 'केंद्रीय शिक्षक पात्रता परीक्षा (CTET)', te: 'కేంద్ర ఉపాధ్యాయ అర్హత పరీక్ష (CTET)', mr: 'केंद्रीय शिक्षक पात्रता परीक्षा (CTET)', ml: 'കേന്ദ്ര അധ്യാപക യോഗ്യതാ പരീക്ഷ (CTET)', gu: 'કેન્દ્રીય શિક્ષક પાત્રતા પરીક્ષા (CTET)', kn: 'ಕೇಂದ್ರ ಶಿಕ್ಷಕರ ಅರ್ಹತಾ ಪರೀಕ್ಷೆ (CTET)' },
  'tnpsc-group1': { en: 'TNPSC Group I', ta: 'TNPSC தொகுதி I தேர்வு', hi: 'TNPSC समूह I परीक्षा', te: 'TNPSC గ్రూప్ I పరీక్ష', mr: 'TNPSC गट I परीक्षा', ml: 'TNPSC ഗ്രൂപ്പ് I പരീക്ഷ', gu: 'TNPSC ગ્રુપ I પરીક્ષા', kn: 'TNPSC ಗುಂಪು I ಪರೀಕ್ಷೆ' },
  'tnpsc-group2': { en: 'TNPSC Group II / IIA', ta: 'TNPSC தொகுதி II / IIA தேர்வு', hi: 'TNPSC समूह II / IIA परीक्षा', te: 'TNPSC గ్రూప్ II / IIA పరీక్ష', mr: 'TNPSC गट II / IIA परीक्षा', ml: 'TNPSC ഗ്രൂപ്പ് II / IIA പരീക്ഷ', gu: 'TNPSC ગ્રુપ II / IIA પરીક્ષા', kn: 'TNPSC ಗುಂಪು II / IIA ಪರೀಕ್ಷೆ' },
  'tnpsc-group4': { en: 'TNPSC Group IV', ta: 'TNPSC தொகுதி IV தேர்வு', hi: 'TNPSC समूह IV परीक्षा', te: 'TNPSC గ్రూప్ IV పరీక్ష', mr: 'TNPSC गट IV परीक्षा', ml: 'TNPSC ഗ്രൂപ്പ് IV പരീക്ഷ', gu: 'TNPSC ગ્રુપ IV પરીક્ષા', kn: 'TNPSC ಗುಂಪು IV ಪರೀಕ್ಷೆ' },
  tntet: { en: 'Tamil Nadu Teacher Eligibility Test (TNTET)', ta: 'தமிழ்நாடு ஆசிரியர் தகுதித் தேர்வு (TNTET)', hi: 'तमिलनाडु शिक्षक पात्रता परीक्षा (TNTET)', te: 'తమిళనాడు ఉపాధ్యాయ అర్హత పరీక్ష (TNTET)', mr: 'तमिळनाडू शिक्षक पात्रता परीक्षा (TNTET)', ml: 'തമിഴ്നാട് അധ്യാപക യോഗ്യതാ പരീക്ഷ (TNTET)', gu: 'તમિલનાડુ શિક્ષક પાત્રતા પરીક્ષા (TNTET)', kn: 'ತಮಿಳುನಾಡು ಶಿಕ್ಷಕರ ಅರ್ಹತಾ ಪರೀಕ್ಷೆ (TNTET)' }
};
export const getExamName = (exam: Exam, language: string) => examNames[exam.id]?.[language] || exam.name;

// ---------------------------------------------------------------------------
// Application status
// ---------------------------------------------------------------------------
// SAHAYINI never guesses whether applications are open. A status is shown only
// when a maintainer has added a record below that was checked against an
// official notification. Every record needs the official source URL and the
// date it was last verified (YYYY-MM-DD). Records older than
// STATUS_MAX_AGE_DAYS are treated as unverified so stale information is never
// presented as current.
//
// This list is intentionally empty: no live verification was possible when it
// was created. Example of a record (do not copy values; use real, checked ones):
//   'ssc-cgl': { status: 'open', sourceName: 'SSC notice', sourceUrl: '<official notice URL>',
//                lastVerified: 'YYYY-MM-DD', applyUrl: '<official apply portal URL>',
//                importantDates: [{ label: 'Last date to apply', date: 'YYYY-MM-DD' }] }
export type ApplicationStatus = 'open' | 'notified' | 'closed' | 'unverified';

export interface ExamStatusRecord {
  status: Exclude<ApplicationStatus, 'unverified'>;
  sourceName: string;
  sourceUrl: string;
  lastVerified: string;
  applyUrl?: string;
  importantDates?: { label: string; date: string }[];
}

export const STATUS_MAX_AGE_DAYS = 30;

export const examStatusRecords: Record<string, ExamStatusRecord> = {};

export interface ResolvedExamStatus {
  status: ApplicationStatus;
  record?: ExamStatusRecord;
}

const isValidDate = (s: string) => /^\d{4}-\d{2}-\d{2}$/.test(s) && !Number.isNaN(Date.parse(s));

export function resolveExamStatus(
  examId: string,
  now: Date = new Date(),
  records: Record<string, ExamStatusRecord> = examStatusRecords,
): ResolvedExamStatus {
  const record = records[examId];
  if (!record || !record.sourceUrl || !isValidDate(record.lastVerified)) return { status: 'unverified' };
  const ageDays = (now.getTime() - Date.parse(record.lastVerified)) / 86_400_000;
  if (ageDays < 0 || ageDays > STATUS_MAX_AGE_DAYS) return { status: 'unverified' };
  return { status: record.status, record };
}
