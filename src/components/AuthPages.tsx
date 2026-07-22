import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, User as UserIcon, Phone, MapPin, Loader, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';
import vivasayamLogo from '../assets/images/vivasayam_logo_1784520902395.jpg';

interface AuthPagesProps {
  onSuccess: () => void;
  initialMode?: 'login' | 'register';
}

export default function AuthPages({ onSuccess, initialMode = 'login' }: AuthPagesProps) {
  const [mode, setMode] = useState<'login' | 'register' | 'forgot' | 'otp'>(initialMode);
  const { loginWithEmail, registerWithEmail, loginWithGoogle, setSession } = useAuth();

  // Form Fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [farmName, setFarmName] = useState('');
  const [district, setDistrict] = useState('');
  const [village, setVillage] = useState('');
  const [role, setRole] = useState<'farmer' | 'msme'>('farmer');
  
  // States
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [tempAuth, setTempAuth] = useState<{ token: string; user: any } | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await loginWithEmail(email, password);
      onSuccess();
    } catch (err: any) {
      setError(err.message || 'உள்நுழைதல் தோல்வியுற்றது. தயவுசெய்து மீண்டும் முயற்சிக்கவும். Login failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await registerWithEmail(email, password, {
        name,
        role,
        phone,
        farmName: role === 'farmer' ? farmName : undefined,
        district,
        village,
      });
      setTempAuth(data);
      // After registration, move to simulated OTP Verification for dual verification
      setMode('otp');
    } catch (err: any) {
      setError(err.message || 'பதிவு செய்வதில் பிழை. Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    setLoading(true);
    try {
      await loginWithGoogle();
      onSuccess();
    } catch (err: any) {
      console.error('Google login error:', err);
      setError('கூகிள் மூலம் உள்நுழைவதில் பிழை ஏற்பட்டது. (குறிப்பு: iFrame கட்டுப்பாடுகள் காரணமாக பிழை ஏற்படலாம். தயவுசெய்து புதிய தாவலில் / பக்கத்தில் திறக்கவும் அல்லது மின்னஞ்சல் மூலம் நுழையவும்) Google sign in error. Try local sign-in or open in a new tab.');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (otpCode === '123456' || otpCode === '1234' || otpCode.length >= 4) {
      if (tempAuth) {
        setSession(tempAuth.token, tempAuth.user);
      }
      onSuccess();
    } else {
      setError('தவறான ஓடிபி குறியீடு. சரியான குறியீட்டை உள்ளிடவும். Invalid OTP.');
    }
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    alert('கடவுச்சொல் மீட்புக்கான இணைப்பு உங்கள் மின்னஞ்சலுக்கு அனுப்பப்பட்டது! Password reset link sent!');
    setMode('login');
  };

  return (
    <div className="max-w-md mx-auto my-12 p-8 bg-white border border-green-100 rounded-2xl shadow-xl shadow-green-50 animate-fade-in">
      <div className="text-center mb-6">
        <div className="flex justify-center mb-4">
          <div className="relative h-16 w-16 p-1 bg-white rounded-2xl overflow-hidden shadow-md border border-emerald-100 flex items-center justify-center">
            <img 
              src={vivasayamLogo} 
              alt="Tamil Vivasayam AI Logo" 
              className="h-full w-full object-cover rounded-xl" 
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
        <h3 className="text-2xl font-bold text-gray-900 tracking-tight font-sans">
          {mode === 'login' && 'உள்நுழை (Sign In)'}
          {mode === 'register' && 'பதிவு செய் (Create Account)'}
          {mode === 'forgot' && 'கடவுச்சொல் மீட்பு (Reset Password)'}
          {mode === 'otp' && 'இருபடி சரிபார்ப்பு (OTP Verification)'}
        </h3>
        <p className="text-xs text-gray-500 mt-1.5">
          {mode === 'login' && 'உங்கள் தமிழ் விவசாயம் AI கணக்கில் நுழையவும்'}
          {mode === 'register' && 'பயிர் பாதுகாப்பைத் தொடங்க புதிய கணக்கு'}
          {mode === 'forgot' && 'மீட்பு மின்னஞ்சலைப் பெற உங்கள் முகவரியை உள்ளிடவும்'}
          {mode === 'otp' && 'பதிவு செய்யப்பட்ட மொபைலுக்கு அனுப்பப்பட்ட குறியீட்டை உள்ளிடவும்'}
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 text-xs rounded-lg border border-red-100 flex items-center space-x-2">
          <AlertCircle className="h-4 w-4" />
          <span>{error}</span>
        </div>
      )}

      {/* --- 1. LOGIN MODE --- */}
      {mode === 'login' && (
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">மின்னஞ்சல் (Email)</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="vivasayi@gmail.com"
                className="w-full border border-gray-200 rounded-xl pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:border-green-500"
                id="login-email-field"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-xs font-semibold text-gray-600">கடவுச்சொல் (Password)</label>
              <button
                type="button"
                onClick={() => setMode('forgot')}
                className="text-xs text-green-700 hover:underline"
                id="forgot-pass-btn"
              >
                மறந்துவிட்டதா? (Forgot Password?)
              </button>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full border border-gray-200 rounded-xl pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:border-green-500"
                id="login-pass-field"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white font-semibold rounded-xl shadow-md shadow-green-100 transition-all flex items-center justify-center space-x-2 cursor-pointer"
            id="login-submit-btn"
          >
            {loading ? <Loader className="h-4 w-4 animate-spin" /> : <span>உள்நுழை (Sign In)</span>}
          </button>

          <div className="bg-amber-50/80 p-3.5 rounded-xl border border-amber-100 text-xs text-amber-800 space-y-1.5 mt-4">
            <div className="font-bold flex items-center text-amber-900">
              <span className="mr-1">💡</span>
              <span>டெமோ கணக்கு விவரங்கள் (Demo Credentials):</span>
            </div>
            <div>மின்னஞ்சல் (Email): <span className="font-mono bg-amber-100 px-1.5 py-0.5 rounded select-all font-semibold text-amber-950">testuser@example.com</span></div>
            <div>கடவுச்சொல் (Password): <span className="font-mono bg-amber-100 px-1.5 py-0.5 rounded select-all font-semibold text-amber-950">testpassword123</span></div>
            
            <button
              type="button"
              onClick={async () => {
                setEmail('testuser@example.com');
                setPassword('testpassword123');
                setError('');
                setLoading(true);
                try {
                  await loginWithEmail('testuser@example.com', 'testpassword123');
                  onSuccess();
                } catch (err: any) {
                  setError(err.message || 'Demo login failed');
                } finally {
                  setLoading(false);
                }
              }}
              className="w-full mt-2 py-2 bg-amber-500 hover:bg-amber-600 active:scale-95 text-white font-bold rounded-lg shadow-sm transition-all flex items-center justify-center space-x-1 cursor-pointer"
            >
              <span>ஒரே கிளிக்கில் உள்நுழையவும் (1-Click Demo Login) 🌾</span>
            </button>
          </div>
        </form>
      )}

      {/* --- 2. REGISTER MODE --- */}
      {mode === 'register' && (
        <form onSubmit={handleRegister} className="space-y-4">
          <div className="grid grid-cols-2 gap-2 bg-gray-50 p-1 rounded-xl border border-gray-100">
            <button
              type="button"
              onClick={() => setRole('farmer')}
              className={`py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                role === 'farmer' ? 'bg-green-600 text-white shadow' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              விவசாயி (Farmer)
            </button>
            <button
              type="button"
              onClick={() => setRole('msme')}
              className={`py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                role === 'msme' ? 'bg-blue-600 text-white shadow' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              MSME / ஆய்வாளர்
            </button>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">முழு பெயர் (Full Name)</label>
            <div className="relative">
              <UserIcon className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="கதிரேசன்"
                className="w-full border border-gray-200 rounded-xl pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:border-green-500"
                id="register-name-field"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">மின்னஞ்சல் (Email)</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@gmail.com"
                className="w-full border border-gray-200 rounded-xl pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:border-green-500"
                id="register-email-field"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">தொலைபேசி எண் (Phone Number)</label>
            <div className="relative">
              <Phone className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full border border-gray-200 rounded-xl pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:border-green-500"
                id="register-phone-field"
              />
            </div>
          </div>

          {role === 'farmer' && (
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">தோட்டத்தின் பெயர் (Farm Name)</label>
              <input
                type="text"
                value={farmName}
                onChange={(e) => setFarmName(e.target.value)}
                placeholder="அன்னை இயற்கை தோட்டம்"
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-green-500"
                id="register-farm-field"
              />
            </div>
          )}

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">மாவட்டம் (District)</label>
              <div className="relative">
                <MapPin className="absolute left-2.5 top-3.5 h-3.5 w-3.5 text-gray-400" />
                <input
                  type="text"
                  required
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  placeholder="தஞ்சாவூர்"
                  className="w-full border border-gray-200 rounded-xl pl-8 pr-3 py-2.5 text-xs focus:outline-none focus:border-green-500"
                  id="register-district-field"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">கிராமம் (Village)</label>
              <input
                type="text"
                required
                value={village}
                onChange={(e) => setVillage(e.target.value)}
                placeholder="பாபநாசம்"
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:border-green-500"
                id="register-village-field"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">கடவுச்சொல் (Password)</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full border border-gray-200 rounded-xl pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:border-green-500"
                id="register-pass-field"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 ${
              role === 'farmer' ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'
            } disabled:opacity-50 text-white font-semibold rounded-xl shadow-md transition-all flex items-center justify-center space-x-2 cursor-pointer`}
            id="register-submit-btn"
          >
            {loading ? <Loader className="h-4 w-4 animate-spin" /> : <span>இருபடி கணக்கு துவங்கு (Register & Verify)</span>}
          </button>

          <div className="bg-blue-50/80 p-3.5 rounded-xl border border-blue-100 text-xs text-blue-800 space-y-1.5 mt-4">
            <div className="font-bold flex items-center text-blue-900">
              <span className="mr-1">💡</span>
              <span>டெமோ பதிவு விவரங்கள் (Demo Autofill):</span>
            </div>
            <p className="text-[10px] text-blue-600">கீழே உள்ள பொத்தானைக் கிளிக் செய்து படிவத்தை தானாக நிரப்பி எளிதாகப் பதிவு செய்யவும்!</p>
            
            <button
              type="button"
              onClick={() => {
                const rand = Math.floor(1000 + Math.random() * 9000);
                setName('முத்துசாமி (Muthusamy)');
                setEmail(`farmer_${rand}@example.com`);
                setPhone('9876543210');
                if (role === 'farmer') {
                  setFarmName('ஆர்கானிக் இயற்கை பண்ணை');
                } else {
                  setFarmName('');
                }
                setDistrict('மதுரை (Madurai)');
                setVillage('மேலூர் (Melur)');
                setPassword('demo_pass_123');
                setError('');
              }}
              className="w-full mt-1.5 py-2 bg-blue-500 hover:bg-blue-600 active:scale-95 text-white font-bold rounded-lg shadow-sm transition-all flex items-center justify-center space-x-1 cursor-pointer"
            >
              <span>ஒரே கிளிக்கில் படிவத்தை நிரப்பு (1-Click Autofill Form) 🌾</span>
            </button>
          </div>
        </form>
      )}

      {/* --- 3. FORGOT PASSWORD --- */}
      {mode === 'forgot' && (
        <form onSubmit={handleForgotSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">மின்னஞ்சல் (Email Address)</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="vivasayi@gmail.com"
                className="w-full border border-gray-200 rounded-xl pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:border-green-500"
                id="forgot-email-field"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl transition-all cursor-pointer"
            id="forgot-submit-btn"
          >
            அனுப்பு (Send Reset Link)
          </button>
        </form>
      )}

      {/* --- 4. OTP VALIDATION (Simulated) --- */}
      {mode === 'otp' && (
        <form onSubmit={handleOtpVerify} className="space-y-4">
          <div className="bg-green-50 p-3 rounded-lg text-green-800 text-xs border border-green-100 flex items-start space-x-2">
            <ShieldCheck className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
            <span>
              பாதுகாப்பான 2-படி சரிபார்ப்பு: டெமோ நோக்கங்களுக்காக, எந்த எண்ணையும் அல்லது <strong>1234</strong>ஐ உள்ளிட்டு சரிபார்க்கலாம்!
            </span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">OTP குறியீடு (Enter OTP Code)</label>
            <input
              type="text"
              required
              maxLength={6}
              value={otpCode}
              onChange={(e) => setOtpCode(e.target.value)}
              placeholder="1234"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-center text-lg font-bold letter-spacing-widest focus:outline-none focus:border-green-500 font-mono"
              id="otp-input-field"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl shadow-md transition-all cursor-pointer"
            id="otp-submit-btn"
          >
            சரிபார் மற்றும் உள்நுழை (Verify & Enter)
          </button>

          <button
            type="button"
            onClick={() => {
              if (tempAuth) {
                setSession(tempAuth.token, tempAuth.user);
              }
              onSuccess();
            }}
            className="w-full py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold rounded-xl transition-all cursor-pointer text-center mt-2 flex items-center justify-center"
            id="otp-skip-btn"
          >
            சரிபார்ப்பைத் தவிர் (Skip OTP & Go to Dashboard)
          </button>
        </form>
      )}

      {/* Google Login Split (Only shown for Login/Register modes) */}
      {(mode === 'login' || mode === 'register') && (
        <div className="mt-6">
          <div className="relative flex items-center justify-center my-4">
            <div className="border-t border-gray-200 w-full"></div>
            <span className="absolute bg-white px-3 text-xs text-gray-500 font-medium uppercase font-mono">அல்லது (Or)</span>
          </div>

          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            type="button"
            className="w-full py-2.5 border border-gray-200 hover:bg-gray-50 text-gray-700 text-sm font-semibold rounded-xl flex items-center justify-center space-x-2 transition-all cursor-pointer"
            id="google-login-btn"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
            </svg>
            <span>Google கணக்கு மூலம் உள்நுழை (Sign in with Google)</span>
          </button>

          <div className="text-center mt-6">
            <button
              onClick={() => {
                setError('');
                setMode(mode === 'login' ? 'register' : 'login');
              }}
              className="text-xs text-green-700 font-semibold hover:underline"
              id="auth-mode-toggle-btn"
            >
              {mode === 'login' ? 'புதிய கணக்கு துவங்க வேண்டுமா? Create an account' : 'ஏற்கனவே கணக்கு உள்ளதா? Sign in instead'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
