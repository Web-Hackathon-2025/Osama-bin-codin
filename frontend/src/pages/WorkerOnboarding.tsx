import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { workerAPI } from "../services/api";

export default function WorkerOnboarding() {
  const [step, setStep] = useState<"welcome" | "stripe" | "completed">(
    "welcome"
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { refreshUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    checkStripeStatus();
  }, []);

  const checkStripeStatus = async () => {
    try {
      const response = await workerAPI.getStripeStatus();

      if (response.data.onboardingComplete) {
        setStep("completed");
      }
    } catch (err: any) {
      // No Stripe account yet
      console.log("No Stripe account:", err);
    }
  };

  const handleCreateStripeAccount = async () => {
    setLoading(true);
    setError("");

    try {
      // Create Stripe account
      await workerAPI.createStripeAccount();

      // Get onboarding link
      const response = await workerAPI.getStripeOnboardingLink();

      // Redirect to Stripe onboarding
      window.location.href = response.data.url;
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Failed to create Stripe account"
      );
      setLoading(false);
    }
  };

  const handleSkipForNow = () => {
    navigate("/provider/dashboard");
  };

  const handleContinue = async () => {
    await refreshUser();
    navigate("/provider/dashboard");
  };

  if (step === "welcome") {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full bg-white rounded-lg shadow-md p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-slate-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">
              Welcome to Karigar! 🎉
            </h1>
            <p className="text-slate-600">
              Your account has been created successfully
            </p>
          </div>

          <div className="mb-8">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">
              What's Next?
            </h2>
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-md">
                <div className="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center text-sm font-medium flex-shrink-0 mt-0.5">
                  1
                </div>
                <div>
                  <div className="font-medium text-slate-900">
                    Wait for Admin Approval
                  </div>
                  <div className="text-sm text-slate-600 mt-1">
                    An administrator will review your profile. You'll receive an
                    email notification once approved.
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-md">
                <div className="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center text-sm font-medium flex-shrink-0 mt-0.5">
                  2
                </div>
                <div>
                  <div className="font-medium text-slate-900">
                    Set Up Payments (Optional)
                  </div>
                  <div className="text-sm text-slate-600 mt-1">
                    Connect your Stripe account to receive online payments
                    directly. You can also accept cash payments.
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-md">
                <div className="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center text-sm font-medium flex-shrink-0 mt-0.5">
                  3
                </div>
                <div>
                  <div className="font-medium text-slate-900">
                    Start Receiving Requests
                  </div>
                  <div className="text-sm text-slate-600 mt-1">
                    Once approved, customers can find you and send booking
                    requests.
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setStep("stripe")}
              className="flex-1 py-3 px-4 bg-slate-900 text-white rounded-md hover:bg-slate-800 font-medium"
            >
              Set Up Payments Now
            </button>
            <button
              onClick={handleSkipForNow}
              className="flex-1 py-3 px-4 border border-slate-300 text-slate-700 rounded-md hover:bg-slate-50 font-medium"
            >
              Skip for Now
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (step === "stripe") {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full bg-white rounded-lg shadow-md p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-slate-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">
              Set Up Payment Account
            </h1>
            <p className="text-slate-600">
              Connect with Stripe to receive payments directly
            </p>
          </div>

          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
              {error}
            </div>
          )}

          <div className="mb-8">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">
              Why Connect Stripe?
            </h2>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <svg
                  className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <div className="text-slate-700">
                  Receive 90% of each booking payment directly to your bank
                  account
                </div>
              </div>
              <div className="flex items-start gap-3">
                <svg
                  className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <div className="text-slate-700">
                  Secure and fast payment processing
                </div>
              </div>
              <div className="flex items-start gap-3">
                <svg
                  className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <div className="text-slate-700">
                  Track all your earnings in one place
                </div>
              </div>
              <div className="flex items-start gap-3">
                <svg
                  className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <div className="text-slate-700">
                  You can still accept cash payments anytime
                </div>
              </div>
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-md p-4 mb-6">
            <div className="text-sm text-slate-600">
              <strong className="text-slate-900">Note:</strong> Stripe will ask
              for some basic information to verify your identity and set up your
              account. This is required by financial regulations.
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleCreateStripeAccount}
              disabled={loading}
              className="flex-1 py-3 px-4 bg-slate-900 text-white rounded-md hover:bg-slate-800 font-medium disabled:opacity-50"
            >
              {loading ? "Setting up..." : "Connect Stripe Account"}
            </button>
            <button
              onClick={handleSkipForNow}
              className="flex-1 py-3 px-4 border border-slate-300 text-slate-700 rounded-md hover:bg-slate-50 font-medium"
            >
              Skip for Now
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (step === "completed") {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full bg-white rounded-lg shadow-md p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">
              All Set! 🎉
            </h1>
            <p className="text-slate-600">
              Your payment account is connected and ready
            </p>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-md p-4 mb-6">
            <div className="text-sm text-green-800">
              ✓ Stripe account connected
              <br />
              ✓ Payments enabled
              <br />✓ Ready to receive bookings
            </div>
          </div>

          <button
            onClick={handleContinue}
            className="w-full py-3 px-4 bg-slate-900 text-white rounded-md hover:bg-slate-800 font-medium"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return null;
}
