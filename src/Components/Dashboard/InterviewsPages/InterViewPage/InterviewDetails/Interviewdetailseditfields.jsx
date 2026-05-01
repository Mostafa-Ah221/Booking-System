import { ChevronDown } from 'lucide-react';
import Select from "react-select";

const InterviewDetailsEditFields = ({
  formData,
  errors,
  loading,
  isResourceType,
  isCollectiveType,
  currencyOptions,
  handleInputChange,
  handleSelectChange,
  handleExtraModeChange,
  handelUpdateInterview,
  onCancel,
}) => {
  return (
    <div className="space-y-6">
      <div className="border-l-2 border-purple-600 pl-4">
        <h3 className="text-sm font-medium text-gray-900">INTERVIEW DETAILS</h3>
      </div>

      {/* Interview Name */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Interview Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          className={`w-full outline-none p-2.5 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${errors.name ? 'border-red-500' : ''}`}
        />
        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
      </div>

      {/* Duration & Rest */}
      <div className="flex gap-4">
        <div className="space-y-2 flex-1">
          <label className="block text-sm font-medium text-gray-700">
            Duration (Minutes) <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            name="duration_cycle"
            value={formData.duration_cycle}
            onChange={handleInputChange}
            placeholder="Enter duration"
            min="0"
            onKeyDown={(e) => {
              if (e.key === '-' || e.key === 'e' || e.key === 'E') e.preventDefault();
            }}
            className={`w-full outline-none border rounded-lg p-2.5 focus:ring-2 focus:ring-purple-500 focus:border-transparent ${errors.duration_cycle ? 'border-red-500' : ''}`}
          />
          {errors.duration_cycle && <p className="text-red-500 text-sm mt-1">{errors.duration_cycle}</p>}
        </div>
        <div className="space-y-2 flex-1">
          <label className="block text-sm font-medium text-gray-700">Rest Cycle (Minutes)</label>
          <input
            type="text"
            name="rest_cycle"
            value={formData.rest_cycle}
            onChange={handleInputChange}
            min="0"
            className="no-spinner w-full outline-none p-2.5 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Status & Require End Time */}
      <div className="flex gap-4">
        <div className="space-y-2 flex-1">
          <label className="block text-sm font-medium text-gray-700">Status</label>
          <div className="relative w-full">
            <select
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              className="w-full outline-none p-2.5 border rounded-lg appearance-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="free">Free</option>
              <option value="paid">Paid</option>
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
          </div>
        </div>
        <div className="space-y-2 flex-1">
          {isResourceType && (
            <>
              <label className="block text-sm font-medium text-gray-700">Require End Time</label>
              <div className="relative w-full">
                <select
                  name="require_end_time"
                  value={formData.require_end_time}
                  onChange={(e) => handleSelectChange('require_end_time', e.target.value)}
                  className="w-full outline-none p-2.5 border rounded-lg appearance-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="1">Yes</option>
                  <option value="0">No</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>
            </>
          )}
        </div>
      </div>

      {/* Payment Fields */}
      {formData.status === 'paid' && (
        <>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Price <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-4">
              <div className="relative flex-1">
                <Select
                  className="rounded-lg"
                  options={currencyOptions}
                  isSearchable
                  value={currencyOptions.find(opt => opt.value === formData.currency) || null}
                  onChange={(selected) =>
                    handleInputChange({ target: { name: 'currency', value: selected?.value || '' } })
                  }
                  placeholder="Select Currency"
                  classNamePrefix="react-select"
                  styles={{
                    control: (provided, state) => ({
                      ...provided,
                      width: '100%',
                      borderRadius: '0.5rem',
                      border: state.isFocused ? '0px solid #9333ea' : '1px solid #d1d5db',
                      padding: '2px 8px',
                      boxShadow: state.isFocused ? '0 0 0 2px rgba(147, 51, 234, 0.5)' : 'none',
                      backgroundColor: 'white',
                      minHeight: '40px',
                    }),
                    valueContainer: (p) => ({ ...p, padding: 0 }),
                    input: (p) => ({ ...p, margin: 0, padding: 0 }),
                    singleValue: (p) => ({ ...p, color: '#111827' }),
                    placeholder: (p) => ({ ...p, color: '#9ca3af' }),
                    dropdownIndicator: (p) => ({ ...p, color: '#6b7280', '&:hover': { color: '#9333ea' } }),
                    option: (p, state) => ({
                      ...p,
                      backgroundColor: state.isSelected ? '#9333ea' : state.isFocused ? '#f3e8ff' : 'white',
                      color: state.isSelected ? 'white' : '#111827',
                      padding: '8px 12px',
                      cursor: 'pointer',
                    }),
                    menu: (p) => ({ ...p, borderRadius: '0.5rem', marginTop: '4px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }),
                  }}
                />
                {errors.currency && <p className="text-red-500 text-sm mt-1">{errors.currency}</p>}
              </div>
              <div className="flex-1">
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  placeholder="Enter Price"
                  min="0"
                  step="0.01"
                  onKeyDown={(e) => {
                    if (e.key === '-' || e.key === 'e' || e.key === 'E') e.preventDefault();
                  }}
                  className={`w-full outline-none p-2.5 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${errors.price ? 'border-red-500' : ''}`}
                />
                {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Payment Details <span className="text-red-500">*</span>
            </label>
            <textarea
              name="payment_details"
              value={formData.payment_details}
              onChange={handleInputChange}
              placeholder="Enter payment instructions"
              rows="3"
              className={`w-full outline-none p-2.5 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${errors.payment_details ? 'border-red-500' : ''}`}
            />
            {errors.payment_details && <p className="text-red-500 text-sm mt-1">{errors.payment_details}</p>}
          </div>
        </>
      )}

      {/* Mode Section */}
      <div className="flex gap-4 items-start flex-wrap">
        {/* Mode Select */}
        <div className="space-y-2 flex-1 min-w-[160px]">
          <label className="block text-sm font-medium text-gray-700">
            Mode <span className="text-red-500">*</span>
          </label>
          <div className="relative w-full">
            <select
              name="mode"
              value={formData.mode}
              onChange={handleInputChange}
              className={`w-full outline-none p-2.5 border rounded-lg appearance-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${errors.mode ? 'border-red-500' : ''} ${!formData.mode ? 'text-gray-400' : 'text-black'}`}
            >
              <option value="" disabled>Select Mode</option>
              <option value="online">Online</option>
              <option value="inperson">In Person</option>
              <option value="phone">Phone</option>
              <option value="online/inperson">Online/Inperson</option>
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
          </div>
          {errors.mode && <p className="text-red-500 text-sm mt-1">{errors.mode}</p>}
        </div>

        {/* Inperson Mode */}
        {formData.mode === 'inperson' && (
          <div className="space-y-2 flex-1 min-w-[160px]">
            <label className="block text-sm font-medium text-gray-700">
              In-Person Mode <span className="text-red-500">*</span>
            </label>
            <div className="relative w-full">
              <select
                name="inperson_mode"
                value={formData.inperson_mode}
                onChange={handleInputChange}
                className={`w-full outline-none p-2.5 border rounded-lg appearance-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${errors.inperson_mode ? 'border-red-500' : ''} ${!formData.inperson_mode ? 'text-gray-800' : 'text-black'}`}
              >
                <option value="" disabled>Select In-Person Mode</option>
                <option value="inhouse">In House</option>
                <option value="athome">At Home</option>
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            </div>
            {errors.inperson_mode && <p className="text-red-500 text-sm mt-1">{errors.inperson_mode}</p>}
          </div>
        )}

        {/* Meeting Link — online only */}
        {formData.mode === 'online' && (
          <div className="space-y-2 flex-1 min-w-[160px]">
            <label className="block text-sm font-medium text-gray-700">Meeting Link</label>
            <input
              type="text"
              name="meeting_link"
              value={formData.meeting_link}
              onChange={handleInputChange}
              placeholder="Enter meeting link"
              className="w-full outline-none p-2.5 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
        )}
      </div>

      {/* ── online/inperson → extra_modes checkboxes ── */}
      {formData.mode === 'online/inperson' && (
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Available Sub-modes <span className="text-red-500">*</span>
          </label>
          <div className="flex gap-6 flex-wrap p-3 border rounded-lg">
            {[
              { value: 'online',  label: 'Online'   },
              { value: 'inhouse', label: 'In House'  },
              { value: 'athome',  label: 'At Home'   },
            ].map(({ value, label }) => (
              <label key={value} className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={formData.extra_modes?.includes(value) || false}
                  onChange={() => handleExtraModeChange(value)}
                  className="w-4 h-4 accent-purple-600 cursor-pointer"
                />
                <span className="text-sm text-gray-700">{label}</span>
              </label>
            ))}
          </div>
          {errors.extra_modes && <p className="text-red-500 text-sm mt-1">{errors.extra_modes}</p>}
        </div>
      )}

      {/* Meeting Link — يظهر لما يختار Online من checkboxes */}
      {formData.mode === 'online/inperson' && formData.extra_modes?.includes('online') && (
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Meeting Link</label>
          <input
            type="text"
            name="meeting_link"
            value={formData.meeting_link}
            onChange={handleInputChange}
            placeholder="Enter meeting link"
            className="w-full outline-none p-2.5 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>
      )}

     {/* Location */}
   {(
  (formData.mode === 'inperson' && formData.inperson_mode === 'inhouse') || 
  (formData.mode === 'online/inperson' && formData.extra_modes?.includes('inhouse'))
) && (
  <div className="space-y-2">
    <label className="block text-sm font-medium text-gray-700">
      Location
     {(
  (formData.mode === 'inperson' && formData.inperson_mode === 'inhouse') ||
  (formData.mode === 'online/inperson' && formData.extra_modes?.includes('inhouse'))
) && (
  <span className="text-red-500"> *</span>
)}
    </label>
    <textarea
      name="location"
      value={formData.location}
      onChange={handleInputChange}
      placeholder="Enter full address"
      rows="2"
      className={`w-full outline-none p-2.5 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${errors.location ? 'border-red-500' : ''}`}
    />
    {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location}</p>}
  </div>
)}

    

      {/* Reminder Note */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Reminder Note</label>
        <textarea
          name="reminder_note"
          value={formData.reminder_note}
          onChange={handleInputChange}
          placeholder="Enter reminder note for clients"
          rows="3"
          className="w-full outline-none p-2.5 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        />
      </div>

      {/* Booking Settings */}
      <div className="border-l-2 border-purple-600 pl-4 mt-8">
        <h3 className="text-sm font-medium text-gray-900">BOOKING SETTINGS</h3>
      </div>

      <div className="flex gap-4 items-center flex-wrap">
        <div className="space-y-2 flex-1 min-w-[140px]">
          <label className="block text-sm font-medium text-gray-700">Allow Double Booking</label>
          <div className="relative w-full">
            <select
              name="double_book"
              value={formData.double_book}
              onChange={(e) => handleSelectChange('double_book', e.target.value)}
              className="w-full outline-none p-2.5 border rounded-lg appearance-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="1">Yes</option>
              <option value="0">No</option>
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
          </div>
        </div>

        <div className="space-y-2 flex-1 min-w-[140px]">
          <label className="block text-sm font-medium text-gray-700">Require Appointment Approval</label>
          <div className="relative w-full">
            <select
              name="approve_appointment"
              value={formData.approve_appointment}
              onChange={(e) => handleSelectChange('approve_appointment', e.target.value)}
              className="w-full outline-none p-2.5 border rounded-lg appearance-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="1">Yes</option>
              <option value="0">No</option>
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {!isResourceType && !isCollectiveType && (
          <div className="space-y-2 flex-1 min-w-[140px]">
            <label className="block text-sm font-medium text-gray-700">Require Staff Selection</label>
            <div className="relative w-full">
              <select
                name="require_staff_select"
                value={formData.require_staff_select}
                onChange={(e) => handleSelectChange('require_staff_select', e.target.value)}
                className="w-full outline-none p-2.5 border rounded-lg appearance-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="1">Yes</option>
                <option value="0">No</option>
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            </div>
          </div>
        )}
      </div>

      {/* Max Clients */}
      {formData.type === 'group-booking' && (
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Maximum Clients</label>
          <input
            type="number"
            name="max_clients"
            value={formData.max_clients || ''}
            onChange={handleInputChange}
            placeholder="Maximum Clients per Time Slot (optional)"
            min="1"
            onKeyDown={(e) => {
              if (e.key === '-' || e.key === 'e' || e.key === 'E') e.preventDefault();
            }}
            className="w-full outline-none p-2.5 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-4 pt-6">
        <button
          onClick={onCancel}
          className="flex-1 px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          onClick={handelUpdateInterview}
          disabled={loading}
          className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
        >
          {loading ? 'Updating...' : 'Save'}
        </button>
      </div>
    </div>
  );
};

export default InterviewDetailsEditFields;