import { useState, useEffect, useRef } from 'react';
import { Search, UserPlus, X, User, Trash2 } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getCustomers, deleteCustomer } from "../../../redux/apiCalls/CustomerCallApi";
import AddCustomer from '../../Dashboard/AddMenus/ModelsForAdd/AddCustomer';
import RescheduleSidebar from '../../Dashboard/Appointments/RescheduleSidebar';
import { usePermission } from '../../hooks/usePermission';
import Loader from '../../Loader';
import { fetchAllInterviews } from '../../../redux/apiCalls/interviewCallApi';

const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, customerName }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X className="w-5 h-5" />
        </button>
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
            <Trash2 className="w-8 h-8 text-red-600" />
          </div>
        </div>
        <h2 className="text-xl font-semibold text-gray-900 text-center mb-2">
          Delete Customer
        </h2>
        <p className="text-gray-600 text-center mb-6">
          Sure you want to delete {customerName}?
        </p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={onConfirm}
            className="bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700 transition-colors font-medium"
          >
            Delete
          </button>
          <button
            onClick={onClose}
            className="bg-gray-200 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-300 transition-colors font-medium"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

const Customers = () => {
  const [openForm, setOpenForm] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState(null);
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  const [clientData, setClientData] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const customersPerPage = 8;

  const navigate = useNavigate();
  const { customers, loading, deleteLoading,error,dataFetched } = useSelector(state => state.customers);
  const { allInterviews } = useSelector(state => state.interview);
  const dispatch = useDispatch();
console.log(clientData);

const dataFetchedRef = useRef(false);

useEffect(() => {
  if (!dataFetchedRef.current ) {
    dispatch(getCustomers());
    
    dispatch(fetchAllInterviews({ force: true }));
    dataFetchedRef.current = true;
  }
}, [dispatch]);

  const handleOpen = () => setOpenForm('Invite_rec_modal');
  const handleClose = () => setOpenForm(null);

  const handleDeleteClick = (customer) => {
    setCustomerToDelete(customer);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (customerToDelete) {
      const result = await dispatch(deleteCustomer(customerToDelete.id));
      
      if (result?.success) {
        setShowDeleteModal(false);
        setCustomerToDelete(null);
        
        const remainingOnPage = currentCustomers.length - 1;
        if (remainingOnPage === 0 && currentPage > 1) {
          setCurrentPage(currentPage - 1);
        }
      }
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setCustomerToDelete(null);
  };

  const handleCustomerClick = (customerId) => {
    navigate(`/layoutDashboard/setting/clients/${customerId}`);
  };

  const handleScheduleClick = (customer) => {
    console.log(customer);
    
    const customerData = {
      id: customer.id,
      name: customer.name,
      email: customer.email,
      phone: customer.phone || ''
    };
    setClientData(customerData);
    setIsScheduleOpen(true);
  };

  const handleScheduleSuccess = () => {
    console.log('Appointment scheduled successfully');
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page when searching
  };

  // Clear search
  const handleClearSearch = () => {
    setSearchTerm('');
    setCurrentPage(1);
  };

  let customersList = [];
  if (Array.isArray(customers)) {
    customersList = customers;
  } else if (customers && Array.isArray(customers.clients)) {
    customersList = customers.clients;
  }

  // Filter customers based on search term
  const filteredCustomers = customersList.filter(customer => {
    if (!searchTerm) return true;
    
    const searchLower = searchTerm.toLowerCase();
    const name = (customer.name || '').toLowerCase();
    const email = (customer.email || '').toLowerCase();
    const phone = (customer.phone || '').toLowerCase();
    
    return name.includes(searchLower) || 
           email.includes(searchLower) || 
           phone.includes(searchLower);
  });

  const canCreateClient = usePermission("create clients");
  const canDeleteClient = usePermission("destroy clients");

  // Pagination Logic with filtered customers
  const indexOfLastCustomer = currentPage * customersPerPage;
  const indexOfFirstCustomer = indexOfLastCustomer - customersPerPage;
  const currentCustomers = filteredCustomers.slice(indexOfFirstCustomer, indexOfLastCustomer);
  const totalPages = Math.ceil(filteredCustomers.length / customersPerPage);

  const paginate = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const renderPagination = () => {
    if (filteredCustomers.length <= customersPerPage) return null;

    const pageNumbers = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage < maxVisiblePages - 1) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return (
      <div className="flex flex-col sm:flex-row justify-between items-center mt-6 px-4 py-3 bg-white border-t rounded-lg shadow-sm gap-3">
        <div className="text-sm text-gray-600">
          Showing {indexOfFirstCustomer + 1} to {Math.min(indexOfLastCustomer, filteredCustomers.length)} of {filteredCustomers.length} clients
        </div>
        <div className="flex items-center gap-2 flex-wrap justify-center">
          <button
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
            className={`px-3 py-1 text-sm rounded-md ${
              currentPage === 1
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            Previous
          </button>
          
          {startPage > 1 && (
            <>
              <button
                onClick={() => paginate(1)}
                className="px-3 py-1 text-sm rounded-md bg-white text-gray-600 hover:bg-gray-100"
              >
                1
              </button>
              {startPage > 2 && <span className="px-2 text-gray-400">...</span>}
            </>
          )}
          
          {pageNumbers.map(number => (
            <button
              key={number}
              onClick={() => paginate(number)}
              className={`px-3 py-1 text-sm rounded-md ${
                currentPage === number
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              {number}
            </button>
          ))}
          
          {endPage < totalPages && (
            <>
              {endPage < totalPages - 1 && <span className="px-2 text-gray-400">...</span>}
              <button
                onClick={() => paginate(totalPages)}
                className="px-3 py-1 text-sm rounded-md bg-white text-gray-600 hover:bg-gray-100"
              >
                {totalPages}
              </button>
            </>
          )}
          
          <button
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`px-3 py-1 text-sm rounded-md ${
              currentPage === totalPages
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            Next
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header - Fixed */}
      <div className="flex-shrink-0 flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 sm:p-6 bg-white border-b gap-4">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-semibold text-gray-900">Clients</h1>
          <span className="bg-gray-100 text-gray-600 text-sm px-2 py-1 rounded-md">
            {filteredCustomers.length}
          </span>
          {searchTerm && (
            <span className="text-xs text-gray-500">
              (filtered from {customersList.length})
            </span>
          )}
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search by name, email or phone..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="pl-10 pr-10 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
            />
            {searchTerm && (
              <button
                onClick={handleClearSearch}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          {canCreateClient && (
            <button
              className="flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors text-sm font-medium whitespace-nowrap"
              onClick={handleOpen}
            >
              <span>+</span>
              New Client
            </button>
          )}
        </div>
      </div>

      {/* Content Area - Scrollable */}
      <div className="flex-1 overflow-y-auto">
        {loading && (
          <div className="p-6 flex items-center justify-center">
            <Loader />
          </div>
        )}

        {!loading && filteredCustomers.length === 0 && searchTerm ? (
          <div className="flex flex-col items-center justify-center min-h-full gap-6 p-6">
            <div className="relative">
              <div className="bg-gray-100 rounded-lg p-6">
                <Search className="w-12 h-12 text-gray-400" />
              </div>
            </div>
            <div className="text-center">
              <h2 className="text-xl font-semibold mb-2">No results found</h2>
              <p className="text-gray-600 max-w-md">
                No clients match your search "{searchTerm}". Try different keywords.
              </p>
            </div>
            <button
              onClick={handleClearSearch}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Clear Search
            </button>
          </div>
        ) : !loading && customersList.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-full gap-6 p-6">
            <div className="relative">
              <div className="bg-blue-100 rounded-lg p-6">
                <div className="relative">
                  <div className="w-12 h-12 bg-white rounded-lg shadow-sm flex items-center justify-center">
                    <UserPlus className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1">
                    <X className="w-3 h-3 text-white" />
                  </div>
                </div>
              </div>
              <div className="absolute -top-4 -right-4 text-blue-200 text-2xl">✨</div>
              <div className="absolute -bottom-2 -left-4 text-blue-200 text-2xl">✨</div>
            </div>
            <div className="text-center">
              <h2 className="text-xl font-semibold mb-2">No clients added</h2>
              <p className="text-gray-600 max-w-md">
                Add clients to book appointments with them. When clients book using your booking page, they'll be added here automatically.
              </p>
            </div>
            {canCreateClient && (
              <button
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                onClick={handleOpen}
              >
                <span>+</span>
                New Client
              </button>
            )}
          </div>
        ) : (
          !loading && (
            <div className="p-3">
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3 gap-4">
                {currentCustomers.map((customer) => (
                  <div
                    key={customer.id}
                    className="bg-white border border-gray-200 cursor-pointer rounded-lg p-6 transition-all duration-300 ease-in-out hover:shadow-lg hover:border-blue-800 hover:transform hover:scale-[1.02]"
                    onClick={() => handleCustomerClick(customer.id)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                          {customer.avatar ? (
                            <img src={customer.avatar} alt={customer.name} className="w-full h-full rounded-full object-cover" />
                          ) : (
                            <User className="w-6 h-6 text-gray-400" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <h3 className="font-semibold text-gray-900 text-lg truncate  max-w-[150px] ">{customer.name || 'Unknown'}</h3>
                          <p className="text-gray-500 text-sm truncate">{customer.email || 'No email'}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {canDeleteClient && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteClick(customer);
                            }}
                            className="text-gray-400 hover:text-red-600 p-1 hover:bg-red-50 rounded transition-colors"
                           disabled={deleteLoading}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">Guest</span>
                      </div>
                      {canCreateClient && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleScheduleClick(customer);
                          }}
                          className="text-blue-600 text-sm px-3 py-1.5 border border-blue-200 rounded-md hover:bg-blue-50 transition-colors font-medium"
                        >
                          Schedule
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              {renderPagination()}
            </div>
          )
        )}
      </div>

      {openForm === 'Invite_rec_modal' && (
        <AddCustomer
          isOpen={true}
          onClose={handleClose}
        />
      )}

      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        customerName={customerToDelete?.name || 'this customer'}
      />

      <RescheduleSidebar
        mode="schedule"
        clientData={clientData}
        isOpen={isScheduleOpen}
        onClose={() => {
          setIsScheduleOpen(false);
          setClientData(null);
        }}
        fetchInterviews={fetchAllInterviews}
        onScheduleSuccess={handleScheduleSuccess}
        interviews={allInterviews}
      />
    </div>
  );
};

export default Customers;