import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, Phone, Mail, Clock, Award, Calendar } from 'lucide-react';
import providersData from '../data/providers.json';
import reviewsData from '../data/reviews.json';
import RatingStars from '../components/RatingStars';
import type { ServiceProvider, Review } from '../types';

const ProviderProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const provider = providersData.find((p) => p.id === id) as ServiceProvider | undefined;
  const providerReviews = reviewsData.filter((r) => r.providerId === id) as Review[];

  if (!provider) {
    return (
      <div className="min-h-screen bg-slate-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-2xl font-bold text-slate-900 mb-4">Provider not found</h1>
          <button
            onClick={() => navigate('/browse')}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            Go back to browse
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Card */}
        <div className="bg-white rounded-xl shadow-md p-6 md:p-8 mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
            <img
              src={provider.profileImage}
              alt={provider.name}
              className="w-24 h-24 rounded-full object-cover border-4 border-blue-100"
            />
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-slate-900 mb-2">{provider.name}</h1>
                  <p className="text-lg text-blue-600 font-medium mb-3">{provider.category}</p>
                  <div className="flex items-center space-x-4 text-sm text-slate-600 mb-3">
                    <div className="flex items-center space-x-1">
                      <Award size={16} />
                      <span>{provider.experience} experience</span>
                    </div>
                  </div>
                </div>
              </div>
              <RatingStars rating={provider.rating} showNumber={true} />
              <p className="text-sm text-slate-500 mt-1">{provider.reviewCount} reviews</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 pt-6 border-t border-slate-200">
            <div className="flex items-center space-x-3 text-slate-700">
              <MapPin size={20} className="text-blue-600 flex-shrink-0" />
              <span>{provider.location}</span>
            </div>
            <div className="flex items-center space-x-3 text-slate-700">
              <Phone size={20} className="text-blue-600 flex-shrink-0" />
              <span>{provider.phone}</span>
            </div>
            <div className="flex items-center space-x-3 text-slate-700">
              <Mail size={20} className="text-blue-600 flex-shrink-0" />
              <span>{provider.email}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* About */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">About</h2>
              <p className="text-slate-700 leading-relaxed">{provider.bio}</p>
            </div>

            {/* Services Offered */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">Services Offered</h2>
              <div className="grid grid-cols-2 gap-3">
                {provider.services.map((service, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-2 px-4 py-3 bg-blue-50 text-blue-700 rounded-lg"
                  >
                    <span className="font-medium">{service}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Reviews */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">
                Reviews ({providerReviews.length})
              </h2>
              {providerReviews.length > 0 ? (
                <div className="space-y-4">
                  {providerReviews.map((review) => (
                    <div key={review.id} className="border-b border-slate-200 pb-4 last:border-0">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="font-semibold text-slate-900">{review.customerName}</p>
                          <p className="text-sm text-slate-500">
                            {new Date(review.createdAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            })}
                          </p>
                        </div>
                        <RatingStars rating={review.rating} size={16} showNumber={false} />
                      </div>
                      <p className="text-slate-700">{review.comment}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-slate-600">No reviews yet</p>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Pricing */}
            <div className="bg-white rounded-xl shadow-md p-6 sticky top-24">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Pricing</h3>
              <p className="text-2xl font-bold text-blue-600 mb-6">{provider.priceRange}</p>

              {/* Availability */}
              <div className="mb-6 pb-6 border-b border-slate-200">
                <div className="flex items-center space-x-2 text-slate-700 mb-2">
                  <Clock size={20} className="text-blue-600" />
                  <h3 className="font-semibold">Availability</h3>
                </div>
                <p className="text-slate-600 ml-7">{provider.availability}</p>
              </div>

              {/* Request Service Button */}
              <button
                onClick={() => navigate(`/request-service/${provider.id}`)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center space-x-2"
              >
                <Calendar size={20} />
                <span>Request Service</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProviderProfile;

