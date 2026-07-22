import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sprout, 
  ShieldCheck, 
  TrendingUp, 
  Users, 
  Brain, 
  Heart, 
  ChevronRight, 
  Award, 
  HelpCircle,
  Play,
  Pause,
  Volume2,
  VolumeX,
  RotateCcw,
  Clock,
  Languages,
  Sparkles
} from 'lucide-react';
import vivasayamLogo from '../assets/images/vivasayam_logo_1784520902395.jpg';

interface LandingPageProps {
  onGetStarted: () => void;
  onWatchDemo: () => void;
}

export default function LandingPage({ onGetStarted, onWatchDemo }: LandingPageProps) {
  const stats = [
    { value: '98.4%', label: 'AI நோய் கண்டறிதல் (Accuracy)' },
    { value: '1,840+', label: 'விவசாயிகள் (Active Farmers)' },
    { value: '4,210+', label: 'கண்டறியப்பட்ட நோய்கள் (Diagnosed)' },
    { value: '40%+', label: 'சேமிக்கப்பட்ட பயிர் இழப்பு (Saved Loss)' }
  ];

  const features = [
    {
      icon: <Brain className="h-6 w-6 text-emerald-600" />,
      title: 'துல்லியமான AI கண்டறிதல்',
      desc: 'உங்கள் பயிரின் இலையைப் புகைப்படம் எடுத்து பதிவேற்றினால், ஒரு நொடியில் நோய் மற்றும் அதன் தீவிரத்தைக் கண்டறியும்.'
    },
    {
      icon: <ShieldCheck className="h-6 w-6 text-emerald-600" />,
      title: 'விளக்கக்கூடிய AI (XAI)',
      desc: 'Grad-CAM தொழில்நுட்பம் மூலம் இலையின் எந்தப் பகுதியைக் கொண்டு நோய் கண்டறியப்பட்டது என்பதை வெப்ப வரைபடம் (Heatmap) மூலம் காட்டும்.'
    },
    {
      icon: <TrendingUp className="h-6 w-6 text-emerald-600" />,
      title: 'பயிர் நோய் முன்கணிப்பு (XGBoost)',
      desc: 'வானிலை, ஈரப்பதம் மற்றும் பயிர் வளர்ச்சி நிலை ஆகியவற்றைக் கொண்டு நோய் பரவும் அபாயத்தை முன்கூட்டியே எச்சரிக்கும்.'
    }
  ];

  const chapters = [
    {
      titleTa: '1. AI நோய் கண்டறிதல்',
      titleEn: '1. AI Leaf Diagnosis',
      descTa: 'உங்கள் பயிரின் இலைகளைப் புகைப்படம் எடுத்து ஒரு நொடியில் நோய் மற்றும் அதன் தீவிரத்தை கண்டறியலாம்.',
      descEn: 'Scan crop leaves with EfficientNet AI to diagnose diseases and view severity in 1 second.',
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-young-farmer-examining-the-crop-growing-in-the-field-40290-large.mp4',
      duration: '0:00 - 0:30',
      narrationTa: 'முதலில், நோய் கண்டறிதல் அம்சம். உழவர்கள் தங்களின் நெல், தக்காளி, பருத்தி போன்ற பயிர்களின் இலைகளைப் புகைப்படம் எடுத்து நேரடியாகப் பதிவேற்றலாம். எங்களின் அதிநவீன செயற்கை நுண்ணறிவு மாதிரி இலைகளின் பாதிப்பை ஒரு நொடியில் பகுப்பாய்வு செய்து, நோயின் பெயர் மற்றும் துல்லியமான தீர்வைக் காட்டும்.',
      narrationEn: 'First, the AI leaf diagnosis. Farmers can snap a photo of crop leaves like paddy, tomato, or cotton. Our advanced EfficientNet deep learning model instantly analyzes the symptoms and provides the precise disease name, severity score, and treatment recommendations.'
    },
    {
      titleTa: '2. நோய் முன்கணிப்பு',
      titleEn: '2. Predictive Modeling',
      descTa: 'வானிலை, ஈரப்பதம் ஆகியவற்றைக் கொண்டு நோய் பரவும் அபாயத்தை முன்கூட்டியே கணிக்கலாம்.',
      descEn: 'Forecast pest and disease outbreak risks using real-time meteorological and soil telemetry.',
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-man-working-with-tablet-in-the-greenhouse-40291-large.mp4',
      duration: '0:30 - 1:00',
      narrationTa: 'இரண்டாவதாக, நோய் முன்கணிப்பு வரைபடம். எக்ஸ்பி பூஸ்ட் அல்காரிதம் மற்றும் வானிலை செயற்கைக்கோள் தரவுகளை ஒருங்கிணைத்து, உங்கள் பகுதியில் அடுத்த சில தினங்களில் பயிர் நோய்கள் பரவும் அபாய விகிதத்தை முன்னெச்சரிக்கையாகக் கணித்து எச்சரிக்கும்.',
      narrationEn: 'Secondly, our predictive outbreak warning engine. By synthesizing weather forecasts, humidity records, and crop growth stages using XGBoost models, the system issues early alerts about disease spreading risks in your micro-region.'
    },
    {
      titleTa: '3. உர கணக்கீடு',
      titleEn: '3. Fertilizer Calculator',
      descTa: 'மண் வகைக்குத் தேவையான தழை, மணி மற்றும் சாம்பல் சத்துக்களைத் துல்லியமாகக் கணக்கிடலாம்.',
      descEn: 'Determine exact Nitrogen, Phosphorus, and Potassium needs based on land size and soil chemistry.',
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-farmer-hands-holding-and-showing-soil-rich-in-nutrients-40292-large.mp4',
      duration: '1:00 - 1:30',
      narrationTa: 'மூன்றாவதாக, புதிய உர கணக்கீடு கருவி. உங்களின் நிலத்தின் பரப்பளவு, மண்ணின் தன்மை மற்றும் தற்போதைய சத்துக்களின் நிலையை உள்ளிட்டால், தமிழ்நாடு வேளாண் பல்கலைக்கழகப் பரிந்துரைப்படி தேவையான யூரியா, சூப்பர் பாஸ்பேட், பொட்டாஷ் பைகளைத் துல்லியமாகக் கணக்கிட்டுத் தரும்.',
      narrationEn: 'Thirdly, the brand-new smart fertilizer calculator. Simply enter your land size, soil type, and current nitrogen-phosphorus-potassium levels to instantly get customized Urea, SSP, and MOP bag recommendations based on verified agronomic standards.'
    },
    {
      titleTa: '4. பகுப்பாய்வு & அறிக்கை',
      titleEn: '4. MSME Analytics & Export',
      descTa: 'பயிர் சுகாதாரப் பதிவுகள் மற்றும் வட்டார நோய் விபரங்களை எக்செல் அல்லது சிஎஸ்வி கோப்பாகப் பதிவிறக்கலாம்.',
      descEn: 'Download local crop timelines and MSME epidemiological chart data directly into clean spreadsheets.',
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-watering-green-plants-in-the-soil-40293-large.mp4',
      duration: '1:30 - 2:00',
      narrationTa: 'நான்காவதாக, தரவு பகுப்பாய்வு மற்றும் பதிவிறக்கம். விவசாயிகள் தங்களின் பயிர் வரலாற்றுப் பதிவுகளையும், வணிகர்கள் தங்களின் வட்டார நோய் பரவல் வரைபடங்களையும் சிஎஸ்வி அல்லது எக்செல் கோப்பாக ஒரே கிளிக்கில் பதிவிறக்கம் செய்து ஆவணப்படுத்திக் கொள்ளலாம்.',
      narrationEn: 'Fourthly, analytics export capabilities. Both farmers tracking crop timelines and MSME coordinators viewing regional outbreak maps can export live chart data and historical records into clean CSV spreadsheet formats with a single click.'
    }
  ];

  const [isPlaying, setIsPlaying] = useState(false);
  const [activeChapter, setActiveChapter] = useState(0);
  const [progress, setProgress] = useState(0); // 0 to 30s per chapter
  const [muted, setMuted] = useState(true);
  const [lang, setLang] = useState<'ta' | 'en'>('ta');
  const [speechActive, setSpeechActive] = useState(true);

  const videoRef = useRef<HTMLVideoElement>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const synthNodesRef = useRef<any[]>([]);

  // Web Audio Context for Live Nature Ambient Music Synthesis
  useEffect(() => {
    if (isPlaying && !muted) {
      try {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        if (!AudioContextClass) return;
        
        const ctx = new AudioContextClass();
        audioCtxRef.current = ctx;

        // 1. Soothing Ambient Drone (Nature Meditative Chords)
        // Tune to peaceful C major (C3 = 130.81Hz, E3 = 164.81Hz, G3 = 196.00Hz, C4 = 261.63Hz)
        const freqs = [130.81, 164.81, 196.00, 261.63];
        const oscs: any[] = [];
        const masterGain = ctx.createGain();
        masterGain.gain.setValueAtTime(0.06, ctx.currentTime);

        freqs.forEach((f, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = i % 2 === 0 ? 'sine' : 'triangle';
          osc.frequency.setValueAtTime(f, ctx.currentTime);
          
          // Add low-frequency breathing modulators
          const lfo = ctx.createOscillator();
          lfo.frequency.setValueAtTime(0.08 + i * 0.03, ctx.currentTime);
          const lfoGain = ctx.createGain();
          lfoGain.gain.setValueAtTime(0.02, ctx.currentTime);
          
          lfo.connect(lfoGain);
          lfoGain.connect(gain.gain);
          
          gain.gain.setValueAtTime(0.03, ctx.currentTime);
          osc.connect(gain);
          gain.connect(masterGain);
          
          osc.start();
          lfo.start();
          oscs.push(osc, lfo, gain, lfoGain);
        });

        // 2. Synthesize Bird Chirps on intervals
        const chirpInterval = setInterval(() => {
          if (ctx.state === 'suspended') return;
          const now = ctx.currentTime;
          const chirpOsc = ctx.createOscillator();
          const chirpGain = ctx.createGain();
          
          chirpOsc.type = 'sine';
          const startFreq = 1800 + Math.random() * 600;
          chirpOsc.frequency.setValueAtTime(startFreq, now);
          chirpOsc.frequency.exponentialRampToValueAtTime(startFreq + 1500, now + 0.08);
          chirpOsc.frequency.exponentialRampToValueAtTime(startFreq - 300, now + 0.16);
          
          chirpGain.gain.setValueAtTime(0, now);
          chirpGain.gain.linearRampToValueAtTime(0.03, now + 0.02);
          chirpGain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);
          
          chirpOsc.connect(chirpGain);
          chirpGain.connect(ctx.destination);
          
          chirpOsc.start();
          chirpOsc.stop(now + 0.18);
        }, 4000);

        // 3. Gentle Rustling Wind (low filter sweep)
        const windOsc = ctx.createOscillator();
        const windGain = ctx.createGain();
        windOsc.type = 'triangle';
        windOsc.frequency.setValueAtTime(90, ctx.currentTime);
        
        const windLfo = ctx.createOscillator();
        windLfo.frequency.setValueAtTime(0.15, ctx.currentTime);
        const windLfoGain = ctx.createGain();
        windLfoGain.gain.setValueAtTime(30, ctx.currentTime);
        
        windLfo.connect(windLfoGain);
        windLfoGain.connect(windOsc.frequency);
        
        windGain.gain.setValueAtTime(0.02, ctx.currentTime);
        windOsc.connect(windGain);
        windGain.connect(masterGain);
        
        windOsc.start();
        windLfo.start();
        oscs.push(windOsc, windLfo, windGain, windLfoGain);

        masterGain.connect(ctx.destination);
        synthNodesRef.current = [masterGain, ...oscs, { stop: () => clearInterval(chirpInterval) }];
      } catch (err) {
        console.warn('AudioContext failed:', err);
      }
    } else {
      cleanupSynth();
    }

    return () => {
      cleanupSynth();
    };
  }, [isPlaying, muted]);

  const cleanupSynth = () => {
    synthNodesRef.current.forEach((node) => {
      try {
        if (typeof node.stop === 'function') {
          node.stop();
        } else if (node.disconnect) {
          node.disconnect();
        }
      } catch (e) {}
    });
    synthNodesRef.current = [];
    if (audioCtxRef.current) {
      audioCtxRef.current.close().catch(() => {});
      audioCtxRef.current = null;
    }
  };

  // Interval timer for 2 minutes walkthrough progress
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 29) {
            // Advancing chapter
            setActiveChapter((prevCh) => {
              const nextCh = (prevCh + 1) % 4;
              if (videoRef.current) {
                videoRef.current.src = chapters[nextCh].videoUrl;
                videoRef.current.load();
                videoRef.current.play().catch(() => {});
              }
              return nextCh;
            });
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  // Handle active speech synthesis
  useEffect(() => {
    if (isPlaying && speechActive) {
      window.speechSynthesis.cancel();
      const text = lang === 'ta' ? chapters[activeChapter].narrationTa : chapters[activeChapter].narrationEn;
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang === 'ta' ? 'ta-IN' : 'en-US';
      utterance.rate = 0.95;
      window.speechSynthesis.speak(utterance);
    } else {
      window.speechSynthesis.cancel();
    }
  }, [activeChapter, speechActive, lang, isPlaying]);

  // Clean speech synthesis on component unmount
  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  const handleSelectChapter = (idx: number) => {
    setActiveChapter(idx);
    setProgress(0);
    if (videoRef.current) {
      videoRef.current.src = chapters[idx].videoUrl;
      videoRef.current.load();
      if (isPlaying) {
        videoRef.current.play().catch(() => {});
      }
    }
  };

  const renderSimulatedScreen = () => {
    switch (activeChapter) {
      case 0: // AI Leaf Diagnosis
        return (
          <div className="absolute inset-0 bg-slate-900 flex flex-col items-center justify-center overflow-hidden">
            {/* Background image of leaf */}
            <img 
              src="https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&q=80&w=800" 
              className="absolute inset-0 w-full h-full object-cover opacity-60 transition-transform duration-1000 transform hover:scale-105"
              alt="Leaf scan"
              referrerPolicy="no-referrer"
            />
            {/* Scan target grid lines */}
            <div className="absolute inset-8 border border-dashed border-emerald-500/30 rounded-2xl flex flex-col justify-between p-4 pointer-events-none">
              <div className="flex justify-between">
                <div className="border-t-2 border-l-2 border-emerald-500 h-4 w-4"></div>
                <div className="border-t-2 border-r-2 border-emerald-500 h-4 w-4"></div>
              </div>
              <div className="flex justify-between">
                <div className="border-b-2 border-l-2 border-emerald-500 h-4 w-4"></div>
                <div className="border-b-2 border-r-2 border-emerald-500 h-4 w-4"></div>
              </div>
            </div>

            {/* Pulsing Scan Laser Line */}
            <motion.div 
              className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_12px_rgba(16,185,129,0.8)] z-10 pointer-events-none"
              animate={{ top: ['15%', '85%', '15%'] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            />

            {/* Glowing detection boxes on leaf spots */}
            <div className="absolute top-[40%] left-[35%] w-24 h-24 border-2 border-dashed border-red-500 rounded-full bg-red-500/15 flex items-center justify-center animate-pulse z-10 pointer-events-none">
              <span className="text-[10px] bg-red-600 text-white font-mono px-1.5 py-0.5 rounded font-black shadow-lg">Early Blight 94%</span>
            </div>

            {/* Interactive Live Scanner Widget at Top Left */}
            <div className="absolute top-16 left-6 bg-slate-950/85 backdrop-blur-md px-3.5 py-2.5 rounded-xl border border-emerald-500/40 text-left font-mono z-20 shadow-xl">
              <div className="text-[10px] text-emerald-400 font-bold flex items-center space-x-1">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                <span>AI Core Engine Active</span>
              </div>
              <div className="text-[9px] text-slate-300 mt-0.5 font-bold">Model: EfficientNet-B4</div>
              <div className="text-[9px] text-slate-300">Resolution: 1024px</div>
            </div>

            {/* Interactive Diagnosis Card bottom right */}
            <motion.div 
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="absolute bottom-20 right-6 bg-slate-900/90 border border-slate-800 p-3.5 rounded-2xl max-w-[210px] text-left shadow-2xl z-20"
            >
              <div className="text-[10px] font-bold text-slate-400">முடிவு (AI Diagnosis):</div>
              <div className="text-xs font-black text-emerald-400 mt-0.5">Early Blight / தக்காளி இலை கருகல் நோய்</div>
              <div className="h-1.5 w-full bg-slate-800 rounded-full mt-2.5 overflow-hidden">
                <div className="h-full bg-emerald-500 w-[94%]" />
              </div>
              <div className="text-[9px] text-slate-400 mt-2 font-semibold">Treatment: Organic Copper Fungicide and dry pruning.</div>
            </motion.div>
          </div>
        );
      case 1: // Predictive Modeling
        return (
          <div className="absolute inset-0 bg-slate-950 flex flex-col items-center justify-center overflow-hidden p-6 text-white">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-slate-950"></div>
            
            {/* Mesh grid background */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:16px_16px]"></div>

            <div className="w-full h-full flex flex-col justify-between relative z-10 pt-14 pb-20 px-4">
              {/* Telemetry Dashboard Widgets */}
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-slate-900/80 border border-slate-800 p-2.5 rounded-2xl text-center shadow-lg">
                  <div className="text-[9px] text-slate-400 font-bold uppercase font-mono">ஈரப்பதம் (Humidity)</div>
                  <div className="text-lg font-black text-emerald-400 mt-0.5 font-mono">88%</div>
                  <div className="text-[8px] text-emerald-500/80 font-bold mt-0.5">▲ Crucial level</div>
                </div>
                <div className="bg-slate-900/80 border border-slate-800 p-2.5 rounded-2xl text-center shadow-lg">
                  <div className="text-[9px] text-slate-400 font-bold uppercase font-mono">வெப்பநிலை (Temp)</div>
                  <div className="text-lg font-black text-sky-400 mt-0.5 font-mono">31.4°C</div>
                  <div className="text-[8px] text-sky-500/80 font-bold mt-0.5">Stable range</div>
                </div>
                <div className="bg-slate-900/80 border border-slate-800 p-2.5 rounded-2xl text-center shadow-lg">
                  <div className="text-[9px] text-slate-400 font-bold uppercase font-mono">மண் ஈரப்பதம் (Soil)</div>
                  <div className="text-lg font-black text-amber-400 mt-0.5 font-mono">74%</div>
                  <div className="text-[8px] text-amber-500/80 font-bold mt-0.5">▲ Wet conditions</div>
                </div>
              </div>

              {/* Central Risk Outbreak Plot Gauge */}
              <div className="my-auto flex flex-col items-center">
                <div className="relative h-20 w-36 flex items-end justify-center overflow-hidden">
                  {/* Gauge Arc Background */}
                  <div className="absolute bottom-0 w-32 h-16 rounded-t-full border-t-[8px] border-l-[8px] border-r-[8px] border-slate-800"></div>
                  {/* Gauge Fill Arc */}
                  <motion.div 
                    initial={{ rotate: -90 }}
                    animate={{ rotate: 55 }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className="absolute bottom-0 w-32 h-16 rounded-t-full border-t-[8px] border-l-[8px] border-r-[8px] border-red-500 origin-bottom"
                  />
                  <div className="text-center pb-2 z-15">
                    <span className="text-[10px] text-slate-400 font-bold">அபாய விகிதம் (Risk)</span>
                    <h3 className="text-xl font-extrabold text-red-500 font-mono">89%</h3>
                  </div>
                </div>

                <motion.div 
                  animate={{ scale: [1, 1.03, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="mt-3 bg-red-950/80 border border-red-800/80 px-4 py-2 rounded-2xl text-center max-w-sm"
                >
                  <p className="text-[10px] font-bold text-red-400">உயர் நோய் எச்சரிக்கை! (Late Blight High Risk)</p>
                  <p className="text-[9px] text-slate-300 mt-0.5">அடுத்த 48 மணிநேரத்திற்குள் நோய் பரவும் அபாயம் உள்ளது.</p>
                </motion.div>
              </div>
            </div>
          </div>
        );
      case 2: // Fertilizer Calculator
        return (
          <div className="absolute inset-0 bg-slate-900 flex flex-col items-center justify-center overflow-hidden text-white p-6">
            <div className="absolute inset-0 bg-gradient-to-tr from-slate-950 via-slate-900 to-emerald-950/20"></div>
            
            <div className="w-full h-full flex flex-col justify-between relative z-10 pt-14 pb-20">
              {/* Soil Chemistry Input Mock */}
              <div className="bg-slate-950/80 border border-slate-800 p-3 rounded-2xl mx-4">
                <div className="flex justify-between items-center border-b border-slate-800 pb-2 mb-2">
                  <span className="text-[10px] font-bold text-slate-400">மண் பரிசோதனை அளவு (NPK Targets)</span>
                  <span className="text-[8px] bg-emerald-900/60 border border-emerald-700 text-emerald-400 px-1.5 py-0.5 rounded">TNAU Guidelines</span>
                </div>
                <div className="grid grid-cols-3 gap-2 font-mono">
                  <div className="bg-slate-900 px-2 py-1.5 rounded-xl border border-slate-800">
                    <span className="text-[8px] text-slate-400">தழைச்சத்து N</span>
                    <div className="text-xs font-black text-emerald-400">120 kg/ha</div>
                  </div>
                  <div className="bg-slate-900 px-2 py-1.5 rounded-xl border border-slate-800">
                    <span className="text-[8px] text-slate-400">மணிச்சத்து P</span>
                    <div className="text-xs font-black text-emerald-400">60 kg/ha</div>
                  </div>
                  <div className="bg-slate-900 px-2 py-1.5 rounded-xl border border-slate-800">
                    <span className="text-[8px] text-slate-400">சாம்பல்சத்து K</span>
                    <div className="text-xs font-black text-emerald-400">90 kg/ha</div>
                  </div>
                </div>
              </div>

              {/* Recommended Sacks Counters */}
              <div className="mx-4 flex flex-col space-y-2.5">
                <span className="text-[10px] font-bold text-slate-300">தேவையான உரம் (Recommended Bags):</span>
                
                <div className="space-y-2">
                  <div className="bg-slate-950/80 border border-slate-800 p-2.5 rounded-xl flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <div className="h-6 w-6 bg-emerald-950 border border-emerald-800 rounded text-emerald-400 flex items-center justify-center font-bold text-[10px]">U</div>
                      <span className="text-[11px] font-bold">யூரியா உரம் (Urea - 46% N)</span>
                    </div>
                    <motion.span 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-xs font-black text-emerald-400 font-mono"
                    >
                      3.5 மூட்டைகள் (Bags)
                    </motion.span>
                  </div>

                  <div className="bg-slate-950/80 border border-slate-800 p-2.5 rounded-xl flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <div className="h-6 w-6 bg-blue-950 border border-blue-800 rounded text-blue-400 flex items-center justify-center font-bold text-[10px]">P</div>
                      <span className="text-[11px] font-bold">சூப்பர் பாஸ்பேட் (SSP - 16% P)</span>
                    </div>
                    <motion.span 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-xs font-black text-blue-400 font-mono"
                    >
                      1.2 மூட்டைகள் (Bags)
                    </motion.span>
                  </div>

                  <div className="bg-slate-950/80 border border-slate-800 p-2.5 rounded-xl flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <div className="h-6 w-6 bg-purple-950 border border-purple-800 rounded text-purple-400 flex items-center justify-center font-bold text-[10px]">K</div>
                      <span className="text-[11px] font-bold">பொட்டாஷ் உரம் (MOP - 60% K)</span>
                    </div>
                    <motion.span 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-xs font-black text-purple-400 font-mono"
                    >
                      2.1 மூட்டைகள் (Bags)
                    </motion.span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 3: // MSME Analytics & Export
        return (
          <div className="absolute inset-0 bg-slate-950 flex flex-col justify-between overflow-hidden text-white p-6">
            <div className="absolute inset-0 bg-gradient-to-b from-slate-900 to-slate-950"></div>
            
            <div className="w-full h-full flex flex-col justify-between relative z-10 pt-14 pb-20">
              
              {/* Mini Epidemiology Graph Simulation */}
              <div className="mx-4 bg-slate-900/90 border border-slate-800 p-3 rounded-2xl text-left">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider font-mono">Epidemiological Outbreak Map</span>
                  <span className="text-[8px] font-mono bg-amber-950 text-amber-400 px-1.5 py-0.5 rounded border border-amber-900">Live Telemetry</span>
                </div>
                
                {/* Simulated Bar Graph */}
                <div className="h-14 flex items-end justify-between px-2 pt-2 border-b border-slate-800 font-mono text-[8px] text-slate-500">
                  <div className="flex flex-col items-center w-6">
                    <motion.div initial={{ height: 0 }} animate={{ height: '42%' }} className="w-3 bg-red-500/80 rounded-t-sm" />
                    <span className="mt-1">Ndl</span>
                  </div>
                  <div className="flex flex-col items-center w-6">
                    <motion.div initial={{ height: 0 }} animate={{ height: '78%' }} className="w-3 bg-red-500/80 rounded-t-sm" />
                    <span className="mt-1">Cbe</span>
                  </div>
                  <div className="flex flex-col items-center w-6">
                    <motion.div initial={{ height: 0 }} animate={{ height: '94%' }} className="w-3 bg-red-500/80 rounded-t-sm" />
                    <span className="mt-1">Slm</span>
                  </div>
                  <div className="flex flex-col items-center w-6">
                    <motion.div initial={{ height: 0 }} animate={{ height: '58%' }} className="w-3 bg-red-500/80 rounded-t-sm" />
                    <span className="mt-1">Mdu</span>
                  </div>
                  <div className="flex flex-col items-center w-6">
                    <motion.div initial={{ height: 0 }} animate={{ height: '31%' }} className="w-3 bg-red-500/80 rounded-t-sm" />
                    <span className="mt-1">Tjv</span>
                  </div>
                </div>
              </div>

              {/* CSV Download Floating Card Prompt */}
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="mx-6 bg-emerald-950/80 border border-emerald-800 p-4 rounded-2xl text-center shadow-xl shadow-emerald-950/40"
              >
                <div className="h-8 w-8 bg-emerald-600 rounded-full flex items-center justify-center mx-auto mb-2.5">
                  <motion.span 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 150 }}
                    className="text-white font-bold"
                  >
                    ✓
                  </motion.span>
                </div>
                <h4 className="text-xs font-bold text-white">பதிவிறக்கம் நிறைவடைந்தது!</h4>
                <p className="text-[10px] text-emerald-300 mt-1">msme_outbreak_trends.csv exported successfully with TNAU headers.</p>
              </motion.div>

            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-[#F1F5F9]">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-b from-white via-slate-50 to-[#F1F5F9] py-20 sm:py-24">
        {/* Animated green backdrop elements */}
        <div className="absolute top-1/2 left-1/2 -z-10 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-100/40 blur-3xl"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex justify-center mb-6">
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, type: "spring" }}
              className="relative h-28 w-28 p-1.5 bg-white dark:bg-slate-900 rounded-3xl overflow-hidden shadow-xl border border-emerald-100 dark:border-slate-800 flex items-center justify-center"
            >
              <img 
                src={vivasayamLogo} 
                alt="Tamil Vivasayam AI Logo" 
                className="h-full w-full object-cover rounded-2xl" 
                referrerPolicy="no-referrer"
              />
            </motion.div>
          </div>

          <div className="inline-flex items-center space-x-1.5 bg-emerald-50 text-emerald-800 border border-emerald-100/60 px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider mb-6 shadow-sm">
            <Sprout className="h-4 w-4 text-emerald-600 animate-bounce" />
            <span>பயிரைக் காப்போம், எதிர்காலத்தை வளர்ப்போம்</span>
          </div>
          
          <h1 className="text-4xl sm:text-6xl font-extrabold text-slate-900 tracking-tight leading-none mb-6">
            தமிழ் விவசாயம் <span className="text-emerald-600">AI</span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500 text-3xl sm:text-4xl block mt-3 font-semibold">
              Predict • Protect • Prosper
            </span>
          </h1>
          
          <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-600 leading-relaxed mb-8 font-medium">
            விவசாயிகளுக்கு ஓர் அதிநவீன AI தளம். உங்கள் பயிர்களின் இலைகளைப் புகைப்படம் எடுத்து நோய் கண்டறியுங்கள், சிறந்த இயற்கை மற்றும் வேதியியல் சிகிச்சைகளைப் பெற்று மகசூலை அதிகரிக்கவும்.
          </p>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <button
              onClick={onGetStarted}
              className="w-full sm:w-auto px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl shadow-lg shadow-emerald-100 hover:scale-[1.02] transition-all flex items-center justify-center space-x-2 cursor-pointer"
              id="landing-get-started-btn"
            >
              <span>இன்றே தொடங்கங்கள் (Get Started)</span>
              <ChevronRight className="h-5 w-5" />
            </button>
            <button
              onClick={onWatchDemo}
              className="w-full sm:w-auto px-8 py-4 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-bold rounded-2xl shadow-sm transition-all flex items-center justify-center space-x-2 cursor-pointer"
              id="landing-watch-demo-btn"
            >
              <span>செய்முறை விளக்கம் (Watch Demo)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-slate-900 text-white py-12 border-y border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, idx) => (
              <div key={idx} className="space-y-1">
                <p className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">{stat.value}</p>
                <p className="text-xs text-slate-400 font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 sm:py-24" id="features">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">எங்கள் முக்கிய அம்சங்கள் (Features)</h2>
            <p className="text-sm text-slate-500 mt-2">விவசாயிகளுக்கு உதவும் அதிநவீன செயற்கை நுண்ணறிவு தொழில்நுட்பங்கள்</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feat, idx) => (
              <div key={idx} className="bg-white border border-slate-200/60 p-6 rounded-3xl shadow-sm hover:shadow-md transition-all hover:scale-[1.01]">
                <div className="p-3 bg-emerald-50 w-fit rounded-2xl mb-4">
                  {feat.icon}
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">{feat.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed font-medium">{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Demo Video Section */}
      <div className="py-16 bg-white border-t border-slate-200/60 dark:bg-slate-950 dark:border-slate-800/80" id="demo-video">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-12 animate-fade-in">
            <span className="bg-emerald-100 dark:bg-emerald-950/40 text-emerald-850 dark:text-emerald-450 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider font-mono">
              2-Minute AI Presentation
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-3">
              செயல்முறை விளக்கம் (Interactive Product Walkthrough)
            </h2>
            <p className="text-xs text-slate-500 max-w-xl mx-auto mt-2">
              CropCare AI எவ்வாறு 2 நிமிடங்களில் நோய் கண்டறிதல், முன்கணிப்பு, உர மேலாண்மை மற்றும் பகுப்பாய்வு செய்கிறது என்பதைக் காணுங்கள்.
            </p>
          </div>

          {/* Interactive Player Layout with Motion Animations */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            
            {/* Player viewport (Left 7 Columns) with initial entrance animation */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="lg:col-span-7 flex flex-col justify-between bg-slate-950 rounded-3xl overflow-hidden border border-slate-800 shadow-2xl relative"
            >
              
              {/* Top Bar Indicators */}
              <div className="absolute top-0 inset-x-0 bg-gradient-to-b from-black/80 to-transparent p-4 z-10 flex justify-between items-center text-xs text-white">
                <div className="flex items-center space-x-2 font-mono">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span className="font-bold uppercase tracking-wider text-[10px]">
                    {lang === 'ta' ? 'அத்தியாயம்' : 'Chapter'} {activeChapter + 1}/4
                  </span>
                </div>
                <div className="text-[11px] font-mono font-bold bg-slate-900/85 px-2.5 py-1 rounded-lg border border-slate-800">
                  {Math.floor((activeChapter * 30 + progress) / 60)}:
                  {String((activeChapter * 30 + progress) % 60).padStart(2, '0')} / 2:00
                </div>
              </div>

              {/* Video Element Viewport */}
              <div className="aspect-video relative w-full overflow-hidden flex items-center justify-center">
                {renderSimulatedScreen()}

                {/* Floating Audio Activity Equalizer Badges */}
                <div className="absolute top-16 right-4 flex flex-col space-y-1.5 z-20 pointer-events-none">
                  {isPlaying && !muted && (
                    <div className="flex items-center space-x-1.5 bg-emerald-950/85 backdrop-blur-sm border border-emerald-500/30 px-2.5 py-1 rounded-xl text-[9px] font-mono font-bold text-emerald-400 shadow-lg shadow-black/40">
                      <span className="flex items-end space-x-0.5 h-3">
                        <span className="w-0.5 bg-emerald-400 animate-pulse rounded-full" style={{ height: '50%', animationDuration: '0.6s' }}></span>
                        <span className="w-0.5 bg-emerald-400 animate-pulse rounded-full" style={{ height: '90%', animationDuration: '0.4s' }}></span>
                        <span className="w-0.5 bg-emerald-400 animate-pulse rounded-full" style={{ height: '30%', animationDuration: '0.8s' }}></span>
                      </span>
                      <span>{lang === 'ta' ? 'அம்பியேண்ட் இசை ஒலி' : 'Nature Ambient Synth'}</span>
                    </div>
                  )}

                  {isPlaying && speechActive && (
                    <div className="flex items-center space-x-1.5 bg-blue-950/85 backdrop-blur-sm border border-blue-500/30 px-2.5 py-1 rounded-xl text-[9px] font-mono font-bold text-blue-400 shadow-lg shadow-black/40">
                      <span className="flex items-end space-x-0.5 h-3">
                        <span className="w-0.5 bg-blue-400 animate-pulse rounded-full" style={{ height: '80%', animationDuration: '0.5s' }}></span>
                        <span className="w-0.5 bg-blue-400 animate-pulse rounded-full" style={{ height: '40%', animationDuration: '0.7s' }}></span>
                        <span className="w-0.5 bg-blue-400 animate-pulse rounded-full" style={{ height: '100%', animationDuration: '0.4s' }}></span>
                      </span>
                      <span>{lang === 'ta' ? 'ஏஐ குரல் விளக்கம்' : 'AI Speech Voice ON'}</span>
                    </div>
                  )}
                </div>

                {/* Subtitle Captions Overlay on Video with Framer Motion Transition */}
                <div className="absolute bottom-4 inset-x-4 bg-black/85 backdrop-blur-md px-4 py-3 rounded-2xl text-center border border-white/10 select-none pointer-events-none transition-all duration-300 z-30">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeChapter}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                    >
                      <p className="text-xs sm:text-sm font-bold text-emerald-400">
                        {lang === 'ta' ? chapters[activeChapter].titleTa : chapters[activeChapter].titleEn}
                      </p>
                      <p className="text-[11px] sm:text-xs text-white leading-relaxed mt-1 font-medium max-w-lg mx-auto">
                        {lang === 'ta' ? chapters[activeChapter].narrationTa : chapters[activeChapter].narrationEn}
                      </p>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>

              {/* Player Custom Control bar */}
              <div className="bg-slate-900/90 border-t border-slate-800 p-4">
                
                {/* 2-Min Continuous Progress Slider */}
                <div className="relative w-full h-1.5 bg-slate-800 rounded-full mb-4 cursor-pointer overflow-hidden">
                  <motion.div 
                    className="absolute h-full bg-emerald-500"
                    animate={{ width: `${((activeChapter * 30 + progress) / 120) * 100}%` }}
                    transition={{ duration: 0.3, ease: "linear" }}
                  />
                  {/* Ticks at 30s intervals */}
                  {[30, 60, 90].map((t) => (
                    <div 
                      key={t}
                      className="absolute top-0 bottom-0 w-0.5 bg-slate-950"
                      style={{ left: `${(t / 120) * 100}%` }}
                    />
                  ))}
                </div>

                {/* Buttons and toggles */}
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                  
                  {/* Playback Controls */}
                  <div className="flex items-center space-x-3">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        const nextIsPlaying = !isPlaying;
                        setIsPlaying(nextIsPlaying);
                        if (nextIsPlaying) {
                          setMuted(false);
                          setSpeechActive(true);
                          videoRef.current?.play().catch(() => {});
                        } else {
                          videoRef.current?.pause();
                        }
                      }}
                      className="h-10 w-10 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center transition-all cursor-pointer shadow-lg shadow-emerald-950/40"
                    >
                      {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 fill-white ml-0.5" />}
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        setProgress(0);
                        setActiveChapter(0);
                        if (videoRef.current) {
                          videoRef.current.src = chapters[0].videoUrl;
                          videoRef.current.load();
                          if (isPlaying) videoRef.current.play().catch(() => {});
                        }
                      }}
                      className="h-9 w-9 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition-all cursor-pointer"
                      title={lang === 'ta' ? 'மீண்டும் தொடங்கு' : 'Restart Walkthrough'}
                    >
                      <RotateCcw className="h-4 w-4" />
                    </motion.button>
                  </div>

                  {/* Narration & Voice configuration */}
                  <div className="flex items-center gap-2.5 flex-wrap justify-center">
                    
                    {/* Language Switch */}
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setLang(prev => prev === 'ta' ? 'en' : 'ta')}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl transition-all flex items-center space-x-1 border border-slate-700 cursor-pointer"
                    >
                      <Languages className="h-3.5 w-3.5 text-emerald-400" />
                      <span>{lang === 'ta' ? 'English Narration' : 'தமிழ் உரைவிளக்கம்'}</span>
                    </motion.button>

                    {/* AI Read Aloud Voice Toggle */}
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSpeechActive(!speechActive)}
                      className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all flex items-center space-x-1 border cursor-pointer ${
                        speechActive
                          ? 'bg-emerald-900 border-emerald-700 text-emerald-200 animate-pulse'
                          : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                      }`}
                      title={lang === 'ta' ? 'ஏஐ குரல் மூலம் கேட்க' : 'Listen with AI voice synthesis'}
                    >
                      <Volume2 className="h-3.5 w-3.5" />
                      <span>{speechActive ? (lang === 'ta' ? 'குரல் ஒலிக்கிறது' : 'AI Voice ON') : (lang === 'ta' ? 'குரல் வழி கேட்க' : 'Listen AI Voice')}</span>
                    </motion.button>

                    {/* Video Mute (Music) */}
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setMuted(!muted)}
                      className="h-9 w-9 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition-all cursor-pointer"
                      title={muted ? 'Unmute Background' : 'Mute Background'}
                    >
                      {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                    </motion.button>
                  </div>

                </div>

              </div>

            </motion.div>

            {/* Chapters list and narration panels (Right 5 Columns) */}
            <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
              
              <div className="space-y-3">
                <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider font-mono flex items-center space-x-1.5">
                  <Clock className="h-4 w-4 text-emerald-500" />
                  <span>2-Minute Chapters</span>
                </span>
                
                {/* Scrollable Chapter Stack with Animated Item Selection */}
                <div className="space-y-2.5">
                  {chapters.map((ch, idx) => (
                    <motion.button
                      key={idx}
                      whileHover={{ scale: 1.015, x: 2 }}
                      whileTap={{ scale: 0.985 }}
                      onClick={() => handleSelectChapter(idx)}
                      className={`w-full text-left p-3.5 rounded-2xl border transition-all duration-300 flex items-start space-x-3 cursor-pointer ${
                        activeChapter === idx
                          ? 'bg-emerald-50/75 border-emerald-500 dark:bg-emerald-950/20 dark:border-emerald-800 shadow-md shadow-emerald-50'
                          : 'bg-white border-slate-200/70 hover:bg-slate-50 dark:bg-slate-900/30 dark:border-slate-800/80'
                      }`}
                    >
                      <span className={`h-6 w-6 rounded-full text-xs font-black flex items-center justify-center shrink-0 mt-0.5 ${
                        activeChapter === idx
                          ? 'bg-emerald-600 text-white animate-pulse'
                          : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
                      }`}>
                        {idx + 1}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex justify-between items-center gap-2">
                          <h4 className={`text-xs font-bold truncate ${activeChapter === idx ? 'text-emerald-900 dark:text-emerald-400' : 'text-slate-800 dark:text-slate-200'}`}>
                            {lang === 'ta' ? ch.titleTa : ch.titleEn}
                          </h4>
                          <span className="text-[9px] font-mono font-extrabold bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-1.5 py-0.5 rounded">
                            {ch.duration}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 mt-1 font-semibold leading-relaxed">
                          {lang === 'ta' ? ch.descTa : ch.descEn}
                        </p>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>

            </div>

          </div>

        </div>
      </div>

      {/* Why CropCare AI Section */}
      <div className="bg-[#E2E8F0]/40 py-16 sm:py-24" id="about">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-emerald-600 text-xs font-bold uppercase tracking-wider font-mono">Why Choose Us</span>
              <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-2 mb-6">
                ஏன் CropCare AI ஐத் தேர்ந்தெடுக்க வேண்டும்?
              </h2>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-3 bg-white p-4 rounded-2xl border border-slate-200/50 shadow-sm">
                  <div className="p-2 bg-emerald-50 border border-emerald-100 rounded-xl text-emerald-600 shrink-0">
                    <Award className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">பிராந்திய மொழிகள் ஆதரவு (Multilingual Support)</h4>
                    <p className="text-xs text-slate-600 mt-0.5 font-medium">தமிழ், ஆங்கிலம், தெலுங்கு, இந்தி, கன்னடம் மற்றும் மலையாளம் ஆகிய மொழிகளில் குரல் மற்றும் உரை வழி உதவி.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 bg-white p-4 rounded-2xl border border-slate-200/50 shadow-sm">
                  <div className="p-2 bg-emerald-50 border border-emerald-100 rounded-xl text-emerald-600 shrink-0">
                    <Users className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">சந்தை மற்றும் டீலர் இணைப்பு (Marketplace Coordination)</h4>
                    <p className="text-xs text-slate-600 mt-0.5 font-medium">பரிந்துரைக்கப்பட்ட உரங்கள் மற்றும் பூச்சிக்கொல்லிகளை விற்பனை செய்யும் அருகில் உள்ள அரசு அங்கீகாரம் பெற்ற கடைகளை கண்டறியலாம்.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 bg-white p-4 rounded-2xl border border-slate-200/50 shadow-sm">
                  <div className="p-2 bg-emerald-50 border border-emerald-100 rounded-xl text-emerald-600 shrink-0">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">பயிர் சுகாதார பாஸ்போர்ட் (Health Timeline)</h4>
                    <p className="text-xs text-slate-600 mt-0.5 font-medium">உங்கள் பயிரின் விதைப்பு முதல் அறுவடை வரை உள்ள முழு சுகாதார வரலாறு மற்றும் தரம் பற்றிய டிஜிட்டல் பாஸ்போர்ட்.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Illustration block instead of real image frames to keep size small */}
            <div className="bg-gradient-to-br from-emerald-600 to-teal-500 rounded-3xl p-8 text-white shadow-xl shadow-emerald-100/50 relative overflow-hidden h-80 flex flex-col justify-between">
              <div className="absolute -top-10 -right-10 bg-white/10 h-40 w-40 rounded-full blur-2xl"></div>
              <div>
                <span className="text-[10px] font-mono uppercase bg-white/20 px-2.5 py-0.5 rounded-full font-bold">AI Core Diagnosis</span>
                <h3 className="text-2xl font-black mt-3 font-sans">எண்ணிம பயிர் பாதுகாப்பு</h3>
                <p className="text-xs text-emerald-50 mt-2 leading-relaxed">
                  EfficientNet & Grad-CAM போன்ற நவீன நியூரல் நெட்வொர்க் கட்டமைப்புகளை கொண்டு நோய் பாதிப்பு விகிதம் மற்றும் குணமடையும் நேரத்தை தானியங்கி முறையில் கணக்கிடுகிறது.
                </p>
              </div>
              <div className="flex items-center space-x-3 bg-white/10 p-3 rounded-2xl border border-white/10 backdrop-blur-sm">
                <div className="h-10 w-10 bg-white/20 rounded-xl border border-white/20 flex items-center justify-center font-bold font-mono">98%</div>
                <div className="text-xs font-bold text-slate-100">மருத்துவத் துல்லியம் வெற்றிகரமாக நிரூபிக்கப்பட்டுள்ளது</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
