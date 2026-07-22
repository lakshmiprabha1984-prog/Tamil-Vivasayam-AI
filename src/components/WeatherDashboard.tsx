import React, { useState } from 'react';
import { WeatherData } from '../types';
import { Language } from '../lib/translations';
import {
  CloudSun,
  Droplets,
  Wind,
  CloudRain,
  ShieldAlert,
  Thermometer,
  Sun,
  CloudLightning,
  Calendar,
  Sprout,
  Info,
  Droplet,
  AlertTriangle,
  CheckCircle2
} from 'lucide-react';
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';

interface WeatherProps {
  weather: WeatherData;
  language?: Language;
}

interface CropStageThreat {
  level: 'Red' | 'Orange' | 'Yellow' | 'Green';
  titleEn: string;
  titleTa: string;
  descEn: string;
  descTa: string;
}

const wTrans: Record<string, Record<Language, string>> = {
  live_weather_station: {
    ta: "நிகழ்நேர வானிலை நிலையம்",
    en: "Live Weather Station",
    hi: "लाइव मौसम स्टेशन",
    te: "లైవ్ వెదర్ స్టేషన్",
    kn: "ಲೈವ್ ಹವಾಮಾನ ನಿಲ್ದಾಣ",
    ml: "ലൈവ് കാലാവസ്ഥാ സ്റ്റേഷൻ",
    mr: "थेट हवामान केंद्र",
    bn: "লাইভ আবহাওয়া স্টেশন",
    gu: "લાઇવ હવામાન સ્ટેશન",
    pa: "ਲਾਈਵ ਮੌਸਮ ਸਟੇਸ਼ਨ"
  },
  agri_weather_center: {
    ta: "வேளாண் வானிலை மையம்",
    en: "Agricultural Weather Center",
    hi: "कृषि मौसम केंद्र",
    te: "వ్యవసాయ వాతావరణ కేంద్రం",
    kn: "ಕೃಷಿ ಹವಾಮಾನ ಕೇಂದ್ರ",
    ml: "കാർഷിക കാലാവസ്ഥാ കേന്ദ്രം",
    mr: "कृषी हवामान केंद्र",
    bn: "কৃষি আবহাওয়া কেন্দ্র",
    gu: "કૃષિ હવામાન કેન્દ્ર",
    pa: "ਖੇਤੀਬਾੜੀ ਮੌਸਮ ਕੇਂਦਰ"
  },
  weather_subtitle: {
    ta: "பகுதிக்கான ஈரப்பதம், மழை அளவீடுகள் மற்றும் 7 நாட்களுக்கான நீர்ப்பாசன வழிகாட்டி.",
    en: "Live micro-climate indicators, rainfall tracking, and 7-day irrigation planner.",
    hi: "क्षेत्र के लिए आर्द्रता, वर्षा माप और 7-दिवसीय सिंचाई योजनाकार।",
    te: "ప్రాంతం కోసం తేమ, వర్షపాతం కొలతలు మరియు 7 రోజుల నీటి పారుదల ప్రణాళిక.",
    kn: "ಪ್ರದೇಶಕ್ಕಾಗಿ ತೇವಾಂಶ, ಮಳೆ ಅಳತೆಗಳು ಮತ್ತು 7 ದಿನಗಳ ನೀರಾವರಿ ಯೋಜಕ.",
    ml: "പ്രദേശത്തിനായുള്ള ഈർപ്പം, മഴ അളവുകൾ, 7 ദിവസത്തെ ജലസേചന പദ്ധതി.",
    mr: "भागासाठी आर्द्रता, पाऊस मोजमाप आणि 7-दिवसीय सिंचन नियोजन.",
    bn: "অঞ্চলের জন্য আর্দ্রতা, বৃষ্টিপাত পরিমাপ এবং 7 দিনের সেচ পরিকল্পনা।",
    gu: "વિસ્તાર માટે ભેજ, વરસાદના માપદંડ અને 7-દિવસીય સિંચાઇ આયોજક.",
    pa: "ਖੇਤਰ ਲਈ ਨਮੀ, ਮੀਂਹ ਦੇ ਮਾਪ ਅਤੇ 7-ਦਿਨਾਂ ਦੀ ਸਿੰਚਾਈ ਯੋਜਨਾਕਾਰ।"
  },
  select_crop_label: {
    ta: "1. பயிர் தேர்வு (Select Crop)",
    en: "1. Select Crop",
    hi: "1. फसल का चयन करें",
    te: "1. పంటను ఎంచుకోండి",
    kn: "1. ಬೆಳೆ ಆಯ್ಕೆಮಾಡಿ",
    ml: "1. വിള തിരഞ്ഞെടുക്കുക",
    mr: "1. पीक निवडा",
    bn: "1. ফসল নির্বাচন করুন",
    gu: "1. પાક પસંદ કરો",
    pa: "1. ਫਸਲ ਦੀ ਚੋਣ ਕਰੋ"
  },
  select_stage_label: {
    ta: "2. வளர்ச்சிப் பருவம் (Select Growth Stage)",
    en: "2. Select Growth Stage",
    hi: "2. विकास चरण का चयन करें",
    te: "2. ఎదుగుదల దశను ఎంచుకోండి",
    kn: "2. ಬೆಳವಣಿಗೆಯ ಹಂತವನ್ನು ಆಯ್ಕೆಮಾಡಿ",
    ml: "2. വളർച്ച ഘട്ടം തിരഞ്ഞെടുക്കുക",
    mr: "2. वाढीचा टप्पा निवडा",
    bn: "2. বৃদ্ধির ধাপ নির্বাচন করুন",
    gu: "2. વિકાસનો તબક્કો પસંદ કરો",
    pa: "2. ਵਿਕਾਸ ਪੜਾਅ ਦੀ ਚੋਣ ਕਰੋ"
  },
  crop_general: {
    ta: "பொதுவானது",
    en: "General",
    hi: "सामान्य",
    te: "సాధారణ",
    kn: "ಸಾಮಾನ್ಯ",
    ml: "പൊതുവായ",
    mr: "सामान्य",
    bn: "সাধারণ",
    gu: "સામાન્ય",
    pa: "ਸਧਾਰਨ"
  },
  crop_paddy: {
    ta: "நெல் (Paddy)",
    en: "Paddy",
    hi: "धान (Paddy)",
    te: "వరి (Paddy)",
    kn: "ಭತ್ತ (Paddy)",
    ml: "നെല്ല് (Paddy)",
    mr: "भात (Paddy)",
    bn: "ধান (Paddy)",
    gu: "ડાંગર (Paddy)",
    pa: "ਝੋਨਾ (Paddy)"
  },
  crop_tomato: {
    ta: "தக்காளி (Tomato)",
    en: "Tomato",
    hi: "टमाटर (Tomato)",
    te: "టమోటా (Tomato)",
    kn: "ಟೊಮ್ಯಾಟೊ (Tomato)",
    ml: "തക്കാളി (Tomato)",
    mr: "टोमॅटो (Tomato)",
    bn: "টমেটো (Tomato)",
    gu: "ટમેટા (Tomato)",
    pa: "ਟਮਾਟਰ (Tomato)"
  },
  crop_groundnut: {
    ta: "நிலக்கடலை (Groundnut)",
    en: "Groundnut",
    hi: "मूंगफली (Groundnut)",
    te: "வேరుశనగ (Groundnut)",
    kn: "ನೆಲಗಡಲೆ (Groundnut)",
    ml: "നിലക്കടല (Groundnut)",
    mr: "भुईमूग (Groundnut)",
    bn: "চিনাবাদাম (Groundnut)",
    gu: "મગફળી (Groundnut)",
    pa: "ਮੂੰਗਫਲੀ (Groundnut)"
  },
  stage_seedling: {
    ta: "முளைப்பு/நாற்று",
    en: "Seedling",
    hi: "अंकुर (Seedling)",
    te: "మొలక/నారు (Seedling)",
    kn: "ಸಸಿ (Seedling)",
    ml: "തൈകൾ (Seedling)",
    mr: "रोपटे (Seedling)",
    bn: "চারা গাছ (Seedling)",
    gu: "ધરૂ (Seedling)",
    pa: "ਪਨੀਰੀ (Seedling)"
  },
  stage_vegetative: {
    ta: "வளர்ச்சி பருவம்",
    en: "Vegetative",
    hi: "वानस्पतिक विकास (Vegetative)",
    te: "ఎదుగుదల దశ (Vegetative)",
    kn: "ಅಂಗಾಂಗ ಬೆಳವಣಿಗೆ (Vegetative)",
    ml: "வളർച്ച ഘട്ടം (Vegetative)",
    mr: "शाकीय वाढ (Vegetative)",
    bn: "অঙ্গজ বৃদ্ধি (Vegetative)",
    gu: "વાનસ્પતિક વૃદ્ધિ (Vegetative)",
    pa: "ਵਿਵਸਥਾ (Vegetative)"
  },
  stage_flowering: {
    ta: "பூக்கும் தருணம்",
    en: "Flowering",
    hi: "फूल आना (Flowering)",
    te: "పూత దశ (Flowering)",
    kn: "ಹೂಬಿಡುವಿಕೆ (Flowering)",
    ml: "പൂവിടുന്ന സമയം (Flowering)",
    mr: "फुलणे (Flowering)",
    bn: "ফুল ফোটার সময় (Flowering)",
    gu: "ફૂલ આવવાનો સમય (Flowering)",
    pa: "ਫੁੱਲ ਪੈਣੇ (Flowering)"
  },
  stage_fruiting: {
    ta: "காய்/பழ பருவம்",
    en: "Fruiting",
    hi: "फल लगना (Fruiting)",
    te: "కాయ దశ (Fruiting)",
    kn: "ಕಾಯಿ ಬಿಡುವುದು (Fruiting)",
    ml: "കായ് ഫലം (Fruiting)",
    mr: "फळधारणा (Fruiting)",
    bn: "ফল ধরার সময় (Fruiting)",
    gu: "ફળ બેસવાનો સમય (Fruiting)",
    pa: "ਫਲ ਪੈਣੇ (Fruiting)"
  },
  stage_harvesting: {
    ta: "அறுவடை காலம்",
    en: "Harvesting",
    hi: "कटाई (Harvesting)",
    te: "కోత దశ (Harvesting)",
    kn: "ಕೊಯ್ಲು (Harvesting)",
    ml: "വിളവെടുപ്പ് (Harvesting)",
    mr: "काढणी (Harvesting)",
    bn: "ফসল কাটা (Harvesting)",
    gu: "લણણી (Harvesting)",
    pa: "ਵਾਢੀ (Harvesting)"
  },
  metric_temp: {
    ta: "வெப்பநிலை (Temp)",
    en: "Temperature",
    hi: "तापमान (Temperature)",
    te: "ఉష్ణోగ్రత (Temperature)",
    kn: "ತಾಪಮಾನ (Temperature)",
    ml: "താപനില (Temperature)",
    mr: "तापमान (Temperature)",
    bn: "तापমাত্রা (Temperature)",
    gu: "તાપમાન (Temperature)",
    pa: "ತಾਪਮਾਨ (Temperature)"
  },
  metric_humidity: {
    ta: "ஈரப்பதம் (Humidity)",
    en: "Humidity",
    hi: "आर्द्रता (Humidity)",
    te: "తేమ (Humidity)",
    kn: "ಆರ್ದ್ರತೆ (Humidity)",
    ml: "ഈർപ്പം (Humidity)",
    mr: "आर्द्रता (Humidity)",
    bn: "आর্দ্রতা (Humidity)",
    gu: "ભેજ (Humidity)",
    pa: "ਨਮੀ (Humidity)"
  },
  metric_wind: {
    ta: "காற்று வேகம் (Wind)",
    en: "Wind Speed",
    hi: "हवा की गति (Wind Speed)",
    te: "గాలి వేగం (Wind Speed)",
    kn: "ಗಾಳಿಯ ವೇಗ (Wind Speed)",
    ml: "കാറ്റിന്റെ വേഗം (Wind Speed)",
    mr: "वाऱ्याचा वेग (Wind Speed)",
    bn: "বাতাসের গতিবেগ (Wind Speed)",
    gu: "પવનની ગતિ (Wind Speed)",
    pa: "ਹਵਾ ਦੀ ਰਫ਼ਤਾਰ (Wind Speed)"
  },
  metric_rain: {
    ta: "மழைப்பொழிவு (Rainfall)",
    en: "Rainfall",
    hi: "वर्षा (Rainfall)",
    te: "వర్షపాతం (Rainfall)",
    kn: "ಮಳೆ ಪ್ರಮಾಣ (Rainfall)",
    ml: "മഴപ്പൊழிவு (Rainfall)",
    mr: "पाऊस (Rainfall)",
    bn: "বৃষ্টিপাত (Rainfall)",
    gu: "વરસાદ (Rainfall)",
    pa: "ਮੀਂह (Rainfall)"
  },
  warning_pathogen: {
    ta: "⚠️ பயிர் நோய் பரவல் எச்சரிக்கை (Pathogen Risk Warning)",
    en: "⚠️ Pathogen Risk Warning",
    hi: "⚠️ रोग प्रसार की चेतावनी",
    te: "⚠️ తెగులు వ్యాప్తి హెచ్చరిక",
    kn: "⚠️ ರೋಗ ಹರಡುವಿಕೆ ಎಚ್ಚರಿಕೆ",
    ml: "⚠️ രോഗവ്യാപന മുന്നറിയിപ്പ്",
    mr: "⚠️ रोग प्रादुर्भाव चेतावणी",
    bn: "⚠️ রোগ ছড়ানোর সতর্কতা",
    gu: "⚠️ રોગ ફેલાવાની ચેતવણી",
    pa: "⚠️ ਬਿਮਾਰੀ ਫੈਲਣ ਦੀ ਚੇਤਾਵਨੀ"
  },
  planning_chart_title: {
    ta: "நீர்ப்பாசன திட்டமிடல் வரைபடம்",
    en: "Water Planning Analytics",
    hi: "सिंचाई नियोजन चार्ट",
    te: "నీటి పారుదల ప్రణాళిక చార్ట్",
    kn: "ನೀರಾವರಿ ಯೋಜನೆ ವಿಶ್ಲೇಷಣೆ",
    ml: "ജലസേചന ആസൂത്രണ ചാർട്ട്",
    mr: "सिंचन नियोजन चार्ट",
    bn: "সেচ পরিকল্পনা চার্ট",
    gu: "સિંચાઇ આયોજન ચાર્ટ",
    pa: "ਸਿੰਚਾਈ ਯੋਜਨਾ ਚਾਰਟ"
  },
  trend_7day: {
    ta: "7-நாள் வெப்பநிலை & மழைப்பொழிவு போக்கு",
    en: "7-Day Temp & Rainfall Trend",
    hi: "7-दिवसीय तापमान और वर्षा की प्रवृत्ति",
    te: "7 రోజుల ఉష్ణోగ్రత & వర్షపాతం ట్రెండ్",
    kn: "7 ದಿನಗಳ ತಾಪಮಾನ ಮತ್ತು ಮಳೆ ಪ್ರವೃತ್ತಿ",
    ml: "7 ദിവസത്തെ താപനിലയും മഴയും",
    mr: "7-दिवसीय तापमान आणि पाऊस कल",
    bn: "7 দিনের তাপমাত্রা ও বৃষ্টিপাতের ধারা",
    gu: "7-દિવસીય તાપમાન અને વરસાદનો પ્રવાહ",
    pa: "7-ਦਿਨਾਂ ਦਾ ਤਾਪਮਾਨ ਅਤੇ ਮੀਂਹ ਦਾ ਰੁਝਾਨ"
  },
  expected_rain_7: {
    ta: "மழைப்பொழிவு 7 நாட்களில்",
    en: "Expected Rain (7 days)",
    hi: "संभावित वर्षा (7 दिन)",
    te: "ఆశించిన వర్షపాతం (7 రోజులు)",
    kn: "ನಿರೀಕ್ಷಿತ ಮಳೆ (7 ದಿನಗಳು)",
    ml: "പ്രതീക്ഷിക്കുന്ന മഴ (7 ദിവസം)",
    mr: "अपेक्षित पाऊस (7 दिवस)",
    bn: "প্রত্যাশিত বৃষ্টি (7 দিন)",
    gu: "અપેક્ષિત વરસાદ (7 દિવસ)",
    pa: "ਸੰਭਾਵਿਤ ਮੀਂਹ (7 ਦਿਨ)"
  },
  rain_bar_name: {
    ta: "மழை (Rainfall)",
    en: "Rain (mm)",
    hi: "वर्षा (mm)",
    te: "వర్షం (mm)",
    kn: "ಮಳೆ (ಮಿಮೀ)",
    ml: "മഴ (മില്ലീമീറ്റർ)",
    mr: "पाऊस (मिमी)",
    bn: "বৃষ্টি (মিমি)",
    gu: "વરસાદ (મીમી)",
    pa: "ਮੀਂਹ (ਮੀਮੀ)"
  },
  temp_line_name: {
    ta: "வெப்பநிலை (Temp)",
    en: "Temp (°C)",
    hi: "तापमान (°C)",
    te: "ఉష్ణోగ్రత (°C)",
    kn: "ತಾಪಮಾನ (ಡಿಗ್ರಿ സെ)",
    ml: "താപനില (°C)",
    mr: "तापमान (°C)",
    bn: "तापমাত্রা (°C)",
    gu: "તાપમાન (°C)",
    pa: "ਤਾਪਮਾਨ (°C)"
  },
  chart_legend_help: {
    ta: "வரைபடத்தில் சிவப்பு வளைவு வெப்பநிலையையும், நீல நிற தூண்கள் மழை அளவையும் குறிக்கும்.",
    en: "Red line tracks predicted temperature levels; Blue bars denote forecasted precipitation.",
    hi: "चार्ट में लाल रेखा तापमान और नीले बार वर्षा दर्शाते हैं।",
    te: "చార్టులోని ఎరుపు రేఖ ఉష్ణోగ్రతను, నీలి బార్లు వర్షపాతాన్ని సూచిస్తాయి.",
    kn: "ಕೆಂಪು ರೇಖೆಯು ತಾಪಮಾನವನ್ನು ಮತ್ತು ನೀಲಿ ಬಾರ್‌ಗಳು ಮಳೆಯನ್ನು ಸೂಚಿಸುತ್ತವೆ.",
    ml: "ചുവന്ന വര താപനിലയെയും നീല ബാറുകൾ മഴയെയും സൂചിപ്പിക്കുന്നു.",
    mr: "लाल रेषा तापमान आणि निळे बार पाऊस दर्शवतात.",
    bn: "লাল রেখা তাপমাত্রা এবং নীল বার বৃষ্টিপাত নির্দেশ করে।",
    gu: "લાલ રેખા તાપમાન અને વાદળી બાર વરસાદ દર્શાવે છે.",
    pa: "ਲਾਲ ਲਾਈਨ ਤਾਪਮਾਨ ਅਤੇ ਨੀਲੇ ਬਾਰ ਮੀਂਹ ਨੂੰ ਦਰਸਾਉਂਦੇ ਹਨ।"
  },
  irrigation_advice_engine: {
    ta: "நீர்ப்பாசன ஆலோசகர்",
    en: "Irrigation Advice Engine",
    hi: "सिंचाई सलाहकार",
    te: "నీటి పారుదల సలహాదారు",
    kn: "ನೀರಾವರಿ ಸಲಹೆಗಾರ",
    ml: "ജലസേചന ഉപദേശകൻ",
    mr: "सिंचन सल्लागार",
    bn: "সেচ পরামর্শদাতা",
    gu: "સિંચાઇ સલાહકાર",
    pa: "ਸਿੰਚਾਈ ਸਲਾਹਕਾਰ"
  },
  crop_specific_guide: {
    ta: "பயிர் சார்ந்த நீர் மேலாண்மை",
    en: "Crop-Specific Guide",
    hi: "फसल-विशिष्ट निर्देशिका",
    te: "పంట ఆధారిత నీటి మార్గదర్శి",
    kn: "ಬೆಳೆ-ನಿರ್διಷ್ಟ ನೀರಾವರಿ ಮಾರ್ಗದರ್ಶಿ",
    ml: "വിള അടിസ്ഥാനമാക്കിയുള്ള ജലസേചനം",
    mr: "पीक-विशिष्ट मार्गदर्शक",
    bn: "ফসল-নির্দিষ্ট গাইড",
    gu: "પાક-વિશિષ્ટ માર્ગદર્શિક化",
    pa: "ਫਸਲ-ਵਿਸ਼ੇਸ਼ ਗਾਈਡ"
  },
  selected_crop_text: {
    ta: "தேர்ந்தெடுக்கப்பட்ட பயிர்:",
    en: "Selected Crop:",
    hi: "चयनित फसल:",
    te: "ఎంచుకున్న పంట:",
    kn: "ಆಯ್ಕೆಮಾಡಿದ ಬೆಳೆ:",
    ml: "തിരഞ്ഞെടുത്ത വിള:",
    mr: "निवडलेले पीक:",
    bn: "নির্বাচিত ফসল:",
    gu: "પસંદ કરેલ પાક:",
    pa: "ਚੁਣੀ ਹੋਈ ਫਸਲ:"
  },
  growth_stage_text: {
    ta: "வளர்ச்சிப் பருவம்:",
    en: "Growth Stage:",
    hi: "विकास का चरण:",
    te: "ఎదుగుదల దశ:",
    kn: "ಬೆಳವಣಿಗೆಯ ಹಂತ:",
    ml: "വളർച്ച ഘട്ടം:",
    mr: "वाढीचा टप्पा:",
    bn: "বৃদ্ধির ধাপ:",
    gu: "વિકાસનો તબક્કો:",
    pa: "ਵਿਕਾਸ ਪੜਾਅ:"
  },
  recommendation: {
    ta: "பாசன பரிந்துரை",
    en: "Recommendation",
    hi: "अनुशंसा",
    te: "సిఫార్సు",
    kn: "ಶಿಫಾರಸು",
    ml: "ശുപാർശ",
    mr: "शिफारस",
    bn: "সুপারিশ",
    gu: "ભલામણ",
    pa: "ਸਿਫਾਰਸ਼"
  },
  precision_agriculture: {
    ta: "நுண்ணறிவு நீர்ப்பாசனம்",
    en: "Precision Agriculture",
    hi: "सटीक कृषि",
    te: "ఖచ్చితమైన వ్యవసాయం",
    kn: "ನಿಖರ ಕೃಷಿ",
    ml: "കൃത്യതാ കൃഷി",
    mr: "अचूक शेती",
    bn: "নির্ভুল কৃষি",
    gu: "ચોક્કસ કૃષિ",
    pa: "ਸਟੀਕ ਖੇਤੀਬਾੜੀ"
  },
  smart_irrigation_scheduling: {
    ta: "ஸ்மார்ட் நீர்ப்பாசன திட்டமிடல்",
    en: "Smart Irrigation Scheduling",
    hi: "स्मार्ट सिंचाई योजना",
    te: "స్మార్ట్ నీటి పారుదల ప్రణాళిక",
    kn: "ಸ್ಮಾರ್ಟ್ ನೀರಾವರಿ ಯೋಜನೆ",
    ml: "സ്മാർട്ട് ജലസേചന പദ്ധതി",
    mr: "स्मार्ट सिंचन नियोजन",
    bn: "স্মার্ট সেচ পরিকল্পনা",
    gu: "સ્માર્ટ સિંચાઇ આયોજન",
    pa: "ਸਮਾਰਟ ਸਿੰਚਾਈ ਯੋਜਨਾ"
  },
  adaptive_watering_sub: {
    ta: "தற்போதைய மண்ணின் ஈரப்பதம் மற்றும் 3-நாள் மழைப்பொழிவின் அடிப்படையில் தானியங்கி பாசன பரிந்துரை.",
    en: "Adaptive watering schedules calculated from real-time soil moisture and upcoming 3-day rainfall forecast.",
    hi: "वास्तविक समय की मिट्टी की नमी और आगामी 3-दिवसीय वर्षा पूर्वानुमान से गणना की गई अनुकूलित सिंचाई योजना।",
    te: "నిజ సమయ నేల తేమ మరియు రాబోయే 3 రోజుల వర్షపాత సూచన ఆధారంగా అనుకూల నీటి ప్రణాళిక.",
    kn: "ನಿಜವಾದ ಮಣ್ಣಿನ ತೇವಾಂಶ ಮತ್ತು 3 ದಿನಗಳ ಮಳೆ ಮುನ್ಸೂಚನೆ ಆಧಾರಿತ ಹವಾಮಾನ ನೀರಾವರಿ ಯೋಜನೆ.",
    ml: "യഥാർത്ഥ മണ്ണിലെ ഈർപ്പവും 3 ദിവസത്തെ മഴ പ്രവചനവും അടിസ്ഥാനമാക്കിയുള്ള സ്മാർട്ട് ജലസേചന ശുപാർശ.",
    mr: "थेट मातीतील ओलावा आणि आगामी ३ दिवसांच्या पावसाच्या अंदाजावर आधारित अचूक नियोजन.",
    bn: "মাটির আর্দ্রতা এবং ৩ দিনের বৃষ্টিপাতের পূর্বাভাসের ভিত্তিতে সেচ পরিকল্পনা।",
    gu: "જમીનના ભેજ અને ૩-દિવસીય વરસાદની આગાહી આધારિત સ્માર્ટ સિંચાઇ આયોજન.",
    pa: "ਮਿੱਟੀ ਦੀ ਨਮੀ ਅਤੇ ਆਗਾਮੀ ੩-ਦਿਨਾਂ ਦੇ ਮੀਂਹ ਦੇ ਅਨੁਮਾਨ ਦੇ ਅਧਾਰ ਤੇ ਸਮਾਰਟ ਸਿੰਚਾਈ ਯੋਜਨਾ।"
  },
  upcoming_3day: {
    ta: "3-நாள் மழை முன்னறிவிப்பு:",
    en: "Upcoming 3-Day Rain:",
    hi: "आगामी 3-दिवसीय वर्षा:",
    te: "రాబోయే 3 రోజుల వర్షం:",
    kn: "ಮುಂದಿನ 3 ದಿನಗಳ ಮಳೆ:",
    ml: "വരും 3 ദിവസത്തെ മഴ:",
    mr: "आगामी ३ दिवसांचा पाऊस:",
    bn: "আসন্ন ৩ দিনের বৃষ্টি:",
    gu: "આગામী ૩-દિવસીય વરસાદ:",
    pa: "ਆਗਾਮੀ ੩-ਦਿਨਾਂ ਦਾ ਮੀਂਹ:"
  },
  current_soil_moisture: {
    ta: "மண்ணின் ஈரப்பதம்",
    en: "Current Soil Moisture",
    hi: "मिट्टी की वर्तमान नमी",
    te: "ప్రస్తుత నేల తేమ",
    kn: "ಪ್ರಸ್ತುತ ಮಣ್ಣಿನ تೇವಾಂಶ",
    ml: "നിലവിലെ മണ്ണിലെ ഈർപ്പം",
    mr: "मातीतील ओलावा",
    bn: "মাটির বর্তমান আর্দ্রতা",
    gu: "જમીનનો વર્તમાન ભેજ",
    pa: "ਮਿੱਟੀ ਦੀ ਮੌਜੂਦਾ ਨਮੀ"
  },
  vwc: {
    ta: "ஈரப்பத அளவு",
    en: "Volumetric Water Content (VWC)",
    hi: "आयतनिक जल सामग्री (VWC)",
    te: "నేల తేమ శాతం (VWC)",
    kn: "ಮಣ್ಣಿನ ನೀರಿನ ಪ್ರಮಾಣ (VWC)",
    ml: "മണ്ണിലെ ജലാംശം (VWC)",
    mr: "मातीतील पाण्याचे प्रमाण (VWC)",
    bn: "মাটির জলের পরিমাণ (VWC)",
    gu: "જમીનમાં પાણીનું પ્રમાણ (VWC)",
    pa: "ਮਿੱਟੀ ਵਿੱਚ ਪਾਣੀ ਦੀ ਮਾਤਰਾ (VWC)"
  },
  soil_dry: {
    ta: "வறண்டது",
    en: "Dry",
    hi: "सूखा",
    te: "పొడి",
    kn: "ಒಣ",
    ml: "വരണ്ടത്",
    mr: "कोरडे",
    bn: "শুষ্ক",
    gu: "સૂકું",
    pa: "ਸੁੱਕਾ"
  },
  soil_ideal: {
    ta: "சரியானது",
    en: "Ideal",
    hi: "आदर्श",
    te: "అనుకూలం",
    kn: "ಆದರ್ಶ",
    ml: "അനുയോജ്യം",
    mr: "योग्य",
    bn: "আদর্শ",
    gu: "યોગ્ય",
    pa: "ਢੁਕਵਾਂ"
  },
  soil_wet: {
    ta: "ஈரப்பதம்",
    en: "Wet",
    hi: "गीला",
    te: "తేమ",
    kn: "ತೇವ",
    ml: "ഈർപ്പമുള്ളത്",
    mr: "ओले",
    bn: "ভেজা",
    gu: "ભીનું",
    pa: "ਗਿੱਲਾ"
  },
  quick_presets: {
    ta: "விரைவு அளவீடுகள்:",
    en: "Quick Presets:",
    hi: "त्वरित प्रीसेट:",
    te: "త్వరిత ప్రీసెట్లు:",
    kn: "ತ್ವರಿತ ಪೂರ್ವಯೋಜನೆಗಳು:",
    ml: "ദ്രുത ക്രമീകരണങ്ങൾ:",
    mr: "त्वरित सेटिंग्ज:",
    bn: "দ্রুত প্রিসেট:",
    gu: "ઝડપી પ્રીસેટ્સ:",
    pa: "ਤੁਰੰत ਪ੍ਰੀਸੈਟਸ:"
  },
  forecast_accumulated: {
    ta: "3-நாள் மழைப்பொழிவு",
    en: "3-Day Rainfall Forecast",
    hi: "3-दिवसीय वर्षा का पूर्वानुमान",
    te: "3 రోజుల వర్షపాత సూచన",
    kn: "3 ದಿನಗಳ ಮಳೆ ಮುನ್ಸೂಚನೆ",
    ml: "3 ദിവസത്തെ മഴ പ്രവചനം",
    mr: "३ दिवसांचा पावसाचा अंदाज",
    bn: "৩ দিনের বৃষ্টিপাতের পূর্বাভাস",
    gu: "૩-દિવસીય વરસાદની આગાહી",
    pa: "੩-ਦਿਨਾਂ ਦੇ ਮੀਂਹ ਦਾ ਅਨੁਮਾਨ"
  },
  watering_interval: {
    ta: "நீர் பாய்ச்சும் இடைவெளி",
    en: "Watering Interval",
    hi: "सिंचाई अंतराल",
    te: "నీటి పారుదల వ్యవధి",
    kn: "ನೀರಾವರಿ ಮಧ್ಯಂತರ",
    ml: "ජലസേചന ഇടവേള",
    mr: "सिंचन अंतर",
    bn: "সেচ বিরতি",
    gu: "સિંચાઇ અંતરાલ",
    pa: "ਸਿੰਚਾਈ ਦਾ ਅੰਤਰਾਲ"
  },
  watering_volume: {
    ta: "பாசன நீரின் அளவு",
    en: "Watering Volume",
    hi: "सिंचाई की मात्रा",
    te: "నీటి పరిమాణం",
    kn: "ನೀರಾವರಿ ಪ್ರಮಾಣ",
    ml: "ජലസേചന അളവ്",
    mr: "सिंचन प्रमाण",
    bn: "সেচ পরিমাণ",
    gu: "સિંચાઇ જથ્થો",
    pa: "ਸਿੰਚਾਈ ਦੀ ਮਾਤਰਾ"
  },
  scientific_logic: {
    ta: "பரிந்துரைக்கான அறிவியல் காரணம்",
    en: "Scientific Scheduling Logic",
    hi: "वैज्ञानिक सिंचाई तर्क",
    te: "శాస్త్రీय నీటి ప్రణాళిక",
    kn: "ವೈಜ್ಞಾನಿಕ ನೀರಾವರಿ ತರ್ಕ",
    ml: "ശാസ്ത്രീയ ജലസേചന തത്വം",
    mr: "वैज्ञानिक सिंचन तर्क",
    bn: "বৈজ্ঞানিক সেচ যুক্তি",
    gu: "વૈજ્ઞાનિક સિંચાઇ તર્ક",
    pa: "ਵਿਗਿਆਨਕ ਸਿੰਚਾਈ ਤਰਕ"
  },
  active_stage_footer: {
    ta: "பயிரின் தற்போதைய பருவம்:",
    en: "Active stage:",
    hi: "सक्रिय चरण:",
    te: "ప్రస్తుత దశ:",
    kn: "ಪ್ರಸ್ತುತ ಹಂತ:",
    ml: "നിലവിലെ ഘട്ടം:",
    mr: "सक्रिय टप्पा:",
    bn: "সক্রিয় ধাপ:",
    gu: "સક્રિય તબક્કો:",
    pa: "ਮੌਜੂਦਾ ਪੜਾਅ:"
  },
  crop_footer: {
    ta: "பயிர் வகை:",
    en: "Crop:",
    hi: "फसल:",
    te: "పంట:",
    kn: "ಬೆಳೆ:",
    ml: "വിള:",
    mr: "पीक:",
    bn: "ফসল:",
    gu: "પાક:",
    pa: "ਫਸਲ:"
  },
  forecast_and_pathogen: {
    ta: "அடுத்த 5 நாட்களுக்கான முன்னறிவிப்பு (5-Day Forecast Risks)",
    en: "5-Day Forecast & Pathogen Risk",
    hi: "5-दिवसीय पूर्वानुमान और रोग जोखिम",
    te: "5 రోజుల వాతావరణ సూచన & తెగులు ముప్పు",
    kn: "5 ದಿನಗಳ ಹವಾಮಾನ ಮತ್ತು ರೋಗದ ಅಪಾಯ",
    ml: "5 ദിവസത്തെ പ്രവചനവും രോഗ സാധ്യതയും",
    mr: "५ दिवसांचा अंदाज आणि रोग धोका",
    bn: "৫ দিনের পূর্বাভাস ও রোগ ঝুঁকি",
    gu: "૫-દિવસીય આગાહી અને રોગ જોખમ",
    pa: "੫-ਦਿਨਾਂ ਦਾ ਅਨੁਮਾਨ ਅਤੇ ਬਿਮਾਰੀ ਦਾ ਖਤਰਾ"
  }
};

interface AdviceStrings {
  title: string;
  text: string;
}

const getPaddyHighRainAdvice = (lang: Language, totalRain: number): AdviceStrings => {
  const titles: Record<Language, string> = {
    ta: 'நெல் நீர்ப்பாசன ஆலோசனை: மழை நீர் சேமிப்பு',
    en: 'Paddy Irrigation: Rainwater Harvesting',
    hi: 'धान सिंचाई: वर्षा जल संचयन',
    te: 'వరి నీటి పారుదల: వర్షపు నీటి నిల్వ',
    kn: 'ಭತ್ತದ ನೀರಾವರಿ: ಮಳೆನೀರು ಕೊಯ್ಲು',
    ml: 'നെല്ല് ജലസേചനം: മഴവെള്ള സംഭരണം',
    mr: 'भात सिंचन: पर्जन्य जल संवर्धन',
    bn: 'ধান সেচ: বৃষ্টির জল সংগ্রহ',
    gu: 'ડાંગર સિંચાઇ: વરસાદી પાણીનો સંગ્રહ',
    pa: 'ਝੋਨੇ ਦੀ ਸਿੰਚਾਈ: ਵਰਖਾ ਜਲ ਸੰਭਾਲ'
  };
  const texts: Record<Language, string> = {
    ta: `அடுத்த 7 நாட்களில் கணிசமான மழைப்பொழிவு (மொத்தம் ${totalRain} மிமீ) எதிர்பார்க்கப்படுகிறது. வயல் மட்டத்தை 3-5 செ.மீ ஆக கட்டுப்படுத்தவும். கூடுதல் நீர் தேங்குவதைத் தவிர்க்க வடிகால்களை தயார் நிலையில் வைக்கவும்.`,
    en: `Significant rainfall (${totalRain}mm) is expected. Maintain a water level of 3-5 cm. Clear drainage outlets to prevent flood submergence of rice crops.`,
    hi: `अगले 7 दिनों में महत्वपूर्ण वर्षा (कुल ${totalRain} मिमी) होने की उम्मीद है। खेत में पानी का स्तर 3-5 सेमी बनाए रखें। जलभराव से बचने के लिए जल निकासी को चालू रखें।`,
    te: `రాబోయే 7 రోజుల్లో గణనీయమైన వర్షపాతం (మొత్తం ${totalRain} మిమీ) అంచనా వేయబడింది. పొలంలో నీటి మట్టాన్ని 3-5 సెం.మీగా ఉంచండి. నీటి నిల్వను నివారించడానికి పారుదల మార్గాలను సిద్ధంగా ఉంచండి.`,
    kn: `ಮುಂದಿನ 7 ದಿನಗಳಲ್ಲಿ ಗಣನೀಯ ಮಳೆ (ಒಟ್ಟು ${totalRain} ಮಿಮೀ) ನಿರೀಕ್ಷಿಸಲಾಗಿದೆ. ಗದ್ದೆಯ ನೀರಿನ ಮಟ್ಟವನ್ನು 3-5 ಸೆಂ.ಮೀ ಕಾಪಾಡಿಕೊಳ್ಳಿ. ಬೆಳೆ ಜಲಾವೃತವಾಗದಂತೆ ಚರಂಡಿಗಳನ್ನು ಸ್ವಚ್ಛಗೊಳಿಸಿ.`,
    ml: `അടുത്ത 7 ദിവസത്തിനുള്ളിൽ ശക്തമായ മഴ (ആകെ ${totalRain} മില്ലീമീറ്റർ) പ്രതീക്ഷിക്കുന്നു. പാടത്തെ ജലനിരപ്പ് 3-5 സെ.മീ ആയി നിലനിർത്തുക. വെള്ളക്കെട്ട് ഒഴിവാക്കാൻ ഓടകൾ വൃത്തിയാക്കുക.`,
    mr: `पुढील ७ दिवसांत जोरदार पावसाची (एकूण ${totalRain} मिमी) शक्यता आहे. शेतातील पाण्याची पातळी ३-५ सेमी ठेवा. पाण्याचा निचरा होण्यासाठी चारी स्वच्छ ठेवा.`,
    bn: `আগামী ৭ দিনে উল্লেখযোগ্য বৃষ্টিপাতের (মোট ${totalRain} মিমি) সম্ভাবনা রয়েছে। জমিতে জলের স্তর ৩-৫ সেমি বজায় রাখুন। জলমগ্নতা এড়াতে নিষ্কাশন নালা পরিষ্কার রাখুন।`,
    gu: `આગામી ૭ દિવસમાં નોંધપાત્ર વરસાદ (કુલ ${totalRain} મીમી) અપેક્ષિત છે. ખેતરમાં પાણીનું સ્તર ૩-૫ સેમી જાળવો. પાક ડૂબી ન જાય તે માટે નિકાલ ગટર ખુલ્લી કરો.`,
    pa: `ਅਗਲੇ ੭ ਦਿਨਾਂ ਵਿੱਚ ਭਾਰੀ ਮੀਂਹ (ਕੁੱਲ ${totalRain} ਮਿਲੀਮੀਟਰ) ਦੀ ਸੰਭਾਵਨਾ ਹੈ। ਖੇਤ ਵਿੱਚ ਪਾਣੀ ਦਾ ਪੱਧਰ ੩-੫ ਸੈਂਟੀਮੀਟਰ ਬਣਾਈ ਰੱਖੋ। ਜਲ-ਥਲ ਤੋਂ ਬਚਣ ਲਈ ਨਿਕਾਸੀ ਨਾਲੀਆਂ ਸਾਫ਼ ਕਰੋ।`
  };
  return {
    title: titles[lang] || titles['en'],
    text: texts[lang] || texts['en']
  };
};

const getPaddyLowRainAdvice = (lang: Language): AdviceStrings => {
  const titles: Record<Language, string> = {
    ta: 'நெல் நீர்ப்பாசன ஆலோசனை: சீரான நீர் தேக்கம்',
    en: 'Paddy Irrigation: Shallow Flooding',
    hi: 'धान सिंचाई: उथला जलभराव',
    te: 'వరి నీటి పారుదల: தక్కువ లోతులో நீటి నిల్వ',
    kn: 'ಭತ್ತದ ನೀರಾವರಿ: ಕಡಿಮೆ ನಿಲ್ಲುವ ನೀರು',
    ml: 'നെല്ല് ஜലസേചനം: കുറഞ്ഞ അളവിൽ വെള്ളം നിർത്തൽ',
    mr: 'भात सिंचन: कमी खोलीवर पाणी साठवणे',
    bn: 'ধান সেচ: কম গভীরতার জলমগ্নতা',
    gu: 'ડાંગર સિંચાઇ: છીછરો જલભરાવ',
    pa: 'ਝੋਨੇ ਦੀ ਸਿੰਚਾਈ: ਘੱਟ ਡੂੰਘਾ ਪਾਣੀ'
  };
  const texts: Record<Language, string> = {
    ta: 'குறைந்த மழையே எதிர்பார்க்கப்படுகிறது. தூர் கட்டும் மற்றும் பூக்கும் நிலைகளில் நிலத்தில் 2-3 செ.மீ அளவு நீர் எப்போதும் தேங்கி இருக்குமாறு பார்த்துக் கொள்ளவும்.',
    en: 'Low rainfall predicted. Ensure continuous shallow flooding of 2-3 cm during tillering and panicle initiation stages.',
    hi: 'कम वर्षा का अनुमान है। कल्ले फूटने और बाली आने की अवस्था में लगातार 2-3 सेमी उथला पानी बनाए रखें।',
    te: 'తక్కువ వర్షపాతం అంచనా వేయబడింది. దుబ్బులు కట్టే మరియు పూత దశల్లో పొలంలో 2-3 సెం.మీ నీరు ఉండేలా చూసుకోండి.',
    kn: 'ಕಡಿಮೆ ಮಳೆ ಮುನ್ಸೂಚನೆ ಇದೆ. ತೆನೆ ಕಟ್ಟುವ ಮತ್ತು ಹೂಬಿಡುವ ಹಂತಗಳಲ್ಲಿ ಗದ್ದೆಯಲ್ಲಿ 2-3 ಸೆಂ.ಮೀ ನೀರು ನಿಲ್ಲುವಂತೆ ನೋಡಿಕೊಳ್ಳಿ.',
    ml: 'കുറഞ്ഞ മഴയാണ് പ്രവചിക്കുന്നത്. കതിര് വരുന്ന സമയത്തും പൂക്കുന്ന ഘട്ടത്തിലും 2-3 സെ.മീ വെള്ളം പാടത്ത് ഉറപ്പാക്കുക.',
    mr: 'कमी पावसाचा अंदाज आहे. फुटवे येण्याच्या आणि लोंब्या येण्याच्या काळात शेतात २-३ सेमी पाणी सतत साठवून ठेवा.',
    bn: 'স্বল্প বৃষ্টির পূর্বাভাস রয়েছে। কুঁড়ি এবং শীষ আসার সময়ে জমিতে ২-৩ সেমি গভীরতার জল বজায় রাখুন।',
    gu: 'ઓછા વરસાદની આગાહી છે. પીલા ફૂટવાની અને ડુંડી બેસવાની અવસ્થા દરમિયાન સતત ૨-૩ સેમી પાણી જાળવી રાખો.',
    pa: 'ਘੱਟ ਮੀਂਹ ਦੀ ਭਵਿੱਖਬਾਣੀ ਹੈ। ਸ਼ਾਖਾਵਾਂ ਫੁੱਟਣ ਅਤੇ ਬੂਰ ਪੈਣ ਸਮੇਂ ਖੇਤ ਵਿੱਚ ਲਗਾਤਾਰ ੨-੩ ਸੈਂਟੀਮੀਟਰ ਪਾਣੀ ਬਣਾਈ ਰੱਖੋ।'
  };
  return {
    title: titles[lang] || titles['en'],
    text: texts[lang] || texts['en']
  };
};

const getTomatoHighRainAdvice = (lang: Language): AdviceStrings => {
  const titles: Record<Language, string> = {
    ta: 'தக்காளி நீர் மேலாண்மை: வேரழுகல் எச்சரிக்கை',
    en: 'Tomato Water Management: Root Rot Hazard',
    hi: 'टमाटर जल प्रबंधन: जड़ सड़न का खतरा',
    te: 'టమోటా నీటి యాజమాన్యం: వేరు కుళ్లు తెగులు ముప్పు',
    kn: 'ಟೊಮ್ಯಾಟೊ ನೀರು ನಿರ್ವಹಣೆ: ಬೇರು ಕೊಳೆತದ ಅಪಾಯ',
    ml: 'തക്കാളി ജല പരിപാലനം: വേരുചീയൽ മുന്നറിയിപ്പ്',
    mr: 'टोमॅटो पाणी व्यवस्थापन: मूळ कूज धोका',
    bn: 'টমেটো জল ব্যবস্থাপনা: শিকড় পচা রোগ সতর্কতা',
    gu: 'ટમેટા પાણી વ્યવસ્થાપન: મૂળ સડો થવાનું જોખમ',
    pa: 'ਟਮਾਟਰ ਪਾਣੀ ਪ੍ਰਬੰਧन: ਜੜ੍ਹ ਗਲਣ ਦਾ ਖਤਰਾ'
  };
  const texts: Record<Language, string> = {
    ta: 'அதிக மழை காரணமாக மண்ணில் அதிக ஈரப்பதம் கூடி வேரழுகல் மற்றும் பூக்கள் கொட்டுதல் ஏற்படலாம். அடுத்த 3-4 நாட்களுக்கு நீர் பாய்ச்சுவதை நிறுத்திவிட்டு, வயலில் தேங்கும் நீரை உடனடியாக வெளியேற்றவும்.',
    en: 'High soil moisture from rain can trigger Pythium root rot and flower drop. Suspend irrigation for 3-4 days and maintain active trench drainage.',
    hi: 'बारिश के कारण अत्यधिक नमी से जड़ सड़न और फूल गिरने की समस्या हो सकती है। अगले 3-4 दिनों के लिए सिंचाई रोक दें और खेतों से जल निकासी करें।',
    te: 'అధిక వర్షాల వల్ల కలిగే తేమ వల్ల వేరు కుళ్లు తెగులు మరియు పూత రాలడం సంభవించవచ్చు. రాబోయే 3-4 రోజులు నీటి సరఫరా నిలిపివేసి, నీటిని బయటకు పంపండి.',
    kn: 'ಮಳೆಯಿಂದ ಉಂಟಾಗುವ ಅತಿಯಾದ ತೇವಾಂಶವು ಬೇರು ಕೊಳೆತ ಮತ್ತು ಹೂವು ಉದುರುವಿಕೆಗೆ ಕಾರಣವಾಗಬಹುದು. ಮುಂದಿನ 3-4 ದಿನ ನೀರಾವರಿ ನಿಲ್ಲಿಸಿ ಮತ್ತು ಚರಂಡಿ ವ್ಯವಸ್ಥೆ ಮಾಡಿ.',
    ml: 'മഴ കാരണം മണ്ണിൽ ഈർപ്പം കൂടുന്നത് വേരുചീയലിനും പൂ കൊഴിച്ചിലിനും കാരണമാകാം. അടുത്ത 3-4 ദിവസത്തേക്ക് നനയ്ക്കുന്നത് നിർത്തി വെള്ളം വാർന്നു കളയുക.',
    mr: 'काढणीच्या वेळी अति पावसाची शक्यता असल्याने कंद कुजण्याचा आणि बुरशीजन्य रोगांचा प्रादुर्भाव होऊ नये म्हणून तातडीने निचरा करा.',
    bn: 'বৃষ্টির কারণে অতিরিক্ত আর্দ্রতা শিকড় পচা ও ফুল ঝরে পড়ার কারণ হতে পারে। আগামী ৩-৪ দিন সেচ বন্ধ রাখুন এবং জল নিষ্কাশনের ব্যবস্থা করুন।',
    gu: 'વરસાદના કારણે જમીનમાં વધુ પડતો ભેજ મૂળ સડો અને ફૂલ ખરી પડવા માટે જવાબદાર બની શકે છે. ૩-૪ દિવસ સિંચાઇ બંધ રાખો અને નિકાલ કરો.',
    pa: 'ਮੀਂਹ ਕਾਰਨ ਜ਼ਿਆਦਾ ਨਮੀ ਨਾਲ ਜੜ੍ਹ ਗਲਣ ਅਤੇ ਫੁੱਲ ਝੜਨ ਦੀ ਸਮੱਸਿਆ ਹੋ ਸਕਦੀ ਹੈ। ਅਗਲੇ ੩-੪ ਦਿਨਾਂ ਲਈ ਸਿੰਚਾਈ ਰੋਕ ਦਿਓ ਅਤੇ ਨਿਕਾਸੀ ਦਾ ਪ੍ਰਬੰਧ ਕਰੋ।'
  };
  return {
    title: titles[lang] || titles['en'],
    text: texts[lang] || texts['en']
  };
};

const getTomatoLowRainAdvice = (lang: Language, maxTemp: number): AdviceStrings => {
  const titles: Record<Language, string> = {
    ta: 'தக்காளி நீர் மேலாண்மை: சொட்டுநீர் பாசனம்',
    en: 'Tomato Water Management: Regulated Drip',
    hi: 'टमाटर जल प्रबंधन: नियंत्रित ड्रिप सिंचाई',
    te: 'టమోటా నీటి యాజమాన్యం: క్రమబద్ధీకరించిన డ్రిప్',
    kn: 'ಟೊಮ್ಯಾಟೊ ನೀರು ನಿರ್ವಹಣೆ: ನಿಯಂತ್ರಿತ ಹನಿ ನೀರಾವರಿ',
    ml: 'തക്കാളി ജല പരിപാലനം: ക്രമീകരിച്ച തുള്ളിനന',
    mr: 'टोमॅटो पाणी व्यवस्थापन: नियंत्रित ठिबक सिंचन',
    bn: 'টমেটো জল ব্যবস্থাপনা: নিয়ন্ত্রিত ফোঁটা সেচ (ড্রিপ)',
    gu: 'ટમેટા પાણી વ્યવસ્થાપન: નિયંત્રિત ટપક સિંચાઇ',
    pa: 'ਟਮਾਟਰ ਪਾਣੀ ਪ੍ਰਬੰਧਨ: ਨਿਯੰਤ੍ਰਿਤ ਤੁਪਕਾ ਸਿੰਚਾਈ'
  };
  const texts: Record<Language, string> = {
    ta: `வெப்பநிலை ${maxTemp}°C வரை உயர வாய்ப்புள்ளதால், தினமும் காலை அல்லது மாலை சொட்டுநீர் பாசனம் மூலம் சீரான ஈரப்பதத்தை வழங்கவும்.`,
    en: `With temp peaking at ${maxTemp}°C, provide consistent moisture via daily morning drip irrigation to prevent blossom end rot.`,
    hi: `तापमान ${maxTemp}°से. तक पहुंचने के कारण, ब्लॉसम एंड रॉट से बचने के लिए दैनिक सुबह ड्रिप सिंचाई के माध्यम से निरंतर नमी प्रदान करें।`,
    te: `ఉష్ణోగ్రత ${maxTemp}°C కి పెరిగే అవకాశం ఉన్నందున, పూత కుళ్లు తెగులు నివారణకు ప్రతిరోజూ ఉదయం డ్రిప్ ద్వారా తగినంత తేమను అందించండి.`,
    kn: `ತಾಪಮಾನವು ${maxTemp}°C ತಲುಪುವುದರಿಂದ, ಹೂವಿನ ತುದಿ ಕೊಳೆತ ತಡೆಗಟ್ಟಲು ಪ್ರತಿದಿನ ಮುಂಜಾನೆ ಹನಿ ನೀರಾವರಿ ಮೂಲಕ ಸ್ಥಿರ ತೇವಾಂಶ ಒದಗಿಸಿ.`,
    ml: `താപനില ${maxTemp}°C വരെ ഉയരുമെന്നതിനാൽ കായ് ചീയൽ തടയാൻ ദിവസവും രാവിലെ തുള്ളിനന വഴി ഈർപ്പം ഉറപ്പാക്കുക.`,
    mr: `तापमान ${maxTemp}°C पर्यंत जाण्याची शक्यता असल्याने, फळ सडणे रोखण्यासाठी रोज सकाळी ठिबक सिंचनाद्वारे योग्य ओलावा द्या.`,
    bn: `তাপমাত্রা ${maxTemp}°সে.-এ পৌঁছানোর কারণে, ব্লসম এন্ড রট রোগ রোধে প্রতিদিন সকালে ড্রিপ সেচের মাধ্যমে নিয়মিত আর্দ্রতা বজায় রাখুন।`,
    gu: `તાપમાન ${maxTemp}°C સુધી વધવાની શક્યતા હોવાથી, ફળનો કોહવારો અટકાવવા રોજ સવારે ટપક સિંચાઇ દ્વારા ભેજ પૂરો પાડો.`,
    pa: `ਤਾਪਮਾਨ ${maxTemp}°C ਤੱਕ ਪਹੁੰਚਣ ਕਾਰਨ, ਫਲਾਂ ਨੂੰ ਖ਼ਰਾਬ ਹੋਣ ਤੋਂ ਬਚਾਉਣ ਲਈ ਰੋਜ਼ਾਨਾ ਸਵੇਰੇ ਤੁਪਕਾ ਸਿੰਚਾਈ ਰਾਹੀਂ ਨਮੀ ਦਿਓ।`
  };
  return {
    title: titles[lang] || titles['en'],
    text: texts[lang] || texts['en']
  };
};

const getGroundnutHighRainAdvice = (lang: Language): AdviceStrings => {
  const titles: Record<Language, string> = {
    ta: 'நிலக்கடலை நீர் மேலாண்மை: மிதமிஞ்சிய ஈரப்பதம்',
    en: 'Groundnut Management: Excessive Moisture',
    hi: 'मूंगफली प्रबंधन: अत्यधिक नमी का खतरा',
    te: 'వేరుశనగ యాజమాన్యం: అధిక తేమ ముప్పు',
    kn: 'ನೆಲಗಡಲೆ ನಿರ್ವಹಣೆ: ಅತಿಯಾದ ತೇವಾಂಶ',
    ml: 'നിലക്കടല പരിപാലനം: അമിത ഈർപ്പം',
    mr: 'भुईमूग व्यवस्थापन: अति ओलावा',
    bn: 'চিনাবাদাম ব্যবস্থাপনা: অতিরিক্ত আর্দ্রতা',
    gu: 'મગફળી વ્યવસ્થાપન: વધુ પડતો ભેજ',
    pa: 'ਮੂੰਗਫਲੀ ਪ੍ਰਬੰਧਨ: ਜ਼ਿਆਦਾ ਨਮੀ'
  };
  const texts: Record<Language, string> = {
    ta: 'நிலக்கடலை பயிர் தேங்கி நிற்கும் நீரை தாங்காது. அதிக மழையால் விழுது இறங்குவது பாதிக்கப்படலாம். நீர்ப்பாசனத்தை முற்றிலுமாக தவிக்கவும்.',
    en: 'Groundnuts are highly sensitive to waterlogging, which stunts pod development. Suspend irrigation entirely and prevent field stagnation.',
    hi: 'मूंगफली की फसल जलभराव के प्रति अत्यधिक संवेदनशील है, जो फलियों के विकास को रोकती है। सिंचाई पूरी तरह रोक दें और पानी जमा न होने दें।',
    te: 'వేరుశనగ పంట నీటి నిల్వను తట్టుకోలేదు, ఇది కాయల ఎదుగుదలను దెబ్బతీస్తుంది. నీటి సరఫరాను పూర్తిగా నిలిపివేయండి.',
    kn: 'ನೆಲಗಡಲೆ ಬೆಳೆ ಜಲಾವೃತ ಸಹಿಸುವುದಿಲ್ಲ, ಇದು ಕಾಯಿ ಕಟ್ಟುವುದನ್ನು ಕುಂಠಿತಗೊಳಿಸುತ್ತದೆ. ಸಂಪೂರ್ಣವಾಗಿ ನೀರಾವರಿ ನಿಲ್ಲಿಸಿ.',
    ml: 'നിലക്കടല വെള്ളക്കെട്ടിനെ പ്രതിരോധിക്കില്ല, ഇത് കായ് ഉണ്ടാകുന്നത് തടയും. നനയ്ക്കുന്നത് പൂർണ്ണമായി ഒഴിവാക്കുക.',
    mr: 'भुईमूग पीक साठलेल्या पाण्याला अत्यंत संवेदनशील आहे, ज्यामुळे शेंगांची वाढ खुंटते. सिंचन पूर्णपणे बंद करा.',
    bn: 'চিনাবাদাম জলমগ্নতা সহ্য করতে পারে না, যা ফলন ব্যাহত করে। সেচ সম্পূর্ণরূপে বন্ধ রাখুন এবং জল জমতে দেবেন না।',
    gu: 'મગફળીનો પાક જલભરાવ પ્રત્યે સંવેદનશીલ છે, જે ડોડવા બેસવાની ક્રિયા અવરોધે છે. સિંચાઇ સંપૂર્ણપણે સ્થગित કરો.',
    pa: 'ਮੂੰਗਫਲੀ ਦੀ ਫਸਲ ਜਲ-ਥਲ ਪ੍ਰਤੀ ਬਹੁਤ ਸੰਵੇਦਨਸ਼ੀલ ਹੈ, ਜੋ ਡੋਡਿਆਂ ਦੇ ਵਿਕਾਸ ਨੂੰ ਰੋਕਦੀ ਹੈ। ਸਿੰਚਾਈ ਪੂਰੀ ਤਰ੍ਹਾਂ ਬੰਦ ਕਰ ਦਿਓ।'
  };
  return {
    title: titles[lang] || titles['en'],
    text: texts[lang] || texts['en']
  };
};

const getGroundnutLowRainAdvice = (lang: Language): AdviceStrings => {
  const titles: Record<Language, string> = {
    ta: 'நிலக்கடலை நீர் மேலாண்மை: பூக்கும் தருண நீர் தேவை',
    en: 'Groundnut Management: Critical Pegging Phase',
    hi: 'मूंगफली प्रबंधन: महत्वपूर्ण सुइयां बनने की अवस्था',
    te: 'వేరుశనగ యాజమాన్యం: ఊడలు దిగే దశ నీటి అవసరం',
    kn: 'ನೆಲಗಡಲೆ ನಿರ್ವಹಣೆ: ಕಾಯಿ ಬಿಡುವ ಪ್ರಮುಖ ಹಂತ',
    ml: 'നിലക്കടല പരിപാലനം: വിത്ത് പാകുന്ന നിർണായക ഘട്ടം',
    mr: 'भुईमूग व्यवस्थापन: आऱ्या सुटण्याची नाजूक अवस्था',
    bn: 'চিনাবাদাম ব্যবস্থাপনা: শিষ বেরোনোর গুরুত্বপূর্ণ ধাপ',
    gu: 'મગફળી વ્યવસ્થાપન: મહત્વની સૂયારો બેસવાની અવસ્થા',
    pa: 'ਮੂੰਗਫਲੀ ਪ੍ਰਬੰਧਨ: ਡੋਡੇ ਬਣਨ ਦੀ ਨਾਜ਼ੁਕ ਅਵਸਥਾ'
  };
  const texts: Record<Language, string> = {
    ta: 'பூக்கும் மற்றும் விழுது இறங்கும் நிலைகளில் ஈரப்பதம் அவசியம். வறண்ட வானிலை இருந்தால் லேசான தெளிப்பு நீர் பாசனம் (Sprinkler) மூலம் மண்ணைப் பதமாக வைக்கவும்.',
    en: 'Maintain moisture during pegging and pod-filling. If soil is dry, perform light sprinkler irrigation to ease peg penetration.',
    hi: 'सुइयां बनने और फलियों के भराव के दौरान नमी बनाए रखें। यदि मिट्टी सूखी है, तो सुइयों के आसानी से प्रवेश के लिए हल्की स्प्रिंकलर सिंचाई करें।',
    te: 'ఊడలు దిగే మరియు కాయ నిండే దశల్లో తగినంత తేమ అవసరం. నేల పొడిగా ఉంటే, ఊడలు సులభంగా దిగడానికి స్ప్రెంక్లర్ ద్వారా తేలికపాటి తడులు ఇవ్వండి.',
    kn: 'ಕಾಯಿ ಕಟ್ಟುವ ಮತ್ತು ತುಂಬುವ ಹಂತದಲ್ಲಿ ತೇವಾಂಶ ಕಾಪಾಡಿ. ಮಣ್ಣು ಒಣಗಿದ್ದರೆ, ಕಾಯಿ ಸುಲಭವಾಗಿ ಇಳಿಯಲು ಲಘು ಸಿಂಪರಣೆ ನೀರಾವರಿ ಮಾಡಿ.',
    ml: 'കായ്കൾ ഉണ്ടാകുന്ന സമയത്ത് മണ്ണിൽ ഈർപ്പം നിലനിർത്തണം. മണ്ണ് വരണ്ടതാണെങ്കിൽ വിത്ത് മണ്ണിലേക്ക് ഇറങ്ങാൻ ചെറുതായി നനച്ചു കൊടുക്കുക.',
    mr: 'आऱ्या जमिनीत जाण्याच्या आणि शेंगा भरण्याच्या काळात ओलावा ठेवा. जमीन कोरडी असल्यास आऱ्या सहज जाण्यासाठी हलके तुषार सिंचन करा.',
    bn: 'শিষ বেরোনো ও দানা পুষ্ট হওয়ার সময়ে আর্দ্রতা বজায় রাখুন। মাটি শুষ্ক থাকলে শিষ সহজে প্রবেশের জন্য হালকা স্প্রিঙ্কলার সেচ দিন।',
    gu: 'સૂયારો બેસવાની અને ડોડવા ભરાવવાની અવસ્થા દરમિયાન ભેજ જાળવો. જો જમીન સૂકી હોય, તો સૂયારો સરળતાથી ઉતરવા હળવી ફુવારા પદ્ધતિથી પિયત આપો.',
    pa: 'ਡੋਡੇ ਬਣਨ ਅਤੇ ਭਰਨ ਸਮੇਂ ਨਮੀ ਬਣਾਈ ਰੱਖੋ। ਜੇਕਰ ਮਿੱਟੀ ਸੁੱਕੀ ਹੈ, ਤਾਂ ਡੋਡਿਆਂ ਦੇ ਆਸਾਨੀ ਨਾਲ ਜ਼ਮੀਨ ਵਿੱਚ ਜਾਣ ਲਈ ਹਲਕੀ ਫੁਹਾਰਾ ਸਿੰਚਾਈ ਕਰੋ।'
  };
  return {
    title: titles[lang] || titles['en'],
    text: texts[lang] || texts['en']
  };
};

const getGeneralHighRainAdvice = (lang: Language, totalRain: number): AdviceStrings => {
  const titles: Record<Language, string> = {
    ta: 'பொதுவான நீர்ப்பாசன ஆலோசனை: நீர் சேமிப்பு முறை',
    en: 'General Irrigation: Water Conservation',
    hi: 'सामान्य सिंचाई: जल संरक्षण योजना',
    te: 'సాधారణ నీటి పారుదల: నీటి పొదుపు పద్ధతి',
    kn: 'ಸಾಮಾನ್ಯ ನೀರಾವರಿ: ನೀರು ಸಂರಕ್ಷಣೆ ವಿಧಾನ',
    ml: 'പൊതുവായ ജലസേചനം: ജല സംരക്ഷണ രീതി',
    mr: 'सामान्य सिंचन: पाणी बचत पद्धत',
    bn: 'সাধারণ সেচ: জল সংরক্ষণ পদ্ধতি',
    gu: 'સામાન્ય સિંચાઇ: પાણી બચાવ પદ્ધતિ',
    pa: 'ਸਧਾਰਨ ਸਿੰਚਾਈ: ਪਾਣੀ ਦੀ ਬਚਤ ਦਾ ਤਰੀਕਾ'
  };
  const texts: Record<Language, string> = {
    ta: `மொத்த மழை கணிப்பு: ${totalRain} மிமீ. மழை பெய்யும் நாட்களில் மோட்டார் இயக்குவதைத் தவிர்க்கலாம். மண்ணின் ஈரப்பத்தைப் பொறுத்து நீர்ப்பாசனத்தை மாற்றி அமைக்கவும்.`,
    en: `Total rain forecast: ${totalRain}mm. You can reduce electric pump irrigation. Rely on natural precipitation and schedule next irrigation based on soil moisture.`,
    hi: `कुल वर्षा पूर्वानुमान: ${totalRain} मिमी। आप बिजली के पंप से सिंचाई कम कर सकते हैं। प्राकृतिक वर्षा पर भरोसा करें और मिट्टी की नमी के आधार पर अगली सिंचाई निर्धारित करें।`,
    te: `మొత్తం వర్షపాతం అంచనా: ${totalRain} మిమీ. మోటారు వాడకాన్ని తగ్గించండి. సహజ వర్షపాతంపై ఆధారపడి, నేల తేమను బట్టి తదుపరి తడిని ప్లాన్ చేయండి.`,
    kn: `ಒಟ್ಟು ಮಳೆ ಮುನ್ಸೂಚನೆ: ${totalRain} ಮಿಮೀ. ಪಂಪ್ ನೀರಾವರಿ ಕಡಿಮೆ ಮಾಡಬಹುದು. ನೈಸರ್ಗಿಕ ಮಳೆಯನ್ನೇ ಅವಲಂಬಿಸಿ ಮತ್ತು ಮಣ್ಣಿನ ತೇವಾಂಶಕ್ಕೆ ಅನುಗುಣವಾಗಿ ನೀರಾವರಿ ನಿಗದಿಪಡಿಸಿ.`,
    ml: `ആകെ മഴ പ്രവചനം: ${totalRain} മി.മീ. ഇലക്ട്രിക് പമ്പ് വഴിയുള്ള നന കുറയ്ക്കാം. സ്വാഭാവിക മഴയെ ആശ്രയിക്കുക, അടുത്ത നന മണ്ണിലെ ഈർപ്പം നോക്കി നിശ്ചയിക്കുക.`,
    mr: `एकूण पावसाचा अंदाज: ${totalRain} मिमी. तुम्ही पंपाद्वारे सिंचन कमी करू शकता. नैसर्गिक पावसावर अवलंबून रहा आणि मातीच्या ओलाव्यानुसार पुढील सिंचन ठरवा.`,
    bn: `মোট বৃষ্টির পূর্বাভাস: ${totalRain} মিমি। বৈদ্যুতিক পাম্প সেচ কমাতে পারেন। প্রাকৃতিক বৃষ্টিপাতের ওপর ভরসা রাখুন এবং মাটির আর্দ্রতার ভিত্তিতে পরবর্তী সেচ নির্ধারণ করুন।`,
    gu: `કુલ વરસાદની આગાહી: ${totalRain} મીમી. તમે ઇલેક્ટ્રિક પંપ પિયત ઘટાડી શકો છો. કુદરતી વરસાદ પર આધાર રાખો અને જમીનના ભેજ મુજબ આગળનું આયોજન કરો.`,
    pa: `ਕੁੱਲ ਮੀਂਹ ਦਾ ਅਨੁਮਾਨ: ${totalRain} ਮਿਲੀਮੀਟਰ। ਤੁਸੀਂ ਬਿਜਲੀ ਦੇ ਪੰਪ ਦੀ ਵਰਤੋਂ ਘਟਾ ਸਕਦੇ ਹੋ। ਕੁਦਰਤੀ ਮੀਂਹ 'ਤੇ ਭਰੋਸਾ ਕਰੋ ਅਤੇ ਮਿੱਟੀ ਦੀ ਨਮੀ ਅਨੁਸਾਰ ਅਗਲੀ ਸਿੰਚਾਈ ਤੈਅ ਕਰੋ।`
  };
  return {
    title: titles[lang] || titles['en'],
    text: texts[lang] || texts['en']
  };
};

const getGeneralLowRainAdvice = (lang: Language): AdviceStrings => {
  const titles: Record<Language, string> = {
    ta: 'பொதுவான நீர்ப்பாசன ஆலோசனை: வழக்கமான பராமரிப்பு',
    en: 'General Irrigation: Standard Schedule',
    hi: 'सामान्य सिंचाई: मानक समय सारिणी',
    te: 'సాధారణ నీటి పారుదల: సాధారణ షెడ్యూల్',
    kn: 'ಸಾಮಾನ್ಯ ನೀರಾವರಿ: ಪ್ರಮಾಣಿತ ವೇಳಾಪಟ್ಟಿ',
    ml: 'പൊതുവായ ജലസேചനം: സാധാരണ സമയക്രമം',
    mr: 'सामान्य सिंचन: प्रमाणित वेळापत्रक',
    bn: 'সাধারণ সেচ: মানসম্মত সময়সূচী',
    gu: 'સામાન્ય સિંચાઇ: સ્ટાન્ડર્ડ શેડ્યૂલ',
    pa: 'ਸਧਾਰਨ ਸਿੰਚਾਈ: ਮਿਆਰੀ ਸਮਾਂ-ਸਾਰਣੀ'
  };
  const texts: Record<Language, string> = {
    ta: 'வெப்பநிலை மற்றும் சீரான ஈரப்பதத்தை கண்காணிக்கவும். மண்ணின் மேல் அடுக்கு காய்ந்தவுடன் மட்டும் தகுந்த நீர்ப்பாசனம் வழங்கவும்.',
    en: 'Weather is stable. Follow standard crop-specific irrigation. Check surface dryness before launching fresh irrigation cycles.',
    hi: 'मौसम स्थिर है। मानक फसल-विशिष्ट सिंचाई का पालन करें। सिंचाई का नया चक्र शुरू करने से पहले ऊपरी मिट्टी के सूखेपन की जांच करें।',
    te: 'వాతావరణం స్థిరంగా ఉంది. పంట ఆధారిత సాధారణ నీటి యాజమాన్యాన్ని అనుసరించండి. నీరు పెట్టే ముందు పై నేల ఆరిందో లేదో చూడండి.',
    kn: 'ಹವಾಮಾನ ಸ್ಥಿರವಾಗಿದೆ. ಪ್ರಮಾಣಿತ ಬೆಳೆ-ನಿರ್ದಿಷ್ಟ ನೀರಾವರಿ ಅನುಸರಿಸಿ. ಹೊಸ ನೀರಾವರಿ ಚಕ್ರ ಆರಂಭಿಸುವ ಮುನ್ನ ಮಣ್ಣಿನ ಮೇಲ್ಪದರದ ಒಣಗುವಿಕೆ ಪರಿಶೀಲಿಸಿ.',
    ml: 'കാലാവസ്ഥ സുസ്ഥിരമാണ്. വിളകൾക്കനുയോജ്യമായ സാധാരണ നന പിന്തുടരുക. അടുത്ത തവണ നനയ്ക്കുന്നതിന് മുൻപ് മൺനിരപ്പ് ഉണങ്ങിയിട്ടുണ്ടെന്ന് ഉറപ്പാക്കുക.',
    mr: 'हवामान स्थिर आहे. पीक-विशिष्ट सिंचनाचे पालन करा. नवीन सिंचन चक्र सुरू करण्यापूर्वी वरच्या मातीच्या कोरडेपणाची तपासणी करा.',
    bn: 'আবহাওয়া স্থিতিশীল। ফসল-নির্দিষ্ট সেচ অনুসরণ করুন। নতুন সেচ চক্র শুরু করার আগে মাটির উপরিভাগের শুষ্কতা পরীক্ষা করুন।',
    gu: 'હવામાન સ્થિર છે. પાક-વિશિષ્ટ પ્રમાણિત શેડ્યૂલ અનુસરો. નવું પિયત આપતા પહેલા જમીનની ઉપરની સપાટી સૂકી છે કે નહિ તે ચકાસો.',
    pa: 'ਮੌਸਮ ਸਥਿਰ ਹੈ। ਫਸਲ-ਵਿਸ਼ੇਸ਼ ਮਿਆਰੀ ਸਿੰਚਾਈ ਦੀ ਪਾਲਣਾ ਕਰੋ। ਨਵਾਂ ਸਿੰਚਾਈ ਚੱਕਰ ਸ਼ੁਰੂ ਕਰਨ ਤੋਂ ਪਹਿਲਾਂ ਉੱਪਰੀ ਮਿੱਟੀ ਦੇ ਸੁੱਕੇਪਣ ਦੀ ਜਾਂਚ ਕਰੋ।'
  };
  return {
    title: titles[lang] || titles['en'],
    text: texts[lang] || texts['en']
  };
};

interface WeatherProps {
  weather: WeatherData;
  language?: Language;
}

interface CropStageThreat {
  level: 'Red' | 'Orange' | 'Yellow' | 'Green';
  titleEn: string;
  titleTa: string;
  descEn: string;
  descTa: string;
}

export default function WeatherDashboard({ weather, language = 'ta' }: WeatherProps) {
  const isTamil = language === 'ta';
  const [selectedCrop, setSelectedCrop] = useState<string>('all');
  const [selectedStage, setSelectedStage] = useState<string>('vegetative');
  const [soilMoisture, setSoilMoisture] = useState<number>(42);

  // Map weather conditions to logical rainfall estimates for the chart
  const getRainfallForCondition = (condition: string, index: number): number => {
    const cond = condition.toLowerCase();
    if (cond.includes('thunderstorm') || cond.includes('heavy') || cond.includes('இடி') || cond.includes('கன')) {
      return Math.floor(25 + (index * 8) % 30); // 25 - 55 mm
    }
    if (cond.includes('rainy') || cond.includes('rain') || cond.includes('மழை')) {
      return Math.floor(10 + (index * 6) % 18); // 10 - 28 mm
    }
    if (cond.includes('cloudy') || cond.includes('clouds') || cond.includes('மேக')) {
      return Math.floor(2 + (index * 1.5) % 4);  // 2 - 5 mm
    }
    return 0; // Sunny / Partly Cloudy default
  };

  const getIcon = (cond: string) => {
    const c = cond.toLowerCase();
    if (c.includes('sunny') || c.includes('sun')) return <Sun className="h-6 w-6 text-yellow-500" />;
    if (c.includes('cloudy') || c.includes('clouds')) return <CloudSun className="h-6 w-6 text-gray-500" />;
    if (c.includes('rainy') || c.includes('rain')) return <CloudRain className="h-6 w-6 text-blue-500" />;
    if (c.includes('lightning') || c.includes('thunderstorm')) return <CloudLightning className="h-6 w-6 text-indigo-500" />;
    return <CloudSun className="h-6 w-6 text-yellow-500" />;
  };

  // Construct 7-day chart data based on forecast and live metrics
  const chartData = weather.forecast.map((dayForecast, idx) => {
    return {
      name: dayForecast.day,
      temp: dayForecast.temp,
      rain: getRainfallForCondition(dayForecast.condition, idx),
      condition: dayForecast.condition,
    };
  });

  // Since weather.forecast has 5 elements, we extend it to 7 elements
  if (chartData.length === 5) {
    const extraDaysMap: Record<Language, string[]> = {
      ta: ['சனி', 'ஞாயிறு'],
      en: ['Sat', 'Sun'],
      hi: ['शनि', 'रवि'],
      te: ['శని', 'ఆది'],
      kn: ['ಶನಿ', 'ಭಾನು'],
      ml: ['ശനി', 'ഞായർ'],
      mr: ['शनि', 'रवि'],
      bn: ['শনি', 'রবি'],
      gu: ['શનિ', 'રવિ'],
      pa: ['ਸ਼ਨੀ', 'ਐਤ']
    };
    const extraCondsMap: Record<Language, string[]> = {
      ta: ['ஓரளவு மேகமூட்டம்', 'வெயில்'],
      en: ['Partly Cloudy', 'Sunny'],
      hi: ['आंशिक रूप से बादल छाए रहेंगे', 'धूप'],
      te: ['పాక్షికంగా మేఘావృతం', 'ఎండగా'],
      kn: ['ಭಾಗಶಃ ಮೋಡ', 'ಬಿಸಿಲು'],
      ml: ['ഭാഗികമായി మేഘാവൃതം', 'വെയിൽ'],
      mr: ['अंशतः ढगाळ', 'उन्हाळा'],
      bn: ['আংশিক মেঘলা', 'রৌদ্রোজ্জ্বল'],
      gu: ['આંશિક વાદળછાયું', 'તડકો'],
      pa: ['ਆਂਸ਼ਿਕ ਬੱదਲਵਾਈ', 'ਧੁੱਪ']
    };
    const extraDays = extraDaysMap[language] || extraDaysMap['en'];
    const extraConds = extraCondsMap[language] || extraCondsMap['en'];
    const extraTemps = [Math.floor(weather.temperature - 1), Math.floor(weather.temperature)];

    extraDays.forEach((day, index) => {
      chartData.push({
        name: day,
        temp: extraTemps[index],
        rain: index === 0 ? 1 : 0,
        condition: extraConds[index],
      });
    });
  }

  // Calculate total rainfall for the next 7 days
  const totalRain7Days = chartData.reduce((sum, d) => sum + d.rain, 0);

  // Generate scientific crop-specific water scheduling advice
  const getCropAdvice = () => {
    const highRain = totalRain7Days > 20;

    if (selectedCrop === 'paddy') {
      const adv = highRain 
        ? getPaddyHighRainAdvice(language, totalRain7Days) 
        : getPaddyLowRainAdvice(language);
      return {
        title: adv.title,
        text: adv.text,
        status: highRain ? 'skip' : 'normal'
      };
    }

    if (selectedCrop === 'tomato') {
      const maxTemp = Math.max(...chartData.map(d => d.temp), weather.temperature);
      const adv = highRain 
        ? getTomatoHighRainAdvice(language) 
        : getTomatoLowRainAdvice(language, maxTemp);
      return {
        title: adv.title,
        text: adv.text,
        status: highRain ? 'danger' : 'normal'
      };
    }

    if (selectedCrop === 'groundnut') {
      const adv = highRain 
        ? getGroundnutHighRainAdvice(language) 
        : getGroundnutLowRainAdvice(language);
      return {
        title: adv.title,
        text: adv.text,
        status: highRain ? 'danger' : 'normal'
      };
    }

    // Default general advice
    const adv = highRain 
      ? getGeneralHighRainAdvice(language, totalRain7Days) 
      : getGeneralLowRainAdvice(language);
    return {
      title: adv.title,
      text: adv.text,
      status: highRain ? 'skip' : 'normal'
    };
  };

  const advice = getCropAdvice();

  // Dynamic Crop Stage specific threat calculation
  const getStageSpecificThreat = (crop: string, stage: string): CropStageThreat => {
    const isHighHeat = weather.temperature > 34;
    const isExtremeHeat = weather.temperature > 37;
    const isHighRain = totalRain7Days > 22 || weather.rainfall > 12;
    const isSevereRain = totalRain7Days > 40 || weather.rainfall > 20;
    const isHighHumidity = weather.humidity > 85;
    const isHighWind = weather.windSpeed > 18;

    if (crop === 'paddy') {
      switch (stage) {
        case 'seedling':
          if (isExtremeHeat) {
            return {
              level: 'Orange',
              titleEn: 'Heat Stress Risk on Paddy Seedlings',
              titleTa: 'நெல் நாற்றங்கால் பயிர்களில் வெப்ப அழுத்த அபாயம்',
              descEn: 'High temperatures (>37°C) dry up shallow nursery seedbeds. Irrigate in early mornings and keep soil consistently damp.',
              descTa: 'நாற்றங்கால்கள் காய்ந்து கருகும் அபாயம் உள்ளது. அதிகாலை வேளையிலேயே நீர் பாய்ச்சி ஈரப்பதத்தை சீராகப் பராமரிக்கவும்.'
            };
          }
          if (isSevereRain) {
            return {
              level: 'Orange',
              titleEn: 'Flooding Threat to Seedbed Sprouts',
              titleTa: 'இளம் நெல் நாற்றுகளில் வெள்ள அபாயம்',
              descEn: 'Severe rain predicted. Delicate young paddy shoots may drown or uproot. Keep all perimeter drainage clear.',
              descTa: 'கனமழை முன்னறிவிப்பு. இளம் நெல் நாற்றுகள் அழுகும் நிலை ஏற்படலாம். நாற்றங்கால் வடிகால்களை உடனடியாகத் திறக்கவும்.'
            };
          }
          return {
            level: 'Green',
            titleEn: 'Optimal Paddy Seedling Conditions',
            titleTa: 'நெல் நாற்றங்காலுக்கு உகந்த சூழல்',
            descEn: 'No active atmospheric threats. Keep nursery water levels strictly at 1-2 cm for robust shoot formation.',
            descTa: 'பாதிப்புகள் ஏதுமில்லை. ஆரோக்கியமான வளர்ச்சிக்கு நாற்றங்கால் நீர் மட்டத்தை 1-2 செ.மீ அளவில் எப்போதும் வைத்திருக்கவும்.'
          };

        case 'vegetative':
          if (isHighRain) {
            return {
              level: 'Yellow',
              titleEn: 'Active Tillering Flood Check',
              titleTa: 'தூர்கட்டும் பருவத்தில் வடிகால் கண்காணிப்பு',
              descEn: 'Moderate to high rain can overwhelm young tillers. Ensure water levels do not exceed 5 cm to promote maximum tillering.',
              descTa: 'அதிக மழையினால் இளம் தூர்கள் மூழ்கலாம். அதிகப்படியான கிளைகள் பிடிக்க நீர் மட்டத்தை 5 செ.மீ க்கும் குறைவாகவே வைக்கவும்.'
            };
          }
          return {
            level: 'Green',
            titleEn: 'Perfect Conditions for Tillering',
            titleTa: 'தூர்கட்டுவதற்கு உகந்த சிறந்த சூழல்',
            descEn: 'Stable growth conditions. Favorable window for applying balanced organic compost or top-dressing nitrogen.',
            descTa: 'கிளைப்புகள் செழிக்க ஏதுவான காலம். களைகளை எடுத்துவிட்டு தழைச்சத்து உரங்களை இடுவதற்கு மிகவும் உகந்தது.'
          };

        case 'flowering':
          if (isHighHeat) {
            return {
              level: 'Red',
              titleEn: 'CRITICAL: Heat-Induced Spikelet Sterility',
              titleTa: 'மிக முக்கியம்: அதிக வெப்பத்தால் நெல் கருவுறாமை அபாயம்',
              descEn: 'Temperatures over 34°C during morning pollination hours dry out pollen, causing spikelet sterility (empty grains). Increase water depth to 6-8 cm to cool the micro-climate.',
              descTa: 'பூக்கும் தருணத்தில் 34°C-க்கு மேல் வெயில் பதிவாவதால் மகரந்தங்கள் காய்ந்து சாவியாகும் (பதர் நெல்). வயலில் 6-8 செ.மீ தண்ணீர் நிறுத்தி வெப்பத்தைக் குறைக்கவும்.'
            };
          }
          if (isHighRain || isHighWind) {
            return {
              level: 'Red',
              titleEn: 'CRITICAL: Anthesis Interruption Risk',
              titleTa: 'மிக முக்கியம்: மழைப்பொழிவு மற்றும் பலத்த காற்றினால் மகரந்தக் கேடு',
              descEn: 'Precipitation or strong gusts during peak morning hours wash away pollen grains, leading to poor grain-filling. Refrain from chemical sprays.',
              descTa: 'காலை நேர மழையும் பலத்த காற்றும் மகரந்தக் சேர்க்கையைப் பாதிக்கும். இந்த நேரத்தில் பூச்சிக்கொல்லி தெளிப்பதைத் தள்ளி வைக்கவும்.'
            };
          }
          return {
            level: 'Green',
            titleEn: 'Superb Anthesis Environment',
            titleTa: 'பூப்பிற்கு உகந்த மிகச் சிறந்த வானிலை',
            descEn: 'Moderate winds and pleasant sun-hours favor beautiful, natural wind-pollination. Keep water level steady at 4-5 cm.',
            descTa: 'மிதமான காற்றும் வெப்பநிலையும் மகரந்தச் சேர்க்கைக்கு உகந்ததாக உள்ளது. நீர் மட்டத்தை 4-5 செ.மீ அளவில் சீராக வைக்கவும்.'
          };

        case 'fruiting': // Grain filling
          if (isSevereRain) {
            return {
              level: 'Orange',
              titleEn: 'Severe Lodging Risk in Heavy Panicles',
              titleTa: 'பால் பிடிக்கும் பருவத்தில் பயிர் சாய்ந்து விழும் ஆபத்து',
              descEn: 'Heavy rain weight can snap mature stems or cause crop lodging, soaking precious grains in soil. Strengthen dikes.',
              descTa: 'மழையின் பாரத்தினால் முதிர்ந்த பயிர்கள் சாய்ந்து தானியங்கள் மண்ணோடு மண்ணாக அழுகலாம். வயல் வரப்புகளை வலுப்படுத்தவும்.'
            };
          }
          return {
            level: 'Green',
            titleEn: 'Excellent Milky Stage Progress',
            titleTa: 'கதிர் முதிர்ச்சிக்கு ஏற்ற அற்புதமான வானிலை',
            descEn: 'Ample sunshine speeds up grain milking and starch solidifying. Ensure soil stays soft and moist.',
            descTa: 'சூரிய ஒளி நன்கு கிடைப்பதால் மணிகள் திரட்சியாக மாறும். வேர்ப்பகுதியில் லேசான ஈரப்பதம் எப்போதும் இருக்குமாறு பார்த்துக் கொள்ளவும்.'
          };

        case 'harvesting':
          if (isHighRain) {
            return {
              level: 'Red',
              titleEn: 'CRITICAL: Shattering & Grain Germination Warning',
              titleTa: 'மிக முக்கியம்: மழை பெய்யக்கூடுவதால் அறுவடை பாதிப்பு',
              descEn: 'Rainfall will wet grain heads, causing in-situ germination, black mold, and grain shattering. Immediately postpone machine harvesting.',
              descTa: 'அறுவடை நேரத்தில் மழை பெய்வதால் நெல்மணிகள் கதிர் மீதே முளைக்கத் தொடங்கும். கறுப்பு பூஞ்சை வரலாம். அறுவடையை முற்றிலும் தள்ளிப்போடவும்.'
            };
          }
          return {
            level: 'Green',
            titleEn: 'Perfect Golden Harvest Window',
            titleTa: 'அறுவடைக்கு ஏற்ற பொன்னான வறண்ட வானிலை',
            descEn: 'Completely dry soil and sunshine make harvesting clean and fast. Target 13-14% moisture before bagging grains.',
            descTa: 'மண்ணும் பயிரும் வறண்டு உள்ளதால் அறுவடைக்கு மிகவும் உகந்தது. சேமிக்கும் முன் நெல்லை நன்றாகக் காய வைத்து ஈரப்பதத்தை 14% கீழ் குறைக்கவும்.'
          };
      }
    }

    if (crop === 'tomato') {
      switch (stage) {
        case 'seedling':
          if (isHighHumidity) {
            return {
              level: 'Orange',
              titleEn: 'Damping-Off Pathogen Threat',
              titleTa: 'நாற்றழுகல் பூஞ்சை நோய் எச்சரிக்கை',
              descEn: 'High relative humidity (>85%) triggers Pythium root-rot in tender seedlings. Avoid over-watering and clear soil pathways.',
              descTa: 'அதிக காற்றில் ஈரப்பதம் இருப்பதால் நாற்றழுகல் நோய் வரக்கூடும். அதிகமாக நீர் பாய்ச்சுவதைக் குறைத்து காற்றோட்டம் வழங்கவும்.'
            };
          }
          return {
            level: 'Green',
            titleEn: 'Safe Seedling Establishment',
            titleTa: 'நாற்று வளர்ச்சிக்கான சாதகமான நிலை',
            descEn: 'Mild conditions favor root anchorage. Keep beds high and drain channels fully clear.',
            descTa: 'வேர்கள் நன்றாகப் பிடிக்க ஏதுவான வானிலை. வடிகால் கொண்ட உயரமான மேட்டுப் பாத்திகளைப் பயன்படுத்தவும்.'
          };

        case 'vegetative':
          if (isHighHumidity && isHighRain) {
            return {
              level: 'Orange',
              titleEn: 'Early Blight Fungus Proliferation Warning',
              titleTa: 'இலைக்கருகல் நோய் பரவும் எச்சரிக்கை',
              descEn: 'Warmth and rain prompt rapid Early Blight leaf infection. Avoid sprinkler/overhead watering; trim low leaves for spacing.',
              descTa: 'தொடர் ஈரப்பதத்தால் இலைக்கருகல் பூஞ்சை நோய் வேகமாகப் பரவலாம். செடிகளின் கீழ் இலைகளை வெட்டிவிட்டு காற்றோட்டம் கொடுங்கள்.'
            };
          }
          return {
            level: 'Green',
            titleEn: 'Optimal Leafy Growth',
            titleTa: 'இலைகள் மற்றும் கிளைகள் செழிக்க உகந்த சூழல்',
            descEn: 'Good parameters. Setup strong poles or wire trellises to keep foliage high and dry away from wet soils.',
            descTa: 'கிளைகள் நன்கு வளர ஏற்றது. இலைகள் தரையில் படர்ந்து பூஞ்சை தாக்காமல் இருக்க முட்டுக் கம்புகள் கொண்டு செடியை கட்டிவிடவும்.'
          };

        case 'flowering':
          if (isHighHeat) {
            return {
              level: 'Red',
              titleEn: 'CRITICAL: Blossom Drop (Heat Sterility)',
              titleTa: 'மிக முக்கியம்: கடுமையான வெப்பத்தால் பூக்கள் கொட்டும் அபாயம்',
              descEn: 'Temperatures exceeding 32°C halt tomato pollination, causing blossoms to dry out and fall. Keep soil cool with organic straw mulching.',
              descTa: 'வெப்பநிலை 32°C கடப்பதால் தக்காளிப் பூக்கள் கருகி உதிரும். ஈரப்பதத்தை அதிகரிக்க வேர்ப்பகுதியில் வைக்கோல் மூடாக்கு இட்டு நீர் பாய்ச்சவும்.'
            };
          }
          if (isHighRain) {
            return {
              level: 'Orange',
              titleEn: 'Rain-Induced Flower Abscission',
              titleTa: 'அதிக மழையால் பூக்கள் உதிர்ந்து அழுகுதல்',
              descEn: 'Intense rain washes off pollen grains and ruins pollination rates. Suspend foliar fertilizers until skies are clear.',
              descTa: 'கனமழை காரணமாக பூக்களிலுள்ள மகரந்தங்கள் அழிந்து பூக்கள் உதிரும். வானிலை மாறும் வரை இலைவழி தெளிப்புகளை நிறுத்தவும்.'
            };
          }
          return {
            level: 'Green',
            titleEn: 'Abundant Flower Budding Stage',
            titleTa: 'பூக்கள் செழிப்பாகப் பிடிக்கும் பொன்னான காலம்',
            descEn: 'Favorable temp range for pollination. Consider spraying Boron (0.2%) to strengthen flower stems and fruit set.',
            descTa: 'மகரந்தச் சேர்க்கை மிகச் சிறப்பாக நடைபெறும். பூக்காம்புகள் வலுப்பெற போரான் நுண்ணூட்டச் சத்து தெளிக்க உகந்த தருணம்.'
          };

        case 'fruiting':
          if (isHighRain) {
            return {
              level: 'Red',
              titleEn: 'CRITICAL: Severe Fruit Splitting & Rot',
              titleTa: 'மிக முக்கியம்: தக்காளி பழங்கள் வெடித்தல் மற்றும் அழுகும் ஆபத்து',
              descEn: 'Sudden rain causes tomato fruits to take in water too fast, tearing the outer skin. Stop manually watering and harvest mature green fruits instantly.',
              descTa: 'திடீர் மழையால் பழங்கள் அளவுக்கு அதிகமான நீரை உறிஞ்சித் தோல்கள் வெடித்து அழுகிவிடும். நீர் பாய்ச்சுவதை நிறுத்தி காய்களை உடனே அறுவடை செய்யவும்.'
            };
          }
          if (isHighHeat) {
            return {
              level: 'Yellow',
              titleEn: 'Fruit Sunscald Risk Alert',
              titleTa: 'வெயிலின் தாக்கத்தால் தக்காளிப் பழம் நிறம் மாறுதல் (Sunscald)',
              descEn: 'Intense solar radiation can burn unprotected fruits, causing papery white dry patches. Avoid excess pruning to maintain leaf shade.',
              descTa: 'கடுமையான வெயில் காரணமாக தக்காளியில் வெள்ளை நிறப் புண்கள் உண்டாகலாம். செடியின் மேல் இலைகளை வெட்டாமல் நிழல் தருமாறு வைக்கவும்.'
            };
          }
          return {
            level: 'Green',
            titleEn: 'Excellent Fruit Sizing & Ripening',
            titleTa: 'காய்கள் திரட்சியாக வளர்ந்து பழுக்க ஏற்ற வானிலை',
            descEn: 'Moderate conditions favor perfect lycopene accumulation for firm, rich red premium tomatoes.',
            descTa: 'மிதமான தட்பவெப்பநிலை தக்காளிக்கு நல்ல சிவப்பு நிறத்தைத் தந்து திரட்சியாகவும் கெட்டியாகவும் வளர உதவும்.'
          };

        case 'harvesting':
          if (isHighRain) {
            return {
              level: 'Orange',
              titleEn: 'Post-Harvest Fruit Soft Rot Hazard',
              titleTa: 'அறுவடைக்கு பின் பழங்கள் அழுகி வீணாகும் ஆபத்து',
              descEn: 'Harvesting in wet periods invites fungal rot in baskets. Harvest strictly in dry windows and pack in breathable plastic crates.',
              descTa: 'மழையில் அறுவடை செய்யும் பழங்கள் மிக விரைவில் அழுகும். நல்ல வறண்ட வெயில் நேரத்தில் மட்டுமே பழங்களை பறித்து காற்றோட்டக் கூடைகளில் வைக்கவும்.'
            };
          }
          return {
            level: 'Green',
            titleEn: 'Ideal Commercial Picking Window',
            titleTa: 'தக்காளி அறுவடை செய்ய மிகச் சிறந்த தருணம்',
            descEn: 'Completely clear weather. Harvest tomatoes at the breaker/pink stage for long transport and market storage.',
            descTa: 'முற்றிலும் தெளிவான உலர் வானிலை. நீண்ட தூரப் போக்குவரத்து ஆயுளுக்கு பழங்களை இளஞ்சிவப்பு நிறத்தில் அறுவடை செய்ய ஏற்றது.'
          };
      }
    }

    if (crop === 'groundnut') {
      switch (stage) {
        case 'seedling':
          if (isHighRain) {
            return {
              level: 'Yellow',
              titleEn: 'Sprout Germination Submergence Risk',
              titleTa: 'விதை முளைப்புத் திறன் அழுகல் ஆபத்து',
              descEn: 'Waterlogged soils deprive seeds of oxygen, rotting them in the ground. Clear all border bund furrows.',
              descTa: 'மண்ணில் நீர் தேங்கி காற்று புகாமல் விதைகள் அழுகும். வயல் ஓரங்களில் வடிகால் வாய்க்கால்களைச் சீரமைக்கவும்.'
            };
          }
          return {
            level: 'Green',
            titleEn: 'Optimal Groundnut Germination',
            titleTa: 'கடலை விதை முளைப்புக்கு ஏதுவான உகந்த நிலை',
            descEn: 'Excellent soil warmth and consistent mild dampness. Uniform shoot sprouting expected soon.',
            descTa: 'விதை முளைப்பிற்கு ஏற்ற ஈரப்பதம் மண்ணில் உள்ளது. 7-10 நாட்களில் சீரான முளைப்புத் திறன் வெளிப்படும்.'
          };

        case 'vegetative':
          if (isHighHumidity) {
            return {
              level: 'Yellow',
              titleEn: 'Tikka Leaf Spot Prophylactic Stage',
              titleTa: 'டிக்கா இலைப்புள்ளி நோய் முன்னெச்சரிக்கை',
              descEn: 'High humidity prompts Tikka fungal disease. Spray organic neem seed kernel extracts early to build immunity.',
              descTa: 'அதிகக் காற்றின் ஈரப்பதத்தால் டிக்கா இலைப்புள்ளி நோய் பரவலாம். முன்னெச்சரிக்கையாக வேப்பங்கொட்டைக் கரைசல் தெளிக்கவும்.'
            };
          }
          return {
            level: 'Green',
            titleEn: 'Vigorous Branch & Leaf Growth',
            titleTa: 'செழுமையான இலை மற்றும் கிளை வளர்ச்சி',
            descEn: 'Great weather parameters. Loosen the soil around roots (first earthing-up) to prepare pegs.',
            descTa: 'வளர்ச்சி சிறப்பாக உள்ளது. விழுதுகள் எளிதாக இறங்க வேர்களைச் சுற்றி மண்ணை அணைத்து தளர்த்தி வைக்கவும்.'
          };

        case 'flowering': // Pegging phase
          if (isHighHeat || weather.humidity < 42) {
            return {
              level: 'Red',
              titleEn: 'CRITICAL: Soil Crust Hardening (Peg Entry Blocked)',
              titleTa: 'மிக முக்கியம்: மண் இறுகிப்போவதால் விழுதுகள் ஊடுருவ முடியாமை',
              descEn: 'Sun-baked dry soil prevents young delicate pegs from boring into the ground, leading to zero pod count. Provide light sprinkler irrigation immediately to soften the soil.',
              descTa: 'மண் வெயிலில் காய்ந்து இறுகிப்போவதால் விழுதுகள் மண்ணுக்குள் இறங்க முடியாமல் காய் உதிர்வு ஏற்படும். லேசான சொட்டுநீர் அல்லது தெளிப்பு நீர் பாய்ச்சவும்.'
            };
          }
          if (isSevereRain) {
            return {
              level: 'Orange',
              titleEn: 'Waterlogged Soil Peg-Rot Risk',
              titleTa: 'வயலில் நீர் தேங்குவதால் விழுதுகள் அழுகும் அபாயம்',
              descEn: 'Saturated soil suffocates plant root systems and rots pegs entering the soil. Ensure active drainage.',
              descTa: 'அதிக ஈரப்பதத்தால் மண்ணில் விழுதுகள் இறங்கியவுடன் அழுகத் தொடங்கும். வயல் ஓரங்கள் மற்றும் வாய்க்கால்களைச் சீரமைத்து வடிகால் வசதி செய்யவும்.'
            };
          }
          return {
            level: 'Green',
            titleEn: 'Highly Favorable Peg Tunneling Conditions',
            titleTa: 'விழுதுகள் இறங்கி காய் பிடிப்பதற்கு உகந்த மிகச் சிறந்த சூழல்',
            descEn: 'Favorable friable soil moisture. Pegs will seamlessly burrow and begin healthy pod development.',
            descTa: 'மண் போதிய ஈரப்பதத்தோடு மிருதுவாக உள்ளதால் விழுதுகள் சுலபமாக மண்ணுக்குள் ஊடுருவி அதிக காய்களை உருவாக்கும்.'
          };

        case 'fruiting':
          if (isSevereRain) {
            return {
              level: 'Orange',
              titleEn: 'Subterranean Pod Rot & Germination Hazard',
              titleTa: 'மண்ணுக்குள் காய்கள் அழுகி முளைக்கும் அபாயம்',
              descEn: 'Saturated soil suffocates plant root systems and rots pegs entering the soil. Ensure active drainage.',
              descTa: 'மண்ணில் நீண்ட நேரம் நீர் தேங்கினால் காய்கள் அழுகி முளைக்கக்கூடும். வடிகால் அமைப்பை உடனே சரிசெய்யவும்.'
            };
          }
          return {
            level: 'Green',
            titleEn: 'Healthy Underground Pod Expansion',
            titleTa: 'மண்ணுக்குள் நிலக்கடலை காய்கள் திரட்சியாக வளரும் பருவம்',
            descEn: 'Excellent soil dampness and moderate temperature support pod swelling and kernel oil accumulation.',
            descTa: 'போதிய ஈரப்பதமும் மிதமான வெப்பமும் நிலக்கடலை காய்கள் பருத்து எண்ணெய் சத்து அதிகரிக்க உதவும்.'
          };

        case 'harvesting':
          if (isHighRain) {
            return {
              level: 'Red',
              titleEn: 'CRITICAL: Muddy Ground & Pod Detachment Risk',
              titleTa: 'மிக முக்கியம்: களிமண்ணில் காய்கள் துண்டிக்கப்பட்டு மண்ணில் தங்கும் ஆபத்து',
              descEn: 'Pulling pods out of wet, heavy muddy soil tears them off the vines, leaving them buried. Delay harvest until soil is semi-dry.',
              descTa: 'சேறான மண்ணில் செடியை பிடுங்கினால் காய்கள் மண்ணுக்குள் அறுந்துவிடும். மண் ஓரளவிற்கு காயும் வரை அறுவடையை ஒத்திவைக்கவும்.'
            };
          }
          return {
            level: 'Green',
            titleEn: 'Perfect Harvesting & Field Curing Weather',
            titleTa: 'நிலக்கடலை அறுவடை மற்றும் உலர்த்தலுக்கு உகந்த வானிலை',
            descEn: 'Dry soil and sunny days allow easy mechanical/manual pulling and superb sun-curing on bunds.',
            descTa: 'வறண்ட மண் மற்றும் நல்ல வெயில் இருப்பதால் செடிகளை எளிதாகப் பிடுங்கி வயல் வரப்புகளில் காய வைக்கலாம்.'
          };
      }
    }

    // Default / General
    if (isSevereRain) {
      return {
        level: 'Orange',
        titleEn: 'General Saturated Soil Alert',
        titleTa: 'அதிகப்படியான நீர் தேங்கும் பொதுவான எச்சரிக்கை',
        descEn: 'Extensive rain can drown roots, starving them of vital oxygen. Suspend all watering and check channel paths.',
        descTa: 'கனமழையினால் வேர்ப் பகுதிகளில் காற்று புகாமல் பயிர்கள் வாடலாம். பாசனத்தை முற்றிலும் நிறுத்தி வடிகால்களைப் பராமரிக்கவும்.'
      };
    }
    if (isHighHeat) {
      return {
        level: 'Yellow',
        titleEn: 'High Atmospheric Temperature Caution',
        titleTa: 'வெப்பநிலை அதிகரிப்புக்கான பொதுவான முன்னெச்சரிக்கை',
        descEn: 'Elevated daytime temperatures increase moisture evaporation. Water crops in early morning hours.',
        descTa: 'பகலில் வெயில் அதிகமாக இருப்பதால் நீர் ஆவியாதல் கூடும். பயிர்களுக்கு அதிகாலை அல்லது மாலை வேளையில் பாசனம் செய்யவும்.'
      };
    }

    return {
      level: 'Green',
      titleEn: 'Stable & Favorable Agricultural Weather',
      titleTa: 'சீரான சாதகமான வேளாண் தட்பவெப்பநிலை',
      descEn: 'Temperature and wind limits are excellent. Perfect for routine planned crop activities.',
      descTa: 'வானிலை மற்றும் காற்று அளவீடுகள் அனைத்தும் சாதாரணமாக உள்ளன. வழக்கமான விவசாயப் பணிகளை மேற்கொள்ளலாம்.'
    };
  };

  const threat = getStageSpecificThreat(selectedCrop, selectedStage);

  // Dynamic Smart Irrigation Schedule based on soil moisture and 3-day rain forecast
  const getSmartIrrigationSchedule = () => {
    // 3-day rainfall is calculated from first 3 days of chartData
    const rainDay1 = chartData[0]?.rain || 0;
    const rainDay2 = chartData[1]?.rain || 0;
    const rainDay3 = chartData[2]?.rain || 0;
    const threeDayRainTotal = rainDay1 + rainDay2 + rainDay3;

    let soilStatusEn = '';
    let soilStatusTa = '';
    let soilBadgeClass = '';
    
    if (soilMoisture < 35) {
      soilStatusEn = 'Dry / Needs Water';
      soilStatusTa = 'வறண்டது / பாசனம் தேவை';
      soilBadgeClass = 'bg-red-50 text-red-700 dark:bg-red-950/30 dark:text-red-400 border-red-100 dark:border-red-900/30';
    } else if (soilMoisture <= 70) {
      soilStatusEn = 'Optimal / Healthy';
      soilStatusTa = 'சரியானது / ஆரோக்கியமானது';
      soilBadgeClass = 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900/30';
    } else {
      soilStatusEn = 'Saturated / Waterlogged';
      soilStatusTa = 'அதிக நீர் / தேக்கம்';
      soilBadgeClass = 'bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400 border-blue-100 dark:border-blue-900/30';
    }

    let intervalEn = '';
    let intervalTa = '';
    let volumeEn = '';
    let volumeTa = '';
    let reasonEn = '';
    let reasonTa = '';
    let actionColor = 'emerald'; // 'emerald', 'blue', 'yellow', 'red'

    if (soilMoisture > 70) {
      intervalEn = 'Postpone Irrigation';
      intervalTa = 'நீர்ப்பாசனத்தை ஒத்திவைக்கவும்';
      volumeEn = '0 mm (None)';
      volumeTa = '0 மிமீ (தேவையில்லை)';
      reasonEn = 'Soil is saturated (>70%). Adding more water causes oxygen starvation in roots and encourages root-rot pathogens.';
      reasonTa = 'மண்ணில் ஈரப்பதம் 70%-க்கும் மேல் உள்ளது. மேலும் நீர் பாய்ச்சினால் வேர்ப்பகுதியில் காற்று புகாமல் பயிர் அழுகும் அபாயம் ஏற்படும்.';
      actionColor = 'red';
    } else if (threeDayRainTotal >= 20) {
      intervalEn = 'Skip / Hold Watering';
      intervalTa = 'நீர்ப்பாசனத்தைத் தவிர்க்கவும்';
      volumeEn = '0 mm (Rainwater Sufficient)';
      volumeTa = '0 மிமீ (மழைநீர் போதுமானது)';
      reasonEn = `High rainfall (${threeDayRainTotal} mm) forecasted in the next 3-days. Let natural rainfall irrigate your fields.`;
      reasonTa = `அடுத்த 3 நாட்களில் கணிசமான மழைப்பொழிவு (${threeDayRainTotal} மிமீ) இருப்பதால், பாசனத்தை நிறுத்தி மழைநீரைப் பயன்படுத்தவும்.`;
      actionColor = 'blue';
    } else {
      // Weather is dry/normal
      if (selectedCrop === 'paddy') {
        if (selectedStage === 'harvesting') {
          intervalEn = 'Suspend / Dry Field';
          intervalTa = 'பாசனத்தை நிறுத்தி காயவைக்கவும்';
          volumeEn = '0 mm (Drainage)';
          volumeTa = '0 மிமீ (தேவையில்லை)';
          reasonEn = 'Keep fields dry for harvest to prevent mold and ensure harvesting machinery can navigate safely.';
          reasonTa = 'அறுவடைக்கு 10 நாட்களுக்கு முன்பு தண்ணீரை வடிகட்டுவது தானியங்கள் முளைப்பதைத் தடுத்து அறுவடைக்கு வழிவகுக்கும்.';
          actionColor = 'yellow';
        } else {
          // Paddy needs constant standing water
          if (soilMoisture < 45) {
            intervalEn = 'Immediate Flooding';
            intervalTa = 'உடனடியாக நீர் பாய்ச்சவும்';
            volumeEn = '25 - 30 mm (Deep)';
            volumeTa = '25 - 30 மிமீ (அதிகளவு)';
            reasonEn = 'Paddy crops require consistent standing water. Rapidly irrigate to restore a 3-5 cm water layer.';
            reasonTa = 'நெல் பயிருக்கு எப்போதும் தேங்கி நிற்கும் நீர் தேவை. உடனடியாக நீர் பாய்ச்சி 3-5 செ.மீ நீர் மட்டத்தை மீட்டெடுக்கவும்.';
            actionColor = 'emerald';
          } else {
            intervalEn = 'Every 24 - 48 Hours';
            intervalTa = '24 - 48 மணிநேரத்திற்கு ஒருமுறை';
            volumeEn = '15 - 20 mm (Standard)';
            volumeTa = '15 - 20 மிமீ (வழக்கமான அளவு)';
            reasonEn = 'Paddy is in active stage. Maintain standard shallow flooding of 2-3 cm to encourage robust tillering.';
            reasonTa = 'நெல் பயிர் தீவிர வளர்ச்சிப் பருவத்தில் உள்ளது. ஆரோக்கியமான தூர்கள் பிடிக்க 2-3 செ.மீ நீரைத் தொடர்ந்து பராமரிக்கவும்.';
            actionColor = 'emerald';
          }
        }
      } else if (selectedCrop === 'tomato') {
        if (soilMoisture < 35) {
          intervalEn = 'Every 24 Hours (Daily)';
          intervalTa = 'தினமும் ஒருமுறை';
          volumeEn = '10 - 12 mm (Controlled Drip)';
          volumeTa = '10 - 12 மிமீ (கட்டுப்படுத்தப்பட்ட சொட்டுநீர்)';
          reasonEn = 'Dry soil detected. Water immediately but in a controlled manner; sudden heavy watering causes tomato skin splitting.';
          reasonTa = 'மண் வறண்டுள்ளது. உடனடியாக நீர் பாய்ச்சவும், ஆனால் மிதமான அளவு; காய்ந்த நிலத்திற்கு திடீரென அதிக நீர் பாய்ச்சினால் காய்கள் வெடிக்கும்.';
          actionColor = 'yellow';
        } else {
          intervalEn = 'Every 2 - 3 Days';
          intervalTa = '2 - 3 நாட்களுக்கு ஒருமுறை';
          volumeEn = '8 - 10 mm (Light Drip)';
          volumeTa = '8 - 10 மிமீ (லேசான சொட்டுநீர்)';
          reasonEn = 'Soil moisture is optimal. Provide regulated moisture via drip irrigation to avoid damping-off diseases.';
          reasonTa = 'ஈரப்பதம் சீராக உள்ளது. வேரழுகல் நோயைத் தவிர்க்க சொட்டுநீர் பாசனம் மூலம் சீரான மற்றும் கட்டுப்படுத்தப்பட்ட ஈரப்பதத்தை வழங்கவும்.';
          actionColor = 'emerald';
        }
      } else if (selectedCrop === 'groundnut') {
        if (selectedStage === 'flowering') {
          if (soilMoisture < 40) {
            intervalEn = 'Every 2 Days';
            intervalTa = '2 நாட்களுக்கு ஒருமுறை';
            volumeEn = '15 mm (Soft Sprinkling)';
            volumeTa = '15 மிமீ (லேசான தெளிப்புநீர்)';
            reasonEn = 'Pegging stage is active! Soft soil is mandatory for young pegs to burrow. Hard soil will reduce pod numbers.';
            reasonTa = 'விழுது இறங்கும் பருவம்! விழுதுகள் எளிதாக மண்ணுக்குள் செல்ல மண் மிருதுவாக இருக்க வேண்டும். காய்ந்த மண் காய் பிடிப்பதை தடுக்கும்.';
            actionColor = 'emerald';
          } else {
            intervalEn = 'Every 3 - 4 Days';
            intervalTa = '3 - 4 நாட்களுக்கு ஒருமுறை';
            volumeEn = '10 - 12 mm (Moderate)';
            volumeTa = '10 - 12 மிமீ (மிதமான அளவு)';
            reasonEn = 'Maintain moderate moisture for easy peg penetration without letting the soil get muddy or soggy.';
            reasonTa = 'விழுதுகள் ஊடுருவ ஏதுவான ஈரப்பதத்தைப் பேணவும். சேறு ஆகாமல் லேசான ஈரப்பதம் இருந்தால் போதுமானது.';
            actionColor = 'emerald';
          }
        } else if (selectedStage === 'harvesting') {
          intervalEn = 'Suspend Irrigation';
          intervalTa = 'பாசனத்தை முற்றிலும் நிறுத்தவும்';
          volumeEn = '0 mm';
          volumeTa = '0 மிமீ';
          reasonEn = 'Stop watering 7-10 days before groundnut harvest. Soft clayey soil causes pods to break off and stay buried.';
          reasonTa = 'அறுவடைக்கு 7-10 நாட்களுக்கு முன்பு நீர் பாய்ச்சுவதை நிறுத்தவும். சேற்று மண்ணில் பிடுங்கினால் காய்கள் மண்ணில் தங்கிவிடும்.';
          actionColor = 'yellow';
        } else {
          if (soilMoisture < 35) {
            intervalEn = 'Every 3 Days';
            intervalTa = '3 நாட்களுக்கு ஒருமுறை';
            volumeEn = '12 - 15 mm (Standard)';
            volumeTa = '12 - 15 மிமீ (வழக்கமான அளவு)';
            reasonEn = 'Dry soil requires rapid watering to support vegetative development and deep rooting.';
            reasonTa = 'வளர்ச்சிப் பருவத்திற்குத் தேவையான ஈரப்பதத்தை வழங்கவும். வேர் வளர்ச்சிக்கு 3 நாட்களுக்கு ஒருமுறை நீர் பாய்ச்சவும்.';
            actionColor = 'yellow';
          } else {
            intervalEn = 'Every 4 - 5 Days';
            intervalTa = '4 - 5 நாட்களுக்கு ஒருமுறை';
            volumeEn = '10 mm (Light)';
            volumeTa = '10 மிமீ (குறைந்த அளவு)';
            reasonEn = 'Soil moisture is stable. Prolong intervals slightly to encourage deep vertical root penetration.';
            reasonTa = 'ஈரப்பதம் சீராக உள்ளது. வேர்கள் ஆழமாக வளர்ந்து சத்துக்களை உறிஞ்ச ஏதுவாக சில நாட்கள் இடைவெளி விட்டு நீர் பாய்ச்சலாம்.';
            actionColor = 'emerald';
          }
        }
      } else {
        // General crop
        if (soilMoisture < 35) {
          intervalEn = 'Every 2 Days';
          intervalTa = '2 நாட்களுக்கு ஒருமுறை';
          volumeEn = '12 - 15 mm (Standard)';
          volumeTa = '12 - 15 மிமீ (வழக்கமான அளவு)';
          reasonEn = 'Low soil moisture. Rehydrate soil to ensure adequate transport of soluble soil nutrients to crop roots.';
          reasonTa = 'மண்ணில் ஈரப்பதம் குறைவு. ஊட்டச்சத்துக்களைப் பயிர்கள் எளிதில் உறிஞ்ச ஏதுவாக உடனடியாக நீர் பாய்ச்சவும்.';
          actionColor = 'yellow';
        } else {
          intervalEn = 'Every 3 - 4 Days';
          intervalTa = '3 - 4 நாட்களுக்கு ஒருமுறை';
          volumeEn = '10 mm (Light)';
          volumeTa = '10 மிமீ (லேசான அளவு)';
          reasonEn = 'Moisture levels are adequate. Follow standard scheduled intervals to prevent evaporation losses.';
          reasonTa = 'போதிய ஈரப்பதம் உள்ளது. தேவையற்ற ஆவியாதலைத் தவிர்க்கவும், நீர் மேலாண்மைக்காகவும் 3-4 நாட்கள் இடைவெளி பின்பற்றவும்.';
          actionColor = 'emerald';
        }
      }
    }

    return {
      threeDayRainTotal,
      soilStatusEn,
      soilStatusTa,
      soilBadgeClass,
      intervalEn,
      intervalTa,
      volumeEn,
      volumeTa,
      reasonEn,
      reasonTa,
      actionColor
    };
  };

  const smartSchedule = getSmartIrrigationSchedule();

  // Custom tooltips for Recharts
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const temp = payload.find((p: any) => p.dataKey === 'temp')?.value;
      const rain = payload.find((p: any) => p.dataKey === 'rain')?.value;
      const dayObj = payload[0]?.payload;
      return (
        <div className="bg-white dark:bg-slate-900 p-3.5 border border-gray-100 dark:border-slate-800 rounded-2xl shadow-xl space-y-1 z-50">
          <p className="text-xs font-bold text-gray-950 dark:text-gray-100 font-mono uppercase">{label}</p>
          {temp !== undefined && (
            <p className="text-xs text-red-600 dark:text-red-400 font-bold flex items-center space-x-1">
              <Thermometer className="h-3 w-3 shrink-0" />
              <span>{isTamil ? 'வெப்பநிலை' : 'Temp'}: {temp}°C</span>
            </p>
          )}
          {rain !== undefined && (
            <p className="text-xs text-blue-600 dark:text-blue-400 font-bold flex items-center space-x-1">
              <CloudRain className="h-3 w-3 shrink-0" />
              <span>{isTamil ? 'மழைப்பொழிவு' : 'Rainfall'}: {rain} mm</span>
            </p>
          )}
          {dayObj?.condition && (
            <p className="text-[10px] text-gray-400 font-mono mt-1 pt-1 border-t border-gray-100 dark:border-slate-800">
              {dayObj.condition}
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  // Get threat level style settings
  const getThreatStyle = (level: string) => {
    switch (level) {
      case 'Red':
        return {
          bg: 'bg-red-50 dark:bg-red-950/20',
          border: 'border-red-200 dark:border-red-900/30',
          titleColor: 'text-red-900 dark:text-red-100',
          descColor: 'text-red-700 dark:text-red-300',
          badge: 'bg-red-500 text-white',
          labelEn: 'CRITICAL THREAT',
          labelTa: 'அபாய எச்சரிக்கை',
          icon: <ShieldAlert className="h-6 w-6 text-red-600 dark:text-red-400 shrink-0 mt-0.5 animate-pulse" />
        };
      case 'Orange':
        return {
          bg: 'bg-orange-50 dark:bg-orange-950/20',
          border: 'border-orange-200 dark:border-orange-900/30',
          titleColor: 'text-orange-900 dark:text-orange-100',
          descColor: 'text-orange-700 dark:text-orange-300',
          badge: 'bg-orange-500 text-white',
          labelEn: 'HIGH WARNING',
          labelTa: 'அதிக எச்சரிக்கை',
          icon: <AlertTriangle className="h-6 w-6 text-orange-600 dark:text-orange-400 shrink-0 mt-0.5 animate-bounce" />
        };
      case 'Yellow':
        return {
          bg: 'bg-yellow-50/70 dark:bg-yellow-950/10',
          border: 'border-yellow-200 dark:border-yellow-800/25',
          titleColor: 'text-yellow-950 dark:text-yellow-100',
          descColor: 'text-yellow-850 dark:text-yellow-300',
          badge: 'bg-yellow-500 text-yellow-950',
          labelEn: 'MODERATE ALERT',
          labelTa: 'மிதமான எச்சரிக்கை',
          icon: <Info className="h-6 w-6 text-yellow-600 dark:text-yellow-500 shrink-0 mt-0.5" />
        };
      default:
        return {
          bg: 'bg-emerald-50 dark:bg-emerald-950/10',
          border: 'border-emerald-200 dark:border-emerald-800/25',
          titleColor: 'text-emerald-950 dark:text-emerald-100',
          descColor: 'text-emerald-850 dark:text-emerald-300',
          badge: 'bg-emerald-600 text-white',
          labelEn: 'OPTIMAL WEATHER',
          labelTa: 'சிறந்த வானிலை',
          icon: <CheckCircle2 className="h-6 w-6 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
        };
    }
  };

  const threatStyle = getThreatStyle(threat.level);

  const statusMap: Record<string, Record<Language, string>> = {
    drain: {
      ta: 'நீரை வெளியேற்றவும்',
      en: 'Drain Excess',
      hi: 'अतिरिक्त पानी निकालें',
      te: 'అదనపు నీటిని బయటకు పంపండి',
      kn: 'ಹೆಚ್ಚುವರಿ ನೀರು ಹೊರಹಾಕಿ',
      ml: 'അധിക വെള്ളം കളയുക',
      mr: 'अतिरिक्त पाणी काढून टाका',
      bn: 'অতিরিক্ত জল নিষ্কাশন করুন',
      gu: 'વધારાનું પાણી નિકાલ કરો',
      pa: 'ਵਾਧੂ ਪਾਣੀ ਬਾਹਰ ਕੱਢੋ'
    },
    skip: {
      ta: 'நீர்ப்பாசனம் தவிர்',
      en: 'Skip Watering',
      hi: 'सिंचाई छोड़ें',
      te: 'నీటి పారుదల వాయిదా వేయండి',
      kn: 'नೀರಾವರಿ ಬಿಟ್ಟುಬಿಡಿ',
      ml: 'നനയ്ക്കുന്നത് ഒഴിവാക്കുക',
      mr: 'सिंचन टाळा',
      bn: 'সেচ এড়িয়ে চলুন',
      gu: 'પિયત ટાળો',
      pa: 'ਸਿੰਚਾਈ ਛੱਡੋ'
    },
    normal: {
      ta: 'சீரான பாசனம்',
      en: 'Normal Water',
      hi: 'सामान्य सिंचाई',
      te: 'సాధారణ నీటి సరఫరా',
      kn: 'ಸಾಮಾನ್ಯ ನೀರಾವರಿ',
      ml: 'സാധാരണ നന',
      mr: 'सामान्य पाणी',
      bn: 'স্বাভাবিক জল',
      gu: 'સામાન્ય પિયત',
      pa: 'ਸਧารਨ ਪਾਣੀ'
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in" id="weather-dashboard-container">

      {/* Header */}
      <div className="mb-8" id="weather-dashboard-header">
        <span className="bg-green-100 text-green-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider font-mono">
          {wTrans.live_weather_station[language]}
        </span>
        <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight mt-1.5 font-sans">
          {wTrans.agri_weather_center[language]}
        </h2>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          {language === 'ta'
            ? `${weather.location} ${wTrans.weather_subtitle[language]}`
            : `${wTrans.weather_subtitle[language]} for ${weather.location}.`}
        </p>
      </div>

      {/* NEW: Crop & Growth Stage Filter Selectors */}
      <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 p-6 rounded-3xl mb-8 shadow-md shadow-gray-50/40 dark:shadow-none" id="weather-selectors-bar">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Crop Selector */}
          <div className="lg:col-span-5">
            <span className="block text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2.5 font-mono">
              {wTrans.select_crop_label[language]}
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                onClick={() => setSelectedCrop('all')}
                className={`px-3 py-2 text-xs font-bold rounded-xl transition-all border ${
                  selectedCrop === 'all'
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-600/10'
                    : 'bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-slate-700 hover:bg-gray-50'
                }`}
                id="btn-crop-all"
              >
                {wTrans.crop_general[language]}
              </button>
              <button
                onClick={() => setSelectedCrop('paddy')}
                className={`px-3 py-2 text-xs font-bold rounded-xl transition-all border ${
                  selectedCrop === 'paddy'
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-600/10'
                    : 'bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-slate-700 hover:bg-gray-50'
                }`}
                id="btn-crop-paddy"
              >
                {wTrans.crop_paddy[language]}
              </button>
              <button
                onClick={() => setSelectedCrop('tomato')}
                className={`px-3 py-2 text-xs font-bold rounded-xl transition-all border ${
                  selectedCrop === 'tomato'
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-600/10'
                    : 'bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-slate-700 hover:bg-gray-50'
                }`}
                id="btn-crop-tomato"
              >
                {wTrans.crop_tomato[language]}
              </button>
              <button
                onClick={() => setSelectedCrop('groundnut')}
                className={`px-3 py-2 text-xs font-bold rounded-xl transition-all border ${
                  selectedCrop === 'groundnut'
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-600/10'
                    : 'bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-slate-700 hover:bg-gray-50'
                }`}
                id="btn-crop-groundnut"
              >
                {wTrans.crop_groundnut[language]}
              </button>
            </div>
          </div>

          {/* Growth Stage Selector */}
          <div className="lg:col-span-7">
            <span className="block text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2.5 font-mono">
              {wTrans.select_stage_label[language]}
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              <button
                onClick={() => setSelectedStage('seedling')}
                className={`px-2.5 py-2 text-xs font-bold rounded-xl transition-all border ${
                  selectedStage === 'seedling'
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-md'
                    : 'bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-slate-700 hover:bg-gray-50'
                }`}
                id="btn-stage-seedling"
              >
                {wTrans.stage_seedling[language]}
              </button>
              <button
                onClick={() => setSelectedStage('vegetative')}
                className={`px-2.5 py-2 text-xs font-bold rounded-xl transition-all border ${
                  selectedStage === 'vegetative'
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-md'
                    : 'bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-slate-700 hover:bg-gray-50'
                }`}
                id="btn-stage-vegetative"
              >
                {wTrans.stage_vegetative[language]}
              </button>
              <button
                onClick={() => setSelectedStage('flowering')}
                className={`px-2.5 py-2 text-xs font-bold rounded-xl transition-all border ${
                  selectedStage === 'flowering'
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-md'
                    : 'bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-slate-700 hover:bg-gray-50'
                }`}
                id="btn-stage-flowering"
              >
                {wTrans.stage_flowering[language]}
              </button>
              <button
                onClick={() => setSelectedStage('fruiting')}
                className={`px-2.5 py-2 text-xs font-bold rounded-xl transition-all border ${
                  selectedStage === 'fruiting'
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-md'
                    : 'bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-slate-700 hover:bg-gray-50'
                }`}
                id="btn-stage-fruiting"
              >
                {wTrans.stage_fruiting[language]}
              </button>
              <button
                onClick={() => setSelectedStage('harvesting')}
                className={`px-2.5 py-2 text-xs font-bold rounded-xl transition-all border ${
                  selectedStage === 'harvesting'
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-md'
                    : 'bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-slate-700 hover:bg-gray-50'
                }`}
                id="btn-stage-harvesting"
              >
                {wTrans.stage_harvesting[language]}
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* NEW: Color-coded stage-specific weather risk banner */}
      <div
        className={`${threatStyle.bg} border ${threatStyle.border} p-5 rounded-3xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 transition-all duration-300`}
        id="stage-threat-banner"
      >
        <div className="flex items-start space-x-4">
          <div className="mt-1 sm:mt-0">{threatStyle.icon}</div>
          <div>
            <div className="flex items-center flex-wrap gap-2">
              <span className={`text-[9px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider font-mono ${threatStyle.badge}`}>
                {language === 'ta' ? threatStyle.labelTa : threatStyle.labelEn}
              </span>
              <span className="text-[10px] bg-slate-200/60 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold px-2 py-0.5 rounded-md font-mono">
                {selectedCrop === 'all'
                  ? (language === 'ta' ? 'பொதுப் பயிர்' : 'General Crop')
                  : selectedCrop.toUpperCase()}{' '}
                -{' '}
                {selectedStage.toUpperCase()}
              </span>
            </div>
            <h4 className={`font-bold ${threatStyle.titleColor} text-sm sm:text-base mt-2`}>
              {language === 'ta' ? threat.titleTa : threat.titleEn}
            </h4>
            <p className={`text-xs ${threatStyle.descColor} mt-1 leading-relaxed`}>
              {language === 'ta' ? threat.descTa : threat.descEn}
            </p>
          </div>
        </div>
      </div>

      {/* Grid: Main Dashboard Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8" id="weather-metrics-grid">

        {/* Temperature Card */}
        <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 p-5 rounded-3xl shadow-xl shadow-gray-50/50 dark:shadow-none flex items-center space-x-4" id="weather-card-temp">
          <div className="p-3 bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 rounded-2xl">
            <Thermometer className="h-6 w-6" />
          </div>
          <div>
            <p className="text-[10px] text-gray-400 dark:text-gray-500 uppercase font-mono font-bold">
              {wTrans.metric_temp[language]}
            </p>
            <p className="text-xl font-extrabold text-gray-900 dark:text-white mt-0.5">{weather.temperature}°C</p>
          </div>
        </div>

        {/* Humidity Card */}
        <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 p-5 rounded-3xl shadow-xl shadow-gray-50/50 dark:shadow-none flex items-center space-x-4" id="weather-card-humidity">
          <div className="p-3 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 rounded-2xl">
            <Droplets className="h-6 w-6" />
          </div>
          <div>
            <p className="text-[10px] text-gray-400 dark:text-gray-500 uppercase font-mono font-bold">
              {wTrans.metric_humidity[language]}
            </p>
            <p className="text-xl font-extrabold text-gray-900 dark:text-white mt-0.5">{weather.humidity}%</p>
          </div>
        </div>

        {/* Wind Card */}
        <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 p-5 rounded-3xl shadow-xl shadow-gray-50/50 dark:shadow-none flex items-center space-x-4" id="weather-card-wind">
          <div className="p-3 bg-teal-50 dark:bg-teal-950/40 text-teal-600 dark:text-teal-400 rounded-2xl">
            <Wind className="h-6 w-6" />
          </div>
          <div>
            <p className="text-[10px] text-gray-400 dark:text-gray-500 uppercase font-mono font-bold">
              {wTrans.metric_wind[language]}
            </p>
            <p className="text-xl font-extrabold text-gray-900 dark:text-white mt-0.5">{weather.windSpeed} km/h</p>
          </div>
        </div>

        {/* Rainfall Card */}
        <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 p-5 rounded-3xl shadow-xl shadow-gray-50/50 dark:shadow-none flex items-center space-x-4" id="weather-card-rainfall">
          <div className="p-3 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 rounded-2xl">
            <CloudRain className="h-6 w-6" />
          </div>
          <div>
            <p className="text-[10px] text-gray-400 dark:text-gray-500 uppercase font-mono font-bold">
              {wTrans.metric_rain[language]}
            </p>
            <p className="text-xl font-extrabold text-gray-900 dark:text-white mt-0.5">{weather.rainfall} mm</p>
          </div>
        </div>

      </div>

      {/* Disease Risk Warning */}
      <div className="bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-100 dark:border-yellow-900/30 p-5 rounded-3xl flex items-start space-x-3.5 mb-8" id="weather-risk-banner">
        <ShieldAlert className="h-6 w-6 text-yellow-600 dark:text-yellow-500 shrink-0 mt-0.5 animate-pulse" />
        <div>
          <h4 className="font-bold text-yellow-950 dark:text-yellow-200 text-sm">
            {wTrans.warning_pathogen[language]}
          </h4>
          <p className="text-xs text-yellow-800 dark:text-yellow-300 mt-1 leading-relaxed">
            {weather.diseaseRiskAlert.alert}
          </p>
        </div>
      </div>

      {/* Composed Chart & Irrigation Advice Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8" id="weather-trend-irrigation-section">

        {/* Chart Column (Span 2) */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 p-6 rounded-3xl shadow-xl shadow-gray-50/50 dark:shadow-none flex flex-col justify-between" id="chart-panel">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <span className="bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 text-[9px] font-mono font-bold px-2 py-0.5 rounded-full uppercase">
                  {wTrans.planning_chart_title[language]}
                </span>
                <h3 className="text-base font-bold text-gray-800 dark:text-white mt-1 flex items-center space-x-1.5">
                  <Droplet className="h-5 w-5 text-blue-500" />
                  <span>{wTrans.trend_7day[language]}</span>
                </h3>
              </div>
              <div className="text-right sm:text-right text-xs text-gray-500 font-mono">
                {wTrans.expected_rain_7[language]}:{' '}
                <span className="text-blue-600 dark:text-blue-400 font-bold text-sm">{totalRain7Days} mm</span>
              </div>
            </div>

            {/* Recharts Graphical Content */}
            <div className="w-full pr-1 text-slate-900" id="weather-recharts-container">
              <ResponsiveContainer width="100%" height={260}>
                <ComposedChart data={chartData} margin={{ top: 10, right: -5, left: -15, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="#f3f4f6" strokeDasharray="3 3" className="dark:stroke-slate-800/40" />
                  <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#9ca3af', fontWeight: 'bold' }} axisLine={false} tickLine={false} />
                  <YAxis yAxisId="left" tick={{ fontSize: 10, fill: '#ef4444', fontWeight: 'bold' }} unit="°" axisLine={false} tickLine={false} width={30} />
                  <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 10, fill: '#2563eb', fontWeight: 'bold' }} unit="mm" axisLine={false} tickLine={false} width={30} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend verticalAlign="top" height={36} iconSize={8} wrapperStyle={{ fontSize: '11px', fontWeight: 'bold' }} />
                  <Bar yAxisId="right" dataKey="rain" fill="#3b82f6" fillOpacity={0.6} radius={[4, 4, 0, 0]} name={isTamil ? "மழை (Rainfall)" : "Rain (mm)"} barSize={20} />
                  <Line yAxisId="left" type="monotone" dataKey="temp" stroke="#ef4444" strokeWidth={3.5} dot={{ fill: '#ef4444', strokeWidth: 1, r: 3 }} activeDot={{ r: 5 }} name={isTamil ? "வெப்பநிலை (Temp)" : "Temp (°C)"} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-gray-50 dark:border-slate-800/40 flex items-center space-x-2 text-[10px] text-gray-400">
            <Info className="h-3.5 w-3.5 text-blue-500 shrink-0" />
            <p>
              {isTamil
                ? 'வரைபடத்தில் சிவப்பு வளைவு வெப்பநிலையையும், நீல நிற தூண்கள் மழை அளவையும் குறிக்கும்.'
                : 'Red line tracks predicted temperature levels; Blue bars denote forecasted precipitation.'}
            </p>
          </div>
        </div>

        {/* Irrigation Advice Panel (Span 1) */}
        <div className="bg-slate-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-800 p-6 rounded-3xl flex flex-col justify-between" id="advice-panel">
          <div>
            <span className="bg-green-100 dark:bg-green-950 text-green-800 dark:text-green-300 text-[9px] font-mono font-bold px-2 py-0.5 rounded-full uppercase">
              {isTamil ? 'நீர்ப்பாசன ஆலோசகர்' : 'Irrigation Advice Engine'}
            </span>
            <h3 className="text-base font-bold text-gray-900 dark:text-white mt-1.5 mb-4 flex items-center space-x-1.5">
              <Sprout className="h-5 w-5 text-green-600" />
              <span>{isTamil ? 'பயிர் சார்ந்த நீர் மேலாண்மை' : 'Crop-Specific Guide'}</span>
            </h3>

            {/* Selected Info display instead of duplicated buttons */}
            <div className="mb-6 p-4 bg-white dark:bg-slate-850 rounded-2xl border border-gray-100 dark:border-slate-800/60 space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-gray-400">{isTamil ? 'தேர்ந்தெடுக்கப்பட்ட பயிர்:' : 'Selected Crop:'}</span>
                <span className="font-extrabold text-emerald-600 dark:text-emerald-400 uppercase">
                  {selectedCrop === 'all' ? (isTamil ? 'பொதுவானது' : 'General') : selectedCrop}
                </span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-400">{isTamil ? 'வளர்ச்சிப் பருவம்:' : 'Growth Stage:'}</span>
                <span className="font-extrabold text-slate-700 dark:text-slate-300 uppercase">
                  {selectedStage}
                </span>
              </div>
            </div>

            {/* Dynamic Advice Card */}
            <div className={`p-4 rounded-2xl border ${
              advice.status === 'danger'
                ? 'bg-red-50/70 dark:bg-red-950/10 border-red-100 dark:border-red-950/30'
                : advice.status === 'skip'
                  ? 'bg-blue-50/70 dark:bg-blue-950/10 border-blue-100 dark:border-blue-950/30'
                  : 'bg-green-50/70 dark:bg-green-950/10 border-green-100 dark:border-green-950/30'
            }`} id="irrigation-dynamic-card">
              <h4 className={`text-xs font-bold uppercase tracking-wider ${
                advice.status === 'danger'
                  ? 'text-red-800 dark:text-red-400'
                  : advice.status === 'skip'
                    ? 'text-blue-800 dark:text-blue-400'
                    : 'text-green-800 dark:text-green-400'
              }`}>
                {advice.title}
              </h4>
              <p className="text-xs text-gray-700 dark:text-gray-300 mt-2 leading-relaxed">
                {advice.text}
              </p>
            </div>
          </div>

          <div className="mt-6 p-3 bg-white dark:bg-slate-850 rounded-xl border border-gray-100 dark:border-slate-800 flex items-center justify-between" id="recommendation-badge-container">
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wide">
              {isTamil ? 'பாசன பரிந்துரை' : 'Recommendation'}
            </span>
            <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full ${
              advice.status === 'danger'
                ? 'bg-red-100 text-red-800'
                : advice.status === 'skip'
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-green-100 text-green-800'
            }`} id="recommendation-status-badge">
              {advice.status === 'danger'
                ? (isTamil ? 'நீரை வெளியேற்றவும்' : 'Drain Excess')
                : advice.status === 'skip'
                  ? (isTamil ? 'நீர்ப்பாசனம் தவிர்' : 'Skip Watering')
                  : (isTamil ? 'சீரான பாசனம்' : 'Normal Water')}
            </span>
          </div>
        </div>

      </div>

      {/* Smart Irrigation Scheduling Section */}
      <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 p-6 rounded-3xl shadow-xl shadow-gray-50/50 dark:shadow-none mb-8" id="smart-irrigation-scheduler-panel">
        <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-gray-100 dark:border-slate-800 pb-4 mb-6">
          <div>
            <span className="bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider font-mono">
              {isTamil ? 'நுண்ணறிவு நீர்ப்பாசனம்' : 'Precision Agriculture'}
            </span>
            <h3 className="text-xl font-extrabold text-gray-900 dark:text-white mt-1.5 flex items-center space-x-2">
              <Sprout className="h-6 w-6 text-emerald-600 animate-pulse" />
              <span>{isTamil ? 'ஸ்மார்ட் நீர்ப்பாசன திட்டமிடல்' : 'Smart Irrigation Scheduling'}</span>
            </h3>
            <p className="text-xs text-gray-400 mt-1">
              {isTamil 
                ? 'தற்போதைய மண்ணின் ஈரப்பதம் மற்றும் 3-நாள் மழைப்பொழிவின் அடிப்படையில் தானியங்கி பாசன பரிந்துரை.'
                : 'Adaptive watering schedules calculated from real-time soil moisture and upcoming 3-day rainfall forecast.'}
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex items-center space-x-3">
            <span className="text-xs font-mono text-gray-500">
              {isTamil ? '3-நாள் மழை முன்னறிவிப்பு:' : 'Upcoming 3-Day Rain:'}
            </span>
            <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
              smartSchedule.threeDayRainTotal >= 20 
                ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300' 
                : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
            }`}>
              {smartSchedule.threeDayRainTotal} mm
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column - Input / Simulation (Span 5) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-slate-50 dark:bg-slate-850 p-5 rounded-2xl border border-gray-100 dark:border-slate-800/60">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider font-mono">
                  {isTamil ? 'மண்ணின் ஈரப்பதம்' : 'Current Soil Moisture'}
                </span>
                <span className={`text-xs font-extrabold px-2.5 py-0.5 rounded-full border ${smartSchedule.soilBadgeClass}`}>
                  {isTamil ? smartSchedule.soilStatusTa : smartSchedule.soilStatusEn}
                </span>
              </div>

              {/* Big Gauge Indicator */}
              <div className="text-center py-4">
                <span className="text-5xl font-black text-gray-950 dark:text-white tracking-tight font-sans">
                  {soilMoisture}%
                </span>
                <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-1 font-mono uppercase tracking-widest">
                  {isTamil ? 'ஈரப்பத அளவு' : 'Volumetric Water Content (VWC)'}
                </p>
              </div>

              {/* Moisture Slider */}
              <div className="space-y-2 mt-2">
                <input
                  type="range"
                  min="10"
                  max="90"
                  value={soilMoisture}
                  onChange={(e) => setSoilMoisture(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-600 focus:outline-none"
                  id="soil-moisture-slider"
                />
                <div className="flex justify-between text-[10px] font-mono text-gray-400 font-bold">
                  <span>10% ({isTamil ? 'வறண்டது' : 'Dry'})</span>
                  <span>50% ({isTamil ? 'மிதமானது' : 'Ideal'})</span>
                  <span>90% ({isTamil ? 'ஈரப்பதம்' : 'Wet'})</span>
                </div>
              </div>

              {/* Presets */}
              <div className="mt-5 space-y-2">
                <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wide font-mono">
                  {isTamil ? 'விரைவு அளவீடுகள்:' : 'Quick Presets:'}
                </span>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => setSoilMoisture(20)}
                    className={`px-2 py-1.5 text-[10px] font-bold rounded-lg border transition-all ${
                      soilMoisture === 20
                        ? 'bg-red-600 text-white border-red-600'
                        : 'bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-slate-700 hover:bg-gray-50'
                    }`}
                    id="preset-moisture-dry"
                  >
                    {isTamil ? 'வறண்டது (20%)' : 'Dry (20%)'}
                  </button>
                  <button
                    onClick={() => setSoilMoisture(50)}
                    className={`px-2 py-1.5 text-[10px] font-bold rounded-lg border transition-all ${
                      soilMoisture === 50
                        ? 'bg-emerald-600 text-white border-emerald-600'
                        : 'bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-slate-700 hover:bg-gray-50'
                    }`}
                    id="preset-moisture-ideal"
                  >
                    {isTamil ? 'சரியானது (50%)' : 'Ideal (50%)'}
                  </button>
                  <button
                    onClick={() => setSoilMoisture(80)}
                    className={`px-2 py-1.5 text-[10px] font-bold rounded-lg border transition-all ${
                      soilMoisture === 80
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-slate-700 hover:bg-gray-50'
                    }`}
                    id="preset-moisture-wet"
                  >
                    {isTamil ? 'அதிக நீர் (80%)' : 'Wet (80%)'}
                  </button>
                </div>
              </div>
            </div>

            {/* Weather Influence card */}
            <div className="bg-slate-50 dark:bg-slate-850 p-4 rounded-2xl border border-gray-100 dark:border-slate-800/60 flex items-center space-x-4">
              <div className={`p-3 rounded-xl shrink-0 ${
                smartSchedule.threeDayRainTotal >= 20
                  ? 'bg-blue-100 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400'
                  : 'bg-amber-100 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400'
              }`}>
                <CloudRain className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-xs font-extrabold text-gray-900 dark:text-white uppercase font-mono tracking-wider">
                  {isTamil ? '3-நாள் மழைப்பொழிவு' : '3-Day Rainfall Forecast'}
                </h4>
                <p className="text-xs text-gray-500 mt-1">
                  {isTamil
                    ? `அடுத்த 3 நாட்களில் மொத்தம் ${smartSchedule.threeDayRainTotal} மிமீ மழைப்பொழிவு எதிர்பார்க்கப்படுகிறது.`
                    : `Upcoming 3 days expect a total accumulated rainfall of ${smartSchedule.threeDayRainTotal} mm.`}
                </p>
              </div>
            </div>
          </div>

          {/* Right Column - Recommendation Output (Span 7) */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Output Card 1: Interval */}
              <div className="bg-slate-50 dark:bg-slate-850 p-5 rounded-2xl border border-gray-100 dark:border-slate-800/60 flex items-start space-x-3.5">
                <div className={`p-3 rounded-xl shrink-0 ${
                  smartSchedule.actionColor === 'red' || smartSchedule.actionColor === 'blue' || smartSchedule.actionColor === 'yellow'
                    ? 'bg-amber-100 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400'
                    : 'bg-green-100 text-green-600 dark:bg-green-950/40 dark:text-green-400'
                }`}>
                  <Calendar className="h-5 w-5" />
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 dark:text-gray-500 uppercase font-mono font-bold tracking-wider">
                    {isTamil ? 'நீர் பாய்ச்சும் இடைவெளி' : 'Watering Interval'}
                  </span>
                  <p className="text-sm font-black text-gray-900 dark:text-white mt-1 leading-snug">
                    {isTamil ? smartSchedule.intervalTa : smartSchedule.intervalEn}
                  </p>
                </div>
              </div>

              {/* Output Card 2: Recommended Volume */}
              <div className="bg-slate-50 dark:bg-slate-850 p-5 rounded-2xl border border-gray-100 dark:border-slate-800/60 flex items-start space-x-3.5">
                <div className={`p-3 rounded-xl shrink-0 ${
                  smartSchedule.actionColor === 'red' || smartSchedule.actionColor === 'blue' || smartSchedule.actionColor === 'yellow'
                    ? 'bg-blue-100 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400'
                    : 'bg-emerald-100 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400'
                }`}>
                  <Droplet className="h-5 w-5" />
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 dark:text-gray-500 uppercase font-mono font-bold tracking-wider">
                    {isTamil ? 'பாசன நீரின் அளவு' : 'Watering Volume'}
                  </span>
                  <p className="text-sm font-black text-gray-900 dark:text-white mt-1 leading-snug">
                    {isTamil ? smartSchedule.volumeTa : smartSchedule.volumeEn}
                  </p>
                </div>
              </div>

            </div>

            {/* Agronomist Explanation Reason Card */}
            <div className={`p-5 rounded-2xl border flex-1 flex flex-col justify-between ${
              smartSchedule.actionColor === 'red'
                ? 'bg-red-50/70 dark:bg-red-950/10 border-red-100 dark:border-red-900/30'
                : smartSchedule.actionColor === 'blue'
                  ? 'bg-blue-50/70 dark:bg-blue-950/10 border-blue-100 dark:border-blue-900/30'
                  : smartSchedule.actionColor === 'yellow'
                    ? 'bg-yellow-50/70 dark:bg-yellow-950/10 border-yellow-100 dark:border-yellow-900/20'
                    : 'bg-emerald-50/70 dark:bg-emerald-950/10 border-emerald-100 dark:border-emerald-900/20'
            }`}>
              <div>
                <h4 className={`text-xs font-black uppercase tracking-wider flex items-center space-x-1.5 ${
                  smartSchedule.actionColor === 'red'
                    ? 'text-red-800 dark:text-red-400'
                    : smartSchedule.actionColor === 'blue'
                      ? 'text-blue-800 dark:text-blue-400'
                      : smartSchedule.actionColor === 'yellow'
                        ? 'text-yellow-800 dark:text-yellow-400'
                        : 'text-emerald-800 dark:text-emerald-400'
                }`}>
                  <Info className="h-4 w-4 shrink-0" />
                  <span>{isTamil ? 'பரிந்துரைக்கான அறிவியல் காரணம்' : 'Scientific Scheduling Logic'}</span>
                </h4>
                <p className="text-xs text-gray-700 dark:text-gray-300 mt-3 leading-relaxed">
                  {isTamil ? smartSchedule.reasonTa : smartSchedule.reasonEn}
                </p>
              </div>

              {/* Tip block */}
              <div className="mt-4 pt-3 border-t border-gray-100 dark:border-slate-850 flex items-center justify-between text-[10px] text-gray-400 dark:text-gray-500 font-mono uppercase font-bold">
                <span>
                  {isTamil ? 'பயிரின் தற்போதைய பருவம்:' : 'Active stage:'}{' '}
                  <span className="text-gray-600 dark:text-gray-300 font-extrabold">{selectedStage}</span>
                </span>
                <span>
                  {isTamil ? 'பயிர் வகை:' : 'Crop:'}{' '}
                  <span className="text-gray-600 dark:text-gray-300 font-extrabold">
                    {selectedCrop === 'all' ? (isTamil ? 'பொது' : 'General') : selectedCrop}
                  </span>
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* 5-Day Forecast Grid */}
      <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 p-6 rounded-3xl shadow-xl shadow-gray-50/50 dark:shadow-none" id="weather-forecast-panel">
        <h3 className="text-base font-bold text-gray-800 dark:text-white mb-6 flex items-center space-x-1.5">
          <Calendar className="h-5 w-5 text-green-600" />
          <span>{isTamil ? 'அடுத்த 5 நாட்களுக்கான முன்னறிவிப்பு (5-Day Forecast Risks)' : '5-Day Forecast & Pathogen Risk'}</span>
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
          {weather.forecast.map((day, idx) => (
            <div key={idx} className="border border-gray-100 dark:border-slate-800 p-4 rounded-2xl text-center bg-gray-50/50 dark:bg-slate-850/40 flex flex-col items-center justify-between min-h-[140px]" id={`forecast-day-${idx}`}>
              <span className="text-xs font-bold text-gray-400 uppercase font-mono">{day.day}</span>
              <div className="my-2">{getIcon(day.condition)}</div>
              <div>
                <p className="text-sm font-extrabold text-gray-900 dark:text-white">{day.temp}°C</p>
                <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">{day.condition}</p>
              </div>

              <span className={`block w-full text-center text-[9px] font-bold rounded-full py-0.5 mt-2.5 ${
                day.risk === 'High' ? 'bg-red-100 text-red-800' : day.risk === 'Medium' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
              }`} id={`forecast-risk-${idx}`}>
                {day.risk} Risk
              </span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
