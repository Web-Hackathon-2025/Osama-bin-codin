import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { bookingAPI } from "../services/api";

interface Booking {
  _id: string;
  worker: {
    _id: string;
    name: string;
    email: string;
  };
  workerId?: {
    _id: string;
    name: string;
    email: string;
  };
  serviceCategory: string;
  description: string;
  scheduledDate: string;
  serviceAddress?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  address?: string;
  estimatedHours: number;
  totalAmount: number;
  status: string;
  paymentStatus: string;
  paymentMethod: string;
  createdAt: string;
  review?: {
    rating: number;
    comment: string;
  };
}

const CustomerBookings = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [reviewData, setReviewData] = useState({ rating: 5, comment: "" });

  useEffect(() => {
    // Check for payment success
    const paymentStatus = searchParams.get("payment");
    if (paymentStatus === "success") {
      setTimeout(() => {
        alert("Payment successful! Your booking has been confirmed.");
      }, 500);
    }
    fetchBookings();
  }, [searchParams]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await bookingAPI.getMyBookings();
      console.log("📦 Bookings response:", response.data);
      setBookings(response.data.bookings || response.data.data || []);
    } catch (error) {
      console.error("Error fetching bookings:", error);
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId: string) => {
    if (!confirm("Are you sure you want to cancel this booking?")) return;

    try {
      await bookingAPI.cancelBooking(bookingId, {
        cancellationReason: "Customer requested cancellation",
      });
      alert("Booking cancelled successfully");
      fetchBookings();
    } catch (error: any) {
      alert(error.response?.data?.message || "Failed to cancel booking");
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBooking) return;

    try {
      await bookingAPI.reviewBooking(selectedBooking._id, reviewData);
      alert("Review submitted successfully!");
      setShowReviewModal(false);
      setReviewData({ rating: 5, comment: "" });
      fetchBookings();
    } catch (error: any) {
      alert(error.response?.data?.message || "Failed to submit review");
    }
  };

  const filteredBookings =
    filter === "all"
      ? bookings
      : (bookings || []).filter((b) => b.status === filter);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "accepted":
        return "bg-blue-100 text-blue-800";
      case "in-progress":
        return "bg-purple-100 text-purple-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "rejected":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-slate-100 text-slate-800";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-slate-300 border-t-slate-900 rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-slate-600">Loading bookings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-8">My Bookings</h1>

        {/* Filter Tabs */}
        <div className="mb-6 flex flex-wrap gap-2">
          {[
            "all",
            "pending",
            "accepted",
            "in-progress",
            "completed",
            "cancelled",
          ].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg capitalize transition-colors ${
                filter === status
                  ? "bg-slate-900 text-white"
                  : "bg-white text-slate-700 hover:bg-slate-100"
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        {/* Bookings List */}
        {filteredBookings.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg">
            <p className="text-slate-600">No bookings found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredBookings.map((booking) => (
              <div
                key={booking._id}
                className="bg-white rounded-lg shadow-sm p-6"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-slate-900">
                      {booking.serviceCategory}
                    </h3>
                    <p className="text-sm text-slate-600">
                      Provider:{" "}
                      {booking.worker?.name || booking.workerId?.name || "N/A"}
                    </p>
                    <p className="text-sm text-slate-600">
                      Scheduled:{" "}
                      {new Date(booking.scheduledDate).toLocaleString()}
                    </p>
                    <p className="text-sm text-slate-600">
                      Payment:{" "}
                      <span className="capitalize">
                        {booking.paymentMethod}
                      </span>
                      {booking.paymentStatus === "paid" && " ✅"}
                    </p>
                  </div>
                  <div className="text-right">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                        booking.status
                      )}`}
                    >
                      {booking.status}
                    </span>
                    <p className="mt-2 text-xl font-bold text-slate-900">
                      ${booking.totalAmount}
                    </p>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-sm text-slate-700">
                    {booking.description}
                  </p>
                  <p className="text-sm text-slate-600 mt-1">
                    📍{" "}
                    {booking.serviceAddress?.street ||
                      booking.address ||
                      "Address not specified"}
                  </p>
                  <p className="text-sm text-slate-600">
                    ⏱️ {booking.estimatedHours} hours
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-2">
                  {booking.status === "accepted" ||
                  booking.status === "in-progress" ? (
                    <button
                      onClick={() => navigate(`/chat/${booking._id}`)}
                      className="px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors"
                    >
                      💬 Chat
                    </button>
                  ) : null}

                  {booking.status === "pending" && (
                    <button
                      onClick={() => handleCancelBooking(booking._id)}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                      Cancel Booking
                    </button>
                  )}

                  {booking.status === "completed" && !booking.review && (
                    <button
                      onClick={() => {
                        setSelectedBooking(booking);
                        setShowReviewModal(true);
                      }}
                      className="px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors"
                    >
                      ⭐ Leave Review
                    </button>
                  )}

                  {booking.review && (
                    <div className="w-full mt-2 p-3 bg-slate-50 rounded-lg">
                      <p className="text-sm font-medium text-slate-700">
                        Your Review
                      </p>
                      <div className="flex items-center mt-1">
                        <span className="text-yellow-500">
                          {"★".repeat(booking.review.rating)}
                          {"☆".repeat(5 - booking.review.rating)}
                        </span>
                      </div>
                      <p className="text-sm text-slate-600 mt-1">
                        {booking.review.comment}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Review Modal */}
      {showReviewModal && selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">
              Leave a Review
            </h2>
            <form onSubmit={handleSubmitReview} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Rating
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() =>
                        setReviewData({ ...reviewData, rating: star })
                      }
                      className="text-3xl"
                    >
                      {star <= reviewData.rating ? (
                        <span className="text-yellow-500">★</span>
                      ) : (
                        <span className="text-slate-300">☆</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Comment
                </label>
                <textarea
                  value={reviewData.comment}
                  onChange={(e) =>
                    setReviewData({ ...reviewData, comment: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                  rows={4}
                  required
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowReviewModal(false)}
                  className="flex-1 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors"
                >
                  Submit Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerBookings;
