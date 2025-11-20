'use client';

import { useState } from 'react';
import { Camera, CheckCircle2 } from 'lucide-react';

export default function VinDieselPage() {
  const [complianceChecked, setComplianceChecked] = useState(false);
  const [vinInput, setVinInput] = useState('');
  const [entityInput, setEntityInput] = useState('');
  const [trucrsInput, setTrucrsInput] = useState('');

  const handleComplianceCheck = () => {
    setComplianceChecked(true);
  };

  const handlePhotoScan = () => {
    // TODO: Implement photo scanning functionality
    alert('Photo scan feature coming soon!');
  };

  const handleSubmit = () => {
    if (!vinInput || !entityInput || !trucrsInput) {
      alert('Please fill in all fields');
      return;
    }
    // TODO: Implement submission to CARB API
    window.open(
      `https://cleantruckcheck.arb.ca.gov/Fleet/Vehicle/VehicleComplianceStatusLookup?vin=${vinInput}`,
      '_blank'
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Sidebar Menu */}
      <div className="fixed left-0 top-0 h-full w-48 bg-white shadow-lg p-6 hidden md:block">
        <button
          onClick={() => window.history.back()}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <span className="text-xl">←</span>
          <span className="text-sm">Check Compliance</span>
        </button>
        <nav className="space-y-4 text-sm">
          <a href="/vin-diesel" className="block text-red-500 font-semibold">
            VIN DIESEL
          </a>
          <a href="#find-tester" className="block text-red-500 hover:text-red-700">
            Find a Tester
          </a>
          <a href="/faq" className="block text-red-500 hover:text-red-700">
            FAQ/Guidelines
          </a>
          <a href="#contact" className="block text-red-500 hover:text-red-700">
            Contact Us
          </a>
        </nav>
      </div>

      {/* Main Content */}
      <div className="md:ml-48 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">VIN DIESEL</h1>
            <p className="text-lg text-gray-600">
              Pocket CARB – Never Call the Hotline Again
            </p>
          </div>

          {/* Main Card */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border-4 border-green-500">
            {!complianceChecked ? (
              /* Initial State: Show only CHECK COMPLIANCE button */
              <div className="text-center space-y-6">
                <p className="text-gray-700 text-lg mb-8">
                  Click below to start your compliance check
                </p>
                <button
                  onClick={handleComplianceCheck}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-6 px-8 rounded-xl text-xl transition-all transform hover:scale-105 shadow-lg flex items-center justify-center gap-3"
                >
                  <CheckCircle2 className="w-8 h-8" />
                  CHECK COMPLIANCE
                </button>
              </div>
            ) : (
              /* After Clicking: Show VIN input and Photo Scan */
              <div className="space-y-6">
                {/* VIN • Entity • TRUCRS Input */}
                <div className="space-y-4">
                  <label className="block text-sm font-medium text-gray-700">
                    VIN • Entity • TRUCRS
                  </label>
                  <div className="flex flex-col gap-3">
                    <input
                      type="text"
                      placeholder="VIN (17 characters)"
                      value={vinInput}
                      onChange={(e) => setVinInput(e.target.value.toUpperCase())}
                      maxLength={17}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none text-lg"
                    />
                    <input
                      type="text"
                      placeholder="Entity"
                      value={entityInput}
                      onChange={(e) => setEntityInput(e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none text-lg"
                    />
                    <input
                      type="text"
                      placeholder="TRUCRS Number"
                      value={trucrsInput}
                      onChange={(e) => setTrucrsInput(e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none text-lg"
                    />
                  </div>
                </div>

                {/* Photo Scan Button */}
                <button
                  onClick={handlePhotoScan}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-xl text-lg transition-all transform hover:scale-105 shadow-lg flex items-center justify-center gap-3"
                >
                  <Camera className="w-6 h-6" />
                  📸 Photo Scan
                </button>

                {/* Submit/Check Button */}
                <button
                  onClick={handleSubmit}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-6 rounded-xl text-lg transition-all transform hover:scale-105 shadow-lg flex items-center justify-center gap-3"
                >
                  <CheckCircle2 className="w-6 h-6" />
                  VERIFY COMPLIANCE
                </button>

                {/* Back Button */}
                <button
                  onClick={() => setComplianceChecked(false)}
                  className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-3 px-6 rounded-xl text-base transition-all"
                >
                  ← Start Over
                </button>
              </div>
            )}

            {/* Footer Info */}
            <div className="mt-8 pt-6 border-t-2 border-gray-200 text-center space-y-2">
              <p className="text-sm text-gray-600">
                Free for NorCal • Waived if you test with us
              </p>
              <a
                href="tel:844-685-8922"
                className="inline-block text-green-600 font-bold text-lg hover:text-green-700"
              >
                CALL 844-685-8922
              </a>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden mt-6 text-center">
            <button
              onClick={() => window.history.back()}
              className="text-gray-600 hover:text-gray-900"
            >
              ← Back to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
