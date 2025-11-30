import { useState, useEffect } from "react";
import { WifiOff, Wifi } from "lucide-react";

function NetworkStatus() {
  const [showOnline, setShowOnline] = useState(false);
  const [showOffline, setShowOffline] = useState(false);

  useEffect(() => {
    let offlineTimeout;
    let onlineTimeout;

    const handleOffline = () => {
      offlineTimeout = setTimeout(() => {
        setShowOffline(true);
        setShowOnline(false);
      }, 1000);
    };

    const handleOnline = () => {
      if (offlineTimeout) clearTimeout(offlineTimeout);
      
      setShowOffline(false);
      setShowOnline(true);
      onlineTimeout = setTimeout(() => setShowOnline(false), 3000);
    };

    window.addEventListener("offline", handleOffline);
    window.addEventListener("online", handleOnline);
    
    return () => {
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("online", handleOnline);
      if (offlineTimeout) clearTimeout(offlineTimeout);
      if (onlineTimeout) clearTimeout(onlineTimeout);
    };
  }, []);

  return (
    <>
      {showOffline && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-[slideUp_0.3s_ease-out]">
          <div className="bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 backdrop-blur-sm border border-red-400/20">
            <div className="bg-white/20 p-2 rounded-full animate-pulse">
              <WifiOff className="w-5 h-5" />
            </div>
            <div>
              <p className="font-semibold text-sm">No Internet Connection</p>
              <p className="text-xs text-red-100 mt-0.5">
                Please check your network settings
              </p>
            </div>
          </div>
        </div>
      )}

      {showOnline && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-[slideUp_0.3s_ease-out]">
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 backdrop-blur-sm border border-green-400/20">
            <div className="bg-white/20 p-2 rounded-full">
              <Wifi className="w-5 h-5" />
            </div>
            <div>
              <p className="font-semibold text-sm">Back Online</p>
              <p className="text-xs text-green-100 mt-0.5">
                Your connection has been restored
              </p>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translate(-50%, 20px);
          }
          to {
            opacity: 1;
            transform: translate(-50%, 0);
          }
        }
      `}</style>
    </>
  );
}

export default NetworkStatus;