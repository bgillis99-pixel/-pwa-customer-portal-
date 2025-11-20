'use client';

import Link from 'next/link';
import { ArrowLeft, Mail, Phone, MapPin, Clock } from 'lucide-react';

export default function ContactPage() {
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
          Contact Us
        </h1>
        <p className="text-gray-600 text-lg">
          Get in touch with our CARB compliance experts
        </p>
      </div>

      {/* Contact Cards */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {/* Email Card */}
        <a
          href="mailto:support@norcalcarbmobile.com"
          className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow border-2 border-transparent hover:border-[#00A651]"
        >
          <div className="flex items-start gap-4">
            <div className="bg-[#00A651] rounded-lg p-3">
              <Mail className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-[#1A3C5E] mb-2">Email Us</h3>
              <p className="text-gray-600 mb-2">
                Send us a message and we'll respond within 24 hours
              </p>
              <p className="text-[#00A651] font-semibold">
                support@norcalcarbmobile.com
              </p>
            </div>
          </div>
        </a>

        {/* Phone Card */}
        <a
          href="tel:9168904427"
          className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow border-2 border-transparent hover:border-[#00A651]"
        >
          <div className="flex items-start gap-4">
            <div className="bg-[#00A651] rounded-lg p-3">
              <Phone className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-[#1A3C5E] mb-2">Call Us</h3>
              <p className="text-gray-600 mb-2">
                Speak with a compliance specialist
              </p>
              <p className="text-[#00A651] font-semibold text-xl">
                (916) 890-4427
              </p>
            </div>
          </div>
        </a>
      </div>

      {/* Service Area */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-start gap-4 mb-4">
          <div className="bg-[#1A3C5E] rounded-lg p-3">
            <MapPin className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-[#1A3C5E] mb-2 text-xl">Service Area</h3>
            <p className="text-gray-600 mb-3">
              Northern California - We bring CARB testing to your location
            </p>
            <p className="text-gray-700">
              Serving Sacramento, Bay Area, and surrounding counties
            </p>
          </div>
        </div>
      </div>

      {/* Business Hours */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-start gap-4">
          <div className="bg-[#1A3C5E] rounded-lg p-3">
            <Clock className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-[#1A3C5E] mb-3 text-xl">Business Hours</h3>
            <div className="space-y-2 text-gray-700">
              <div className="flex justify-between">
                <span className="font-semibold">Monday - Friday:</span>
                <span>8:00 AM - 6:00 PM</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Saturday:</span>
                <span>9:00 AM - 3:00 PM</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Sunday:</span>
                <span>Closed</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Contact Form */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="font-bold text-[#1A3C5E] mb-4 text-xl">
          Quick Contact Form
        </h3>
        <p className="text-gray-600 mb-4">
          Send us a message and we'll get back to you promptly
        </p>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Name
            </label>
            <input
              type="text"
              placeholder="Your name"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#00A651] focus:outline-none transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              placeholder="your@email.com"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#00A651] focus:outline-none transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Message
            </label>
            <textarea
              rows={4}
              placeholder="How can we help you?"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#00A651] focus:outline-none transition-colors"
            ></textarea>
          </div>
          <button
            onClick={() => alert('Form submission coming soon! Please use email or phone for now.')}
            className="w-full bg-[#00A651] hover:bg-[#008f47] text-white font-semibold py-4 px-6 rounded-lg shadow-md transition-all duration-200 hover:shadow-lg"
          >
            Send Message
          </button>
        </div>
      </div>

      {/* Certification Badge */}
      <div className="bg-green-50 border-2 border-[#00A651] rounded-lg p-6 mt-6 text-center">
        <h3 className="font-bold text-[#1A3C5E] mb-2 text-xl">
          Clean Truck Check Credentialed Tester
        </h3>
        <p className="text-gray-700">
          Certified by the California Air Resources Board (CARB)
        </p>
      </div>
    </div>
  );
}
