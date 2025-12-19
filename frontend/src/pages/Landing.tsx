import React from 'react';
import { Link } from 'react-router-dom';
import { Search, MapPin, Wrench, Zap, Sparkles, Hammer, PaintBucket, GraduationCap, Wind, Bug, CheckCircle, Users, Clock } from 'lucide-react';
import servicesData from '../data/services.json';
import ChatBox from '../components/ChatBox';

const iconMap: { [key: string]: React.ElementType } = {
  wrench: Wrench,
  zap: Zap,
  sparkles: Sparkles,
  hammer: Hammer,
  'paint-bucket': PaintBucket,
  'graduation-cap': GraduationCap,
  wind: Wind,
  bug: Bug,
};

const Landing: React.FC = () => {
  const [searchLocation, setSearchLocation] = React.useState('');
  const [searchService, setSearchService] = React.useState('');
  const [isLoadingLocation, setIsLoadingLocation] = React.useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Navigate to browse with filters (UI only)
    window.location.href = '/browse';
  };

  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }

    setIsLoadingLocation(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          // Use reverse geocoding to get city name (simplified version)
          const { latitude, longitude } = position.coords;
          // For now, just show coordinates - in production, use a geocoding API
          setSearchLocation(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
          setIsLoadingLocation(false);
        } catch (error) {
          setSearchLocation('Unable to get location');
          setIsLoadingLocation(false);
        }
      },
      () => {
        alert('Unable to retrieve your location');
        setIsLoadingLocation(false);
      }
    );
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white py-24 overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-yellow-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-orange-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-block mb-6">
              <span className="px-6 py-3 bg-white/20 backdrop-blur-sm text-white rounded-full text-sm font-semibold border border-white/30 shadow-lg">
                🎉 India's Most Trusted Service Marketplace
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight text-white">
              Find Trusted Local Services Near You
            </h1>
            <p className="text-xl md:text-2xl text-blue-50 mb-10 leading-relaxed">
              Connect with <span className="text-orange-300 font-semibold">10,000+ skilled professionals</span> for all your home and personal needs
            </p>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="bg-white rounded-2xl shadow-2xl p-6 md:p-8 border-2 border-yellow-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="relative group">
                  <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-yellow-600 group-focus-within:text-yellow-700 transition-colors" size={22} />
                  <input
                    type="text"
                    placeholder="Enter your location"
                    value={searchLocation}
                    onChange={(e) => setSearchLocation(e.target.value)}
                    className="w-full pl-12 pr-32 py-4 border-2 border-yellow-300 bg-yellow-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-400 focus:bg-white text-gray-800 font-medium transition-all placeholder:text-gray-500"
                  />
                  <button
                    type="button"
                    onClick={handleGetCurrentLocation}
                    disabled={isLoadingLocation}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 px-4 py-2 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white text-sm rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                  >
                    {isLoadingLocation ? '⏳' : '📍'} {isLoadingLocation ? 'Loading...' : 'Use Current'}
                  </button>
                </div>
                <div className="relative group">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-orange-600 group-focus-within:text-orange-700 transition-colors" size={22} />
                  <input
                    type="text"
                    placeholder="What service do you need?"
                    value={searchService}
                    onChange={(e) => setSearchService(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 border-2 border-orange-300 bg-orange-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-400 focus:bg-white text-gray-800 font-medium transition-all placeholder:text-gray-500"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-bold py-4 px-8 rounded-xl transition-all shadow-lg hover:shadow-xl text-lg"
              >
                🔍 Search Services
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Service Categories */}
      <section className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-2 bg-yellow-100 text-yellow-800 rounded-full text-sm font-semibold mb-4">
              ⭐ Popular Services
            </span>
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary-600 via-yellow-600 to-primary-700 bg-clip-text text-transparent mb-4">
              Popular Service Categories
            </h2>
            <p className="text-xl text-slate-600">
              Browse services by category and find the right professional
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {servicesData.map((service: any) => {
              const Icon = iconMap[service.icon] || Wrench;
              
              return (
                <Link
                  key={service.id}
                  to="/browse"
                  className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-yellow-300 group transform hover:-translate-y-2"
                >
                  <div className="relative h-40 overflow-hidden">
                    <img 
                      src={service.image} 
                      alt={service.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    <div className="absolute bottom-3 left-3 bg-gradient-to-br from-yellow-500 to-orange-500 w-12 h-12 rounded-xl flex items-center justify-center shadow-lg">
                      <Icon className="text-white" size={24} />
                    </div>
                  </div>
                  <div className="p-5 text-center">
                    <h3 className="font-bold text-slate-900 mb-2 text-lg">{service.name}</h3>
                    <p className="text-sm text-slate-600 leading-relaxed">{service.description}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold mb-4">
              📋 Simple Process
            </span>
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary-600 via-yellow-600 to-primary-700 bg-clip-text text-transparent mb-4">
              How It Works
            </h2>
            <p className="text-xl text-slate-600">
              Get connected with professionals in three simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="text-center group">
              <div className="relative inline-block mb-8">
                <div className="bg-gradient-to-br from-yellow-500 to-orange-500 text-white w-20 h-20 rounded-2xl flex items-center justify-center text-3xl font-bold mx-auto shadow-xl group-hover:scale-110 transition-transform">
                  1
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-orange-400 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                  ✓
                </div>
              </div>
              <div className="bg-gradient-to-br from-yellow-100 to-orange-100 w-24 h-24 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform shadow-lg">
                <Search className="text-blue-600" size={56} />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">Search & Browse</h3>
              <p className="text-slate-600 text-lg leading-relaxed">
                Browse through verified service providers in your area. Filter by category, location, and ratings.
              </p>
            </div>

            <div className="text-center group">
              <div className="relative inline-block mb-8">
                <div className="bg-gradient-to-br from-orange-500 to-red-500 text-white w-20 h-20 rounded-2xl flex items-center justify-center text-3xl font-bold mx-auto shadow-xl group-hover:scale-110 transition-transform">
                  2
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-400 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                  ✓
                </div>
              </div>
              <div className="bg-gradient-to-br from-orange-100 to-red-100 w-24 h-24 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform shadow-lg">
                <Users className="text-orange-600" size={56} />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">Request Service</h3>
              <p className="text-slate-600 text-lg leading-relaxed">
                Select your preferred provider and submit a service request with your requirements and preferred time.
              </p>
            </div>

            <div className="text-center group">
              <div className="relative inline-block mb-8">
                <div className="bg-gradient-to-br from-secondary-600 to-orange-600 text-white w-20 h-20 rounded-2xl flex items-center justify-center text-3xl font-bold mx-auto shadow-xl group-hover:scale-110 transition-transform">
                  3
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                  ✓
                </div>
              </div>
              <div className="bg-gradient-to-br from-orange-100 to-yellow-100 w-24 h-24 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform shadow-lg">
                <CheckCircle className="text-orange-600" size={56} />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">Get It Done</h3>
              <p className="text-slate-600 text-lg leading-relaxed">
                Once confirmed, the provider will complete the service at your preferred time. Rate and review after completion.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-2 bg-orange-100 text-orange-700 rounded-full text-sm font-semibold mb-4">
              ⚡ Our Advantages
            </span>
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary-600 via-yellow-600 to-primary-700 bg-clip-text text-transparent mb-4">
              Why Choose Karigar?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 border-t-4 border-success-500 group hover:-translate-y-2">
              <div className="bg-gradient-to-br from-success-100 to-green-200 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <CheckCircle className="text-success-600" size={40} />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">Verified Professionals</h3>
              <p className="text-slate-600 text-lg leading-relaxed">
                All service providers are verified and background-checked for your safety and peace of mind.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 border-t-4 border-primary-500 group hover:-translate-y-2">
              <div className="bg-gradient-to-br from-primary-100 to-blue-200 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Clock className="text-primary-600" size={40} />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">Quick Response</h3>
              <p className="text-slate-600 text-lg leading-relaxed">
                Get quick responses from providers and book services at your convenient time.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 border-t-4 border-accent-500 group hover:-translate-y-2">
              <div className="bg-gradient-to-br from-accent-100 to-yellow-200 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Users className="text-accent-600" size={40} />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">Trusted Community</h3>
              <p className="text-slate-600 text-lg leading-relaxed">
                Read reviews from real customers and make informed decisions based on experiences.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white relative overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-orange-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
        </div>
        
        <div className="max-w-5xl mx-auto text-center px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="inline-block mb-6">
            <span className="px-6 py-3 bg-white/20 backdrop-blur-sm text-white rounded-full text-sm font-semibold border border-white/30 shadow-lg">
              🚀 Get Started Today
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-8 leading-tight">
            Ready to Find Your Service Provider?
          </h2>
          <p className="text-2xl text-white/90 mb-10 leading-relaxed max-w-3xl mx-auto">
            Join <span className="text-yellow-300 font-bold">50,000+ satisfied customers</span> who trust Karigar for their service needs
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              to="/browse"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-white to-blue-50 text-primary-600 font-bold px-10 py-5 rounded-2xl hover:from-blue-50 hover:to-white transition-all transform hover:scale-105 shadow-2xl text-xl"
            >
              Browse Services Now
              <Search size={24} />
            </Link>
            <button className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white font-bold px-10 py-5 rounded-2xl hover:bg-white/20 transition-all border-2 border-white/30 text-xl">
              Learn More
              <Users size={24} />
            </button>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 mt-16 max-w-3xl mx-auto">
            <div className="text-center">
              <div className="text-4xl font-bold text-yellow-300 mb-2">10K+</div>
              <div className="text-white/80">Service Providers</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-yellow-300 mb-2">50K+</div>
              <div className="text-white/80">Happy Customers</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-yellow-300 mb-2">4.8⭐</div>
              <div className="text-white/80">Average Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* Floating Chat Widget */}
      <ChatBox 
        serverUrl="http://localhost:8080"
        position="bottom-right"
        theme="light"
        autoConnect={true}
      />
    </div>
  );
};

export default Landing;



