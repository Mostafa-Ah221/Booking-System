// الـ state والـ logic بس، بدون أي JSX للجدول أو الهيدر
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useSearchParams } from 'react-router-dom';
import { CalendarDays, Plus } from 'lucide-react';
import toast from 'react-hot-toast';

import {
  fetchAppointments, getAppointmentById,
  deleteAppointment, statusAppointment, rescheduleAppointment,
} from '../../../redux/apiCalls/AppointmentCallApi';
import { fetchInterviews } from '../../../redux/apiCalls/interviewCallApi';
import { getCustomers } from '../../../redux/apiCalls/CustomerCallApi';
import { usePermission } from '../../hooks/usePermission';
import { useConfirmationToast } from './useConfirmationToast';

import AppointmentsHeader   from './AppointmentsHeader';
import AppointmentsTable    from './AppointmentsTable';
import FilterSidebar        from './FilterSidebar';
import AddAppointment       from './AddAppointment';
import AppointmentDetailsSidebar from './AppointmentDetailsSidebar';
import RescheduleSidebar    from './RescheduleSidebar';
import ColumnManagerSidebar from './ColumnManagerSidebar';

const getTabDateRange = (tab) => {
  const today = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  const fmt = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  const todayStr = fmt(today);

  if (tab === 'upcoming') {
    const future = new Date(today);
    future.setMonth(future.getMonth() + 12);
    return { start_date: todayStr, end_date: fmt(future) };
  }
  if (tab === 'past') {
    const past = new Date(today);
    past.setMonth(past.getMonth() - 12);
    return { start_date: fmt(past), end_date: todayStr };
  }
  return {};
};

const DEFAULT_COLUMNS = [
  { name: 'Time',       selected: true,  id: 'time'      },
  { name: 'Interview',  selected: true,  id: 'interview' },
  { name: 'Workspace',  selected: true,  id: 'workspace' },
  { name: 'Client',     selected: true,  id: 'client'    },
  { name: 'Phone',      selected: true,  id: 'phone'     },
  { name: 'Status',     selected: true,  id: 'status'    },
  { name: 'Approval',   selected: true,  id: 'approval'  },
  { name: 'Action',     selected: true,  id: 'action'    },
  { name: 'Created at', selected: false, id: 'created'   },
  { name: 'Time Zone',  selected: false, id: 'timezone'  },
  { name: 'Email',      selected: false, id: 'email'     },
];

const loadColumns = () => {
  try {
    const saved = JSON.parse(localStorage.getItem('appointmentColumns') || '{}');
    return saved.columnOrder || DEFAULT_COLUMNS;
  } catch { return DEFAULT_COLUMNS; }
};

const UserDashboard = () => {
  const [activeTab, setActiveTab] = useState('upcoming');

  const [isFilterOpen,        setIsFilterOpen]        = useState(false);
  const [isAddOpen,           setIsAddOpen]           = useState(false);
  const [isColumnManagerOpen, setIsColumnManagerOpen] = useState(false);
  const [isDetailsOpen,       setIsDetailsOpen]       = useState(false);
  const [isRescheduleOpen,    setIsRescheduleOpen]    = useState(false);

  const [selectedAppointment,    setSelectedAppointment]    = useState(null);
  const [appointmentToReschedule,setAppointmentToReschedule]= useState(null);
  const [loadingDetails,         setLoadingDetails]         = useState(false);
  const [detailsError,           setDetailsError]           = useState(null);
  const [cancelingAppointment,   setCancelingAppointment]   = useState(false);

  const [openDropdown, setOpenDropdown] = useState(null);

  const [currentFilters, setCurrentFilters] = useState({});
  const [currentPage,    setCurrentPage]    = useState(1);

  const [columnOrder, setColumnOrder] = useState(loadColumns);

  const dispatch = useDispatch();
  const { showConfirmationToast } = useConfirmationToast();
  const location     = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  const { interviews = [] }  = useSelector(s => s.interview);
  const { appointments = [], loading = false, pagination } =
    useSelector(s => s.appointments || {});
  const { workspace, workspaces } = useSelector(s => s.workspace);
  const { customers = [] }   = useSelector(s => s.customers || {});
  const workspaceId = workspace?.id ?? 0;

  const canAddAppointment = usePermission('add appointment');

  const buildQueryParams = (filters = {}, tab = activeTab, page = currentPage) => {
    const p = { page };
    if (workspaceId) p.work_space_id = workspaceId;

    const tabRange = getTabDateRange(tab);
    if (tabRange.start_date) p.start_date = tabRange.start_date;
    if (tabRange.end_date)   p.end_date   = tabRange.end_date;

    if (filters.appointmentStatus) p.status = filters.appointmentStatus;
    if (filters.interviews?.[0])   p.interview_id = filters.interviews[0];
    if (filters.workspaces?.[0])   p.work_space_id = filters.workspaces[0];
    if (filters.clients?.[0])      p.client_id = filters.clients[0];
    if (filters.dateFilterType === 'single' && filters.selectedDate) {
      p.start_date = p.end_date = filters.selectedDate;
    }
    if (filters.dateFilterType === 'range') {
      if (filters.dateFrom) p.start_date = filters.dateFrom;
      if (filters.dateTo)   p.end_date   = filters.dateTo;
    }
    return p;
  };

  const hasActiveFilters = (f) => f && (
    f.appointmentStatus ||
    f.interviews?.length ||
    f.workspaces?.length ||
    f.clients?.length ||
    (f.dateFilterType === 'single' && f.selectedDate) ||
    (f.dateFilterType === 'range'  && (f.dateFrom || f.dateTo))
  );

  useEffect(() => {
    dispatch(fetchAppointments(buildQueryParams(currentFilters, activeTab, currentPage)));
  }, [workspaceId, activeTab, currentFilters, currentPage]);

  useEffect(() => { dispatch(fetchInterviews(workspaceId)); }, [workspaceId]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  useEffect(() => {
    const handler = (e) => {
      if (!e.target.closest('.dropdown-container') && openDropdown !== null)
        setOpenDropdown(null);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [openDropdown]);

  useEffect(() => {
const id = location.state?.appointmentId || searchParams.get('appointmentId') || searchParams.get('appointment_id');
    if (!id) return;
    const found = appointments.find(a => a.id === parseInt(id));
    if (found) {
      handleRowClick(found);
    } else {
      fetchAndOpenAppointment(parseInt(id));
    }
    if (location.state?.appointmentId) window.history.replaceState({}, document.title);
    if (searchParams.get('appointmentId')) {
      searchParams.delete('appointmentId');
      setSearchParams(searchParams, { replace: true });
    }
  }, [location.state, searchParams, appointments]);

  const fetchAndOpenAppointment = async (id) => {
    try {
      setLoadingDetails(true);
      setDetailsError(null);
      const res = await dispatch(getAppointmentById(id));
      const data = res?.data?.data?.appointment || res?.data?.appointment || res?.appointment;
      if (data) { setSelectedAppointment({ ...data, detailsLoaded: true }); setIsDetailsOpen(true); }
      else setDetailsError('Failed to load appointment');
    } catch (e) { setDetailsError(e.message); }
    finally { setLoadingDetails(false); }
  };

  const handleRowClick = async (item) => {
    try {
      setLoadingDetails(true);
      const res = await dispatch(getAppointmentById(item.id));
      console.log('full response:', res); 
      const data = res?.success ? res.data.data.appointment : item;
      setSelectedAppointment({ ...data, detailsLoaded: true });
      setIsDetailsOpen(true);
    } catch (e) {
      setDetailsError(e.message);
      setSelectedAppointment(item);
      setIsDetailsOpen(true);
    } finally {
      setLoadingDetails(false);
    }
  };

  const refreshAppointments = () =>
    dispatch(fetchAppointments(buildQueryParams(currentFilters, activeTab, currentPage)));

  const handleCancelAppointment = (appt) => {
    showConfirmationToast(
      `Are you sure you want to cancel the appointment for ${appt.name}`,
      async () => {
        try {
          setCancelingAppointment(true);
          const r = await dispatch(statusAppointment(appt.id, { status: 'cancelled' }));
          if (!r?.success) throw new Error(r?.message || 'Failed');
          await refreshAppointments();
          if (selectedAppointment?.id === appt.id) { setIsDetailsOpen(false); setSelectedAppointment(null); }
          setOpenDropdown(null);
        } catch (e) { toast.error(e.message); }
        finally { setCancelingAppointment(false); }
      }
    );
  };

  const handleDeleteAppointment = (appt) => {
    showConfirmationToast(
      `Are you sure you want to delete the appointment for ${appt.name}`,
      async () => {
        try {
          setCancelingAppointment(true);
          const r = await dispatch(deleteAppointment(appt.id));
          if (!r?.success) throw new Error(r?.message || 'Failed');
          await refreshAppointments();
          if (selectedAppointment?.id === appt.id) { setIsDetailsOpen(false); setSelectedAppointment(null); }
          setOpenDropdown(null);
        } catch (e) { toast.error(e.message); }
        finally { setCancelingAppointment(false); }
      }
    );
  };

  const handleApplyFilters = (filters) => {
    setCurrentFilters(filters);
    setCurrentPage(1);
    dispatch(fetchAppointments(buildQueryParams(filters, activeTab, 1)));
    setIsFilterOpen(false);
  };

  const handleApplyColumns = (selectedCols, fullOrder) => {
    if (selectedCols.length < 2) { toast.error('Please select at least two fields.'); return; }
    const order = fullOrder || columnOrder;
    setColumnOrder(order);
    try {
      localStorage.setItem('appointmentColumns', JSON.stringify({
        visibleColumns: selectedCols, columnOrder: order, lastUpdated: new Date().toISOString(),
      }));
    } catch {}
    setIsColumnManagerOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">

        <AppointmentsHeader
          activeTab={activeTab}
          onTabChange={handleTabChange}
          hasActiveFilters={!!hasActiveFilters(currentFilters)}
          onOpenFilter={() => setIsFilterOpen(true)}
          onClearFilters={() => { setCurrentFilters({}); setCurrentPage(1); dispatch(fetchAppointments(buildQueryParams({}, activeTab, 1))); }}
          onOpenColumnManager={() => setIsColumnManagerOpen(true)}
          onOpenAddAppointment={() => setIsAddOpen(true)}
          canAddAppointment={canAddAppointment}
        />

        {loading ? (
          <div className="flex justify-center items-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
          </div>
        ) : appointments.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CalendarDays size={48} className="text-gray-400" />
            </div>
            <h3 className="font-semibold mb-2 text-sm">
              No {activeTab === 'upcoming' ? 'upcoming' : 'past'} appointments
            </h3>
            <p className="text-gray-500 mb-6">Organize your schedule by adding appointments here.</p>
            {canAddAppointment && (
              <button
                onClick={() => setIsAddOpen(true)}
                className="text-sm px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 mx-auto"
              >
                <Plus size={18} /> New Appointment
              </button>
            )}
          </div>
        ) : (
          <AppointmentsTable
            appointments={appointments}
            columnOrder={columnOrder}
            pagination={pagination}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
            onRowClick={handleRowClick}
            onReschedule={(appt) => { setAppointmentToReschedule(appt); setIsRescheduleOpen(true); }}
            onCancel={handleCancelAppointment}
            loadingDetails={loadingDetails}
            openDropdown={openDropdown}
            onToggleDropdown={(id) => setOpenDropdown(openDropdown === id ? null : id)}
          />
        )}
      </div>

      {/* Sidebars */}
      <FilterSidebar isOpen={isFilterOpen} onClose={() => setIsFilterOpen(false)} onApply={handleApplyFilters} currentFilters={currentFilters} getCustomers={getCustomers} interviews={interviews} workspaces={workspaces} customers={customers} />
      <AddAppointment isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} mode="schedule" />
      <AppointmentDetailsSidebar appointment={selectedAppointment} isOpen={isDetailsOpen} onClose={() => { setIsDetailsOpen(false); setSelectedAppointment(null); setDetailsError(null); }} onCancel={handleCancelAppointment} onDelete={handleDeleteAppointment} onReschedule={(appt) => { setAppointmentToReschedule(appt); setIsRescheduleOpen(true); setIsDetailsOpen(false); setSelectedAppointment(null); }} isCancelling={cancelingAppointment} error={detailsError} />
      <RescheduleSidebar mode="reschedule" appointment={appointmentToReschedule} isOpen={isRescheduleOpen} onClose={() => setIsRescheduleOpen(false)} onRescheduleSuccess={refreshAppointments} fetchInterviews={fetchInterviews} rescheduleAppointment={rescheduleAppointment} fetchAppointments={fetchAppointments} interviews={interviews} />
      <ColumnManagerSidebar isOpen={isColumnManagerOpen} onClose={() => setIsColumnManagerOpen(false)} onApply={handleApplyColumns} initialColumns={columnOrder} />
    </div>
  );
};

export default UserDashboard;