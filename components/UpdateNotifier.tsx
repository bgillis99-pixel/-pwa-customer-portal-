'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw, X } from 'lucide-react';
import { skipWaitingAndActivate } from '@/lib/pwa-utils';

export function UpdateNotifier() {
  const [showUpdate, setShowUpdate] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    // Listen for service worker update event
    const handleUpdate = () => {
      setShowUpdate(true);
    };

    window.addEventListener('sw-update-available', handleUpdate);

    return () => {
      window.removeEventListener('sw-update-available', handleUpdate);
    };
  }, []);

  const handleUpdate = async () => {
    setIsUpdating(true);
    try {
      await skipWaitingAndActivate();
      // Page will reload automatically
    } catch (error) {
      console.error('Error updating app:', error);
      setIsUpdating(false);
    }
  };

  const handleDismiss = () => {
    setShowUpdate(false);
  };

  if (!showUpdate) return null;

  return (
    <div className="fixed top-4 left-4 right-4 z-50 bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-2xl rounded-2xl p-4 animate-slide-down md:left-auto md:right-4 md:w-96">
      <button
        onClick={handleDismiss}
        className="absolute top-3 right-3 text-white/80 hover:text-white transition-colors"
        aria-label="Dismiss"
        disabled={isUpdating}
      >
        <X className="w-5 h-5" />
      </button>

      <div className="flex items-start gap-4 pr-6">
        <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
          <RefreshCw className={`w-6 h-6 text-white ${isUpdating ? 'animate-spin' : ''}`} />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-bold mb-1">
            Update Available
          </h3>
          <p className="text-sm text-white/90 mb-4">
            A new version of the app is ready. Update now to get the latest features.
          </p>
          <Button
            onClick={handleUpdate}
            disabled={isUpdating}
            className="w-full bg-white text-blue-600 hover:bg-gray-100 font-semibold shadow-lg"
          >
            {isUpdating ? 'Updating...' : 'Update Now'}
          </Button>
        </div>
      </div>
    </div>
  );
}
