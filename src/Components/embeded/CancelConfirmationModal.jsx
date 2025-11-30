import React, { useState } from 'react';
import { X, Trash2, Loader2 } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { getAppointmentByIdPublic, statusAppointment } from '../../redux/apiCalls/AppointmentCallApi';

// Cancel Confirmation Modal Component
const CancelConfirmationModal = ({ 
  isOpen, 
  onClose, 
  appointmentData,
  onCancelSuccess 
}) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();

  const handleCancel = async () => {
    if (!appointmentData?.id) {
      setError('Appointment ID not found');
      return;
    }

    setIsDeleting(true);
    setError(null);

    try {
      const cancelData = {
        status:"cancelled"
      };

      const result = await dispatch(statusAppointment(appointmentData.id, cancelData));
      

      if (result?.success) {
        await dispatch(getAppointmentByIdPublic(appointmentData?.id));
          setTimeout(() => {
        onCancelSuccess && onCancelSuccess();
        onClose();
      }, 300);
      } else {
        throw new Error(result?.message || 'Failed to cancel appointment');
      }

    } catch (error) {
      setError(error.message || 'Failed to cancel appointment. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        {/* Modal */}
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <Trash2 className="w-5 h-5 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Cancel Appointment</h3>
            </div>
            <button 
              onClick={onClose}
              className="p-1 hover:bg-gray-100 rounded-md transition-colors"
              disabled={isDeleting}
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            <p className="text-gray-600 mb-4">
              Sure you want to cancel appointment with <strong className='truncate block max-w-[150px]'>{appointmentData?.staff_name || appointmentData?.customer || 'this booking'}</strong>?
            </p>
            
            {appointmentData && (
              <div className="bg-gray-50 rounded-lg p-3 mb-4">
                <p className="text-sm text-gray-600">
                  <strong>Date:</strong> {appointmentData.date} | {appointmentData.time}
                </p>
                <p className="text-sm text-gray-600 truncate block max-w-[150px]">
                  <strong>Interview:</strong> {appointmentData.interview || appointmentData?.interview_name}
                </p>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex space-x-3 p-6 border-t bg-gray-50 rounded-b-lg">
            <button 
              onClick={onClose}
              className="flex-1 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              disabled={isDeleting}
            >
              Cancel
            </button>
            <button 
              onClick={handleCancel}
              disabled={isDeleting}
              className="flex-1 px-4 py-2 text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Canceling...
                </>
              ) : (
                'Cancel Appointment'
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default CancelConfirmationModal;