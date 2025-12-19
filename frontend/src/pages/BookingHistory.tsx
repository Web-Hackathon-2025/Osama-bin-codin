import React from 'react';
import { Calendar, Clock, User, DollarSign, Filter } from 'lucide-react';
import bookingsData from '../data/bookings.json';
import StatusBadge from '../components/StatusBadge';
import { useUser } from '../context/UserContext';
import type { Booking, BookingStatus } from '../types';

const BookingHistory: React.FC = () => {
  const { userId } = useUser();
  const [statusFilter, setStatusFilter] = React.useState<BookingStatus | 'all'>('all');

  // Filter bookings for current provider
  const providerBookings = bookingsData.filter((b) => b.providerId === userId) as Booking[];

  // Apply status filter
  const filteredBookings = statusFilter === 'all' 
    ? providerBookings 
    : providerBookings.filter((b) => b.status === statusFilter);

  // Sort by date (newest first)
  const sortedBookings = [...filteredBookings].sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  // Calculate earnings from completed bookings
  const totalEarnings = providerBookings
    .filter((b) => b.status === 'completed' && b.price)
    .reduce((sum, b) => {
      const amount = parseInt(b.price?.replace(/[₹,]/g, '') || '0');
      return sum + amount;
    }, 0);

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Booking History</h1>
          <p className="text-lg text-slate-600">
            View all your confirmed and completed bookings
          </p>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-sm font-medium text-slate-600 mb-2">Total Bookings</h3>
            <p className="text-3xl font-bold text-slate-900">{providerBookings.length}</p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-sm font-medium text-slate-600 mb-2">Completed Jobs</h3>
            <p className="text-3xl font-bold text-green-600">
              {providerBookings.filter((b) => b.status === 'completed').length}
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-sm font-medium text-slate-600 mb-2">Total Earnings</h3>
            <p className="text-3xl font-bold text-yellow-600">₹{totalEarnings.toLocaleString()}</p>
          </div>
        </div>

        {/* Status Filter */}
        <div className="bg-white rounded-xl shadow-md p-4 md:p-6 mb-8">
          <div className="flex items-center space-x-2 mb-4">
            <Filter size={20} className="text-slate-700" />
            <h2 className="text-lg font-semibold text-slate-900">Filter by Status</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                statusFilter === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setStatusFilter('confirmed')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                statusFilter === 'confirmed'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Confirmed
            </button>
            <button
              onClick={() => setStatusFilter('completed')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                statusFilter === 'completed'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Completed
            </button>
            <button
              onClick={() => setStatusFilter('cancelled')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                statusFilter === 'cancelled'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Cancelled
            </button>
          </div>
        </div>

        {/* Bookings List */}
        {sortedBookings.length > 0 ? (
          <div className="space-y-4">
            {sortedBookings.map((booking) => (
              <div key={booking.id} className="bg-white rounded-xl shadow-md p-6">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-xl font-semibold text-slate-900 mb-1">
                          {booking.service}
                        </h3>
                        <p className="text-sm text-blue-600 font-medium">{booking.category}</p>
                      </div>
                      <StatusBadge status={booking.status} />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
                      <div className="flex items-center space-x-2 text-slate-600">
                        <User size={18} className="flex-shrink-0" />
                        <span className="text-sm">{booking.customerName}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-slate-600">
                        <Calendar size={18} className="flex-shrink-0" />
                        <span className="text-sm">
                          {new Date(booking.date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 text-slate-600">
                        <Clock size={18} className="flex-shrink-0" />
                        <span className="text-sm">{booking.time}</span>
                      </div>
                    </div>

                    <div className="flex items-start space-x-2 mb-3">
                      <p className="text-sm text-slate-600">
                        <span className="font-medium">Description:</span> {booking.description}
                      </p>
                    </div>

                    {booking.price && (
                      <div className="flex items-center space-x-2 pt-3 border-t border-slate-200">
                        <DollarSign size={18} className="text-green-600" />
                        <span className="text-lg font-semibold text-green-600">{booking.price}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <p className="text-xl text-slate-600">
              {statusFilter === 'all' 
                ? 'No bookings in your history yet' 
                : `No ${statusFilter} bookings found`}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingHistory;

