import React from 'react';
import { Sprout, Phone, Mail, MapPin } from 'lucide-react';
import vivasayamLogo from '../assets/images/vivasayam_logo_1784520902395.jpg';

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-300 border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Logo & About */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2 text-white font-bold text-xl">
              <div className="relative h-9 w-9 flex items-center justify-center bg-white rounded-lg overflow-hidden border border-slate-800">
                <img 
                  src={vivasayamLogo} 
                  alt="Tamil Vivasayam AI Logo" 
                  className="h-full w-full object-cover" 
                  referrerPolicy="no-referrer"
                />
              </div>
              <span className="font-sans font-extrabold text-white">தமிழ் விவசாயம் <span className="text-emerald-500">AI</span></span>
            </div>
            <p className="text-sm text-slate-400">
              🌱 பயிரைக் காப்போம், எதிர்காலத்தை வளர்ப்போம்.<br/>
              Predict • Protect • Prosper.<br/>
              An intelligent, full-stack, AI-powered agricultural diagnosis platform for Indian farmers.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold text-sm tracking-wider uppercase mb-4">விரைவு இணைப்புகள் (Links)</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#about" className="hover:text-emerald-400 transition-colors">திட்டம் பற்றி (About Us)</a></li>
              <li><a href="#features" className="hover:text-emerald-400 transition-colors">அம்சங்கள் (Features)</a></li>
              <li><a href="#technologies" className="hover:text-emerald-400 transition-colors">தொழில்நுட்பம் (Tech Stack)</a></li>
              <li><a href="#contact" className="hover:text-emerald-400 transition-colors">தொடர்புக்கு (Contact)</a></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-white font-semibold text-sm tracking-wider uppercase mb-4">சேவைகள் (Services)</h3>
            <ul className="space-y-2 text-sm">
              <li><span className="hover:text-emerald-400 transition-colors">இலை நோய் கண்டறிதல் (Leaf Disease Diagnostics)</span></li>
              <li><span className="hover:text-emerald-400 transition-colors">வானிலை முன்கணிப்பு (Weather Risk Prediction)</span></li>
              <li><span className="hover:text-emerald-400 transition-colors">பயிர் சுகாதார பாஸ்போர்ட் (Crop Health Passport)</span></li>
              <li><span className="hover:text-emerald-400 transition-colors">வகைப்படுத்தப்பட்ட சந்தை (Marketplace Dealers)</span></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold text-sm tracking-wider uppercase mb-4">தொடர்பு கொள்ள (Contact)</h3>
            <ul className="space-y-3 text-sm text-slate-400">
              <li className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-emerald-500" />
                <span>+91 44 2235 1723 (Tamil Nadu Agri Helpline)</span>
              </li>
              <li className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-emerald-500" />
                <span>support@cropcare-vivasayam.ai</span>
              </li>
              <li className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-emerald-500" />
                <span>Chennai, Madurai & Coimbatore, India</span>
              </li>
            </ul>
          </div>

        </div>

        <div className="mt-8 pt-8 border-t border-slate-900 text-center text-xs text-slate-500 flex flex-col sm:flex-row justify-between items-center">
          <p>© 2026 தமிழ் விவசாயம் AI (Tamil Vivasayam AI). All rights reserved.</p>
          <p className="mt-2 sm:mt-0 font-mono text-[10px]">
            Primary Database: PostgreSQL | Scalable JWT Session & Firebase Auth Securing
          </p>
        </div>
      </div>
    </footer>
  );
}
