import { useState } from 'react';
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
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

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
                setError(data.message || 'Login failed. Please check your credentials.');
            }
        } catch (err) {
            console.error('Login error:', err);
            setError('Network error. Please try again later.');
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
                                    Sign in
                                </GradientText>
                            </h2>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-3">
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
                                    <a href="#" className="text-sm text-purple-600 hover:text-purple-500 transition-colors duration-300">
                                        Forgot password?
                                    </a>
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
