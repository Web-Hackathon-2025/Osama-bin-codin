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
      className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-slate-200"
    >
      <div className="p-6">
        <div className="flex items-start space-x-4">
          <img
            src={provider.profileImage}
            alt={provider.name}
            className="w-16 h-16 rounded-full object-cover border-2 border-blue-100"
          />
          <div className="flex-1">
            <h3 className="font-semibold text-lg text-slate-900">{provider.name}</h3>
            <p className="text-sm text-blue-600 font-medium">{provider.category}</p>
          </div>
        </div>

        <div className="mt-4 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1">
              <Star className="text-yellow-400 fill-current" size={18} />
              <span className="font-semibold text-slate-900">{provider.rating}</span>
              <span className="text-sm text-slate-500">({provider.reviewCount} reviews)</span>
            </div>
          </div>

          <div className="flex items-start space-x-2 text-sm text-slate-600">
            <MapPin size={16} className="mt-0.5 flex-shrink-0" />
            <span>{provider.location}</span>
          </div>

          <div className="pt-2 border-t border-slate-100">
            <p className="text-sm text-slate-600 font-medium">{provider.priceRange}</p>
          </div>

          <div className="flex flex-wrap gap-2 pt-2">
            {provider.services.slice(0, 3).map((service, index) => (
              <span
                key={index}
                className="text-xs px-2 py-1 bg-blue-50 text-blue-700 rounded-full"
              >
                {service}
              </span>
            ))}
            {provider.services.length > 3 && (
              <span className="text-xs px-2 py-1 bg-slate-100 text-slate-600 rounded-full">
                +{provider.services.length - 3} more
              </span>
            )}
          </div>
        </div>

        <button className="w-full mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors">
          View Profile
        </button>
      </div>
    </Link>
  );
};

export default ServiceCard;
