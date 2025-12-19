import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CheckCircle, Calendar, Clock } from 'lucide-react';
import providersData from '../data/providers.json';
import type { ServiceProvider } from '../types';

const RequestService: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const provider = providersData.find((p) => p.id === id) as ServiceProvider | undefined;
  
  const [selectedService, setSelectedService] = React.useState('');
  const [preferredDate, setPreferredDate] = React.useState('');
  const [preferredTime, setPreferredTime] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [showSuccess, setShowSuccess] = React.useState(false);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Show success message (UI only)
    setShowSuccess(true);
    
    // Redirect after 2 seconds
    setTimeout(() => {
      navigate('/customer/bookings');
    }, 2000);
  };

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center py-8">
        <div className="max-w-md w-full mx-4">
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="text-green-600" size={48} />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mb-2">Request Sent!</h1>
            <p className="text-slate-600 mb-6">
              Your service request has been sent to {provider.name}. You'll be notified once they respond.
            </p>
            <p className="text-sm text-slate-500">Redirecting to your bookings...</p>
          </div>
        </div>
      </div>
    );
  }

  // Get minimum date (today)
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Request Service</h1>
          <p className="text-lg text-slate-600">
            Fill in the details to request a service from {provider.name}
          </p>
        </div>

        {/* Provider Info */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="flex items-center space-x-4">
            <img
              src={provider.profileImage}
              alt={provider.name}
              className="w-16 h-16 rounded-full object-cover border-2 border-blue-100"
            />
            <div>
              <h2 className="text-xl font-semibold text-slate-900">{provider.name}</h2>
              <p className="text-blue-600 font-medium">{provider.category}</p>
              <p className="text-sm text-slate-600">{provider.location}</p>
            </div>
          </div>
        </div>

        {/* Request Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-md p-6 md:p-8">
          {/* Service Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Select Service <span className="text-red-500">*</span>
            </label>
            <select
              value={selectedService}
              onChange={(e) => setSelectedService(e.target.value)}
              required
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Choose a service...</option>
              {provider.services.map((service, index) => (
                <option key={index} value={service}>
                  {service}
                </option>
              ))}
            </select>
          </div>

          {/* Preferred Date */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Preferred Date <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
              <input
                type="date"
                value={preferredDate}
                onChange={(e) => setPreferredDate(e.target.value)}
                min={today}
                required
                className="w-full pl-11 pr-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Preferred Time */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Preferred Time <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
              <input
                type="time"
                value={preferredTime}
                onChange={(e) => setPreferredTime(e.target.value)}
                required
                className="w-full pl-11 pr-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Description */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Service Description <span className="text-red-500">*</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows={4}
              placeholder="Please describe what you need help with..."
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

          {/* Provider Availability Info */}
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-900">
              <span className="font-semibold">Provider Availability:</span> {provider.availability}
            </p>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              type="button"
              onClick={() => navigate(`/provider/${provider.id}`)}
              className="flex-1 px-6 py-3 border border-slate-300 text-slate-700 font-medium rounded-lg hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
            >
              Submit Request
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RequestService;

