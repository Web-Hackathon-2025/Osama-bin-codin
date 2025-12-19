import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { authAPI } from "../services/api";

export default function VerifyOTP() {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const { verifyOTP } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || "";

  useEffect(() => {
    if (!email) {
      navigate("/register");
    }
  }, [email, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await verifyOTP(email, otp);
      setSuccess("Email verified successfully!");

      // If worker, redirect to Stripe onboarding or profile
      // If user, redirect to browse services
      // If admin, redirect to admin dashboard
      setTimeout(() => {
        if (result.user.role === "worker") {
          navigate("/worker-onboarding");
        } else if (result.user.role === "admin") {
          navigate("/admin/dashboard");
        } else {
          navigate("/browse");
        }
      }, 1500);
    } catch (err: any) {
      setError(err.response?.data?.message || "OTP verification failed");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setError("");
    setSuccess("");
    try {
      await authAPI.resendOTP({ email });
      setSuccess("OTP sent successfully! Check your email.");
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to resend OTP");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 py-12 px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-slate-900">
              Verify Your Email
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              We sent a 6-digit code to
              <br />
              <span className="font-medium">{email}</span>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
                {error}
              </div>
            )}
            {success && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md text-sm">
                {success}
              </div>
            )}

            <div>
              <label
                htmlFor="otp"
                className="block text-sm font-medium text-slate-700 mb-2"
              >
                Enter Verification Code
              </label>
              <input
                id="otp"
                type="text"
                required
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                className="block w-full px-3 py-3 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-slate-500 text-center text-2xl tracking-[0.5em]"
                placeholder="000000"
              />
            </div>

            <button
              type="submit"
              disabled={loading || otp.length !== 6}
              className="w-full py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-slate-900 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 disabled:opacity-50"
            >
              {loading ? "Verifying..." : "Verify Email"}
            </button>

            <div className="text-center">
              <button
                type="button"
                onClick={handleResendOTP}
                className="text-sm text-slate-700 hover:text-slate-900 font-medium"
              >
                Didn't receive code?{" "}
                <span className="underline">Resend OTP</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

