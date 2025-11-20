'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, MapPin, Mail, Phone } from 'lucide-react';
import PasswordProtection from '@/app/components/PasswordProtection';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default function FindTesterPage() {
  return (
    <PasswordProtection>
      <FindTesterContent />
    </PasswordProtection>
  );
}

// Region configuration with tester info
type Region = 'norcal' | 'valley' | 'socal' | 'other';

interface TesterInfo {
  name: string;
  phone: string;
  email: string;
  website?: string;
}

const TESTER_INFO: Record<Region, TesterInfo> = {
  norcal: {
    name: 'NorCal CARB Mobile',
    phone: '(916) 890-4427',
    email: 'support@norcalcarbmobile.com',
    website: 'https://norcalcarbmobile.com/services'
  },
  socal: {
    name: 'SoCal Mobile Tester',
    phone: '(XXX) XXX-XXXX', // TODO: Add SoCal phone number
    email: 'support@norcalcarbmobile.com',
  },
  valley: {
    name: 'Valley Mobile Testers',
    phone: '(XXX) XXX-XXXX', // TODO: Add Valley phone number
    email: 'support@norcalcarbmobile.com',
  },
  other: {
    name: 'Mobile Testing Services',
    phone: '(916) 890-4427',
    email: 'support@norcalcarbmobile.com',
  }
};

function FindTesterContent() {
  const [zipCode, setZipCode] = useState('');
  const [county, setCounty] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [detectedRegion, setDetectedRegion] = useState<Region>('other');
  const [isLoading, setIsLoading] = useState(false);

  const detectRegion = (zip: string): Region => {
    const zipPrefix = zip.substring(0, 2);

    // NorCal: 94xxx (Bay Area), 95xxx (Sacramento), 96xxx (Far North)
    if (['94', '95', '96'].includes(zipPrefix)) {
      return 'norcal';
    }

    // Valley: 93xxx (Central Valley - Fresno, Bakersfield)
    if (zipPrefix === '93') {
      return 'valley';
    }

    // SoCal: 90xxx, 91xxx, 92xxx (LA, Orange County, San Diego)
    if (['90', '91', '92'].includes(zipPrefix)) {
      return 'socal';
    }

    return 'other';
  };

  const handleSearch = async () => {
    if (!zipCode || zipCode.length !== 5) {
      alert('Please enter a valid 5-digit ZIP code');
      return;
    }

    setIsLoading(true);

    try {
      // Detect region
      const region = detectRegion(zipCode);
      setDetectedRegion(region);

      // Save lead to Firebase
      await addDoc(collection(db, 'leads'), {
        source: 'organic',
        metadata: {
          zipCode,
          county: county || null,
          region,
          searchType: 'find_tester'
        },
        status: 'new',
        createdAt: serverTimestamp(),
      });

      // Show results
      setShowResults(true);
    } catch (error) {
      console.error('Error saving lead:', error);
      // Still show results even if Firebase fails
      const region = detectRegion(zipCode);
      setDetectedRegion(region);
      setShowResults(true);
    } finally {
      setIsLoading(false);
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
            disabled={isLoading}
            className="w-full bg-[#00A651] hover:bg-[#008f47] text-white font-semibold py-4 px-6 rounded-lg shadow-md transition-all duration-200 hover:shadow-lg text-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="flex items-center justify-center gap-2">
              <MapPin className="h-5 w-5" />
              <span>{isLoading ? 'Searching...' : 'Find Tester'}</span>
            </div>
          </button>
        </div>
      </div>

      {/* Results */}
      {showResults && (
        <div className="bg-green-50 border-2 border-[#00A651] rounded-lg p-6">
          <h2 className="text-2xl font-bold text-[#1A3C5E] mb-4">
            {detectedRegion === 'other'
              ? 'We Can Help Connect You!'
              : 'Great News! We Service Your Area'}
          </h2>
          <p className="text-gray-700 mb-4">
            <span className="font-semibold text-[#1A3C5E]">
              {TESTER_INFO[detectedRegion].name}
            </span>
            {' '}provides certified testing services in your location.
          </p>

          {/* Region Badge */}
          <div className="mb-4">
            <span className="inline-block bg-[#00A651] text-white px-3 py-1 rounded-full text-sm font-semibold">
              {detectedRegion === 'norcal' && 'Northern California'}
              {detectedRegion === 'socal' && 'Southern California'}
              {detectedRegion === 'valley' && 'Central Valley'}
              {detectedRegion === 'other' && 'Service Available'}
            </span>
          </div>

          {/* Contact Information */}
          <div className="space-y-3 mb-6">
            <div className="flex items-center gap-3 text-gray-700">
              <Phone className="h-5 w-5 text-[#00A651]" />
              <a
                href={`tel:${TESTER_INFO[detectedRegion].phone.replace(/[^0-9]/g, '')}`}
                className="text-[#00A651] hover:text-[#008f47] font-semibold text-lg"
              >
                {TESTER_INFO[detectedRegion].phone}
              </a>
            </div>
            <div className="flex items-center gap-3 text-gray-700">
              <Mail className="h-5 w-5 text-[#00A651]" />
              <a
                href={`mailto:${TESTER_INFO[detectedRegion].email}`}
                className="text-[#00A651] hover:text-[#008f47] font-semibold"
              >
                {TESTER_INFO[detectedRegion].email}
              </a>
            </div>
          </div>

          {/* Service Link (only for NorCal with website) */}
          {TESTER_INFO[detectedRegion].website && (
            <a
              href={TESTER_INFO[detectedRegion].website}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-[#00A651] hover:bg-[#008f47] text-white font-semibold py-3 px-6 rounded-lg shadow-md transition-all duration-200 hover:shadow-lg"
            >
              View Our Services
            </a>
          )}

          {/* Lead Generation Message */}
          {detectedRegion === 'other' && (
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-gray-700">
                We're expanding our service areas! Your information has been recorded and we'll contact you soon about testing services in your area.
              </p>
            </div>
          )}
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

