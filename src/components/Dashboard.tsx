import React, { useState, useMemo } from 'react';
import { User, Crop, DiseaseHistory, Notification, WeatherData, GovScheme } from '../types';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend 
} from 'recharts';
import VoiceAssistant from './VoiceAssistant';
import { 
  Sprout, 
  CloudSun, 
  ShieldAlert, 
  PlusCircle, 
  FileText, 
  TrendingUp, 
  Activity, 
  Bell, 
  Check, 
  Award, 
  ChevronRight, 
  ArrowRight,
  Info,
  Download,
  Landmark,
  Lightbulb
} from 'lucide-react';
import { translations, Language } from '../lib/translations';
import { generateFarmReport } from '../lib/reportGenerator';
import { exportToCSV } from '../lib/csvHelper';
import ProTipsModal from './ProTipsModal';

interface DashboardProps {
  user: User;
  crops: Crop[];
  history: DiseaseHistory[];
  notifications: Notification[];
  weather: WeatherData;
  onNavigate: (tab: string) => void;
  onMarkNotificationRead: (id: string) => void;
  onAddCrop: () => void;
  language: Language;
  schemes: GovScheme[];
}

const localDict: Record<string, Record<Language, string>> = {
  paddy: {
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
  chemicalTreatment: {
    ta: "இரசாயன தீர்வு (Chemical)",
    en: "Chemical Treatment",
    hi: "रासायनिक उपचार (Chemical)",
    te: "రసాయన చికిత్స (Chemical)",
    kn: "ರಾಸಾಯನಿಕ ಚಿಕಿತ್ಸೆ (Chemical)",
    ml: "രാസ ചികിത്സ (Chemical)",
    mr: "रासायनिक उपचार (Chemical)",
    bn: "রাসায়নিক চিকিৎসা (Chemical)",
    gu: "રાસાયણિક સારવાર (Chemical)",
    pa: "ਰਸਾਇਣਕ ਇਲਾਜ (Chemical)"
  },
  description: {
    ta: "விளக்கம்",
    en: "Description",
    hi: "विवरण",
    te: "వివరణ",
    kn: "ವಿವರಣೆ",
    ml: "വിവരണം",
    mr: "वर्णन",
    bn: "বর্ণনা",
    gu: "વર્ણન",
    pa: "ਵੇਰਵਾ"
  }
};

const alertTemplates: Record<Language, (crop: string, disease: string) => React.ReactNode> = {
  ta: (crop, disease) => <>உங்கள் பண்ணையில் {crop} பயிரில் <strong>{disease}</strong> கண்டறியப்பட்டுள்ளது. உடனடியாகப் பரிந்துரைக்கப்பட்ட பாதுகாப்பு தெளிப்புகளை மேற்கொள்ளவும்!</>,
  en: (crop, disease) => <><strong>{disease}</strong> has been detected on crop {crop} at your farm. Please apply the recommended treatment immediately!</>,
  hi: (crop, disease) => <>आपके खेत में {crop} फसल पर <strong>{disease}</strong> का पता चला है। कृपया तुरंत अनुशंसित उपचार लागू करें!</>,
  te: (crop, disease) => <>మీ పొలంలో {crop} పంటపై <strong>{disease}</strong> కనుగొనబడింది. దయచేసి వెంటనే సిఫార్సు చేసిన చికిత్సను వర్తింపజేయండి!</>,
  kn: (crop, disease) => <>ನಿಮ್ಮ ಹೊಲದಲ್ಲಿ {crop} ಬೆಳೆಯ ಮೇಲೆ <strong>{disease}</strong> ಪತ್ತೆಯಾಗಿದೆ. ದಯವಿಟ್ಟು ತಕ್ಷಣ ಶಿಫಾರಸು ಮಾಡಿದ ಚಿಕಿತ್ಸೆಯನ್ನು ಅನ್ವಯಿಸಿ!</>,
  ml: (crop, disease) => <>നിങ്ങളുടെ ഫാമിലെ {crop} വിളയിൽ <strong>{disease}</strong> കണ്ടെത്തിയിരിക്കുന്നു. ദയവായി ശുപാർശ ചെയ്ത ചികിത്സ ഉടൻ നടപ്പിലാക്കുക!</>,
  mr: (crop, disease) => <>तुमच्या शेतातील {crop} पिकावर <strong>{disease}</strong> आढळले आहे. कृपया त्वरित शिफारस केलेले उपचार लागू करा!</>,
  bn: (crop, disease) => <>আপনার খামারে {crop} ফসলে <strong>{disease}</strong> সনাক্ত করা হয়েছে। অবিলম্বে প্রস্তাবিত চিকিৎসা গ্রহণ করুন!</>,
  gu: (crop, disease) => <>તમારા ફાર્મમાં {crop} પાક પર <strong>{disease}</strong> જોવા મળ્યું છે. કૃપા કરીને તરત જ ભલામણ કરેલ સારવાર લાગુ કરો!</>,
  pa: (crop, disease) => <>ਤੁਹਾਡੇ ਫਾਰਮ ਵਿੱਚ {crop} ਫਸਲ 'ਤੇ <strong>{disease}</strong> ਦਾ ਪਤਾ ਲੱਗਿਆ ਹੈ। ਕਿਰਪਾ ਕਰਕੇ ਤੁਰੰਤ ਸਿਫਾਰਸ਼ ਕੀਤੇ ਇਲਾਜ ਨੂੰ ਲਾਗੂ ਕਰੋ!</>
};

const trendSummaryTemplates: Record<Language, (crop: string, score: number) => string> = {
  ta: (crop, score) => `கடைசி ஆய்வுப்படி, "${crop}" பயிர் இப்போதைய ஆரோக்கிய மதிப்பெண் ${score}% உடன் நல்ல நிலையில் வளர்கிறது.`,
  en: (crop, score) => `According to the latest scan, "${crop}" is growing in good condition with a health score of ${score}%.`,
  hi: (crop, score) => `नवीनतम स्कैन के अनुसार, "${crop}" ${score}% स्वास्थ्य स्कोर के साथ अच्छी स्थिति में बढ़ रहा है।`,
  te: (crop, score) => `తాజా స్కాన్ ప్రకారం, "${crop}" ${score}% ఆరోగ్య స్కోరుతో మంచి స్థితిలో పెరుగుతోంది.`,
  kn: (crop, score) => `ಇತ್ತೀಚಿನ ಸ್ಕ್ಯಾನ್ ಪ್ರಕಾರ, "${crop}" ಶೇ ${score} ರಷ್ಟು ಆರೋಗ್ಯ ಅಂಕಗಳೊಂದಿಗೆ ಉತ್ತಮ ಸ್ಥಿತಿಯಲ್ಲಿ ಬೆಳೆಯುತ್ತಿದೆ.`,
  ml: (crop, score) => `ഏറ്റവും പുതിയ സ്കാൻ അനുസരിച്ച്, "${crop}" ${score}% ആരോഗ്യ സ്‌കോറോടെ മികച്ച നിലയിലാണ് വളരുന്നത്.`,
  mr: (crop, score) => `नवीनतम स्कॅननुसार, "${crop}" ${score}% आरोग्य गुणांसह चांगल्या स्थितीत वाढत आहे.`,
  bn: (crop, score) => `সর্বশেষ স্ক্যান অনুসারে, "${crop}" ${score}% স্বাস্থ্য স্কোর সহ ভালো অবস্থায় বাড়ছে।`,
  gu: (crop, score) => `નવીનતમ સ્કેન મુજબ, "${crop}" પાક ${score}% આરોગ્ય સ્કોર સાથે સારી સ્થિતિમાં વધી રહ્યો છે.`,
  pa: (crop, score) => `ਤਾਜ਼ਾ ਸਕੈਨ ਦੇ ਅਨੁਸਾਰ, "${crop}" ਫਸਲ ${score}% ਸਿਹਤ ਸਕੋਰ ਨਾਲ ਵਧੀਆ ਸਥਿਤੀ ਵਿੱਚ ਵਧ ਰਹੀ ਹੈ।`
};

const cropLabel: Record<Language, string> = {
  ta: 'பயிர்',
  en: 'Crop',
  hi: 'फसल',
  te: 'పంట',
  kn: 'ಬೆಳೆ',
  ml: 'വിള',
  mr: 'पीक',
  bn: 'ফসল',
  gu: 'પાક',
  pa: 'ਫਸਲ'
};

const pdfFailedMsg: Record<Language, string> = {
  ta: "PDF அறிக்கை உருவாக்கத் தவறியது",
  en: "Failed to generate PDF Report",
  hi: "पीडीएफ रिपोर्ट उत्पन्न करने में विफल",
  te: "PDF నివేదికను రూపొందించడంలో విఫలమైంది",
  kn: "PDF ವರದಿ ರಚಿಸಲು ವಿಫಲವಾಗಿದೆ",
  ml: "PDF റിപ്പോർട്ട് സൃഷ്ടിക്കുന്നതിൽ പരാജയപ്പെട്ടു",
  mr: "पीडीएफ अहवाल तयार करण्यात अयशस्वी",
  bn: "পিডিএফ রিপোর্ট তৈরি করতে ব্যর্থ হয়েছে",
  gu: "પીડીએફ રિપોર્ટ જનરેટ કરવામાં નિષ્ફળ",
  pa: "PDF ਰਿਪੋਰਟ ਤਿਆਰ ਕਰਨ ਵਿੱਚ ਅਸਫਲ"
};

export default function Dashboard({ 
  user, 
  crops, 
  history, 
  notifications, 
  weather, 
  onNavigate, 
  onMarkNotificationRead,
  onAddCrop,
  language,
  schemes
}: DashboardProps) {

  const activeAlerts = history.filter(h => h && (h.severity === 'High' || h.severity === 'Severe'));
  const unreadNotifications = notifications.filter(n => !n.isRead);

  const [isProTipsOpen, setIsProTipsOpen] = useState(false);

  const [selectedTrendCropId, setSelectedTrendCropId] = useState<string>(
    crops.length > 0 ? crops[0].id : 'default'
  );

  const [selectedFarm, setSelectedFarm] = useState<string>('All');

  React.useEffect(() => {
    if (crops.length > 0 && (selectedTrendCropId === 'default' || !crops.some(c => c.id === selectedTrendCropId))) {
      setSelectedTrendCropId(crops[0].id);
    }
  }, [crops, selectedTrendCropId]);

  const uniqueFarms = useMemo(() => {
    const list = crops.map(c => c.farmName).filter(Boolean) as string[];
    if (user.farmName && !list.includes(user.farmName)) {
      list.push(user.farmName);
    }
    return Array.from(new Set(list));
  }, [crops, user.farmName]);

  const activeTrendCrop = crops.find(c => c.id === selectedTrendCropId) || crops[0] || null;

  const trendData = useMemo(() => {
    const prefix = translations[language].chart_week || 'Week';
    
    // If the active crop has real historical growth data, prioritize visualizing it
    if (activeTrendCrop && activeTrendCrop.growthHistory && activeTrendCrop.growthHistory.length > 0) {
      return activeTrendCrop.growthHistory.map((item) => {
        const weekNum = item.week.replace('W', '');
        return {
          name: `${prefix} ${weekNum}`,
          health: item.health,
          growth: item.growth,
        };
      });
    }

    const cropName = activeTrendCrop ? activeTrendCrop.name : (localDict.paddy[language] || 'Paddy');
    const currentHealth = activeTrendCrop ? activeTrendCrop.healthScore : 85;
    
    // Deterministic generation based on crop properties
    const seed = cropName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return [
      { name: `${prefix} 1`, health: Math.max(45, Math.min(100, currentHealth - 20 + (seed % 12))), growth: 15 },
      { name: `${prefix} 2`, health: Math.max(50, Math.min(100, currentHealth - 12 + (seed % 8))), growth: 32 },
      { name: `${prefix} 3`, health: Math.max(45, Math.min(100, currentHealth - 15 + (seed % 15))), growth: 50 },
      { name: `${prefix} 4`, health: Math.max(55, Math.min(100, currentHealth - 6 + (seed % 7))), growth: 68 },
      { name: `${prefix} 5`, health: Math.max(65, Math.min(100, currentHealth - 2 + (seed % 5))), growth: 84 },
      { name: `${prefix} 6`, health: currentHealth, growth: 100 },
    ];
  }, [activeTrendCrop, language]);

  const handleExportChartData = () => {
    const cropName = activeTrendCrop ? activeTrendCrop.name : (localDict.paddy[language] || 'Paddy');
    const filename = `crop_performance_${cropName.toLowerCase().replace(/\s+/g, '_')}.csv`;
    const exportData = trendData.map(item => ({
      week: item.name,
      health_score: `${item.health}%`,
      growth_progress: `${item.growth}%`
    }));
    const headers = [
      { key: 'week', label: translations[language].chart_week || 'Week' },
      { key: 'health_score', label: translations[language].chart_health_score || 'Health Score' },
      { key: 'growth_progress', label: translations[language].chart_growth_progress || 'Growth Progress' }
    ];
    exportToCSV(exportData, headers, filename);
  };

  const handleExportHistory = () => {
    const filename = `crop_history_${new Date().toISOString().slice(0, 10)}.csv`;
    const exportData = history.filter(Boolean).map(record => ({
      date: record.createdAt ? new Date(record.createdAt).toLocaleDateString() : 'Demo',
      crop: record.cropName,
      disease: record.diseaseName,
      severity: record.severity,
      confidence: `${Math.floor(record.confidence * 100)}%`,
      organic: record.organicTreatment,
      chemical: record.chemicalTreatment,
      description: record.description
    }));
    const headers = [
      { key: 'date', label: translations[language].pdf_planted_date || 'Date' },
      { key: 'crop', label: translations[language].pdf_crop_name || 'Crop Name' },
      { key: 'disease', label: translations[language].pdf_disease_name || 'Disease' },
      { key: 'severity', label: translations[language].pdf_severity || 'Severity' },
      { key: 'confidence', label: translations[language].accuracy || 'Confidence' },
      { key: 'organic', label: translations[language].pdf_treatment || 'Organic Treatment' },
      { key: 'chemical', label: localDict.chemicalTreatment[language] || 'Chemical Treatment' },
      { key: 'description', label: localDict.description[language] || 'Description' }
    ];
    exportToCSV(exportData, headers, filename);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      
      {/* 1. Welcome & Stats Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Welcome Card */}
        <div className="lg:col-span-2 bg-gradient-to-br from-white via-slate-50 to-emerald-50/15 border border-slate-200/80 rounded-3xl p-6 sm:p-8 relative overflow-hidden flex flex-col justify-between shadow-sm">
          <div className="absolute top-0 right-0 p-8 opacity-[0.03] text-emerald-600">
            <Sprout className="h-40 w-40" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="bg-emerald-50 border border-emerald-100/60 text-emerald-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider font-mono">
                {user.role === 'farmer' ? translations[language].role_farmer : translations[language].role_officer}
              </span>
              <span className="text-xs text-slate-500 font-semibold">{translations[language].thanjavur_dist}</span>
            </div>
            
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2 font-sans leading-tight">
              {translations[language].welcome_farmer.includes('விவசாய நண்பரே')
                ? translations[language].welcome_farmer.replace('விவசாய நண்பரே', user.name || 'விவசாய நண்பரே')
                : translations[language].welcome_farmer.includes('Farmer Friend')
                  ? translations[language].welcome_farmer.replace('Farmer Friend', user.name || 'Farmer Friend')
                  : user.name ? `${translations[language].welcome_farmer.slice(0, -1)} ${user.name}!` : translations[language].welcome_farmer}
            </h2>
            <p className="text-sm text-slate-600 mt-1 font-medium">
              {translations[language].today_status_healthy} {crops.length > 0 ? `${crops.length} ${translations[language].crops_monitored}` : translations[language].no_crops_monitored}
            </p>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              onClick={() => onNavigate('detect')}
              className="px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md shadow-emerald-100 transition-all flex items-center space-x-1.5 cursor-pointer"
              id="dashboard-diagnose-btn"
            >
              <Sprout className="h-4 w-4" />
              <span>{translations[language].scan_leaf_btn}</span>
            </button>
            <button
              onClick={onAddCrop}
              className="px-5 py-3 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-bold rounded-xl transition-all flex items-center space-x-1.5 cursor-pointer"
              id="dashboard-add-crop-btn"
            >
              <PlusCircle className="h-4 w-4 text-emerald-600" />
              <span>{translations[language].register_crop_btn}</span>
            </button>
            <button
              onClick={() => setIsProTipsOpen(true)}
              className="px-5 py-3 bg-amber-50 hover:bg-amber-100/80 text-amber-900 border border-amber-200/60 text-xs font-extrabold rounded-xl transition-all flex items-center space-x-1.5 cursor-pointer shadow-xs"
              id="dashboard-protips-btn"
            >
              <Lightbulb className="h-4 w-4 text-amber-500 animate-pulse" />
              <span>{translations[language].farming_pro_tips || 'Farming Pro-Tips'}</span>
            </button>
          </div>
        </div>

        {/* Compact Weather Alert Widget */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-slate-400 text-xs font-bold uppercase tracking-wider font-mono">
                {translations[language].live_weather || 'Live Weather'}
              </span>
              <h4 className="text-lg font-bold text-slate-800 font-sans mt-0.5">{weather.location}</h4>
            </div>
            <CloudSun className="h-10 w-10 text-amber-500" />
          </div>

          <div className="my-4 flex items-baseline space-x-1">
            <span className="text-3xl font-black text-slate-900">{weather.temperature}°C</span>
            <span className="text-xs text-slate-500 font-semibold">{weather.condition}</span>
          </div>

          <div className="grid grid-cols-2 gap-4 text-center bg-slate-50 p-2.5 rounded-xl border border-slate-200/60">
            <div>
              <p className="text-[10px] text-slate-400 uppercase font-mono">
                {translations[language].humidity || 'Humidity'}
              </p>
              <p className="text-xs font-extrabold text-slate-800">{weather.humidity}%</p>
            </div>
            <div>
              <p className="text-[10px] text-slate-400 uppercase font-mono">
                {translations[language].rainfall || 'Rainfall'}
              </p>
              <p className="text-xs font-extrabold text-slate-800">{weather.rainfall} mm</p>
            </div>
          </div>

          <button
            onClick={() => onNavigate('weather')}
            className="text-xs font-bold text-emerald-600 mt-4 flex items-center justify-end space-x-1 hover:underline"
            id="dashboard-weather-details-btn"
          >
            <span>{translations[language].weather_details || 'Weather Details'}</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>

      </div>

      {/* 2. Embedded Voice Assistant (Speech-to-Text / Text-to-Speech) */}
      <VoiceAssistant />

      {/* 3. Main Dashboard Contents (2-Column Grid) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left Col: Crops & Alerts (2x width) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Active Disease Outbreak Alerts (High Severity Warnings) */}
          {activeAlerts.length > 0 && (
            <div className="bg-red-50 border border-red-100 rounded-3xl p-5 flex items-start space-x-3.5">
              <ShieldAlert className="h-6 w-6 text-red-600 shrink-0 mt-0.5 animate-pulse" />
              <div>
                <h4 className="font-bold text-red-950 text-sm">
                  {translations[language].disease_alert_title || '🚨 Serious Disease Outbreak Alert!'}
                </h4>
                <p className="text-xs text-red-800 mt-1">
                  {alertTemplates[language] ? alertTemplates[language](activeAlerts[0].cropName, activeAlerts[0].diseaseName) : (
                    <><strong>{activeAlerts[0].diseaseName}</strong> has been detected on crop {activeAlerts[0].cropName} at your farm. Please apply the recommended treatment immediately!</>
                  )}
                </p>
                <button
                  onClick={() => onNavigate('detect')}
                  className="text-xs font-bold text-red-950 underline mt-2 flex items-center space-x-1 hover:opacity-80"
                >
                  <span>
                    {translations[language].approve_recovery || 'Approve security & recovery steps'}
                  </span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* Registered Crops list (Crop Passport) */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="text-base font-extrabold text-slate-900">{translations[language].crop_passport_title}</h3>
                <p className="text-xs text-slate-500 mt-0.5">{translations[language].crop_passport_subtitle}</p>
              </div>
              <button
                onClick={() => onNavigate('passport')}
                className="text-xs font-bold text-emerald-600 hover:underline"
                id="dashboard-passport-all-btn"
              >
                {translations[language].view_all}
              </button>
            </div>

            {crops.length === 0 ? (
              <div className="text-center py-8 border border-dashed border-slate-200 rounded-2xl">
                <p className="text-sm text-slate-400">{translations[language].no_registered_crops}</p>
                <button
                  onClick={onAddCrop}
                  className="mt-2 text-xs font-bold text-emerald-600 hover:underline"
                >
                  {translations[language].click_to_add_first}
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {crops.map((crop) => (
                  <div key={crop.id} className="border border-slate-200/80 p-4 rounded-2xl hover:bg-emerald-50/10 hover:border-emerald-500 transition-all relative flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-bold text-slate-900 text-sm flex items-center gap-1.5 flex-wrap">
                            <span>{crop.name}</span>
                            {(crop.id?.startsWith('crop_offline_') || !navigator.onLine) && (
                              <span className="bg-amber-100 dark:bg-amber-950/40 text-amber-800 dark:text-amber-400 border border-amber-200/50 dark:border-amber-800/50 text-[8px] font-extrabold px-1.5 py-0.5 rounded-full uppercase">
                                {translations[language].cached || 'Cached'}
                              </span>
                            )}
                          </h4>
                          <p className="text-[10px] text-slate-500 font-semibold">{crop.variety || (translations[language].hybrid || 'Hybrid')}</p>
                        </div>
                        <div className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                          crop.healthScore >= 80 ? 'bg-emerald-50 border border-emerald-100 text-emerald-800' : 'bg-red-50 border border-red-100 text-red-800'
                        }`}>
                          {translations[language].score || 'Score'}: {crop.healthScore || 85}%
                        </div>
                      </div>
                      
                      <p className="text-[10px] text-slate-500 mt-3 flex items-center space-x-1 font-medium">
                        <Activity className="h-3 w-3 text-emerald-600" />
                        <span>{translations[language].planted_date}: {crop.plantedDate || (translations[language].no_data || 'No Data')}</span>
                      </p>
                    </div>

                    <button
                      onClick={() => onNavigate('passport')}
                      className="text-[10px] font-bold text-emerald-600 mt-4 flex items-center justify-end space-x-1 hover:underline"
                    >
                      <span>{translations[language].health_timeline}</span>
                      <ChevronRight className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Crop Health & Growth Line Chart Card */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div>
                <h3 className="text-base font-extrabold text-slate-900 flex items-center space-x-1.5">
                  <TrendingUp className="h-5 w-5 text-emerald-600" />
                  <span>{translations[language].chart_title}</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">{translations[language].chart_subtitle}</p>
              </div>

              <div className="flex items-center space-x-2">
                {crops.length > 0 && (
                  <select
                    value={selectedTrendCropId}
                    onChange={(e) => setSelectedTrendCropId(e.target.value)}
                    className="border border-slate-200 rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:border-emerald-500 bg-white font-semibold text-slate-700"
                  >
                    {crops.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.variety || (translations[language].hybrid || 'Hybrid')})
                      </option>
                    ))}
                  </select>
                )}
                
                <button
                  onClick={handleExportChartData}
                  className="p-1.5 border dark:border-slate-800 dark:bg-slate-900 hover:bg-gray-50 text-slate-705 dark:text-slate-350 rounded-xl transition-all cursor-pointer flex items-center justify-center shadow-sm"
                  title={translations[language].export_chart_data || 'Export Chart Data'}
                >
                  <Download className="h-4 w-4 text-emerald-605" />
                </button>
              </div>
            </div>

            <div className="h-72 w-full text-xs font-medium">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={trendData}
                  margin={{ top: 5, right: 10, left: -10, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="name" 
                    stroke="#64748b" 
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis 
                    stroke="#64748b" 
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                    domain={[0, 100]}
                    tickFormatter={(value) => `${value}%`}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#ffffff', 
                      borderColor: '#e2e8f0',
                      borderRadius: '16px',
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05)',
                      fontFamily: 'Inter, sans-serif'
                    }}
                    formatter={(value: any, name: any) => [
                      `${value}%`,
                      name === 'health' ? (translations[language].chart_health || 'Health') : (translations[language].chart_growth || 'Growth')
                    ]}
                  />
                  <Legend 
                    verticalAlign="top" 
                    height={36}
                    iconType="circle"
                    iconSize={8}
                    formatter={(value) => (
                      <span className="text-xs text-slate-650 font-bold font-sans">
                        {value === 'health' ? translations[language].chart_health_score : translations[language].chart_growth_progress}
                      </span>
                    )}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="health" 
                    stroke="#10b981" 
                    strokeWidth={3} 
                    dot={{ r: 4, stroke: '#10b981', strokeWidth: 1, fill: '#fff' }}
                    activeDot={{ r: 6, strokeWidth: 0 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="growth" 
                    stroke="#3b82f6" 
                    strokeWidth={3} 
                    dot={{ r: 4, stroke: '#3b82f6', strokeWidth: 1, fill: '#fff' }}
                    activeDot={{ r: 6, strokeWidth: 0 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            
            <div className="mt-4 flex items-center space-x-2 bg-slate-50/80 p-3 rounded-2xl border border-slate-100 text-xs text-slate-600">
              <Info className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>
                {activeTrendCrop 
                  ? (trendSummaryTemplates[language] ? trendSummaryTemplates[language](activeTrendCrop.name, activeTrendCrop.healthScore) : `According to the latest scan, "${activeTrendCrop.name}" is growing in good condition with a health score of ${activeTrendCrop.healthScore}%.`)
                  : translations[language].chart_info_demo
                }
              </span>
            </div>
          </div>

          {/* Recent Uploads log */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-base font-extrabold text-slate-900">{translations[language].recent_detections}</h3>
              {history.length > 0 && (
                <button
                  onClick={handleExportHistory}
                  className="px-3 py-1.5 border dark:border-slate-800 dark:bg-slate-900 hover:bg-gray-50 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-xl transition-all flex items-center space-x-1 cursor-pointer"
                  title={translations[language].export_history || 'Export Crop History'}
                >
                  <Download className="h-3.5 w-3.5 text-emerald-600" />
                  <span>{translations[language].export_csv || 'Export CSV'}</span>
                </button>
              )}
            </div>
            
            {history.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-6">{translations[language].no_recent_detections}</p>
            ) : (
              <div className="divide-y divide-slate-100">
                {history.filter(Boolean).slice(0, 3).map((record) => (
                  <div key={record.id} className="py-3 flex justify-between items-center first:pt-0 last:pb-0">
                    <div className="flex items-center space-x-3">
                      <img 
                        src={record.imageUrl} 
                        alt="Leaf" 
                        className="h-11 w-11 object-cover rounded-xl border border-slate-200"
                        referrerPolicy="no-referrer"
                      />
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm flex items-center gap-1.5 flex-wrap">
                          <span>{record.diseaseName}</span>
                          {(record.id?.startsWith('dh_offline_') || !navigator.onLine) && (
                            <span className="bg-amber-100 dark:bg-amber-950/40 text-amber-850 dark:text-amber-400 border border-amber-200/50 dark:border-amber-800/50 text-[8px] font-extrabold px-1.5 py-0.5 rounded-full uppercase scale-90">
                              {translations[language].cached || 'Cached'}
                            </span>
                          )}
                        </h4>
                        <p className="text-[10px] text-slate-500 font-medium">{(cropLabel[language] || 'Crop')}: {record.cropName} • {translations[language].accuracy}: {Math.floor((record.confidence || 0.95) * 100)}%</p>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <span className={`inline-block px-2.5 py-0.5 text-[9px] font-bold rounded-full ${
                        record.severity === 'Severe' || record.severity === 'High' ? 'bg-red-50 border border-red-100 text-red-800' : 'bg-emerald-50 border border-emerald-100 text-emerald-800'
                      }`}>
                        {record.severity}
                      </span>
                      <p className="text-[9px] text-slate-400 mt-1 font-mono font-medium">{record.createdAt ? new Date(record.createdAt).toLocaleDateString() : (translations[language].demo_date || 'Demo')}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Right Col: PDF Report, Notification center & Govt Scheme quick links */}
        <div className="space-y-6">

          {/* PDF Report Generator Widget */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
            <h3 className="text-base font-extrabold text-slate-900 flex items-center space-x-2">
              <FileText className="h-5 w-5 text-emerald-600" />
              <span>{translations[language].report_title}</span>
            </h3>
            <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
              {translations[language].report_desc}
            </p>
            
            <div className="mt-4 space-y-3">
              <div>
                <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider font-mono mb-1">
                  {translations[language].report_farm_selector}
                </label>
                <select
                  value={selectedFarm}
                  onChange={(e) => setSelectedFarm(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-emerald-500 bg-slate-50 font-semibold text-slate-700 cursor-pointer"
                >
                  <option value="All">{translations[language].all_farms}</option>
                  {uniqueFarms.map((farm, idx) => (
                    <option key={idx} value={farm}>{farm}</option>
                  ))}
                </select>
              </div>

              <button
                onClick={() => {
                  try {
                    generateFarmReport(selectedFarm, user, crops, history, language);
                  } catch (err) {
                    console.error("PDF generation failed:", err);
                    alert(pdfFailedMsg[language] || "Failed to generate PDF Report");
                  }
                }}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1.5 shadow-md shadow-emerald-100 cursor-pointer"
              >
                <Download className="h-4 w-4" />
                <span>{translations[language].report_download_btn}</span>
              </button>
            </div>
          </div>
          
          {/* Live Notification Center */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-base font-bold text-slate-900 flex items-center space-x-1.5">
                <Bell className="h-5 w-5 text-emerald-600" />
                <span>{translations[language].notification_center}</span>
              </h3>
              {unreadNotifications.length > 0 && (
                <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full font-mono">
                  {unreadNotifications.length} {translations[language].new || 'New'}
                </span>
              )}
            </div>

            {notifications.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-10">{translations[language].no_notifications}</p>
            ) : (
              <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                {notifications.map((notif) => (
                  <div 
                    key={notif.id} 
                    className={`p-3 rounded-2xl border transition-all relative ${
                      notif.isRead 
                        ? 'bg-slate-50/50 border-slate-200/60 text-slate-500' 
                        : 'bg-emerald-50/20 border-emerald-100/60 text-slate-800 shadow-sm'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <h4 className="font-bold text-xs">{notif.title}</h4>
                      {!notif.isRead && (
                        <button 
                          onClick={() => onMarkNotificationRead(notif.id)}
                          className="text-[10px] text-emerald-700 hover:text-emerald-800 font-bold p-0.5 bg-emerald-50 rounded-lg"
                          title="Mark Read"
                        >
                          <Check className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                    <p className="text-[11px] mt-1 leading-relaxed">{notif.message}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Govt Schemes Quick Links card */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-950 text-white rounded-3xl p-6 shadow-xl border border-slate-800 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-[0.03] text-emerald-500">
              <Award className="h-32 w-32" />
            </div>
            
            <div className="flex items-center space-x-2">
              <Award className="h-5 w-5 text-emerald-400" />
              <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase font-mono">
                {translations[language].schemes || 'Govt Schemes'}
              </span>
            </div>
            
            <h4 className="text-lg font-bold mt-2 font-sans">{translations[language].schemes_title || 'Agricultural Subsidies & Schemes'}</h4>
            
            <div className="mt-4 space-y-3 max-h-60 overflow-y-auto pr-1">
              {schemes.slice(0, 3).map((scheme) => (
                <div key={scheme.id} className="p-3 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all">
                  <div className="flex justify-between items-start gap-1">
                    <h5 className="font-bold text-xs text-slate-100 leading-snug">{scheme.name}</h5>
                    <span className="shrink-0 bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-[8px] font-bold px-1.5 py-0.5 rounded-full uppercase">
                      {scheme.category}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-350 mt-1 line-clamp-2">{scheme.description}</p>
                </div>
              ))}
            </div>
            
            <button
              onClick={() => onNavigate('schemes')}
              className="mt-4 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-lg shadow-emerald-950/40 transition-all flex items-center justify-center space-x-1.5 cursor-pointer w-full"
              id="dashboard-schemes-btn"
            >
              <span>{translations[language].explore_schemes_btn || 'Explore All Schemes'}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

        </div>

      </div>

      <ProTipsModal
        isOpen={isProTipsOpen}
        onClose={() => setIsProTipsOpen(false)}
        crops={crops}
        language={language}
        onNavigateToPassport={() => onNavigate('passport')}
      />

    </div>
  );
}
