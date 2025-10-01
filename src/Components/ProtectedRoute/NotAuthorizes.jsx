import { ShieldX, ArrowLeft, Home } from "lucide-react";

export default function NotAuthorized() {
  const handleGoBack = () => {
    window.history.back();
  };

  const handleGoHome = () => {
    // You can replace this with your actual home route navigation
    window.location.href = '/';
  };

  return (
    <div className=" bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="max-w-3xl w-full">
        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8 text-center">
          {/* Icon */}
          <div className="mx-auto w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-6">
            <ShieldX className="w-10 h-10 text-red-600" />
          </div>
          
          {/* Error Code */}
          <div className="text-6xl font-bold text-slate-300 mb-2">403</div>
          
          {/* Title */}
          <h1 className="text-2xl font-bold text-slate-900 mb-3">
            Access Denied
          </h1>
          
          {/* Description */}
          <p className="text-slate-600 mb-8 leading-relaxed">
            You don't have permission to access this resource. Please contact your administrator if you believe this is an error.
          </p>
          
          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={handleGoBack}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-medium py-3 px-6 rounded-xl transition-colors duration-200 flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Go Back
            </button>
            
            <button
              onClick={handleGoHome}
              className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium py-3 px-6 rounded-xl transition-colors duration-200 flex items-center justify-center gap-2"
            >
              <Home className="w-4 h-4" />
              Go Home
            </button>
          </div>
        </div>
        
        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-sm text-slate-500">
            Need help? Contact{' '}
            <a 
              href="mailto:support@example.com" 
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              support@example.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}