import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'NorCal CARB Mobile - Customer Portal',
  description: 'Pocket CARB – Never Call the Hotline Again',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'CARB Mobile',
  },
  themeColor: '#00A651',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/png" sizes="192x192" href="/icon-192.png" />
        <link rel="icon" type="image/png" sizes="512x512" href="/icon-512.png" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </head>
      <body>{children}</body>
    </html>
  );
}
