import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { UserProvider } from "./context/UserContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// Pages
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import VerifyOTP from "./pages/VerifyOTP";
import ForgotPassword from "./pages/ForgotPassword";
import BrowseServices from "./pages/BrowseServices";
import ProviderProfile from "./pages/ProviderProfile";
import RequestService from "./pages/RequestService";
import CustomerBookings from "./pages/CustomerBookings";
import Review from "./pages/Review";
import ProviderDashboard from "./pages/ProviderDashboard";
import ManageProfile from "./pages/ManageProfile";
import ServiceRequests from "./pages/ServiceRequests";
import BookingHistory from "./pages/BookingHistory";
import AdminDashboard from "./pages/AdminDashboard";

function App() {
  return (
    <AuthProvider>
      <UserProvider>
        <Router>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-1">
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Landing />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/verify-otp" element={<VerifyOTP />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/browse" element={<BrowseServices />} />
                <Route path="/provider/:id" element={<ProviderProfile />} />
              
              {/* Customer Routes */}
              <Route path="/request-service/:id" element={<RequestService />} />
              <Route path="/customer/bookings" element={<CustomerBookings />} />
              <Route path="/review/:bookingId" element={<Review />} />
              
              {/* Provider Routes */}
              <Route path="/provider/dashboard" element={<ProviderDashboard />} />
              <Route path="/provider/profile" element={<ManageProfile />} />
              <Route path="/provider/requests" element={<ServiceRequests />} />
              <Route path="/provider/history" element={<BookingHistory />} />
              
              {/* Admin Routes */}
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              
              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
      </UserProvider>
    </AuthProvider>
  );
}

export default App;
