import React from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { X, Sprout, CloudRain, ShieldCheck, Sparkles, AlertTriangle, Lightbulb, Check, Droplets } from 'lucide-react';
import { Crop } from '../types';

import { Language } from '../lib/translations';

interface ProTipsModalProps {
  isOpen: boolean;
  onClose: () => void;
  crops: Crop[];
  language: Language;
  onNavigateToPassport: () => void;
}

export default function ProTipsModal({
  isOpen,
  onClose,
  crops,
  language,
  onNavigateToPassport
}: ProTipsModalProps) {
  const isTamil = language === 'ta';

  // Extract unique crops registered by the user
  const uniqueCropNames = Array.from(new Set(crops.map(c => c.name.toLowerCase())));

  // High-quality crop-specific advice database for Kharif/July Season (Southwest Monsoon)
  const cropTips = [
    {
      keys: ['paddy', 'நெல்', 'rice'],
      cropNameEn: 'Paddy (நெல்)',
      cropNameTa: 'நெல் (Paddy)',
      tips: [
        {
          titleEn: 'Prevent Blast Disease (Fungal)',
          titleTa: 'குலை நோய் தடுப்பு (பூஞ்சை)',
          descEn: 'With monsoon showers and high humidity (>80%), Paddy is highly susceptible to Blast. Spray Pseudomonas fluorescens (organic, 10g/L) or Tricyclazole (chemical, 1g/L) during active tillering.',
          descTa: 'பருவமழை மற்றும் அதிக ஈரப்பதம் (80% மேல்) இருப்பதால், நெல் பயிரில் குலை நோய் தாக்கலாம். தூர் கட்டும் பருவத்தில் சூடோமோனாஸ் (இயற்கை, 10 கிராம்/லிட்டர்) அல்லது ட்ரைசைக்ளசோல் (இரசாயனம், 1 கிராம்/லிட்டர்) தெளிக்கவும்.',
          organic: true,
          level: 'High'
        },
        {
          titleEn: 'Water Level Management',
          titleTa: 'நீர் தேங்குதல் மேலாண்மை',
          descEn: 'Maintain 2-5 cm of standing water during active growth stages, but ensure proper drainage to prevent root rot during heavy flash downpours in July.',
          descTa: 'பயிர் வளர்ச்சி காலத்தில் 2-5 செ.மீ நீர் இருக்குமாறு பராமரிக்கவும். எனினும், ஜூலை மாத கனமழையின் போது வேர் அழுகலைத் தடுக்க வடிகால் வசதியை உறுதி செய்யவும்.',
          organic: true,
          level: 'Medium'
        },
        {
          titleEn: 'Nitrogen Top-Dressing Splitting',
          titleTa: 'தழைச்சத்து பிரித்து இடுதல்',
          descEn: 'Do not apply entire Nitrogen (Urea) at once. Split the application into three doses: Basal, Tillering, and Panicle Initiation. Excessive nitrogen increases fungal risk.',
          descTa: 'முழு யூரியாவையும் ஒரே நேரத்தில் இட வேண்டாம். அடி உரம், தூர் கட்டும் பருவம் மற்றும் கதிர் உருவாகும் தருணங்களில் பிரித்து இடவும். அதிக நைட்ரஜன் பூஞ்சை அபாயத்தை அதிகரிக்கும்.',
          organic: false,
          level: 'Medium'
        }
      ]
    },
    {
      keys: ['tomato', 'தக்காளி'],
      cropNameEn: 'Tomato (தக்காளி)',
      cropNameTa: 'தக்காளி (Tomato)',
      tips: [
        {
          titleEn: 'Control Early Blight',
          titleTa: 'இலைக்கருகல் நோய் கட்டுப்பாடு',
          descEn: 'High humidity causes black targets on lower leaves (Early Blight). Staking tomato plants to keep foliage off wet soil. Spray Copper Oxychloride (2g/L) or Bordeaux mixture.',
          descTa: 'அதிக ஈரப்பதத்தால் கீழ் இலைகளில் கருமையான வட்ட புள்ளிகள் (இலைக்கருகல்) ஏற்படும். செடிகளை குச்சிகள் மூலம் கட்டி தக்காளி இலைகள் ஈர மண்ணில் படாமல் காக்கவும். போர்டோ கலவை அல்லது காப்பர் ஆக்ஸிகுளோரைடு தெளிக்கவும்.',
          organic: false,
          level: 'High'
        },
        {
          titleEn: 'Raised Bed Drainage',
          titleTa: 'மேட்டுப்பாத்தி வடிகால்',
          descEn: 'Always plant on raised beds during July monsoon. Waterlogged soils trigger bacterial wilt, which causes tomato plants to collapse within 24 hours.',
          descTa: 'ஜூலை பருவமழையின் போது எப்போதும் மேட்டுப்பாத்திகளில் நடவு செய்யவும். தேங்கும் நீர் பாக்டீரியா வாடல் நோயை ஊக்குவித்து தக்காளி செடிகளை 24 மணி நேரத்திற்குள் வாடச் செய்யும்.',
          organic: true,
          level: 'High'
        }
      ]
    },
    {
      keys: ['maize', 'சோளம்', 'corn'],
      cropNameEn: 'Maize (சோளம்)',
      cropNameTa: 'சோளம் (Maize)',
      tips: [
        {
          titleEn: 'Fall Armyworm Defense',
          titleTa: 'படைப்புழு தாக்குதல் தடுப்பு',
          descEn: 'Inspect the central whorl of young maize plants for Fall Armyworm damage. Apply Metarhizium anisopliae bio-pesticide or spray Spinetoram 11.7 SC for effective control.',
          descTa: 'இளம் சோளப் பயிர்களின் குருத்துப் பகுதியில் படைப்புழு தாக்குதல் உள்ளதா என ஆராயவும். மெட்டாரைசியம் உயிரி பூச்சிக்கொல்லி அல்லது ஸ்பைனெடோரம் 11.7 SC மருந்தை குருத்துகளில் தெளிக்கவும்.',
          organic: false,
          level: 'High'
        },
        {
          titleEn: 'Zinc Deficiency Correction',
          titleTa: 'துத்தநாகக் குறைபாடு நீக்கம்',
          descEn: 'Maize commonly shows broad white stripes along leaf veins due to zinc deficiency in monsoon soils. Spray Zinc Sulphate (0.5%) mixed with urea.',
          descTa: 'மழைக்கால மண்ணில் துத்தநாகக் குறைபாட்டால் சோள இலைகளில் நரம்புகளுக்கு இடையே வெள்ளை வரிகள் தோன்றும். 0.5% ஜிங்க் சல்பேட் கரைசலை தெளிக்கவும்.',
          organic: true,
          level: 'Medium'
        }
      ]
    },
    {
      keys: ['cotton', 'பருத்தி'],
      cropNameEn: 'Cotton (பருத்தி)',
      cropNameTa: 'பருத்தி (Cotton)',
      tips: [
        {
          titleEn: 'Bollworm Monitoring',
          titleTa: 'காய்ப்புழுக்களைக் கண்காணித்தல்',
          descEn: 'Install pheromone traps (5 traps per acre) to monitor Helicoverpa bollworm moths. Spray Neem Seed Kernel Extract (5% NSKE) on young buds to repel egg-laying.',
          descTa: 'காய்ப்புழுக்களைக் கண்காணிக்க ஏக்கருக்கு 5 இனக்கவர் பொறிகளை அமைக்கவும். இளம் மொட்டுகளில் தாய் அந்துப்பூச்சிகள் முட்டையிடுவதைத் தடுக்க 5% வேப்பங்கொட்டை சாற்றைத் தெளிக்கவும்.',
          organic: true,
          level: 'High'
        }
      ]
    }
  ];

  // General seasonal Kharif advice when no crop specific matches or to display as general tab
  const generalMonsoonTips = [
    {
      titleEn: 'Maintain Drainage Channels',
      titleTa: 'வடிகால் வாய்க்கால்களைப் பராமரித்தல்',
      descEn: 'Clear weeds and soil blocks from primary drainage channels. Standing water for more than 48 hours chokes root respiration for almost all crops except paddy.',
      descTa: 'முதன்மை வடிகால் வாய்க்கால்களில் உள்ள களைகள் மற்றும் மண் அடைப்புகளை அகற்றவும். நெல் தவிர அனைத்துப் பயிர்களிலும் 48 மணி நேரத்திற்கு மேல் தண்ணீர் தேங்கினால் வேர் சுவாசம் பாதிக்கப்பட்டு அழுகும்.',
      categoryEn: 'Water Management',
      categoryTa: 'நீர் மேலாண்மை'
    },
    {
      titleEn: 'Prevent Soil-Borne Fungal Rot',
      titleTa: 'மண்வழிப் பூஞ்சை அழுகல் தடுப்பு',
      descEn: 'Damp soils encourage Pythium and Phytophthora. Drenching the soil around root bases with Trichoderma viride organic formulation (10g/L) establishes a healthy protective barrier.',
      descTa: 'ஈரப்பதமான மண் பூஞ்சை தொற்றை ஊக்குவிக்கும். வேர்ப்பகுதியைச் சுற்றி டிரைக்கோடெர்மா விரிடி உயிரி பூஞ்சைக்கொல்லி (10 கிராம்/லிட்டர்) கரைசலை ஊற்றுவது சிறந்த பாதுகாப்பை அளிக்கும்.',
      categoryEn: 'Disease Protection',
      categoryTa: 'நோய் பாதுகாப்பு'
    },
    {
      titleEn: 'Delay Foliar Sprays on Cloudy Days',
      titleTa: 'மேகமூட்ட நாட்களில் தெளிப்பைத் தவிர்க்கவும்',
      descEn: 'Check the Live Weather tab. If rain is forecast within 4 hours, do not apply any foliar sprays. Rain will wash away expensive products, rendering them useless.',
      descTa: 'நேரடி வானிலைப் பக்கத்தை சரிபார்க்கவும். 4 மணி நேரத்திற்குள் மழை பெய்யும் வாய்ப்பிருந்தால் தெளிப்புகளைத் தவிர்க்கவும். மழை பெய்தால் தெளித்த மருந்துகள் வீணாகிவிடும்.',
      categoryEn: 'Efficiency Tip',
      categoryTa: 'திறன் உத்தி'
    }
  ];

  // Filter tips based on user registered crops
  const matchedCropAdvice = cropTips.filter(cropGroup => 
    cropGroup.keys.some(key => uniqueCropNames.some(uName => uName.includes(key)))
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden" id="pro-tips-slideover">
          <div className="absolute inset-0 overflow-hidden">
            {/* Backdrop opacity fade */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
            />

            {/* Slide-over panel */}
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 220 }}
                className="pointer-events-auto w-screen max-w-md"
              >
                <div className="flex h-full flex-col overflow-y-scroll bg-white dark:bg-slate-950 shadow-2xl border-l border-slate-100 dark:border-slate-800">
                  
                  {/* Header */}
                  <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-5 text-white flex items-center justify-between">
                    <div className="flex items-center space-x-2.5">
                      <div className="p-2 bg-white/10 rounded-xl">
                        <Lightbulb className="h-5 w-5 text-amber-300 animate-pulse" />
                      </div>
                      <div>
                        <h2 className="text-lg font-extrabold font-sans">
                          {isTamil ? 'வேளாண் வல்லுநர் ஆலோசனைகள்' : 'Pro-Tips: Seasonal Advice'}
                        </h2>
                        <p className="text-[10px] text-emerald-100 font-bold uppercase tracking-wider font-mono">
                          {isTamil ? 'ஜூலை தென்மேற்கு பருவமழை' : 'July Southwest Monsoon • Kharif'}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={onClose}
                      className="rounded-lg p-1.5 hover:bg-white/10 text-white transition-all cursor-pointer"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>

                  {/* Body Content */}
                  <div className="flex-1 px-6 py-6 space-y-6">
                    
                    {/* Season Context Alert Card */}
                    <div className="bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/50 rounded-2xl p-4 flex items-start space-x-3">
                      <CloudRain className="h-5 w-5 text-emerald-600 mt-0.5 shrink-0" />
                      <div>
                        <h4 className="font-extrabold text-emerald-950 dark:text-emerald-400 text-xs uppercase tracking-wider font-mono">
                          {isTamil ? 'தற்போதைய பருவம் (Current Season)' : 'Season Advisory'}
                        </h4>
                        <p className="text-xs text-emerald-800 dark:text-emerald-300/90 mt-1 leading-relaxed">
                          {isTamil 
                            ? 'ஜூலை மாதம் தென்மேற்கு பருவமழையின் உச்சக்கட்டம். அதிக ஈரப்பதம் மற்றும் மேகமூட்டம் நோய்க்கிருமிகளை வேகமாக பரப்பக்கூடும் என்பதால் அதிக எச்சரிக்கையுடன் இருக்கவும்.'
                            : 'July is the peak of Southwest monsoon (Kharif). Excessive soil moisture and relative humidity exceeding 80% accelerate fungal and spore dispersion.'}
                        </p>
                      </div>
                    </div>

                    {/* Matched registered crops advice */}
                    <div>
                      <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest font-mono mb-3">
                        {isTamil ? 'உங்கள் பயிர் சார்ந்த பரிந்துரைகள்' : 'Your Personalized Advisories'}
                      </h3>

                      {matchedCropAdvice.length === 0 ? (
                        <div className="bg-slate-50 dark:bg-slate-900/50 border border-dashed rounded-2xl p-5 text-center">
                          <Sprout className="h-8 w-8 text-slate-350 mx-auto mb-2" />
                          <p className="text-xs text-slate-500 leading-relaxed">
                            {isTamil 
                              ? 'நீங்கள் இன்னும் பயிர்களை பதிவு செய்யவில்லை. உங்கள் பயிருக்கு ஏற்ற ஆலோசனைகளைப் பெற பயிர் கடவுச்சீட்டைப் பயன்படுத்தவும்!' 
                              : 'No matching registered crops found. Use the Crop Passport to register crops and unlock tailor-made recommendations!'}
                          </p>
                          <button
                            onClick={() => {
                              onClose();
                              onNavigateToPassport();
                            }}
                            className="mt-3 text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 rounded-xl transition-all cursor-pointer"
                          >
                            {isTamil ? 'பயிரை பதிவு செய் (Add Crop)' : 'Add First Crop'}
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-5">
                          {matchedCropAdvice.map((group, gIdx) => (
                            <div key={gIdx} className="space-y-3">
                              <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-emerald-100 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-400 border border-emerald-200/50">
                                <Sprout className="h-3 w-3" />
                                <span>{isTamil ? group.cropNameTa : group.cropNameEn}</span>
                              </span>

                              <div className="space-y-3">
                                {group.tips.map((tip, tIdx) => (
                                  <div key={tIdx} className="border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-sm hover:shadow-md transition-shadow relative">
                                    <div className="flex justify-between items-start gap-2">
                                      <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                                        {isTamil ? tip.titleTa : tip.titleEn}
                                      </h4>
                                      <span className={`shrink-0 text-[8px] font-black px-2 py-0.5 rounded-full uppercase ${
                                        tip.level === 'High' ? 'bg-red-50 text-red-700 border border-red-100' : 'bg-yellow-50 text-yellow-700 border border-yellow-100'
                                      }`}>
                                        {tip.level} Risk
                                      </span>
                                    </div>
                                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
                                      {isTamil ? tip.descTa : tip.descEn}
                                    </p>
                                    <div className="mt-3 pt-3 border-t border-slate-50 dark:border-slate-800 flex items-center justify-between text-[10px]">
                                      {tip.organic ? (
                                        <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center space-x-1">
                                          <Sparkles className="h-3.5 w-3.5 text-amber-500 animate-pulse" />
                                          <span>{isTamil ? 'இயற்கை தீர்வு (Organic)' : 'Organic Friendly'}</span>
                                        </span>
                                      ) : (
                                        <span className="text-slate-400 font-semibold">{isTamil ? 'இரசாயன கட்டுப்பாடு' : 'Chemical Control'}</span>
                                      )}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* General Seasonal Advice */}
                    <div>
                      <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest font-mono mb-3">
                        {isTamil ? 'பொதுவான மழைக்கால வழிமுறைகள்' : 'General Monsoon Advisories'}
                      </h3>

                      <div className="space-y-3">
                        {generalMonsoonTips.map((tip, idx) => (
                          <div key={idx} className="bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800/60 p-4 rounded-2xl">
                            <span className="text-[9px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-wider font-mono">
                              {isTamil ? tip.categoryTa : tip.categoryEn}
                            </span>
                            <h4 className="font-bold text-slate-900 dark:text-slate-100 text-xs mt-0.5">
                              {isTamil ? tip.titleTa : tip.titleEn}
                            </h4>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                              {isTamil ? tip.descTa : tip.descEn}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>

                  {/* Footer actions */}
                  <div className="border-t border-slate-100 dark:border-slate-800 px-6 py-4 bg-slate-50 dark:bg-slate-900/40 flex justify-end">
                    <button
                      onClick={onClose}
                      className="px-5 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-950 font-bold rounded-xl text-xs hover:opacity-90 transition-all cursor-pointer shadow-sm"
                    >
                      {isTamil ? 'சரி, புரிந்தது' : 'Got it, Thanks'}
                    </button>
                  </div>

                </div>
              </motion.div>
            </div>

          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
