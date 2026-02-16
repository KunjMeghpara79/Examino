import { useState, useEffect } from 'react';
import SpotlightCard from './SpotlightCard';
import GradientText from './GradientText';
import DecryptedText from './DecryptedText';

const LoginCard = ({ onSwitchToSignup }) => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState({ text: '', type: '' });

    // Forgot Password States
    const [mode, setMode] = useState('login'); // 'login' or 'forgot'
    const [forgotStep, setForgotStep] = useState(0); // 0: Email, 1: OTP, 2: NewPassword
    const [resetData, setResetData] = useState({
        email: '',
        otp: '',
        newPassword: '',
        confirmNewPassword: ''
    });
    const [timer, setTimer] = useState(60);
    const [canResend, setCanResend] = useState(false);
    const [resending, setResending] = useState(false);

    useEffect(() => {
        let interval;
        if (mode === 'forgot' && forgotStep === 1 && timer > 0) {
            interval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
        } else if (timer === 0) {
            setCanResend(true);
        }
        return () => clearInterval(interval);
    }, [mode, forgotStep, timer]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleResetChange = (e) => {
        setResetData({
            ...resetData,
            [e.target.name]: e.target.value,
        });
    };

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError({ text: '', type: '' });

        try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: formData.email,
                    password: formData.password,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                // Determine user role and redirect accordingly
                // Assuming the backend returns a token and user details
                localStorage.setItem('token', data.token);
                console.log(data);
                localStorage.setItem('user', JSON.stringify(data.user)); // Optional: store user info
                // TODO: Redirect to dashboard based on role
                // navigate('/dashboard'); 
            } else {
                setError({ text: data.message || 'Login failed. Please check your credentials.', type: 'error' });
            }
        } catch (err) {
            console.error('Login error:', err);
            setError({ text: 'Network error. Please try again later.', type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const handleSendResetOtp = async () => {
        setError({ text: '', type: '' });
        if (forgotStep === 0) {
            setLoading(true);
        } else {
            setResending(true);
        }

        try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/forgot-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: resetData.email }),
            });
            const data = await response.json();
            if (response.ok) {
                setError({ text: `Reset OTP sent to ${resetData.email}!`, type: 'success' });
                setForgotStep(1);
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

    const handleVerifyResetOtp = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError({ text: '', type: '' });

        try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/verify-reset-otp`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: resetData.email, otp: resetData.otp }),
            });
            const data = await response.json();
            if (response.ok) {
                setError({ text: 'OTP Verified! Please enter new password.', type: 'success' });
                setForgotStep(2);
            } else {
                setError({ text: data.message || 'Invalid OTP.', type: 'error' });
            }
        } catch (err) {
            setError({ text: 'Network error. Please try again.', type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        if (resetData.newPassword !== resetData.confirmNewPassword) {
            setError({ text: 'Passwords do not match', type: 'error' });
            return;
        }

        setLoading(true);
        setError({ text: '', type: '' });

        try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/reset-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: resetData.email, password: resetData.newPassword }),
            });
            const data = await response.json();
            if (response.ok) {
                setError({ text: 'Password reset successfully! Redirecting to login...', type: 'success' });
                setTimeout(() => {
                    setMode('login');
                    setForgotStep(0);
                    setError({ text: '', type: '' });
                    setFormData(prev => ({ ...prev, email: resetData.email }));
                }, 2000);
            } else {
                setError({ text: data.message || 'Failed to reset password.', type: 'error' });
            }
        } catch (err) {
            setError({ text: 'Network error. Please try again.', type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const handleForgotSubmit = (e) => {
        e.preventDefault();
        if (forgotStep === 0) {
            handleSendResetOtp();
        } else if (forgotStep === 1) {
            handleVerifyResetOtp(e);
        } else if (forgotStep === 2) {
            handleResetPassword(e);
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
                                text="Welcome Back!"
                                animateOn="view"
                                revealDirection="start"
                                sequential
                                useOriginalCharsOnly={false}
                            />
                        </h2>
                    </div>

                    <p className="text-xl text-gray-400 mb-8">
                        Continue your learning journey and track your progress with competitive assessments.
                    </p>

                    {/* Feature Highlights */}
                    <div className="space-y-4">
                        {[
                            { icon: "📈", text: "Track Your Progress Over Time" },
                            { icon: "🎓", text: "Access All Your Exam Results" },
                            { icon: "⚡", text: "Resume Where You Left Off" }
                        ].map((feature, i) => (
                            <div key={i} className="flex items-center gap-3 text-gray-300">
                                <span className="text-2xl">{feature.icon}</span>
                                <span className="text-base">{feature.text}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Right Side - Login Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 overflow-y-auto">
                <div className="w-full max-w-md">
                    <SpotlightCard
                        className="w-full"
                        spotlightColor="rgba(82, 39, 255, 0.25)"
                    >
                        {/* Header */}
                        <div className="text-center mb-6">
                            {/* Mobile Logo */}
                            <div className="lg:hidden mb-4">
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

                            <h2 className="text-4xl font-bold mb-2 py-2 leading-tight">
                                <GradientText
                                    colors={['#5227FF', '#FF9FFC', '#B19EEF']}
                                    animationSpeed={8}
                                    showBorder={false}
                                >
                                    {mode === 'login' ? 'Sign in' : 'Recover Account'}
                                </GradientText>
                            </h2>
                        </div>

                        {mode === 'login' ? (
                            <form onSubmit={handleLoginSubmit} className="space-y-3">
                                {/* Email Input */}
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-400 mb-2">
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

                                {/* Password Input */}
                                <div>
                                    <div className="flex justify-between items-center mb-2">
                                        <label htmlFor="password" className="block text-sm font-medium text-gray-400">
                                            Password
                                        </label>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setMode('forgot');
                                                setForgotStep(0);
                                                setError({ text: '', type: '' });
                                            }}
                                            className="text-sm text-purple-600 hover:text-purple-500 transition-colors duration-300 cursor-pointer"
                                        >
                                            Forgot password?
                                        </button>
                                    </div>
                                    <div className="relative">
                                        <input
                                            id="password"
                                            type={showPassword ? "text" : "password"}
                                            name="password"
                                            placeholder="••••••••"
                                            value={formData.password}
                                            onChange={handleChange}
                                            required
                                            className="
                          w-full px-4 py-3 pr-12 rounded-lg
                          bg-black border-2 border-neutral-800
                          text-white placeholder-gray-500
                          focus:outline-none focus:border-purple-600
                          transition-colors duration-300
                        "
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="
                          absolute right-3 top-1/2 -translate-y-1/2
                          text-gray-400 hover:text-purple-600
                          transition-colors duration-300
                          focus:outline-none
                          cursor-pointer
                        "
                                            aria-label={showPassword ? "Hide password" : "Show password"}
                                        >
                                            {showPassword ? (
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                                </svg>
                                            ) : (
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                </svg>
                                            )}
                                        </button>
                                    </div>
                                </div>

                                {/* Error Message */}
                                {error.text && (
                                    <div className={`p-3 rounded-lg border text-sm ${error.type === 'success' ? 'bg-green-500/10 border-green-500/50 text-green-400' : 'bg-red-500/10 border-red-500/50 text-red-400'}`}>
                                        {error.text}
                                    </div>
                                )}

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="
                      w-full px-6 py-3 rounded-lg 
                      border-2 border-purple-600 
                      text-purple-600 bg-transparent 
                      hover:bg-purple-600 hover:text-white 
                      transition-all duration-300 
                      font-medium text-lg
                      hover:shadow-[0_0_15px_rgba(168,85,247,0.8)]
                      cursor-pointer
                      mt-2
                      disabled:opacity-50 disabled:cursor-not-allowed
                    "
                                >
                                    {loading ? 'Signing In...' : 'Sign In'}
                                </button>
                            </form>
                        ) : (
                            <form onSubmit={handleForgotSubmit} className="space-y-4">
                                <h3 className="text-xl font-bold text-white text-center mb-4">
                                    {forgotStep === 0 ? 'Reset Password' : forgotStep === 1 ? 'Verify OTP' : 'New Password'}
                                </h3>

                                {forgotStep === 0 && (
                                    <div>
                                        <label htmlFor="resetEmail" className="block text-sm font-medium text-gray-400 mb-2">
                                            Email Address
                                        </label>
                                        <input
                                            id="resetEmail"
                                            type="email"
                                            name="email"
                                            placeholder="john@example.com"
                                            value={resetData.email}
                                            onChange={handleResetChange}
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

                                {forgotStep === 1 && (
                                    <>
                                        <div>
                                            <label htmlFor="resetOtp" className="block text-sm font-medium text-gray-400 mb-2">
                                                Enter OTP
                                            </label>
                                            <input
                                                id="resetOtp"
                                                type="text"
                                                name="otp"
                                                placeholder="••••••"
                                                value={resetData.otp}
                                                onChange={handleResetChange}
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
                                                    onClick={handleSendResetOtp}
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

                                {forgotStep === 2 && (
                                    <>
                                        <div>
                                            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-400 mb-2">
                                                New Password
                                            </label>
                                            <input
                                                id="newPassword"
                                                type="password"
                                                name="newPassword"
                                                placeholder="••••••••"
                                                value={resetData.newPassword}
                                                onChange={handleResetChange}
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
                                        <div>
                                            <label htmlFor="confirmNewPassword" className="block text-sm font-medium text-gray-400 mb-2">
                                                Confirm New Password
                                            </label>
                                            <input
                                                id="confirmNewPassword"
                                                type="password"
                                                name="confirmNewPassword"
                                                placeholder="••••••••"
                                                value={resetData.confirmNewPassword}
                                                onChange={handleResetChange}
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
                                    </>
                                )}

                                {/* Error Message */}
                                {error.text && (
                                    <div className={`p-3 rounded-lg border text-sm ${error.type === 'success' ? 'bg-green-500/10 border-green-500/50 text-green-400' : 'bg-red-500/10 border-red-500/50 text-red-400'}`}>
                                        {error.text}
                                    </div>
                                )}

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={loading || resending}
                                    className="
                      w-full px-6 py-3 rounded-lg 
                      border-2 border-purple-600 
                      text-purple-600 bg-transparent 
                      hover:bg-purple-600 hover:text-white 
                      transition-all duration-300 
                      font-medium text-lg
                      hover:shadow-[0_0_15px_rgba(168,85,247,0.8)]
                      cursor-pointer
                      mt-2
                      disabled:opacity-50 disabled:cursor-not-allowed
                    "
                                >
                                    {resending ? 'Sending...' : loading
                                        ? (forgotStep === 0 ? 'Sending OTP...' : forgotStep === 1 ? 'Verifying...' : 'Resetting Password...')
                                        : (forgotStep === 0 ? 'Send Reset Link' : forgotStep === 1 ? 'Verify OTP' : 'Reset Password')}
                                </button>

                                <button
                                    type="button"
                                    onClick={() => {
                                        setMode('login');
                                        setError({ text: '', type: '' });
                                    }}
                                    className="w-full cursor-pointer text-center text-gray-400 hover:text-white mt-4 text-sm"
                                >
                                    Back to Login
                                </button>
                            </form>
                        )}

                        {/* Divider */}
                        <div className="flex items-center gap-3 my-5">
                            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                            <span className="text-xs text-gray-400 uppercase tracking-wider">Or</span>
                            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                        </div>

                        {/* Google Sign In */}
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

                        {/* Footer */}
                        <p className="text-center text-sm text-gray-400 mt-5">
                            Don't have an account?{' '}
                            <button
                                onClick={() => onSwitchToSignup && onSwitchToSignup()}
                                className="text-purple-600 hover:text-purple-500 font-medium transition-colors duration-300 cursor-pointer"
                            >
                                Sign up
                            </button>
                        </p>
                    </SpotlightCard>
                </div>
            </div>
        </div>
    );
};

export default LoginCard;
