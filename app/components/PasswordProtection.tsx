'use client';

import { useState, useEffect } from 'react';
import { Lock } from 'lucide-react';

interface PasswordProtectionProps {
  children: React.ReactNode;
}

export default function PasswordProtection({ children }: PasswordProtectionProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Simple password - change this to whatever you want
  const DEMO_PASSWORD = 'demo2024';

  useEffect(() => {
    // Check if user is already authenticated in this session
    const auth = sessionStorage.getItem('pwa_authenticated');
    if (auth === 'true') {
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (password === DEMO_PASSWORD) {
      sessionStorage.setItem('pwa_authenticated', 'true');
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Incorrect password');
      setPassword('');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-[#1A3C5E]">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-b from-gray-50 to-gray-100">
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-8 border-t-4 border-[#00A651]">
          {/* Lock Icon */}
          <div className="flex justify-center mb-6">
            <div className="bg-[#00A651] rounded-full p-4">
              <Lock className="h-8 w-8 text-white" />
            </div>
          </div>

          {/* Header */}
          <h2 className="text-2xl font-bold text-[#1A3C5E] text-center mb-2">
            Demo Access
          </h2>
          <p className="text-gray-600 text-center mb-6">
            This feature is in development. Enter the demo password to preview.
          </p>

          {/* Password Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter demo password"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#00A651] focus:outline-none transition-colors"
                autoFocus
              />
              {error && (
                <p className="text-red-500 text-sm mt-2">{error}</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-[#00A651] hover:bg-[#008f47] text-white font-semibold py-3 px-6 rounded-lg shadow-md transition-all duration-200 hover:shadow-lg"
            >
              Access Demo
            </button>
          </form>

          {/* Info Note */}
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-gray-700 text-center">
              <strong>Note:</strong> Full features coming soon! This preview shows our planned functionality.
            </p>
          </div>

          {/* Back to Home */}
          <a
            href="/"
            className="block text-center text-[#1A3C5E] hover:text-[#00A651] font-semibold mt-4 transition-colors"
          >
            ← Back to Home
          </a>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
