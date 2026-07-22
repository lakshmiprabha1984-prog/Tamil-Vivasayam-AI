import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AIChatbot from './components/AIChatbot';
import VoiceCommandListener from './components/VoiceCommandListener';
import LandingPage from './components/LandingPage';
import AuthPages from './components/AuthPages';
import Dashboard from './components/Dashboard';
import Diagnostics from './components/Diagnostics';
import Predictions from './components/Predictions';
import CropPassport from './components/CropPassport';
import WeatherDashboard from './components/WeatherDashboard';
import Marketplace from './components/Marketplace';
import Schemes from './components/Schemes';
import MSMEAnalytics from './components/MSMEAnalytics';
import Community from './components/Community';
import FertilizerCalculator from './components/FertilizerCalculator';

import { Crop, DiseaseHistory, Notification, WeatherData, OutbreakPrediction } from './types';
import {
  initialSchemes,
  initialDealers,
  initialWeatherData,
  sampleCrops,
  sampleDiseaseHistory
} from './lib/mockData';

import { indianStates } from './lib/regions';
import { generateWeatherForDistrict, generateSchemesForState, generateDealersForDistrict } from './lib/regionsHelper';

import { translations, Language } from './lib/translations';

import { Sprout, Phone, Mail, User as UserIcon, Loader, ShieldCheck, MapPin, Bell, Globe, WifiOff, RefreshCw } from 'lucide-react';

type SupportedLanguage = keyof typeof translations;

function generateLocalSchedules(cropsList: Crop[], lang: SupportedLanguage): Notification[] {
  const list: Notification[] = [
    {
      id: 'n1',
      userId: 'demo',
      title: lang === 'ta' ? 'குலை நோய் எச்சரிக்கை (Blast Alert) 🚨' : 'Blast Disease Alert 🚨',
      message: lang === 'ta'
        ? 'தஞ்சாவூரில் தக்காளி மற்றும் நெல் பயிர்களுக்கு சாதகமான மேகமூட்ட காலநிலை நிலவுவதால் பூஞ்சை தொற்றுக்கான வாய்ப்பு அதிகம்.'
        : 'Favored cloudy weather in Thanjavur increases the risk of Blast disease in paddy and tomatoes.',
      type: 'disease',
      isRead: false,
      createdAt: new Date().toISOString()
    },
    {
      id: 'n2',
      userId: 'demo',
      title: lang === 'ta' ? 'அரசு மானியம் (TN Subsidy) 🌾' : 'Govt Subsidy Alert 🌾',
      message: lang === 'ta'
        ? 'சொட்டுநீர் பாசனத்திற்கான புதிய 100% மானியம் தோட்டக்கலைத் துறையினரால் அறிவிக்கப்பட்டுள்ளது.'
        : 'A new 100% subsidy for drip irrigation has been announced by the Department of Horticulture.',
      type: 'scheme',
      isRead: false,
      createdAt: new Date().toISOString()
    }
  ];

  for (const crop of cropsList) {
    if (!crop.plantedDate) continue;

    const planted = new Date(crop.plantedDate);
    // Relative to sample data's dates of May 10, 2026 to align with mock UI date of July 20, 2026
    const today = new Date('2026-07-20');
    planted.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    const diffTime = today.getTime() - planted.getTime();
    const daysSincePlanted = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (daysSincePlanted < 0) continue;

    const nameLower = crop.name.toLowerCase();
    let cropType = 'other';
    if (nameLower.includes('paddy') || nameLower.includes('rice') || nameLower.includes('நெல்')) {
      cropType = 'paddy';
    } else if (nameLower.includes('tomato') || nameLower.includes('தக்காளி')) {
      cropType = 'tomato';
    }

    if (cropType === 'paddy') {
      if (daysSincePlanted >= 70 && daysSincePlanted <= 73) {
        list.push({
          id: `demo_${crop.id}_day70_irrigation`,
          userId: 'demo',
          title: lang === 'ta' ? 'நெல் - பூக்கும் பருவ பாசனம் 🌊' : 'Paddy - Heading Stage Irrigation 🌊',
          message: lang === 'ta'
            ? `உங்கள் '${crop.name}' கதிர் வெளிவரும் பருவம் எட்டியுள்ளது. பூக்கும் பருவத்தில் வறட்சி ஏற்படாமல் நீர் பாய்ச்சவும்.`
            : `Your '${crop.name}' has reached heading/flowering stage. Avoid any water stress to prevent chaffy grains.`,
          type: 'weather',
          isRead: false,
          createdAt: new Date().toISOString()
        });
        list.push({
          id: `demo_${crop.id}_day70_fertilizer`,
          userId: 'demo',
          title: lang === 'ta' ? 'நெல் - கதிர் பருவ உரம் 🌾' : 'Paddy - Heading Fertilizer 🌾',
          message: lang === 'ta'
            ? `உங்கள் '${crop.name}' பயிருக்கு நடவு செய்த 70 நாட்களில் மீதமுள்ள 25% தழைச்சத்து (N) மேல் உரமாக இடவும்.`
            : `For your '${crop.name}' crop, apply the remaining 25% Nitrogen (N) split dose at 70-75 days.`,
          type: 'scheme',
          isRead: false,
          createdAt: new Date().toISOString()
        });
      }
    } else if (cropType === 'tomato') {
      list.push({
        id: `demo_${crop.id}_day48_irrigation`,
        userId: 'demo',
        title: lang === 'ta' ? 'பாசன நினைவூட்டல் 🌊' : 'Irrigation Reminder 🌊',
        message: lang === 'ta'
          ? `உங்கள் '${crop.name}' வழக்கமான பாசன சுழற்சி (ஒவ்வொரு 4 நாட்களுக்கு). மண் ஈரப்பதத்தை சரிபார்த்து நீர் பாய்ச்சவும்.`
          : `Your '${crop.name}' is due for regular irrigation (every 4 days). Check soil moisture and irrigate.`,
        type: 'weather',
        isRead: false,
        createdAt: new Date().toISOString()
      });
    }
  }

  return list;
}

function AppContent() {
  const { user, token, loading, updateProfile } = useAuth();
  const { i18n } = useTranslation();
  const supportedLanguageKeys = Object.keys(translations) as SupportedLanguage[];

  const [language, setLanguageState] = useState<SupportedLanguage>(() => {
    const savedLang = localStorage.getItem('language');
    return savedLang && supportedLanguageKeys.includes(savedLang as SupportedLanguage)
      ? (savedLang as SupportedLanguage)
      : 'en';
  });

  const translation = translations[language];

  const setLanguage = (lang: SupportedLanguage) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
    i18n.changeLanguage(lang);
  };
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isSyncing, setIsSyncing] = useState(false);
  const [activeTab, setActiveTab] = useState('landing');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleOnline = async () => {
      setIsOnline(true);
      await syncOfflineData();
    };
    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [token]);

  const syncOfflineData = async () => {
    if (!token) return;
    setIsSyncing(true);
    try {
      // Re-fetch latest crops
      const cropsRes = await fetch('/api/crops', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const cropsData = await cropsRes.json();
      if (Array.isArray(cropsData)) {
        setCrops(cropsData);
      }

      // Re-fetch latest history
      const historyRes = await fetch('/api/diseases', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const historyData = await historyRes.json();
      if (Array.isArray(historyData)) {
        setHistory(historyData);
      }
    } catch (e) {
      console.warn('Sync failed:', e);
    } finally {
      setIsSyncing(false);
    }
  };

  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('theme') === 'dark';
  });

  const toggleDarkMode = () => {
    setIsDarkMode(prev => {
      const next = !prev;
      localStorage.setItem('theme', next ? 'dark' : 'light');
      return next;
    });
  };

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Sync language selection with user preference if available
  useEffect(() => {
    if (user?.language) {
      setLanguage(user.language);
    }
  }, [user]);

  // Application Global States
  const [crops, setCrops] = useState<Crop[]>([]);
  const [history, setHistory] = useState<DiseaseHistory[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // State and District selector states
  const [selectedStateId, setSelectedStateId] = useState('tamil_nadu');
  const [selectedDistrictId, setSelectedDistrictId] = useState('thanjavur');

  const [weather, setWeather] = useState<WeatherData>(initialWeatherData);
  const [dealers, setDealers] = useState(initialDealers);
  const [schemes, setSchemes] = useState(initialSchemes);

  // Sync state & district from user profile if available
  useEffect(() => {
    if (user?.district) {
      const matchedState = indianStates.find(s =>
        s.districts.some(d => d.nameEn.toLowerCase() === user.district?.toLowerCase())
      );
      if (matchedState) {
        setSelectedStateId(matchedState.id);
        const matchedDist = matchedState.districts.find(d => d.nameEn.toLowerCase() === user.district?.toLowerCase());
        if (matchedDist) {
          setSelectedDistrictId(matchedDist.id);
        }
      }
    }
  }, [user]);

  // Keep weather, schemes, and dealers synced with selected state & district
  useEffect(() => {
    const currentState = indianStates.find(s => s.id === selectedStateId);
    if (currentState) {
      const currentDistrict = currentState.districts.find(d => d.id === selectedDistrictId);
      if (currentDistrict) {
        const updatedWeather = generateWeatherForDistrict(currentDistrict, currentState.nameEn, language);
        setWeather(updatedWeather);

        const updatedSchemes = generateSchemesForState(selectedStateId, language);
        setSchemes(updatedSchemes);

        const updatedDealers = generateDealersForDistrict(currentDistrict, currentState.nameEn, language);
        setDealers(updatedDealers);
      }
    }
  }, [selectedStateId, selectedDistrictId, language]);

  // Load User Data if token is available
  useEffect(() => {
    if (token) {
      // Synchronize crops
      fetch('/api/crops', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) {
            setCrops(data);
          } else {
            setCrops(sampleCrops);
          }
        })
        .catch(() => setCrops(sampleCrops));

      // Synchronize histories
      fetch('/api/diseases', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) {
            setHistory(data);
          } else {
            setHistory(sampleDiseaseHistory);
          }
        })
        .catch(() => setHistory(sampleDiseaseHistory));
    } else {
      // Unauthenticated state / Demo mode fallback
      setCrops(sampleCrops);
      setHistory(sampleDiseaseHistory);
    }
  }, [token]);

  // Synchronize dynamic Alerts/Notifications based on crops and language
  useEffect(() => {
    if (token) {
      fetch('/api/notifications', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) {
            setNotifications(data);
          } else {
            setNotifications(generateLocalSchedules(crops, language));
          }
        })
        .catch(() => setNotifications(generateLocalSchedules(crops, language)));
    } else {
      setNotifications(generateLocalSchedules(crops.length > 0 ? crops : sampleCrops, language));
    }
  }, [token, crops, language]);

  // Navigate on session changes
  useEffect(() => {
    if (user) {
      setActiveTab('dashboard');
    } else {
      setActiveTab('landing');
    }
  }, [user]);

  // Mark notification read
  const handleMarkNotificationRead = async (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));

    if (token) {
      try {
        await fetch(`/api/notifications/${id}/read`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
      } catch (err) {
        console.error('Failed to update read status on server:', err);
      }
    }
  };

  // 1. Submit leaf diagnosis to backend server (Real Integration)
  const handleDetectDisease = async (cropName: string, base64Image: string, cropId?: string) => {
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch('/api/diseases/detect', {
      method: 'POST',
      headers,
      body: JSON.stringify({ cropName, image: base64Image, cropId, language })
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Failed to detect leaf disease');
    }

    const historyRecord = data.historyRecord || data;

    // Add to history state locally
    setHistory(prev => [historyRecord, ...prev]);

    // Auto-generate notification alert for high severity
    if (historyRecord && (historyRecord.severity === 'High' || historyRecord.severity === 'Severe')) {
      const newNotif: Notification = {
        id: Math.random().toString(),
        userId: user?.uid || 'guest',
        title: `🚨 ${historyRecord.severity} Alert: ${historyRecord.diseaseName}`,
        message: `பாதிப்பு விகிதம் ${historyRecord.affectedAreaPct}% ஆக உள்ளது. ${historyRecord.organicTreatment} ஐ பயன்படுத்தவும்.`,
        type: 'disease',
        isRead: false
      };
      setNotifications(prev => [newNotif, ...prev]);
    }

    return historyRecord;
  };

  // 2. Submit recovery compare to backend (Real Integration)
  const handleCompareRecovery = async (diseaseHistoryId: string, base64Image: string) => {
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch('/api/recovery/compare', {
      method: 'POST',
      headers,
      body: JSON.stringify({ diseaseHistoryId, image: base64Image })
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Failed to analyze recovery status');
    }

    const monitoringRecord = data.monitoringRecord || data;
    return monitoringRecord;
  };

  // 3. Risk Predictor submit (Real Integration)
  const handleOutbreakPredict = async (params: Partial<OutbreakPrediction>) => {
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch('/api/predictions/risk', {
      method: 'POST',
      headers,
      body: JSON.stringify(params)
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Failed to compute risk forecast');
    }

    return data.prediction;
  };

  // 4. Crop Register submit (Real Integration)
  const handleAddCropSubmit = async (name: string, variety: string, farmName: string, plantedDate: string, location: string) => {
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch('/api/crops', {
      method: 'POST',
      headers,
      body: JSON.stringify({ name, variety, farmName, plantedDate, location })
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Failed to register crop');
    }

    setCrops(prev => [data, ...prev]);
    return data;
  };

  // User Profile fields state
  const [profName, setProfName] = useState(user?.name || '');
  const [profPhone, setProfPhone] = useState(user?.phone || '');
  const [profFarm, setProfFarm] = useState(user?.farmName || '');
  const [profDist, setProfDist] = useState(user?.district || '');
  const [profLanguage, setProfLanguage] = useState<SupportedLanguage>('ta');
  const [profSaving, setProfSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setProfName(user.name || '');
      setProfPhone(user.phone || '');
      setProfFarm(user.farmName || '');
      setProfDist(user.district || '');
      const profileLanguage =
        user.language && supportedLanguageKeys.includes(user.language as SupportedLanguage)
          ? (user.language as SupportedLanguage)
          : 'ta';
      setProfLanguage(profileLanguage);
    }
  }, [user]);

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfSaving(true);
    const success = await updateProfile({
      name: profName,
      phone: profPhone,
      farmName: profFarm,
      district: profDist,
      language: profLanguage as any
    });
    setProfSaving(false);
    if (success) {
      alert('விவரங்கள் வெற்றிகரமாக புதுப்பிக்கப்பட்டன! Profile updated successfully!');
    } else {
      alert('விவரங்களைச் சேமிப்பதில் சிக்கல். Failed to update profile.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center">
        <Loader className="h-10 w-10 text-green-600 animate-spin" />
        <p className="text-sm text-gray-500 mt-4 font-sans">தரவுகள் ஏற்றப்படுகின்றன... Loading Tamil Vivasayam AI...</p>
      </div>
    );
  }

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50/40 dark:bg-slate-900 text-slate-900 dark:text-slate-100 transition-colors duration-200">

      {/* Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        toggleMobileMenu={() => setMobileMenuOpen(!mobileMenuOpen)}
        mobileMenuOpen={mobileMenuOpen}
        unreadCount={unreadCount}
        language={language}
        setLanguage={setLanguage}
        isDarkMode={isDarkMode}
        toggleDarkMode={toggleDarkMode}
      />

      {/* Offline Status Ribbon */}
      {!isOnline && (
        <div className="bg-amber-500 dark:bg-amber-600 text-slate-950 dark:text-white text-center py-2 px-4 flex items-center justify-center space-x-2 text-xs font-bold shadow-inner transition-all duration-300 border-b border-amber-400/50">
          <WifiOff className="h-4 w-4 text-slate-950 dark:text-white animate-pulse" />
          <span>{translation.offline_notice}</span>
          <button
            onClick={syncOfflineData}
            disabled={isSyncing}
            className="ml-3 bg-slate-950/20 hover:bg-slate-950/30 text-slate-950 dark:text-white border border-slate-950/20 dark:border-white/30 px-2 py-1 rounded-full flex items-center space-x-1 transition-all text-[10px] font-black cursor-pointer shadow-sm"
          >
            <RefreshCw className={`h-3 w-3 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{isSyncing ? (language === 'ta' ? 'ஒத்திசைக்கிறது...' : 'Syncing...') : (language === 'ta' ? 'ஒத்திசை' : 'Sync')}</span>
          </button>
        </div>
      )}

      {/* Main Content Pane */}
      <main className="flex-1">

        {/* Global Region Selector bar (Visible when logged in and in active app view) */}
        {user && !['landing', 'login', 'register'].includes(activeTab) && (
          <div className="bg-white dark:bg-slate-900 border-b border-slate-200/80 dark:border-slate-800/80 py-3.5 px-4 sm:px-6 lg:px-8 shadow-xs">
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center space-x-2">
                <div className="p-1.5 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 rounded-lg">
                  <MapPin className="h-4 w-4" />
                </div>
                <div>
                  <h2 className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest font-mono">
                    {language === 'ta' ? 'வேளாண் மண்டலம்' : 'Agricultural Zone'}
                  </h2>
                  <p className="text-xs sm:text-sm font-extrabold text-slate-850 dark:text-slate-200">
                    {language === 'ta' ? 'மாநிலம் & மாவட்டத் தேர்வு' : 'State & District Filter'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <div className="flex-1 sm:flex-initial">
                  <label className="sr-only">State</label>
                  <select
                    value={selectedStateId}
                    onChange={(e) => {
                      const sId = e.target.value;
                      setSelectedStateId(sId);
                      const matchedState = indianStates.find(s => s.id === sId);
                      if (matchedState && matchedState.districts.length > 0) {
                        setSelectedDistrictId(matchedState.districts[0].id);
                      }
                    }}
                    className="w-full bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 text-slate-850 dark:text-slate-200 text-xs font-bold rounded-xl px-3 py-2 focus:outline-none focus:border-emerald-500 cursor-pointer"
                  >
                    {indianStates.map((state) => (
                      <option key={state.id} value={state.id}>
                        {language === 'ta' ? state.nameTa : state.nameEn}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex-1 sm:flex-initial">
                  <label className="sr-only">District</label>
                  <select
                    value={selectedDistrictId}
                    onChange={(e) => setSelectedDistrictId(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 text-slate-850 dark:text-slate-200 text-xs font-bold rounded-xl px-3 py-2 focus:outline-none focus:border-emerald-500 cursor-pointer"
                  >
                    {indianStates
                      .find((s) => s.id === selectedStateId)
                      ?.districts.map((dist) => (
                        <option key={dist.id} value={dist.id}>
                          {language === 'ta' ? dist.nameTa : dist.nameEn}
                        </option>
                      ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* LANDING PAGE */}
        {activeTab === 'landing' && (
          <LandingPage
            onGetStarted={() => setActiveTab(user ? 'dashboard' : 'login')}
            onWatchDemo={() => {
              const el = document.getElementById('demo-video');
              if (el) {
                el.scrollIntoView({ behavior: 'smooth' });
              }
            }}
          />
        )}

        {/* AUTH PAGES */}
        {activeTab === 'login' && (
          <AuthPages
            onSuccess={() => setActiveTab('dashboard')}
            initialMode="login"
          />
        )}
        {activeTab === 'register' && (
          <AuthPages
            onSuccess={() => setActiveTab('dashboard')}
            initialMode="register"
          />
        )}

        {/* FARMER DASHBOARD */}
        {activeTab === 'dashboard' && user && (
          <Dashboard
            user={user}
            crops={crops}
            history={history}
            notifications={notifications}
            weather={weather}
            onNavigate={(tab) => setActiveTab(tab)}
            onMarkNotificationRead={handleMarkNotificationRead}
            onAddCrop={() => setActiveTab('passport')}
            language={language}
            schemes={schemes}
          />
        )}

        {/* DISEASE DETECTION & RECOVERY & XAI */}
        {activeTab === 'detect' && (
          <Diagnostics
            crops={crops}
            history={history}
            onDetect={handleDetectDisease}
            onCompare={handleCompareRecovery}
            token={token}
            language={language}
          />
        )}

        {/* OUTBREAK OUTLINE PREDICTOR */}
        {activeTab === 'prediction' && (
          <Predictions
            onPredict={handleOutbreakPredict}
            globalStateId={selectedStateId}
            globalDistrictId={selectedDistrictId}
            language={language}
          />
        )}

        {/* CROP PASSPORT */}
        {activeTab === 'passport' && (
          <CropPassport
            crops={crops}
            history={history}
            onAddCropSubmit={handleAddCropSubmit}
          />
        )}

        {/* WEATHER CENTER */}
        {activeTab === 'weather' && (
          <WeatherDashboard
            weather={weather}
            language={language}
          />
        )}

        {/* MARKETPLACE CLASSIFIEDS */}
        {activeTab === 'marketplace' && (
          <Marketplace
            dealers={dealers}
            language={language}
          />
        )}

        {/* COMMUNITY FORUM */}
        {activeTab === 'community' && (
          <Community
            language={language}
          />
        )}

        {/* GOVT SUBSIDIES & SCHEMES */}
        {activeTab === 'schemes' && (
          <Schemes
            schemes={schemes}
            language={language}
          />
        )}

        {/* FERTILIZER CALCULATOR */}
        {activeTab === 'fertilizer' && (
          <FertilizerCalculator
            language={language}
          />
        )}

        {/* MSME ANALYTICS */}
        {activeTab === 'analytics' && (
          <MSMEAnalytics />
        )}

        {/* PROFILE SETTINGS PAGE */}
        {activeTab === 'profile' && user && (
          <div className="max-w-md mx-auto my-12 p-8 bg-white border rounded-3xl shadow-xl shadow-gray-50 animate-fade-in">
            <div className="text-center mb-6">
              <span className="p-2.5 bg-green-50 text-green-700 rounded-full inline-block">
                <UserIcon className="h-6 w-6" />
              </span>

              <h3 className="text-lg font-bold text-gray-900 mt-2 font-sans">
                விவரங்கள் திருத்து (Profile Settings)
              </h3>

              <p className="text-xs text-gray-400 mt-0.5">
                உங்கள் பண்ணை விவரங்கள் மற்றும் மொழி விருப்பங்களை மாற்றவும்.
              </p>
            </div>

            <form onSubmit={handleProfileSave} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">{translations[language].full_name}</label>
                <input
                  type="text"
                  required
                  value={profName}
                  onChange={(e) => setProfName(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-green-500 bg-white dark:bg-slate-800 dark:border-slate-700"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">{translation.phone}</label>
                <input
                  type="tel"
                  required
                  value={profPhone}
                  onChange={(e) => setProfPhone(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-green-500 bg-white dark:bg-slate-800 dark:border-slate-700"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">{translation.farm_name}</label>
                <input
                  type="text"
                  value={profFarm}
                  onChange={(e) => setProfFarm(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-green-500 bg-white dark:bg-slate-800 dark:border-slate-700"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">{translation.district}</label>
                  <input
                    type="text"
                    required
                    value={profDist}
                    onChange={(e) => setProfDist(e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:border-green-500 bg-white dark:bg-slate-800 dark:border-slate-700"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">{translation.language_label}</label>
                  <select
                    value={profLanguage}
                    onChange={(e) => setProfLanguage(e.target.value as SupportedLanguage)}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-green-500 bg-white dark:bg-slate-800 dark:border-slate-700"
                  >
                    <option value="ta">தமிழ் (Tamil)</option>
                    <option value="en">English</option>
                    <option value="hi">हिन्दी (Hindi)</option>
                    <option value="te">తెలుగు (Telugu)</option>
                    <option value="kn">ಕನ್ನಡ (Kannada)</option>
                    <option value="ml">മലയാളം (Malayalam)</option>
                    <option value="mr">मराठी (Marathi)</option>
                    <option value="bn">বাংলা (Bengali)</option>
                    <option value="gu">ગુજરાતી (Gujarati)</option>
                    <option value="pa">ਪੰਜਾਬੀ (Punjabi)</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                disabled={profSaving}
                className="w-full py-3 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white font-bold rounded-xl shadow-md transition-all flex items-center justify-center cursor-pointer"
              >
                {profSaving ? <Loader className="h-4 w-4 animate-spin" /> : <span>{translation.update_settings}</span>}
              </button>
            </form>
          </div>
        )}

      </main>

      {/* Floating AI Chatbot is persistent across pages */}
      <AIChatbot language={language} />

      {/* Floating Voice Command Listener */}
      <VoiceCommandListener
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        language={language}
      />

      {/* Footer */}
      <Footer />

    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
