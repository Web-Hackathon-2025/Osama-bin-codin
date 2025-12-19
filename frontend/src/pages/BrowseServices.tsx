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
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">Browse Services</h1>
          <p className="text-lg text-slate-600">
            Find trusted professionals near you
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-md p-4 md:p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-900 flex items-center space-x-2">
              <Filter size={20} />
              <span>Filters</span>
            </h2>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="md:hidden text-blue-600 hover:text-blue-700"
            >
              <SlidersHorizontal size={20} />
            </button>
          </div>

          <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 ${showFilters ? 'block' : 'hidden md:grid'}`}>
            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Service Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Location
              </label>
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
        <div className="mb-6">
          <p className="text-slate-600">
            Showing <span className="font-semibold">{filteredProviders.length}</span> service providers
          </p>
        </div>

        {/* Service Cards Grid */}
        {filteredProviders.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProviders.map((provider) => (
              <ServiceCard key={provider.id} provider={provider} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-xl text-slate-600">No service providers found with the selected filters.</p>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSelectedLocation('all');
              }}
              className="mt-4 text-blue-600 hover:text-blue-700 font-medium"
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
