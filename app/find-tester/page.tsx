'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, MapPin, Mail } from 'lucide-react';

export default function FindTesterPage() {
  const [zipCode, setZipCode] = useState('');
  const [county, setCounty] = useState('');
  const [showResults, setShowResults] = useState(false);

  const handleSearch = () => {
    if (!zipCode) {
      alert('Please enter your ZIP code');
      return;
    }

    // Check if NorCal area (simplified check)
    const isNorCal = ['95', '94', '93', '96'].some(d => zipCode.startsWith(d));

    if (isNorCal) {
      setShowResults(true);
    } else {
      // Generate lead email for other areas
      const mailtoLink = `mailto:support@norcalcarbmobile.com?subject=Tester Lead - ${county || 'Unknown County'}&body=ZIP: ${zipCode}%0ACounty: ${county}%0A%0AI'm interested in mobile CARB testing.`;
      window.location.href = mailtoLink;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Back Button */}
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-[#1A3C5E] hover:text-[#00A651] mb-6 font-semibold transition-colors"
      >
        <ArrowLeft className="h-5 w-5" />
        <span>Back to Home</span>
      </Link>

      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-[#1A3C5E] mb-3">
          Find a Credentialed Tester
        </h1>
        <p className="text-gray-600 text-lg">
          Get connected with certified CARB testing services in your area
        </p>
      </div>

      {/* Search Form */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-2xl font-bold text-[#1A3C5E] mb-4">
          Enter Your Location
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              ZIP Code *
            </label>
            <input
              type="text"
              value={zipCode}
              onChange={(e) => setZipCode(e.target.value)}
              placeholder="Enter your ZIP code"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#00A651] focus:outline-none transition-colors text-lg"
              maxLength={5}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              County (Optional)
            </label>
            <input
              type="text"
              value={county}
              onChange={(e) => setCounty(e.target.value)}
              placeholder="e.g., Sacramento, Los Angeles"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#00A651] focus:outline-none transition-colors text-lg"
            />
          </div>

          <button
            onClick={handleSearch}
            className="w-full bg-[#00A651] hover:bg-[#008f47] text-white font-semibold py-4 px-6 rounded-lg shadow-md transition-all duration-200 hover:shadow-lg text-lg"
          >
            <div className="flex items-center justify-center gap-2">
              <MapPin className="h-5 w-5" />
              <span>Find Tester</span>
            </div>
          </button>
        </div>
      </div>

      {/* Results for NorCal */}
      {showResults && (
        <div className="bg-green-50 border-2 border-[#00A651] rounded-lg p-6">
          <h2 className="text-2xl font-bold text-[#1A3C5E] mb-4">
            Great News! We Service Your Area
          </h2>
          <p className="text-gray-700 mb-4">
            NorCal CARB Mobile provides certified testing services in your location.
          </p>
          <div className="space-y-3 mb-6">
            <div className="flex items-center gap-3 text-gray-700">
              <Mail className="h-5 w-5 text-[#00A651]" />
              <a
                href="mailto:support@norcalcarbmobile.com"
                className="text-[#00A651] hover:text-[#008f47] font-semibold"
              >
                support@norcalcarbmobile.com
              </a>
            </div>
            <div className="flex items-center gap-3 text-gray-700">
              <span className="text-xl">📞</span>
              <a
                href="tel:9168904427"
                className="text-[#00A651] hover:text-[#008f47] font-semibold"
              >
                (916) 890-4427
              </a>
            </div>
          </div>
          <a
            href="https://norcalcarbmobile.com/services"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-[#00A651] hover:bg-[#008f47] text-white font-semibold py-3 px-6 rounded-lg shadow-md transition-all duration-200 hover:shadow-lg"
          >
            View Our Services
          </a>
        </div>
      )}

      {/* Info Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mt-6">
        <h2 className="text-2xl font-bold text-[#1A3C5E] mb-4">
          Why Choose Credentialed Testing?
        </h2>
        <ul className="space-y-3 text-gray-700">
          <li className="flex items-start gap-3">
            <span className="text-[#00A651] font-bold text-xl">✓</span>
            <span>Certified by California Air Resources Board (CARB)</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-[#00A651] font-bold text-xl">✓</span>
            <span>Mobile testing - we come to your location</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-[#00A651] font-bold text-xl">✓</span>
            <span>Fast, accurate compliance reporting</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-[#00A651] font-bold text-xl">✓</span>
            <span>Expert guidance on CARB regulations</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
