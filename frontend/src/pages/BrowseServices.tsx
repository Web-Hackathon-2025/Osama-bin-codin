import { useState, useEffect } from "react";
import { workerAPI, bookingAPI } from "../services/api";

interface Worker {
  _id: string;
  name: string;
  email: string;
  workerProfile: {
    jobCategories: string[];
    experience: number;
    hourlyRate: number;
    skills: string[];
    availability: string;
    serviceAreas: string[];
    rating?: number;
    totalJobs?: number;
    bio?: string;
  };
}

const jobCategories = [
  "Plumbing",
  "Electrical",
  "Carpentry",
  "Painting",
  "Cleaning",
  "Landscaping",
  "HVAC",
  "Roofing",
  "Moving",
  "Pest Control",
  "Appliance Repair",
  "Handyman",
  "Other",
];

// Helper to convert display name to backend enum value
const convertCategoryToBackend = (category: string): string => {
  const mapping: { [key: string]: string } = {
    Plumbing: "plumber",
    Electrical: "electrician",
    Carpentry: "carpenter",
    Painting: "painter",
    Cleaning: "cleaner",
    Landscaping: "gardener",
    HVAC: "ac-technician",
    Roofing: "other",
    Moving: "moving-services",
    "Pest Control": "pest-control",
    "Appliance Repair": "appliance-repair",
    Handyman: "other",
    Other: "other",
  };
  return mapping[category] || "other";
};

const BrowseServices = () => {
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [filteredWorkers, setFilteredWorkers] = useState<Worker[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedWorker, setSelectedWorker] = useState<Worker | null>(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [profileWorker, setProfileWorker] = useState<Worker | null>(null);
  const [bookingData, setBookingData] = useState({
    serviceCategory: "",
    description: "",
    scheduledDate: "",
    scheduledTime: "",
    address: "",
    estimatedHours: 1,
    paymentMethod: "cash",
  });
  const [bookingLoading, setBookingLoading] = useState(false);

  useEffect(() => {
    fetchWorkers();
  }, []);

  useEffect(() => {
    if (selectedCategory === "All") {
      setFilteredWorkers(workers || []);
    } else {
      setFilteredWorkers(
        (workers || []).filter((w) =>
          w.workerProfile?.jobCategories?.includes(selectedCategory)
        )
      );
    }
  }, [selectedCategory, workers]);

  const fetchWorkers = async () => {
    try {
      setLoading(true);
      const response = await workerAPI.getWorkers({ isApproved: true });
      setWorkers(response.data.data || []);
      setFilteredWorkers(response.data.data || []);
    } catch (error) {
      console.error("Error fetching workers:", error);
      setWorkers([]);
      setFilteredWorkers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleBookService = (worker: Worker) => {
    setSelectedWorker(worker);
    setBookingData({
      ...bookingData,
      serviceCategory:
        worker.workerProfile.jobCategories[0] || "General Service",
    });
    setShowBookingModal(true);
  };

  const handleViewProfile = (worker: Worker) => {
    setProfileWorker(worker);
    setShowProfileModal(true);
  };

  const handleSubmitBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedWorker) return;

    try {
      setBookingLoading(true);

      const bookingPayload = {
        workerId: selectedWorker._id,
        serviceCategory: convertCategoryToBackend(bookingData.serviceCategory),
        description: bookingData.description,
        scheduledDate: bookingData.scheduledDate,
        scheduledTime: bookingData.scheduledTime,
        serviceAddress: {
          street: bookingData.address,
        },
        estimatedHours: bookingData.estimatedHours,
        paymentMethod: bookingData.paymentMethod,
      };

      console.log("📤 Sending booking request:", bookingPayload);

      // Create booking
      const bookingResponse = await bookingAPI.createBooking(bookingPayload);

      console.log("✅ Booking response:", bookingResponse.data);

      // If cash payment, just show success and redirect
      if (bookingData.paymentMethod === "cash") {
        alert(
          "Booking created successfully! Payment will be collected in cash."
        );
        setShowBookingModal(false);
        setBookingData({
          serviceCategory: "",
          description: "",
          scheduledDate: "",
          scheduledTime: "",
          address: "",
          estimatedHours: 1,
          paymentMethod: "cash",
        });
        window.location.href = "/customer/bookings";
        return;
      }

      // Handle Stripe payment - redirect to Checkout
      if (bookingData.paymentMethod === "stripe") {
        const checkoutUrl = bookingResponse.data.checkoutUrl;

        if (!checkoutUrl) {
          throw new Error("No checkout URL received from server");
        }

        // Redirect to Stripe Checkout
        window.location.href = checkoutUrl;
        return;
      }
    } catch (error: any) {
      console.error("❌ Error creating booking:", error);
      console.error("Error response:", error.response);

      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to create booking";

      alert(`Booking Error: ${errorMessage}`);
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-slate-300 border-t-slate-900 rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-slate-600">Loading services...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-8">
          Browse Services
        </h1>

        {/* Category Filter */}
        <div className="mb-8 bg-white rounded-lg shadow-sm p-4">
          <h2 className="text-sm font-semibold text-slate-700 mb-3">
            Filter by Category
          </h2>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory("All")}
              className={`px-4 py-2 rounded-lg transition-colors ${
                selectedCategory === "All"
                  ? "bg-slate-900 text-white"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              All
            </button>
            {jobCategories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  selectedCategory === category
                    ? "bg-slate-900 text-white"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Workers Grid */}
        {filteredWorkers.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-600">
              No service providers found in this category
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredWorkers.map((worker) => (
              <div
                key={worker._id}
                className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-slate-900">
                      {worker.name}
                    </h3>
                    <div className="flex items-center mt-1">
                      <span className="text-yellow-500">★</span>
                      <span className="ml-1 text-sm text-slate-600">
                        {(worker.workerProfile.rating || 0).toFixed(1)} (
                        {worker.workerProfile.totalJobs || 0} reviews)
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-slate-900">
                      ${worker.workerProfile.hourlyRate}
                    </p>
                    <p className="text-xs text-slate-600">/hour</p>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div>
                    <p className="text-sm font-medium text-slate-700">
                      Services
                    </p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {worker.workerProfile.jobCategories.map((cat) => (
                        <span
                          key={cat}
                          className="px-2 py-1 bg-slate-100 text-slate-700 text-xs rounded"
                        >
                          {cat}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-slate-700">
                      Experience
                    </p>
                    <p className="text-sm text-slate-600">
                      {worker.workerProfile.experience} years
                    </p>
                  </div>

                  {worker.workerProfile.skills.length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-slate-700">
                        Skills
                      </p>
                      <p className="text-sm text-slate-600">
                        {worker.workerProfile.skills.slice(0, 3).join(", ")}
                        {worker.workerProfile.skills.length > 3 && "..."}
                      </p>
                    </div>
                  )}

                  <div>
                    <p className="text-sm font-medium text-slate-700">
                      Availability
                    </p>
                    <p className="text-sm text-slate-600">
                      {worker.workerProfile.availability}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleViewProfile(worker)}
                    className="py-2 bg-slate-100 text-slate-900 rounded-lg hover:bg-slate-200 transition-colors"
                  >
                    View Profile
                  </button>
                  <button
                    onClick={() => handleBookService(worker)}
                    className="py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors"
                  >
                    Book Service
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Booking Modal */}
      {showBookingModal && selectedWorker && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-slate-900">
                  Book Service
                </h2>
                <button
                  onClick={() => setShowBookingModal(false)}
                  className="text-slate-600 hover:text-slate-900"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <div className="mb-6 p-4 bg-slate-50 rounded-lg">
                <p className="text-sm text-slate-600">Service Provider</p>
                <p className="text-lg font-semibold text-slate-900">
                  {selectedWorker.name}
                </p>
                <p className="text-sm text-slate-600">
                  ${selectedWorker.workerProfile.hourlyRate}/hour
                </p>
              </div>

              <form onSubmit={handleSubmitBooking} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Service Category
                  </label>
                  <select
                    value={bookingData.serviceCategory}
                    onChange={(e) =>
                      setBookingData({
                        ...bookingData,
                        serviceCategory: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                    required
                  >
                    {selectedWorker.workerProfile.jobCategories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={bookingData.description}
                    onChange={(e) =>
                      setBookingData({
                        ...bookingData,
                        description: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                    rows={3}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Date
                    </label>
                    <input
                      type="date"
                      value={bookingData.scheduledDate}
                      onChange={(e) =>
                        setBookingData({
                          ...bookingData,
                          scheduledDate: e.target.value,
                        })
                      }
                      min={new Date().toISOString().split("T")[0]}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Time
                    </label>
                    <input
                      type="time"
                      value={bookingData.scheduledTime}
                      onChange={(e) =>
                        setBookingData({
                          ...bookingData,
                          scheduledTime: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Service Address
                  </label>
                  <input
                    type="text"
                    value={bookingData.address}
                    onChange={(e) =>
                      setBookingData({
                        ...bookingData,
                        address: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Estimated Hours
                  </label>
                  <input
                    type="number"
                    value={bookingData.estimatedHours}
                    onChange={(e) =>
                      setBookingData({
                        ...bookingData,
                        estimatedHours: parseInt(e.target.value),
                      })
                    }
                    min="1"
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                    required
                  />
                  <p className="text-sm text-slate-600 mt-1">
                    Estimated cost: $
                    {(
                      selectedWorker.workerProfile.hourlyRate *
                      bookingData.estimatedHours
                    ).toFixed(2)}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Payment Method
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center p-3 border border-slate-300 rounded-lg cursor-pointer hover:bg-slate-50">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="cash"
                        checked={bookingData.paymentMethod === "cash"}
                        onChange={(e) =>
                          setBookingData({
                            ...bookingData,
                            paymentMethod: e.target.value,
                          })
                        }
                        className="mr-3"
                      />
                      <div>
                        <div className="font-medium text-slate-900">
                          Cash Payment
                        </div>
                        <div className="text-sm text-slate-600">
                          Pay in cash when service is completed
                        </div>
                      </div>
                    </label>
                    <label className="flex items-center p-3 border border-slate-300 rounded-lg cursor-pointer hover:bg-slate-50">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="stripe"
                        checked={bookingData.paymentMethod === "stripe"}
                        onChange={(e) =>
                          setBookingData({
                            ...bookingData,
                            paymentMethod: e.target.value,
                          })
                        }
                        className="mr-3"
                      />
                      <div>
                        <div className="font-medium text-slate-900">
                          Online Payment (Stripe)
                        </div>
                        <div className="text-sm text-slate-600">
                          Pay securely with credit/debit card
                        </div>
                      </div>
                    </label>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowBookingModal(false)}
                    className="flex-1 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
                    disabled={bookingLoading}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors disabled:bg-slate-300"
                    disabled={bookingLoading}
                  >
                    {bookingLoading
                      ? "Processing..."
                      : bookingData.paymentMethod === "cash"
                      ? "Book Service"
                      : "Book & Pay Now"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Profile Modal */}
      {showProfileModal && profileWorker && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-slate-900">
                  Service Provider Profile
                </h2>
                <button
                  onClick={() => setShowProfileModal(false)}
                  className="text-slate-600 hover:text-slate-900"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <div className="space-y-6">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-3xl font-bold text-slate-900">
                      {profileWorker.name}
                    </h3>
                    <div className="flex items-center mt-2">
                      <span className="text-yellow-500 text-2xl">★</span>
                      <span className="ml-2 text-lg text-slate-700">
                        {(profileWorker.workerProfile.rating || 0).toFixed(1)} (
                        {profileWorker.workerProfile.totalJobs || 0} jobs
                        completed)
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-bold text-slate-900">
                      ${profileWorker.workerProfile.hourlyRate}
                    </p>
                    <p className="text-sm text-slate-600">/hour</p>
                  </div>
                </div>

                {/* Bio */}
                {profileWorker.workerProfile.bio && (
                  <div>
                    <h4 className="text-lg font-semibold text-slate-900 mb-2">
                      About
                    </h4>
                    <p className="text-slate-700">
                      {profileWorker.workerProfile.bio}
                    </p>
                  </div>
                )}

                {/* Services & Experience */}
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-lg font-semibold text-slate-900 mb-2">
                      Services Offered
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {profileWorker.workerProfile.jobCategories.map((cat) => (
                        <span
                          key={cat}
                          className="px-3 py-1 bg-slate-900 text-white text-sm rounded-full"
                        >
                          {cat}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold text-slate-900 mb-2">
                      Experience
                    </h4>
                    <p className="text-slate-700">
                      {profileWorker.workerProfile.experience} years of
                      professional experience
                    </p>
                  </div>
                </div>

                {/* Skills */}
                {profileWorker.workerProfile.skills.length > 0 && (
                  <div>
                    <h4 className="text-lg font-semibold text-slate-900 mb-2">
                      Skills
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {profileWorker.workerProfile.skills.map(
                        (skill, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-slate-100 text-slate-700 text-sm rounded"
                          >
                            {skill}
                          </span>
                        )
                      )}
                    </div>
                  </div>
                )}

                {/* Availability & Service Areas */}
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-lg font-semibold text-slate-900 mb-2">
                      Availability
                    </h4>
                    <p className="text-slate-700">
                      {profileWorker.workerProfile.availability}
                    </p>
                  </div>

                  {profileWorker.workerProfile.serviceAreas &&
                    profileWorker.workerProfile.serviceAreas.length > 0 && (
                      <div>
                        <h4 className="text-lg font-semibold text-slate-900 mb-2">
                          Service Areas
                        </h4>
                        <p className="text-slate-700">
                          {profileWorker.workerProfile.serviceAreas.join(", ")}
                        </p>
                      </div>
                    )}
                </div>

                {/* Contact */}
                <div>
                  <h4 className="text-lg font-semibold text-slate-900 mb-2">
                    Contact
                  </h4>
                  <p className="text-slate-700">{profileWorker.email}</p>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => {
                      setShowProfileModal(false);
                      handleBookService(profileWorker);
                    }}
                    className="flex-1 py-3 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors font-semibold"
                  >
                    Book This Provider
                  </button>
                  <button
                    onClick={() => setShowProfileModal(false)}
                    className="px-6 py-3 bg-slate-100 text-slate-900 rounded-lg hover:bg-slate-200 transition-colors font-semibold"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BrowseServices;

