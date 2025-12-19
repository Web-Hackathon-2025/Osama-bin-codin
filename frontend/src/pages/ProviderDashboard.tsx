import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, CheckCircle, Package, DollarSign, TrendingUp, Calendar } from 'lucide-react';
import bookingsData from '../data/bookings.json';
import { useUser } from '../context/UserContext';
import type { Booking } from '../types';

const ProviderDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { userId } = useUser();

  // Filter bookings for current provider
  const providerBookings = bookingsData.filter((b) => b.providerId === userId) as Booking[];

  // Calculate stats
  const stats = {
    pending: providerBookings.filter((b) => b.status === 'requested').length,
    confirmed: providerBookings.filter((b) => b.status === 'confirmed').length,
    completed: providerBookings.filter((b) => b.status === 'completed').length,
    totalEarnings: providerBookings
      .filter((b) => b.status === 'completed' && b.price)
      .reduce((sum, b) => {
        const amount = parseInt(b.price?.replace(/[₹,]/g, '') || '0');
        return sum + amount;
      }, 0),
  };

  // Recent bookings (last 5)
  const recentBookings = [...providerBookings]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Provider Dashboard</h1>
          <p className="text-lg text-slate-600">
            Welcome back! Here's your business overview
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Pending Requests */}
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-yellow-500">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-slate-600">Pending Requests</h3>
              <Clock className="text-yellow-500" size={24} />
            </div>
            <p className="text-3xl font-bold text-slate-900">{stats.pending}</p>
            <button
              onClick={() => navigate('/provider/requests')}
              className="mt-3 text-sm text-yellow-600 hover:text-yellow-700 font-medium"
            >
              View all →
            </button>
          </div>

          {/* Confirmed Bookings */}
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-slate-600">Confirmed Bookings</h3>
              <CheckCircle className="text-green-500" size={24} />
            </div>
            <p className="text-3xl font-bold text-slate-900">{stats.confirmed}</p>
            <button
              onClick={() => navigate('/provider/requests')}
              className="mt-3 text-sm text-green-600 hover:text-green-700 font-medium"
            >
              View all →
            </button>
          </div>

          {/* Completed Jobs */}
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-slate-600">Completed Jobs</h3>
              <Package className="text-blue-500" size={24} />
            </div>
            <p className="text-3xl font-bold text-slate-900">{stats.completed}</p>
            <button
              onClick={() => navigate('/provider/history')}
              className="mt-3 text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              View history →
            </button>
          </div>

          {/* Total Earnings */}
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-purple-500">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-slate-600">Total Earnings</h3>
              <DollarSign className="text-purple-500" size={24} />
            </div>
            <p className="text-3xl font-bold text-slate-900">₹{stats.totalEarnings.toLocaleString()}</p>
            <p className="mt-3 text-sm text-slate-500 flex items-center">
              <TrendingUp size={14} className="mr-1" />
              From completed jobs
            </p>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-slate-900">Recent Bookings</h2>
            <button
              onClick={() => navigate('/provider/requests')}
              className="text-blue-600 hover:text-blue-700 font-medium text-sm"
            >
              View All
            </button>
          </div>

          {recentBookings.length > 0 ? (
            <div className="space-y-4">
              {recentBookings.map((booking) => (
                <div
                  key={booking.id}
                  className="flex items-center justify-between p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="font-semibold text-slate-900">{booking.service}</h3>
                      <span
                        className={`text-xs px-2 py-1 rounded-full font-medium ${
                          booking.status === 'requested'
                            ? 'bg-yellow-100 text-yellow-800'
                            : booking.status === 'confirmed'
                            ? 'bg-green-100 text-green-800'
                            : booking.status === 'completed'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {booking.status}
                      </span>
                    </div>
                    <p className="text-sm text-slate-600">
                      Customer: {booking.customerName} • {' '}
                      {new Date(booking.date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                      })}{' '}
                      at {booking.time}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar size={16} className="text-slate-400" />
                    <span className="text-sm text-slate-600">
                      {new Date(booking.date).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-slate-600 py-8">No recent bookings</p>
          )}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <button
            onClick={() => navigate('/provider/requests')}
            className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow text-left"
          >
            <Clock className="text-blue-600 mb-3" size={32} />
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Manage Requests</h3>
            <p className="text-sm text-slate-600">
              Review and respond to new service requests
            </p>
          </button>

          <button
            onClick={() => navigate('/provider/profile')}
            className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow text-left"
          >
            <Package className="text-green-600 mb-3" size={32} />
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Update Profile</h3>
            <p className="text-sm text-slate-600">
              Manage your services, pricing, and availability
            </p>
          </button>

          <button
            onClick={() => navigate('/provider/history')}
            className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow text-left"
          >
            <CheckCircle className="text-purple-600 mb-3" size={32} />
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Booking History</h3>
            <p className="text-sm text-slate-600">
              View all your past and completed bookings
            </p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProviderDashboard;
