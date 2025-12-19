import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Clock,
  CheckCircle,
  Package,
  DollarSign,
  TrendingUp,
  Calendar,
  CreditCard,
  AlertTriangle,
} from "lucide-react";
import { workerAPI, bookingAPI } from "../services/api";

const ProviderDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);
  const [recentBookings, setRecentBookings] = useState<any[]>([]);
  const [stripeStatus, setStripeStatus] = useState<any>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [profileRes, statsRes, bookingsRes] = await Promise.all([
        workerAPI.getProfile(),
        workerAPI.getStats(),
        bookingAPI.getMyBookings({ role: "worker", limit: 5 }),
      ]);

      setProfile(profileRes.data);
      setStats(statsRes.data);
      setRecentBookings(bookingsRes.data.bookings || []);

      // Check Stripe status
      try {
        const stripeRes = await workerAPI.getStripeStatus();
        setStripeStatus(stripeRes.data);
      } catch (error) {
        console.log("No Stripe account yet");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStripeSetup = async () => {
    try {
      // Check if account exists
      if (!stripeStatus?.hasAccount) {
        await workerAPI.createStripeAccount();
      }

      // Get onboarding link
      const response = await workerAPI.getStripeOnboardingLink();
      window.location.href = response.data.url;
    } catch (error: any) {
      alert(error.response?.data?.message || "Failed to start Stripe setup");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Worker Dashboard
          </h1>
          <p className="text-lg text-slate-600">
            Welcome back, {profile?.name || "Worker"}!
          </p>
        </div>

        {/* Stripe Setup Alert */}
        {!stats?.stripeOnboardingComplete && (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 mb-8 rounded-lg">
            <div className="flex items-start">
              <AlertTriangle
                className="text-yellow-600 mr-4 flex-shrink-0"
                size={24}
              />
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-yellow-900 mb-2">
                  Complete Your Stripe Setup
                </h3>
                <p className="text-yellow-800 mb-4">
                  To receive payments directly, you need to connect your Stripe
                  account. This is required for customers to book your services
                  with online payment.
                </p>
                <button
                  onClick={handleStripeSetup}
                  className="bg-yellow-600 text-white px-6 py-2 rounded-lg hover:bg-yellow-700 font-medium flex items-center space-x-2"
                >
                  <CreditCard size={20} />
                  <span>Setup Stripe Account</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Approval Status Alert */}
        {!stats?.isApproved && (
          <div className="bg-blue-50 border-l-4 border-blue-400 p-6 mb-8 rounded-lg">
            <div className="flex items-start">
              <Clock className="text-blue-600 mr-4 flex-shrink-0" size={24} />
              <div>
                <h3 className="text-lg font-semibold text-blue-900 mb-2">
                  Pending Approval
                </h3>
                <p className="text-blue-800">
                  Your worker profile is pending admin approval. You'll be able
                  to receive bookings once approved.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Pending Requests */}
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-yellow-500">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-slate-600">Total Jobs</h3>
              <Clock className="text-yellow-500" size={24} />
            </div>
            <p className="text-3xl font-bold text-slate-900">
              {stats?.totalJobs || 0}
            </p>
          </div>

          {/* Confirmed Bookings */}
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-slate-600">
                Completed Jobs
              </h3>
              <CheckCircle className="text-green-500" size={24} />
            </div>
            <p className="text-3xl font-bold text-slate-900">
              {stats?.completedJobs || 0}
            </p>
          </div>

          {/* Rating */}
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-slate-600">Rating</h3>
              <Package className="text-blue-500" size={24} />
            </div>
            <p className="text-3xl font-bold text-slate-900">
              {stats?.rating?.toFixed(1) || "0.0"}
            </p>
          </div>

          {/* Status */}
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-yellow-500">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-slate-600">Status</h3>
              <DollarSign className="text-yellow-500" size={24} />
            </div>
            <p className="text-xl font-bold text-slate-900">
              {stats?.isApproved ? (
                <span className="text-green-600">Approved</span>
              ) : (
                <span className="text-yellow-600">Pending</span>
              )}
            </p>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-slate-900">
              Recent Bookings
            </h2>
            <button
              onClick={() => navigate("/provider/requests")}
              className="text-blue-600 hover:text-blue-700 font-medium text-sm"
            >
              View All
            </button>
          </div>

          {recentBookings.length > 0 ? (
            <div className="space-y-4">
              {recentBookings.map((booking: any) => (
                <div
                  key={booking._id}
                  className="flex items-center justify-between p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="font-semibold text-slate-900">
                        {booking.serviceCategory}
                      </h3>
                      <span
                        className={`text-xs px-2 py-1 rounded-full font-medium ${
                          booking.status === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : booking.status === "accepted"
                            ? "bg-green-100 text-green-800"
                            : booking.status === "completed"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {booking.status}
                      </span>
                    </div>
                    <p className="text-sm text-slate-600">
                      {booking.description?.substring(0, 50)}...
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar size={16} className="text-slate-400" />
                    <span className="text-sm text-slate-600">
                      {new Date(booking.scheduledDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-slate-600 py-8">
              No recent bookings
            </p>
          )}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <button
            onClick={() => navigate("/provider/requests")}
            className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow text-left"
          >
            <Clock className="text-blue-600 mb-3" size={32} />
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              Manage Requests
            </h3>
            <p className="text-sm text-slate-600">
              Review and respond to new service requests
            </p>
          </button>

          <button
            onClick={() => navigate("/provider/profile")}
            className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow text-left"
          >
            <Package className="text-green-600 mb-3" size={32} />
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              Update Profile
            </h3>
            <p className="text-sm text-slate-600">
              Manage your services, pricing, and availability
            </p>
          </button>

          <button
            onClick={() => navigate("/provider/history")}
            className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow text-left"
          >
            <CheckCircle className="text-yellow-600 mb-3" size={32} />
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              Booking History
            </h3>
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

