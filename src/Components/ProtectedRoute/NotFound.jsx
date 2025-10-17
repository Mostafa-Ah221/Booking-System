import { Link } from 'react-router-dom';
import { Calendar, Home, Search, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center px-4 py-8">
      <div className="max-w-2xl w-full text-center">
        {/* Animated Calendar Icon */}
        <div className="relative inline-block mb-8">
          <div className="absolute inset-0 bg-blue-400 blur-3xl opacity-30 animate-pulse"></div>
          <div className="relative bg-white rounded-3xl p-5 shadow-2xl">
            <Calendar className="w-24 h-24 text-blue-600 mx-auto animate-bounce" strokeWidth={1.5} />
          </div>
        </div>

        {/* 404 Text */}
        <h1 className="text-8xl md:text-9xl font-bold text-gray-900 mb-4">
          <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            404
          </span>
        </h1>

        {/* Main Message */}
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
          Oops! Page Not Found
        </h2>
        
        <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
          The appointment you're looking for seems to be unavailable. Let us help you find the right place!
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
          <Link 
            to="/" 
            className="group flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
          >
            <Home className="w-5 h-5" />
            Back to Home
            <ArrowLeft className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          
          <Link 
            to="/layoutDashboard" 
            className="group flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-800 px-8 py-4 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl border-2 border-gray-200 hover:border-blue-300"
          >
            <Calendar className="w-5 h-5 text-blue-600" />
            Dashboard
          </Link>
        </div>

      
       

        {/* Decorative Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-blue-200 rounded-full blur-2xl opacity-50 animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-purple-200 rounded-full blur-3xl opacity-50 animate-pulse" style={{animationDelay: '1s'}}></div>
      </div>
    </div>
  );
}