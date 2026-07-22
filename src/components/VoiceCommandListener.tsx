import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Sparkles, Volume2, HelpCircle, X, ChevronRight, Check } from 'lucide-react';

interface VoiceCommandListenerProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  language: 'ta' | 'en' | 'hi' | 'te' | 'kn' | 'ml' | 'mr' | 'bn' | 'gu' | 'pa';
}

export default function VoiceCommandListener({
  activeTab,
  setActiveTab,
  language
}: VoiceCommandListenerProps) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [matchedCommand, setMatchedCommand] = useState('');
  const [showTips, setShowTips] = useState(false);
  const [isSupported, setIsSupported] = useState(true);

  const recognitionRef = useRef<any>(null);
  const feedbackTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Define commands map
  const commands = [
    {
      tab: 'landing',
      en: ['home', 'go to home', 'landing', 'go to landing', 'welcome'],
      ta: ['முகப்பு', 'முகப்புக்கு போ', 'ஆரம்பம்'],
      labelEn: 'Go to Home / Landing',
      labelTa: 'முகப்பு பக்கத்திற்கு போ'
    },
    {
      tab: 'dashboard',
      en: ['dashboard', 'go to dashboard', 'overview', 'main page'],
      ta: ['டாஷ்போர்டு', 'டாஷ்போர்டு போ', 'பலகை', 'முக்கிய பக்கம்'],
      labelEn: 'Go to Dashboard',
      labelTa: 'டாஷ்போர்டு பக்கத்திற்கு போ'
    },
    {
      tab: 'detect',
      en: ['diagnostics', 'go to diagnostics', 'detect', 'go to detect', 'disease detect', 'disease diagnosis'],
      ta: ['பரிசோதனை', 'பரிசோதனைக்கு போ', 'நோய் கண்டறிதல்', 'பரிசோதனை செய்'],
      labelEn: 'Go to Diagnostics / Detect',
      labelTa: 'நோய் கண்டறிதல் பக்கத்திற்கு போ'
    },
    {
      tab: 'prediction',
      en: ['forecast', 'go to forecast', 'prediction', 'go to prediction', 'outbreak prediction', 'risk prediction'],
      ta: ['முன்கணிப்பு', 'முன்கணிப்புக்கு போ', 'அபாய முன்கணிப்பு'],
      labelEn: 'Go to Risk Predictions',
      labelTa: 'முன்கணிப்பு பக்கத்திற்கு போ'
    },
    {
      tab: 'passport',
      en: ['passport', 'go to passport', 'crop passport', 'register crop', 'my crop'],
      ta: ['பயிர் பாஸ்போர்ட்', 'பாஸ்போர்ட்', 'பயிர் பதிவு'],
      labelEn: 'Go to Crop Passport',
      labelTa: 'பயிர் பாஸ்போர்ட் பக்கத்திற்கு போ'
    },
    {
      tab: 'weather',
      en: ['weather', 'go to weather', 'weather center', 'climate', 'temperature'],
      ta: ['வானிலை', 'வானிலைக்கு போ', 'மழை நிலவரம்'],
      labelEn: 'Go to Weather Center',
      labelTa: 'வானிலை பக்கத்திற்கு போ'
    },
    {
      tab: 'marketplace',
      en: ['marketplace', 'go to marketplace', 'market', 'go to market', 'prices', 'crop prices'],
      ta: ['சந்தை', 'சந்தைக்கு போ', 'விளைபொருள் விலை', 'விலை நிலவரம்'],
      labelEn: 'Go to Marketplace / Prices',
      labelTa: 'சந்தை பக்கத்திற்கு போ'
    },
    {
      tab: 'community',
      en: ['community', 'go to community', 'forum', 'discussion', 'ask experts'],
      ta: ['சமூகம்', 'சமூகத்திற்கு போ', 'மன்றம்', 'விவாதம்'],
      labelEn: 'Go to Community Forum',
      labelTa: 'சமூக மன்றத்திற்கு போ'
    },
    {
      tab: 'schemes',
      en: ['schemes', 'go to schemes', 'government schemes', 'subsidies', 'subsidy'],
      ta: ['திட்டங்கள்', 'திட்டங்களுக்கு போ', 'அரசு திட்டங்கள்', 'மானியம்'],
      labelEn: 'Go to Schemes / Subsidies',
      labelTa: 'அரசு திட்டங்கள் பக்கத்திற்கு போ'
    },
    {
      tab: 'fertilizer',
      en: ['fertilizer', 'fertilizer calculator', 'go to fertilizer', 'calculator'],
      ta: ['உரம்', 'உர கால்குலேட்டர்', 'உர அளவு'],
      labelEn: 'Go to Fertilizer Calculator',
      labelTa: 'உர கால்குலேட்டருக்கு போ'
    },
    {
      tab: 'analytics',
      en: ['analytics', 'go to analytics', 'business analytics', 'msme analytics'],
      ta: ['பகுப்பாய்வு', 'பகுப்பாய்வுக்கு போ', 'வணிக பகுப்பாய்வு'],
      labelEn: 'Go to MSME Analytics',
      labelTa: 'வியாபார பகுப்பாய்வுக்கு போ'
    },
    {
      tab: 'profile',
      en: ['profile', 'go to profile', 'settings', 'my settings'],
      ta: ['சுயவிவரம்', 'சுயவிவரத்திற்கு போ', 'அமைப்பு', 'விவரங்கள்'],
      labelEn: 'Go to Profile Settings',
      labelTa: 'சுயவிவர பக்கத்திற்கு போ'
    }
  ];

  useEffect(() => {
    // Check web speech API support
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setIsSupported(false);
      return;
    }

    const rec = new SpeechRecognition();
    rec.continuous = true;
    rec.interimResults = false;
    rec.maxAlternatives = 1;
    rec.lang = language === 'ta' ? 'ta-IN' : 'en-US';

    rec.onresult = (event: any) => {
      const lastIndex = event.results.length - 1;
      const speechToText = event.results[lastIndex][0].transcript.trim().toLowerCase();

      setTranscript(speechToText);
      processCommand(speechToText);
    };

    rec.onerror = (event: any) => {
      console.warn('Speech recognition error:', event.error);
      if (event.error === 'not-allowed') {
        setIsListening(false);
      }
    };

    rec.onend = () => {
      // Keep listening if user didn't explicitly turn it off
      if (isListening) {
        try {
          rec.start();
        } catch (e) {
          console.warn('Error restarting recognition:', e);
        }
      }
    };

    recognitionRef.current = rec;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, [language]);

  // Adjust recognition language dynamically if language changes while listening
  useEffect(() => {
    if (recognitionRef.current) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        recognitionRef.current.lang = language === 'ta' ? 'ta-IN' : 'en-US';
        if (isListening) {
          // Restart to apply language change
          recognitionRef.current.stop();
        }
      }
    }
  }, [language]);

  // Start or stop listening based on state
  useEffect(() => {
    if (!recognitionRef.current) return;

    if (isListening) {
      try {
        recognitionRef.current.start();
      } catch (e) {
        // Already running or error starting
      }
    } else {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        // Already stopped
      }
    }
  }, [isListening]);

  const processCommand = (text: string) => {
    // Look for keywords in command phrases
    const cleanText = text.replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, "").trim().toLowerCase();

    // Find matching tab
    const match = commands.find(cmd => {
      const matchEn = cmd.en.some(phrase => cleanText.includes(phrase) || phrase.includes(cleanText));
      const matchTa = cmd.ta.some(phrase => cleanText.includes(phrase) || phrase.includes(cleanText));
      return matchEn || matchTa;
    });

    if (match) {
      // Navigate to matched tab
      setActiveTab(match.tab);

      // Visual feedback
      const label = language === 'ta' ? match.labelTa : match.labelEn;
      setMatchedCommand(label);

      // Text to Speech feedback confirmation
      speakConfirmation(match.tab);

      // Clear feedback after a few seconds
      if (feedbackTimeoutRef.current) clearTimeout(feedbackTimeoutRef.current);
      feedbackTimeoutRef.current = setTimeout(() => {
        setMatchedCommand('');
        setTranscript('');
      }, 3000);
    }
  };

  const speakConfirmation = (tab: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();

      let speechText = '';
      if (language === 'ta') {
        if (tab === 'dashboard') speechText = 'டாஷ்போர்டு பக்கம் திறக்கப்படுகிறது';
        else if (tab === 'detect') speechText = 'நோய் கண்டறிதல் பக்கம் திறக்கப்படுகிறது';
        else if (tab === 'prediction') speechText = 'முன்கணிப்பு பக்கம் திறக்கப்படுகிறது';
        else if (tab === 'passport') speechText = 'பயிர் பாஸ்போர்ட் பக்கம் திறக்கப்படுகிறது';
        else if (tab === 'weather') speechText = 'வானிலை பக்கம் திறக்கப்படுகிறது';
        else if (tab === 'marketplace') speechText = 'சந்தை பக்கம் திறக்கப்படுகிறது';
        else if (tab === 'community') speechText = 'சமூக மன்றம் திறக்கப்படுகிறது';
        else if (tab === 'schemes') speechText = 'அரசு திட்டங்கள் பக்கம் திறக்கப்படுகிறது';
        else if (tab === 'fertilizer') speechText = 'உர கால்குலேட்டர் திறக்கப்படுகிறது';
        else if (tab === 'analytics') speechText = 'வியாபார பகுப்பாய்வு திறக்கப்படுகிறது';
        else if (tab === 'profile') speechText = 'சுயவிவர பக்கம் திறக்கப்படுகிறது';
        else speechText = 'முகப்பு பக்கம் திறக்கப்படுகிறது';
      } else {
        speechText = `Navigating to ${tab}`;
      }

      const utterance = new SpeechSynthesisUtterance(speechText);
      utterance.lang = language === 'ta' ? 'ta-IN' : 'en-US';
      utterance.rate = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  };

  const toggleListening = async () => {
    if (!isListening) {
      try {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          await navigator.mediaDevices.getUserMedia({ audio: true });
        }
      } catch (err) {
        console.warn('Microphone permission error in floating listener:', err);
      }
      setTranscript('');
      setMatchedCommand('');
    }
    setIsListening(!isListening);
  };

  if (!isSupported) return null;

  return (
    <div className="fixed bottom-24 right-6 z-50 flex flex-col items-end space-y-2 pointer-events-none" id="global-voice-assistant">

      {/* Speech Feedbacks and Control Panel */}
      {(isListening || transcript || matchedCommand) && (
        <div className="bg-slate-900/95 backdrop-blur-md border border-slate-700/60 text-white rounded-2xl p-4 shadow-2xl max-w-sm w-[280px] sm:w-[320px] pointer-events-auto animate-fade-in space-y-3">

          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <div className="flex items-center space-x-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-400 font-mono">
                {language === 'ta' ? 'குரல் வழி கட்டுப்பாடு' : 'AI Voice Control'}
              </span>
            </div>

            <div className="flex items-center space-x-1">
              <button
                onClick={() => setShowTips(!showTips)}
                className="p-1 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
                title="View Commands / கட்டளைகள்"
              >
                <HelpCircle className="h-4 w-4" />
              </button>
              <button
                onClick={() => setIsListening(false)}
                className="p-1 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Tips Content */}
          {showTips ? (
            <div className="text-[11px] text-slate-300 max-h-40 overflow-y-auto space-y-1.5 pr-1">
              <p className="font-bold text-emerald-400 mb-1">
                {language === 'ta' ? 'இவ்வாறு கூறுங்கள்:' : 'Try saying phrases like:'}
              </p>
              <div className="grid grid-cols-1 gap-1">
                <div className="bg-slate-850 p-1.5 rounded-lg border border-slate-800 flex justify-between items-center text-[10px]">
                  <span>Dashboard / டாஷ்போர்டு</span>
                  <ChevronRight className="h-3 w-3 text-slate-500" />
                </div>
                <div className="bg-slate-850 p-1.5 rounded-lg border border-slate-800 flex justify-between items-center text-[10px]">
                  <span>Marketplace / சந்தை</span>
                  <ChevronRight className="h-3 w-3 text-slate-500" />
                </div>
                <div className="bg-slate-850 p-1.5 rounded-lg border border-slate-800 flex justify-between items-center text-[10px]">
                  <span>Diagnostics / பரிசோதனை</span>
                  <ChevronRight className="h-3 w-3 text-slate-500" />
                </div>
                <div className="bg-slate-850 p-1.5 rounded-lg border border-slate-800 flex justify-between items-center text-[10px]">
                  <span>Weather / வானிலை</span>
                  <ChevronRight className="h-3 w-3 text-slate-500" />
                </div>
                <div className="bg-slate-850 p-1.5 rounded-lg border border-slate-800 flex justify-between items-center text-[10px]">
                  <span>Schemes / திட்டங்கள்</span>
                  <ChevronRight className="h-3 w-3 text-slate-500" />
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-2.5">
              {/* Dynamic Transcript State */}
              <div className="min-h-12 bg-slate-950/80 rounded-xl p-2.5 border border-slate-800/80 flex flex-col justify-center">
                {transcript ? (
                  <p className="text-xs text-slate-200 font-medium italic">
                    "{transcript}"
                  </p>
                ) : (
                  <p className="text-xs text-slate-500 text-center flex items-center justify-center space-x-1.5">
                    <Sparkles className="h-3.5 w-3.5 text-emerald-500/80 animate-pulse" />
                    <span>
                      {language === 'ta' ? 'டாஷ்போர்டு அல்லது சந்தை என கூறவும்...' : 'Say "Go to Marketplace"...'}
                    </span>
                  </p>
                )}
              </div>

              {/* Matched Confirmation */}
              {matchedCommand && (
                <div className="bg-emerald-950/40 border border-emerald-500/30 p-2 rounded-xl flex items-center space-x-2 text-emerald-400 animate-pulse">
                  <Check className="h-4 w-4 shrink-0" />
                  <span className="text-[11px] font-bold tracking-wide">
                    {matchedCommand}
                  </span>
                </div>
              )}
            </div>
          )}

        </div>
      )}

      {/* Primary Floating Action Button */}
      <button
        onClick={toggleListening}
        className={`pointer-events-auto h-14 w-14 rounded-full flex items-center justify-center shadow-2xl border transition-all duration-300 relative cursor-pointer group ${isListening
            ? 'bg-emerald-600 hover:bg-emerald-700 border-emerald-500 text-white animate-pulse'
            : 'bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 border-slate-200/80 dark:border-slate-800 text-slate-700 dark:text-slate-300'
          }`}
        id="voice-command-floating-btn"
        title={language === 'ta' ? 'குரல் கட்டுப்பாடு' : 'Voice Navigation'}
      >
        {isListening ? (
          <>
            {/* Pulsing outer rings */}
            <span className="absolute inset-0 rounded-full bg-emerald-500 opacity-20 animate-ping"></span>
            <Mic className="h-5 w-5" />
          </>
        ) : (
          <MicOff className="h-5 w-5" />
        )}

        {/* Hover label */}
        <span className="absolute right-16 bg-slate-900 text-white text-[10px] font-bold py-1 px-2.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-lg border border-slate-800">
          {language === 'ta' ? 'குரல் வழி கட்டுப்பாடு' : 'Voice Control Tab Nav'}
        </span>
      </button>

    </div>
  );
}
