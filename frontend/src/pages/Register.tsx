import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const JOB_CATEGORIES = [
  "plumber",
  "electrician",
  "carpenter",
  "cleaner",
  "painter",
  "tutor",
  "mechanic",
  "gardener",
  "ac-technician",
  "appliance-repair",
  "pest-control",
  "moving-packing",
  "home-nurse",
];

export default function Register() {
  const [step, setStep] = useState(1);
  const [role, setRole] = useState<"user" | "worker">("user");

  // Basic info
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");

  // Worker profile
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [experience, setExperience] = useState("");
  const [hourlyRate, setHourlyRate] = useState("");
  const [skills, setSkills] = useState("");
  const [availability, setAvailability] = useState("full-time");
  const [serviceAreas, setServiceAreas] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleCategoryToggle = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (step === 1) {
      if (!name || !email || !password || !phone) {
        setError("Please fill in all fields");
        return;
      }
      if (role === "worker") {
        setStep(2);
      } else {
        await submitRegistration();
      }
    } else if (step === 2) {
      if (selectedCategories.length === 0) {
        setError("Please select at least one service category");
        return;
      }
      if (!experience || !hourlyRate || !skills || !serviceAreas) {
        setError("Please fill in all worker details");
        return;
      }
      await submitRegistration();
    }
  };

  const submitRegistration = async () => {
    setLoading(true);
    try {
      const data: any = {
        name,
        email,
        password,
        phone,
        role,
      };

      if (role === "worker") {
        data.workerProfile = {
          jobCategories: selectedCategories,
          experience: parseInt(experience),
          hourlyRate: parseFloat(hourlyRate),
          skills: skills.split(",").map((s) => s.trim()),
          availability,
          serviceAreas: serviceAreas.split(",").map((s) => s.trim()),
        };
      }

      await register(data);
      navigate("/verify-otp", { state: { email, role } });
    } catch (err: any) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 py-12 px-4">
      <div className="max-w-2xl w-full">
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-slate-900">
              {step === 1 ? "Create your account" : "Complete Your Profile"}
            </h2>
            <p className="mt-2 text-slate-600">
              {step === 1
                ? "Join Karigar to find or offer services"
                : "Tell us about your services"}
            </p>
          </div>

          {/* Progress indicator for workers */}
          {role === "worker" && (
            <div className="mb-6 flex items-center justify-center">
              <div className="flex items-center gap-2">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    step >= 1
                      ? "bg-slate-900 text-white"
                      : "bg-slate-200 text-slate-600"
                  }`}
                >
                  1
                </div>
                <div
                  className={`w-16 h-1 ${
                    step >= 2 ? "bg-slate-900" : "bg-slate-200"
                  }`}
                />
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    step >= 2
                      ? "bg-slate-900 text-white"
                      : "bg-slate-200 text-slate-600"
                  }`}
                >
                  2
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
                {error}
              </div>
            )}

            {step === 1 && (
              <>
                {/* Role Selection */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    I want to
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => setRole("user")}
                      className={`p-4 border-2 rounded-lg text-left transition-all ${
                        role === "user"
                          ? "border-slate-900 bg-slate-50"
                          : "border-slate-200 hover:border-slate-300"
                      }`}
                    >
                      <div className="font-medium text-slate-900">
                        Find Services
                      </div>
                      <div className="text-sm text-slate-600 mt-1">
                        Browse and hire local service providers
                      </div>
                    </button>
                    <button
                      type="button"
                      onClick={() => setRole("worker")}
                      className={`p-4 border-2 rounded-lg text-left transition-all ${
                        role === "worker"
                          ? "border-slate-900 bg-slate-50"
                          : "border-slate-200 hover:border-slate-300"
                      }`}
                    >
                      <div className="font-medium text-slate-900">
                        Offer Services
                      </div>
                      <div className="text-sm text-slate-600 mt-1">
                        Get hired for your skills and services
                      </div>
                    </button>
                  </div>
                </div>

                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-slate-700"
                    >
                      Full Name
                    </label>
                    <input
                      id="name"
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-sm font-medium text-slate-700"
                    >
                      Phone Number
                    </label>
                    <input
                      id="phone"
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-slate-700"
                  >
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
                  />
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-slate-700"
                  >
                    Password (min 6 characters)
                  </label>
                  <input
                    id="password"
                    type="password"
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
                  />
                </div>
              </>
            )}

            {step === 2 && role === "worker" && (
              <>
                {/* Service Categories */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Service Categories *
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {JOB_CATEGORIES.map((category) => (
                      <button
                        key={category}
                        type="button"
                        onClick={() => handleCategoryToggle(category)}
                        className={`px-3 py-2 text-sm rounded-md border transition-all ${
                          selectedCategories.includes(category)
                            ? "border-slate-900 bg-slate-900 text-white"
                            : "border-slate-300 bg-white text-slate-700 hover:border-slate-400"
                        }`}
                      >
                        {category.replace("-", " ")}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Worker Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="experience"
                      className="block text-sm font-medium text-slate-700"
                    >
                      Experience (years) *
                    </label>
                    <input
                      id="experience"
                      type="number"
                      required
                      min="0"
                      value={experience}
                      onChange={(e) => setExperience(e.target.value)}
                      className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="hourlyRate"
                      className="block text-sm font-medium text-slate-700"
                    >
                      Hourly Rate ($) *
                    </label>
                    <input
                      id="hourlyRate"
                      type="number"
                      required
                      min="1"
                      step="0.01"
                      value={hourlyRate}
                      onChange={(e) => setHourlyRate(e.target.value)}
                      className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="skills"
                    className="block text-sm font-medium text-slate-700"
                  >
                    Skills (comma separated) *
                  </label>
                  <input
                    id="skills"
                    type="text"
                    required
                    value={skills}
                    onChange={(e) => setSkills(e.target.value)}
                    placeholder="e.g., pipe fixing, wiring, painting"
                    className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
                  />
                </div>

                <div>
                  <label
                    htmlFor="availability"
                    className="block text-sm font-medium text-slate-700"
                  >
                    Availability
                  </label>
                  <select
                    id="availability"
                    value={availability}
                    onChange={(e) => setAvailability(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
                  >
                    <option value="full-time">Full Time</option>
                    <option value="part-time">Part Time</option>
                    <option value="weekends">Weekends Only</option>
                    <option value="flexible">Flexible</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="serviceAreas"
                    className="block text-sm font-medium text-slate-700"
                  >
                    Service Areas (comma separated) *
                  </label>
                  <input
                    id="serviceAreas"
                    type="text"
                    required
                    value={serviceAreas}
                    onChange={(e) => setServiceAreas(e.target.value)}
                    placeholder="e.g., New York, Brooklyn, Manhattan"
                    className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
                  />
                </div>
              </>
            )}

            <div className="flex gap-3">
              {step === 2 && (
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex-1 py-2 px-4 border border-slate-300 rounded-md shadow-sm text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500"
                >
                  Back
                </button>
              )}
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-slate-900 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 disabled:opacity-50"
              >
                {loading
                  ? "Processing..."
                  : step === 1 && role === "worker"
                  ? "Continue"
                  : "Sign up"}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center text-sm text-slate-600">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-medium text-slate-900 hover:text-slate-700"
            >
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
