'use client';
import { useState } from 'react';

const SignUpCard = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      
      {/* Glass Card */}
      <div
        className="
          w-[350px] p-8 rounded-2xl
          bg-white/10 backdrop-blur-xl
          border border-white/20
          shadow-lg
        "
      >
        <h2 className="text-2xl font-semibold text-white text-center mb-6">
          Create Account
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">

          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            className="
              w-full px-4 py-2 rounded-lg
              bg-white/10 border border-white/20
              text-white placeholder-gray-300
              focus:outline-none focus:ring-2 focus:ring-purple-500
            "
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="
              w-full px-4 py-2 rounded-lg
              bg-white/10 border border-white/20
              text-white placeholder-gray-300
              focus:outline-none focus:ring-2 focus:ring-purple-500
            "
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="
              w-full px-4 py-2 rounded-lg
              bg-white/10 border border-white/20
              text-white placeholder-gray-300
              focus:outline-none focus:ring-2 focus:ring-purple-500
            "
          />

          <button
            type="submit"
            className="
              w-full py-2 rounded-lg
              bg-purple-600 hover:bg-purple-700
              text-white font-medium
              transition-all duration-300
              hover:shadow-[0_0_15px_rgba(168,85,247,0.8)]
            "
          >
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignUpCard;
