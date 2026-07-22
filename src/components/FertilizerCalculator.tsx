import React, { useState, useMemo } from 'react';
import { 
  Calculator, 
  Sprout, 
  AlertCircle, 
  Info, 
  ShoppingBag, 
  Layers, 
  Calendar, 
  RotateCcw,
  Sparkles,
  Droplet
} from 'lucide-react';
import { Language } from '../lib/translations';

interface FertilizerCalculatorProps {
  language: Language;
}

// Agricultural specifications based on Tamil Nadu Agricultural University (TNAU) guidelines
interface CropFertilizerSpec {
  nameTa: string;
  nameEn: string;
  n: number; // kg per acre
  p: number; // kg per acre
  k: number; // kg per acre
  splitInstructionsTa: string[];
  splitInstructionsEn: string[];
  tipsTa: string[];
  tipsEn: string[];
}

const CROP_SPECS: Record<string, CropFertilizerSpec> = {
  paddy: {
    nameTa: 'நெல் (Paddy)',
    nameEn: 'Paddy / Rice',
    n: 60,
    p: 24,
    k: 24,
    splitInstructionsTa: [
      'அடி உரம் (Basal): நடும் போது 25% தழைச்சத்து (N), முழு சாம்பல் மற்றும் மணிச்சத்து (P & K) இடவும்.',
      'பயிர் தூம்பு கட்டும் பருவம் (Active Tillering): நடவு செய்த 25-30 நாட்களில் 25% தழைச்சத்து (N) இடவும்.',
      'தண்டு உருளும் பருவம் (Panicle Initiation): நடவு செய்த 50-55 நாட்களில் 25% தழைச்சத்து (N) இடவும்.',
      'கதிர் வெளிவரும் பருவம் (Heading Stage): நடவு செய்த 70-75 நாட்களில் மீதமுள்ள 25% தழைச்சத்து (N) இடவும்.'
    ],
    splitInstructionsEn: [
      'Basal Dose: Apply 25% Nitrogen (N), 100% Phosphorus (P), and 100% Potassium (K) during planting.',
      'Active Tillering (25-30 days): Apply 25% Nitrogen (N) split.',
      'Panicle Initiation (50-55 days): Apply 25% Nitrogen (N) split.',
      'Heading Stage (70-75 days): Apply the remaining 25% Nitrogen (N) split.'
    ],
    tipsTa: [
      'நெல் வயலில் எப்போதும் லேசான தண்ணீர் தேங்கி இருக்குமாறு பார்த்துக் கொள்ளவும், உரம் இடுவதற்கு முன் நீரை வடிக்கவும்.',
      'அசோஸ்பைரில்லம் மற்றும் பாஸ்போபாக்டீரியா போன்ற உயிர் உரங்களை உபயோகிப்பது உர செயல்திறனை அதிகரிக்கும்.'
    ],
    tipsEn: [
      'Maintain a shallow water level in rice fields; drain slightly before applying chemical fertilizers.',
      'Incorporate biofertilizers like Azospirillum and Phosphobacteria to enhance nutrient uptake efficiency.'
    ]
  },
  sugarcane: {
    nameTa: 'கரும்பு (Sugarcane)',
    nameEn: 'Sugarcane',
    n: 110,
    p: 40,
    k: 45,
    splitInstructionsTa: [
      'அடி உரம் (Basal): நடவு செய்யும் போது முழு மணிச்சத்து (P) மற்றும் 25% சாம்பல் சத்து (K) இடவும்.',
      '30வது நாள் (Tillering Phase): 30% தழைச்சத்து (N) மற்றும் 25% சாம்பல் சத்து (K) இடவும்.',
      '60வது நாள் (Grand Growth Phase): 35% தழைச்சத்து (N) மற்றும் 25% சாம்பல் சத்து (K) இடவும்.',
      '90வது நாள் (Grand Growth Phase): மீதமுள்ள 35% தழைச்சத்து (N) மற்றும் 25% சாம்பல் சத்து (K) இடவும்.'
    ],
    splitInstructionsEn: [
      'Basal Dose: Apply 100% Phosphorus (P) and 25% Potassium (K) during planting.',
      '30 Days (Tillering Phase): Apply 30% Nitrogen (N) and 25% Potassium (K).',
      '60 Days (Growth Phase): Apply 35% Nitrogen (N) and 25% Potassium (K).',
      '90 Days (Growth Phase): Apply remaining 35% Nitrogen (N) and 25% Potassium (K).'
    ],
    tipsTa: [
      'கரும்புக்கு அதிக அளவு தண்ணீர் தேவை என்பதால் முறையான சொட்டுநீர் பாசனத்தை பரிந்துரைக்கிறோம்.',
      'உரம் இட்ட பின் மண் அணைத்தல் (Earthing up) செய்வதன் மூலம் உரங்கள் வீணாவதைத் தடுக்கலாம்.'
    ],
    tipsEn: [
      'Since sugarcane is a heavy water feeder, drip irrigation is highly recommended to prevent nutrient leaching.',
      'Earthing up after each fertilizer application prevents volatilization losses of Nitrogen.'
    ]
  },
  tomato: {
    nameTa: 'தக்காளி (Tomato)',
    nameEn: 'Tomato',
    n: 30,
    p: 40,
    k: 40,
    splitInstructionsTa: [
      'அடி உரம் (Basal): நடும் போது 50% தழைச்சத்து (N), முழு மணிச்சத்து (P) மற்றும் 50% சாம்பல் சத்து (K) இடவும்.',
      '30வது நாள் (Vegetative Growth): 25% தழைச்சத்து (N) மற்றும் 25% சாம்பல் சத்து (K) இடவும்.',
      '60வது நாள் (Flowering / Fruiting): மீதமுள்ள 25% தழைச்சத்து (N) மற்றும் 25% சாம்பல் சத்து (K) இடவும்.'
    ],
    splitInstructionsEn: [
      'Basal Dose: Apply 50% Nitrogen (N), 100% Phosphorus (P), and 50% Potassium (K) during planting.',
      '30 Days (Vegetative Growth): Apply 25% Nitrogen (N) and 25% Potassium (K).',
      '60 Days (Flowering/Fruiting): Apply remaining 25% Nitrogen (N) and 25% Potassium (K).'
    ],
    tipsTa: [
      'தக்காளிக்கு கால்சியம் குறைபாட்டால் பூ அழுகல் (Blossom End Rot) ஏற்படலாம், அதற்கு ஜிப்சம் 40 கிலோ/ஏக்கர் இடலாம்.',
      'தக்காளிச் செடிகளுக்கு காய்ச்சலும் பாய்ச்சலுமாக நீர் பாய்ச்சுவது வேர் அழுகலைத் தடுக்கும்.'
    ],
    tipsEn: [
      'To prevent Blossom End Rot (Calcium deficiency), incorporate Gypsum at 40 kg/acre alongside basal fertilizers.',
      'Avoid overwatering; moderate, frequent irrigation prevents root diseases and blossom drop.'
    ]
  },
  cotton: {
    nameTa: 'பருத்தி (Cotton)',
    nameEn: 'Cotton',
    n: 32,
    p: 16,
    k: 16,
    splitInstructionsTa: [
      'அடி உரம் (Basal): விதைக்கும் போது முழு மணிச்சத்து (P) மற்றும் 50% சாம்பல் சத்து (K) இடவும்.',
      '20வது நாள் (Seedling Stage): 50% தழைச்சத்து (N) இடவும்.',
      '40வது நாள் (Square Formation): 25% தழைச்சத்து (N) மற்றும் 50% சாம்பல் சத்து (K) இடவும்.',
      '60வது நாள் (Boll Development): மீதமுள்ள 25% தழைச்சத்து (N) இடவும்.'
    ],
    splitInstructionsEn: [
      'Basal Dose: Apply 100% Phosphorus (P) and 50% Potassium (K) during sowing.',
      '20 Days (Seedling): Apply 50% Nitrogen (N) split.',
      '40 Days (Square Formation): Apply 25% Nitrogen (N) and remaining 50% Potassium (K).',
      '60 Days (Boll Development): Apply remaining 25% Nitrogen (N) split.'
    ],
    tipsTa: [
      'பருத்தியில் மெக்னீசியம் குறைபாட்டைத் தடுக்க 0.5% மெக்னீசியம் சல்பேட் இலைவழித் தெளிப்பு செய்யலாம்.',
      'பருத்திப் பயிரில் பூ மற்றும் பிஞ்சுகள் உதிர்வதைத் தடுக்க உரம் இட்ட பின் லேசான நீர்ப்பாசனம் செய்யவும்.'
    ],
    tipsEn: [
      'Foliar spray of 0.5% Magnesium Sulphate helps avoid leaf reddening (Magnesium deficiency) in cotton.',
      'Light irrigation after top-dressing maintains high soil moisture, preventing flower and boll shedding.'
    ]
  },
  maize: {
    nameTa: 'சோளம் (Maize)',
    nameEn: 'Maize / Corn',
    n: 55,
    p: 24,
    k: 24,
    splitInstructionsTa: [
      'அடி உரம் (Basal): விதைக்கும் போது 25% தழைச்சத்து (N), முழு மணிச்சத்து (P) மற்றும் 50% சாம்பல் சத்து (K) இடவும்.',
      '25வது நாள் (Knee High Stage): 50% தழைச்சத்து (N) இடவும்.',
      '45வது நாள் (Tasseling Stage): மீதமுள்ள 25% தழைச்சத்து (N) மற்றும் 50% சாம்பல் சத்து (K) இடவும்.'
    ],
    splitInstructionsEn: [
      'Basal Dose: Apply 25% Nitrogen (N), 100% Phosphorus (P), and 50% Potassium (K) during sowing.',
      '25 Days (Knee High Stage): Apply 50% Nitrogen (N) split.',
      '45 Days (Tasseling Stage): Apply remaining 25% Nitrogen (N) and remaining 50% Potassium (K).'
    ],
    tipsTa: [
      'துத்தநாகக் குறைபாட்டைத் தடுக்க ஒரு ஏக்கருக்கு 10 கிலோ துத்தநாக சல்பேட் (Zinc Sulphate) அடி உரமாக இடவும்.',
      'சோளப் பயிருக்கு கதிர் பிடிக்கும் சமயத்தில் வறட்சி இல்லாமல் தண்ணீர் பாய்ச்சுவது மகசூலை அதிகரிக்கும்.'
    ],
    tipsEn: [
      'To prevent Zinc deficiency (white bud), apply Zinc Sulphate at 10 kg/acre as part of the basal mixture.',
      'Ensure adequate soil moisture during the critical tasseling and silking stages for optimal grain filling.'
    ]
  }
};

const SOIL_MULTIPLIERS = {
  loamy: { labelTa: 'வண்டல் மண் (Loamy)', labelEn: 'Loamy', n: 1.0, p: 1.0, k: 1.0 },
  clayey: { labelTa: 'கரிசல் மண் (Clayey)', labelEn: 'Clayey / Black', n: 0.9, p: 1.1, k: 0.95 },
  sandy: { labelTa: 'மணல் பாங்கான மண் (Sandy)', labelEn: 'Sandy', n: 1.25, p: 0.85, k: 1.2 },
  red: { labelTa: 'செம்மண் (Red Soil)', labelEn: 'Red Soil', n: 1.05, p: 1.2, k: 1.1 }
};

const BASELINE_ADJUSTMENTS = {
  low: { labelTa: 'குறைவு (Low)', labelEn: 'Low (Increase nutrients by 20%)', factor: 1.2 },
  medium: { labelTa: 'நடுத்தரம் (Medium)', labelEn: 'Medium (Standard dose)', factor: 1.0 },
  high: { labelTa: 'அதிகம் (High)', labelEn: 'High (Decrease nutrients by 20%)', factor: 0.8 }
};

export default function FertilizerCalculator({ language }: FertilizerCalculatorProps) {
  const [selectedCrop, setSelectedCrop] = useState<string>('paddy');
  const [area, setArea] = useState<number>(1);
  const [unit, setUnit] = useState<'acre' | 'hectare'>('acre');
  const [soilType, setSoilType] = useState<'loamy' | 'clayey' | 'sandy' | 'red'>('loamy');
  const [nStatus, setNStatus] = useState<'low' | 'medium' | 'high'>('medium');
  const [pStatus, setPStatus] = useState<'low' | 'medium' | 'high'>('medium');
  const [kStatus, setKStatus] = useState<'low' | 'medium' | 'high'>('medium');

  // Fertilizer source details
  // Urea = 46% N
  // SSP = 16% P
  // MOP = 60% K
  const calculations = useMemo(() => {
    const spec = CROP_SPECS[selectedCrop];
    const areaInAcres = unit === 'hectare' ? area * 2.471 : area;

    // Apply soil type modifiers
    const soilFactor = SOIL_MULTIPLIERS[soilType];
    
    // Apply baseline nutritional status factors
    const nFactor = BASELINE_ADJUSTMENTS[nStatus].factor;
    const pFactor = BASELINE_ADJUSTMENTS[pStatus].factor;
    const kFactor = BASELINE_ADJUSTMENTS[kStatus].factor;

    // Adjusted total pure nutrients needed (Kg)
    const pureN = spec.n * areaInAcres * soilFactor.n * nFactor;
    const pureP = spec.p * areaInAcres * soilFactor.p * pFactor;
    const pureK = spec.k * areaInAcres * soilFactor.k * kFactor;

    // Convert pure NPK to commercial fertilizer products
    // Urea is 46% N
    const ureaKg = pureN / 0.46;
    // Single Super Phosphate is 16% P2O5
    const sspKg = pureP / 0.16;
    // Muriate of Potash is 60% K2O
    const mopKg = pureK / 0.60;

    // standard bag size is 50 kg
    const ureaBags = ureaKg / 50;
    const sspBags = sspKg / 50;
    const mopBags = mopKg / 50;

    return {
      pureN: Math.round(pureN),
      pureP: Math.round(pureP),
      pureK: Math.round(pureK),
      ureaKg: Math.round(ureaKg),
      sspKg: Math.round(sspKg),
      mopKg: Math.round(mopKg),
      ureaBags: parseFloat(ureaBags.toFixed(1)),
      sspBags: parseFloat(sspBags.toFixed(1)),
      mopBags: parseFloat(mopBags.toFixed(1)),
      areaInAcres: parseFloat(areaInAcres.toFixed(2))
    };
  }, [selectedCrop, area, unit, soilType, nStatus, pStatus, kStatus]);

  const resetFields = () => {
    setSelectedCrop('paddy');
    setArea(1);
    setUnit('acre');
    setSoilType('loamy');
    setNStatus('medium');
    setPStatus('medium');
    setKStatus('medium');
  };

  const activeSpec = CROP_SPECS[selectedCrop];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <span className="bg-emerald-100 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-400 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider font-mono">
            Agronomy AI
          </span>
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight mt-1.5 font-sans">
            {language === 'ta' ? 'உர கணக்கீடு மற்றும் மேலாண்மை' : 'NPK Fertilizer Calculator'}
          </h2>
          <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">
            {language === 'ta' 
              ? 'TNAU பரிந்துரைப்படி உங்கள் பயிர் வகை, மண்ணின் தன்மைக்கேற்ப தேவைப்படும் யூரியா, சூப்பர் பாஸ்பேட், பொட்டாஷ் பைகளைத் துல்லியமாகக் கணக்கிடுங்கள்.'
              : 'Calculate custom Urea, Single Super Phosphate (SSP), and Muriate of Potash (MOP) bags based on crop specifications and soil baseline nutrients.'
            }
          </p>
        </div>

        <button
          onClick={resetFields}
          className="px-4 py-2 border dark:border-slate-800 dark:bg-slate-900 hover:bg-gray-50 dark:hover:bg-slate-800 text-gray-700 dark:text-slate-300 text-xs font-bold rounded-xl transition-all flex items-center space-x-1.5 cursor-pointer"
        >
          <RotateCcw className="h-4 w-4 text-emerald-600" />
          <span>{language === 'ta' ? 'மீட்டமை (Reset)' : 'Reset'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Form Controls (Input) */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 shadow-xl shadow-slate-50 dark:shadow-none space-y-6">
          
          <div className="flex items-center space-x-2 text-emerald-600 dark:text-emerald-400 border-b pb-4 dark:border-slate-800">
            <Calculator className="h-5 w-5" />
            <span className="font-extrabold text-sm uppercase tracking-wider font-mono">
              {language === 'ta' ? 'உள்ளீடுகள் (Inputs)' : 'Calculator Parameters'}
            </span>
          </div>

          {/* Crop Selection */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-gray-700 dark:text-slate-300">
              {language === 'ta' ? 'பயிர் வகை (Select Crop)' : 'Select Crop'}
            </label>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(CROP_SPECS).map(([key, value]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setSelectedCrop(key)}
                  className={`p-3 rounded-xl border text-xs font-semibold text-left transition-all cursor-pointer flex items-center space-x-2 ${
                    selectedCrop === key
                      ? 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-500 text-emerald-900 dark:text-emerald-400 shadow-sm'
                      : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 text-gray-700 dark:text-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <Sprout className={`h-4 w-4 ${selectedCrop === key ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'}`} />
                  <span className="truncate">{language === 'ta' ? value.nameTa : value.nameEn}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Land Area Selector */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs font-bold text-gray-700 dark:text-slate-300">
              <label>{language === 'ta' ? 'நிலத்தின் அளவு (Land Size)' : 'Land Size'}</label>
              <div className="flex border rounded-lg overflow-hidden text-[10px]">
                <button
                  type="button"
                  onClick={() => setUnit('acre')}
                  className={`px-2 py-1 font-bold ${unit === 'acre' ? 'bg-emerald-600 text-white' : 'bg-slate-50 dark:bg-slate-900 text-slate-500 dark:text-slate-400'}`}
                >
                  {language === 'ta' ? 'ஏக்கர்' : 'Acres'}
                </button>
                <button
                  type="button"
                  onClick={() => setUnit('hectare')}
                  className={`px-2 py-1 font-bold ${unit === 'hectare' ? 'bg-emerald-600 text-white' : 'bg-slate-50 dark:bg-slate-900 text-slate-500 dark:text-slate-400'}`}
                >
                  {language === 'ta' ? 'ஹெக்டேர்' : 'Hectares'}
                </button>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <input
                type="range"
                min="0.5"
                max="30"
                step="0.5"
                value={area}
                onChange={(e) => setArea(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-600"
              />
              <div className="flex items-center space-x-1 shrink-0 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-3 py-1.5 rounded-xl">
                <input
                  type="number"
                  min="0.1"
                  max="500"
                  step="0.1"
                  value={area}
                  onChange={(e) => setArea(Math.max(0.1, parseFloat(e.target.value) || 0))}
                  className="w-12 text-center text-sm font-extrabold focus:outline-none bg-transparent text-slate-900 dark:text-white"
                />
                <span className="text-[10px] text-slate-400 font-bold">
                  {unit === 'acre' ? (language === 'ta' ? 'ஏக்' : 'Ac') : (language === 'ta' ? 'ஹெக்' : 'Ha')}
                </span>
              </div>
            </div>
          </div>

          {/* Soil Type */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-gray-700 dark:text-slate-300">
              {language === 'ta' ? 'மண்ணின் வகை (Soil Type)' : 'Soil Type'}
            </label>
            <select
              value={soilType}
              onChange={(e) => setSoilType(e.target.value as any)}
              className="w-full border border-slate-250 dark:border-slate-800 rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:border-emerald-500 bg-white dark:bg-slate-900 font-semibold text-slate-700 dark:text-slate-300"
            >
              {Object.entries(SOIL_MULTIPLIERS).map(([key, val]) => (
                <option key={key} value={key}>
                  {language === 'ta' ? val.labelTa : val.labelEn}
                </option>
              ))}
            </select>
          </div>

          {/* Baseline Nutrient Status */}
          <div className="space-y-3 bg-slate-50 dark:bg-slate-900/60 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono flex items-center space-x-1.5">
              <Layers className="h-3.5 w-3.5 text-slate-400" />
              <span>{language === 'ta' ? 'மண் பரிசோதனை சத்துக்கள் நிலை' : 'Soil Test Nutrients Level'}</span>
            </h4>

            {/* Nitrogen Status */}
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-slate-650 dark:text-slate-450">தழைச்சத்து (Nitrogen - N)</span>
              <div className="flex gap-1">
                {Object.entries(BASELINE_ADJUSTMENTS).map(([key, val]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setNStatus(key as any)}
                    className={`px-2 py-1 text-[9px] font-bold rounded-lg transition-all cursor-pointer ${
                      nStatus === key
                        ? 'bg-emerald-600 text-white'
                        : 'bg-white dark:bg-slate-900 border text-slate-500 dark:text-slate-450 dark:border-slate-800'
                    }`}
                  >
                    {language === 'ta' ? val.labelTa : key.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            {/* Phosphorus Status */}
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-slate-650 dark:text-slate-450">மணிச்சத்து (Phosphorus - P)</span>
              <div className="flex gap-1">
                {Object.entries(BASELINE_ADJUSTMENTS).map(([key, val]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setPStatus(key as any)}
                    className={`px-2 py-1 text-[9px] font-bold rounded-lg transition-all cursor-pointer ${
                      pStatus === key
                        ? 'bg-emerald-600 text-white'
                        : 'bg-white dark:bg-slate-900 border text-slate-500 dark:text-slate-450 dark:border-slate-800'
                    }`}
                  >
                    {language === 'ta' ? val.labelTa : key.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            {/* Potassium Status */}
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-slate-650 dark:text-slate-450">சாம்பல்சத்து (Potassium - K)</span>
              <div className="flex gap-1">
                {Object.entries(BASELINE_ADJUSTMENTS).map(([key, val]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setKStatus(key as any)}
                    className={`px-2 py-1 text-[9px] font-bold rounded-lg transition-all cursor-pointer ${
                      kStatus === key
                        ? 'bg-emerald-600 text-white'
                        : 'bg-white dark:bg-slate-900 border text-slate-500 dark:text-slate-450 dark:border-slate-800'
                    }`}
                  >
                    {language === 'ta' ? val.labelTa : key.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
          </div>

        </div>

        {/* Right Column: Fertilizer Output Sacks & Application Recipe */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Output Sacks Display Card */}
          <div className="bg-gradient-to-br from-emerald-900 to-teal-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-[0.03] text-white">
              <Calculator className="h-44 w-44" />
            </div>

            <div className="relative">
              <span className="bg-emerald-800 border border-emerald-700/60 text-emerald-200 text-[9px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider font-mono">
                {language === 'ta' ? 'பரிந்துரைக்கப்பட்ட உரம் பைகள்' : 'RECOMMENDED FERTILIZER BAGS'}
              </span>
              <h3 className="text-xl font-black mt-2">
                {language === 'ta' 
                  ? `${area} ${unit === 'acre' ? 'ஏக்கருக்கான' : 'ஹெக்டேருக்கான'} உர தேவை` 
                  : `${area} ${unit === 'acre' ? 'Acre(s)' : 'Hectare(s)'} Requirements`
                }
              </h3>
              <p className="text-xs text-emerald-200 mt-1">
                {language === 'ta' 
                  ? `மொத்த விவசாய நிலப்பரப்பு: ${calculations.areaInAcres} ஏக்கர் (TNAU NPK அலகுப்படி)` 
                  : `Equivalent Net Area: ${calculations.areaInAcres} Acres`
                }
              </p>

              {/* Grid of bags */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
                
                {/* Urea (N) */}
                <div className="bg-emerald-950/40 backdrop-blur-sm border border-emerald-800/80 p-4 rounded-2xl flex flex-col justify-between">
                  <div>
                    <span className="text-[9px] text-emerald-400 font-bold uppercase tracking-wider font-mono block">யூரியா (Urea)</span>
                    <span className="text-2xl font-black block mt-1">{calculations.ureaBags} <span className="text-xs font-semibold">{language === 'ta' ? 'பைகள்' : 'Bags'}</span></span>
                  </div>
                  <div className="border-t border-emerald-800/60 pt-2 mt-3 flex justify-between items-center text-[10px] text-emerald-300">
                    <span>{calculations.ureaKg} Kg total</span>
                    <span className="bg-emerald-900 px-1.5 py-0.5 rounded text-[9px]">46% N</span>
                  </div>
                </div>

                {/* SSP (P) */}
                <div className="bg-emerald-950/40 backdrop-blur-sm border border-emerald-800/80 p-4 rounded-2xl flex flex-col justify-between">
                  <div>
                    <span className="text-[9px] text-emerald-400 font-bold uppercase tracking-wider font-mono block">சூப்பர் பாஸ்பேட் (SSP)</span>
                    <span className="text-2xl font-black block mt-1">{calculations.sspBags} <span className="text-xs font-semibold">{language === 'ta' ? 'பைகள்' : 'Bags'}</span></span>
                  </div>
                  <div className="border-t border-emerald-800/60 pt-2 mt-3 flex justify-between items-center text-[10px] text-emerald-300">
                    <span>{calculations.sspKg} Kg total</span>
                    <span className="bg-emerald-900 px-1.5 py-0.5 rounded text-[9px]">16% P</span>
                  </div>
                </div>

                {/* MOP (K) */}
                <div className="bg-emerald-950/40 backdrop-blur-sm border border-emerald-800/80 p-4 rounded-2xl flex flex-col justify-between">
                  <div>
                    <span className="text-[9px] text-emerald-400 font-bold uppercase tracking-wider font-mono block">பொட்டாஷ் (MOP)</span>
                    <span className="text-2xl font-black block mt-1">{calculations.mopBags} <span className="text-xs font-semibold">{language === 'ta' ? 'பைகள்' : 'Bags'}</span></span>
                  </div>
                  <div className="border-t border-emerald-800/60 pt-2 mt-3 flex justify-between items-center text-[10px] text-emerald-300">
                    <span>{calculations.mopKg} Kg total</span>
                    <span className="bg-emerald-900 px-1.5 py-0.5 rounded text-[9px]">60% K</span>
                  </div>
                </div>

              </div>

              {/* NPK Summary values */}
              <div className="mt-6 p-4 bg-emerald-950/20 border border-emerald-800/30 rounded-2xl flex justify-between items-center text-xs text-emerald-100">
                <span className="font-bold">{language === 'ta' ? 'தேவைப்படும் தூய சத்துக்கள் (Pure N-P-K Required):' : 'Pure Nutrients Required:'}</span>
                <div className="flex gap-2 font-mono font-extrabold">
                  <span className="bg-emerald-900 px-2 py-0.5 rounded">N: {calculations.pureN}kg</span>
                  <span className="bg-emerald-900 px-2 py-0.5 rounded">P: {calculations.pureP}kg</span>
                  <span className="bg-emerald-900 px-2 py-0.5 rounded">K: {calculations.pureK}kg</span>
                </div>
              </div>

            </div>
          </div>

          {/* Split Schedule Timeline */}
          <div className="bg-white dark:bg-slate-900/40 border border-slate-150 dark:border-slate-800 p-6 rounded-3xl space-y-4">
            <h4 className="font-extrabold text-slate-900 dark:text-white text-sm uppercase tracking-wider font-mono flex items-center space-x-1.5 border-b pb-3 dark:border-slate-800">
              <Calendar className="h-4.5 w-4.5 text-emerald-600" />
              <span>{language === 'ta' ? 'உரம் பிரித்து இடும் அட்டவணை (Split Application Schedule)' : 'Split Application Schedule'}</span>
            </h4>

            <div className="space-y-4">
              {(language === 'ta' ? activeSpec.splitInstructionsTa : activeSpec.splitInstructionsEn).map((inst, index) => (
                <div key={index} className="flex items-start space-x-3 text-xs text-slate-700 dark:text-slate-300">
                  <span className="flex items-center justify-center h-5 w-5 rounded-full bg-emerald-50 dark:bg-emerald-950/45 text-emerald-700 dark:text-emerald-400 font-extrabold text-[10px] shrink-0 mt-0.5">
                    {index + 1}
                  </span>
                  <p className="leading-relaxed font-semibold">{inst}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Tips and Warnings Box */}
          <div className="bg-emerald-50/50 dark:bg-emerald-950/10 border border-emerald-100/60 dark:border-emerald-900/40 p-5 rounded-3xl flex items-start space-x-3">
            <Sparkles className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <h5 className="font-bold text-emerald-950 dark:text-emerald-400 text-xs uppercase tracking-wider font-mono">
                {language === 'ta' ? 'விவசாய ஆலோசனைகள் & வழிகாட்டுதல்கள்' : 'Agronomic Best Practices'}
              </h5>
              <ul className="list-disc list-inside space-y-1.5 text-xs text-emerald-900 dark:text-emerald-300 mt-2 font-medium">
                {(language === 'ta' ? activeSpec.tipsTa : activeSpec.tipsEn).map((tip, idx) => (
                  <li key={idx} className="leading-relaxed">{tip}</li>
                ))}
                <li className="leading-relaxed">
                  {language === 'ta' 
                    ? 'மழை பெய்யும் போதோ அல்லது ஈரப்பதம் மிக அதிகமாக இருக்கும் போதோ உரமிடுவதைத் தவிர்க்கவும்.'
                    : 'Avoid applying top-dressed urea during heavy rainfall or very humid, soggy conditions to prevent runoff.'
                  }
                </li>
              </ul>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
