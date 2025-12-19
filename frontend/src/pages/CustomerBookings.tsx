import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, User, Filter } from 'lucide-react';
import bookingsData from '../data/bookings.json';
import StatusBadge from '../components/StatusBadge';
import type { Booking, BookingStatus } from '../types';
import { useUser } from '../context/UserContext';

const CustomerBookings: React.FC = () => {
  const navigate = useNavigate();
  const { userId } = useUser();
  const [statusFilter, setStatusFilter] = React.useState<BookingStatus | 'all'>('all');

  // Filter bookings for current customer
  const userBookings = bookingsData.filter((b) => b.customerId === userId) as Booking[];

  // Apply status filter
  const filteredBookings = statusFilter === 'all' 
    ? userBookings 
    : userBookings.filter((b) => b.status === statusFilter);

  // Sort by date (newest first)
  const sortedBookings = [...filteredBookings].sort((a, b) => {
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const handleReview = (bookingId: string) => {
    navigate(`/review/${bookingId}`);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">My Bookings</h1>
          <p className="text-lg text-slate-600">
            Track and manage your service requests
          </p>
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
              onClick={() => setStatusFilter('requested')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                statusFilter === 'requested'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Requested
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
              <div key={booking.id} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
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

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                      <div className="flex items-center space-x-2 text-slate-600">
                        <User size={18} className="flex-shrink-0" />
                        <span className="text-sm">{booking.providerName}</span>
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
                      {booking.price && (
                        <div className="text-sm font-semibold text-slate-900">
                          Price: {booking.price}
                        </div>
                      )}
                    </div>

                    <div className="mb-4">
                      <p className="text-sm text-slate-600">
                        <span className="font-medium">Description:</span> {booking.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col space-y-2 lg:ml-6 mt-4 lg:mt-0">
                    <button
                      onClick={() => navigate(`/provider/${booking.providerId}`)}
                      className="px-4 py-2 border border-blue-600 text-blue-600 font-medium rounded-lg hover:bg-blue-50 transition-colors whitespace-nowrap"
                    >
                      View Provider
                    </button>
                    {booking.status === 'completed' && (
                      <button
                        onClick={() => handleReview(booking.id)}
                        className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap"
                      >
                        Write Review
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <p className="text-xl text-slate-600 mb-4">
              {statusFilter === 'all' 
                ? 'You have no bookings yet' 
                : `No ${statusFilter} bookings found`}
            </p>
            <button
              onClick={() => navigate('/browse')}
              className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
            >
              Browse Services
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerBookings;
