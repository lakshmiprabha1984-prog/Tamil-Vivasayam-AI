import { District, indianStates } from './regions';
import { WeatherData, GovScheme, MarketplaceDealer } from '../types';
import { Language } from './translations';

// Deterministic random generator based on string seed
function seedRandom(seed: string) {
  let h = 0;
  for (let i = 0; i < seed.length; i++) {
    h = (Math.imul(31, h) + seed.charCodeAt(i)) | 0;
  }
  return function() {
    const x = Math.sin(h++) * 10000;
    return x - Math.floor(x);
  };
}

export function generateWeatherForDistrict(district: District, stateName: string, lang: Language): WeatherData {
  const rand = seedRandom(district.id);
  
  // Dynamic ranges
  const isTamil = lang === 'ta';
  const baseTemp = 27 + Math.floor(rand() * 7); // 27 to 33
  const baseHumidity = 70 + Math.floor(rand() * 25); // 70 to 95
  const baseRainfall = 10 + Math.floor(rand() * 260); // 10 to 270
  const baseWind = 8 + Math.floor(rand() * 12); // 8 to 20

  const conditionKeys = ['sunny_showers', 'heavy_monsoon', 'thunderstorm', 'rainy_clouds', 'partly_cloudy'];
  const probs = [0.2, 0.3, 0.2, 0.2, 0.1];

  const localizedConditions: Record<string, Record<string, string>> = {
    sunny_showers: {
      ta: 'மிதமான மழையுடன் கூடிய வெயில்',
      en: 'Sunny with Showers',
      hi: 'धूप और हल्की बौछारें',
      te: 'ఎండతో కూడిన జల్లులు',
      kn: 'ಬಿಸಿಲು ಮತ್ತು ಹಗುರ ಮಳೆ',
      ml: 'വെയിലും മിതമായ മഴയും',
      mr: 'ऊन आणि हलका पाऊस',
      bn: 'রোদ ও হালকা বৃষ্টি',
      gu: 'તડકો અને હળવો વરસાદ',
      pa: 'ਧੁੱਪ ਅਤੇ ਹਲਕੀ ਬਾਰਿਸ਼'
    },
    heavy_monsoon: {
      ta: 'கனமழை / தென்மேற்கு பருவமழை',
      en: 'Heavy Monsoon',
      hi: 'भारी मानसून वर्षा',
      te: 'భారీ వర్షాలు / రుతుపவనాలు',
      kn: 'ಭಾರೀ ಮಾನ್ಸೂನ್ ಮಳೆ',
      ml: 'ശക്തമായ കാലവർഷം',
      mr: 'मुसळधार मान्सून पाऊस',
      bn: 'ভারী বর্ষা',
      gu: 'ભારે ચોમાસુ વરસાદ',
      pa: 'ਭਾਰੀ मਾਨਸੂਨ ਬਾਰਿਸ਼'
    },
    thunderstorm: {
      ta: 'இடியுடன் கூடிய கனமழை',
      en: 'Thunderstorms',
      hi: 'गरज के साथ भारी बारिश',
      te: 'ఉరుములు మెరుపులతో కూడిన వర్షం',
      kn: 'ಗುಡುಗು ಸಹಿತ ಮಳೆ',
      ml: 'ഇടിയോടുകൂടിയ മഴ',
      mr: 'वादळी वाऱ्यासह पाऊस',
      bn: 'বজ্রঝড়',
      gu: 'ગાજવીજ સાથે વરસાદ',
      pa: 'ਗਰਜ ਨਾਲ ਬਾਰਿਸ਼'
    },
    rainy_clouds: {
      ta: 'மழை மேகமூட்டம் / ஈரப்பதம் அதிகம்',
      en: 'Rainy Clouds & High Humidity',
      hi: 'वर्षा वाले बादल और उच्च आर्द्रता',
      te: 'వర్షపు మేఘాలు & అధిక తేమ',
      kn: 'ಮಳೆ ಮೋಡಗಳು ಮತ್ತು ಹೆಚ್ಚಿನ ಆರ್ದ್ರತೆ',
      ml: 'മഴമേഘങ്ങളും ഉയർന്ന ഈർപ്പവും',
      mr: 'पावसाचे ढग आणि जास्त आर्द्रता',
      bn: 'মেঘলা আকাশ ও আর্দ্রতা',
      gu: 'વરસાદી વાદળો અને વધુ ભેજ',
      pa: 'ਮੀਂह ਵਾਲੇ ਬੱਦਲ ਅਤੇ ਉੱਚ ਨਮੀ'
    },
    partly_cloudy: {
      ta: 'ஓரளவு மேகமூட்டம்',
      en: 'Partly Cloudy',
      hi: 'आंशिक रूप से बादल छाए रहना',
      te: 'పాక్షಿಕంగా మేఘావృతం',
      kn: 'ಭಾಗಶಃ ಮೋಡ ಕವಿದ ವಾತಾವರಣ',
      ml: 'ഭാഗികമായി മേഘാവൃതം',
      mr: 'अंशतः ढगाळ वातावरण',
      bn: 'আংশিক মেঘলা',
      gu: 'આંશિક વાદળછાયું',
      pa: 'ਆਂਸ਼ਿਕ ਰੂਪ ਵਿੱਚ ਬੱਦਲਵਾਈ'
    }
  };

  const roll = rand();
  let selectedCondKey = conditionKeys[0];
  let accumulated = 0;
  for (let i = 0; i < conditionKeys.length; i++) {
    accumulated += probs[i];
    if (roll <= accumulated) {
      selectedCondKey = conditionKeys[i];
      break;
    }
  }

  const daysMap: Record<string, string[]> = {
    ta: ['திங்கள்', 'செவ்வாய்', 'புதன்', 'வியாழன்', 'வெள்ளி'],
    en: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    hi: ['सोमवार', 'मंगलवार', 'बुधवार', 'गुरुवार', 'शुक्रवार'],
    te: ['సోమవారం', 'మంగళవారం', 'ಬುಧವಾರ', 'గురువారం', 'శుక్రవారం'],
    kn: ['ಸೋಮವಾರ', 'ಮಂಗಳವಾರ', 'ಬುಧವಾರ', 'ಗುರುವಾರ', 'ಶುಕ್ರವಾರ'],
    ml: ['തിങ്കൾ', 'ചൊവ്വാ', 'ബുധൻ', 'വ്യാഴം', 'വെള്ളി'],
    mr: ['सोमवार', 'मंगळवार', 'बुधवार', 'गुरूवार', 'शुक्रवार'],
    bn: ['সোমবার', 'মঙ্গলবার', 'বুধবার', 'বৃহস্পতিবার', 'শুক্রবার'],
    gu: ['સોમવાર', 'મંગળવાર', 'બુધવાર', 'ગુરૂવાર', 'શુક્રવાર'],
    pa: ['ਸੋਮਵਾਰ', 'ਮੰਗਲਵਾਰ', 'ਬੁੱਧਵਾਰ', 'ਵੀਰਵਾਰ', 'ਸ਼ੁੱਕਰਵાર']
  };

  const days = daysMap[lang] || daysMap.en;
  const weatherTypes = ['Sunny', 'Cloudy', 'Rainy', 'Thunderstorm', 'Rainy'];
  const riskTypes: Array<'Low' | 'Medium' | 'High'> = ['Low', 'Medium', 'High', 'High', 'Medium'];

  const forecast = days.map((day, idx) => {
    const tRand = seedRandom(district.id + idx);
    const dayTemp = baseTemp - 2 + Math.floor(tRand() * 5);
    const condIdx = Math.floor(tRand() * weatherTypes.length);
    return {
      day,
      temp: dayTemp,
      condition: weatherTypes[condIdx],
      risk: riskTypes[condIdx]
    };
  });

  const alerts = [
    {
      level: 'High' as const,
      en: 'HIGH RISK ALERT: Wet leaves and humidity above 80% create an optimal atmosphere for fungal disease outbreaks like Blast and Early Blight. Apply preventive spray now.',
      ta: 'உயரளவு அபாய எச்சரிக்கை: இலைகளில் ஈரப்பதம் மற்றும் 80% க்கும் அதிகமான காற்று ஈரப்பதம் குலை நோய் மற்றும் இலைக்கருகல் நோய் பரவ ஏதுவானது. தடுப்பு தெளிப்பு செய்க!',
      hi: 'उच्च जोखिम चेतावनी: पत्तियों में नमी और 80% से अधिक हवा में आर्द्रता ब्लास्ट और अगेती झुलसा जैसे कवक रोगों के फैलने के अनुकूल है। निवारक छिड़काव करें!',
      te: 'అధిక ప్రమాద హెచ్చరిక: ఆకులలో తేమ మరియు 80% కంటే ఎక్కువ గాలిలో తేమ బ్లాస్ట్ మరియు తెగుళ్లు వ్యాపించడానికి అనుకూలం. నివారణ చర్యలు తీసుకోండి.',
      kn: 'ಹೆಚ್ಚಿನ ಅಪಾಯದ ಮುನ್ನೆಚ್ಚರಿಕೆ: ಎಲೆಗಳ ತೇವಾಂಶ ಮತ್ತು 80% ಕ್ಕಿಂತ ಹೆಚ್ಚಿನ ಗಾಳಿಯ ಆರ್ದ್ರತೆಯು ಬ್ಲಾಸ್ಟ್ ಮತ್ತು ಎಲೆ ಕರಟು ರೋಗ ಹರಡಲು ಕಾರಣವಾಗಬಹುದು. ಮುನ್ನೆಚ್ಚರಿಕೆ ಕ್ರಮ ಕೈಗೊಳ್ಳಿ.',
      ml: 'ഉയർന്ന അപകടസാധ്യത മുന്നറിയിപ്പ്: ഇലകളിലെ ഈർപ്പവും അന്തരീക്ഷത്തിലെ 80% കൂടുതൽ ഈർപ്പവും ഫംഗസ് രോഗങ്ങൾ ഉണ്ടാകാൻ ഇടയാക്കും. പ്രതിരോധ മരുന്ന് തളിക്കുക.',
      mr: 'उच्च जोखीम चेतावणी: पानांमधील आर्द्रता आणि हवेतील ८०% पेक्षा जास्त आर्द्रता ब्लास्ट आणि लवकर येणाऱ्या करपा रोगाच्या प्रादुर्भावासाठी कारणीभूत ठरू शकते.',
      bn: 'উচ্চ ঝুঁকির সতর্কতা: পাতায় আর্দ্রতা এবং বাতাসে ৮০% এর বেশি আর্দ্রতা ব্লাস্ট এবং আর্লি ব্লাইটের মতো ছত্রাকজনিত রোগ ছড়ানোর অনুকূল পরিবেশ তৈরি করে।',
      gu: 'ઉચ્ચ જોખમ ચેતવણી: પાંદડામાં ભેજ અને હવામાં ૮૦% થી વધુ ભેજ બ્લાસ્ટ અને પ્રારંભિક સુકારો જેવા ફૂગના રોગોના ફેલાવા માટે અનુકૂળ છે.',
      pa: 'ਉੱਚ ਖ਼ਤਰੇ ਦੀ ਚੇਤਾਵਨੀ: ਪੱਤਿਆਂ ਵਿੱਚ ਨਮੀ ਅਤੇ 80% ਤੋਂ ਵੱਧ ਹਵਾ ਵਿੱਚ ਨਮੀ ਬਲਾਸਟ ਅਤੇ ਅਗੇਤੀ ਝੁਲਸ ਵਰਗੇ ਉੱਲੀ ਦੇ ਰੋਗ ਫੈਲਣ ਲਈ ਅਨੁਕੂਲ ਹੈ।'
    },
    {
      level: 'Medium' as const,
      en: 'MEDIUM RISK: Warm climate and local showers might trigger mild pests and caterpillar movement on young crops. Monitor weekly.',
      ta: 'மிதமான அபாயம்: மிதமான வெப்பம் மற்றும் மழை காரணமாக புழுக்கள் மற்றும் இளம் பூச்சிகளின் தாக்கம் வரலாம். வாரமொருமுறை பயிர்களை கண்காணிக்கவும்.',
      hi: 'मध्यम जोखिम: गर्म जलवायु और स्थानीय बौछारों से युवा फसलों पर हल्के कीट और कैटरपिलर की गतिविधि शुरू हो सकती है। साप्ताहिक रूप से निगरानी करें।',
      te: 'ಮಧ್ಯಮ ಅಪಾಯ: వెచ్చని వాతావરણం మరియు స్థానిక జల్లులు యువ పంటలపై పురుగులు మరియు తెగుళ్లు దాడి చేయడానికి కారణం కావచ్చు.',
      kn: 'ಮಧ್ಯಮ ಅಪಾಯ: ಬೆಚ್ಚಗಿನ ಹವಾಮಾನ ಮತ್ತು ಸ್ಥಳೀಯ ಮಳೆಯು ಎಳೆಯ ಬೆಳೆಗಳ ಮೇಲೆ ಸಣ್ಣ ಕೀಟಗಳು ಮತ್ತು ಲದ್ದಿಹುಳುಗಳ ಬಾಧೆಯನ್ನು ಉಂಟುಮಾಡಬಹುದು.',
      ml: 'മിതമായ അപകടസാധ്യത: ചൂടുള്ള കാലാവസ്ഥയും ചെറിയ മഴയും വിളകളിൽ പുഴുക്കളുടെ ശല്യം വർദ്ധിപ്പിച്ചേക്കാം. ആഴ്ചയിലൊരിക്കൽ നിരീക്ഷിക്കുക.',
      mr: 'मध्यम जोखीम: उष्ण हवामान आणि स्थानिक सरींमुळे पिकांवर किडी व अळ्यांचा प्रादुर्भाव होऊ शकतो. साप्ताहिक देखरेख ठेवा.',
      bn: 'মাঝারি ঝুঁকি: উষ্ণ জলবায়ু এবং স্থানীয় বৃষ্টিপাতের ফলে কচি ফসলে হালকা পোকা এবং শুঁয়োপোকার আক্রমণ হতে পারে। সাপ্তাহিক পর্যবেক্ষণ করুন।',
      gu: 'મધ્યમ જોખમ: ગરમ આબોહવા અને સ્થાનિક ઝાપટાંને કારણે પાક પર હળવી જીવાત અને ઈયળોનો ઉપદ્રવ થઈ શકે છે. સાપ્તાહિક મોનિટર કરો.',
      pa: "ਦਰਮਿਆਨਾ ਖ਼ਤਰਾ: ਗਰਮ ਜਲਵਾਯੂ ਅਤੇ ਸਥਾਨਕ ਬਾਰਿਸ਼ ਨਾਲ ਨੌਜਵਾਨ ਫਸਲਾਂ 'ਤੇ ਹਲਕੇ ਕੀੜੇ ਅਤੇ ਸੁੰਡੀ ਦੀ ਹਰਕਤ ਸ਼ੁਰੂ ਹੋ ਸਕਦੀ ਹੈ।"
    },
    {
      level: 'Low' as const,
      en: 'LOW RISK: Excellent weather for plant photosynthesis and growth. Continue standard organic liquid fertilization cycles.',
      ta: 'குறைந்த அபாயம்: பயிர் வளர்ச்சி மற்றும் ஒளிச்சேர்க்கைக்கு உகந்த வானிலை. வழக்கம் போல இயற்கை திரவ உரங்களை இட்டு வரவும்.',
      hi: 'कम जोखिम: पौधों के प्रकाश संश्लेषण और विकास के लिए उत्कृष्ट मौसम। मानक जैविक तरल उर्वरक चक्र जारी रखें।',
      te: 'తక్కువ ప్రమాదం: మొక్కల కిరణజన్య సంయోగక్రియ మరియు వృద్ధికి అద్భుతమైన వాతావરણం. సేంద్రీయ ఎరువుల సరఫరా కొనసాగించండి.',
      kn: 'ಕಡಿಮೆ ಅಪಾಯ: ಸಸ್ಯದ ದ್ಯುತಿಸಂಶ್ಲೇಷಣೆ ಮತ್ತು ಬೆಳವಣಿಗೆಗೆ ಅತ್ಯುತ್ತಮ ಹವಾಮಾನ. ಸಾವಯವ ದ್ರವ ಗೊಬ್ಬರ ನೀಡಿಕೆ ಮುಂದುವರಿಸಿ.',
      ml: 'കുറഞ്ഞ അപകടസാധ്യത: ചെടിയുടെ വളർച്ചയ്ക്ക് അനുയോജ്യമായ കാലാവസ്ഥ. ജൈവ വളപ്രയോഗം തുടരുക.',
      mr: 'कमी जोखीम: वनस्पतींच्या प्रकाशसंश्लेषण आणि वाढीसाठी उत्कृष्ट हवामान. सेंद्रिय खतांचा वापर चालू ठेवा.',
      bn: 'কম ঝুঁকি: উদ্ভিদের সালোকসংশ্লেষণ এবং বৃদ্ধির জন্য চমৎকার আবহাওয়া। আদর্শ জৈব তরল সার চক্র চালিয়ে যান।',
      gu: 'ઓછું જોખમ: છોડના પ્રકાશસંશ્લેષણ અને વૃદ્ધિ માટે ઉત્તમ હવામાન. પ્રમાણભૂત સેન્દ્રીય પ્રવાહી ખાતર ચક્ર ચાલુ રાખો.',
      pa: 'ਘੱਟ ਖ਼ਤਰਾ: ਪੌਦਿਆਂ ਦੇ ਪ੍ਰਕਾਸ਼ ਸੰਸ਼ਲੇਸ਼ਣ ਅਤੇ ਵਿਕਾਸ ਲਈ ਉੱਤਮ ਮੌਸਮ। ਜੈਵਿਕ ਤਰਲ ਖਾਦ ਚੱਕਰ ਜਾਰੀ ਰੱਖੋ।'
    }
  ];

  const alertRoll = rand();
  const alertSelected = alertRoll > 0.6 ? alerts[0] : alertRoll > 0.25 ? alerts[1] : alerts[2];

  const cropSuggestions: Record<string, string> = {
    ta: 'நெல் மற்றும் காய்கறிகள் (Paddy & Veg)',
    en: 'Paddy & Vegetables',
    hi: 'धान और सब्जियां (Paddy & Veg)',
    te: 'వరి మరియు కూరగాయలు (Paddy & Veg)',
    kn: 'ಭತ್ತ ಮತ್ತು ತರಕಾರಿಗಳು (Paddy & Veg)',
    ml: 'നെല്ലും പച്ചക്കറികളും (Paddy & Veg)',
    mr: 'भात आणि भाज्या (Paddy & Veg)',
    bn: 'ধান ও সবজি (Paddy & Veg)',
    gu: 'ડાંગર અને શાકભાજી (Paddy & Veg)',
    pa: 'ਝੋਨਾ ਅਤੇ ਸਬਜ਼ੀਆਂ (Paddy & Veg)'
  };

  const cropSuggestion = cropSuggestions[lang] || cropSuggestions.en;
  const distName = isTamil ? district.nameTa : district.nameEn;

  return {
    location: `${distName}, ${stateName}`,
    temperature: baseTemp,
    humidity: baseHumidity,
    rainfall: baseRainfall,
    windSpeed: baseWind,
    condition: localizedConditions[selectedCondKey][lang] || localizedConditions[selectedCondKey].en,
    forecast,
    diseaseRiskAlert: {
      crop: cropSuggestion,
      alert: alertSelected[lang] || alertSelected.en,
      level: alertSelected.level
    }
  };
}

export function generateSchemesForState(stateId: string, lang: Language): GovScheme[] {
  const isTamil = lang === 'ta';
  
  // Scheme Localizations
  const localizedSchemes: Record<string, Record<string, Partial<GovScheme>>> = {
    sch1: {
      ta: {
        name: 'PM-KISAN (பிரதம மந்திரி கிசான் சம்மன் நிதி)',
        category: 'நேரடி வருமான ஆதரவு',
        benefit: 'ஆண்டுக்கு ₹6,000 மூன்று தவணைகளில் நேரடியாக வங்கி கணக்கில் செலுத்தப்படும்.',
        eligibility: 'நாடெங்கிலும் உள்ள அனைத்து சிறு மற்றும் குறு விவசாய குடும்பங்கள் தகுதி பெறுவர்.',
        description: 'விவசாய இடுபொருட்கள் மற்றும் குடும்ப செலவுகளை மேற்கொள்ள விவசாயிகளுக்கு வழங்கப்படும் மத்திய அரசு உதவித்தொகை திட்டம்.'
      },
      en: {
        name: 'PM-KISAN (Pradhan Mantri Kisan Samman Nidhi)',
        category: 'Direct Income Support',
        benefit: '₹6,000 per year in 3 equal installments of ₹2,000 directly transferred to bank accounts.',
        eligibility: 'All small and marginal landholder farmer families across the nation.',
        description: 'A central scheme providing income support to farmer families to purchase agricultural inputs and domestic needs.'
      },
      hi: {
        name: 'पीएम-किसान (प्रधानमंत्री किसान सम्मान निधि)',
        category: 'प्रत्यक्ष आय सहायता',
        benefit: 'बैंक खातों में सीधे हस्तांतरित ₹2,000 की 3 समान किस्तों में ₹6,000 प्रति वर्ष।',
        eligibility: 'देश भर के सभी छोटे और सीमांत भूमिधारक किसान परिवार।',
        description: 'किसान परिवारों को कृषि आदानों और घरेलू जरूरतों को पूरा करने के लिए आय सहायता प्रदान करने वाली एक केंद्रीय योजना।'
      }
    },
    sch2: {
      ta: {
        name: 'PMFBY - பிரதம மந்திரி பயிர் காப்பீட்டுத் திட்டம்',
        category: 'பயிர் காப்பீடு (Insurance)',
        benefit: 'பூச்சிகள், இயற்கை பேரிடர்கள் மற்றும் நோய்களால் ஏற்படும் பயிர் இழப்பிற்கு முழுமையான காப்பீடு வழங்கல்.',
        eligibility: 'அறிவிக்கப்பட்ட பகுதிகளில் அறிவிக்கப்பட்ட பயிர்களை பயிரிடும் குத்தகை விவசாயிகள் உட்பட அனைவரும்.',
        description: 'குறைந்த பிரீமியம் விகிதத்தில் தவிர்க்க முடியாத இயற்கை சேதங்களில் இருந்து விவசாயிகளுக்கு நிதிப் பாதுகாப்பு வழங்கும் திட்டம்.'
      },
      en: {
        name: 'PMFBY - Pradhan Mantri Fasal Bima Yojana',
        category: 'Crop Insurance',
        benefit: 'Comprehensive insurance coverage against crop failure, pests, diseases, and localized natural calamities.',
        eligibility: 'All farmers growing notified crops in notified areas, including sharecroppers and tenant farmers.',
        description: 'Protects farmers from financial loss due to unavoidable natural damages. Extremely low premium rates.'
      },
      hi: {
        name: 'पीएमएफबीवाई - प्रधानमंत्री फसल बीमा योजना',
        category: 'फसल बीमा',
        benefit: 'फसल खराब होने, कीड़ों, बीमारियों और प्राकृतिक आपदाओं के खिलाफ व्यापक बीमा कवरेज।',
        eligibility: 'अधिसूचित क्षेत्रों में अधिसूचित फसलें उगाने वाले सभी किसान, जिनमें बटाईदार भी शामिल हैं।',
        description: 'अनिवार्य प्राकृतिक नुकसान के कारण वित्तीय नुकसान से किसानों की रक्षा करता है। अत्यंत कम प्रीमियम दरें।'
      }
    }
  };

  const getS = (id: string, field: 'name' | 'category' | 'benefit' | 'eligibility' | 'description'): string => {
    const sObj = localizedSchemes[id];
    if (sObj) {
      if (sObj[lang] && sObj[lang][field]) return sObj[lang][field]!;
      if (sObj.en && sObj.en[field]) return sObj.en[field]!;
    }
    return '';
  };

  const schemes: GovScheme[] = [
    {
      id: 'sch1',
      name: getS('sch1', 'name'),
      category: getS('sch1', 'category'),
      benefit: getS('sch1', 'benefit'),
      eligibility: getS('sch1', 'eligibility'),
      applyLink: 'https://pmkisan.gov.in/',
      description: getS('sch1', 'description')
    },
    {
      id: 'sch2',
      name: getS('sch2', 'name'),
      category: getS('sch2', 'category'),
      benefit: getS('sch2', 'benefit'),
      eligibility: getS('sch2', 'eligibility'),
      applyLink: 'https://pmfby.gov.in/',
      description: getS('sch2', 'description')
    },
    {
      id: 'sch_kcc',
      name: lang === 'ta' ? 'KCC - கிசான் கிரெடிட் கார்டு (விவசாய கடன் அட்டை)' : 'KCC - Kisan Credit Card Scheme',
      category: lang === 'ta' ? 'விவசாய கடன் (Credit)' : 'Agricultural Credit',
      benefit: lang === 'ta' ? 'குறைந்த வட்டியில் (4% வரை) ₹3 லட்சம் வரையிலான கடனுதவி மற்றும் உடனடி திருப்பிச் செலுத்தும் சலுகைகள்.' : 'Concessional crop loans up to ₹3 Lakhs at lower interest rates (4%) with prompt repayment incentive.',
      eligibility: lang === 'ta' ? 'அனைத்து விவசாயிகள், தனிநபர் / கூட்டு கடன்தாரர்கள், குத்தகை விவசாயிகள் மற்றும் சுய உதவிக்குழுக்கள்.' : 'All farmers - individuals/joint borrowers, tenant farmers, oral lessees, and sharecroppers.',
      applyLink: 'https://www.sbi.co.in/web/personal-banking/loans/agriculture-loans/kisan-credit-card',
      description: lang === 'ta' ? 'பயிர்த்தொழில் செலவுகள், அறுவடைக்கு பிந்தைய தேவைகள் மற்றும் அவசர செலவுகளுக்கு உடனடி கடனுதவி அளிக்கும் திட்டம்.' : 'Provides timely credit support to farmers to meet their cultivation expenses, post-harvest needs, and domestic consumption.'
    }
  ];

  // State specific Schemes
  if (stateId === 'tamil_nadu') {
    schemes.push({
      id: 'sch_tn1',
      name: isTamil ? 'தமிழ்நாடு நுண்ணீர் பாசன மானியத் திட்டம்' : 'TN Micro Irrigation Subsidy Scheme',
      category: isTamil ? 'பாசன மானியம் (Irrigation)' : 'Irrigation Subsidies',
      benefit: isTamil ? 'சிறு, குறு விவசாயிகளுக்கு 100% மானியமும், இதர விவசாயிகளுக்கு 75% மானியமும் சொட்டுநீர்/தெளிப்புநீர் பாசனம் அமைக்க வழங்கப்படும்.' : '100% subsidy for small/marginal farmers and 75% subsidy for other farmers to install Drip/Sprinkler systems.',
      eligibility: isTamil ? 'தமிழ்நாட்டில் சொந்தமாக நிலமும், கிணறு அல்லது நீர் ஆதாரமும் கொண்ட அனைத்து விவசாயிகளும்.' : 'Farmers in Tamil Nadu with valid agricultural land, water source, and matching credentials.',
      applyLink: 'https://www.tnhorticulture.tn.gov.in/',
      description: isTamil ? 'நீரைச் சேமித்து சிறந்த முறையில் பாசனம் செய்து, கூடுதல் மகசூல் மற்றும் குறைந்த களை மேலாண்மை அடைய உதவும் மாநில அரசு திட்டம்.' : 'Implements water conservation methods in farming, significantly boosting yield quality and reducing weeding labor.'
    });
    schemes.push({
      id: 'sch_tn2',
      name: isTamil ? 'மாநில வேளாண் இயந்திரமயமாக்கல் திட்டம்' : 'TN Agricultural Mechanization Scheme',
      category: isTamil ? 'இயந்திர மானியம் (Machinery)' : 'Machinery Subsidies',
      benefit: isTamil ? 'டிராக்டர்கள், பவர் ட்ரில்லர் மற்றும் அறுவடை இயந்திரங்கள் வாங்க 40% முதல் 50% வரை மானியம்.' : '40% to 50% subsidy on buying agricultural machinery like Tractors, Power Tillers, and Rotavators.',
      eligibility: isTamil ? 'தமிழக பதிவு பெற்ற விவசாயிகள் மற்றும் உழவர் உற்பத்தியாளர் குழுக்கள் (FPO).' : 'Registered farmers and Farmer Producer Organizations (FPOs) of Tamil Nadu.',
      applyLink: 'https://aed.tn.gov.in/',
      description: isTamil ? 'வேளாண்மையில் தொழிலாளர் பற்றாக்குறையை சமாளிக்கவும், குறித்த காலத்தில் பணிகளை செய்து முடிக்கவும் மானிய விலையில் கருவிகள் வழங்கல்.' : 'Ensures mechanization to overcome labor scarcity and speed up land preparation and harvesting.'
    });
  } else if (stateId === 'andhra_pradesh') {
    schemes.push({
      id: 'sch_ap1',
      name: lang === 'te' ? 'YSR రైతు భరోసా (YSR Rythu Bharosa)' : 'YSR Rythu Bharosa - PM KISAN',
      category: lang === 'te' ? 'రాష్ట్ర ఆర్థిక సహాయం' : 'State Income Support',
      benefit: lang === 'te' ? 'ఏటా ₹13,500 పెట్టుబడి సహాయం (కేంద్ర-రాష్ట్ర సంయుక్త నిధులు) మూడు విడతలలో అందించబడుతుంది.' : 'Financial assistance of ₹13,500 per annum (jointly with PM-KISAN) provided to farming families in three installments.',
      eligibility: lang === 'te' ? 'ఆంధ్రప్రదేశ్‌కు చెందిన భూ యజమానులు మరియు కౌలు రైతులు.' : 'Landowning and landless tenant farmers belonging to Scheduled Castes, Tribes, and backward communities in Andhra Pradesh.',
      applyLink: 'https://ysrrythubharosa.ap.gov.in/',
      description: lang === 'te' ? 'వ్యవసాయానికి పెట్టుబడి సహాయం అందిస్తూ రైతులను ఆదుకునేందుకు ఆంధ్రప్రదేశ్ ప్రభుత్వం ప్రతిష్టాత్మకంగా అమలు చేస్తున్న పథకం.' : 'The landmark scheme of Andhra Pradesh providing robust input subsidies and economic relief directly at sowing seasons.'
    });
  } else if (stateId === 'karnataka') {
    schemes.push({
      id: 'sch_kar1',
      name: lang === 'kn' ? 'ಕರ್ನಾಟಕ ಕೃಷಿ ಭಾಗ್ಯ ಯೋಜನೆ' : 'Karnataka Krishi Bhagya Scheme',
      category: lang === 'kn' ? 'ನೀರು ಸಂಗ್ರಹಣೆ' : 'Water Conservation',
      benefit: lang === 'kn' ? 'ಕೃಷಿ ಹೊಂಡ ನಿರ್ಮಾಣ ಮತ್ತು ಡೀಸೆಲ್ ಪಂಪ್‌ಸೆಟ್‌ಗಳಿಗೆ ಶೇ. ೮೦ ರಿಂದ ೯೦ ರಷ್ಟು ಸಹಾಯಧನ.' : '80% to 90% subsidy for rain-water harvesting ponds, polythene lining sheet, and diesel pump sets.',
      eligibility: lang === 'kn' ? 'ಕರ್ನಾಟಕದ ಒಣ ವಲಯ ಪ್ರದೇಶದ ಸಣ್ಣ ಮತ್ತು ಅತಿ ಸಣ್ಣ ರೈತರು.' : 'Small and marginal farmers of dry-zone areas of Karnataka having valid agricultural land titles.',
      applyLink: 'https://samrakshane.karnataka.gov.in/',
      description: lang === 'kn' ? 'ಮಳೆನೀರನ್ನು ಕೃಷಿ ಹೊಂಡಗಳಲ್ಲಿ ಸಂಗ್ರಹಿಸಿ ಒಣ ಅವಧಿಯಲ್ಲಿ ರಕ್ಷಣಾತ್ಮಕ ನೀರಾವರಿ ಒದಗಿಸುವ ಯೋಜನೆ.' : 'Conserves rain water in farm ponds to supply protective irrigation through sprinkler/drip systems during dry spells.'
    });
  }

  return schemes;
}

export function generateDealersForDistrict(district: District, stateName: string, lang: Language): MarketplaceDealer[] {
  const isTamil = lang === 'ta';
  const rand = seedRandom(district.id);
  
  const typesEn = ['Organic Inputs & Bio-fertilizers', 'Pesticide & Chemical Dealers', 'Agricultural Equipment & Tools', 'Government Seeds & Agro Centre'];
  const typesTa = ['இயற்கை இடுபொருட்கள்', 'பூச்சிக்கொல்லி & உரங்கள்', 'வேளாண் கருவிகள் & இயந்திரங்கள்', 'அரசு விதை மற்றும் வேளாண் மையம்'];

  const dealerNames = [
    { en: 'Sri Senthil', ta: 'ஸ்ரீ செந்தில்' },
    { en: 'AgriCare Green', ta: 'அக்ரிகேர் கிரீன்' },
    { en: 'Bharat Agro', ta: 'பாரத் அக்ரோ' },
    { en: 'Vivasaya Nanban', ta: 'விவசாய நண்பன்' },
    { en: 'Lakshmi Seeds', ta: 'லட்சுமி சீட்ஸ்' },
    { en: 'Kisan Mitra', ta: 'கிசான் மித்ரா' }
  ];

  const itemsList = [
    ['Panchagavya (பஞ்சகவ்யா)', 'Neem oil insecticidal spray', 'Vermicompost (மண்புழு உரம்)', 'Bio-fertilizer pack'],
    ['Mancozeb 75% WP', 'Tricyclazole (Blast Control)', 'Urea & Potash', 'NPK 19:19:19 Fertilizer'],
    ['Knapsack Battery Sprayer', 'Drip Irrigation pipes', 'Soil PH Tester', 'Power Weeder', 'Sickles & Spades'],
    ['Government Seed packets', 'Soil Health Card kit', 'Organic seed treatments', 'Agri Insurance forms']
  ];

  // We will generate 4 personalized dealers for the chosen district
  const dealers: MarketplaceDealer[] = [];
  for (let i = 0; i < 4; i++) {
    const nIdx = Math.floor(rand() * dealerNames.length);
    const dName = dealerNames[(nIdx + i) % dealerNames.length];
    
    // Auto translation of prefix/suffix label
    let finalName = '';
    let address = '';
    
    if (isTamil) {
      finalName = `${dName.ta} வேளாண்மையகம்`;
      address = `நெ. ${10 + i * 15}, கடை வீதி, ${district.nameTa}, ${stateName}`;
    } else if (lang === 'hi') {
      finalName = `${dName.en} कृषि केंद्र`;
      address = `नंबर ${10 + i * 15}, मेन बाजार, ${district.nameEn}, ${stateName}`;
    } else {
      finalName = `${dName.en} Agro Traders`;
      address = `No. ${10 + i * 15}, Main Bazaar, ${district.nameEn}, ${stateName}`;
    }

    dealers.push({
      id: `m_dyn_${district.id}_${i}`,
      name: finalName,
      type: isTamil ? typesTa[i] : typesEn[i],
      phone: `+91 ${90000 + Math.floor(rand() * 90000)} ${10000 + Math.floor(rand() * 90000)}`,
      address,
      dist: district.nameEn, // match string format for filter comparison
      items: itemsList[i]
    });
  }

  return dealers;
}
