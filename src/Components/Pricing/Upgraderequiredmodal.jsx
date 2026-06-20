import { X, ArrowRight } from "lucide-react";
import { useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import { usePlan } from "../../redux/apiCalls/Useplan";

export default function UpgradeRequiredModal({ isOpen, onClose, description }) {
  const modalRef = useRef(null);
  const { planKey, planLimit } = usePlan();

  useEffect(() => {
    if (!isOpen) return;
    const handler = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) onClose();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) return;
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div
      className="fixed inset-0 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.45)", zIndex: 99999 }}
    >
      <div
        ref={modalRef}
        className="relative w-full max-w-sm bg-white rounded-2xl shadow-2xl overflow-hidden"
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex flex-col items-center pt-10 pb-6 px-8">
          {/* Rocket illustration */}
          <div className="mb-5">
            <svg
              width="120"
              height="120"
              viewBox="0 0 120 120"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <text x="18" y="22" fontSize="10" fill="#a78bfa">+</text>
              <text x="88" y="18" fontSize="10" fill="#a78bfa">+</text>
              <text x="96" y="42" fontSize="8" fill="#c4b5fd">+</text>
              <text x="10" y="48" fontSize="8" fill="#c4b5fd">+</text>
              <rect x="30" y="88" width="60" height="6" rx="3" fill="none" stroke="#6d28d9" strokeWidth="1.5" />
              <rect x="38" y="94" width="10" height="14" rx="2" fill="none" stroke="#6d28d9" strokeWidth="1.5" />
              <rect x="72" y="94" width="10" height="14" rx="2" fill="none" stroke="#6d28d9" strokeWidth="1.5" />
              <line x1="30" y1="88" x2="28" y2="82" stroke="#6d28d9" strokeWidth="1.5" strokeLinecap="round" />
              <line x1="90" y1="88" x2="92" y2="82" stroke="#6d28d9" strokeWidth="1.5" strokeLinecap="round" />
              <rect x="49" y="42" width="22" height="36" rx="4" fill="none" stroke="#6d28d9" strokeWidth="1.5" />
              <path d="M49 46 Q60 22 71 46" fill="none" stroke="#6d28d9" strokeWidth="1.5" />
              <circle cx="60" cy="58" r="5" fill="none" stroke="#6d28d9" strokeWidth="1.5" />
              <path d="M49 70 L42 80 L49 78" fill="none" stroke="#6d28d9" strokeWidth="1.5" strokeLinejoin="round" />
              <path d="M71 70 L78 80 L71 78" fill="none" stroke="#6d28d9" strokeWidth="1.5" strokeLinejoin="round" />
              <path d="M54 78 Q57 90 60 84 Q63 90 66 78" fill="none" stroke="#6d28d9" strokeWidth="1.5" strokeLinejoin="round" />
              <circle cx="26" cy="70" r="2" fill="#ddd6fe" />
              <circle cx="94" cy="68" r="2" fill="#ddd6fe" />
              <circle cx="22" cy="30" r="1.5" fill="#ede9fe" />
              <circle cx="98" cy="55" r="1.5" fill="#ede9fe" />
            </svg>
          </div>

          <h2 className="text-xl font-bold text-gray-900 mb-2 text-center">
            Upgrade Required
          </h2>

          <p className="text-sm text-gray-500 text-center leading-relaxed mb-6">
            {description || "To access this feature, please purchase upgrade to one of our paid plans."}
            </p>

          <a
            href="/upgrade"
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-white font-semibold text-sm transition-all hover:opacity-90"
            style={{ background: "#5646A5" }}
          >
            Buy Add-Ons
            <ArrowRight className="w-4 h-4" />
          </a>

          <p className="text-xs text-gray-400 text-center mt-5 leading-relaxed">
            If you have any questions, send an email to{" "}
            <a href="mailto:support@appointroll.com" className="text-indigo-600 hover:underline">
              support@appointroll.com
            </a>{" "}
            and we'll be happy to help.
          </p>
        </div>
      </div>
    </div>,
 document.body  // ← الجوهر: بيعرض الـ modal برا الـ sidebar كلياً
  );
}