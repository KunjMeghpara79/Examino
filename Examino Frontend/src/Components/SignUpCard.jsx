import { useState, useEffect } from 'react';
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
  const [error, setError] = useState({ text: '', type: '' });
  const [otpSent, setOtpSent] = useState(false); // Can be replaced by step logic if desired, but keeping correct with step variable
  const [step, setStep] = useState(0); // 0: Email, 1: OTP, 2: Details
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [resending, setResending] = useState(false);

  useEffect(() => {
    let interval;
    if (step === 1 && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [step, timer]);

  const validatePassword = (password) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password);

    if (password.length < minLength) return 'Password must be at least 8 characters long.';
    if (!hasUpperCase) return 'Password must contain at least one uppercase letter.';
    if (!hasLowerCase) return 'Password must contain at least one lowercase letter.';
    if (!hasNumber) return 'Password must contain at least one number.';
    if (!hasSpecialChar) return 'Password must contain at least one special character.';
    return null;
  };

  const handleSendOtp = async () => {
    setError({ text: '', type: '' });
    if (step === 0) {
      setLoading(true);
    } else {
      setResending(true);
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/sendotp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email }),
      });
      const data = await response.json();
      if (response.ok) {
        setError({ text: `OTP sent to ${formData.email}!`, type: 'success' });
        setStep(1);
        localStorage.setItem('email', formData.email);
        setOtpSent(true);
        setTimer(60);
        setCanResend(false);
      } else {
        setError({ text: data.message || 'Failed to send OTP.', type: 'error' });
      }
    } catch (err) {
      setError({ text: 'Network error. Please try again.', type: 'error' });
    } finally {
      setLoading(false);
      setResending(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError({ text: '', type: '' });
    setLoading(true);

    try {
      if (step === 0) {
        // Step 1: Send OTP
        await handleSendOtp();
      } else if (step === 1) {
        // Step 2: Verify OTP
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/verify-otp`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: localStorage.getItem('email'), otp: formData.otp }),
        });
        const data = await response.json();
        if (response.ok) {
          setError({ text: 'Email verified! Please complete your registration.', type: 'success' });
          setStep(2);
        } else {
          setError({ text: data.message || 'Invalid OTP.', type: 'error' });
        }
      } else if (step === 2) {
        // Step 3: Complete Registration
        if (formData.password !== formData.confirmPassword) {
          setError({ text: 'Passwords do not match', type: 'error' });
          setLoading(false);
          return;
        }

        const passwordError = validatePassword(formData.password);
        if (passwordError) {
          setError({ text: passwordError, type: 'error' });
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
          setError({ text: 'Account created successfully! Please sign in.', type: 'success' });
          setTimeout(() => {
            if (onSwitchToLogin) onSwitchToLogin();
          }, 2000);
        } else {
          setError({ text: data.message || 'Failed to create account.', type: 'error' });
        }
      }
    } catch (err) {
      setError({ text: 'Network error. Please try again.', type: 'error' });
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
                <>
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
                  <div className="text-center mt-2">
                    {resending ? null : canResend ? (
                      <button
                        type="button"
                        onClick={handleSendOtp}
                        className="text-sm text-purple-400 hover:text-purple-300 underline cursor-pointer"
                      >
                        Resend OTP
                      </button>
                    ) : (
                      <p className="text-sm text-gray-400">
                        Resend OTP in <span className="font-bold text-white">{timer}s</span>
                      </p>
                    )}
                  </div>
                </>
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

              {/* Response Message */}
              {error.text && (
                <div
                  className={`p-3 rounded-lg border text-sm ${error.type === 'success'
                    ? 'bg-green-500/10 border-green-500/50 text-green-400'
                    : 'bg-red-500/10 border-red-500/50 text-red-400'
                    }`}
                >
                  {error.text}
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading || resending}
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
                {resending ? 'Sending...' : loading
                  ? (step === 0 ? 'Sending OTP...' : step === 1 ? 'Verifying...' : 'Creating Account...')
                  : (step === 0 ? 'Verify Email' : step === 1 ? 'Verify OTP' : 'Create Account')}
              </button>
            </form>

            {/* Google Sign In - Only show on Step 0 */}
            {step === 0 && (
              <>
                <div className="flex items-center gap-3 my-5">
                  <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                  <span className="text-xs text-gray-400 uppercase tracking-wider">Or</span>
                  <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                </div>

                <button
                  type="button"
                  className="
                    w-full px-4 py-3 rounded-lg
                    bg-white/5 border-2 border-neutral-800
                    text-white font-medium
                    hover:bg-white/10 hover:border-neutral-700
                    transition-all duration-300
                    flex items-center justify-center gap-3
                    cursor-pointer
                  "
                  onClick={() => window.location.href = `${import.meta.env.VITE_API_BASE_URL}/oauth2/authorization/google`}
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                  </svg>
                  Continue with Google
                </button>
              </>
            )}



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
