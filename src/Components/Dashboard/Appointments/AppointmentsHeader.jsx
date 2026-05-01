import { Plus } from 'lucide-react';
import { BsFilterRight } from 'react-icons/bs';
import { FiLayout } from 'react-icons/fi';

const TABS = [
  { key: 'upcoming', label: 'upcoming' },
  { key: 'past',     label: 'past' },
];

const AppointmentsHeader = ({
  activeTab,
  onTabChange,
  hasActiveFilters,
  onOpenFilter,
  onClearFilters,
  onOpenColumnManager,
  onOpenAddAppointment,
  canAddAppointment,
}) => {
  return (
    <>
      {/* Top bar */}
      <div className="flex justify-between items-center mb-6">
        {canAddAppointment && (
          <button
            onClick={onOpenAddAppointment}
            className="text-sm px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            <Plus size={18} />
           New Appointment
          </button>
        )}
        <h1 className="font-semibold">Appointments</h1>
      </div>

      {/* Tabs + filter icons */}
      <div className="border-b border-gray-200 mb-6 flex justify-between items-center">
        <nav className="flex gap-6">
          {TABS.map(tab => (
            <button
              key={tab.key}
              className={`py-2 px-1 -mb-px transition-all text-[15px] ${
                activeTab === tab.key
                  ? 'border-b-2 border-blue-600 text-blue-600 font-medium'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => onTabChange(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {hasActiveFilters && (
            <button
              onClick={onClearFilters}
              className="px-3 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
            >
             Clear Filters
            </button>
          )}
          <FiLayout
            strokeWidth={1.5}
            className="p-[0.30rem] rounded-md h-7 w-7 hover:bg-slate-200 duration-300 cursor-pointer text-black border"
            onClick={onOpenColumnManager}
          />
          <button
            onClick={onOpenFilter}
            className={`w-9 h-9 flex justify-center items-center hover:border border-slate-400 duration-200 ${
              hasActiveFilters ? 'bg-blue-50 border-blue-300' : ''
            }`}
          >
            <BsFilterRight className="text-2xl" />
          </button>
        </div>
      </div>
    </>
  );
};

export default AppointmentsHeader;