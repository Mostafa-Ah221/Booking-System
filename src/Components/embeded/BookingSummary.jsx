import { Calendar, User } from 'lucide-react';

export default function BookingSummary() {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-xl font-semibold text-gray-900">Leetag</h1>
          <button className="px-4 py-2 border border-blue-600 text-blue-600 rounded hover:bg-blue-50">
            Book another appointment
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="bg-white rounded-lg shadow-sm">
          {/* Header with actions */}
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-xl font-medium text-gray-900">Your Booking Summary</h2>
            <div className="flex items-center space-x-4 text-sm">
              <button className="text-blue-600 hover:underline">Reschedule</button>
              <span className="text-gray-400">|</span>
              <button className="text-blue-600 hover:underline">Cancel</button>
              <button className="text-gray-400 hover:text-gray-600">🖨</button>
            </div>
          </div>

          {/* Info Banner */}
          <div className="px-6 py-3 bg-blue-50 border-l-4 border-blue-400">
            <div className="flex items-start">
              <div className="w-5 h-5 text-blue-400 mt-0.5">ℹ</div>
              <p className="ml-2 text-sm text-blue-700">Consider bookmarking this page for future reference.</p>
            </div>
          </div>

          {/* Status */}
          <div className="px-6 py-4">
            <div className="flex justify-end">
              <span className="text-sm">
                Status: <span className="text-blue-600 font-medium">Confirmed</span>
              </span>
            </div>
          </div>

          {/* Booking Details */}
          <div className="px-6 pb-6 space-y-6">
            {/* Booking ID */}
            <div className="flex items-start">
              <div className="w-8 text-gray-400 mt-1">#</div>
              <div className="flex-1">
                <div className="text-sm text-gray-600">Booking Id</div>
                <div className="font-medium">LE-00004</div>
              </div>
            </div>

            {/* Interview */}
            <div className="flex items-start">
              <div className="w-8 text-gray-400 mt-1">🔗</div>
              <div className="flex-1">
                <div className="text-sm text-gray-600">Interview</div>
                <div className="font-medium">demo</div>
                <div className="text-sm text-gray-500">2 hr 15 mins</div>
              </div>
            </div>

            {/* Recruiter */}
            <div className="flex items-start">
              <User className="w-5 h-5 text-gray-400 mt-1" />
              <div className="flex-1 ml-3">
                <div className="text-sm text-gray-600">Recruiter</div>
                <div className="font-medium">Mostafa Al shrife</div>
              </div>
            </div>

            {/* Date & Time */}
            <div className="flex items-start">
              <Calendar className="w-5 h-5 text-gray-400 mt-1" />
              <div className="flex-1 ml-3">
                <div className="text-sm text-gray-600">Date & Time</div>
                <div className="font-medium">08 Jul 2025</div>
                <div className="text-sm text-gray-500">02:50 pm</div>
                <div className="text-sm text-gray-500">Africa/Cairo GMT +03:00</div>
              </div>
            </div>

            {/* Contact Details */}
            <div className="flex items-start">
              <User className="w-5 h-5 text-gray-400 mt-1" />
              <div className="flex-1 ml-3">
                <div className="text-sm text-gray-600">Contact Details</div>
                <div className="font-medium">Mostafa Ahmed</div>
                <div className="text-sm text-blue-600">+201298888778</div>
                <div className="text-sm text-blue-600">mostafaddz@gmail.com</div>
              </div>
            </div>

            {/* Booked On */}
            <div className="flex items-start">
              <Calendar className="w-5 h-5 text-gray-400 mt-1" />
              <div className="flex-1 ml-3">
                <div className="text-sm text-gray-600">Booked On</div>
                <div className="font-medium">24 Jun 2025</div>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-200 mx-6"></div>

          {/* Action Buttons */}
          <div className="px-6 py-6 flex space-x-3">
            <button className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700">
              📅 Add to Calendar
            </button>
            <button className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700">
              📥 Download as ICS
            </button>
            <div className="flex-1"></div>
            <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded text-sm hover:bg-gray-50">
              Book another appointment
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-gray-500">
          Powered by Zoho Bookings
        </div>
      </div>
    </div>
  );
}