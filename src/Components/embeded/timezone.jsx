import { X } from 'lucide-react';
import TimezoneSelect, { allTimezones } from 'react-timezone-select';

const TimezoneModal = ({ show, onClose, selectedTimezone, onTimezoneSelect }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-800">Select Timezone</h2>
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 rounded transition-colors"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          {/* Timezone Select */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Choose your timezone
            </label>
            <TimezoneSelect
              value={selectedTimezone}
              onChange={(timezone) => {
                // ✅ المكتبة بترجع object: { value: 'Africa/Cairo', label: '...' }
                // نستخدم timezone.value عشان ناخد الـ timezone name بس
                onTimezoneSelect(timezone.value);
              }}
              timezones={allTimezones}
              className="react-timezone-select"
              classNamePrefix="select"
              styles={{
                control: (base) => ({
                  ...base,
                  border: '1px solid #d1d5db',
                  borderRadius: '0.5rem',
                  padding: '0.25rem',
                  boxShadow: 'none',
                  '&:hover': {
                    border: '1px solid #9ca3af',
                  },
                  '&:focus-within': {
                    border: '1px solid #3b82f6',
                    boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.1)',
                  },
                }),
                menu: (base) => ({
                  ...base,
                  borderRadius: '0.5rem',
                  marginTop: '0.5rem',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                  zIndex: 9999,
                }),
                menuList: (base) => ({
                  ...base,
                  borderRadius: '0.5rem',
                  padding: '0.5rem',
                  maxHeight: '300px',
                }),
                option: (base, state) => ({
                  ...base,
                  backgroundColor: state.isSelected 
                    ? '#3b82f6' 
                    : state.isFocused 
                    ? '#eff6ff' 
                    : 'white',
                  color: state.isSelected ? 'white' : '#374151',
                  cursor: 'pointer',
                  padding: '0.75rem',
                  borderRadius: '0.375rem',
                  margin: '0.125rem 0',
                  '&:hover': {
                    backgroundColor: state.isSelected ? '#3b82f6' : '#eff6ff',
                  },
                }),
                placeholder: (base) => ({
                  ...base,
                  color: '#9ca3af',
                }),
                singleValue: (base) => ({
                  ...base,
                  color: '#374151',
                }),
                input: (base) => ({
                  ...base,
                  color: '#374151',
                }),
              }}
              placeholder="Search for a timezone..."
            />
          </div>

          {/* Current Selection Info */}
          {selectedTimezone && (
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-xs text-blue-600 font-medium mb-1">Current Selection:</p>
              <p className="text-sm text-blue-900 font-mono">{selectedTimezone}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 mt-6">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              onClick={onClose}
              disabled={!selectedTimezone}
              className="flex-1 px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed font-medium"
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimezoneModal;