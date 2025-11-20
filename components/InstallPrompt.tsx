'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download, X } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstall, setShowInstall] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Check if already installed
    const isStandaloneMode = window.matchMedia('(display-mode: standalone)').matches;
    setIsStandalone(isStandaloneMode);

    // Detect iOS
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    setIsIOS(isIOSDevice);

    // Check if user previously dismissed
    const dismissed = localStorage.getItem('pwa-install-dismissed');
    if (dismissed) {
      const dismissedDate = new Date(dismissed);
      const daysSinceDismissed = (Date.now() - dismissedDate.getTime()) / (1000 * 60 * 60 * 24);
      if (daysSinceDismissed < 7) {
        // Don't show again for 7 days
        return;
      }
    }

    // Listen for the beforeinstallprompt event
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowInstall(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    // Show for iOS users (since they don't get beforeinstallprompt)
    if (isIOSDevice && !isStandaloneMode && !dismissed) {
      setTimeout(() => setShowInstall(true), 3000); // Show after 3 seconds
    }

    // Track installation
    window.addEventListener('appinstalled', () => {
      console.log('PWA installed successfully');
      setShowInstall(false);
      setDeferredPrompt(null);
      localStorage.removeItem('pwa-install-dismissed');
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    try {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;

      console.log(`Install prompt outcome: ${outcome}`);

      if (outcome === 'accepted') {
        console.log('User accepted the install prompt');
      } else {
        console.log('User dismissed the install prompt');
        localStorage.setItem('pwa-install-dismissed', new Date().toISOString());
      }

      setDeferredPrompt(null);
      setShowInstall(false);
    } catch (error) {
      console.error('Error during install:', error);
    }
  };

  const handleDismiss = () => {
    setShowInstall(false);
    localStorage.setItem('pwa-install-dismissed', new Date().toISOString());
  };

  // Don't show if already installed
  if (isStandalone) return null;
  if (!showInstall) return null;

  return (
    <>
      {/* iOS Instructions Modal */}
      {isIOS ? (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t-4 border-primary shadow-2xl rounded-t-2xl p-6 animate-slide-up">
          <button
            onClick={handleDismiss}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Dismiss"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-start gap-4">
            <div className="bg-primary/10 p-3 rounded-full">
              <Download className="w-6 h-6 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Install NorCal CARB Portal
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Add this app to your home screen for quick access and offline support.
              </p>

              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                    1
                  </div>
                  <p className="text-sm text-gray-700">
                    Tap the <span className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-semibold">Share</span> button at the bottom of your screen
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                    2
                  </div>
                  <p className="text-sm text-gray-700">
                    Scroll and tap <span className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-semibold">Add to Home Screen</span>
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                    3
                  </div>
                  <p className="text-sm text-gray-700">
                    Tap <span className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-semibold">Add</span> in the top right
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Android/Chrome/Edge Install Banner */
        <div className="fixed bottom-4 left-4 right-4 z-50 bg-gradient-to-r from-primary to-primary-dark text-white shadow-2xl rounded-2xl p-4 animate-slide-up md:left-auto md:right-4 md:w-96">
          <button
            onClick={handleDismiss}
            className="absolute top-3 right-3 text-white/80 hover:text-white transition-colors"
            aria-label="Dismiss"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-start gap-4 pr-6">
            <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
              <Download className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold mb-1">
                Install CARB Portal
              </h3>
              <p className="text-sm text-white/90 mb-4">
                Get quick access and work offline
              </p>
              <Button
                onClick={handleInstall}
                className="w-full bg-white text-primary hover:bg-gray-100 font-semibold shadow-lg"
              >
                Install Now
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
