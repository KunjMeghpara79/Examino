import { useState } from 'react';
import SpotlightCard from './SpotlightCard';
import GradientText from './GradientText';
import DecryptedText from './DecryptedText';

const SignUpCard = ({ onSwitchToLogin }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    otp: '',
    role: 'Student',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [otpSent, setOtpSent] = useState(false); // Can be replaced by step logic if desired, but keeping correct with step variable
  const [step, setStep] = useState(0); // 0: Email, 1: OTP, 2: Details

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (step === 0) {
        // Step 1: Send OTP
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/sendotp`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: formData.email }),
        });
        const data = await response.json();
        if (response.ok) {
          alert(`OTP sent to ${formData.email}!`);
          setStep(1);
          localStorage.setItem('email', formData.email);
          setOtpSent(true);
        } else {
          setError(data.message || 'Failed to send OTP.');
        }
      } else if (step === 1) {
        // Step 2: Verify OTP
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/verify-otp`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: localStorage.getItem('email'), otp: formData.otp }),
        });
        const data = await response.json();
        if (response.ok) {
          alert('Email verified! Please complete your registration.');
          setStep(2);
        } else {
          setError(data.message || 'Invalid OTP.');
        }
      } else if (step === 2) {
        // Step 3: Complete Registration
        if (formData.password !== formData.confirmPassword) {
          setError('Passwords do not match');
          setLoading(false);
          return;
        }

        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/create-user`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            password: formData.password,
            role: formData.role.toUpperCase(),
          }),
        });
        const data = await response.json();
        if (response.ok) {
          alert('Account created successfully! Please sign in.');
          if (onSwitchToLogin) onSwitchToLogin();
        } else {
          setError(data.message || 'Failed to create account.');
        }
      }
    } catch (err) {
      setError('Network error. Please try again.');
      console.error('Signup error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-screen overflow-hidden bg-black flex">
      {/* Left Side - Branding Section */}
      <div className="hidden lg:flex lg:w-1/2 relative items-center justify-center p-12 border-r border-zinc-800">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-pink-600/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-lg">
          <div className="mb-8">

            <h2 className="text-4xl font-bold text-white mb-6">
              <DecryptedText
                text="Begin a journey with Examino"
                animateOn="view"
                revealDirection="start"
                sequential
                useOriginalCharsOnly={false}
              />
            </h2>
          </div>

          <p className="text-xl text-gray-400 mb-8">
            Join thousands of learners pushing their limits and achieving excellence through competitive assessments.
          </p>

          {/* Feature Highlights */}
          <div className="space-y-4">
            {[
              { icon: "🎯", text: "Timed Exams with Integrity Monitoring" },
              { icon: "📊", text: "Real-time Performance Analytics" },
              { icon: "🏆", text: "Global Leaderboard Rankings" }
            ].map((feature, i) => (
              <div key={i} className="flex items-center gap-3 text-gray-300">
                <span className="text-2xl">{feature.icon}</span>
                <span className="text-base">{feature.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Side - Sign Up Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 overflow-y-auto">
        <div className="w-full max-w-md">
          <SpotlightCard
            className="w-full p-6"
            spotlightColor="rgba(82, 39, 255, 0.25)"
          >
            {/* Header */}
            <div className="text-center mb-4">
              {/* Mobile Logo */}
              <div className="lg:hidden mb-3">
                <h1 className="text-3xl font-bold">
                  <GradientText
                    colors={['#5227FF', '#FF9FFC', '#B19EEF']}
                    animationSpeed={8}
                    showBorder={false}
                  >
                    Examino
                  </GradientText>
                </h1>
              </div>

              <h2 className="text-3xl font-bold mb-1 py-1 leading-tight">
                <GradientText
                  colors={['#5227FF', '#FF9FFC', '#B19EEF']}
                  animationSpeed={8}
                  showBorder={false}
                >
                  {step === 0 ? 'Create Account' : step === 1 ? 'Verify OTP' : 'Complete Profile'}
                </GradientText>
              </h2>
              <p className="text-sm text-gray-400">
                {step === 0 ? 'Join Examino and start your journey' : step === 1 ? 'Enter the OTP sent to your email' : 'Fill in your details'}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {step === 0 && (
                <div>
                  <label htmlFor="email" className="block text-xs font-medium text-gray-400 mb-1">
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    name="email"
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="
                      w-full px-4 py-3 rounded-lg
                      bg-black border-2 border-neutral-800
                      text-white placeholder-gray-500
                      focus:outline-none focus:border-purple-600
                      transition-colors duration-300
                    "
                  />
                </div>
              )}

              {step === 1 && (
                <div>
                  <label htmlFor="otp" className="block text-xs font-medium text-gray-400 mb-1">
                    Enter OTP
                  </label>
                  <input
                    id="otp"
                    type="text"
                    name="otp"
                    placeholder="••••••"
                    value={formData.otp}
                    onChange={handleChange}
                    required
                    className="
                      w-full px-4 py-3 rounded-lg
                      bg-black border-2 border-neutral-800
                      text-white placeholder-gray-500
                      focus:outline-none focus:border-purple-600
                      transition-colors duration-300
                      tracking-widest text-center text-lg
                    "
                  />
                </div>
              )}

              {step === 2 && (
                <>
                  <div>
                    <label htmlFor="name" className="block text-xs font-medium text-gray-400 mb-1">
                      Full Name
                    </label>
                    <input
                      id="name"
                      type="text"
                      name="name"
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="
                        w-full px-3 py-2 rounded-lg
                        bg-black border-2 border-neutral-800
                        text-white placeholder-gray-500
                        focus:outline-none focus:border-purple-600
                        transition-colors duration-300
                      "
                    />
                  </div>
                  <div>
                    <label htmlFor="role" className="block text-xs font-medium text-gray-400 mb-1">
                      Role
                    </label>
                    <div className="relative">
                      <select
                        id="role"
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                        required
                        className="
                          w-full px-3 py-2 pr-10 rounded-lg
                          bg-black border-2 border-neutral-800
                          text-white
                          focus:outline-none focus:border-purple-600
                          transition-colors duration-300
                          cursor-pointer
                          appearance-none
                        "
                      >
                        <option value="Student" className="bg-black text-white">Student</option>
                        <option value="Teacher" className="bg-black text-white">Teacher</option>
                      </select>
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  <div>
                    <label htmlFor="password" className="block text-xs font-medium text-gray-400 mb-1">
                      Password
                    </label>
                    <input
                      id="password"
                      type="password"
                      name="password"
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      className="
                        w-full px-3 py-2 rounded-lg
                        bg-black border-2 border-neutral-800
                        text-white placeholder-gray-500
                        focus:outline-none focus:border-purple-600
                        transition-colors duration-300
                      "
                    />
                  </div>
                  <div>
                    <label htmlFor="confirmPassword" className="block text-xs font-medium text-gray-400 mb-1">
                      Confirm Password
                    </label>
                    <input
                      id="confirmPassword"
                      type="password"
                      name="confirmPassword"
                      placeholder="••••••••"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                      className="
                        w-full px-3 py-2 rounded-lg
                        bg-black border-2 border-neutral-800
                        text-white placeholder-gray-500
                        focus:outline-none focus:border-purple-600
                        transition-colors duration-300
                      "
                    />
                  </div>
                </>
              )}

              {/* Error Message */}
              {error && (
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/50 text-red-400 text-sm">
                  {error}
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="
                  w-full px-4 py-2.5 rounded-lg
                  border-2 border-purple-600
                  text-purple-600 bg-transparent
                  hover:bg-purple-600 hover:text-white
                  transition-all duration-300
                  font-medium text-base
                  hover:shadow-[0_0_15px_rgba(168,85,247,0.8)]
                  cursor-pointer
                  mt-2
                  disabled:opacity-50 disabled:cursor-not-allowed
                "
              >
                {loading
                  ? (step === 0 ? 'Sending OTP...' : step === 1 ? 'Verifying...' : 'Creating Account...')
                  : (step === 0 ? 'Verify Email' : step === 1 ? 'Verify OTP' : 'Create Account')}
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-3 my-4">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
              <span className="text-xs text-gray-400 uppercase tracking-wider">Or</span>
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
            </div>



            {/* Footer */}
            <p className="text-center text-xs text-gray-400 mt-4">
              Already have an account?{' '}
              <button
                onClick={onSwitchToLogin}
                className="text-purple-600 hover:text-purple-500 font-medium transition-colors duration-300 cursor-pointer"
              >
                Sign in
              </button>
            </p>
          </SpotlightCard>
        </div>
      </div>
    </div>
  );
};

export default SignUpCard;
