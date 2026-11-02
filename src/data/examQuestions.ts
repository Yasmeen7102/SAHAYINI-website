import type { TopicId } from './examLessons';
import { examTopics } from './examLessons';

// Practice questions written for learning from stable, standard study
// material. They are NOT past exam papers and are not official. There are
// intentionally no dated current-affairs questions: those need verified,
// dated sources. Each question has four options, a zero-based answer index
// and an explanation.

export interface ExamQuestion {
  id: string;
  topic: TopicId;
  q: string;
  options: [string, string, string, string];
  answer: 0 | 1 | 2 | 3;
  explanation: string;
}

type Raw = [string, [string, string, string, string], 0 | 1 | 2 | 3, string];

const build = (topic: TopicId, rows: Raw[]): ExamQuestion[] =>
  rows.map(([q, options, answer, explanation], i) => ({ id: `${topic}-${i + 1}`, topic, q, options, answer, explanation }));

export const examQuestions: ExamQuestion[] = [
  ...build('polity', [
    ['Who is the constitutional head of the Indian Union?', ['Prime Minister', 'President', 'Chief Justice of India', 'Speaker of the Lok Sabha'], 1, 'The executive power of the Union is vested in the President, who is the constitutional head. The Prime Minister heads the Council of Ministers.'],
    ['The Fundamental Rights are contained in which Part of the Constitution?', ['Part I', 'Part III', 'Part IV', 'Part V'], 1, 'Part III (Articles 12 to 35) contains the Fundamental Rights. Part IV contains the Directive Principles.'],
    ['What is the minimum age to be elected to the Lok Sabha?', ['21 years', '25 years', '30 years', '35 years'], 1, 'A person must be at least 25 years old to contest the Lok Sabha. The minimum for the Rajya Sabha is 30 years.'],
    ['Article 21 of the Constitution protects which of the following?', ['Freedom of religion', 'Right to property', 'Life and personal liberty', 'Right to vote'], 2, 'Article 21 guarantees protection of life and personal liberty.'],
    ['Who is the ex-officio Chairman of the Rajya Sabha?', ['President', 'Prime Minister', 'Vice-President', 'Speaker'], 2, 'The Vice-President of India is the ex-officio Chairman of the Rajya Sabha.'],
    ['Fundamental Duties were added to the Constitution by which Amendment?', ['24th Amendment', '42nd Amendment', '44th Amendment', '73rd Amendment'], 1, 'The 42nd Amendment (1976) added Part IVA with the Fundamental Duties (Article 51A).'],
  ]),
  ...build('history', [
    ['Where did the Revolt of 1857 begin?', ['Delhi', 'Kanpur', 'Meerut', 'Lucknow'], 2, 'The Revolt began at Meerut on 10 May 1857 and then spread to other regions.'],
    ['The Dandi March was led by Mahatma Gandhi in which year?', ['1920', '1930', '1942', '1947'], 1, 'The Dandi March of 1930 marked the start of the Civil Disobedience Movement.'],
    ['The Battle of Plassey was fought in which year?', ['1664', '1757', '1764', '1857'], 1, 'The Battle of Plassey took place in 1757 and was an important step in the rise of British power in India.'],
    ['Who founded the Maurya Empire?', ['Ashoka', 'Bindusara', 'Chandragupta Maurya', 'Samudragupta'], 2, 'Chandragupta Maurya founded the Maurya Empire around 321 BCE.'],
    ['In which year was the Quit India Movement launched?', ['1930', '1935', '1942', '1946'], 2, 'The Quit India Movement was launched in 1942.'],
    ['The Indian National Congress was founded in which year?', ['1857', '1885', '1905', '1919'], 1, 'The Indian National Congress was founded in 1885.'],
  ]),
  ...build('geography', [
    ['Which is the longest river of peninsular India?', ['Kaveri', 'Krishna', 'Godavari', 'Narmada'], 2, 'The Godavari is the longest river of peninsular India.'],
    ['The Tropic of Cancer passes through how many Indian states?', ['6', '7', '8', '9'], 2, 'It passes through eight states: Gujarat, Rajasthan, Madhya Pradesh, Chhattisgarh, Jharkhand, West Bengal, Tripura and Mizoram.'],
    ['Which is the largest Indian state by area?', ['Madhya Pradesh', 'Maharashtra', 'Uttar Pradesh', 'Rajasthan'], 3, 'Rajasthan is the largest state by area.'],
    ['Chilika Lake, the largest coastal lagoon in India, is in which state?', ['Andhra Pradesh', 'Odisha', 'Tamil Nadu', 'West Bengal'], 1, 'Chilika Lake is on the coast of Odisha.'],
    ['Which soil is most suitable for growing cotton?', ['Alluvial soil', 'Laterite soil', 'Black soil', 'Desert soil'], 2, 'Black (regur) soil retains moisture and is well suited to cotton.'],
    ['The Standard Meridian of India passes near which city?', ['Chennai', 'Mirzapur', 'Nagpur', 'Kolkata'], 1, 'The Indian Standard Time meridian, 82 degrees 30 minutes East, passes near Mirzapur in Uttar Pradesh.'],
  ]),
  ...build('economy', [
    ['The Reserve Bank of India was established in which year?', ['1921', '1935', '1947', '1969'], 1, 'The RBI was established in 1935.'],
    ['What does GDP stand for?', ['Gross Domestic Product', 'General Domestic Price', 'Gross Development Plan', 'Government Debt Position'], 0, 'GDP is Gross Domestic Product, the value of goods and services produced within a country.'],
    ['Which authority issues one-rupee notes in India?', ['Reserve Bank of India', 'Government of India (Ministry of Finance)', 'State Bank of India', 'NITI Aayog'], 1, 'One-rupee notes are issued by the Government of India. The RBI issues notes of other denominations.'],
    ['The financial year in India runs from:', ['1 January to 31 December', '1 April to 31 March', '1 July to 30 June', '1 October to 30 September'], 1, 'India\'s financial year is from 1 April to 31 March.'],
    ['The repo rate is the rate at which:', ['Banks lend to the public', 'The RBI lends short-term money to banks', 'The government borrows from abroad', 'Banks pay interest on savings'], 1, 'The repo rate is the rate at which the RBI lends short-term funds to commercial banks.'],
    ['GST came into effect in India on:', ['1 April 2016', '1 July 2017', '1 April 2018', '1 January 2019'], 1, 'The Goods and Services Tax was introduced on 1 July 2017.'],
  ]),
  ...build('science', [
    ['What is the chemical symbol of sodium?', ['S', 'So', 'Na', 'Sd'], 2, 'The symbol of sodium is Na, from its Latin name natrium.'],
    ['What is the SI unit of force?', ['Joule', 'Newton', 'Watt', 'Pascal'], 1, 'Force is measured in newtons.'],
    ['Deficiency of which vitamin causes scurvy?', ['Vitamin A', 'Vitamin B1', 'Vitamin C', 'Vitamin D'], 2, 'Scurvy is caused by a lack of vitamin C.'],
    ['Which gas is the most abundant in Earth\'s atmosphere?', ['Oxygen', 'Nitrogen', 'Carbon dioxide', 'Argon'], 1, 'Nitrogen makes up about 78 per cent of the atmosphere.'],
    ['Which cell organelle is called the powerhouse of the cell?', ['Nucleus', 'Ribosome', 'Mitochondria', 'Golgi body'], 2, 'Mitochondria release most of the cell\'s energy.'],
    ['What is the approximate speed of light in vacuum?', ['3 \u00d7 10\u2076 m/s', '3 \u00d7 10\u2077 m/s', '3 \u00d7 10\u2078 m/s', '3 \u00d7 10\u2079 m/s'], 2, 'Light travels at about 3 \u00d7 10\u2078 metres per second.'],
  ]),
  ...build('quant', [
    ['What is 20% of 250?', ['25', '40', '50', '60'], 2, '20% of 250 = (20 \u00d7 250) / 100 = 50.'],
    ['Find the simple interest on \u20b95,000 at 8% per year for 2 years.', ['\u20b9400', '\u20b9600', '\u20b9800', '\u20b91,000'], 2, 'SI = (5000 \u00d7 8 \u00d7 2) / 100 = \u20b9800.'],
    ['What is the average of 12, 18, 24, 30 and 36?', ['22', '24', '26', '30'], 1, 'Sum = 120 and there are 5 numbers, so the average is 120 / 5 = 24.'],
    ['A vehicle travels at 60 km/h for 2.5 hours. What distance does it cover?', ['120 km', '140 km', '150 km', '160 km'], 2, 'Distance = speed \u00d7 time = 60 \u00d7 2.5 = 150 km.'],
    ['\u20b9900 is divided in the ratio 2:3:4. What is the largest share?', ['\u20b9200', '\u20b9300', '\u20b9360', '\u20b9400'], 3, 'Total parts = 9, so one part = \u20b9100. The largest share is 4 \u00d7 100 = \u20b9400.'],
    ['An article bought for \u20b9400 is sold for \u20b9460. What is the profit percentage?', ['10%', '12%', '15%', '20%'], 2, 'Profit = 60. Profit % = (60 / 400) \u00d7 100 = 15%.'],
  ]),
  ...build('reasoning', [
    ['Find the next number: 2, 6, 12, 20, 30, ?', ['38', '40', '42', '44'], 2, 'The differences are 4, 6, 8, 10, so the next difference is 12 and the next term is 30 + 12 = 42.'],
    ['Choose the odd one out: Apple, Mango, Potato, Banana.', ['Apple', 'Mango', 'Potato', 'Banana'], 2, 'Apple, mango and banana are fruits; potato is a vegetable.'],
    ['Pointing to a man, a woman says, "He is the son of my mother\'s only son." How is the man related to the woman?', ['Brother', 'Nephew', 'Father', 'Cousin'], 1, 'Her mother\'s only son is her brother, so the man is her brother\'s son, that is, her nephew.'],
    ['A person walks 5 km north, then 5 km east, then 5 km south. Where is he from the starting point?', ['5 km east', '5 km west', '5 km north', 'At the starting point'], 0, 'The north and south movements cancel out, leaving him 5 km east of the start.'],
    ['Find the next letter: A, C, F, J, O, ?', ['S', 'T', 'U', 'V'], 2, 'Positions are 1, 3, 6, 10, 15 with differences 2, 3, 4, 5, so the next difference is 6 and 15 + 6 = 21, which is U.'],
    ['Statements: All pens are books. All books are papers. Conclusion: All pens are papers.', ['True', 'False', 'Cannot be determined', 'Partly true'], 0, 'If every pen is a book and every book is a paper, every pen must be a paper.'],
  ]),
  ...build('english', [
    ['Choose the synonym of "abundant".', ['Scarce', 'Plentiful', 'Tiny', 'Costly'], 1, '"Abundant" means existing in large quantities, so "plentiful" is the synonym.'],
    ['Choose the antonym of "ancient".', ['Old', 'Historic', 'Modern', 'Classic'], 2, 'The opposite of "ancient" is "modern".'],
    ['Fill in the blank: Neither of the two answers ___ correct.', ['are', 'is', 'were', 'be'], 1, '"Neither" takes a singular verb, so "is" is correct.'],
    ['One word for "a person who knows many languages":', ['Linguist', 'Polyglot', 'Orator', 'Scholar'], 1, 'A person who speaks many languages is called a polyglot.'],
    ['What does the idiom "a piece of cake" mean?', ['A small gift', 'Something very easy', 'A sweet dish', 'A difficult task'], 1, 'The idiom means something that is very easy to do.'],
    ['Choose the correctly spelt word.', ['Acommodation', 'Accomodation', 'Accommodation', 'Acommodetion'], 2, 'The correct spelling is "accommodation", with a double c and a double m.'],
  ]),
  ...build('banking', [
    ['What is the full form of NEFT?', ['National Electronic Funds Transfer', 'National Easy Fund Transaction', 'Net Electronic Funds Transfer', 'National Exchange of Funds Technology'], 0, 'NEFT stands for National Electronic Funds Transfer.'],
    ['What does KYC stand for?', ['Keep Your Cash', 'Know Your Customer', 'Key Yearly Credit', 'Know Your Currency'], 1, 'KYC means Know Your Customer, the process of verifying a customer\'s identity.'],
    ['Which institution regulates banks in India?', ['SEBI', 'IRDAI', 'Reserve Bank of India', 'NITI Aayog'], 2, 'The RBI is the central bank and regulates banks.'],
    ['UPI is developed by which organisation?', ['RBI', 'NPCI', 'SEBI', 'SBI'], 1, 'The Unified Payments Interface was developed by the National Payments Corporation of India (NPCI).'],
    ['What does CRR mean?', ['Credit Rating Report', 'Cash Reserve Ratio', 'Central Revenue Rate', 'Customer Relation Record'], 1, 'The Cash Reserve Ratio is the share of deposits that banks must keep with the RBI in cash.'],
    ['How many characters does an IFSC code have?', ['9', '10', '11', '12'], 2, 'An IFSC code has 11 characters.'],
  ]),
  ...build('pedagogy', [
    ['Who proposed the theory of cognitive development in four stages?', ['Lev Vygotsky', 'Jean Piaget', 'B. F. Skinner', 'Howard Gardner'], 1, 'Jean Piaget proposed four stages of cognitive development.'],
    ['Which is the first stage in Piaget\'s theory?', ['Preoperational', 'Concrete operational', 'Sensorimotor', 'Formal operational'], 2, 'The sensorimotor stage is the first stage.'],
    ['The Right to Education Act, 2009 provides free and compulsory education for children aged:', ['3 to 10', '5 to 12', '6 to 14', '6 to 18'], 2, 'The RTE Act covers children aged 6 to 14.'],
    ['Formative assessment is carried out:', ['Only at the end of the year', 'During the learning process to give feedback', 'Only for entrance exams', 'After the results are published'], 1, 'Formative assessment takes place during learning and helps improve it.'],
    ['The Zone of Proximal Development is associated with:', ['Piaget', 'Vygotsky', 'Kohlberg', 'Pavlov'], 1, 'Lev Vygotsky introduced the Zone of Proximal Development.'],
    ['Inclusive education means:', ['Separate schools for children with disabilities', 'Teaching only high achievers', 'Educating all children together in regular classrooms with support', 'Home schooling for all'], 2, 'Inclusive education brings children of different abilities together in regular classrooms with the support they need.'],
  ]),
  ...build('tn', [
    ['The Tamil Nadu government emblem shows the gopuram of which temple?', ['Meenakshi Amman Temple, Madurai', 'Brihadisvara Temple, Thanjavur', 'Srivilliputhur Andal Temple', 'Ramanathaswamy Temple, Rameswaram'], 2, 'The state emblem shows the gopuram of the Srivilliputhur Andal temple.'],
    ['Madras State was renamed Tamil Nadu in which year?', ['1956', '1965', '1969', '1976'], 2, 'The state was renamed Tamil Nadu in 1969.'],
    ['Which animal is the state animal of Tamil Nadu?', ['Asian elephant', 'Nilgiri tahr', 'Bengal tiger', 'Indian bison'], 1, 'The Nilgiri tahr is the state animal.'],
    ['Which is the highest peak in Tamil Nadu?', ['Anamudi', 'Doddabetta', 'Mahendragiri', 'Kolli Hills peak'], 1, 'Doddabetta in the Nilgiris is the highest peak in the state.'],
    ['How many couplets are there in the Thirukkural?', ['1,000', '1,330', '1,500', '2,000'], 1, 'The Thirukkural has 1,330 couplets in 133 chapters.'],
    ['Which Chola king built the Brihadisvara Temple at Thanjavur?', ['Rajendra I', 'Rajaraja I', 'Kulothunga I', 'Aditya I'], 1, 'Rajaraja I built the Brihadisvara Temple, which was completed around 1010 CE.'],
  ]),
];

export const questionsForTopic = (topic: TopicId): ExamQuestion[] => examQuestions.filter((q) => q.topic === topic);
export const questionById = (id: string): ExamQuestion | undefined => examQuestions.find((q) => q.id === id);
export const topicsWithQuestions = (): TopicId[] => [...new Set(examQuestions.map((q) => q.topic))];

// Mixed test for an exam: questions are taken round-robin from each topic of
// that exam so no topic dominates and no question is repeated.
export function mixedQuestionsForExam(examId: string | null, perTopic = 2): ExamQuestion[] {
  const topics = (examId && examTopics[examId] ? examTopics[examId] : topicsWithQuestions()).filter(
    (t) => questionsForTopic(t).length > 0,
  );
  const out: ExamQuestion[] = [];
  for (let round = 0; round < perTopic; round++) {
    for (const t of topics) {
      const q = questionsForTopic(t)[round];
      if (q) out.push(q);
    }
  }
  return out;
}
