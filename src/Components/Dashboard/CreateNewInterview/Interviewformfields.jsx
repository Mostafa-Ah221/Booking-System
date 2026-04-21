import { ChevronDown } from 'lucide-react';
import Select from "react-select";

const InterviewFormFields = ({
  formData,
  errors,
  interviewType,
  isCollective,
  isResource,
  allWorkspaces,
  resources,
  currencyOptions,
  handleInputChange,
  handleSelectChange,
  handleExtraModeChange,
  navigate,
  isLoading,
  handleSubmit,
}) => {
  return (
    <div className="space-y-6">
      <div className="border-l-2 border-purple-600 pl-4">
        <h3 className="text-sm font-medium text-gray-900">INTERVIEW DETAILS</h3>
      </div>

      {/* Interview Name & Work Space & Resource */}
      <div className="flex gap-4 items-start flex-wrap">
        {/* Interview Name */}
        <div className="space-y-2 flex-1 min-w-[160px]">
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

        {/* Work Space */}
        <div className="space-y-2 flex-1 min-w-[160px]">
          <label className="block text-sm font-medium text-gray-700">
            Work Space <span className="text-red-500">*</span>
          </label>
          <div className="relative w-full">
            <select
              name="work_space_id"
              value={formData.work_space_id}
              onChange={handleInputChange}
              className={`w-full outline-none p-2.5 border rounded-lg appearance-none pr-10 focus:ring-2 focus:ring-purple-500 focus:border-transparent ${errors.work_space_id ? 'border-red-500' : ''} ${!formData.work_space_id ? 'text-gray-800' : 'text-black'}`}
            >
              <option value="" disabled>Select Work Space</option>
              {allWorkspaces?.map((workspace) => (
                <option key={workspace.id} value={workspace.id}>
                  {workspace.name.length > 40 ? workspace.name.slice(0, 40) + '…' : workspace.name}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
          </div>
          {errors.work_space_id && <p className="text-red-500 text-sm mt-1">{errors.work_space_id}</p>}
        </div>

        {/* Resource */}
        {interviewType === 'resource' && (
          <div className="space-y-2 flex-1 min-w-[160px]">
            <label className="block text-sm font-medium text-gray-700">
              Resource <span className="text-red-500">*</span>
            </label>
            <div className="relative w-full">
              <select
                name="resource_id"
                value={formData.resource_id}
                onChange={handleInputChange}
                className={`w-full outline-none p-2.5 border rounded-lg appearance-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${errors.resource_id ? 'border-red-500' : ''} ${!formData.resource_id ? 'text-gray-800' : 'text-black'}`}
              >
                <option value="" disabled>Select Resource</option>
                {resources?.map((resource) => (
                  <option key={resource.id} value={resource.id}>{resource.name}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            </div>
            {errors.resource_id && <p className="text-red-500 text-sm mt-1">{errors.resource_id}</p>}
          </div>
        )}
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
            placeholder="Enter rest time"
            min="0"
            className="w-full outline-none p-2.5 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Status */}
      <div className="space-y-2">
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
                  onChange={(selected) => handleInputChange({ target: { name: 'currency', value: selected.value } })}
                  placeholder="Select Currency"
                  classNamePrefix="react-select"
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
              className={`w-full outline-none p-2.5 border rounded-lg appearance-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${errors.mode ? 'border-red-500' : ''} ${!formData.mode ? 'text-gray-800' : 'text-black'}`}
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

        {/* Inperson Mode (only when mode === 'inperson') */}
        {formData.mode === 'inperson' && (
          <div className="space-y-2 flex-1 min-w-[160px]">
            <label className="block text-sm font-medium text-gray-700">
              In-person Mode <span className="text-red-500">*</span>
            </label>
            <div className="relative w-full">
              <select
                name="inperson_mode"
                value={formData.inperson_mode}
                onChange={handleInputChange}
                className={`w-full outline-none p-2.5 border text-black rounded-lg appearance-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${errors.inperson_mode ? 'border-red-500' : ''}`}
              >
                <option value="" disabled>Select in-person Mode</option>
                <option value="inhouse">In House</option>
                <option value="athome">At Home</option>
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            </div>
            {errors.inperson_mode && <p className="text-red-500 text-sm mt-1">{errors.inperson_mode}</p>}
          </div>
        )}

        {/* Meeting Link (only when mode === 'online') */}
        {formData.mode === 'online' && (
          <div className="space-y-2 flex-1 min-w-[160px]">
            <label className="block text-sm font-medium text-gray-700">Meeting Link</label>
            <input
              type="text"
              name="meeting_link"
              value={formData.meeting_link}
              onChange={handleInputChange}
              placeholder="Enter meeting link"
              className={`w-full outline-none p-2.5 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${errors.meeting_link ? 'border-red-500' : ''}`}
            />
            {errors.meeting_link && <p className="text-red-500 text-sm mt-1">{errors.meeting_link}</p>}
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
              { value: 'online',   label: 'Online'   },
              { value: 'inhouse',  label: 'In House'  },
              { value: 'athome',   label: 'At Home'   },
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

      {/* Meeting Link — يظهر لما يختار Online من الـ checkboxes */}
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

      {/* Location field */}
{(formData.inperson_mode === 'inhouse' || 
  (formData.mode === 'online/inperson' && formData.extra_modes?.includes('inhouse'))) && (
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Location{
              (formData.inperson_mode === 'inhouse' ||
                (formData.mode === 'online/inperson' && formData.extra_modes?.includes('inhouse')))
              && <span className="text-red-500"> *</span>
            }
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

      {/* Booking Settings */}
      <div className="border-l-2 border-purple-600 pl-4 mt-8">
        <h3 className="text-sm font-medium text-gray-900">BOOKING SETTINGS</h3>
      </div>

      <div className="flex gap-4 items-center">
        <div className="space-y-2 flex-1">
          <label className="block text-sm font-medium text-gray-700">Allow Double Booking</label>
          <div className="relative w-full">
            <select
              name="double_book"
              value={formData.double_book}
              onChange={(e) => handleSelectChange('double_book', e.target.value === 'true')}
              className="w-full outline-none p-2.5 border rounded-lg appearance-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value={true}>Yes</option>
              <option value={false}>No</option>
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {!isCollective && (
          <div className="space-y-2 flex-1">
            <label className="block text-sm font-medium text-gray-700">Require Appointment Approval</label>
            <div className="relative w-full">
              <select
                name="approve_appointment"
                value={formData.approve_appointment}
                onChange={(e) => handleSelectChange('approve_appointment', e.target.value === 'true')}
                className="w-full outline-none p-2.5 border rounded-lg appearance-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value={true}>Yes</option>
                <option value={false}>No</option>
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            </div>
          </div>
        )}
      </div>

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

      {!isCollective && !isResource && (
        <div className="flex gap-4 items-center">
          <div className="space-y-2 flex-1">
            <label className="block text-sm font-medium text-gray-700">Require Staff Selection</label>
            <div className="relative w-full">
              <select
                name="require_staff_select"
                value={formData.require_staff_select}
                onChange={(e) => handleSelectChange('require_staff_select', e.target.value === 'true')}
                className="w-full outline-none p-2.5 border rounded-lg appearance-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value={true}>Yes</option>
                <option value={false}>No</option>
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>
      )}

      {interviewType === 'group-booking' && (
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Maximum Clients</label>
          <input
            type="number"
            name="max_clients"
            value={formData.max_clients}
            onChange={handleInputChange}
            placeholder="Maximum Clients per Time Slot"
            min="1"
            className="w-full outline-none p-2.5 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-4 pt-6">
        <button
          onClick={() => navigate(-1)}
          className="flex-1 px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-50"
        >
          Back
        </button>
        <button
          onClick={handleSubmit}
          disabled={isLoading}
          className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
        >
          {isLoading ? 'Creating...' : isCollective ? 'Next' : 'Create'}
        </button>
      </div>
    </div>
  );
};

export default InterviewFormFields;