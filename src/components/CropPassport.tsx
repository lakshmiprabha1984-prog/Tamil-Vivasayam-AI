import React, { useState } from 'react';
import { Crop, DiseaseHistory } from '../types';
import { Sprout, QrCode, PlusCircle, Calendar, MapPin, Tag, Activity, ChevronRight, Loader2, Sparkles, Clock } from 'lucide-react';

interface CropPassportProps {
  crops: Crop[];
  history: DiseaseHistory[];
  onAddCropSubmit: (name: string, variety: string, farmName: string, plantedDate: string, location: string) => Promise<Crop>;
}

export default function CropPassport({ crops, history, onAddCropSubmit }: CropPassportProps) {
  const [selectedCrop, setSelectedCrop] = useState<Crop | null>(crops[0] || null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [loading, setLoading] = useState(false);

  // Form Fields
  const [name, setName] = useState('');
  const [variety, setVariety] = useState('');
  const [farmName, setFarmName] = useState('');
  const [plantedDate, setPlantedDate] = useState('');
  const [location, setLocation] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !variety) return;
    setLoading(true);
    try {
      const newCrop = await onAddCropSubmit(name, variety, farmName, plantedDate, location);
      setSelectedCrop(newCrop);
      setShowAddForm(false);
      // Reset
      setName('');
      setVariety('');
      setFarmName('');
      setPlantedDate('');
      setLocation('');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const currentCropHistory = selectedCrop ? history.filter(h => h && (h.cropId === selectedCrop.id || (h.cropName && h.cropName.toLowerCase().includes(selectedCrop.name.toLowerCase())))) : [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      
      {/* Header and Add Button */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <span className="bg-green-100 text-green-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider font-mono">
            Crop Health Passport
          </span>
          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight mt-1.5 font-sans">பயிர் சுகாதார பாஸ்போர்ட்</h2>
          <p className="text-xs text-gray-500 mt-1">
            உங்கள் பயிர்களின் முழு வரலாற்றுத் தரவுகள், நோய் வரலாறுகள் மற்றும் டிஜிட்டல் குறியீடுகள் (QR Code).
          </p>
        </div>

        <button
          onClick={() => setShowAddForm(true)}
          className="px-5 py-3 bg-green-600 hover:bg-green-700 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center space-x-1.5 cursor-pointer"
          id="passport-add-btn"
        >
          <PlusCircle className="h-4.5 w-4.5" />
          <span>புதிய பயிர் பதிவு (Register Crop)</span>
        </button>
      </div>

      {/* Grid: Left Column (Crops directory list), Right Column (Passport Detail) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Col: Crops List */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider font-mono">பதிவுசெய்த பயிர்கள் (Your Crops)</h3>
          
          {crops.length === 0 ? (
            <div className="bg-gray-50 border border-dashed rounded-2xl p-6 text-center text-gray-400">
              <p className="text-xs">பயிர்கள் எதுவும் பதிவு செய்யப்படவில்லை.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {crops.map((crop) => (
                <button
                  key={crop.id}
                  onClick={() => setSelectedCrop(crop)}
                  className={`w-full text-left p-4 rounded-2xl border transition-all flex items-center justify-between cursor-pointer ${
                    selectedCrop?.id === crop.id
                      ? 'bg-green-50/50 border-green-500 shadow-sm shadow-green-50'
                      : 'bg-white border-gray-100 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="p-2.5 bg-green-100 text-green-700 rounded-xl">
                      <Sprout className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 text-sm">{crop.name}</h4>
                      <p className="text-[10px] text-gray-500 font-mono">{crop.variety || 'கலப்பினம்'}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <span className={`text-xs font-extrabold font-mono px-2 py-0.5 rounded-full ${
                      crop.healthScore >= 80 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {crop.healthScore}%
                    </span>
                    <ChevronRight className="h-4 w-4 text-gray-400" />
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Col: Health Passport Sheet Details */}
        <div className="lg:col-span-2">
          {selectedCrop ? (
            <div className="bg-white border border-gray-100 rounded-3xl p-6 sm:p-8 shadow-xl shadow-gray-50 space-y-8 animate-fade-in">
              
              {/* Top Banner and QR code */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 border-b pb-6">
                <div>
                  <h3 className="text-2xl font-extrabold text-gray-900 font-sans">{selectedCrop.name}</h3>
                  <p className="text-xs text-gray-500 font-mono mt-1">ID: {selectedCrop.id}</p>
                  
                  <div className="flex flex-wrap gap-3 mt-4 text-xs text-gray-600">
                    <span className="flex items-center space-x-1 px-2.5 py-1 bg-gray-50 border rounded-lg">
                      <Tag className="h-3.5 w-3.5 text-green-600" />
                      <span>வகை: {selectedCrop.variety}</span>
                    </span>
                    <span className="flex items-center space-x-1 px-2.5 py-1 bg-gray-50 border rounded-lg">
                      <Calendar className="h-3.5 w-3.5 text-green-600" />
                      <span>விதைப்பு: {selectedCrop.plantedDate || 'தகவல் இல்லை'}</span>
                    </span>
                    <span className="flex items-center space-x-1 px-2.5 py-1 bg-gray-50 border rounded-lg">
                      <MapPin className="h-3.5 w-3.5 text-green-600" />
                      <span>இடம்: {selectedCrop.location || 'Thanjavur'}</span>
                    </span>
                  </div>
                </div>

                {/* Simulated Agricultural QR Code */}
                <div className="bg-gray-50 border border-gray-100 p-3 rounded-2xl flex flex-col items-center justify-center text-center max-w-xs shrink-0">
                  <div className="bg-white p-2 border rounded-xl">
                    <QrCode className="h-16 w-16 text-gray-900" />
                  </div>
                  <span className="text-[9px] text-gray-400 uppercase font-mono mt-2 tracking-wider">Agronomic Passport QR</span>
                </div>
              </div>

              {/* Health Tracker Timeline */}
              <div className="space-y-4">
                <h4 className="font-bold text-gray-900 text-sm uppercase tracking-wider font-mono flex items-center space-x-1.5">
                  <Activity className="h-4.5 w-4.5 text-green-600" />
                  <span>சுகாதார காலவரிசை (Health Audits & Timelines)</span>
                </h4>

                {currentCropHistory.length === 0 ? (
                  <div className="bg-green-50/50 p-4 rounded-xl border border-green-100 text-xs text-green-950 flex items-center space-x-2">
                    <Sparkles className="h-4 w-4 text-green-600" />
                    <span>இந்த பயிரில் இதுவரை நோய் பாதிப்புகள் எதுவும் கண்டறியப்படவில்லை! ஆரோக்கிய நிலை: மிக நன்று.</span>
                  </div>
                ) : (
                  <div className="relative pl-6 border-l border-gray-200 space-y-6">
                    {currentCropHistory.map((rec) => (
                      <div key={rec.id} className="relative">
                        {/* Dot indicator */}
                        <div className="absolute -left-[31px] top-1.5 bg-red-500 h-2.5 w-2.5 rounded-full ring-4 ring-white"></div>
                        
                        <div>
                          <span className="text-[10px] font-mono font-bold text-gray-400">
                            {rec.createdAt ? new Date(rec.createdAt).toLocaleDateString() : 'டெமோ'}
                          </span>
                          <h5 className="font-bold text-gray-900 text-sm mt-0.5">{rec.diseaseName}</h5>
                          <p className="text-xs text-gray-500 leading-relaxed mt-1">{rec.description}</p>
                          
                          <div className="flex flex-wrap gap-2 mt-2 text-[10px] font-semibold text-gray-600">
                            <span className="px-2 py-0.5 bg-red-50 border border-red-100 rounded text-red-700">
                              தீவிரம்: {rec.severity}
                            </span>
                            <span className="px-2 py-0.5 bg-green-50 border border-green-100 rounded text-green-700">
                              இயற்கை: {rec.organicTreatment}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          ) : (
            <div className="bg-gray-50 border border-dashed rounded-3xl h-80 flex flex-col items-center justify-center p-8 text-center text-gray-400">
              <Sprout className="h-12 w-12 text-gray-300 mb-2 animate-bounce" />
              <p className="text-sm">முடிவுகள் இங்கே காட்டப்படும்.</p>
              <p className="text-[10px] text-gray-400">பயிரைத் தேர்ந்தெடுத்து பாஸ்போர்ட் விவரங்களைப் பார்வையிடவும்.</p>
            </div>
          )}
        </div>

      </div>

      {/* Add Crop Modal Form */}
      {showAddForm && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-6 shadow-2xl relative border animate-fade-in">
            <div className="text-center">
              <h3 className="text-xl font-bold text-gray-900 font-sans">புதிய பயிர் பதிவு (Register Crop)</h3>
              <p className="text-xs text-gray-500 mt-1">டிஜிட்டல் பாஸ்போர்ட் மற்றும் சுகாதார கண்காணிப்பை துவங்க விவரங்களை நிரப்பவும்.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">பயிர் பெயர் (Crop Name)</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Paddy, Tomato, Cotton, etc."
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-green-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">பயிர் இரகம் (Crop Variety)</label>
                <input
                  type="text"
                  required
                  value={variety}
                  onChange={(e) => setVariety(e.target.value)}
                  placeholder="CR 1009 / PKM-1 Hybrid"
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-green-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">பண்ணை பெயர் (Farm Name)</label>
                <input
                  type="text"
                  value={farmName}
                  onChange={(e) => setFarmName(e.target.value)}
                  placeholder="அன்னை இயற்கை பண்ணை"
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-green-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">விதைப்பு தேதி (Planted Date)</label>
                  <input
                    type="date"
                    required
                    value={plantedDate}
                    onChange={(e) => setPlantedDate(e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-green-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">மாவட்டம் (District)</label>
                  <input
                    type="text"
                    required
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Thanjavur"
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-green-500"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="flex-1 py-3 border border-gray-200 text-gray-700 font-semibold rounded-xl text-xs hover:bg-gray-50 cursor-pointer"
                >
                  ரத்து செய் (Cancel)
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl text-xs shadow-md shadow-green-100 transition-all flex items-center justify-center cursor-pointer"
                >
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <span>பதிவு செய் (Save)</span>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
