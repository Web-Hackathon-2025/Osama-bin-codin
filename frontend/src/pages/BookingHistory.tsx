import React, { useEffect, useState } from "react";
import { Calendar, Clock, User, DollarSign, Filter } from "lucide-react";
import { bookingAPI } from "../services/api";
import StatusBadge from "../components/StatusBadge";
import { useNavigate } from "react-router-dom";

interface Booking {
  _id: string;
  customer: { _id: string; name: string; email: string };
  serviceCategory: string;
  description: string;
  scheduledDate: string;
  scheduledTime: string;
  estimatedHours: number;
  totalAmount: number;
  workerAmount?: number;
  status: string;
  paymentStatus: string;
  paymentMethod: string;
  createdAt: string;
}

const BookingHistory: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>("all");

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await bookingAPI.getMyBookings();
      console.log("📦 Worker history:", response.data);
      setBookings(response.data.bookings || response.data.data || []);
    } catch (error) {
      console.error("Error fetching bookings:", error);
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  // Apply status filter
  const filteredBookings =
    statusFilter === "all"
      ? bookings
      : bookings.filter((b) => b.status === statusFilter);

  // Sort by date (newest first)
  const sortedBookings = [...filteredBookings].sort((a, b) => {
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  // Calculate earnings from completed bookings
  const totalEarnings = bookings
    .filter((b) => b.status === "completed")
    .reduce((sum, b) => sum + (b.workerAmount || b.totalAmount || 0), 0);

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
            Booking History
          </h1>
          <p className="text-lg text-slate-600">
            View all your confirmed and completed bookings
          </p>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-sm font-medium text-slate-600 mb-2">
              Total Bookings
            </h3>
            <p className="text-3xl font-bold text-slate-900">
              {bookings.length}
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-sm font-medium text-slate-600 mb-2">
              Completed Jobs
            </h3>
            <p className="text-3xl font-bold text-green-600">
              {bookings.filter((b) => b.status === "completed").length}
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-sm font-medium text-slate-600 mb-2">
              Total Earnings
            </h3>
            <p className="text-3xl font-bold text-purple-600">
              ${totalEarnings.toFixed(2)}
            </p>
          </div>
        </div>

        {/* Status Filter */}
        <div className="bg-white rounded-xl shadow-md p-4 md:p-6 mb-8">
          <div className="flex items-center space-x-2 mb-4">
            <Filter size={20} className="text-slate-700" />
            <h2 className="text-lg font-semibold text-slate-900">
              Filter by Status
            </h2>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setStatusFilter("all")}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                statusFilter === "all"
                  ? "bg-slate-900 text-white"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setStatusFilter("accepted")}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                statusFilter === "accepted"
                  ? "bg-slate-900 text-white"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              Accepted
            </button>
            <button
              onClick={() => setStatusFilter("in-progress")}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                statusFilter === "in-progress"
                  ? "bg-slate-900 text-white"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              In Progress
            </button>
            <button
              onClick={() => setStatusFilter("completed")}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                statusFilter === "completed"
                  ? "bg-slate-900 text-white"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              Completed
            </button>
            <button
              onClick={() => setStatusFilter("cancelled")}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                statusFilter === "cancelled"
                  ? "bg-blue-600 text-white"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
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
              <div
                key={booking.id}
                className="bg-white rounded-xl shadow-md p-6"
              >
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-xl font-semibold text-slate-900 mb-1">
                          {booking.serviceCategory}
                        </h3>
                        <p className="text-sm text-slate-600">
                          {booking.description}
                        </p>
                      </div>
                      <StatusBadge status={booking.status} />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
                      <div className="flex items-center space-x-2 text-slate-600">
                        <User size={18} className="flex-shrink-0" />
                        <span className="text-sm">{booking.customer.name}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-slate-600">
                        <Calendar size={18} className="flex-shrink-0" />
                        <span className="text-sm">
                          {new Date(booking.scheduledDate).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            }
                          )}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 text-slate-600">
                        <Clock size={18} className="flex-shrink-0" />
                        <span className="text-sm">{booking.scheduledTime}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-slate-600">
                        <DollarSign size={18} className="flex-shrink-0" />
                        <span className="text-sm font-semibold">
                          ${booking.workerAmount || booking.totalAmount}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-start space-x-2 mb-3">
                      <p className="text-sm text-slate-600">
                        <span className="font-medium">Description:</span>{" "}
                        {booking.description}
                      </p>
                    </div>

                    {(booking.status === "accepted" ||
                      booking.status === "in-progress") && (
                      <div className="mt-4">
                        <button
                          onClick={() => navigate(`/chat/${booking._id}`)}
                          className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-medium rounded-lg transition-colors flex items-center space-x-2"
                        >
                          <span>💬</span>
                          <span>Chat with Customer</span>
                        </button>
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
              {statusFilter === "all"
                ? "No bookings in your history yet"
                : `No ${statusFilter} bookings found`}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingHistory;

