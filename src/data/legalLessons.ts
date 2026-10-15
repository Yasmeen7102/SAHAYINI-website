import { LessonItem } from '../types';
import type { TopicItem } from './lessonsData';

/**
 * Additional lessons: women's safety & harassment, scholarships, banking, and Indian acts,
 * punishments and fines. Written in English; they are shown to users of every language
 * (read aloud with an English voice via `contentLanguage`).
 *
 * Legal references use the Bharatiya Nyaya Sanhita (BNS) 2023, in force from 1 July 2024,
 * with the old IPC section in brackets. This is general information, not legal advice, and
 * laws and fines change; every lesson says so.
 */
const DISCLAIMER =
  'This is general information, not legal advice. Laws and fines change, so confirm at an official source or ask free legal aid (NALSA helpline 15100).';

export const EXTRA_TOPICS: TopicItem[] = [
  {
    id: 'women-safety',
    title: "Women's Safety & Harassment",
    icon: 'Heart',
    bgColor: 'bg-rose-50',
    borderColor: 'border-rose-200',
    textColor: 'text-rose-800',
    description: 'Harassment laws, how to report, workplace and domestic protection, and online safety.',
  },
  {
    id: 'scholarships',
    title: 'Scholarships & Education',
    icon: 'GraduationCap',
    bgColor: 'bg-sky-50',
    borderColor: 'border-sky-200',
    textColor: 'text-sky-800',
    description: 'Apply for scholarships safely, keep documents ready, and avoid scholarship scams.',
  },
  {
    id: 'banking',
    title: 'Bank Details & Money Safety',
    icon: 'Banknote',
    bgColor: 'bg-teal-50',
    borderColor: 'border-teal-200',
    textColor: 'text-teal-800',
    description: 'Which bank details are safe to share, and your rights if you lose money to fraud.',
  },
  {
    id: 'laws',
    title: 'Indian Acts, Punishments & Fines',
    icon: 'Scale',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200',
    textColor: 'text-orange-800',
    description: 'Key laws, punishments and fines, social offences, and the laws that protect you.',
  },
];

type Section = LessonItem['content']['sections'][number];

function lesson(
  id: string,
  topicId: string,
  number: number,
  title: string,
  description: string,
  readTime: string,
  introduction: string,
  sections: Section[],
  summary: string[],
  audioScript: string
): LessonItem {
  return {
    id,
    topicId,
    number,
    title: `${number}. ${title}`,
    description,
    readTime,
    audioDuration: '3 min listen',
    contentLanguage: 'en',
    content: { introduction, sections, summary: [...summary, DISCLAIMER] },
    audioScript,
  };
}

export const EXTRA_LESSONS: LessonItem[] = [
  // ------------------------------------------------------------------ WOMEN'S SAFETY
  lesson(
    'lesson-women-1',
    'women-safety',
    5,
    'Harassment of Women: What the Law Says',
    'Know which acts are crimes, and the punishments in the Bharatiya Nyaya Sanhita.',
    '5 min read',
    'Harassment is never your fault. Indian law names many behaviours as crimes. Since 1 July 2024 the Bharatiya Nyaya Sanhita (BNS) has replaced the Indian Penal Code (IPC). Old IPC section numbers are shown in brackets because many people still use them.',
    [
      {
        heading: '1. Unwelcome touching, remarks and insults',
        body: 'Sexual harassment (BNS Sec 75, old IPC 354A) covers unwelcome physical contact, demands for sexual favours, showing pornography against your wishes, and sexual remarks. The first three can bring up to 3 years in prison, a fine, or both; sexual remarks can bring up to 1 year, a fine, or both. Assault or force meant to outrage a woman\'s modesty (BNS 74, IPC 354) carries 1 to 5 years and a fine. Words, gestures or acts insulting a woman\'s modesty (BNS 79, IPC 509) carry up to 3 years and a fine.',
        tips: ['Note the date, time, place and any witnesses as soon as you can.', 'Keep screenshots, voice notes and messages. Do not delete them.'],
      },
      {
        heading: '2. Stalking, voyeurism and disrobing',
        body: 'Stalking (BNS 78, IPC 354D) means following a woman, contacting her repeatedly despite clear disinterest, or monitoring her online use. The first conviction can bring up to 3 years and a fine; a repeat conviction up to 5 years and a fine. Voyeurism (BNS 77, IPC 354C), watching or capturing a private act without consent, carries 1 to 3 years on first conviction and 3 to 7 years on repeat. Assault with intent to disrobe (BNS 76, IPC 354B) carries 3 to 7 years and a fine.',
      },
      {
        heading: '3. Cruelty, false promises and serious offences',
        body: 'Cruelty to a married woman by her husband or his relatives (BNS 85, IPC 498A) carries up to 3 years and a fine. Having sexual relations through deceit, such as a false promise of marriage (BNS 69), carries up to 10 years and a fine. Rape (BNS 63, punished under BNS 64) carries a minimum of 10 years, which can extend to life imprisonment, and a fine.',
        warning: 'Punishment depends on the court\'s findings in each case. The figures above are the legal ranges, not a guarantee of outcome.',
      },
    ],
    [
      'Unwelcome touching, remarks, stalking and watching without consent are all crimes.',
      'Old IPC numbers: 354 (now BNS 74), 354A (75), 354B (76), 354C (77), 354D (78), 509 (79), 498A (85).',
      'Save evidence safely and report; it is never your fault.',
    ],
    'Lesson 5: Harassment of women and what the law says. Harassment is never your fault. Since July 2024 the Bharatiya Nyaya Sanhita has replaced the Indian Penal Code. Sexual harassment, which includes unwelcome touching, demands for sexual favours, showing pornography and sexual remarks, is a crime under Section 75, with up to three years for the first three and up to one year for remarks. Outraging a woman\'s modesty carries one to five years. Stalking carries up to three years on first conviction and up to five years on a repeat. Voyeurism carries one to three years and then three to seven years. Cruelty by a husband or his relatives carries up to three years. Keep screenshots and notes as evidence, and report. This is general information, not legal advice.'
  ),
  lesson(
    'lesson-women-2',
    'women-safety',
    6,
    'How to Report: FIR, Zero FIR and Helplines',
    'Step by step: where to complain, your rights at the police station, and who to call.',
    '5 min read',
    'Knowing the steps makes reporting less frightening. You do not need a lawyer to make a complaint, and you have specific rights when you do.',
    [
      {
        heading: '1. Call for help first',
        body: 'In danger, dial 112 (police, fire, ambulance). Other helplines: 1091 Women in Distress, 181 Women Helpline, 1098 Childline, 1930 cyber financial fraud, 14416 Tele-MANAS for mental health support. You can also report online at cybercrime.gov.in for cyber offences, and to the National Commission for Women through ncw.gov.in.',
        tips: ['Save 112, 1091 and 181 as favourites on your phone.', 'Tell a trusted person where you are going and when you will be back.'],
      },
      {
        heading: '2. Filing an FIR',
        body: 'For a serious (cognizable) offence the police must register a First Information Report (FIR). Under the new Bharatiya Nagarik Suraksha Sanhita (BNSS, Sec 173) you can also file electronically, then sign it within three days. Information about certain offences against women is recorded by a woman police officer. You are entitled to a free copy of the FIR. If the police refuse, send your complaint in writing to the Superintendent of Police, or approach a Magistrate.',
        tips: ['Zero FIR: you can lodge an FIR at any police station, even if the crime happened elsewhere; it is then transferred.'],
      },
      {
        heading: '3. Your rights as a woman',
        body: 'Generally, a woman should not be arrested between sunset and sunrise except in exceptional cases with a Magistrate\'s permission, and a woman should be arrested by a woman officer. Women cannot ordinarily be summoned to the police station for questioning; the police should question you at your home. Your identity in sexual offence cases is protected by law.',
        warning: 'If anyone asks for money to register your complaint, refuse and report it to a senior police officer.',
      },
    ],
    [
      'Dial 112 in danger; 1091 and 181 are women\'s helplines.',
      'You can file a Zero FIR at any police station and get a free copy of your FIR.',
      'If police refuse, write to the Superintendent of Police or approach a Magistrate.',
    ],
    'Lesson 6: How to report. In danger, dial 112. Women in Distress is 1091, Women Helpline is 181, and cyber fraud is 1930. For a serious offence the police must register an FIR. You can file a Zero FIR at any police station, even if the crime happened elsewhere. Information about offences against women is recorded by a woman officer, and you are entitled to a free copy of your FIR. If the police refuse, send a written complaint to the Superintendent of Police or approach a Magistrate. Never pay anyone to register your complaint. This is general information, not legal advice.'
  ),
  lesson(
    'lesson-women-3',
    'women-safety',
    7,
    'Workplace Harassment: The POSH Act 2013',
    'Internal Committees, time limits for complaints, and what employers must do.',
    '4 min read',
    'The Sexual Harassment of Women at Workplace (Prevention, Prohibition and Redressal) Act, 2013, known as the POSH Act, protects women in offices, factories, schools, hospitals, and also domestic workers and women in the unorganised sector.',
    [
      {
        heading: '1. Who handles your complaint',
        body: 'Every workplace with 10 or more employees must set up an Internal Committee (IC) headed by a senior woman. Where there is no IC, such as small establishments or for domestic workers, the district Local Committee handles complaints. You can also file on the Government\'s SHe-Box portal.',
        tips: ['Ask your HR or manager who the IC members are.'],
      },
      {
        heading: '2. How to complain, and how long you have',
        body: 'Make a written complaint within 3 months of the incident (or the last incident in a series). The committee can extend this by another 3 months for good reasons. If you are unable to write, the committee must help. The inquiry should be completed within 90 days. The IC can recommend steps such as conciliation if you ask, but cannot force a settlement for money.',
      },
      {
        heading: '3. What employers must do',
        body: 'Employers must display the penalties for harassment, run awareness programmes, and give a safe workplace. Failing to set up an IC can attract a fine of up to ₹50,000, and repeat violations can be penalised more heavily. Retaliation against someone who complains is not allowed.',
        warning: 'The POSH Act is separate from criminal law. You can also file a police complaint under BNS Sec 75.',
      },
    ],
    [
      'Workplaces with 10 or more employees must have an Internal Committee.',
      'Complain in writing within 3 months; the inquiry should finish within 90 days.',
      'Employer failure to follow the Act can bring fines up to ₹50,000.',
    ],
    'Lesson 7: Workplace harassment and the POSH Act of 2013. Every workplace with ten or more employees must have an Internal Committee. If there is none, the district Local Committee handles your complaint. Complain in writing within three months of the incident, which can be extended by three more months. The inquiry should be completed within ninety days. Employers who do not set up the committee can be fined up to fifty thousand rupees. You can also file a police complaint. This is general information, not legal advice.'
  ),
  lesson(
    'lesson-women-4',
    'women-safety',
    8,
    'Domestic Violence and Dowry Laws',
    'Protection orders, the right to stay in your home, and punishments for dowry.',
    '5 min read',
    'Violence at home is a crime and not a private matter. Two key laws protect women: the Protection of Women from Domestic Violence Act, 2005 and the Dowry Prohibition Act, 1961.',
    [
      {
        heading: '1. The Domestic Violence Act, 2005',
        body: 'It covers physical, emotional, sexual, verbal and economic abuse by a husband, partner (including live-in) or relatives. A Magistrate can give a protection order, a residence order (you cannot be thrown out of the shared home), and orders for monthly support and compensation. Breaking a protection order can bring up to 1 year in prison, a fine up to ₹20,000, or both. Call 181 or approach a Protection Officer, the police, or a Magistrate.',
        tips: ['Keep copies of medical reports, photos and messages in a safe place.', 'Keep copies of ID, marriage and property papers where you can reach them.'],
      },
      {
        heading: '2. Cruelty and dowry death',
        body: 'Cruelty by a husband or his relatives (BNS 85, IPC 498A) carries up to 3 years and a fine. A death of a woman within seven years of marriage in suspicious circumstances linked to dowry harassment is dowry death (BNS 80, IPC 304B), punished with a minimum of 7 years, up to life imprisonment.',
      },
      {
        heading: '3. The Dowry Prohibition Act',
        body: 'Giving, taking or helping to give or take dowry carries a minimum of 5 years in prison and a fine of at least ₹15,000 or the value of the dowry, whichever is more. Demanding dowry carries 6 months to 2 years and a fine up to ₹10,000.',
        warning: 'If you are in immediate danger, leave safely and call 112. Short-stay homes (Sakhi One Stop Centres) can provide shelter, counselling and legal help.',
      },
    ],
    [
      'The Domestic Violence Act gives protection, a right to stay in the shared home, and support.',
      'Dowry giving or taking: minimum 5 years and ₹15,000 (or dowry value).',
      'Call 181 or 112; One Stop Centres offer shelter and legal help.',
    ],
    'Lesson 8: Domestic violence and dowry laws. The Domestic Violence Act of 2005 protects women from physical, emotional, sexual, verbal and economic abuse by a husband, partner or relatives. A Magistrate can give a protection order and a residence order so you cannot be thrown out of your home. Cruelty by a husband or his family carries up to three years. Giving or taking dowry carries at least five years in prison and a fine of at least fifteen thousand rupees, or the value of the dowry. Call one eight one for support, or one one two in danger. This is general information, not legal advice.'
  ),
  lesson(
    'lesson-women-5',
    'women-safety',
    9,
    'Online Harassment, Stalking and Cyber Safety',
    'Protect yourself from morphed photos, threats and online stalking, and report them.',
    '4 min read',
    'Online abuse is a real crime with real punishments. You do not have to put up with it.',
    [
      {
        heading: '1. What counts as online harassment',
        body: 'Repeated messages after you say stop, tracking your online activity, threats, sharing or threatening to share private photos, morphed images, and fake profiles all count. Online stalking falls under BNS 78 (up to 3 years on first conviction). Violating privacy by capturing or sharing private images (IT Act Sec 66E) carries up to 3 years, a fine up to ₹2 lakh, or both. Publishing obscene material electronically (Sec 67) carries up to 3 years and a fine up to ₹5 lakh on first conviction, and sexually explicit material (Sec 67A) up to 5 years and a fine up to ₹10 lakh.',
        warning: 'Never pay or send more photos to someone blackmailing you. This often makes things worse.',
      },
      {
        heading: '2. Protect your accounts',
        body: 'Use a different strong password for each account, turn on two-step verification, make social profiles private, and review who can see your photos. Do not accept requests from strangers. Turn off location tagging on photos.',
        tips: ['Never share your OTP with anyone, even someone claiming to be from a bank or police.'],
      },
      {
        heading: '3. How to report',
        body: 'Take screenshots showing the profile name, links, date and time. Report and block the account on the platform. Then file a complaint at cybercrime.gov.in, which has a special option for crimes against women and children where you can report anonymously, or call 1930 for financial fraud. You can also visit your nearest police station or cyber crime cell.',
      },
    ],
    [
      'Online stalking, threats and sharing private images are punishable crimes.',
      'Never pay a blackmailer; keep evidence and report.',
      'Report at cybercrime.gov.in (anonymous option available) or call 1930 for money fraud.',
    ],
    'Lesson 9: Online harassment and cyber safety. Repeated unwanted messages, threats, fake profiles and sharing private photos are crimes. Online stalking can bring up to three years on first conviction. Capturing or sharing private images can bring up to three years or a fine up to two lakh rupees. Never pay or send more photos to a blackmailer. Take screenshots with the profile name, links and time, block the account, and report at cybercrime dot gov dot in. For money fraud, call one nine three zero. This is general information, not legal advice.'
  ),

  // ------------------------------------------------------------------ SCHOLARSHIPS
  lesson(
    'lesson-scholar-1',
    'scholarships',
    10,
    'Scholarships: How to Apply Safely',
    'Use the National Scholarship Portal and state schemes without falling for scams.',
    '4 min read',
    'Many scholarships exist for school and college students, with special schemes for girls, SC/ST, minority and low-income students. Applying is free on official portals.',
    [
      {
        heading: '1. Where to apply',
        body: 'The National Scholarship Portal (scholarships.gov.in) hosts central and many state scholarships. You register once, fill one application, and your school or college verifies it. States such as Tamil Nadu also run their own schemes, for example the Pudhumai Penn scheme that supports girls from government schools who go on to higher education. Ask your college scholarship office which schemes you qualify for.',
        tips: ['Check every scheme\'s last date on the official portal. Deadlines change each year.'],
      },
      {
        heading: '2. Steps to apply',
        body: 'Register on the portal, check eligibility (course, marks, family income, category), upload documents, and submit before the last date. Your institution then verifies the application, and approved money is paid directly into your bank account (Direct Benefit Transfer). Keep your application ID and track the status online.',
      },
      {
        heading: '3. Avoid scholarship scams',
        body: 'Official scholarships never ask for a fee to apply or to "release" money. Genuine government websites end in .gov.in or .nic.in. Do not share your OTP, bank PIN or Aadhaar OTP with an agent. Do not trust WhatsApp or SMS links promising scholarship money.',
        warning: 'If someone asks you to pay "processing charges" for a scholarship, it is a scam. Report it on cybercrime.gov.in or call 1930.',
      },
    ],
    [
      'Apply only on official portals such as scholarships.gov.in; applying is free.',
      'Check eligibility and the last date every year.',
      'No genuine scholarship asks for a fee, OTP or PIN.',
    ],
    'Lesson 10: Scholarships. Apply on the official National Scholarship Portal at scholarships dot gov dot in, or on your state scheme. Applying is free. Register, check eligibility, upload documents, submit before the last date, and track your status. Approved money is paid straight into your bank account. No genuine scholarship asks for a fee, an O T P or your bank PIN. Official websites end in dot gov dot in or dot n i c dot in. If someone asks for processing charges, it is a scam. This is general information, not legal advice.'
  ),
  lesson(
    'lesson-scholar-2',
    'scholarships',
    11,
    'Scholarship Documents and Your Bank Account',
    'Which documents to keep ready, and how to link your bank account so money reaches you.',
    '3 min read',
    'Most scholarship rejections happen because of missing documents or a bank account that is not set up correctly. A little preparation avoids this.',
    [
      {
        heading: '1. Documents to keep ready',
        body: 'Commonly needed: Aadhaar, previous year mark sheet, income certificate, community certificate (where applicable), bank passbook first page, admission or fee receipt, a recent passport-size photo, and a bonafide certificate from your institution. In Tamil Nadu certificates are applied for through the e-District portal or your local e-Sevai centre.',
        tips: ['Scan each document in a clear, readable file and keep a folder on your phone.', 'Check the required file size and format on the portal.'],
      },
      {
        heading: '2. Your bank account for scholarship money',
        body: 'Scholarship money is paid by Direct Benefit Transfer (DBT) into your own account. The account should be in the student\'s name, active, and linked with Aadhaar as the portal requires. Make sure the name, account number and IFSC match exactly what you enter in the form. A joint or inactive account can cause the payment to fail.',
      },
      {
        heading: '3. If your payment is delayed',
        body: 'Check your application status on the portal first. Then ask your institution\'s scholarship office whether it has verified your application. If the status shows "bank details mismatch", correct your account details with the bank branch and the portal. Escalate to the portal\'s helpdesk only through the official contact page.',
        warning: 'Never give your net-banking password or UPI PIN to anyone who says they will "speed up" your scholarship.',
      },
    ],
    [
      'Prepare Aadhaar, marks, income and community certificates, bank passbook and bonafide.',
      'Use an active account in the student\'s name; details must match exactly.',
      'Check status and verification first when payment is delayed.',
    ],
    'Lesson 11: Scholarship documents and your bank account. Keep ready your Aadhaar, last mark sheet, income certificate, community certificate if needed, bank passbook page, and bonafide certificate. Scholarship money comes by direct benefit transfer into your own active bank account. Make sure the name, account number and I F S C code match exactly. If money is delayed, check your status on the portal and ask your college scholarship office. Never share your net banking password or U P I PIN with anyone. This is general information, not legal advice.'
  ),

  // ------------------------------------------------------------------ BANKING
  lesson(
    'lesson-bank-1',
    'banking',
    12,
    'Bank Details: What Is Safe to Share and What Is Not',
    'Account number and IFSC are fine to receive money; PIN, OTP and CVV never.',
    '4 min read',
    'Many frauds start with a stranger asking for "bank details". Knowing which details are safe protects your savings.',
    [
      {
        heading: '1. Details you can share to receive money',
        body: 'Your name, account number, IFSC code (an 11-character branch code), and UPI ID are needed by someone who wants to send you money. They cannot be used to take money out without your PIN, OTP or password. Even so, share them only with people and organisations you know, such as your employer or a college.',
      },
      {
        heading: '2. Details you must NEVER share',
        body: 'Your UPI PIN, ATM PIN, card CVV and expiry, OTP, net-banking and mobile-banking passwords, and full card number with PIN. Your UPI PIN is needed only to SEND money, never to receive it. If someone says "enter your PIN to receive money", it is a fraud. Banks, RBI, police and government offices never ask for these details by call, SMS or WhatsApp.',
        warning: 'Do not install apps (such as screen-sharing apps) at a caller\'s request, and do not share a screenshot of your banking app.',
      },
      {
        heading: '3. Safe banking habits',
        body: 'Check the beneficiary name before confirming a payment. Use only your bank\'s official app or website, and type the address yourself. Enable SMS and email alerts. Keep your mobile number updated with the bank. Add a nominee to your account. Check your statement monthly. Keep your Aadhaar and PAN details private; share only when needed.',
        tips: ['Zero-balance Jan Dhan accounts are available at any bank for people without an account.'],
      },
    ],
    [
      'Account number and IFSC are OK to receive money; PIN, OTP, CVV and passwords never.',
      'The UPI PIN is only for sending money, never for receiving.',
      'Banks never ask for PIN or OTP by call, SMS or WhatsApp.',
    ],
    'Lesson 12: Which bank details are safe to share. To receive money, someone only needs your name, account number, I F S C code or U P I I D. These cannot take money out without your PIN or O T P. Never share your U P I PIN, A T M PIN, card C V V, O T P, or banking passwords. Your U P I PIN is only for sending money, never for receiving it. Banks, police and government offices never ask for these over a call, SMS or WhatsApp. Check the receiver\'s name before you pay. This is general information, not legal advice.'
  ),
  lesson(
    'lesson-bank-2',
    'banking',
    13,
    'Bank Fraud: Your Rights and What to Do',
    'Report quickly, know your zero-liability rights, and file complaints with the right authority.',
    '5 min read',
    'If money leaves your account because of fraud, speed matters. Acting within the first hour gives the best chance of stopping the transfer.',
    [
      {
        heading: '1. Immediate steps',
        body: '1) Call 1930 (cyber fraud helpline) immediately and report on cybercrime.gov.in; this can help freeze the money. 2) Call your bank and block the card, UPI and net-banking. 3) Change passwords. 4) Take screenshots of messages, transaction IDs and numbers. 5) File a police complaint or an FIR if the amount is large.',
        tips: ['Reporting within the first hour gives the best chance of freezing the money.'],
      },
      {
        heading: '2. Your rights under RBI rules',
        body: 'Under RBI customer-protection rules, your liability is zero if the fraud happened because of the bank\'s negligence, or a third-party breach where you reported to the bank within 3 working days. If you report within 4 to 7 working days, your liability is limited. Reporting later depends on the bank\'s policy. The bank must usually credit the disputed amount (shadow credit) within 10 working days of your complaint. Report in writing and keep the complaint number.',
        warning: 'If you shared your OTP or PIN yourself, the bank may treat it as customer negligence. This is why you should never share them.',
      },
      {
        heading: '3. If the bank does not help',
        body: 'Complain in writing to the bank\'s Nodal or Principal Nodal Officer. If you do not get a satisfactory reply within 30 days, file a complaint under the RBI Integrated Ombudsman Scheme at cms.rbi.org.in. It is free. You can also approach the consumer commission (e-Daakhil) or the police.',
      },
    ],
    [
      'Call 1930 and your bank immediately; the first hour matters.',
      'RBI rules: zero liability if reported within 3 working days in bank or third-party faults.',
      'Escalate to the RBI Ombudsman at cms.rbi.org.in if the bank does not resolve it within 30 days.',
    ],
    'Lesson 13: Bank fraud, your rights and what to do. If money leaves your account, call one nine three zero and your bank immediately and block your cards and U P I. The first hour matters most. Under R B I rules, you have zero liability if the fraud was due to the bank or a third party and you report within three working days. Report in writing and keep the complaint number. If the bank does not solve it in thirty days, complain to the R B I Ombudsman at c m s dot r b i dot org dot in. It is free. This is general information, not legal advice.'
  ),

  // ------------------------------------------------------------------ LAWS
  lesson(
    'lesson-law-1',
    'laws',
    14,
    'New Criminal Laws: BNS, BNSS and BSA',
    'What changed on 1 July 2024 and how old IPC numbers map to the new law.',
    '4 min read',
    'On 1 July 2024 three new laws replaced the colonial-era criminal laws. Knowing the names helps you read news, FIRs and court papers.',
    [
      {
        heading: '1. The three laws',
        body: 'The Bharatiya Nyaya Sanhita, 2023 (BNS) replaces the Indian Penal Code and defines crimes and punishments. The Bharatiya Nagarik Suraksha Sanhita, 2023 (BNSS) replaces the Code of Criminal Procedure and covers FIRs, arrest and trial procedure. The Bharatiya Sakshya Adhiniyam, 2023 (BSA) replaces the Indian Evidence Act and covers evidence, including electronic records.',
      },
      {
        heading: '2. Useful section changes',
        body: 'Cheating: IPC 420 is now BNS 318. Defamation: IPC 499/500 is BNS 356 (up to 2 years simple imprisonment, a fine, or both, and community service can also be ordered). Cruelty to a wife: IPC 498A is BNS 85. Outraging modesty: IPC 354 is BNS 74. Stalking: IPC 354D is BNS 78. Cases registered before 1 July 2024 continue under the old law.',
        tips: ['An FIR may show the BNS section number. You can search it on the India Code website or ask the police to explain.'],
      },
      {
        heading: '3. New features you should know',
        body: 'FIRs can be filed electronically and Zero FIRs are formally recognised. Community service is a punishment for some small offences. Electronic records are recognised as evidence. Certain information for women and children has special protections.',
        warning: 'Sections can be amended. Always verify the current text on the official India Code website.',
      },
    ],
    [
      'BNS replaced the IPC, BNSS replaced the CrPC, and BSA replaced the Evidence Act on 1 July 2024.',
      'Cheating is now BNS 318; defamation BNS 356; cruelty to a wife BNS 85.',
      'Older cases continue under the old law.',
    ],
    'Lesson 14: The new criminal laws. On 1 July 2024, three new laws came into force. The Bharatiya Nyaya Sanhita replaces the Indian Penal Code and defines crimes and punishments. The Bharatiya Nagarik Suraksha Sanhita replaces the Criminal Procedure Code and covers F I Rs and arrests. The Bharatiya Sakshya Adhiniyam replaces the Evidence Act. For example, cheating is now Section 318, and cruelty to a wife is now Section 85. Cases registered before July 2024 continue under the old law. This is general information, not legal advice.'
  ),
  lesson(
    'lesson-law-2',
    'laws',
    15,
    'Social Offences: Caste, Child Marriage and Dowry',
    'Laws against untouchability, caste atrocities and child marriage, with punishments.',
    '5 min read',
    'India\'s Constitution guarantees equality. Several Acts make discrimination and harmful social practices punishable.',
    [
      {
        heading: '1. Untouchability and caste atrocities',
        body: 'Article 17 of the Constitution abolishes untouchability. The Protection of Civil Rights Act, 1955 punishes preaching or practising untouchability, for example denying entry to a shop, temple or water source, with imprisonment of 1 to 6 months and a fine of ₹100 to ₹500. The Scheduled Castes and Scheduled Tribes (Prevention of Atrocities) Act, 1989 punishes serious acts such as public humiliation, forced labour or violence against SC/ST members, with imprisonment from 6 months up to 5 years and a fine for many offences, and heavier punishment for serious ones.',
        tips: ['Complaints can be made at any police station, and special courts handle these cases.'],
      },
      {
        heading: '2. Child marriage',
        body: 'The legal minimum age of marriage is 18 for women and 21 for men. Under the Prohibition of Child Marriage Act, 2006, an adult man marrying a child, and those who perform, arrange or encourage the marriage, can face up to 2 years of rigorous imprisonment, a fine up to ₹1 lakh, or both. Child marriage can be declared void on the petition of the child. Call Childline 1098 to report one.',
      },
      {
        heading: '3. Dowry and harassment',
        body: 'Giving or taking dowry carries at least 5 years and a fine of at least ₹15,000 or the value of the dowry (Dowry Prohibition Act, 1961). Tamil Nadu also has its own Prohibition of Harassment of Women Act, 1998 against eve-teasing in public places. Hate speech and promoting enmity between groups is punishable under BNS 196.',
        warning: 'Do not take the law into your own hands or share rumours. Report to police or the district authorities.',
      },
    ],
    [
      'Untouchability is banned; punishment under the PCR Act and the SC/ST Atrocities Act.',
      'Marriage age: 18 for women and 21 for men; child marriage is punishable up to 2 years or ₹1 lakh.',
      'Report child marriage to Childline 1098, and caste atrocities to the police.',
    ],
    'Lesson 15: Social offences. Untouchability is banned by Article 17 of the Constitution. The Protection of Civil Rights Act gives one to six months in prison and a small fine. The S C S T Atrocities Act gives six months up to five years for many offences, and more for serious ones. The legal marriage age is eighteen for women and twenty one for men. Child marriage can bring up to two years in prison or a fine up to one lakh rupees. Report child marriage to Childline one zero nine eight. This is general information, not legal advice.'
  ),
  lesson(
    'lesson-law-3',
    'laws',
    16,
    'Everyday Fines: Traffic, Cheques and Cyber Offences',
    'Common fines and punishments you should know to stay on the right side of the law.',
    '4 min read',
    'Many people face fines for small things. These are the common national figures; states can revise them, so check your state transport department or court for current amounts.',
    [
      {
        heading: '1. Road rules (Motor Vehicles Act, as amended in 2019)',
        body: 'Driving without a licence: ₹5,000. Riding without a helmet: ₹1,000 and disqualification of the licence for 3 months. Not wearing a seat belt: ₹1,000. Drunk driving: up to ₹10,000 and/or up to 6 months in prison for the first offence. Driving without insurance: ₹2,000 for a first offence. Allowing a minor to drive can lead to punishment of the guardian or vehicle owner.',
        tips: ['Keep your licence, registration and insurance in DigiLocker or mParivahan; digital copies are accepted.'],
      },
      {
        heading: '2. Cheque bounce (Negotiable Instruments Act, Sec 138)',
        body: 'If a cheque bounces for insufficient funds, the person who received it can send a legal notice within 30 days of being told of the bounce. If the drawer does not pay within 15 days of the notice, a case can follow. The punishment is imprisonment up to 2 years, a fine up to twice the cheque amount, or both.',
        warning: 'Never give a signed blank cheque to anyone you do not fully trust.',
      },
      {
        heading: '3. Cyber and money offences',
        body: 'Cheating (BNS 318) carries up to 7 years and a fine. Identity theft (IT Act 66C) and cheating by impersonation online (66D) each carry up to 3 years and a fine up to ₹1 lakh. Lending your bank account to strangers ("mule accounts") can make you part of the crime even if you did not steal the money.',
      },
    ],
    [
      'No licence ₹5,000; no helmet ₹1,000; no seat belt ₹1,000; drunk driving up to ₹10,000 and/or 6 months.',
      'Cheque bounce (Sec 138): up to 2 years or a fine up to twice the cheque amount.',
      'Never lend your bank account to a stranger.',
    ],
    'Lesson 16: Everyday fines. Under the Motor Vehicles Act, driving without a licence is five thousand rupees, no helmet is one thousand rupees with a three month licence suspension, and no seat belt is one thousand rupees. Drunk driving can bring up to ten thousand rupees or six months in prison. If a cheque bounces, the person can be punished with up to two years in prison or a fine up to twice the cheque amount. Never lend your bank account to strangers. States can revise fines, so check your state transport department. This is general information, not legal advice.'
  ),
  lesson(
    'lesson-law-4',
    'laws',
    17,
    'Laws That Protect You: RTI, Consumer Rights and Legal Aid',
    'The good side of the law: use these rights to get information, refunds and free legal help.',
    '5 min read',
    'Besides punishing wrongdoing, Indian law gives ordinary citizens strong rights. Using them is usually free or very cheap.',
    [
      {
        heading: '1. Right to Information (RTI Act, 2005)',
        body: 'Any citizen can ask a government office for information. The application fee for central bodies is ₹10 (people below the poverty line pay nothing). The office must reply within 30 days. If you are not satisfied you can make a first appeal and then approach the Information Commission. You can also apply online through the RTI Online portal for central departments.',
      },
      {
        heading: '2. Consumer rights (Consumer Protection Act, 2019)',
        body: 'If you receive a defective product or a poor service, or are cheated online, you can complain to the consumer commission, including online at e-Daakhil. Call the National Consumer Helpline 1915 for guidance. The Act also covers misleading advertisements and e-commerce.',
      },
      {
        heading: '3. Free legal aid and women\'s property and work rights',
        body: 'Under the Legal Services Authorities Act, 1987, free legal aid is available to women, children, SC/ST members, persons in custody and people below an income limit, through the District Legal Services Authority (helpline 15100). Under the Hindu Succession (Amendment) Act, 2005, daughters have equal rights in ancestral property. The Maternity Benefit Act gives 26 weeks of paid leave for the first two children in eligible establishments. The Right to Education Act, 2009 guarantees free and compulsory education for children aged 6 to 14.',
        tips: ['Keep copies of every application and note the date you applied.'],
      },
    ],
    [
      'RTI: ₹10 fee, reply in 30 days, then first appeal.',
      'Consumer complaints: e-Daakhil online; helpline 1915.',
      'Free legal aid: NALSA 15100; daughters have equal property rights; free education for ages 6 to 14.',
    ],
    'Lesson 17: Laws that protect you. Under the Right to Information Act, you can ask any government office for information for a ten rupee fee, and they must reply within thirty days. Consumers can complain about defective goods or cheating online at e Daakhil, and call the National Consumer Helpline one nine one five. Free legal aid is available for women, children and others through the District Legal Services Authority, helpline one five one zero zero. Daughters have equal rights in ancestral property, and the Right to Education guarantees free schooling from six to fourteen years. This is general information, not legal advice.'
  ),
];
