import React, { useState, useEffect } from 'react';
import { OutbreakPrediction } from '../types';
import { Brain, Sliders, Sparkles, Loader2, CheckCircle2 } from 'lucide-react';
import { indianStates } from '../lib/regions';
import { translations, Language } from '../lib/translations';

interface PredictionsProps {
  onPredict: (data: Partial<OutbreakPrediction>) => Promise<OutbreakPrediction>;
  globalStateId?: string;
  globalDistrictId?: string;
  language?: Language;
}

const pTrans: Record<string, Record<string, string>> = {
  header_badge: {
    ta: "நோய் பரவல் முன்கணிப்பு (XGBoost)",
    en: "Outbreak Prediction (XGBoost)",
    hi: "प्रकोप भविष्यवाणी (XGBoost)",
    te: "వ్యాప్తి అంచనా (XGBoost)",
    kn: "ರೋಗ ಹರಡುವಿಕೆ ಮುನ್ಸೂಚನೆ (XGBoost)",
    ml: "രോഗബാധ പ്രവചനം (XGBoost)",
    mr: "प्रकोप अंदाज (XGBoost)",
    bn: "প্রাদুর্ভাব পূর্বাভাস (XGBoost)",
    gu: "પ્રકોપની આગાહી (XGBoost)",
    pa: "ਪ੍ਰਕੋਪ ਦੀ ਭਵਿੱਖਬਾਣੀ (XGBoost)"
  },
  header_title: {
    ta: "நோய் பரவல் முன்கணிப்பு (Risk Forecast)",
    en: "Disease Outbreak Forecast",
    hi: "रोग का प्रकोप पूर्वानुमान",
    te: "తెగులు వ్యాప్తి అంచనా",
    kn: "ರೋಗದ ಮುನ್ಸೂಚನೆ",
    ml: "രോഗബാധ പ്രവചനം",
    mr: "रोगाचा प्रकोप अंदाज",
    bn: "রোগের প্রাদুর্ভাব পূর্বাভাস",
    gu: "રોગ પ્રકોપ આગાહી",
    pa: "ਰੋਗ ਦੇ ਪ੍ਰਕੋਪ ਦੀ ਭਵਿੱਖਬਾਣੀ"
  },
  header_desc: {
    ta: "வானிலை காரணிகள் மற்றும் பயிர் வளர்ச்சி நிலைகளைக் கொண்டு பயிர் நோய்கள் பரவும் அபாயத்தை முன்னரே கணித்துத் தடுக்கும் அதிநவீன முன்கணிப்பு கருவி.",
    en: "An advanced predictive tool that uses weather factors and crop growth stages to forecast disease outbreak risk early.",
    hi: "एक उन्नत पूर्वानुमान उपकरण जो मौसम के कारकों और फसल विकास चरणों का उपयोग करके रोग के प्रकोप के जोखिम का पहले ही पूर्वानुमान लगाता है।",
    te: "వాతావరణ కారకాలు మరియు పంట ఎదుగుదల దశలను ఉపయోగించి ముందే తెగులు వ్యాప్తిని అంచనా వేసే అధునాతన సాధనం.",
    kn: "ಹವಾಮಾನ ಅಂಶಗಳು ಮತ್ತು ಬೆಳೆ ಬೆಳವಣಿಗೆಯ ಹಂತಗಳನ್ನು ಬಳಸಿಕೊಂಡು ರೋಗದ ಹರಡುವಿಕೆಯ ಅಪಾಯವನ್ನು ಮೊದಲೇ ಊಹಿಸುವ ಸುಧಾರಿತ ಮುನ್ಸೂಚನೆ ಸಾಧನ.",
    ml: "കാലാവസ്ഥാ ഘടകങ്ങളും വിള വളർച്ചാ ഘട്ടങ്ങളും ഉപയോഗിച്ച് രോഗബാധയുടെ സാധ്യത മുൻകൂട്ടി പ്രവചിക്കുന്നതിനുള്ള നൂതന ഉപകരണം.",
    mr: "हवामान घटक आणि पिकाच्या वाढीच्या टप्प्यांचा वापर करून रोगाचा प्रादुर्भाव होण्याचा धोका आधीच सांगणारे प्रगत साधन.",
    bn: "আবহাওয়া এবং ফসলের বৃদ্ধির ধাপগুলি বিশ্লেষণ করে রোগের প্রাদুর্ভাবের ঝুঁকি আগে থেকে অনুমান করার একটি উন্নত পদ্ধতি।",
    gu: "હવામાનના પરિબળો અને પાકના વિકાસના તબક્કાઓનો ઉપયોગ કરીને રોગ ફેલાવવાની આગાહી કરતું અત્યાધુનિક સાધન.",
    pa: "ਮੌਸਮ ਦੇ ਕਾਰਕਾਂ ਅਤੇ ਫਸਲਾਂ ਦੇ ਵਾਧੇ ਦੇ ਪੜਾਵਾਂ ਦੀ ਵਰਤੋਂ ਕਰਕੇ ਰੋਗ ਦੇ ਪ੍ਰਕੋਪ ਦੇ ਜੋਖਮ ਦਾ ਪਹਿਲਾਂ ਤੋਂ ਅੰਦਾਜ਼ਾ ਲਗਾਉਣ ਵਾਲਾ ਇੱਕ ਉੱਨਤ ਸਾਧਨ।"
  },
  risk_params: {
    ta: "முன்கணிப்பு அளவுருக்கள் (Risk Parameters)",
    en: "Risk Parameters",
    hi: "जोखिम पैरामीटर (Risk Parameters)",
    te: "ప్రమాద పారామితులు",
    kn: "ಅಪಾಯದ ನಿಯತಾಂಕಗಳು",
    ml: "അപകടസാധ്യതാ ഘടകങ്ങൾ",
    mr: "जोखीम घटक",
    bn: "ঝুঁকি পরিমাপক",
    gu: "જોખમ માપદંડો",
    pa: "ਜੋਖਮ ਦੇ ਮਾਪਦੰਡ"
  },
  crop_label: {
    ta: "பயிர் (Crop)",
    en: "Crop",
    hi: "फसल (Crop)",
    te: "పంట (Crop)",
    kn: "ಬೆಳೆ (Crop)",
    ml: "വിള (Crop)",
    mr: "पीक (Crop)",
    bn: "ফসল (Crop)",
    gu: "પાક (Crop)",
    pa: "ਫਸਲ (Crop)"
  },
  district_label: {
    ta: "மாவட்டம் (District)",
    en: "District",
    hi: "जिला (District)",
    te: "జిల్లా (District)",
    kn: "ಜಿಲ್ಲೆ (District)",
    ml: "ജില്ല (District)",
    mr: "जिल्हा (District)",
    bn: "জেলা (District)",
    gu: "જિલ્લો (District)",
    pa: "ਜ਼ਿਲ੍ਹਾ (District)"
  },
  growth_stage_label: {
    ta: "பயிர் வளர்ச்சி நிலை (Growth Stage)",
    en: "Crop Growth Stage",
    hi: "फसल विकास चरण",
    te: "పంట ఎదుగుదల దశ",
    kn: "ಬೆಳೆ ಬೆಳವಣಿಗೆಯ ಹಂತ",
    ml: "വിള വളർച്ചാ ഘട്ടം",
    mr: "पिकाच्या वाढीचा टप्पा",
    bn: "ফসলের বৃদ্ধির পর্যায়",
    gu: "પાકના વિકાસનો તબક્કો",
    pa: "ਫਸਲ ਦੇ ਵਾਧੇ ਦਾ ਪੜਾਅ"
  },
  temp_label: {
    ta: "வெப்பநிலை (Temperature)",
    en: "Temperature",
    hi: "तापमान (Temperature)",
    te: "ఉష్ణోగ్రత (Temperature)",
    kn: "ಹವಾಮಾನ ತಾಪಮಾನ",
    ml: "താപനില",
    mr: "तापमान",
    bn: "তাপমাত্রা",
    gu: "તાપમાન",
    pa: "ਤਾਪਮਾਨ"
  },
  humidity_label: {
    ta: "ஈரப்பதம் (Humidity)",
    en: "Humidity",
    hi: "आर्द्रता (Humidity)",
    te: "తేమ (Humidity)",
    kn: "ಆರ್ದ್ರತೆ",
    ml: "ഈർപ്പം",
    mr: "आर्द्रता",
    bn: "আর্দ্রতা",
    gu: "ભેજ",
    pa: "ਨਮੀ"
  },
  rainfall_label: {
    ta: "மழைப்பொழிவு (Rainfall)",
    en: "Rainfall",
    hi: "वर्षा (Rainfall)",
    te: "వర్షపాతం (Rainfall)",
    kn: "ಮಳೆ ಪ್ರಮಾಣ",
    ml: "മഴ",
    mr: "पाऊस",
    bn: "বৃষ্টিপাত",
    gu: "વરસાદ",
    pa: "ਮੀਂਹ"
  },
  predicting_btn: {
    ta: "கணித்துக் கொண்டிருக்கிறது (XGBoost predicting risk...)",
    en: "XGBoost predicting risk...",
    hi: "जोखिम का अनुमान लगाया जा रहा है...",
    te: "ప్రమాదాన్ని అంచనా వేస్తోంది...",
    kn: "ಅಪಾಯವನ್ನು ಲೆಕ್ಕಹಾಕಲಾಗುತ್ತಿದೆ...",
    ml: "സാധ്യത പ്രവചിക്കുന്നു...",
    mr: "जोखिम अंदाज वर्तवला जात आहे...",
    bn: "ঝুঁকি পূর্বাভাস দেওয়া হচ্ছে...",
    gu: "જોખમની આગાહી થઈ રહી છે...",
    pa: "ਜੋਖਮ ਦਾ ਅੰਦਾਜ਼ਾ ਲਗਾਇਆ ਜਾ ਰਿਹਾ ਹੈ..."
  },
  predict_btn: {
    ta: "பரவல் அபாயத்தைக் கணிப்போம் (Predict Disease Risk)",
    en: "Predict Disease Risk",
    hi: "रोग के जोखिम का अनुमान लगाएं",
    te: "తెగులు ప్రమాదాన్ని అంచనా వేయండి",
    kn: "ರೋಗದ ಅಪಾಯ ಮುನ್ಸೂಚನೆ ನೀಡಿ",
    ml: "രോഗബാധ സാധ്യത പ്രവചിക്കുക",
    mr: "रोगाचा प्रादुर्भाव होण्याचा धोका ओळखा",
    bn: "রোগের ঝুঁকি অনুমান করুন",
    gu: "રોગ જોખમની આગાહી કરો",
    pa: "ਰੋਗ ਦੇ ਜੋਖਮ ਦੀ ਭਵਿੱਖਬਾਣੀ ਕਰੋ"
  },
  outcome_title: {
    ta: "முன்கணிப்பு முடிவுகள் (Risk Status)",
    en: "Risk Analysis Outcome",
    hi: "पूर्वानुमान परिणाम (Risk Status)",
    te: "అంచనా ఫలితం",
    kn: "ಮುನ್ಸೂಚನೆಯ ಫಲಿತಾಂಶ",
    ml: "പ്രവചന ഫലം",
    mr: "अंदाजाचा निकाल",
    bn: "পূর্বাভাসের ফলাফল",
    gu: "આગાહીનું પરિણામ",
    pa: "ਭਵਿੱਖਬਾਣੀ ਦਾ ਨਤੀਜਾ"
  },
  risk_level_label: {
    ta: "மதிப்பிடப்பட்ட அபாய நிலை (Risk Level):",
    en: "Estimated Risk Level:",
    hi: "अनुमानित जोखिम स्तर:",
    te: "అంచనా వేయబడిన ప్రమాద స్థాయి:",
    kn: "ಅಂದಾಜು ಅಪಾಯದ ಮಟ್ಟ:",
    ml: "സാധ്യതാ നില:",
    mr: "अंदाजित जोखीम पातळी:",
    bn: "অনুমিত ঝুঁকির মাত্রা:",
    gu: "અંદાજિત જોખમ સ્તર:",
    pa: "ਅੰਦਾਜ਼ਨ ਜੋਖਮ ਦਾ ਪੱਧਰ:"
  },
  expected_disease_label: {
    ta: "பரவ வாய்ப்புள்ள நோய் (Expected Disease):",
    en: "Expected Disease Outbreak:",
    hi: "अपेक्षित रोग का प्रकोप:",
    te: "ఆశించదగిన తెగులు:",
    kn: "ನಿರೀಕ್ಷಿತ ರೋಗ ಹರಡುವಿಕೆ:",
    ml: "പ്രതീക്ഷിക്കുന്ന രോഗബാധ:",
    mr: "अपेक्षित रोगाचा प्रादुर्भाव:",
    bn: "সম্ভাব্য রোগের প্রাদুর্ভাব:",
    gu: "સંભવિત રોગનો ફેલાવો:",
    pa: "ਸੰਭਾਵਿਤ ਰੋਗ ਦਾ ਪ੍ਰਕੋਪ:"
  },
  reason_label: {
    ta: "காரணம் (Reason):",
    en: "Reason & Dynamics:",
    hi: "कारण (Reason):",
    te: "కారణం (Reason):",
    kn: "ಕಾರಣ (Reason):",
    ml: "കാരണം (Reason):",
    mr: "कारण (Reason):",
    bn: "কারণ (Reason):",
    gu: "કારણ (Reason):",
    pa: "ਕਾਰਨ (Reason):"
  },
  prevention_tips_label: {
    ta: "முன்னெச்சரிக்கை நடவடிக்கைகள் (Prevention Tips):",
    en: "Recommended Prevention Actions:",
    hi: "सुझाए गए निवारक उपाय:",
    te: "నివారణ చర్యలు:",
    kn: "ಶಿಫಾರಸು ಮಾಡಿದ ತಡೆಗಟ್ಟುವ ಕ್ರಮಗಳು:",
    ml: "പ്രതിരോധ മാർഗ്ഗങ്ങൾ:",
    mr: "प्रतिबंधात्मक उपाय:",
    bn: "প্রতিরোধমূলক ব্যবস্থা:",
    gu: "ભલામણ કરેલ નિવારક પગલાં:",
    pa: "ਬਚਾਅ ਦੇ ਉਪਾਅ:"
  },
  results_here: {
    ta: "முடிவுகள் இங்கே காட்டப்படும்.",
    en: "Results will be shown here.",
    hi: "परिणाम यहाँ दिखाए जाएंगे।",
    te: "ఫలితాలు ఇక్కడ చూపబడతాయి.",
    kn: "ಫಲಿತಾಂಶಗಳು ಇಲ್ಲಿ ಪ್ರದರ್ಶನಗೊಳ್ಳುತ್ತವೆ.",
    ml: "ഫലങ്ങൾ ഇവിടെ കാണിക്കും.",
    mr: "निकाल येथे दिसतील.",
    bn: "ফলাফল এখানে প্রদর্শিত হবে।",
    gu: "પરિણામો અહીં દર્શાવવામાં આવશે.",
    pa: "ਨਤੀਜੇ ਇੱਥੇ ਦਿਖਾਏ ਜਾਣਗੇ।"
  },
  adjust_params_desc: {
    ta: "இடதுபுறம் உள்ள அளவுருக்களை சரிசெய்து அபாயத்தை கணிக்கவும்.",
    en: "Adjust weather parameters on the left to predict risk status.",
    hi: "जोखिम की स्थिति का अनुमान लगाने के लिए बाईं ओर के मापदंडों को समायोजित करें।",
    te: "ప్రమాదాన్ని అంచనా వేయడానికి ఎడమవైపున ఉన్న పారామితులను సర్దుబాటు చేయండి.",
    kn: "ಅಪಾಯದ ಸ್ಥಿತಿಯನ್ನು ಊಹಿಸಲು ಎಡಭಾಗದಲ್ಲಿರುವ ಹವಾಮಾನ ನಿಯತಾಂಕಗಳನ್ನು ಬದಲಾಯಿಸಿ.",
    ml: "സാധ്യത പ്രവചിക്കുന്നതിനായി ഇടതുവശത്തുള്ള ഘടകങ്ങൾ ക്രമീകരിക്കുക.",
    mr: "धोका ओळखण्यासाठी डावीकडील हवामान घटक बदला.",
    bn: "ঝুঁকি অনুমান করতে বামদিকের আবহাওয়ার পরিমাপকগুলি পরিবর্তন করুন।",
    gu: "જોખમની સ્થિતિની આગાહી કરવા માટે ડાબી બાજુના માપદંડોને સમાયોજિત કરો.",
    pa: "ਜੋਖਮ ਦੀ ਸਥਿਤੀ ਦਾ ਅੰਦਾਜ਼ਾ ਲਗਾਉਣ ਲਈ ਖੱਬੇ ਪਾਸੇ ਦੇ ਮਾਪਦੰਡਾਂ ਨੂੰ ਐਡਜਸਟ ਕਰੋ।"
  },
  high_risk: {
    ta: "அதிதீவிரம் (High Risk)",
    en: "High Risk",
    hi: "उच्च जोखिम (High Risk)",
    te: "ఎక్కువ ప్రమాదం (High Risk)",
    kn: "ಹೆಚ್ಚಿನ ಅಪಾಯ (High Risk)",
    ml: "ഉയർന്ന അപകടസാധ്യത (High Risk)",
    mr: "उच्च जोखीम (High Risk)",
    bn: "উচ্চ ঝুঁকি (High Risk)",
    gu: "ઉચ્ચ જોખમ (High Risk)",
    pa: "ਉੱਚ ਜੋਖਮ (High Risk)"
  },
  medium_risk: {
    ta: "மிதமானது (Medium Risk)",
    en: "Medium Risk",
    hi: "मध्यम जोखिम (Medium Risk)",
    te: "మధ్యస్థ ప్రమాదం (Medium Risk)",
    kn: "ಮಧ್ಯಮ ಅಪಾಯ (Medium Risk)",
    ml: "മിതമായ അപകടസാധ്യത (Medium Risk)",
    mr: "मध्यम जोखीम (Medium Risk)",
    bn: "মাঝারি ঝুঁকি (Medium Risk)",
    gu: "મધ્યમ જોખમ (Medium Risk)",
    pa: "ਮੱਧਮ ਜੋਖਮ (Medium Risk)"
  },
  low_risk: {
    ta: "குறைவானது (Low Risk)",
    en: "Low Risk",
    hi: "कम जोखिम (Low Risk)",
    te: "తక్కువ ప్రమాదం (Low Risk)",
    kn: "ಕಡಿಮೆ ಅಪಾಯ (Low Risk)",
    ml: "കുറഞ്ഞ അപകടസാധ്യത (Low Risk)",
    mr: "कमी जोखीम (Low Risk)",
    bn: "কম ঝুঁকি (Low Risk)",
    gu: "ઓછું જોખમ (Low Risk)",
    pa: "ਘੱਟ ਜੋਖਮ (Low Risk)"
  },
  blast_disease: {
    ta: "குலை நோய் மற்றும் இலை கருகல் நோய் (Blast & Blight)",
    en: "Fungal Blast & Bacterial Leaf Blight",
    hi: "ब्लास्ट और बैक्टीरियल लीफ ब्लाइट",
    te: "అగ్గితెగులు & బాక్టీరియల్ ఆకు ఎండు తెగులు",
    kn: "ಶಿಲೀಂಧ್ರ ಬ್ಲಾಸ್ಟ್ ಮತ್ತು ಬ್ಯಾಕ್ಟೀರಿಯಾದ ಎಲೆ ಬ್ಲೈಟ್",
    ml: "ഫംഗസ് ബ്ലാസ്റ്റും ബാക്ടീരിയൽ ലീഫ് ബ്ലൈറ്റും",
    mr: "करपा आणि जीवाणूजन्य पानावरील करपा",
    bn: "ব্লাস্ট এবং ব্যাকটেরিয়াল লিফ ব্লাইট",
    gu: "બ્લાસ્ટ અને બેક્ટેરિયલ લીફ બ્લાઇટ",
    pa: "ਬਲਾਸਟ ਅਤੇ ਬੈਕਟੀਰੀਅਲ ਲੀਫ ਬਲਾਈਟ"
  },
  mildew_disease: {
    ta: "சாம்பல் நோய் மற்றும் துரு நோய் (Mildew & Rust)",
    en: "Downy Mildew & Rust Disease",
    hi: "डाउनी मिल्ड्यू और रस्ट रोग",
    te: "డౌనీ మిల్డ్యూ & తుప్పు తెగులు",
    kn: "ಡೌನಿ ಮಿಲ್ಡ್ಯೂ ಮತ್ತು ರಸ್ಟ್ ರೋಗ",
    ml: "ഡൗണി മിൽഡ്യൂവും തുരുമ്പ് രോഗവും",
    mr: "केवडा आणि तांबेरा रोग",
    bn: "ডাউনি মিলডিউ এবং মরিচা রোগ",
    gu: "ડાઉની માઇલ્ડ્યુ અને ગેરુ રોગ",
    pa: "ਡਾਊਨੀ ਮਿਲਡਿਊ ਅਤੇ ਕੁੰਗੀ ਰੋਗ"
  },
  no_threat: {
    ta: "உடனடி ஆபத்து எதுவும் இல்லை (No Threat)",
    en: "No Immediate Threat",
    hi: "कोई तत्काल खतरा नहीं है",
    te: "తక్షణ ప్రమాదం ఏమీ లేదు",
    kn: "ಯಾವುದೇ ತಕ್ಷಣದ ಅಪಾಯವಿಲ್ಲ",
    ml: "ഉടൻ ഭീഷണിയില്ല",
    mr: "कोणताही तातडीचा ​​धोका नाही",
    bn: "কোনো তাৎক্ষণিক হুমকি নেই",
    gu: "કોઈ તાત્કાલિક જોખમ નથી",
    pa: "ਕੋਈ ਤੁਰੰਤ ਖ਼ਤਰਾ ਨਹੀਂ ਹੈ"
  }
};

const getPT = (key: string, lang: Language): string => {
  const translationsForKey = pTrans[key];
  if (!translationsForKey) return '';
  return translationsForKey[lang] || translationsForKey['en'] || '';
};

// Translates dynamic outbreak output texts directly on client for consistent selected language
const translateExpectedOutbreak = (val: string, lang: Language): string => {
  if (lang === 'ta') {
    if (val.includes('7-10 Days')) return '7-10 நாட்களில் (70% வாய்ப்பு)';
    if (val.includes('14-20 Days')) return '14-20 நாட்களில் (45% வாய்ப்பு)';
    return 'அடுத்த 30 நாட்களுக்குள் ஆபத்து எதுவும் இல்லை';
  }
  return val;
};

const translateDiseaseRisk = (val: string, lang: Language): string => {
  if (val.includes('Fungal Blast')) return getPT('blast_disease', lang);
  if (val.includes('Downy Mildew')) return getPT('mildew_disease', lang);
  return getPT('no_threat', lang);
};

const translatePreventionTips = (val: string, lang: Language): string => {
  if (lang === 'ta') {
    if (val.includes('Avoid excess nitrogen')) {
      return 'செடிகளில் காற்று சுழற்சியை அதிகரிக்கவும். அதிகப்படியான தழைச்சத்து (Nitrogen) உரத்தைத் தவிர்க்கவும். ட்ரைசைக்ளசோல் (Tricyclazole) தெளிக்கவும். வரப்புகளில் உள்ள கலைகளை அகற்றவும்.';
    }
    if (val.includes('Irrigate in early morning')) {
      return 'இலைகள் நனையாமல் காலையிலேயே நீர்ப்பாய்ச்சவும். சூடோமோனாஸ் (Pseudomonas) போன்ற இயற்கை பூஞ்சாண கொல்லிகளை தெளிக்கவும்.';
    }
    return 'நீர்ப்பாசனத்தை உகந்த அளவில் பராமரிக்கவும். பயிர்களை வாரந்தோறும் கண்காணிக்கவும்.';
  }
  return val;
};

const translateReason = (humidity: number, temp: number, lang: Language): string => {
  if (lang === 'ta') {
    return `ஈரப்பதம் ${humidity}% மற்றும் வெப்பநிலை ${temp}°C ஆகியவற்றால் நோய்க்கிருமி வித்திகள் (fungal spores) வேகமாக முளைத்து பரவக்கூடிய சாதகமான காலநிலை நிலவுகிறது.`;
  }
  if (lang === 'hi') {
    return `आर्द्रता ${humidity}% और तापमान ${temp}°C होने के कारण फंगल बीजाणु तेजी से अंकुरित हो सकते हैं, जिससे रोग के प्रकोप के लिए अनुकूल परिस्थितियां बनती हैं।`;
  }
  if (lang === 'te') {
    return `తేమ ${humidity}% మరియు ఉష్ణోగ్రత ${temp}°C ఉండటం వల్ల శిలీంధ్ర బీజాలు వేగంగా మొలకెత్తి వ్యాపించే అవకాశం ఉన్నందున తెగులు వ్యాప్తికి అనుకూల వాతావરણం ఉంది.`;
  }
  if (lang === 'kn') {
    return `ಆರ್ದ್ರತೆ ${humidity}% ಮತ್ತು ತಾಪಮಾನ ${temp}°C ಇರುವುದರಿಂದ ಶಿಲೀಂಧ್ರ ಬೀಜಕಗಳು ವೇಗವಾಗಿ ಹರಡಲು ಮತ್ತು ರೋಗದ ಹರಡುವಿಕೆಗೆ ಪೂರಕವಾದ ವಾತಾವરણವಿದೆ.`;
  }
  return `An elevated humidity of ${humidity}% combined with warm temperatures of ${temp}°C creates micro-climatic conditions highly favorable for rapid fungal/bacterial spore germination and localized crop contagion.`;
};

export default function Predictions({ onPredict, globalStateId = 'tamil_nadu', globalDistrictId, language = 'ta' }: PredictionsProps) {
  const [crop, setCrop] = useState('Paddy (நெல்)');
  
  const initialDistrict = () => {
    if (globalDistrictId) {
      const stateObj = indianStates.find(s => s.id === globalStateId);
      const distObj = stateObj?.districts.find(d => d.id === globalDistrictId);
      return distObj ? distObj.nameEn : 'Thanjavur';
    }
    return 'Thanjavur';
  };

  const [district, setDistrict] = useState(initialDistrict);

  useEffect(() => {
    if (globalDistrictId) {
      const stateObj = indianStates.find(s => s.id === globalStateId);
      const distObj = stateObj?.districts.find(d => d.id === globalDistrictId);
      if (distObj) {
        setDistrict(distObj.nameEn);
      }
    }
  }, [globalDistrictId, globalStateId]);

  const [temp, setTemp] = useState(30);
  const [humidity, setHumidity] = useState(85);
  const [rain, setRain] = useState(150);
  const [stage, setStage] = useState('Vegetative (வளர்ச்சி நிலை)');
  const [predicting, setPredicting] = useState(false);
  const [result, setResult] = useState<OutbreakPrediction | null>(null);

  const handlePredict = async () => {
    setPredicting(true);
    try {
      const pred = await onPredict({
        crop,
        location: district,
        temperature: temp,
        humidity,
        rainfall: rain,
        growthStage: stage
      });
      setResult(pred);
    } catch (e) {
      console.error(e);
    } finally {
      setPredicting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in" id="predictions-panel">
      <div className="text-center mb-8">
        <span className="bg-green-100 text-green-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider font-mono">
          {getPT('header_badge', language)}
        </span>
        <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight mt-1.5 font-sans">
          {getPT('header_title', language)}
        </h2>
        <p className="text-xs text-gray-500 mt-1 max-w-xl mx-auto">
          {getPT('header_desc', language)}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Sliders and Parameters Panel */}
        <div className="lg:col-span-2 bg-white border border-gray-100 p-6 rounded-3xl shadow-xl shadow-gray-50 space-y-6">
          <h3 className="text-base font-bold text-gray-900 flex items-center space-x-1.5 border-b pb-3">
            <Sliders className="h-5 w-5 text-green-600" />
            <span>{getPT('risk_params', language)}</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Crop Select */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">{getPT('crop_label', language)}</label>
              <select
                value={crop}
                onChange={(e) => setCrop(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-green-500 bg-white text-slate-800"
              >
                <option value="Paddy (நெல்)">{language === 'ta' ? 'Paddy (நெல்)' : 'Paddy'}</option>
                <option value="Tomato (தக்காளி)">{language === 'ta' ? 'Tomato (தக்காளி)' : 'Tomato'}</option>
                <option value="Maize (சோளம்)">{language === 'ta' ? 'Maize (சோளம்)' : 'Maize'}</option>
                <option value="Cotton (பருத்தி)">{language === 'ta' ? 'Cotton (பருத்தி)' : 'Cotton'}</option>
              </select>
            </div>

            {/* Location Select */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">{getPT('district_label', language)}</label>
              <select
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-green-500 bg-white text-slate-800"
              >
                {indianStates
                  .find(s => s.id === globalStateId)
                  ?.districts.map(dist => (
                    <option key={dist.id} value={dist.nameEn}>
                      {language === 'ta' ? `${dist.nameEn} (${dist.nameTa})` : dist.nameEn}
                    </option>
                  ))}
                {!indianStates.some(s => s.id === globalStateId) && (
                  <>
                    <option value="Thanjavur">Thanjavur</option>
                    <option value="Madurai">Madurai</option>
                    <option value="Trichy">Trichy</option>
                    <option value="Coimbatore">Coimbatore</option>
                    <option value="Tirunelveli">Tirunelveli</option>
                  </>
                )}
              </select>
            </div>

            {/* Growth Stage */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">{getPT('growth_stage_label', language)}</label>
              <select
                value={stage}
                onChange={(e) => setStage(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-green-500 bg-white text-slate-800"
              >
                <option value="Seedling (நாற்று)">{getPT('seedling', language)}</option>
                <option value="Vegetative (வளர்ச்சி நிலை)">{getPT('vegetative', language)}</option>
                <option value="Flowering (பூக்கும் பருவம்)">{getPT('flowering', language)}</option>
                <option value="Harvesting (அறுவடை)">{getPT('harvesting', language)}</option>
              </select>
            </div>
          </div>

          {/* Interactive Sliders */}
          <div className="space-y-4 pt-4 border-t">
            {/* Temp Slider */}
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-gray-600">{getPT('temp_label', language)}</span>
                <span className="text-green-700 font-mono">{temp}°C</span>
              </div>
              <input
                type="range"
                min="15"
                max="45"
                value={temp}
                onChange={(e) => setTemp(Number(e.target.value))}
                className="w-full h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-green-600"
              />
            </div>

            {/* Humidity Slider */}
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-gray-600">{getPT('humidity_label', language)}</span>
                <span className="text-green-700 font-mono">{humidity}%</span>
              </div>
              <input
                type="range"
                min="40"
                max="100"
                value={humidity}
                onChange={(e) => setHumidity(Number(e.target.value))}
                className="w-full h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-green-600"
              />
            </div>

            {/* Rainfall Slider */}
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-gray-600">{getPT('rainfall_label', language)}</span>
                <span className="text-green-700 font-mono">{rain} mm</span>
              </div>
              <input
                type="range"
                min="0"
                max="500"
                value={rain}
                onChange={(e) => setRain(Number(e.target.value))}
                className="w-full h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-green-600"
              />
            </div>
          </div>

          <button
            onClick={handlePredict}
            disabled={predicting}
            className="w-full py-3.5 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white font-bold rounded-xl shadow-md shadow-green-100 transition-all flex items-center justify-center space-x-2 cursor-pointer"
            id="predict-submit-btn"
          >
            {predicting ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>{getPT('predicting_btn', language)}</span>
              </>
            ) : (
              <>
                <Brain className="h-5 w-5" />
                <span>{getPT('predict_btn', language)}</span>
              </>
            )}
          </button>
        </div>

        {/* Prediction Outcomes Result Box */}
        <div>
          {result ? (
            <div className="bg-white border border-gray-100 p-6 rounded-3xl shadow-xl shadow-gray-50 space-y-6 animate-fade-in">
              <div className="text-center">
                <span className="bg-green-100 text-green-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full font-mono uppercase">
                  Prediction Outcome
                </span>
                <h3 className="text-lg font-bold text-gray-900 mt-2 font-sans">{getPT('outcome_title', language)}</h3>
              </div>

              {/* Severity Gauge */}
              <div className="bg-gray-50 p-4 rounded-2xl border flex flex-col items-center justify-center text-center">
                <span className="text-[10px] text-gray-400 font-mono uppercase">{getPT('risk_level_label', language)}</span>
                <span className={`text-2xl font-extrabold uppercase mt-1.5 ${
                  result.riskLevel === 'High' ? 'text-red-600' : result.riskLevel === 'Medium' ? 'text-yellow-600' : 'text-green-600'
                }`}>
                  {result.riskLevel === 'High' ? getPT('high_risk', language) : result.riskLevel === 'Medium' ? getPT('medium_risk', language) : getPT('low_risk', language)}
                </span>
              </div>

              {/* Crop risk details */}
              <div className="space-y-4">
                <div>
                  <h4 className="font-bold text-gray-900 text-xs uppercase tracking-wider font-mono">{getPT('expected_disease_label', language)}</h4>
                  <p className="text-xs font-semibold text-gray-700 mt-1">
                    {translateDiseaseRisk(result.diseaseRisk || '', language)} ({translateExpectedOutbreak(result.expectedOutbreak || '', language)})
                  </p>
                </div>

                <div>
                  <h4 className="font-bold text-gray-900 text-xs uppercase tracking-wider font-mono">{getPT('reason_label', language)}</h4>
                  <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                    {translateReason(humidity, temp, language)}
                  </p>
                </div>

                {/* Prevention Tips */}
                <div className="border-t pt-4 space-y-3">
                  <h4 className="font-bold text-gray-900 text-xs uppercase tracking-wider font-mono flex items-center space-x-1">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <span>{getPT('prevention_tips_label', language)}</span>
                  </h4>
                  <ul className="text-xs text-gray-600 space-y-2 pl-4 list-decimal leading-relaxed">
                    {translatePreventionTips(result.preventionTips || '', language).split('. ').map((tip, idx) => (
                      tip.trim() && <li key={idx}>{tip}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-gray-50 border border-dashed rounded-3xl h-full flex flex-col items-center justify-center p-8 text-center text-gray-400">
              <Brain className="h-12 w-12 text-gray-300 mb-2 animate-pulse" />
              <p className="text-sm font-semibold">{getPT('results_here', language)}</p>
              <p className="text-[10px] text-gray-400 mt-1">{getPT('adjust_params_desc', language)}</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
