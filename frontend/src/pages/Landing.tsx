import React from 'react';
import { Link } from 'react-router-dom';
import { Search, MapPin, Wrench, Zap, Sparkles, Hammer, PaintBucket, GraduationCap, Wind, Bug, CheckCircle, Users, Clock } from 'lucide-react';
import servicesData from '../data/services.json';

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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Navigate to browse with filters (UI only)
    window.location.href = '/browse';
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-slate-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Find Trusted Local Services Near You
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8">
              Connect with skilled professionals for all your home and personal needs
            </p>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="bg-white rounded-xl shadow-2xl p-4 md:p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
                  <input
                    type="text"
                    placeholder="Enter your location"
                    value={searchLocation}
                    onChange={(e) => setSearchLocation(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900"
                  />
                </div>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
                  <input
                    type="text"
                    placeholder="What service do you need?"
                    value={searchService}
                    onChange={(e) => setSearchService(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors text-lg"
              >
                Search Services
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Service Categories */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Popular Service Categories
            </h2>
            <p className="text-lg text-slate-600">
              Browse services by category and find the right professional
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {servicesData.map((service) => {
              const Icon = iconMap[service.icon] || Wrench;
              return (
                <Link
                  key={service.id}
                  to="/browse"
                  className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-shadow duration-300 text-center border border-slate-200 group"
                >
                  <div className="bg-blue-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-100 transition-colors">
                    <Icon className="text-blue-600" size={32} />
                  </div>
                  <h3 className="font-semibold text-slate-900 mb-2">{service.name}</h3>
                  <p className="text-sm text-slate-600">{service.description}</p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              How It Works
            </h2>
            <p className="text-lg text-slate-600">
              Get connected with professionals in three simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-600 text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                1
              </div>
              <Search className="text-blue-600 mx-auto mb-4" size={48} />
              <h3 className="text-xl font-semibold text-slate-900 mb-3">Search & Browse</h3>
              <p className="text-slate-600">
                Browse through verified service providers in your area. Filter by category, location, and ratings.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-blue-600 text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                2
              </div>
              <Users className="text-blue-600 mx-auto mb-4" size={48} />
              <h3 className="text-xl font-semibold text-slate-900 mb-3">Request Service</h3>
              <p className="text-slate-600">
                Select your preferred provider and submit a service request with your requirements and preferred time.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-blue-600 text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                3
              </div>
              <CheckCircle className="text-blue-600 mx-auto mb-4" size={48} />
              <h3 className="text-xl font-semibold text-slate-900 mb-3">Get It Done</h3>
              <p className="text-slate-600">
                Once confirmed, the provider will complete the service at your preferred time. Rate and review after completion.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Why Choose Karigar?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-6 shadow-md">
              <CheckCircle className="text-green-500 mb-4" size={40} />
              <h3 className="text-xl font-semibold text-slate-900 mb-3">Verified Professionals</h3>
              <p className="text-slate-600">
                All service providers are verified and background-checked for your safety and peace of mind.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md">
              <Clock className="text-blue-600 mb-4" size={40} />
              <h3 className="text-xl font-semibold text-slate-900 mb-3">Quick Response</h3>
              <p className="text-slate-600">
                Get quick responses from providers and book services at your convenient time.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md">
              <Users className="text-purple-600 mb-4" size={40} />
              <h3 className="text-xl font-semibold text-slate-900 mb-3">Trusted Community</h3>
              <p className="text-slate-600">
                Read reviews from real customers and make informed decisions based on experiences.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Find Your Service Provider?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of satisfied customers who trust Karigar for their service needs
          </p>
          <Link
            to="/browse"
            className="inline-block bg-white text-blue-600 font-semibold px-8 py-4 rounded-lg hover:bg-blue-50 transition-colors text-lg"
          >
            Browse Services Now
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Landing;
