import type { LanguageCode } from '../types';

// Study lessons for the Government Exams module.
// Lesson text is written in English from standard, stable study material.
// Titles are localised; the lesson body is shown in English for every
// language and the interface says so. Lessons never contain dated news,
// application dates or recruitment claims.

export type TopicId =
  | 'polity' | 'history' | 'geography' | 'economy' | 'science' | 'quant'
  | 'reasoning' | 'english' | 'banking' | 'pedagogy' | 'tn' | 'current';

export interface LessonSection { heading: string; paragraphs: string[] }

export interface ExamLesson {
  id: TopicId;
  titles: Record<LanguageCode, string>;
  intro: string;
  sections: LessonSection[];
  facts: string[];
  examples: string[];
  keyPoints: string[];
  recap: string;
}

export const examLessons: ExamLesson[] = [
  {
    id: 'polity',
    titles: { en: 'Indian Polity and Constitution', ta: 'இந்திய அரசியல் மற்றும் அரசியலமைப்பு', hi: 'भारतीय राजव्यवस्था और संविधान', te: 'భారత రాజ్యాంగం మరియు రాజకీయ వ్యవస్థ', mr: 'भारतीय राज्यव्यवस्था आणि संविधान', ml: 'ഇന്ത്യൻ ഭരണവ്യവസ്ഥയും ഭരണഘടനയും', gu: 'ભારતીય રાજ્યવ્યવસ્થા અને બંધારણ', kn: 'ಭಾರತೀಯ ರಾಜ್ಯವ್ಯವಸ್ಥೆ ಮತ್ತು ಸಂವಿಧಾನ' },
    intro: 'The Constitution of India is the supreme law of the country. It was adopted on 26 November 1949 and came into force on 26 January 1950. It sets up the institutions of government and protects the rights of citizens.',
    sections: [
      { heading: 'Structure of the Constitution', paragraphs: [
        'The Constitution begins with a Preamble. It describes India as a sovereign, socialist, secular, democratic republic and promises justice, liberty, equality and fraternity. The words "socialist" and "secular" were added by the 42nd Amendment in 1976.',
        'The original Constitution had 395 articles, 22 parts and 8 schedules. Today it has 12 schedules and has been amended many times, so always study the amended text.' ] },
      { heading: 'Rights, Duties and Directive Principles', paragraphs: [
        'Part III (Articles 12 to 35) contains the Fundamental Rights: equality, freedom, protection against exploitation, freedom of religion, cultural and educational rights, and the right to constitutional remedies. A person whose Fundamental Right is violated can approach the Supreme Court under Article 32 or a High Court under Article 226.',
        'Part IV contains the Directive Principles of State Policy. They guide the government but cannot be enforced in court. Part IVA (Article 51A) lists the Fundamental Duties, added by the 42nd Amendment in 1976.' ] },
      { heading: 'Union Government', paragraphs: [
        'Parliament consists of the President, the Lok Sabha and the Rajya Sabha. The Lok Sabha is directly elected. The Rajya Sabha represents the states and is a permanent house: one-third of its members retire every two years.',
        'The real executive power rests with the Council of Ministers headed by the Prime Minister. The Vice-President is the ex-officio Chairman of the Rajya Sabha.' ] },
    ],
    facts: [
      'Dr B. R. Ambedkar chaired the Drafting Committee of the Constituent Assembly.',
      'Article 21 protects life and personal liberty; Article 21A gives the right to education for children aged 6 to 14.',
      'Minimum age to contest: 25 years for the Lok Sabha and 30 years for the Rajya Sabha.',
      'The basic structure doctrine comes from the Kesavananda Bharati case (1973).',
      'The right to property is no longer a Fundamental Right; it is a legal right under Article 300A.' ],
    examples: [
      'A law that treats people differently only because of their religion would be tested against the right to equality (Articles 14 to 16).',
      'To remember how a law is made: a Bill is passed by both Houses of Parliament and then receives the President\'s assent.' ],
    keyPoints: [
      'Know the part and article numbers of the Fundamental Rights, Directive Principles and Fundamental Duties.',
      'Understand the difference between justiciable (Fundamental Rights) and non-justiciable (Directive Principles) provisions.',
      'Learn the composition, eligibility and tenure of Parliament.',
      'Revise important amendments with their year and purpose.' ],
    recap: 'The Constitution gives India its structure of government and its guarantees of rights. Focus on the Preamble, Parts III, IV and IVA, and how Parliament and the executive work.',
  },
  {
    id: 'history',
    titles: { en: 'Indian History', ta: 'இந்திய வரலாறு', hi: 'भारतीय इतिहास', te: 'భారత చరిత్ర', mr: 'भारतीय इतिहास', ml: 'ഇന്ത്യൻ ചരിത്രം', gu: 'ભારતનો ઇતિહાસ', kn: 'ಭಾರತದ ಇತಿಹಾಸ' },
    intro: 'Indian history is usually studied in three parts: ancient, medieval and modern. Exams test important dates, rulers, movements and their effects, so build a simple timeline first.',
    sections: [
      { heading: 'Ancient India', paragraphs: [
        'The Indus Valley Civilisation had its mature phase roughly between 2600 and 1900 BCE, with planned cities such as Harappa and Mohenjo-daro. The Maurya Empire was founded by Chandragupta Maurya around 321 BCE. Ashoka, after the Kalinga war (about 261 BCE), adopted and promoted Buddhism.',
        'The Gupta period (roughly the 4th to 6th centuries CE) is known for progress in science, mathematics, art and literature.' ] },
      { heading: 'Medieval India', paragraphs: [
        'The Delhi Sultanate lasted from 1206 to 1526. The Mughal Empire began in 1526 when Babur won the First Battle of Panipat. Akbar, Shah Jahan and Aurangzeb are the best-known Mughal rulers.',
        'South India saw powerful kingdoms such as the Cholas and the Vijayanagara Empire. Bhakti and Sufi movements shaped religion and culture.' ] },
      { heading: 'Modern India and the freedom struggle', paragraphs: [
        'British power grew after the Battle of Plassey (1757) and the Battle of Buxar (1764). The Revolt of 1857 began at Meerut. The Indian National Congress was founded in 1885.',
        'Major phases of the freedom movement include the Non-Cooperation Movement (1920 to 1922), the Dandi March and Civil Disobedience (1930) and the Quit India Movement (1942). India became independent on 15 August 1947.' ] },
    ],
    facts: [
      'Battle of Plassey: 1757. Battle of Buxar: 1764.',
      'Revolt of 1857 began at Meerut on 10 May 1857.',
      'Indian National Congress founded: 1885 (A. O. Hume was among the founders).',
      'Dandi March: 1930. Quit India Movement: 1942.',
      'India became independent on 15 August 1947 and a republic on 26 January 1950.' ],
    examples: [
      'To remember order, write a timeline: 1757 Plassey, 1857 Revolt, 1885 Congress, 1930 Dandi, 1942 Quit India, 1947 Independence.',
      'Link causes and effects: the Partition of Bengal (1905) led to the Swadeshi Movement.' ],
    keyPoints: [
      'Make a timeline for each period and revise it often.',
      'Learn who founded or led each empire or movement.',
      'Connect events: cause, event and result.',
      'Use maps for kingdoms, battles and movements.' ],
    recap: 'Ancient, medieval and modern India each have key dynasties, battles and movements. A clear timeline and cause-and-effect notes are the fastest way to retain them.',
  },
  {
    id: 'geography',
    titles: { en: 'Indian Geography', ta: 'இந்திய புவியியல்', hi: 'भारतीय भूगोल', te: 'భారత భూగోళశాస్త్రం', mr: 'भारतीय भूगोल', ml: 'ഇന്ത്യൻ ഭൂമിശാസ്ത്രം', gu: 'ભારતનું ભૂગોળ', kn: 'ಭಾರತದ ಭೂಗೋಳ' },
    intro: 'Geography questions cover physical features, rivers, climate, soils, resources and the map of India. Study with a map beside you.',
    sections: [
      { heading: 'Physical divisions', paragraphs: [
        'India has six broad physical divisions: the Himalayas, the Northern Plains, the Peninsular Plateau, the Indian Desert, the Coastal Plains and the Islands.',
        'The Western Ghats and Eastern Ghats border the Deccan plateau on the west and east. The Northern Plains are formed by alluvium brought by the Indus, Ganga and Brahmaputra river systems.' ] },
      { heading: 'Rivers and drainage', paragraphs: [
        'Himalayan rivers such as the Ganga, Indus and Brahmaputra are perennial because they are fed by rain and glaciers. Peninsular rivers such as the Godavari, Krishna and Kaveri depend mainly on rain and are largely seasonal.',
        'The Godavari is the longest river of peninsular India.' ] },
      { heading: 'Climate and soils', paragraphs: [
        'India has a monsoon climate. The year is commonly divided into winter, summer, the south-west monsoon and the retreating monsoon.',
        'Main soils are alluvial, black (regur), red, laterite, desert and mountain soils. Black soil holds moisture and suits cotton.' ] },
    ],
    facts: [
      'The Tropic of Cancer passes through eight Indian states.',
      'The Standard Meridian of India is 82 degrees 30 minutes East and passes near Mirzapur in Uttar Pradesh.',
      'Rajasthan is the largest Indian state by area.',
      'Chilika Lake in Odisha is the largest coastal lagoon in India.',
      'India has 28 states and 8 Union Territories.' ],
    examples: [
      'A farmer in the Deccan plateau growing cotton usually relies on black soil because it retains moisture.',
      'If a river is fed by glaciers, it is likely to flow through the year; rain-fed peninsular rivers dry up in summer.' ],
    keyPoints: [
      'Learn the six physical divisions with one example each.',
      'Know major rivers, their origin and the sea they fall into.',
      'Match soils with crops.',
      'Practise locating states, capitals and rivers on a blank map.' ],
    recap: 'Know the physical divisions, the Himalayan versus peninsular rivers, the monsoon climate and the main soil types. Map practice makes recall easy.',
  },
  {
    id: 'economy',
    titles: { en: 'Indian Economy', ta: 'இந்திய பொருளாதாரம்', hi: 'भारतीय अर्थव्यवस्था', te: 'భారత ఆర్థిక వ్యవస్థ', mr: 'भारतीय अर्थव्यवस्था', ml: 'ഇന്ത്യൻ സമ്പദ്‌വ്യവസ്ഥ', gu: 'ભારતીય અર્થતંત્ર', kn: 'ಭಾರತೀಯ ಅರ್ಥವ್ಯವಸ್ಥೆ' },
    intro: 'The Indian economy is a mixed economy where both the public and private sectors operate. Exams test basic concepts, institutions and policy terms.',
    sections: [
      { heading: 'Basic concepts', paragraphs: [
        'Gross Domestic Product (GDP) is the total value of goods and services produced within a country in a year. The economy has three sectors: primary (agriculture and mining), secondary (industry) and tertiary (services).',
        'Inflation is a sustained rise in the general price level. Poverty, unemployment and inequality are also common themes.' ] },
      { heading: 'Institutions and planning', paragraphs: [
        'The Reserve Bank of India (RBI) was established in 1935 and is the central bank. India followed Five-Year Plans from 1951; NITI Aayog replaced the Planning Commission in 2015.',
        'The economic reforms of 1991 liberalised, privatised and globalised the Indian economy.' ] },
      { heading: 'Money, budget and taxes', paragraphs: [
        'The Union Budget is presented every year for the financial year that runs from 1 April to 31 March. Taxes are direct (such as income tax) or indirect (such as GST).',
        'The Goods and Services Tax (GST) came into effect on 1 July 2017 and replaced many indirect taxes.' ] },
    ],
    facts: [
      'The RBI was established in 1935.',
      'The financial year in India runs from 1 April to 31 March.',
      'GST was introduced on 1 July 2017.',
      'Fourteen major banks were nationalised in 1969.',
      'The Economic Survey is presented before the Union Budget.' ],
    examples: [
      'If prices of most goods rise steadily over a year, the economy is experiencing inflation.',
      'Income tax paid by a person is a direct tax; GST paid on a purchase is an indirect tax.' ],
    keyPoints: [
      'Learn definitions: GDP, inflation, fiscal deficit, repo rate.',
      'Know the role of the RBI, NITI Aayog and the Finance Ministry.',
      'Understand the three sectors and their share in employment and output.',
      'For current figures, always use the latest official publication.' ],
    recap: 'Economy questions reward clear definitions and knowledge of institutions. Treat any numbers as time-sensitive and verify them in official sources.',
  },
  {
    id: 'science',
    titles: { en: 'General Science', ta: 'பொது அறிவியல்', hi: 'सामान्य विज्ञान', te: 'సాధారణ శాస్త్రం', mr: 'सामान्य विज्ञान', ml: 'പൊതു ശാസ്ത്രം', gu: 'સામાન્ય વિજ્ઞાન', kn: 'ಸಾಮಾನ್ಯ ವಿಜ್ಞಾನ' },
    intro: 'General Science in recruitment exams is based on school-level physics, chemistry and biology. Focus on concepts, units and everyday applications.',
    sections: [
      { heading: 'Physics', paragraphs: [
        'Force is measured in newtons and causes a change in motion. Newton\'s three laws describe inertia, the relation between force and acceleration, and action and reaction. The speed of light is about 3 \u00d7 10\u2078 metres per second.',
        'Learn common units: metre (length), kilogram (mass), second (time), joule (energy) and watt (power).' ] },
      { heading: 'Chemistry', paragraphs: [
        'Elements have symbols such as Na (sodium), K (potassium), Fe (iron) and Au (gold). The pH scale measures acidity: below 7 is acidic, 7 is neutral and above 7 is basic.',
        'Know common acids, bases and salts and their everyday uses.' ] },
      { heading: 'Biology and health', paragraphs: [
        'The cell is the basic unit of life, and the mitochondria are called the powerhouse of the cell. Plants make food by photosynthesis.',
        'Vitamin deficiencies cause diseases: vitamin A (night blindness), vitamin B1 (beriberi), vitamin C (scurvy) and vitamin D (rickets).' ] },
    ],
    facts: [
      'Nitrogen is the most abundant gas in Earth\'s atmosphere (about 78 per cent).',
      'The SI unit of force is the newton.',
      'The pH of pure water is 7.',
      'Mitochondria produce most of the energy of the cell.',
      'Scurvy is caused by a lack of vitamin C.' ],
    examples: [
      'Pushing a heavy box harder makes it accelerate more: this is the second law of motion.',
      'Lemon juice is acidic (pH below 7); baking soda solution is basic (pH above 7).' ],
    keyPoints: [
      'Memorise units, symbols and vitamin-disease pairs.',
      'Link each concept with a daily-life example.',
      'Revise NCERT-level definitions.',
      'Practise short factual questions often.' ],
    recap: 'Master school-level definitions, units and examples across physics, chemistry and biology. Short, frequent revision works best.',
  },
  {
    id: 'quant',
    titles: { en: 'Quantitative Aptitude', ta: 'கணித திறனறிவு', hi: 'मात्रात्मक योग्यता', te: 'సంఖ్యా సామర్థ్యం', mr: 'संख्यात्मक अभियोग्यता', ml: 'ഗണിത അഭിരുചി', gu: 'ગાણિતિક અભિયોગ્યતા', kn: 'ಸಂಖ್ಯಾತ್ಮಕ ಸಾಮರ್ಥ್ಯ' },
    intro: 'Quantitative aptitude tests speed and accuracy in arithmetic. Learn a small set of formulas well and practise them daily.',
    sections: [
      { heading: 'Percentage, ratio and average', paragraphs: [
        'Percentage means "per hundred": x% of N = (x \u00d7 N) / 100. A ratio compares quantities; to divide an amount in the ratio a:b, add the parts and share in proportion.',
        'Average = sum of observations \u00f7 number of observations.' ] },
      { heading: 'Profit, loss and interest', paragraphs: [
        'Profit = Selling Price \u2212 Cost Price. Profit % = (Profit \u00f7 Cost Price) \u00d7 100. Loss is calculated the same way using the loss amount.',
        'Simple Interest = (Principal \u00d7 Rate \u00d7 Time) \u00f7 100, where the rate is per year and time is in years.' ] },
      { heading: 'Time, speed and distance', paragraphs: [
        'Speed = Distance \u00f7 Time. To convert km/h to m/s, multiply by 5/18; to convert m/s to km/h, multiply by 18/5.',
        'For work problems, find the part of the work done in one day and add the rates of people working together.' ] },
    ],
    facts: [
      'Profit % is always calculated on the cost price unless the question says otherwise.',
      'To convert km/h to m/s, multiply by 5/18.',
      'Simple interest uses only the original principal.',
      'If a:b is the ratio and the total is T, the first share is T \u00d7 a/(a+b).',
      'Average of consecutive numbers is the middle value.' ],
    examples: [
      '15% of 480 = (15 \u00d7 480) / 100 = 72.',
      'Simple interest on \u20b92,000 at 5% per year for 3 years = (2000 \u00d7 5 \u00d7 3) / 100 = \u20b9300.',
      'A speed of 72 km/h equals 72 \u00d7 5/18 = 20 m/s.' ],
    keyPoints: [
      'Write the formula first, then substitute values.',
      'Check units (hours, minutes, km, m) before calculating.',
      'Learn tables up to 20 and common squares.',
      'Practise timed sets to improve speed.' ],
    recap: 'Most arithmetic questions use a handful of formulas. Know them, check units, and practise under time.',
  },
  {
    id: 'reasoning',
    titles: { en: 'Logical Reasoning', ta: 'தர்க்க அறிவு', hi: 'तार्किक तर्कशक्ति', te: 'తార్కిక సామర్థ్యం', mr: 'तार्किक अभियोग्यता', ml: 'ലോജിക്കൽ റീസണിംഗ്', gu: 'તાર્કિક તર્કશક્તિ', kn: 'ತಾರ್ಕಿಕ ಚಿಂತನೆ' },
    intro: 'Reasoning questions test how well you spot patterns and follow logic. Most types follow clear methods you can learn.',
    sections: [
      { heading: 'Series and classification', paragraphs: [
        'In number series, find the difference or ratio between neighbouring terms. If the differences themselves change, look at the pattern of differences. In letter series, convert letters to positions (A=1, B=2 and so on).',
        'In odd-one-out questions, find the property shared by most items and pick the one that breaks it.' ] },
      { heading: 'Relations and directions', paragraphs: [
        'For blood relations, draw a family tree and move one step at a time. For direction sense, draw a rough map: north is up, east is right.',
        'Right-angle turns change direction by 90 degrees; distances along a line can be added or subtracted.' ] },
      { heading: 'Syllogism and coding', paragraphs: [
        'In syllogisms, "All A are B" and "All B are C" together give "All A are C". Draw circles to check conclusions.',
        'In coding-decoding, find the rule (shift, reverse, substitute) from the example and apply it carefully.' ] },
    ],
    facts: [
      'In a series, check differences first, then ratios, then squares or cubes.',
      'A=1 ... Z=26 helps in alphabet-based questions.',
      '"All A are B, all B are C" gives "All A are C".',
      'Draw diagrams for directions and relations.',
      'Eliminate options that clearly break the pattern.' ],
    examples: [
      'Series 3, 6, 12, 24, ? : each term is doubled, so the next term is 48.',
      'Facing north and turning right means you now face east.',
      '"A\'s father\'s only brother\'s son" is A\'s cousin.' ],
    keyPoints: [
      'Do not guess; find the rule.',
      'Use diagrams for relations and directions.',
      'Practise each type separately, then mix them.',
      'Review wrong answers to learn the pattern you missed.' ],
    recap: 'Reasoning is a skill built by practising each question type. Find the rule, draw it out, and check the result.',
  },
  {
    id: 'english',
    titles: { en: 'English Language', ta: 'ஆங்கில மொழி', hi: 'अंग्रेज़ी भाषा', te: 'ఇంగ్లీష్ భాష', mr: 'इंग्रजी भाषा', ml: 'ഇംഗ്ലീഷ് ഭാഷ', gu: 'અંગ્રેજી ભાષા', kn: 'ಇಂಗ್ಲಿಷ್ ಭಾಷೆ' },
    intro: 'English sections test grammar, vocabulary and comprehension. Regular reading and short daily practice give the best results.',
    sections: [
      { heading: 'Grammar essentials', paragraphs: [
        'A verb must agree with its subject. "Each", "every", "either" and "neither" take a singular verb: "Each of the boys has a book."',
        'Choose the tense that matches the time of the action. Use "a" before a consonant sound and "an" before a vowel sound (an hour, a university).' ] },
      { heading: 'Vocabulary', paragraphs: [
        'Learn synonyms (similar meaning) and antonyms (opposite meaning) in pairs. For one-word substitutions, learn a new word each day, for example "polyglot" for a person who knows many languages.',
        'Idioms should be learned as whole phrases; "a piece of cake" means something very easy.' ] },
      { heading: 'Comprehension', paragraphs: [
        'Read the passage once for the main idea, then read the questions, then find the answers in the text. Do not use outside knowledge unless the question asks for it.' ] },
    ],
    facts: [
      '"Neither of the two" takes a singular verb.',
      'Use "an" before vowel sounds, not just vowel letters.',
      'Antonym of "ancient" is "modern".',
      '"Polyglot" means a person who speaks many languages.',
      'Correct spelling: accommodation (double c, double m).' ],
    examples: [
      '"The news is good" is correct because "news" is treated as singular.',
      '"abundant" and "plentiful" are synonyms.' ],
    keyPoints: [
      'Learn five new words and use them in sentences each day.',
      'Read an editorial or a short article daily.',
      'Revise subject-verb agreement and tenses.',
      'Avoid changing the meaning of the passage while answering.' ],
    recap: 'Grammar rules, vocabulary and careful reading are the three pillars of the English section. Practise a little every day.',
  },
  {
    id: 'banking',
    titles: { en: 'Banking and Financial Awareness', ta: 'வங்கி மற்றும் நிதி விழிப்புணர்வு', hi: 'बैंकिंग और वित्तीय जागरूकता', te: 'బ్యాంకింగ్ మరియు ఆర్థిక అవగాహన', mr: 'बँकिंग आणि आर्थिक जागरूकता', ml: 'ബാങ്കിംഗും സാമ്പത്തിക അവബോധവും', gu: 'બેંકિંગ અને નાણાકીય જાગૃતિ', kn: 'ಬ್ಯಾಂಕಿಂಗ್ ಮತ್ತು ಹಣಕಾಸು ಅರಿವು' },
    intro: 'Banking awareness covers how banks work, the role of regulators and common financial terms. Concepts stay stable, but rates and limits change, so check official sources for them.',
    sections: [
      { heading: 'Structure of banking', paragraphs: [
        'The Reserve Bank of India is the central bank and banking regulator. Commercial banks may be public sector, private sector or foreign banks. There are also regional rural banks, cooperative banks, small finance banks and payments banks.',
        'SEBI regulates the securities market and IRDAI regulates insurance.' ] },
      { heading: 'Monetary terms', paragraphs: [
        'The repo rate is the rate at which the RBI lends short-term money to banks. The Cash Reserve Ratio (CRR) is the share of deposits banks must keep with the RBI in cash.',
        'The Statutory Liquidity Ratio (SLR) is the share of deposits banks must keep in liquid assets such as cash, gold or approved securities.' ] },
      { heading: 'Digital payments and services', paragraphs: [
        'NEFT, RTGS and IMPS are electronic fund transfer systems. UPI is a real-time payment system developed by the National Payments Corporation of India (NPCI).',
        'KYC means Know Your Customer: banks verify identity and address of customers. An IFSC code has 11 characters and identifies a bank branch.' ] },
    ],
    facts: [
      'The RBI regulates banks in India.',
      'UPI is operated by NPCI.',
      'IFSC code length: 11 characters.',
      'The Pradhan Mantri Jan Dhan Yojana was launched on 28 August 2014 for financial inclusion.',
      'Current policy rates and transfer limits change; use the RBI website for the latest values.' ],
    examples: [
      'When you send money from your phone using a UPI app, the payment is processed over the UPI system run by NPCI.',
      'If the RBI raises the repo rate, borrowing becomes costlier for banks and loans may become more expensive.' ],
    keyPoints: [
      'Know each regulator and what it regulates.',
      'Learn full forms: NEFT, RTGS, IMPS, UPI, KYC, CRR, SLR.',
      'Understand how rate changes affect borrowing.',
      'Use official sources for current rates and limits.' ],
    recap: 'Know the regulators, the main monetary terms and the payment systems. Treat all rates and limits as changeable and verify them officially.',
  },
  {
    id: 'pedagogy',
    titles: { en: 'Child Development and Pedagogy', ta: 'குழந்தை வளர்ச்சி மற்றும் கற்பித்தலியல்', hi: 'बाल विकास और शिक्षाशास्त्र', te: 'శిశు వికాసం మరియు బోధనాశాస్త్రం', mr: 'बालविकास आणि अध्यापनशास्त्र', ml: 'ശിശുവികസനവും അധ്യാപനശാസ്ത്രവും', gu: 'બાળવિકાસ અને શિક્ષણશાસ્ત્ર', kn: 'ಮಕ್ಕಳ ಬೆಳವಣಿಗೆ ಮತ್ತು ಬೋಧನಾಶಾಸ್ತ್ರ' },
    intro: 'Teacher eligibility tests ask how children grow, learn and are assessed. Learn the main thinkers and ideas and connect them to classroom practice.',
    sections: [
      { heading: 'Theories of development', paragraphs: [
        'Jean Piaget described four stages of cognitive development: sensorimotor, preoperational, concrete operational and formal operational. Lev Vygotsky stressed social interaction and the Zone of Proximal Development, the gap between what a child can do alone and with help.',
        'Lawrence Kohlberg described stages of moral development, and Howard Gardner proposed multiple intelligences.' ] },
      { heading: 'Learning and assessment', paragraphs: [
        'Formative assessment happens during learning and gives feedback to improve it. Summative assessment happens at the end of a unit or year to judge achievement.',
        'Good teaching uses questioning, activities and varied materials so that children construct understanding rather than only memorise.' ] },
      { heading: 'Inclusion and policy', paragraphs: [
        'Inclusive education means children with different abilities and backgrounds learn together in regular classrooms with support. The Right of Children to Free and Compulsory Education Act, 2009 provides free and compulsory education for children aged 6 to 14.',
        'The National Education Policy 2020 proposes a 5+3+3+4 school structure.' ] },
    ],
    facts: [
      'Piaget\'s first stage is the sensorimotor stage.',
      'The Zone of Proximal Development is associated with Vygotsky.',
      'The RTE Act, 2009 covers children aged 6 to 14.',
      'Formative assessment gives feedback during learning.',
      'NEP 2020 proposes the 5+3+3+4 structure.' ],
    examples: [
      'A teacher who gives a child a hint to solve a problem the child cannot yet solve alone is working in the Zone of Proximal Development.',
      'A short quiz in the middle of a unit to see who needs help is formative assessment.' ],
    keyPoints: [
      'Match each theory with its thinker.',
      'Differentiate formative and summative assessment.',
      'Know the aim of inclusive education.',
      'Apply each idea to a classroom example.' ],
    recap: 'Link thinkers to theories, learn the assessment types, and remember the inclusion principle and the RTE Act. Always think of the classroom example.',
  },
  {
    id: 'tn',
    titles: { en: 'Tamil Nadu General Studies', ta: 'தமிழ்நாடு பொதுப் படிப்பு', hi: 'तमिलनाडु सामान्य अध्ययन', te: 'తమిళనాడు సాధారణ అధ్యయనం', mr: 'तमिळनाडू सामान्य अध्ययन', ml: 'തമിഴ്‌നാട് പൊതുപഠനം', gu: 'તમિલનાડુ સામાન્ય અભ્યાસ', kn: 'ತಮಿಳುನಾಡು ಸಾಮಾನ್ಯ ಅಧ್ಯಯನ' },
    intro: 'Tamil Nadu exams include questions on the state\'s history, culture, geography and administration. Check the current TNPSC or TRB syllabus for the exact units.',
    sections: [
      { heading: 'History and culture', paragraphs: [
        'Sangam literature is among the earliest Tamil literature. The Thirukkural by Thiruvalluvar has 1,330 couplets in 133 chapters. The Pallavas built the monuments at Mamallapuram, and the Chola king Rajaraja I built the Brihadisvara Temple at Thanjavur.',
        'Madras State was renamed Tamil Nadu in 1969.' ] },
      { heading: 'Geography', paragraphs: [
        'Tamil Nadu has the Western Ghats on its west, the Eastern Ghats and plains in the interior and the Coromandel Coast on the east. The Kaveri delta is one of the main rice-growing regions.',
        'Doddabetta in the Nilgiris is the highest peak in the state.' ] },
      { heading: 'State symbols and administration', paragraphs: [
        'The state emblem shows the gopuram of the Srivilliputhur Andal temple. The Nilgiri tahr is the state animal. The Legislative Assembly has 234 seats and the capital is Chennai.' ] },
    ],
    facts: [
      'The Thirukkural has 1,330 couplets in 133 chapters.',
      'The Brihadisvara Temple, Thanjavur, was built by Rajaraja I.',
      'Madras State was renamed Tamil Nadu in 1969.',
      'The Nilgiri tahr is the state animal.',
      'Doddabetta is the highest peak in Tamil Nadu.' ],
    examples: [
      'The shore temples at Mamallapuram are examples of Pallava architecture.',
      'The Kaveri delta region around Thanjavur is known as the rice bowl of the state.' ],
    keyPoints: [
      'Follow the official syllabus units for your exam.',
      'Learn the major dynasties of Tamil Nadu with their capitals and monuments.',
      'Know state symbols and key geographical features.',
      'Administrative details change; confirm them from government sources.' ],
    recap: 'Tamil Nadu questions mix history, culture, geography and symbols. Use the official syllabus as your guide and verify administrative facts.',
  },
  {
    id: 'current',
    titles: { en: 'Current Affairs: How to Study', ta: 'நடப்பு நிகழ்வுகள்: படிக்கும் முறை', hi: 'समसामयिक घटनाएँ: अध्ययन कैसे करें', te: 'ప్రస్తుత అంశాలు: ఎలా చదవాలి', mr: 'चालू घडामोडी: अभ्यास कसा करावा', ml: 'സമകാലിക വിഷയങ്ങൾ: എങ്ങനെ പഠിക്കാം', gu: 'ચાલુ ઘટનાઓ: કેવી રીતે અભ્યાસ કરવો', kn: 'ಪ್ರಚಲಿತ ವಿದ್ಯಮಾನ: ಹೇಗೆ ಓದಬೇಕು' },
    intro: 'Current affairs change every day, so this lesson teaches a method, not news. SAHAYINI does not include dated news or news-based quiz questions here, because they need verified and dated sources.',
    sections: [
      { heading: 'Use reliable sources', paragraphs: [
        'Prefer official sources such as the Press Information Bureau (PIB), ministry websites and the Gazette of India, along with reputable national newspapers. Note the date and source of every fact you save.' ] },
      { heading: 'Organise your notes', paragraphs: [
        'Keep monthly notes under headings: national, international, economy, science and technology, sports, awards, government schemes and appointments.',
        'For every item note who, what, when and where, and link it to the static topic it relates to (for example, a new scheme and the ministry that runs it).' ] },
      { heading: 'Verify before you memorise', paragraphs: [
        'Confirm important facts, such as office-holders, scheme details or dates, from an official source before you memorise them. Revise your monthly notes every week.' ] },
    ],
    facts: [
      'The Press Information Bureau (PIB) is the Government of India\'s agency for official press releases.',
      'The Economic Survey is presented before the Union Budget.',
      'Always record the date of a news item with the fact.',
      'Check the current exam syllabus to see how much current affairs is covered.',
      'Facts about office-holders and schemes can change; verify them.' ],
    examples: [
      'When a new scheme is announced, note: ministry, objective, who benefits and the official source.',
      'Link a news item to a static topic, for example a new river project to the river\'s geography.' ],
    keyPoints: [
      'Study from official and reliable sources.',
      'Date every note.',
      'Revise weekly and monthly.',
      'Do not rely on a single unverified message or post.' ],
    recap: 'Build a habit: read reliable sources, keep dated notes, verify important facts and revise often. This app does not supply dated news questions.',
  },
];

// Which lesson topics support which exam. Topic selection follows the broad
// syllabus areas already listed on each exam card; confirm exact syllabi in
// the official notification.
export const examTopics: Record<string, TopicId[]> = {
  'upsc-cse': ['polity', 'history', 'geography', 'economy', 'science', 'quant', 'reasoning', 'english', 'current'],
  'ssc-cgl': ['quant', 'reasoning', 'english', 'polity', 'history', 'geography', 'economy', 'science', 'current'],
  'ssc-chsl': ['english', 'reasoning', 'quant', 'polity', 'history', 'geography', 'science', 'current'],
  'ssc-mts': ['quant', 'reasoning', 'english', 'polity', 'history', 'geography', 'science', 'current'],
  ibps: ['reasoning', 'quant', 'english', 'banking', 'economy', 'current'],
  sbi: ['reasoning', 'quant', 'english', 'banking', 'economy', 'current'],
  rrb: ['quant', 'reasoning', 'science', 'history', 'geography', 'polity', 'current'],
  nda: ['quant', 'english', 'science', 'history', 'geography', 'polity', 'current'],
  cds: ['english', 'history', 'geography', 'polity', 'economy', 'quant', 'science', 'current'],
  afcat: ['english', 'reasoning', 'quant', 'geography', 'science', 'history', 'current'],
  ctet: ['pedagogy', 'english', 'quant', 'science', 'current'],
  'tnpsc-group1': ['polity', 'history', 'geography', 'economy', 'science', 'tn', 'quant', 'reasoning', 'current'],
  'tnpsc-group2': ['polity', 'history', 'geography', 'economy', 'science', 'tn', 'quant', 'reasoning', 'english', 'current'],
  'tnpsc-group4': ['polity', 'history', 'geography', 'science', 'tn', 'quant', 'reasoning', 'current'],
  tntet: ['pedagogy', 'english', 'quant', 'science', 'tn', 'current'],
};

export const lessonById = (id: string): ExamLesson | undefined => examLessons.find((l) => l.id === id);

export const topicsForExam = (examId?: string | null): TopicId[] =>
  examId && examTopics[examId] ? examTopics[examId] : examLessons.map((l) => l.id);

export const lessonTitle = (lesson: ExamLesson, language: string): string =>
  (lesson.titles as Record<string, string>)[language] || lesson.titles.en;
