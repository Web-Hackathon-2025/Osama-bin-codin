import React from 'react';
import { Filter, SlidersHorizontal } from 'lucide-react';
import providersData from '../data/providers.json';
import servicesData from '../data/services.json';
import ServiceCard from '../components/ServiceCard';
import type { ServiceProvider } from '../types';

const BrowseServices: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = React.useState<string>('all');
  const [selectedLocation, setSelectedLocation] = React.useState<string>('all');
  const [showFilters, setShowFilters] = React.useState(false);

  const providers = providersData as ServiceProvider[];
  const locations = ['all', 'Indiranagar', 'Koramangala', 'Whitefield', 'HSR Layout', 'BTM Layout', 'Jayanagar', 'Malleshwaram', 'Electronic City', 'Marathahalli', 'Bellandur'];

  const filteredProviders = providers.filter((provider) => {
    const categoryMatch = selectedCategory === 'all' || provider.category === selectedCategory;
    const locationMatch = selectedLocation === 'all' || provider.location.includes(selectedLocation);
    return categoryMatch && locationMatch;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-slate-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10 text-center">
            <span className="inline-block px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold mb-4">
            🔍 Explore Services
          </span>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary-600 via-purple-600 to-primary-700 bg-clip-text text-transparent mb-4">Browse Services</h1>
          <p className="text-xl text-slate-600">
            Find trusted professionals near you
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 md:p-8 mb-10 border-2 border-purple-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-primary-600 flex items-center space-x-2">
              <div className="bg-purple-100 p-2 rounded-xl">
                <Filter size={22} className="text-purple-600" />
              </div>
              <span>Filters</span>
            </h2>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="md:hidden p-2 bg-purple-100 rounded-xl hover:bg-purple-200 transition-all"
            >
              <SlidersHorizontal size={22} className="text-purple-600" />
            </button>
          </div>

          <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 ${showFilters ? 'block' : 'hidden md:grid'}`}>
            {/* Category Filter */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-3">
                📂 Service Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-5 py-3 border-2 border-purple-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 font-semibold bg-white text-slate-700 cursor-pointer hover:border-purple-300 transition-all"
              >
                <option value="all">All Categories</option>
                {servicesData.map((service) => (
                  <option key={service.id} value={service.name}>
                    {service.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Location Filter */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-3">
                📍 Location
              </label>
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="w-full px-5 py-3 border-2 border-orange-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 font-semibold bg-white text-slate-700 cursor-pointer hover:border-orange-300 transition-all"
              >
                {locations.map((location) => (
                  <option key={location} value={location}>
                    {location === 'all' ? 'All Locations' : location}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-8">
          <div className="inline-block px-6 py-3 bg-success-100 rounded-2xl shadow-md">
            <p className="text-success-800 font-bold">
              Showing <span className="text-2xl">{filteredProviders.length}</span> service providers
            </p>
          </div>
        </div>

        {/* Service Cards Grid */}
        {filteredProviders.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProviders.map((provider) => (
              <ServiceCard key={provider.id} provider={provider} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border-2 border-purple-100">
            <div className="text-6xl mb-4">😔</div>
            <p className="text-2xl font-bold text-slate-800 mb-4">No service providers found</p>
            <p className="text-lg text-slate-600 mb-6">Try adjusting your filters to see more results</p>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSelectedLocation('all');
              }}
              className="px-8 py-3 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl transition-all shadow-lg"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BrowseServices;
