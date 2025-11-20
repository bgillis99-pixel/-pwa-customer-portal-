'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { CheckCircle2, Users, MessageSquare, Phone, Share2, Settings } from 'lucide-react';

export default function Home() {
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    // Listen for the beforeinstallprompt event
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallPrompt(true);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      // Fallback: show share instructions
      if (navigator.share) {
        try {
          await navigator.share({
            title: 'NorCal CARB Mobile',
            text: 'CARB Compliance Made Simple',
            url: window.location.href,
          });
        } catch (err) {
          console.log('Share cancelled');
        }
      } else {
        alert('To add to home screen:\n\niOS: Tap Share button → Add to Home Screen\nAndroid: Tap menu → Add to Home Screen');
      }
      return;
    }

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setShowInstallPrompt(false);
    }
    setDeferredPrompt(null);
  };

  return (
    <div className="min-h-[calc(100vh-200px)] flex flex-col items-center justify-center px-4 py-12">
      {/* Hero Section */}
      <div className="text-center mb-12 max-w-2xl">
        <h1 className="text-4xl sm:text-5xl font-bold text-[#1A3C5E] mb-4">
          Compliance Made Simple
        </h1>
        <p className="text-gray-600 text-lg sm:text-xl">
          Your trusted partner for CARB compliance testing
        </p>
      </div>

      {/* Main Action Buttons - Uniform Design */}
      <div className="w-full max-w-md space-y-4 mb-8">
        <Link
          href="/check-compliance"
          className="block w-full bg-[#00A651] hover:bg-[#008f47] text-white font-semibold py-6 px-8 rounded-lg shadow-md transition-all duration-200 hover:shadow-lg hover:scale-[1.02] text-center text-lg"
        >
          <div className="flex items-center justify-center gap-3">
            <CheckCircle2 className="h-6 w-6" />
            <span>Check Compliance</span>
          </div>
        </Link>

        <Link
          href="/find-tester"
          className="block w-full bg-[#00A651] hover:bg-[#008f47] text-white font-semibold py-6 px-8 rounded-lg shadow-md transition-all duration-200 hover:shadow-lg hover:scale-[1.02] text-center text-lg"
        >
          <div className="flex items-center justify-center gap-3">
            <Users className="h-6 w-6" />
            <span>Find a Tester</span>
          </div>
        </Link>

        <Link
          href="/find-answer"
          className="block w-full bg-[#00A651] hover:bg-[#008f47] text-white font-semibold py-6 px-8 rounded-lg shadow-md transition-all duration-200 hover:shadow-lg hover:scale-[1.02] text-center text-lg"
        >
          <div className="flex items-center justify-center gap-3">
            <MessageSquare className="h-6 w-6" />
            <span>Find an Answer (AI)</span>
          </div>
        </Link>

        <Link
          href="/contact"
          className="block w-full bg-[#00A651] hover:bg-[#008f47] text-white font-semibold py-6 px-8 rounded-lg shadow-md transition-all duration-200 hover:shadow-lg hover:scale-[1.02] text-center text-lg"
        >
          <div className="flex items-center justify-center gap-3">
            <Phone className="h-6 w-6" />
            <span>Contact Us</span>
          </div>
        </Link>
      </div>

      {/* Share/Install Button - Prominent */}
      <button
        onClick={handleInstallClick}
        className="w-full max-w-md bg-[#1A3C5E] hover:bg-[#152e49] text-white font-semibold py-4 px-8 rounded-lg shadow-md transition-all duration-200 hover:shadow-lg mb-6 text-base"
      >
        <div className="flex items-center justify-center gap-3">
          <Share2 className="h-5 w-5" />
          <span>Add to Home Screen</span>
        </div>
      </button>

      {/* Admin Button - Small and Discreet */}
      <Link
        href="/admin"
        className="text-gray-400 hover:text-[#1A3C5E] text-sm flex items-center gap-2 transition-colors"
        title="Admin Access"
      >
        <Settings className="h-4 w-4" />
        <span>Admin</span>
      </Link>
    </div>
  );
}
