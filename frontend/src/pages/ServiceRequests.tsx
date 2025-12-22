import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  Calendar,
  Clock,
  CheckCircle,
  X,
  CalendarClock,
} from "lucide-react";
import { bookingAPI } from "../services/api";
import StatusBadge from "../components/StatusBadge";
import Modal from "../components/Modal";

interface Booking {
  _id: string;
  customer: {
    _id: string;
    name: string;
    email: string;
    phone?: string;
  };
  serviceCategory: string;
  description: string;
  scheduledDate: string;
  scheduledTime: string;
  serviceAddress?: any;
  estimatedHours: number;
  totalAmount: number;
  status: 'pending' | 'accepted' | 'in-progress' | 'completed' | 'cancelled' | 'rejected';
  paymentStatus: string;
  paymentMethod: string;
  createdAt: string;
}

const ServiceRequests: React.FC = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = React.useState<Booking | null>(
    null
  );
  const [showModal, setShowModal] = React.useState(false);
  const [modalType, setModalType] = React.useState<
    "accept" | "reject" | "reschedule"
  >("accept");
  const [rescheduleDate, setRescheduleDate] = React.useState("");
  const [rescheduleTime, setRescheduleTime] = React.useState("");

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await bookingAPI.getMyBookings();
      console.log("📦 Worker bookings:", response.data);
      setBookings(response.data.bookings || response.data.data || []);
    } catch (error) {
      console.error("Error fetching bookings:", error);
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = (
    booking: Booking,
    action: "accept" | "reject" | "reschedule"
  ) => {
    setSelectedBooking(booking);
    setModalType(action);
    setShowModal(true);
  };

  const handleConfirm = async () => {
    if (!selectedBooking) return;

    try {
      if (modalType === "accept") {
        await bookingAPI.respondToBooking(selectedBooking._id, {
          action: "accept",
        });
        alert("Request accepted successfully!");
      } else if (modalType === "reject") {
        await bookingAPI.respondToBooking(selectedBooking._id, {
          action: "reject",
        });
        alert("Request rejected successfully!");
      }

      setShowModal(false);
      setSelectedBooking(null);
      setRescheduleDate("");
      setRescheduleTime("");
      fetchBookings(); // Refresh the list
    } catch (error: any) {
      alert(error.response?.data?.message || "Failed to update booking");
    }
  };

  const today = new Date().toISOString().split("T")[0];

  // Sort by status priority and date
  const sortedRequests = [...bookings].sort((a, b) => {
    const statusPriority: any = {
      pending: 0,
      accepted: 1,
      "in-progress": 2,
      completed: 3,
      cancelled: 4,
      rejected: 5,
    };
    if (statusPriority[a.status] !== statusPriority[b.status]) {
      return statusPriority[a.status] - statusPriority[b.status];
    }
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

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
            Service Requests
          </h1>
          <p className="text-lg text-slate-600">
            Manage incoming service requests and bookings
          </p>
        </div>

        {/* Requests List */}
        {sortedRequests.length > 0 ? (
          <div className="space-y-4">
            {sortedRequests.map((booking) => (
              <div
                key={booking._id}
                className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
                  <div className="flex-1 mb-4 lg:mb-0">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-xl font-semibold text-slate-900 mb-1">
                          {booking.serviceCategory}
                        </h3>
                        <p className="text-sm text-slate-600 font-medium">
                          Payment:{" "}
                          <span className="capitalize">
                            {booking.paymentMethod}
                          </span>
                          {booking.paymentStatus === "paid" && " ✅"}
                        </p>
                      </div>
                      <StatusBadge status={booking.status} />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                      <div className="flex items-center space-x-2 text-slate-600">
                        <User size={18} className="flex-shrink-0" />
                        <span className="text-sm font-medium">
                          {booking.customer.name}
                        </span>
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
                      <div className="text-sm font-semibold text-slate-900">
                        Amount: ${booking.totalAmount}
                      </div>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-lg">
                      <p className="text-sm text-slate-700">
                        <span className="font-medium">Request:</span>{" "}
                        {booking.description}
                      </p>
                    </div>

                    <p className="text-xs text-slate-500 mt-3">
                      Requested on{" "}
                      {new Date(booking.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                  {/* Action Buttons */}{" "}
                  {(booking.status === "accepted" ||
                    booking.status === "in-progress") && (
                    <div className="flex flex-col space-y-2 lg:ml-6 lg:min-w-40">
                      <button
                        onClick={() => navigate(`/chat/${booking._id}`)}
                        className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-medium rounded-lg transition-colors flex items-center justify-center space-x-2"
                      >
                        <span>💬</span>
                        <span>Chat</span>
                      </button>
                    </div>
                  )}{" "}
                  {booking.status === "pending" && (
                    <div className="flex flex-col space-y-2 lg:ml-6 lg:min-w-[160px]">
                      <button
                        onClick={() => handleAction(booking, "accept")}
                        className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors flex items-center justify-center space-x-2"
                      >
                        <CheckCircle size={18} />
                        <span>Accept</span>
                      </button>
                      <button
                        onClick={() => handleAction(booking, "reschedule")}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors flex items-center justify-center space-x-2"
                      >
                        <CalendarClock size={18} />
                        <span>Reschedule</span>
                      </button>
                      <button
                        onClick={() => handleAction(booking, "reject")}
                        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors flex items-center justify-center space-x-2"
                      >
                        <X size={18} />
                        <span>Reject</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <p className="text-xl text-slate-600">No service requests yet</p>
          </div>
        )}

        {/* Action Modal */}
        <Modal
          isOpen={showModal}
          onClose={() => {
            setShowModal(false);
            setSelectedBooking(null);
            setRescheduleDate("");
            setRescheduleTime("");
          }}
          title={
            modalType === "accept"
              ? "Accept Service Request"
              : modalType === "reject"
              ? "Reject Service Request"
              : "Reschedule Service Request"
          }
        >
          {selectedBooking && (
            <div>
              <div className="mb-6 p-4 bg-slate-50 rounded-lg">
                <h3 className="font-semibold text-slate-900 mb-2">
                  {selectedBooking.serviceCategory}
                </h3>
                <p className="text-sm text-slate-600">
                  Customer: {selectedBooking.customer.name}
                </p>
                <p className="text-sm text-slate-600">
                  Date:{" "}
                  {new Date(selectedBooking.scheduledDate).toLocaleDateString()}{" "}
                  at {selectedBooking.scheduledTime}
                </p>
                <p className="text-sm text-slate-600">
                  Amount: ${selectedBooking.totalAmount} (
                  {selectedBooking.estimatedHours} hours)
                </p>
              </div>

              {modalType === "accept" && (
                <p className="text-slate-700 mb-6">
                  Are you sure you want to accept this service request? The
                  customer will be notified.
                </p>
              )}

              {modalType === "reject" && (
                <p className="text-slate-700 mb-6">
                  Are you sure you want to reject this service request? This
                  action cannot be undone.
                </p>
              )}

              {modalType === "reschedule" && (
                <div className="space-y-4 mb-6">
                  <p className="text-slate-700">
                    Propose a new date and time for this service:
                  </p>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      New Date
                    </label>
                    <input
                      type="date"
                      value={rescheduleDate}
                      onChange={(e) => setRescheduleDate(e.target.value)}
                      min={today}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      New Time
                    </label>
                    <input
                      type="time"
                      value={rescheduleTime}
                      onChange={(e) => setRescheduleTime(e.target.value)}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              )}

              <div className="flex space-x-4">
                <button
                  onClick={() => {
                    setShowModal(false);
                    setSelectedBooking(null);
                    setRescheduleDate("");
                    setRescheduleTime("");
                  }}
                  className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 font-medium rounded-lg hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirm}
                  disabled={
                    modalType === "reschedule" &&
                    (!rescheduleDate || !rescheduleTime)
                  }
                  className={`flex-1 px-4 py-2 font-medium rounded-lg transition-colors ${
                    modalType === "accept"
                      ? "bg-green-600 hover:bg-green-700 text-white"
                      : modalType === "reject"
                      ? "bg-red-600 hover:bg-red-700 text-white"
                      : "bg-blue-600 hover:bg-blue-700 text-white disabled:bg-slate-300"
                  }`}
                >
                  Confirm
                </button>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </div>
  );
};

export default ServiceRequests;

