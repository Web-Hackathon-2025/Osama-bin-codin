import React from 'react';
import { Link } from 'react-router-dom';
import type { ServiceProvider } from '../types';
import { Star, MapPin } from 'lucide-react';

interface ServiceCardProps {
  provider: ServiceProvider;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ provider }) => {
  return (
    <Link 
      to={`/provider/${provider.id}`}
      className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border-2 border-purple-100 hover:border-purple-300 group transform hover:-translate-y-2"
    >
      <div className="p-6">
        <div className="flex items-start space-x-4">
          <div className="relative">
            <img
              src={provider.profileImage}
              alt={provider.name}
              className="w-20 h-20 rounded-2xl object-cover border-4 border-primary-200 shadow-lg"
            />
            <div className="absolute -bottom-2 -right-2 bg-success-600 text-white text-xs font-bold px-2 py-1 rounded-lg shadow-lg">
              ✓
            </div>
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-xl text-slate-900 mb-1 group-hover:text-primary-600 transition-colors">{provider.name}</h3>
            <p className="text-sm font-bold text-primary-600">{provider.category}</p>
          </div>
        </div>

        <div className="mt-5 space-y-3">
          <div className="flex items-center justify-between bg-yellow-50 px-3 py-2 rounded-xl">
            <div className="flex items-center space-x-1">
              <Star className="text-yellow-500 fill-current" size={20} />
              <span className="font-bold text-slate-900 text-lg">{provider.rating}</span>
              <span className="text-sm text-slate-600">({provider.reviewCount})</span>
            </div>
          </div>

          <div className="flex items-start space-x-2 text-sm text-slate-700 bg-purple-50 px-3 py-2 rounded-xl">
            <MapPin size={18} className="mt-0.5 flex-shrink-0 text-purple-600" />
            <span className="font-semibold">{provider.location}</span>
          </div>

          <div className="pt-2 border-t-2 border-purple-100">
            <p className="text-sm font-bold text-success-600 text-center py-2 bg-success-50 rounded-xl">{provider.priceRange}</p>
          </div>

          <div className="flex flex-wrap gap-2 pt-2">
            {provider.services.slice(0, 3).map((service, index) => {
              const colors = [
                'bg-blue-100 text-blue-700',
                'bg-purple-100 text-purple-700',
                'bg-orange-100 text-orange-700',
              ];
              const colorClass = colors[index % colors.length];
              
              return (
                <span
                  key={index}
                  className={`text-xs px-3 py-1.5 ${colorClass} rounded-xl font-semibold shadow-sm`}
                >
                  {service}
                </span>
              );
            })}
            {provider.services.length > 3 && (
              <span className="text-xs px-3 py-1.5 bg-slate-100 text-slate-700 rounded-xl font-semibold shadow-sm">
                +{provider.services.length - 3} more
              </span>
            )}
          </div>
        </div>

        <button className="w-full mt-6 px-6 py-3 bg-gradient-to-r from-primary-600 to-purple-600 hover:from-primary-700 hover:to-purple-700 text-white font-bold rounded-xl transition-all shadow-lg">
          View Profile →
        </button>
      </div>
    </Link>
  );
};

export default ServiceCard;
