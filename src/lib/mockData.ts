import { GovScheme, MarketplaceDealer, WeatherData, Crop, DiseaseHistory, OutbreakPrediction } from '../types';

export const initialSchemes: GovScheme[] = [
  {
    id: 'sch1',
    name: 'PM-KISAN (பிரதம மந்திரி கிசான் சம்மன் நிதி)',
    category: 'Direct Income Support',
    benefit: '₹6,000 per year in 3 equal installments of ₹2,000 directly transferred to bank accounts.',
    eligibility: 'All small and marginal landholder farmer families across the nation.',
    applyLink: 'https://pmkisan.gov.in/',
    description: 'A central scheme providing income support to farmer families to purchase agricultural inputs and domestic needs.'
  },
  {
    id: 'sch2',
    name: 'PMFBY - Pradhan Mantri Fasal Bima Yojana (பயிர் காப்பீடு)',
    category: 'Crop Insurance',
    benefit: 'Comprehensive insurance coverage against crop failure, pests, diseases, and localized natural calamities.',
    eligibility: 'All farmers growing notified crops in notified areas, including sharecroppers and tenant farmers.',
    applyLink: 'https://pmfby.gov.in/',
    description: 'Protects farmers from financial loss due to unavoidable natural damages. Extremely low premium rates.'
  },
  {
    id: 'sch3',
    name: 'TN Micro Irrigation Subsidy Scheme (நுண்ணீர் பாசன மானியம்)',
    category: 'Irrigation Subsidies',
    benefit: '100% subsidy for small/marginal farmers and 75% subsidy for other farmers to install Drip/Sprinkler systems.',
    eligibility: 'Farmers in Tamil Nadu with valid agricultural land, water source, and matching credentials.',
    applyLink: 'https://www.tnhorticulture.tn.gov.in/',
    description: 'Implements water conservation methods in farming, significantly boosting yield quality and reducing weeding labor.'
  },
  {
    id: 'sch4',
    name: 'NHM - National Horticulture Mission (தோட்டக்கலை இயக்கம்)',
    category: 'Horticulture Development',
    benefit: 'Financial assistance up to 50% for establishing greenhouses, shade nets, cold storage, and organic orchards.',
    eligibility: 'Farmers, farmer groups (FPOs), cooperatives, and entrepreneurs engaged in horticultural crops.',
    applyLink: 'https://midh.gov.in/',
    description: 'Encourages the cultivation of premium crops (fruits, vegetables, flowers, spices, and aromatic herbs) to increase farm revenues.'
  },
  {
    id: 'sch5',
    name: 'KCC - Kisan Credit Card (விவசாய கடன் அட்டை)',
    category: 'Agricultural Credit',
    benefit: 'Concessional crop loans up to ₹3 Lakhs at lower interest rates (4%) with prompt repayment incentive.',
    eligibility: 'All farmers - individuals/joint borrowers, tenant farmers, oral lessees, and sharecroppers.',
    applyLink: 'https://www.sbi.co.in/web/personal-banking/loans/agriculture-loans/kisan-credit-card',
    description: 'Provides timely credit support to farmers to meet their cultivation expenses, post-harvest needs, and domestic consumption.'
  }
];

export const initialDealers: MarketplaceDealer[] = [
  {
    id: 'm1',
    name: 'Vivasayam Organic Inputs (விவசாய இயற்கை இடுபொருட்கள்)',
    type: 'Organic Products',
    phone: '+91 94421 82910',
    address: 'Near Old Bus Stand, Madurai, Tamil Nadu',
    dist: 'Madurai',
    items: ['Neem Seed Kernel Extract', 'Panchagavya (பஞ்சகவ்யா)', 'Pseudomonas Bio-fertilizer', 'Vermicompost']
  },
  {
    id: 'm2',
    name: 'Tamil Nadu Agro Chemicals Ltd.',
    type: 'Pesticide Dealers & Fertilizers',
    phone: '+91 98452 38401',
    address: '22, Main Road, Coimbatore, Tamil Nadu',
    dist: 'Coimbatore',
    items: ['Mancozeb Fungal Spray', 'Tricyclazole 75WP (Blast control)', 'NPK 19:19:19 Fertilizer', 'Urea']
  },
  {
    id: 'm3',
    name: 'CropCare Farm Equipments & Sprayers',
    type: 'Agricultural Equipment',
    phone: '+91 80561 29402',
    address: 'Agri Market Complex, Trichy, Tamil Nadu',
    dist: 'Trichy',
    items: ['Knapsack Battery Sprayer', 'Drip Irrigation Pipes', 'Soil PH Tester', 'Power Weeder']
  },
  {
    id: 'm4',
    name: 'Amman Government Seeds & Agro Centre',
    type: 'Government Approved Products',
    phone: '+91 94883 17409',
    address: 'Collectorate Compound, Salem, Tamil Nadu',
    dist: 'Salem',
    items: ['CR 1009 Paddy Seeds', 'PKM-1 Tomato Seeds', 'Bio-fertilizer tablets', 'Agri Insurance enrollment kit']
  }
];

export const initialWeatherData: WeatherData = {
  location: 'Thanjavur, Tamil Nadu',
  temperature: 29.5,
  humidity: 84,
  rainfall: 185,
  windSpeed: 14.2,
  condition: 'Rainy Clouds / மேகமூட்டம்',
  forecast: [
    { day: 'Mon', temp: 31, condition: 'Sunny', risk: 'Low' },
    { day: 'Tue', temp: 30, condition: 'Cloudy', risk: 'Medium' },
    { day: 'Wed', temp: 28, condition: 'Rainy', risk: 'High' },
    { day: 'Thu', temp: 29, condition: 'Thunderstorm', risk: 'High' },
    { day: 'Fri', temp: 29, condition: 'Rainy', risk: 'High' },
  ],
  diseaseRiskAlert: {
    crop: 'Paddy & Tomato',
    alert: 'HIGH RISK ALERT: Wet leaves and humidity above 80% create an optimal atmosphere for fungal disease outbreaks like Blast and Early Blight. குலை நோய் மற்றும் சாம்பல் நோய் அபாயம் அதிகம் உள்ளது!',
    level: 'High'
  }
};

export const sampleCrops: Crop[] = [
  {
    id: 'crop_sample1',
    userId: 'demo',
    name: 'Paddy (நெல்)',
    variety: 'CR 1009 Sub 1',
    plantedDate: '2026-05-10',
    farmName: 'Annai Farm',
    healthScore: 85,
    location: 'Thanjavur',
    growthHistory: [
      { week: 'W1', health: 90, growth: 12 },
      { week: 'W2', health: 88, growth: 25 },
      { week: 'W3', health: 70, growth: 45 },
      { week: 'W4', health: 75, growth: 62 },
      { week: 'W5', health: 82, growth: 80 },
      { week: 'W6', health: 85, growth: 95 }
    ]
  },
  {
    id: 'crop_sample2',
    userId: 'demo',
    name: 'Tomato (தக்காளி)',
    variety: 'PKM-1 Hybrid',
    plantedDate: '2026-06-01',
    farmName: 'Annai Farm',
    healthScore: 92,
    location: 'Thanjavur',
    growthHistory: [
      { week: 'W1', health: 95, growth: 18 },
      { week: 'W2', health: 94, growth: 36 },
      { week: 'W3', health: 92, growth: 55 },
      { week: 'W4', health: 93, growth: 72 },
      { week: 'W5', health: 91, growth: 88 },
      { week: 'W6', health: 92, growth: 100 }
    ]
  }
];

export const sampleDiseaseHistory: DiseaseHistory[] = [
  {
    id: 'dh_sample1',
    userId: 'demo',
    cropId: 'crop_sample1',
    cropName: 'Paddy (நெல்)',
    diseaseName: 'Blast Disease (குலை நோய்)',
    confidence: 0.94,
    severity: 'High',
    affectedAreaPct: 35.0,
    description: 'Spindle-shaped spots on leaves with gray centers. It spreads quickly during cool nighttime temperatures and high dew.',
    cause: 'Fungus Magnaporthe oryzae, aggravated by high nitrogen fertilizers.',
    organicTreatment: 'Spray Pseudomonas fluorescens @ 10g/liter of water. Use neem cake.',
    chemicalTreatment: 'Apply Tricyclazole 75WP @ 1g/liter of water or Carbendazim @ 1g/liter.',
    recommendedFertilizer: 'Potassium-rich fertilizers (Muriate of Potash) to boost leaf silica and immunity.',
    sprayInterval: '7-10 Days until spots fade.',
    safetyMeasures: 'Wear masks. Refrain from spraying during heavy winds.',
    recoveryTime: '10-14 Days',
    imageUrl: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=400&q=80'
  }
];

export const mockHotspots = [
  { district: 'Thanjavur', lat: 10.7870, lng: 79.1378, disease: 'Blast Disease (குலை நோய்)', severity: 'Severe', cases: 340 },
  { district: 'Madurai', lat: 9.9252, lng: 78.1198, disease: 'Early Blight (இலைக்கருகல் நோய்)', severity: 'High', cases: 210 },
  { district: 'Trichy', lat: 10.7905, lng: 78.7047, disease: 'Blast Disease (குலை நோய்)', severity: 'Medium', cases: 145 },
  { district: 'Coimbatore', lat: 11.0168, lng: 76.9558, disease: 'Early Blight (இலைக்கருகல் நோய்)', severity: 'Medium', cases: 120 },
  { district: 'Tirunelveli', lat: 8.7139, lng: 77.7567, disease: 'Nutrient Deficiency (சத்து குறைபாடு)', severity: 'Low', cases: 85 },
];
