'use client';

import Link from 'next/link';
import { ArrowLeft, ExternalLink } from 'lucide-react';

export default function CheckCompliancePage() {
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
        <div className="flex items-center gap-3 mb-3">
          <h1 className="text-3xl sm:text-4xl font-bold text-[#1A3C5E]">
            Check Compliance Status
          </h1>
          <span className="bg-[#00A651] text-white text-sm font-bold px-3 py-1 rounded-full">
            FREE
          </span>
        </div>
        <p className="text-gray-600 text-lg">
          Verify your vehicle's CARB compliance status quickly and easily - completely free!
        </p>
      </div>

      {/* Main Content */}
      <div className="space-y-6">
        {/* Official CARB Portal Link */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-[#1A3C5E] mb-4">
            Official CARB Compliance Check
          </h2>
          <p className="text-gray-600 mb-6">
            Check your vehicle's compliance status directly through the official
            California Air Resources Board (CARB) Clean Truck Check portal.
          </p>
          <a
            href="https://cleantruckcheck.arb.ca.gov/Fleet/Vehicle/VehicleComplianceStatusLookup"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-[#00A651] hover:bg-[#008f47] text-white font-semibold py-3 px-6 rounded-lg shadow-md transition-all duration-200 hover:shadow-lg"
          >
            <span>Check Vehicle Status</span>
            <ExternalLink className="h-5 w-5" />
          </a>
        </div>

        {/* View Profile Link */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-[#1A3C5E] mb-4">
            View Your Fleet Profile
          </h2>
          <p className="text-gray-600 mb-6">
            Access your complete fleet compliance profile and history.
          </p>
          <a
            href="https://cleantruckcheck.arb.ca.gov/OnlineForm/ViewProfileRequest/Create?viewProfileID=2083"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-[#1A3C5E] hover:bg-[#152e49] text-white font-semibold py-3 px-6 rounded-lg shadow-md transition-all duration-200 hover:shadow-lg"
          >
            <span>View My Profile</span>
            <ExternalLink className="h-5 w-5" />
          </a>
        </div>

        {/* VIN Lookup Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-[#1A3C5E] mb-4">
            Quick VIN Lookup
          </h2>
          <p className="text-gray-600 mb-4">
            Upload a photo of your VIN and we'll extract it automatically
          </p>
          <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <p className="text-gray-500 mb-2">Coming Soon</p>
            <p className="text-sm text-gray-400">
              VIN photo recognition feature in development
            </p>
          </div>
        </div>

        {/* Help Section */}
        <div className="bg-blue-50 border-l-4 border-[#00A651] p-6 rounded">
          <h3 className="font-bold text-[#1A3C5E] mb-2">
            Need Help?
          </h3>
          <p className="text-gray-700 mb-3">
            Our team is here to assist with compliance questions and testing needs.
          </p>
          <Link
            href="/contact"
            className="text-[#00A651] font-semibold hover:text-[#008f47] transition-colors"
          >
            Contact Us →
          </Link>
        </div>
      </div>
    </div>
  );
}
