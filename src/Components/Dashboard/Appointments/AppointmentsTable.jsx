import { CalendarDays, Clock, ChevronDown } from 'lucide-react';
import { usePermission } from '../../hooks/usePermission';

const AppointmentsTable = ({
  appointments,
  columnOrder,
  pagination,
  currentPage,
  onPageChange,
  onRowClick,
  onReschedule,
  onCancel,
  loadingDetails,
  openDropdown,
  onToggleDropdown,
}) => {
  const canControlAppointment = usePermission('control appointment');
  const canEditAppointment    = usePermission('edit appointment');

  const { last_page: totalPages = 1, total = 0, from = 0, to = 0 } = pagination || {};

  // ── helpers ──────────────────────────────────────────────────
  const formatDate = (d) =>
    new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

  const formatTime = (t) => {
    if (!t || typeof t !== 'string') return 'N/A';
    const [h, m] = t.split(':').slice(0, 2).map(Number);
    if (isNaN(h) || isNaN(m)) return 'N/A';
    return `${h % 12 || 12}:${String(m).padStart(2,'0')} ${h >= 12 ? 'PM' : 'AM'}`;
  };

  const orderedColumns = (columnOrder || [])
    .filter(c => c?.selected)
    .map(c => c.name);

  if (appointments.length === 0) return null;

  // ── cell renderer ────────────────────────────────────────────
  const renderCell = (col, item, index) => {
    switch (col) {
      case 'Time':
        return (
          <div className="flex items-center gap-1 md:gap-2">
            <Clock size={14} className="text-gray-600 flex-shrink-0" />
            <span className="text-xs whitespace-nowrap">{formatTime(item.time)}</span>
          </div>
        );
      case 'Interview':
        return (
          <div className="flex items-center gap-1 md:gap-2 min-w-0">
            <span className="bg-purple-600 text-white px-1.5 py-0.5 rounded text-xs flex-shrink-0">
              {item.interview_name?.substring(0, 2).toUpperCase() ?? 'N/A'}
            </span>
            <span className="text-xs truncate max-w-[120px]" title={item.interview_name}>
              {item.interview_name ?? 'N/A'}
            </span>
          </div>
        );
      case 'Workspace':
        return (
          <div className="flex items-center gap-1 md:gap-2 min-w-0">
            <div className="w-7 h-7 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-xs text-blue-600">
                {item.work_space_name?.substring(0, 1).toUpperCase() ?? 'N/A'}
              </span>
            </div>
            <span className="text-xs truncate max-w-[120px]" title={item.work_space_name}>
              {item.work_space_name ?? 'N/A'}
            </span>
          </div>
        );
      case 'Client':
        return (
          <div className="flex items-center gap-1 md:gap-2 min-w-0">
            <div className="w-7 h-7 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-xs text-gray-600 font-medium">
                {item.name?.substring(0, 1).toUpperCase() ?? 'N/A'}
              </span>
            </div>
            <span className="font-medium text-xs truncate max-w-[120px]" title={item.name}>
              {item.name ?? 'N/A'}
            </span>
          </div>
        );
      case 'Phone':
        return <span className="text-gray-600 text-xs truncate max-w-[120px]">{item.phone ?? 'N/A'}</span>;
      case 'Status': {
        const map = {
          upcoming:    'bg-green-100 text-green-800',
          past:        'bg-gray-200 text-gray-800',
          rescheduled: 'bg-yellow-100 text-yellow-800',
          cancel:      'bg-red-100 text-red-800',
        };
        const labels = { upcoming: 'Scheduled', past: 'Completed', rescheduled: 'Rescheduled', cancel: 'Cancelled' };
        return (
          <span className={`w-fit px-2 py-0.5 rounded-full text-xs font-medium whitespace-nowrap ${map[item.status] ?? 'bg-blue-100 text-blue-800'}`}>
            {labels[item.status] ?? item.status ?? 'N/A'}
          </span>
        );
      }
      case 'Approval':
        return (
          <span className={`w-fit px-2 py-0.5 rounded-full text-xs font-medium whitespace-nowrap ${
            !item.approve_interview_status ? 'bg-gray-100 text-gray-500'
            : item.approve_status === '1'  ? 'bg-green-100 text-green-800'
            : 'bg-yellow-100 text-yellow-800'
          }`}>
            {!item.approve_interview_status ? 'N/A' : item.approve_status === '1' ? 'Approved' : 'Pending'}
          </span>
        );
      case 'Action':
        return (
          <div className="relative dropdown-container" onClick={e => e.stopPropagation()}>
            <button
              className="border border-gray-300 px-2 py-1 rounded flex items-center gap-1 text-sm hover:bg-gray-50"
              onClick={e => { e.stopPropagation(); onToggleDropdown(item.id); }}
            >
              <span className="text-xs">Review</span>
              <ChevronDown size={12} className={`transition-transform duration-200 ${openDropdown === item.id ? 'rotate-180' : ''}`} />
            </button>
            {openDropdown === item.id && (
              <div className={`absolute right-0 mt-1 w-40 bg-white border border-gray-200 rounded-md shadow-lg z-20 ${
                index === appointments.length - 1 ? 'bottom-full mb-1' : 'top-full'
              }`}>
                <div className="py-1">
                  {canControlAppointment && (
                    <button
                      className="w-full text-right px-4 py-2 text-sm text-blue-600 hover:bg-gray-50 flex items-center justify-end gap-2"
                      onClick={e => { e.stopPropagation(); onReschedule(item); }}
                    >
                      <span className="text-xs">Reschedule</span>
                      <div className="w-2 h-2 bg-blue-600 rounded-full" />
                    </button>
                  )}
                  {canEditAppointment && (
                    <button
                      className="w-full text-right px-4 py-2 text-sm text-red-600 hover:bg-gray-50 flex items-center justify-end gap-2"
                      onClick={e => { e.stopPropagation(); onCancel(item); }}
                    >
                      <span className="text-xs">Cancel</span>
                      <div className="w-2 h-2 bg-red-600 rounded-full" />
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        );
      case 'Created at':
        return <span className="text-gray-600 text-xs truncate max-w-[120px]">{item.created_at ?? 'N/A'}</span>;
      case 'Time Zone':
        return <span className="text-gray-600 text-xs truncate max-w-[120px]">{item.time_zone ?? 'N/A'}</span>;
      case 'Email':
        return <span className="text-gray-600 text-xs truncate max-w-[120px]">{item.email ?? 'N/A'}</span>;
      default:
        return null;
    }
  };

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: `repeat(${orderedColumns.length}, minmax(120px, 1fr))`,
    alignItems: 'center',
  };

  // ── pagination ───────────────────────────────────────────────
  const renderPagination = () => {
    if (totalPages <= 1) return null;
    const maxShow = 5;
    let start = Math.max(1, currentPage - Math.floor(maxShow / 2));
    let end   = Math.min(totalPages, start + maxShow - 1);
    if (end - start + 1 < maxShow) start = Math.max(1, end - maxShow + 1);
    const pages = Array.from({ length: end - start + 1 }, (_, i) => start + i);

    const btn = (label, page, disabled) => (
      <button
        key={label}
        onClick={() => !disabled && onPageChange(page)}
        disabled={disabled}
        className={`px-3 py-1 text-sm rounded-md ${
          disabled ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
          : page === currentPage ? 'bg-blue-600 text-white'
          : 'bg-white text-gray-600 hover:bg-gray-100'
        }`}
      >
        {label}
      </button>
    );

    return (
      <div className="flex justify-between items-center mt-4">
        <span className="text-sm text-gray-600">
          Showing {from} to {to} of {total} appointments
        </span>
        <div className="flex items-center gap-2">
          {btn('Previous', currentPage - 1, currentPage === 1)}
          {start > 1 && <>{btn(1, 1, false)}{start > 2 && <span className="px-2 text-gray-500">...</span>}</>}
          {pages.map(p => btn(p, p, false))}
          {end < totalPages && <>{end < totalPages - 1 && <span className="px-2 text-gray-500">...</span>}{btn(totalPages, totalPages, false)}</>}
          {btn('Next', currentPage + 1, currentPage === totalPages)}
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="w-full border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <div style={{ minWidth: orderedColumns.length > 7 ? `${orderedColumns.length * 150}px` : '100%' }}>
            {/* Header row */}
            <div className="text-xs font-medium bg-gray-50 border-b px-3 md:px-6 py-3 md:py-4 gap-2 md:gap-4" style={gridStyle}>
              {orderedColumns.map(col => (
                <div key={col} className="text-gray-600 capitalize whitespace-nowrap">{col}</div>
              ))}
            </div>
            {/* Data rows */}
            {appointments.map((item, index) => (
              <div key={item.id} className="border-b last:border-b-0">
                <div className="bg-gray-50 px-3 md:px-6 py-2 md:py-3 border-b sticky top-0 z-10">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CalendarDays size={14} className="text-gray-600" />
                      <span className="text-xs font-medium">{formatDate(item.date)}</span>
                    </div>
                    <span className="text-xs text-gray-500">{from + index} appointment</span>
                  </div>
                </div>
                <div
                  className={`items-center px-3 md:px-6 py-3 md:py-4 text-sm hover:bg-gray-50 cursor-pointer transition-colors gap-2 md:gap-4 ${loadingDetails ? 'opacity-50 pointer-events-none' : ''}`}
                  style={gridStyle}
                  onClick={() => onRowClick(item)}
                >
                  {orderedColumns.map(col => (
                    <div key={col}>{renderCell(col, item, index)}</div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {renderPagination()}
    </>
  );
};

export default AppointmentsTable;