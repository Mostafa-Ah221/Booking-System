import React, { useState, useEffect } from 'react';
import { Shield, ArrowRight, RefreshCw, CheckCircle, AlertCircle } from 'lucide-react';
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import toast from 'react-hot-toast';

export default function VerifyForm() {
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [countdown, setCountdown] = useState(0);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectPath = searchParams.get("redirect") || "/";
  const appointmentId = searchParams.get("app_id") || localStorage.getItem("app_id");

  // countdown timer
  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);


  useEffect(() => {
  if (!appointmentId) return;
  
  const lastSent = Cookies.get(`last_code_sent_${appointmentId}`);
  
  if (!lastSent) {
  
    handleGetCode(); 
  } else {
    
    const expiryTime = parseInt(lastSent, 10) + 60 * 1000;
    const timeLeft = Math.floor((expiryTime - Date.now()) / 1000);
    
    if (timeLeft > 0) {
      setCountdown(timeLeft);
    } else {
      handleGetCode(); 
    }
  }
}, [appointmentId]);
const handlePaste = (e) => {
  e.preventDefault();
  const pasteData = e.clipboardData.getData("text").trim();

  if (/^\d+$/.test(pasteData)) {
    const digits = pasteData.split("").slice(0, 6);
    const newCode = [...code];

    digits.forEach((digit, index) => {
      if (index < newCode.length) {
        newCode[index] = digit;
      }
    });

    setCode(newCode);

    const lastIndex = Math.min(digits.length, code.length) - 1;
    const lastInput = document.getElementById(`code-input-${lastIndex}`);
    if (lastInput) lastInput.focus();
  }
};
console.log(appointmentId);


  const handleChange = (index, value) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newCode = [...code];
      newCode[index] = value;
      setCode(newCode);

      if (value && index < 5) {
        const nextInput = document.getElementById(`code-input-${index + 1}`);
        if (nextInput) nextInput.focus();
      }
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      const prevInput = document.getElementById(`code-input-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await axios.post(
        `https://backend-booking.appointroll.com/api/appointments/verify-code/${appointmentId}`,
        { code: code.join("") }
      );

      if (response.data.message === 422) {
        throw new Error(response.data.message );
      }

      if (response.data.message === 200) {
        Cookies.set(`verified_${appointmentId}`, "true", { expires: 1 }); 
        setIsSuccess(true);

        setTimeout(() => {
          navigate(`/manage?app_id=${appointmentId}`);
        }, 1000);
      }
    } catch (err) {
      setError(err.response.data.errors.code[0]);
    } finally {
      setLoading(false);
    }
  };

const handleGetCode = async () => {
  setResendLoading(true);
  setMessage("");
  setCode(["", "", "", "", "", ""]);

  try {
    const response = await axios.get(
      `https://backend-booking.appointroll.com/api/appointments/verify/${appointmentId}`
    );


    if (response.data.status) {
      // console.log("Setting cookie for:", appointmentId);
      setMessage(response.data.message);
      toast.success(response.data.message);
      setCountdown(60);
      Cookies.set(`last_code_sent_${appointmentId}`, Date.now().toString(), { expires: 1/288 });
      
   
      
    }
  } catch (error) {
    // console.log("API error:", error);
    setMessage("Failed to resend cod. Please try again.");
  } finally {
    setResendLoading(false);
  }
};
  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center border border-gray-100">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Verification Successful!</h2>
            <p className="text-gray-600 mb-6">You will be redirected shortly...</p>
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Verify Your Account</h1>
          <p className="text-gray-600 leading-relaxed">
            Enter the 6-digit verification code sent to your phone or email (SMS / WhatsApp / Email)
          </p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 text-center">
                Verification Code
              </label>
              <div className="flex justify-center space-x-2">
                {code.map((digit, index) => (
                  <input
                    key={index}
                    id={`code-input-${index}`}
                    type="text"
                    inputMode="numeric"
                    value={digit}
                    onPaste={handlePaste}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className="w-12 h-12 text-center text-xl font-bold border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 outline-none"
                    maxLength={1}
                  />
                ))}
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="flex items-center space-x-2 p-3 rounded-lg bg-red-50 text-red-700 border border-red-200">
                <AlertCircle className="w-5 h-5" />
                <span className="text-sm font-medium">{error}</span>
              </div>
            )}

            <button
              onClick={handleVerify}
              disabled={loading || code.some((digit) => !digit)}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Verifying...</span>
                </>
              ) : (
                <>
                  <span>Verify Code</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </div>

          {/* Resend */}
          <div className="mt-8 pt-6 border-t border-gray-100">
            <div className="text-center">
              <p className="text-gray-600 text-sm mb-3">Didn't receive the code?</p>

              {countdown > 0 ? (
                <p className="text-gray-500 text-sm">Resend code in {countdown} seconds</p>
              ) : (
                <button
                  onClick={handleGetCode}
                  disabled={resendLoading}
                  className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors disabled:opacity-50"
                >
                  {resendLoading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <RefreshCw className="w-4 h-4" />
                      <span>Resend Code</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
