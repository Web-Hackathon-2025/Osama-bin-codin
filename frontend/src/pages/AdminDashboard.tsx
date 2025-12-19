import React from 'react';
import { Users, Briefcase, Star, AlertCircle, CheckCircle } from 'lucide-react';
import providersData from '../data/providers.json';
import bookingsData from '../data/bookings.json';
import reviewsData from '../data/reviews.json';
import RatingStars from '../components/RatingStars';
import type { ServiceProvider, Review, User, Report } from '../types';

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = React.useState<'users' | 'services' | 'reviews' | 'reports'>('users');

  // Mock data
  const mockUsers: User[] = [
    {
      id: 'cust-1',
      name: 'Arjun Mehta',
      email: 'arjun@example.com',
      phone: '+91 98765 00001',
      role: 'customer',
      joinedDate: '2025-01-15',
      status: 'active',
    },
    {
      id: 'cust-2',
      name: 'Meera Iyer',
      email: 'meera@example.com',
      phone: '+91 98765 00002',
      role: 'customer',
      joinedDate: '2025-02-10',
      status: 'active',
    },
    {
      id: 'prov-1',
      name: 'Rajesh Kumar',
      email: 'rajesh@example.com',
      phone: '+91 98765 43210',
      role: 'provider',
      joinedDate: '2024-11-20',
      status: 'active',
    },
    {
      id: 'prov-2',
      name: 'Priya Sharma',
      email: 'priya@example.com',
      phone: '+91 98765 43211',
      role: 'provider',
      joinedDate: '2024-12-05',
      status: 'active',
    },
  ];

  const mockReports: Report[] = [
    {
      id: 'rep-1',
      reportedBy: 'Arjun Mehta',
      reportedUser: 'Unknown Provider',
      reason: 'Provider did not show up at scheduled time',
      status: 'pending',
      createdAt: '2025-12-18T10:00:00Z',
    },
    {
      id: 'rep-2',
      reportedBy: 'Meera Iyer',
      reportedUser: 'Mohammed Ali',
      reason: 'Unprofessional behavior',
      status: 'resolved',
      createdAt: '2025-12-10T14:30:00Z',
    },
  ];

  // Stats
  const stats = {
    totalUsers: mockUsers.length,
    totalProviders: providersData.length,
    totalBookings: bookingsData.length,
    totalReviews: reviewsData.length,
    pendingReports: mockReports.filter((r) => r.status === 'pending').length,
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Admin Dashboard</h1>
          <p className="text-lg text-slate-600">
            Manage users, services, and platform operations
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-slate-600">Total Users</h3>
              <Users className="text-blue-500" size={24} />
            </div>
            <p className="text-3xl font-bold text-slate-900">{stats.totalUsers}</p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-slate-600">Providers</h3>
              <Briefcase className="text-green-500" size={24} />
            </div>
            <p className="text-3xl font-bold text-slate-900">{stats.totalProviders}</p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-purple-500">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-slate-600">Bookings</h3>
              <CheckCircle className="text-purple-500" size={24} />
            </div>
            <p className="text-3xl font-bold text-slate-900">{stats.totalBookings}</p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-yellow-500">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-slate-600">Reviews</h3>
              <Star className="text-yellow-500" size={24} />
            </div>
            <p className="text-3xl font-bold text-slate-900">{stats.totalReviews}</p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-red-500">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-slate-600">Pending Reports</h3>
              <AlertCircle className="text-red-500" size={24} />
            </div>
            <p className="text-3xl font-bold text-slate-900">{stats.pendingReports}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-md mb-8">
          <div className="border-b border-slate-200">
            <div className="flex overflow-x-auto">
              <button
                onClick={() => setActiveTab('users')}
                className={`px-6 py-4 font-medium whitespace-nowrap transition-colors ${
                  activeTab === 'users'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Users
              </button>
              <button
                onClick={() => setActiveTab('services')}
                className={`px-6 py-4 font-medium whitespace-nowrap transition-colors ${
                  activeTab === 'services'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Service Listings
              </button>
              <button
                onClick={() => setActiveTab('reviews')}
                className={`px-6 py-4 font-medium whitespace-nowrap transition-colors ${
                  activeTab === 'reviews'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Reviews
              </button>
              <button
                onClick={() => setActiveTab('reports')}
                className={`px-6 py-4 font-medium whitespace-nowrap transition-colors ${
                  activeTab === 'reports'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Reports
              </button>
            </div>
          </div>

          <div className="p-6">
            {/* Users Tab */}
            {activeTab === 'users' && (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Name</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Email</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Phone</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Role</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Joined</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockUsers.map((user) => (
                      <tr key={user.id} className="border-b border-slate-100 hover:bg-slate-50">
                        <td className="py-3 px-4 text-sm font-medium text-slate-900">{user.name}</td>
                        <td className="py-3 px-4 text-sm text-slate-600">{user.email}</td>
                        <td className="py-3 px-4 text-sm text-slate-600">{user.phone}</td>
                        <td className="py-3 px-4">
                          <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                            user.role === 'provider' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
                          }`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-sm text-slate-600">
                          {new Date(user.joinedDate).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-4">
                          <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                            user.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                          }`}>
                            {user.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Services Tab */}
            {activeTab === 'services' && (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Provider</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Category</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Location</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Rating</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Reviews</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Price Range</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(providersData as ServiceProvider[]).map((provider) => (
                      <tr key={provider.id} className="border-b border-slate-100 hover:bg-slate-50">
                        <td className="py-3 px-4 text-sm font-medium text-slate-900">{provider.name}</td>
                        <td className="py-3 px-4 text-sm text-blue-600">{provider.category}</td>
                        <td className="py-3 px-4 text-sm text-slate-600">{provider.location}</td>
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-1">
                            <Star className="text-yellow-400 fill-current" size={14} />
                            <span className="text-sm font-medium">{provider.rating}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-sm text-slate-600">{provider.reviewCount}</td>
                        <td className="py-3 px-4 text-sm text-slate-600">{provider.priceRange}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Reviews Tab */}
            {activeTab === 'reviews' && (
              <div className="space-y-4">
                {(reviewsData as Review[]).map((review) => (
                  <div key={review.id} className="border border-slate-200 rounded-lg p-4">
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
                    <p className="text-slate-700 mb-2">{review.comment}</p>
                    <p className="text-sm text-slate-500">Booking ID: {review.bookingId}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Reports Tab */}
            {activeTab === 'reports' && (
              <div className="space-y-4">
                {mockReports.map((report) => (
                  <div key={report.id} className="border border-slate-200 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="font-semibold text-slate-900">Reported by: {report.reportedBy}</p>
                        <p className="text-sm text-slate-600">Against: {report.reportedUser}</p>
                        <p className="text-sm text-slate-500">
                          {new Date(report.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </p>
                      </div>
                      <span
                        className={`text-xs px-3 py-1 rounded-full font-medium ${
                          report.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-green-100 text-green-800'
                        }`}
                      >
                        {report.status}
                      </span>
                    </div>
                    <p className="text-slate-700 mb-3">
                      <span className="font-medium">Reason:</span> {report.reason}
                    </p>
                    {report.status === 'pending' && (
                      <div className="flex space-x-2">
                        <button className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors flex items-center space-x-1">
                          <CheckCircle size={16} />
                          <span>Resolve</span>
                        </button>
                        <button className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 text-sm font-medium rounded-lg transition-colors">
                          View Details
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
