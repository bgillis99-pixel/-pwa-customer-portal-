import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'NorCal CARB Mobile - Customer Portal',
  description: 'Clean Truck Check Credentialed Tester - Compliance Made Simple',
  manifest: '/manifest.json',
  themeColor: '#00A651',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'CARB Portal',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/icons/favicon.ico" />
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
      </head>
      <body>
        {/* Professional Header with Branding */}
        <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              {/* Primary Logo */}
              <div className="flex items-center space-x-4">
                <img
                  src="/images/logos/norcalcarb-logo.png"
                  alt="NorCal CARB Mobile"
                  className="h-12 sm:h-16 w-auto object-contain"
                  onError={(e) => {
                    // Fallback if image not found
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const fallback = document.createElement('div');
                    fallback.className = 'text-xl font-bold text-primary';
                    fallback.innerHTML = 'NorCal<span class="text-[#00A651]">CARB</span>';
                    target.parentElement?.appendChild(fallback);
                  }}
                />
              </div>

              {/* Credentialed Tester Badge */}
              <div className="hidden sm:block">
                <img
                  src="/images/logos/clean-truck-check-logo.png"
                  alt="Clean Truck Check Credentialed Tester"
                  className="h-10 sm:h-12 w-auto object-contain"
                  onError={(e) => {
                    // Fallback if image not found
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                  }}
                />
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main>{children}</main>

        {/* Footer */}
        <footer className="bg-[#1A3C5E] text-white mt-auto py-6">
          <div className="container mx-auto px-4 text-center">
            <p className="text-sm mb-2">
              Clean Truck Check Credentialed Tester
            </p>
            <p className="text-xs opacity-80">
              © {new Date().getFullYear()} NorCal CARB Mobile. All rights reserved.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
