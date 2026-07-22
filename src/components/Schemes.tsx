import React, { useState } from 'react';
import { GovScheme } from '../types';
import { ArrowUpRight, Search, Landmark, HelpCircle, CheckCircle2 } from 'lucide-react';
import { Language } from '../lib/translations';

interface SchemesProps {
  schemes: GovScheme[];
  language?: Language;
}

const sTrans: Record<string, Record<string, string>> = {
  header_badge: {
    ta: "அரசு மானியங்கள் & திட்டங்கள்",
    en: "State & Central Subsidies"
  },
  header_title: {
    ta: "அரசு திட்டங்கள் & மானியங்கள்",
    en: "Government Schemes & Subsidies"
  },
  header_desc: {
    ta: "சிறு, குறு விவசாயிகளுக்கு உதவக்கூடிய மத்திய மற்றும் மாநில அரசுகளின் முக்கிய வேளாண் திட்டங்கள், கடன் உதவிகள், மற்றும் காப்பீடு தகவல்கள்.",
    en: "Key state and central agricultural schemes, credit supports, subsidies, and insurance information helping small and marginal farmers."
  },
  search_placeholder: {
    ta: "திட்டங்கள் அல்லது தகுதி விவரங்களைத் தேடுக (Search government schemes...)",
    en: "Search schemes, categories or eligibility..."
  },
  benefit_label: {
    ta: "திட்டப்பயன் (Benefit):",
    en: "Benefit & Support:"
  },
  eligibility_label: {
    ta: "தகுதிவரம்பு (Eligibility):",
    en: "Eligibility Criteria:"
  },
  apply_btn: {
    ta: "இணையத்தில் விண்ணப்பிக்க (Apply Online)",
    en: "Apply on Official Website"
  }
};

const getST = (key: string, lang: Language): string => {
  const translationsForKey = sTrans[key];
  if (!translationsForKey) return '';
  return translationsForKey[lang] || translationsForKey['en'] || '';
};

export default function Schemes({ schemes, language = 'ta' }: SchemesProps) {
  const [search, setSearch] = useState('');

  const filteredSchemes = schemes.filter(s => 
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.description.toLowerCase().includes(search.toLowerCase()) ||
    s.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in" id="schemes-view-container">
      
      {/* Header */}
      <div className="mb-8">
        <span className="bg-green-100 text-green-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider font-mono">
          {getST('header_badge', language)}
        </span>
        <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight mt-1.5 font-sans">
          {getST('header_title', language)}
        </h2>
        <p className="text-xs text-gray-500 mt-1">
          {getST('header_desc', language)}
        </p>
      </div>

      {/* Search Filter */}
      <div className="bg-white border border-gray-100 p-4 rounded-3xl shadow-xl shadow-gray-50/50 flex gap-4 mb-8">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={getST('search_placeholder', language)}
            className="w-full border border-gray-200 rounded-xl pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:border-green-500 text-slate-800 bg-white"
          />
        </div>
      </div>

      {/* Grid schemes card */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredSchemes.map((scheme) => (
          <div key={scheme.id} className="bg-white border border-gray-100 rounded-3xl p-6 shadow-xl shadow-gray-50/50 flex flex-col justify-between hover:shadow-md transition-shadow relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5">
              <Landmark className="h-24 w-24 text-green-600" />
            </div>

            <div>
              <span className="bg-green-50 text-green-700 text-[10px] font-bold px-2 py-0.5 rounded uppercase font-mono">
                {scheme.category}
              </span>
              
              <h3 className="text-base font-bold text-gray-900 mt-2 font-sans">{scheme.name}</h3>
              <p className="text-xs text-gray-500 mt-2 leading-relaxed">{scheme.description}</p>

              {/* Benefit & Eligibility */}
              <div className="mt-4 space-y-2 border-t pt-4 text-xs">
                <div>
                  <h4 className="font-bold text-green-900 flex items-center space-x-1">
                    <CheckCircle2 className="h-3.5 w-3.5 text-green-600" />
                    <span>{getST('benefit_label', language)}</span>
                  </h4>
                  <p className="text-gray-600 mt-0.5 pl-4.5">{scheme.benefit}</p>
                </div>
                <div>
                  <h4 className="font-bold text-blue-950 flex items-center space-x-1">
                    <HelpCircle className="h-3.5 w-3.5 text-blue-600" />
                    <span>{getST('eligibility_label', language)}</span>
                  </h4>
                  <p className="text-gray-600 mt-0.5 pl-4.5">{scheme.eligibility}</p>
                </div>
              </div>
            </div>

            {/* Official Link Action */}
            <div className="border-t pt-4 mt-6 flex justify-end">
              <a
                href={scheme.applyLink}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center space-x-1 text-green-700 hover:text-green-800 text-xs font-bold hover:underline"
              >
                <span>{getST('apply_btn', language)}</span>
                <ArrowUpRight className="h-4 w-4" />
              </a>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
}
