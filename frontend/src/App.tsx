import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { UserProvider } from "./context/UserContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ChatBox from "./components/ChatBox";

// Pages
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import VerifyOTP from "./pages/VerifyOTP";
import ForgotPassword from "./pages/ForgotPassword";
import WorkerOnboarding from "./pages/WorkerOnboarding";
import BrowseServices from "./pages/BrowseServices";
import ProviderProfile from "./pages/ProviderProfile";
import RequestService from "./pages/RequestService";
import CustomerBookings from "./pages/CustomerBookings";
import Chat from "./pages/Chat";
import WebSocketChat from "./pages/WebSocketChat";
import ChatDemo from "./pages/ChatDemo";
import Review from "./pages/Review";
import ProviderDashboard from "./pages/ProviderDashboard";
import ManageProfile from "./pages/ManageProfile";
import ServiceRequests from "./pages/ServiceRequests";
import BookingHistory from "./pages/BookingHistory";
import AdminDashboard from "./pages/AdminDashboard";

function AppContent() {
  const { user } = useAuth();

  return (
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
                <Route
                  path="/worker-onboarding"
                  element={<WorkerOnboarding />}
                />
                <Route path="/browse" element={<BrowseServices />} />
                <Route path="/provider/:id" element={<ProviderProfile />} />
                <Route path="/websocket-chat" element={<WebSocketChat />} />
                <Route path="/chat-demo" element={<ChatDemo />} />

                {/* Customer Routes */}
                <Route
                  path="/request-service/:id"
                  element={<RequestService />}
                />
                <Route
                  path="/customer/bookings"
                  element={<CustomerBookings />}
                />
                <Route path="/chat/:bookingId" element={<Chat />} />
                <Route path="/review/:bookingId" element={<Review />} />

                {/* Provider Routes */}
                <Route
                  path="/provider/dashboard"
                  element={<ProviderDashboard />}
                />
                <Route path="/provider/profile" element={<ManageProfile />} />
                <Route
                  path="/provider/requests"
                  element={<ServiceRequests />}
                />
                <Route path="/provider/history" element={<BookingHistory />} />

                {/* Admin Routes */}
                <Route path="/admin/dashboard" element={<AdminDashboard />} />

                {/* Fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
            <Footer />
            {/* Global Chat Widget - only show for authenticated users */}
            {user && <ChatBox />}
          </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <UserProvider>
        <Router>
          <AppContent />
        </Router>
      </UserProvider>
    </AuthProvider>
  );
}

export default App;
