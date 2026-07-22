import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { MarketplaceDealer, MarketPrice } from '../types';
import { 
  Store, Phone, MapPin, Search, ShoppingBag, 
  ShieldCheck, TrendingUp, TrendingDown, Calendar, 
  AlertCircle, Plus, Activity, BarChart2 
} from 'lucide-react';
import { 
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, 
  CartesianGrid, Tooltip, Legend, BarChart, Bar, Cell
} from 'recharts';
import { Language } from '../lib/translations';

interface MarketplaceProps {
  dealers: MarketplaceDealer[];
  language?: Language;
}

const mTrans: Record<string, Record<string, string>> = {
  header_badge: {
    ta: "வேளாண் சந்தை மையம்",
    en: "Agri Market Hub"
  },
  header_title: {
    ta: "வேளாண் சந்தை & சந்தை விலைகள்",
    en: "Agricultural Market & Daily Prices"
  },
  header_desc: {
    ta: "தமிழகத்தின் தினசரி சந்தை விலை நிலவரங்கள் மற்றும் அங்கீகரிக்கப்பட்ட உரம், பூச்சிக்கொல்லி விற்பனையாளர்கள் பட்டியல்.",
    en: "Daily agricultural market price trends in Tamil Nadu and list of authorized fertilizer & pesticide dealers."
  },
  daily_prices: {
    ta: "தினசரி விலைகள்",
    en: "Daily Market Prices"
  },
  inputs_dealers: {
    ta: "இடுபொருட்கள் & டீலர்கள்",
    en: "Dealers"
  },
  market_center: {
    ta: "சந்தை மையம்",
    en: "Market Center"
  },
  crop_type: {
    ta: "பயிர் வகை",
    en: "Crop Type"
  },
  report_price_btn: {
    ta: "சந்தை விலை அறிவிப்பு (Report Price)",
    en: "Report Market Price"
  },
  register_price_title: {
    ta: "சந்தை விலை நிலவரம் பதிவு (Report Market Price)",
    en: "Report Market Price Status"
  },
  crop: {
    ta: "பயிர்",
    en: "Crop"
  },
  market: {
    ta: "சந்தை",
    en: "Market"
  },
  price: {
    ta: "விலை",
    en: "Price"
  },
  unit: {
    ta: "அலகு",
    en: "Unit"
  },
  trend: {
    ta: "போக்கு",
    en: "Trend"
  },
  stable: {
    ta: "சீரானது (Stable)",
    en: "Stable"
  },
  up: {
    ta: "ஏற்றம் (Upward)",
    en: "Upward"
  },
  down: {
    ta: "இறக்கம் (Downward)",
    en: "Downward"
  },
  submit_price: {
    ta: "விலையை சமர்ப்பி",
    en: "Submit Price"
  },
  submitting: {
    ta: "சமர்ப்பிக்கிறது...",
    en: "Submitting..."
  },
  login_required: {
    ta: "விலைகளைப் பதிவு செய்ய முதலில் உள்நுழையவும்! Please login to report prices.",
    en: "Please login to report prices."
  },
  recent_prices_title: {
    ta: "அண்மைய சந்தை விலை பட்டியல்",
    en: "Recent Market Prices"
  },
  price_trend_title: {
    ta: "சந்தை விலை போக்கு",
    en: "Market Price Trend"
  },
  comparison_title: {
    ta: "பயிர் விலை ஒப்பீடு & சந்தை பகுப்பாய்வு",
    en: "Crop Price Comparison & Market Analysis"
  },
  food_crops: {
    ta: "உணவுப் பயிர்கள்",
    en: "Food Crops"
  },
  commercial_crops: {
    ta: "வணிகப் பயிர்கள்",
    en: "Commercial Crops"
  },
  market_comparison: {
    ta: "சந்தை வாரியாக விலை ஒப்பீடு",
    en: "Market-wise Price Comparison"
  },
  search_dealers_placeholder: {
    ta: "டீலர்கள் பெயர் அல்லது தயாரிப்புகளைத் தேடுக...",
    en: "Search dealers or products..."
  },
  all_districts: {
    ta: "அனைத்து மாவட்டங்களும்",
    en: "All Districts"
  },
  no_dealers_found: {
    ta: "டீலர்கள் எவரும் கண்டறியப்படவில்லை. வேறு சொற்களைக் கொண்டு தேடவும்.",
    en: "No dealers found. Try adjusting your filters."
  },
  authorized: {
    ta: "அங்கீகரிக்கப்பட்டது",
    en: "Authorized"
  },
  available_inputs: {
    ta: "கிடைக்கும் இடுபொருட்கள்:",
    en: "Available Inputs:"
  },
  loading_prices: {
    ta: "விலை விவரங்களை ஏற்றுகிறது...",
    en: "Loading market prices..."
  },
  no_data: {
    ta: "போதிய தரவுகள் இல்லை",
    en: "No sufficient data available"
  },
  user_contributed_disclaimer: {
    ta: "விலைகள் விவசாயிகளின் பங்களிப்புகள் மற்றும் உள்ளூர் சந்தை அறிவிப்புகள் மூலம் பெறப்படுபவை. துல்லியத்தை சரிபார்த்துக்கொள்ளவும்.",
    en: "Prices are sourced from local market announcements and farmer contributions. Please verify local rates."
  },
  government_procurement_disclaimer: {
    ta: "அரசு கொள்முதல் நிலைய விலைகள் மற்றும் கூட்டுறவு சங்கங்களின் விலைகளையும் இந்த வாரியத்தில் நீங்கள் ஒப்பிடலாம்.",
    en: "You can also compare government procurement station rates and cooperative society prices here."
  },
  food_crops_guideline: {
    ta: "உணவுப் பயிர்களின் சந்தை மதிப்பு மாற்றங்களை ஒப்பிட்டு அடுத்த சாகுபடி திட்டமிடலை மேற்கொள்ளுங்கள்.",
    en: "Compare seasonal market fluctuations of food crops to optimize your sowing schedule."
  },
  commercial_crops_guideline: {
    ta: "வணிகப் பயிர்களின் நீண்டகால விலை உயர்வு போக்கு அதிக இலாபகரமான விற்பனைக்கு உதவும்.",
    en: "Long-term price trends for cash/commercial crops assist in negotiating better contract terms."
  },
  market_comparison_guideline: {
    ta: "அருகிலுள்ள மற்ற மார்க்கெட்டுகளுடன் விலைகளை ஒப்பிட்டு சிறந்த விலையுள்ள சந்தையில் விற்கலாம்.",
    en: "Compare prices across regional centers to choose the most profitable marketplace."
  }
};

const getMT = (key: string, lang: Language): string => {
  const translationsForKey = mTrans[key];
  if (!translationsForKey) return '';
  return translationsForKey[lang] || translationsForKey['en'] || '';
};

const getLocalizedCrop = (cropName: string, lang: Language): string => {
  if (lang === 'ta') {
    if (cropName.includes('Paddy')) return 'நெல் (Paddy)';
    if (cropName.includes('Tomato')) return 'தக்காளி (Tomato)';
    if (cropName.includes('Onion')) return 'சின்ன வெங்காயம் (Onion)';
    if (cropName.includes('Turmeric')) return 'மஞ்சள் (Turmeric)';
    if (cropName.includes('Coconut')) return 'தேங்காய் (Coconut)';
    if (cropName.includes('Cotton')) return 'பருத்தி (Cotton)';
  } else {
    if (cropName.includes('Paddy')) return 'Paddy';
    if (cropName.includes('Tomato')) return 'Tomato';
    if (cropName.includes('Onion')) return 'Onion';
    if (cropName.includes('Turmeric')) return 'Turmeric';
    if (cropName.includes('Coconut')) return 'Coconut';
    if (cropName.includes('Cotton')) return 'Cotton';
  }
  return cropName;
};

const getLocalizedMarket = (marketName: string, lang: Language): string => {
  if (lang === 'ta') {
    if (marketName.includes('Thanjavur')) return 'தஞ்சாவூர் மார்க்கெட்';
    if (marketName.includes('Madurai')) return 'மதுரை மாட்டுத்தாவணி';
    if (marketName.includes('Coimbatore')) return 'கோவை MGR மார்க்கெட்';
    if (marketName.includes('Trichy')) return 'திருச்சி காந்தி மார்க்கெட்';
    if (marketName.includes('Salem')) return 'சேலம் மார்க்கெட்';
  } else {
    if (marketName.includes('Thanjavur')) return 'Thanjavur Market';
    if (marketName.includes('Madurai')) return 'Madurai Mattuthavani';
    if (marketName.includes('Coimbatore')) return 'Coimbatore MGR Market';
    if (marketName.includes('Trichy')) return 'Trichy Gandhi Market';
    if (marketName.includes('Salem')) return 'Salem Market';
  }
  return marketName;
};

export default function Marketplace({ dealers, language = 'ta' }: MarketplaceProps) {
  const { token } = useAuth();
  
  // Tab control: 'dealers' | 'prices'
  const [activeSubTab, setActiveSubTab] = useState<'dealers' | 'prices'>('prices');

  // Dealers tab state
  const [search, setSearch] = useState('');
  const [selectedDist, setSelectedDist] = useState('');

  // Market Prices state
  const [prices, setPrices] = useState<MarketPrice[]>([]);
  const [pricesLoading, setPricesLoading] = useState(true);
  const [selectedCrop, setSelectedCrop] = useState('Paddy / நெல் (Fine)');
  const [selectedMarket, setSelectedMarket] = useState('Thanjavur Market');
  const [comparisonGroup, setComparisonGroup] = useState<'food' | 'commercial'>('food');

  // Price Report form state
  const [showPriceForm, setShowPriceForm] = useState(false);
  const [formCrop, setFormCrop] = useState('Paddy / நெல் (Fine)');
  const [formMarket, setFormMarket] = useState('Thanjavur Market');
  const [formPrice, setFormPrice] = useState('');
  const [formUnit, setFormUnit] = useState('Quintal (100kg)');
  const [formTrend, setFormTrend] = useState<'up' | 'down' | 'stable'>('stable');
  const [formSubmitting, setFormSubmitting] = useState(false);

  // List of unique crops and markets for selection
  const cropTypes = [
    'Paddy / நெல் (Fine)',
    'Tomato / தக்காளி',
    'Onion / சின்ன வெங்காயம்',
    'Turmeric / மஞ்சள்',
    'Coconut / தேங்காய்',
    'Cotton / பருத்தி'
  ];

  const marketCenters = [
    'Thanjavur Market',
    'Madurai Mattuthavani',
    'Coimbatore MGR Market',
    'Trichy Gandhi Market',
    'Salem Market'
  ];

  // Fetch prices from backend
  const fetchMarketPrices = async () => {
    try {
      setPricesLoading(true);
      const res = await fetch('/api/market-prices');
      const data = await res.json();
      if (res.ok && Array.isArray(data)) {
        setPrices(data);
      }
    } catch (err) {
      console.error('Failed to fetch market prices:', err);
    } finally {
      setPricesLoading(false);
    }
  };

  useEffect(() => {
    fetchMarketPrices();
  }, []);

  // Filter dealers
  const filteredDealers = dealers.filter(d => {
    const matchesSearch = d.name.toLowerCase().includes(search.toLowerCase()) || 
                          d.items.some(i => i.toLowerCase().includes(search.toLowerCase()));
    const matchesDist = selectedDist === '' || d.dist.toLowerCase() === selectedDist.toLowerCase();
    return matchesSearch && matchesDist;
  });

  // Filter current crop prices for listing & graph
  const cropTrendData = prices
    .filter(p => p.cropName === selectedCrop && p.marketName === selectedMarket)
    .sort((a, b) => new Date(a.priceDate).getTime() - new Date(b.priceDate).getTime())
    .map(p => ({
      date: p.priceDate.substring(5), // short date MM-DD
      'விலை': p.price,
      Trend: p.trend
    }));

  // Get current/latest price (most recent date)
  const currentPriceRecord = prices
    .filter(p => p.cropName === selectedCrop && p.marketName === selectedMarket)
    .sort((a, b) => new Date(b.priceDate).getTime() - new Date(a.priceDate).getTime())[0];

  // Get distinct latest price records across all crops in the selected market to display in table
  const latestPricesInMarket = cropTypes.map(crop => {
    const sortedForCrop = prices
      .filter(p => p.cropName === crop && p.marketName === selectedMarket)
      .sort((a, b) => new Date(b.priceDate).getTime() - new Date(a.priceDate).getTime());
    return sortedForCrop[0] || null;
  }).filter((x): x is MarketPrice => x !== null);

  // Generate multi-crop comparison data
  const dates = Array.from(new Set(prices.map(p => p.priceDate))).sort() as string[];
  const comparisonData = dates.map(dateStr => {
    const dataPoint: any = { date: dateStr.substring(5) }; // MM-DD
    cropTypes.forEach(crop => {
      const match = prices.find(p => p.priceDate === dateStr && p.cropName === crop && p.marketName === selectedMarket);
      if (match) {
        const key = crop.startsWith('Paddy') ? 'Paddy' :
                    crop.startsWith('Tomato') ? 'Tomato' :
                    crop.startsWith('Onion') ? 'Onion' :
                    crop.startsWith('Turmeric') ? 'Turmeric' :
                    crop.startsWith('Coconut') ? 'Coconut' : 'Cotton';
        dataPoint[key] = match.price;
      }
    });
    return dataPoint;
  });

  // Calculate market spread comparison for the currently selected crop
  const marketSpreadData = marketCenters.map(market => {
    const sortedForMarket = prices
      .filter(p => p.cropName === selectedCrop && p.marketName === market)
      .sort((a, b) => new Date(b.priceDate).getTime() - new Date(a.priceDate).getTime());
    const latest = sortedForMarket[0];
    return {
      name: market.replace(' Market', '').replace(' Mattuthavani', '').replace(' MGR Market', '').replace(' Gandhi Market', '').replace('Salem', language === 'ta' ? 'சேலம்' : 'Salem'),
      'விலை (Price)': latest ? latest.price : 0
    };
  });

  // Submit new price report
  const handleReportPrice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      alert(getMT('login_required', language));
      return;
    }
    if (!formPrice || parseFloat(formPrice) <= 0) {
      alert(language === 'ta' ? 'சரியான விலையை உள்ளிடவும்.' : 'Please enter a valid price.');
      return;
    }

    setFormSubmitting(true);
    try {
      const res = await fetch('/api/market-prices', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          cropName: formCrop,
          marketName: formMarket,
          price: parseFloat(formPrice),
          unit: formUnit,
          trend: formTrend
        })
      });

      const data = await res.json();
      if (res.ok) {
        await fetchMarketPrices();
        setFormPrice('');
        setShowPriceForm(false);
        alert(language === 'ta' ? 'சந்தை விலை வெற்றிகரமாகப் பதிவு செய்யப்பட்டது!' : 'Market price successfully reported!');
      } else {
        alert(data.error || 'Failed to submit price.');
      }
    } catch (err) {
      console.error(err);
      alert(language === 'ta' ? 'விலை பதிவேற்றம் தோல்வியுற்றது.' : 'Price reporting failed.');
    } finally {
      setFormSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in" id="marketplace-container">
      
      {/* Header section */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider font-mono">
            {getMT('header_badge', language)}
          </span>
          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight mt-1.5 font-sans">
            {getMT('header_title', language)}
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            {getMT('header_desc', language)}
          </p>
        </div>

        {/* Sub-tab Selection Buttons */}
        <div className="flex bg-slate-100 p-1.5 rounded-2xl shrink-0 self-start md:self-center">
          <button
            onClick={() => setActiveSubTab('prices')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer ${
              activeSubTab === 'prices' ? 'bg-white text-slate-900 shadow-md' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Activity className="h-4 w-4 text-emerald-600" />
            <span>{getMT('daily_prices', language)}</span>
          </button>
          
          <button
            onClick={() => setActiveSubTab('dealers')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer ${
              activeSubTab === 'dealers' ? 'bg-white text-slate-900 shadow-md' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Store className="h-4 w-4 text-emerald-600" />
            <span>{getMT('inputs_dealers', language)}</span>
          </button>
        </div>
      </div>

      {/* =========================================
          SUB-TAB 1: DAILY MARKET PRICES
         ========================================= */}
      {activeSubTab === 'prices' && (
        <div className="space-y-6" id="market-prices-subview">
          
          {/* Top Selection Widgets and Form Trigger */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end bg-white border border-gray-100 p-5 rounded-3xl shadow-xl shadow-gray-50/50">
            {/* Market Center Selector */}
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider font-mono mb-1.5">{getMT('market_center', language)}:</label>
              <select
                value={selectedMarket}
                onChange={(e) => setSelectedMarket(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-emerald-500 bg-white text-slate-800"
              >
                {marketCenters.map(m => (
                  <option key={m} value={m}>{getLocalizedMarket(m, language)}</option>
                ))}
              </select>
            </div>

            {/* Crop Selector */}
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider font-mono mb-1.5">{getMT('crop_type', language)}:</label>
              <select
                value={selectedCrop}
                onChange={(e) => setSelectedCrop(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-emerald-500 bg-white text-slate-800"
              >
                {cropTypes.map(c => (
                  <option key={c} value={c}>{getLocalizedCrop(c, language)}</option>
                ))}
              </select>
            </div>

            {/* Report Price Trigger Button */}
            <button
              onClick={() => {
                setShowPriceForm(true);
              }}
              className="w-full inline-flex items-center justify-center space-x-1.5 bg-gradient-to-tr from-emerald-600 to-teal-500 hover:from-emerald-700 hover:to-teal-600 text-white text-xs font-bold px-4 py-3 rounded-xl shadow transition-all cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              <span>{getMT('report_price_btn', language)}</span>
            </button>
          </div>

          {/* Report Price Modal/Form Overlay */}
          {showPriceForm && (
            <div className="bg-white border-2 border-emerald-500/20 p-6 rounded-3xl shadow-2xl animate-fade-in">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-bold text-slate-800 flex items-center space-x-1.5">
                  <span className="p-1.5 bg-emerald-50 text-emerald-700 rounded-lg">
                    <Plus className="h-4 w-4" />
                  </span>
                  <span>{getMT('register_price_title', language)}</span>
                </h3>
                <button onClick={() => setShowPriceForm(false)} className="text-gray-400 hover:text-gray-600">
                  <Plus className="h-5 w-5 rotate-45" />
                </button>
              </div>

              <form onSubmit={handleReportPrice} className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 mb-1">{getMT('crop', language)}</label>
                  <select
                    value={formCrop}
                    onChange={(e) => setFormCrop(e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-2 py-2 text-xs bg-white text-slate-800"
                  >
                    {cropTypes.map(c => <option key={c} value={c}>{getLocalizedCrop(c, language)}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-500 mb-1">{getMT('market', language)}</label>
                  <select
                    value={formMarket}
                    onChange={(e) => setFormMarket(e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-2 py-2 text-xs bg-white text-slate-800"
                  >
                    {marketCenters.map(m => <option key={m} value={m}>{getLocalizedMarket(m, language)}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-500 mb-1">{getMT('unit', language)}</label>
                  <select
                    value={formUnit}
                    onChange={(e) => setFormUnit(e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-2 py-2 text-xs bg-white text-slate-800"
                  >
                    <option value="Quintal (100kg)">{language === 'ta' ? 'குவிண்டால் (100kg)' : 'Quintal (100kg)'}</option>
                    <option value="kg">{language === 'ta' ? 'கிலோ (kg)' : 'kg'}</option>
                    <option value="Box (15kg)">{language === 'ta' ? 'பெட்டி (15kg)' : 'Box (15kg)'}</option>
                    <option value="1000 Pieces">{language === 'ta' ? '1000 எண்ணிக்கைகள்' : '1000 Pieces'}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-500 mb-1">{getMT('price', language)} ₹</label>
                  <input
                    type="number"
                    required
                    value={formPrice}
                    onChange={(e) => setFormPrice(e.target.value)}
                    placeholder="₹ 2200"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none text-slate-800"
                  />
                </div>

                <div className="flex space-x-2">
                  <select
                    value={formTrend}
                    onChange={(e) => setFormTrend(e.target.value as any)}
                    className="border border-gray-200 rounded-lg px-2 py-2 text-xs bg-white text-slate-800"
                  >
                    <option value="stable">{getMT('stable', language)}</option>
                    <option value="up">{getMT('up', language)}</option>
                    <option value="down">{getMT('down', language)}</option>
                  </select>

                  <button
                    type="submit"
                    disabled={formSubmitting}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-bold px-4 py-2.5 rounded-lg shadow cursor-pointer"
                  >
                    {formSubmitting ? '...' : getMT('submit_price', language)}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Main Price Analysis Dashboard */}
          {pricesLoading ? (
            <div className="text-center py-12 bg-white border rounded-3xl shadow-xl shadow-gray-50">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto mb-3"></div>
              <p className="text-xs text-gray-400 font-mono">{getMT('loading_prices', language)}</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Left Side: Selected Crop Price Card & Historical Trend Graph */}
              <div className="lg:col-span-2 bg-white border border-gray-100 p-6 rounded-3xl shadow-xl shadow-gray-50/50 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">{language === 'ta' ? 'தற்போதைய சந்தை விலை' : 'Current Live Price'}</span>
                      <h3 className="text-xl font-extrabold text-slate-800 mt-1 font-sans">{getLocalizedCrop(selectedCrop, language)}</h3>
                      <p className="text-xs text-slate-400 mt-0.5">{getLocalizedMarket(selectedMarket, language)}</p>
                    </div>

                    {currentPriceRecord ? (
                      <div className="text-right">
                        <div className="text-2xl font-black text-slate-900 font-mono">
                          ₹ {currentPriceRecord.price}
                        </div>
                        <div className="text-[10px] text-slate-400 mt-0.5">
                          {language === 'ta' ? `ஒரு ${currentPriceRecord.unit.includes('Quintal') ? 'குவிண்டாலுக்கு' : 'அலகிற்கு'}` : `per ${currentPriceRecord.unit}`}
                        </div>
                        
                        <div className="flex items-center justify-end space-x-1 mt-1.5">
                          {currentPriceRecord.trend === 'up' && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-green-50 text-green-700">
                              <TrendingUp className="h-3 w-3 mr-0.5" /> {getMT('up', language)}
                            </span>
                          )}
                          {currentPriceRecord.trend === 'down' && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-50 text-red-700">
                              <TrendingDown className="h-3 w-3 mr-0.5" /> {getMT('down', language)}
                            </span>
                          )}
                          {currentPriceRecord.trend === 'stable' && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-gray-50 text-gray-600">
                              {getMT('stable', language)}
                            </span>
                          )}
                        </div>
                      </div>
                    ) : (
                      <p className="text-xs text-gray-400 italic">{getMT('no_data', language)}</p>
                    )}
                  </div>

                  {/* 7-Day Historical Trend Graph */}
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider font-mono mb-4 flex items-center space-x-1.5">
                    <BarChart2 className="h-4 w-4 text-emerald-600" />
                    <span>{language === 'ta' ? '7-நாள் சந்தை விலை போக்கு' : '7-Day Price Trend History'}</span>
                  </h4>

                  {cropTrendData.length > 0 ? (
                    <div className="h-[240px] w-full" id="price-trend-chart">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={cropTrendData} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                          <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} tickLine={false} />
                          <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} domain={['auto', 'auto']} />
                          <Tooltip 
                            contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #f1f5f9', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }} 
                            labelStyle={{ fontWeight: 'bold', fontSize: '11px', color: '#1e293b' }}
                          />
                          <Line 
                            type="monotone" 
                            dataKey="விலை" 
                            stroke="#059669" 
                            strokeWidth={3} 
                            dot={{ r: 4, strokeWidth: 2, fill: '#ffffff' }} 
                            activeDot={{ r: 6 }} 
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  ) : (
                    <div className="h-[240px] border border-dashed rounded-3xl flex items-center justify-center text-gray-400 text-xs">
                      {getMT('no_data', language)}
                    </div>
                  )}
                </div>

                <div className="text-[10px] text-gray-400 flex items-center space-x-1.5 mt-6 border-t pt-3">
                  <AlertCircle className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                  <span>{getMT('user_contributed_disclaimer', language)}</span>
                </div>
              </div>

              {/* Right Side: Price Board Listing of all Crops in Selected Market */}
              <div className="bg-white border border-gray-100 p-6 rounded-3xl shadow-xl shadow-gray-50/50 flex flex-col justify-between">
                <div>
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono mb-4 flex items-center space-x-1.5">
                    <Calendar className="h-4 w-4 text-emerald-600" />
                    <span>{getMT('recent_prices_title', language)}</span>
                  </h3>

                  {latestPricesInMarket.length === 0 ? (
                    <p className="text-xs text-gray-400 italic py-6 text-center">{getMT('no_data', language)}</p>
                  ) : (
                    <div className="space-y-3">
                      {latestPricesInMarket.map((record) => (
                        <div key={record.id} className="flex justify-between items-center p-3.5 bg-slate-50 rounded-2xl border border-slate-100/50 hover:bg-slate-100/30 transition-colors">
                          <div>
                            <span className="text-xs font-bold text-slate-800 block">{getLocalizedCrop(record.cropName, language)}</span>
                            <span className="text-[9px] text-slate-400 font-mono">
                              {language === 'ta' ? `அலகு: ${record.unit.includes('Quintal') ? 'குவிண்டால்' : record.unit}` : `unit: ${record.unit}`}
                            </span>
                          </div>

                          <div className="text-right">
                            <span className="text-sm font-extrabold text-slate-900 font-mono block">₹ {record.price}</span>
                            
                            <div className="flex justify-end mt-0.5">
                              {record.trend === 'up' && (
                                <span className="inline-flex items-center text-[9px] font-bold text-green-600">
                                  <TrendingUp className="h-3 w-3 mr-0.5" /> {language === 'ta' ? 'உயர்வு' : 'Up'}
                                </span>
                              )}
                              {record.trend === 'down' && (
                                <span className="inline-flex items-center text-[9px] font-bold text-red-600">
                                  <TrendingDown className="h-3 w-3 mr-0.5" /> {language === 'ta' ? 'சரிவு' : 'Down'}
                                </span>
                              )}
                              {record.trend === 'stable' && (
                                <span className="text-[9px] font-semibold text-gray-400">{language === 'ta' ? 'மாற்றமில்லை' : 'Stable'}</span>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="mt-6 border-t pt-4">
                  <div className="p-3 bg-emerald-50 text-emerald-800 rounded-2xl flex items-start space-x-2 text-[10px] leading-relaxed font-semibold">
                    <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{getMT('government_procurement_disclaimer', language)}</span>
                  </div>
                </div>
              </div>

            </div>

            {/* New Data Visualization Dashboard: Comparative Trends and Market Spread */}
            <div className="bg-slate-50 dark:bg-slate-900/40 p-6 rounded-3xl border border-slate-100 dark:border-slate-800/40 mt-8 space-y-6" id="crop-price-comparison-analytics">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-slate-200/50 dark:border-slate-800/50 pb-4 gap-4">
                <div>
                  <span className="text-[10px] font-extrabold text-emerald-600 dark:text-emerald-450 uppercase tracking-widest font-mono">
                    Advanced Crop Analytics
                  </span>
                  <h3 className="text-lg font-bold text-slate-800 dark:text-slate-150 flex items-center gap-2">
                    <BarChart2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                    <span>{getMT('comparison_title', language)}</span>
                  </h3>
                </div>
                
                {/* Selector for Crop Group */}
                <div className="flex bg-white dark:bg-slate-800 p-1 rounded-xl border border-slate-200/60 dark:border-slate-700/60 shadow-sm self-start sm:self-center">
                  <button
                    onClick={() => setComparisonGroup('food')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      comparisonGroup === 'food' 
                        ? 'bg-emerald-600 text-white shadow-sm' 
                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-700'
                    }`}
                  >
                    {getMT('food_crops', language)}
                  </button>
                  <button
                    onClick={() => setComparisonGroup('commercial')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      comparisonGroup === 'commercial' 
                        ? 'bg-emerald-600 text-white shadow-sm' 
                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-700'
                    }`}
                  >
                    {getMT('commercial_crops', language)}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Card 1: Multi-Crop Price Trend Comparison */}
                <div className="bg-white dark:bg-slate-900 border border-slate-100/80 dark:border-slate-800 p-5 rounded-2xl shadow-sm flex flex-col justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono mb-4 flex items-center justify-between">
                      <span>{comparisonGroup === 'food' ? (language === 'ta' ? 'உணவுப் பயிர்கள் விலை ஒப்பீடு' : 'Food Crops Trend') : (language === 'ta' ? 'வணிகப் பயிர்கள் விலை ஒப்பீடு' : 'Commercial Crops Trend')}</span>
                      <span className="text-[10px] lowercase text-slate-400">({getLocalizedMarket(selectedMarket, language)})</span>
                    </h4>
                    
                    <div className="h-[250px] w-full" id="multi-crop-comparison-chart">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={comparisonData} margin={{ top: 10, right: 10, left: -10, bottom: 5 }}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                          <XAxis dataKey="date" stroke="#94a3b8" fontSize={10} tickLine={false} />
                          <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} domain={['auto', 'auto']} />
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: '#ffffff', 
                              borderRadius: '12px', 
                              border: '1px solid #f1f5f9', 
                              boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                              fontSize: '11px' 
                            }} 
                            labelStyle={{ fontWeight: 'bold', color: '#1e293b' }}
                          />
                          <Legend verticalAlign="top" height={36} iconType="circle" wrapperStyle={{ fontSize: '11px', fontWeight: 'bold' }} />
                          {comparisonGroup === 'food' ? (
                            <>
                              <Line type="monotone" dataKey="Paddy" name={language === 'ta' ? 'நெல் (Paddy)' : 'Paddy'} stroke="#10b981" strokeWidth={2.5} dot={{ r: 3 }} activeDot={{ r: 5 }} />
                              <Line type="monotone" dataKey="Tomato" name={language === 'ta' ? 'தக்காளி (Tomato)' : 'Tomato'} stroke="#ef4444" strokeWidth={2.5} dot={{ r: 3 }} activeDot={{ r: 5 }} />
                              <Line type="monotone" dataKey="Onion" name={language === 'ta' ? 'வெங்காயம் (Onion)' : 'Onion'} stroke="#f59e0b" strokeWidth={2.5} dot={{ r: 3 }} activeDot={{ r: 5 }} />
                            </>
                          ) : (
                            <>
                              <Line type="monotone" dataKey="Turmeric" name={language === 'ta' ? 'மஞ்சள் (Turmeric)' : 'Turmeric'} stroke="#fbbf24" strokeWidth={2.5} dot={{ r: 3 }} activeDot={{ r: 5 }} />
                              <Line type="monotone" dataKey="Coconut" name={language === 'ta' ? 'தேங்காய் (Coconut)' : 'Coconut'} stroke="#06b6d4" strokeWidth={2.5} dot={{ r: 3 }} activeDot={{ r: 5 }} />
                              <Line type="monotone" dataKey="Cotton" name={language === 'ta' ? 'பருத்தி (Cotton)' : 'Cotton'} stroke="#6366f1" strokeWidth={2.5} dot={{ r: 3 }} activeDot={{ r: 5 }} />
                            </>
                          )}
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-4 leading-relaxed italic">
                    * {comparisonGroup === 'food' 
                      ? getMT('food_crops_guideline', language)
                      : getMT('commercial_crops_guideline', language)}
                  </p>
                </div>

                {/* Card 2: Market Price Spread comparison for the selected crop */}
                <div className="bg-white dark:bg-slate-900 border border-slate-100/80 dark:border-slate-800 p-5 rounded-2xl shadow-sm flex flex-col justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono mb-4 flex items-center justify-between">
                      <span>{getMT('market_comparison', language)}</span>
                      <span className="text-[10px] text-emerald-600 dark:text-emerald-450 font-bold">{getLocalizedCrop(selectedCrop, language).split(' / ')[0]}</span>
                    </h4>

                    <div className="h-[250px] w-full" id="market-spread-bar-chart">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={marketSpreadData} margin={{ top: 15, right: 10, left: -10, bottom: 5 }}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                          <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} />
                          <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} domain={['auto', 'auto']} />
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: '#ffffff', 
                              borderRadius: '12px', 
                              border: '1px solid #f1f5f9', 
                              boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                              fontSize: '11px'
                            }}
                            cursor={{ fill: 'rgba(241, 245, 249, 0.4)' }}
                          />
                          <Bar 
                            dataKey="விலை (Price)" 
                            radius={[8, 8, 0, 0]} 
                            barSize={32}
                            name={language === 'ta' ? 'விலை' : 'Price'}
                          >
                            {marketSpreadData.map((entry, index) => {
                              const colors = ['#059669', '#10b981', '#34d399', '#6ee7b7', '#a7f3d0'];
                              return <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />;
                            })}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                  <div className="mt-4 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800 flex items-center space-x-2 text-[10px] text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                    <span className="p-1 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-450 rounded-lg font-bold uppercase tracking-wider font-mono shrink-0">Tip</span>
                    <span>{getMT('market_comparison_guideline', language)}</span>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        </div>
      )}

      {/* =========================================
          SUB-TAB 2: VERIFIED DEALERS & CLASSIFIEDS (Original View)
         ========================================= */}
      {activeSubTab === 'dealers' && (
        <div className="space-y-6" id="dealers-subview">
          {/* Filters bar */}
          <div className="bg-white border border-gray-100 p-4 rounded-3xl shadow-xl shadow-gray-50/50 flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={getMT('search_dealers_placeholder', language)}
                className="w-full border border-gray-200 rounded-xl pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:border-green-500 text-slate-800"
              />
            </div>

            {/* District Filter */}
            <select
              value={selectedDist}
              onChange={(e) => setSelectedDist(e.target.value)}
              className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-green-500 bg-white text-slate-800"
            >
              <option value="">{getMT('all_districts', language)}</option>
              <option value="Thanjavur">{language === 'ta' ? 'தஞ்சாவூர் (Thanjavur)' : 'Thanjavur'}</option>
              <option value="Madurai">{language === 'ta' ? 'மதுரை (Madurai)' : 'Madurai'}</option>
              <option value="Coimbatore">{language === 'ta' ? 'கோயம்புத்தூர் (Coimbatore)' : 'Coimbatore'}</option>
              <option value="Trichy">{language === 'ta' ? 'திருச்சி (Trichy)' : 'Trichy'}</option>
              <option value="Salem">{language === 'ta' ? 'சேலம் (Salem)' : 'Salem'}</option>
            </select>
          </div>

          {/* Grid List */}
          {filteredDealers.length === 0 ? (
            <div className="bg-gray-50 border border-dashed rounded-3xl p-12 text-center text-gray-400">
              <p className="text-sm">{getMT('no_dealers_found', language)}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredDealers.map((dealer) => (
                <div key={dealer.id} className="bg-white border border-gray-100 rounded-3xl p-6 shadow-xl shadow-gray-50/50 flex flex-col justify-between hover:shadow-md transition-shadow relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-5">
                    <ShoppingBag className="h-24 w-24 text-green-600" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="bg-green-50 text-green-700 text-[10px] font-bold px-2 py-0.5 rounded uppercase font-mono">
                          {language === 'ta' ? (dealer.type === 'Fertilizers' ? 'உரங்கள்' : 'பூச்சிக்கொல்லிகள்') : dealer.type}
                        </span>
                        <h3 className="text-base font-bold text-gray-900 mt-2 font-sans">{dealer.name}</h3>
                      </div>
                      <div className="flex items-center space-x-1 text-green-600 text-xs font-semibold">
                        <ShieldCheck className="h-4 w-4" />
                        <span>{getMT('authorized', language)}</span>
                      </div>
                    </div>

                    <p className="text-xs text-gray-500 mt-2 flex items-start space-x-1">
                      <MapPin className="h-3.5 w-3.5 text-green-600 shrink-0 mt-0.5" />
                      <span>{dealer.address}</span>
                    </p>

                    {/* Products available */}
                    <div className="mt-4">
                      <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider font-mono">{getMT('available_inputs', language)}</h4>
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {dealer.items.map((item, idx) => (
                          <span key={idx} className="bg-gray-50 border text-gray-700 text-[10px] font-semibold px-2 py-1 rounded-lg">
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Call dealer */}
                  <div className="border-t pt-4 mt-6 flex items-center justify-between">
                    <span className="text-xs font-bold text-gray-400 font-mono">Call Support:</span>
                    <a
                      href={`tel:${dealer.phone}`}
                      className="inline-flex items-center space-x-1 bg-green-600 hover:bg-green-700 text-white text-xs font-bold px-4 py-2 rounded-xl shadow transition-all"
                    >
                      <Phone className="h-3.5 w-3.5" />
                      <span>{dealer.phone}</span>
                    </a>
                  </div>

                </div>
              ))}
            </div>
          )}
        </div>
      )}

    </div>
  );
}
