import React, { useState, useEffect } from 'react';
import { DESTINATIONS, Destination } from './data/destinations';
import DestinationCard from './components/DestinationCard';
import AuthModal from './components/AuthModal';
import DashboardView from './components/DashboardView';
import AdminView from './components/AdminView';
import { resolveImageUrl } from './utils/imageHelper';
import { Search, Compass, Shield, LogOut, UserCheck, CalendarCheck2, Star, Sparkles, MapPin } from 'lucide-react';

export default function App() {
  const [selectedTab, setSelectedTab] = useState<'falls' | 'islands' | 'beaches' | 'mountains' | 'attract'>('falls');
  const [searchQuery, setSearchQuery] = useState('');
  const [user, setUser] = useState<any>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [currentView, setCurrentView] = useState<'landing' | 'dashboard' | 'admin'>('landing');
  const [selectedDestinationId, setSelectedDestinationId] = useState<string | undefined>(undefined);
  const [highlightedCardId, setHighlightedCardId] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('cebu_user');
    if (saved) {
      try {
        setUser(JSON.parse(saved));
      } catch (e) {
        localStorage.removeItem('cebu_user');
      }
    }
  }, []);

  const handleAuthSuccess = (userData: any) => {
    setUser(userData);
    localStorage.setItem('cebu_user', JSON.stringify(userData));
    setShowAuthModal(false);
    
    if (userData.role === 'admin') {
      setCurrentView('admin');
    } else {
      setCurrentView('dashboard');
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('cebu_user');
    setCurrentView('landing');
  };

  const filteredDestinations = DESTINATIONS.filter(dest => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return dest.category === selectedTab;
    
    return dest.name.toLowerCase().includes(query) || 
           dest.location.toLowerCase().includes(query) ||
           dest.description.toLowerCase().includes(query);
  });

  const handleSurpriseMe = () => {
    setHighlightedCardId(null);
    setSearchQuery('');

    const randomIndex = Math.floor(Math.random() * DESTINATIONS.length);
    const chosen = DESTINATIONS[randomIndex];

    setSelectedTab(chosen.category);

    setTimeout(() => {
      const element = document.getElementById(`dest-${chosen.id}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        setHighlightedCardId(chosen.id);
        
        setTimeout(() => setHighlightedCardId(null), 2500);
      }
    }, 150);
  };

  const handleBookTrigger = (destinationId: string) => {
    if (!user) {
      setSelectedDestinationId(destinationId);
      setShowAuthModal(true);
    } else {
      setSelectedDestinationId(destinationId);
      setCurrentView('dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-[#fdfaf3] text-[#063b54] font-sans antialiased selection:bg-[#0a6b8a] selection:text-white">
      
      {/* Dynamic Navigation Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md shadow-sm border-b border-[rgba(6,59,84,0.06)]">
        <div className="max-w-[1200px] mx-auto px-[4%] py-3.5 flex items-center justify-between">
          <button 
            onClick={() => setCurrentView('landing')} 
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-8.5 h-8.5 rounded-full bg-[#0a6b8a] hover:bg-[#1aa3c4] flex items-center justify-center text-white font-bold text-lg transition-transform duration-300 group-hover:scale-105 shadow-sm">
              C
            </div>
            <span className="font-serif font-extrabold text-xl text-[#063b54] tracking-tight">
              Cebu Explorer
            </span>
          </button>
          
          <nav className="hidden md:flex items-center gap-8 text-[12px] font-semibold tracking-wider">
            <button 
              onClick={() => { setCurrentView('landing'); setTimeout(() => document.getElementById('explore')?.scrollIntoView({behavior: 'smooth'}), 100); }} 
              className="text-[#0a6b8a] hover:text-[#1aa3c4] cursor-pointer transition-colors"
            >
              Explore Spots
            </button>
            <button 
              onClick={() => { setCurrentView('landing'); setTimeout(() => document.getElementById('about')?.scrollIntoView({behavior: 'smooth'}), 100); }} 
              className="text-[#0a6b8a] hover:text-[#1aa3c4] cursor-pointer transition-colors"
            >
              About Cebu
            </button>
          </nav>

          <div className="flex items-center gap-2.5">
            {user ? (
              <div className="flex items-center gap-2.5">
                <button 
                  onClick={() => setCurrentView(user.role === 'admin' ? 'admin' : 'dashboard')}
                  className="bg-[#0a6b8a] hover:bg-[#1aa3c4] text-white text-xs uppercase tracking-wider font-bold px-5 py-2.5 rounded-full transition-all cursor-pointer shadow-md hover:-translate-y-0.5"
                >
                  My Dashboard &rarr;
                </button>
                <button 
                  onClick={handleLogout}
                  className="p-2 border border-red-100 text-[#ff6f61] bg-[#ffebeb] hover:bg-[#ff6f61] hover:text-white transition-all rounded-full cursor-pointer"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button 
                onClick={() => setShowAuthModal(true)}
                className="bg-[#0a6b8a] hover:bg-[#1aa3c4] text-white text-xs uppercase tracking-wider font-bold px-5 py-2.5 rounded-full transition-all cursor-pointer shadow-md hover:-translate-y-0.5"
              >
                Start Trip &rarr;
              </button>
            )}
          </div>
        </div>
      </header>

      {currentView === 'dashboard' && user && (
        <DashboardView 
          user={user} 
          selectedDestinationId={selectedDestinationId}
          onSelectDestination={setSelectedDestinationId}
          onLogout={handleLogout}
          onAdminView={() => setCurrentView('admin')}
        />
      )}

      {currentView === 'admin' && user && (
        <AdminView 
          user={user} 
          onBackToDashboard={() => setCurrentView('dashboard')} 
        />
      )}

      {currentView === 'landing' && (
        <>
          <section id="top" className="relative min-h-[90vh] text-center flex flex-col justify-center items-center px-4 overflow-hidden bg-[#063b54]">
            
            <div className="absolute inset-0 z-0">
              <img 
                src={resolveImageUrl("C:\\Users\\mitra\\cebu\\cebu pics\\photo-1559592413-7cec4d0cae2b.jpg")} 
                alt="Scenic Cebu background" 
                className="w-full h-full object-cover brightness-95"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-[#063b54]/80 via-[#063b54]/60 to-[#fdfaf3]"></div>
            </div>

            <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#fdfaf3] to-transparent z-10"></div>

            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 hidden md:block">
              <div className="w-6 h-10 border-2 border-white/40 rounded-full flex justify-center p-1">
                <div className="w-1.5 h-2.5 bg-[#f6b042] rounded-full animate-bounce mt-1"></div>
              </div>
            </div>

            <div className="relative z-20 max-w-[800px] mx-auto py-16">
              <span className="inline-block px-4 py-1.5 bg-white/10 backdrop-blur-md text-white border border-white/20 text-[11px] tracking-widest uppercase font-semibold mb-6 rounded-full">
                Philippines · Visayas
              </span>
              <h1 className="font-serif text-4xl md:text-6xl font-extrabold leading-tight mb-5 text-white tracking-tight">
                Discover the Beauty of <br />
                <span className="text-[#f6b042] font-semibold italic">Cebu City</span>
              </h1>
              <p className="text-sm md:text-base text-white/95 max-w-[620px] mx-auto mb-10 leading-relaxed font-sans">
                Discover the breathtaking destinations, historical landmarks, and unforgettable experiences that Cebu City has to offer.
              </p>
              <div className="flex gap-4 justify-center flex-wrap">
                <a 
                  href="#explore" 
                  className="bg-[#f6b042] hover:bg-[#e09e32] text-[#063b54] font-semibold text-xs uppercase tracking-wider px-8 py-3.5 rounded-full shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 cursor-pointer"
                >
                  Start Exploring &rarr;
                </a>
                <a 
                  href="#about" 
                  className="bg-transparent border border-white hover:bg-white/10 text-white font-semibold text-xs uppercase tracking-wider px-8 py-3.5 rounded-full transition-all duration-300 transform hover:-translate-y-0.5 cursor-pointer"
                >
                  About Cebu
                </a>
              </div>
            </div>
          </section>

          <section id="explore" className="py-20 bg-[#fdfaf3]">
            <div className="max-w-[1200px] mx-auto px-[4%]">
              
              <div className="text-center max-w-[720px] mx-auto mb-12">
                <span className="text-[#0a6b8a] font-bold tracking-wider uppercase text-[11px] mb-2.5 block">Plan Your Journey</span>
                <h2 className="font-serif text-3xl text-[#063b54] font-bold leading-tight mb-3.5">Where will Cebu take you?</h2>
                <p className="text-[#5b6b76] text-sm">Switch between categories and book your adventure.</p>
              </div>
              <div className="max-w-[540px] mx-auto mb-12 flex flex-col gap-4 items-center">
                <div className="w-full flex items-center gap-3 bg-white border border-[rgba(6,59,84,0.08)] px-4 py-3 rounded-2xl shadow-[0_4px_14px_rgba(6,59,84,0.04)] focus-within:border-[#0a6b8a] transition-all">
                  <Search className="w-4.5 h-4.5 text-[#0a6b8a]" />
                  <input 
                    type="text" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search a destination... e.g. Kawasan Falls, Bantayan Island" 
                    className="flex-1 outline-none border-none text-[#063b54] text-xs bg-transparent placeholder-[#5b6b76]/60"
                  />
                  <span className="text-[10px] text-[#5b6b76]/50 select-none hidden sm:inline">Search spots</span>
                </div>

                <button 
                  type="button" 
                  onClick={handleSurpriseMe}
                  className="bg-white border border-[rgba(6,59,84,0.08)] text-[#0a6b8a] px-5 py-2.5 rounded-full font-semibold text-xs flex items-center gap-2 hover:bg-[#f6efe1] transition-all cursor-pointer shadow-sm"
                >
                  <Sparkles className="w-4 h-4 text-[#f6b042]" />
                  <span>Surprise Me with an Adventure!</span>
                </button>
              </div>

              <div className="flex flex-wrap justify-center gap-2.5 mb-10">
                <button 
                  onClick={() => { setSelectedTab('falls'); setSearchQuery(''); }}
                  className={`px-5 py-2.5 rounded-full text-xs font-semibold cursor-pointer transition-all shadow-sm flex items-center gap-1.5 ${
                    selectedTab === 'falls' 
                      ? 'bg-[#0a6b8a] text-white' 
                      : 'bg-white border border-[rgba(6,59,84,0.08)] text-[#063b54] hover:bg-[#f6efe1]'
                  }`}
                >
                  Cebu Falls
                </button>
                <button 
                  onClick={() => { setSelectedTab('islands'); setSearchQuery(''); }}
                  className={`px-5 py-2.5 rounded-full text-xs font-semibold cursor-pointer transition-all shadow-sm flex items-center gap-1.5 ${
                    selectedTab === 'islands' 
                      ? 'bg-[#0a6b8a] text-white' 
                      : 'bg-white border border-[rgba(6,59,84,0.08)] text-[#063b54] hover:bg-[#f6efe1]'
                  }`}
                >
                  Cebu Islands
                </button>
                <button 
                  onClick={() => { setSelectedTab('beaches'); setSearchQuery(''); }}
                  className={`px-5 py-2.5 rounded-full text-xs font-semibold cursor-pointer transition-all shadow-sm flex items-center gap-1.5 ${
                    selectedTab === 'beaches' 
                      ? 'bg-[#0a6b8a] text-white' 
                      : 'bg-white border border-[rgba(6,59,84,0.08)] text-[#063b54] hover:bg-[#f6efe1]'
                  }`}
                >
                  Cebu Beaches
                </button>
                <button 
                  onClick={() => { setSelectedTab('mountains'); setSearchQuery(''); }}
                  className={`px-5 py-2.5 rounded-full text-xs font-semibold cursor-pointer transition-all shadow-sm flex items-center gap-1.5 ${
                    selectedTab === 'mountains' 
                      ? 'bg-[#0a6b8a] text-white' 
                      : 'bg-white border border-[rgba(6,59,84,0.08)] text-[#063b54] hover:bg-[#f6efe1]'
                  }`}
                >
                  Hiking Mountains
                </button>
                <button 
                  onClick={() => { setSelectedTab('attract'); setSearchQuery(''); }}
                  className={`px-5 py-2.5 rounded-full text-xs font-semibold cursor-pointer transition-all shadow-sm flex items-center gap-1.5 ${
                    selectedTab === 'attract' 
                      ? 'bg-[#0a6b8a] text-white' 
                      : 'bg-white border border-[rgba(6,59,84,0.08)] text-[#063b54] hover:bg-[#f6efe1]'
                  }`}
                >
                  Other Attractions
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6.5">
                {filteredDestinations.map(dest => (
                  <DestinationCard 
                    key={dest.id} 
                    destination={dest} 
                    onBook={handleBookTrigger}
                    isHighlighted={highlightedCardId === dest.id}
                  />
                ))}
              </div>

              {filteredDestinations.length === 0 && (
                <div className="text-center py-20 border border-dashed border-[rgba(6,59,84,0.15)] bg-white rounded-2xl shadow-sm">
                  <Compass className="w-8 h-8 text-[#0a6b8a]/50 mx-auto mb-3" />
                  <p className="text-sm font-semibold text-[#063b54]">No matching destinations found.</p>
                  <p className="text-xs text-[#5b6b76] mt-1">Try another search keyword or switch categories above.</p>
                </div>
              )}

            </div>
          </section>
          <section id="about" className="py-20 bg-white border-t border-[rgba(6,59,84,0.06)]">
            <div className="max-w-[1200px] mx-auto px-[4%] grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="relative rounded-2xl overflow-hidden aspect-[4/3] max-h-[360px] shadow-lg">
                <img 
                  src={resolveImageUrl("C:\\Users\\mitra\\cebu\\cebu pics\\cebumap.jpg")} 
                  alt="Beautiful Cebu landscape" 
                  className="w-full h-full object-cover"
                />
                <div className="p-3 bg-white/92 backdrop-blur-sm text-[#063b54] font-serif text-xs font-bold absolute bottom-4 left-4 rounded-xl shadow-sm">
                  Queen City of the South
                </div>
              </div>
              <div>
                <span className="text-[#0a6b8a] text-[11px] uppercase tracking-wider font-bold mb-2.5 block">About Cebu</span>
                <h2 className="font-serif text-3xl text-[#063b54] font-bold leading-tight mb-4">The Queen City of the South</h2>
                <p className="text-[#5b6b76] text-[13px] mb-3.5 leading-relaxed">
                  Cebu is the heart of the Visayas — a province where 500 years of history meets pristine reefs, mossy peaks and powder-white islands.
                </p>
                <p className="text-[#5b6b76] text-[13px] mb-3.5 leading-relaxed">
                  It's the birthplace of Philippine Christianity, the launchpad for the country's most iconic dive sites, and a culinary capital famous for lechon. Few places blend nature, heritage and adventure quite so seamlessly.
                </p>
                <p className="text-[#5b6b76] text-[13px] mb-6 leading-relaxed">
                  Whether you're chasing sardines underwater, climbing a knife-edge peak at sunrise, or wandering through Spanish-era plazas — Cebu meets you with warmth, color, and stories.
                </p>
                
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-gradient-to-br from-[#fffaf0] to-[#f6efe1] p-4.5 text-center rounded-2xl border border-[rgba(6,59,84,0.03)] shadow-sm">
                    <div className="font-serif text-2xl font-bold text-[#0a6b8a]">167</div>
                    <div className="text-[10px] text-[#5b6b76] uppercase tracking-wider mt-1 font-semibold">Islands</div>
                  </div>
                  <div className="bg-gradient-to-br from-[#fffaf0] to-[#f6efe1] p-4.5 text-center rounded-2xl border border-[rgba(6,59,84,0.03)] shadow-sm">
                    <div className="font-serif text-2xl font-bold text-[#0a6b8a]">500+</div>
                    <div className="text-[10px] text-[#5b6b76] uppercase tracking-wider mt-1 font-semibold">Years History</div>
                  </div>
                  <div className="bg-gradient-to-br from-[#fffaf0] to-[#f6efe1] p-4.5 text-center rounded-2xl border border-[rgba(6,59,84,0.03)] shadow-sm">
                    <div className="font-serif text-2xl font-bold text-[#0a6b8a]">∞</div>
                    <div className="text-[10px] text-[#5b6b76] uppercase tracking-wider mt-1 font-semibold">Adventures</div>
                  </div>
                </div>
              </div>
            </div>
          </section>

        </>
      )}

      <footer id="contact" className="bg-[#063b54] text-white py-14 border-t border-[rgba(6,59,84,0.08)]">
        <div className="max-w-[1200px] mx-auto px-[4%] grid grid-cols-1 md:grid-cols-2 gap-10">
          <div>
            <h4 className="text-white font-serif font-bold text-lg mb-3">Cebu Explorer</h4>
            <p className="text-xs text-white/80 leading-relaxed max-w-[340px]">
              Discover. Explore. Experience Cebu. Your interactive guide to the most beautiful corners of the Queen City of the South.
            </p>
            <div className="flex gap-2.5 mt-5">
              <span className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 transition-all grid place-items-center text-xs font-bold cursor-pointer">FB</span>
              <span className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 transition-all grid place-items-center text-xs font-bold cursor-pointer">IG</span>
              <span className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 transition-all grid place-items-center text-xs font-bold cursor-pointer">YT</span>
            </div>
          </div>
          <div>
            <h4 className="text-white font-serif font-bold text-lg mb-3">Explore Categories</h4>
            <ul className="flex flex-col gap-2 text-xs text-white/80">
              <li><button onClick={() => { setCurrentView('landing'); setSelectedTab('falls'); }} className="hover:text-[#f6b042] transition-colors cursor-pointer text-left">Cebu Waterfalls</button></li>
              <li><button onClick={() => { setCurrentView('landing'); setSelectedTab('islands'); }} className="hover:text-[#f6b042] transition-colors cursor-pointer text-left">Cebu Islands</button></li>
              <li><button onClick={() => { setCurrentView('landing'); setSelectedTab('beaches'); }} className="hover:text-[#f6b042] transition-colors cursor-pointer text-left">Cebu Beaches</button></li>
              <li><button onClick={() => { setCurrentView('landing'); setSelectedTab('mountains'); }} className="hover:text-[#f6b042] transition-colors cursor-pointer text-left">Hiking Mountains</button></li>
            </ul>
          </div>
        </div>
        <div className="max-w-[1200px] mx-auto px-[4%] mt-12 pt-6 border-t border-white/10 flex justify-between flex-wrap gap-4 text-xs text-white/60">
          <span>&copy; {new Date().getFullYear()} Cebu Explorer. All rights reserved.</span>
          <span>Made in the Philippines</span>
        </div>
      </footer>

      {showAuthModal && (
        <AuthModal 
          onSuccess={handleAuthSuccess}
          onClose={() => setShowAuthModal(false)}
        />
      )}
    </div>
  );
}
