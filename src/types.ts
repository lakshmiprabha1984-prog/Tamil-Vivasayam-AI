export interface User {
  uid: string;
  email: string;
  name?: string;
  role: 'farmer' | 'msme' | 'admin';
  farmName?: string;
  district?: string;
  village?: string;
  phone?: string;
  language: 'ta' | 'en' | 'hi' | 'te' | 'kn' | 'ml' | 'mr' | 'bn' | 'gu' | 'pa';
  createdAt?: string;
}

export interface Crop {
  id: string;
  userId: string;
  name: string;
  variety?: string;
  plantedDate?: string;
  farmName?: string;
  healthScore: number;
  location?: string;
  createdAt?: string;
  growthHistory?: Array<{
    week: string;
    health: number;
    growth: number;
  }>;
}

export interface DiseaseHistory {
  id: string;
  userId: string;
  cropId?: string;
  cropName: string;
  diseaseName: string;
  confidence: number;
  severity: 'Low' | 'Medium' | 'High' | 'Severe';
  affectedAreaPct: number;
  description: string;
  cause?: string;
  organicTreatment?: string;
  chemicalTreatment?: string;
  recommendedFertilizer?: string;
  sprayInterval?: string;
  safetyMeasures?: string;
  recoveryTime?: string;
  imageUrl: string;
  createdAt?: string;
}

export interface RecoveryMonitoring {
  id: string;
  diseaseHistoryId: string;
  imageUrl: string;
  status: 'Improved' | 'Stable' | 'Worsened';
  recoveryPct: number;
  createdAt?: string;
}

export interface OutbreakPrediction {
  id: string;
  userId: string;
  crop: string;
  location: string;
  temperature: number;
  humidity: number;
  rainfall: number;
  growthStage: string;
  diseaseRisk: string;
  expectedOutbreak: string;
  riskLevel: 'Low' | 'Medium' | 'High';
  preventionTips: string;
  createdAt?: string;
}

export interface WeatherData {
  location: string;
  temperature: number;
  humidity: number;
  rainfall: number;
  windSpeed: number;
  condition: string;
  forecast: Array<{
    day: string;
    temp: number;
    condition: string;
    risk: 'Low' | 'Medium' | 'High';
  }>;
  diseaseRiskAlert: {
    crop: string;
    alert: string;
    level: 'Low' | 'Medium' | 'High';
  };
}

export interface MarketplaceDealer {
  id: string;
  name: string;
  type: string;
  phone: string;
  address: string;
  dist: string;
  items: string[];
}

export interface GovScheme {
  id: string;
  name: string;
  category: string;
  benefit: string;
  eligibility: string;
  applyLink: string;
  description: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'disease' | 'weather' | 'scheme' | 'system';
  isRead: boolean;
  createdAt?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: Date;
}

export interface CommunityPost {
  id: string;
  userId: string;
  authorName: string;
  title: string;
  content: string;
  category: string;
  likes: number;
  repliesCount: number;
  createdAt?: string;
}

export interface CommunityReply {
  id: string;
  postId: string;
  userId: string;
  authorName: string;
  content: string;
  createdAt?: string;
}

export interface MarketPrice {
  id: string;
  cropName: string;
  marketName: string;
  price: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  priceDate: string;
  createdAt?: string;
}
