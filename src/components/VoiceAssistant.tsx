import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Volume2, VolumeX, AlertCircle, Languages, Sparkles, Send, Loader2, RefreshCw } from 'lucide-react';

export default function VoiceAssistant() {
  const [isListening, setIsListening] = useState(false);
  const [text, setText] = useState('');
  const [response, setResponse] = useState('');
  const [lang, setLang] = useState('ta-IN'); // Tamil India default
  const [supported, setSupported] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [inputText, setInputText] = useState('');

  const languages = [
    { code: 'ta-IN', name: 'தமிழ் (Tamil)' },
    { code: 'en-IN', name: 'English (India)' },
    { code: 'hi-IN', name: 'हिन्दी (Hindi)' },
    { code: 'te-IN', name: 'తెలుగు (Telugu)' },
    { code: 'kn-IN', name: 'ಕನ್ನಡ (Kannada)' },
    { code: 'ml-IN', name: 'മലയാളം (Malayalam)' }
  ];

  const quickPrompts: Record<string, string[]> = {
    'ta-IN': [
      'பயிரில் பூச்சி தாக்குதலை தடுப்பது எப்படி?',
      'தக்காளி இலைக்கருகல் நோய்க்கு என்ன மருந்து?',
      'மண்ணின் வளத்தை உயர்த்த இயற்கை வழி என்ன?',
      'பிரதமர் கிசான் திட்டம் பற்றி கூறுங்கள்'
    ],
    'en-IN': [
      'How to control pests in crops naturally?',
      'What is the treatment for tomato early blight?',
      'How to increase soil fertility organically?',
      'Tell me about PM-KISAN subsidy scheme'
    ],
    'hi-IN': [
      'फसल की बीमारी को कैसे रोकें?',
      'टमाटर अगेती झुलसा का इलाज क्या है?',
      'जैविक उर्वरक का उपयोग कैसे करें?',
      'पीएम किसान योजना के बारे में बताएं'
    ],
    'te-IN': [
      'పంట పురుగుల నివారణ ఎలా?',
      'టమోటా ఆకు మచ్చల నివారణ ఏమిటి?',
      'నేల సారాన్ని పెంచే మార్గాలు ఏమిటి?'
    ],
    'kn-IN': [
      'ಬೆಳೆ ರೋಗ ನಿಯಂತ್ರಣ ಹೇಗೆ?',
      'ಟೊಮ್ಯಾಟೊ ಎಲೆ ಚುಕ್ಕೆ ರೋಗಕ್ಕೆ ಮದ್ದು?',
      'ಮಣ್ಣಿನ ಫಲವತ್ತತೆ ಹೆಚ್ಚಿಸುವುದು ಹೇಗೆ?'
    ],
    'ml-IN': [
      'വിള രോഗങ്ങൾ എങ്ങനെ തടയാം?',
      'തക്കാളിയിലെ ബ്ലൈറ്റ് രോഗം മാറ്റാൻ എന്തുചെയ്യണം?',
      'മണ്ണിന്റെ ഫലഭൂയിഷ്ഠത വർദ്ധിപ്പിക്കാൻ എന്തുചെയ്യണം?'
    ]
  };

  useEffect(() => {
    // Check Speech Recognition Support
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setSupported(false);
    }
  }, []);

  const handleSpeak = (voiceText: string) => {
    if (!window.speechSynthesis) return;

    // Stop ongoing speech
    window.speechSynthesis.cancel();

    // Clean markdown hashes/asterisks for natural speech synthesis
    const cleanText = voiceText
      .replace(/#/g, '')
      .replace(/\*/g, '')
      .replace(/-/g, ' ')
      .trim();

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = lang.split('-')[0]; // 'ta', 'en', 'hi', etc.
    utterance.rate = 0.95;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const processVoiceCommand = async (commandText: string) => {
    if (!commandText.trim()) return;

    setIsLoading(true);
    setErrorMsg('');
    setResponse('');

    try {
      const langCode = lang.split('-')[0]; // 'ta', 'en', 'hi' etc.
      const res = await fetch('/api/chatbot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: commandText, language: langCode }),
      });

      if (!res.ok) throw new Error('Failed to fetch AI response');
      const data = await res.json();
      const replyText = data.reply || 'மன்னிக்கவும், தகவல் பெற முடியவில்லை.';

      setResponse(replyText);
      handleSpeak(replyText);
    } catch (err) {
      console.error('AI Voice Query error:', err);
      const fallbackMsg = lang.startsWith('ta')
        ? 'மன்னிக்கவும், சேவையகத்துடன் தொடர்பு கொள்வதில் தவறு நேர்ந்தது. மீண்டும் முயற்சிக்கவும்.'
        : 'Sorry, could not process the query right now. Please try again.';
      setResponse(fallbackMsg);
      setErrorMsg('Failed to process AI query. Please check your connection.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSpeech = async () => {
    setErrorMsg('');

    // Attempt requesting mic permission if browser supports mediaDevices
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        await navigator.mediaDevices.getUserMedia({ audio: true });
      }
    } catch (micErr) {
      console.warn('Microphone permission request error or denied:', micErr);
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setErrorMsg(
        lang.startsWith('ta')
          ? 'உங்கள் உலாவி குரல் அங்கீகாரத்தை ஆதரிக்கவில்லை. கீழே தட்டச்சு செய்து AI ஆலோசனையைப் பெறலாம்!'
          : 'Your browser does not support Web Speech Recognition. You can type your question below!'
      );
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = lang;
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsListening(true);
        setText(lang.startsWith('ta') ? 'கேட்கிறது... பேசுங்கள்! (Listening... Speak now!)' : 'Listening... Speak now!');
        setResponse('');
        setErrorMsg('');
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);

        if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
          setErrorMsg(
            lang.startsWith('ta')
              ? 'மைக் அனுமதி தடுக்கப்பட்டது. உலாவியின் முகவரிப் பட்டியில் மைக்கை அனுமதிக்கவும் அல்லது கீழே தட்டச்சு செய்து கேட்கவும்.'
              : 'Microphone permission blocked. Please allow mic in browser permissions or type your query below.'
          );
        } else if (event.error === 'no-speech') {
          setErrorMsg(
            lang.startsWith('ta')
              ? 'குரல் எதுவும் கேட்கவில்லை. மீண்டும் மைக் பொத்தானை அழுத்திப் பேசுங்கள்.'
              : 'No speech was detected. Please click the mic button and try speaking again.'
          );
        } else {
          setErrorMsg(`Voice input status: ${event.error}. You can also type your query below.`);
        }
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.onresult = (event: any) => {
        const resultText = event.results[0][0].transcript;
        setText(resultText);
        processVoiceCommand(resultText);
      };

      recognition.start();
    } catch (e) {
      console.error('Error starting recognition:', e);
      setIsListening(false);
      setErrorMsg('Could not initialize speech recorder. Please try typing below.');
    }
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    const query = inputText.trim();
    setText(query);
    setInputText('');
    processVoiceCommand(query);
  };

  const stopSpeaking = () => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const currentPrompts = quickPrompts[lang] || quickPrompts['ta-IN'];

  return (
    <div className="bg-gradient-to-br from-emerald-600 via-green-600 to-teal-700 rounded-3xl text-white p-6 sm:p-8 shadow-2xl relative overflow-hidden font-sans">
      <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
        <Sparkles className="h-40 w-40" />
      </div>

      <div className="relative z-10">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <div>
            <span className="bg-white/20 backdrop-blur-md text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider font-mono shadow-sm">
              AI Voice Assistant 🗣️
            </span>
            <h3 className="text-xl sm:text-2xl font-extrabold mt-2 tracking-tight">
              {lang.startsWith('ta') ? 'குரல் வழி விவசாய உதவியாளர்' : 'Voice-Guided Agricultural Assistant'}
            </h3>
          </div>

          {/* Language Selector */}
          <div className="flex items-center space-x-2 mt-4 sm:mt-0 bg-white/15 backdrop-blur-md p-2 rounded-xl border border-white/20 text-sm font-semibold shadow-inner">
            <Languages className="h-4 w-4 text-emerald-200" />
            <select
              value={lang}
              onChange={(e) => {
                setLang(e.target.value);
                stopSpeaking();
                setResponse('');
                setText('');
                setErrorMsg('');
              }}
              className="bg-transparent text-white focus:outline-none cursor-pointer font-bold text-xs"
            >
              {languages.map((l) => (
                <option key={l.code} value={l.code} className="text-gray-900 font-semibold">
                  {l.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Display Spoken / Input Query and AI Advice */}
        <div className="bg-slate-900/40 backdrop-blur-md rounded-2xl p-5 border border-white/15 min-h-[120px] flex flex-col justify-between mb-6 shadow-inner">
          <div>
            <p className="text-[11px] text-emerald-200 uppercase tracking-widest font-mono font-bold">
              {lang.startsWith('ta') ? 'நீங்கள் கேட்ட கேள்வி (Spoken / Typed Query):' : 'Spoken / Typed Query:'}
            </p>
            <p className="text-base sm:text-lg font-semibold mt-1 text-white">
              {text || (
                <span className="text-white/70 italic text-sm">
                  {lang.startsWith('ta')
                    ? 'மைக் பொத்தானை அழுத்தி பேசவும் அல்லது கீழே தட்டச்சு செய்யவும்...'
                    : 'Click mic button to talk or type your query below...'}
                </span>
              )}
            </p>
          </div>

          {isLoading && (
            <div className="mt-4 pt-4 border-t border-white/15 flex items-center space-x-3 text-emerald-200">
              <Loader2 className="h-5 w-5 animate-spin text-emerald-300" />
              <span className="text-xs font-bold font-mono">
                {lang.startsWith('ta') ? 'AI பதில் தயாரிக்கப்படுகிறது...' : 'Gemini AI generating agricultural advice...'}
              </span>
            </div>
          )}

          {response && !isLoading && (
            <div className="mt-4 pt-4 border-t border-white/15 animate-fade-in">
              <div className="flex items-center justify-between mb-1">
                <p className="text-[11px] text-emerald-300 uppercase tracking-widest font-mono font-bold">
                  {lang.startsWith('ta') ? 'AI விவசாய ஆலோசனை (Voice Response):' : 'AI Advice Response:'}
                </p>
                {isSpeaking && (
                  <span className="flex items-center space-x-1 text-[10px] text-emerald-200 font-mono bg-emerald-500/30 px-2 py-0.5 rounded-full">
                    <Volume2 className="h-3 w-3 animate-pulse" />
                    <span>Speaking...</span>
                  </span>
                )}
              </div>
              <p className="text-sm sm:text-base font-medium text-white/95 leading-relaxed whitespace-pre-line bg-black/20 p-3 rounded-xl border border-white/10">
                {response}
              </p>
            </div>
          )}
        </div>

        {/* Error / Mic Status Banner */}
        {errorMsg && (
          <div className="mb-6 flex items-start space-x-2 text-xs text-amber-100 bg-amber-900/40 p-3.5 rounded-xl border border-amber-500/30">
            <AlertCircle className="h-4 w-4 text-amber-300 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-semibold">{errorMsg}</p>
            </div>
          </div>
        )}

        {/* Primary Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
          {/* Main Voice Mic Button */}
          <button
            onClick={handleSpeech}
            disabled={isListening || isLoading}
            className={`w-full sm:w-auto flex items-center justify-center space-x-2.5 px-8 py-4 rounded-full font-bold text-sm shadow-xl transition-all cursor-pointer ${isListening
                ? 'bg-red-500 text-white animate-pulse ring-4 ring-red-300'
                : 'bg-white text-emerald-800 hover:bg-emerald-50 hover:scale-105 active:scale-95 shadow-emerald-950/20'
              } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            id="voice-assistant-mic-btn"
          >
            {isListening ? (
              <>
                <Mic className="h-5 w-5 animate-bounce" />
                <span>{lang.startsWith('ta') ? 'கேட்டுக்கொண்டிருக்கிறது (Listening...)' : 'Listening...'}</span>
              </>
            ) : (
              <>
                <Mic className="h-5 w-5 text-emerald-600" />
                <span className="font-extrabold">{lang.startsWith('ta') ? 'பேசத் தொடங்கு (Start Speaking)' : 'Start Speaking'}</span>
              </>
            )}
          </button>

          {/* Audio Playback Controls */}
          {response && !isLoading && (
            <div className="flex items-center space-x-2">
              {isSpeaking ? (
                <button
                  onClick={stopSpeaking}
                  className="bg-white/20 hover:bg-white/30 text-white px-4 py-3 rounded-full transition-all flex items-center space-x-1.5 text-xs font-bold cursor-pointer border border-white/20"
                  id="voice-assistant-stop-speak-btn"
                >
                  <VolumeX className="h-4 w-4" />
                  <span>{lang.startsWith('ta') ? 'பேச்சை நிறுத்து (Stop Voice)' : 'Stop Audio'}</span>
                </button>
              ) : (
                <button
                  onClick={() => handleSpeak(response)}
                  className="bg-white/20 hover:bg-white/30 text-white px-4 py-3 rounded-full transition-all flex items-center space-x-1.5 text-xs font-bold cursor-pointer border border-white/20"
                  id="voice-assistant-replay-speak-btn"
                >
                  <Volume2 className="h-4 w-4" />
                  <span>{lang.startsWith('ta') ? 'மீண்டும் கேளுங்கள் (Replay Voice)' : 'Listen Again'}</span>
                </button>
              )}
            </div>
          )}
        </div>

        {/* Text Input Fallback */}
        <form onSubmit={handleManualSubmit} className="mb-6 flex items-center space-x-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={
              lang.startsWith('ta')
                ? 'அல்லது உங்கள் கேள்வியை இங்கே எழுதவும் (e.g., நெல் நோய் கட்டுப்பாடு)...'
                : 'Or type your farming question here...'
            }
            className="flex-1 bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-sm text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/40"
          />
          <button
            type="submit"
            disabled={!inputText.trim() || isLoading}
            className="bg-white text-emerald-800 font-bold px-5 py-3 rounded-xl hover:bg-emerald-50 transition-all text-xs flex items-center space-x-1.5 cursor-pointer disabled:opacity-50"
          >
            <span>{lang.startsWith('ta') ? 'அனுப்பு' : 'Ask AI'}</span>
            <Send className="h-3.5 w-3.5" />
          </button>
        </form>

        {/* Quick Suggestion Chips */}
        <div>
          <p className="text-[11px] text-emerald-200 uppercase tracking-wider font-mono font-bold mb-2">
            {lang.startsWith('ta') ? 'மாதிரி கேள்விகள் (Quick Suggestions):' : 'Quick Prompt Suggestions:'}
          </p>
          <div className="flex flex-wrap gap-2">
            {currentPrompts.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setText(prompt);
                  processVoiceCommand(prompt);
                }}
                disabled={isLoading}
                className="bg-white/10 hover:bg-white/20 border border-white/15 text-white/90 hover:text-white px-3 py-1.5 rounded-full text-xs font-medium transition-all text-left cursor-pointer"
              >
                "{prompt}"
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Visualizer Bar during Listening or Speaking */}
        {(isListening || isSpeaking) && (
          <div className="mt-6 flex justify-center items-end space-x-1.5 h-8">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((i) => (
              <div
                key={i}
                className="w-1.5 bg-white/80 rounded-full animate-pulse"
                style={{
                  height: `${20 + Math.sin(i) * 70}%`,
                  animationDuration: `${0.3 + (i % 4) * 0.15}s`
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
