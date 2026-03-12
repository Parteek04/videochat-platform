'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useState } from 'react';
import LoginModal from '@/components/LoginModal';

const DUMMY_USERS = [
  { id: 1, name: 'Elena', age: 24, country: 'Spain', flag: '🇪🇸', img: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80' },
  { id: 2, name: 'Tarik', age: 27, country: 'Turkey', flag: '🇹🇷', img: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80' },
  { id: 3, name: 'Mei', age: 22, country: 'Japan', flag: '🇯🇵', img: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80' },
  { id: 4, name: 'Lucas', age: 29, country: 'Brazil', flag: '🇧🇷', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80' },
  { id: 5, name: 'Sarah', age: 25, country: 'USA', flag: '🇺🇸', img: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=400&q=80' },
  { id: 6, name: 'Omar', age: 26, country: 'Egypt', flag: '🇪🇬', img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80' },
  { id: 7, name: 'Chloe', age: 21, country: 'France', flag: '🇫🇷', img: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80' },
  { id: 8, name: 'David', age: 31, country: 'UK', flag: '🇬🇧', img: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&q=80' },
];

const COUNTRIES = [
  { code: 'global', label: '🌎 Global (All)' },
  { code: 'IN', label: '🇮🇳 India' },
  { code: 'US', label: '🇺🇸 United States' },
  { code: 'TR', label: '🇹🇷 Turkey' },
  { code: 'BR', label: '🇧🇷 Brazil' },
  { code: 'JP', label: '🇯🇵 Japan' },
  { code: 'KR', label: '🇰🇷 South Korea' },
  { code: 'DE', label: '🇩🇪 Germany' },
  { code: 'FR', label: '🇫🇷 France' },
  { code: 'GB', label: '🇬🇧 United Kingdom' },
  { code: 'RU', label: '🇷🇺 Russia' },
  { code: 'MX', label: '🇲🇽 Mexico' },
  { code: 'EG', label: '🇪🇬 Egypt' },
  { code: 'PH', label: '🇵🇭 Philippines' },
  { code: 'ID', label: '🇮🇩 Indonesia' },
  { code: 'SA', label: '🇸🇦 Saudi Arabia' },
];

export default function HomePage() {
  const { user } = useAuth();
  const router = useRouter();
  const [gender, setGender] = useState('both');
  const [country, setCountry] = useState('global');
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const handleStart = () => {
    if (user) {
      router.push(`/chat?gender=${gender}&country=${country}`);
    } else {
      setIsLoginModalOpen(true);
    }
  };

  return (
    <div className="gradient-bg min-h-screen text-white pt-6">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-20">
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* ── Left Side: Hero & Filters ── */}
          <div className="flex flex-col space-y-10">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300 text-xs font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                12.4M+ users online right now
              </div>
              <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight leading-[1.1]">
                Meet<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-500 via-fuchsia-400 to-orange-400">
                  Strangers
                </span>
                <br />Worldwide
              </h1>
              <p className="text-lg text-white/50 max-w-lg leading-relaxed">
                Instantly video chat with people from around the globe. Filter by gender and country. 
                One click — endless connections.
              </p>
            </div>

            {/* ── Config Card ── */}
            <div className="glass rounded-3xl p-6 sm:p-8 max-w-md shadow-2xl">
              <div className="space-y-5">
                
                <div className="grid grid-cols-2 gap-4">
                  {/* Gender */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-white/40 uppercase tracking-wider">I want to meet</label>
                    <select
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-violet-500 transition-all cursor-pointer appearance-none text-sm"
                    >
                      <option value="both">All Genders</option>
                      <option value="female">Female 👩</option>
                      <option value="male">Male 👨</option>
                    </select>
                  </div>
                  
                  {/* Country */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-white/40 uppercase tracking-wider">Country</label>
                    <select
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-violet-500 transition-all cursor-pointer appearance-none text-sm"
                    >
                      {COUNTRIES.map((c) => (
                        <option key={c.code} value={c.code}>{c.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* CTA */}
                <button
                  onClick={handleStart}
                  className="flex items-center justify-center gap-3 w-full py-4 bg-gradient-to-r from-violet-600 to-orange-500 hover:from-violet-500 hover:to-orange-400 text-white text-lg font-bold rounded-2xl shadow-xl shadow-violet-500/25 transition-all transform hover:scale-[1.02] active:scale-[0.98] btn-glow"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9A2.25 2.25 0 0013.5 5.25h-9A2.25 2.25 0 002.25 7.5v9A2.25 2.25 0 004.5 18.75z" />
                  </svg>
                  Start Video Chat
                </button>

                <p className="text-center text-xs text-white/25">
                  By starting you agree to our Terms & Privacy Policy.
                </p>
              </div>
            </div>
            
            {/* Active users row */}
            <div className="flex items-center gap-4 text-sm text-white/50">
              <div className="flex -space-x-2">
                {DUMMY_USERS.slice(0, 5).map((u) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img key={u.id} src={u.img} alt="user" className="w-9 h-9 rounded-full border-2 border-[#0a0a0f] object-cover" />
                ))}
              </div>
              <div>
                <span className="text-white font-semibold">12.4M+</span> users connected right now
              </div>
            </div>
          </div>

          {/* ── Right Side: Floating Photo Grid ── */}
          <div className="relative hidden lg:block h-[620px] w-full">
            {/* Glow blob */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-violet-600/15 blur-[100px] rounded-full pointer-events-none" />
            
            <div className="grid grid-cols-2 gap-4 h-full transform -rotate-2 scale-105 hover:rotate-0 hover:scale-100 transition-all duration-[900ms] ease-out">
              
              {/* Left column (higher) */}
              <div className="flex flex-col gap-4 -translate-y-16">
                {DUMMY_USERS.slice(0, 4).map((u) => (
                  <div key={u.id} className="relative group overflow-hidden rounded-3xl aspect-[3/4] bg-gray-900 border border-white/10 shadow-2xl">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={u.img} alt={u.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
                    <div className="absolute top-3 left-3 bg-green-400/20 backdrop-blur text-green-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-green-400/30 uppercase tracking-wider">
                      Online
                    </div>
                    <div className="absolute bottom-4 left-4 right-4">
                      <p className="text-white font-bold text-base">{u.name}, {u.age}</p>
                      <p className="text-white/60 text-xs flex items-center gap-1">
                        {u.flag} {u.country}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Right column (lower) */}
              <div className="flex flex-col gap-4 translate-y-8">
                {DUMMY_USERS.slice(4, 8).map((u) => (
                  <div key={u.id} className="relative group overflow-hidden rounded-3xl aspect-[3/4] bg-gray-900 border border-white/10 shadow-2xl">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={u.img} alt={u.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
                    <div className="absolute top-3 left-3 bg-green-400/20 backdrop-blur text-green-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-green-400/30 uppercase tracking-wider">
                      Online
                    </div>
                    <div className="absolute bottom-4 left-4 right-4">
                      <p className="text-white font-bold text-base">{u.name}, {u.age}</p>
                      <p className="text-white/60 text-xs flex items-center gap-1">
                        {u.flag} {u.country}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          </div>
          
          {/* Mobile Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 lg:hidden">
            {DUMMY_USERS.slice(0, 6).map((u) => (
              <div key={u.id} className="relative overflow-hidden rounded-2xl aspect-[3/4]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={u.img} alt={u.name} className="absolute inset-0 w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-3">
                  <p className="text-white font-bold text-sm">{u.name}, {u.age}</p>
                  <p className="text-white/60 text-xs">{u.flag} {u.country}</p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
      
      {/* Login Modal */}
      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
    </div>
  );
}
