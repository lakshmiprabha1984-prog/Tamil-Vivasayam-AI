import React, { useState } from 'react';
import { mockHotspots } from '../lib/mockData';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  PieChart, 
  Pie, 
  Cell,
  LineChart,
  Line
} from 'recharts';
import { Users, BarChart2, MapPin, TrendingUp, AlertTriangle, Building, Sprout, ShieldAlert, Sparkles, Sliders, Download } from 'lucide-react';
import { exportToCSV } from '../lib/csvHelper';

export default function MSMEAnalytics() {
  const [selectedHotspot, setSelectedHotspot] = useState<typeof mockHotspots[0] | null>(mockHotspots[0]);

  // Sample Recharts Data
  const monthlyTrends = [
    { month: 'Jan', cases: 120, prevention: 80 },
    { month: 'Feb', cases: 150, prevention: 110 },
    { month: 'Mar', cases: 220, prevention: 130 },
    { month: 'Apr', cases: 310, prevention: 190 },
    { month: 'May', cases: 480, prevention: 290 },
    { month: 'Jun', cases: 540, prevention: 350 },
    { month: 'Jul', cases: 680, prevention: 420 },
  ];

  const diseaseShares = [
    { name: 'Blast Disease (குலை நோய்)', value: 485, color: '#ef4444' },
    { name: 'Early Blight (இலைக்கருகல்)', value: 330, color: '#f59e0b' },
    { name: 'Nutrient Deficiency', value: 185, color: '#10b981' },
    { name: 'Leaf Spot (இலைப்புள்ளி)', value: 120, color: '#3b82f6' }
  ];

  const districtOutbreaks = [
    { dist: 'Thanjavur', cases: 340 },
    { dist: 'Madurai', cases: 210 },
    { dist: 'Trichy', cases: 145 },
    { dist: 'Coimbatore', cases: 120 },
    { dist: 'Tirunelveli', cases: 85 }
  ];

  const handleExportDiseaseShares = () => {
    const filename = 'msme_disease_distribution_share.csv';
    const exportData = diseaseShares.map(item => ({
      disease_name: item.name,
      cases: item.value
    }));
    const headers = [
      { key: 'disease_name', label: 'நோய் பெயர் (Disease Name)' },
      { key: 'cases', label: 'பாதிப்பு வழக்குகள் (Cases Count)' }
    ];
    exportToCSV(exportData, headers, filename);
  };

  const handleExportMonthlyTrends = () => {
    const filename = 'msme_monthly_outbreak_trends.csv';
    const exportData = monthlyTrends.map(item => ({
      month: item.month,
      cases: item.cases,
      prevention: item.prevention
    }));
    const headers = [
      { key: 'month', label: 'மாதம் (Month)' },
      { key: 'cases', label: 'பாதிப்பு வழக்குகள் (Outbreak Cases)' },
      { key: 'prevention', label: 'தடுக்கப்பட்டவை (Prevented Cases)' }
    ];
    exportToCSV(exportData, headers, filename);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      
      {/* Header */}
      <div className="mb-8">
        <span className="bg-blue-100 text-blue-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider font-mono">
          MSME & Policy Maker Portal
        </span>
        <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight mt-1.5 font-sans">வேளாண் பகுப்பாய்வு & நோய் கண்காணிப்பு</h2>
        <p className="text-xs text-gray-500 mt-1">
          உர விநியோகம், பூச்சிக்கொல்லி பங்குகள் மற்றும் நோய் பரவல் விகிதங்களைக் கண்காணிக்கும் கொள்கை வகுப்பாளர்களுக்கான மேலாண்மைப் பலகை.
        </p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 mb-8">
        <div className="bg-white border p-5 rounded-3xl shadow-xl shadow-gray-50/50">
          <p className="text-[10px] text-gray-400 font-mono font-bold uppercase">விவசாயிகள் (Total Farmers)</p>
          <p className="text-2xl font-extrabold text-gray-900 mt-1">1,840+</p>
        </div>
        <div className="bg-white border p-5 rounded-3xl shadow-xl shadow-gray-50/50">
          <p className="text-[10px] text-gray-400 font-mono font-bold uppercase">நோய் வழக்குகள் (Total Cases)</p>
          <p className="text-2xl font-extrabold text-red-600 mt-1">1,120+</p>
        </div>
        <div className="bg-white border p-5 rounded-3xl shadow-xl shadow-gray-50/50">
          <p className="text-[10px] text-gray-400 font-mono font-bold uppercase">பூச்சிக்கொல்லி இருப்பு (Inventory)</p>
          <p className="text-2xl font-extrabold text-green-600 mt-1">84% Stocked</p>
        </div>
        <div className="bg-white border p-5 rounded-3xl shadow-xl shadow-gray-50/50">
          <p className="text-[10px] text-gray-400 font-mono font-bold uppercase">அபாய நிலப்பரப்பு (Risk Hotspots)</p>
          <p className="text-2xl font-extrabold text-yellow-600 mt-1">5 Districts</p>
        </div>
      </div>

      {/* Grid: 1. Live Disease Hotspot Map, 2. Monthly Trend Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        
        {/* Left: Vector Hotspot map */}
        <div className="lg:col-span-2 bg-white border border-gray-100 p-6 rounded-3xl shadow-xl shadow-gray-50/50 flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-gray-900 flex items-center space-x-1.5 mb-2">
              <MapPin className="h-5 w-5 text-red-500" />
              <span>நோய் ஹாட்ஸ்பாட் வரைபடம் (Live Hotspot Map)</span>
            </h3>
            <p className="text-[11px] text-gray-500">தமிழ்நாட்டின் மாவட்டங்களில் பரவும் நோய் அலைகளைக் கண்காணிக்க வரைபடப் புள்ளிகளை அழுத்தவும்.</p>
          </div>

          {/* Custom vector bubble Map container */}
          <div className="relative border-2 border-dashed border-gray-100 rounded-2xl p-4 bg-gray-50/50 h-80 flex items-center justify-center my-6">
            <div className="absolute inset-0 opacity-10 flex items-center justify-center font-bold text-[10rem] select-none text-gray-300 font-sans uppercase">
              TN
            </div>

            {/* Bubble hotspots plot */}
            <div className="relative w-full h-full max-w-sm">
              {mockHotspots.map((spot, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedHotspot(spot)}
                  className={`absolute p-2 rounded-full cursor-pointer transition-all hover:scale-125 hover:z-20 flex flex-col items-center ${
                    selectedHotspot?.district === spot.district
                      ? 'ring-4 ring-red-200 z-10'
                      : ''
                  }`}
                  style={{
                    left: `${((spot.lng - 76.5) / 2.5) * 100}%`,
                    top: `${100 - ((spot.lat - 8.5) / 3.2) * 100}%`
                  }}
                >
                  <span className={`block h-4 w-4 rounded-full ${
                    spot.severity === 'Severe' ? 'bg-red-600 animate-ping' : spot.severity === 'High' ? 'bg-red-500' : 'bg-yellow-500'
                  }`}></span>
                  <span className="block h-4 w-4 rounded-full absolute bg-red-600 opacity-60"></span>
                  <span className="text-[9px] bg-white border font-bold px-1 rounded shadow-sm mt-1 text-gray-800">
                    {spot.district}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Hotspot details hover panel */}
          {selectedHotspot && (
            <div className="bg-red-50/50 border border-red-100 p-4 rounded-2xl flex items-center justify-between text-xs animate-fade-in">
              <div>
                <p className="font-bold text-red-950">மாவட்டம்: {selectedHotspot.district}</p>
                <p className="text-red-800 mt-0.5">தீவிர நோய்: {selectedHotspot.disease} • பதிவான வழக்குகள்: {selectedHotspot.cases}</p>
              </div>
              <span className="px-2 py-0.5 bg-red-600 text-white font-extrabold text-[9px] rounded-full uppercase">
                {selectedHotspot.severity}
              </span>
            </div>
          )}
        </div>

        {/* Right: Pie chart Disease share */}
        <div className="bg-white border border-gray-100 p-6 rounded-3xl shadow-xl shadow-gray-50/50">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-base font-bold text-gray-900 flex items-center space-x-1.5">
              <TrendingUp className="h-5 w-5 text-green-600" />
              <span>நோய் விகிதங்கள் (Disease Distribution)</span>
            </h3>
            <button
              onClick={handleExportDiseaseShares}
              className="p-1.5 border hover:bg-gray-50 rounded-xl transition-all cursor-pointer flex items-center justify-center shadow-sm"
              title="தரவை பதிவிறக்கு (Export CSV)"
            >
              <Download className="h-4 w-4 text-emerald-600" />
            </button>
          </div>

          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={diseaseShares}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {diseaseShares.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Custom legends */}
          <div className="space-y-1.5 mt-2">
            {diseaseShares.map((item, idx) => (
              <div key={idx} className="flex justify-between items-center text-xs">
                <div className="flex items-center space-x-1.5">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }}></span>
                  <span className="text-gray-600 truncate max-w-[140px]">{item.name}</span>
                </div>
                <span className="font-bold text-gray-800">{item.value} cases</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Bottom Grid: Monthly case progression Bar / Line chart */}
      <div className="bg-white border border-gray-100 p-6 rounded-3xl shadow-xl shadow-gray-50/50">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-base font-bold text-gray-900 flex items-center space-x-1.5">
            <BarChart2 className="h-5 w-5 text-green-600" />
            <span>வழக்குகள் மற்றும் முன்னெச்சரிக்கை வரைபடம் (Outbreaks Trend)</span>
          </h3>
          <button
            onClick={handleExportMonthlyTrends}
            className="px-3 py-1.5 border hover:bg-gray-50 text-slate-705 text-xs font-bold rounded-xl transition-all flex items-center space-x-1.5 cursor-pointer shadow-sm"
            title="தரவை பதிவிறக்கு (Export CSV)"
          >
            <Download className="h-4 w-4 text-emerald-600" />
            <span>பதிவிறக்கம் (Export)</span>
          </button>
        </div>

        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={monthlyTrends}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="month" stroke="#9ca3af" fontSize={12} />
              <YAxis stroke="#9ca3af" fontSize={12} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="cases" stroke="#ef4444" strokeWidth={3} name="பாதிப்பு வழக்குகள் (Cases)" />
              <Line type="monotone" dataKey="prevention" stroke="#10b981" strokeWidth={3} name="தடுக்கப்பட்டவை (Prevented)" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
}
