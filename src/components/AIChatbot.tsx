import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { MessageSquare, Send, X, Bot, ArrowRight } from 'lucide-react';
import { ChatMessage } from '../types';
import { Language } from '../lib/translations';

interface AIChatbotProps {
  language?: Language;
}

const botWelcomeText: Record<Language, string> = {
  ta: "வணக்கம்! நான் பயிர் பாதுகாப்பு AI உதவியாளர். உங்களுக்கு பயிர் நோய்கள், உரங்கள், அரசு திட்டங்கள் மற்றும் வானிலை பற்றி உதவ முடியும். நான் தமிழ்ப் புரிந்துகொள்வேன்.",
  en: "Hello! I am CropCare AI Assistant. How can I help you today with crops, fertilizers, government schemes, or weather?",
  hi: "नमस्ते! मैं क्रॉपकेयर एआई सहायक हूँ। मैं फसलों, उर्वरकों, सरकारी योजनाओं या मौसम में आपकी कैसे मदद कर सकता हूँ?",
  te: "నమస్తే! నేను క్రాప్‌కేర్ AI అసిస్టెంట్‌ని. పంటలు, ఎరువులు, ప్రభుత్వ పథకాలు లేదా వాతావరణంలో నేను మీకు ఎలా సహాయం చేయగలను?",
  kn: "ನಮಸ್ತೆ! ನಾನು ಕ್ರಾಪ್‌ಕೇರ್ AI ಸಹಾಯಕಿ. ಬೆಳೆಗಳು, ರಸಗೊಬ್ಬರಗಳು, ಸರ್ಕಾರಿ ಯೋಜನೆಗಳು ಅಥವಾ ಹವಾಮಾನದ ಕುರಿತು ನಾನು ನಿಮಗೆ ಹೇಗೆ ಸಹಾಯ ಮಾಡಲಿ?",
  ml: "ഹലോ! ഞാൻ ക്രോപ്‌കെയർ AI അസിസ്റ്റന്റാണ്. വിളകൾ, വളങ്ങൾ, സർക്കാർ പദ്ധതികൾ അല്ലെങ്കിൽ കാലാവസ്ഥ എന്നിവയിൽ എനിക്ക് എങ്ങനെ സഹായിക്കാനാകും?",
  mr: "नमस्कार! मी क्रॉपकेअर एआई सहाय्यक आहे. मी पिके, खते, सरकारी योजना किंवा हवामान याबद्दल तुम्हाला कशी मदत करू शकतो?",
  bn: "হ্যালো! আমি ক্রপকেয়ার এআই সহকারী। ফসল, সার, সরকারি প্রকল্প বা আবহাওয়া নিয়ে আজ আপনাকে কীভাবে সাহায্য করতে পারি?",
  gu: "નમસ્તે! હું ક્રોપકેર AI સહાયક છું. પાક, ખાતર, સરકારી યોજનાઓ અથવા હવામાન વિશે હું તમને કેવી રીતે મદદ કરી શકું?",
  pa: "ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ! ਮੈਂ ਕ੍ਰੌਪਕੇਅਰ AI ਸਹਾਇਕ ਹਾਂ। ਫਸਲਾਂ, ਖਾਦਾਂ, ਸਰਕਾਰੀ ਸਕੀਮਾਂ ਜਾਂ ਮੌਸਮ ਬਾਰੇ ਮੈਂ ਤੁਹਾਡੀ ਕਿਵੇਂ ਮਦਦ ਕਰ ਸਕਦਾ ਹਾਂ?"
};

const botQuickQuestions: Record<Language, Array<{ label: string, query: string }>> = {
  ta: [
    { label: 'நெல் குலை நோய் சிகிச்சை?', query: 'What is the treatment for Paddy Blast disease?' },
    { label: 'பிரதமர் கிசான் திட்டம்?', query: 'Tell me about PM-KISAN scheme benefits and eligibility.' },
    { label: 'சொட்டுநீர் பாசன மானியம் TN?', query: 'How can I get Tamil Nadu Micro Irrigation Subsidy?' },
    { label: 'இலைக்கருகல் நோய் தடுப்பு?', query: 'How to prevent Early Blight in Tomato?' }
  ],
  en: [
    { label: 'Paddy Blast Treatment?', query: 'What is the treatment for Paddy Blast disease?' },
    { label: 'PM-KISAN Scheme Info?', query: 'Tell me about PM-KISAN scheme benefits and eligibility.' },
    { label: 'Drip Irrigation Subsidy?', query: 'How can I get Tamil Nadu Micro Irrigation Subsidy?' },
    { label: 'Tomato Early Blight Cure?', query: 'How to prevent Early Blight in Tomato?' }
  ],
  hi: [
    { label: 'धान ब्लास्ट रोग का उपचार?', query: 'What is the treatment for Paddy Blast disease?' },
    { label: 'पीएम-किसान योजना जानकारी?', query: 'Tell me about PM-KISAN scheme benefits and eligibility.' },
    { label: 'टपक सिंचाई सब्सिडी?', query: 'How can I get Tamil Nadu Micro Irrigation Subsidy?' },
    { label: 'टमाटर अगेती झुलसा रोकथाम?', query: 'How to prevent Early Blight in Tomato?' }
  ],
  te: [
    { label: 'వరి బ్లాస్ట్ చికిత్స?', query: 'What is the treatment for Paddy Blast disease?' },
    { label: 'పీఎం-కిసాన్ పథకం వివరాలు?', query: 'Tell me about PM-KISAN scheme benefits and eligibility.' },
    { label: 'బిందు సేద్యం రాయితీ?', query: 'How can I get Tamil Nadu Micro Irrigation Subsidy?' },
    { label: 'టమోటా ఆకు మచ్చల నివారణ?', query: 'How to prevent Early Blight in Tomato?' }
  ],
  kn: [
    { label: 'ಭತ್ತದ ಬ್ಲಾಸ್ಟ್ ರೋಗದ ಚಿಕಿತ್ಸೆ?', query: 'What is the treatment for Paddy Blast disease?' },
    { label: 'ಪಿಎಂ-ಕಿಸಾನ್ ಯೋಜನೆ ಮಾಹಿತಿ?', query: 'Tell me about PM-KISAN scheme benefits and eligibility.' },
    { label: 'ಹನಿ ನೀರಾವರಿ ಸಬ್ಸಿಡಿ?', query: 'How can I get Tamil Nadu Micro Irrigation Subsidy?' },
    { label: 'ಟೊಮ್ಯಾಟೊ ಎಲೆ ಚುಕ್ಕೆ ರೋಗ?', query: 'How to prevent Early Blight in Tomato?' }
  ],
  ml: [
    { label: 'നെല്ലിലെ ബ്ലാസ്റ്റ് രോഗം?', query: 'What is the treatment for Paddy Blast disease?' },
    { label: 'പിഎം-കിസാൻ പദ്ധതി?', query: 'Tell me about PM-KISAN scheme benefits and eligibility.' },
    { label: 'തുള്ളിനന സബ്‌സിഡി?', query: 'How can I get Tamil Nadu Micro Irrigation Subsidy?' },
    { label: 'തക്കാളിയിലെ ബ്ലൈറ്റ് രോഗം?', query: 'How to prevent Early Blight in Tomato?' }
  ],
  mr: [
    { label: 'भात ब्लास्ट रोग उपचार?', query: 'What is the treatment for Paddy Blast disease?' },
    { label: 'पीएम-किसान योजना माहिती?', query: 'Tell me about PM-KISAN scheme benefits and eligibility.' },
    { label: 'ठिबक सिंचन सबसिडी?', query: 'How can I get Tamil Nadu Micro Irrigation Subsidy?' },
    { label: 'टोमॅटो करपा रोग नियंत्रण?', query: 'How to prevent Early Blight in Tomato?' }
  ],
  bn: [
    { label: 'ধানের ব্লাস্ট রোগ চিকিৎসা?', query: 'What is the treatment for Paddy Blast disease?' },
    { label: 'পিএম-কিসান প্রকল্প তথ্য?', query: 'Tell me about PM-KISAN scheme benefits and eligibility.' },
    { label: 'ড্রিপ সেচ ভর্তুকি?', query: 'How can I get Tamil Nadu Micro Irrigation Subsidy?' },
    { label: 'টমেটো আর্লি ব্লাইট প্রতিকার?', query: 'How to prevent Early Blight in Tomato?' }
  ],
  gu: [
    { label: 'ડાંગરનો બ્લાસ્ટ રોગ ઉપચાર?', query: 'What is the treatment for Paddy Blast disease?' },
    { label: 'પીએમ-કિસાન યોજના માહિતી?', query: 'Tell me about PM-KISAN scheme benefits and eligibility.' },
    { label: 'ટપક સિંચાઈ સબસિડી?', query: 'How can I get Tamil Nadu Micro Irrigation Subsidy?' },
    { label: 'ટમેટા આગોતરો સુકારો નિયંત્રણ?', query: 'How to prevent Early Blight in Tomato?' }
  ],
  pa: [
    { label: 'ਝੋਨੇ ਦੇ ਬਲਾਸਟ ਦਾ ਇਲਾਜ?', query: 'What is the treatment for Paddy Blast disease?' },
    { label: 'ਪੀਐਮ-ਕਿਸਾਨ ਸਕੀਮ ਜਾਣਕਾਰੀ?', query: 'Tell me about PM-KISAN scheme benefits and eligibility.' },
    { label: 'ਤੁਪਕਾ ਸਿੰਚਾਈ ਸਬਸਿਡੀ?', query: 'How can I get Tamil Nadu Micro Irrigation Subsidy?' },
    { label: 'ਟਮਾਟਰ ਅਗੇਤਾ ਝੁਲਸ ਰੋਗ?', query: 'How to prevent Early Blight in Tomato?' }
  ]
};

const chatTitle: Record<Language, string> = {
  ta: "பயிர் பாதுகாப்பு AI",
  en: "CropCare AI",
  hi: "क्रॉपकेयर एआई",
  te: "క్రాప్‌కేర్ AI",
  kn: "ಕ್ರಾಪ್‌ಕೇರ್ AI",
  ml: "ക്രോപ്‌കെയർ AI",
  mr: "क्रॉपकेयर एआई",
  bn: "ক্রপকেয়ার এআই",
  gu: "ક્રોપકેર AI",
  pa: "ਕ੍ਰੌਪਕੇਅਰ AI"
};

const placeholderText: Record<Language, string> = {
  ta: "கேள்விகளைக் கேளுங்கள்...",
  en: "Ask a question...",
  hi: "एक प्रश्न पूछें...",
  te: "ఒక ప్రశ్న అడగండి...",
  kn: "ಒಂದು ಪ್ರಶ್ನೆ ಕೇಳಿ...",
  ml: "ഒരു ചോദ്യം ചോദിക്കുക...",
  mr: "एक प्रश्न विचारा...",
  bn: "একটি প্রশ্ন জিজ্ঞাসা করুন...",
  gu: "એક પ્રશ્ન પૂછો...",
  pa: "ਇੱਕ ਸਵਾਲ ਪੁੱਛੋ..."
};

const errText: Record<Language, string> = {
  ta: "மன்னிக்கவும், சேவையகத்துடன் இணைப்பதில் சிக்கல் ஏற்பட்டுள்ளது. மீண்டும் முயற்சி செய்க.",
  en: "Sorry, failed to connect to the server. Please try again.",
  hi: "क्षमा करें, सर्वर से कनेक्ट करने में विफल। कृपया पुन: प्रयास करें।",
  te: "క్షమించండి, సర్వర్‌కు కనెక్ట్ చేయడంలో విఫలమైంది. దయచేసి మళ్ళీ ప్రయత్నించండి.",
  kn: "ಕ್ಷಮಿಸಿ, ಸರ್ವರ್‌ಗೆ ಸಂಪರ್ಕಿಸಲು ವಿಫಲವಾಗಿದೆ. ದಯವಿಟ್ಟು ಮತ್ತೊಮ್ಮೆ ಪ್ರಯತ್ನಿಸಿ.",
  ml: "ക്ഷമിക്കണം, സെർവറിലേക്ക് ബന്ധിപ്പിക്കുന്നതിൽ പരാജയപ്പെട്ടു. ദയവായി വീണ്ടും ശ്രമിക്കുക.",
  mr: "क्षमस्व, सर्व्हरशी कनेक्ट करण्यात अयशस्वी. कृपया पुन्हा प्रयत्न करा.",
  bn: "দুঃখিত, সার্ভারের সাথে সংযোগ করতে ব্যর্থ হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।",
  gu: "માફ કરશો, સર્વર સાથે જોડાણ નિષ્ફળ થયું. કૃપા કરીને ફરી પ્રયાસ કરો.",
  pa: "ਮਾਫ ਕਰਨਾ, ਸਰਵਰ ਨਾਲ ਕਨੈਕਟ ਕਰਨ ਵਿੱਚ ਅਸਫਲ। ਕਿਰਪਾ ਕਰਕੇ ਦੁਬਾਰਾ ਕੋਸ਼ਿਸ਼ ਕਰੋ।"
};

const floatingLabel: Record<Language, string> = {
  ta: "விவசாய AI சாட்பாட்",
  en: "Agricultural AI Chatbot",
  hi: "कृषि एआई चैटबॉट",
  te: "వ్యవసాయ AI చాట్‌బాట్",
  kn: "ಕೃಷಿ AI ಚಾಟ್‌ಬಾಟ್",
  ml: "കാർഷിക AI ചാറ്റ്ബോട്ട്",
  mr: "कृषी एआय चॅटबॉट",
  bn: "কৃষি এআই চ্যাটবট",
  gu: "કૃષિ AI ચેટબોટ",
  pa: "ਖੇਤੀਬਾੜੀ AI ਚੈਟਬੋਟ"
};

export default function AIChatbot({ language = 'ta' }: AIChatbotProps) {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'bot',
      text: botWelcomeText[language],
      timestamp: new Date(),
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messageEndRef = useRef<HTMLDivElement>(null);

  // Sync welcome message if language changes and no real messages have been exchanged yet
  useEffect(() => {
    if (messages.length === 1 && messages[0].id === 'welcome') {
      setMessages([
        {
          id: 'welcome',
          sender: 'bot',
          text: botWelcomeText[language],
          timestamp: messages[0].timestamp,
        }
      ]);
    }
  }, [language]);

  const quickQuestions = botQuickQuestions[language] || botQuickQuestions['en'];

  const scrollToBottom = () => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = async (textToSend: string) => {
    if (!textToSend.trim()) return;

    const userMsg: ChatMessage = {
      id: Math.random().toString(),
      sender: 'user',
      text: textToSend,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/chatbot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: textToSend, language }),
      });
      const data = await res.json();
      
      const botMsg: ChatMessage = {
        id: Math.random().toString(),
        sender: 'bot',
        text: data.reply,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (error) {
      console.error('Chat error:', error);
      const errMsg: ChatMessage = {
        id: Math.random().toString(),
        sender: 'bot',
        text: errText[language],
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Floating Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white p-3.5 rounded-full shadow-lg shadow-green-300 hover:scale-105 transition-all cursor-pointer"
          id="chatbot-floating-toggle-btn"
        >
          <MessageSquare className="h-6 w-6" />
          <span className="text-sm font-semibold pr-1">{floatingLabel[language] || 'Agricultural AI Chatbot'}</span>
        </button>
      )}

      {/* Expanded Chat Box */}
      {isOpen && (
        <div className="bg-white rounded-2xl shadow-2xl border border-green-100 w-80 sm:w-96 h-[500px] flex flex-col overflow-hidden animate-fade-in">
          {/* Header */}
          <div className="bg-green-600 text-white p-4 flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <div className="bg-white/20 p-1.5 rounded-lg">
                <Bot className="h-5 w-5 text-white" />
              </div>
              <div>
                <h4 className="font-semibold text-sm">{chatTitle[language] || 'CropCare AI Chatbot'}</h4>
                <p className="text-[10px] text-green-100 font-mono">Llama 3.1 + RAG Powered</p>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)} 
              className="text-white/80 hover:text-white hover:bg-white/10 p-1 rounded-full transition-colors"
              id="chatbot-close-btn"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl p-3 text-sm ${
                    msg.sender === 'user'
                      ? 'bg-green-600 text-white rounded-br-none shadow-sm'
                      : 'bg-white text-gray-800 border border-gray-100 rounded-bl-none shadow-sm'
                  }`}
                >
                  <p className="whitespace-pre-line leading-relaxed">{msg.text}</p>
                  <span className="block text-[9px] mt-1 text-right opacity-60 font-mono">
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            ))}
            
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-100 rounded-2xl rounded-bl-none p-3 shadow-sm flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            )}
            
            <div ref={messageEndRef} />
          </div>

          {/* Quick Questions suggestion */}
          {messages.length < 3 && (
            <div className="px-4 py-2 bg-gray-50 border-t border-gray-100 overflow-x-auto whitespace-nowrap scrollbar-none flex space-x-1.5">
              {quickQuestions.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(q.query)}
                  className="bg-white hover:bg-green-50 text-green-700 border border-green-100 text-[10px] font-medium px-2.5 py-1 rounded-full transition-colors flex items-center space-x-1"
                >
                  <span>{q.label}</span>
                  <ArrowRight className="h-3 w-3" />
                </button>
              ))}
            </div>
          )}

          {/* Input Box */}
          <div className="p-3 bg-white border-t border-gray-100 flex items-center space-x-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend(input)}
              placeholder={placeholderText[language] || 'Ask a question...'}
              className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-green-500 font-sans"
              id="chatbot-input-field"
            />
            <button
              onClick={() => handleSend(input)}
              disabled={!input.trim()}
              className="bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white p-2.5 rounded-xl transition-all shadow-sm shadow-green-100 cursor-pointer"
              id="chatbot-send-btn"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
