import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Sprout, LogOut, User as UserIcon, Bell, Menu, X, BarChart2, Globe, Sun, Moon, Wifi, WifiOff, Check, ChevronDown } from 'lucide-react';
import { translations, Language } from '../lib/translations';
import vivasayamLogo from '../assets/images/vivasayam_logo_1784520902395.jpg';
import { motion, AnimatePresence } from 'motion/react';

const languagesList: { code: Language; name: string; nativeName: string; region: string }[] = [
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', region: 'Tamil Nadu' },
  { code: 'en', name: 'English', nativeName: 'English', region: 'Global' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', region: 'India' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', region: 'Andhra/Telangana' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ', region: 'Karnataka' },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം', region: 'Kerala' },
  { code: 'mr', name: 'Marathi', nativeName: 'मராठी', region: 'Maharashtra' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', region: 'West Bengal' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી', region: 'Gujarat' },
  { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', region: 'Punjab' }
];

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  toggleMobileMenu: () => void;
  mobileMenuOpen: boolean;
  unreadCount: number;
  language: Language;
  setLanguage: (lang: Language) => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

export default function Navbar({ 
  activeTab, 
  setActiveTab, 
  toggleMobileMenu, 
  mobileMenuOpen, 
  unreadCount,
  language,
  setLanguage,
  isDarkMode,
  toggleDarkMode
}: NavbarProps) {
  const { user, logout, updateProfile } = useAuth();
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isLangOpen, setIsLangOpen] = useState(false);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleNav = (tab: string) => {
    setActiveTab(tab);
    if (mobileMenuOpen) toggleMobileMenu();
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/90 dark:bg-slate-950/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 shadow-sm shadow-slate-100 dark:shadow-none transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <button 
              onClick={() => handleNav('landing')} 
              className="flex items-center space-x-2 text-slate-900 dark:text-white font-bold text-xl tracking-tight hover:opacity-90 transition-all"
              id="brand-logo-btn"
            >
              <div className="relative h-10 w-10 flex items-center justify-center bg-white dark:bg-slate-900 rounded-xl overflow-hidden shadow-md shadow-emerald-100/50 dark:shadow-none border border-emerald-100 dark:border-slate-800">
                <img 
                  src={vivasayamLogo} 
                  alt="Tamil Vivasayam AI Logo" 
                  className="h-full w-full object-cover" 
                  referrerPolicy="no-referrer"
                />
              </div>
              <span className="font-sans font-extrabold tracking-tight flex flex-col items-start leading-none">
                <span className="text-xs text-emerald-600 font-bold tracking-widest uppercase">
                  {translations[language].brandNamePrefix || 'TAMIL'}
                </span>
                <span className="text-base font-extrabold text-slate-800 dark:text-white mt-0.5">
                  {translations[language].brandName || 'Vivasayam'}{' '}
                  <span className="text-emerald-600">AI</span>
                </span>
              </span>
            </button>
            <div className="relative inline-flex items-center ml-3" id="quick-lang-switcher">
              <button
                onClick={() => setIsLangOpen(!isLangOpen)}
                className="bg-emerald-50 dark:bg-slate-900 hover:bg-emerald-100 dark:hover:bg-slate-800 text-emerald-800 dark:text-emerald-400 border border-emerald-200/60 dark:border-slate-800 font-bold px-3 py-1.5 rounded-full text-xs font-sans flex items-center space-x-1.5 transition-all shadow-sm cursor-pointer focus:outline-none"
                title="Quick Language Switcher"
                id="quick-lang-btn"
              >
                <Globe className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                <span className="font-bold text-[10px] uppercase">
                  {languagesList.find(l => l.code === language)?.nativeName || 'Language'}
                </span>
                <ChevronDown className={`h-3 w-3 text-emerald-600 transition-transform duration-300 ${isLangOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {isLangOpen && (
                  <>
                    <div 
                      className="fixed inset-0 z-40 cursor-default" 
                      onClick={() => setIsLangOpen(false)} 
                      id="lang-switcher-backdrop"
                    />
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.95 }}
                      transition={{ duration: 0.15, ease: 'easeOut' }}
                      className="absolute left-0 top-full mt-2.5 z-50 w-72 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-xl shadow-slate-200/40 dark:shadow-none p-2.5 space-y-1 focus:outline-none"
                      id="lang-switcher-dropdown"
                    >
                      <div className="px-2 py-1.5 mb-1.5 border-b border-slate-100 dark:border-slate-800/60 flex items-center justify-between">
                        <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider font-sans">
                          {language === 'ta' ? 'மொழியைத் தேர்ந்தெடு' : 'Select Language'}
                        </span>
                        <span className="bg-emerald-50 dark:bg-emerald-950/40 text-[9px] text-emerald-700 dark:text-emerald-400 font-mono px-1.5 py-0.5 rounded-md font-bold uppercase">
                          {language}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-1 max-h-[280px] overflow-y-auto pr-0.5 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-800 font-sans">
                        {languagesList.map((langItem) => {
                          const isActive = langItem.code === language;
                          return (
                            <button
                              key={langItem.code}
                              onClick={async () => {
                                setLanguage(langItem.code);
                                setIsLangOpen(false);
                                if (user) {
                                  await updateProfile({ language: langItem.code });
                                }
                              }}
                              className={`w-full text-left p-2 rounded-xl text-xs transition-all flex flex-col justify-between border cursor-pointer ${
                                isActive
                                  ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200/60 dark:border-emerald-800/60 text-emerald-950 dark:text-emerald-300 font-bold'
                                  : 'bg-transparent hover:bg-slate-50 dark:hover:bg-slate-800 border-transparent text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white'
                              }`}
                              title={`${langItem.name} (${langItem.nativeName})`}
                              id={`lang-opt-${langItem.code}`}
                            >
                              <div className="flex items-center justify-between w-full">
                                <span className="font-semibold text-[11px] truncate">{langItem.nativeName}</span>
                                {isActive && (
                                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 dark:bg-emerald-400" />
                                )}
                              </div>
                              <span className="text-[9px] text-slate-400 dark:text-slate-500 mt-0.5 font-sans font-medium truncate">
                                {langItem.name}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
            <div className="hidden">
              <select
                value={language}
                onChange={async (e) => {
                  const val = e.target.value as Language;
                  setLanguage(val);
                  if (user) {
                    await updateProfile({ language: val });
                  }
                }}
                className="bg-emerald-50 dark:bg-slate-800 hover:bg-emerald-100 dark:hover:bg-slate-700 text-emerald-800 dark:text-emerald-400 border border-emerald-200 dark:border-slate-700 font-bold px-2 py-1 pl-7 rounded-full text-[10px] font-sans appearance-none cursor-pointer focus:outline-none transition-all pr-4 text-center"
                title="Language / மொழி"
              >
                <option value="ta">தமிழ்</option>
                <option value="en">English</option>
                <option value="hi">हिन्दी</option>
                <option value="te">తెలుగు</option>
                <option value="kn">ಕನ್ನಡ</option>
                <option value="ml">മലയാളം</option>
                <option value="mr">मराठी</option>
                <option value="bn">বাংলা</option>
                <option value="gu">ગુજરાતી</option>
                <option value="pa">ਪੰਜਾਬੀ</option>
              </select>
            </div>
            
            {/* Dark Mode Toggle Button */}
            <button
              onClick={toggleDarkMode}
              className="ml-3 p-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-amber-400 rounded-full transition-all cursor-pointer shadow-sm border border-slate-200/50 dark:border-slate-700"
              title={isDarkMode ? "Light Mode / பகல்" : "Dark Mode / இரவு"}
            >
              {isDarkMode ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
            </button>

            {/* Visual Connectivity Indicator */}
            <div 
              className={`ml-3 flex items-center space-x-1.5 px-2.5 py-1 rounded-full border text-[10px] font-bold font-sans transition-all duration-300 ${
                isOnline 
                  ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200/60 dark:border-emerald-800/50 text-emerald-700 dark:text-emerald-400' 
                  : 'bg-amber-50 dark:bg-amber-950/30 border-amber-200/60 dark:border-amber-800/50 text-amber-700 dark:text-amber-400 animate-pulse'
              }`}
              title={isOnline ? translations[language].online : translations[language].offline}
              id="connectivity-indicator"
            >
              <span className="relative flex h-2 w-2">
                {isOnline ? (
                  <>
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </>
                ) : (
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500 animate-pulse"></span>
                )}
              </span>
              <span className="hidden sm:inline flex items-center space-x-1">
                {isOnline ? <Wifi className="h-3 w-3" /> : <WifiOff className="h-3 w-3" />}
                <span>{isOnline ? translations[language].online : translations[language].offline}</span>
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1.5">
            {user ? (
              <>
                <button
                  onClick={() => handleNav('dashboard')}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                    activeTab === 'dashboard' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100/80 hover:text-slate-900'
                  }`}
                  id="nav-dashboard-btn"
                >
                  {translations[language].dashboard}
                </button>
                <button
                  onClick={() => handleNav('detect')}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                    activeTab === 'detect' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100/80 hover:text-slate-900'
                  }`}
                  id="nav-detect-btn"
                >
                  {translations[language].diagnostics}
                </button>
                <button
                  onClick={() => handleNav('prediction')}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                    activeTab === 'prediction' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100/80 hover:text-slate-900'
                  }`}
                  id="nav-predict-btn"
                >
                  {translations[language].forecast}
                </button>
                <button
                  onClick={() => handleNav('weather')}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                    activeTab === 'weather' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100/80 hover:text-slate-900'
                  }`}
                  id="nav-weather-btn"
                >
                  {translations[language].weather}
                </button>
                <button
                  onClick={() => handleNav('marketplace')}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                    activeTab === 'marketplace' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100/80 hover:text-slate-900'
                  }`}
                  id="nav-marketplace-btn"
                >
                  {translations[language].marketplace}
                </button>
                <button
                  onClick={() => handleNav('community')}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                    activeTab === 'community' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100/80 hover:text-slate-900'
                  }`}
                  id="nav-community-btn"
                >
                  {translations[language].community}
                </button>
                <button
                  onClick={() => handleNav('schemes')}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                    activeTab === 'schemes' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100/80 hover:text-slate-900'
                  }`}
                  id="nav-schemes-btn"
                >
                  {translations[language].schemes}
                </button>
                <button
                  onClick={() => handleNav('fertilizer')}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                    activeTab === 'fertilizer' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100/80 hover:text-slate-900'
                  }`}
                  id="nav-fertilizer-btn"
                >
                  {translations[language].fertilizer}
                </button>

                {/* MSME Admin Analytics Access */}
                {(user.role === 'msme' || user.role === 'admin') && (
                  <button
                    onClick={() => handleNav('analytics')}
                    className={`flex items-center space-x-1 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                      activeTab === 'analytics' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-100' : 'text-emerald-600 hover:bg-emerald-50'
                    }`}
                    id="nav-analytics-btn"
                  >
                    <BarChart2 className="h-4 w-4" />
                    <span>{translations[language].analytics}</span>
                  </button>
                )}

                {/* Notifications & Profile Icon */}
                <div className="flex items-center ml-2 pl-3 border-l border-slate-200 space-x-2">
                  <button 
                    onClick={() => handleNav('dashboard')} 
                    className="relative p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900 rounded-xl transition-all"
                    id="nav-notifications-btn"
                  >
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                      <span className="absolute top-1.5 right-1.5 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
                    )}
                  </button>

                  <button 
                    onClick={() => handleNav('profile')}
                    className="flex items-center space-x-1.5 p-1 px-3 bg-slate-50 text-slate-700 border border-slate-200 rounded-xl hover:bg-slate-100 transition-all text-xs font-semibold"
                    id="nav-profile-btn"
                  >
                    <UserIcon className="h-4 w-4 text-emerald-600" />
                    <span className="truncate max-w-[80px]">{user.name || (language === 'ta' ? 'விவசாயி' : 'Farmer')}</span>
                  </button>

                  <button
                    onClick={() => logout()}
                    className="p-2 text-slate-500 hover:bg-red-50 hover:text-red-600 rounded-xl transition-all"
                    title={translations[language].logout}
                    id="nav-logout-btn"
                  >
                    <LogOut className="h-5 w-5" />
                  </button>
                </div>
              </>
            ) : (
              <>
                <button
                  onClick={() => handleNav('landing')}
                  className="px-3 py-2 text-slate-600 hover:text-slate-950 text-xs font-semibold"
                  id="nav-home-btn"
                >
                  {language === 'ta' ? 'முகப்பு (Home)' : 'Home'}
                </button>
                <button
                  onClick={() => handleNav('login')}
                  className="px-4 py-2 text-slate-700 hover:bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold transition-all ml-3"
                  id="nav-login-btn"
                >
                  {language === 'ta' ? 'உள்நுழை (Sign In)' : 'Sign In'}
                </button>
                <button
                  onClick={() => handleNav('register')}
                  className="px-4 py-2 bg-emerald-600 text-white hover:bg-emerald-700 shadow-lg shadow-emerald-100 rounded-xl text-xs font-semibold transition-all ml-2"
                  id="nav-register-btn"
                >
                  {language === 'ta' ? 'பதிவு செய் (Register)' : 'Register'}
                </button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center">
            <button
              onClick={toggleMobileMenu}
              className="p-2 text-slate-500 hover:text-emerald-600 hover:bg-slate-50 rounded-xl transition-all focus:outline-none"
              id="mobile-menu-toggle-btn"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-3 pt-2 pb-4 space-y-1 animate-fade-in">
          {user ? (
            <>
              <button
                onClick={() => handleNav('dashboard')}
                className="w-full text-left block px-3 py-2 rounded-xl text-sm font-semibold hover:bg-slate-50 hover:text-emerald-600"
              >
                {translations[language].dashboard}
              </button>
              <button
                onClick={() => handleNav('detect')}
                className="w-full text-left block px-3 py-2 rounded-xl text-sm font-semibold hover:bg-slate-50 hover:text-emerald-600"
              >
                {translations[language].diagnostics}
              </button>
              <button
                onClick={() => handleNav('prediction')}
                className="w-full text-left block px-3 py-2 rounded-xl text-sm font-semibold hover:bg-slate-50 hover:text-emerald-600"
              >
                {translations[language].forecast}
              </button>
              <button
                onClick={() => handleNav('weather')}
                className="w-full text-left block px-3 py-2 rounded-xl text-sm font-semibold hover:bg-slate-50 hover:text-emerald-600"
              >
                {translations[language].weather}
              </button>
              <button
                onClick={() => handleNav('marketplace')}
                className="w-full text-left block px-3 py-2 rounded-xl text-sm font-semibold hover:bg-slate-50 hover:text-emerald-600"
              >
                {translations[language].marketplace}
              </button>
              <button
                onClick={() => handleNav('community')}
                className="w-full text-left block px-3 py-2 rounded-xl text-sm font-semibold hover:bg-slate-50 hover:text-emerald-600"
              >
                {translations[language].community}
              </button>
              <button
                onClick={() => handleNav('schemes')}
                className="w-full text-left block px-3 py-2 rounded-xl text-sm font-semibold hover:bg-slate-50 hover:text-emerald-600"
              >
                {translations[language].schemes}
              </button>
              <button
                onClick={() => handleNav('fertilizer')}
                className="w-full text-left block px-3 py-2 rounded-xl text-sm font-semibold hover:bg-slate-50 hover:text-emerald-600"
              >
                {translations[language].fertilizer}
              </button>
              
              {(user.role === 'msme' || user.role === 'admin') && (
                <button
                  onClick={() => handleNav('analytics')}
                  className="w-full text-left block px-3 py-2 rounded-xl text-sm font-bold text-emerald-600 hover:bg-emerald-50"
                >
                  {translations[language].analytics}
                </button>
              )}

              <div className="border-t border-slate-200 pt-3 mt-3 flex items-center justify-between px-3">
                <button
                  onClick={() => handleNav('profile')}
                  className="flex items-center space-x-2 text-slate-700 font-semibold text-sm"
                >
                  <UserIcon className="h-5 w-5 text-emerald-600" />
                  <span>{user.name || (language === 'ta' ? 'விவரம்' : 'Profile')}</span>
                </button>
                <button
                  onClick={() => logout()}
                  className="flex items-center space-x-2 text-red-600 font-semibold text-sm"
                >
                  <LogOut className="h-5 w-5" />
                  <span>{translations[language].logout}</span>
                </button>
              </div>
            </>
          ) : (
            <>
              <button
                onClick={() => handleNav('landing')}
                className="w-full text-left block px-3 py-2 rounded-xl text-sm font-semibold hover:bg-slate-50"
              >
                {language === 'ta' ? 'முகப்பு (Home)' : 'Home'}
              </button>
              <button
                onClick={() => handleNav('login')}
                className="w-full text-left block px-3 py-2 rounded-xl text-sm font-semibold hover:bg-slate-50 text-emerald-600"
              >
                {language === 'ta' ? 'உள்நுழை (Sign In)' : 'Sign In'}
              </button>
              <button
                onClick={() => handleNav('register')}
                className="w-full text-left block px-3 py-3 rounded-xl text-sm font-semibold bg-emerald-600 text-white text-center mt-2 shadow-lg shadow-emerald-100"
              >
                {language === 'ta' ? 'பதிவு செய் (Register)' : 'Register'}
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
