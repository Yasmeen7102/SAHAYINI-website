import React, { useEffect, useRef, useState } from 'react';
import { Mic, MicOff, ShieldAlert, Timer, XCircle, Play, Square, Share2, Download, MapPin, PhoneCall, CheckCircle2, AlertTriangle } from 'lucide-react';

type Contact = { id: string; name: string; phone: string };
type Props = { contacts: Contact[]; language: string; coords: { lat: number; lng: number } | null };


const VOICE_UI: Record<string, Record<string, string>> = {
 en: {title:'Automatic Voice Safety Monitor',desc:'Detects supported emergency phrases and sustained loud sounds while this page is active. Loud sounds can cause false alarms.',active:'Monitoring active on this page',off:'Monitoring is off',count:'Countdown before alert',enable:'Enable monitoring',stop:'Stop monitoring',detected:'Possible emergency detected',cancel:'I am safe — cancel alert',recording:'Recording emergency voice message…',prepared:'Emergency alert prepared — action required',preparedDesc:'The recording is ready, but this website cannot silently send SMS or audio attachments. Choose a contact/message action below and confirm sending.',share:'Share voice + alert',download:'Download audio',sms:'Prepare SMS for',openLocation:'Open detected-alert location',noLocation:'No location was attached. Allow location access on the SOS page to include a map link.',note:'Initial permission is required, and this web version only runs while the page is active. Automatic background monitoring and silent audio/SMS delivery require a native app and a configured, permitted delivery service.'},
 ta: {title:'தானியங்கி குரல் பாதுகாப்புக் கண்காணிப்பு',desc:'இந்தப் பக்கம் செயலில் இருக்கும்போது அவசரச் சொற்களையும் நீடித்த அதிக ஒலியையும் கண்டறியும். அதிக ஒலி தவறான எச்சரிக்கையை ஏற்படுத்தலாம்.',active:'இந்தப் பக்கத்தில் கண்காணிப்பு செயலில் உள்ளது',off:'கண்காணிப்பு முடக்கப்பட்டுள்ளது',count:'எச்சரிக்கைக்கு முன் கவுண்ட்டவுன்',enable:'கண்காணிப்பை இயக்கு',stop:'கண்காணிப்பை நிறுத்து',detected:'சாத்தியமான அவசரம் கண்டறியப்பட்டது',cancel:'நான் பாதுகாப்பாக இருக்கிறேன் — ரத்து செய்',recording:'அவசரக் குரல் பதிவு செய்யப்படுகிறது…',prepared:'அவசர எச்சரிக்கை தயார் — நடவடிக்கை தேவை',preparedDesc:'பதிவு தயார். இந்த இணையதளம் SMS அல்லது ஆடியோவை அமைதியாக அனுப்ப முடியாது. கீழே தொடர்பைத் தேர்ந்தெடுத்து அனுப்புவதை உறுதிப்படுத்தவும்.',share:'குரல் + எச்சரிக்கையைப் பகிர்',download:'ஆடியோ பதிவிறக்கு',sms:'SMS தயார் செய்:',openLocation:'கண்டறிந்த இடத்தைத் திற',noLocation:'இடம் இணைக்கப்படவில்லை. SOS பக்கத்தில் இட அனுமதியை வழங்கவும்.',note:'முதலில் அனுமதி தேவை. இந்த இணைய பதிப்பு பக்கம் திறந்திருக்கும் போது மட்டுமே இயங்கும்.'},
 hi: {title:'स्वचालित वॉइस सुरक्षा मॉनिटर',desc:'पेज सक्रिय रहने पर आपातकालीन वाक्यांश और लगातार तेज़ आवाज़ पहचानता है। तेज़ आवाज़ से गलत अलर्ट हो सकता है।',active:'इस पेज पर निगरानी चालू है',off:'निगरानी बंद है',count:'अलर्ट से पहले उलटी गिनती',enable:'निगरानी चालू करें',stop:'निगरानी रोकें',detected:'संभावित आपात स्थिति मिली',cancel:'मैं सुरक्षित हूँ — अलर्ट रद्द करें',recording:'आपातकालीन आवाज़ रिकॉर्ड हो रही है…',prepared:'आपातकालीन अलर्ट तैयार — कार्रवाई आवश्यक',preparedDesc:'रिकॉर्डिंग तैयार है, लेकिन यह वेबसाइट SMS या ऑडियो चुपचाप नहीं भेज सकती। नीचे संपर्क चुनकर भेजने की पुष्टि करें।',share:'आवाज़ + अलर्ट साझा करें',download:'ऑडियो डाउनलोड करें',sms:'SMS तैयार करें:',openLocation:'पहचाना गया स्थान खोलें',noLocation:'स्थान नहीं जोड़ा गया। SOS पेज पर स्थान अनुमति दें।',note:'यह वेब संस्करण केवल पेज सक्रिय रहने पर चलता है।'},
 te: {title:'ఆటోమేటిక్ వాయిస్ సేఫ్టీ మానిటర్',desc:'ఈ పేజీ యాక్టివ్‌గా ఉన్నప్పుడు అత్యవసర పదాలు, ఎక్కువసేపు ఉండే పెద్ద శబ్దాలను గుర్తిస్తుంది. తప్పుడు హెచ్చరికలు రావచ్చు.',active:'ఈ పేజీలో పర్యవేక్షణ యాక్టివ్‌గా ఉంది',off:'పర్యవేక్షణ ఆఫ్‌లో ఉంది',count:'హెచ్చరికకు ముందు కౌంట్‌డౌన్',enable:'పర్యవేక్షణ ప్రారంభించండి',stop:'పర్యవేక్షణ ఆపండి',detected:'అత్యవసర పరిస్థితి ఉండవచ్చని గుర్తించాం',cancel:'నేను సురక్షితంగా ఉన్నాను — రద్దు చేయండి',recording:'అత్యవసర వాయిస్ రికార్డ్ అవుతోంది…',prepared:'అత్యవసర హెచ్చరిక సిద్ధం — చర్య అవసరం',preparedDesc:'రికార్డింగ్ సిద్ధంగా ఉంది; ఈ వెబ్‌సైట్ SMS లేదా ఆడియోను నిశ్శబ్దంగా పంపలేను. కాంటాక్ట్ ఎంచుకుని పంపడాన్ని నిర్ధారించండి.',share:'వాయిస్ + హెచ్చరిక పంచుకోండి',download:'ఆడియో డౌన్‌లోడ్',sms:'SMS సిద్ధం చేయండి:',openLocation:'గుర్తించిన స్థానాన్ని తెరవండి',noLocation:'స్థానం జోడించలేదు. SOS పేజీలో లొకేషన్ అనుమతి ఇవ్వండి.',note:'ఈ వెబ్ వెర్షన్ పేజీ యాక్టివ్‌గా ఉన్నప్పుడే పనిచేస్తుంది.'},
 mr: {title:'स्वयंचलित व्हॉइस सुरक्षा मॉनिटर',desc:'हे पृष्ठ सक्रिय असताना आपत्कालीन वाक्ये आणि सतत मोठे आवाज ओळखते. चुकीचा अलर्ट होऊ शकतो.',active:'या पृष्ठावर निरीक्षण सुरू आहे',off:'निरीक्षण बंद आहे',count:'अलर्टपूर्वी काउंटडाउन',enable:'निरीक्षण सुरू करा',stop:'निरीक्षण थांबवा',detected:'संभाव्य आपत्कालीन स्थिती आढळली',cancel:'मी सुरक्षित आहे — अलर्ट रद्द करा',recording:'आपत्कालीन आवाज रेकॉर्ड होत आहे…',prepared:'आपत्कालीन अलर्ट तयार — कृती आवश्यक',preparedDesc:'रेकॉर्डिंग तयार आहे; ही वेबसाइट SMS किंवा ऑडिओ शांतपणे पाठवू शकत नाही. संपर्क निवडून पाठवण्याची पुष्टी करा.',share:'आवाज + अलर्ट शेअर करा',download:'ऑडिओ डाउनलोड करा',sms:'SMS तयार करा:',openLocation:'आढळलेले ठिकाण उघडा',noLocation:'ठिकाण जोडलेले नाही. SOS पृष्ठावर स्थान परवानगी द्या.',note:'ही वेब आवृत्ती पृष्ठ सक्रिय असतानाच चालते.'},
 ml: {title:'ഓട്ടോമാറ്റിക് വോയ്സ് സുരക്ഷാ നിരീക്ഷണം',desc:'പേജ് സജീവമായിരിക്കുമ്പോൾ അടിയന്തര വാക്കുകളും തുടർച്ചയായ ഉച്ചത്തിലുള്ള ശബ്ദവും കണ്ടെത്തുന്നു. തെറ്റായ അലർട്ട് ഉണ്ടാകാം.',active:'ഈ പേജിൽ നിരീക്ഷണം സജീവമാണ്',off:'നിരീക്ഷണം ഓഫ് ആണ്',count:'അലർട്ടിന് മുമ്പുള്ള കൗണ്ട്ഡൗൺ',enable:'നിരീക്ഷണം ആരംഭിക്കുക',stop:'നിരീക്ഷണം നിർത്തുക',detected:'സാധ്യമായ അടിയന്തരാവസ്ഥ കണ്ടെത്തി',cancel:'ഞാൻ സുരക്ഷിതനാണ് — അലർട്ട് റദ്ദാക്കുക',recording:'അടിയന്തര ശബ്ദം റെക്കോർഡ് ചെയ്യുന്നു…',prepared:'അടിയന്തര അലർട്ട് തയ്യാറായി — നടപടി ആവശ്യമാണ്',preparedDesc:'റെക്കോർഡിംഗ് തയ്യാറാണ്, എന്നാൽ ഈ വെബ്സൈറ്റിന് SMS അല്ലെങ്കിൽ ഓഡിയോ നിശ്ശബ്ദമായി അയയ്ക്കാനാകില്ല. കോൺടാക്റ്റ് തിരഞ്ഞെടുത്ത് അയയ്ക്കൽ സ്ഥിരീകരിക്കുക.',share:'ശബ്ദവും അലർട്ടും പങ്കിടുക',download:'ഓഡിയോ ഡൗൺലോഡ്',sms:'SMS തയ്യാറാക്കുക:',openLocation:'കണ്ടെത്തിയ സ്ഥലം തുറക്കുക',noLocation:'സ്ഥലം ചേർത്തിട്ടില്ല. SOS പേജിൽ ലൊക്കേഷൻ അനുമതി നൽകുക.',note:'ഈ വെബ് പതിപ്പ് പേജ് സജീവമായിരിക്കുമ്പോൾ മാത്രം പ്രവർത്തിക്കും.'},
 gu: {title:'સ્વચાલિત વૉઇસ સુરક્ષા મોનિટર',desc:'પેજ સક્રિય હોય ત્યારે ઇમરજન્સી શબ્દો અને સતત મોટા અવાજને ઓળખે છે. ખોટો એલર્ટ થઈ શકે છે.',active:'આ પેજ પર મોનિટરિંગ સક્રિય છે',off:'મોનિટરિંગ બંધ છે',count:'એલર્ટ પહેલાં કાઉન્ટડાઉન',enable:'મોનિટરિંગ ચાલુ કરો',stop:'મોનિટરિંગ બંધ કરો',detected:'સંભવિત ઇમરજન્સી મળી',cancel:'હું સુરક્ષિત છું — એલર્ટ રદ કરો',recording:'ઇમરજન્સી અવાજ રેકોર્ડ થઈ રહ્યો છે…',prepared:'ઇમરજન્સી એલર્ટ તૈયાર — પગલું જરૂરી',preparedDesc:'રેકોર્ડિંગ તૈયાર છે, પરંતુ આ વેબસાઇટ SMS અથવા ઑડિયો ચૂપચાપ મોકલી શકતી નથી. સંપર્ક પસંદ કરીને મોકલવાની પુષ્ટિ કરો.',share:'અવાજ + એલર્ટ શેર કરો',download:'ઑડિયો ડાઉનલોડ કરો',sms:'SMS તૈયાર કરો:',openLocation:'ઓળખાયેલ સ્થાન ખોલો',noLocation:'સ્થાન જોડાયું નથી. SOS પેજમાં સ્થાનની પરવાનગી આપો.',note:'આ વેબ આવૃત્તિ પેજ સક્રિય હોય ત્યારે જ ચાલે છે.'},
 kn: {title:'ಸ್ವಯಂಚಾಲಿತ ಧ್ವನಿ ಸುರಕ್ಷತಾ ಮೇಲ್ವಿಚಾರಣೆ',desc:'ಪುಟ ಸಕ್ರಿಯವಾಗಿರುವಾಗ ತುರ್ತು ಪದಗಳು ಮತ್ತು ನಿರಂತರ ಜೋರಾದ ಶಬ್ದವನ್ನು ಪತ್ತೆಹಚ್ಚುತ್ತದೆ. ತಪ್ಪು ಎಚ್ಚರಿಕೆ ಸಂಭವಿಸಬಹುದು.',active:'ಈ ಪುಟದಲ್ಲಿ ಮೇಲ್ವಿಚಾರಣೆ ಸಕ್ರಿಯವಾಗಿದೆ',off:'ಮೇಲ್ವಿಚಾರಣೆ ಆಫ್ ಆಗಿದೆ',count:'ಎಚ್ಚರಿಕೆಗೆ ಮುನ್ನ ಕೌಂಟ್‌ಡೌನ್',enable:'ಮೇಲ್ವಿಚಾರಣೆ ಪ್ರಾರಂಭಿಸಿ',stop:'ಮೇಲ್ವಿಚಾರಣೆ ನಿಲ್ಲಿಸಿ',detected:'ಸಂಭಾವ್ಯ ತುರ್ತು ಪರಿಸ್ಥಿತಿ ಪತ್ತೆಯಾಗಿದೆ',cancel:'ನಾನು ಸುರಕ್ಷಿತವಾಗಿದ್ದೇನೆ — ರದ್ದುಮಾಡಿ',recording:'ತುರ್ತು ಧ್ವನಿ ದಾಖಲಿಸಲಾಗುತ್ತಿದೆ…',prepared:'ತುರ್ತು ಎಚ್ಚರಿಕೆ ಸಿದ್ಧ — ಕ್ರಮ ಅಗತ್ಯ',preparedDesc:'ದಾಖಲೆ ಸಿದ್ಧವಾಗಿದೆ, ಆದರೆ ಈ ವೆಬ್‌ಸೈಟ್ SMS ಅಥವಾ ಆಡಿಯೊವನ್ನು ಮೌನವಾಗಿ ಕಳುಹಿಸಲಾರದು. ಸಂಪರ್ಕವನ್ನು ಆಯ್ಕೆ ಮಾಡಿ ಕಳುಹಿಸುವುದನ್ನು ದೃಢೀಕರಿಸಿ.',share:'ಧ್ವನಿ + ಎಚ್ಚರಿಕೆಯನ್ನು ಹಂಚಿಕೊಳ್ಳಿ',download:'ಆಡಿಯೊ ಡೌನ್‌ಲೋಡ್ ಮಾಡಿ',sms:'SMS ಸಿದ್ಧಪಡಿಸಿ:',openLocation:'ಪತ್ತೆಯಾದ ಸ್ಥಳ ತೆರೆಯಿರಿ',noLocation:'ಸ್ಥಳ ಸೇರಿಸಲಾಗಿಲ್ಲ. SOS ಪುಟದಲ್ಲಿ ಸ್ಥಳ ಅನುಮತಿ ನೀಡಿ.',note:'ಈ ವೆಬ್ ಆವೃತ್ತಿ ಪುಟ ಸಕ್ರಿಯವಾಗಿರುವಾಗ ಮಾತ್ರ ಕಾರ್ಯನಿರ್ವಹಿಸುತ್ತದೆ.'}
};

const PHRASES: Record<string, string[]> = {
  en: ['help me', 'help', 'save me', 'emergency', 'call the police', 'stop it'],
  ta: ['உதவி', 'காப்பாற்றுங்கள்', 'காவல்துறையை அழைக்கவும்', 'அவசரம்'],
  hi: ['बचाओ', 'मदद करो', 'मदद', 'पुलिस बुलाओ', 'आपातकाल'],
  te: ['సహాయం', 'నన్ను కాపాడండి', 'పోలీసులను పిలవండి', 'అత్యవసరం'],
  mr: ['वाचवा', 'मदत करा', 'पोलिसांना बोलवा', 'आपत्कालीन'],
  ml: ['സഹായിക്കൂ', 'രക്ഷിക്കൂ', 'പോലീസിനെ വിളിക്കൂ', 'അടിയന്തരാവസ്ഥ'],
  gu: ['મદદ કરો', 'બચાવો', 'પોલીસને બોલાવો', 'કટોકટી'],
  kn: ['ಸಹಾಯ ಮಾಡಿ', 'ಉಳಿಸಿ', 'ಪೊಲೀಸರನ್ನು ಕರೆಸಿ', 'ತುರ್ತು'],
};

export const VoiceSafetyMonitor: React.FC<Props> = ({ contacts, language, coords }) => {
  const [monitoring, setMonitoring] = useState(false);
  const [status, setStatus] = useState('Monitoring is off. Enable it to grant microphone permission and start this page session.');
  const [countdown, setCountdown] = useState<number | null>(null);
  const [seconds, setSeconds] = useState(10);
  const [recording, setRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [alertReady, setAlertReady] = useState(false);
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');
  const streamRef = useRef<MediaStream | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);
  const timerRef = useRef<number | null>(null);
  const countdownRef = useRef<number | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const recognitionRef = useRef<any>(null);
  const monitoringRef = useRef(false);
  const triggeredRef = useRef(false);
  const audioUrlRef = useRef<string | null>(null);

  const ui = VOICE_UI[language] || VOICE_UI.en;
  const mapLink = coords ? `https://maps.google.com/?q=${coords.lat},${coords.lng}` : '';
  const alertText = `SAHAYINI EMERGENCY ALERT: Possible danger detected. Please contact me immediately.${mapLink ? ` My location: ${mapLink}` : ' My GPS location is unavailable.'}`;

  const stopAudioDetection = () => {
    if (timerRef.current !== null) window.clearInterval(timerRef.current);
    timerRef.current = null;
    if (audioContextRef.current) { void audioContextRef.current.close().catch(() => {}); audioContextRef.current = null; }
  };

  const stopMonitoring = () => {
    monitoringRef.current = false;
    setMonitoring(false);
    try { recognitionRef.current?.stop(); } catch { /* already stopped */ }
    recognitionRef.current = null;
    stopAudioDetection();
    if (streamRef.current) streamRef.current.getTracks().forEach(track => track.stop());
    streamRef.current = null;
    setRecording(false);
    setStatus('Monitoring stopped. This website can only monitor while the page remains active.');
  };

  const beginRecording = (stream: MediaStream) => {
    try {
      if (typeof MediaRecorder === 'undefined') { setError('This browser cannot record audio.'); return; }
      chunksRef.current = [];
      const preferred = MediaRecorder.isTypeSupported('audio/webm;codecs=opus') ? 'audio/webm;codecs=opus' : '';
      const recorder = new MediaRecorder(stream, preferred ? { mimeType: preferred } : undefined);
      recorderRef.current = recorder;
      recorder.ondataavailable = e => { if (e.data.size > 0) chunksRef.current.push(e.data); };
      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: recorder.mimeType || 'audio/webm' });
        if (blob.size) {
          if (audioUrlRef.current) URL.revokeObjectURL(audioUrlRef.current);
          const url = URL.createObjectURL(blob);
          audioUrlRef.current = url;
          setAudioUrl(url);
        }
        setRecording(false);
      };
      recorder.start();
      setRecording(true);
    } catch { setError('Could not start voice recording on this device.'); }
  };

  const triggerAlert = (why: string) => {
    if (triggeredRef.current || !monitoringRef.current) return;
    triggeredRef.current = true;
    setReason(why);
    setAlertReady(false);
    setStatus('Possible danger detected. Recording a short voice message during the 10-second cancellation countdown.');
    const stream = streamRef.current;
    if (stream && !recording) beginRecording(stream);
    setCountdown(seconds);
    let remaining = seconds;
    countdownRef.current = window.setInterval(() => {
      remaining -= 1;
      setCountdown(remaining);
      if (remaining <= 0) {
        if (countdownRef.current !== null) window.clearInterval(countdownRef.current);
        countdownRef.current = null;
        if (recorderRef.current?.state === 'recording') recorderRef.current.stop();
        setCountdown(null);
        setAlertReady(true);
        setStatus('Alert prepared. Audio is ready to share; this browser cannot silently send SMS or audio files.');
      }
    }, 1000);
  };

  const startMonitoring = async () => {
    setError(''); setAlertReady(false); setAudioUrl(null); triggeredRef.current = false;
    if (!navigator.mediaDevices?.getUserMedia) { setError('Microphone access requires HTTPS or localhost and a supported browser.'); return; }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      monitoringRef.current = true;
      setMonitoring(true);
      setStatus('Monitoring active on this page. Keep this page open and the device awake.');
      // Speech recognition where the browser provides it.
      const w = window as any;
      const Recognition = w.SpeechRecognition || w.webkitSpeechRecognition;
      if (Recognition) {
        const rec = new Recognition();
        recognitionRef.current = rec;
        rec.lang = ({ en: 'en-IN', ta: 'ta-IN', hi: 'hi-IN', te: 'te-IN', mr: 'mr-IN', ml: 'ml-IN', gu: 'gu-IN', kn: 'kn-IN' } as Record<string,string>)[language] || 'en-IN';
        rec.continuous = true; rec.interimResults = true;
        rec.onresult = (event: any) => {
          let transcript = '';
          for (let i = event.resultIndex; i < event.results.length; i++) transcript += ` ${event.results[i][0]?.transcript || ''}`;
          const normalized = transcript.toLocaleLowerCase();
          const phrases = [...PHRASES[language] || [], ...PHRASES.en];
          const match = phrases.find(p => normalized.includes(p.toLocaleLowerCase()));
          if (match) triggerAlert(`Emergency phrase recognized: ${match}`);
        };
        rec.onerror = () => setStatus('Microphone is active, but speech recognition is unavailable or interrupted. Loud-sound detection may still work while this page stays open.');
        rec.onend = () => { if (monitoringRef.current && recognitionRef.current === rec) { try { rec.start(); } catch { /* browser may block restart */ } } };
        try { rec.start(); } catch { /* continue with sound level detection */ }
      }
      // Best-effort loud-sound detection (threshold only; not a reliable scream classifier).
      try {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioCtx) {
          const ctx = new AudioCtx(); audioContextRef.current = ctx;
          const source = ctx.createMediaStreamSource(stream); const analyser = ctx.createAnalyser(); analyser.fftSize = 1024; source.connect(analyser);
          const data = new Uint8Array(analyser.fftSize); let loudSince = 0;
          timerRef.current = window.setInterval(() => {
            if (!monitoringRef.current || triggeredRef.current) return;
            analyser.getByteTimeDomainData(data);
            let sum = 0; for (const v of data) { const x = (v - 128) / 128; sum += x * x; }
            const rms = Math.sqrt(sum / data.length);
            if (rms > 0.22) { if (!loudSince) loudSince = Date.now(); if (Date.now() - loudSince > 1200) triggerAlert('Sustained loud sound detected (possible false alarm).'); }
            else loudSince = 0;
          }, 250);
        }
      } catch { /* speech phrase detection can still operate */ }
    } catch {
      setMonitoring(false); monitoringRef.current = false;
      setError('Microphone permission was denied or unavailable. Allow microphone access in Chrome site settings and try again.');
      setStatus('Monitoring is off.');
    }
  };

  const cancelAlert = () => {
    if (countdownRef.current !== null) window.clearInterval(countdownRef.current);
    countdownRef.current = null; setCountdown(null); triggeredRef.current = false; setAlertReady(false);
    if (recorderRef.current?.state === 'recording') recorderRef.current.stop();
    setStatus('Alert cancelled by the user. Monitoring remains active.');
  };

  const shareAudio = async () => {
    if (!audioUrl) return;
    try {
      const response = await fetch(audioUrl); const blob = await response.blob();
      const file = new File([blob], 'sahayini-emergency-voice.webm', { type: blob.type || 'audio/webm' });
      if (navigator.canShare?.({ files: [file] }) && navigator.share) {
        await navigator.share({ title: 'SAHAYINI Emergency Voice Message', text: alertText, files: [file] });
        setStatus('Share sheet opened. Select a trusted contact and confirm sending.');
      } else {
        const a = document.createElement('a'); a.href = audioUrl; a.download = file.name; a.click();
        setStatus('Audio downloaded. Attach it manually in your messaging app; this browser does not support direct audio sharing.');
      }
    } catch (e) {
      if ((e as Error)?.name !== 'AbortError') setError('Could not open audio sharing. Use Download audio, then attach it to a message.');
    }
  };

  useEffect(() => () => {
    monitoringRef.current = false;
    if (countdownRef.current !== null) window.clearInterval(countdownRef.current);
    stopAudioDetection();
    try { recognitionRef.current?.stop(); } catch { /* ignore */ }
    streamRef.current?.getTracks().forEach(track => track.stop());
    if (audioUrlRef.current) URL.revokeObjectURL(audioUrlRef.current);
  }, []);

  return <section className="rounded-3xl border border-rose-200 bg-white p-5 sm:p-6 shadow-sm space-y-4" aria-label="Automatic voice safety monitor">
    <div className="flex items-start gap-3">
      <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center shrink-0"><ShieldAlert className="w-6 h-6" /></div>
      <div className="flex-1"><h2 className="text-lg font-extrabold text-slate-900">{ui.title}</h2><p className="text-sm text-slate-600 mt-1">{ui.desc}</p></div>
    </div>
    <div className={`rounded-xl p-3 text-sm border ${monitoring ? 'bg-emerald-50 border-emerald-200 text-emerald-900' : 'bg-slate-50 border-slate-200 text-slate-700'}`}><div className="flex items-center gap-2 font-bold">{monitoring ? <CheckCircle2 className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}{monitoring ? ui.active : ui.off}</div><p className="mt-1">{status}</p></div>
    <div className="flex flex-col sm:flex-row sm:items-end gap-3">
      <label className="text-sm font-semibold text-slate-700 flex-1">{ui.count}
        <select value={seconds} disabled={countdown !== null} onChange={e => setSeconds(Number(e.target.value))} className="mt-1 block w-full rounded-xl border border-slate-300 bg-white p-3 text-sm"><option value={10}>10 seconds (recommended)</option><option value={5}>5 seconds</option><option value={15}>15 seconds</option><option value={20}>20 seconds</option><option value={30}>30 seconds</option></select>
      </label>
      {!monitoring ? <button onClick={startMonitoring} className="min-h-11 rounded-xl bg-rose-600 px-4 py-3 font-bold text-white flex items-center justify-center gap-2"><Mic className="w-4 h-4" />{ui.enable}</button> : <button onClick={stopMonitoring} className="min-h-11 rounded-xl border border-slate-300 px-4 py-3 font-bold text-slate-800 flex items-center justify-center gap-2"><MicOff className="w-4 h-4" />{ui.stop}</button>}
    </div>
    {error && <p role="alert" className="rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-800">{error}</p>}
    {countdown !== null && <div className="rounded-2xl bg-red-50 border border-red-300 p-4 space-y-3"><div className="flex items-center gap-2 text-red-800 font-extrabold"><AlertTriangle className="w-5 h-5" />{ui.detected}</div><p className="text-sm text-red-800">{reason}</p><div className="flex items-center gap-2 text-3xl font-black text-red-700"><Timer className="w-7 h-7" />{countdown}s</div><p className="text-xs text-red-800">A short voice recording is being captured if recording is supported. Cancel if you are safe.</p><button onClick={cancelAlert} className="w-full rounded-xl bg-white border-2 border-red-500 text-red-700 font-extrabold py-3 flex items-center justify-center gap-2"><XCircle className="w-5 h-5" />{ui.cancel}</button></div>}
    {recording && <p className="text-sm font-semibold text-rose-700 flex items-center gap-2"><span className="inline-block w-2 h-2 rounded-full bg-red-600 animate-pulse" />{ui.recording}</p>}
    {alertReady && <div className="rounded-2xl border border-amber-300 bg-amber-50 p-4 space-y-3"><h3 className="font-extrabold text-amber-950">{ui.prepared}</h3><p className="text-sm text-amber-900">{ui.preparedDesc}</p>
      {audioUrl && <div className="space-y-2"><audio controls src={audioUrl} className="w-full" /><div className="flex flex-wrap gap-2"><button onClick={shareAudio} className="rounded-lg bg-[#0A2E65] text-white px-3 py-2 text-sm font-bold flex items-center gap-2"><Share2 className="w-4 h-4" />{ui.share}</button><a href={audioUrl} download="sahayini-emergency-voice.webm" className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-bold flex items-center gap-2"><Download className="w-4 h-4" />{ui.download}</a></div></div>}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">{contacts.filter(c => c.phone).map(c => <a key={c.id} href={`sms:${encodeURIComponent(c.phone)}?body=${encodeURIComponent(alertText)}`} className="rounded-lg bg-white border border-rose-200 px-3 py-2 text-sm font-bold text-rose-800 flex items-center gap-2"><PhoneCall className="w-4 h-4" />{ui.sms} {c.name}</a>)}</div>
      {mapLink ? <a href={mapLink} target="_blank" rel="noreferrer" className="text-sm underline text-blue-800 flex items-center gap-2"><MapPin className="w-4 h-4" />{ui.openLocation}</a> : <p className="text-xs text-slate-600">{ui.noLocation}</p>}
      <p className="text-xs text-amber-900">Nearby police stations can be found in the Nearby Police section below. Finding a station does not send an alert to that station.</p>
    </div>}
    <p className="text-xs text-slate-500">{ui.note}</p>
  </section>;
};
