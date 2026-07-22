import React, { useState } from 'react';
import { DiseaseHistory, Crop, RecoveryMonitoring } from '../types';
import { translations, Language } from '../lib/translations';
import { 
  Upload, 
  Camera, 
  Loader2, 
  Sparkles, 
  Download, 
  AlertTriangle, 
  ShieldCheck, 
  RefreshCw, 
  ArrowRight,
  Gauge,
  HelpCircle,
  TrendingUp,
  Image as ImageIcon
} from 'lucide-react';

interface DiagnosticsProps {
  crops: Crop[];
  history: DiseaseHistory[];
  onDetect: (cropName: string, base64Image: string, cropId?: string) => Promise<DiseaseHistory>;
  onCompare: (diseaseHistoryId: string, base64Image: string) => Promise<RecoveryMonitoring>;
  token: string | null;
  language?: Language;
}

const dTrans: Record<string, Record<Language, string>> = {
  tab_disease: {
    ta: "1. இலை நோய் கண்டறிதல் (Disease AI)",
    en: "1. Leaf Disease Diagnosis (Disease AI)",
    hi: "1. पत्ती रोग निदान (Disease AI)",
    te: "1. ఆకు తెగులు నిర్ధారణ (Disease AI)",
    kn: "1. ಎಲೆ ರೋಗ ಪತ್ತೆ (Disease AI)",
    ml: "1. ഇല രോഗ നിർണ്ണയം (Disease AI)",
    mr: "1. पानांवरील रोग निदान (Disease AI)",
    bn: "1. পাতা রোগ নির্ণয় (Disease AI)",
    gu: "1. પાન રોગ નિદાન (Disease AI)",
    pa: "1. ਪੱਤਾ ರੋਗ ਨਿਦਾਨ (Disease AI)"
  },
  tab_xai: {
    ta: "2. விளக்கக்கூடிய AI (Grad-CAM XAI)",
    en: "2. Explainable AI (Grad-CAM XAI)",
    hi: "2. व्याख्यात्मक एआई (Grad-CAM XAI)",
    te: "2. వివరణాత్మక AI (Grad-CAM XAI)",
    kn: "2. ವಿವರಣಾತ್ಮಕ AI (Grad-CAM XAI)",
    ml: "2. വിശദീകരിക്കാവുന്ന AI (Grad-CAM XAI)",
    mr: "2. स्पष्टीकरणात्मक एआय (Grad-CAM XAI)",
    bn: "2. ব্যাখ্যাযোগ্য এআই (Grad-CAM XAI)",
    gu: "2. વર્ણનાત્મક AI (Grad-CAM XAI)",
    pa: "2. ਵਿਆਖਿਆਯੋਗ AI (Grad-CAM XAI)"
  },
  tab_recovery: {
    ta: "3. பயிர் மீட்சி கண்காணிப்பு (Recovery Check)",
    en: "3. Crop Recovery Monitoring (Recovery Check)",
    hi: "3. फसल सुधार निगरानी (Recovery Check)",
    te: "3. పంట రికవరీ పర్యవేక్షణ (Recovery Check)",
    kn: "3. ಬೆಳೆ ಚೇತರಿಕೆ ಮೇಲ್ವಿಚಾರಣೆ (Recovery Check)",
    ml: "3. can we track recovery",
    mr: "3. पीक सुधारणा देखरेख (Recovery Check)",
    bn: "3. ফসল পুনরুদ্ধার পর্যবেক্ষণ (Recovery Check)",
    gu: "3. પાક સુધારણા મોનિટરિંગ (Recovery Check)",
    pa: "3. ਫਸਲ ਸੁਧਾਰ ਨਿਗਰਾਨੀ (Recovery Check)"
  },
  err_detect: {
    ta: "கண்டறிதலில் பிழை. Please check database configuration.",
    en: "Error in detection. Please check database configuration.",
    hi: "खोज में त्रुटि। कृपया डेटाबेस कॉन्फ़िगरेशन की जांच करें।",
    te: "కనుగొనడంలో లోపం. దయచేసి డేటాబేస్ కాన్ఫిగరేషన్‌ను తనిఖీ చేయండి.",
    kn: "ಪತ್ತೆ ಹಚ್ಚುವಲ್ಲಿ ದೋಷ. ದಯವಿಟ್ಟು ಡೇಟಾಬೇಸ್ ಕಾನ್ಫಿಗರೇಶನ್ ಪರಿಶೀಲಿಸಿ.",
    ml: "തിരിച്ചറിയുന്നതിൽ പിശക്. ദയവായി ഡാറ്റാബേസ് കോൺഫിഗറേഷൻ പരിശോധിക്കുക.",
    mr: "शोधण्यात त्रुटी. कृपया डेटाबेस कॉन्फिगरेशन तपासा.",
    bn: "সনাক্তকরণে ত্রুটি। অনুগ্রহ করে ডাটাবেস কনফিগারেশন পরীক্ষা করুন।",
    gu: "શોધવામાં ભૂલ. કૃપા કરીને ડેટાબેઝ કન્ફિગરેશન તપાસો.",
    pa: "ਖੋਜ ਵਿੱਚ ਤਰੁੱਟੀ। ਕਿਰਪਾ ਕਰਕੇ ਡਾਟਾਬੇਸ ਕੌਂਫਿਗਰੇਸ਼ਨ ਦੀ ਜਾਂਚ ਕਰੋ।"
  },
  new_leaf: {
    ta: "புதிய நோய்க் கண்டறிதல் (New Leaf Diagnosis)",
    en: "New Leaf Diagnosis",
    hi: "नया पत्ती निदान (New Leaf Diagnosis)",
    te: "కొత్త ఆకు నిర్ధారణ (New Leaf Diagnosis)",
    kn: "ಹೊಸ ಎಲೆ ರೋಗ ಪತ್ತೆ (New Leaf Diagnosis)",
    ml: "പുതിയ ഇല രോഗ നിർണ്ണയം (New Leaf Diagnosis)",
    mr: "नवीन पानांचे निदान (New Leaf Diagnosis)",
    bn: "নতুন পাতা রোগ নির্ণয় (New Leaf Diagnosis)",
    gu: "નવું પાન નિદાન (New Leaf Diagnosis)",
    pa: "ਨਵਾਂ ਪੱਤਾ ਨਿਦਾਨ (New Leaf Diagnosis)"
  },
  select_crop_label: {
    ta: "பயிர் வகையைத் தேர்ந்தெடுக்கவும் (Crop Name)",
    en: "Select Crop Category (Crop Name)",
    hi: "फसल श्रेणी चुनें",
    te: "పంట వర్గాన్ని ఎంచుకోండి",
    kn: "ಬೆಳೆ ವರ್ಗವನ್ನು ಆಯ್ಕೆಮಾಡಿ",
    ml: "വിള വിഭാഗം തിരഞ്ഞെടുക്കുക",
    mr: "पीक श्रेणी निवडा",
    bn: "ফসলের বিভাগ নির্বাচন করুন",
    gu: "પાકની શ્રેણી પસંદ કરો",
    pa: "ਫਸਲ ਦੀ ਸ੍ਰੇਣੀ ਚੁਣੋ"
  },
  auto_detect_opt: {
    ta: "தானியங்கி கண்டறிதல் (Auto-Detect Crop & Disease)",
    en: "Auto-Detect Crop & Disease",
    hi: "स्वचालित पहचान",
    te: "ఆటో-డిటెక్ట్",
    kn: "ಸ್ವಯಂಚಾಲಿತ ಪತ್ತೆ",
    ml: "ഓട്ടോ-ഡിറ്റക്റ്റ്",
    mr: "स्वचालित शोध",
    bn: "স্বয়ংক্রিয় সনাক্তকরণ",
    gu: "સ્વચાલિત શોધ",
    pa: "ਸਵੈਚਾਲਿਤ ਖੋਜ"
  },
  paddy: { ta: "Paddy (நெல்)", en: "Paddy", hi: "धान (Paddy)", te: "వరి", kn: "ಭತ್ತ", ml: "നെല്ല്", mr: "भात", bn: "ধান", gu: "ડાંગર", pa: "ਝੋਨਾ" },
  tomato: { ta: "Tomato (தக்காளி)", en: "Tomato", hi: "टमाटर (Tomato)", te: "టమోటా", kn: "ಟೊಮ್ಯಾಟೊ", ml: "തക്കാളി", mr: "टोमॅटो", bn: "টমেটো", gu: "ટમેટા", pa: "ਟਮਾਟਰ" },
  maize: { ta: "Maize (சோளம்)", en: "Maize", hi: "मक्का (Maize)", te: "మొక్కజొన్న", kn: "ಮೆಕ್ಕೆಜೋಳ", ml: "ചോളം", mr: "मका", bn: "ভুট্টা", gu: "મકાઈ", pa: "ਮੱਕੀ" },
  cotton: { ta: "Cotton (பருத்தி)", en: "Cotton", hi: "कपास (Cotton)", te: "పత్తి", kn: "ಹತ್ತి", ml: "പരുത്തി", mr: "कापूस", bn: "তুলা", gu: "કપાસ", pa: "ਕਪਾਹ" },
  banana: { ta: "Banana (வாழை)", en: "Banana", hi: "केला (Banana)", te: "అరటి", kn: "ಬಾಳೆಹಣ್ಣು", ml: "വാഴ", mr: "ਕੇੜਾ", bn: "কলা", gu: "કેળા", pa: "ਕੇਲਾ" },
  remove_photo: { ta: "புகைப்படத்தை அகற்று (Remove)", en: "Remove Photo", hi: "फोटो हटाएं", te: "ఫోటోను తొలగించండి", kn: "ಫೋಟೋ ತೆಗೆದುಹಾಕಿ", ml: "ഫോട്ടോ ഒഴിവാക്കുക", mr: "फोटो काढा", bn: "ছবি মুছুন", gu: "ફોટો દૂર કરો", pa: "ਫੋਟੋ ਹਟਾਓ" },
  drag_drop: { ta: "இலை புகைப்படத்தை இழுத்து விடவும் அல்லது", en: "Drag & drop leaf photo or", hi: "पत्ती का फोटो खींचें और छोड़ें या", te: "ఆకు ఫోటోను ఇక్కడ లాగండి లేదా", kn: "ಎಲೆಯ ಫೋಟೋವನ್ನು ಇಲ್ಲಿಗೆ ಎಳೆಯಿರಿ ಅಥವಾ", ml: "ഇലയുടെ ഫോട്ടോ ഇവിടെ വലിച്ചിടുക അല്ലെങ്കിൽ", mr: "पानाचा फोटो ड्रॅग आणि ड्रॉप करा किंवा", bn: "পাতার ছবি টেনে আনুন অথবা", gu: "પાનનો ફોટો ખેંચો અને અહીં છોડો અથવા", pa: "ਪੱਤੇ ਦੀ ਫੋਟो ਖਿੱਚੋ ਅਤੇ ਇੱਥੇ ਛੱਡੋ ਜਾਂ" },
  browse_file: { ta: "கோப்புகளைத் தேர்ந்தெடுக்கவும் (Browse File)", en: "Browse File", hi: "फ़ाइल चुनें (Browse File)", te: "ఫైల్‌ని బ్రౌజ్ చేయండి", kn: "ಫೈಲ್ ಬ್ರೌಸ್ ಮಾಡಿ", ml: "ഫയൽ ബ്രൗസ് ചെയ്യുക", mr: "फाइल निवडा", bn: "ফাইল ব্রাউজ করুন", gu: "ફાઇલ પસંદ કરો", pa: "ਫਾਈਲ ਚੁਣੋ" },
  use_mock: { ta: "டெமோ படம் பயன்படுத்தவும் (Use Mock Photo)", en: "Use Mock Photo", hi: "डेमो फोटो का उपयोग करें", te: "డెమో ఫోటోను ఉపయోగించండి", kn: "ಡೆಮೊ ಫೋಟೋ ಬಳಸಿ", ml: "ഡെമോ ഫോട്ടോ ഉപയോഗിക്കുക", mr: "डेमो फोटो वापरा", bn: "ডেমো ছবি ব্যবহার করুন", gu: "ડેમો ફોટો વાપરો", pa: "ਡੈਮੋ ਫੋਟੋ ਦੀ ਵਰਤੋਂ ਕਰੋ" },
  analyzing: { ta: "பரிசோதிக்கிறது (AI analyzing leaf...)", en: "AI analyzing leaf...", hi: "पत्ती का विश्लेषण हो रहा है...", te: "ఆకును విશ્లేషిస్తోంది...", kn: "ಎಲೆಯನ್ನು ವಿಶ್ಲೇಷಿಸಲಾಗುತ್ತಿದೆ...", ml: "ഇല പരിശോധിക്കുന്നു...", mr: "पानाचे विश्लेषण होत आहे...", bn: "পাতা বিশ্লেষণ করা হচ্ছে...", gu: "પાનનું વિશ્લેષણ થઈ રહ્યું છે...", pa: "ਪੱਤੇ ਦਾ ਵਿਸ਼ਲੇਸ਼ਣ ਕੀਤਾ ਜਾ ਰਿਹਾ ਹੈ..." },
  run_diag: { ta: "பரிசோதனை செய் (Run AI Diagnostic)", en: "Run AI Diagnostic", hi: "निदान चलाएं", te: "నిర్ధారణ చేయండి", kn: "ಪರೀಕ್ಷೆ ಚಲಾಯಿಸಿ", ml: "പരിशोधന നടത്തുക", mr: "निदान चालवा", bn: "পরীক্ষা চালান", gu: "નિદાન ચલાવો", pa: "ਟੈਸਟ ਚਲਾਓ" },
  affected_area: { ta: "பாதிக்கப்பட்ட பகுதி", en: "Affected Area", hi: "प्रभावित क्षेत्र", te: "ప్రభావిత ప్రాంతం", kn: "ಬಾಧಿತ ಪ್ರದೇಶ", ml: "ബാധിച്ച പ്രദേശം", mr: "बाधित क्षेत्र", bn: "আক্রান্ত অঞ্চল", gu: "અસરગ્રસ્ત વિસ્તાર", pa: "ਪ੍ਰਭਾਵਿਤ ਖੇਤਰ" },
  recovery_time: { ta: "குணமடையும் காலம்", en: "Recovery Time", hi: "सुधार का समय", te: "రికవరీ సమయం", kn: "ಚೇತರಿಕೆ ಸಮಯ", ml: "സുഖം പ്രാപിക്കുന്ന സമയം", mr: "सुधारणेचा वेळ", bn: "সেরে ওঠার সময়", gu: "સુધારણા સમય", pa: "ਠੀਕ ਹੋਣ ਦਾ ਸਮਾਂ" },
  description: { ta: "நோய் விளக்கம்", en: "Description", hi: "रोग का विवरण", te: "తెగులు వివరణ", kn: "ರೋಗದ ವಿವರಣೆ", ml: "രോഗവിവരണം", mr: "रोगाचे वर्णन", bn: "রোগের বিবরণ", gu: "રોગ વર્ણન", pa: "ਰੋਗ ਦਾ ਵੇਰਵਾ" },
  cause: { ta: "காரணம்", en: "Cause", hi: "कारण", te: "కారణం", kn: "ಕಾರಣ", ml: "कारण", mr: "कारण", bn: "কারণ", gu: "કારણ", pa: "ਕਾਰਨ" },
  organic: { ta: "இயற்கை சிகிச்சை", en: "Organic Cure", hi: "जैविक उपचार", te: "సేంద్రీय చికిత్స", kn: "ಸಾವಯವ ಚಿಕಿತ್ಸೆ", ml: "ജൈവ ചികിത്സ", mr: "सेंद्रिय उपचार", bn: "জৈব চিকিৎসা", gu: "ઓર્ગેનિક સારવાર", pa: "ਜੈਵਿਕ ਇਲਾਜ" },
  chemical: { ta: "இரசாயன சிகிச்சை", en: "Chemical Spray", hi: "रासायनिक छिड़काव", te: "రసాయన పిచికారీ", kn: "ರಾಸಾಯನಿಕ ಸಿಂಪಡಣೆ", ml: "രാസ തളിപ്പ്", mr: "रासायनिक फवारणी", bn: "রাসায়নিক স্প্রে", gu: "રાસાયણિક છંટકாவ", pa: "ਰਸਾਇਣਕ ਸਪ੍ਰੇ" },
  interval: { ta: "தெளிப்பு இடைவெளி", en: "Spray Interval", hi: "छिड़काव का अंतराल", te: "पिचికారీ వ్యవధి", kn: "ಸಿಂಪಡಣೆ ಮಧ್ಯಂತರ", ml: "തളിപ്പ് ഇടവേള", mr: "फवारणीचे अंतर", bn: "স্প্রে করার ব্যবধান", gu: "છંટકાવ અંતરાલ", pa: "ਸਪ੍ਰੇ ਦਾ ਅੰਤਰਾਲ" },
  safety: { ta: "பாதுகாப்பு முறைகள்", en: "Safety Measures", hi: "सुरक्षा उपाय", te: "భద్రతా చర్యలు", kn: "ಸುರಕ್ಷತಾ ಕ್ರಮಗಳು", ml: "സുരക്ഷാ മുൻകരുതലുകൾ", mr: "सुरक्षा उपाय", bn: "সুরক্ষা ব্যবস্থা", gu: "સુરક્ષા પગલાં", pa: "ਸੁਰੱਖਿਆ ਦੇ ਉਪਾਅ" },
  hide_report: { ta: "அறிக்கையை மறை (Hide PDF Report)", en: "Hide PDF Report", hi: "रिपोर्ट छुपाएं", te: "నిवेదికను దాచండి", kn: "ವರದಿ ಮರೆಮಾಡಿ", ml: "റിപ്പോർട്ട് മറയ്ക്കുക", mr: "अहवाल लपवा", bn: "রিপোর্ট লুকান", gu: "અહેવાલ છુપાવો", pa: "ਰਿਪੋਰਟ ਛੁਪਾਓ" },
  view_report: { ta: "அறிக்கை தரவிறக்கம் (View PDF Report)", en: "View PDF Report", hi: "रिपोर्ट देखें", te: "నివేదికను చూడండి", kn: "ವರದಿ ವೀಕ್ಷಿಸಿ", ml: "റിപ്പോർട്ട് കാണുക", mr: "अहवाल पहा", bn: "রিপোর্ট দেখুন", gu: "અહેવાલ જુઓ", pa: "ਰਿਪੋਰਟ ਦੇਖੋ" },
  results_here: { ta: "முடிவுகள் இங்கே காட்டப்படும்.", en: "Results will be shown here.", hi: "परिणाम यहाँ दिखाए जाएंगे।", te: "ఫలితాలు ఇక్కడ చూపబడతాయి.", kn: "ఫలితాలు ఇక్కడ చూపబడతాయి.", ml: "ഫലങ്ങൾ ഇവിടെ കാണിക്കും.", mr: "निकाल येथे दर्शविले जातील.", bn: "ফলাফল এখানে দেখানো হবে।", gu: "પરિણામો અહીં દર્શાવવામાં આવશે.", pa: "ਨਤੀਜੇ ਇੱਥੇ ਦਿਖਾਏ ਜਾਣਗੇ।" },
  upload_instr: { ta: "இலை புகைப்படத்தைப் பதிவேற்றி பரிசோதிக்கவும்.", en: "Please upload a leaf photo to begin diagnosis.", hi: "निदान शुरू करने के लिए कृपया एक पत्ती का फोटो अपलोड करें।", te: "దయచేసి నిర్ధారణ ప్రారంభించడానికి ఆకు ఫోటోను అప్‌లోడ్ చేయండి.", kn: "ರೋಗ ಪತ್ತೆ ಹಚ್ಚಲು ದಯವಿಟ್ಟು ಎಲೆಯ ಫೋಟೋ ಅಪ್‌ಲೋಡ್ ಮಾಡಿ.", ml: "പരിശോധന ആരംഭിക്കുന്നതിന് ദയവായി ഇലയുടെ ഫോട്ടോ അപ്‌ലോഡ് ചെയ്യുക.", mr: "निदान सुरू करण्यासाठी कृपया पानाचा फोटो अपलोड करा.", bn: "রোগ নির্ণয় শুরু করতে অনুগ্রহ করে পাতার ছবি আপলোড করুন।", gu: "નિદાન શરૂ કરવા માટે કૃપા કરીને પાનનો ફોટો અપલોડ કરો.", pa: "ਨਿਦਾਨ ਸ਼ੁਰੂ ਕਰਨ ਲਈ ਕਿਰਪา ਕਰਕੇ ਪੱਤੇ ਦੀ ਫੋਟੋ ਅਪਲੋਡ ਕਰੋ।" },
  xai_title: { ta: "விளக்கக்கூடிய செயற்கை நுண்ணறிவு (Explainable AI - XAI)", en: "Explainable AI (Grad-CAM Heatmap)", hi: "व्याख्यात्मक एआई (Explainable AI)", te: "వివరణాత్మక AI", kn: "ವಿವರಣಾತ್ಮಕ AI", ml: "വിശദീകരിക്കാവുന്ന AI", mr: "स्पष्टीकरणात्मक एआय", bn: "ব্যাখ্যাযোগ্য এআই", gu: "વર્ણનાત્મક AI", pa: "ਵਿਆਖਿਆਯੋਗ AI" },
  xai_desc: {
    ta: "விவசாயிகளுக்கு நரம்பியல் வலைப்பின்னலின் முடிவுகளின் நம்பகத்தன்மையை உறுதிசெய்ய Grad-CAM வெப்ப வரைபடம் (Heatmap) மூலம் இலையின் எந்தெந்த பகுதிகள் disease hotspots என்று கண்டறிய பயன்படுத்தப்பட்டது என்பதைக் காட்டுகிறது.",
    en: "To ensure decision trustworthiness for farmers, Grad-CAM visually highlights leaf pixels representing 'disease hotspots' that led the deep neural network to make its diagnosis.",
    hi: "किसानों के लिए निर्णय की विश्वसनीयता सुनिश्चित करने के लिए, Grad-CAM विजुअल हाइलाइट्स 'रोग हॉटस्पॉट' का प्रतिनिधित्व करने वाले पत्ती पिक्सेल दिखाता है जिसने तंत्रिका नेटवर्क को अपना निदान करने के लिए प्रेरित किया।",
    te: "రైతులకు నిర్ణయాల విశ్వసనీయతను నిర్ధారించడానికి, Grad-CAM దృశ్య హైలైట్‌లు 'తెగులు హాట్‌స్పాట్‌లను' సూచించే ఆకు పిక్సెల్‌లను చూపుతాయి.",
    kn: "ರೈತರಿಗೆ ನಿರ್ಧಾರಗಳ ವಿಶ್ವಾಸಾರ್ಹತೆಯನ್ನು ಖಚಿತಪಡಿಸಿಕೊಳ್ಳಲು, ಗ್ರಾಡ್-ಸಿಎಎಂ ದೃಶ್ಯ ಮುಖ್ಯಾಂಶಗಳು 'ರೋಗದ ಹಾಟ್‌ಸ್ಪಾಟ್‌ಗಳನ್ನು' ಪ್ರತಿನಿಧಿಸುವ ಎಲೆಯ ಪಿಕ್ಸೆಲ್‌ಗಳನ್ನು ತೋರಿಸುತ್ತವೆ.",
    ml: "തീരുമാനങ്ങളുടെ വിശ്വാസ്യത ഉറപ്പാക്കാൻ, ഗ്രേഡ്-കാം വിഷ്വൽ ഹൈലൈറ്റുകൾ 'രോഗ ഹോട്ട്‌സ്‌പോട്ടുകളെ' പ്രതിനിധീകരിക്കുന്ന ഇല പിക്‌സലുകൾ കാണിക്കുന്നു.",
    mr: "शेतकऱ्यांसाठी निर्णयाची विश्वासार्हता सुनिश्चित करण्यासाठी, Grad-CAM दृश्य ठळक मुद्दे 'रोग हॉटस्पॉट' दर्शवणारे पानावरील पिक्सेल दर्शवतात.",
    bn: "কৃষকদের জন্য সিদ্ধান্তের নির্ভরযোগ্যতা নিশ্চিত করতে, Grad-CAM ভিজ্যুয়াল হাইলাইটগুলি 'রোগের হটস্পট' প্রতিনিধিত্বকারী পাতার পিক্সেল দেখায়।",
    gu: "ખેડૂતો માટે નિર્ણયોની વિશ્વસનીયતા સુનિશ્चિત કરવા માટે, Grad-CAM વિઝ્યુઅલ હાઇલાઇટ્સ 'રોગ હોટસ્પોટ્સ' દર્શાવે છે.",
    pa: "ਕਿਸਾਨਾਂ ਲਈ ਫੈਸਲੇ ਦੀ ਭਰੋਸੇਯੋਗਤਾ ਨੂੰ ਯਕੀਨੀ ਬਣਾਉਣ ਲਈ, Grad-CAM ਵਿਜ਼ੂਅਲ ਹਾਈਲਾਈਟਸ 'ਰੋਗ ਹੌਟਸਪੌਟਸ' ਨੂੰ ਦਰਸਾਉਂਦੇ ਪੱਤੇ ਦੇ ਪਿਕਸਲ ਦਿਖਾਉਂਦੇ ਹਨ।"
  },
  original_leaf: { ta: "பயிரின் அசல் இலை", en: "Original Leaf Image", hi: "मूल पत्ती की छवि", te: "అసలు ఆకు చిత్రం", kn: "ಮೂಲ ಎಲೆಯ ಚಿತ್ರ", ml: "യഥാർത്ഥ ഇല ചിത്രം", mr: "मूळ पानाचे चित्र", bn: "আসল পাতার ছবি", gu: "મૂળ પાનની છબી", pa: "ਅਸਲ ਪੱਤੇ ਦੀ ਫੋਟੋ" },
  grad_cam: { ta: "Grad-CAM வெப்ப வரைபடம்", en: "Grad-CAM Hotspots Heatmap", hi: "ग्रेड-सीएएम हीटमैप", te: "Grad-CAM హీట్‌మ్యాప్", kn: "ಗ್ರಾಡ್-ಸಿಎಎಂ ಹೀಟ್‌ಮ್ಯಾಪ್", ml: "ഗ്രേഡ്-കാം ഹീറ്റ്മാപ്പ്", mr: "Grad-CAM हीटमॅप", bn: "Grad-CAM হিটম্যাপ", gu: "Grad-CAM હીટમેપ", pa: "Grad-CAM ਹੀਟਮੈਪ" },
  hotspots: { ta: "கண்டறியப்பட்ட நோய் பாதிப்பு பகுதி", en: "Detected Disease Focus Area", hi: "सटीक रोग फोकस क्षेत्र", te: "కనుగొనబడిన తెగులు ప్రాంతం", kn: "ಪತ್ತೆಯಾದ ರೋಗದ ಪ್ರದೇಶ", ml: "കണ്ടെത്തിയ രോഗ പ്രദേശം", mr: "आढळलेले रोग क्षेत्र", bn: "সনাক্তকৃত রোগের এলাকা", gu: "શોધાયેલ રોગ વિસ્તાર", pa: "ਲੱਭਿਆ ਗਿਆ ਰੋਗ ਖੇਤਰ" },
  recovery_title: { ta: "பயிர் மீட்சி ஒப்பீடு (Recovery Photo Comparison)", en: "Crop Recovery Photo Comparison", hi: "फसल सुधार फोटो तुलना", te: "పంట రికవరీ ఫోటో పోలిక", kn: "ಬೆಳೆ ಚೇತರಿಕೆ ಫೋಟೋ ಹೋಲಿಕೆ", ml: "വിള വീണ്ടെടുക്കൽ ഫോട്ടോ താരതമ്യം", mr: "पीक सुधारणा फोटो तुलना", bn: "ফসল পুনরুদ্ধার ফটো তুলনা", gu: "પાક સુધારણા ફોટો સરખામણી", pa: "ਫਸਲ ਸੁਧਾਰ ਫੋਟੋ ਤੁਲਨਾ" },
  select_original: { ta: "பழைய நோய் பாதிப்பு பதிவு (Select Original Case)", en: "Select Original Case File", hi: "मूल मामला फ़ाइल चुनें", te: "అసలు కేసు ఫైల్‌ను ఎంచుకోండి", kn: "ಮೂಲ ಕೇಸ್ ಫೈಲ್ ಆಯ್ಕೆಮಾಡಿ", ml: "യഥാർത്ഥ കേസ് ഫയൽ തിരഞ്ഞെടുക്കുക", mr: "मूळ केस फाईल निवडा", bn: "আসল কেস ফাইল নির্বাচন করুন", gu: "મૂળ કેસ ફાઇલો પસંદ કરો", pa: "ਅਸਲ ਕੇਸ ਫਾਈਲ ਚੁਣੋ" },
  select_placeholder: { ta: "-- தேர்ந்தெடுக்கவும் (Select) --", en: "-- Select Case File --", hi: "-- मामला फाइल चुनें --", te: "-- కేస్ ఫైల్ ఎంచుకోండి --", kn: "-- ಕೇಸ್ ಫೈಲ್ ಆಯ್ಕೆಮಾಡಿ --", ml: "-- കേസ് ഫയൽ തിരഞ്ഞെടുക്കുക --", mr: "-- केस फाईल निवडा --", bn: "-- কেস ফাইল নির্বাচন করুন --", gu: "-- કેસ ફાઇલ પસંદ કરો --", pa: "-- ਕੇਸ ਫਾਈਲ ਚੁਣੋ --" },
  upload_recovery: { ta: "மீண்டெழும் புதிய இலை புகைப்படம் (Upload New Recovery Leaf)", en: "Upload New Recovery Leaf Photo", hi: "नया रिकवरी लीफ फोटो अपलोड करें", te: "కొత్త రికవరీ ఆకు ఫోటోను అప్‌లోడ్ చేయండి", kn: "ಹೊಸ ಚೇತರಿಕೆ ಎಲೆಯ ಫೋಟೋ ಅಪ್‌ಲೋಡ್ ಮಾಡಿ", ml: "പുതിയ വീണ്ടെടുക്കൽ ഇല ഫോട്ടോ അപ്‌ലോഡ് ചെയ്യുക", mr: "नवीन रिकव्हरी पानाच्या फोटो अपलोड करा", bn: "নতুন রিকভারি পাতার ছবি আপলোড করুন", gu: "નવો રિકવરી લીફ ફોટો અપલોડ કરો", pa: "ਨਵੀਂ ਰਿਕਵਰੀ ਪੱਤੇ ਦੀ ਫੋਟੋ ਅਪਲੋડ ਕਰੋ" },
  browse: { ta: "புதிய புகைப்படத்தை தேர்ந்தெடுக்கவும் (Browse)", en: "Browse New Leaf Photo", hi: "नया फोटो चुनें", te: "బ్రౌజ్ చేయండి", kn: "ಬ್ರೌಸ್ ಮಾಡಿ", ml: "ബ്രൗസ് ചെയ്യുക", mr: "निवडा", bn: "ব্রাউজ করুন", gu: "પસંદ કરો", pa: "ਚੁਣੋ" },
  use_recovery_demo: { ta: "டெமோ படம் பயன்படுத்தவும் (Use Recovery Demo Leaf)", en: "Use Recovery Demo Leaf", hi: "रिकवरी डेमो पत्ती का प्रयोग करें", te: "రికవరీ డెమో ఆకును ఉపయోగించండి", kn: "ಚೇತರಿಕೆ ಡೆಮೊ ಎಲೆ ಬಳಸಿ", ml: "വീണ്ടെടുക്കൽ ഡെമോ ഇല ഉപയോഗിക്കുക", mr: "रिकव्हरी डेमो पान वापरा", bn: "রিকভারি ডেমো পাতা ব্যবহার করুন", gu: "રિકવરી ડેમો પાન વાપરો", pa: "ਰਿਕਵਰੀ ਡੈਮੋ ਪੱਤਾ ਵਰਤੋ" },
  comparing: { ta: "ஒப்பிடுகிறது (AI comparing images...)", en: "AI comparing recovery progress...", hi: "सुधार प्रगति की तुलना हो रही है...", te: "రికవరీ పురోగతిని పోలుస్తోంది...", kn: "ಚೇತರಿಕೆ ಪ್ರಗತಿಯನ್ನು ಹೋಲಿಸಲಾಗುತ್ತಿದೆ...", ml: "വീണ്ടെടുക്കൽ പുരോഗതി താരതമ്യം ചെയ്യുന്നു...", mr: "सुधारणा प्रगतीची तुलना होत आहे...", bn: "পুনরুদ্ধার অগ্রগতি তুলনা করা হচ্ছে...", gu: "सुધારણા પ્રગતિની સરખામણી થઈ રહી છે...", pa: "ਸੁਧਾਰ ਦੀ ਪ੍ਰਗਤੀ ਦੀ ਤੁਲਨਾ ਕੀਤੀ ਜਾ ਰਹੀ ਹੈ..." },
  compare_btn: { ta: "சிகிச்சை முன்னேற்றம் காண்க (Compare & Analyze Recovery)", en: "Compare & Analyze Recovery Progress", hi: "सुधार प्रगति की तुलना और विश्लेषण करें", te: "రికవరీ పురోగతిని సరిపోల్చండి & విశ్లేషించండి", kn: "ಚೇತರಿಕೆ ಪ್ರಗತಿಯನ್ನು ಹೋಲಿಸಿ ಮತ್ತು ವಿಶ್ಲೇಷಿಸಿ", ml: "വീണ്ടെടുക്കൽ പുരോഗതി താരതമ്യം ചെയ്യുക & വിശകലനം ചെയ്യുക", mr: "सुधारणा प्रगतीची तुलना आणि विश्लेषण करा", bn: "পুনরুদ্ধার অগ্রগতি তুলনা এবং বিশ্লেষণ করুন", gu: "सुધારણા પ્રगતિની સરખામણી અને વિશ્લેષણ કરો", pa: "ਸੁਧਾਰ ਦੀ ਪ੍ਰਗਤੀ ਦੀ ਤੁਲਨਾ ਅਤੇ ਵਿਸ਼ਲੇਸ਼ਣ ਕਰੋ" },
  improved: { ta: "பயிர் குணமடைந்தது!", en: "Crop Health Improved!", hi: "फसल के स्वास्थ्य में सुधार हुआ!", te: "పంట ఆరోగ్యం మెరుగుపడింది!", kn: "ಬೆಳೆ ಆರೋಗ್ಯ ಸುಧಾರಿಸಿದೆ!", ml: "വിള ആരോഗ്യം മെച്ചപ്പെട്ടു!", mr: "पीक आरोग्य सुधारले!", bn: "ফসলের স্বাস্থ্যের উন্নতি হয়েছে!", gu: "પાક આરોગ્ય સુધર્યું!", pa: "ਫਸਲ ਦੀ ਸਿਹਤ ਵਿੱਚ ਸੁਧਾਰ ਹੋਇਆ ਹੈ!" },
  before: { ta: "பாதிப்பின் போது (Before)", en: "During Infection (Before)", hi: "संक्रमण के दौरान (पहले)", te: "తెగులు సోకినప్పుడు (ముందు)", kn: "ರೋಗದ ಸಮಯದಲ್ಲಿ (ಮೊದಲು)", ml: "രോഗബാധ സമയത്ത് (മുമ്പ്)", mr: "संसर्गादरम्यान (पूर्वी)", bn: "আক্রান্ত অবস্থায় (আগে)", gu: "ચેપ દરમિયાન (પહેલાં)", pa: "ਬਿਮਾਰੀ ਦੌਰਾਨ (ਪਹਿਲਾਂ)" },
  after: { ta: "சிகிச்சைக்குப் பின் (After)", en: "After Treatment (After)", hi: "उपचार के बाद", te: "చికిత్స తర్వాత", kn: "ಚಿಕಿತ್ಸೆಯ ನಂತರ", ml: "ചികിത്സയ്ക്ക് ശേഷം", mr: "उपचारानंतर", bn: "চিকিৎসার পরে", gu: "સારવાર પછી", pa: "ਇਲਾਜ ਤੋਂ ਬਾਅਦ" },
  rate: { ta: "மீட்சி முன்னேற்றம் (Recovery Rate)", en: "Recovery Progress Rate", hi: "सुधार की दर", te: "రికవరీ రేటు", kn: "ಚೇತರಿಕೆ ದರ", ml: "വീണ്ടെടുക്കൽ നിരക്ക്", mr: "सुधारणा दर", bn: "পুনরুদ্ধারের হার", gu: "રિકવરી રેટ", pa: "ਠੀਕ ਹੋਣ ਦੀ ਦਰ" },
  analysis_desc: {
    ta: "AI ஒப்பீட்டு பகுப்பாய்வு: பூஞ்சை புள்ளிகளின் அளவு மற்றும் பரவல் கணிசமாகக் குறைந்துள்ளது. இலை ஆரோக்கிய புள்ளிகள் மேம்பட்டுள்ளது. சிகிச்சையைத் தொடரவும்.",
    en: "AI Comparison Analysis: Visible necrotic/fungal spot density has drastically reduced. Normalized leaf health score has recovered significantly. Please continue the prescribed treatment schedule.",
    hi: "एआई तुलना विश्लेषण: दृश्य फंगल धब्बों का घनत्व काफी कम हो गया है। पत्ती स्वास्थ्य स्कोर में काफी सुधार हुआ है। कृपया निर्धारित उपचार जारी रखें।",
    te: "AI పోలిక విశ్లేషణ: కనిపించే ఫంగల్ మచ్చల సాంద్రత గణనీయంగా తగ్గింది. ఆకు ఆరోగ్య స్కోరు గణనీయంగా మెరుగుపడింది. దయచేసి సూచించిన చికిత్సను కొనసాగించండి.",
    kn: "AI ಹೋಲಿಕೆ ವಿಶ್ಲೇಷಣೆ: ಶಿಲೀಂಧ್ರಗಳ ಚುಕ್ಕೆಗಳ ಸಾಂದ್ರತೆಯು ಗಣನೀಯವಾಗಿ ಕಡಿಮೆಯಾಗಿದೆ. ಎಲೆ ಆರೋಗ್ಯ ಸ್ಕೋರ್ ಗಣನೀಯವಾಗಿ ಸುಧಾರಿಸಿದೆ. ದಯವಿಟ್ಟು ಸೂಚಿಸಿದ ಚಿಕಿತ್ಸೆಯನ್ನು ಮುಂದುವರಿಸಿ.",
    ml: "AI താരതമ്യ വിശകലനം: ദൃശ്യമായ ഫംഗസ് പാടുകളുടെ സാന്ദ്രത ഗണ്യമായി കുറഞ്ഞു. ഇലകളുടെ ആരോഗ്യ സ്കോർ ഗണ്യമായി മെച്ചപ്പെട്ടു. ദയവായി നിർദ്ദേശിച്ച ചികിത്സ തുടരുക.",
    mr: "एआय तुलना विश्लेषण: दृश्यमान बुरशीजन्य डागांची घनता लक्षणीयरीत्या कमी झाली आहे. पानांच्या आरोग्य स्कोअरमध्ये लक्षणीय सुधारणा झाली आहे. कृपया विहित उपचार सुरू ठेवा.",
    bn: "AI তুলনা বিশ্লেষণ: দৃশ্যমান ছত্রাকের দাগের ঘনত্ব নাটকীয়ভাবে হ্রাস পেয়েছে। পাতার স্বাস্থ্য স্কোর উল্লেখযোগ্যভাবে উন্নত হয়েছে। অনুগ্রহ করে নির্ধারিত চিকিৎসা চালিয়ে যান।",
    gu: "AI સરખામણી વિશ્લેષણ: ફૂગના ડાઘની ઘનતામાં નોંધપાત્ર ઘટાડો થયો છે. પાન આરોગ્ય સ્કોર નોંધપાત્ર રીતે સુધર્યો છે. કૃપા કરીને સૂચવેલ સારવાર ચાલુ રાખો.",
    pa: "AI ਤੁਲਨਾਤਮਕ ਵਿਸ਼ਲੇਸ਼ਣ: ਉੱਲੀ ਦੇ ਧੱਬਿਆਂ ਦੀ ਘਣਤਾ ਕਾਫ਼ੀ ਘੱਟ ਗਈ ਹੈ। ਪੱਤੇ ਦੀ ਸਿਹਤ ਦਾ ਸਕੋਰ ਕਾਫ਼ੀ ਸੁਧਰਿਆ ਹੈ। ਕਿਰਪา ਕਰਕੇ ਦੱਸਿਆ ਗਿਆ ਇਲਾਜ ਜਾਰੀ ਰੱਖੋ।"
  },
  recovery_placeholder_desc: { ta: "பழைய நோய் பதிவைத் தேர்வு செய்து புதிய இலை புகைப்படத்தைப் பதிவேற்றவும்.", en: "Please select an original case from your history, and upload a new leaf photo to run comparison.", hi: "कृपया अपने इतिहास से एक मूल मामला चुनें, और तुलना चलाने के लिए एक नया पत्ता फोटो अपलोड करें।", te: "దయచేసి మీ చరిత్ర నుండి అసలు కేసును ఎంచుకోండి మరియు పోలికను రన్ చేయడానికి కొత్త ఆకు ఫోటోను అప్‌లోड చేయండి.", kn: "ದಯವಿಟ್ಟು ನಿಮ್ಮ ಇತಿಹಾಸದಿಂದ ಮೂಲ ಪ್ರಕರಣವನ್ನು ಆಯ್ಕೆಮಾಡಿ ಮತ್ತು ಹೋಲಿಕೆಯನ್ನು ನಡೆಸಲು ಹೊಸ ಎಲೆಯ ಫೋಟೋವನ್ನು ಅಪ್‌ಲೋಡ್ ಮಾಡಿ.", ml: "ദയവായി നിങ്ങളുടെ ചരിത്രത്തിൽ നിന്ന് ഒരു യഥാർത്ഥ കേസ് തിരഞ്ഞെടുക്കുക, താരതമ്യം ചെയ്യുന്നതിനായി ഒരു പുതിയ ഇല ഫോട്ടോ അപ്‌ലോഡ് ചെയ്യുക.", mr: "कृपया तुमच्या इतिहासातून मूळ केस निवडा आणि तुलना चालवण्यासाठी नवीन पानाचा फोटो अपलोड करा.", bn: "অনুগ্রহ করে আপনার ইতিহাস থেকে একটি মূল কেস নির্বাচন করুন এবং তুলনা করার জন্য একটি নতুন পাতার ছবি আপলোড করুন।", gu: "કૃપયા તમારા ઇતિહાસમાંથી મૂળ કેસ પસંદ કરો અને સરખામણી ચલાવવા માટે નવો પાનનો ફોટો અપલોડ કરો.", pa: "ਕਿਰਪਾ ਕਰਕੇ ਆਪਣੇ ਇਤਿਹਾਸ ਵਿੱਚੋਂ ਇੱਕ ਅਸਲ ਕੇਸ ਚੁਣੋ, ਅਤੇ ਤੁਲਨਾ ਕਰਨ ਲਈ ਇੱਕ ਨਵੀਂ ਪੱਤੇ ਦੀ ਫੋਟੋ ਅਪਲੋਡ ਕਰੋ।" },
  print: { ta: "அச்சு செய் (Print/Save PDF)", en: "Print/Save PDF Report", hi: "प्रिंट / पीडीएफ सहेजें", te: "ప్రింట్ / PDF సేవ్ చేయండి", kn: "ಪ್ರಿಂಟ್ / PDF ಉಳಿಸಿ", ml: "പ്രിന്റ് ചെയ്യുക / PDF സേവ് ചെയ്യുക", mr: "प्रिंट / पीडीएफ जतन करा", bn: "প্রিন্ট / পিডিএফ সংরক্ষণ করুন", gu: "પ્રિન્ટ / પીડીએફ સેવ કરો", pa: "ਪ੍ਰਿੰਟ / PDF ਸੇਵ ਕਰੋ" },
  crop_info_section: { ta: "பயிர் விவரம் (Crop Information)", en: "Crop Information", hi: "फसल विवरण", te: "పంట సమాచారం", kn: "ಬೆಳೆ ಮಾಹಿತಿ", ml: "വിള വിവരങ്ങൾ", mr: "पीक माहिती", bn: "ফসলের বিবরণ", gu: "પાકની માહિતી", pa: "ਫਸਲ ਦੀ ਜਾਣਕਾਰੀ" },
  detected_disease: { ta: "கண்டறியப்பட்ட நோய் (Detected Disease)", en: "Detected Disease", hi: "पहचाना गया रोग", te: "కనుగొనబడిన తెగులు", kn: "ಪತ್ತೆಯಾದ ರೋಗ", ml: "കണ്ടെത്തിയ രോഗം", mr: "आढळलेला रोग", bn: "সনাক্তকৃত রোগ", gu: "શોધાયેલ રોગ", pa: "ਲੱਭਿਆ ਗਿਆ ਰੋਗ" },
  ai_confidence: { ta: "துல்லியம் (AI Confidence)", en: "AI Confidence Score", hi: "एी सटीकता स्कोर", te: "AI విశ్వసనీయత స్కోరు", kn: "AI ವಿಶ್ವಾಸಾರ್ಹತೆ ಸ್ಕೋರ್", ml: "AI ആത്മവിശ്വാസ സ്‌കോർ", mr: "एआय विश्वासार्हता स्कोअर", bn: "AI আত্মবিশ্বাস স্কোর", gu: "AI આત્મવિશ્વાસ સ્કોર", pa: "AI ਭਰੋਸੇਯੋਗਤਾ ਸਕੋਰ" },
  severity_title: { ta: "பாதிப்பு விகிதம் (Severity)", en: "Severity & Coverage", hi: "तीव्रता और कवरेज", te: "తీव्रత మరియు కవరేజ్", kn: "ತೀವ್ರತೆ ಮತ್ತು ವ್ಯಾಪ್ತಿ", ml: "തീവ്രതയും വ്യാപ്തിയും", mr: "तीव्रता आणि व्याप्ती", bn: "তীব্রতা এবং ব্যাপ্তি", gu: "તીવ્રતા અને વ્યાપ", pa: "ਤੀਬਰਤਾ ਅਤੇ ਪ੍ਰਭਾਵ" },
  prescription: { ta: "சிகிச்சை விதிமுறைகள் (Prescription Details)", en: "Prescription Details", hi: "उपचार के नियम", te: "చికిత్స నియమాలు", kn: "ಚಿಕಿತ್ಸೆಯ ನಿಯಮಗಳು", ml: "ചികിത്സാ നിർദ്ദേശങ്ങൾ", mr: "उपचार तपशील", bn: "প্রেসক্রিপশন বিবরণ", gu: "સારવાર વિગતો", pa: "ਇਲਾਜ ਦੇ ਵੇਰਵੇ" },
  organic_list: { ta: "இயற்கை உரம் (Organic)", en: "Organic Recommendation", hi: "जैविक सिफारिश", te: "సేంద్రీయ సిఫార్సు", kn: "ಸಾವಯವ ಶಿಫಾರಸು", ml: "ജൈവ ശുപാർശ", mr: "सेंद्रिय शिफारस", bn: "জৈব সুপারিশ", gu: "ઓર્ગેનિક ભલામણ", pa: "ਜੈਵਿਕ ਸਿਫਾਰਸ਼" },
  chemical_list: { ta: "பூச்சிக்கொல்லி (Chemical)", en: "Chemical Recommendation", hi: "रासायनिक सिफारिश", te: "రసాయన సిఫార్సు", kn: "ರಾಸಾಯನಿಕ ಶಿಫಾರಸು", ml: "രാസ ശുപാർശ", mr: "रासायनिक शिफारस", bn: "রাসায়নিক সুপারিশ", gu: "રાસાયણિક ભલામણ", pa: "ਰਸਾਇਣਕ ਸਿਫਾਰਸ਼" }
};

export default function Diagnostics({ crops, history, onDetect, onCompare, token, language = 'ta' }: DiagnosticsProps) {
  const [subTab, setSubTab] = useState<'detect' | 'xai' | 'recovery'>('detect');
  
  // Detection Page States
  const [selectedCrop, setSelectedCrop] = useState('Auto-Detect');
  const [selectedCropId, setSelectedCropId] = useState('');
  const [image64, setImage64] = useState<string | null>(null);
  const [detecting, setDetecting] = useState(false);
  const [latestResult, setLatestResult] = useState<DiseaseHistory | null>(null);
  const [showReport, setShowReport] = useState(false);

  // Recovery Page States
  const [selectedHistoryId, setSelectedHistoryId] = useState('');
  const [recoveryImage, setRecoveryImage] = useState<string | null>(null);
  const [comparing, setComparing] = useState(false);
  const [compareResult, setCompareResult] = useState<RecoveryMonitoring | null>(null);

  const [errorMsg, setErrorMsg] = useState('');

  // File handler for Detection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = reader.result as string;
      setImage64(base64);
      setLatestResult(null); // Reset previous
      setDetecting(true);
      setErrorMsg('');
      try {
        const res = await onDetect(selectedCrop || 'Auto-Detect', base64, selectedCropId || undefined);
        setLatestResult(res);
      } catch (err: any) {
        setErrorMsg('கண்டறிதலில் பிழை. Please check database configuration.');
      } finally {
        setDetecting(false);
      }
    };
    reader.readAsDataURL(file);
  };

  // Simulated Camera trigger
  const triggerCameraDemo = () => {
    // We use a high quality mock farm leaf photo for testing in the browser
    const sampleLeaf = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAP//////////////////////////////////////////////////////////////////////////////////////wgALCAEGAAEBASIA/8QAFBABAAAAAAAAAAAAAAAAAAAAAP/aAAgBAQABPxA=';
    setImage64(sampleLeaf);
    setLatestResult(null);
    setDetecting(true);
    setErrorMsg('');
    onDetect(selectedCrop || 'Auto-Detect', sampleLeaf, selectedCropId || undefined)
      .then(res => setLatestResult(res))
      .catch(() => setErrorMsg('கண்டறிதலில் பிழை. Please check database configuration.'))
      .finally(() => setDetecting(false));
  };

  const handleRunDetection = async () => {
    if (!selectedCrop || !image64) return;
    setDetecting(true);
    setErrorMsg('');
    try {
      const res = await onDetect(selectedCrop, image64, selectedCropId || undefined);
      setLatestResult(res);
    } catch (e) {
      setErrorMsg('கண்டறிதலில் பிழை. Please check database configuration.');
    } finally {
      setDetecting(false);
    }
  };

  // File handler for Recovery comparison
  const handleRecoveryFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setRecoveryImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleRunRecoveryCompare = async () => {
    if (!selectedHistoryId || !recoveryImage) return;
    setComparing(true);
    try {
      const res = await onCompare(selectedHistoryId, recoveryImage);
      setCompareResult(res);
    } catch (e) {
      console.error(e);
    } finally {
      setComparing(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      
      {/* Tab Selectors */}
      <div className="flex border-b border-slate-200 mb-8 overflow-x-auto whitespace-nowrap gap-6" id="diagnostics-tabs-list">
        <button
          onClick={() => setSubTab('detect')}
          className={`pb-4 text-xs sm:text-sm font-extrabold border-b-2 transition-all ${
            subTab === 'detect' ? 'border-slate-900 text-slate-900' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
          id="tab-disease-ai"
        >
          {dTrans.tab_disease[language]}
        </button>
        <button
          onClick={() => setSubTab('xai')}
          className={`pb-4 text-xs sm:text-sm font-extrabold border-b-2 transition-all ${
            subTab === 'xai' ? 'border-slate-900 text-slate-900' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
          id="tab-grad-cam-xai"
        >
          {dTrans.tab_xai[language]}
        </button>
        <button
          onClick={() => setSubTab('recovery')}
          className={`pb-4 text-xs sm:text-sm font-extrabold border-b-2 transition-all ${
            subTab === 'recovery' ? 'border-slate-900 text-slate-900' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
          id="tab-recovery-check"
        >
          {dTrans.tab_recovery[language]}
        </button>
      </div>

      {errorMsg && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 text-xs rounded-lg border border-red-100 flex items-center space-x-2">
          <AlertTriangle className="h-4 w-4" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* =========================================
          SUB-TAB 1: DISEASE DETECTION
         ========================================= */}
      {subTab === 'detect' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Diagnostic upload box */}
          <div className="space-y-6">
            <div className="bg-white border border-slate-200 p-6 rounded-3xl shadow-sm">
              <h3 className="text-base font-extrabold text-slate-900 mb-4">{dTrans.new_leaf[language]}</h3>
              
              <div className="space-y-4">
                {/* Crop Name input */}
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">{dTrans.select_crop_label[language]}</label>
                  <select
                    value={selectedCrop}
                    onChange={(e) => {
                      setSelectedCrop(e.target.value);
                      // Link to ID if matched in crops list
                      const matched = crops.find(c => c.name === e.target.value);
                      if (matched) setSelectedCropId(matched.id);
                    }}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 bg-white font-medium"
                  >
                    <option value="Auto-Detect">{dTrans.auto_detect_opt[language]}</option>
                    <option value="Paddy (நெல்)">{dTrans.paddy[language]}</option>
                    <option value="Tomato (தக்காளி)">{dTrans.tomato[language]}</option>
                    <option value="Maize (சோளம்)">{dTrans.maize[language]}</option>
                    <option value="Cotton (பருத்தி)">{dTrans.cotton[language]}</option>
                    <option value="Banana (வாழை)">{dTrans.banana[language]}</option>
                  </select>
                </div>

                {/* File Upload Box */}
                <div className="border-2 border-dashed border-slate-200 hover:border-slate-900 transition-colors rounded-3xl p-6 text-center bg-slate-50/50">
                  {image64 ? (
                    <div className="space-y-4">
                      <img 
                        src={image64} 
                        alt="Uploaded preview" 
                        className="max-h-48 mx-auto object-cover rounded-xl border border-slate-200"
                        referrerPolicy="no-referrer"
                      />
                      <button
                        onClick={() => setImage64(null)}
                        className="text-xs text-red-600 font-semibold hover:underline"
                      >
                        {dTrans.remove_photo[language]}
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <Upload className="h-10 w-10 text-slate-400 mx-auto" />
                      <div>
                        <p className="text-xs text-slate-500 font-medium">{dTrans.drag_drop[language]}</p>
                        <label className="text-xs text-emerald-600 font-bold hover:underline cursor-pointer block mt-1">
                          {dTrans.browse_file[language]}
                          <input 
                            type="file" 
                            accept="image/*" 
                            onChange={handleFileChange} 
                            className="hidden" 
                          />
                        </label>
                      </div>
                      <p className="text-[10px] text-slate-400 font-mono">JPG, PNG supported up to 5MB</p>

                      <div className="relative flex items-center justify-center my-4">
                        <div className="border-t border-slate-200 w-full"></div>
                        <span className="absolute bg-slate-50 px-3 text-[10px] text-slate-400 font-mono font-medium uppercase">or</span>
                      </div>

                      <button
                        onClick={triggerCameraDemo}
                        type="button"
                        className="inline-flex items-center space-x-1.5 px-4 py-2.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold shadow-sm transition-all cursor-pointer"
                      >
                        <Camera className="h-4 w-4 text-emerald-600" />
                        <span>{dTrans.use_mock[language]}</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* Diagnose Submit Button */}
                <button
                  onClick={handleRunDetection}
                  disabled={detecting || !selectedCrop || !image64}
                  className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold rounded-2xl shadow-lg shadow-emerald-100 transition-all flex items-center justify-center space-x-2 cursor-pointer"
                  id="diagnostics-analyze-btn"
                >
                  {detecting ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      <span>{dTrans.analyzing[language]}</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-5 w-5" />
                      <span>{dTrans.run_diag[language]}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Diagnostic Outcomes details panel */}
          <div>
            {latestResult ? (
              <div className="bg-white border border-slate-200 p-6 rounded-3xl shadow-sm space-y-6 animate-fade-in">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="bg-red-50 border border-red-100 text-red-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider font-mono">
                      {latestResult.severity} Severity
                    </span>
                    <h3 className="text-xl font-extrabold text-slate-900 mt-1.5">{latestResult.diseaseName}</h3>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-slate-400 uppercase font-mono">Confidence rating</p>
                    <p className="text-lg font-black text-emerald-600">{Math.floor(latestResult.confidence * 100)}%</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/60">
                    <p className="text-slate-400 uppercase font-mono text-[9px]">{dTrans.affected_area[language]}</p>
                    <p className="font-extrabold text-slate-800 text-sm mt-0.5">{latestResult.affectedAreaPct}%</p>
                  </div>
                  <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/60">
                    <p className="text-slate-400 uppercase font-mono text-[9px]">{dTrans.recovery_time[language]}</p>
                    <p className="font-extrabold text-slate-800 text-sm mt-0.5">{latestResult.recoveryTime}</p>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider font-mono">{dTrans.description[language]}:</h4>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed font-medium">{latestResult.description}</p>
                </div>

                {/* Cause */}
                <div>
                  <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider font-mono">{dTrans.cause[language]}:</h4>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed font-medium">{latestResult.cause}</p>
                </div>

                {/* Treatment Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-slate-100 pt-4">
                  <div className="bg-emerald-50/20 p-4 rounded-2xl border border-emerald-100/60">
                    <h5 className="font-bold text-emerald-900 text-xs uppercase tracking-wider font-mono">{dTrans.organic[language]}:</h5>
                    <p className="text-xs text-emerald-800 mt-1 leading-relaxed font-medium">{latestResult.organicTreatment}</p>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                    <h5 className="font-bold text-slate-900 text-xs uppercase tracking-wider font-mono">{dTrans.chemical[language]}:</h5>
                    <p className="text-xs text-slate-700 mt-1 leading-relaxed font-medium">{latestResult.chemicalTreatment}</p>
                  </div>
                </div>

                {/* Spray rules */}
                <div className="text-xs space-y-1.5 bg-amber-50/50 p-3.5 rounded-2xl border border-amber-100">
                  <p className="text-amber-950">
                    <strong>{dTrans.interval[language]}:</strong> {latestResult.sprayInterval}
                  </p>
                  <p className="text-amber-950">
                    <strong>{dTrans.safety[language]}:</strong> {latestResult.safetyMeasures}
                  </p>
                </div>

                {/* Download PDF button */}
                <div className="flex space-x-2 pt-2">
                  <button
                    onClick={() => setShowReport(!showReport)}
                    className="flex-1 py-3 bg-slate-900 hover:bg-black text-white text-xs font-bold rounded-2xl flex items-center justify-center space-x-1.5 cursor-pointer"
                  >
                    <Download className="h-4 w-4" />
                    <span>{showReport ? dTrans.hide_report[language] : dTrans.view_report[language]}</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-slate-50 border border-dashed border-slate-200 rounded-3xl h-full flex flex-col items-center justify-center p-8 text-center text-slate-400">
                <ImageIcon className="h-12 w-12 text-slate-300 mb-2" />
                <p className="text-sm font-semibold">{dTrans.results_here[language]}</p>
                <p className="text-[10px] text-slate-400">{dTrans.upload_instr[language]}</p>
              </div>
            )}
          </div>

        </div>
      )}

      {/* =========================================
          SUB-TAB 2: EXPLAINABLE AI (XAI) - GRAD-CAM
         ========================================= */}
      {subTab === 'xai' && (
        <div className="bg-white border border-slate-200 p-6 rounded-3xl shadow-sm space-y-6">
          <div className="max-w-3xl">
            <h3 className="text-base font-extrabold text-slate-900 flex items-center space-x-1.5">
              <Sparkles className="h-5 w-5 text-emerald-600" />
              <span>{dTrans.xai_title[language]}</span>
            </h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              {dTrans.xai_desc[language]}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center pt-4">
            
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase font-mono">Original Image</span>
              <div className="border border-slate-200 rounded-2xl overflow-hidden aspect-square flex items-center justify-center bg-slate-50 max-h-64 mx-auto">
                {image64 ? (
                  <img src={image64} alt="Original" className="object-cover w-full h-full" referrerPolicy="no-referrer" />
                ) : (
                  <span className="text-xs text-slate-400 font-medium">{language === 'ta' ? 'இல்லை (No image)' : 'No image'}</span>
                )}
              </div>
              <p className="text-xs font-bold text-slate-600">{dTrans.original_leaf[language]}</p>
            </div>

            <div className="space-y-2">
              <span className="text-[10px] font-bold text-red-500 uppercase font-mono">AI Heatmap (Grad-CAM)</span>
              <div className="border border-red-100 rounded-2xl overflow-hidden aspect-square flex items-center justify-center bg-red-50 max-h-64 mx-auto relative">
                {image64 ? (
                  <>
                    <img src={image64} alt="Heatmap base" className="object-cover w-full h-full opacity-40 filter saturate-150" referrerPolicy="no-referrer" />
                    {/* Simulated Grad-CAM Heatmap overlay */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/30 via-yellow-500/50 to-red-600/70 mix-blend-color-burn animate-pulse"></div>
                  </>
                ) : (
                  <span className="text-xs text-slate-400 font-medium">{language === 'ta' ? 'இல்லை (No image)' : 'No image'}</span>
                )}
              </div>
              <p className="text-xs font-bold text-red-600">{dTrans.grad_cam[language]}</p>
            </div>

            <div className="space-y-2">
              <span className="text-[10px] font-bold text-emerald-600 uppercase font-mono">Highlighted diseased region</span>
              <div className="border border-emerald-100 rounded-2xl overflow-hidden aspect-square flex items-center justify-center bg-emerald-50 max-h-64 mx-auto relative">
                {image64 ? (
                  <>
                    <img src={image64} alt="Highlighted" className="object-cover w-full h-full filter saturate-200 contrast-125" referrerPolicy="no-referrer" />
                    <div className="absolute inset-0 bg-emerald-500/20 mix-blend-color-burn"></div>
                  </>
                ) : (
                  <span className="text-xs text-slate-400 font-medium">{language === 'ta' ? 'இல்லை (No image)' : 'No image'}</span>
                )}
              </div>
              <p className="text-xs font-bold text-emerald-600">{dTrans.hotspots[language]}</p>
            </div>

          </div>
        </div>
      )}

      {/* =========================================
          SUB-TAB 3: RECOVERY MONITORING
         ========================================= */}
      {subTab === 'recovery' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Recovery Upload inputs */}
          <div className="space-y-6">
            <div className="bg-white border border-slate-200 p-6 rounded-3xl shadow-sm">
              <h3 className="text-base font-extrabold text-slate-900 mb-4">{dTrans.recovery_title[language]}</h3>
              
              <div className="space-y-4">
                {/* Select history record */}
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">{dTrans.select_original[language]}</label>
                  <select
                    value={selectedHistoryId}
                    onChange={(e) => {
                      setSelectedHistoryId(e.target.value);
                      setCompareResult(null); // Reset
                    }}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 bg-white font-medium"
                  >
                    <option value="">{dTrans.select_placeholder[language]}</option>
                    {history.map((record) => (
                      <option key={record.id} value={record.id}>
                        {record.cropName} - {record.diseaseName} ({record.createdAt ? new Date(record.createdAt).toLocaleDateString() : 'Demo'})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Secondary leaf image */}
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">{dTrans.upload_recovery[language]}</label>
                  
                  <div className="border-2 border-dashed border-slate-200 hover:border-slate-900 transition-colors rounded-3xl p-6 text-center bg-slate-50/50">
                    {recoveryImage ? (
                      <div className="space-y-4">
                        <img 
                          src={recoveryImage} 
                          alt="Recovery preview" 
                          className="max-h-48 mx-auto object-cover rounded-xl border border-slate-200"
                          referrerPolicy="no-referrer"
                        />
                        <button
                          onClick={() => setRecoveryImage(null)}
                          className="text-xs text-red-600 font-bold hover:underline"
                        >
                          {dTrans.remove_photo[language]}
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <Upload className="h-8 w-8 text-slate-400 mx-auto" />
                        <label className="text-xs text-emerald-600 font-bold hover:underline cursor-pointer block">
                          {dTrans.browse[language]}
                          <input 
                            type="file" 
                            accept="image/*" 
                            onChange={handleRecoveryFileChange} 
                            className="hidden" 
                          />
                        </label>
                        <button
                          onClick={() => {
                            // High quality demo leaf image for recovery
                            setRecoveryImage('data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAP//////////////////////////////////////////////////////////////////////////////////////wgALCAEGAAEBASIA/8QAFBABAAAAAAAAAAAAAAAAAAAAAP/aAAgBAQABPxA=');
                          }}
                          type="button"
                          className="text-[10px] text-emerald-600 font-bold hover:underline block mx-auto mt-2"
                        >
                          {dTrans.use_recovery_demo[language]}
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Compare Submit Button */}
                <button
                  onClick={handleRunRecoveryCompare}
                  disabled={comparing || !selectedHistoryId || !recoveryImage}
                  className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold rounded-2xl shadow-lg shadow-emerald-100 transition-all flex items-center justify-center space-x-2 cursor-pointer"
                  id="recovery-compare-btn"
                >
                  {comparing ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      <span>{dTrans.comparing[language]}</span>
                    </>
                  ) : (
                    <>
                      <RefreshCw className="h-5 w-5" />
                      <span>{dTrans.compare_btn[language]}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Recovery comparison results */}
          <div>
            {compareResult ? (
              <div className="bg-white border border-slate-200 p-6 rounded-3xl shadow-sm space-y-6 animate-fade-in">
                <div className="text-center">
                  <span className="bg-emerald-50 border border-emerald-100/60 text-emerald-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider font-mono">
                    Comparison Output
                  </span>
                  <h3 className="text-xl font-extrabold text-slate-900 mt-2">{dTrans.improved[language]}</h3>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="border border-slate-200 rounded-2xl overflow-hidden aspect-video bg-slate-50 relative flex items-center justify-center">
                    <img src={history.find(r => r.id === selectedHistoryId)?.imageUrl || image64 || ''} alt="Before" className="object-cover w-full h-full" referrerPolicy="no-referrer" />
                    <span className="absolute bottom-2 left-2 bg-slate-900/80 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">{dTrans.before[language]}</span>
                  </div>
                  <div className="border border-slate-200 rounded-2xl overflow-hidden aspect-video bg-slate-50 relative flex items-center justify-center">
                    <img src={recoveryImage || ''} alt="After" className="object-cover w-full h-full" referrerPolicy="no-referrer" />
                    <span className="absolute bottom-2 left-2 bg-emerald-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">{dTrans.after[language]}</span>
                  </div>
                </div>

                <div className="bg-emerald-50/20 p-4 rounded-2xl border border-emerald-100/60 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-emerald-800 font-bold uppercase tracking-wider font-mono">{dTrans.rate[language]}:</p>
                    <p className="text-2xl font-black text-emerald-600 mt-1">{compareResult.recoveryPct}%</p>
                  </div>
                  <div className="bg-emerald-600 text-white text-xs font-bold px-3 py-1.5 rounded-xl">
                    {compareResult.status}
                  </div>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3.5 rounded-2xl border border-slate-200 font-medium">
                  <strong>AI Comparison:</strong> {dTrans.analysis_desc[language]}
                </p>
              </div>
            ) : (
              <div className="bg-slate-50 border border-dashed border-slate-200 rounded-3xl h-full flex flex-col items-center justify-center p-8 text-center text-slate-400 min-h-[300px]">
                <ImageIcon className="h-12 w-12 text-slate-300 mb-2" />
                <p className="text-sm font-semibold">{dTrans.results_here[language]}</p>
                <p className="text-[10px] text-slate-400">{dTrans.recovery_placeholder_desc[language]}</p>
              </div>
            )}
          </div>

        </div>
      )}

      {/* =========================================
          SIMULATED PDF REPORT MODAL VIEW
         ========================================= */}
      {showReport && latestResult && (
        <div className="mt-8 border border-slate-200 rounded-3xl p-6 sm:p-8 bg-white text-slate-900 shadow-sm relative">
          <div className="absolute top-4 right-4 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold px-3 py-1.5 rounded-xl cursor-pointer transition-all" onClick={() => window.print()}>
            {dTrans.print[language]}
          </div>

          <div className="border-b border-slate-200 pb-4 mb-6">
            <h2 className="text-2xl font-extrabold font-sans text-slate-900">CROPCARE AI Diagnostic Report</h2>
            <p className="text-xs text-slate-500 font-mono">Report ID: RPT_{latestResult.id} • Date Generated: {new Date().toLocaleDateString()}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm mb-6">
            <div>
              <p className="font-bold text-slate-900">{dTrans.crop_info_section[language]}:</p>
              <ul className="list-disc pl-5 mt-1 space-y-1 text-xs text-slate-600 font-medium">
                <li>{language === 'ta' ? 'பயிர்' : 'Crop'}: {latestResult.cropName}</li>
                <li>{dTrans.detected_disease[language]}: {latestResult.diseaseName}</li>
                <li>{dTrans.ai_confidence[language]}: {Math.floor(latestResult.confidence * 100)}%</li>
                <li>{dTrans.severity_title[language]}: {latestResult.severity} ({latestResult.affectedAreaPct}%)</li>
              </ul>
            </div>
            <div>
              <p className="font-bold text-slate-900">{dTrans.prescription[language]}:</p>
              <ul className="list-disc pl-5 mt-1 space-y-1 text-xs text-slate-600 font-medium">
                <li>{dTrans.organic_list[language]}: {latestResult.organicTreatment}</li>
                <li>{dTrans.chemical_list[language]}: {latestResult.chemicalTreatment}</li>
                <li>{dTrans.interval[language]}: {latestResult.sprayInterval}</li>
                <li>{dTrans.recovery_time[language]}: {latestResult.recoveryTime}</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-200 pt-4 flex justify-between items-center text-xs text-slate-500 font-mono">
            <p>Certified by CropCare AI Pathologist Engine</p>
            <p>© 2026 Tamil Vivasayam AI</p>
          </div>
        </div>
      )}

    </div>
  );
}
